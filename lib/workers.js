// Dependencies
const { parseJSON } = require('../helpers/utilities');
const data = require('../lib/data');
const url = require('url');
const http = require('http');
const https = require('https');
const { sendSms } = require('../helpers/notifications');

// app object - module scaffolding
const worker = {};

// execution timer per minute
worker.loop = () => {
    setInterval(() => {
        worker.executeAllChecks();
    }, 1000 * 60);
};

// look up all the checks
worker.executeAllChecks = () => {
    // get all the checks in a list array
    data.list('checks', (err, checks) => {
        if (!err && checks && checks.length > 0) {
            checks.forEach(check => {
                // find check data
                data.read('checks', check, (err1, checkData) => {
                    if (!err1 && checkData) {
                        // validate check
                        worker.validateChecksData(parseJSON(checkData));
                    } else {
                        console.log('Error: reading one of the checks data.');
                    };
                });
            });
        } else {
            console.log('Error: check not found to be processed.');
        };
    });
};

// Validate check data individually
worker.validateChecksData = (originalCheckData) => {
    let checkData = originalCheckData;

    if (checkData && checkData.checkId) {
        checkData.state =
            typeof (checkData.state) === 'string'
                && ['up', 'down'].indexOf(checkData.state) > -1
                ? checkData.state
                : 'down';

        checkData.lastChecked =
            typeof (checkData.lastChecked) === 'number'
                && checkData.lastChecked > 0
                ? checkData.lastChecked
                : false;

        // pass to next process to perform check
        worker.performCheckData(checkData);
    } else {
        console.log('Error: check not valid or improper formatted');
    };
};

// perform check
worker.performCheckData = (checkData) => {
    // prepare the initial check outcome
    let checkOutcome = {
        error: false,
        responseCode: false
    };

    // check if outcome is sent or not
    let isOutcomeSent = false;

    // parse the hostname and full url from the checkData
    const parsedUrl = url.parse(`${checkData.protocol}://${checkData.url}`, true);
    const hostname = parsedUrl.hostname;
    const path = parsedUrl.path;

    // create request details
    const requestDetails = {
        protocol: `${checkData.protocol}:`,
        hostname,
        method: checkData.method.toUpperCase(),
        path,
        timeout: checkData.timeoutSeconds * 1000,
    };

    // pass http or https
    const protocolToUse = checkData.protocol === 'http' ? http : https;

    let req = protocolToUse.request(requestDetails, (res) => {
        // look up the status code
        const status = res.statusCode;

        // update the check outcome and pass to the next process
        checkOutcome.responseCode = status;
        if (!isOutcomeSent) {
            worker.processCheckOutcome(checkData, checkOutcome);
            isOutcomeSent = true;
        };

    });

    // error event handling
    req.on('error', err => {
        checkOutcome = {
            error: true,
            value: err
        };

        // update the check outcome and pass to the next process
        if (!isOutcomeSent) {
            worker.processCheckOutcome(checkData, checkOutcome);
            isOutcomeSent = true;
        }

    });

    // timeout event handling
    req.on('timeout', () => {
        checkOutcome = {
            error: true,
            value: 'timeout'
        };

        // update the check outcome and pass to the next process
        if (!isOutcomeSent) {
            worker.processCheckOutcome(checkData, checkOutcome);
            isOutcomeSent = true;
        }

    });

    // sending request
    req.end();
};

// process check outcome and save to db
worker.processCheckOutcome = (checkData, checkOutcome) => {
    // check whether check outcome is 'up' or 'down'
    let state =
        !checkOutcome.error
            && checkOutcome.responseCode
            && checkData.successCodes.indexOf(checkOutcome.responseCode) > -1
            ? 'up'
            : 'down';

    // decide if alert would be executed or not
    let isAlertToBe = checkData.lastChecked && checkData.state === state;

    // update checkData and save to db
    let updatedCheckData = checkData;

    updatedCheckData.state = state;
    updatedCheckData.lastChecked = Date.now();

    data.update('checks', updatedCheckData.checkId, updatedCheckData, (err) => {
        if (!err) {
            // once alert is needed, it is executed
            if (isAlertToBe) {
                // alert user process
                worker.alertUserToStatusChange(updatedCheckData);
            } else {
                console.log('Alert not needed here because of not changing the state.');
            };
        } else {
            console.log('Error: updating not successful.');
        };
    });
};

// alert user when state is changed
worker.alertUserToStatusChange = (updatedCheckData) => {
    let message = `Alert: The check for ${updatedCheckData.method.toUpperCase()} ${updatedCheckData.protocol}://${updatedCheckData.url} is currently ${updatedCheckData.state}`;
    // console.log(message);

    sendSms(updatedCheckData.mobile, message, (err) => {
        if (!err) {
            console.log(`User is alerted to a status change through TwilioSms ${message}`);
        } else {
            console.log('Error: sending sms to one of the user.', err);
        };
    });
};

// Start worker
worker.init = () => {
    // execute all the checks once initialization
    worker.executeAllChecks();

    // continue to execute the checks
    worker.loop();
};

module.exports = worker;
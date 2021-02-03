// dependencies
const https = require('https');
const { twilio } = require('./environments');
// const queryString = require('querystring');

// module scaffolding
const notifications = {};

// send SMS to users mobile through twilio API
notifications.sendSms = (mobile, message, callback) => {
    // validate inputs
    const userMobile =
        typeof (mobile) === 'string'
            && mobile.trim().length === 11
            ? mobile.trim() : false;

    const userMessage =
        typeof (message) === 'string'
            && message.trim().length > 0
            && message.trim().length <= 1600
            ? message.trim() : false;

    if (userMobile && userMessage) {
        // request payload configuration
        const payload = {
            from: twilio.fromMobile,
            to: `+88${userMobile}`,
            body: userMessage
        };

        // stringify payload for sending to twilio
        // const stringifiedPayload = queryString.stringify(payload);
        const stringifiedPayload = JSON.stringify(payload);

        // request options configuration
        const requestOptions = {
            hostname: 'api.twilio.com',
            path: `/2010-04-01/Accounts/${twilio.accountSid}/Messages.json`,
            method: 'POST',
            auth: `${twilio.accountSid}:${twilio.authToken}`,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
        };

        // instanciate request obj
        const req = https.request(requestOptions, (res) => {
            // get the status code
            const status = res.statusCode;

            // execute callback() according to status
            if(status === 200 || status === 201) {
                callback(false);
            } else {
                callback(`Status: ${status}`);
            };
        });

        // error event handling
        req.on('error', err => {
            callback(err);
        });

        // assign payload string with request
        req.write(stringifiedPayload);
        req.end();
    } else {
        callback("Parameters missing or invalid");
    };
};

module.exports = notifications;
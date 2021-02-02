// dependencies
const { hash, parseJSON, randomString } = require('../../helpers/utilities');
const data = require('../../lib/data');
const { user } = require('../../routes');
const { _token } = require('./tokenHandler');
const { maxChecks } = require('../../helpers/environments');

// module scaffolding
const handler = {};

handler.checkHandler = (requestProperties, callback) => {
    const acceptedMethod = ['get', 'post', 'put', 'delete'];

    if (acceptedMethod.indexOf(requestProperties.method) > -1) {
        handler._check[requestProperties.method](requestProperties, callback);
    } else {
        // 405 status code is for not allowing request
        callback(405);
    }
};

handler._check = {};

handler._check.get = (requestProperties, callback) => {
    // id validation checking
    const checkId =
        typeof (requestProperties.queryStringObj.checkId) === 'string'
            && requestProperties.queryStringObj.checkId.trim().length === 16
            ? requestProperties.queryStringObj.checkId : false;

    if (checkId) {
        // find the check
        data.read('checks', checkId, (err, checkData) => {
            if (!err && checkData) {
                const checkObj = parseJSON(checkData);

                // senitize token
                const token = typeof (requestProperties.headersObj.token) === 'string' ? requestProperties.headersObj.token : false;

                // verify token
                _token.verify(token, checkObj.mobile, (tokenIsValid) => {
                    if (tokenIsValid) {
                        callback(200, checkObj);
                    } else {
                        callback(403, {
                            error: 'Authentication failed. Token is not valid'
                        });
                    }
                });
            } else {
                callback(500, {
                    error: "Error from server side."
                });
            };
        });
    } else {
        callback(400, {
            error: "Error from client request. Check ID is not valid."
        });
    };
};

handler._check.post = (requestProperties, callback) => {
    // input validation
    let protocol = typeof (requestProperties.body.protocol) === 'string' && ['http', 'https'].indexOf(requestProperties.body.protocol) > -1 ? requestProperties.body.protocol : false;

    let url = typeof (requestProperties.body.url) === 'string' && requestProperties.body.url.trim().length > 0 ? requestProperties.body.url : false;

    let method = typeof (requestProperties.body.method) === 'string' && ['GET', 'POST', 'PUT', 'DELETE'].indexOf(requestProperties.body.method) > -1 ? requestProperties.body.method : false;

    let successCodes = typeof (requestProperties.body.successCodes) === 'object' && requestProperties.body.successCodes instanceof Array ? requestProperties.body.successCodes : false;

    let timeoutSeconds = typeof (requestProperties.body.timeoutSeconds) === 'number' && requestProperties.body.timeoutSeconds % 1 === 0 && requestProperties.body.timeoutSeconds >= 1 && requestProperties.body.timeoutSeconds <= 5 ? requestProperties.body.timeoutSeconds : false;

    if (protocol && url && method && successCodes && timeoutSeconds) {
        // verify/senitize token
        const token = typeof (requestProperties.headersObj.token) === 'string' ? requestProperties.headersObj.token : false;

        // find user mobile through reading token
        data.read('tokens', token, (err, tokenData) => {
            if (!err && tokenData) {
                let mobile = parseJSON(tokenData).mobile;

                // find userData
                data.read('users', mobile, (err2, userData) => {
                    if (!err2 && userData) {
                        _token.verify(token, mobile, (tokenIsValid) => {
                            if (tokenIsValid) {
                                let userObj = parseJSON(userData);
                                let userChecks =
                                    typeof (userObj.checks) === 'object'
                                        && userObj.checks instanceof Array
                                        ? userObj.checks : [];

                                if (userChecks.length < maxChecks) {
                                    let checkId = randomString(16);
                                    let checkObj = {
                                        checkId,
                                        mobile,
                                        protocol,
                                        url,
                                        method,
                                        successCodes,
                                        timeoutSeconds
                                    };

                                    // store checkObj to db
                                    data.create('checks', checkId, checkObj, (err3) => {
                                        if (!err3) {
                                            // update userObj adding checkId
                                            userObj.checks = userChecks;
                                            userObj.checks.push(checkId);

                                            data.update('users', mobile, userObj, (err4) => {
                                                if (!err4) {
                                                    // return updated data
                                                    callback(200, userObj);
                                                } else {
                                                    callback(500, {
                                                        error: 'Error from server side.'
                                                    });
                                                }
                                            });
                                        } else {
                                            callback(500, {
                                                error: 'Error from server side.'
                                            });
                                        }
                                    });
                                } else {
                                    callback(401, {
                                        error: 'User has already crossed max limit checks.'
                                    });
                                }
                            } else {
                                callback(403, {
                                    error: 'Authentication failed. Token is not valid'
                                });
                            }
                        });
                    } else {
                        callback(403, {
                            error: 'Error from server. User not found.'
                        });
                    }
                })
            } else {
                callback(403, {
                    error: 'Authentication failed.'
                });
            }
        });
    } else {
        callback(400, {
            error: 'Error in client request.'
        });
    }
};

handler._check.put = (requestProperties, callback) => {
    // id validation checking
    const checkId =
        typeof (requestProperties.body.checkId) === 'string'
            && requestProperties.body.checkId.trim().length === 16
            ? requestProperties.body.checkId : false;

    // input validation
    let protocol =
        typeof (requestProperties.body.protocol) === 'string'
            && ['http', 'https'].indexOf(requestProperties.body.protocol) > -1
            ? requestProperties.body.protocol : false;

    let url =
        typeof (requestProperties.body.url) === 'string'
            && requestProperties.body.url.trim().length > 0
            ? requestProperties.body.url : false;

    let method =
        typeof (requestProperties.body.method) === 'string'
            && ['GET', 'POST', 'PUT', 'DELETE'].indexOf(requestProperties.body.method) > -1
            ? requestProperties.body.method : false;

    let successCodes =
        typeof (requestProperties.body.successCodes) === 'object'
            && requestProperties.body.successCodes instanceof Array
            ? requestProperties.body.successCodes : false;

    let timeoutSeconds =
        typeof (requestProperties.body.timeoutSeconds) === 'number'
            && requestProperties.body.timeoutSeconds % 1 === 0
            && requestProperties.body.timeoutSeconds >= 1
            && requestProperties.body.timeoutSeconds <= 5
            ? requestProperties.body.timeoutSeconds : false;

    if (checkId) {
        if (protocol || url || method || successCodes || timeoutSeconds) {
            // verify checkId
            data.read('checks', checkId, (err, checkData) => {
                if (!err && checkData) {
                    const checkObj = parseJSON(checkData);

                    // senitize token
                    const token = typeof (requestProperties.headersObj.token) === 'string' ? requestProperties.headersObj.token : false;

                    // verify token
                    _token.verify(token, checkObj.mobile, (tokenIsValid) => {
                        if (tokenIsValid) {
                            // update checkObj and store to db
                            if (protocol) checkObj.protocol = protocol;
                            if (url) checkObj.url = url;
                            if (method) checkObj.method = method;
                            if (successCodes) checkObj.successCodes = successCodes;
                            if (timeoutSeconds) checkObj.timeoutSeconds = timeoutSeconds;

                            data.update('checks', checkId, checkObj, (err2) => {
                                if(!err2) {
                                    callback(200, {
                                        message: "Check updated successfully."
                                    });
                                } else {
                                    callback(500, {
                                        error: "Error from server side."
                                    });
                                };
                            });
                        } else {
                            callback(403, {
                                error: 'Authentication failed. Token is not valid'
                            });
                        }
                    });
                } else {
                    callback(500, {
                        error: "Error from server. Check ID is not valid."
                    });
                };
            });
        } else {
            callback(400, {
                error: "Error from client request. Must be filled one field at least."
            });
        }
    } else {
        callback(400, {
            error: "Error from client request. Check ID is not valid."
        });
    }
};

handler._check.delete = (requestProperties, callback) => {
    // id validation checking
    const checkId =
        typeof (requestProperties.queryStringObj.checkId) === 'string'
            && requestProperties.queryStringObj.checkId.trim().length === 16
            ? requestProperties.queryStringObj.checkId : false;

    if (checkId) {
        // find the check
        data.read('checks', checkId, (err, checkData) => {
            if (!err && checkData) {
                const checkObj = parseJSON(checkData);

                // senitize token
                const token = typeof (requestProperties.headersObj.token) === 'string' ? requestProperties.headersObj.token : false;

                // verify token
                _token.verify(token, checkObj.mobile, (tokenIsValid) => {
                    if (tokenIsValid) {
                        // delete the check object
                        data.delete('checks', checkId, (err1) => {
                            if(!err1) {
                                // update user data removing checkId
                                data.read('users', checkObj.mobile, (err2, userData) => {
                                    if(!err2 && userData) {
                                        const userObj = parseJSON(userData);
                                        let userChecks =
                                        typeof(userObj.checks) === 'object'
                                        && userObj.checks instanceof Array
                                        ? userObj.checks : [];
                                        
                                        // find the position of checkId in userChecks
                                        let checkIndex = userChecks.indexOf(checkId);
                                        if(checkIndex > -1) {
                                            // remove the specific checkId from userChecks
                                            userChecks.splice(checkIndex, 1);

                                            // update userObj and save to db
                                            userObj.checks = userChecks;
                                            data.update('users', userObj.mobile, userObj, (err3) => {
                                                if(!err3) {
                                                    callback(200, {
                                                        message: "Check deleted and user checks updated successfully."
                                                    });
                                                } else {
                                                    callback(500, {
                                                        error: "Error from server side."
                                                    });
                                                };
                                            });
                                        } else {
                                            callback(500, {
                                                error: "CheckId already removed or does not exists."
                                            });
                                        }
                                    } else {
                                        callback(500, {
                                            error: "Error from server side. User not found."
                                        });
                                    };
                                });
                            } else {
                                callback(500, {
                                    error: "Error from server side."
                                });
                            };
                        });
                    } else {
                        callback(403, {
                            error: 'Authentication failed. Token is not valid'
                        });
                    }
                });
            } else {
                callback(500, {
                    error: "Error from server side. Check not found."
                });
            };
        });
    } else {
        callback(400, {
            error: "Error from client request. Check ID is not valid."
        });
    };
};

module.exports = handler;
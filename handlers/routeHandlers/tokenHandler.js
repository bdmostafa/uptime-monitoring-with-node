// dependencies
const { hash, parseJSON, randomString } = require('../../helpers/utilities');
const data = require('../../lib/data');
// const { user } = require('../../routes');

// module scaffolding
const handler = {};

handler.tokenHandler = (requestProperties, callback) => {
    // console.log(requestProperties);

    const acceptedMethod = ['get', 'post', 'put', 'delete'];
    if (acceptedMethod.indexOf(requestProperties.method) > -1) {
        // callback(200, {
        //     message: 'User ... '
        // });
        handler._token[requestProperties.method](requestProperties, callback);
    } else {
        // 405 status code is for not allowing request
        callback(405);
    }
};

handler._token = {};

handler._token.get = (requestProperties, callback) => {
    // Id validation checking
    const tokenId =
        typeof (requestProperties.queryStringObj.tokenId) === 'string'
            && requestProperties.queryStringObj.tokenId.trim().length === 16
            ? requestProperties.queryStringObj.tokenId : false;

    if (tokenId) {
        // find the user
        data.read('tokens', tokenId, (err, tokenData) => {
            const tokenObj = { ...parseJSON(tokenData) };

            if (!err && tokenObj) {
                callback(200, tokenObj);
            } else {
                callback(404, {
                    error: "Token not found."
                });
            }
        })
    } else {
        callback(404, {
            error: "Token id is not valid."
        });
    }
};

handler._token.post = (requestProperties, callback) => {
    const mobile =
        typeof (requestProperties.body.mobile) === 'string'
            && requestProperties.body.mobile.trim().length === 11
            ? requestProperties.body.mobile : false;

    const password =
        typeof (requestProperties.body.password) === 'string'
            && requestProperties.body.password.trim().length > 0
            ? requestProperties.body.password : false;

    if (mobile && password) {
        data.read('users', mobile, (err, userData) => {
            let hashedPassword = hash(password);
            // console.log(hashedPassword === parseJSON(userData).password)

            if (hashedPassword === parseJSON(userData).password) {
                let tokenId = randomString(16);
                let expires = Date.now() + 60 * 60 * 1000;
                let tokenObj = {
                    mobile,
                    tokenId,
                    expires
                };

                // store tokenObj to db
                data.create('tokens', tokenId, tokenObj, (err2) => {
                    if (!err2) {
                        callback(200, tokenObj);
                    } else {
                        callback(500, {
                            error: "Error in server side"
                        });
                    }
                });
            } else {
                callback(400, {
                    error: "Password is not valid"
                });
            }
        });
    } else {
        callback(400, {
            error: "Error in client request."
        });
    }
};

handler._token.put = (requestProperties, callback) => {
    const tokenId =
        typeof (requestProperties.body.tokenId) === 'string'
            && requestProperties.body.tokenId.trim().length === 16
            ? requestProperties.body.tokenId : false;

    const extend =
        typeof (requestProperties.body.extend) === 'boolean'
            && requestProperties.body.extend === true
            ? true : false;

    if (tokenId && extend) {
        data.read('tokens', tokenId, (err, tokenData) => {
            let tokenObj = parseJSON(tokenData);
            // console.log(err, tokenObj);
            console.log(tokenObj.expires, Date.now())
            if (!err && tokenObj) {
                if (tokenObj.expires > Date.now()) {
                    
                    tokenObj.expires = Date.now() + 60 * 60 * 1000;

                    // store updated token to db
                    data.update('tokens', tokenId, tokenObj, (err2) => {
                        if (!err2) {
                            callback(200);
                        } else {
                            callback(500, {
                                error: "Error from server side"
                            });
                        }
                    });
                } else {
                    callback(400, {
                        error: "Token already expired."
                    });
                }
            } else {
                callback(400, {
                    error: "Token not found"
                });
            }
        });
    } else {
        callback(400, {
            error: "Error in client token request. Invalid token."
        });
    }
};

handler._token.delete = (requestProperties, callback) => {
    // id validation checking
    const tokenId =
        typeof (requestProperties.queryStringObj.tokenId) === 'string'
            && requestProperties.queryStringObj.tokenId.trim().length === 16
            ? requestProperties.queryStringObj.tokenId : false;

    if (tokenId) {
        data.read('tokens', tokenId, (err, tokenData) => {
            if (!err && tokenData) {
                data.delete('tokens', tokenId, (err2) => {
                    if (!err2) {
                        callback(200, {
                            message: "Token has been deleted successfully."
                        });
                    } else {
                        callback(500, {
                            error: "Error from server"
                        });
                    }
                });
            } else {
                callback(500, {
                    error: "Error from server"
                });
            }
        });
    } else {
        callback(400, {
            error: "tokenId is not valid."
        })
    }
};

handler._token.verify = (tokenId, mobile, callback) => {
    data.read('tokens', tokenId, (err, tokenData) => {
        if(!err && tokenData) {
            let tokenObj = parseJSON(tokenData);
            // console.log(mobile, tokenObj.mobile, tokenObj.expires, Date.now());

            if(tokenObj.mobile === mobile && tokenObj.expires > Date.now()) {
                callback(true);
            } else {
                callback(false);
            }
        } else {
            callback(false);
        }
    });
};

module.exports = handler;
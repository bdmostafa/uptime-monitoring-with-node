// dependencies
const { hash, parseJSON } = require('../../helpers/utilities');
const data = require('../../lib/data');
const { user } = require('../../routes');
const { _token } = require('./tokenHandler');

// module scaffolding
const handler = {};

handler.userHandler = (requestProperties, callback) => {
    // console.log(requestProperties);

    const acceptedMethod = ['get', 'post', 'put', 'delete'];
    if (acceptedMethod.indexOf(requestProperties.method) > -1) {
        // callback(200, {
        //     message: 'User ... '
        // });
        handler._user[requestProperties.method](requestProperties, callback);
    } else {
        // 405 status code is for not allowing request
        callback(405);
    }
};

handler._user = {};

handler._user.get = (requestProperties, callback) => {
    // callback(200, { message: "get method is ok" });

    // Phone validation checking
    const mobile =
        typeof (requestProperties.queryStringObj.mobile) === 'string'
            && requestProperties.queryStringObj.mobile.trim().length === 11
            ? requestProperties.queryStringObj.mobile : false;

    if (mobile) {
        // verify token
        const token = typeof (requestProperties.headersObj.token) === 'string' ? requestProperties.headersObj.token : false;

        _token.verify(token, mobile, (tokenId) => {
            // console.log(tokenId);

            if (tokenId) {
                // find the user
                data.read('users', mobile, (err, user) => {
                    const userObj = { ...parseJSON(user) };
                    // const userObj = parseJSON(user); // not valid for reference copy

                    if (!err && user) {
                        delete userObj.password;
                        // console.log(userObj);
                        callback(200, userObj);
                    } else {
                        callback(404, {
                            error: "User not found."
                        });
                    }
                });
            } else {
                callback(403, {
                    error: 'Authentication failed.'
                })
            }
        });
    } else {
        callback(404, {
            error: "User id is not valid."
        });
    }
};

handler._user.post = (requestProperties, callback) => {
    const firstName =
        typeof (requestProperties.body.firstName) === 'string'
            && requestProperties.body.firstName.trim().length > 0
            ? requestProperties.body.firstName : false;

    const lastName =
        typeof (requestProperties.body.lastName) === 'string'
            && requestProperties.body.lastName.trim().length > 0
            ? requestProperties.body.lastName : false;

    const mobile =
        typeof (requestProperties.body.mobile) === 'string'
            && requestProperties.body.mobile.trim().length === 11
            ? requestProperties.body.mobile : false;

    const password =
        typeof (requestProperties.body.password) === 'string'
            && requestProperties.body.password.trim().length > 0
            ? requestProperties.body.password : false;

    const tac =
        typeof (requestProperties.body.tac) === 'boolean'
            ? requestProperties.body.tac : false;

    if (firstName && lastName && password && mobile && tac) {
        // Checking whether the user already exists or not
        data.read('users', mobile, (err) => {
            if (err) {
                let userData = {
                    firstName,
                    lastName,
                    password: hash(password),
                    mobile,
                    tac
                };

                // store the user to db
                data.create('users', mobile, userData, (err2) => {
                    if (!err2) {
                        callback(200, {
                            message: 'User has been created successfully'
                        });
                    } else {
                        callback(500, {
                            error: 'User not created. Error from server side'
                        });
                    }
                });
            } else {
                // 500 status code is for server site problem
                callback(500, {
                    error: 'Error from server side. User already exists.'
                });
            }
        });
    } else {
        // 400 status code is for client request problem
        callback(400, {
            error: "Oops... Error in client request."
        })
    }
};

handler._user.put = (requestProperties, callback) => {
    const firstName =
        typeof (requestProperties.body.firstName) === 'string'
            && requestProperties.body.firstName.trim().length > 0
            ? requestProperties.body.firstName : false;

    const lastName =
        typeof (requestProperties.body.lastName) === 'string'
            && requestProperties.body.lastName.trim().length > 0
            ? requestProperties.body.lastName : false;

    const mobile =
        typeof (requestProperties.body.mobile) === 'string'
            && requestProperties.body.mobile.trim().length === 11
            ? requestProperties.body.mobile : false;

    const password =
        typeof (requestProperties.body.password) === 'string'
            && requestProperties.body.password.trim().length > 0
            ? requestProperties.body.password : false;

    if (mobile) {
        if (firstName || lastName || password) {
            // verify token
            const token = typeof (requestProperties.headersObj.token) === 'string' ? requestProperties.headersObj.token : false;

            _token.verify(token, mobile, (tokenId) => {
                // console.log(tokenId);

                if (tokenId) {
                    // checking the user
                    data.read('users', mobile, (err, userData) => {
                        const user = { ...parseJSON(userData) };
                        // const user = parseJSON(userData); // Not valid because of reference copy

                        if (!err && user) {
                            if (firstName) {
                                user.firstName = firstName;
                            }

                            if (lastName) {
                                user.lastName = lastName;
                            }

                            if (password) {
                                user.password = hash(password);
                            }

                            // update userData to db
                            data.update('users', mobile, user, (err2) => {
                                if (!err2) {
                                    callback(200, {
                                        message: "Update successfully."
                                    })
                                } else {
                                    callback(500, {
                                        error: "Error in updating from server side."
                                    })
                                }
                            })
                        } else {
                            callback(400, {
                                error: "Error in client request."
                            });
                        }
                    });
                } else {
                    callback(403, {
                        error: 'Authentication failed.'
                    })
                }
            });
        } else {
            callback(400, {
                error: "Error in client request."
            });
        }
    } else {
        callback(400, {
            error: "Invalid mobile number."
        });
    }

};

handler._user.delete = (requestProperties, callback) => {
    // Phone validation checking
    const mobile =
        typeof (requestProperties.queryStringObj.mobile) === 'string'
            && requestProperties.queryStringObj.mobile.trim().length === 11
            ? requestProperties.queryStringObj.mobile : false;

    if (mobile) {
        // verify token
        const token = typeof (requestProperties.headersObj.token) === 'string' ? requestProperties.headersObj.token : false;

        _token.verify(token, mobile, (tokenId) => {
            // console.log(tokenId);

            if (tokenId) {
                data.read('users', mobile, (err, userData) => {
                    if (!err && userData) {
                        data.delete('users', mobile, (err2) => {
                            if (!err2) {
                                callback(200, {
                                    message: "User has been deleted successfully."
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
                callback(403, {
                    error: 'Authentication failed.'
                })
            }
        });
    } else {
        callback(400, {
            error: "Mobile is not valid."
        })
    }
};

module.exports = handler;
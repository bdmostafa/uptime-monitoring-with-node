// dependencies
const { hash } = require('../../helpers/utilities');
const data = require('../../lib/data');

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
    callback(200, { message: "get method is ok" })
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
                    error: 'Error from server side'
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

};

handler._user.delete = (requestProperties, callback) => {

};

module.exports = handler;
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
                let tokedId = randomString(16);
                let expires = Date.now() * 60 * 60 * 1000;
                let tokenObj = {
                    mobile,
                    tokedId,
                    expires
                };

                // store tokenObj to db
                data.create('tokens', tokedId, tokenObj, (err2) => {
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

};

handler._token.delete = (requestProperties, callback) => {

};

module.exports = handler;
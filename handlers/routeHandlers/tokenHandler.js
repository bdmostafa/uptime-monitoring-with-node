// dependencies
const { hash, parseJSON } = require('../../helpers/utilities');
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
    
};

handler._token.put = (requestProperties, callback) => {
    
};

handler._token.delete = (requestProperties, callback) => {
    
};

module.exports = handler;
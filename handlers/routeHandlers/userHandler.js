// module scaffolding
const handler = {};

handler.userHandler = (requestProperties, callback) => {
    // console.log(requestProperties);

    const acceptedMethod = ['get', 'post', 'put', 'delete'];
    if(acceptedMethod.indexOf(requestProperties.method) > -1) {
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
    callback(200, {message: "get method is ok"})
};

handler._user.post = (requestProperties, callback) => {
    
};

handler._user.put = (requestProperties, callback) => {
    
};

handler._user.delete = (requestProperties, callback) => {
    
};

module.exports = handler;
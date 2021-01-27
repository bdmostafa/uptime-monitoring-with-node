const handler = {};

handler.notFoundHandler = (requestProperties, callback) => {
    console.log(requestProperties);

    callback(404, {
        message: 'URL not found'
    });
}

module.exports = handler;
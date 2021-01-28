// dependencies
const { StringDecoder } = require("string_decoder");
const url = require('url');
const { notFoundHandler } = require("../handlers/routeHandlers/notFoundHandler");
const routes = require("../routes");

// module scaffolding
const handler = {};

// Handle Request Response
handler.handleReqRes = (req, res) => {
    // handling request
    // getting the url and parsing it
    const parseUrl = url.parse(req.url, true);
    // console.log(parseUrl);
  
    const path = parseUrl.pathname;
    const trimmedPath = path.replace(/^\/+|\/+$/g, '');
    // console.log(trimmedPath);
  
    const method = req.method.toLowerCase();
    const queryStringObj = parseUrl.query;
    const headersObj = req.headers;
    // console.log(headersObj);
    
    const requestProperties = {
        parseUrl,
        path,
        trimmedPath,
        method,
        queryStringObj,
        headersObj
    };

    const decoder = new StringDecoder('utf-8');
    let realData = '';
  
    const requestedHandler = routes[trimmedPath] ? routes[trimmedPath] : notFoundHandler;

    req.on('data', (buffer) => {
      // console.log(buffer)
      realData += decoder.write(buffer);
    });
  
    req.on('end', () => {
      realData += decoder.end();
      // console.log(realData);
      requestedHandler(requestProperties, (statusCode, payload) => {
        statusCode = typeof statusCode === 'number' ? statusCode : 500;
        payload = typeof payload === 'object' ? payload : {};

        const payloadString = JSON.stringify(payload);

        // return final response
        res.writeHead(statusCode);
        res.end(payloadString);
    });
      // response handle
      res.end('Hello Node JS');
    });
};

module.exports = handler;
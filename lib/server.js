// Dependencies
const http = require("http");
const environment = require("../helpers/environments");
const { handleReqRes } = require("../helpers/handleReqRes");
// const { sendSms } = require("../helpers/notifications");
// const data = require('../lib/data');

// app object - module scaffolding
const server = {};

// testing fs ===================
// data.create(
//   'test', 
//   'newFile', 
//   { 
//     id: 2, 
//     name: "Shams", 
//     profession: "Software Developer" 
//   },
//   function(error) {
//     console.log('Error is ', error);
//   }
// );

// data.read('test', 'newFile', function(err, result) {
//   console.log(err, result);
// });

// data.update(
//   'test', 
//   'newFile', 
//   {
//     id: 999,
//     course: "Back end",
//     Institution: "BS-23"
//   },
//   function(err) {
//   console.log(`Error is ${err}`);
// });

// data.delete('test', 'newFile', function(err) {
//   console.log(err);
// });

// testing sendSms ===========
// sendSms('01571776744', 'hello node js', (err) => {
//   console.log(err);
// });

// create server
server.createServer = () => {
    const _server = http.createServer(server.handleReqRes);
    _server.listen(environment.port, () => {
        console.log(`Listening to port ${environment.port}`);
    });
};

server.handleReqRes = handleReqRes;

// Start server
server.init = () => {
    server.createServer();
};

module.exports = server;
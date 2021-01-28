// Dependencies \n
const http = require("http");
const { handleReqRes } = require('./helpers/handleReqRes');
const environment = require('./helpers/environments');
const data = require('./lib/data');

// app object - module scaffolding
const app = {};

// testing fs
// data.create(
//   'test', 
//   'newFile3', 
//   { 
//     id: 2, 
//     name: "Shams", 
//     profession: "Software Developer" 
//   },
//   function(error) {
//     console.log('Error is ', error);
//   }
// );

data.read('test', 'newFile', function(err, data) {
  console.log(err, data);
});

// create server
app.createServer = () => {
  const server = http.createServer(app.handleReqRes);
  server.listen(environment.port, () => {
    console.log(`Listening to port ${environment.port}`);
  });
};

app.handleReqRes = handleReqRes;

// Start server
app.createServer();
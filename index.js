// Dependencies \n
const http = require("http");
const {handleReqRes} = require('./helpers/handleReqRes');
const environment = require('./helpers/environments');

// app object - module scaffolding
const app = {};

// configuration
// app.config = {
//   port: 4200,
// };

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
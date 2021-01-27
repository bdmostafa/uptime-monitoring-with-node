// Dependencies \n
const http = require("http");
const {handleReqRes} = require('./helpers/handleReqRes');

// app object - module scaffolding
const app = {};

// configuration
app.config = {
  port: 4200,
};

// create server
app.createServer = () => {
  const server = http.createServer(app.handleReqRes);
  server.listen(app.config.port, () => {
    console.log(`Listening to port ${app.config.port}`);
  });
};

app.handleReqRes = handleReqRes;

// Start server
app.createServer();
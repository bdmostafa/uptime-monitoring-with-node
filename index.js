// Dependencies \n
const http = require("http");

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

// Handle Request Response
app.handleReqRes = (req, res) => {
  // response handle
  res.end('Hello Node JS');
}

// Start server
app.createServer();
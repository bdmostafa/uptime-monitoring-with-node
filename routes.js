const { notFoundHandler } = require("./handlers/routeHandlers/notFoundHandler");
const { sampleHandler } = require("./handlers/routeHandlers/sampleHandler");
const { tokenHandler } = require("./handlers/routeHandlers/tokenHandler");
const { userHandler } = require("./handlers/routeHandlers/userHandler");

const routes = {
    "sample": sampleHandler,
    "user": userHandler,
    "token": tokenHandler,
    "notFound": notFoundHandler
}

module.exports = routes;
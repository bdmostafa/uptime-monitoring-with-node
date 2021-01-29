const { notFoundHandler } = require("./handlers/routeHandlers/notFoundHandler");
const { sampleHandler } = require("./handlers/routeHandlers/sampleHandler");
const { userHandler } = require("./handlers/routeHandlers/userHandler");

const routes = {
    "sample": sampleHandler,
    "user": userHandler,
    "notFound": notFoundHandler
}

module.exports = routes;
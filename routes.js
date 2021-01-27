const { notFoundHandler } = require("./handlers/routeHandlers/notFoundHandler");
const { sampleHandler } = require("./handlers/routeHandlers/sampleHandler");

const routes = {
    "sample": sampleHandler,
    "notFound": notFoundHandler
}

module.exports = routes;
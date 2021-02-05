// Dependencies
const data = require('../lib/data');

// app object - module scaffolding
const worker = {};

// execution timer per minute
worker.loop = () => {
    setInterval(() => {
        worker.executeAllChecks();
    }, 1000 * 60);
};

// look up all the checks
worker.executeAllChecks = () => {
    // get all the checks in a list array
    // data.list();
};

// Start worker
worker.init = () => {
    // execute all the checks once initialization
    worker.executeAllChecks();

    // continue to execute the checks
    worker.loop();
};

module.exports = worker;
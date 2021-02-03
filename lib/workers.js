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

// find all the checks
worker.executeAllChecks = () => {
    
};

// Start worker
worker.init = () => {
    // execute all the checks once initialization
    worker.executeAllChecks();

    // continue to execute the checks
    worker.loop();
};

module.exports = worker;
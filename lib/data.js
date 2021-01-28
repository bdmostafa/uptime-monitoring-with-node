// dependencies
const fs = require('fs');
const path = require('path');

const lib = {};

// base directory of the data folder
lib.basedir = path.join(__dirname, '/../.data');

// write data to file
lib.create = function(dir, file, data, callback) {
    // open file for writing
    fs.open(`${lib.basedir}/${dir}/${file}.json`, 'wx', function(err, fileDescriptor) {
        if(!err && fileDescriptor) {
            // Convert data to string
            const stringData = JSON.stringify(data);

            // write data to file and close it
            fs.writeFile(fileDescriptor, stringData, function(err2) {
                if(!err2) {
                    fs.close(fileDescriptor, function(err3) {
                        if(!err3) {
                            callback(false);
                        } else {
                            callback('Error closing the new file');
                        }
                    });
                } else {
                    callback('Error writing to new file');
                }
            });
        } else {
            callback('Could not create a new file, it may already exists!');
        }
    });
};

// read data from file
lib.read = function(dir, file, callback) {
    fs.readFile(`${lib.basedir}/${dir}/${file}.json`, 'utf8', function(err, data) {
        callback(err, data);
    });
};

module.exports = lib;
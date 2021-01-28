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

// update data
lib.update = function(dir, file, data, callback) {
    // open file for writing
    fs.open(`${lib.basedir}/${dir}/${file}.json`, 'r+', function(err, fileDescriptor) {
        if(!err && fileDescriptor) {
            const stringData = JSON.stringify(data);

            // truncate or empty the file
            fs.ftruncate(fileDescriptor, function(err2) {
                if(!err2) {
                    // write to the file and close it
                    fs.writeFile(fileDescriptor, stringData, function(err3) {
                        if(!err3) {
                            fs.close(fileDescriptor, function(err4) {
                                if(!err4) {
                                    callback(false);
                                } else {
                                    callback(`${err4} Error in closing file.`)
                                }
                            })
                        } else {
                            callback(`${err3} Error in writing to the file`)
                        }
                    })
                } else {
                    callback(`${err2} Error in truncating file!`)
                }
            });
        } else {
            callback(`${err} Error in updating. File may not be found!`);
        }
    });
};

module.exports = lib;
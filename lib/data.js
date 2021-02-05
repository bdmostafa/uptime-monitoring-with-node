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
                            callback(`${err3} Error closing the new file`);
                        }
                    });
                } else {
                    callback(`${err2} Error writing to new file`);
                }
            });
        } else {
            callback(`${err} Could not create a new file, it may already exists!`);
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

// delete the existing file
lib.delete = function(dir, file, callback) {
    // unlink file
    fs.unlink(`${lib.basedir}/${dir}/${file}.json`, function(err) {
        if(!err) {
            callback(false);
        } else {
            callback(`${err} Error in deleting.`);
        }
    })
};

// read list of the files in a directory
lib.list = function(dir, callback) {
    fs.readdir(`${lib.basedir}/${dir}`, function(err, fileNames) {
        if(!err && fileNames && fileNames.length > 0) {
            let trimmedFileNames = [];
            fileNames.forEach(fileName => {
                trimmedFileNames.push(fileName.replace('.json', ''));
            });
            callback(false, trimmedFileNames);
        } else {
           callback('Error in reading directory or empty file');
        };
    });
};

module.exports = lib;
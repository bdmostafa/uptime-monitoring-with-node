// dependencies
const crypto = require('crypto');
const environment = require('./environments');

// module scaffolding
const utilities = {};

// parse json string to object
utilities.parseJSON = (jsonString) => {
    let output;

    try {
        output = JSON.parse(jsonString);
    } catch {
        output = {};
    }

    return output;
};

// hashing the string
utilities.hash = (string) => {
    if (typeof string === 'string' && string.length > 0) {
        const hash = crypto
            .createHmac('sha256', environment.secretKey)
            .update(string)
            .digest('hex');
        return hash;
    }
    return false;
};

// Create random string
utilities.randomString = (strLength) => {
    let length = strLength;
    length = typeof(strLength) === 'number' && strLength > 0 ? strLength : false;

    if (length) {
        const possibleChars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
        let charOutout = '';
        for(let i = 0; i < length; i++) {
            const randomChar = possibleChars.charAt(Math.floor(Math.random() * possibleChars.length));
            charOutout += randomChar;
        }
        return charOutout;
    }
    return false;
};

// module export
module.exports = utilities;
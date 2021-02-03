// dependencies

// module scaffolding
const environments = {};

environments.staging = {
    port: 4200,
    envName: 'staging',
    secretKey: 'kvhf5454fdgg',
    maxChecks: 5,
    twilio: {
        fromMobile: '+15005550237',
        accountSid: 'ACec45e98ceac2c53724e339a23b44312b',
        authToken: 'fbfcbefd839cc1bd23a685aa00f4da16'
    }
};

environments.production = {
    port: 5000,
    envName: 'production',
    secretKey: 'gdg88t1554gfg',
    maxChecks: 5,
    twilio: {
        fromMobile: '+15005550237',
        accountSid: 'ACec45e98ceac2c53724e339a23b44312b',
        authToken: 'fbfcbefd839cc1bd23a685aa00f4da16'
    }
};

// determine which environment was passed
const currentEnvironment = typeof process.env.NODE_ENV === 'string' ? process.env.NODE_ENV : 'staging';

// export corresponding environment object
const environmentToExport =
    typeof environments[currentEnvironment] === 'object'
        ? environments[currentEnvironment]
        : environments.staging;

module.exports = environmentToExport;
const AWS = require('aws-sdk');
const configs = require('../Config');

const s3 = new AWS.S3({
    credentials: {
        accessKeyId: configs.WASABI_ACCESS_KEY,
        secretAccessKey: configs.WASABI_SECRET_KEY,
    },
    endpoint: configs.endpoint,
    region: configs.region,
    signatureVersion: "v4",
})

module.exports = s3;
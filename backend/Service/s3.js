const AWS = require('aws-sdk');

const s3 = new AWS.S3({
    accessKeyId: process.env.WASABI_ACCESS_KEY,
    secretAccessKey: process.env.WASABI_SECRET_KEY,
    endpoint: "https://s3.us-west-2.wasabisys.com",
    region: "us-west-2",
    signatureVersion: "v4",
})

module.exports = s3;
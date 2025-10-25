const fs = require("fs");
const s3 = require("./s3");

const documentService = {
    uploadDocument: async (document, id) => {
        try {
            const fileExtension = document.mimetype.split("/")[1];
            const params = {
                Bucket: "beornnotes",
                Key: `${String(id)}.${fileExtension}`,
                Body: document.buffer,
                ContentType: document.mimetype,
                ACL: "public-read"
            }

            const result = await s3.upload(params).promise();
            console.log("Uploaded Successfully: ", result.Location);
            return result.Location;
        } catch (error) {
            console.log("uploadDocumentError: ", error);
        }
    },

    updateDocument: async (document, key) => {
        try {
            const params = {
                Bucket: "beornnotes",
                Key: String(key),
                Body: document.buffer,
                ContentType: document.mimetype,
                ACL: "public-read"
            }

            const result = await s3.upload(params).promise();
            console.log("Uploaded Successfully: ", result.Location);
        } catch (error) {
            console.log("updateDocumentError: ", error)
        }
    },

    getSignedUrl: async (key) => {
        try {
            const signedUrl = s3.getSignedUrl("getObject", {
                Bucket: "beornnotes",
                Key: key,
                Expires: 60 * 10,
            })
            return signedUrl;
        } catch (error) {
            console.log("getDocumentError: ", error);
        }
    }
}

module.exports = documentService;
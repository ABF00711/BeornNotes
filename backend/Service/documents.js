const fs = require("fs");
const s3 = require("./s3");

const documentService = {
    uploadDocument: async (document, id) => {
        try {
            const fileContent = fs.readFileSync(document);

            const params = {
                Bucket: "beornnotes",
                Key: id,
                Body: fileContent,
                ContentType: "application/pdf"
            }

            const result = await s3.upload(params).promise();
            console.log("Uploaded Successfully: ", result.Location);
            return result.Location;
        } catch (error) {
            console.log("uploadDocumentError: ", error);
        }
    },

    // getDocument: async (id) => {
    //     try {
    //         const params = {
    //             Bucket: "beornnotes",
    //             Key: id
    //         };

    //         const data = await s3.getObject(params).promise();

    //         console.log('File retrieved successfully!');
    //         console.log("File content: ", data.Body.toString(utf-8));
    //     } catch (error) {
    //         console.log("getDocumentError: ", error);
    //     }
    // }
}

module.exports = documentService;
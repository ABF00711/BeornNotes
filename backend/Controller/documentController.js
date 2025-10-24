const mysqlDA = require("../Data_Access");
const documentService = require("../Service/documents");

const documentController = {
    getDocuments: async(req, res) => {
        try {
            const {customerId} = req.body;
            const formData = await mysqlDA.getOneData("forms", {TableView: "documents"})
            const sql = `${formData.Select} Where customer = ${customerId} Order by ${formData.OrderBy}`;
            const documents = await mysqlDA.excuteSql(sql);
            res.json({message: "getDocuments success", documents});
        } catch (error) {
            console.log("getDocumentsError: ", error);
            res.json({message: "getDocuments failed"});
        }
    },

    createDocument: async(req, res) => {
        try {
            const document = req.file;
            const documentInfo = JSON.parse(req.body.fileInfo);

            const id = await mysqlDA.create("documents", documentInfo);

            const documentUrl = await documentService.uploadDocument(document, id);
            documentInfo.id = id;
            documentInfo.documentUrl = documentUrl;

            await mysqlDA.update("documents", documentInfo);

            res.json({message: "createDocument success", document: documentInfo});
        } catch (error) {
            console.log("createDocumentError: ", error);
        }  
    },

    updateDocument: async (req, res) => {
        try {
            
        } catch (error) {
            console.log("updateDocumentError: ", error);
        }
    },

    deleteDocument: async (req, res) => {
        try {
            
        } catch (error) {
            console.log("deleteDocumentError: ", error);
        }
    },
}

module.exports = documentController;
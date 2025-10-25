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
            const document = req.file;
            const documentInfo = JSON.parse(req.body.fileInfo);
            await mysqlDA.update("documents", documentInfo);

            console.log("documentUrl: ", documentInfo.documentUrl);
            const key = documentInfo.documentUrl.split("com/")[1];

            await documentService.updateDocument(document, key);

            res.json({message: "updateDocument success"});
        } catch (error) {
            console.log("updateDocumentError: ", error);
        }
    },

    deleteDocuments: async (req, res) => {
        try {
            const {selectedRows} = req.body;

            const ids = selectedRows.map((row) => row.id);
            const keys = selectedRows.map((row) => {return {Key: row.documentUrl?.split("com/")[1]}});

            const sql = `Delete From documents Where id In (${ids.join(", ")})`;
            await mysqlDA.excuteSql(sql);
            
            const result = documentService.deleteDocuments(keys);
            if(result){
                res.json({ message: "deleteDocuments success" });
            } else {
                res.json({ message: "deleteDocuments failed" });
            }
        } catch (error) {
            console.log("deleteDocumentError: ", error);
        }
    },

    getUrl: async (req, res) => {
        try {
            const {key} = req.body;
            const signedUrl = await documentService.getSignedUrl(key);
            res.json({message: "getUrl success", signedUrl});
        } catch (error) {
            console.log("getUrlError: ", error);
        }
    }
}

module.exports = documentController;
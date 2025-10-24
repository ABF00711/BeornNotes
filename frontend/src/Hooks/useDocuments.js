const { useContext } = require("react");
const { MyContext } = require("../Context");

function useDocuments () {
    const {documents, setDocuments} = useContext(MyContext);

    const getDocuments = (customer) => {
        try {
            
        } catch (error) {
            console.log("getDocumentsError: ", error);
        }
    }
    
    const createDocument = (customer) => {
        try {
            
        } catch (error) {
            console.log("createDocumentError: ", error);
        }
    }
    const updateDocument = (customer) => {
        try {
            
        } catch (error) {
            console.log("updateDocumentError: ", error);
        }
    }
    const deleteDocument = (customer) => {
        try {
            
        } catch (error) {
            console.log("deleteDocumentError: ", error);
        }
    }

    return ({
        documents,
        getDocuments,
        createDocument,
        updateDocument,
        deleteDocument
    });
}

export default useDocuments;
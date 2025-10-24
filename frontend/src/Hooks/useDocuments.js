import services from "../Services";

const { useContext } = require("react");
const { MyContext } = require("../Context");

function useDocuments () {
    const {documents, setDocuments} = useContext(MyContext);

    const getDocuments = async (customer) => {
        try {
            const res = await services.getDocuments(customer);
            if(res.message == "getDocuments success"){
                setDocuments(res.documents);
                return;
            }
        } catch (error) {
            console.log("getDocumentsError: ", error);
        }
    }
    
    const createDocument = async (document, documentInfo) => {
        try {
            const res = await services.createDocument(document, documentInfo);
            if(res.message == "createDocument success"){
                setDocuments(prev => [...prev, res.document]);
                return;
            }
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
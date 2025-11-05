import { toast } from "react-toastify";
import services from "../Services";

const { useContext } = require("react");
const { MyContext } = require("../Context");

function useDocuments() {
    const { documents, setDocuments } = useContext(MyContext);

    const getDocuments = async (customer) => {
        try {
            const res = await services.getDocuments(customer);
            if (res.message == "getDocuments success") {
                setDocuments(res.documents);
                return;
            }
        } catch (error) {
            console.log("getDocumentsError: ", error);
        }
    }

    const getOneDocument = async (documentInfo) => {
        try {
            const key = documentInfo.documentUrl.split("com/")[1];
            const res = await services.getOneDocument(key);
            if (res.message == "getUrl success") {
                return res.signedUrl;
            }
        } catch (error) {
            console.log("getOneDocumentError: ", error);
        }
    }

    const createDocument = async (document, documentInfo) => {
        try {
            const formData = new FormData();
            formData.append("file", document);
            formData.append("fileInfo", JSON.stringify(documentInfo));
            const res = await services.createDocument(formData);
            if (res.message == "createDocument success") {
                setDocuments(documents => [...documents, res.document]);
                toast(res.message);
                return;
            }
        } catch (error) {
            console.log("createDocumentError: ", error);
        }
    }
    const updateDocument = async (documentFile, documentInfo) => {
        try {
            const formData = new FormData();
            formData.append("file", documentFile);
            formData.append("fileInfo", JSON.stringify(documentInfo));
            const res = await services.updateDocument(formData);
            if (res.message == "updateDocument success") {
                setDocuments(documents.map(document =>
                    document.id === documentInfo.id ? { ...document, name: documentInfo.name, description: documentInfo.description } : document
                ));
                toast.success("Document updated successfully!");
            }
        } catch (error) {
            console.log("updateDocumentError: ", error);
        }
    }
    const deleteDocuments = async (selectedRows) => {
        try {
            const res = await services.deleteDocuments(selectedRows);
            if (res.message == "deleteDocuments success") {
                let _documents = [...documents];
                selectedRows.map((selectedRow) => {
                    _documents = _documents.filter((document) => document.id !== selectedRow.id);
                })
                setDocuments(_documents);
                toast.success("Deleted documents successfully");
            }
        } catch (error) {
            console.log("deleteDocumentError: ", error);
        }
    }

    const openDocument = async (row) => {
        const signedUrl = await getOneDocument(row);
        window.open(signedUrl);
    }

    return ({
        documents,
        getDocuments,
        createDocument,
        updateDocument,
        deleteDocuments,
        getOneDocument,
        openDocument
    });
}

export default useDocuments;
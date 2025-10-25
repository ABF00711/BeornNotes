import "./style.css";
import { Tabs, TabItem } from 'smart-webcomponents-react/tabs';
import 'smart-webcomponents-react/source/styles/smart.default.css';
import { useEffect, useRef } from "react";
import useDynamicData from "../../Hooks/useDynamicData";
import SmartGrid from "../SmartGrid";
import AddDocument from "./AddDocument";
import useDocuments from "../../Hooks/useDocuments";
import DocumentGrid from "./DocumentGrid";

function Documents({ documentData, customer }) {
    const {documents, getDocuments} = useDocuments();
    const openUpdateModal = (data) => {
        try {
            console.log("PDFData: ", data);
        } catch (error) {
            console.log("openUpdateModal: ", error);
        }
    }

    useEffect(() => {
        getDocuments(customer);
    }, [])

    return (
        <div className="documents">
            <div className="documents-main">
                <Tabs style={{ width: "100%" }}>
                    <TabItem label={`Document(${documents?.length})`}>
                        <div className="table-header">
                            <AddDocument formName={"Documents"} documentData={documentData} customer = {customer} />
                            <button type="button" className="btn btn-dangerous">
                                <span className="btn-icon">🗑</span>
                                <span className="btn-label">Delete</span>
                            </button>
                        </div>
                        <DocumentGrid customer = {customer} documentData = {documentData} documents={documents} />
                    </TabItem>
                    <TabItem label="Address"></TabItem>
                </Tabs>
            </div>
        </div>
    );
}

export default Documents;
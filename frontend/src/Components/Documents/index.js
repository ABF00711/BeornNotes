import "./style.css";
import { Tabs, TabItem } from 'smart-webcomponents-react/tabs';
import 'smart-webcomponents-react/source/styles/smart.default.css';
import { useEffect, useRef } from "react";
import useDynamicData from "../../Hooks/useDynamicData";
import SmartGrid from "../SmartGrid";
import AddDocument from "./AddDocument";
import useDocuments from "../../Hooks/useDocuments";
import DocumentGrid from "./DocumentGrid";
import DeleteDocument from "./DeleteDocument";

function Documents({ documentData, customer }) {
    const gridRef = useRef(null);
    const {documents, getDocuments} = useDocuments();

    useEffect(() => {
        getDocuments(customer);
    }, [])

    return (
        <div className="documents">
            <div className="documents-main">
                <Tabs className="documents-tabs">
                    <TabItem label={`Document(${documents?.length})`}>
                        <div className="table-header">
                            <AddDocument formName={"Documents"} documentData={documentData} customer = {customer} />
                            <DeleteDocument gridRef = {gridRef} />
                        </div>
                        <DocumentGrid gridRef = {gridRef} customer = {customer} documentData = {documentData} documents={documents} />
                    </TabItem>
                    <TabItem label="Address"></TabItem>
                </Tabs>
            </div>
        </div>
    );
}

export default Documents;
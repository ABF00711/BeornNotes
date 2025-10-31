import "./style.css";
import { Tabs, TabItem } from 'smart-webcomponents-react/tabs';
import 'smart-webcomponents-react/source/styles/smart.default.css';
import { useEffect, useMemo, useRef, useState } from "react";
import SmartGrid from "../SmartGrid";
import AddDocument from "./AddDocument";
import useDocuments from "../../Hooks/useDocuments";
import DeleteDocument from "./DeleteDocument";
import { getDocumentColumns, handleCellClick } from "./utils/documentUtils";
import _ from "lodash";
import DocumentModal from "./DocumentModal";
import SmartLayouts from "../Layouts";
import SmartSearchPattern from "../SearchPattern";

function Documents({ documentData, customer }) {
    const [isOpen, setIsOpen] = useState(false);
    const [updateData, setUpdateData] = useState(null);
    const gridRef = useRef(null);
    const { documents, getDocuments, getOneDocument } = useDocuments();

    const onUpdate = (data) => {
        setIsOpen(true);
        setUpdateData(data);
    }

    const handleCellClick = async (event) => {
        try {
            const { cell, dataField } = event.detail;
            if (dataField == "name") {
                const unProxiedData = _.cloneDeep(cell);
                const row = unProxiedData.row.data;
                const url = await getOneDocument(row);
                if (url) {
                    window.open(url);
                }
            }
        } catch (error) {
            console.log("handleCellClick: ", error);
        }
    }

    const columns = useMemo(() => {
        return getDocumentColumns(documentData, onUpdate);
    }, [])

    useEffect(() => {
        getDocuments(customer);
    }, [])

    useEffect(() => {
        console.log("updateData: ", updateData);
    }, [updateData])

    return (
        <div className="documents">
            <div className="documents-main">
                <Tabs className="documents-tabs">
                    <TabItem label={`Document(${documents?.length})`}>
                        <div className="table-header">
                            <AddDocument formName={"Documents"} documentData={documentData} customer={customer} />
                            <DeleteDocument gridRef={gridRef} />
                            <SmartLayouts formName={"Documents"} gridRef={gridRef} />
                            <SmartSearchPattern formName={"Documents"} gridRef={gridRef} />
                        </div>
                        <div className="table-body">
                            <SmartGrid
                                formName={"Documents"}
                                gridRef={gridRef}
                                customData={documents}
                                columns={columns}
                                cellClick={handleCellClick}
                            />
                        </div>
                    </TabItem>
                    <TabItem label="Address"></TabItem>
                </Tabs>
            </div>
            <DocumentModal
                isOpen={isOpen}
                setIsOpen={setIsOpen}
                role={"update"}
                initData={updateData}
                documentData={documentData}
                customer={customer}
            />
        </div>
    );
}

export default Documents;
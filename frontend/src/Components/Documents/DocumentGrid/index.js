import 'smart-webcomponents-react/source/styles/smart.default.css';
import { Grid } from 'smart-webcomponents-react/grid';
import React, { useState, useRef, useEffect } from "react";
import { gridState } from '../../SmartGrid/gridState';
import _ from "lodash"
import DocumentModal from '../DocumentModal';
import useDocuments from '../../../Hooks/useDocuments';
import "./style.css";

function DocumentGrid({ gridRef, customer, documentData, documents }) {
    const [isOpen, setIsOpen] = useState(false);
    const [initData, setInitData] = useState(null);
    const { getOneDocument } = useDocuments();
    const dataSourceSettings = {
        dataFields: [
            'id: number',
            'name: string',
            'description: string',
            'customer: string',
            'documentUrl: string'
        ]
    }

    const onUpdate = (data) => {
        setInitData(data);
        setIsOpen(true);
    }

    const handleCellClick = async(event) => {
        try {
            const {cell, dataField} = event.detail;
            if(dataField == "name"){
                const unProxiedData = _.cloneDeep(cell);
                const row = unProxiedData.row.data;
                const url = await getOneDocument(row);
                if(url){
                    window.open(url);
                }
            }
        } catch (error) {
            console.log("handleCellClick: ", error);
        }
    };

    const columns = [
        {
            label: "Edit",
            dataField: "edit",
            icon: 'fa-pencil',
            showIcon: true,
            formatFunction(settings) {
                const button = document.createElement("button");
                button.className = "btn btn-primary";
                button.innerHTML = "✎";

                button.addEventListener("click", () => {
                    const unProxiedData = _.cloneDeep(settings.row.data);
                    onUpdate(unProxiedData)
                });

                // Assign the actual DOM node
                settings.cell.element.innerHTML = ""; // Clear existing content
                settings.cell.element.style.pointerEvents = 'none';
                button.style.pointerEvents = 'auto';
                settings.cell.element.appendChild(button);
            },
            summary: ['count'],
            allowReorder: false,
        },
        {
            label: 'Name',
            dataField: 'name',
            sortOrder: 'asc',
        },
        {
            label: 'Description',
            dataField: 'description',
        }
    ]
    return (
        <>
            <Grid
                id="documents"
                ref={gridRef}
                dataSource={documents}
                dataSourceSettings={dataSourceSettings}
                behavior={gridState.behavior}
                sorting={gridState.sorting}
                filtering={gridState.filtering}
                selection={gridState.selection}
                header={gridState.header}
                stateSettings={gridState.stateSettings}
                summaryRow={{
                    visible: true
                }}
                columns={columns}
                onCellClick={(event) => {handleCellClick(event)}}
                className='documentGrid'
            >
            </Grid>
            <DocumentModal
                isOpen={isOpen}
                setIsOpen={setIsOpen}
                role={"update"}
                initData={initData}
                documentData={documentData}
                customer={customer}
            />
        </>
    );
}

export default DocumentGrid;
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
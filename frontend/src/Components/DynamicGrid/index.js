import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import "./style.css";
import { AgGridReact } from 'ag-grid-react';
import { themeAlpine } from "ag-grid-community";

function DynamicGrid() {

    const gridRef = useRef();
    const [rowData, setRowData] = useState([]);
    const [columnDefs, setColumnDefs] = useState([
        { field: 'make', sortable: true, filter: true },
        { field: 'model', sortable: true, filter: true },
        { field: 'price', sortable: true, filter: true },
    ]);

    // Example data fetch or generation
    useEffect(() => {
        const data = [
            { make: 'Toyota', model: 'Celica', price: 35000 },
            { make: 'Ford', model: 'Mondeo', price: 32000 },
            { make: 'Porsche', model: 'Boxster', price: 72000 },
        ];
        setRowData(data);
    }, []);

    const onGridReady = useCallback((params) => {
        // You can access the grid API here if needed
        // params.api.sizeColumnsToFit();
    }, []);

    return (
        <div className="dynamic-grid">
            <div className="table">
                <AgGridReact
                    ref={gridRef}
                    rowData={rowData}
                    columnDefs={columnDefs}
                    onGridReady={onGridReady}
                    theme={themeAlpine}
                />
            </div>
        </div>
    );
}

export default DynamicGrid;
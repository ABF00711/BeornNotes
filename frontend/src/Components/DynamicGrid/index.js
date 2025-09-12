import React, { useCallback, useEffect, useRef, useState } from "react";
import "./style.css";
import { AgGridReact } from 'ag-grid-react';
import { themeAlpine } from "ag-grid-community";
import useDynamicData from "../../Hooks/useDynamicData";
import useSearchConfig from "../../Hooks/useSearchConfig";
import ColumnVisible from "./ColumnVisible";
import Add from "./Add";
import Update from "./Update";

function DynamicGrid({ tableView }) {
    const { dynamicData, getDynamicData, getColumDefs } = useDynamicData();
    const { searchConfig, getSearchConfigData } = useSearchConfig();
    const gridRef = useRef();
    const [columnDefs, setColumnDefs] = useState([]);
    const [isOpenUpdate, setIsOpenUpdate] = useState(false);
    const [updateData, setUpdateData] = useState(null);

    const openUpdateModal = (params) => {
        setUpdateData(params.data);
        setIsOpenUpdate(!isOpenUpdate);
    }

    const saveFilterInfo = (params) => {
        console.log(params.api.getFilterModel())
    }

    const restoreFilters = () => {
        const savedFilters = JSON.parse(localStorage.getItem("filters") || "{}");
        gridRef.current.api.setFilterModel(savedFilters);
        gridRef.current.api.onFilterChanged();
    };

    const onGridReady = useCallback((params) => {

    }, []);

    useEffect(() => {
        setColumnDefs(getColumDefs(tableView));
    }, [searchConfig])

    useEffect(() => {
        getSearchConfigData();
        getDynamicData(tableView);
    }, [])

    return (
        <div className="dynamic-grid">
            <div className="grid-toolbar">
                <Add table_name={tableView} />
                <div className="toolbar-right">
                    <button type="button" className="btn btn-outline">
                        <span className="btn-icon">🗂️</span>
                        <span className="btn-label">Layouts</span>
                    </button>
                    <button type="button" className="btn btn-outline">
                        <span className="btn-icon">🔍</span>
                        <span className="btn-label">Filters</span>
                    </button>
                    <ColumnVisible columnDefs={columnDefs} setColumnDefs={setColumnDefs} />
                    <div className="total-count">
                        <span className="total-label">Total:</span>
                        <span className="total-value">{Array.isArray(dynamicData) ? dynamicData.length : 0}</span>
                    </div>
                </div>
            </div>
            <div className="table">
                <AgGridReact
                    ref={gridRef}
                    rowData={dynamicData}
                    columnDefs={columnDefs}
                    onGridReady={onGridReady}
                    theme={themeAlpine}
                    onRowDoubleClicked={openUpdateModal}
                    onFilterChanged={saveFilterInfo}
                />
            </div>
            <Update tablename={tableView} isOpen = {isOpenUpdate} setIsOpen = {setIsOpenUpdate} updateData = {updateData} />
        </div>
    );
}

export default DynamicGrid;
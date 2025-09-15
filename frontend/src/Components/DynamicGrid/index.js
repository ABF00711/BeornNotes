import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import "./style.css";
import { AgGridReact } from 'ag-grid-react';
import { themeAlpine } from "ag-grid-community";
import useDynamicData from "../../Hooks/useDynamicData";
import useSearchConfig from "../../Hooks/useSearchConfig";
import ColumnVisible from "./ColumnVisible";
import Add from "./Add";
import Update from "./Update";
import Delete from "./Delete";
import Searchpatterns from "./Searchpatterns";
import useSearchpatterns from "../../Hooks/useFilters";
import Layouts from "./Layouts";

function DynamicGrid({ tableView }) {
    const { dynamicData, getDynamicData, getColumDefs } = useDynamicData();
    const { searchConfig, getSearchConfigData } = useSearchConfig();
    const {searchpatterns, getSearchpatterns} = useSearchpatterns();
    const gridRef = useRef();
    const [columnDefs, setColumnDefs] = useState([]);
    const [isOpenUpdate, setIsOpenUpdate] = useState(false);
    const [updateData, setUpdateData] = useState(null);
    const rowSelection = useMemo(() => {
        return {
            mode: "multiRow",
            groupSelects: "descendants",
            headerCheckbox: true,
        };
    }, []);

    const openUpdateModal = (params) => {
        setUpdateData(params.data);
        setIsOpenUpdate(!isOpenUpdate);
    }

    const saveFilterInfo = (params) => {
        try {
            const filterInfo = params.api.getFilterModel();
            const searchpatterns = JSON.parse(localStorage.getItem("searchpatterns") || "{}");
            searchpatterns.filters = filterInfo;
            localStorage.setItem("searchpatterns", JSON.stringify(searchpatterns));
        } catch (error) {
            console.log("saveFilterInfoError: ", error);
        }
    }

    const onSortChanged = useCallback(() => {
        if (gridRef.current) {
            const currentColumnState = gridRef.current.api.getColumnState();
            const sortState = [];
            currentColumnState.map((column) => {
                sortState.push({ colId: column.colId, sort: column.sort });
            })
            const searchpatterns = JSON.parse(localStorage.getItem("searchpatterns") || "{}");
            searchpatterns.sorts = sortState;
            localStorage.setItem("searchpatterns", JSON.stringify(searchpatterns));
        }
    }, []);


    const restoreSearchpatterns = () => {
        if (!gridRef.current?.api) return;
        try {
            let savedSearchpattern = JSON.parse(localStorage.getItem("searchpatterns") || null);
            if(savedSearchpattern == null){
                const defaultPattern = searchpatterns.find(pattern => pattern.name == "Default");
                const parsedPattern = JSON.parse(defaultPattern.data);
                if(parsedPattern){
                    savedSearchpattern = {
                        filters: parsedPattern.filters || {},
                        sorts: parsedPattern.sorts || {}
                    }
                }
            }
            let savedLayout = JSON.parse(localStorage.getItem("layout") || null);
            if(savedLayout == null){
                
            }
            savedLayout = gridRef.current.api.getColumnState();
            savedLayout.map((column) => {
                const savedSortIndex = savedSearchpattern.sorts.findIndex(item => item.colId === column.colId);
                if (savedSortIndex !== -1) {
                    column.sort = savedSearchpattern.sorts[savedSortIndex].sort;
                }
            })
            gridRef.current.api.applyColumnState({
                state: savedLayout,
                applyOrder: true, 
            });
            gridRef.current.api.setFilterModel(savedSearchpattern.filters);
        } catch (error) {
            console.log("restoreSearchpatterns error:", error);
        }
    };

    const onColumnChanged = () => {
        const currentGrid = gridRef.current.api.getColumnState();
        localStorage.setItem("layout", JSON.stringify(currentGrid));
    }

    const onGridReady = useCallback((params) => {
        
    }, []);

    useEffect(() => {
        setColumnDefs(getColumDefs(tableView));
    }, [searchConfig])
    
    useEffect(() => {
        if (dynamicData && dynamicData.length > 0 && gridRef.current?.api) {
            setTimeout(() => {
                restoreSearchpatterns();
            }, 100);
        }
    }, [dynamicData, columnDefs])

    useEffect(() => {
        getSearchConfigData();
        getSearchpatterns(tableView)
        getDynamicData(tableView);
    }, [])


    return (
        <div className="dynamic-grid">
            <div className="grid-toolbar">
                <div className="toolbar-left">
                    <Add table_name={tableView} />
                    <Delete tablename={tableView} gridRef={gridRef} />
                </div>
                <div className="toolbar-right">
                    <Layouts />
                    <Searchpatterns tablename={tableView} gridRef = {gridRef} />
                    <ColumnVisible columnDefs={columnDefs} setColumnDefs={setColumnDefs} onColumnChanged = {onColumnChanged} />
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
                    rowSelection={rowSelection}
                    onSortChanged={onSortChanged}
                    onColumnMoved={onColumnChanged}
                    onColumnResized={onColumnChanged}
                />
            </div>
            <Update tablename={tableView} isOpen={isOpenUpdate} setIsOpen={setIsOpenUpdate} updateData={updateData} />
        </div>
    );
}

export default DynamicGrid;
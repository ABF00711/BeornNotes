import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import "./style.css";
import { AgGridReact } from 'ag-grid-react';
import { themeAlpine } from "ag-grid-community";
import useDynamicData from "../../Hooks/useDynamicData";
import useSearchConfig from "../../Hooks/useSearchConfig";
import Add from "../Add";
import Update from "../Update";
import Delete from "../Delete";
import Searchpatterns from "../Searchpatterns";
import useSearchpatterns from "../../Hooks/useFilters";
import Layouts from "../Layouts";
import useLayouts from "../../Hooks/useLayouts";
import "ag-grid-enterprise";
import Reset from "./Reset";

function DynamicGrid({ tableView }) {
    const { dynamicData, getDynamicData, getColumnDefs, } = useDynamicData();
    const { searchConfig, getSearchConfigData } = useSearchConfig();
    const { searchpatterns, getSearchpatterns, restoreSearchpatterns, onSortChanged, saveFilterInfo } = useSearchpatterns();
    const { layouts, getLayouts } = useLayouts();
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

    const onColumnChanged = () => {
        setTimeout(() => {
            const currentGrid = gridRef.current.api.getColumnState();
            localStorage.setItem("layout", JSON.stringify(currentGrid));
        }, 300);
    }

    const statusBar = useMemo(() => ({
        statusPanels: [
            {
                statusPanel: 'agTotalAndFilteredRowCountComponent',
                align: 'left',
            },
        ],
    }), []);

    const onFilterChanged = useCallback((params) => {
        saveFilterInfo(params);
    }, []);

    useEffect(() => {
        setColumnDefs(getColumnDefs(tableView));
    }, [searchConfig])

    useEffect(() => {
        if (dynamicData?.length && columnDefs?.length > 0 && gridRef.current?.api) {
            setTimeout(() => {
                restoreSearchpatterns(gridRef);
            }, 100);
        }
    }, [dynamicData, columnDefs, layouts, searchpatterns])

    useEffect(() => {
        getSearchConfigData();
        getDynamicData(tableView);
        getLayouts(tableView);
        getSearchpatterns(tableView);
    }, [])
    
    useEffect(() => {
    }, [tableView])

    return (
        <div className="dynamic-grid">
            <div className="grid-toolbar">
                <div className="toolbar-left">
                    <Add table_name={tableView} />
                    <Delete tablename={tableView} gridRef={gridRef} />
                    <Reset gridRef={gridRef} />
                </div>
                <div className="toolbar-right">
                    <Layouts tablename={tableView} gridRef={gridRef} />
                    <Searchpatterns tablename={tableView} gridRef={gridRef} />
                </div>
            </div>
            <div className="table">
                <AgGridReact
                    ref={gridRef}
                    // onGridReady={onGridReady}
                    rowData={dynamicData}
                    columnDefs={columnDefs}
                    theme={themeAlpine}
                    onRowDoubleClicked={openUpdateModal}
                    onFilterChanged={onFilterChanged}
                    rowSelection={rowSelection}
                    onSortChanged={() => { onSortChanged(gridRef) }}
                    onColumnMoved={onColumnChanged}
                    onColumnResized={onColumnChanged}
                    onBodyScroll={true}
                    accentedSort
                    statusBar={statusBar}
                    defaultColDef={{
                        filter: true,
                        floatingFilter: true,
                        sortable: true,
                    }}
                />
            </div>
            <Update tablename={tableView} isOpen={isOpenUpdate} setIsOpen={setIsOpenUpdate} updateData={updateData} setUpdateData={setUpdateData} />
        </div>
    );
}

export default DynamicGrid;
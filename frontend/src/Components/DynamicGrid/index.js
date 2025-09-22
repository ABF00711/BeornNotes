import React, { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
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
import useLayouts from "../../Hooks/useLayouts";

function DynamicGrid({ tableView }) {
    const { dynamicData, getDynamicData, getColumDefs, } = useDynamicData();
    const { searchConfig, getSearchConfigData } = useSearchConfig();
    const { getSearchpatterns, restoreSearchpatterns, onSortChanged, saveFilterInfo } = useSearchpatterns();
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
        }, 100);
    }

    const onReset = useCallback(() => {
        localStorage.setItem("searchpatterns", "");
        localStorage.setItem("layout", "");
        restoreSearchpatterns(gridRef);
    }, [])

    useEffect(() => {
        setColumnDefs(getColumDefs(tableView));
    }, [searchConfig])

    useEffect(() => {
        if (dynamicData && dynamicData.length > 0 && gridRef.current?.api) {
            setTimeout(() => {
                restoreSearchpatterns(gridRef);
            }, 100);
        }
    }, [dynamicData, columnDefs])

    useEffect(() => {
        getSearchConfigData();
        getLayouts(tableView);
        getSearchpatterns(tableView)
        getDynamicData(tableView);
    }, [])


    return (
        <div className="dynamic-grid">
            <div className="grid-toolbar">
                <div className="toolbar-left">
                    <Add table_name={tableView} />
                    <Delete tablename={tableView} gridRef={gridRef} />
                    <button onClick={onReset} type="button" className="btn btn-warning">
                        <span className="btn-icon">⟲</span>
                        <span className="btn-label">Reset</span>
                    </button>
                </div>
                <div className="toolbar-right">
                    <Layouts tablename={tableView} gridRef={gridRef} />
                    <Searchpatterns tablename={tableView} gridRef={gridRef} />
                    <ColumnVisible gridRef={gridRef} columnDefs={columnDefs} setColumnDefs={setColumnDefs} onColumnChanged={onColumnChanged} />
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
                    theme={themeAlpine}
                    onRowDoubleClicked={openUpdateModal}
                    onFilterChanged={saveFilterInfo}
                    rowSelection={rowSelection}
                    onSortChanged={() => {onSortChanged(gridRef)}}
                    onColumnMoved={onColumnChanged}
                    onColumnResized={onColumnChanged}
                    onBodyScroll={true}
                    accentedSort
                />
            </div>
            <Update tablename={tableView} isOpen={isOpenUpdate} setIsOpen={setIsOpenUpdate} updateData={updateData} />
        </div>
    );
}

export default DynamicGrid;
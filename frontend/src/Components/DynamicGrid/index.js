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
    const { dynamicData, getDynamicData, getColumDefs } = useDynamicData();
    const { searchConfig, getSearchConfigData } = useSearchConfig();
    const { searchpatterns, getSearchpatterns } = useSearchpatterns();
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
            if (savedSearchpattern == null) {
                const defaultPattern = searchpatterns.find(pattern => pattern.name == "Default");
                if (defaultPattern && defaultPattern.data) {
                    const parsedPattern = JSON.parse(defaultPattern.data);
                    savedSearchpattern = {
                        filters: parsedPattern.filters || [],
                        sorts: parsedPattern.sorts || []
                    }
                } else {
                    savedSearchpattern = {
                        filters: [],
                        sorts: []
                    }
                }
            }
            let savedLayout = JSON.parse(localStorage.getItem("layout") || null);
            if (savedLayout == null) {
                const defaultLayout = layouts.find(layout => layout.layout_name === "Default");
                if (defaultLayout) {
                    savedLayout = JSON.parse(defaultLayout.layout_json);
                } else {
                    savedLayout = gridRef.current.api.getColumnState();
                }
            }
            if (savedSearchpattern.sorts) {
                savedLayout.map((column) => {
                    const savedSort = savedSearchpattern.sorts.find(item => item.colId === column.colId);
                    if (savedSort) {
                        column.sort = savedSort.sort;
                    }
                    return column
                })
            }
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
        setTimeout(() => {
            const currentGrid = gridRef.current.api.getColumnState();
            localStorage.setItem("layout", JSON.stringify(currentGrid));
        }, 100);
    }

    const onReset = useCallback(() => {
        localStorage.setItem("searchpatterns", "{}");
        localStorage.setItem("layout", "{}");
        restoreSearchpatterns();
    }, [])

    const onGridReady = useCallback((params) => {
        gridRef.current.gridApi = params.columnApi;
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
                    <ColumnVisible columnDefs={columnDefs} setColumnDefs={setColumnDefs} onColumnChanged={onColumnChanged} />
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
                    onBodyScroll={true}
                    accentedSort
                />
            </div>
            <Update tablename={tableView} isOpen={isOpenUpdate} setIsOpen={setIsOpenUpdate} updateData={updateData} />
        </div>
    );
}

export default DynamicGrid;
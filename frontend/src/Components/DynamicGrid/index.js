import React, { useCallback, useEffect, useRef, useState } from "react";
import "./style.css";
import { AgGridReact } from 'ag-grid-react';
import { themeAlpine } from "ag-grid-community";
import useDynamicData from "../../Hooks/useDynamicData";
import useSearchConfig from "../../Hooks/useSearchConfig";

function DynamicGrid({ tableView }) {
    const { dynamicData, getDynamicData } = useDynamicData();
    const { searchConfig, getSearchConfigData } = useSearchConfig();
    const gridRef = useRef();
    const [columnDefs, setColumnDefs] = useState([
    ]);

    const getColumDefs = () => {
        try {
            const columnData = searchConfig
                .filter(item => item.table_name == tableView)
                .map((item, index) => {
                    if (item.field_type == "date") {
                        return {
                            field: item.field_name, sortable: true, filter: true, colId: index, flex: 1,
                            valueFormatter: (params) => {
                                if (!params.value) return "";
                                return new Date(params.value).toISOString().split("T")[0];
                            }
                        }
                    }
                    return { field: item.field_name, sortable: true, filter: true, colId: index, flex: 1 };
                })
            setColumnDefs(columnData);
        } catch (error) {
            console.log("getColumnDefsError: ", error);
        }
    }

    const removeData = (params) => {
        console.log("Row index:", params.rowIndex);
    }

    const saveFilterInfo = (params) => {
        console.log(params.api.getFilterModel())
    }

    const restoreFilters = () => {
        const savedFilters = JSON.parse(localStorage.getItem("filters") || "{}");
        gridRef.current.api.setFilterModel(savedFilters);
        gridRef.current.api.onFilterChanged();
    };

    const logColumnState = () => {
        const columnState = gridRef.current.columnApi.getColumnState();
        console.log("Column state:", columnState);
    };

    const onGridReady = useCallback((params) => {

    }, []);

    useEffect(() => {
        getColumDefs();
    }, [searchConfig])

    useEffect(() => {
        getSearchConfigData();
        getDynamicData(tableView);
    }, [])

    return (
        <div className="dynamic-grid">
            <div className="table">
                <AgGridReact
                    ref={gridRef}
                    rowData={dynamicData}
                    columnDefs={columnDefs}
                    onGridReady={onGridReady}
                    theme={themeAlpine}
                    onRowDoubleClicked={removeData}
                    onFilterChanged={saveFilterInfo}
                />
            </div>
        </div>
    );
}

export default DynamicGrid;
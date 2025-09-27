import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import "./style.css";
import { AgGridReact } from 'ag-grid-react';
import { themeAlpine } from "ag-grid-community";
import useDynamicData from "../../Hooks/useDynamicData";
import useSearchConfig from "../../Hooks/useSearchConfig";

import useLayouts from "../../Hooks/useLayouts";
import Header from "../../Components/Header";
import Navbar from "../Navbar";
import Sidebar from "../Sidebar";
import { MyContext } from "../../Context";
import InputGroup from "../../Components/InputGroup";
import Add from "../../Components/Add";
import Delete from "../../Components/Delete";
import Update from "../../Components/Update";

function Customers2({ tableView = "customers2" }) {
    const { isCollapsed } = useContext(MyContext);
    const { dynamicData, getDynamicData, getColumnDefs, } = useDynamicData();
    const [gridData, setGridData] = useState([]);
    const { searchConfig, getSearchConfigData } = useSearchConfig();
    const { layouts, getLayouts } = useLayouts();
    const gridRef = useRef();
    const [columnDefs, setColumnDefs] = useState([]);
    const [searchKey, setSearchKey] = useState({ age: "", job: "" });
    const [isOpenUpdate, setIsOpenUpdate] = useState(false);
    const [updateData, setUpdateData] = useState(null);

    const onColumnChanged = () => {
        setTimeout(() => {
            const currentGrid = gridRef.current?.api.getColumnState();
            localStorage.setItem("customers2Layout", JSON.stringify(currentGrid));
        }, 100);
    }

    const restoreSearchpatterns = (gridRef) => {
        if (!gridRef.current?.api) return;
        try {
            let savedLayout = JSON.parse(localStorage.getItem("customers2Layout") || null);
            if (savedLayout == null) {
                const defaultLayout = layouts.find(layout => layout.layout_name === "Default");
                if (defaultLayout) {
                    savedLayout = JSON.parse(defaultLayout.layout_json);
                } else {
                    savedLayout = gridRef.current.api.getColumnState();
                }
            }
            gridRef.current.api.applyColumnState({
                state: savedLayout,
                applyOrder: true,
            });
        } catch (error) {
            console.log("restoreSearchpatterns error:", error);
        }
    };

    const onSearch = () => {
        const trimmedAge = searchKey.age.trim();
        const trimmedJob = searchKey.job.trim();

        if (!trimmedAge && !trimmedJob) {
            setGridData(dynamicData);
            return;
        }

        setGridData(gridData.filter((oneData) => {
            if (!trimmedAge) {
                return oneData.job == trimmedJob;
            }
            if (!trimmedJob) {
                return oneData.age == trimmedAge;
            }
            return (oneData.age == trimmedAge) && (oneData.job == trimmedJob);
        }))
    }

    const updateSearchKey = (e) => {
        setSearchKey({
            ...searchKey,
            [e.target.name]: e.target.value
        })
    }

    const onGridReady = useCallback(() => {
    }, [])

    const statusBar = useMemo(() => ({
        statusPanels: [
            {
                statusPanel: 'agTotalAndFilteredRowCountComponent',
                align: 'left',
            },
        ],
    }), []);

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

    useEffect(() => {
        if (isOpenUpdate) return;
        setUpdateData(null)
    }, [isOpenUpdate])

    useEffect(() => {
        setColumnDefs(getColumnDefs("customers"));
    }, [searchConfig])

    useEffect(() => {
        setGridData(dynamicData);
        if (dynamicData && dynamicData.length > 0 && gridRef.current?.api) {
            setTimeout(() => {
                restoreSearchpatterns(gridRef);
            }, 100);
        }
    }, [dynamicData, columnDefs])

    useEffect(() => {
        getSearchConfigData();
        getLayouts(tableView);
        getDynamicData("customers");
    }, [])


    return (
        <div className="dashboard">
            <Header />
            <Navbar />
            <div className={`dashboard-container ${!isCollapsed ? 'M_L_280' : ''}`}>
                <div className="dynamic-grid">
                    <div className="grid-toolbar">
                        <div className="toolbar-left">
                            <Add table_name={"customers"} gridRef={gridRef} />
                            <Delete tablename={"customers"} gridRef={gridRef} />
                            <div>
                                <InputGroup props={{
                                    fieldFormat: { id: "age", field_type: "number", field_label: "Age", field_name: "age" },
                                    handleChange: updateSearchKey,
                                    value: searchKey.age
                                }} />
                                <InputGroup props={{
                                    fieldFormat: { id: "job", field_type: "combobox", field_label: "Job", field_name: "job", lookup_sql: "Select name from job Order By name" },
                                    handleChange: updateSearchKey,
                                    value: searchKey.job
                                }} />
                            </div>
                            <button onClick={onSearch} type="button" className="btn btn-primary">
                                <span className="btn-icon">⌕</span>
                                <span className="btn-label">Search</span>
                            </button>
                        </div>
                    </div>
                    <div className="table">
                        <AgGridReact
                            ref={gridRef}
                            onGridReady={onGridReady}
                            rowData={gridData}
                            columnDefs={columnDefs}
                            theme={themeAlpine}
                            onRowDoubleClicked={openUpdateModal}
                            onSortChanged={onColumnChanged}
                            onColumnMoved={onColumnChanged}
                            onColumnResized={onColumnChanged}
                            rowSelection={rowSelection}
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
                    <Update tablename={"customers"} isOpen={isOpenUpdate} setIsOpen={setIsOpenUpdate} updateData={updateData} setUpdateData={setUpdateData} />
                </div>
            </div>
            <Sidebar />
        </div>
    );
}

export default Customers2;
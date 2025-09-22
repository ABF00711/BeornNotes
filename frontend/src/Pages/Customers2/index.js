import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import "./style.css";
import { AgGridReact } from 'ag-grid-react';
import { themeAlpine } from "ag-grid-community";
import useDynamicData from "../../Hooks/useDynamicData";
import useSearchConfig from "../../Hooks/useSearchConfig";

import useLayouts from "../../Hooks/useLayouts";
import Layouts from "../../Components/Layouts";
import ColumnVisible from "../../Components/ColumnVisible";
import useSearchpatterns from "../../Hooks/useFilters";
import Header from "../../Components/Header";
import Navbar from "../Navbar";
import Sidebar from "../Sidebar";
import { MyContext } from "../../Context";

function Customers2({ tableView = "customers2" }) {
    const {isCollapsed} = useContext(MyContext);
    const { dynamicData, getDynamicData, getColumDefs, } = useDynamicData();
    const { searchConfig, getSearchConfigData } = useSearchConfig();
    const {layouts, getLayouts } = useLayouts();
    const gridRef = useRef();
    const [columnDefs, setColumnDefs] = useState([]);

    const onColumnChanged = () => {
        setTimeout(() => {
            const currentGrid = gridRef.current.api.getColumnState();
            localStorage.setItem("customers2Layout", JSON.stringify(currentGrid));
        }, 100);
    }

    const restoreSearchpatterns = (gridRef) => {
        if (!gridRef.current?.api) return;
        try {
            let savedLayout = JSON.parse(localStorage.getItem("customers2Layout") || null);
            console.log("savedLayout: ", savedLayout);
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

    const onReset = useCallback(() => {
        localStorage.setItem("customers2Layout", "");
        restoreSearchpatterns(gridRef);
    }, [])

    useEffect(() => {
        setColumnDefs(getColumDefs("customers"));
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
                            <button onClick={onReset} type="button" className="btn btn-warning">
                                <span className="btn-icon">⟲</span>
                                <span className="btn-label">Reset</span>
                            </button>
                        </div>
                        <div className="toolbar-right">
                            <Layouts tablename={tableView} gridRef={gridRef} />
                            <ColumnVisible gridRef={gridRef} columnDefs={columnDefs} onColumnChanged={onColumnChanged} />
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
                            onSortChanged={onColumnChanged}
                            onColumnMoved={onColumnChanged}
                            onColumnResized={onColumnChanged}
                            onBodyScroll={true}
                            accentedSort
                        />
                    </div>
                </div>
            </div>
            <Sidebar />
        </div>
    );
}

export default Customers2;
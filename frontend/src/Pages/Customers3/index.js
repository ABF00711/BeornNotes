import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import "./style.css";
import Header from "../../Components/Header";
import Navbar from "../Navbar";
import Sidebar from "../Sidebar";
import { MyContext } from "../../Context";
import Delete from "../../Components/Delete";
import Reset from "../../Components/DynamicGrid/Reset";
import { AgGridReact } from "ag-grid-react";
import useDynamicData from "../../Hooks/useDynamicData";
import useSearchConfig from "../../Hooks/useSearchConfig";
import useLayouts from "../../Hooks/useLayouts";
import Layouts from "../../Components/Layouts";
import Searchpatterns from "../../Components/Searchpatterns";
import { useNavigate } from "react-router-dom";
import useSearchpatterns from "../../Hooks/useFilters";
import { themeAlpine } from "ag-grid-community";


function Customers3({tableView = "customers3"}) {
    const navigate = useNavigate();
    const { isCollapsed } = useContext(MyContext);
    const { dynamicData, getDynamicData, getColumnDefs, } = useDynamicData();
    const { searchConfig, getSearchConfigData } = useSearchConfig();
    const { searchpatterns, getSearchpatterns, restoreSearchpatterns, onSortChanged, saveFilterInfo } = useSearchpatterns();
    const { layouts, getLayouts } = useLayouts();
    const gridRef = useRef();
    const [columnDefs, setColumnDefs] = useState([]);
    const [updateData, setUpdateData] = useState(null);
    const rowSelection = useMemo(() => {
        return {
            mode: "multiRow",
            groupSelects: "descendants",
            headerCheckbox: true,
        };
    }, []);

    const onColumnChanged = () => {
        setTimeout(() => {
            const currentGrid = gridRef.current.api.getColumnState();
            localStorage.setItem("layout", JSON.stringify(currentGrid));
        }, 300);
    }

    const onDoubleClick = (params) => {
        try {
            setUpdateData(params.data);
            navigate("/customers3/create");
        } catch (error) {
            console.log("onDoubleClickError: ", error);
        }
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
        setColumnDefs(getColumnDefs("customers"));
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
        getDynamicData("customers");
        getLayouts(tableView);
        getSearchpatterns(tableView);
    }, [])

    return (
        <div className="dashboard">
            <Header />
            <Navbar />
            <div className={`dashboard-container ${!isCollapsed ? 'M_L_280' : ''}`}>
                <div className="dynamic-grid">
                    <div className="grid-toolbar">
                        <div className="toolbar-left">
                            <Delete tablename={"customers"} gridRef={gridRef} />
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
                            rowData={dynamicData}
                            columnDefs={columnDefs}
                            theme={themeAlpine}
                            onRowDoubleClicked={onDoubleClick}
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
                </div>
            </div>
            <Sidebar />
        </div>
    );
}

export default Customers3;
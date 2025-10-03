import React, { useCallback, useContext, useEffect, useRef, useState } from "react";
import "./style.css";
import Header from "../../Components/Header";
import Navbar from "../Navbar";
import Sidebar from "../Sidebar";
import { MyContext } from "../../Context";
import SmartGrid from "../../Components/SmartGrid";
import { Smart } from "smart-webcomponents-react/grid";
import Add from "../../Components/Add";
import SmartDelete from "./Delete";
import SmartLayouts from "./Layouts";
import SmartSearchPattern from "./SearchPattern";
import Update from "../../Components/Update";


function Customers4() {
    const { isCollapsed } = useContext(MyContext);
    const gridRef = useRef(null);
    const [isOpen, setIsOpen] = useState(false);
    const [updateData, setUpdateData] = useState({});

    const openUpdateModal = useCallback((data) => {
        setUpdateData(data);
        setIsOpen(true);
    }, [])

    return (
        <div className="dashboard">
            <Header />
            <Navbar />
            <div className={`dashboard-container ${!isCollapsed ? 'M_L_280' : ''}`}>
                <div className="customers4">
                    <div className="customers4-toolbar">
                        <div className="toolbar-left">
                            <Add table_name="customers" />
                            <SmartDelete tablename="customers" gridRef={gridRef} />
                        </div>
                        <div className="toolbar-right">
                            <SmartLayouts tablename="customers4" gridRef={gridRef} />
                            <SmartSearchPattern tablename="customers4" gridRef={gridRef} />
                        </div>
                    </div>
                    <SmartGrid
                        tablename="customers"
                        gridRef={gridRef}
                        openUpdateModal = {openUpdateModal}
                        />
                    <Update
                        tablename={"customers"}
                        isOpen={isOpen}
                        setIsOpen={setIsOpen}
                        updateData={updateData}
                        setUpdateData={setUpdateData}
                    />
                </div>
            </div>
            <Sidebar />
        </div>
    );
}

export default Customers4;
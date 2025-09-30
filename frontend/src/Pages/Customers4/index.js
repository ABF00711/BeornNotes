import React, { useContext, useEffect, useRef } from "react";
import "./style.css";
import Header from "../../Components/Header";
import Navbar from "../Navbar";
import Sidebar from "../Sidebar";
import { MyContext } from "../../Context";
import SmartGrid from "../../Components/SmartGrid";
import Add from "../../Components/Add";
import SmartDelete from "./Delete";


function Customers4() {
    const {isCollapsed} = useContext(MyContext);
    const gridRef = useRef(null);

    return (
        <div className="dashboard">
            <Header />
            <Navbar />
            <div className={`dashboard-container ${!isCollapsed ? 'M_L_280' : ''}`}>
                <div className="customers4">
                    <div className="customers4-toolbar">
                        <div className="toolbar-left">
                            <Add table_name="customers" />
                            <SmartDelete tablename = "customers" gridRef = {gridRef} />
                        </div>
                        <div className="toolbar-right">
                        </div>
                    </div>
                    <SmartGrid tableName = "customers" gridRef={gridRef} />
                </div>
            </div>
            <Sidebar />
        </div>
    );
}

export default Customers4;
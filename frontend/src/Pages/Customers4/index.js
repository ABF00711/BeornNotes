import React, { useContext, useEffect } from "react";
import "./style.css";
import Header from "../../Components/Header";
import Navbar from "../Navbar";
import Sidebar from "../Sidebar";
import { MyContext } from "../../Context";
import SmartGrid from "../../Components/SmartGrid";


function Customers4() {
    const {isCollapsed} = useContext(MyContext);

    return (
        <div className="dashboard">
            <Header />
            <Navbar />
            <div className={`dashboard-container ${!isCollapsed ? 'M_L_280' : ''}`}>
                <SmartGrid tableName = "customers" />
            </div>
            <Sidebar />
        </div>
    );
}

export default Customers4;
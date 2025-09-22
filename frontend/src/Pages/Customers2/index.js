import React, { useContext, useEffect, useRef, useState } from "react";
import "./style.css";
import Header from "../../Components/Header";
import Sidebar from "../Sidebar";
import Navbar from "../Navbar";
import { MyContext } from "../../Context";
import useDynamicData from "../../Hooks/useDynamicData";
import { AgGridReact } from "ag-grid-react";
import { themeAlpine } from "ag-grid-community";
import useSearchConfig from "../../Hooks/useSearchConfig";
import { toast } from "react-toastify";
import InputGroup from "../../Components/InputGroup";

function Customers2() {
    const { isCollapsed } = useContext(MyContext);
    
    return (
        <div className="dashboard">
            <Header />
            <Navbar />
            <div className={`dashboard-container ${!isCollapsed ? 'M_L_280' : ''}`}>
                <div className="main">
                    
                </div>
            </div>
            <Sidebar />
        </div>
    );
}

export default Customers2;
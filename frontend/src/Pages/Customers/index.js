import React, { useContext, useEffect } from "react";
import "./style.css";
import Header from "../../Components/Header";
import Navbar from "../Navbar";
import Sidebar from "../Sidebar";
import DynamicGrid from "../../Components/DynamicGrid";
import { MyContext } from "../../Context";
import useAuth from "../../Hooks/useAuth";


function Customers() {
    const {isCollapsed} = useContext(MyContext);

    return (
        <div className="dashboard">
            <Header />
            <Navbar />
            <div className={`dashboard-container ${!isCollapsed ? 'M_L_280' : ''}`}>
                <DynamicGrid tableView={"customers"} />
            </div>
            <Sidebar />
        </div>
    );
}

export default Customers;
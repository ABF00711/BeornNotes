import React, { useContext } from "react";
import "./style.css";
import Header from "../../Components/Header";
import Sidebar from "../Sidebar";
import Navbar from "../Navbar";
import { MyContext } from "../../Context";

function Customers2() {
    const {isCollapsed} = useContext(MyContext);

    return (
        <div className="dashboard">
            <Header />
            <Navbar />
            <div className={`dashboard-container ${!isCollapsed ? 'M_L_280' : ''}`}>
                <div className="main">
                    <h1>This is Customers2</h1>
                </div>
            </div>
            <Sidebar />
        </div>
    );
}

export default Customers2;
import React from "react";
import "./style.css";
import Header from "../../Components/Header";
import Navbar from "../Navbar";
import Sidebar from "../Sidebar";

function Customers() {

    return (
        <div className="dashboard">
            <Header />
            <Navbar />
            <div className="dashboard-container">
                
            </div>
            <Sidebar />
        </div>
    );
}

export default Customers;
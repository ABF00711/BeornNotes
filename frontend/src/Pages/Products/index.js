import React, { useContext, useEffect } from "react";
import "./style.css";
import { useNavigate } from "react-router-dom";
import useAuth from "../../Hooks/useAuth";
import Header from "../../Components/Header";
import Sidebar from "../Sidebar";
import useMenuItems from "../../Hooks/useMenuItems";
import Navbar from "../Navbar";
import { MyContext } from "../../Context";

function Products() {
    const {isCollapsed} = useContext(MyContext);

   
    return (
        <div className="dashboard">
            <Header />
            <Navbar />
            <div className={`dashboard-container ${!isCollapsed ? 'M_L_280' : ''}`}>
                <div className="main">
                    <h1>This is Products</h1>
                </div>
            </div>
            <Sidebar />
        </div>
    );
}

export default Products;
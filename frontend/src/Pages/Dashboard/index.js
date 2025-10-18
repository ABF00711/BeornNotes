import React, { useContext, useEffect } from "react";
import "./style.css";
import { useNavigate } from "react-router-dom";
import useAuth from "../../Hooks/useAuth";
import Header from "../../Components/Header";
import Sidebar from "../Sidebar";
import useMenuItems from "../../Hooks/useMenuItems";
import Navbar from "../Navbar";
import { MyContext } from "../../Context";

function Dashboard() {

    return (
        <div className="main">
            <h1>Welcome to BeornNotes Dashboard</h1>
            <p>Manage your customers, products, and orders efficiently.</p>
        </div>
    );
}

export default Dashboard;
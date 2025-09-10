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
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();
    const {isCollapsed} = useContext(MyContext);

    const isAuth = async () => {
        const res = await isAuthenticated();
        if (!res) {
            navigate("/login");
            return;
        }
    }

    console.log();
    

    useEffect(() => {
        isAuth();
    }, [])

    return (
        <div className="dashboard">
            <Header />
            <Navbar />
            <div className={`dashboard-container ${!isCollapsed ? 'M_L_280' : ''}`}>
                <div className="main">
                    <h1>Welcome to BeornNotes Dashboard</h1>
                    <p>Manage your customers, products, and orders efficiently.</p>
                </div>
            </div>
            <Sidebar />
        </div>
    );
}

export default Dashboard;
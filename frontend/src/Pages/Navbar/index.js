import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./style.css";
import TabbedBtn from "../../Components/TabbedBtn";
import TabInterfaces from "../../Components/TabInterfaces";
import { MyContext } from "../../Context";
import useTabbedInterfaces from "../../Hooks/useTabbedInterfaces";

function Navbar() {
    const { currentInterface, getCurrentTabInterface } = useTabbedInterfaces();
    const { isCollapsed } = useContext(MyContext);
    const navigate = useNavigate();

    useEffect(() => {
        getCurrentTabInterface();
    }, [])

    return (
        <div className="navbar">
            <div className="navbar-container">
                <div className={`breadcrumb ${!isCollapsed ? 'M_L_280' : 'M_L_50'}`}>
                    {currentInterface.tabbedBtns.map((btnInfo) => {
                        if (!btnInfo) return;
                        return <TabbedBtn btnInfo={btnInfo} />;
                    })}
                </div>
                <div className="navbar-actions">
                    <TabInterfaces navigate = {navigate} />
                </div>
            </div>
        </div>
    );
}

export default Navbar;
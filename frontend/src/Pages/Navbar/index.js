import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./style.css";
import useTabbedBtns from "../../Hooks/useTabbedBtns";
import TabbedBtn from "../../Components/TabbedBtn";

function Navbar() {
    const {tabbedBtns, getTabbedBtns} = useTabbedBtns();

    useEffect(() => {
        getTabbedBtns();
    }, [])

    return (
        <div className="navbar">
            <div className="navbar-container">
                {/* Breadcrumb Navigation */}
                <div className="breadcrumb">
                    {tabbedBtns.map((btnInfo) => {
                        if(!btnInfo)return;
                        return <TabbedBtn btnInfo = {btnInfo} />;
                    })}
                </div>

                {/* Right side actions */}
                <div className="navbar-actions">
                    {/* Search Bar */}
                    <div className="search-container">
                        <input
                            type="text"
                            placeholder="Search..."
                            className="search-input"
                        />
                        <button className="search-btn">
                            🔍
                        </button>
                    </div>

                    {/* Quick Actions */}
                    <div className="quick-actions">
                        <button className="action-btn" title="Add Customer">
                            👥
                        </button>
                        <button className="action-btn" title="New Order">
                            🛒
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Navbar;
import React, { useContext, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./style.css";
import useTabbedBtns from "../../Hooks/useTabbedBtns";
import TabbedBtn from "../../Components/TabbedBtn";
import { MyContext } from "../../Context";

function Navbar() {
    const {tabbedBtns, getTabbedBtns} = useTabbedBtns();
    const {isCollapsed} = useContext(MyContext);

    useEffect(() => {
        getTabbedBtns();
    }, [])

    return (
        <div className="navbar">
            <div className="navbar-container">
                {/* Breadcrumb Navigation */}
                <div className={`breadcrumb ${!isCollapsed ? 'M_L_280' : 'M_L_50'}`}>
                    {tabbedBtns.map((btnInfo) => {
                        if(!btnInfo)return;
                        return <TabbedBtn btnInfo = {btnInfo} />;
                    })}
                </div>
            </div>
        </div>
    );
}

export default Navbar;
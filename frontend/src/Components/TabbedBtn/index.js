import React, { useContext, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./style.css";
import useTabbedBtns from "../../Hooks/useTabbedInterfaces";
import { MyContext } from "../../Context";

function TabbedBtn({ btnInfo }) {
    const navigate = useNavigate();
    const { removeTabbedInterface } = useTabbedBtns();
    const location = useLocation();
    const [isHovered, setIsHovered] = useState(false);
    const {currentInterface, setCurrentInterface} = useContext(MyContext);

    const isActive = btnInfo.path === location.pathname;

    const onNavigate = () => {
        const tabInterface = {...currentInterface, activeUrl: btnInfo.path};
        localStorage.setItem("tabbedInterface", JSON.stringify(tabInterface));
        setCurrentInterface(tabInterface)
        navigate(btnInfo.path);
    };

    const removeBtn = (e) => {
        e.stopPropagation(); // Prevent navigation when clicking close
        removeTabbedInterface(btnInfo);
    };

    return (
        <div 
            className={`tabbed-btn ${isActive ? 'active' : ''} ${isHovered ? 'hovered' : ''}`}
            onClick={onNavigate}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div className="tab-content">
                <span className="tab-icon">{btnInfo.icon || '📄'}</span>
                <span className="tab-title">{btnInfo.title}</span>
            </div>
            <button 
                className="tab-close"
                onClick={removeBtn}
                title="Close tab"
            >
                ✕
            </button>
        </div>
    );
}

export default TabbedBtn;
import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./style.css";
import useTabbedBtns from "../../Hooks/useTabbedBtns";

function TabbedBtn({ btnInfo }) {
    const navigate = useNavigate();
    const { removeTabbedBtn } = useTabbedBtns();
    const location = useLocation();
    const [isHovered, setIsHovered] = useState(false);

    const isActive = btnInfo.path === location.pathname;

    const onNavigate = () => {
        navigate(btnInfo.path);
    };

    const removeBtn = (e) => {
        e.stopPropagation(); // Prevent navigation when clicking close
        removeTabbedBtn(btnInfo);
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
import React from "react";
import "./style.css";

function MenuItem({ 
    item, 
    isCollapsed, 
    isExpanded, 
    hasChildren, 
    onToggle, 
    onNavigate 
}) {
    return (
        <li className="nav-item">
            <div className="nav-parent">
                <button
                    className={`nav-link ${item.active ? 'active' : ''}`}
                    onClick={() => hasChildren ? onToggle(item.id) : onNavigate(item)}
                    title={isCollapsed ? item.title : ""}
                >
                    <span className="nav-icon">{item.icon}</span>
                    {!isCollapsed && <span className="nav-label">{item.title}</span>}
                    {hasChildren && !isCollapsed && (
                        <span className={`nav-arrow ${isExpanded ? 'expanded' : ''}`}>
                            ▼
                        </span>
                    )}
                </button>
            </div>
            
            {hasChildren && isExpanded && !isCollapsed && (
                <Submenu 
                    children={item.children} 
                    onNavigate={onNavigate}
                />
            )}
        </li>
    );
}

function Submenu({ children, onNavigate }) {
    return (
        <ul className="submenu">
            {children.map((child) => (
                <li key={child.screen_id} className="submenu-item">
                    <button
                        className={`submenu-link ${child.active ? 'active' : ''}`}
                        onClick={() => onNavigate(child)}
                        title={child.title}
                    >
                        <span className="submenu-icon">{child.icon}</span>
                        <span className="submenu-label">{child.title}</span>
                    </button>
                </li>
            ))}
        </ul>
    );
}

export default MenuItem;

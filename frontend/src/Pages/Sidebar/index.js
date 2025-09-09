import React, { useState, useContext, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./style.css";
import { MyContext } from "../../Context";
import useAuth from "../../Hooks/useAuth";

function Sidebar() {
    const navigate = useNavigate();
    const location = useLocation();
    const { userData } = useContext(MyContext);
    const { logout } = useAuth();
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [expandedMenus, setExpandedMenus] = useState(new Set());

    const menuItems = [
        {
            id:0,
            screen_id: "dashboard",
            title: "Dashboard",
            icon: "📊",
            path: "/",
            active: location.pathname === "/",
            parent_id: null
        },
        {
            id:1,
            screen_id: "customers",
            title: "Customers",
            icon: "👥",
            path: "/customers",
            active: location.pathname === "/customers",
            parent_id: null
        },
        {
            id:2,
            screen_id: "products",
            title: "Products",
            icon: "📦",
            path: "/products",
            active: location.pathname === "/products",
            parent_id: null
        },
        {
            id:3,
            screen_id: "orders",
            title: "Orders",
            icon: "🛒",
            path: "/orders",
            active: location.pathname === "/orders",
            parent_id: null
        },
        {
            id:4,
            screen_id: "analytics",
            title: "Analytics",
            icon: "📈",
            path: "/analytics",
            active: location.pathname === "/analytics",
            parent_id: null
        },
        {
            id:5,
            screen_id: "settings",
            title: "Settings",
            icon: "⚙️",
            path: "",
            active: location.pathname === "/settings",
            parent_id: null
        },
        {
            id:6,
            screen_id: "role_settings",
            title: "Role",
            icon: "📦",
            path: "/role_settings",
            active: location.pathname === "/role_settings",
            parent_id: 5
        },
        {
            id:7,
            screen_id: "user_settings",
            title: "User",
            icon: "👥",
            path: "/user_settings",
            active: location.pathname === "/user_settings",
            parent_id: 5
        }
    ];

    // Auto-expand parent menus when child is active
    useEffect(() => {
        const activeItem = menuItems.find(item => item.active);
        if (activeItem && activeItem.parent_id !== null) {
            setExpandedMenus(prev => new Set([...prev, activeItem.parent_id]));
        }
    }, [location.pathname]);

    const handleNavigation = (path) => {
        navigate(path);
    };

    const toggleSidebar = () => {
        setIsCollapsed(!isCollapsed);
    };

    const toggleSubmenu = (parentId) => {
        setExpandedMenus(prev => {
            const newSet = new Set(prev);
            if (newSet.has(parentId)) {
                newSet.delete(parentId);
            } else {
                newSet.add(parentId);
            }
            return newSet;
        });
    };

    // Group menu items by parent
    const parentItems = menuItems.filter(item => item.parent_id === null);
    const childItems = menuItems.filter(item => item.parent_id !== null);
    
    // Create a map of parent_id to children
    const childrenMap = childItems.reduce((acc, child) => {
        if (!acc[child.parent_id]) {
            acc[child.parent_id] = [];
        }
        acc[child.parent_id].push(child);
        return acc;
    }, {});

    return (
        <div className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
            <div className="sidebar-header">
                <div className="sidebar-logo">
                    <img src="/logo.png" alt="BeornNotes Logo" className="logo" />
                    {!isCollapsed && <h2 className="logo-text">BeornNotes</h2>}
                </div>
                <button className="toggle-btn" onClick={toggleSidebar}>
                    {isCollapsed ? "→" : "←"}
                </button>
            </div>

            <nav className="sidebar-nav">
                <ul className="nav-list">
                    {parentItems.map((parent) => {
                        const hasChildren = childrenMap[parent.id] && childrenMap[parent.id].length > 0;
                        const isExpanded = expandedMenus.has(parent.id);
                        
                        return (
                            <li key={parent.screen_id} className="nav-item">
                                <div className="nav-parent">
                                    <button
                                        className={`nav-link ${parent.active ? 'active' : ''}`}
                                        onClick={() => hasChildren ? toggleSubmenu(parent.id) : handleNavigation(parent.path)}
                                        title={isCollapsed ? parent.title : ""}
                                    >
                                        <span className="nav-icon">{parent.icon}</span>
                                        {!isCollapsed && <span className="nav-label">{parent.title}</span>}
                                        {hasChildren && !isCollapsed && (
                                            <span className={`nav-arrow ${isExpanded ? 'expanded' : ''}`}>
                                                ▼
                                            </span>
                                        )}
                                    </button>
                                </div>
                                
                                {hasChildren && isExpanded && !isCollapsed && (
                                    <ul className="submenu">
                                        {childrenMap[parent.id].map((child) => (
                                            <li key={child.screen_id} className="submenu-item">
                                                <button
                                                    className={`submenu-link ${child.active ? 'active' : ''}`}
                                                    onClick={() => handleNavigation(child.path)}
                                                    title={child.title}
                                                >
                                                    <span className="submenu-icon">{child.icon}</span>
                                                    <span className="submenu-label">{child.title}</span>
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </li>
                        );
                    })}
                </ul>
            </nav>
        </div>
    );
}

export default Sidebar;
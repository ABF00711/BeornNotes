import React, { useState, useContext, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./style.css";
import useMenuItems from "../../Hooks/useMenuItems";
import MenuItem from "../../Components/MenuItem";
import { MyContext } from "../../Context";
import useTabbedInterfaces from "../../Hooks/useTabbedInterfaces";

function Sidebar() {
    const navigate = useNavigate();
    const location = useLocation();
    const {menuItems, getMenuItems} = useMenuItems();
    const {isCollapsed, setIsCollapsed} = useContext(MyContext);
    const [expandedMenus, setExpandedMenus] = useState(new Set());
    const {addTabbedInterface} = useTabbedInterfaces();

    // Auto-expand parent menus when child is active
    useEffect(() => {
        const activeItem = menuItems.find(item => item.active);
        if (activeItem && activeItem.parent_id !== null) {
            setExpandedMenus(prev => new Set([...prev, activeItem.parent_id]));
        }
    }, [location.pathname]);

    const handleNavigation = (item) => {
        addTabbedInterface(item);
        navigate(item.path);
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

    // Group menu items by parent and attach children to parents
    const parentItems = menuItems
        .filter(item => item.parent_id === null)
        .map(parent => ({
            ...parent,
            children: menuItems.filter(child => child.parent_id === parent.id)
        }));

    useEffect(() => {
        getMenuItems();
    }, [])

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
                        const hasChildren = parent.children && parent.children.length > 0;
                        const isExpanded = expandedMenus.has(parent.id);
                        parent.active = location.pathname === parent.path;
                        
                        return (
                            <MenuItem
                                key={parent.screen_id}
                                item={parent}
                                isCollapsed={isCollapsed}
                                isExpanded={isExpanded}
                                hasChildren={hasChildren}
                                onToggle={toggleSubmenu}
                                onNavigate={handleNavigation}
                            />
                        );
                    })}
                </ul>
            </nav>
        </div>
    );
}

export default Sidebar;
import React, { useState, useContext, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./style.css";
import useMenuItems from "../../Hooks/useMenuItems";
import MenuItem from "../../Components/MenuItem";
import { MyContext } from "../../Context";
import useTabbedInterfaces from "../../Hooks/useTabbedInterfaces";

function Sidebar() {
    const navigate = useNavigate();
    const location = useLocation();
    const { menuItems, getMenuItems } = useMenuItems();
    const { isCollapsed, setIsCollapsed } = useContext(MyContext);
    const [expandedMenus, setExpandedMenus] = useState(new Set());
    const { addTabbedInterface } = useTabbedInterfaces();

    // Resizable sidebar state
    const [sidebarWidth, setSidebarWidth] = useState(() => {
        const stored = localStorage.getItem("sidebarWidth");
        const parsed = stored ? parseInt(stored, 10) : 280;
        return isNaN(parsed) ? 280 : parsed;
    });
    const isDraggingRef = useRef(false);

    useEffect(() => {
        if (isCollapsed) {
            setSidebarWidth(70);
        } else {
            const stored = localStorage.getItem("sidebarWidth");
            const parsed = stored ? parseInt(stored, 10) : 280;
            setSidebarWidth(isNaN(parsed) ? 280 : parsed);
        }
    }, [isCollapsed]);

    // Update CSS custom property when sidebar width changes
    useEffect(() => {
        document.documentElement.style.setProperty('--sidebar-width', `${sidebarWidth}px`);
    }, [sidebarWidth]);

    useEffect(() => {
        const handleResize = () => {
            const isSmallScreen = window.innerWidth < 768;
            if (isSmallScreen) {
                setIsCollapsed(true);
            } else if (!isSmallScreen) {
                const wasManuallyCollapsed = localStorage.getItem('sidebarManuallyCollapsed') === 'true';
                if (!wasManuallyCollapsed) {
                    setIsCollapsed(false);
                }
            }
        };

        handleResize();

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [setIsCollapsed]);

    useEffect(() => {
        const handleMouseMove = (e) => {
            if (!isDraggingRef.current || isCollapsed) return;
            const min = 200;
            const max = 480;
            const newWidth = Math.min(Math.max(e.clientX, min), max);
            setSidebarWidth(newWidth);
            
            // Dispatch custom event for layout to listen
            window.dispatchEvent(new CustomEvent('sidebarResize', {
                detail: { width: newWidth }
            }));
        };
        const handleMouseUp = () => {
            if (!isDraggingRef.current) return;
            isDraggingRef.current = false;
            localStorage.setItem('sidebarWidth', String(sidebarWidth));
            document.body.style.userSelect = '';
            document.body.style.cursor = '';
        };
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [sidebarWidth, isCollapsed]);

    const startDragging = (e) => {
        if (isCollapsed) return;
        isDraggingRef.current = true;
        document.body.style.userSelect = 'none';
        document.body.style.cursor = 'col-resize';
        e.preventDefault();
    };

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
        localStorage.setItem('sidebarManuallyCollapsed', (!isCollapsed).toString());
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
        <div className={`sidebar ${isCollapsed ? 'collapsed' : ''}`} style={{ width: isCollapsed ? 70 : sidebarWidth }}>
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
            {/* Resize handle */}
            {!isCollapsed && (
                <div className="sidebar-resize-handle" onMouseDown={startDragging} />
            )}
        </div>
    );
}

export default Sidebar;
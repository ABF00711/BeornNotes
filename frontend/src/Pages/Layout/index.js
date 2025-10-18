import { useContext, useEffect, useState } from "react";
import { MyContext } from "../../Context";
import { Outlet } from "react-router-dom";
import Header from "../../Components/Header";
import Navbar from "../Navbar";
import Sidebar from "../Sidebar";
import "./style.css";

function Layout() {
    const {isCollapsed} = useContext(MyContext);
    const [sidebarWidth, setSidebarWidth] = useState(280);

    // Listen for sidebar width changes
    useEffect(() => {
        const handleStorageChange = () => {
            const stored = localStorage.getItem("sidebarWidth");
            const parsed = stored ? parseInt(stored, 10) : 280;
            setSidebarWidth(isNaN(parsed) ? 280 : parsed);
        };

        // Initial load
        handleStorageChange();

        // Listen for storage changes
        window.addEventListener('storage', handleStorageChange);
        
        // Listen for custom events from sidebar
        const handleSidebarResize = (event) => {
            setSidebarWidth(event.detail.width);
        };
        
        window.addEventListener('sidebarResize', handleSidebarResize);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
            window.removeEventListener('sidebarResize', handleSidebarResize);
        };
    }, []);

    // Calculate the available width for the content area
    const getContentWidth = () => {
        if (isCollapsed) {
            return 'calc(100vw - 70px)';
        }
        return `calc(100vw - ${sidebarWidth}px)`;
    };

    return (
        <div className="dashboard">
            <Header />
            <Navbar />
            <div 
                className="dashboard-container"
                style={{ 
                    marginLeft: isCollapsed ? '70px' : `${sidebarWidth}px`,
                    width: getContentWidth(),
                    transition: 'margin-left 0.3s ease, width 0.3s ease',
                    boxSizing: 'border-box'
                }}
            >
                <Outlet />                    
            </div>
            <Sidebar />
        </div>
    );
}

export default Layout;
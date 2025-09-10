import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./style.css";

function Navbar() {
    const navigate = useNavigate();
    const location = useLocation();

    // Generate breadcrumb from current path
    const generateBreadcrumb = () => {
        const pathSegments = location.pathname.split('/').filter(segment => segment);
        const breadcrumbs = [{ label: 'Dashboard', path: '/' }];
        
        let currentPath = '';
        pathSegments.forEach(segment => {
            currentPath += `/${segment}`;
            const label = segment.charAt(0).toUpperCase() + segment.slice(1).replace('_', ' ');
            breadcrumbs.push({ label, path: currentPath });
        });
        
        return breadcrumbs;
    };

    const breadcrumbs = generateBreadcrumb();

    return (
        <div className="navbar">
            <div className="navbar-container">
                {/* Breadcrumb Navigation */}
                <div className="breadcrumb">
                    {breadcrumbs.map((crumb, index) => (
                        <React.Fragment key={crumb.path}>
                            {index > 0 && <span className="breadcrumb-separator">›</span>}
                            <button
                                className={`breadcrumb-item ${index === breadcrumbs.length - 1 ? 'active' : ''}`}
                                onClick={() => navigate(crumb.path)}
                                disabled={index === breadcrumbs.length - 1}
                            >
                                {crumb.label}
                            </button>
                        </React.Fragment>
                    ))}
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
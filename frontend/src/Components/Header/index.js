import React, { useState, useEffect, useRef } from "react";
import "./style.css";
import { useNavigate } from "react-router-dom";
import useAuth from "../../Hooks/useAuth";

function Header() {
    const navigate = useNavigate();
    const { logout, userData, setUserData, isAuthenticated } = useAuth();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [dropdownPosition, setDropdownPosition] = useState({ top: 0, right: 0 });
    const dropdownRef = useRef(null);
    const userMenuRef = useRef(null);

    const handleLogout = () => {
        logout();
        setIsDropdownOpen(false);
    };

    const handleProfile = () => {
        // Close dropdown and navigate to profile (you can create this page later)
        setIsDropdownOpen(false);
        navigate("/profile");
    };

    const toggleDropdown = () => {
        if (!isDropdownOpen && userMenuRef.current) {
            const rect = userMenuRef.current.getBoundingClientRect();
            setDropdownPosition({
                top: rect.bottom + 8,
                right: window.innerWidth - rect.right
            });
        }
        setIsDropdownOpen(!isDropdownOpen);
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };

        if (isDropdownOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isDropdownOpen]);

    const getUserDataFromLocalStorage = () => {
        setUserData(JSON.parse(localStorage.getItem("userData")));
    }

    useEffect(() => {
        isAuthenticated()
    }, [])

    return (
        <div className="header">
            <div className="header-container">
                <div className="header-left">
                </div>

                <div className="header-right">

                    <button className="action-btn" title="Notifications">
                        🔔
                        <span className="notification-badge">3</span>
                    </button>
                    <div className="user-menu" ref={userMenuRef} onClick={toggleDropdown}>
                        <div className="user-info">
                            <span className="username">{userData.name || "User"}</span>
                            <svg
                                className={`dropdown-arrow ${isDropdownOpen ? 'open' : ''}`}
                                width="12"
                                height="8"
                                viewBox="0 0 12 8"
                                fill="none"
                            >
                                <path
                                    d="M1 1.5L6 6.5L11 1.5"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                        </div>

                        {isDropdownOpen && (
                            <div
                                className="dropdown-menu"
                                ref={dropdownRef}
                                style={{
                                    position: 'fixed',
                                    top: `${dropdownPosition.top}px`,
                                    right: `${dropdownPosition.right}px`,
                                    zIndex: 9999
                                }}
                            >
                                <div className="dropdown-item" onClick={handleProfile}>
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                        <path
                                            d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                        <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="2" />
                                    </svg>
                                    Profile
                                </div>
                                <div className="dropdown-item logout" onClick={handleLogout}>
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                        <path
                                            d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                        <polyline
                                            points="16,17 21,12 16,7"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                        <line
                                            x1="21"
                                            y1="12"
                                            x2="9"
                                            y2="12"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                    </svg>
                                    Log out
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Header;
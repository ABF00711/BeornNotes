import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./style.css";
import useAuth from "../../Hooks/useAuth";
import Header from "../../Components/Header";
import Sidebar from "../Sidebar";
import Navbar from "../Navbar";
import { MyContext } from "../../Context";
import useSearchConfig from "../../Hooks/useSearchConfig";
import InputGroup from "../../Components/InputGroup";
import TextField from "../../Components/TextField";
import EmailField from "../../Components/EmailField";
import PasswordField from "../../Components/PasswordField";

function Profile() {
    const navigate = useNavigate();
    const { isAuthenticated, userData, getProfileData, updateProfile, changePassword } = useAuth();
    const { isCollapsed, searchConfig } = useContext(MyContext);
    const {getSearchConfigData} = useSearchConfig();
    
    const [formData, setFormData] = useState({
        name: userData.name,
        email: userData.email,
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
    });
    const [profileData, setProfileData] = useState([]);
    const [profileSubmitted, setProfileSubmitted] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const isAuth = async () => {
        const res = await isAuthenticated();
        if (!res) {
            navigate("/login");
            return;
        }
    }

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleUpdateProfile = async (e) => {
        try {
            setIsLoading(true);
            e.preventDefault();
            setProfileSubmitted(true);
            updateProfile(formData, profileData);
        } catch (error) {
            console.log("handleError: ", error);
        }finally{
            setIsLoading(false);
        }
    }

    const handlePasswordChange = async (e) => {
        try {
            setIsLoading(true);
            e.preventDefault();
            setSubmitted(true);
            changePassword(formData, setFormData);
        } catch (error) {
            console.log("handleError: ", error);
        }finally{
            setIsLoading(false);
        }
    }

    useEffect(() => {
        isAuth();
        getSearchConfigData();
    }, []);

    useEffect(() => {
        if (userData && searchConfig.length > 0) {
            getProfileData(setProfileData, setFormData);
        }
    }, [userData, searchConfig]);

    return (
        <div className="dashboard">
            <Header />
            <Navbar />
            <div className={`dashboard-container ${!isCollapsed ? 'M_L_280' : ''}`}>
                <div className="main">
                    <div className="profile-container">
                        <div className="profile-header">
                            <h1>Profile Settings</h1>
                            <p>Manage your account information and preferences</p>
                        </div>

                        <div className="profile-content">
                            <div className="profile-section">
                                <h2>Basic Information</h2>
                                <form className="profile-form" onSubmit={handleUpdateProfile}>
                                    <TextField
                                        name="name"
                                        label="Username"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required={true}
                                        submitted={profileSubmitted}
                                    />
                                    <EmailField
                                        name="email"
                                        label="Email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required={true}
                                        submitted={profileSubmitted}
                                    />
                    
                                    {profileData.map((item) => (
                                        <InputGroup 
                                            key={item.field_name}
                                            props={{ 
                                                fieldFormat: item, 
                                                value: formData[item.field_name] || "", 
                                                handleChange, 
                                                submitted: profileSubmitted 
                                            }} 
                                        />
                                    ))}
                                    
                                    <button type="submit" className="profile-button" disabled={isLoading}>
                                        {isLoading ? "Updating..." : "Update Profile"}
                                    </button>
                                </form>
                                <h2>Change Password</h2>
                                <form className="profile-form" onSubmit={handlePasswordChange}>
                                    <PasswordField
                                        name="currentPassword"
                                        label="Current Password"
                                        value={formData.currentPassword}
                                        onChange={handleChange}
                                        required={true}
                                        submitted={submitted}
                                    />
                                    <PasswordField
                                        name="newPassword"
                                        label="New Password"
                                        value={formData.newPassword}
                                        onChange={handleChange}
                                        required={true}
                                        submitted={submitted}
                                    />
                                    <PasswordField
                                        name="confirmPassword"
                                        label="Confirm New Password"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        required={true}
                                        submitted={submitted}
                                    />
                                    <button type="submit" className="profile-button secondary" disabled={isLoading}>
                                        {isLoading ? "Changing..." : "Change Password"}
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Sidebar />
        </div>
    );
}

export default Profile;
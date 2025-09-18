import React, { useContext } from "react";
import { MyContext } from "../Context";
import services from "../Services";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

function useAuth() {
    const { userData, setUserData, token, setToken, searchConfig } = useContext(MyContext);
    const navigate = useNavigate();

    const register = async (formData) => {
        try {
            const newUser = {};
            for (const key in formData) {
                if (key == "confirmPassword") continue;
                if (formData[key] == "") formData[key] = null;
                newUser[key] = formData[key];
            }
            const res = await services.register({ userData: newUser });
            if (res.message == "register success") {
                setUserData(res.user);
                setToken(res.token);
                localStorage.setItem("jwtToken", res.token);
                toast.success(res.message, { position: "top-right" });
                return true;
            }
            toast.error(res.message, { position: "top-right" });
            return false;
        } catch (error) {
            console.log("registerError: ", error);
        }
    }

    const isValidateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(String(email).trim());
    }

    const login = async (user) => {
        try {
            const newUser = {};

            if (!isValidateEmail(user.email)) {
                newUser.name = user.email;
                newUser.password = user.password;
            }else{
                newUser.email = user.email;
                newUser.password = user.password;
            }

            // Add MFA code if provided
            if (user.mfaCode) {
                newUser.mfaCode = user.mfaCode;
            }

            const res = await services.login({newUser});
            
            if (res.message == "login success") {
                setUserData(res.user);
                setToken(res.token);
                localStorage.setItem("jwtToken", res.token);
                localStorage.setItem("userData", JSON.stringify(res.user));
                toast.success(res.message, { position: "top-right" });
                return true;
            } else if (res.message == "MFA required") {
                return "mfa_required";
            }
            
            toast.error(res.message, { position: "top-right" });
            return false;
        } catch (error) {
            console.log("loginError: ", error);
            toast.error("Login failed. Please try again.", { position: "top-right" });
            return false;
        }
    }
    
    const logout = () => {
        try {
            setUserData({ name: "", email: "" });
            setToken("");
            localStorage.setItem("jwtToken", "");
            navigate("/login");
        } catch (error) {
            console.log("logoutError: ", error);
        }
    }

    const isAuthenticated = async () => {
        try {
            const jwtToken = localStorage.getItem("jwtToken");
            if (jwtToken !== "") {
                const res = await services.isAuth({ token: jwtToken });
                if (res.message == "isAuth success") return true;
                toast.error(res.message);
                return false;
            }
            return false;
        } catch (error) {
            console.log("isAuthenticatedError: ", error);
        }
    }

    const getProfileData = (setProfileData, setFormData) => {
        try {
            const _profileData = searchConfig.filter((item) => { 
                return item.table_name === "registeration" 
            });
            
            _profileData.forEach((item) => {
                setFormData((prevFormData) => ({ 
                    ...prevFormData, 
                    [item.field_name]: userData[item.field_name] || "" 
                }));
            });
            setFormData((prevFormData) => ({
                ...prevFormData,
                name: userData.name,
                email: userData.email
            }))
            setProfileData(_profileData);
        } catch (error) {
            console.log("getProfileDataError: ", error);
        }
    }
    
    const updateProfile = async (formData, profileData) => {
        try {
            if(formData.name.trim() == "") throw new Error("Please input Username exactly!");
            if(formData.email.trim() == "") throw new Error("Please input Email exactly!");
            profileData.map((data) => {
                if(data.mandatory && (formData[data.field_name] == ""))throw new Error(`Please input required field exactly!`);
            })
            const updatedUserData = {};
            updatedUserData.name = formData.name;
            updatedUserData.email = formData.email;
            profileData.map((data) => {
                updatedUserData[data.field_name] = formData[data.field_name];
            })
            if(!window.confirm("Really want update profile?")) return;
            const res = await services.updateProfile(updatedUserData, userData.id);
            if(res.message == "updateProfile success"){
                toast.success("Profile updated successfully");
                setUserData(res.userData);
                setToken(res.token);
                localStorage.setItem("jwtToken", token);
                return;
            }
            toast.error(res.message);
        } catch (error) {
            toast.error(error.message);
            console.log("updateProfileError: ", error);
        }
    }
    
    const changePassword = async (formData, setFormData) => {
        try {
            if(formData.currentPassword.trim() == "" || formData.newPassword.trim() == "") throw new Error("Please input password exactly!");
            if(formData.newPassword.trim() !== formData.confirmPassword.trim()) {
                setFormData((prevFormData) => ({...prevFormData,confirmPassword: ""})); 
                throw new Error("Confirm passwod is wrong!");
            };
            if(!window.confirm("Really want to change password?")) return;
            const res = await services.changePassword(formData.currentPassword, formData.newPassword);
            if(res.message === "changePassword success"){
                toast.success("Password changed successfully");
                toast.info("Please log in again.");
                logout();
                return;
            }
            if(res.message == "Invalid current password"){
                setFormData((prevFormData) => ({...prevFormData, currentPassword: ""})); 
            }
            throw new Error(res.message);
        } catch (error) {
            console.log("changePassword: ", error);
            toast.error(error.message);
        }
    }

    const getQRCode = async () => {
        try {
            const res = await services.getQRCode();
            if(res.message == "getQRCode success"){
                return res.QRCode;
            }
            return {url: "", secret: ""};
        } catch (error) {
            console.log("getQRCodeError: ", error);
            return {url: "", secret: ""};
        }
    }

    const enableMFA = async (verificationCode) => {
        try {
            const res = await services.enableMFA(verificationCode);
            if (res.message === "enableMFA success") {
                setUserData({ ...userData, mfa: 1 });
                return true;
            }
            throw new Error(res.message);
        } catch (error) {
            console.log("enableMFAError: ", error);
            throw error;
        }
    }

    const disableMFA = async () => {
        try {
            const res = await services.disableMFA();
            if (res.message === "disableMFA success") {
                setUserData({ ...userData, mfa: 0 });
                return true;
            }
            throw new Error(res.message);
        } catch (error) {
            console.log("disableMFAError: ", error);
            throw error;
        }
    }

    return (
        { register, login, logout, isAuthenticated, userData, setUserData, getProfileData, updateProfile, changePassword, getQRCode, enableMFA, disableMFA }
    )
}

export default useAuth;
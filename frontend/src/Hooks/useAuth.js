import React, { useContext } from "react";
import { MyContext } from "../Context";
import services from "../Services";
import { toast } from "react-toastify";

function useAuth() {
    const { userData, setUserData, token, setToken } = useContext(MyContext);

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

    const login = async (user) => {
        try {
            const newUser = {};

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            const isFormatInvalid = emailRegex.test(String(user.email).trim());

            if (!isFormatInvalid) {
                newUser.name = user.email;
                newUser.password = user.password;
            }else{
                newUser.email = user.email;
                newUser.password = user.password;
            }

            const res = await services.login({newUser});
            if (res.message == "login success") {
                setUserData(res.user);
                setToken(res.token);
                localStorage.setItem("jwtToken", res.token);
                toast.success(res.message, { position: "top-right" });
                return true;
            }
            toast.error(res.message, { position: "top-right" });
            return false;
        } catch (error) {
            console.log("loginError: ", error);
        }
    }

    const logout = () => {
        try {
            setUserData({ name: "", email: "" });
            setToken("");
            localStorage.setItem("jwtToken", "");
        } catch (error) {
            console.log("logoutError: ", error);
        }
    }

    const isAuthenticated = async () => {
        const jwtToken = localStorage.getItem("jwtToken");
        if (jwtToken !== "") {
            const res = await services.isAuth({ token: jwtToken });
            if (res.message == "isAuth success") return true;
            return false;
        }
        return false;
    }

    return (
        { register, login, logout, isAuthenticated, userData }
    )
}

export default useAuth;
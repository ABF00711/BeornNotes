import React, { useContext } from "react";
import { MyContext } from "../Context";
import services from "../Services";
import {toast} from "react-toastify";

function useAuth(){
    const {userData, setUserData, token, setToken} = useContext(MyContext);

    const register = async (newUser) => {
        try {
            const res = await services.register({name:newUser.name, email:newUser.email, password:newUser.password});
            if (res.message == "register success"){
                setUserData(res.user);
                setToken(res.token);
                toast.success(res.message, {position: "top-right"});
                return true;
            }
            toast.error(res.message, {position: "top-right"});
            return false;
        } catch (error) {
            console.log("registerError: ", error);
        }
    }

    const login = async (user) => {
        try {
            const res = await services.login({email: user.email, password: user.password});
            if (res.message == "login success"){
                setUserData(res.user);
                setToken(res.token);
                toast.success(res.message, {position: "top-right"});
                return true;
            }
            toast.error(res.message, {position: "top-right"});
            return false;
        } catch (error) {
            console.log("loginError: ", error);
        }
    }

    return (
        {register, login}
    )
}

export default useAuth;
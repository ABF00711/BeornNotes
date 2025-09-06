import React, { useContext } from "react";
import { MyContext } from "../Context";
import services from "../Services";
import {toast} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

function useAuth(){
    const {userData, setUserData, token, setToken} = useContext(MyContext);

    const register = async (newUser) => {
        try {
            const res = await services.register({name:newUser.name, email:newUser.email, password:newUser.password});
            if (res.message == "register success"){
                setUserData(res.user);
                setToken(res.token);
                toast.success(res.message);
                return true;
            }
            toast.error(res.message);
            return false;
        } catch (error) {
            console.log("registerError: ", error);
        }
    }

    return (
        {register, }
    )
}

export default useAuth;
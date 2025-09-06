import { createContext, useState, useContext, useMemo, useEffect } from "react";
import services from "../Services";

const DataContext = createContext();

export const MyContext = DataContext;

function ContextProvider({children}){
    const [userData, setUserData] = useState({
        name:"",
        email:""
    })
    const [token, setToken] = useState("");

    useEffect(() => {
        localStorage.setItem("jwtToken", token);
    }, [token])

    return (
        <DataContext.Provider value={{userData, setUserData, token, setToken}}>
            {children}
        </DataContext.Provider>
    )
}

export default ContextProvider;
import { createContext, useState, useContext, useMemo, useEffect } from "react";
import services from "../Services";
import useSearchConfig from "../Hooks/useSearchConfig";

const DataContext = createContext([]);

export const MyContext = DataContext;

function ContextProvider({children}){
    const [userData, setUserData] = useState({
        name:"",
        email:""
    })
    const [token, setToken] = useState("");
    const [searchConfig, setSearchConfig] = useState([]);

    useEffect(() => {
        localStorage.setItem("jwtToken", token);
    }, [token])


    return (
        <DataContext.Provider value={{userData, setUserData, token, setToken, searchConfig, setSearchConfig}}>
            {children}
        </DataContext.Provider>
    )
}

export default ContextProvider;
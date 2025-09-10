import { createContext, useState, useContext, useMemo, useEffect } from "react";
import { useLocation } from "react-router-dom";

const DataContext = createContext([]);

export const MyContext = DataContext;

function ContextProvider({children}){
    const [userData, setUserData] = useState({
        name:"",
        email:""
    })
    const [token, setToken] = useState("");
    const [searchConfig, setSearchConfig] = useState([]);
    const [menuItems, setMenuItems] = useState([
        {
            id:0,
            screen_id: "dashboard",
            title: "Dashboard",
            icon: "📊",
            path: "/",
            active: "",
            parent_id: null
        },
    ]);

    useEffect(() => {
        localStorage.setItem("jwtToken", token);
    }, [token])


    return (
        <DataContext.Provider value={{userData, setUserData, token, setToken, searchConfig, setSearchConfig, menuItems, setMenuItems}}>
            {children}
        </DataContext.Provider>
    )
}

export default ContextProvider;
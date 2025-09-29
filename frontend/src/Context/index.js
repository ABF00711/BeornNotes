import { createContext, useState, useContext, useMemo, useEffect } from "react";
import { json, useLocation } from "react-router-dom";

const DataContext = createContext([]);

export const MyContext = DataContext;

function ContextProvider({ children }) {
    const [userData, setUserData] = useState({
        name: "",
        email: ""
    })
    const [token, setToken] = useState("");
    const [searchConfig, setSearchConfig] = useState([]);
    const [dynamicData, setDynamicData] = useState([]);
    const [menuItems, setMenuItems] = useState([]);
    const [tabbedInterfaces, setTabbedInterfaces] = useState([]);
    const [currentInterface, setCurrentInterface] = useState({
        tabbedBtns: [],
        activeUrl:"/"
    });
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [searchpatterns, setSearchpatterns] = useState([]);
    const [layouts, setLayouts] = useState([]);
    
    const [jobs, setJobs] = useState([]);

    useEffect(() => {
        const savedUserData = JSON.parse(localStorage.getItem("userData") || null);
        const savedCurrentInterface = JSON.parse(localStorage.getItem("currentInterface") || null);
        if(!!savedCurrentInterface){
            setCurrentInterface(savedCurrentInterface);
        }
        if(!!savedUserData){
            setUserData(savedUserData);
        }
    }, [])

    return (
        <DataContext.Provider value={{
            userData, setUserData,
            token, setToken,
            searchConfig, setSearchConfig,
            menuItems, setMenuItems,
            tabbedInterfaces, setTabbedInterfaces,
            isCollapsed, setIsCollapsed,
            dynamicData, setDynamicData,
            searchpatterns, setSearchpatterns,
            layouts, setLayouts,
            currentInterface, setCurrentInterface,
            jobs, setJobs
        }}>
            {children}
        </DataContext.Provider>
    )
}

export default ContextProvider;
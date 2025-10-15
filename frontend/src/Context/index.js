import { createContext, useState, useContext, useMemo, useEffect } from "react";
import { json, useLocation } from "react-router-dom";

const DataContext = createContext([]);

export const MyContext = DataContext;

const defaultUserTime = 10;

function ContextProvider({ children }) {
    const [userData, setUserData] = useState({
        name: "",
        email: ""
    })
    const [token, setToken] = useState("");
    const [searchConfig, setSearchConfig] = useState([]);
    const [tableNames, setTableNames] = useState({});
    const [dynamicData, setDynamicData] = useState([]);
    const [menuItems, setMenuItems] = useState([]);
    const [tabbedInterfaces, setTabbedInterfaces] = useState([]);
    const [currentInterface, setCurrentInterface] = useState({
        tabbedBtns: [],
        activeUrl: "/"
    });
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [searchpatterns, setSearchpatterns] = useState([]);
    const [layouts, setLayouts] = useState([]);

    const [jobs, setJobs] = useState([]);
    const [userTime, setUserTime] = useState(defaultUserTime);

    useEffect(() => {
        const savedUserData = JSON.parse(localStorage.getItem("userData") || null);
        const savedUserTime = JSON.parse(localStorage.getItem(`${savedUserData.name}`) || null);
        if (!!savedUserData) {
            setUserData(savedUserData);
        }
        if (!savedUserTime) setUserTime(savedUserTime);
    }, [])

    const initializeStateData = () => {
        setUserData({
            name: "",
            email: ""
        });
        setToken("");
        setSearchConfig([]);
        setTableNames({});
        setDynamicData([]);
        setMenuItems([]);
        setTabbedInterfaces([]);
        setCurrentInterface({
            tabbedBtns: [],
            activeUrl: "/"
        });
        setIsCollapsed(false);
        setSearchpatterns([]);
        setLayouts([]);
        setJobs([]);
        setUserTime(defaultUserTime);
    }

    return (
        <DataContext.Provider value={{
            initializeStateData,
            userData, setUserData,
            token, setToken,
            tableNames, setTableNames,
            searchConfig, setSearchConfig,
            menuItems, setMenuItems,
            tabbedInterfaces, setTabbedInterfaces,
            isCollapsed, setIsCollapsed,
            dynamicData, setDynamicData,
            searchpatterns, setSearchpatterns,
            layouts, setLayouts,
            currentInterface, setCurrentInterface,
            jobs, setJobs,
            userTime, setUserTime
        }}>
            {children}
        </DataContext.Provider>
    )
}

export default ContextProvider;
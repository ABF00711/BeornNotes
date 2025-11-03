import { createContext, useState, useEffect, useMemo } from "react";

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

    const [documents, setDocuments] = useState([]);
    const [userTime, setUserTime] = useState(defaultUserTime);

    useEffect(() => {
        const savedUserData = JSON.parse(localStorage.getItem("userData") || null);
        if (!!savedUserData) {
            setUserData(savedUserData);
        }
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
        setDocuments([]);
        setUserTime(defaultUserTime);
    }

    const contextValue = useMemo(() => ({
        initializeStateData,
        userData, setUserData,
        token, setToken,
        tableNames, setTableNames,
        searchConfig, setSearchConfig,
        menuItems, setMenuItems,
        tabbedInterfaces, setTabbedInterfaces,
        isCollapsed, setIsCollapsed,
        dynamicData, setDynamicData,
        currentInterface, setCurrentInterface,
        userTime, setUserTime,
        documents, setDocuments,
    }), [
        initializeStateData,
        userData, token, tableNames, searchConfig, menuItems,
        tabbedInterfaces, isCollapsed, dynamicData,
        currentInterface, userTime, documents,
    ]);

    return (
        <DataContext.Provider value={contextValue}>
            {children}
        </DataContext.Provider>
    )
}

export default ContextProvider;
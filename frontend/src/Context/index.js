import { createContext, useState, useContext, useMemo, useEffect } from "react";
import { useLocation } from "react-router-dom";

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
    const [tabbedBtns, setTabbedBtns] = useState([]);
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [searchpatterns, setSearchpatterns] = useState([]);
    const [layouts, setLayouts] = useState([]);

    return (
        <DataContext.Provider value={{
            userData, setUserData,
            token, setToken,
            searchConfig, setSearchConfig,
            menuItems, setMenuItems,
            tabbedBtns, setTabbedBtns,
            isCollapsed, setIsCollapsed,
            dynamicData, setDynamicData,
            searchpatterns, setSearchpatterns,
            layouts, setLayouts
        }}>
            {children}
        </DataContext.Provider>
    )
}

export default ContextProvider;
import React, { useMemo } from "react";
import { createContext, useState, useContext, useMemo } from "react";

const DataContext = createContext();

export const useData = () => useContext(DataContext);

const defaultData = {
    user:"",
    token:"",
    isAuthenticated:false,
    customers:[]
}

function ContextProvider({children}){
    const [data, setData] = useState(defaultData);

    const currentData = useMemo(() => ({...data, setData}), [data]);

    return (
        <DataContext.Provider value={currentData}>
            {children}
        </DataContext.Provider>
    )
}

export default ContextProvider;
import { createContext, useState, useMemo } from "react";

export const SearchPatternContext = createContext();

export function SearchPatternProvider({ children }) {
    const [searchpatterns, setSearchpatterns] = useState([]);

    const value = useMemo(() => ({ searchpatterns, setSearchpatterns }), [searchpatterns]);

    return (
        <SearchPatternContext.Provider value={value}>
            {children}
        </SearchPatternContext.Provider>
    );
}


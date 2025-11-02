import { createContext, useState, useMemo } from "react";

export const LayoutContext = createContext();

export function LayoutProvider({ children }) {
    const [layouts, setLayouts] = useState([]);

    const value = useMemo(() => ({ layouts, setLayouts }), [layouts]);

    return (
        <LayoutContext.Provider value={value}>
            {children}
        </LayoutContext.Provider>
    );
}
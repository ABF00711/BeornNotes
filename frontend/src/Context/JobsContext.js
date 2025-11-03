import { createContext, useState, useMemo } from "react";

export const JobsContext = createContext();

export function JobsProvider({ children }) {
    const [jobs, setJobs] = useState([]);

    const value = useMemo(() => ({ jobs, setJobs }), [jobs]);

    return (
        <JobsContext.Provider value={value}>
            {children}
        </JobsContext.Provider>
    );
}


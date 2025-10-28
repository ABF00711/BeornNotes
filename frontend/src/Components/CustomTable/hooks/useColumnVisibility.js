import { useState, useRef, useEffect } from 'react';

/**
 * Custom hook for column visibility management
 */
const useColumnVisibility = (displayColumns) => {
    const [columnVisibilities, setColumnVisibilities] = useState(() =>
        displayColumns.reduce((acc, col) => ({ ...acc, [col.field]: true }), {})
    );
    const [showColumnMenu, setShowColumnMenu] = useState(false);
    const columnMenuRef = useRef(null);

    // Close column menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (columnMenuRef.current && !columnMenuRef.current.contains(event.target)) {
                setShowColumnMenu(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const toggleColumnVisibility = (field) => {
        setColumnVisibilities(prev => ({
            ...prev,
            [field]: !prev[field]
        }));
    };

    const resetColumnVisibility = () => {
        const resetVisibilities = displayColumns.reduce((acc, col) => {
            if (col.field !== 'checkbox' && col.field !== 'actions') {
                acc[col.field] = true;
            }
            return acc;
        }, {});
        setColumnVisibilities(resetVisibilities);
    };

    const getVisibleColumns = () => {
        return displayColumns.filter(col =>
            col.field !== 'checkbox' && 
            col.field !== 'actions' && 
            columnVisibilities[col.field] !== false
        );
    };

    return {
        columnVisibilities,
        showColumnMenu,
        columnMenuRef,
        setShowColumnMenu,
        toggleColumnVisibility,
        resetColumnVisibility,
        getVisibleColumns
    };
};

export default useColumnVisibility;


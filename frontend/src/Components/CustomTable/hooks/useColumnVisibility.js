import { useState, useRef, useEffect } from 'react';

/**
 * Custom hook for column visibility management
 * Uses visible property on each column instead of separate state
 */
const useColumnVisibility = (displayColumns, setDisplayColumns) => {
    const [showColumnMenu, setShowColumnMenu] = useState(false);
    const columnMenuRef = useRef(null);
    const [columnVisibleChanged, setColumnVisibleChanged] = useState(false);

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
        setDisplayColumns(prevColumns => {
            const updatedColumns = prevColumns.map(col => {
                if (col.field === field) {
                    const currentVisible = col.visible === undefined ? true : col.visible;
                    return {
                        ...col,
                        visible: !currentVisible
                    };
                }
                return col;
            });
            
            setColumnVisibleChanged(true);
            return updatedColumns;
        });
    };

    const resetColumnVisibility = () => {
        setDisplayColumns(prevColumns => {
            const updatedColumns = prevColumns.map(col => {
                if (col.field !== 'checkbox' && col.field !== 'actions') {
                    return {
                        ...col,
                        visible: true
                    };
                }
                return col;
            });
            
            setColumnVisibleChanged(true);
            return updatedColumns;
        });
    };

    const getVisibleColumns = () => {
        return displayColumns.filter(col =>
            col.field !== 'checkbox' && 
            col.field !== 'actions' && 
            col.visible !== false
        );
    };

    return {
        columnVisibleChanged,
        setColumnVisibleChanged,
        showColumnMenu,
        columnMenuRef,
        setShowColumnMenu,
        toggleColumnVisibility,
        resetColumnVisibility,
        getVisibleColumns
    };
};

export default useColumnVisibility;


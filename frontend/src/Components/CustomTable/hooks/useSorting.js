import { useState, useMemo, useEffect } from 'react';

/**
 * Custom hook for sorting functionality
 */
const useSorting = (data, tableColumns) => {
    const [sortConfig, setSortConfig] = useState({ field: null, direction: null, type: null });

    const handleSort = (field, columnType) => {
        let direction = 'asc';

        if (sortConfig.field === field) {
            if (sortConfig.direction === 'asc') {
                direction = 'desc';
            } else if (sortConfig.direction === 'desc') {
                direction = null;
            }
        }

        setSortConfig({ 
            field: direction ? field : null, 
            direction, 
            type: columnType 
        });
    };

    const handleClearSort = () => {
        setSortConfig({ field: null, direction: null, type: null });
    };

    const sortedData = useMemo(() => {
        if (!sortConfig.field || !sortConfig.direction) {
            return data;
        }

        const sorted = [...data].sort((a, b) => {
            const aValue = a[sortConfig.field];
            const bValue = b[sortConfig.field];

            if (aValue === null || aValue === undefined) return 1;
            if (bValue === null || bValue === undefined) return -1;

            let comparison = 0;

            switch (sortConfig.type) {
                case 'date':
                    const dateA = new Date(aValue);
                    const dateB = new Date(bValue);
                    comparison = dateA.getTime() - dateB.getTime();
                    break;

                case 'number':
                    const numA = typeof aValue === 'number' ? aValue : parseFloat(aValue) || 0;
                    const numB = typeof bValue === 'number' ? bValue : parseFloat(bValue) || 0;
                    comparison = numA - numB;
                    break;

                case 'text':
                default:
                    comparison = String(aValue).localeCompare(String(bValue));
                    break;
            }

            return sortConfig.direction === 'asc' ? comparison : -comparison;
        });

        return sorted;
    }, [data, sortConfig]);

    useEffect(() => {
        setSortConfig(tableColumns?.sort || { field: null, direction: null, type: null })
    }, [tableColumns])

    return {
        sortConfig,
        sortedData,
        handleSort,
        handleClearSort
    };
};

export default useSorting;


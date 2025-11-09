import { useState, useMemo, useEffect } from 'react';
import { evaluateCondition, initializeFilter } from '../utils/tableUtils';

/**
 * Custom hook for filtering functionality
 */
const useFiltering = (sortedData, displayColumns, tableColumns) => {
    const [columnFilters, setColumnFilters] = useState({});
    const [activeFilterMenu, setActiveFilterMenu] = useState(null);

    // Close filter menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (activeFilterMenu && 
                !event.target.closest('.advanced-filter-menu') && 
                !event.target.closest('.filter-menu-btn')) {
                setActiveFilterMenu(null);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [activeFilterMenu]);

    const filteredData = useMemo(() => {
        if (Object.keys(columnFilters).length === 0) {
            return sortedData;
        }

        return sortedData.filter(row => {
            return Object.entries(columnFilters).every(([field, filterConfig]) => {
                if (!filterConfig || !filterConfig.conditions || filterConfig.conditions.length === 0) {
                    return true;
                }

                const column = displayColumns.find(col => col.field === field);
                const columnType = column?.type || 'text';
                const cellValue = row[field];

                const results = filterConfig.conditions.map(condition =>
                    evaluateCondition(cellValue, condition.operator, condition.value, columnType)
                );

                if (filterConfig.logic === 'or') {
                    return results.some(r => r);
                } else {
                    return results.every(r => r);
                }
            });
        });
    }, [sortedData, columnFilters, displayColumns]);

    const toggleFilterMenu = (field, e) => {
        e.stopPropagation();
        setActiveFilterMenu(activeFilterMenu === field ? null : field);
    };

    const updateFilterCondition = (field, conditionIndex, updates) => {
        setColumnFilters(prev => {
            // Get the column type from displayColumns
            const column = displayColumns.find(col => col.field === field);
            const columnType = column?.type || 'text';
            
            const currentFilter = prev[field] || initializeFilter(field, columnType);
            const newConditions = [...currentFilter.conditions];
            newConditions[conditionIndex] = { ...newConditions[conditionIndex], ...updates };
            
            // If updating value and it's empty, check if we should remove the filter
            if ('value' in updates) {
                const isEmpty = updates.value === '' || updates.value === null || updates.value === undefined;
                const updatedCondition = newConditions[conditionIndex];
                
                // For operators that don't need a value (empty, notEmpty), keep the filter
                const operatorNeedsValue = updatedCondition.operator !== 'empty' && updatedCondition.operator !== 'notEmpty';
                
                if (isEmpty && operatorNeedsValue) {
                    // If this is the only condition, remove the entire filter
                    if (newConditions.length === 1) {
                        const { [field]: removed, ...rest } = prev;
                        return rest;
                    }
                    // Otherwise, remove this specific condition
                    const filteredConditions = newConditions.filter((_, idx) => idx !== conditionIndex);
                    return {
                        ...prev,
                        [field]: { ...currentFilter, conditions: filteredConditions }
                    };
                }
            }
            
            return {
                ...prev,
                [field]: { ...currentFilter, conditions: newConditions }
            };
        });
    };

    const addFilterCondition = (field, columnType) => {
        setColumnFilters(prev => {
            const currentFilter = prev[field] || initializeFilter(field, columnType);
            const defaultOperator = columnType === 'number' ? 'equal' : columnType === 'date' ? 'equal' : 'contains';
            return {
                ...prev,
                [field]: {
                    ...currentFilter,
                    conditions: [...currentFilter.conditions, { operator: defaultOperator, value: '' }]
                }
            };
        });
    };

    const removeFilterCondition = (field, conditionIndex) => {
        setColumnFilters(prev => {
            const currentFilter = prev[field];
            if (!currentFilter) return prev;

            const newConditions = currentFilter.conditions.filter((_, idx) => idx !== conditionIndex);
            if (newConditions.length === 0) {
                const { [field]: removed, ...rest } = prev;
                return rest;
            }

            return {
                ...prev,
                [field]: { ...currentFilter, conditions: newConditions }
            };
        });
    };

    const toggleFilterLogic = (field) => {
        setColumnFilters(prev => {
            const currentFilter = prev[field];
            if (!currentFilter) return prev;
            return {
                ...prev,
                [field]: { ...currentFilter, logic: currentFilter.logic === 'and' ? 'or' : 'and' }
            };
        });
    };

    const applyColumnFilter = () => {
        setActiveFilterMenu(null);
    };

    const clearColumnFilter = (field) => {
        setColumnFilters(prev => {
            const { [field]: removed, ...rest } = prev;
            return rest;
        });
        setActiveFilterMenu(null);
    };

    const clearAllFilters = () => {
        setColumnFilters({});
    };

    const handleQuickFilterChange = (field, value, columnType) => {
        if (value) {
            if (!columnFilters[field]) {
                setColumnFilters(prev => ({
                    ...prev,
                    [field]: {
                        conditions: [{
                            operator: columnType === 'number' ? 'equal' : columnType === 'date' ? 'equal' : 'contains',
                            value: value
                        }],
                        logic: 'and'
                    }
                }));
            } else {
                // If previously applied via Excel filter (in/notIn), replace with text/number operator
                const current = columnFilters[field];
                const currentOp = current?.conditions?.[0]?.operator;
                if (currentOp === 'in' || currentOp === 'notIn') {
                    setColumnFilters(prev => ({
                        ...prev,
                        [field]: {
                            conditions: [{
                                operator: columnType === 'number' ? 'equal' : columnType === 'date' ? 'equal' : 'contains',
                                value
                            }],
                            logic: 'and'
                        }
                    }));
                } else {
                    updateFilterCondition(field, 0, { value });
                }
            }
        } else {
            clearColumnFilter(field);
        }
    };

    const applyExcelFilter = (field, values, columnType) => {
        setColumnFilters(prev => {
            // If all values selected or none provided, clear filter
            if (!values || values.length === 0) {
                const { [field]: removed, ...rest } = prev;
                return rest;
            }
            return {
                ...prev,
                [field]: {
                    conditions: [{ operator: 'in', value: values }],
                    logic: 'and'
                }
            };
        });
        setActiveFilterMenu(null);
    };

    useEffect(() => {
        setColumnFilters(tableColumns?.filterConfig || {})
    }, [tableColumns])

    return {
        columnFilters,
        activeFilterMenu,
        filteredData,
        toggleFilterMenu,
        updateFilterCondition,
        addFilterCondition,
        removeFilterCondition,
        toggleFilterLogic,
        applyColumnFilter,
        clearColumnFilter,
        clearAllFilters,
        handleQuickFilterChange,
        applyExcelFilter
    };
};

export default useFiltering;


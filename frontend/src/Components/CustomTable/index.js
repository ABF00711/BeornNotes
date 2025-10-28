import React, { useState, useRef, useEffect, useMemo } from 'react';
import './style.css';

// Filter operators for different column types
const TEXT_OPERATORS = [
    { value: 'contains', label: 'contains' },
    { value: 'notContains', label: 'does not contain' },
    { value: 'equals', label: 'equals' },
    { value: 'notEquals', label: 'not equals' },
    { value: 'startsWith', label: 'starts with' },
    { value: 'endsWith', label: 'ends with' },
    { value: 'empty', label: 'empty' },
    { value: 'notEmpty', label: 'not empty' }
];

const NUMBER_OPERATORS = [
    { value: 'equal', label: 'equal' },
    { value: 'notEqual', label: 'not equal' },
    { value: 'lessThan', label: 'less than' },
    { value: 'lessThanOrEqual', label: 'less than or equal' },
    { value: 'greaterThan', label: 'greater than' },
    { value: 'greaterThanOrEqual', label: 'greater than or equal' },
    { value: 'empty', label: 'empty' },
    { value: 'notEmpty', label: 'not empty' }
];

const DATE_OPERATORS = [
    { value: 'equal', label: 'equal' },
    { value: 'notEqual', label: 'not equal' },
    { value: 'before', label: 'before' },
    { value: 'beforeOrEqual', label: 'before or equal' },
    { value: 'after', label: 'after' },
    { value: 'afterOrEqual', label: 'after or equal' },
    { value: 'empty', label: 'empty' },
    { value: 'notEmpty', label: 'not empty' }
];

const CustomTable = ({
    columns = [],
    data = [],
    onRowClick = () => { },
    loading = false,
    onSelectionChange = () => { },
    onEdit = () => { },
    onDelete = () => { },
    filteredData = null
}) => {

    // Sample columns for initial UI
    const sampleColumns = [
        { field: 'fullname', header: 'Full Name', width: '180px', type: "text" },
        { field: 'displayname', header: 'Display Name', width: '150px', type: "text" },
        { field: 'birthday', header: 'Birthday', width: '120px', type: "date" },
        { field: 'age', header: 'Age', width: '100px', type: "number" },
        { field: 'job', header: 'Job', width: '150px', type: "text" }
    ];

    const sampleData = [
        { id: 1, fullname: 'John Doe', displayname: 'John D', birthday: '1990-05-15', age: 34, job: 'Developer' },
        { id: 2, fullname: 'Jane Smith', displayname: 'Jane S', birthday: '1988-08-20', age: 36, job: 'Designer' },
        { id: 3, fullname: 'Bob Johnson', displayname: 'Bob J', birthday: '1992-12-10', age: 32, job: 'Manager' },
        { id: 4, fullname: 'Alice Brown', displayname: 'Alice B', birthday: '1985-03-25', age: 39, job: 'Analyst' },
        { id: 5, fullname: 'Charlie Wilson', displayname: 'Charlie W', birthday: '1995-07-05', age: 29, job: 'Engineer' }
    ];

    const tableColumns = useMemo(() => {
        return columns.length > 0 ? columns : sampleColumns;
    }, [columns]);

    const tableData = useMemo(() => {
        return data.length > 0 ? data : sampleData;
    }, [data]);

    // State management
    const [displayColumns, setDisplayColumns] = useState(tableColumns);
    const [selectedRows, setSelectedRows] = useState(new Set());
    const [columnVisibilities, setColumnVisibilities] = useState(() =>
        tableColumns.reduce((acc, col) => ({ ...acc, [col.field]: true }), {})
    );
    const [draggedColumn, setDraggedColumn] = useState(null);
    const [resizingColumn, setResizingColumn] = useState(null);
    const [showColumnMenu, setShowColumnMenu] = useState(false);
    const [sortConfig, setSortConfig] = useState({ field: null, direction: null });
    const [activeFilterMenu, setActiveFilterMenu] = useState(null); // Track which column's filter menu is open
    const [columnFilters, setColumnFilters] = useState({}); // Store filter conditions per column

    const displayData = filteredData !== null ? filteredData : tableData;

    // Sort data based on sortConfig
    const sortedData = useMemo(() => {
        if (!sortConfig.field || !sortConfig.direction) {
            return displayData;
        }

        const sorted = [...displayData].sort((a, b) => {
            const aValue = a[sortConfig.field];
            const bValue = b[sortConfig.field];

            // Handle null/undefined values
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
    }, [displayData, sortConfig]);

    // Evaluate a single filter condition
    const evaluateCondition = (cellValue, operator, filterValue, columnType) => {
        // Handle empty/notEmpty operators
        if (operator === 'empty') {
            return cellValue === null || cellValue === undefined || cellValue === '';
        }
        if (operator === 'notEmpty') {
            return cellValue !== null && cellValue !== undefined && cellValue !== '';
        }

        // Return true if no filter value provided (except for empty/notEmpty)
        if (!filterValue && filterValue !== 0) return true;

        // Handle null/undefined values
        if (cellValue === null || cellValue === undefined) return false;

        switch (columnType) {
            case 'text':
                const strValue = String(cellValue).toLowerCase();
                const strFilter = String(filterValue).toLowerCase();
                switch (operator) {
                    case 'contains': return strValue.includes(strFilter);
                    case 'notContains': return !strValue.includes(strFilter);
                    case 'equals': return strValue === strFilter;
                    case 'notEquals': return strValue !== strFilter;
                    case 'startsWith': return strValue.startsWith(strFilter);
                    case 'endsWith': return strValue.endsWith(strFilter);
                    default: return true;
                }

            case 'number':
                const numValue = typeof cellValue === 'number' ? cellValue : parseFloat(cellValue);
                const numFilter = parseFloat(filterValue);
                if (isNaN(numValue) || isNaN(numFilter)) return false;
                switch (operator) {
                    case 'equal': return numValue === numFilter;
                    case 'notEqual': return numValue !== numFilter;
                    case 'lessThan': return numValue < numFilter;
                    case 'lessThanOrEqual': return numValue <= numFilter;
                    case 'greaterThan': return numValue > numFilter;
                    case 'greaterThanOrEqual': return numValue >= numFilter;
                    default: return true;
                }

            case 'date':
                const cellDate = new Date(cellValue);
                const filterDate = new Date(filterValue);
                if (isNaN(cellDate.getTime()) || isNaN(filterDate.getTime())) return false;

                // Normalize to date only (ignore time)
                const cellDateOnly = new Date(cellDate.getFullYear(), cellDate.getMonth(), cellDate.getDate());
                const filterDateOnly = new Date(filterDate.getFullYear(), filterDate.getMonth(), filterDate.getDate());
                const cellTime = cellDateOnly.getTime();
                const filterTime = filterDateOnly.getTime();

                switch (operator) {
                    case 'equal': return cellTime === filterTime;
                    case 'notEqual': return cellTime !== filterTime;
                    case 'before': return cellTime < filterTime;
                    case 'beforeOrEqual': return cellTime <= filterTime;
                    case 'after': return cellTime > filterTime;
                    case 'afterOrEqual': return cellTime >= filterTime;
                    default: return true;
                }

            default:
                return true;
        }
    };

    // Filter data based on column filters
    const filteredAndSortedData = useMemo(() => {
        if (Object.keys(columnFilters).length === 0) {
            return sortedData;
        }

        return sortedData.filter(row => {
            // Check all column filters
            return Object.entries(columnFilters).every(([field, filterConfig]) => {
                if (!filterConfig || !filterConfig.conditions || filterConfig.conditions.length === 0) {
                    return true;
                }

                const column = displayColumns.find(col => col.field === field);
                const columnType = column?.type || 'text';
                const cellValue = row[field];

                // Evaluate all conditions for this column
                const results = filterConfig.conditions.map(condition =>
                    evaluateCondition(cellValue, condition.operator, condition.value, columnType)
                );

                // Apply AND/OR logic between conditions
                if (filterConfig.logic === 'or') {
                    return results.some(r => r);
                } else {
                    return results.every(r => r);
                }
            });
        });
    }, [sortedData, columnFilters, displayColumns]);

    const tableRef = useRef(null);
    const columnMenuRef = useRef(null);

    // No useEffect needed here - initial state already has columns

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

    // Close filter menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (activeFilterMenu && !event.target.closest('.advanced-filter-menu') && !event.target.closest('.filter-menu-btn')) {
                setActiveFilterMenu(null);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [activeFilterMenu]);

    // Handle all selection toggle
    const handleSelectAll = (e) => {
        if (e.target.checked) {
            const allIds = new Set(filteredAndSortedData.map(row => row.id));
            setSelectedRows(allIds);
            onSelectionChange(Array.from(allIds));
        } else {
            setSelectedRows(new Set());
            onSelectionChange([]);
        }
    };

    // Handle individual row selection
    const handleRowSelect = (rowId, e) => {
        e.stopPropagation();
        const newSelected = new Set(selectedRows);
        if (newSelected.has(rowId)) {
            newSelected.delete(rowId);
        } else {
            newSelected.add(rowId);
        }
        setSelectedRows(newSelected);
        onSelectionChange(Array.from(newSelected));
    };

    // Column reorder handlers
    const handleDragStart = (e, columnIndex) => {
        setDraggedColumn(columnIndex);
        e.dataTransfer.effectAllowed = 'move';
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
    };

    const handleDrop = (e, dropIndex) => {
        e.preventDefault();
        if (draggedColumn === null) return;

        const newColumns = [...displayColumns];
        const draggedCol = newColumns[draggedColumn];
        newColumns.splice(draggedColumn, 1);
        newColumns.splice(dropIndex, 0, draggedCol);
        setDisplayColumns(newColumns);
        setDraggedColumn(null);
    };

    // Column resize handlers (right border)
    const handleResizeStart = (e, columnIndex, column) => {
        e.preventDefault();
        e.stopPropagation();
        if (column.field === 'checkbox' || column.field === 'actions') return;

        setResizingColumn(columnIndex);
        const startX = e.clientX;
        const startWidth = column.width || '150px';
        const startWidthNum = parseInt(startWidth);

        // Change cursor to col-resize and prevent text selection
        document.body.style.cursor = 'col-resize';
        document.body.style.userSelect = 'none';

        const handleMouseMove = (moveEvent) => {
            moveEvent.preventDefault();
            const diff = moveEvent.clientX - startX;
            const newWidth = startWidthNum + diff;
            if (newWidth > 50) {
                const updatedColumns = [...displayColumns];
                updatedColumns[columnIndex] = {
                    ...updatedColumns[columnIndex],
                    width: `${newWidth}px`
                };
                setDisplayColumns(updatedColumns);
            }
        };

        const handleMouseUp = () => {
            document.body.style.cursor = '';
            document.body.style.userSelect = '';
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
            setResizingColumn(null);
        };

        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
    };

    // Column resize handlers (left border)
    const handleLeftResizeStart = (e, columnIndex, column) => {
        e.preventDefault();
        e.stopPropagation();
        if (column.field === 'checkbox' || column.field === 'actions') return;

        setResizingColumn(columnIndex);
        const startX = e.clientX;
        const startWidth = column.width || '150px';
        const startWidthNum = parseInt(startWidth);

        // Change cursor to col-resize and prevent text selection
        document.body.style.cursor = 'col-resize';
        document.body.style.userSelect = 'none';

        const handleMouseMove = (moveEvent) => {
            moveEvent.preventDefault();
            const diff = startX - moveEvent.clientX; // Reversed diff for left resize
            const newWidth = startWidthNum + diff;
            if (newWidth > 50) {
                const updatedColumns = [...displayColumns];
                updatedColumns[columnIndex] = {
                    ...updatedColumns[columnIndex],
                    width: `${newWidth}px`
                };
                setDisplayColumns(updatedColumns);
            }
        };

        const handleMouseUp = () => {
            document.body.style.cursor = '';
            document.body.style.userSelect = '';
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
            setResizingColumn(null);
        };

        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
    };

    // Toggle column visibility
    const toggleColumnVisibility = (field) => {
        setColumnVisibilities(prev => ({
            ...prev,
            [field]: !prev[field]
        }));
    };

    // Reset all columns to visible
    const resetColumnVisibility = () => {
        const resetVisibilities = displayColumns.reduce((acc, col) => {
            if (col.field !== 'checkbox' && col.field !== 'actions') {
                acc[col.field] = true;
            }
            return acc;
        }, {});
        setColumnVisibilities(resetVisibilities);
    };

    // Handle column sorting
    const handleSort = (field, columnType) => {
        let direction = 'asc';

        if (sortConfig.field === field) {
            if (sortConfig.direction === 'asc') {
                direction = 'desc';
            } else if (sortConfig.direction === 'desc') {
                direction = null;
            }
        }

        setSortConfig({ field: direction ? field : null, direction, type: columnType });
    };

    // Toggle filter menu for a column
    const toggleFilterMenu = (field, e) => {
        e.stopPropagation();
        setActiveFilterMenu(activeFilterMenu === field ? null : field);
    };

    // Get operators for column type
    const getOperatorsForType = (type) => {
        switch (type) {
            case 'number':
                return NUMBER_OPERATORS;
            case 'date':
                return DATE_OPERATORS;
            case 'text':
            default:
                return TEXT_OPERATORS;
        }
    };

    // Initialize filter for a column
    const initializeFilter = (field, columnType) => {
        const defaultOperator = columnType === 'number' ? 'equal' : columnType === 'date' ? 'equal' : 'contains';
        return {
            conditions: [{ operator: defaultOperator, value: '' }],
            logic: 'and'
        };
    };

    // Update filter condition
    const updateFilterCondition = (field, conditionIndex, updates) => {
        setColumnFilters(prev => {
            const currentFilter = prev[field] || initializeFilter(field, 'text');
            const newConditions = [...currentFilter.conditions];
            newConditions[conditionIndex] = { ...newConditions[conditionIndex], ...updates };
            return {
                ...prev,
                [field]: { ...currentFilter, conditions: newConditions }
            };
        });
    };

    // Add filter condition
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

    // Remove filter condition
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

    // Toggle AND/OR logic for a column filter
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

    // Apply filter for a column
    const applyColumnFilter = (field) => {
        setActiveFilterMenu(null);
        // The filter is already applied through state, just close the menu
    };

    // Clear filter for a column
    const clearColumnFilter = (field) => {
        setColumnFilters(prev => {
            const { [field]: removed, ...rest } = prev;
            return rest;
        });
        setActiveFilterMenu(null);
    };

    // Clear all filters
    const clearAllFilters = () => {
        setColumnFilters({});
    };

    // Filter visible columns (excluding checkbox and actions)
    const visibleColumns = displayColumns.filter(col =>
        col.field !== 'checkbox' && col.field !== 'actions' && columnVisibilities[col.field] !== false
    );

    // Format cell value based on column type
    const formatCellValue = (value, columnType) => {
        if (value === null || value === undefined || value === '') {
            return '-';
        }

        switch (columnType) {
            case 'date':
                try {
                    const date = new Date(value);
                    if (isNaN(date.getTime())) {
                        return value; // Return as-is if invalid date
                    }
                    // Format as MM/DD/yyyy
                    const month = String(date.getMonth() + 1).padStart(2, '0');
                    const day = String(date.getDate()).padStart(2, '0');
                    const year = date.getFullYear();
                    return `${month}/${day}/${year}`;
                } catch (error) {
                    return value;
                }

            case 'number':
                // Format numbers with thousands separator
                return typeof value === 'number'
                    ? value.toLocaleString('en-US')
                    : value;

            case 'text':
            default:
                return value;
        }
    };

    const allRowsSelected = filteredAndSortedData.length > 0 && selectedRows.size === filteredAndSortedData.length;
    const someRowsSelected = selectedRows.size > 0 && selectedRows.size < filteredAndSortedData.length;

    return (
        <div className="custom-table-container">
            {loading && (
                <div className="custom-table-loading">
                    <div className="spinner"></div>
                    <span>Loading...</span>
                </div>
            )}

            {/* Table Header */}
            <div className="table-header-section">
                <div className="table-header-actions">
                    {/* Add Button */}
                    <button
                        className="header-action-btn add-btn"
                        onClick={() => {/* TODO: Implement add functionality */ }}
                        title="Add New Row"
                    >
                        <svg className="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <line x1="12" y1="5" x2="12" y2="19"></line>
                            <line x1="5" y1="12" x2="19" y2="12"></line>
                        </svg>
                        Add
                    </button>

                    {/* Delete Button */}
                    <button
                        className="header-action-btn delete-btn-header"
                        onClick={() => {/* TODO: Implement delete functionality */ }}
                        title="Delete Selected Rows"
                        disabled={selectedRows.size === 0}
                    >
                        <svg className="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="3 6 5 6 21 6"></polyline>
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                            <line x1="10" y1="11" x2="10" y2="17"></line>
                            <line x1="14" y1="11" x2="14" y2="17"></line>
                        </svg>
                        Delete
                    </button>

                    {/* Layout Button */}
                    <button
                        className="header-action-btn layout-btn"
                        onClick={() => {/* TODO: Implement layout management */ }}
                        title="Save/Load Layout (Column Width, Order, Visibility)"
                    >
                        <svg className="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <rect x="3" y="3" width="7" height="7"></rect>
                            <rect x="14" y="3" width="7" height="7"></rect>
                            <rect x="14" y="14" width="7" height="7"></rect>
                            <rect x="3" y="14" width="7" height="7"></rect>
                        </svg>
                        Layout
                    </button>

                    {/* Search Button */}
                    <button
                        className="header-action-btn search-btn"
                        onClick={() => {/* TODO: Implement search state management */ }}
                        title="Save/Load Search (Filter & Sort State)"
                    >
                        <svg className="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="11" cy="11" r="8"></circle>
                            <path d="m21 21-4.35-4.35"></path>
                        </svg>
                        Search
                    </button>

                    {/* Clear Filters Button */}
                    {Object.keys(columnFilters).length > 0 && (
                        <button
                            className="clear-filters-btn"
                            onClick={clearAllFilters}
                            title="Clear all filters"
                        >
                            Clear All Filters ({Object.keys(columnFilters).length})
                        </button>
                    )}

                    {/* Hide Columns Button */}
                    <button
                        className="column-menu-btn-header"
                        onClick={() => setShowColumnMenu(!showColumnMenu)}
                        title="Show/Hide Columns"
                    >
                        <svg className="eye-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                            <circle cx="12" cy="12" r="3"></circle>
                        </svg>
                        Hide
                    </button>
                    {showColumnMenu && (
                        <div className="column-menu" ref={columnMenuRef}>
                            <div className="menu-title">Show/Hide Columns</div>
                            <div className="menu-items-container">
                                {displayColumns.map((column) => {
                                    if (column.field === 'checkbox' || column.field === 'actions') return null;
                                    return (
                                        <label key={column.field} className="menu-item">
                                            <input
                                                type="checkbox"
                                                checked={columnVisibilities[column.field] !== false}
                                                onChange={() => toggleColumnVisibility(column.field)}
                                            />
                                            <span>{column.header}</span>
                                        </label>
                                    );
                                })}
                            </div>
                            <div className="menu-footer">
                                <button
                                    className="menu-reset-btn"
                                    onClick={resetColumnVisibility}
                                >
                                    Reset to Default
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                <div className="table-header-info">
                    <span className="count-text">
                        Showing <strong>{filteredAndSortedData.length}</strong> of <strong>{tableData.length}</strong> rows
                    </span>
                    {selectedRows.size > 0 && (
                        <span className="selected-count">
                            ({selectedRows.size} selected)
                        </span>
                    )}
                </div>
            </div>

            <div className="custom-table-wrapper" ref={tableRef}>
                <table className="custom-table">
                    <thead className="custom-table-header">
                        <tr>
                            {/* Checkbox Column */}
                            <th className="custom-table-header-cell checkbox-header" style={{ width: '60px' }}>
                                <div className="header-content">
                                    <input
                                        type="checkbox"
                                        checked={allRowsSelected}
                                        ref={(input) => {
                                            if (input) input.indeterminate = someRowsSelected;
                                        }}
                                        onChange={handleSelectAll}
                                        onClick={(e) => e.stopPropagation()}
                                    />
                                </div>
                            </th>

                            {/* Actions Column */}
                            <th className="custom-table-header-cell actions-header" style={{ width: '120px' }}>
                                <div className="header-content">
                                    <span className="header-text">Actions</span>
                                </div>
                            </th>

                            {/* Regular Columns */}
                            {visibleColumns.map((column, index) => {
                                const hasFilter = columnFilters[column.field] && columnFilters[column.field].conditions.length > 0;
                                return (
                                    <th
                                        key={column.field}
                                        className={`custom-table-header-cell ${draggedColumn === index ? 'dragging' : ''}`}
                                        style={{ width: column.width, position: 'relative' }}
                                        draggable
                                        onDragStart={(e) => handleDragStart(e, index)}
                                        onDragOver={handleDragOver}
                                        onDrop={(e) => handleDrop(e, index)}
                                    >
                                        {/* Left Resize border */}
                                        <div
                                            className="column-resize-border-left"
                                            onMouseDown={(e) => handleLeftResizeStart(e, index, column)}
                                            title="Drag to resize column from left"
                                        ></div>

                                        <div className="header-content" onClick={() => handleSort(column.field, column.type)}>
                                            <span className="header-text">{column.header}</span>
                                            <div className="header-actions">
                                                {sortConfig.field === column.field ? (
                                                    <span className="sort-icon active" title={`Sorted ${sortConfig.direction === 'asc' ? 'Ascending (A→Z)' : 'Descending (Z→A)'} - Click to ${sortConfig.direction === 'asc' ? 'sort descending' : 'remove sort'}`}>
                                                        {sortConfig.direction === 'asc' ? '▲' : '▼'}
                                                    </span>
                                                ) : (
                                                    <span className="sort-icon" title="Click to sort ascending">⇅</span>
                                                )}
                                                <button
                                                    className={`filter-menu-btn ${hasFilter ? 'has-filter' : ''} ${activeFilterMenu === column.field ? 'active' : ''}`}
                                                    onClick={(e) => toggleFilterMenu(column.field, e)}
                                                    title="Filter"
                                                >
                                                    ☰
                                                </button>
                                            </div>
                                        </div>

                                        {/* Right Resize border */}
                                        <div
                                            className="column-resize-border"
                                            onMouseDown={(e) => handleResizeStart(e, index, column)}
                                            title="Drag to resize column from right"
                                        ></div>

                                        {/* Filter Menu Dropdown */}
                                        {activeFilterMenu === column.field && (
                                            <div className="advanced-filter-menu" onClick={(e) => e.stopPropagation()}>
                                                {/* Sort Options */}
                                                <div className="filter-menu-section">
                                                    <button
                                                        className="filter-menu-item"
                                                        onClick={() => handleSort(column.field, column.type)}
                                                    >
                                                        <span className="menu-icon">⬆</span>
                                                        Sort {column.type === 'number' ? '1 → 9' : column.type === 'date' ? 'Oldest → Newest' : 'A → Z'}
                                                    </button>
                                                    <button
                                                        className="filter-menu-item"
                                                        onClick={() => handleSort(column.field, column.type)}
                                                    >
                                                        <span className="menu-icon">⬇</span>
                                                        Sort {column.type === 'number' ? '9 → 1' : column.type === 'date' ? 'Newest → Oldest' : 'Z → A'}
                                                    </button>
                                                    {sortConfig.field === column.field && (
                                                        <button
                                                            className="filter-menu-item"
                                                            onClick={() => setSortConfig({ field: null, direction: null })}
                                                        >
                                                            <span className="menu-icon">⊗</span>
                                                            Remove Sort
                                                        </button>
                                                    )}
                                                </div>

                                                {/* Filter Conditions */}
                                                <div className="filter-menu-section">
                                                    <div className="filter-section-title">Show rows where:</div>
                                                    {(columnFilters[column.field]?.conditions || [{ operator: column.type === 'number' ? 'equal' : column.type === 'date' ? 'equal' : 'contains', value: '' }]).map((condition, condIdx) => (
                                                        <div key={condIdx} className="filter-condition">
                                                            {condIdx > 0 && (
                                                                <select
                                                                    className="filter-logic-select"
                                                                    value={columnFilters[column.field]?.logic || 'and'}
                                                                    onChange={(e) => {
                                                                        if (!columnFilters[column.field]) {
                                                                            setColumnFilters(prev => ({
                                                                                ...prev,
                                                                                [column.field]: initializeFilter(column.field, column.type)
                                                                            }));
                                                                        }
                                                                        toggleFilterLogic(column.field);
                                                                    }}
                                                                >
                                                                    <option value="and">And</option>
                                                                    <option value="or">Or</option>
                                                                </select>
                                                            )}
                                                            <select
                                                                className="filter-operator-select"
                                                                value={condition.operator}
                                                                onChange={(e) => updateFilterCondition(column.field, condIdx, { operator: e.target.value })}
                                                            >
                                                                {getOperatorsForType(column.type).map(op => (
                                                                    <option key={op.value} value={op.value}>{op.label}</option>
                                                                ))}
                                                            </select>
                                                            {condition.operator !== 'empty' && condition.operator !== 'notEmpty' && (
                                                                <input
                                                                    type={column.type === 'date' ? 'date' : column.type === 'number' ? 'number' : 'text'}
                                                                    className="filter-value-input"
                                                                    placeholder={column.type === 'number' ? 'Enter number' : column.type === 'date' ? '' : 'Enter value'}
                                                                    value={condition.value || ''}
                                                                    onChange={(e) => updateFilterCondition(column.field, condIdx, { value: e.target.value })}
                                                                />
                                                            )}
                                                            {columnFilters[column.field]?.conditions.length > 1 && (
                                                                <button
                                                                    className="remove-condition-btn"
                                                                    onClick={() => removeFilterCondition(column.field, condIdx)}
                                                                    title="Remove condition"
                                                                >
                                                                    ×
                                                                </button>
                                                            )}
                                                        </div>
                                                    ))}
                                                    <button
                                                        className="add-condition-btn"
                                                        onClick={() => addFilterCondition(column.field, column.type)}
                                                    >
                                                        + Add Condition
                                                    </button>
                                                </div>

                                                {/* Action Buttons */}
                                                <div className="filter-menu-actions">
                                                    <button
                                                        className="filter-apply-btn"
                                                        onClick={() => applyColumnFilter(column.field)}
                                                    >
                                                        FILTER
                                                    </button>
                                                    <button
                                                        className="filter-clear-btn"
                                                        onClick={() => clearColumnFilter(column.field)}
                                                    >
                                                        CLEAR
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </th>
                                );
                            })}

                        </tr>

                        {/* Quick Filter Row */}
                        <tr className="filter-row">
                            {/* Checkbox Column Filter */}
                            <th className="custom-table-header-cell filter-cell checkbox-filter"></th>

                            {/* Actions Column Filter */}
                            <th className="custom-table-header-cell filter-cell actions-filter"></th>

                            {/* Regular Column Filters */}
                            {visibleColumns.map((column) => {
                                const inputType = column.type === 'date' ? 'date' : column.type === 'number' ? 'number' : 'text';
                                const placeholder = column.type === 'date' ? '' : `Filter ${column.header}...`;

                                return (
                                    <th key={`filter-${column.field}`} className="custom-table-header-cell filter-cell">
                                        <input
                                            type={inputType}
                                            className="filter-input"
                                            placeholder={placeholder}
                                            value={
                                                columnFilters[column.field]?.conditions?.[0]?.value || ''
                                            }
                                            onChange={(e) => {
                                                const value = e.target.value;
                                                if (value) {
                                                    // Initialize filter if it doesn't exist
                                                    if (!columnFilters[column.field]) {
                                                        setColumnFilters(prev => ({
                                                            ...prev,
                                                            [column.field]: {
                                                                conditions: [{
                                                                    operator: column.type === 'number' ? 'equal' : column.type === 'date' ? 'equal' : 'contains',
                                                                    value: value
                                                                }],
                                                                logic: 'and'
                                                            }
                                                        }));
                                                    } else {
                                                        // Update existing filter
                                                        updateFilterCondition(column.field, 0, { value });
                                                    }
                                                } else {
                                                    clearColumnFilter(column.field);
                                                }
                                            }}
                                            onClick={(e) => e.stopPropagation()}
                                        />
                                    </th>
                                );
                            })}
                        </tr>
                    </thead>
                    <tbody className="custom-table-body">
                        {filteredAndSortedData.map((row, rowIndex) => (
                            <tr
                                key={row.id || rowIndex}
                                className={`custom-table-row ${selectedRows.has(row.id) ? 'selected' : ''}`}
                                onClick={() => onRowClick(row, rowIndex)}
                            >
                                {/* Checkbox Cell */}
                                <td className="custom-table-cell checkbox-cell">
                                    <input
                                        type="checkbox"
                                        checked={selectedRows.has(row.id)}
                                        onChange={(e) => handleRowSelect(row.id, e)}
                                        onClick={(e) => e.stopPropagation()}
                                    />
                                </td>

                                {/* Actions Cell */}
                                <td className="custom-table-cell actions-cell">
                                    <div className="action-buttons">
                                        <button
                                            className="action-btn edit-btn"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onEdit(row);
                                            }}
                                            title="Edit"
                                        >
                                            <svg className="action-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                                            </svg>
                                        </button>
                                    </div>
                                </td>

                                {/* Regular Data Cells */}
                                {visibleColumns.map((column) => (
                                    <td key={column.field} className="custom-table-cell">
                                        <span className="cell-content">
                                            {formatCellValue(row[column.field], column.type)}
                                        </span>
                                    </td>
                                ))}

                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {displayData.length === 0 && !loading && (
                <div className="custom-table-empty">
                    <svg className="empty-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path d="M9 2v2m6-2v2M4 8h16M3 10v9a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-9H3z"></path>
                        <path d="M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01M16 18h.01"></path>
                    </svg>
                    <p>No data available</p>
                </div>
            )}
        </div>
    );
};

export default CustomTable;

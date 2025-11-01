import React, { useState, useRef, useMemo, useEffect } from 'react';
import './style.css';

// Import custom hooks
import useColumnResize from './hooks/useColumnResize';
import useColumnReorder from './hooks/useColumnReorder';
import useColumnVisibility from './hooks/useColumnVisibility';
import useRowSelection from './hooks/useRowSelection';
import useSorting from './hooks/useSorting';
import useFiltering from './hooks/useFiltering';

// Import utilities
import { initializeFilter } from './utils/tableUtils';

// Import components
import LoadingOverlay from './components/LoadingOverlay';
import EmptyState from './components/EmptyState';
import TableHeader from './components/TableHeader';
import TableColumnHeader from './components/TableColumnHeader';
import TableFilterRow from './components/TableFilterRow';
import TableBody from './components/TableBody';

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
    // Memoize table configuration
    const tableColumns = useMemo(() => columns.length > 0 ? columns : [], [columns]);
    const tableData = useMemo(() => data.length > 0 ? data : [], [data]);
    const displayData = filteredData !== null ? filteredData : tableData;

    // Local state for column configuration
    const [displayColumns, setDisplayColumns] = useState(tableColumns);
    const tableRef = useRef(null);

    // Sync displayColumns when tableColumns changes
    useEffect(() => {
        if (tableColumns.length > 0) {
            const hasAnyWidth = tableColumns.some(col => col.width);
            if (!hasAnyWidth) {
                // Initialize with default widths
                const initializedColumns = tableColumns.map(col => ({
                    ...col,
                    width: col.width || '150px'
                }));
                setDisplayColumns(initializedColumns);
            } else {
                setDisplayColumns(tableColumns);
            }
        }
    }, [tableColumns]);

    // Custom hooks for functionality
    const { draggedColumn, handleDragStart, handleDragOver, handleDrop } = useColumnReorder(displayColumns, setDisplayColumns);
    
    const { resizingColumn, handleRightResizeStart } = useColumnResize(displayColumns, setDisplayColumns);
    
    const {
        columnVisibilities,
        showColumnMenu,
        columnMenuRef,
        setShowColumnMenu,
        toggleColumnVisibility,
        resetColumnVisibility,
        getVisibleColumns
    } = useColumnVisibility(displayColumns);
    
    const { selectedRows, handleSelectAll, handleRowSelect, getSelectionState } = useRowSelection(onSelectionChange);
    
    const { sortConfig, sortedData, handleSort, handleClearSort } = useSorting(displayData);
    
    const {
        columnFilters,
        activeFilterMenu,
        filteredData: filteredAndSortedData,
        toggleFilterMenu,
        updateFilterCondition,
        addFilterCondition,
        removeFilterCondition,
        toggleFilterLogic,
        applyColumnFilter,
        clearColumnFilter,
        clearAllFilters,
        handleQuickFilterChange
    } = useFiltering(sortedData, displayColumns);

    // Get visible columns
    const visibleColumns = getVisibleColumns();
    
    // Get selection state
    const { allRowsSelected, someRowsSelected } = getSelectionState(filteredAndSortedData);

    return (
        <div className="custom-table-container">
            {loading && <LoadingOverlay />}

            {/* Table Header */}
            <TableHeader
                selectedRowsCount={selectedRows.size}
                totalRows={tableData.length}
                filteredRows={filteredAndSortedData.length}
                activeFiltersCount={Object.keys(columnFilters).length}
                showColumnMenu={showColumnMenu}
                columnMenuRef={columnMenuRef}
                displayColumns={displayColumns}
                columnVisibilities={columnVisibilities}
                onToggleColumnMenu={() => setShowColumnMenu(!showColumnMenu)}
                onToggleColumnVisibility={toggleColumnVisibility}
                onResetColumnVisibility={resetColumnVisibility}
                onClearAllFilters={clearAllFilters}
            />

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
                                        onChange={(e) => handleSelectAll(e, filteredAndSortedData)}
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
                            {visibleColumns.map((column, index) => (
                                <TableColumnHeader
                                    key={column.field}
                                    column={column}
                                    index={index}
                                    isDragging={draggedColumn === index}
                                    sortConfig={sortConfig}
                                    columnFilters={columnFilters}
                                    activeFilterMenu={activeFilterMenu}
                                    onDragStart={handleDragStart}
                                    onDragOver={handleDragOver}
                                    onDrop={handleDrop}
                                    onRightResizeStart={handleRightResizeStart}
                                    onSort={handleSort}
                                    onToggleFilterMenu={toggleFilterMenu}
                                    onClearSort={handleClearSort}
                                    onUpdateFilterCondition={updateFilterCondition}
                                    onAddFilterCondition={addFilterCondition}
                                    onRemoveFilterCondition={removeFilterCondition}
                                    onToggleFilterLogic={toggleFilterLogic}
                                    onApplyFilter={applyColumnFilter}
                                    onClearFilter={clearColumnFilter}
                                    onInitializeFilter={initializeFilter}
                                />
                            ))}
                        </tr>

                        {/* Quick Filter Row */}
                        <TableFilterRow
                            visibleColumns={visibleColumns}
                            columnFilters={columnFilters}
                            onFilterChange={handleQuickFilterChange}
                            onClearFilter={clearColumnFilter}
                        />
                    </thead>

                    {/* Table Body */}
                    <TableBody
                        data={filteredAndSortedData}
                        visibleColumns={visibleColumns}
                        selectedRows={selectedRows}
                        onRowClick={onRowClick}
                        onRowSelect={handleRowSelect}
                        onEdit={onEdit}
                    />
                </table>
            </div>

            {/* Empty State */}
            {displayData.length === 0 && !loading && <EmptyState />}
        </div>
    );
};

export default CustomTable;

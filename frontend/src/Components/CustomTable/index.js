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
import useCustomTable from '../../Hooks/useCustomTable';

const wholeWidth = 1200;
const actionAndCheckBoxWidth = 180;

const CustomTable = ({
    formName = "",
    columns = [],
    data = [],
    onRowClick = () => { },
    loading = false,
    onSelectionChange = () => { },
    onEdit = () => { },
    onDelete = () => { },
    filteredData = null,
}) => {
    const { getGridState, saveGridState } = useCustomTable();

    // Memoize table configuration
    const [tableColumns, setTableColumns] = useState([]);
    const tableData = useMemo(() => data.length > 0 ? data : [], [data]);
    const displayData = filteredData !== null ? filteredData : tableData;

    const [displayColumns, setDisplayColumns] = useState(tableColumns);
    const tableRef = useRef(null);

    useEffect(() => {
        if (tableColumns.length > 0) {
            const hasAnyWidth = tableColumns.some(col => col.width);

            const initializedColumns = tableColumns.map(col => {
                const column = { ...col };

                if (!hasAnyWidth && !column.width) {
                    const tableWidth = document.getElementsByClassName("table-header-section")[0]?.offsetWidth || wholeWidth;
                    column.width = `${(tableWidth - actionAndCheckBoxWidth) / tableColumns?.length}px`;
                }

                if (column.visible === undefined) {
                    column.visible = true;
                }

                return column;
            });

            setDisplayColumns(initializedColumns);
        }
    }, [tableColumns]);

    const { draggedColumn, handleDragStart, handleDragOver, handleDrop } = useColumnReorder(displayColumns, setDisplayColumns);

    const { resizingColumn, handleRightResizeStart } = useColumnResize(displayColumns, setDisplayColumns);

    const {
        columnVisibleChanged,
        setColumnVisibleChanged,
        showColumnMenu,
        columnMenuRef,
        setShowColumnMenu,
        toggleColumnVisibility,
        resetColumnVisibility,
        getVisibleColumns
    } = useColumnVisibility(displayColumns, setDisplayColumns);

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
        handleQuickFilterChange,
        applyExcelFilter
    } = useFiltering(sortedData, displayColumns);

    // Get visible columns
    const visibleColumns = getVisibleColumns();

    // Get selection state
    const { allRowsSelected, someRowsSelected } = getSelectionState(filteredAndSortedData);

    const getTableColumns = async () => {
        const savedColumns = await getGridState(formName);
        const parsedColumns = JSON.parse(savedColumns?.state || null);
        setTableColumns(parsedColumns?.length > 0 ? parsedColumns : (columns.length > 0 ? columns : []));
    }

    useEffect(() => {
        if (resizingColumn === null && draggedColumn === null && displayColumns.length > 0) {
            saveGridState(JSON.stringify(displayColumns), formName);
            setColumnVisibleChanged(false);
        }
    }, [resizingColumn, draggedColumn])

    useEffect(() => {
        if (columnVisibleChanged && displayColumns.length > 0) {
            saveGridState(JSON.stringify(displayColumns), formName);
            setColumnVisibleChanged(false);
        }
    }, [columnVisibleChanged])

    useEffect(() => {
        getTableColumns();
    }, [columns])

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
                                    dataForMenu={tableData}
                                    onApplyExcelFilter={applyExcelFilter}
                                />
                            ))}
                        </tr>

                        {/* Quick Filter Row */}
                        <TableFilterRow
                            visibleColumns={visibleColumns}
                            columnFilters={columnFilters}
                            onFilterChange={handleQuickFilterChange}
                            onClearFilter={clearColumnFilter}
                            onUpdateFilterCondition={updateFilterCondition}
                            onInitializeFilter={initializeFilter}
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

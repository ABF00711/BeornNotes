import React from 'react';
import ColumnVisibilityMenu from './ColumnVisibilityMenu';
import SmartLayouts from './Layouts';
import SmartSearchPattern from '../SearchPattern';

const TableHeader = ({
    formName,
    selectedRowsCount,
    totalRows,
    filteredRows,
    activeFiltersCount,
    showColumnMenu,
    columnMenuRef,
    displayColumns,
    onToggleColumnMenu,
    onToggleColumnVisibility,
    onResetColumnVisibility,
    onClearAllFilters,
    setDisplayColumns,
    setTableColumns,
    sortConfig,
    filterConfig,
    setOnColumnChanged,
}) => {
    return (
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
                    disabled={selectedRowsCount === 0}
                >
                    <svg className="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="3 6 5 6 21 6"></polyline>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                        <line x1="10" y1="11" x2="10" y2="17"></line>
                        <line x1="14" y1="11" x2="14" y2="17"></line>
                    </svg>
                    Delete
                </button>

                <SmartLayouts formName={formName} displayColumns={displayColumns} setDisplayColumns={setDisplayColumns} setOnColumnChanged = {setOnColumnChanged} />

                {/* Search Button */}
                <SmartSearchPattern formName={formName} displayColumns = {displayColumns} sortConfig={sortConfig} filterConfig={filterConfig} setTableColumns={setTableColumns} />

                {/* Clear Filters Button */}
                {activeFiltersCount > 0 && (
                    <button
                        className="clear-filters-btn"
                        onClick={onClearAllFilters}
                        title="Clear all filters"
                    >
                        Clear All Filters ({activeFiltersCount})
                    </button>
                )}

                {/* Hide Columns Button */}
                <button
                    className="column-menu-btn-header"
                    onClick={onToggleColumnMenu}
                    title="Show/Hide Columns"
                >
                    <svg className="eye-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                        <circle cx="12" cy="12" r="3"></circle>
                    </svg>
                    Hide
                </button>

                {/* Column Visibility Menu */}
                <ColumnVisibilityMenu
                    showMenu={showColumnMenu}
                    menuRef={columnMenuRef}
                    displayColumns={displayColumns}
                    onToggleVisibility={onToggleColumnVisibility}
                    onReset={onResetColumnVisibility}
                />
            </div>

            <div className="table-header-info">
                <span className="count-text">
                    Showing <strong>{filteredRows}</strong> of <strong>{totalRows}</strong> rows
                </span>
                {selectedRowsCount > 0 && (
                    <span className="selected-count">
                        ({selectedRowsCount} selected)
                    </span>
                )}
            </div>
        </div>
    );
};

export default TableHeader;


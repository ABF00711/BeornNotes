import React from 'react';
import ColumnVisibilityMenu from './ColumnVisibilityMenu';

const TableHeader = ({
    selectedRowsCount,
    totalRows,
    filteredRows,
    activeFiltersCount,
    showColumnMenu,
    columnMenuRef,
    displayColumns,
    columnVisibilities,
    onToggleColumnMenu,
    onToggleColumnVisibility,
    onResetColumnVisibility,
    onClearAllFilters
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
                    columnVisibilities={columnVisibilities}
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


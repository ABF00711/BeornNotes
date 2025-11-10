import React from 'react';
import ColumnVisibilityMenu from './ColumnVisibilityMenu';
import Layouts_Custom from './Layouts';
import SearchPattern_Custom from './SearchPattern';
import SmartDelete from './Delete';

const TableHeader = ({
    formName,
    selectedRows,
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
                <SmartDelete formName = {formName} selectedRows = {selectedRows} />

                <Layouts_Custom formName={formName} displayColumns={displayColumns} setDisplayColumns={setDisplayColumns} setOnColumnChanged = {setOnColumnChanged} />

                {/* Search Button */}
                <SearchPattern_Custom formName={formName} displayColumns = {displayColumns} sortConfig={sortConfig} filterConfig={filterConfig} setTableColumns={setTableColumns} />

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
                    Showing <strong>{filteredRows?.length}</strong> of <strong>{totalRows}</strong> rows
                </span>
                {selectedRows > 0 && (
                    <span className="selected-count">
                        ({selectedRows?.length} selected)
                    </span>
                )}
            </div>
        </div>
    );
};

export default TableHeader;


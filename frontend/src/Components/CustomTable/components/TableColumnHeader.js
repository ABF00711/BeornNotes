import React from 'react';
import AdvancedFilterMenu from './AdvancedFilterMenu';

const TableColumnHeader = ({
    column,
    index,
    isDragging,
    sortConfig,
    columnFilters,
    activeFilterMenu,
    onDragStart,
    onDragOver,
    onDrop,
    onRightResizeStart,
    onSort,
    onToggleFilterMenu,
    onClearSort,
    onUpdateFilterCondition,
    onAddFilterCondition,
    onRemoveFilterCondition,
    onToggleFilterLogic,
    onApplyFilter,
    onClearFilter,
    onInitializeFilter,
    // excel filter additions
    dataForMenu,
    onApplyExcelFilter
}) => {
    const hasFilter = columnFilters[column.field] && columnFilters[column.field].conditions.length > 0;

    return (
        <th
            className={`custom-table-header-cell ${isDragging ? 'dragging' : ''}`}
            style={{ width: column.width, minWidth: column.width, maxWidth: column.width, position: 'relative' }}
            draggable
            onDragStart={(e) => onDragStart(e, column.field)}
            onDragOver={onDragOver}
            onDrop={(e) => onDrop(e, column.field)}
        >
            <div className="header-content" onClick={() => onSort(column.field, column.type)}>
                <span className="header-text">{column.header}</span>
                <div className="header-actions">
                    {sortConfig.field === column.field ? (
                        <span 
                            className="sort-icon active" 
                            title={`Sorted ${sortConfig.direction === 'asc' ? 'Ascending (A→Z)' : 'Descending (Z→A)'} - Click to ${sortConfig.direction === 'asc' ? 'sort descending' : 'remove sort'}`}
                        >
                            {sortConfig.direction === 'asc' ? '▲' : '▼'}
                        </span>
                    ) : (
                        <span className="sort-icon" title="Click to sort ascending">⇅</span>
                    )}
                    <button
                        className={`filter-menu-btn ${hasFilter ? 'has-filter' : ''} ${activeFilterMenu === column.field ? 'active' : ''}`}
                        onClick={(e) => onToggleFilterMenu(column.field, e)}
                        title="Filter"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" height="16px" viewBox="0 -960 960 960" width="16px" fill="#1f1f1f"><path d="M480-160q-33 0-56.5-23.5T400-240q0-33 23.5-56.5T480-320q33 0 56.5 23.5T560-240q0 33-23.5 56.5T480-160Zm0-240q-33 0-56.5-23.5T400-480q0-33 23.5-56.5T480-560q33 0 56.5 23.5T560-480q0 33-23.5 56.5T480-400Zm0-240q-33 0-56.5-23.5T400-720q0-33 23.5-56.5T480-800q33 0 56.5 23.5T560-720q0 33-23.5 56.5T480-640Z"/></svg>
                    </button>
                </div>
            </div>

            {/* Right Resize border */}
            <div
                className="column-resize-border"
                onMouseDown={(e) => onRightResizeStart(e, index, column)}
                title="Drag to resize column from right"
            ></div>

            {/* Filter Menu Dropdown */}
            {activeFilterMenu === column.field && (
                <AdvancedFilterMenu
                    column={column}
                    sortConfig={sortConfig}
                    columnFilters={columnFilters}
                    onSort={onSort}
                    onClearSort={onClearSort}
                    dataForMenu={dataForMenu}
                    onApplyExcelFilter={onApplyExcelFilter}
                    onClearFilter={onClearFilter}
                />
            )}
        </th>
    );
};

export default TableColumnHeader;


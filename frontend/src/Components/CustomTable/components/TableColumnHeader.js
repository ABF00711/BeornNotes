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
            onDragStart={(e) => onDragStart(e, index)}
            onDragOver={onDragOver}
            onDrop={(e) => onDrop(e, index)}
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
                        ☰
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


import React from 'react';

const TableFilterRow = ({
    visibleColumns,
    columnFilters,
    onFilterChange,
    onClearFilter
}) => {
    return (
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
                    <th key={`filter-${column.field}`} className="custom-table-header-cell filter-cell" style={{ width: column.width, minWidth: column.width, maxWidth: column.width }}>
                        <input
                            type={inputType}
                            className="filter-input"
                            placeholder={placeholder}
                            value={columnFilters[column.field]?.conditions?.[0]?.value || ''}
                            onChange={(e) => onFilterChange(column.field, e.target.value, column.type)}
                            onClick={(e) => e.stopPropagation()}
                        />
                    </th>
                );
            })}
        </tr>
    );
};

export default TableFilterRow;


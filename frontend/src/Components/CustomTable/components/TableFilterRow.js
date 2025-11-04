import React, { useEffect, useState } from 'react';
import { getOperatorsForType } from '../constants/filterOperators';

const TableFilterRow = ({
    visibleColumns,
    columnFilters,
    onFilterChange,
    onClearFilter,
    onUpdateFilterCondition,
    onInitializeFilter
}) => {
    const [openOperatorForField, setOpenOperatorForField] = useState(null);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (!e.target.closest('.filter-operator-menu') && !e.target.closest('.filter-operator-btn')) {
                setOpenOperatorForField(null);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const toggleOperatorMenu = (field, e) => {
        e.stopPropagation();
        setOpenOperatorForField(prev => (prev === field ? null : field));
    };

    const handleOperatorSelect = (field, type, operator) => {
        // Ensure filter structure exists
        if (!columnFilters[field]) {
            onInitializeFilter(field, type);
        }
        const updates = operator === 'empty' || operator === 'notEmpty'
            ? { operator, value: '' }
            : { operator };
        onUpdateFilterCondition(field, 0, updates);
        setOpenOperatorForField(null);
    };

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
                const currentOperator = columnFilters[column.field]?.conditions?.[0]?.operator
                    || (column.type === 'number' ? 'equal' : column.type === 'date' ? 'equal' : 'contains');
                const isExcelIn = currentOperator === 'in' || currentOperator === 'notIn';
                const inputDisabled = currentOperator === 'empty' || currentOperator === 'notEmpty' || isExcelIn;

                return (
                    <th key={`filter-${column.field}`} className="custom-table-header-cell filter-cell" style={{ width: column.width, minWidth: column.width, maxWidth: column.width, position: 'relative' }}>
                        <div className="filter-input-wrapper">
                            <button
                                className={`filter-operator-btn ${openOperatorForField === column.field ? 'active' : ''}`}
                                title="Filter operator"
                                onClick={(e) => toggleOperatorMenu(column.field, e)}
                            >
                                ☰
                            </button>
                            <input
                                type={inputType}
                                className="filter-input"
                                placeholder={isExcelIn ? `${(columnFilters[column.field]?.conditions?.[0]?.value || []).length} selected` : placeholder}
                                value={isExcelIn ? '' : (columnFilters[column.field]?.conditions?.[0]?.value || '')}
                                onChange={(e) => onFilterChange(column.field, e.target.value, column.type)}
                                onClick={(e) => e.stopPropagation()}
                                disabled={inputDisabled}
                            />
                        </div>

                        {openOperatorForField === column.field && (
                            <div className="filter-operator-menu">
                                {getOperatorsForType(column.type).map(op => (
                                    <div key={op.value}>
                                    <button
                                        className={`operator-item ${currentOperator === op.value ? 'selected' : ''}`}
                                        onClick={() => handleOperatorSelect(column.field, column.type, op.value)}
                                        title={op.label}
                                    >
                                        {op.label}
                                    </button>
                                    </div>
                                ))}
                                <div className="operator-sep" />
                                <button
                                    className="operator-clear"
                                    onClick={() => onClearFilter(column.field)}
                                    title="Clear Filter"
                                >
                                    Clear Filter
                                </button>
                            </div>
                        )}
                    </th>
                );
            })}
        </tr>
    );
};

export default TableFilterRow;


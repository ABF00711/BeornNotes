import React from 'react';
import { getOperatorsForType } from '../constants/filterOperators';

const AdvancedFilterMenu = ({
    column,
    sortConfig,
    columnFilters,
    onSort,
    onClearSort,
    onUpdateFilterCondition,
    onAddFilterCondition,
    onRemoveFilterCondition,
    onToggleFilterLogic,
    onApplyFilter,
    onClearFilter,
    onInitializeFilter
}) => {
    const filterConfig = columnFilters[column.field] || {
        conditions: [{ operator: column.type === 'number' ? 'equal' : column.type === 'date' ? 'equal' : 'contains', value: '' }],
        logic: 'and'
    };

    return (
        <div className="advanced-filter-menu" onClick={(e) => e.stopPropagation()}>
            {/* Sort Options */}
            <div className="filter-menu-section">
                <button
                    className="filter-menu-item"
                    onClick={() => onSort(column.field, column.type)}
                >
                    <span className="menu-icon">⬆</span>
                    Sort {column.type === 'number' ? '1 → 9' : column.type === 'date' ? 'Oldest → Newest' : 'A → Z'}
                </button>
                <button
                    className="filter-menu-item"
                    onClick={() => onSort(column.field, column.type)}
                >
                    <span className="menu-icon">⬇</span>
                    Sort {column.type === 'number' ? '9 → 1' : column.type === 'date' ? 'Newest → Oldest' : 'Z → A'}
                </button>
                {sortConfig.field === column.field && (
                    <button
                        className="filter-menu-item"
                        onClick={onClearSort}
                    >
                        <span className="menu-icon">⊗</span>
                        Remove Sort
                    </button>
                )}
            </div>

            {/* Filter Conditions */}
            <div className="filter-menu-section">
                <div className="filter-section-title">Show rows where:</div>
                {filterConfig.conditions.map((condition, condIdx) => (
                    <div key={condIdx} className="filter-condition">
                        {condIdx > 0 && (
                            <select
                                className="filter-logic-select"
                                value={filterConfig.logic || 'and'}
                                onChange={() => {
                                    if (!columnFilters[column.field]) {
                                        onInitializeFilter(column.field, column.type);
                                    }
                                    onToggleFilterLogic(column.field);
                                }}
                            >
                                <option value="and">And</option>
                                <option value="or">Or</option>
                            </select>
                        )}
                        <select
                            className="filter-operator-select"
                            value={condition.operator}
                            onChange={(e) => onUpdateFilterCondition(column.field, condIdx, { operator: e.target.value })}
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
                                onChange={(e) => onUpdateFilterCondition(column.field, condIdx, { value: e.target.value })}
                            />
                        )}
                        {filterConfig.conditions.length > 1 && (
                            <button
                                className="remove-condition-btn"
                                onClick={() => onRemoveFilterCondition(column.field, condIdx)}
                                title="Remove condition"
                            >
                                ×
                            </button>
                        )}
                    </div>
                ))}
                <button
                    className="add-condition-btn"
                    onClick={() => onAddFilterCondition(column.field, column.type)}
                >
                    + Add Condition
                </button>
            </div>

            {/* Action Buttons */}
            <div className="filter-menu-actions">
                <button
                    className="filter-apply-btn"
                    onClick={() => onApplyFilter(column.field)}
                >
                    FILTER
                </button>
                <button
                    className="filter-clear-btn"
                    onClick={() => onClearFilter(column.field)}
                >
                    CLEAR
                </button>
            </div>
        </div>
    );
};

export default AdvancedFilterMenu;


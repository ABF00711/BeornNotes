import React from 'react';
import { formatCellValue } from '../utils/tableUtils';

const TableRow = ({
    row,
    rowIndex,
    visibleColumns,
    isSelected,
    onRowClick,
    onRowSelect,
    onEdit
}) => {
    return (
        <tr
            className={`custom-table-row ${isSelected ? 'selected' : ''}`}
            onClick={() => onRowClick(row, rowIndex)}
        >
            {/* Checkbox Cell */}
            <td className="custom-table-cell checkbox-cell">
                <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={(e) => onRowSelect(row.id, e)}
                    onClick={(e) => e.stopPropagation()}
                />
            </td>

            {/* Actions Cell */}
            <td className="custom-table-cell actions-cell">
                <div className="action-buttons">
                    <button
                        className="action-btn edit-btn"
                        onClick={(e) => {
                            e.stopPropagation();
                            onEdit(row);
                        }}
                        title="Edit"
                    >
                        <svg className="action-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                        </svg>
                    </button>
                </div>
            </td>

            {/* Regular Data Cells */}
            {visibleColumns.map((column) => (
                <td key={column.field} className="custom-table-cell">
                    <span className="cell-content">
                        {formatCellValue(row[column.field], column.type)}
                    </span>
                </td>
            ))}
        </tr>
    );
};

export default TableRow;


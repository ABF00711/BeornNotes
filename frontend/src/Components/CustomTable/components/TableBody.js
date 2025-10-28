import React from 'react';
import TableRow from './TableRow';

const TableBody = ({
    data,
    visibleColumns,
    selectedRows,
    onRowClick,
    onRowSelect,
    onEdit
}) => {
    return (
        <tbody className="custom-table-body">
            {data.map((row, rowIndex) => (
                <TableRow
                    key={row.id || rowIndex}
                    row={row}
                    rowIndex={rowIndex}
                    visibleColumns={visibleColumns}
                    isSelected={selectedRows.has(row.id)}
                    onRowClick={onRowClick}
                    onRowSelect={onRowSelect}
                    onEdit={onEdit}
                />
            ))}
        </tbody>
    );
};

export default TableBody;


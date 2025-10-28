import { useState } from 'react';

/**
 * Custom hook for row selection functionality
 */
const useRowSelection = (onSelectionChange) => {
    const [selectedRows, setSelectedRows] = useState(new Set());

    const handleSelectAll = (e, allData) => {
        if (e.target.checked) {
            const allIds = new Set(allData.map(row => row.id));
            setSelectedRows(allIds);
            onSelectionChange(Array.from(allIds));
        } else {
            setSelectedRows(new Set());
            onSelectionChange([]);
        }
    };

    const handleRowSelect = (rowId, e) => {
        e.stopPropagation();
        const newSelected = new Set(selectedRows);
        if (newSelected.has(rowId)) {
            newSelected.delete(rowId);
        } else {
            newSelected.add(rowId);
        }
        setSelectedRows(newSelected);
        onSelectionChange(Array.from(newSelected));
    };

    const getSelectionState = (filteredData) => {
        const allRowsSelected = filteredData.length > 0 && selectedRows.size === filteredData.length;
        const someRowsSelected = selectedRows.size > 0 && selectedRows.size < filteredData.length;
        return { allRowsSelected, someRowsSelected };
    };

    return {
        selectedRows,
        handleSelectAll,
        handleRowSelect,
        getSelectionState
    };
};

export default useRowSelection;


import { useState } from 'react';

/**
 * Custom hook for column reordering functionality
 */
const useColumnReorder = (displayColumns, setDisplayColumns) => {
    const [draggedColumn, setDraggedColumn] = useState(null);

    const handleDragStart = (e, columnIndex) => {
        setDraggedColumn(columnIndex);
        e.dataTransfer.effectAllowed = 'move';
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
    };

    const handleDrop = (e, dropIndex) => {
        e.preventDefault();
        if (draggedColumn === null) return;

        const newColumns = [...displayColumns];
        const draggedCol = newColumns[draggedColumn];
        newColumns.splice(draggedColumn, 1);
        newColumns.splice(dropIndex, 0, draggedCol);
        setDisplayColumns(newColumns);
        setDraggedColumn(null);
    };

    return {
        draggedColumn,
        handleDragStart,
        handleDragOver,
        handleDrop
    };
};

export default useColumnReorder;


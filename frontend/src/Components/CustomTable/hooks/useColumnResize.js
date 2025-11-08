import { useState } from 'react';

/**
 * Custom hook for column resizing functionality
 */
const useColumnResize = (displayColumns, setDisplayColumns) => {
    const [resizingColumn, setResizingColumn] = useState(null);

    const handleResizeStart = (e, columnIndex, column, direction = 'right') => {
        e.preventDefault();
        e.stopPropagation();
        
        if (column.field === 'checkbox' || column.field === 'actions') return;

        setResizingColumn(columnIndex);
        const startX = e.clientX;
        const startWidth = column.width || '150px';
        const startWidthNum = parseInt(startWidth);

        document.body.style.cursor = 'col-resize';
        document.body.style.userSelect = 'none';

        const handleMouseMove = (moveEvent) => {
            moveEvent.preventDefault();
            const diff = direction === 'left' 
                ? startX - moveEvent.clientX 
                : moveEvent.clientX - startX;
            const newWidth = startWidthNum + diff;
            
            if (newWidth > 50) {
                const updatedColumns = [...displayColumns];
                const updatedColumnIndex = displayColumns.findIndex(col => col.field === column.field);
                updatedColumns[updatedColumnIndex] = {
                    ...updatedColumns[updatedColumnIndex],
                    width: `${newWidth}px`
                };
                setDisplayColumns(updatedColumns);
            }
        };

        const handleMouseUp = () => {
            document.body.style.cursor = '';
            document.body.style.userSelect = '';
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
            setResizingColumn(null);
        };

        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
    };

    const handleRightResizeStart = (e, columnIndex, column) => {
        handleResizeStart(e, columnIndex, column, 'right');
    };

    const handleLeftResizeStart = (e, columnIndex, column) => {
        handleResizeStart(e, columnIndex, column, 'left');
    };

    return {
        resizingColumn,
        handleRightResizeStart,
        handleLeftResizeStart
    };
};

export default useColumnResize;


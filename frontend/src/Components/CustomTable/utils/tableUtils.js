// Utility functions for CustomTable

/**
 * Format cell value based on column type
 */
export const formatCellValue = (value, columnType) => {
    if (value === null || value === undefined || value === '') {
        return '-';
    }

    switch (columnType) {
        case 'date':
            try {
                const date = new Date(value);
                if (isNaN(date.getTime())) {
                    return value; // Return as-is if invalid date
                }
                // Format as MM/DD/yyyy
                const month = String(date.getMonth() + 1).padStart(2, '0');
                const day = String(date.getDate()).padStart(2, '0');
                const year = date.getFullYear();
                return `${month}/${day}/${year}`;
            } catch (error) {
                return value;
            }

        case 'number':
            // Format numbers with thousands separator
            return typeof value === 'number'
                ? value.toLocaleString('en-US')
                : value;

        case 'url':
            // Return object with type indicator for rendering as link
            return { type: 'url', value };

        case 'text':
        default:
            return value;
    }
};

/**
 * Evaluate a single filter condition
 */
export const evaluateCondition = (cellValue, operator, filterValue, columnType) => {
    // Handle empty/notEmpty operators
    if (operator === 'empty') {
        return cellValue === null || cellValue === undefined || cellValue === '';
    }
    if (operator === 'notEmpty') {
        return cellValue !== null && cellValue !== undefined && cellValue !== '';
    }

    // Return true if no filter value provided (except for empty/notEmpty)
    if (!filterValue && filterValue !== 0) return true;

    // Handle null/undefined values
    if (cellValue === null || cellValue === undefined) return false;

    switch (columnType) {
        case 'text':
        case 'url':
            const strValue = String(cellValue).toLowerCase();
            const strFilter = String(filterValue).toLowerCase();
            switch (operator) {
                case 'contains': return strValue.includes(strFilter);
                case 'notContains': return !strValue.includes(strFilter);
                case 'equals': return strValue === strFilter;
                case 'notEquals': return strValue !== strFilter;
                case 'startsWith': return strValue.startsWith(strFilter);
                case 'endsWith': return strValue.endsWith(strFilter);
                default: return true;
            }

        case 'number':
            const numValue = typeof cellValue === 'number' ? cellValue : parseFloat(cellValue);
            const numFilter = parseFloat(filterValue);
            if (isNaN(numValue) || isNaN(numFilter)) return false;
            switch (operator) {
                case 'equal': return numValue === numFilter;
                case 'notEqual': return numValue !== numFilter;
                case 'lessThan': return numValue < numFilter;
                case 'lessThanOrEqual': return numValue <= numFilter;
                case 'greaterThan': return numValue > numFilter;
                case 'greaterThanOrEqual': return numValue >= numFilter;
                default: return true;
            }

        case 'date':
            const cellDate = new Date(cellValue);
            const filterDate = new Date(filterValue);
            if (isNaN(cellDate.getTime()) || isNaN(filterDate.getTime())) return false;

            // Normalize to date only (ignore time)
            const cellDateOnly = new Date(cellDate.getFullYear(), cellDate.getMonth(), cellDate.getDate());
            const filterDateOnly = new Date(filterDate.getFullYear(), filterDate.getMonth(), filterDate.getDate());
            const cellTime = cellDateOnly.getTime();
            const filterTime = filterDateOnly.getTime();

            switch (operator) {
                case 'equal': return cellTime === filterTime;
                case 'notEqual': return cellTime !== filterTime;
                case 'before': return cellTime < filterTime;
                case 'beforeOrEqual': return cellTime <= filterTime;
                case 'after': return cellTime > filterTime;
                case 'afterOrEqual': return cellTime >= filterTime;
                default: return true;
            }

        default:
            return true;
    }
};

/**
 * Initialize filter configuration for a column
 */
export const initializeFilter = (field, columnType) => {
    const defaultOperator = columnType === 'number' ? 'equal' : columnType === 'date' ? 'equal' : 'contains';
    return {
        conditions: [{ operator: defaultOperator, value: '' }],
        logic: 'and'
    };
};


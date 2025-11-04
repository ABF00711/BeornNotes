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
            const strFilter = typeof filterValue === 'string' ? String(filterValue).toLowerCase() : filterValue;
            switch (operator) {
                case 'contains': return strValue.includes(strFilter);
                case 'notContains': return !strValue.includes(strFilter);
                case 'equals': return strValue === strFilter;
                case 'notEquals': return strValue !== strFilter;
                case 'startsWith': return strValue.startsWith(strFilter);
                case 'endsWith': return strValue.endsWith(strFilter);
                case 'in': {
                    if (!Array.isArray(filterValue)) return true;
                    // Support special token for blanks
                    const hasBlank = filterValue.includes('__BLANK__');
                    if ((cellValue === '' || cellValue === null || cellValue === undefined) && hasBlank) return true;
                    const set = new Set(filterValue.filter(v => v !== '__BLANK__').map(v => String(v).toLowerCase()));
                    return set.has(strValue);
                }
                case 'notIn': {
                    if (!Array.isArray(filterValue)) return true;
                    const hasBlank = filterValue.includes('__BLANK__');
                    if ((cellValue === '' || cellValue === null || cellValue === undefined)) {
                        return !hasBlank;
                    }
                    const set = new Set(filterValue.filter(v => v !== '__BLANK__').map(v => String(v).toLowerCase()));
                    return !set.has(strValue);
                }
                default: return true;
            }

        case 'number':
            const numValue = typeof cellValue === 'number' ? cellValue : parseFloat(cellValue);
            const numFilter = typeof filterValue === 'number' ? filterValue : parseFloat(filterValue);
            if (isNaN(numValue) || isNaN(numFilter)) return false;
            switch (operator) {
                case 'equal': return numValue === numFilter;
                case 'notEqual': return numValue !== numFilter;
                case 'lessThan': return numValue < numFilter;
                case 'lessThanOrEqual': return numValue <= numFilter;
                case 'greaterThan': return numValue > numFilter;
                case 'greaterThanOrEqual': return numValue >= numFilter;
                case 'in': {
                    if (!Array.isArray(filterValue)) return true;
                    const set = new Set(filterValue.filter(v => v !== '__BLANK__').map(v => typeof v === 'number' ? v : parseFloat(v)).filter(v => !isNaN(v)));
                    if (cellValue === '' || cellValue === null || cellValue === undefined) return filterValue.includes('__BLANK__');
                    return set.has(numValue);
                }
                case 'notIn': {
                    if (!Array.isArray(filterValue)) return true;
                    const set = new Set(filterValue.filter(v => v !== '__BLANK__').map(v => typeof v === 'number' ? v : parseFloat(v)).filter(v => !isNaN(v)));
                    if (cellValue === '' || cellValue === null || cellValue === undefined) return !filterValue.includes('__BLANK__');
                    return !set.has(numValue);
                }
                default: return true;
            }

        case 'date':
            const cellDate = new Date(cellValue);
            if (isNaN(cellDate.getTime())) return false;

            // Normalize to yyyy-mm-dd
            const yyyy = String(cellDate.getFullYear());
            const mm = String(cellDate.getMonth() + 1).padStart(2, '0');
            const dd = String(cellDate.getDate()).padStart(2, '0');
            const isoDay = `${yyyy}-${mm}-${dd}`;

            if (operator === 'in' || operator === 'notIn') {
                if (!Array.isArray(filterValue)) return true;
                const set = new Set(filterValue);
                // Match hierarchy tokens: Y:YYYY, M:YYYY-MM, D:YYYY-MM-DD
                const match = set.has(`D:${isoDay}`) || set.has(`M:${yyyy}-${mm}`) || set.has(`Y:${yyyy}`);
                return operator === 'in' ? match : !match;
            }

            const filterDate = new Date(filterValue);
            if (isNaN(filterDate.getTime())) return false;
            const filterDay = new Date(filterDate.getFullYear(), filterDate.getMonth(), filterDate.getDate()).getTime();
            const cellDay = new Date(cellDate.getFullYear(), cellDate.getMonth(), cellDate.getDate()).getTime();

            switch (operator) {
                case 'equal': return cellDay === filterDay;
                case 'notEqual': return cellDay !== filterDay;
                case 'before': return cellDay < filterDay;
                case 'beforeOrEqual': return cellDay <= filterDay;
                case 'after': return cellDay > filterDay;
                case 'afterOrEqual': return cellDay >= filterDay;
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


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

    // For 'in' and 'notIn' operators, we need to handle blank values specially
    // So don't return false early for null/undefined - let the operator handle it
    const isInOperator = operator === 'in' || operator === 'notIn';
    
    // Handle null/undefined values (but skip for 'in'/'notIn' operators which handle blanks)
    if (!isInOperator && (cellValue === null || cellValue === undefined)) return false;

    switch (columnType) {
        case 'text':
        case 'url':
            // For 'in'/'notIn' operators with blank values, handle before converting to string
            if (isInOperator) {
                if (!Array.isArray(filterValue)) return true;
                const hasBlank = filterValue.includes('__BLANK__');
                const isBlank = cellValue === '' || cellValue === null || cellValue === undefined;
                
                if (operator === 'in') {
                    if (isBlank && hasBlank) return true;
                    if (isBlank && !hasBlank) return false;
                    // For non-blank values, check against the set
                    const strValue = String(cellValue).toLowerCase();
                    const set = new Set(filterValue.filter(v => v !== '__BLANK__').map(v => String(v).toLowerCase()));
                    return set.has(strValue);
                } else { // notIn
                    if (isBlank) return !hasBlank;
                    // For non-blank values, check against the set
                    const strValue = String(cellValue).toLowerCase();
                    const set = new Set(filterValue.filter(v => v !== '__BLANK__').map(v => String(v).toLowerCase()));
                    return !set.has(strValue);
                }
            }
            
            // For other operators, convert to string and compare
            const strValue = String(cellValue).toLowerCase();
            const strFilter = typeof filterValue === 'string' ? String(filterValue).toLowerCase() : filterValue;
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
            // For 'in'/'notIn' operators, handle blank values before parsing numbers
            if (isInOperator) {
                if (!Array.isArray(filterValue)) return true;
                const hasBlank = filterValue.includes('__BLANK__');
                const isBlank = cellValue === '' || cellValue === null || cellValue === undefined;
                
                if (operator === 'in') {
                    if (isBlank && hasBlank) return true;
                    if (isBlank && !hasBlank) return false;
                    // For non-blank values, parse and check against the set
                    const numValue = typeof cellValue === 'number' ? cellValue : parseFloat(cellValue);
                    if (isNaN(numValue)) return false;
                    const set = new Set(filterValue.filter(v => v !== '__BLANK__').map(v => typeof v === 'number' ? v : parseFloat(v)).filter(v => !isNaN(v)));
                    return set.has(numValue);
                } else { // notIn
                    if (isBlank) return !hasBlank;
                    // For non-blank values, parse and check against the set
                    const numValue = typeof cellValue === 'number' ? cellValue : parseFloat(cellValue);
                    if (isNaN(numValue)) return false;
                    const set = new Set(filterValue.filter(v => v !== '__BLANK__').map(v => typeof v === 'number' ? v : parseFloat(v)).filter(v => !isNaN(v)));
                    return !set.has(numValue);
                }
            }
            
            // For other operators, parse numbers and compare
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
            const [year, month, day] = filterValue.split("-");
            const filterDate = new Date(year, month - 1, day); // *This is just the issue*
            console.log("filterDate: ", filterDate);
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


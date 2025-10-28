// Filter operators for different column types

export const TEXT_OPERATORS = [
    { value: 'contains', label: 'contains' },
    { value: 'notContains', label: 'does not contain' },
    { value: 'equals', label: 'equals' },
    { value: 'notEquals', label: 'not equals' },
    { value: 'startsWith', label: 'starts with' },
    { value: 'endsWith', label: 'ends with' },
    { value: 'empty', label: 'empty' },
    { value: 'notEmpty', label: 'not empty' }
];

export const NUMBER_OPERATORS = [
    { value: 'equal', label: 'equal' },
    { value: 'notEqual', label: 'not equal' },
    { value: 'lessThan', label: 'less than' },
    { value: 'lessThanOrEqual', label: 'less than or equal' },
    { value: 'greaterThan', label: 'greater than' },
    { value: 'greaterThanOrEqual', label: 'greater than or equal' },
    { value: 'empty', label: 'empty' },
    { value: 'notEmpty', label: 'not empty' }
];

export const DATE_OPERATORS = [
    { value: 'equal', label: 'equal' },
    { value: 'notEqual', label: 'not equal' },
    { value: 'before', label: 'before' },
    { value: 'beforeOrEqual', label: 'before or equal' },
    { value: 'after', label: 'after' },
    { value: 'afterOrEqual', label: 'after or equal' },
    { value: 'empty', label: 'empty' },
    { value: 'notEmpty', label: 'not empty' }
];

export const getOperatorsForType = (type) => {
    switch (type) {
        case 'number':
            return NUMBER_OPERATORS;
        case 'date':
            return DATE_OPERATORS;
        case 'text':
        default:
            return TEXT_OPERATORS;
    }
};


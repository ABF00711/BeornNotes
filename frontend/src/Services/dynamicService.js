
const dynamicService = {
    parseToDateObject: (val) => {
        if (val == null) return null;              // null or undefined -> null
        if (val instanceof Date && !isNaN(val)) return val;

        // If it's a numeric timestamp
        if (typeof val === 'number' && !isNaN(val)) {
            const d = new Date(val);
            return isNaN(d.getTime()) ? null : d;
        }

        // ISO or other string formats
        if (typeof val === 'string' && val.trim() !== '') {
            // common date-only format YYYY-MM-DD
            const dateOnlyMatch = val.match(/^(\d{4})-(\d{2})-(\d{2})$/);
            if (dateOnlyMatch) {
                // construct local midnight of that date
                return new Date(`${dateOnlyMatch[1]}-${dateOnlyMatch[2]}-${dateOnlyMatch[3]}T00:00:00`);
            }

            // try Date constructor (ISO or other parseable)
            const d = new Date(val);
            if (!isNaN(d.getTime())) return d;
        }

        return null;
    }
}

export default dynamicService;
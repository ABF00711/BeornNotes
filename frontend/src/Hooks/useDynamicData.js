import { useContext, useMemo } from "react"
import { MyContext } from "../Context"
import services from "../Services";
import { toast } from "react-toastify";

function useDynamicData() {
    const { dynamicData, setDynamicData, searchConfig, token } = useContext(MyContext);

    const statusBar = useMemo(() => ({
            statusPanels: [
                {
                    statusPanel: 'agTotalAndFilteredRowCountComponent',
                    align: 'left',
                },
            ],
        }), []);

    const getDynamicData = async (tableView) => {
        try {
            const res = await services.getDynamicData(tableView, token);
            if (res.message === "getDynamicData success") {
                setDynamicData(res.dynamicData);
            }
        } catch (error) {
            console.log("getDynamicDataError: ", error);
        }
    }

    const createDynamicData = async (tablename, newData) => {
        try {
            const res = await services.createDynamicData(tablename, newData, token);

            if (res.message === "createDynamicData success") {
                toast.success(`Created a new ${tablename} data successfully`);
                newData.id = res.newDataId;
                getDynamicData(tablename);
                return;
            }
            toast.error(res.message);
        } catch (error) {
            console.log("createDynamicDataError: ", error);
        }
    }

    const updateDynamicData = async (tablename, newData) => {
        try {
            const res = await services.updateDynamicData(tablename, newData, token);
            if (res.message == "updateDynamicData success") {
                toast.success(`Updated ${tablename} data successfully.`);
                // setDynamicData(dynamicData.map((item) => item.id === newData.id ? newData : item))
                getDynamicData(tablename);
                return;
            }
            toast.error(res.message);
        } catch (error) {
            console.log("getDynamicDataError: ", error);
        }
    }

    const deleteDynamicData = async (tablename, selectedRows) => {
        try {
            const res = await services.deleteDynamicData(tablename, selectedRows, token);
            if (res.message === "deleteDynamicData success") {
                toast.success("Deleted rows selected successfully");
                getDynamicData(tablename);
            }
        } catch (error) {
            console.log("deleteDynamicData: ", error);
        }
    }

    // Helper function to get filter type based on field type
    const getFilterType = (fieldType) => {
        const filterMap = {
            date: "agDateColumnFilter",
            number: "agNumberColumnFilter",
            default: "agTextColumnFilter"
        };
        return filterMap[fieldType] || filterMap.default;
    };

    // Helper function to create numeric comparator for set filter
    const createNumericComparator = () => (a, b) => {
        const numA = parseFloat(a);
        const numB = parseFloat(b);
        if (isNaN(numA) && isNaN(numB)) return 0;
        if (isNaN(numA)) return -1;
        if (isNaN(numB)) return 1;
        return numA - numB;
    };

    // Helper function to create case-insensitive text comparator for set filter
    const createTextComparator = () => (a, b) => 
        a?.toString().toLowerCase().localeCompare(b?.toString().toLowerCase());

    // Helper function to create date column definition
    const createDateColumnDef = (item) => ({
        field: item.field_name,
        headerName: item.field_label,
        filter: 'agMultiColumnFilter',
        filterParams: {
            filters: [
                { filter: 'agDateColumnFilter' },
                {
                    filter: 'agSetColumnFilter',
                    filterParams: {
                        caseSensitive: false,
                        treeList: true,
                        suppressSorting: false,
                        // Generate a stable, zero-padded key so lexical and numeric order align
                        keyCreator: p => {
                            const value = p.value instanceof Date ? p.value : new Date(p.value);
                            if (!value || isNaN(value.getTime())) return null;
                            const y = value.getFullYear();
                            const m = String(value.getMonth() + 1).padStart(2, '0');
                            const d = String(value.getDate()).padStart(2, '0');
                            return `${y}/${m}/${d}`; // e.g., 2000/02/05
                        },
                        // Build the hierarchical path [YYYY, MM, DD] with zero-padded month/day
                        pathGetter: p => {
                            const value = p.value instanceof Date ? p.value : new Date(p.value);
                            if (!value || isNaN(value.getTime())) return [];
                            const y = String(value.getFullYear());
                            const m = String(value.getMonth() + 1).padStart(2, '0');
                            const d = String(value.getDate()).padStart(2, '0');
                            return [y, m, d];
                        },
                        // Format labels while preserving numeric sort via zero-padded keys
                        treeListFormatter: function (...args) {
                            // Support both signatures:
                            // 1) (paramsObject) where { value, level }
                            // 2) (pathKey, level)
                            let valueRaw;
                            let level;
                            if (args.length === 1 && typeof args[0] === 'object' && args[0] !== null) {
                                valueRaw = args[0].value;
                                level = args[0].level;
                            } else {
                                valueRaw = args[0];
                                level = typeof args[1] === 'number' ? args[1] : 0;
                            }

                            if (valueRaw == null) return '';
                            const value = String(valueRaw);

                            if (level === 1) {
                                const mapMonth = (token) => {
                                    if (token == null) return '';
                                    const s = String(token).trim();
                                    const lower = s.toLowerCase();
                                    const num = parseInt(s, 10);
                                    const full = [
                                        'January','February','March','April','May','June','July','August','September','October','November','December'
                                    ];
                                    // Numeric month like "2" or "02"
                                    if (!Number.isNaN(num) && num >= 1 && num <= 12) return full[num - 1];
                                    // Abbrev or full names
                                    const abbrev = {
                                        jan: 1, feb: 2, mar: 3, apr: 4, may: 5, jun: 6, jul: 7, aug: 8, sep: 9, sept: 9, oct: 10, nov: 11, dec: 12
                                    };
                                    if (lower in abbrev) return full[abbrev[lower] - 1];
                                    if (full.map(n => n.toLowerCase()).includes(lower)) return s; // already full name
                                    return s;
                                };
                                return mapMonth(value);
                            }
                            if (level === 2) {
                                return value.startsWith('0') ? value.slice(1) : value;
                            }
                            return value;
                        }
                    }
                }
            ]
        },
        valueGetter: p => p.data[item.field_name] ? new Date(p.data[item.field_name]) : null,
        valueFormatter: p => p.value ? p.value.toLocaleDateString() : '',
        cellDataType: 'date',
        flex: 1,
        hide: false
    });

    // Helper function to create text column definition
    const createTextColumnDef = (item) => ({
        field: item.field_name,
        headerName: item.field_label,
        filter: "agMultiColumnFilter",
        filterParams: {
            filters: [
                { filter: getFilterType(item.field_type) },
                {
                    filter: "agSetColumnFilter",
                    filterParams: {
                        caseSensitive: false,
                        comparator: createTextComparator()
                    }
                }
            ]
        },
        textFormatter: (val) => val ? val.toLowerCase() : '',
        flex: 1,
        hide: false
    });

    // Helper function to create number column definition
    const createNumberColumnDef = (item) => ({
        field: item.field_name,
        headerName: item.field_label,
        filter: "agMultiColumnFilter",
        filterParams: {
            filters: [
                { filter: getFilterType(item.field_type) },
                {
                    filter: "agSetColumnFilter",
                    filterParams: {
                        caseSensitive: false,
                        comparator: createNumericComparator()
                    }
                }
            ]
        },
        flex: 1,
        hide: false
    });

    // Main function to get column definitions
    const getColumnDefs = (tableView) => {
        try {
            if (!searchConfig || !Array.isArray(searchConfig)) {
                console.warn("searchConfig is not available or not an array");
                return [];
            }

            const columnData = searchConfig
                .filter(item => item.table_name === tableView)
                .map((item) => {
                    if (!item.field_name || !item.field_label) {
                        console.warn("Invalid field configuration:", item);
                        return null;
                    }

                    switch (item.field_type) {
                        case "date":
                            return createDateColumnDef(item);
                        case "number":
                            return createNumberColumnDef(item);
                        default:
                            return createTextColumnDef(item);
                    }
                })
                .filter(Boolean); // Remove null entries

            return columnData;
        } catch (error) {
            console.error("getColumnDefsError:", error);
            return [];
        }
    };

    return (
        { dynamicData, setDynamicData, getDynamicData, getColumnDefs, createDynamicData, updateDynamicData, deleteDynamicData, statusBar }
    );
}

export default useDynamicData;
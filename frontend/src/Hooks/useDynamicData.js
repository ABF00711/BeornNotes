import { useContext } from "react"
import { MyContext } from "../Context"
import services from "../Services";
import { toast } from "react-toastify";

function useDynamicData() {
    const { dynamicData, setDynamicData, searchConfig, token } = useContext(MyContext);

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
                        keyCreator: p => p.value ? String(p.value.getFullYear()) : '',
                        comparator: (a, b) => {
                            const yearA = parseInt(a, 10);
                            const yearB = parseInt(b, 10);
                            if (isNaN(yearA) && isNaN(yearB)) return 0;
                            if (isNaN(yearA)) return -1;
                            if (isNaN(yearB)) return 1;
                            return yearA - yearB;
                        },
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
        { dynamicData, setDynamicData, getDynamicData, getColumnDefs, createDynamicData, updateDynamicData, deleteDynamicData }
    );
}

export default useDynamicData;
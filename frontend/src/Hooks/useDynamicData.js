import { useContext } from "react"
import { MyContext } from "../Context"
import services from "../Services";
import { toast } from "react-toastify";

function useDynamicData () {
    const {dynamicData, setDynamicData, searchConfig, token} = useContext(MyContext);

    const getDynamicData = async (tableView) => {
        try {
            const res = await services.getDynamicData(tableView, token);
            if(res.message === "getDynamicData success"){
                setDynamicData(res.dynamicData);
            }
        } catch (error) {
            console.log("getDynamicDataError: ", error);
        }
    }

    const createDynamicData = async (tablename, newData) => {
        try {
            const res = await services.createDynamicData(tablename, newData, token);

            if(res.message === "createDynamicData success"){
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
            if(res.message == "updateDynamicData success"){
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
            if(res.message === "deleteDynamicData success"){
                toast.success("Deleted rows selected successfully");
                getDynamicData(tablename);
            }
        } catch (error) {
            console.log("deleteDynamicData: ", error);
        }
    }

    const getColumnDefs = (tableView) => {
        try {
            const columnData = searchConfig
                .filter(item => item.table_name === tableView)
                .map((item) => {
                    let columnFiltername = "";
                    switch (item.field_type) {
                        case "date":
                            columnFiltername = "agDateColumnFilter";
                            break;
                        case "number":
                            columnFiltername = "agNumberColumnFilter";
                        default:
                            columnFiltername = "agTextColumnFilter";
                            break;
                    }
                    if (item.field_type === "date") {
                        return {
                            field: item.field_name, headerName: item.field_label, filter: "agMultiColumnFilter", filterParams: [{filter: "agSetColumnFilter", caseSensitive: false}, {filter: columnFiltername}],  flex: 1, hide: false, cellDataType: 'text',
                            valueFormatter: (params) => {
                                if (!params.value) return "";
                                return new Date(params.value).toLocaleDateString().split("T")[0];
                            }
                        }
                    }
                    return { field: item.field_name, headerName: item.field_label, filter: "agMultiColumnFilter", filterParams: [{filter: "agSetColumnFilter", caseSensitive: false}, {filter: columnFiltername}],  flex: 1, hide: false };
                })
            return columnData;
        } catch (error) {
            console.log("getColumnDefsError: ", error);
        }
    }

    return (
        {dynamicData, setDynamicData, getDynamicData, getColumnDefs, createDynamicData, updateDynamicData, deleteDynamicData}
    );
}

export default useDynamicData;
import { useContext } from "react"
import { MyContext } from "../Context"
import services from "../Services";
import { toast } from "react-toastify";

function useDynamicData () {
    const {dynamicData, setDynamicData, searchConfig} = useContext(MyContext);

    const getDynamicData = async (tableView) => {
        try {
            const res = await services.getDynamicData(tableView);
            if(res.message === "getDynamicData success"){
                setDynamicData(res.dynamicData);
            }
        } catch (error) {
            console.log("getDynamicDataError: ", error);
        }
    }

    const createDynamicData = async (tablename, newData) => {
        try {
            const res = await services.createDynamicData(tablename, newData);

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
            const res = await services.updateDynamicData(tablename, newData);
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
            const res = await services.deleteDynamicData(tablename, selectedRows);
            if(res.message === "deleteDynamicData success"){
                toast.success("Deleted rows selected successfully");
                getDynamicData(tablename);
            }
        } catch (error) {
            console.log("deleteDynamicData: ", error);
        }
    }

    const getColumDefs = (tableView) => {
        try {
            const columnData = searchConfig
                .filter(item => item.table_name === tableView)
                .map((item, index) => {
                    if (item.field_type === "date") {
                        return {
                            field: item.field_name, sortable: true, filter: true, colId: index, flex: 1, cellDataType: 'text',
                            valueFormatter: (params) => {
                                if (!params.value) return "";
                                return new Date(params.value).toLocaleDateString().split("T")[0];
                            }
                        }
                    }
                    return { field: item.field_name, sortable: true, filter: true, colId: index, flex: 1 };
                })
            return columnData;
        } catch (error) {
            console.log("getColumnDefsError: ", error);
        }
    }

    return (
        {dynamicData, getDynamicData, getColumDefs, createDynamicData, updateDynamicData, deleteDynamicData}
    );
}

export default useDynamicData;
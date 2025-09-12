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
                setDynamicData(prevData => ([...prevData, newData]));
                return;
            }
            toast.error(res.message);
        } catch (error) {
            console.log("createDynamicDataError: ", error);
        }
    }

    const updateDynamicData = () => {

    }

    const getColumDefs = (tableView) => {
        try {
            const columnData = searchConfig
                .filter(item => item.table_name === tableView)
                .map((item, index) => {
                    if (item.field_type === "date") {
                        return {
                            field: item.field_name, sortable: true, filter: true, colId: index, flex: 1,
                            valueFormatter: (params) => {
                                if (!params.value) return "";
                                return new Date(params.value).toISOString().split("T")[0];
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
        {dynamicData, getDynamicData, getColumDefs, createDynamicData, updateDynamicData}
    );
}

export default useDynamicData;
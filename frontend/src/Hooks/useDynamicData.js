import { useContext, useMemo } from "react"
import { MyContext } from "../Context"
import services from "../Services";
import { toast } from "react-toastify";
import useDocuments from "./useDocuments";

function useDynamicData() {
    const { dynamicData, setDynamicData, searchConfig, token, tableNames, setTableNames } = useContext(MyContext);
    const {openDocument} = useDocuments();

    const statusBar = useMemo(() => ({
        statusPanels: [
            {
                statusPanel: 'agTotalAndFilteredRowCountComponent',
                align: 'left',
            },
        ],
    }), []);

    const getDynamicData = async (formName) => {
        try {
            const res = await services.getDynamicData(formName);
            if (res.message === "getDynamicData success") {
                setDynamicData(res.dynamicData);
                setTableNames((currentTableNames) => ({
                    ...currentTableNames,
                    [formName]: res.tablename,
                }));
            }
        } catch (error) {
            console.log("getDynamicDataError: ", error);
        }
    }

    const createDynamicData = async (tablename, newData) => {
        try {
            for (const key in newData) {
                if (!newData[key]) {
                    newData[key] = null;
                }
            }
            const res = await services.createDynamicData(tablename, newData);

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
            for (const key in newData) {
                if (!newData[key]) {
                    newData[key] = null;
                }
            }
            const res = await services.updateDynamicData(tablename, newData);
            if (res.message == "updateDynamicData success") {
                toast.success(`Updated ${tablename} data successfully.`);
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
            if (res.message === "deleteDynamicData success") {
                toast.success("Deleted rows selected successfully");
                // getDynamicData(tablename);
                return;
            }
            toast.error(res.message);
        } catch (error) {
            console.log("deleteDynamicData: ", error);
        }
    }

    const searchDynamicData = async (formName, searchKey) => {
        try {
            const res = await services.searchDynamicData(formName, searchKey);
            if (res.message === "searchDynamicData success") {
                setDynamicData(res.dynamicData);
                setTableNames((current) => ({
                    ...current,
                    [formName]: res.tablename
                }));
                return;
            }
            console.log("searchDynamicDataError!");
        } catch (error) {
            console.log("deleteDynamicData: ", error);
        }
    }

    const getColumns = (tablename) => {
        const _columns = [];
        if (searchConfig) {
            searchConfig.map((config) => {
                if (config.table_name === tablename) {
                    const column = {};
                    column.field = config.field_name;
                    column.header = config.field_label;
                    column.type = config.field_type;
                    if (column.type === "combobox") column.type = "text"
                    if (column.type === "url") column.onClickUrl = openDocument
                    _columns.push(column);
                }
            });
        }
        return _columns;
    }

    return {
        tableNames, dynamicData, setDynamicData,
        getDynamicData,
        createDynamicData, updateDynamicData,
        deleteDynamicData, statusBar,
        searchDynamicData,
        getColumns
    }
}

export default useDynamicData;
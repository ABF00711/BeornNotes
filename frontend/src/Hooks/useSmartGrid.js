import { useContext } from "react";
import { MyContext } from "../Context";

function useSmartGrid() {
    const { searchConfig } = useContext(MyContext);

    const getSmartColumns = () => {
        try {
            if (!searchConfig) return [];
            const columns = [];
            searchConfig.map((configData) => {
                if (configData.table_name == "customers") {
                    const column = {
                        label: configData.field_label,
                        dataField: configData.field_name,
                    };
                    if (configData.field_type == "date") {
                        column.cellsFormat = 'dd/MM/yyyy';
                    }
                    columns.push(column);
                }
            })
            return columns;
        } catch (error) {
            console.log("getSmartColumnsError: ", error);
        }
    }

    return {
        getSmartColumns
    }
}

export default useSmartGrid;
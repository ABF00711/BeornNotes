import { useContext } from "react";
import { MyContext } from "../Context";

function useSmartGrid() {
    const { searchConfig } = useContext(MyContext);

    const getSmartColumns = () => {
        try {
          if (!searchConfig) return [];
          const columns = [];
      
          searchConfig.forEach((configData) => {
            if (configData.table_name === "customers") {
              let dataType = configData.field_type;
      
              // 🔹 Fix mappings
              if (dataType === "combobox") dataType = "string";
              if (dataType === "text") dataType = "string";
              if (dataType === "number") dataType = "number";
              if (dataType === "date") dataType = "date";
      
              const column = {
                label: configData.field_label,
                dataField: configData.field_name,
                dataType
              };
      
              if (dataType === "date") {
                column.cellsFormat = "dd/MM/yyyy";
              }
              columns.push(column);
            }
          });
          
          return columns;
        } catch (error) {
          console.log("getSmartColumnsError: ", error);
        }
      };      

    return {
        getSmartColumns, 
    }
}

export default useSmartGrid;
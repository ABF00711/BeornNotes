import { useContext } from "react";
import { MyContext } from "../Context";
import _ from "lodash"
import services from "../Services";

function useSmartGrid() {
  const { searchConfig, setGridState } = useContext(MyContext);

  const getSmartColumns = (onFunc, tableName) => {
    try {
      if (!searchConfig) return [];
      const columns = [];

      columns.push({
        label: "Actions",
        dataField: "actions",
        icon: 'fa-pencil',
        showIcon: true,
        formatFunction(settings) {
          const button = document.createElement("button");
          button.className = "btn-edit";
          button.innerHTML = "✎";

          button.addEventListener("click", () => {
            const unProxiedData = _.cloneDeep(settings.row.data);
            onFunc(unProxiedData)
          });

          // Assign the actual DOM node
          settings.cell.element.innerHTML = ""; // Clear existing content
          settings.cell.element.style.pointerEvents = 'none';
          button.style.pointerEvents = 'auto';
          settings.cell.element.appendChild(button);
        },
        summary: [''],
        allowReorder: false,
        freeze: "near",
        width: "100px"
      });

      searchConfig.forEach((configData) => {
        if (configData.table_name == tableName) {
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

          if (column.dataField == "age") {
            column.formatFunction = (settings) => {
              const value = settings.value;
              settings.value = (value === null || value === undefined || value === 0)
                ? ''
                : value;
            };
          }

          if (dataType === "date") {
            column.cellsFormat = "MM/dd/yyyy";
          }
          columns.push(column);
        }
      });

      return columns;
    } catch (error) {
      console.log("getSmartColumnsError: ", error);
    }
  };

  const saveGridState = async(state, formName) => {
    try {
      const res = await services.createGridState(state, formName);
      if(res.message == "createGridState success"){
        console.log(res.message);
      }
    } catch (error) {
      console.log("saveGridState: ", error);
    }
  }

  const getGridState = async (formName) => {
    try {
      const res = await services.getGridState(formName);
      if(res.message == "getGridState success"){
        return res.state;
      }
      return "";
    } catch (error) {
      console.log("getGridState: ", error);
    }
  }

  return {
    getSmartColumns, 
    saveGridState, 
    getGridState
  }
}

export default useSmartGrid;
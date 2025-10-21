import { useContext } from "react";
import { MyContext } from "../Context";
import _ from "lodash"

function useSmartGrid() {
  const { searchConfig } = useContext(MyContext);

  const getSmartColumns = (openUpdateModal, gridRef) => {
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
          button.className = "btn btn-primary btn-icon";
          button.innerHTML = "✎";

          button.addEventListener("click", () => {
            const unProxiedData = _.cloneDeep(settings.row.data);
            openUpdateModal(unProxiedData)
          });

          // Assign the actual DOM node
          settings.cell.element.innerHTML = ""; // Clear existing content
          settings.cell.element.style.pointerEvents = 'none';
          button.style.pointerEvents = 'auto';
          settings.cell.element.appendChild(button);
        },
        summary: ['count'],
        allowReorder: false,
      });

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

  return {
    getSmartColumns,
  }
}

export default useSmartGrid;
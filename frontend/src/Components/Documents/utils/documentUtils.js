import _ from "lodash";

export const getDocumentColumns = (documentData, onUpdate) => {
    try {
        const columns = [
            {
                label: "Edit",
                dataField: "edit",
                icon: 'fa-pencil',
                showIcon: true,
                formatFunction(settings) {
                    const button = document.createElement("button");
                    button.className = "btn btn-primary";
                    button.innerHTML = "✎";

                    button.addEventListener("click", () => {
                        const unProxiedData = _.cloneDeep(settings.row.data);
                        onUpdate(unProxiedData)
                    });

                    // Assign the actual DOM node
                    settings.cell.element.innerHTML = ""; // Clear existing content
                    settings.cell.element.style.pointerEvents = 'none';
                    button.style.pointerEvents = 'auto';
                    settings.cell.element.appendChild(button);
                },
                summary: [''],
                allowReorder: false,
            },
            {
                label: documentData.labels.name,
                dataField: 'name',
                sortOrder: 'asc',
                template: '<a href="#{{value}}">{{value}}</a>'
            },
            {
                label: documentData.labels.description,
                dataField: 'description',
            }
        ]

        return columns;
    } catch (error) {
        console.log("getDocumentColumnsError: ", error);
    }
}
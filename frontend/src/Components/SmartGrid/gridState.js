export const gridState = {
    behavior: {
        allowColumnReorder: true,
        columnResizeMode: 'growAndShrink'
    },
    appearance: {
        alternationCount: 2
    },
    sorting: {
        enabled: true,
        mode: 'one'
    },
    filtering: {
        enabled: true,
        filterRow: {
            visible: true
        }
    },
    selection: {
        enabled: true,
        checkBoxes: {
            enabled: true
        },
        action: "none"
    },
    header: {
        visible: true,
        buttons: ['columns']
    },
    stateSettings: {
        autoSave: true,
        autoLoad: true,
        autoSaveTimeout: 100,
        stateMethods: ['sorting', 'filtering', 'columns', 'grouping'],
    }
}
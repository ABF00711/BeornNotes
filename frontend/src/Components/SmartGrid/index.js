import React, { memo } from "react";
import "./style.css";
import { Grid } from "smart-webcomponents-react/grid";
import 'smart-webcomponents-react/source/styles/smart.default.css';
import { gridState } from "./gridState";

function SmartGrid(props) {
    const { formName, gridRef, customData, columns = [] } = props;

    if (gridRef.current) {
        const savedState = JSON.parse(localStorage.getItem(`smartGrid${formName}`) || null);
        const currentState = gridRef.current.getState();
        if (!areArraysEqual(savedState.columns, currentState.columns)) {
            gridRef.current.stateSettings.current = `smartGrid${formName}`;
            setTimeout(() => {
                gridRef.current.loadState(savedState);
            }, 100);
        }else{
            console.log("savedState: ", savedState);
            console.log("currentState: ", currentState);
        }
    }
    if(columns.length == 0 || customData.length == 0) {
        return;
    }

    return (
        <div className="smartGridTable">
            <Grid id={`smartGrid${formName}`}
                ref={gridRef}
                appearance={gridState.appearance}
                dataSource={customData}
                columns={columns}
                behavior={gridState.behavior}
                sorting={gridState.sorting}
                filtering={gridState.filtering}
                selection={gridState.selection}
                header={gridState.header}
                stateSettings={gridState.stateSettings}
                summaryRow={{
                    visible: true
                }}
            ></Grid>
        </div>
    );
}

function areArraysEqual(arr1, arr2) {
    if (arr1.length !== arr2.length) {
        return false;
    }
    for (let i = 0; i < arr1.length; i++) {
        if (JSON.stringify(arr1[i]) !== JSON.stringify(arr2[i])) {
            return false;
        }
    }
    return true;
}

export default memo(SmartGrid);
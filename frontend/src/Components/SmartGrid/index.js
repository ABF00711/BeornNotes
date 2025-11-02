import React, { memo, useEffect, useState, useRef } from "react";
import "./style.css";
import { Grid } from "smart-webcomponents-react/grid";
import 'smart-webcomponents-react/source/styles/smart.default.css';
import { gridState } from "./gridState";
import useSmartGrid from "../../Hooks/useSmartGrid";

function SmartGrid(props) {
    const [griColumnState, setGridColumnState] = useState(null);
    const [isGridReady, setIsGridReady] = useState(false);
    const { formName, gridRef, customData, columns = [], cellClick = () => { } } = props;
    const { saveGridState, getGridState } = useSmartGrid();

    const saveTimeoutRef = useRef(null);

    const onColumnChanged = (event) => {
        if (saveTimeoutRef.current) {
            clearTimeout(saveTimeoutRef.current);
        }

        saveTimeoutRef.current = setTimeout(() => {
            const savedState = localStorage.getItem(`smartGrid${formName}`) || null;
            saveGridState(savedState, formName);
            saveTimeoutRef.current = null;
        }, 500);
    }

    // Use callback ref to detect when grid is mounted
    const gridCallbackRef = (gridInstance) => {
        if (gridInstance) {
            gridRef.current = gridInstance;
            setIsGridReady(true);
        }
    };

    useEffect(() => {
        if (gridRef.current && isGridReady) {
            gridRef.current.stateSettings.current = `smartGrid${formName}`;
            const savedState = JSON.parse((localStorage.getItem(`smartGrid${formName}`) || griColumnState?.state) || null);
            const currentState = gridRef.current.getState();
            if (savedState) {
                if (!areArraysEqual(savedState.columns, currentState.columns)) {
                    setTimeout(() => {
                        gridRef.current?.loadState(savedState);
                    }, 100);
                }
            }
        }
    }, [isGridReady, formName, griColumnState])


    const initData = async () => {
        const _savedColumnState = await getGridState(formName);
        if (!_savedColumnState) return;
        setGridColumnState(_savedColumnState);
    }

    useEffect(() => {
        initData();
    }, [])

    useEffect(() => {
        return () => {
            if (saveTimeoutRef.current) {
                clearTimeout(saveTimeoutRef.current);
            }
        };
    }, [])

    if (columns?.length == 0 || customData?.length == 0) {
        return;
    }

    return (
        <div className={isGridReady ? "smartGridTable" : "isNotReady"}>
            <Grid id={`smartGrid${formName}`}
                ref={gridCallbackRef}
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
                onCellClick={(event) => { cellClick(event) }}
                onColumnResize={onColumnChanged}
                onColumnChange={onColumnChanged}
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
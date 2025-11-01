import React, { memo, useEffect, useState, useRef } from "react";
import "./style.css";
import { Grid } from "smart-webcomponents-react/grid";
import 'smart-webcomponents-react/source/styles/smart.default.css';
import { gridState } from "./gridState";
import useSmartGrid from "../../Hooks/useSmartGrid";

function SmartGrid(props) {
    const [griColumnState, setGridColumnState]= useState(null);
    const { formName, gridRef, customData, columns = [], cellClick = () => { } } = props;
    const {saveGridState, getGridState} = useSmartGrid();
    
    // Store timeout reference for debouncing - prevents multiple API calls
    const saveTimeoutRef = useRef(null);

    const onColumnChanged = (event) => {
        // Clear any existing timeout to debounce multiple rapid events
        if (saveTimeoutRef.current) {
            clearTimeout(saveTimeoutRef.current);
        }
        
        // Set new timeout - only the last event will execute saveGridState
        saveTimeoutRef.current = setTimeout(() => {
            const savedState = localStorage.getItem(`smartGrid${formName}`) || null;
            saveGridState(savedState, formName);
            saveTimeoutRef.current = null;
        }, 500);
    }

    useEffect(() => {
        if (gridRef.current) {
            gridRef.current.stateSettings.current = `smartGrid${formName}`;
            const savedState = JSON.parse((localStorage.getItem(`smartGrid${formName}`) || griColumnState?.state) || null);
            const currentState = gridRef.current.getState();
            if (savedState) {
                if (!areArraysEqual(savedState.columns, currentState.columns)) {
                    setTimeout(() => {
                        gridRef.current.loadState(savedState);
                    }, 100);
                }
            }
        }
    }, [gridRef.current])


    const initData = async () => {
        const _savedColumnState = await getGridState(formName);
        if(!_savedColumnState) return;
        console.log("savedColumnState: ", _savedColumnState);
        setGridColumnState(_savedColumnState);
    }

    useEffect(() => {
        console.log("gridColumnState: ", griColumnState);
    }, [griColumnState])

    useEffect(() => {
        initData();
    }, [])

    // Cleanup timeout on unmount to prevent memory leaks
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
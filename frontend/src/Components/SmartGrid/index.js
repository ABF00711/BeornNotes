import React, { useMemo, memo, useState, useEffect } from "react";
import "./style.css";
import { Grid } from "smart-webcomponents-react/grid";
import 'smart-webcomponents-react/source/styles/smart.default.css';
import useDynamicData from "../../Hooks/useDynamicData";
import useSearchConfig from "../../Hooks/useSearchConfig";
import useSmartGrid from "../../Hooks/useSmartGrid";
import { gridState } from "./gridState";

function SmartGrid(props) {
    const { formName, gridRef, onFunc, customData } = props;
    const { dynamicData, tableNames } = useDynamicData();
    const { searchConfig } = useSearchConfig();
    const { getSmartColumns } = useSmartGrid();
    const [isGridInitialized, setIsGridInitialized] = useState(false);

    const dataSourseSettings = useMemo(() => {
        try {
            if (!searchConfig) return { dataFields: [] };
            const dataFields = ['id: number'];
            searchConfig.forEach(config => {
                if (config.table_name !== "customers") return;
                let dataType;
                if (config.field_type == "text") dataType = "string";
                if (config.field_type == "combobox") dataType = "string";
                if (config.field_type == "number") dataType = "number";
                if (config.field_type == "date") dataType = "date";

                dataFields.push(`${config.field_name}: ${dataType}`);
            });
            return { dataFields };
        } catch (error) {
            console.log("getDataSourceSettingsError: ", error);
            return { dataFields: [] };
        }
    }, [searchConfig]);

    const columns = useMemo(() => {
        return getSmartColumns(onFunc, tableNames[formName]);
    }, [searchConfig, onFunc]);

    const isDataReady = useMemo(() => {
        return columns.length > 0 &&
            dataSourseSettings.dataFields?.length > 0 &&
            tableNames[formName] &&
            (dynamicData?.length > 0 || customData?.length > 0);
    }, [columns.length, dataSourseSettings.dataFields?.length, tableNames, formName, dynamicData?.length, customData?.length]);

    const dataAdapter = useMemo(() => {
        if (!isDataReady) return null;

        const dataToUse = customData || dynamicData;
        if (!dataToUse?.length) return null;

        return new window.Smart.DataAdapter({
            dataSource: dataToUse,
            dataFields: dataSourseSettings.dataFields
        });
    }, [isDataReady, dynamicData, customData, dataSourseSettings.dataFields]);

    // Track grid initialization
    useEffect(() => {
        if (isDataReady && !isGridInitialized) {
            setIsGridInitialized(true);
        }
    }, [isDataReady, isGridInitialized]);

    if (!isDataReady) {
        return <div className="smartGridTable">Loading...</div>;
    }

    if (!dataAdapter) {
        return <div className="smartGridTable">There is no data!</div>;
    }

    if (!isGridInitialized) {
        return <div className="smartGridTable">Initializing...</div>;
    }

    if (gridRef.current) {
        gridRef.current.stateSettings.current = `smartGrid${formName}`;
        setTimeout(() => {
            gridRef.current.loadState(JSON.parse(localStorage.getItem(`smartGrid${formName}`) || null));
        }, 100);
    }

    return (
        <div className="smartGridTable">
            <Grid id={`smartGrid${formName}`}
                ref={gridRef}
                appearance={gridState.appearance}
                dataSource={dataAdapter}
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

export default memo(SmartGrid);
import React, { useEffect, useState, useMemo, memo } from "react";
import "./style.css";
import { Grid } from "smart-webcomponents-react/grid";
import 'smart-webcomponents-react/source/styles/smart.default.css';
import useDynamicData from "../../Hooks/useDynamicData";
import useSearchConfig from "../../Hooks/useSearchConfig";
import useSmartGrid from "../../Hooks/useSmartGrid";
import useJob from "../../Hooks/useJob";
import { gridState } from "./gridState";

function SmartGrid(props) {
    const { formName, gridRef, openUpdateModal, customData } = props;
    const [columns, setColumns] = useState([]);
    const [displayData, setDisplayData] = useState([]);
    const [dataSourseSettings, setDataSourseSettings] = useState({ dataFields: [] });
    const { dynamicData, tableNames } = useDynamicData();
    const { searchConfig } = useSearchConfig();
    const { getSmartColumns } = useSmartGrid();
    const { jobs, getJobs } = useJob();

    const getDataSourceSettings = () => {
        try {
            if (!searchConfig) return;
            const dataFields = ['id: number'];
            searchConfig.forEach(config => {
                if (config.table_name !== "customers") return;
                let dataType = '';
                if (config.field_type == "text") dataType = "string";
                if (config.field_type == "combobox") dataType = "string";
                if (config.field_type == "number") dataType = "number";
                if (config.field_type == "date") dataType = "date";

                dataFields.push(`${config.field_name}: ${dataType}`);
            });
            setDataSourseSettings({ dataFields });
        } catch (error) {
            console.log("getDataSourceSettingsError: ", error);
        }
    }

    useEffect(() => {
        setColumns(getSmartColumns(openUpdateModal, gridRef));
        getDataSourceSettings();
    }, [searchConfig])

    useEffect(() => {
        getJobs();
    }, [])

    // Map job id -> name for display
    useEffect(() => {
        const dataToUse = customData || dynamicData;
        if (!Array.isArray(dataToUse)) { setDisplayData([]); return; }
        const idToName = new Map((jobs || []).map(j => [String(j.id), j.name]));
        const mapped = dataToUse.map(row => {
            const jobId = row?.job;
            const jobName = jobId != null ? idToName.get(String(jobId)) : undefined;
            return jobName ? { ...row, job: jobName } : row;
        });
        setDisplayData(mapped);
    }, [customData, dynamicData, jobs])

    const dataAdapter = useMemo(() => {
        if (!displayData || !dataSourseSettings.dataFields) return [];
        return new window.Smart.DataAdapter({
            dataSource: displayData,
            dataFields: dataSourseSettings.dataFields
        });
    }, [displayData, dataSourseSettings.dataFields?.length]);


    const isDataReady = columns.length > 0 &&
        dataSourseSettings.dataFields?.length > 0;

    if (gridRef.current) {
        gridRef.current.stateSettings.current = `smartGrid_${formName}`;
    }

    if (isDataReady && gridRef.current) {
        setTimeout(() => {
            gridRef.current?.loadState(JSON.parse(localStorage.getItem(`smartGrid_${formName}`) || null));
        }, 100);
    }

    if (!isDataReady) {
        return <div className="smartGridTable">Loading...</div>;
    }

    if (displayData.length == 0) {
        return <div className="smartGridTable">There is no data!</div>;
    }

    return (
        <div className="smartGridTable">
            <Grid id={tableNames[formName]}
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
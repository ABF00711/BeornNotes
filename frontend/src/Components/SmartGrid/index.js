import React, { useEffect, useRef, useState, useMemo, useCallback, memo } from "react";
import "./style.css";
import { Grid } from "smart-webcomponents-react/grid";
import 'smart-webcomponents-react/source/styles/smart.default.css';
import useDynamicData from "../../Hooks/useDynamicData";
import useSearchConfig from "../../Hooks/useSearchConfig";
import useSmartGrid from "../../Hooks/useSmartGrid";
import useJob from "../../Hooks/useJob";

function SmartGrid(props) {
    const { tablename, gridRef, openUpdateModal, customData } = props;
    const [columns, setColumns] = useState([]);
    const { getSearchConfigData, searchConfig } = useSearchConfig();
    const { dynamicData, getDynamicData } = useDynamicData();
    const { getSmartColumns } = useSmartGrid();
    const [dataSourseSettings, setDataSourseSettings] = useState({});
    const [displayData, setDisplayData] = useState([]);
    const { jobs, getJobs } = useJob();

    const behavior = useMemo(() => ({
        allowColumnReorder: true,
        columnResizeMode: 'growAndShrink'
    }), []);

    const appearance = {
		alternationCount: 2
	};

    const sorting = useMemo(() => ({
        enabled: true,
        mode: 'single'
    }), []);

    const filtering = useMemo(() => ({
        enabled: true,
        filterRow: {
			visible: true
		}
    }), []);

    const selection = useMemo(() => ({
        enabled: true,
        checkBoxes: {
            enabled: true
        }
    }), []);

    const header = useMemo(() => ({
        visible: true,
        buttons: ['columns']
    }), []);

    const stateSettings = useMemo(() => ({
        autoSave: true,
        autoLoad: true,
        autoSaveTimeout: 100,
        stateMethods: ['sorting', 'filtering', 'columns', 'grouping']
    }), []);

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

    const initializeData = async () => {
        try {
            await getSearchConfigData();
            await getDynamicData(tablename);
            await getJobs();
        } catch (error) {
            console.log('Data initialization error:', error);
        }
    }

    useEffect(() => {
        setColumns(getSmartColumns(openUpdateModal));
        getDataSourceSettings();
    }, [searchConfig])

    useEffect(() => {
        initializeData();
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
                       displayData.length > 0 && 
                       dataSourseSettings.dataFields?.length > 0;

    // One-time nudge to ensure autoLoad applies after grid is ready
    useEffect(() => {
        if (isDataReady && gridRef.current) {
            // Small delay to ensure grid is fully bound
            setTimeout(() => {
                gridRef.current?.loadState(JSON.parse(localStorage.getItem("Grid View")));
            }, 200);
        }
    }, [isDataReady]);

    if (!isDataReady) {
        return <div className="smartGridTable">Loading...</div>;
    }


    return (
        <div className="smartGridTable">
            <Grid id={tablename}
                ref={gridRef}
                appearance={appearance}
                dataSource={dataAdapter}
                columns={columns}
                behavior={behavior}
                sorting={sorting}
                filtering={filtering}
                selection={selection}
                header={header}
                stateSettings={stateSettings}
                
            ></Grid>
        </div>
    );
}

export default memo(SmartGrid);
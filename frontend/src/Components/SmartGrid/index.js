import React, { useEffect, useRef, useState, useMemo, useCallback, memo } from "react";
import "./style.css";
import { Grid } from "smart-webcomponents-react/grid";
import 'smart-webcomponents-react/source/styles/smart.default.css';
import useDynamicData from "../../Hooks/useDynamicData";
import useSearchConfig from "../../Hooks/useSearchConfig";
import useSmartGrid from "../../Hooks/useSmartGrid";

function SmartGrid(props) {
    const { tablename, gridRef, openUpdateModal } = props;
    const [columns, setColumns] = useState([]);
    const { getSearchConfigData, searchConfig } = useSearchConfig();
    const { dynamicData, getDynamicData } = useDynamicData();
    const { getSmartColumns } = useSmartGrid();
    const [dataSourseSettings, setDataSourseSettings] = useState({});

    const behavior = useMemo(() => ({
        allowColumnReorder: true,
        columnResizeMode: 'growAndShrink'
    }), []);

    const sorting = useMemo(() => ({
        enabled: true,
        mode: 'many'
    }), []);

    const filtering = useMemo(() => ({
        enabled: true,
        filterMenu: {
            mode: 'excel'
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
        } catch (error) {
            console.log('Data initialization error:', error);
        }
    }

    useEffect(() => {
        setColumns(getSmartColumns());
        getDataSourceSettings();
    }, [searchConfig])

    useEffect(() => {
        initializeData();
    }, [])

    const dataAdapter = useMemo(() => {
        if (!dynamicData || !dataSourseSettings.dataFields) return [];
        return new window.Smart.DataAdapter({
            dataSource: dynamicData,
            dataFields: dataSourseSettings.dataFields
        });
    }, [dynamicData, dataSourseSettings.dataFields?.length]); 

    const isDataReady = columns.length > 0 && 
                       dynamicData.length > 0 && 
                       dataSourseSettings.dataFields?.length > 0;

    // One-time nudge to ensure autoLoad applies after grid is ready
    useEffect(() => {
        if (isDataReady && gridRef.current) {
            // Small delay to ensure grid is fully bound
            setTimeout(() => {
                gridRef.current.loadState(JSON.parse(localStorage.getItem("Grid View")));
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
                dataSource={dataAdapter}
                columns={columns}
                behavior={behavior}
                sorting={sorting}
                filtering={filtering}
                selection={selection}
                header={header}
                stateSettings={stateSettings}
                onRowDoubleClick={(ev) => {openUpdateModal(ev.detail.data)}}
            ></Grid>
        </div>
    );
}

export default memo(SmartGrid);
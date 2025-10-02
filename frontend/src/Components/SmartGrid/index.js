import React, { useEffect, useRef, useState } from "react";
import "./style.css";
import { Grid } from "smart-webcomponents-react/grid";
import 'smart-webcomponents-react/source/styles/smart.default.css';
import useDynamicData from "../../Hooks/useDynamicData";
import useSearchConfig from "../../Hooks/useSearchConfig";
import useSmartGrid from "../../Hooks/useSmartGrid";

function SmartGrid(props) {
    const { tablename, gridRef, setIsOpen, setUpdateData } = props;
    const [columns, setColumns] = useState([]);
    const { getSearchConfigData, searchConfig } = useSearchConfig();
    const { dynamicData, getDynamicData } = useDynamicData();
    const { getSmartColumns } = useSmartGrid();
    const [dataSourseSettings, setDataSourseSettings] = useState({});

    const behavior = {
        allowColumnReorder: true,
        columnResizeMode: 'growAndShrink'
    };

    const sorting = {
        enabled: true,
        mode: 'many'
    };

    const filtering = {
        enabled: true,
        filterMenu: {
            mode: 'excel'
        }
    };

    const selection = {
        enabled: true,
        checkBoxes: {
            enabled: true
        }
    };

    const header = {
        visible: true,
        buttons: ['columns']
    };

    const stateSettings = {
        autoSave: true,
        autoLoad: true
    }

    const onRowDoubleClick = (ev) => {
        console.log("ev.detail.data:", ev.detail.data);
        setIsOpen(true);
        setUpdateData(ev.detail.data);
    }

    const getDataSourceSettings = () => {
        try {
            if(!searchConfig) return;
            const dataFields = ['id: number'];
            searchConfig.forEach(config => {
                if(config.table_name !== "customers")return;
                let dataType = '';
                if(config.field_type == "text") dataType = "string";
                if(config.field_type == "combobox") dataType = "string";
                if(config.field_type == "number") dataType = "number";
                if(config.field_type == "date") dataType = "date";

                dataFields.push(`${config.field_name}: ${dataType}`);
            });
            setDataSourseSettings({dataFields});
        } catch (error) {
            console.log("getDataSourceSettingsError: ", error);
        }
    }

    const initializeData = async () => {
        await getSearchConfigData();
        await getDynamicData(tablename);
    }

    useEffect(() => {
        setColumns(getSmartColumns());
        getDataSourceSettings();
    }, [searchConfig])

    useEffect(() => {
        initializeData();
    }, [])

    return (
        <div className="smartGridTable">
            <Grid id="myGrid"
                ref={gridRef}
                dataSource={new window.Smart.DataAdapter({
                    dataSource: dynamicData,
                    dataFields: dataSourseSettings.dataFields
                })}
                dataSourceSettings={dataSourseSettings}
                columns={columns}
                behavior={behavior}
                sorting={sorting}
                filtering={filtering}
                selection={selection}
                header={header}
                stateSettings={stateSettings}
                onRowDoubleClick={onRowDoubleClick}
            ></Grid>
        </div>
    );
}

export default SmartGrid;
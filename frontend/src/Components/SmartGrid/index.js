import React, { useEffect, useRef, useState } from "react";
import "./style.css";
import { Grid } from "smart-webcomponents-react/grid";
import 'smart-webcomponents-react/source/styles/smart.default.css';
import useDynamicData from "../../Hooks/useDynamicData";
import useSearchConfig from "../../Hooks/useSearchConfig";
import useSmartGrid from "../../Hooks/useSmartGrid";

function SmartGrid({ tableName, gridRef }) {
    const [columns, setColumns] = useState([]);
    const { getSearchConfigData, searchConfig } = useSearchConfig();
    const { dynamicData, getDynamicData } = useDynamicData();
    const { getSmartColumns } = useSmartGrid();

    const behavior = {
        allowColumnReorder: true,
        columnResizeMode: 'growAndShrink'
    };

    const sorting = {
        enabled: true,
        sortMode: 'one'
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

    useEffect(() => {
        if(!columns || !tableName)return;
        const savedColumnsState = JSON.parse(localStorage.getItem("Grid View") || null);
        if(savedColumnsState == null) return;
        const grid = gridRef.current;
        grid.loadState(savedColumnsState);
    }, [columns])

    const initializeData = async () => {
        await getSearchConfigData();
        await getDynamicData(tableName);
        setColumns(getSmartColumns());
    }
    
    useEffect(() => {
        initializeData();
    }, [])

    return (
        <div className="smartGridTable">
            <Grid id="myGrid"
                ref={gridRef}
                dataSource={dynamicData}
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

export default SmartGrid;
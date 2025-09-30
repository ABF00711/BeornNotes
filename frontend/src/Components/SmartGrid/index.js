import React, { useEffect, useRef, useState } from "react";
import "./style.css";
import { Grid } from "smart-webcomponents-react/grid";
import 'smart-webcomponents-react/source/styles/smart.default.css';
import useDynamicData from "../../Hooks/useDynamicData";
import useSearchConfig from "../../Hooks/useSearchConfig";
import useSmartGrid from "../../Hooks/useSmartGrid";

function SmartGrid({ tableName }) {
    const [columns, setColumns] = useState([]);
    const { getSearchConfigData, searchConfig } = useSearchConfig();
    const { dynamicData, getDynamicData } = useDynamicData();
    const { getSmartColumns } = useSmartGrid();
    const gridRef = useRef(null);

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
        if(!columns) return;
        const savedColumnState = JSON.parse(localStorage.getItem("Grid View") || null);
        const grid = gridRef.current;
        if (grid && savedColumnState) {
            grid.loadState(savedColumnState);
        }
    }, [columns])

    useEffect(() => {
        setColumns(getSmartColumns());
    }, [searchConfig])

    useEffect(() => {
        getSearchConfigData();
        getDynamicData(tableName);
    }, [])

    return (
        <div className="smartGridTable">
            <Grid id="grid"
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
import React, { memo, useCallback, useEffect, useMemo, useRef } from "react";
import "./style.css";
import SmartGrid from "../../Components/SmartGrid";
import Add from "../../Components/Add";
import SmartDelete from "../../Components/Delete";
import SmartLayouts from "../../Components/Layouts";
import SmartSearchPattern from "../../Components/SearchPattern";
import ResetBtn from "../../Components/Reset";
import useDynamicData from "../../Hooks/useDynamicData";
import { useNavigate } from "react-router-dom";
import useSmartGrid from "../../Hooks/useSmartGrid";

const formName = "Customers";

function Customers() {
    const navigate = useNavigate();
    const { getDynamicData, dynamicData, tableNames } = useDynamicData();
    const {getSmartColumns} = useSmartGrid();
    const gridRef = useRef(null);

    const onNavigate = useCallback((data) => {
        navigate("/updateCustomer", {state: data});
    }, [])
    
    const columns = useMemo(() => {
        return getSmartColumns(onNavigate, tableNames[formName]);
    }, [tableNames]);
 
    const getInit = async () => {
        getDynamicData(formName);
    }

    useEffect(() => {
        getInit();
    }, [])

    return (
        <div className="customers">
            <div className="customers-toolbar">
                <div className="toolbar-left">
                    <Add formName={formName} />
                    <SmartDelete formName={formName} gridRef={gridRef} />
                    <ResetBtn gridRef={gridRef} />
                </div>
                <div className="toolbar-right">
                    <SmartLayouts formName={formName} gridRef={gridRef} />
                    <SmartSearchPattern formName={formName} gridRef={gridRef} />
                </div>
            </div>
            <SmartGrid
                formName={formName}
                gridRef={gridRef}
                customData = {dynamicData}
                columns = {columns}
            />
        </div>
    );
}

export default memo(Customers);
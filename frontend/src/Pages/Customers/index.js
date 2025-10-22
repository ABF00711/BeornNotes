import React, { useCallback, useContext, useEffect, useRef, useState } from "react";
import "./style.css";
import SmartGrid from "../../Components/SmartGrid";
import Add from "../../Components/Add";
import SmartDelete from "../../Components/Delete";
import SmartLayouts from "../../Components/Layouts";
import SmartSearchPattern from "../../Components/SearchPattern";
import ResetBtn from "../../Components/Reset";
import useDynamicData from "../../Hooks/useDynamicData";
import useSearchConfig from "../../Hooks/useSearchConfig";
import { useNavigate } from "react-router-dom";
import { MyContext } from "../../Context";

const formName = "Customers";

const tabBtnData = {
    id: 100,
    title: "Edit",
    active: true,
    icon: "",
    path: "/updateCustomer",
    screen_id: "udpateCustomer",
}

function Customers() {
    const navigate = useNavigate();
    const { setCurrentInterface } = useContext(MyContext);
    const { getDynamicData } = useDynamicData();
    const { getSearchConfigData } = useSearchConfig();
    const gridRef = useRef(null);
    const [updateData, setUpdateData] = useState({});

    const onNavigate = useCallback((data) => {
        setUpdateData(data);
        navigate(tabBtnData.path, {state: updateData});
        setCurrentInterface(prev => {
            const exists = prev.tabbedBtns.find(item => item.id === tabBtnData.id);
            prev.tabbedBtns = exists ? prev.tabbedBtns : [...prev.tabbedBtns, tabBtnData];
            prev.activeUrl = tabBtnData.path;
            return prev;
        });
    }, [])

    const getInit = async () => {
        await getSearchConfigData();
        await getDynamicData(formName);
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
                onFunc={onNavigate}
            />
        </div>
    );
}

export default Customers;
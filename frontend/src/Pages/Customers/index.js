import React, { useCallback, useContext, useEffect, useRef, useState } from "react";
import "./style.css";
import { MyContext } from "../../Context";
import SmartGrid from "../../Components/SmartGrid";
import Add from "../../Components/Add";
import SmartDelete from "../../Components/Delete";
import SmartLayouts from "../../Components/Layouts";
import SmartSearchPattern from "../../Components/SearchPattern";
import Update from "../../Components/Update";
import ResetBtn from "../../Components/Reset";
import useDynamicData from "../../Hooks/useDynamicData";
import useSearchConfig from "../../Hooks/useSearchConfig";

const formName = "Customers";

function Customers() {
    const { isCollapsed } = useContext(MyContext);
    const { getDynamicData } = useDynamicData();
    const { getSearchConfigData } = useSearchConfig();
    const gridRef = useRef(null);
    const [isOpen, setIsOpen] = useState(false);
    const [updateData, setUpdateData] = useState({});

    const openUpdateModal = useCallback((data) => {
        setUpdateData(data);
        setIsOpen(true);
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
                openUpdateModal={openUpdateModal}
            />
            <Update
                formName={formName}
                isOpen={isOpen}
                setIsOpen={setIsOpen}
                updateData={updateData}
                setUpdateData={setUpdateData}
            />
        </div>
    );
}

export default Customers;
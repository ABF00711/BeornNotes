import React, { useContext, useEffect, useRef, useState } from "react";
import "./style.css";
import Header from "../../Components/Header";
import Sidebar from "../Sidebar";
import Navbar from "../Navbar";
import { MyContext } from "../../Context";
import useDynamicData from "../../Hooks/useDynamicData";
import { AgGridReact } from "ag-grid-react";
import { themeAlpine } from "ag-grid-community";
import useSearchConfig from "../../Hooks/useSearchConfig";
import { toast } from "react-toastify";
import InputGroup from "../../Components/InputGroup";

function Customers2() {
    const { isCollapsed } = useContext(MyContext);
    const { dynamicData, getColumDefs, getDynamicData } = useDynamicData();
    const { getSearchConfigData, searchConfig } = useSearchConfig();
    const [gridData, setGridData] = useState([]);
    const [columnDefs, setColumnDefs] = useState([]);
    const gridRef = useRef();
    const [ageKey, setAgeKey] = useState("");
    const [jobKey, setJobKey] = useState("");

    const onSearch = () => {
        const trimmedAge = ageKey.trim();
        const trimmedJob = jobKey.trim();
        if (trimmedAge == "" && trimmedJob == "") {
            toast.error("Please input any search key!");
            return;
        }

        setGridData(dynamicData.filter(({ age, job }) => {
            if (trimmedAge && trimmedJob) return age == trimmedAge && job == trimmedJob;
            if (trimmedAge) return age == trimmedAge;
            if (trimmedJob) return job == trimmedJob;
            return true;
        }));
    }

    const onReset = () => {
        setGridData(dynamicData);
    }

    useEffect(() => {
        setColumnDefs(getColumDefs("customers"));
    }, [searchConfig])

    useEffect(() => {
        setGridData(dynamicData);
    }, [dynamicData])

    useEffect(() => {
        getDynamicData("customers");
        getSearchConfigData();
    }, [])

    return (
        <div className="dashboard">
            <Header />
            <Navbar />
            <div className={`dashboard-container ${!isCollapsed ? 'M_L_280' : ''}`}>
                <div className="main">
                    <div className="customers2">
                        <div className="customers2-search">
                            <div className="search-fields">
                                <InputGroup />
                                <InputGroup />
                            </div>
                            <div className="search-btns">
                                <button className="search" onClick={onSearch}>Search</button>
                                <button className="reset" onClick={onReset}>Reset</button>
                            </div>
                        </div>
                        <div className="customers2-table">
                            <AgGridReact
                                ref={gridRef}
                                rowData={gridData}
                                columnDefs={columnDefs}
                                theme={themeAlpine}
                            />
                        </div>
                    </div>
                </div>
            </div>
            <Sidebar />
        </div>
    );
}

export default Customers2;
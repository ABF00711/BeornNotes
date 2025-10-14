import React, { useCallback, useContext, useEffect, useRef, useState } from "react";
import "./style.css";
import Header from "../../Components/Header";
import Navbar from "../Navbar";
import Sidebar from "../Sidebar";
import { MyContext } from "../../Context";
import SmartGrid from "../../Components/SmartGrid";
import Add from "../../Components/Add";
import Update from "../../Components/Update";
import InputGroup from "../../Components/InputGroup";
import useDynamicData from "../../Hooks/useDynamicData";
import useJob from "../../Hooks/useJob";
import SmartDelete from "../../Components/Delete";
import SmartLayouts from "../../Components/Layouts";
import SmartSearchPattern from "../../Components/SearchPattern";

const formName = "Customers2";

function Customers2() {
    const { isCollapsed } = useContext(MyContext);
    const gridRef = useRef(null);
    const [isOpen, setIsOpen] = useState(false);
    const [updateData, setUpdateData] = useState({});
    const [searchKey, setSearchKey] = useState({ age: "", job: "" });
    const [filteredData, setFilteredData] = useState([]);
    const { dynamicData, getDynamicData } = useDynamicData();
    const { jobs, getJobs } = useJob();

    const openUpdateModal = useCallback((data) => {
        setUpdateData(data);
        setIsOpen(true);
    }, [])

    const onSearch = () => {
        const trimmedAge = searchKey.age.trim();
        const trimmedJob = searchKey.job.trim();

        if (!trimmedAge && !trimmedJob) {
            setFilteredData(dynamicData);
            return;
        }

        setFilteredData(dynamicData.filter((oneData) => {
            if (!trimmedAge) {
                return oneData.job == trimmedJob;
            }
            if (!trimmedJob) {
                return oneData.age == trimmedAge;
            }
            return (oneData.age == trimmedAge) && (oneData.job == trimmedJob);
        }));
    }

    const updateSearchKey = (e) => {
        setSearchKey({
            ...searchKey,
            [e.target.name]: e.target.value
        })
    }

    useEffect(() => {
        getDynamicData("customers");
        getJobs();
    }, [])

    useEffect(() => {
        setFilteredData(dynamicData);
    }, [dynamicData])

    return (
        <div className="dashboard">
            <Header />
            <Navbar />
            <div className={`dashboard-container ${!isCollapsed ? 'M_L_280' : ''}`}>
                <div className="customers">
                    <div className="customers-toolbar">
                        <div className="toolbar-left">
                            <Add table_name={formName} />
                            <SmartDelete tablename={formName} gridRef={gridRef} />
                            <div>
                                <InputGroup props={{
                                    fieldFormat: { id: "age", field_type: "number", field_label: "Age", field_name: "age" },
                                    handleChange: updateSearchKey,
                                    value: searchKey.age
                                }} />
                                <InputGroup props={{
                                    fieldFormat: { id: "job", field_type: "combobox", field_label: "Job", field_name: "job", lookup_sql: "Select name from job Order By name" },
                                    handleChange: updateSearchKey,
                                    value: searchKey.job
                                }} />
                            </div>
                            <button onClick={onSearch} type="button" className="btn btn-primary">
                                <span className="btn-icon">⌕</span>
                                <span className="btn-label">Search</span>
                            </button>
                        </div>
                        <div className="toolbar-right">
                            <SmartLayouts formName={formName} gridRef={gridRef} />
                            <SmartSearchPattern formName={formName} gridRef={gridRef} />
                        </div>
                    </div>
                    <SmartGrid
                        formName = {formName}
                        gridRef={gridRef}
                        openUpdateModal = {openUpdateModal}
                        customData={filteredData}
                        />
                    <Update
                        formName={formName}
                        isOpen={isOpen}
                        setIsOpen={setIsOpen}
                        updateData={updateData}
                        setUpdateData={setUpdateData}
                    />
                </div>
            </div>
            <Sidebar />
        </div>
    );
}

export default Customers2;
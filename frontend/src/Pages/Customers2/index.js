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
import useSearchConfig from "../../Hooks/useSearchConfig";
import { ComboBox } from "smart-webcomponents-react/combobox";
import { Input } from "smart-webcomponents-react/input";

const formName = "Customers2";

function Customers2() {
    const { isCollapsed } = useContext(MyContext);
    const { getSearchConfigData } = useSearchConfig();
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

        if (!trimmedAge && !searchKey.job) {
            setFilteredData(dynamicData);
            return;
        }

        setFilteredData(dynamicData.filter((oneData) => {
            if (!trimmedAge) {
                return oneData.job == searchKey.job;
            }
            if (!searchKey.job) {
                return oneData.age == trimmedAge;
            }
            return (oneData.age == trimmedAge) && (oneData.job == searchKey.job);
        }));
    }

    useEffect(() => {
        setFilteredData(dynamicData);
    }, [dynamicData])

    useEffect(() => {
        getSearchConfigData();
        getDynamicData(formName);
        getJobs();
    }, [])


    return (
        <div className="dashboard">
            <Header />
            <Navbar />
            <div className={`dashboard-container ${!isCollapsed ? 'M_L_280' : ''}`}>
                <div className="customers2">
                    <div className="customers-toolbar">
                        <div className="toolbar-left">
                            <Add formName={formName} />
                            <SmartDelete formName={formName} gridRef={gridRef} />
                        </div>
                        <div className="searchbox">
                            <div className="searchField">
                                <div className="searchField_container">
                                    <label>Age</label>
                                    <Input type="number" onChange={(e) => { setSearchKey({ ...searchKey, age: e.target.value }) }}></Input>
                                </div>
                                <div className="searchField_container">
                                    <label>Job</label>
                                    <ComboBox
                                        dataSource={jobs}
                                        displayMember="name"
                                        valueMember="id"
                                        onChange={(e) => { setSearchKey({ ...searchKey, job: e.detail.value }) }}
                                    ></ComboBox>
                                </div>
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
                        formName={formName}
                        gridRef={gridRef}
                        openUpdateModal={openUpdateModal}
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
import React, { useCallback, useEffect, useRef, useState } from "react";
import "./style.css";
import SmartGrid from "../../Components/SmartGrid";
import Add from "../../Components/Add";
import Update from "../../Components/Update";
import useDynamicData from "../../Hooks/useDynamicData";
import useJob from "../../Hooks/useJob";
import SmartDelete from "../../Components/Delete";
import SmartLayouts from "../../Components/Layouts";
import SmartSearchPattern from "../../Components/SearchPattern";
import { ComboBox } from "smart-webcomponents-react/combobox";
import { Input } from "smart-webcomponents-react/input";
import { getJobComboRef, getSearchKey, onSearch } from "./utils";
import useSmartGrid from "../../Hooks/useSmartGrid";

const formName = "Customers2";

function Customers2() {
    const [columns, setColumns] = useState([]);
    const gridRef = useRef(null);
    const [isOpen, setIsOpen] = useState(false);
    const [updateData, setUpdateData] = useState({});
    const [searchKey, setSearchKey] = useState(getSearchKey());
    const [filteredData, setFilteredData] = useState([]);
    const { dynamicData, getDynamicData, tableNames } = useDynamicData();
    const { getSmartColumns } = useSmartGrid();
    const { jobs, getJobs } = useJob();

    const jobComboBoxRef = useRef(null);

    const openUpdateModal = useCallback((data) => {
        setUpdateData(data);
        setIsOpen(true);
    }, [])

    const getInitdata = () => {
        getDynamicData(formName);
        getJobs();
    }

    useEffect(() => {
        getJobComboRef(jobComboBoxRef, jobs, searchKey);
    }, [searchKey.job, jobs]);

    useEffect(() => {
        onSearch(searchKey, setFilteredData, dynamicData);
    }, [dynamicData])

    useEffect(() => {
        setColumns(getSmartColumns(openUpdateModal, tableNames[formName]));
    }, [tableNames]);

    useEffect(() => {
        getInitdata();
    }, [])

    return (
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
                            <Input
                                type="number"
                                value={searchKey.age || ""}
                                onChange={(e) => {
                                    setSearchKey({ ...searchKey, age: e.target.value })
                                }}
                            ></Input>
                        </div>
                        <div className="searchField_container">
                            <label>Job</label>
                            <ComboBox
                                ref={jobComboBoxRef}
                                dataSource={jobs}
                                displayMember="name"
                                valueMember="name"
                                allowCustomValue={true}
                                onChange={(e) =>
                                    setSearchKey((prev) => ({ ...prev, job: e.detail.value }))
                                }
                            />
                        </div>
                    </div>
                    <button onClick={() => { onSearch(searchKey, setFilteredData, dynamicData) }} type="button" className="btn btn-primary">
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
                onFunc={openUpdateModal}
                customData={filteredData}
                columns={columns}
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

export default Customers2;
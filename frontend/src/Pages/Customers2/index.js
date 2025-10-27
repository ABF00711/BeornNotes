import React, { useCallback, useContext, useEffect, useRef, useState } from "react";
import "./style.css";
import { MyContext } from "../../Context";
import SmartGrid from "../../Components/SmartGrid";
import Add from "../../Components/Add";
import Update from "../../Components/Update";
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
    const [searchKey, setSearchKey] = useState(() => {
        try {
            const stored = JSON.parse(localStorage.getItem("customers2SearchKey") || "{}");
            return {
                age: stored && stored.age !== undefined && stored.age !== null ? String(stored.age) : "",
                job: stored && stored.job !== undefined && stored.job !== null ? stored.job : "",
            };
        } catch (error) {
            console.log("initSearchKeyError: ", error);
            return { age: "", job: "" };
        }
    });
    const [filteredData, setFilteredData] = useState([]);
    const { dynamicData, getDynamicData } = useDynamicData();
    const { jobs, getJobs } = useJob();

    const jobComboBoxRef = useRef(null);

    const openUpdateModal = useCallback((data) => {
        setUpdateData(data);
        setIsOpen(true);
    }, [])

    const onSearch = () => {
        try {
            const trimmedJob = searchKey.job?.trim();
            if (!searchKey.age && !trimmedJob) {
                setFilteredData(dynamicData);
                return;
            }

            setFilteredData(dynamicData.filter((oneData) => {
                if (!searchKey.age) {
                    return oneData.job == trimmedJob;
                }
                if (!trimmedJob) {
                    return oneData.age == searchKey.age;
                }
                return (oneData.age == searchKey.age) && (oneData.job == trimmedJob);
            }));
            localStorage.setItem("customers2SearchKey", JSON.stringify(searchKey));
        } catch (error) {
            console.log("onSearchError: ", error);
        }
    }

    const getInitdata = async () => {
        await getSearchConfigData();
        await getDynamicData(formName);
        await getJobs();
    }

    useEffect(() => {
        onSearch();
    }, [dynamicData])

    useEffect(() => {
        getInitdata();
    }, [])

    // Set initial value for ComboBox using ref
    useEffect(() => {
        if (jobComboBoxRef.current && searchKey.job && jobs.length > 0) {
            try {
                // Try to set the value using the component's API
                if (jobComboBoxRef.current.setValue) {
                    jobComboBoxRef.current.setValue(searchKey.job);
                } else if (jobComboBoxRef.current.value !== undefined) {
                    jobComboBoxRef.current.value = searchKey.job;
                }
            } catch (error) {
                console.log("Error setting ComboBox initial value:", error);
            }
        }
    }, [searchKey.job, jobs]);

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
                onFunc={openUpdateModal}
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
    );
}

export default Customers2;
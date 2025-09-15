import React, { useEffect, useState } from "react";
import "./style.css";
import { Select } from "antd";
import { toast } from "react-toastify";
import useSearchpatterns from "../../../Hooks/useFilters";

function Searchpatterns(props) {
    const { tablename } = props;
    const { getSearchpatterns, updateSearchpatterns, deleteSearchpatterns, createSearchpatterns, searchpatterns } = useSearchpatterns();
    const [isOpen, setIsOpen] = useState(false);
    const [patternName, setPatternName] = useState("");
    const [searchName, setSearchName] = useState("");
    const [options, setOptions] = useState([]);
    const [justSelected, setJustSelected] = useState(false);

    const onChange = (value) => {
        setPatternName(value);
    }

    const onSearch = (value) => {
        setJustSelected(true);
        setPatternName(value);
        setTimeout(() => setJustSelected(false), 0);
    }

    const getOptions = () => {
        try {
            setOptions(searchpatterns.map((filter) => {
                return {
                    label: filter.name,
                    value: filter.name
                };
            }));
        } catch (error) {
            console.log("getOptionsErrror: ", error);
        }
    }

    const onSave = () => {
        if (searchName === "") {
            toast.error("Please input a search name");
            return;
        }
        const searchData = localStorage.getItem("searchpatterns");
        if (searchpatterns.find(pattern => pattern.name === searchName)) {
            if (window.confirm("This search name already exists, do you want to update it?") === true) {
                updateSearchpatterns(searchData, searchName, tablename);
                setPatternName("");
                setIsOpen(false);
                return;
            }
            return;
        }
        createSearchpatterns(searchData, searchName, tablename);
        setPatternName("");
        setIsOpen(false);
    }

    const saveAsDefault = () => {
        const searchData = localStorage.getItem("searchpatterns");
        updateSearchpatterns(searchData, "Default", tablename);
        setPatternName("");
        setIsOpen(false);
    }

    const onDelete = () => {
        const selectedPatternIndex = searchpatterns.findIndex(pattern => pattern.name === patternName);
        if (selectedPatternIndex == -1) {
            toast.error("Please select name exactly!");
            return;
        }
        console.log("selectedSearchPattern: ", searchpatterns[selectedPatternIndex])
        if (window.confirm("Really want to delete this!")){
            deleteSearchpatterns(tablename, searchpatterns[selectedPatternIndex].id);
        }
    }

    const handleBlur = () => {
        if (patternName.trim() === "") return;
        if (!justSelected) {
            setSearchName(patternName);
        }
    };

    useEffect(() => {
        getOptions();
    }, [searchpatterns])

    useEffect(() => {
        getSearchpatterns(tablename);
    }, [])

    return (
        <div>
            <button onClick={() => { setIsOpen(!isOpen) }} type="button" className="btn btn-outline">
                <span className="btn-icon">🔍</span>
                <span className="btn-label">Search</span>
            </button>
            {
                isOpen ?
                    <div className="filterModal-body">
                        <Select
                            showSearch
                            placeholder="Select a filer name"
                            value={patternName}
                            onChange={onChange}
                            onSearch={onSearch}
                            options={options}
                            onBlur={handleBlur}
                            filterOption={(input, option) =>
                                option?.label?.toLowerCase().includes(input.toLowerCase())
                            }
                            notFoundContent={null}
                        />
                        <div>
                            <button>Apply</button>
                        </div>
                        <div>
                            <button onClick={onSave}>Save</button>
                        </div>
                        <div>
                            <button onClick={saveAsDefault}>Save as Default</button>
                        </div>
                        <div>
                            <button disabled={patternName ? false : true} onClick={onDelete}>Delete</button>
                        </div>
                    </div> :
                    <></>
            }
        </div>
    );
}

export default Searchpatterns;
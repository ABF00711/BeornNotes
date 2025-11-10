import React from "react";
import "./style.css";
import { Select } from "antd";
import { useState, useRef, useEffect } from "react";
import { toast } from "react-toastify";
import useSearchpatterns from "../../../../Hooks/useFilters";

function SearchPattern_Custom({ formName, displayColumns, sortConfig, filterConfig, setTableColumns }) {
    const { getSearchpatterns, updateSearchpatterns, deleteSearchpatterns, createSearchpatterns, searchpatterns } = useSearchpatterns();
    const [isOpen, setIsOpen] = useState(false);
    const [patternName, setPatternName] = useState("");
    const [searchName, setSearchName] = useState("");
    const [options, setOptions] = useState([]);
    const [justSelected, setJustSelected] = useState(false);
    const containerRef = useRef(null);

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
        const searchDataJSON = JSON.stringify({
            filterConfig,
            sortConfig
        });
        if (searchpatterns.find(pattern => pattern.name === searchName)) {
            if (window.confirm("This search name already exists, do you want to update it?") === true) {
                updateSearchpatterns(searchDataJSON, searchName, formName);
                setPatternName("");
                setIsOpen(false);
                return;
            }
            return;
        }
        createSearchpatterns(searchDataJSON, searchName, formName);
        setPatternName("");
        setIsOpen(false);
    }

    const saveAsDefault = () => {
        try {
            const searchDataJSON = JSON.stringify({
                filterConfig,
                sortConfig
            })
            updateSearchpatterns(searchDataJSON, "Default", formName);
            setPatternName("");
            setIsOpen(false);
        } catch (error) {
            console.log("saveAsDefaultError: ", error)
        }
    }

    const onDelete = () => {
        const selectedPatternIndex = searchpatterns.findIndex(pattern => pattern.name === patternName);
        if (selectedPatternIndex == -1) {
            toast.error("Please select name exactly!");
            return;
        }
        if (window.confirm("Really want to delete this!")) {
            deleteSearchpatterns(formName, searchpatterns[selectedPatternIndex].id);
        }
    }

    const onApply = () => {
        try {
            const selectedPattern = searchpatterns.find(pattern => pattern.name === patternName);
            if (!selectedPattern) {
                toast.error("Please select name exactly!");
                return;
            }
            const parsedPattern = JSON.parse(selectedPattern.data || "{}");
            setTableColumns({ columns:displayColumns, sortConfig: parsedPattern.sortConfig, filterConfig: parsedPattern.filterConfig })
            toast.success("Applied");
        } catch (error) {
            console.log("onApplyError: ", error);
        }
    }

    const handleBlur = () => {
        if (patternName.trim() === "") return;
        if (!justSelected) {
            setSearchName(patternName);
        }
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (!isOpen) return;
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [isOpen]);

    useEffect(() => {
        getOptions();
    }, [searchpatterns])

    useEffect(() => {
        getSearchpatterns(formName);
    }, [])

    return (
        <div className="searchpatterns" ref={containerRef}>
            <button
                className="header-action-btn search-btn"
                onClick={() => {setIsOpen(!isOpen)}}
                title="Save/Load Search (Filter & Sort State)"
            >
                <svg className="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="11" cy="11" r="8"></circle>
                    <path d="m21 21-4.35-4.35"></path>
                </svg>
                Search
            </button>
            {
                isOpen ?
                    <div className="filterModal-body">
                        <div className="modal-header">
                            <div className="modal-title">Search</div>
                            <button type="button" className="modal-close" onClick={() => setIsOpen(false)}>✕</button>
                        </div>
                        <Select
                            showSearch
                            placeholder="Select a filer name"
                            value={patternName}
                            onChange={onChange}
                            onSearch={onSearch}
                            options={options}
                            onBlur={handleBlur}
                            allowClear
                            style={{ width: "100%" }}
                            getPopupContainer={(trigger) => trigger.parentNode}
                            filterOption={(input, option) =>
                                option?.label?.toLowerCase().includes(input.toLowerCase())
                            }
                            notFoundContent={null}
                        />
                        <div className="filter-actions">
                            <button className="btn btn-primary" onClick={onApply}>Apply</button>
                            <button className="btn btn-outline" onClick={onSave}>Save</button>
                            <button className="btn btn-outline" onClick={saveAsDefault}>Save as Default</button>
                            <button className="btn btn-danger" disabled={patternName ? false : true} onClick={onDelete}>Delete</button>
                        </div>
                    </div> :
                    <></>
            }
        </div>
    );
}

export default SearchPattern_Custom;
import React from "react";
import "./style.css";
import { Select } from "antd";
import { useState, useRef, useEffect } from "react";
import { toast } from "react-toastify";
import useSearchpatterns from "../../Hooks/useFilters";

function SmartSearchPattern({ tablename, gridRef }) {
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
        const savedColumnState = JSON.parse(localStorage.getItem(`smartGrid_${tablename}`) || "{}");
        const searchDataJSON = JSON.stringify({
            filter: savedColumnState.filter,
            sort: savedColumnState.sort
        })
        if (searchpatterns.find(pattern => pattern.name === searchName)) {
            if (window.confirm("This search name already exists, do you want to update it?") === true) {
                updateSearchpatterns(searchDataJSON, searchName, tablename);
                setPatternName("");
                setIsOpen(false);
                return;
            }
            return;
        }
        createSearchpatterns(searchDataJSON, searchName, tablename);
        setPatternName("");
        setIsOpen(false);
    }

    const saveAsDefault = () => {
        const savedColumnState = JSON.parse(localStorage.getItem(`smartGrid_${tablename}`));
        const searchDataJSON = JSON.stringify({
            filter: savedColumnState.filter,
            sort: savedColumnState.sort
        })
        updateSearchpatterns(searchDataJSON, "Default", tablename);
        setPatternName("");
        setIsOpen(false);
    }

    const onDelete = () => {
        const selectedPatternIndex = searchpatterns.findIndex(pattern => pattern.name === patternName);
        if (selectedPatternIndex == -1) {
            toast.error("Please select name exactly!");
            return;
        }
        if (window.confirm("Really want to delete this!")) {
            deleteSearchpatterns(tablename, searchpatterns[selectedPatternIndex].id);
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
            const savedColumnState = JSON.parse(localStorage.getItem(`smartGrid_${tablename}`));
            savedColumnState.filter = parsedPattern.filter;
            savedColumnState.sort = parsedPattern.sort;
            gridRef.current.loadState(savedColumnState);
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
        getSearchpatterns(tablename);
    }, [])

    return (
        <div className="searchpatterns" ref={containerRef}>
            <button onClick={() => { setIsOpen(!isOpen) }} type="button" className="btn btn-outline">
                <span className="btn-icon">🔍</span>
                <span className="btn-label">Search</span>
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

export default SmartSearchPattern;
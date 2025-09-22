import React, { useEffect, useRef, useState, useContext } from "react";
import "./style.css";
import { Select, Button } from "antd";
import { toast } from "react-toastify";
import useLayouts from "../../Hooks/useLayouts";
import { MyContext } from "../../Context";

function Layouts(props) {
    const { tablename, gridRef } = props;
    const { layouts } = useContext(MyContext);
    const { getLayouts, createLayouts, updateLayouts, deleteLayouts } = useLayouts();

    const [isOpen, setIsOpen] = useState(false);
    const [layoutName, setLayoutName] = useState("");
    const [selectedName, setSlectedName] = useState("");
    const [options, setOptions] = useState([]);
    const [justSelected, setJustSelected] = useState(false);
    const containerRef = useRef(null);

    const onChange = (value) => {
        setLayoutName(value);
    }

    const onSearch = (value) => {
        setJustSelected(true);
        setLayoutName(value);
        setTimeout(() => setJustSelected(false), 0);
    }

    const applyLayout = () => {
        try {
            if (!gridRef.current?.api) return;
            const selected = layouts.find(l => l.layout_name === layoutName);
            if (!selected) {
                toast.error("Please select layout exactly!");
                return;
            }
            const layoutState = JSON.parse(selected.layout_json);
            gridRef.current.api.applyColumnState({ state: layoutState, applyOrder: true });
            toast.success("Applied");
        } catch (error) {
            console.log("applyLayoutError: ", error);
        }
    }

    const saveLayout = () => {
        try {
            if (!gridRef.current?.api) return;
            if (selectedName.trim() === "") {
                toast.error("Please input a layout name");
                return;
            }
            const columnState = gridRef.current.api.getColumnState();
            const layoutJson = JSON.stringify(columnState);
            const exists = layouts.find(l => l.layout_name === selectedName);
            if (exists) {
                if (window.confirm("This layout name already exists, update it?")) {
                    updateLayouts(tablename, selectedName, layoutJson);
                    setIsOpen(false);
                }
                return;
            }
            createLayouts(tablename, selectedName, layoutJson);
            setIsOpen(false);
        } catch (error) {
            console.log("saveLayoutError: ", error);
        }
    }

    const saveDefault = () => {
        try {
            if (!gridRef.current.api) return;
            const columnState = gridRef.current.api.getColumnState();
            const layoutJson = JSON.stringify(columnState);
            updateLayouts(tablename, "Default", layoutJson);
            setIsOpen(false);
        } catch (error) {
            console.log("saveDefaultLayoutError: ", error);
        }
    }

    const removeLayout = () => {
        try {
            const selected = layouts.find(l => l.layout_name === layoutName);
            if (!selected) {
                toast.error("Please select layout exactly!");
                return;
            }
            if (window.confirm("Really want to delete this!")) {
                deleteLayouts(tablename, selected.id);
                setIsOpen(false);
            }
        } catch (error) {
            console.log("removeLayoutError: ", error);
        }
    }

    const buildOptions = () => {
        try {
            setOptions(layouts.map(l => ({ label: l.layout_name, value: l.layout_name })));
        } catch (error) {
            console.log("buildOptionsError: ", error);
        }
    }

    const onBlur = () => {
        if(layoutName.trim() === "")return;
        if(!justSelected){
            setSlectedName(layoutName);
        }
    }

    useEffect(() => {
        buildOptions();
    }, [layouts])

    useEffect(() => {
        getLayouts(tablename);
    }, [])

    useEffect(() => {
        const onDocClick = (e) => {
            if (!isOpen) return;
            if (containerRef.current && !containerRef.current.contains(e.target)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", onDocClick);
        return () => document.removeEventListener("mousedown", onDocClick);
    }, [isOpen])

    return (
        <div className="layouts" ref={containerRef}>
            <button onClick={() => setIsOpen(!isOpen)} type="button" className="btn btn-outline">
                <span className="btn-icon">🗂️</span>
                <span className="btn-label">Layouts</span>
            </button>
            {isOpen && (
                <div className="layouts-modal">
                    <Select
                        showSearch
                        placeholder="Select a layout name"
                        value={layoutName}
                        onChange={onChange}
                        onSearch={onSearch}
                        onBlur={onBlur}
                        options={options}
                        getPopupContainer={(trigger) => trigger.parentNode}
                        notFoundContent={null}
                        style={{ width: "100%" }}
                        filterOption={(input, option) => option?.label?.toLowerCase().includes(input.toLowerCase())}
                    />
                    <div className="layouts-actions">
                        <Button className="btn btn-primary" onClick={applyLayout}>Apply</Button>
                        <Button className="btn btn-outline" onClick={saveLayout}>Save</Button>
                        <Button className="btn btn-outline" onClick={saveDefault}>Save as Default</Button>
                        <Button className="btn btn-danger" onClick={removeLayout}>Delete</Button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Layouts;
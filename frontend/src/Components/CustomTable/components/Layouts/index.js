import "./style.css";
import { Button, Select } from "antd";
import { useState, useRef, useContext, useEffect } from "react";
import { toast } from "react-toastify";
import { LayoutContext } from "../../../../Context/LayoutContex";
import useLayouts from "../../../../Hooks/useLayouts";

function SmartLayouts({ formName, displayColumns, setDisplayColumns, setOnColumnChanged }) {
    const { layouts } = useContext(LayoutContext);
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
    const onBlur = () => {
        if (layoutName.trim() === "") return;
        if (!justSelected) {
            setSlectedName(layoutName);
        }
    }
    const applyLayout = () => {
        try {
            const selected = layouts.find(l => l.layout_name === layoutName);
            if (!selected) {
                toast.error("Please select layout exactly!");
                return;
            }
            const layoutState = JSON.parse(selected.layout_json);
            setDisplayColumns(layoutState);
            setOnColumnChanged(true);
            toast.success("Applied");
        }
        catch (error) {
            console.log("applyLayoutError: ", error);
        }
    }
    const saveLayout = () => {
        try {
            if (!selectedName) {
                toast.error("Please input name exactly!");
                return;
            }
            const exists = layouts.find(l => l.layout_name === selectedName);
            if (exists) {
                if (window.confirm("This layout name already exists, update it?")) {
                    updateLayouts(formName, selectedName, JSON.stringify(displayColumns));
                }
                return;
            }
            createLayouts(formName, selectedName, JSON.stringify(displayColumns));
            setIsOpen(false);
        } catch (error) {
            console.log("saveLayoutError: ", error);
        }
    }
    const saveDefault = () => {
        try {
            const layoutJson = JSON.stringify(displayColumns);
            updateLayouts(formName, "Default", layoutJson);
            setIsOpen(false);
        }
        catch (error) {
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
            deleteLayouts(formName, selected.id);
            setIsOpen(false);
        }
        catch (error) {
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

    useEffect(() => {
        buildOptions();
    }, [layouts])

    useEffect(() => {
        getLayouts(formName);
    }, []);

    return (<>
        <div className="layouts" ref={containerRef}>
            <button
                className="header-action-btn layout-btn"
                onClick={() => { setIsOpen(!isOpen) }}
                title="Save/Load Layout (Column Width, Order, Visibility)"
            >
                <svg className="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="3" width="7" height="7"></rect>
                    <rect x="14" y="3" width="7" height="7"></rect>
                    <rect x="14" y="14" width="7" height="7"></rect>
                    <rect x="3" y="14" width="7" height="7"></rect>
                </svg>
                Layout
            </button>
            {isOpen && (
                <div className="layouts-modal">
                    <div className="modal-header">
                        <div className="modal-title">Layouts</div>
                        <button type="button" className="modal-close" onClick={() => setIsOpen(false)}>✕</button>
                    </div>
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
    </>
    );
}

export default SmartLayouts;
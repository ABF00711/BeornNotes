import { Button, Select } from "antd";
import { useState, useRef, useContext, useEffect } from "react";
import { MyContext } from "../../../Context";
import useLayouts from "../../../Hooks/useLayouts";
import { toast } from "react-toastify";

function SmartLayouts({tablename, gridRef}) {
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
    const onBlur = () => {
        if(layoutName.trim() === "")return;
        if(!justSelected){
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
            const savedColumnState = JSON.parse(localStorage.getItem("Grid View") || null);
            if((savedColumnState !== null) && savedColumnState.columns){
                savedColumnState.columns = layoutState;
            }
            gridRef.current.loadState(savedColumnState);
            toast.success("Applied");
        }
        catch (error) {
            console.log("applyLayoutError: ", error);
        }
    }
    const saveLayout = () => {
        try {
            if(!selectedName){
                toast.error("Please input name exactly!");
                return;
            }
            const columnState = JSON.parse(localStorage.getItem("Grid View") || "{}");
            if(!columnState) return;
            const exists = layouts.find(l => l.layout_name === selectedName);
            if (exists) {
                if (window.confirm("This layout name already exists, update it?")) {
                    updateLayouts(tablename, selectedName, JSON.stringify(columnState.columns));
                }
                return;
            }
            createLayouts(tablename, selectedName, JSON.stringify(columnState.columns));
            setIsOpen(false);
        }catch (error) {
            console.log("saveLayoutError: ", error);
        }
    }
    const saveDefault = () => {
        try {
            const columnState = JSON.parse(localStorage.getItem("Grid View") || "{}");
            const layoutJson = JSON.stringify(columnState.columns);
            updateLayouts(tablename, "Default", layoutJson);
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
            deleteLayouts(tablename, selected.id);
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
    },[layouts])

    useEffect(() => {
        getLayouts(tablename);
    }, []);

    return (
        <div className="layouts" ref={containerRef}>
            <button onClick={() => setIsOpen(!isOpen)} type="button" className="btn btn-outline">
                <span className="btn-icon">🗂️</span>
                <span className="btn-label">Layouts</span>
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
    );
}

export default SmartLayouts;
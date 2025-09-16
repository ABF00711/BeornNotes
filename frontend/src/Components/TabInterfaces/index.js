import React, { useContext, useEffect, useRef, useState } from "react";
import "./style.css";
import { Select, Button } from "antd";
import useTabbedInterfaces from "../../Hooks/useTabbedInterfaces";
import { MyContext } from "../../Context";
import { toast } from "react-toastify";

function TabInterfaces(props) {
    const {navigate} = props
    const { currentInterface, setCurrentInterface } = useContext(MyContext);
    const { getTabInterfaces, createTabInterfaces, updateTabInterfaces, deleteTabInterfaces } = useTabbedInterfaces();

    const [isOpen, setIsOpen] = useState(false);
    const [tiName, setTiName] = useState("");
    const [selectedName, setSelectedName] = useState("");
    const [options, setOptions] = useState([]);
    const [justSelected, setJustSelected] = useState(false);
    const containerRef = useRef(null);

    const { tabbedInterfaces } = useContext(MyContext);

    const onChange = (value) => setTiName(value);
    const onSearch = (value) => { setJustSelected(true); setTiName(value); setTimeout(() => setJustSelected(false), 0); };
    const onBlur = () => { if (tiName.trim() === "") return; if (!justSelected) setSelectedName(tiName); };

    const buildOptions = () => setOptions(tabbedInterfaces.map(t => ({ label: t.tabs_name, value: t.tabs_name })));

    const save = () => {
        const json = JSON.stringify(currentInterface);
        if (selectedName.trim() === "") return;
        const exists = tabbedInterfaces.find(t => t.tabs_name === selectedName);
        if (exists) {
            if(window.confirm("This name is already existing, update it?"))
            updateTabInterfaces(selectedName, json);
            setIsOpen(false);
            return;
        }
        createTabInterfaces(selectedName, json); setIsOpen(false);
    };

    const saveDefault = () => {
        const json = JSON.stringify(currentInterface);
        updateTabInterfaces("Default", json); setIsOpen(false);
    };

    const remove = () => {
        const selected = tabbedInterfaces.find(t => t.tabs_name === tiName);
        if (!selected) {
            toast.error("Please select name exactly!");
            return;
        }
        if(window.confirm("Really want to delete this tab?")){
            deleteTabInterfaces(selected.id); setIsOpen(false);
        }
    };

    const onApply = () => {
        const selected = tabbedInterfaces.find(t => t.tabs_name === tiName);
        if (!selected) {
            toast.error("Please select name exactly!");
            return;
        }
        setCurrentInterface(JSON.parse(selected.tabs_json));
        localStorage.setItem("tabbedInterface", selected.tabs_json);
        navigate(JSON.parse(selected.tabs_json).activeUrl);
        setIsOpen(false);
    }

    useEffect(() => { buildOptions(); }, [tabbedInterfaces]);
    useEffect(() => { getTabInterfaces(); }, []);

    useEffect(() => {
        const onDocClick = (e) => { if (!isOpen) return; if (containerRef.current && !containerRef.current.contains(e.target)) setIsOpen(false); };
        document.addEventListener("mousedown", onDocClick);
        return () => document.removeEventListener("mousedown", onDocClick);
    }, [isOpen]);

    return (
        <div className="tabInterfaces" ref={containerRef}>
            <button type="button" className="btn btn-outline" onClick={() => setIsOpen(!isOpen)}>
                <span className="btn-icon">🧩</span>
                <span className="btn-label">Tab Interfaces</span>
            </button>
            {isOpen && (
                <div className="tabInterfaces-modal">
                    <Select
                        showSearch
                        placeholder="Select a name"
                        value={tiName}
                        onChange={onChange}
                        onSearch={onSearch}
                        onBlur={onBlur}
                        options={options}
                        getPopupContainer={(trigger) => trigger.parentNode}
                        notFoundContent={null}
                        style={{ width: "100%" }}
                        filterOption={(input, option) => option?.label?.toLowerCase().includes(input.toLowerCase())}
                    />
                    <div className="tabInterfaces-actions">
                        <Button className="btn btn-outline" onClick={save}>Save</Button>
                        <Button className="btn btn-outline" onClick={saveDefault}>Save as Default</Button>
                        <Button className="btn btn-primary" onClick={onApply}>Apply</Button>
                        <Button className="btn btn-danger" onClick={remove}>Delete</Button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default TabInterfaces;
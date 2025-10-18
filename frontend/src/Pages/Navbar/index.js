import React, { useContext, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./style.css";
import TabbedBtn from "../../Components/TabbedBtn";
import TabInterfaces from "../../Components/TabInterfaces";
import { MyContext } from "../../Context";
import useTabbedInterfaces from "../../Hooks/useTabbedInterfaces";

function Navbar() {
    const { isCollapsed, currentInterface, setCurrentInterface } = useContext(MyContext);
    const navigate = useNavigate();
    const {getCurrentTabInterface} = useTabbedInterfaces();
    const draggedIdRef = useRef(null);

    const arrayMove = (arr, fromIndex, toIndex) => {
        const copy = [...arr];
        const [moved] = copy.splice(fromIndex, 1);
        copy.splice(toIndex, 0, moved);
        return copy;
    };

    const onDragStart = (id) => {
        draggedIdRef.current = id;
    };

    const onDrop = (overId) => {
        try {
            const activeId = draggedIdRef.current;
            if (activeId === overId) return;
            const tabs = currentInterface?.tabbedBtns || [];
            const oldIndex = tabs.findIndex(t => (t?.id ?? t?.key ?? t?.path) === activeId);
            const newIndex = tabs.findIndex(t => (t?.id ?? t?.key ?? t?.path) === overId);
            if (oldIndex === -1 || newIndex === -1) return;

            const nextTabs = arrayMove(tabs, oldIndex, newIndex);
            localStorage.setItem("currentInterface", JSON.stringify({ ...currentInterface, tabbedBtns: nextTabs }));
            setCurrentInterface({ ...currentInterface, tabbedBtns: nextTabs });
        } catch (error) {
            console.log("onDropError: ", error);
        }
    };

    const renderTabs = () => {
        const tabs = currentInterface?.tabbedBtns || [];
        return tabs.filter(Boolean).map((btnInfo) => {
            const stableId = btnInfo.id ?? btnInfo.key ?? btnInfo.path;
            return (
                <div
                    key={stableId}
                    draggable
                    onDragStart={() => onDragStart(stableId)}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={() => onDrop(stableId)}
                    style={{ cursor: "grab" }}
                >
                    <TabbedBtn btnInfo={btnInfo} />
                </div>
            );
        });
    };

    useEffect(() => {
        getCurrentTabInterface();
    }, [])

    return (
        <div className="navbar">
            <div className="navbar-container">
                <div className={`breadcrumb ${!isCollapsed ? 'M_L_280' : 'M_L_60'}`}>
                    {renderTabs()}
                </div>
                <div className="navbar-actions">
                    <TabInterfaces navigate={navigate} />
                </div>
            </div>
        </div>
    );
}

export default Navbar;
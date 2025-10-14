import React, { useContext } from "react";
import "./style.css";
import { MyContext } from "../../Context";
import useSearchpatterns from "../../Hooks/useFilters";
import useLayouts from "../../Hooks/useLayouts";
import { toast } from "react-toastify";

function ResetBtn(props) {
    const { gridRef, formName } = props;
    const { searchpatterns } = useSearchpatterns();
    const { layouts } = useLayouts();

    const resetGrid = () => {
        try {
            if(!gridRef.current) return;
            const grid = gridRef.current;
            const columnState = {};
            const defaultPattern = searchpatterns.find((pattern) => pattern.name == "Default");
            const defaultLayout = layouts.find((layout) => layout.layout_name == "Default");
            if (defaultPattern) {
                const parsedPattern = JSON.parse(defaultPattern.data);
                columnState.filter = parsedPattern.filter;
                columnState.sort = parsedPattern.sort;
            }
            if (defaultLayout) {
                columnState.column = JSON.parse(defaultLayout.layout_json);
                return;
            }
            if (defaultPattern || defaultLayout) {
                grid.loadState(columnState);
                return;
            }
            grid.resetState();
        } catch (error) {
            console.log("error: ", error);
        }
    }

    return (
        <button onClick={resetGrid} type="button" className="btn btn-primary">
            <span className="btn-icon">↻</span>
            <span className="btn-label">Reset</span>
        </button>
    );
}

export default ResetBtn;
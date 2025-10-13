import React from "react";
import "./style.css";

function ResetBtn(props) {
    const {gridRef} = props;

    const resetGrid = () => {
        const grid = gridRef.current;
        if(grid){
            grid.resetState();
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
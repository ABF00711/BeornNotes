import React, { useCallback, useState } from "react";
import useSearchpatterns from "../../../Hooks/useFilters";

function Reset({ gridRef }) {
    const {restoreSearchpatterns} = useSearchpatterns();

    const onReset = useCallback(() => {
        localStorage.removeItem("layout");
        localStorage.removeItem("searchpatterns");
        restoreSearchpatterns(gridRef);
    }, [])

    return (
        <button onClick={() => { onReset(gridRef) }} type="button" className="btn btn-warning">
            <span className="btn-icon">⟲</span>
            <span className="btn-label">Reset</span>
        </button>
    );
}

export default Reset;
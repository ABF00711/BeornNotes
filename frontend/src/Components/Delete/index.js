import React from "react";
import "./style.css";
import { toast } from "react-toastify";
import useDynamicData from "../../Hooks/useDynamicData";

function SmartDelete(props) {
    const { formName, gridRef } = props;
    const {tableNames} = useDynamicData();
    const {deleteDynamicData} = useDynamicData();

    const onDelete = () => {
        if(gridRef == null) return;
        try {
            const selectedRows = gridRef.current?.getSelectedRowsData();
            const selectedIds = gridRef.current?.getSelectedRowIds();
            if (selectedIds.length === 0) {
                toast.error("No rows selected!");
                return;
            }
            if(window.confirm("Really want to delete selected rows?") === true){
                deleteDynamicData(tableNames[formName], selectedRows);
                selectedIds.forEach(id => {
                    gridRef.current.deleteRow(id);
                });
            }
        } catch (error) {
            console.log("onDeleteError: ", error);
        }
    }

    return (
        <button onClick={onDelete} type="button" className="btn btn-dangerous">
            <span className="btn-icon">🗑</span>
            <span className="btn-label">Delete</span>
        </button>
    );
}

export default SmartDelete;
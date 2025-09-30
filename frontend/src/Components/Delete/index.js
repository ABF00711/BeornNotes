import React from "react";
import "./style.css";
import { MyContext } from "../../Context";
import useDynamicData from "../../Hooks/useDynamicData";
import { toast } from "react-toastify";

function Delete(props) {
    const { tablename, gridRef } = props;
    const {deleteDynamicData} = useDynamicData();

    const onDelete = () => {
        try {
            const selectedRows = gridRef.current?.api.getSelectedRows();
            if (!selectedRows || selectedRows.length === 0) {
                toast.error("No rows selected!");
                return;
            }
            if(window.confirm("Really want to delete selected rows?") === true){
                deleteDynamicData(tablename, selectedRows);
                gridRef.current?.api.applyTransaction(selectedRows);
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

export default Delete;
import "./style.css";
import useDynamicData from "../../../../Hooks/useDynamicData";

function SmartDelete(props) {
    const { formName, selectedRows } = props;
    const { tableNames } = useDynamicData();
    const { deleteDynamicData } = useDynamicData();

    const onDelete = () => {
        try {
            if (window.confirm("Really want to delete selected rows?") === true) {
                deleteDynamicData(tableNames[formName], Array.from(selectedRows));
            }
        } catch (error) {
            console.log("onDeleteError: ", error);
        }
    }

    return (
        <button
            className="header-action-btn delete-btn-header"
            onClick={() => {onDelete()}}
            title="Delete Selected Rows"
            disabled={!selectedRows?.size}
        >
            <svg className="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="3 6 5 6 21 6"></polyline>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                <line x1="10" y1="11" x2="10" y2="17"></line>
                <line x1="14" y1="11" x2="14" y2="17"></line>
            </svg>
            Delete
        </button>
    );
}

export default SmartDelete;
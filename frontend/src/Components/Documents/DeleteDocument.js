import { toast } from "react-toastify";
import useDocuments from "../../Hooks/useDocuments";

function DeleteDocument({gridRef}) {
    const {deleteDocuments} = useDocuments();
    const onDelete = async() => {
        try {
            const selectedRows = gridRef.current?.getSelectedRowsData();
            if(selectedRows.length == 0){
                toast.warn("Please select any document!");
                return;
            }
            if(window.confirm("Really want to delete them?")){
                await deleteDocuments(selectedRows);
            }
        } catch (error) {
            console.log("onDeleteError: ", error);
        }
    }

    return (<>
        <button onClick={onDelete} type="button" className="btn btn-dangerous">
            <span className="btn-icon">🗑</span>
            <span className="btn-label">Delete</span>
        </button>
    </>);
}

export default DeleteDocument;
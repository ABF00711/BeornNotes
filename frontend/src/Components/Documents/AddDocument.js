import { useState } from "react";
import DocumentModal from "./DocumentModal";

function AddDocument ({documentData, customer}) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <button onClick={() => setIsOpen(true)} type="button" className="btn btn-primary">
                <span className="btn-icon">＋</span>
                <span className="btn-label">Add</span>
            </button>
            <DocumentModal
                isOpen={isOpen}
                setIsOpen={setIsOpen}
                role={"create"}
                documentData = {documentData}
                customer = {customer}
            />
        </>
    );
}

export default AddDocument;
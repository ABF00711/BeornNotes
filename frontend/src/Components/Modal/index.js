import React, { useState } from "react";
import "./style.css";

function Modal({ children }) {
    const [isOpen, setIsOpen] = useState(false);
    const toggleModal = () => {
        setIsOpen(!isOpen);
    };
	return (
		<div className="modal" onClick={toggleModal} style={{ display: isOpen ? "block" : "none" }}>
			{children}
			<div className="modal-content" onClick={e => e.stopPropagation()}>
				{children}
			</div>
		</div>
	);
}

export default Modal;
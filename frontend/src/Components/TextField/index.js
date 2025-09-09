import React from "react";
import "./style.css";

function TextField({ name, label, value, onChange, required = false, submitted = false }) {
	const isInvalid = required && submitted && (!value || String(value).trim() === "");

	return (
		<div className="field row">
			<label htmlFor={name} className="field-label">{label}{required ? " *" : ""}</label>
			<input
				id={name}
				name={name}
				type="text"
				className={`field-input ${isInvalid ? "field-input--invalid" : ""}`}
				value={value}
				onChange={onChange}
				autoComplete="off"
			/>
		</div>
	);
}

export default TextField;

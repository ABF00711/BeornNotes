import React from "react";
import "./style.css";

function EmailField({ name, label, value, onChange, required = false, submitted = false }) {
	const isEmptyInvalid = required && submitted && (!value || String(value).trim() === "");
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	const isFormatInvalid = submitted && value && !emailRegex.test(String(value).trim());
	const isInvalid = isEmptyInvalid || isFormatInvalid;

	return (
		<div className="field row">
			<label htmlFor={name} className="field-label">{label}{required ? " *" : ""}</label>
			<input
				id={name}
				name={name}
				type="email"
				className={`field-input ${isInvalid ? "field-input--invalid" : ""}`}
				value={value}
				onChange={onChange}
				autoComplete="off"
			/>
		</div>
	);
}

export default EmailField;

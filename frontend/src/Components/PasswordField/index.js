import React, { useState } from "react";
import "./style.css";

function PasswordField({ name, label, value, onChange, required = false, submitted = false }) {
	const [visible, setVisible] = useState(false);
	const isInvalid = required && submitted && (!value || String(value).trim() === "");

	return (
		<div className="field row">
			<label htmlFor={name} className="field-label">{label}{required ? " *" : ""}</label>
			<div className="password-wrapper">
				<input
					id={name}
					name={name}
					type={visible ? "text" : "password"}
					className={`field-input ${isInvalid ? "field-input--invalid" : ""}`}
					value={value}
					onChange={onChange}
					autoComplete="new-password"
				/>
				<button type="button" className="toggle-btn" aria-label={visible ? "Hide password" : "Show password"} onClick={() => setVisible(v => !v)}>
					{visible ? (
						<span className="eye-icon" aria-hidden>🙈</span>
					) : (
						<span className="eye-icon" aria-hidden>👁️</span>
					)}
				</button>
			</div>
		</div>
	);
}

export default PasswordField;

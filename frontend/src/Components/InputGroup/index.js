import React from "react";
import "./style.css";

function InputGroup({ props }) {
    const {fieldFormat, value, handleChange} = props;

    return (
        <div className="input-group">
            <input
                type={fieldFormat.field_type}
                name={fieldFormat.field_name}
                placeholder={fieldFormat.field_label}
                className="auth-input"
                value={value}
                onChange={handleChange}
                required = {fieldFormat.mandatory}
            />
        </div>
    );
}

export default InputGroup;
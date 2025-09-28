import React, { forwardRef } from "react";
import InputableSelect from "./index";

// Wrapper component to make InputableSelect compatible with react-hook-form
const InputableSelectField = forwardRef(({ 
    value, 
    onChange, 
    onBlur, 
    name, 
    options = [], 
    placeholder = "Select an option...",
    className = "",
    submitted = false,
    error = false,
    ...props 
}, ref) => {
    const handleChange = (newValue) => {
        // Create a synthetic event object that react-hook-form expects
        const syntheticEvent = {
            target: {
                name: name,
                value: newValue
            }
        };
        if (onChange) {
            onChange(syntheticEvent);
        }
    };

    const handleBlur = () => {
        if (onBlur) {
            // Create a synthetic event object that react-hook-form expects
            const syntheticEvent = {
                target: {
                    name: name,
                    value: value
                }
            };
            onBlur(syntheticEvent);
        }
    };

    return (
        <InputableSelect
            value={value}
            onChange={handleChange}
            onBlur={handleBlur}
            options={options}
            placeholder={placeholder}
            className={className}
            submitted={submitted}
            error={error}
            {...props}
        />
    );
});

InputableSelectField.displayName = "InputableSelectField";

export default InputableSelectField;

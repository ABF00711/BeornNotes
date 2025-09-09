import React, { useState, useEffect, useRef } from "react";
import "./style.css";

function Combobox({ fieldFormat, value, handleChange, options = [], submitted = false }) {
    const [searchTerm, setSearchTerm] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    const [filteredData, setFilteredData] = useState([]);
    const comboboxRef = useRef(null);

    // Keep input in sync with external value
    useEffect(() => {
        if (!searchTerm && value) {
            setSearchTerm(value);
        }
    }, [value]);

    // Filter options based on search term
    useEffect(() => {
        if (searchTerm) {
            const filtered = options.filter(item => 
                item.name.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setFilteredData(filtered);
        } else {
            setFilteredData(options);
        }
    }, [searchTerm, options]);

    // Handle click outside to close dropdown
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (comboboxRef.current && !comboboxRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // Handle input change
    const handleInputChange = (e) => {
        setSearchTerm(e.target.value);
        setIsOpen(true);
        
        // Update the form value
        handleChange({
            target: {
                name: fieldFormat.field_name,
                value: e.target.value
            }
        });
    };

    // Handle option selection
    const handleOptionSelect = (option) => {
        setSearchTerm(option.name);
        setIsOpen(false);
        
        // Update the form value
        handleChange({
            target: {
                name: fieldFormat.field_name,
                value: option.name
            }
        });
    };

    // Handle input focus
    const handleFocus = () => {
        setIsOpen(true);
    };

    // Handle keyboard navigation
    const handleKeyDown = (e) => {
        if (e.key === 'Escape') {
            setIsOpen(false);
        }
    };

    const invalid = fieldFormat.mandatory && submitted && (!value || String(value).trim() === "");
    return (
        <div className="field row" ref={comboboxRef}>
            <label htmlFor={fieldFormat.field_name} className="field-label">
                {fieldFormat.field_label}{fieldFormat.mandatory ? " *" : ""}
            </label>
            <div className="combobox-container">
                <input
                    id={fieldFormat.field_name}
                    type="text"
                    name={fieldFormat.field_name}
                    className={`field-input combobox-input ${invalid ? "field-input--invalid" : ""}`}
                    placeholder={`Search ${fieldFormat.field_label}...`}
                    value={searchTerm}
                    onChange={handleInputChange}
                    onFocus={handleFocus}
                    onKeyDown={handleKeyDown}
                    autoComplete="off"
                />
                {isOpen && (
                    <div className="combobox-dropdown">
                        {filteredData.length > 0 ? (
                            filteredData.map((item, index) => (
                                <div
                                    key={index}
                                    className="combobox-option"
                                    onClick={() => handleOptionSelect(item)}
                                >
                                    {item.name}
                                </div>
                            ))
                        ) : (
                            <div className="combobox-option no-results">
                                No results found
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

export default Combobox;

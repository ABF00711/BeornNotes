import React, { useState, useEffect, useRef } from "react";
import "./style.css";

function Popup({ fieldFormat, value, handleChange, options = [] }) {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedOption, setSelectedOption] = useState(null);
    const popupRef = useRef(null);

    // Find the selected option based on current value
    useEffect(() => {
        if (value && options.length > 0) {
            const found = options.find(option => option.name === value);
            setSelectedOption(found || null);
        } else {
            setSelectedOption(null);
        }
    }, [value, options]);

    // Handle click outside to close popup
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (popupRef.current && !popupRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // Handle option selection
    const handleOptionSelect = (option) => {
        setSelectedOption(option);
        setIsOpen(false);
        
        // Update the form value
        handleChange({
            target: {
                name: fieldFormat.field_name,
                value: option.name
            }
        });
    };

    // Handle popup toggle
    const togglePopup = () => {
        setIsOpen(!isOpen);
    };

    // Handle keyboard navigation
    const handleKeyDown = (e) => {
        if (e.key === 'Escape') {
            setIsOpen(false);
        } else if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            togglePopup();
        }
    };

    return (
        <div className="popup-container" ref={popupRef}>
            <div 
                className={`popup-trigger ${isOpen ? 'open' : ''} ${fieldFormat.mandatory && !value ? 'required' : ''}`}
                onClick={togglePopup}
                onKeyDown={handleKeyDown}
                tabIndex={0}
                role="button"
                aria-haspopup="listbox"
                aria-expanded={isOpen}
            >
                <span className="popup-value">
                    {selectedOption ? selectedOption.name : `Choose ${fieldFormat.field_label}`}
                </span>
                <svg 
                    className={`popup-arrow ${isOpen ? 'open' : ''}`}
                    width="12" 
                    height="8" 
                    viewBox="0 0 12 8" 
                    fill="none"
                >
                    <path
                        d="M1 1.5L6 6.5L11 1.5"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>
            </div>
            
            {isOpen && (
                <div className="popup-dropdown">
                    {options.length > 0 ? (
                        options.map((option, index) => (
                            <div
                                key={index}
                                className={`popup-option ${selectedOption && selectedOption.name === option.name ? 'selected' : ''}`}
                                onClick={() => handleOptionSelect(option)}
                            >
                                {option.name}
                            </div>
                        ))
                    ) : (
                        <div className="popup-option no-options">
                            No options available
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default Popup;

import React, { useState, useEffect, useRef } from "react";
import "./style.css";

function InputableSelect({ 
    value, 
    onChange, 
    onBlur, 
    options = [], 
    placeholder = "Select an option...",
    className = "",
    submitted = false,
    error = false
}) {
    const [searchTerm, setSearchTerm] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    const [filteredOptions, setFilteredOptions] = useState([]);
    const selectRef = useRef(null);

    // Keep input in sync with external value
    useEffect(() => {
        setSearchTerm(value || "");
    }, [value]);

    // Smart filtering and sorting based on search term
    useEffect(() => {
        if (searchTerm) {
            const searchLower = searchTerm.toLowerCase();
            
            // Enhanced scoring function for better match ranking
            const getMatchScore = (option) => {
                const optionLower = option.toLowerCase();
                const searchIndex = optionLower.indexOf(searchLower);
                
                // Exact match gets highest score
                if (optionLower === searchLower) return 1000;
                
                // Starts with search term gets high score
                if (optionLower.startsWith(searchLower)) return 900;
                
                // Contains search term gets medium score (earlier position = higher score)
                if (searchIndex !== -1) {
                    return 800 - searchIndex;
                }
                
                // Partial word match
                const words = optionLower.split(/\s+/);
                const searchWords = searchLower.split(/\s+/);
                let partialScore = 0;
                
                for (const searchWord of searchWords) {
                    for (const word of words) {
                        if (word.startsWith(searchWord)) {
                            partialScore += 100;
                        } else if (word.includes(searchWord)) {
                            partialScore += 50;
                        }
                    }
                }
                
                // Character similarity (fuzzy matching)
                const similarity = getSimilarity(optionLower, searchLower);
                const fuzzyScore = Math.floor(similarity * 200);
                
                // Return the highest score among all methods
                return Math.max(partialScore, fuzzyScore);
            };
            
            // Sort all options by match score (best matches first, unmatched at end)
            const sortedOptions = options
                .map(option => ({
                    value: option,
                    score: getMatchScore(option)
                }))
                .sort((a, b) => {
                    // First sort by score (descending)
                    if (b.score !== a.score) {
                        return b.score - a.score;
                    }
                    // Then sort alphabetically for items with same score
                    return a.value.localeCompare(b.value);
                })
                .map(({ score, ...item }) => item.value); // Remove score from final result
            
            setFilteredOptions(sortedOptions);
        } else {
            // When no search term, show all options in original order
            setFilteredOptions(options);
        }
    }, [searchTerm, options]);

    // Helper function to calculate string similarity (fuzzy matching)
    const getSimilarity = (str1, str2) => {
        const longer = str1.length > str2.length ? str1 : str2;
        const shorter = str1.length > str2.length ? str2 : str1;
        
        if (longer.length === 0) return 1.0;
        
        const editDistance = levenshteinDistance(longer, shorter);
        return (longer.length - editDistance) / longer.length;
    };

    // Helper function to calculate Levenshtein distance
    const levenshteinDistance = (str1, str2) => {
        const matrix = [];
        
        for (let i = 0; i <= str2.length; i++) {
            matrix[i] = [i];
        }
        
        for (let j = 0; j <= str1.length; j++) {
            matrix[0][j] = j;
        }
        
        for (let i = 1; i <= str2.length; i++) {
            for (let j = 1; j <= str1.length; j++) {
                if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
                    matrix[i][j] = matrix[i - 1][j - 1];
                } else {
                    matrix[i][j] = Math.min(
                        matrix[i - 1][j - 1] + 1,
                        matrix[i][j - 1] + 1,
                        matrix[i - 1][j] + 1
                    );
                }
            }
        }
        
        return matrix[str2.length][str1.length];
    };

    // Handle click outside to close dropdown
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (selectRef.current && !selectRef.current.contains(event.target)) {
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
        const value = e?.target?.value || '';
        setSearchTerm(value);
        setIsOpen(true);
        
        // Update the form value - pass the value directly
        if (onChange) {
            onChange(value);
        }
    };

    // Handle option selection
    const handleOptionSelect = (option) => {
        setSearchTerm(option);
        setIsOpen(false);
        
        // Update the form value - pass the value directly
        if (onChange) {
            onChange(option);
        }
    };

    // Handle input focus
    const handleFocus = () => {
        setIsOpen(true);
    };

    // Handle input blur
    const handleBlur = (e) => {
        // Small delay to allow option selection to complete
        setTimeout(() => {
            setIsOpen(false);
            if (onBlur) {
                onBlur();
            }
        }, 150);
    };

    // Handle keyboard navigation
    const handleKeyDown = (e) => {
        if (e.key === 'Escape') {
            setIsOpen(false);
        }
    };

    const invalid = submitted && (!value || String(value).trim() === "");

    return (
        <div className="inputable-select-container" ref={selectRef}>
            <input
                type="text"
                className={`inputable-select-input ${className} ${error || invalid ? 'error' : ''}`}
                placeholder={placeholder}
                value={searchTerm}
                onChange={handleInputChange}
                onFocus={handleFocus}
                onBlur={handleBlur}
                onKeyDown={handleKeyDown}
                autoComplete="off"
            />
            {isOpen && (
                <div className="inputable-select-dropdown">
                    {filteredOptions.length > 0 ? (
                        filteredOptions.map((option, index) => (
                            <div
                                key={index}
                                className="inputable-select-option"
                                onClick={() => handleOptionSelect(option)}
                            >
                                {option}
                            </div>
                        ))
                    ) : (
                        <div className="inputable-select-no-results">
                            No options found
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default InputableSelect;

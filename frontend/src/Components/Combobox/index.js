import React, { useState, useEffect, useRef } from "react";
import "./style.css";

function Combobox({ fieldFormat, value, handleChange, options = [], submitted = false }) {
    const [searchTerm, setSearchTerm] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    const [filteredData, setFilteredData] = useState([]);
    const comboboxRef = useRef(null);

    // Keep input in sync with external value
    useEffect(() => {
        setSearchTerm(value);
    }, [value]);

    // Sort options based on search term (show all data, sorted by match quality)
    useEffect(() => {
        if (searchTerm) {
            const searchLower = searchTerm.toLowerCase();
            
            // Enhanced scoring function for better match ranking
            const getMatchScore = (item) => {
                const nameLower = item.name.toLowerCase();
                const searchIndex = nameLower.indexOf(searchLower);
                
                // Exact match gets highest score
                if (nameLower === searchLower) return 1000;
                
                // Starts with search term gets high score
                if (nameLower.startsWith(searchLower)) return 900;
                
                // Contains search term gets medium score (earlier position = higher score)
                if (searchIndex !== -1) {
                    return 800 - searchIndex;
                }
                
                // Partial word match (e.g., "john" matches "johnson")
                const words = nameLower.split(/\s+/);
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
                const similarity = getSimilarity(nameLower, searchLower);
                const fuzzyScore = Math.floor(similarity * 200);
                
                // Return the highest score among all methods
                return Math.max(partialScore, fuzzyScore);
            };
            
            // Sort all options by match score (best matches first, unmatched at end)
            const sortedData = options
                .map(item => ({
                    ...item,
                    score: getMatchScore(item)
                }))
                .sort((a, b) => {
                    // First sort by score (descending)
                    if (b.score !== a.score) {
                        return b.score - a.score;
                    }
                    // Then sort alphabetically for items with same score
                    return a.name.localeCompare(b.name);
                })
                .map(({ score, ...item }) => item); // Remove score from final result
            
            setFilteredData(sortedData);
        } else {
            // When no search term, show all options in original order
            setFilteredData(options);
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
                {fieldFormat.field_label}
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
                        {filteredData.map((item, index) => (
                            <div
                                key={index}
                                className="combobox-option"
                                onClick={() => handleOptionSelect(item)}
                            >
                                {item.name}
                            </div>
                        ))}
                    </div>
                )}
            </div>
            {fieldFormat.mandatory ? " *" : ""}
        </div>
    );
}

export default Combobox;

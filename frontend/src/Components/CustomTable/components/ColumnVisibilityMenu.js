import React from 'react';

const ColumnVisibilityMenu = ({
    showMenu,
    menuRef,
    displayColumns,
    columnVisibilities,
    onToggleVisibility,
    onReset
}) => {
    if (!showMenu) return null;

    return (
        <div className="column-menu" ref={menuRef}>
            <div className="menu-title">Show/Hide Columns</div>
            <div className="menu-items-container">
                {displayColumns.map((column) => {
                    if (column.field === 'checkbox' || column.field === 'actions') return null;
                    return (
                        <label key={column.field} className="menu-item">
                            <input
                                type="checkbox"
                                checked={columnVisibilities[column.field] !== false}
                                onChange={() => onToggleVisibility(column.field)}
                            />
                            <span>{column.header}</span>
                        </label>
                    );
                })}
            </div>
            <div className="menu-footer">
                <button className="menu-reset-btn" onClick={onReset}>
                    Reset to Default
                </button>
            </div>
        </div>
    );
};

export default ColumnVisibilityMenu;


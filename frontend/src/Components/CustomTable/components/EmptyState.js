import React from 'react';

const EmptyState = () => {
    return (
        <div className="custom-table-empty">
            <svg className="empty-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M9 2v2m6-2v2M4 8h16M3 10v9a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-9H3z"></path>
                <path d="M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01M16 18h.01"></path>
            </svg>
            <p>No data available</p>
        </div>
    );
};

export default EmptyState;


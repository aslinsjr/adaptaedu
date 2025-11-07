import React from 'react';
import './TypingIndicator.css';

function TypingIndicator() {
    return (
        <div className="typing-container">
            <div className="typing-indicator">
                <div className="typing-dot"></div>
                <div className="typing-dot"></div>
                <div className="typing-dot"></div>
            </div>
        </div>
    );
}

export default TypingIndicator;
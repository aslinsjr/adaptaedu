import React from 'react';
import './ChatHeader.css';

function ChatHeader({ onNewChat }) {
    return (
        <div className="chat-header">
            <h1>Chat RAG</h1>
            <button className="btn-new" onClick={onNewChat}>
                Nova Conversa
            </button>
        </div>
    );
}

export default ChatHeader;
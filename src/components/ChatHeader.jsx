import React from 'react';
import './ChatHeader.css';

function ChatHeader({ onNewChat }) {
    return (
        <div className="chat-header">
            <div className="header-content">
                <div className="header-brand">
                    <div className="header-text">
                        <img src="./logo.png" alt="" />
                        {/* <span className="header-subtitle">Assistente Educacional Inteligente</span> */}
                    </div>
                </div>
                <button className="btn-new-chat" onClick={onNewChat}>
                    <span className="btn-icon">+</span>
                    <span className="btn-text">Nova Conversa</span>
                </button>
            </div>
        </div>
    );
}

export default ChatHeader;
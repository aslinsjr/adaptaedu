import React from 'react';
import MessageWithSources from './MessageWithSources.jsx';
import './ChatMessages.css';

function ChatMessages({ messages, isLoading, onSelectOption, onOpenContent }) {
    return (
        <div className="chat-messages-container">
            <div className="chat-messages-content">
                {messages.map((message, index) => (
                    <MessageWithSources
                        key={index}
                        message={message}
                        onOpenContent={onOpenContent}
                    />
                ))}
                
                {isLoading && (
                    <div className="message-loading">
                        <div className="loading-dots">
                            <span></span>
                            <span></span>
                            <span></span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default ChatMessages;
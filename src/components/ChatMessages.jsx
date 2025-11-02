import React, { useEffect, useRef } from 'react';
import Message from './Message.jsx';
import ClarificationMessage from './ClarificationMessage.jsx';
import TypingIndicator from './TypingIndicator.jsx';
import './ChatMessages.css';

function ChatMessages({ messages, isLoading, onSelectOption }) {
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isLoading]);

    return (
        <div className="chat-messages">
            {messages.map((message, index) => {
                if (message.role === 'user') {
                    return <Message key={index} role="user" content={message.content} />;
                } else if (message.data?.tipo === 'clarificacao') {
                    return (
                        <ClarificationMessage 
                            key={index} 
                            data={message.data}
                            onSelectOption={onSelectOption}
                        />
                    );
                } else {
                    return (
                        <Message 
                            key={index} 
                            role="assistant" 
                            content={message.data?.resposta || message.content}
                            sources={message.data?.documentos_usados}
                        />
                    );
                }
            })}
            {isLoading && <TypingIndicator />}
            <div ref={messagesEndRef} />
        </div>
    );
}

export default ChatMessages;
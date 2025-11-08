// ChatMessages.jsx
import React, { useEffect, useRef, useCallback } from 'react';
import Message from './Message.jsx';
import ClarificationMessage from './ClarificationMessage.jsx';
import TypingIndicator from './TypingIndicator.jsx';
import './ChatMessages.css';

function ChatMessages({ messages, isLoading, onSelectOption, onOpenContent , userName}) {
    const messagesEndRef = useRef(null);

    const scrollToBottom = useCallback(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, []);

    useEffect(() => {
        scrollToBottom();
    }, [messages, isLoading, scrollToBottom]);

    return (
        <div className="chat-messages">
            {messages.map((msg, index) => {
    if (msg.role === 'assistant' && msg.data) {
        return (
            <Message
                key={index}
                role={msg.role}
                content={msg.data.resposta}
                sources={msg.data.documentos_usados} // Documentos para download
                fontes={msg.data.fontes} // Fontes citadas no texto (NOVO)
                onOpenContent={onOpenContent}
                onScrollNeeded={scrollToBottom}
            />
        );
    }
    
    return (
        <Message
            key={index}
            role={msg.role}
            content={msg.content}
            userName={userName}
            onScrollNeeded={scrollToBottom}
        />
    );
})}
            {isLoading && <TypingIndicator />}
            <div ref={messagesEndRef} />
        </div>
    );
}

export default ChatMessages;
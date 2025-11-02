import React from 'react';
import './Message.css';

function Message({ role, content, sources }) {
    const formatText = (text) => {
        if (!text) return '';
        return text
            .replace(/\n/g, '<br>')
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>');
    };

    return (
        <div className={`message ${role}`}>
            <div className="message-avatar">
                {role === 'user' ? 'U' : 'AI'}
            </div>
            <div className="message-content">
                <div dangerouslySetInnerHTML={{ __html: formatText(content) }} />
                {sources && sources.length > 0 && (
                    <div className="sources">
                        <strong>Fontes:</strong>{' '}
                        {sources.map((doc, index) => (
                            <span key={index} className="source-item" title={doc.tipo}>
                                {doc.nome}
                            </span>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default Message;
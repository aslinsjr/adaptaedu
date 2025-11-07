// Message.jsx
import React, { useState, useEffect } from 'react';
import './Message.css';

// Hook para efeito de digitação
const useTypingEffect = (text, speed = 30) => {
    const [displayedText, setDisplayedText] = useState('');
    const [isComplete, setIsComplete] = useState(false);

    useEffect(() => {
        if (!text) {
            setDisplayedText('');
            setIsComplete(true);
            return;
        }

        setDisplayedText('');
        setIsComplete(false);
        
        let index = 0;
        const timer = setInterval(() => {
            if (index < text.length) {
                setDisplayedText(text.slice(0, index + 1));
                index++;
            } else {
                setIsComplete(true);
                clearInterval(timer);
            }
        }, speed);

        return () => clearInterval(timer);
    }, [text, speed]);

    return { displayedText, isComplete };
};

function Message({ role, content, sources, onOpenContent, isVisible = true, isCurrent = false }) {
    const [skipAnimation, setSkipAnimation] = useState(false);
    const { displayedText, isComplete } = useTypingEffect(
        role === 'assistant' && !skipAnimation && isCurrent ? content : content,
        30
    );

    const textToShow = role === 'assistant' && !skipAnimation && isCurrent ? displayedText : content;

    const formatText = (text) => {
        if (!text) return '';
        return text
            .replace(/\n/g, '<br>')
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>');
    };

    const handleContentClick = (source) => {
        if (onOpenContent && source) {
            onOpenContent({
                tipo: source.tipo || 'texto',
                nome: source.nome,
                conteudo: source.conteudo,
                url: source.url
            });
        }
    };

    const handleMessageClick = () => {
        if (role === 'assistant' && !isComplete && isCurrent) {
            setSkipAnimation(true);
        }
    };

    return (
        <div className={`message ${role} ${!isVisible ? 'message-hidden' : ''} ${isCurrent ? 'message-current' : ''}`}>
            <div className="message-content-wrapper">
                <div 
                    className="message-content" 
                    onClick={handleMessageClick}
                    style={{ cursor: role === 'assistant' && !isComplete && isCurrent ? 'pointer' : 'default' }}
                >
                    <div dangerouslySetInnerHTML={{ __html: formatText(textToShow) }} />
                    {role === 'assistant' && !isComplete && isCurrent && (
                        <span className="typing-cursor">|</span>
                    )}
                </div>
                {sources && sources.length > 0 && isComplete && (
                    <div className="message-sources">
                        <div className="sources-header">
                            <span className="sources-icon">📚</span>
                            <span className="sources-title">Materiais disponíveis:</span>
                        </div>
                        <div className="sources-list">
                            {sources.map((doc, index) => (
                                <button
                                    key={index}
                                    className={`source-item source-${doc.tipo || 'texto'}`}
                                    onClick={() => handleContentClick(doc)}
                                    title={`Clique para abrir: ${doc.nome}`}
                                >
                                    <span className="source-icon">
                                        {doc.tipo === 'pdf' ? '📄' :
                                         doc.tipo === 'video' ? '🎥' :
                                         doc.tipo === 'imagem' ? '🖼️' :
                                         doc.tipo === 'audio' ? '🎵' : '📄'}
                                    </span>
                                    <span className="source-name">{doc.nome}</span>
                                    <span className="source-arrow">→</span>
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Message;
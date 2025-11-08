import React, { useState, useEffect } from 'react';
import './Message.css';

function TypewriterText({ text, speed = 50, onContentChange }) {
    const [displayedLines, setDisplayedLines] = useState([]);
    const [currentLineIndex, setCurrentLineIndex] = useState(0);
    const [currentCharIndex, setCurrentCharIndex] = useState(0);
    const [isComplete, setIsComplete] = useState(false);

    const lines = text.split('\n');

    useEffect(() => {
        if (isComplete) return;

        if (currentLineIndex >= lines.length) {
            setIsComplete(true);
            return;
        }

        const currentLine = lines[currentLineIndex];

        if (currentCharIndex < currentLine.length) {
            const timer = setTimeout(() => {
                setCurrentCharIndex(prev => prev + 1);
            }, speed);
            return () => clearTimeout(timer);
        } else {
            setDisplayedLines(prev => [...prev, currentLine]);
            setCurrentLineIndex(prev => prev + 1);
            setCurrentCharIndex(0);
        }
    }, [currentCharIndex, currentLineIndex, lines, speed, isComplete]);

    // Scroll automático durante digitação
    useEffect(() => {
        if (onContentChange && !isComplete) {
            onContentChange();
        }
    }, [currentCharIndex, currentLineIndex, displayedLines, onContentChange, isComplete]);

    const formatText = (text) => {
        if (!text) return '';
        return text
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>');
    };

    const handleClick = () => {
        if (!isComplete) {
            setDisplayedLines(lines);
            setIsComplete(true);
            // Trigger final scroll when completed
            if (onContentChange) {
                onContentChange();
            }
        }
    };

    return (
        <div onClick={handleClick} style={{ cursor: isComplete ? 'default' : 'pointer' }}>
            {displayedLines.map((line, index) => (
                <div 
                    key={index} 
                    style={{ opacity: 0.7, marginBottom: line === '' ? '0.5em' : '0' }}
                    dangerouslySetInnerHTML={{ __html: formatText(line) || '<br/>' }}
                />
            ))}
            {!isComplete && currentLineIndex < lines.length && (
                <div dangerouslySetInnerHTML={{ 
                    __html: formatText(lines[currentLineIndex].substring(0, currentCharIndex)) + '<span style="opacity: 0.5">|</span>'
                }} />
            )}
        </div>
    );
}

function Message({ role, content, sources, onOpenContent, onScrollNeeded }) {
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

    return (
        <div className={`message ${role}`}>
            <div className="message-avatar">
                {role === 'assistant' ? (
                    <img src="./edu.png" alt="EDO AI" />
                ) : (
                    <div className="user-avatar">U</div>
                )}
            </div>
            <div className="message-bubble">
                <div className="message-content">
                    {role === 'assistant' ? (
                        <TypewriterText 
                            text={content} 
                            speed={30} 
                            onContentChange={onScrollNeeded}
                        />
                    ) : (
                        <div dangerouslySetInnerHTML={{ __html: formatText(content) }} />
                    )}
                </div>
                {sources && sources.length > 0 && (
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
import React from 'react';
import './Message.css';

function Message({ role, content, sources, onOpenContent }) {
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
                conteudo: source.conteudo || source.url || 'Conteúdo não disponível'
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
                    <div dangerouslySetInnerHTML={{ __html: formatText(content) }} />
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
                                        {doc.tipo === 'video' ? '🎥' :
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
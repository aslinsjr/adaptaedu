import React from 'react';
import './ContentSidebar.css';

function ContentSidebar({ isOpen, content, onClose }) {
    if (!isOpen || !content) return null;

    const renderContent = () => {
        if (!content) return null;

        switch (content.type) {
            case 'pdf':
                return (
                    <iframe
                        src={content.url}
                        title={content.nome}
                        className="content-iframe"
                    />
                );
            case 'video':
                return (
                    <video
                        controls
                        className="content-video"
                        src={content.url}
                    >
                        Seu navegador não suporta o elemento de vídeo.
                    </video>
                );
            case 'text':
            case 'texto':
                return (
                    <iframe
                        src={content.url}
                        title={content.nome}
                        className="content-iframe"
                    />
                );
            case 'json':
                return (
                    <div className="content-json">
                        <pre>{JSON.stringify(content, null, 2)}</pre>
                    </div>
                );
            default:
                return (
                    <div className="content-default">
                        <p>Tipo de conteúdo não suportado para visualização.</p>
                        <a href={content.url} target="_blank" rel="noopener noreferrer">
                            Abrir em nova aba
                        </a>
                    </div>
                );
        }
    };

    return (
        <>
            <div className="content-sidebar-overlay" onClick={onClose} />
            <div className={`content-sidebar ${isOpen ? 'open' : ''}`}>
                <div className="content-sidebar-header">
                    <h3>{content.nome}</h3>
                    <button className="btn-close-sidebar" onClick={onClose}>×</button>
                </div>
                <div className="content-sidebar-body">
                    {renderContent()}
                </div>
            </div>
        </>
    );
}

export default ContentSidebar;
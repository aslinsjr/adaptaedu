import React from 'react';
import './ContentSidebar.css';

function ContentSidebar({ isOpen, content, onClose }) {
    if (!content) return null;

    const renderContent = () => {
        switch (content.tipo) {
            case 'video':
                return (
                    <div className="content-video">
                        <video controls width="100%">
                            <source src={content.conteudo} type="video/mp4" />
                            Seu navegador não suporta vídeos.
                        </video>
                    </div>
                );
            case 'imagem':
                return (
                    <div className="content-image">
                        <img src={content.conteudo} alt={content.nome} />
                    </div>
                );
            case 'audio':
                return (
                    <div className="content-audio">
                        <audio controls style={{ width: '100%' }}>
                            <source src={content.conteudo} type="audio/mpeg" />
                            Seu navegador não suporta áudio.
                        </audio>
                    </div>
                );
            case 'texto':
            default:
                return (
                    <div className="content-text">
                        <div className="text-content">
                            {content.conteudo}
                        </div>
                    </div>
                );
        }
    };

    return (
        <>
            <div className={`sidebar-overlay ${isOpen ? 'active' : ''}`} onClick={onClose} />
            <div className={`content-sidebar ${isOpen ? 'open' : ''}`}>
                <div className="sidebar-header">
                    <div className="sidebar-title">
                        <span className="sidebar-icon">
                            {content.tipo === 'video' ? '🎥' :
                             content.tipo === 'imagem' ? '🖼️' :
                             content.tipo === 'audio' ? '🎵' : '📄'}
                        </span>
                        <h3>{content.nome}</h3>
                    </div>
                    <button className="btn-close-sidebar" onClick={onClose}>
                        ✕
                    </button>
                </div>
                <div className="sidebar-content">
                    {renderContent()}
                </div>
            </div>
        </>
    );
}

export default ContentSidebar;
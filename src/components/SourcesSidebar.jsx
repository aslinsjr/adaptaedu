import React from 'react';
import './SourcesSidebar.css';

function SourcesSidebar({ fontes = [], documentos = [], activeAccordion, onToggle, onOpenContent }) {
    const hasFontes = fontes && fontes.length > 0;
    const hasDocumentos = documentos && documentos.length > 0;

    if (!hasFontes && !hasDocumentos) return null;

    const getFileIcon = (tipo) => {
        const icons = {
            'pdf': '📄',
            'video': '🎥',
            'json': '📋',
            'texto': '📝',
            'text': '📝'
        };
        return icons[tipo] || '📁';
    };

    return (
        <div className="sources-sidebar">
            {hasFontes && (
                <div className="accordion-section">
                    <button
                        className={`accordion-button ${activeAccordion === 'fontes' ? 'active' : ''}`}
                        onClick={() => onToggle('fontes')}
                    >
                        <span className="accordion-icon">📚</span>
                        <span className="accordion-label">Fontes ({fontes.length})</span>
                        <span className="accordion-arrow">{activeAccordion === 'fontes' ? '◀' : '▶'}</span>
                    </button>

                    <div className={`accordion-panel ${activeAccordion === 'fontes' ? 'open' : ''}`}>
                        {fontes.map((fonte, index) => (
                            <div key={fonte.chunk_id || index} className="fonte-item">
                                <div className="fonte-header">
                                    <span className="fonte-number">Fonte {index + 1}</span>
                                    {fonte.metadata?.tipo && (
                                        <span className="fonte-tipo">{getFileIcon(fonte.metadata.tipo)}</span>
                                    )}
                                </div>
                                <div className="fonte-text">{fonte.texto}</div>
                                {fonte.documento && (
                                    <button
                                        className="btn-open-document"
                                        onClick={() => onOpenContent({
                                            type: fonte.documento.tipo,
                                            url: fonte.documento.url,
                                            nome: fonte.documento.nome
                                        })}
                                    >
                                        {getFileIcon(fonte.documento.tipo)} {fonte.documento.nome}
                                    </button>
                                )}
                                {fonte.metadata?.tags && fonte.metadata.tags.length > 0 && (
                                    <div className="fonte-tags">
                                        {fonte.metadata.tags.slice(0, 3).map((tag, i) => (
                                            <span key={i} className="tag">{tag}</span>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {hasDocumentos && (
                <div className="accordion-section">
                    <button
                        className={`accordion-button ${activeAccordion === 'documentos' ? 'active' : ''}`}
                        onClick={() => onToggle('documentos')}
                    >
                        <span className="accordion-icon">📄</span>
                        <span className="accordion-label">Materiais ({documentos.length})</span>
                        <span className="accordion-arrow">{activeAccordion === 'documentos' ? '◀' : '▶'}</span>
                    </button>

                    <div className={`accordion-panel ${activeAccordion === 'documentos' ? 'open' : ''}`}>
                        {documentos.map((doc, index) => (
                            <div key={index} className="documento-item">
                                <button
                                    className="btn-open-document full"
                                    onClick={() => onOpenContent({
                                        type: doc.tipo,
                                        url: doc.url,
                                        nome: doc.nome
                                    })}
                                >
                                    <span className="doc-icon">{getFileIcon(doc.tipo)}</span>
                                    <span className="doc-name">{doc.nome}</span>
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

export default SourcesSidebar;
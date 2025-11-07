import React from 'react';
import './MaterialListMessage.css';

function MaterialListMessage({ data, onSelectMaterial }) {
    const handleMaterialClick = (materialIndex) => {
        onSelectMaterial((materialIndex + 1).toString());
    };

    return (
        <div className="message assistant">
            <div className="message-avatar">
                <img src="./edu.png" alt="EDU AI" />
            </div>
            <div className="message-content">
                <div className="material-list">
                    <div className="material-list-intro">
                        <div dangerouslySetInnerHTML={{ 
                            __html: data.resposta?.replace(/\n/g, '<br>')
                                .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                                .replace(/\*(.*?)\*/g, '<em>$1</em>') 
                        }} />
                    </div>
                    
                    {data.materiais_pendentes && data.materiais_pendentes.length > 0 && (
                        <div className="materials-grid">
                            {data.materiais_pendentes.map((material, index) => (
                                <button
                                    key={index}
                                    className={`material-card material-${material.tipo || 'texto'}`}
                                    onClick={() => handleMaterialClick(index)}
                                >
                                    <div className="material-number">{index + 1}</div>
                                    <span className="material-icon">
                                        {material.tipo === 'pdf' ? '📄' :
                                         material.tipo === 'video' ? '🎥' :
                                         material.tipo === 'imagem' ? '🖼️' :
                                         material.tipo === 'audio' ? '🎵' : '📄'}
                                    </span>
                                    <div className="material-info">
                                        <div className="material-name">{material.nome}</div>
                                        {material.tipo && (
                                            <div className="material-type">
                                                {material.tipo === 'pdf' ? 'PDF' :
                                                 material.tipo === 'video' ? 'Vídeo' :
                                                 material.tipo === 'imagem' ? 'Imagem' :
                                                 material.tipo === 'audio' ? 'Áudio' : 'Texto'}
                                            </div>
                                        )}
                                    </div>
                                    <span className="material-arrow">→</span>
                                </button>
                            ))}
                        </div>
                    )}
                    
                    <div className="material-list-hint">
                        Digite o número do material para acessar seu conteúdo
                    </div>
                </div>
            </div>
        </div>
    );
}

export default MaterialListMessage;
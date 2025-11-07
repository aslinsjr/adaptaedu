import React from 'react';
import './ClarificationMessage.css';

function ClarificationMessage({ data, onSelectOption }) {
    const handleOptionClick = (optionNumber) => {
        onSelectOption(optionNumber.toString());
    };

    return (
        <div className="message assistant">
            <div className="message-avatar">AI</div>
            <div className="message-content">
                <div className="clarification">
                    <div className="clarification-title">{data.pergunta}</div>
                    <div className="clarification-options">
                        {data.opcoes && data.opcoes.map((opcao, index) => (
                            <div 
                                key={index}
                                className="clarification-option"
                                onClick={() => handleOptionClick(opcao.numero)}
                            >
                                {opcao.numero}. {opcao.texto}
                            </div>
                        ))}
                    </div>
                    {data.documentos_disponiveis && data.documentos_disponiveis.length > 0 && (
                        <div className="sources">
                            <strong>Documentos disponíveis:</strong>{' '}
                            {data.documentos_disponiveis.map((doc, index) => (
                                <span key={index} className="source-item">
                                    {doc.nome}
                                </span>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default ClarificationMessage;
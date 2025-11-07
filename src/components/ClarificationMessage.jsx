import React from 'react';
import './ClarificationMessage.css';

function ClarificationMessage({ data, onSelectOption }) {
    const handleOptionClick = (optionNumber) => {
        onSelectOption(optionNumber.toString());
    };

    return (
        <div className="clarification-container">
            <div className="clarification">
                <div className="clarification-title">{data.pergunta}</div>
                <div className="clarification-options">
                    {data.opcoes && data.opcoes.map((opcao, index) => (
                        <button 
                            key={index}
                            className="clarification-option"
                            onClick={() => handleOptionClick(opcao.numero)}
                        >
                            {opcao.numero}. {opcao.texto}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default ClarificationMessage;
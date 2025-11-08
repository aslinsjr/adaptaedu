import React, { useState, useMemo } from 'react';
import SourcesSidebar from './SourcesSidebar.jsx';
import './MessageWithSources.css';

function MessageWithSources({ message, onOpenContent }) {
    const [activeAccordion, setActiveAccordion] = useState(null);

    const processedMessage = useMemo(() => {
        if (message.role === 'user') {
            return {
                text: message.content,
                hasSources: false
            };
        }

        if (message.role === 'assistant' && message.data) {
            const resposta = message.data.resposta || '';
            const fontes = message.data.fontes || [];
            const documentos = message.data.documentos_usados || [];

            // Remover referências (Fonte X) do texto
            const cleanText = resposta.replace(/\(Fonte\s+[\d\s,e]+\)/gi, '');

            // Mapear fontes para documentos
            const fontesComDocumentos = fontes.map(fonte => {
                const nomeDocumento = fonte.metadata?.referencia_completa;
                const documento = documentos.find(doc => 
                    doc.nome === nomeDocumento
                );
                return {
                    ...fonte,
                    documento
                };
            });

            // Obter documentos únicos
            const documentosUnicos = documentos.filter((doc, index, self) =>
                index === self.findIndex(d => d.nome === doc.nome)
            );

            return {
                text: cleanText,
                hasSources: fontes.length > 0 || documentos.length > 0,
                fontes: fontesComDocumentos,
                documentos: documentosUnicos
            };
        }

        return {
            text: message.content || '',
            hasSources: false
        };
    }, [message]);

    const handleAccordionToggle = (type) => {
        setActiveAccordion(activeAccordion === type ? null : type);
    };

    return (
        <div className={`message-with-sources ${message.role}`}>
            <div className="message-main-content">
                <div className="message-bubble">
                    <div className="message-text">
                        {processedMessage.text}
                    </div>
                </div>

                {processedMessage.hasSources && (
                    <SourcesSidebar
                        fontes={processedMessage.fontes}
                        documentos={processedMessage.documentos}
                        activeAccordion={activeAccordion}
                        onToggle={handleAccordionToggle}
                        onOpenContent={onOpenContent}
                    />
                )}
            </div>
        </div>
    );
}

export default MessageWithSources;
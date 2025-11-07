import React, { useState, useEffect } from 'react';
import ChatMessages from './components/ChatMessages.jsx';
import ChatInput from './components/ChatInput.jsx';
import PreferencesPanel from './components/PreferencesPanel.jsx';
import ContentSidebar from './components/ContentSidebar.jsx';
import './Chat.css';

const API_URL = 'https://adaptaedu-api.vercel.app/api';

function Chat({ onBackToHome }) {
    const [conversationId, setConversationId] = useState(null);
    const [messages, setMessages] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isPrefOpen, setIsPrefOpen] = useState(false);
    const [sidebarContent, setSidebarContent] = useState(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [materiaisPendentes, setMateriaisPendentes] = useState(null);

    useEffect(() => {
        initializeChat();
    }, []);

    const initializeChat = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(`${API_URL}/chat/init`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            const data = await response.json();

            if (data.conversationId) {
                setConversationId(data.conversationId);
            }

            if (data.mensagem) {
                setMessages([{
                    role: 'assistant',
                    data: {
                        resposta: data.mensagem,
                        tipo: 'resposta'
                    }
                }]);
            }
        } catch (error) {
            console.error('Erro ao inicializar chat:', error);
            setMessages([{
                role: 'assistant',
                data: {
                    resposta: 'Erro ao inicializar conversa. Tente novamente.',
                    tipo: 'resposta'
                }
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSendMessage = async (message) => {
        setMessages(prev => [...prev, { role: 'user', content: message }]);
        setIsLoading(true);

        try {
            const response = await fetch(`${API_URL}/chat`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    mensagem: message,
                    conversationId: conversationId
                })
            });

            const data = await response.json();

            console.log(data);

            if (data.conversationId) {
                setConversationId(data.conversationId);
            }

            // Adiciona resposta às mensagens
            setMessages(prev => [...prev, { role: 'assistant', data }]);

            // Trata tipos de resposta
            if (data.tipo === 'lista_materiais' && data.materiais_pendentes) {
                setMateriaisPendentes(data.materiais_pendentes);
            } else {
                setMateriaisPendentes(null);
            }
        } catch (error) {
            console.error('Erro ao enviar mensagem:', error);
            setMessages(prev => [...prev, {
                role: 'assistant',
                data: {
                    resposta: 'Erro ao se comunicar com o servidor.',
                    tipo: 'resposta'
                }
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleNewChat = () => {
        setConversationId(null);
        setMessages([]);
        setMateriaisPendentes(null);
        setIsSidebarOpen(false);
        setSidebarContent(null);
        initializeChat();
    };

    const handleOpenContent = (content) => {
        setSidebarContent(content);
        setIsSidebarOpen(true);
    };

    const handleSavePreferences = async (preferences) => {
        if (!conversationId) {
            alert('Inicie uma conversa primeiro');
            return;
        }

        try {
            const response = await fetch(`${API_URL}/conversas/${conversationId}/preferencias`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ preferencias: preferences })
            });

            const data = await response.json();

            if (data.success) {
                alert('Preferências salvas!');
                setIsPrefOpen(false);
            }
        } catch (error) {
            console.error('Erro ao salvar preferências:', error);
            alert('Erro ao salvar preferências');
        }
    };

    return (
        <>
            <div className="chat-container">
                <div className="chat-header">
                    <button className="btn-new-chat" onClick={onBackToHome}>
                        <span className="btn-icon">←</span>
                        <span className="btn-text">Início</span>
                    </button>

                    <button className="btn-new-chat" onClick={handleNewChat}>
                        <span className="btn-icon">+</span>
                        <span className="btn-text">Nova Conversa</span>
                    </button>
                </div>

                <div className="chat-wrapper">
                    <div className="chat-content">
                        <ChatMessages
                            messages={messages}
                            isLoading={isLoading}
                            onSelectOption={handleSendMessage}
                            onOpenContent={handleOpenContent}
                            materiaisPendentes={materiaisPendentes}
                        />
                    </div>

                    <PreferencesPanel
                        isOpen={isPrefOpen}
                        onClose={() => setIsPrefOpen(false)}
                        onSave={handleSavePreferences}
                    />
                </div>

                <ChatInput
                    onSendMessage={handleSendMessage}
                    disabled={isLoading}
                />
            </div>
            
            <ContentSidebar
                isOpen={isSidebarOpen}
                content={sidebarContent}
                onClose={() => setIsSidebarOpen(false)}
            />
        </>
    );
}

export default Chat;
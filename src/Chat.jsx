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
    const [isWaitingForClarification, setIsWaitingForClarification] = useState(false);
    const [sidebarContent, setSidebarContent] = useState(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [showGreeting, setShowGreeting] = useState(true);
    const [userName, setUserName] = useState(localStorage.getItem('eduUserName') || null);
    const [isAskingName, setIsAskingName] = useState(!localStorage.getItem('eduUserName'));
    const [visibleMessageIndex, setVisibleMessageIndex] = useState(-1);

    const getGreetingMessage = () => {
        if (userName) {
            return {
                role: 'assistant',
                data: {
                    resposta: `Olá, ${userName}! 👋 Sou o **Edu**, seu assistente educacional inteligente!\n\nÉ ótimo ter você de volta! Estou aqui para ajudar você a aprender de forma personalizada e interativa.\n\nComo posso te ajudar hoje?`,
                    tipo: 'resposta'
                }
            };
        } else {
            return {
                role: 'assistant',
                data: {
                    resposta: `Olá! 👋 Sou o **Edu**, seu assistente educacional inteligente!\n\nAntes de começarmos, como você gostaria de ser chamado(a)?`,
                    tipo: 'resposta'
                }
            };
        }
    };

    useEffect(() => {
        if (showGreeting) {
            const timer = setTimeout(() => {
                setMessages([getGreetingMessage()]);
                setVisibleMessageIndex(0);
                setIsLoading(false);
                setShowGreeting(false);
            }, 2000);

            return () => clearTimeout(timer);
        }
    }, [showGreeting]);

    // Atualiza índice de mensagem visível quando novas mensagens chegam
    useEffect(() => {
        if (messages.length > 0) {
            setVisibleMessageIndex(messages.length - 1);
        }
    }, [messages.length]);

    const handleSendMessage = async (message) => {
        // Se estiver perguntando o nome, captura a resposta
        if (isAskingName) {
            const name = message.trim();
            setUserName(name);
            localStorage.setItem('eduUserName', name);
            setIsAskingName(false);

            const newMessages = [
                ...messages, 
                { role: 'user', content: message },
                {
                    role: 'assistant',
                    data: {
                        resposta: `Prazer em conhecê-lo, ${name}! 😊\n\nAgora que nos conhecemos, estou aqui para ajudar você a aprender de forma personalizada e interativa. Posso:\n\n💡 **Responder suas dúvidas** sobre diversos assuntos\n📚 **Fornecer materiais didáticos** relevantes\n🎯 **Adaptar as explicações** ao seu nível de conhecimento\n\nSobre o que você gostaria de aprender hoje?`,
                        tipo: 'resposta'
                    }
                }
            ];
            setMessages(newMessages);
            return;
        }

        const newUserMessage = { role: 'user', content: message };
        setMessages(prev => [...prev, newUserMessage]);
        setIsLoading(true);

        try {
            const response = await fetch(`${API_URL}/chat`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    mensagem: message,
                    conversationId: conversationId,
                    userName: userName
                })
            });

            const data = await response.json();

            console.log(data);

            if (data.conversationId) {
                setConversationId(data.conversationId);
            }

            setMessages(prev => [...prev, { role: 'assistant', data }]);

            if (data.tipo === 'clarificacao') {
                setIsWaitingForClarification(true);
            } else {
                setIsWaitingForClarification(false);
            }
        } catch (error) {
            console.error('Erro ao enviar mensagem:', error);
            setMessages(prev => [...prev, {
                role: 'assistant',
                data: {
                    resposta: 'Desculpe, ocorreu um erro ao se comunicar com o servidor. Por favor, tente novamente.',
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
        setIsWaitingForClarification(false);
        setIsSidebarOpen(false);
        setSidebarContent(null);
        setIsLoading(true);
        setShowGreeting(true);
        setVisibleMessageIndex(-1);
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
                            visibleMessageIndex={visibleMessageIndex}
                        />
                    </div>

                    <ChatInput
                        onSendMessage={handleSendMessage}
                        disabled={isLoading}
                    />

                    <PreferencesPanel
                        isOpen={isPrefOpen}
                        onClose={() => setIsPrefOpen(false)}
                        onSave={handleSavePreferences}
                    />
                </div>
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
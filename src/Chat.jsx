import React, { useState } from 'react';
import ChatHeader from './components/ChatHeader.jsx';
import ChatMessages from './components/ChatMessages.jsx';
import ChatInput from './components/ChatInput.jsx';
import PreferencesPanel from './components/PreferencesPanel.jsx';
import ContentSidebar from './components/ContentSidebar.jsx';
import './Chat.css';

const API_URL = 'https://adaptaedu-api.vercel.app/api';

function Chat({ onBackToHome }) {
    const [conversationId, setConversationId] = useState(null);
    const [messages, setMessages] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isPrefOpen, setIsPrefOpen] = useState(false);
    const [isWaitingForClarification, setIsWaitingForClarification] = useState(false);
    const [sidebarContent, setSidebarContent] = useState(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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
                content: 'Erro ao se comunicar com o servidor.'
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

            <ContentSidebar
                isOpen={isSidebarOpen}
                content={sidebarContent}
                onClose={() => setIsSidebarOpen(false)}
            />
        </div>
    );
}

export default Chat;
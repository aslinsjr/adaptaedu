import React from 'react';
import './Home.css';
import AnalyticsTracker from './AnalyticsTracker.jsx';

function Home({ onStartChat }) {
    return (
        <div className="home-container">
            <div className="home-content">
                <div className="home-header">
                    <img src="./logo.png" alt="EDU AI Logo" className="home-logo" />
                </div>

                <div className="home-description">

                    <div className="inner-description">
                        <div className="home-features">
                            <div className="feature-item">
                                <span className="feature-icon">💡</span>
                                <span className="feature-text">Respostas Personalizadas</span>
                            </div>
                            <div className="feature-item">
                                <span className="feature-icon">📚</span>
                                <span className="feature-text">Acesso a Materiais</span>
                            </div>
                            <div className="feature-item">
                                <span className="feature-icon">🎯</span>
                                <span className="feature-text">Aprendizado Interativo</span>
                            </div>
                        </div>


                        <p className="home-subtitle">
                            Seu companheiro de estudos alimentado por inteligência artificial.
                            Obtenha respostas personalizadas, acesse materiais didáticos e
                            aprenda de forma interativa e eficiente.
                        </p>
                    </div>



                    <button className="btn-new-chat" onClick={onStartChat}>
                        <span className="btn-start-icon">🚀</span>
                        <span className="btn-start-text">Começar a Conversar</span>
                    </button>
                </div>

               <AnalyticsTracker 
                    trackingId="TA-pe6zanxv4rd"
                    apiEndpoint="https://api-analytics-pearl.vercel.app/api/collect" 
                />
            </div>
        </div>
    );
}

export default Home;
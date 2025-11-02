import React, { useState } from 'react';
import './PreferencesPanel.css';

function PreferencesPanel({ isOpen, onClose, onSave }) {
    const [preferences, setPreferences] = useState({
        modoResposta: 'auto',
        profundidade: 'detalhado',
        perguntarSempre: true
    });

    const handleSave = () => {
        onSave(preferences);
    };

    return (
        <div className={`preferences-panel ${isOpen ? 'open' : ''}`}>
            <h3>Preferências</h3>
            <div className="pref-group">
                <label>Modo de Resposta:</label>
                <select 
                    value={preferences.modoResposta}
                    onChange={(e) => setPreferences({...preferences, modoResposta: e.target.value})}
                >
                    <option value="auto">Automático</option>
                    <option value="resumo">Resumo</option>
                    <option value="completo">Completo</option>
                    <option value="fragmentos">Fragmentos</option>
                </select>
            </div>
            <div className="pref-group">
                <label>Profundidade:</label>
                <select 
                    value={preferences.profundidade}
                    onChange={(e) => setPreferences({...preferences, profundidade: e.target.value})}
                >
                    <option value="basico">Básico</option>
                    <option value="detalhado">Detalhado</option>
                    <option value="avancado">Avançado</option>
                </select>
            </div>
            <div className="pref-group">
                <label>
                    <input 
                        type="checkbox" 
                        checked={preferences.perguntarSempre}
                        onChange={(e) => setPreferences({...preferences, perguntarSempre: e.target.checked})}
                    />
                    Sempre perguntar preferências
                </label>
            </div>
            <button className="btn-save" onClick={handleSave}>
                Salvar
            </button>
        </div>
    );
}

export default PreferencesPanel;

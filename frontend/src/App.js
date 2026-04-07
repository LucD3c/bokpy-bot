import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const API = 'http://localhost:8000';

function App() {
  const [apiStatus, setApiStatus] = useState('Conectando...');

  useEffect(() => {
    axios.get(`${API}/health`)
      .then(() => setApiStatus('✅ API Conectada'))
      .catch(() => setApiStatus('❌ API Desconectada'));
  }, []);

  return (
    <div className="app">
      <header className="header">
        <h1>🤖 Bokpy Bot</h1>
        <span className="status">{apiStatus}</span>
      </header>
      <main className="main">
        <div className="card">
          <h2>Dashboard</h2>
          <p>Sistema de trading automático en construcción...</p>
        </div>
      </main>
    </div>
  );
}

export default App;
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const API = 'http://localhost:8000';

function App() {
  const [apiStatus, setApiStatus] = useState('Conectando...');
  const [balance, setBalance] = useState(null);

  useEffect(() => {
    axios.get(`${API}/health`)
      .then(() => setApiStatus('✅ API Conectada'))
      .catch(() => setApiStatus('❌ API Desconectada'));

    axios.get(`${API}/balance`)
      .then(res => setBalance(res.data.balance))
      .catch(() => setBalance(null));
  }, []);

  return (
    <div className="app">
      <header className="header">
        <h1>🤖 Bokpy Bot</h1>
        <span className="status">{apiStatus}</span>
      </header>
      <main className="main">
        <div className="cards">
          <div className="card">
            <h3>Balance USDT</h3>
            <p className="amount">{balance ? `$${balance.USDT}` : '...'}</p>
          </div>
          <div className="card">
            <h3>Balance BTC</h3>
            <p className="amount">{balance ? `₿${balance.BTC}` : '...'}</p>
          </div>
          <div className="card">
            <h3>Estado del Bot</h3>
            <p className="amount stopped">⏸ Detenido</p>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
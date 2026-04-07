import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const API = 'http://localhost:8000';

function App() {
  const [apiStatus, setApiStatus] = useState('Conectando...');
  const [balance, setBalance] = useState(null);
  const [signal, setSignal] = useState(null);

  const fetchData = () => {
    axios.get(`${API}/health`)
      .then(() => setApiStatus('✅ API Conectada'))
      .catch(() => setApiStatus('❌ API Desconectada'));

    axios.get(`${API}/balance`)
      .then(res => setBalance(res.data.balance))
      .catch(() => setBalance(null));

    axios.get(`${API}/signal`)
      .then(res => setSignal(res.data))
      .catch(() => setSignal(null));
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  const signalColor = {
    'BUY': '#3fb950',
    'SELL': '#f85149',
    'HOLD': '#e3b341'
  };

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

        {signal && (
          <div className="signal-box">
            <h2>Señal Actual — {signal.symbol}</h2>
            <div className="signal-grid">
              <div className="signal-item">
                <span>Precio</span>
                <strong>${signal.price.toLocaleString()}</strong>
              </div>
              <div className="signal-item">
                <span>EMA 9</span>
                <strong>${signal.ema9.toLocaleString()}</strong>
              </div>
              <div className="signal-item">
                <span>EMA 21</span>
                <strong>${signal.ema21.toLocaleString()}</strong>
              </div>
              <div className="signal-item">
                <span>Señal</span>
                <strong style={{color: signalColor[signal.signal]}}>
                  {signal.signal === 'BUY' ? '🟢 COMPRAR' :
                   signal.signal === 'SELL' ? '🔴 VENDER' : '🟡 MANTENER'}
                </strong>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
import React, { useState, useEffect } from 'react';

export default function App() {
  // --- UI STATE ---
  const [activeTab, setActiveTab] = useState('home');
  const [isStealth, setIsStealth] = useState(false);
  const [isAiOpen, setIsAiOpen] = useState(false);
  const [showAudit, setShowAudit] = useState(false);
  const [aiMsg, setAiMsg] = useState("System Restored. Ready to stack.");
  const [userInput, setUserInput] = useState('');

  const founderName = "Dhruvi Desai";

  // --- DATA PERSISTENCE ---
  const [stack, setStack] = useState(() => Number(localStorage.getItem('stack')) || 0);
  const [goal, setGoal] = useState(() => Number(localStorage.getItem('goal')) || 10000);
  const [history, setHistory] = useState(() => JSON.parse(localStorage.getItem('history')) || []);
  const [recurring, setRecurring] = useState(() => JSON.parse(localStorage.getItem('recurring')) || []);

  useEffect(() => {
    localStorage.setItem('stack', stack);
    localStorage.setItem('goal', goal);
    localStorage.setItem('history', JSON.stringify(history));
    localStorage.setItem('recurring', JSON.stringify(recurring));
  }, [stack, goal, history, recurring]);

  // --- LOGIC ENGINE ---
  const getMonthlyVal = (amt, term) => {
    const v = Number(amt);
    const rates = { daily: 30.42, weekly: 4.33, monthly: 1, yearly: 1/12 };
    return v * (rates[term] || 1);
  };

  const monthlyIn = recurring.filter(r => r.type === 'income').reduce((acc, r) => acc + getMonthlyVal(r.amount, r.term), 0);
  const monthlyOut = recurring.filter(r => r.type === 'burn').reduce((acc, r) => acc + getMonthlyVal(r.amount, r.term), 0);
  const netFlow = monthlyIn - monthlyOut;

  // --- STYLES ---
  const s = {
    main: { minHeight: '100vh', background: '#000', color: '#FFF', fontFamily: 'sans-serif', padding: '20px' },
    card: { background: '#1C1C1E', padding: '20px', borderRadius: '20px', marginBottom: '15px' },
    nav: { position: 'fixed', bottom: '20px', left: '50%', transform: 'translateX(-50%)', width: '280px', background: '#1C1C1E', display: 'flex', justifyContent: 'space-around', padding: '15px', borderRadius: '40px', border: '1px solid #333' },
    input: { width: '100%', background: 'none', border: 'none', borderBottom: '1px solid #333', color: '#FFF', padding: '10px 0', marginBottom: '10px', outline: 'none' }
  };

  return (
    <div style={s.main}>
      <header style={{display: 'flex', justifyContent: 'space-between', marginBottom: '30px'}}>
        <b style={{letterSpacing: '2px', fontSize: '12px'}}>STACKED AI</b>
        <button onClick={() => setIsStealth(!isStealth)} style={{background: '#333', color: '#FFF', border: 'none', padding: '5px 15px', borderRadius: '10px', fontSize: '10px'}}>{isStealth ? 'SHOW' : 'STEALTH'}</button>
      </header>

      {activeTab === 'home' && (
        <div>
          <div style={{textAlign: 'center', margin: '40px 0'}}>
            <p style={{fontSize: '10px', color: '#8E8E93'}}>TOTAL CAPITAL</p>
            <h1 style={{fontSize: '4rem', margin: '10px 0', filter: isStealth ? 'blur(15px)' : 'none'}}>${stack.toLocaleString()}</h1>
            <button onClick={() => setIsAiOpen(true)} style={{background: '#007AFF', color: '#FFF', border: 'none', width: '100%', padding: '15px', borderRadius: '15px', fontWeight: 'bold'}}>CONSULT COACH</button>
          </div>
          <div style={s.card}>
            <p style={{fontSize: '10px', color: '#8E8E93', marginBottom: '10px'}}>RECENT ACTIVITY</p>
            {history.slice(0, 3).map(h => (
              <div key={h.id} style={{display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #333'}}>
                <span>{h.label}</span>
                <span style={{color: h.amount > 0 ? '#34C759' : '#FF3B30'}}>${Math.abs(h.amount)}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'lab' && (
        <div>
          <div style={s.card}>
            <p style={{fontSize: '10px', color: '#8E8E93'}}>LOG TRANSACTION</p>
            <input id="label" placeholder="Source" style={s.input} />
            <input id="amount" type="number" placeholder="0.00" style={s.input} />
            <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '10px'}}>
              <button onClick={() => {
                const l = document.getElementById('label').value; const a = document.getElementById('amount').value;
                if(l && a) { setHistory([{label: l, amount: Number(a), id: Date.now()}, ...history]); setStack(s => s + Number(a)); }
              }} style={{background: '#FFF', color: '#000', padding: '12px', borderRadius: '10px', border: 'none', fontWeight: 'bold'}}>INCOME</button>
              <button onClick={() => {
                const l = document.getElementById('label').value; const a = document.getElementById('amount').value;
                if(l && a) { setHistory([{label: l, amount: -Number(a), id: Date.now()}, ...history]); setStack(s => s - Number(a)); }
              }} style={{background: '#333', color: '#FFF', padding: '12px', borderRadius: '10px', border: 'none', fontWeight: 'bold'}}>SPEND</button>
            </div>
          </div>
          <div style={s.card}>
            <p style={{fontSize: '10px', color: '#8E8E93'}}>RECURRING ENGINE</p>
            <button onClick={() => {
              const l = prompt("Name?"); const a = prompt("Amount?"); const t = prompt("daily/weekly/monthly/yearly");
              const type = confirm("Is this Income?") ? 'income' : 'burn';
              if(l && a && t) setRecurring([{label: l, amount: a, term: t, type, id: Date.now()}, ...recurring]);
            }} style={{width: '100%', padding: '10px', background: 'none', border: '1px dashed #444', color: '#8E8E93', borderRadius: '10px', marginTop: '10px'}}>+ ADD AUTO-FLOW</button>
          </div>
        </div>
      )}

      {activeTab === 'arena' && (
        <div>
          <div style={s.card}>
            <p style={{fontSize: '10px', color: '#8E8E93'}}>INITIAL CALIBRATION</p>
            <div style={{display: 'flex', justifyContent: 'space-between', marginTop: '15px'}}>
              <span>Balance</span>
              <input type="number" onBlur={(e) => setStack(Number(e.target.value))} style={{background: 'none', border: 'none', color: '#007AFF', textAlign: 'right', fontWeight: 'bold'}} placeholder={stack} />
            </div>
            <div style={{display: 'flex', justifyContent: 'space-between', marginTop: '15px'}}>
              <span>Goal</span>
              <input type="number" onBlur={(e) => setGoal(Number(e.target.value))} style={{background: 'none', border: 'none', color: '#007AFF', textAlign: 'right', fontWeight: 'bold'}} placeholder={goal} />
            </div>
          </div>
          <div style={{...s.card, textAlign: 'center'}}>
            <p style={{fontSize: '10px', color: '#8E8E93'}}>MONTHLY NET FLOW</p>
            <h2 style={{color: netFlow >= 0 ? '#34C759' : '#FF3B30', fontSize: '32px'}}>${netFlow.toFixed(2)}</h2>
            <button onClick={() => setShowAudit(!showAudit)} style={{background: '#FFF', padding: '5px 15px', borderRadius: '8px', border: 'none', fontWeight: 'bold', fontSize: '10px'}}>SYSTEM AUDIT</button>
            {showAudit && <button onClick={() => {localStorage.clear(); window.location.reload();}} style={{display:'block', width:'100%', marginTop:'20px', color:'#FF3B30', background:'none', border:'1px solid #FF3B30', padding:'10px', borderRadius:'10px'}}>WIPE ALL DATA</button>}
          </div>
        </div>
      )}

      {isAiOpen && (
        <div style={{position: 'fixed', bottom: 0, left: 0, width: '100%', height: '300px', background: '#000', borderTop: '1px solid #007AFF', padding: '20px', boxSizing: 'border-box'}}>
          <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '15px'}}>
            <span style={{fontSize: '10px', fontWeight: 'bold'}}>COACH AI</span>
            <button onClick={() => setIsAiOpen(false)} style={{background: 'none', border: 'none', color: '#FFF'}}>CLOSE</button>
          </div>
          <div style={{background: '#1C1C1E', padding: '15px', borderRadius: '15px', marginBottom: '15px'}}>{aiMsg}</div>
          <input value={userInput} onChange={e => setUserInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && setAiMsg("Analyzing data flows...")} placeholder="Ask..." style={{width: '100%', background: '#333', border: 'none', padding: '12px', borderRadius: '10px', color: '#FFF'}} />
        </div>
      )}

      <nav style={s.nav}>
        <button onClick={() => setActiveTab('home')} style={{background: 'none', color: '#FFF', border: 'none', opacity: activeTab === 'home' ? 1 : 0.4, fontWeight: 'bold'}}>HOME</button>
        <button onClick={() => setActiveTab('lab')} style={{background: 'none', color: '#FFF', border: 'none', opacity: activeTab === 'lab' ? 1 : 0.4, fontWeight: 'bold'}}>LAB</button>
        <button onClick={() => setActiveTab('arena')} style={{background: 'none', color: '#FFF', border: 'none', opacity: activeTab === 'arena' ? 1 : 0.4, fontWeight: 'bold'}}>ARENA</button>
      </nav>
    </div>
  );
}

import React, { useState, useEffect } from 'react';

// STACKED AI v6.4 - EMERGENCY RECOVERY BUILD
export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [isStealth, setIsStealth] = useState(false);
  const [isAiOpen, setIsAiOpen] = useState(false);
  const [showAudit, setShowAudit] = useState(false);
  
  const founderName = "Dhruvi Desai"; 

  // --- DATA ENGINE ---
  const [stack, setStack] = useState(() => {
    const saved = localStorage.getItem('stack');
    return saved !== null ? JSON.parse(saved) : 0;
  });
  const [goal, setGoal] = useState(() => {
    const saved = localStorage.getItem('goal');
    return saved !== null ? JSON.parse(saved) : 10000;
  });
  const [history, setHistory] = useState(() => {
    const saved = localStorage.getItem('history');
    return saved !== null ? JSON.parse(saved) : [];
  });
  const [recurring, setRecurring] = useState(() => {
    const saved = localStorage.getItem('recurring');
    return saved !== null ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('stack', JSON.stringify(stack));
    localStorage.setItem('goal', JSON.stringify(goal));
    localStorage.setItem('history', JSON.stringify(history));
    localStorage.setItem('recurring', JSON.stringify(recurring));
  }, [stack, goal, history, recurring]);

  // --- CALCULATIONS ---
  const getMonthlyVal = (amt, term) => {
    const v = Number(amt);
    const rates = { daily: 30.42, weekly: 4.33, monthly: 1, yearly: 0.083 };
    return v * (rates[term] || 1);
  };

  const monthlyIn = recurring
    .filter(r => r.type === 'income')
    .reduce((acc, curr) => acc + getMonthlyVal(curr.amount, curr.term), 0);

  const monthlyOut = recurring
    .filter(r => r.type === 'burn')
    .reduce((acc, curr) => acc + getMonthlyVal(curr.amount, curr.term), 0);

  const netFlow = monthlyIn - monthlyOut;

  const [aiMsg, setAiMsg] = useState(`System Restored. Founder: ${founderName}`);
  const [userInput, setUserInput] = useState('');

  const askCoach = () => {
    if (userInput.toLowerCase().includes("founder")) {
      setAiMsg(`${founderName} is the lead architect.`);
    } else {
      setAiMsg("Data ledger synced and secure.");
    }
    setUserInput('');
  };

  // --- STYLES ---
  const styles = {
    container: { minHeight: '100vh', background: '#000', color: '#FFF', fontFamily: '-apple-system, sans-serif', padding: '20px' },
    card: { background: '#1C1C1E', padding: '20px', borderRadius: '20px', marginBottom: '20px' },
    nav: { position: 'fixed', bottom: '30px', left: '50%', transform: 'translateX(-50%)', width: '260px', background: 'rgba(28,28,30,0.95)', borderRadius: '40px', display: 'flex', justifyContent: 'space-around', padding: '15px', border: '1px solid #333' }
  };

  return (
    <div style={styles.container}>
      <div style={{ maxWidth: '400px', margin: '0 auto', paddingBottom: '100px' }}>
        
        <header style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '40px', alignItems: 'center' }}>
          <div style={{ fontWeight: '900', fontSize: '14px', letterSpacing: '2px' }}>STACKED AI</div>
          <button onClick={() => setIsStealth(!isStealth)} style={{ background: isStealth ? '#FF3B30' : '#333', color: '#FFF', border: 'none', padding: '8px 15px', borderRadius: '10px', fontWeight: '800' }}>
            {isStealth ? 'UNBLUR' : 'STEALTH'}
          </button>
        </header>

        {activeTab === 'home' && (
          <main>
            <div style={{ textAlign: 'center', marginBottom: '40px' }}>
              <p style={{ fontSize: '10px', color: '#8E8E93', fontWeight: '800' }}>TOTAL STACK</p>
              <h1 style={{ fontSize: '4rem', fontWeight: '900', margin: '10px 0', filter: isStealth ? 'blur(15px)' : 'none' }}>
                ${stack.toLocaleString()}
              </h1>
              <button onClick={() => setIsAiOpen(true)} style={{ width: '100%', padding: '15px', borderRadius: '15px', background: '#007AFF', color: '#FFF', border: 'none', fontWeight: '800' }}>
                ✨ CONSULT COACH
              </button>
            </div>
            <div style={styles.card}>
              <p style={{ fontSize: '10px', color: '#8E8E93', fontWeight: '800', marginBottom: '10px' }}>RECENT LOGS</p>
              {history.length === 0 ? <p style={{color: '#444'}}>No history yet.</p> : history.slice(0, 3).map(item => (
                <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #333' }}>
                  <span>{item.label}</span>
                  <span style={{ color: item.amount > 0 ? '#34C759' : '#FF3B30' }}>${Math.abs(item.amount)}</span>
                </div>
              ))}
            </div>
          </main>
        )}

        {activeTab === 'lab' && (
          <main>
            <div style={styles.card}>
              <input id="label" placeholder="Source Name" style={{ width: '100%', background: 'none', border: 'none', borderBottom: '1px solid #333', color: '#FFF', padding: '10px 0', marginBottom: '20px', outline: 'none' }} />
              <input id="amount" type="number" placeholder="0.00" style={{ width: '100%', background: 'none', border: 'none', borderBottom: '1px solid #333', color: '#FFF', padding: '10px 0', marginBottom: '20px', outline: 'none' }} />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <button onClick={() => {
                  const l = document.getElementById('label').value;
                  const a = document.getElementById('amount').value;
                  if(l && a) { setHistory([{label: l, amount: Number(a), id: Date.now()}, ...history]); setStack(s => s + Number(a)); }
                }} style={{ padding: '15px', borderRadius: '12px', border: 'none', fontWeight: '800', background: '#FFF', color: '#000' }}>+ INCOME</button>
                <button onClick={() => {
                  const l = document.getElementById('label').value;
                  const a = document.getElementById('amount').value;
                  if(l && a) { setHistory([{label: l, amount: -Number(a), id: Date.now()}, ...history]); setStack(s => s - Number(a)); }
                }} style={{ padding: '15px', borderRadius: '12px', border: 'none', fontWeight: '800', background: '#333', color: '#FFF' }}>- SPEND</button>
              </div>
            </div>
          </main>
        )}

        {activeTab === 'arena' && (
          <main>
            <div style={styles.card}>
              <p style={{fontSize: '10px', color: '#8E8E93', fontWeight: '800'}}>CALIBRATE SYSTEM</p>
              <div style={{display: 'flex', justifyContent: 'space-between', marginTop: '15px'}}>
                <span>Balance:</span>
                <input type="number" onChange={(e) => setStack(Number(e.target.value))} style={{background: 'none', border: 'none', color: '#007AFF', textAlign: 'right', fontWeight: '800'}} placeholder={stack} />
              </div>
            </div>
            <div style={{...styles.card, textAlign: 'center', background: '#000', border: '1px solid #333'}}>
                <p style={{fontSize: '10px', color: '#8E8E93'}}>MONTHLY NET</p>
                <h2 style={{fontSize: '32px', color: netFlow >= 0 ? '#34C759' : '#FF3B30'}}>${netFlow.toFixed(2)}</h2>
                <button onClick={() => setShowAudit(!showAudit)} style={{background: '#FFF', color: '#000', border: 'none', padding: '10px 20px', borderRadius: '10px', fontWeight: '900', marginTop: '10px'}}>AUDIT FLOWS</button>
                {showAudit && (
                  <button onClick={() => { localStorage.clear(); window.location.reload(); }} style={{display: 'block', width: '100%', marginTop: '20px', background: '#FF3B30', color: '#FFF', border: 'none', padding: '10px', borderRadius: '10px', fontWeight: '800'}}>HARD RESET</button>
                )}
            </div>
          </main>
        )}

        {isAiOpen && (
          <div style={{ position: 'fixed', bottom: 0, left: 0, width: '100%', height: '350px', background: '#000', borderTop: '2px solid #007AFF', padding: '30px', boxSizing: 'border-box', zIndex: 1000 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
              <span style={{ fontWeight: '900', fontSize: '12px' }}>COACH AI</span>
              <button onClick={() => setIsAiOpen(false)} style={{ background: 'none', border: 'none', color: '#FFF', fontSize: '24px' }}>×</button>
            </div>
            <div style={{ background: '#1C1C1E', padding: '20px', borderRadius: '15px', color: '#FFF', marginBottom: '20px' }}>{aiMsg}</div>
            <input value={userInput} onChange={e => setUserInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && askCoach()} placeholder="Ask anything..." style={{ width: '100%', background: '#333', border: 'none', padding: '15px', borderRadius: '10px', color: '#FFF', outline: 'none' }} />
          </div>
        )}

        <nav style={styles.nav}>
          {['home', 'lab', 'arena'].map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} style={{ background: 'none', border: 'none', color: '#FFF', fontWeight: '800', fontSize: '11px', opacity: activeTab === tab ? 1 : 0.4 }}>
              {tab.toUpperCase()}
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
}

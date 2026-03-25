import React, { useState, useEffect } from 'react';

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [isStealth, setIsStealth] = useState(false);
  const [isAiOpen, setIsAiOpen] = useState(false);
  
  // --- RECOVERY LOGIC ---
  const [stack, setStack] = useState(() => {
    try { return Number(localStorage.getItem('stack')) || 0; } catch { return 0; }
  });
  const [history, setHistory] = useState(() => {
    try { return JSON.parse(localStorage.getItem('history')) || []; } catch { return []; }
  });
  const [recurring, setRecurring] = useState(() => {
    try { return JSON.parse(localStorage.getItem('recurring')) || []; } catch { return []; }
  });

  useEffect(() => {
    localStorage.setItem('stack', stack);
    localStorage.setItem('history', JSON.stringify(history));
    localStorage.setItem('recurring', JSON.stringify(recurring));
  }, [stack, history, recurring]);

  const styles = {
    container: { minHeight: '100vh', background: '#000', color: '#FFF', fontFamily: 'sans-serif', padding: '20px' },
    card: { background: '#1C1C1E', padding: '20px', borderRadius: '24px', marginBottom: '15px', border: '1px solid #333' },
    nav: { position: 'fixed', bottom: '30px', left: '50%', transform: 'translateX(-50%)', width: '260px', background: 'rgba(28,28,30,0.9)', borderRadius: '40px', display: 'flex', justifyContent: 'space-around', padding: '15px', border: '1px solid #444' }
  };

  return (
    <div style={styles.container}>
      <div style={{maxWidth: '400px', margin: '0 auto', paddingBottom: '100px'}}>
        <header style={{display: 'flex', justifyContent: 'space-between', marginBottom: '40px'}}>
          <b style={{letterSpacing: '2px', fontSize: '12px'}}>STACKED AI</b>
          <button onClick={() => setIsStealth(!isStealth)} style={{background: '#333', color: '#FFF', border: 'none', padding: '8px 15px', borderRadius: '10px', fontWeight: '800'}}>
            {isStealth ? 'SHOW' : 'STEALTH'}
          </button>
        </header>

        {activeTab === 'home' && (
          <main>
            <div style={{textAlign: 'center', marginBottom: '40px'}}>
              <p style={{fontSize: '10px', color: '#8E8E93', fontWeight: '800'}}>TOTAL CAPITAL</p>
              <h1 style={{fontSize: '4.5rem', fontWeight: '900', margin: '15px 0', filter: isStealth ? 'blur(15px)' : 'none'}}>
                ${stack.toLocaleString()}
              </h1>
              <button onClick={() => setIsAiOpen(true)} style={{width: '100%', padding: '18px', borderRadius: '20px', background: '#007AFF', color: '#FFF', border: 'none', fontWeight: '900'}}>
                ✨ CONSULT COACH
              </button>
            </div>
            <div style={styles.card}>
              <p style={{fontSize: '10px', color: '#8E8E93', fontWeight: '800', marginBottom: '15px'}}>RECENT ACTIVITY</p>
              {history.length === 0 ? <p style={{color: '#444'}}>No data logged.</p> : history.slice(0, 3).map(h => (
                <div key={h.id} style={{display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid #333'}}>
                  <span>{h.label}</span>
                  <span style={{color: h.amount > 0 ? '#34C759' : '#FF3B30'}}>${Math.abs(h.amount)}</span>
                </div>
              ))}
            </div>
          </main>
        )}

        {activeTab === 'lab' && (
          <main>
            <div style={styles.card}>
              <p style={{fontSize: '10px', color: '#8E8E93', marginBottom: '15px'}}>NEW ENTRY</p>
              <input id="lab-label" placeholder="Source" style={{width: '100%', background: 'none', border: 'none', borderBottom: '1px solid #333', color: '#FFF', padding: '10px 0', marginBottom: '15px', outline: 'none'}} />
              <input id="lab-amt" type="number" placeholder="0.00" style={{width: '100%', background: 'none', border: 'none', borderBottom: '1px solid #333', color: '#FFF', padding: '10px 0', marginBottom: '20px', outline: 'none'}} />
              <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px'}}>
                <button onClick={() => {
                  const l = document.getElementById('lab-label').value; const a = document.getElementById('lab-amt').value;
                  if(l && a) { setHistory([{label: l, amount: Number(a), id: Date.now()}, ...history]); setStack(s => s + Number(a)); }
                }} style={{padding: '15px', borderRadius: '15px', border: 'none', background: '#FFF', color: '#000', fontWeight: '900'}}>INCOME</button>
                <button onClick={() => {
                  const l = document.getElementById('lab-label').value; const a = document.getElementById('lab-amt').value;
                  if(l && a) { setHistory([{label: l, amount: -Number(a), id: Date.now()}, ...history]); setStack(s => s - Number(a)); }
                }} style={{padding: '15px', borderRadius: '15px', border: 'none', background: '#333', color: '#FFF', fontWeight: '900'}}>SPEND</button>
              </div>
            </div>
          </main>
        )}

        {activeTab === 'arena' && (
          <main>
            <div style={styles.card}>
              <p style={{fontSize: '10px', color: '#8E8E93', marginBottom: '15px'}}>CALIBRATION</p>
              <div style={{display: 'flex', justifyContent: 'space-between'}}>
                <span>Manual Balance</span>
                <input type="number" onBlur={(e) => setStack(Number(e.target.value))} style={{background: 'none', border: 'none', color: '#007AFF', textAlign: 'right', fontWeight: '900'}} placeholder={stack} />
              </div>
            </div>
            <button onClick={() => { localStorage.clear(); window.location.reload(); }} style={{width: '100%', background: '#FF3B30', color: '#FFF', border: 'none', padding: '15px', borderRadius: '15px', fontWeight: '900'}}>HARD RESET SYSTEM</button>
          </main>
        )}

        {isAiOpen && (
          <div style={{position: 'fixed', bottom: 0, left: 0, width: '100%', height: '320px', background: '#000', borderTop: '2px solid #007AFF', padding: '30px', boxSizing: 'border-box', zIndex: 1000}}>
            <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '20px'}}>
              <span style={{fontWeight: '900', fontSize: '10px'}}>COACH AI</span>
              <button onClick={() => setIsAiOpen(false)} style={{background: 'none', border: 'none', color: '#FFF', fontSize: '20px'}}>×</button>
            </div>
            <div style={{background: '#1C1C1E', padding: '20px', borderRadius: '15px', color: '#FFF'}}>System Online. Founder: Dhruvi Desai.</div>
          </div>
        )}

        <nav style={styles.nav}>
          {['home', 'lab', 'arena'].map(t => (
            <button key={t} onClick={() => setActiveTab(t)} style={{background: 'none', border: 'none', color: '#FFF', fontWeight: '900', fontSize: '11px', opacity: activeTab === t ? 1 : 0.3}}>
              {t.toUpperCase()}
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
}

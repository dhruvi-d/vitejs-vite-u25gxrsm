import React, { useState, useEffect } from 'react';

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [isStealth, setIsStealth] = useState(false);
  const [isAiOpen, setIsAiOpen] = useState(false);
  const [showAudit, setShowAudit] = useState(false);
  const [aiMsg, setAiMsg] = useState("Logic Engine v6.6: Online.");
  const [userInput, setUserInput] = useState('');

  const founderName = "Dhruvi Desai";

  // --- PERSISTENCE LAYER ---
  const [stack, setStack] = useState(() => Number(localStorage.getItem('stack')) || 0);
  const [history, setHistory] = useState(() => JSON.parse(localStorage.getItem('history')) || []);
  const [recurring, setRecurring] = useState(() => JSON.parse(localStorage.getItem('recurring')) || []);
  const [goal, setGoal] = useState(() => Number(localStorage.getItem('goal')) || 10000);

  useEffect(() => {
    localStorage.setItem('stack', stack);
    localStorage.setItem('history', JSON.stringify(history));
    localStorage.setItem('recurring', JSON.stringify(recurring));
    localStorage.setItem('goal', goal);
  }, [stack, history, recurring, goal]);

  // --- RECURRING CALCULATOR ---
  const getMonthlyVal = (amt, term) => {
    const v = Number(amt);
    const rates = { daily: 30.42, weekly: 4.33, monthly: 1, yearly: 1/12 };
    return v * (rates[term] || 1);
  };

  const monthlyIn = recurring.filter(r => r.type === 'income').reduce((acc, r) => acc + getMonthlyVal(r.amount, r.term), 0);
  const monthlyOut = recurring.filter(r => r.type === 'burn').reduce((acc, r) => acc + getMonthlyVal(r.amount, r.term), 0);
  const netFlow = monthlyIn - monthlyOut;

  // --- THE STYLES ---
  const s = {
    main: { minHeight: '100vh', background: '#000', color: '#FFF', fontFamily: '-apple-system, sans-serif', padding: '20px' },
    card: { background: '#1C1C1E', padding: '20px', borderRadius: '24px', marginBottom: '15px', border: '1px solid #333' },
    nav: { position: 'fixed', bottom: '30px', left: '50%', transform: 'translateX(-50%)', width: '280px', background: 'rgba(28,28,30,0.95)', borderRadius: '40px', display: 'flex', justifyContent: 'space-around', padding: '16px', border: '1px solid #444', backdropFilter: 'blur(10px)' },
    input: { width: '100%', background: 'none', border: 'none', borderBottom: '1px solid #444', color: '#FFF', padding: '12px 0', marginBottom: '10px', outline: 'none', fontSize: '16px' }
  };

  return (
    <div style={s.main}>
      <div style={{ maxWidth: '400px', margin: '0 auto', paddingBottom: '100px' }}>
        
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
          <div>
            <b style={{ letterSpacing: '2px', fontSize: '12px' }}>STACKED AI</b>
            <div style={{ fontSize: '8px', color: '#007AFF', fontWeight: '900', marginTop: '2px' }}>BY {founderName.toUpperCase()}</div>
          </div>
          <button onClick={() => setIsStealth(!isStealth)} style={{ background: isStealth ? '#FF3B30' : '#333', color: '#FFF', border: 'none', padding: '8px 15px', borderRadius: '12px', fontSize: '10px', fontWeight: '800' }}>
            {isStealth ? 'SHOW' : 'STEALTH'}
          </button>
        </header>

        {activeTab === 'home' && (
          <main>
            <div style={{ textAlign: 'center', marginBottom: '40px' }}>
              <p style={{ fontSize: '10px', color: '#8E8E93', fontWeight: '800' }}>LEVEL {Math.floor(stack/1000)} • TOTAL CAPITAL</p>
              <h1 style={{ fontSize: '4.5rem', fontWeight: '900', margin: '15px 0', letterSpacing: '-3px', filter: isStealth ? 'blur(15px)' : 'none' }}>
                ${stack.toLocaleString()}
              </h1>
              <button onClick={() => setIsAiOpen(true)} style={{ width: '100%', padding: '18px', borderRadius: '20px', background: '#007AFF', color: '#FFF', border: 'none', fontWeight: '900', fontSize: '14px' }}>
                ✨ CONSULT COACH
              </button>
            </div>
            <div style={s.card}>
              <p style={{ fontSize: '10px', color: '#8E8E93', fontWeight: '800', marginBottom: '15px' }}>RECENT ACTIVITY</p>
              {history.length === 0 ? <p style={{color:'#444', fontSize:'12px'}}>No logs yet.</p> : history.slice(0, 3).map(h => (
                <div key={h.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid #333' }}>
                  <span style={{fontSize:'14px'}}>{h.label}</span>
                  <span style={{ color: h.amount > 0 ? '#34C759' : '#FF3B30', fontWeight: '700' }}>{h.amount > 0 ? '+' : ''}${Math.abs(h.amount)}</span>
                </div>
              ))}
            </div>
          </main>
        )}

        {activeTab === 'lab' && (
          <main>
            <div style={s.card}>
              <p style={{ fontSize: '10px', color: '#8E8E93', marginBottom: '15px' }}>TRANSACTION LAB</p>
              <input id="lab-label" placeholder="Source Name" style={s.input} />
              <input id="lab-amt" type="number" placeholder="0.00" style={s.input} />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '10px' }}>
                <button onClick={() => {
                  const l = document.getElementById('lab-label').value; const a = document.getElementById('lab-amt').value;
                  if(l && a) { setHistory([{label: l, amount: Number(a), id: Date.now()}, ...history]); setStack(s => s + Number(a)); }
                }} style={{ padding: '15px', borderRadius: '15px', border: 'none', background: '#FFF', color: '#000', fontWeight: '900' }}>+ INCOME</button>
                <button onClick={() => {
                  const l = document.getElementById('lab-label').value; const a = document.getElementById('lab-amt').value;
                  if(l && a) { setHistory([{label: l, amount: -Number(a), id: Date.now()}, ...history]); setStack(s => s - Number(a)); }
                }} style={{ padding: '15px', borderRadius: '15px', border: 'none', background: '#333', color: '#FFF', fontWeight: '900' }}>- SPEND</button>
              </div>
            </div>
            <div style={s.card}>
              <p style={{ fontSize: '10px', color: '#8E8E93', marginBottom: '15px' }}>RECURRING AUTO-FLOW</p>
              <button onClick={() => {
                const l = prompt("Name of flow?"); const a = prompt("Amount?"); const t = prompt("daily/weekly/monthly/yearly");
                const type = confirm("Is this Income? (Cancel for Burn)") ? 'income' : 'burn';
                if(l && a && t) setRecurring([{label: l, amount: Number(a), term: t, type, id: Date.now()}, ...recurring]);
              }} style={{ width: '100%', padding: '12px', background: 'none', border: '1px dashed #444', color: '#8E8E93', borderRadius: '15px', fontSize: '12px' }}>
                + ATTACH NEW RECURRING
              </button>
            </div>
          </main>
        )}

        {activeTab === 'arena' && (
          <main>
            <div style={s.card}>
              <p style={{ fontSize: '10px', color: '#8E8E93', marginBottom: '15px' }}>SYSTEM CALIBRATION</p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{fontSize:'14px'}}>Adjust Balance</span>
                <input type="number" onBlur={(e) => setStack(Number(e.target.value))} style={{ background: 'none', border: 'none', color: '#007AFF', textAlign: 'right', fontWeight: '900', fontSize: '18px' }} placeholder={stack} />
              </div>
            </div>
            
            <div style={{ ...s.card, textAlign: 'center', background: '#000', border: '1px solid #333' }}>
              <p style={{ fontSize: '10px', color: '#8E8E93' }}>PROJECTED MONTHLY NET</p>
              <h2 style={{ fontSize: '42px', fontWeight: '900', color: netFlow >= 0 ? '#34C759' : '#FF3B30', margin: '10px 0' }}>
                ${netFlow.toLocaleString(undefined, {minimumFractionDigits: 2})}
              </h2>
              <button onClick={() => setShowAudit(!showAudit)} style={{ background: '#FFF', color: '#000', border: 'none', padding: '10px 20px', borderRadius: '12px', fontWeight: '900', fontSize: '11px' }}>
                {showAudit ? 'HIDE AUDIT' : 'GENERATE AUDIT'}
              </button>
            </div>

            {showAudit && (
              <div style={{...s.card, animation: 'fadeIn 0.5s'}}>
                <p style={{ fontSize: '10px', color: '#8E8E93', marginBottom: '15px' }}>FLOW AUDIT</p>
                <div style={{display:'flex', justifyContent:'space-between', marginBottom:'10px'}}><span>Total Auto-Income:</span><span style={{color:'#34C759'}}>${monthlyIn.toFixed(2)}</span></div>
                <div style={{display:'flex', justifyContent:'space-between', marginBottom:'10px'}}><span>Total Auto-Burn:</span><span style={{color:'#FF3B30'}}>${monthlyOut.toFixed(2)}</span></div>
                <hr style={{border:'0', borderTop:'1px solid #333', margin:'15px 0'}} />
                <button onClick={() => { if(confirm("Wipe all data?")) { localStorage.clear(); window.location.reload(); } }} style={{ width: '100%', background: '#FF3B30', color: '#FFF', border: 'none', padding: '12px', borderRadius: '12px', fontWeight: '900', fontSize: '11px' }}>
                  FACTORY RESET SYSTEM
                </button>
              </div>
            )}
          </main>
        )}

        {isAiOpen && (
          <div style={{ position: 'fixed', bottom: 0, left: 0, width: '100%', height: '350px', background: '#000', borderTop: '2px solid #007AFF', padding: '30px', boxSizing: 'border-box', zIndex: 1000, boxShadow: '0 -20px 40px rgba(0,0,0,0.5)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
              <span style={{ fontWeight: '900', fontSize: '12px', color: '#007AFF' }}>COACH AI v6.6</span>
              <button onClick={() => setIsAiOpen(false)} style={{ background: 'none', border: 'none', color: '#FFF', fontSize: '24px' }}>×</button>
            </div>
            <div style={{ background: '#1C1C1E', padding: '20px', borderRadius: '15px', color: '#FFF', fontSize: '14px', lineHeight: '1.5', border: '1px solid #333' }}>
              {aiMsg}
            </div>
            <div style={{display:'flex', gap:'10px', marginTop:'20px'}}>
              <input value={userInput} onChange={e => setUserInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && setAiMsg(`Analyzing ${founderName}'s stack... Logic synced.`)} placeholder="Ask about your burn..." style={{flex: 1, background: '#333', border: 'none', padding: '15px', borderRadius: '12px', color: '#FFF', outline: 'none'}} />
            </div>
          </div>
        )}

        <nav style={s.nav}>
          {['home', 'lab', 'arena'].map(t => (
            <button key={t} onClick={() => setActiveTab(t)} style={{ background: 'none', border: 'none', color: '#FFF', fontWeight: '900', fontSize: '11px', opacity: activeTab === t ? 1 : 0.3 }}>
              {t.toUpperCase()}
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
}

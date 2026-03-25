import React, { useState, useEffect } from 'react';

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isStealth, setIsStealth] = useState(false);
  const [isAiOpen, setIsAiOpen] = useState(false);
  const [showAudit, setShowAudit] = useState(false);
  const [milestoneReached, setMilestoneReached] = useState(false);
  
  const founderName = "Dhruvi Desai";

  // --- DATA ENGINE ---
  const [stack, setStack] = useState(() => Number(localStorage.getItem('stack')) || 0);
  const [goal, setGoal] = useState(() => Number(localStorage.getItem('goal')) || 10000);
  const [history, setHistory] = useState(() => JSON.parse(localStorage.getItem('history')) || []);
  const [recurring, setRecurring] = useState(() => JSON.parse(localStorage.getItem('recurring')) || []);

  useEffect(() => {
    localStorage.setItem('stack', stack);
    localStorage.setItem('goal', goal);
    localStorage.setItem('history', JSON.stringify(history));
    localStorage.setItem('recurring', JSON.stringify(recurring));

    if (stack >= goal && stack > 0 && !milestoneReached) {
        setMilestoneReached(true);
    } else if (stack < goal) {
        setMilestoneReached(false);
    }
  }, [stack, goal, history, recurring, milestoneReached]);

  // --- RECURRING LOGIC ---
  const getMonthlyVal = (amt, term) => {
    const v = Number(amt);
    const rates = { daily: 30.42, weekly: 4.33, monthly: 1, yearly: 1/12 };
    return v * (rates[term] || 1);
  };

  const monthlyIn = recurring.filter(r => r.type === 'income').reduce((acc, r) => acc + getMonthlyVal(r.amount, r.term), 0);
  const monthlyOut = recurring.filter(r => r.type === 'burn').reduce((acc, r) => acc + getMonthlyVal(r.amount, r.term), 0);
  const netFlow = monthlyIn - monthlyOut;

  // --- STYLES SYSTEM ---
  const theme = isDarkMode ? 
    { bg: '#000', text: '#FFF', card: '#1C1C1E', accent: '#007AFF', border: '#2C2C2E' } : 
    { bg: '#F9F9F9', text: '#000', card: '#FFF', accent: '#007AFF', border: '#E5E5EA' };

  const s = {
    container: { 
      minHeight: '100vh', 
      background: theme.bg, 
      color: theme.text, 
      fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif', 
      padding: '20px', 
      transition: '0.3s',
      WebkitFontSmoothing: 'antialiased'
    },
    mono: { 
      fontFamily: 'SF Mono, Monaco, Consolas, "Liberation Mono", monospace',
      letterSpacing: '-1px'
    },
    label: { 
      fontSize: '10px', 
      color: '#8E8E93', 
      fontWeight: '700', 
      letterSpacing: '1.5px', 
      textTransform: 'uppercase',
      marginBottom: '10px'
    },
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' },
    nav: { position: 'fixed', bottom: '30px', left: '50%', transform: 'translateX(-50%)', width: '260px', background: 'rgba(28,28,30,0.95)', borderRadius: '40px', display: 'flex', justifyContent: 'space-around', padding: '16px', border: '1px solid #444', backdropFilter: 'blur(10px)', zIndex: 100 },
    card: { background: theme.card, padding: '24px', borderRadius: '28px', marginBottom: '16px', border: isDarkMode ? 'none' : `1px solid ${theme.border}` },
    input: { width: '100%', background: 'none', border: 'none', borderBottom: `1px solid ${theme.border}`, color: theme.text, padding: '12px 0', marginBottom: '10px', outline: 'none', fontSize: '16px', fontFamily: 'SF Mono, monospace' }
  };

  return (
    <div style={s.container}>
      <div style={{ maxWidth: '400px', margin: '0 auto', paddingBottom: '100px' }}>
        
        <header style={s.header}>
          <div>
            <b style={{ letterSpacing: '2px', fontSize: '11px', fontWeight: '900' }}>STACKED AI</b>
            <div style={{ fontSize: '8px', color: theme.accent, fontWeight: '900', marginTop: '2px', letterSpacing: '1px' }}>BY {founderName.toUpperCase()}</div>
          </div>
          <div style={{display: 'flex', gap: '8px'}}>
            <button onClick={() => setIsStealth(!isStealth)} style={{ background: isStealth ? '#FF3B30' : '#333', color: '#FFF', border: 'none', padding: '8px 12px', borderRadius: '10px', fontSize: '9px', fontWeight: '800' }}>{isStealth ? 'SHOW' : 'STEALTH'}</button>
            <button onClick={() => setIsDarkMode(!isDarkMode)} style={{ background: '#333', color: '#FFF', border: 'none', padding: '8px 12px', borderRadius: '10px', fontSize: '9px', fontWeight: '800' }}>{isDarkMode ? 'SNOW' : 'MID'}</button>
          </div>
        </header>

        {activeTab === 'home' && (
          <main>
            <div style={{ textAlign: 'center', marginBottom: '40px' }}>
              <p style={s.label}>LEVEL {Math.floor(stack/1000)} • TOTAL CAPITAL</p>
              <h1 style={{ ...s.mono, fontSize: '4.2rem', fontWeight: '700', margin: '10px 0', filter: isStealth ? 'blur(20px)' : 'none' }}>
                ${stack.toLocaleString()}
              </h1>
              <div style={{width: '100%', height: '3px', background: '#222', borderRadius: '2px', marginBottom: '25px', overflow: 'hidden'}}>
                <div style={{width: `${Math.min((stack/goal)*100, 100)}%`, height: '100%', background: theme.accent, transition: '0.8s cubic-bezier(0.2, 1, 0.3, 1)'}}></div>
              </div>
              <button onClick={() => setIsAiOpen(true)} style={{ width: '100%', padding: '18px', borderRadius: '22px', background: theme.accent, color: '#FFF', border: 'none', fontWeight: '800', fontSize: '13px', letterSpacing: '0.5px' }}>✨ CONSULT COACH</button>
            </div>
            
            <div style={s.card}>
               <p style={s.label}>RECENT LOGS</p>
               {history.slice(0, 3).map(h => (
                 <div key={h.id} style={{display: 'flex', justifyContent: 'space-between', padding: '14px 0', borderBottom: `1px solid ${theme.border}`}}>
                   <span style={{fontSize: '14px', fontWeight: '500'}}>{h.label}</span>
                   <span style={{ ...s.mono, color: h.amount > 0 ? '#34C759' : '#FF3B30', fontWeight: '600' }}>${Math.abs(h.amount).toLocaleString()}</span>
                 </div>
               ))}
            </div>
          </main>
        )}

        {activeTab === 'lab' && (
          <main>
            <div style={s.card}>
               <p style={s.label}>TRANSACTION ENTRY</p>
               <input id="l-label" placeholder="Source" style={s.input} />
               <input id="l-amt" type="number" placeholder="0.00" style={s.input} />
               <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'12px', marginTop:'10px'}}>
                  <button onClick={() => {
                    const l = document.getElementById('l-label').value; const a = document.getElementById('l-amt').value;
                    if(l && a) { setHistory([{label: l, amount: Number(a), id: Date.now()}, ...history]); setStack(s => s + Number(a)); }
                  }} style={{padding:'16px', borderRadius:'18px', border:'none', background: isDarkMode ? '#FFF' : '#000', color: isDarkMode ? '#000' : '#FFF', fontWeight:'800', fontSize:'12px'}}>INCOME</button>
                  <button onClick={() => {
                    const l = document.getElementById('l-label').value; const a = document.getElementById('l-amt').value;
                    if(l && a) { setHistory([{label: l, amount: -Number(a), id: Date.now()}, ...history]); setStack(s => s - Number(a)); }
                  }} style={{padding:'16px', borderRadius:'18px', border:'none', background:'#333', color:'#FFF', fontWeight:'800', fontSize:'12px'}}>SPEND</button>
               </div>
            </div>

            <div style={s.card}>
              <p style={s.label}>RECURRING ENGINE</p>
              <button onClick={() => {
                const l = prompt("Label?"); const a = prompt("Amount?"); const t = prompt("Frequency (daily, weekly, monthly, yearly)?");
                const type = confirm("Income?") ? 'income' : 'burn';
                if(l && a && t) setRecurring([{label: l, amount: Number(a), term: t, type, id: Date.now()}, ...recurring]);
              }} style={{width:'100%', padding:'14px', background:'none', border:`1px dashed ${theme.border}`, color:'#8E8E93', borderRadius:'18px', fontSize:'11px', fontWeight:'700'}}>+ ATTACH AUTO-FLOW</button>
              {recurring.map(r => (
                <div key={r.id} style={{display:'flex', justifyContent:'space-between', padding:'12px 0', fontSize:'13px', borderBottom:`1px solid ${theme.border}`, opacity:0.9}}>
                  <span>{r.label} <span style={{fontSize:'10px', opacity:0.5}}>{r.term.toUpperCase()}</span></span>
                  <span style={{...s.mono, color: r.type === 'income' ? '#34C759' : '#FF3B30'}}>${r.amount}</span>
                </div>
              ))}
            </div>
          </main>
        )}

        {activeTab === 'arena' && (
          <main>
            <div style={s.card}>
              <p style={s.label}>CALIBRATION</p>
              <div style={{display:'flex', justifyContent:'space-between', marginBottom:'15px', alignItems:'center'}}>
                <span style={{fontSize:'14px'}}>Target Goal</span>
                <input type="number" onBlur={(e) => setGoal(Number(e.target.value))} style={{...s.mono, background:'none', border:'none', color:theme.accent, textAlign:'right', fontWeight:'700', fontSize:'18px'}} placeholder={goal} />
              </div>
              <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                <span style={{fontSize:'14px'}}>Balance Adj.</span>
                <input type="number" onBlur={(e) => setStack(Number(e.target.value))} style={{...s.mono, background:'none', border:'none', color:theme.accent, textAlign:'right', fontWeight:'700', fontSize:'18px'}} placeholder={stack} />
              </div>
            </div>

            <div style={{textAlign:'center', background:'#000', padding:'35px 20px', border:`1px solid ${theme.border}`, borderRadius:'32px', marginBottom:'16px'}}>
               <p style={s.label}>MONTHLY NET VELOCITY</p>
               <h2 style={{...s.mono, color: netFlow >= 0 ? '#34C759' : '#FF3B30', fontSize:'40px', margin:'12px 0'}}>${netFlow.toLocaleString()}</h2>
               <button onClick={() => setShowAudit(!showAudit)} style={{background:'#FFF', color:'#000', border:'none', padding:'10px 22px', borderRadius:'12px', fontWeight:'800', fontSize:'10px', letterSpacing:'1px'}}>GENERATE AUDIT</button>
            </div>

            {showAudit && (
              <div style={{background: theme.card, padding: '24px', borderRadius: '28px', border: `1px solid ${theme.accent}`, animation: 'fadeIn 0.3s ease'}}>
                <p style={s.label}>FLOW AUDIT</p>
                <div style={{display:'flex', justifyContent:'space-between', marginBottom:'10px', fontSize:'13px'}}><span>Gross Income:</span><span style={{...s.mono, color:'#34C759'}}>${monthlyIn.toFixed(2)}</span></div>
                <div style={{display:'flex', justifyContent:'space-between', marginBottom:'25px', fontSize:'13px'}}><span>Gross Burn:</span><span style={{...s.mono, color:'#FF3B30'}}>${monthlyOut.toFixed(2)}</span></div>
                <button onClick={() => {if(confirm("Confirm Factory Reset?")) {localStorage.clear(); window.location.reload();}}} style={{width:'100%', background:'#FF3B30', color:'#FFF', border:'none', padding:'14px', borderRadius:'16px', fontWeight:'800', fontSize:'11px'}}>RESET ALL SYSTEM DATA</button>
              </div>
            )}
          </main>
        )}

        {/* Milestone Pop-up */}
        {milestoneReached && (
          <div style={{position:'fixed', top:0, left:0, width:'100%', height:'100%', background:'rgba(0,0,0,0.98)', zIndex:5000, display:'flex', alignItems:'center', justifyContent:'center', padding:'40px', textAlign:'center', backdropFilter:'blur(10px)'}}>
            <div>
              <p style={{color:theme.accent, fontWeight:'800', letterSpacing:'4px', fontSize:'11px', marginBottom:'10px'}}>LIQUIDITY MILESTONE</p>
              <h1 style={{...s.mono, fontSize:'4.2rem', margin:'0', fontWeight:'700'}}>${goal.toLocaleString()}</h1>
              <p style={{color:'#8E8E93', fontSize:'14px', margin:'25px 0 45px 0', lineHeight:'1.6', fontWeight:'500'}}>Capital target achieved. System recalibrating for higher velocity.</p>
              <button onClick={() => setMilestoneReached(false)} style={{background:'#FFF', color:'#000', border:'none', padding:'20px 60px', borderRadius:'40px', fontWeight:'900', fontSize:'13px'}}>CONTINUE</button>
            </div>
          </div>
        )}

        {isAiOpen && (
          <div style={{ position: 'fixed', bottom: 0, left: 0, width: '100%', height: '360px', background: '#000', borderTop: `2px solid ${theme.accent}`, padding: '35px', boxSizing: 'border-box', zIndex: 1000, boxShadow: '0 -20px 50px rgba(0,0,0,0.8)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '25px', alignItems:'center' }}>
              <span style={{ fontWeight: '800', fontSize: '11px', letterSpacing: '1px', color: theme.accent }}>COACH ENGINE v6.8</span>
              <button onClick={() => setIsAiOpen(false)} style={{ background: 'none', border: 'none', color: '#FFF', fontSize: '28px', lineHeight: '1' }}>×</button>
            </div>
            <div style={{ background: theme.card, padding: '22px', borderRadius: '22px', color: '#FFF', fontSize: '14px', border: `1px solid ${theme.border}`, lineHeight: '1.6', fontWeight: '500' }}>
              Ledger verified for {founderName}. Current Monthly Velocity: <span style={s.mono}>${netFlow.toFixed(2)}</span>. Systems optimal.
            </div>
          </div>
        )}

        <nav style={s.nav}>
          {['home', 'lab', 'arena'].map(t => (
            <button key={t} onClick={() => setActiveTab(t)} style={{ background: 'none', border: 'none', color: '#FFF', fontWeight: '800', fontSize: '10px', letterSpacing: '1px', opacity: activeTab === t ? 1 : 0.25, transition: '0.2s' }}>{t.toUpperCase()}</button>
          ))}
        </nav>
      </div>
    </div>
  );
}

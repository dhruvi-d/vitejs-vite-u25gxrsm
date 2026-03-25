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
  const [goal, setGoal] = useState(() => Number(localStorage.getItem('goal')) || 100000);
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
  const daysToGoal = netFlow > 0 && goal > stack ? Math.ceil(((goal - stack) / (netFlow / 30.42))) : null;

  const handleLog = (type) => {
    const labelEl = document.getElementById('l-label');
    const amtEl = document.getElementById('l-amt');
    if (labelEl.value && amtEl.value) {
      const finalAmt = type === 'income' ? Number(amtEl.value) : -Number(amtEl.value);
      setHistory([{ label: labelEl.value, amount: finalAmt, id: Date.now() }, ...history]);
      setStack(s => s + finalAmt);
      labelEl.value = ''; amtEl.value = '';
      labelEl.blur(); amtEl.blur();
    }
  };

  const addRecurringFlow = () => {
    const l = prompt("Label?");
    const a = prompt("Amount?");
    const t = prompt("Frequency (daily, weekly, monthly, yearly)?");
    const typeChoice = prompt("Type: '1' for Income, '2' for Burn");
    if (l && a && t && (typeChoice === '1' || typeChoice === '2')) {
      setRecurring([{ label: l, amount: Number(a), term: t.toLowerCase(), type: typeChoice === '1' ? 'income' : 'burn', id: Date.now() }, ...recurring]);
    }
  };

  // --- DESIGN SYSTEM ---
  const theme = isDarkMode ? 
    { bg: '#000', text: '#FFF', card: '#111', accent: '#007AFF', border: '#222' } : 
    { bg: '#F2F2F7', text: '#000', card: '#FFF', accent: '#007AFF', border: '#E5E5EA' };

  const s = {
    container: { minHeight: '100vh', background: theme.bg, color: theme.text, fontFamily: 'Inter, -apple-system, sans-serif', padding: '24px', transition: '0.4s', WebkitFontSmoothing: 'antialiased' },
    // UNIFIED NUMBER STYLE
    numbers: { fontVariantNumeric: 'tabular-nums', letterSpacing: '-1px', fontWeight: '800', fontFamily: 'Inter, sans-serif' },
    label: { fontSize: '11px', color: '#8E8E93', fontWeight: '600', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '8px' },
    card: { background: theme.card, padding: '24px', borderRadius: '32px', marginBottom: '16px', border: `1px solid ${theme.border}` },
    inputBase: { background: 'none', border: 'none', color: theme.text, outline: 'none', fontFamily: 'Inter, sans-serif' }
  };

  return (
    <div style={s.container}>
      <div style={{ maxWidth: '400px', margin: '0 auto', paddingBottom: '120px' }}>
        
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '50px' }}>
          <div>
            <b style={{ letterSpacing: '3px', fontSize: '10px' }}>STACKED AI</b>
            <div style={{ fontSize: '9px', color: theme.accent, fontWeight: '700', marginTop: '4px' }}>BY {founderName.toUpperCase()}</div>
          </div>
          <div style={{display: 'flex', gap: '10px'}}>
            <button onClick={() => setIsDarkMode(!isDarkMode)} style={{ background: theme.card, color: theme.text, border: `1px solid ${theme.border}`, padding: '8px 12px', borderRadius: '12px', fontSize: '10px', fontWeight: '700' }}>{isDarkMode ? 'SNOW' : 'MID'}</button>
            <button onClick={() => setIsStealth(!isStealth)} style={{ background: isStealth ? '#FF3B30' : theme.card, color: isStealth ? '#FFF' : theme.text, border: isStealth ? 'none' : `1px solid ${theme.border}`, padding: '8px 12px', borderRadius: '12px', fontSize: '10px', fontWeight: '700' }}>{isStealth ? 'HIDDEN' : 'STEALTH'}</button>
          </div>
        </header>

        {activeTab === 'home' && (
          <main>
            <div style={{ textAlign: 'center', marginBottom: '50px' }}>
              <p style={s.label}>LIQUIDITY POSITION</p>
              <h1 style={{ ...s.numbers, fontSize: '4.8rem', margin: '15px 0', filter: isStealth ? 'blur(25px)' : 'none', letterSpacing: '-4px' }}>
                ${stack.toLocaleString()}
              </h1>
              <div style={{width: '60px', height: '3px', background: theme.accent, margin: '0 auto 30px auto', borderRadius: '10px'}}></div>
              <button onClick={() => setIsAiOpen(true)} style={{ width: '100%', padding: '20px', borderRadius: '24px', background: theme.accent, color: '#FFF', border: 'none', fontWeight: '800', fontSize: '14px' }}>✨ CONSULT COACH</button>
            </div>
            <div style={s.card}>
               <p style={s.label}>LEDGER</p>
               {history.slice(0, 3).map(h => (
                 <div key={h.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '16px 0', borderBottom: `1px solid ${theme.border}` }}>
                   <span style={{fontSize: '15px', fontWeight: '500'}}>{h.label}</span>
                   <span style={{ ...s.numbers, fontSize: '16px', color: h.amount > 0 ? '#34C759' : '#FF3B30' }}>{h.amount > 0 ? '+' : '-'}${Math.abs(h.amount).toLocaleString()}</span>
                 </div>
               ))}
            </div>
          </main>
        )}

        {activeTab === 'lab' && (
          <main>
            <div style={s.card}>
               <p style={s.label}>INPUT LOG</p>
               <input id="l-label" placeholder="Source" style={{...s.inputBase, width:'100%', borderBottom:`1px solid ${theme.border}`, padding:'15px 0', marginBottom:'10px', fontSize:'18px'}} />
               <input id="l-amt" type="number" placeholder="0.00" style={{...s.inputBase, ...s.numbers, width:'100%', borderBottom:`1px solid ${theme.border}`, padding:'15px 0', marginBottom:'25px', fontSize:'24px'}} />
               <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'12px'}}>
                  <button onClick={() => handleLog('income')} style={{padding:'18px', borderRadius:'20px', border:'none', background: isDarkMode ? '#FFF' : '#000', color: isDarkMode ? '#000' : '#FFF', fontWeight:'900'}}>INCOME</button>
                  <button onClick={() => handleLog('spend')} style={{padding:'18px', borderRadius:'20px', border:'none', background:'#333', color:'#FFF', fontWeight:'900'}}>SPEND</button>
               </div>
            </div>
            <div style={s.card}>
              <p style={s.label}>AUTO-FLOWS</p>
              <button onClick={addRecurringFlow} style={{width:'100%', padding:'15px', background:'none', border:`1px dashed ${theme.border}`, color:'#8E8E93', borderRadius:'20px', fontSize:'12px', fontWeight:'700'}}>+ ATTACH FLOW</button>
              {recurring.map(r => (
                <div key={r.id} style={{display:'flex', justifyContent:'space-between', padding:'15px 0', borderBottom:`1px solid ${theme.border}`, fontSize:'14px'}}>
                  <span>{r.label} <span style={{fontSize:'10px', opacity:0.5}}>{r.term}</span></span>
                  <span style={{...s.numbers, color: r.type === 'income' ? '#34C759' : '#FF3B30'}}>${r.amount.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </main>
        )}

        {activeTab === 'arena' && (
          <main>
            <div style={s.card}>
              <p style={s.label}>PARAMETERS</p>
              <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'15px'}}>
                <span>Balance Adj.</span>
                <input type="number" onChange={(e) => setStack(Number(e.target.value))} style={{...s.inputBase, ...s.numbers, color:theme.accent, textAlign:'right', fontSize:'20px', width:'60%'}} value={stack} />
              </div>
              <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                <span>Target Goal</span>
                <input type="number" onChange={(e) => setGoal(Number(e.target.value))} style={{...s.inputBase, ...s.numbers, color:theme.accent, textAlign:'right', fontSize:'20px', width:'60%'}} value={goal} />
              </div>
              {daysToGoal && (
                <div style={{display:'flex', justifyContent:'space-between', marginTop:'20px', color:theme.accent, fontSize:'11px', fontWeight:'900', letterSpacing:'1px'}}>
                   <span>PROJECTED ETA</span>
                   <span style={s.numbers}>{daysToGoal} DAYS</span>
                </div>
              )}
            </div>
            <div style={{...s.card, textAlign:'center', background:'#000', border:`1px solid ${theme.accent}55`}}>
               <p style={s.label}>MONTHLY VELOCITY</p>
               <h2 style={{...s.numbers, color: netFlow >= 0 ? '#34C759' : '#FF3B30', fontSize:'42px', margin:'15px 0'}}>${netFlow.toLocaleString()}</h2>
               <button onClick={() => setShowAudit(!showAudit)} style={{background:'#FFF', color:'#000', border:'none', padding:'10px 25px', borderRadius:'14px', fontWeight:'900', fontSize:'11px'}}>GENERATE AUDIT</button>
            </div>
          </main>
        )}

        {/* Milestone, Coach, and Nav remain unified... */}
        {milestoneReached && (
          <div style={{position:'fixed', top:0, left:0, width:'100%', height:'100%', background:'rgba(0,0,0,0.98)', zIndex:5000, display:'flex', alignItems:'center', justifyContent:'center', padding:'40px', textAlign:'center'}}>
            <div>
              <p style={{color:theme.accent, fontWeight:'900', letterSpacing:'5px', fontSize:'12px'}}>TARGET ACHIEVED</p>
              <h1 style={{...s.numbers, fontSize:'5rem', margin:'10px 0'}}>${goal.toLocaleString()}</h1>
              <p style={{color:'#8E8E93', fontSize:'15px', margin:'20px 0 40px 0'}}>Liquidity milestone reached.</p>
              <button onClick={() => setMilestoneReached(false)} style={{background:'#FFF', color:'#000', border:'none', padding:'20px 60px', borderRadius:'40px', fontWeight:'900', fontSize:'14px'}}>PROCEED</button>
            </div>
          </div>
        )}

        {isAiOpen && (
          <div style={{ position: 'fixed', bottom: 0, left: 0, width: '100%', height: '380px', background: '#000', borderTop: `1px solid ${theme.accent}`, padding: '40px', boxSizing: 'border-box', zIndex: 1000, borderRadius: '40px 40px 0 0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '30px' }}>
              <span style={{ fontWeight: '900', fontSize: '11px', letterSpacing: '2px', color: theme.accent }}>COACH v7.3</span>
              <button onClick={() => setIsAiOpen(false)} style={{ background: 'none', border: 'none', color: '#FFF', fontSize: '28px' }}>×</button>
            </div>
            <div style={{ background: '#111', padding: '25px', borderRadius: '24px', color: '#FFF', fontSize: '15px', border: '1px solid #222', lineHeight: '1.6' }}>
              Status: <b>Unified.</b><br/><br/>
              {founderName}, the architecture is synchronized. Your trajectory is locked at <span style={s.numbers}>${netFlow.toLocaleString()}</span>/mo.
            </div>
          </div>
        )}

        <nav style={{ position: 'fixed', bottom: '35px', left: '50%', transform: 'translateX(-50%)', width: '280px', background: 'rgba(28,28,30,0.8)', borderRadius: '40px', display: 'flex', justifyContent: 'space-around', padding: '18px', border: '1px solid #444', backdropFilter: 'blur(20px)', zIndex: 100 }}>
          {['home', 'lab', 'arena'].map(t => (
            <button key={t} onClick={() => setActiveTab(t)} style={{ background: 'none', border: 'none', color: '#FFF', fontWeight: '800', fontSize: '11px', letterSpacing: '1px', opacity: activeTab === t ? 1 : 0.25, transition: '0.3s' }}>{t.toUpperCase()}</button>
          ))}
        </nav>
      </div>
    </div>
  );
}

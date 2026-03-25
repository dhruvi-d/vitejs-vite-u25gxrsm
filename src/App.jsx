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

  // --- RECURRING LOGIC (THE ENGINE) ---
  const getMonthlyVal = (amt, term) => {
    const v = Number(amt);
    const rates = { daily: 30.42, weekly: 4.33, monthly: 1, yearly: 1/12 };
    return v * (rates[term] || 1);
  };

  const monthlyIn = recurring.filter(r => r.type === 'income').reduce((acc, r) => acc + getMonthlyVal(r.amount, r.term), 0);
  const monthlyOut = recurring.filter(r => r.type === 'burn').reduce((acc, r) => acc + getMonthlyVal(r.amount, r.term), 0);
  const netFlow = monthlyIn - monthlyOut;

  const theme = isDarkMode ? 
    { bg: '#000', text: '#FFF', card: '#1C1C1E', accent: '#007AFF', border: '#333' } : 
    { bg: '#FFF', text: '#000', card: '#F2F2F7', accent: '#007AFF', border: '#E5E5EA' };

  return (
    <div style={{ minHeight: '100vh', background: theme.bg, color: theme.text, fontFamily: '-apple-system, sans-serif', padding: '20px', transition: '0.3s' }}>
      <div style={{ maxWidth: '400px', margin: '0 auto', paddingBottom: '100px' }}>
        
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
          <div>
            <b style={{ letterSpacing: '2px', fontSize: '12px' }}>STACKED AI</b>
            <div style={{ fontSize: '8px', color: theme.accent, fontWeight: '900', marginTop: '2px' }}>BY {founderName.toUpperCase()}</div>
          </div>
          <div style={{display: 'flex', gap: '8px'}}>
            <button onClick={() => setIsStealth(!isStealth)} style={{ background: isStealth ? '#FF3B30' : '#333', color: '#FFF', border: 'none', padding: '8px 12px', borderRadius: '10px', fontSize: '9px', fontWeight: '800' }}>{isStealth ? 'SHOW' : 'STEALTH'}</button>
            <button onClick={() => setIsDarkMode(!isDarkMode)} style={{ background: '#333', color: '#FFF', border: 'none', padding: '8px 12px', borderRadius: '10px', fontSize: '9px', fontWeight: '800' }}>{isDarkMode ? 'SNOW' : 'MIDNIGHT'}</button>
          </div>
        </header>

        {activeTab === 'home' && (
          <main>
            <div style={{ textAlign: 'center', marginBottom: '40px' }}>
              <p style={{ fontSize: '10px', color: '#8E8E93', fontWeight: '800' }}>LEVEL {Math.floor(stack/1000)} • TOTAL CAPITAL</p>
              <h1 style={{ fontSize: '4.5rem', fontWeight: '900', margin: '15px 0', letterSpacing: '-3px', filter: isStealth ? 'blur(15px)' : 'none' }}>
                ${stack.toLocaleString()}
              </h1>
              <div style={{width: '100%', height: '4px', background: '#333', borderRadius: '2px', marginBottom: '20px', overflow: 'hidden'}}>
                <div style={{width: `${Math.min((stack/goal)*100, 100)}%`, height: '100%', background: theme.accent, transition: '0.5s'}}></div>
              </div>
              <button onClick={() => setIsAiOpen(true)} style={{ width: '100%', padding: '18px', borderRadius: '20px', background: theme.accent, color: '#FFF', border: 'none', fontWeight: '900' }}>✨ CONSULT COACH</button>
            </div>
            
            <div style={{background: theme.card, padding: '20px', borderRadius: '24px'}}>
               <p style={{fontSize: '10px', color: '#8E8E93', fontWeight: '800', marginBottom: '15px'}}>RECENT LOGS</p>
               {history.slice(0, 3).map(h => (
                 <div key={h.id} style={{display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: `1px solid ${theme.border}`}}>
                   <span>{h.label}</span>
                   <span style={{color: h.amount > 0 ? '#34C759' : '#FF3B30', fontWeight: '700'}}>${Math.abs(h.amount)}</span>
                 </div>
               ))}
            </div>
          </main>
        )}

        {activeTab === 'lab' && (
          <main>
            <div style={{background: theme.card, padding: '20px', borderRadius: '24px', marginBottom: '15px'}}>
               <p style={{ fontSize: '10px', color: '#8E8E93', marginBottom: '15px' }}>TRANSACTION ENTRY</p>
               <input id="l-label" placeholder="Source" style={{width:'100%', background:'none', border:'none', borderBottom:`1px solid ${theme.border}`, color:theme.text, padding:'10px 0', marginBottom:'10px', outline:'none'}} />
               <input id="l-amt" type="number" placeholder="0.00" style={{width:'100%', background:'none', border:'none', borderBottom:`1px solid ${theme.border}`, color:theme.text, padding:'10px 0', marginBottom:'20px', outline:'none'}} />
               <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'10px'}}>
                  <button onClick={() => {
                    const l = document.getElementById('l-label').value; const a = document.getElementById('l-amt').value;
                    if(l && a) { setHistory([{label: l, amount: Number(a), id: Date.now()}, ...history]); setStack(s => s + Number(a)); }
                  }} style={{padding:'15px', borderRadius:'15px', border:'none', background: isDarkMode ? '#FFF' : '#000', color: isDarkMode ? '#000' : '#FFF', fontWeight:'900'}}>INCOME</button>
                  <button onClick={() => {
                    const l = document.getElementById('l-label').value; const a = document.getElementById('l-amt').value;
                    if(l && a) { setHistory([{label: l, amount: -Number(a), id: Date.now()}, ...history]); setStack(s => s - Number(a)); }
                  }} style={{padding:'15px', borderRadius:'15px', border:'none', background:'#333', color:'#FFF', fontWeight:'900'}}>SPEND</button>
               </div>
            </div>

            <div style={{background: theme.card, padding: '20px', borderRadius: '24px'}}>
              <p style={{ fontSize: '10px', color: '#8E8E93', marginBottom: '15px' }}>RECURRING FLOWS</p>
              <button onClick={() => {
                const l = prompt("Label (e.g. Salary, Rent)?");
                const a = prompt("Amount?");
                const t = prompt("Frequency (daily, weekly, monthly, yearly)?");
                const type = confirm("Is this Income? (Cancel for Expense/Burn)") ? 'income' : 'burn';
                if(l && a && t) setRecurring([{label: l, amount: Number(a), term: t, type, id: Date.now()}, ...recurring]);
              }} style={{width:'100%', padding:'12px', background:'none', border:`1px dashed ${theme.border}`, color:'#8E8E93', borderRadius:'15px', fontSize:'12px'}}>+ ATTACH AUTO-FLOW</button>
              {recurring.map(r => (
                <div key={r.id} style={{display:'flex', justifyContent:'space-between', padding:'10px 0', fontSize:'13px', borderBottom:`1px solid ${theme.border}`, opacity:0.8}}>
                  <span>{r.label} ({r.term})</span>
                  <span style={{color: r.type === 'income' ? '#34C759' : '#FF3B30'}}>${r.amount}</span>
                </div>
              ))}
            </div>
          </main>
        )}

        {activeTab === 'arena' && (
          <main>
            <div style={{background: theme.card, padding: '20px', borderRadius: '24px', marginBottom: '15px'}}>
              <p style={{ fontSize: '10px', color: '#8E8E93', marginBottom: '15px' }}>CALIBRATION</p>
              <div style={{display:'flex', justifyContent:'space-between', marginBottom:'15px'}}>
                <span>Target Goal</span>
                <input type="number" onBlur={(e) => setGoal(Number(e.target.value))} style={{background:'none', border:'none', color:theme.accent, textAlign:'right', fontWeight:'900'}} placeholder={goal} />
              </div>
              <div style={{display:'flex', justifyContent:'space-between'}}>
                <span>Adjust Balance</span>
                <input type="number" onBlur={(e) => setStack(Number(e.target.value))} style={{background:'none', border:'none', color:theme.accent, textAlign:'right', fontWeight:'900'}} placeholder={stack} />
              </div>
            </div>

            <div style={{textAlign:'center', background:'#000', padding:'30px', border:`1px solid ${theme.border}`, borderRadius:'24px', marginBottom:'15px'}}>
               <p style={{fontSize:'10px', color:'#8E8E93'}}>MONTHLY NET VELOCITY</p>
               <h2 style={{color: netFlow >= 0 ? '#34C759' : '#FF3B30', fontSize:'42px', margin:'10px 0'}}>${netFlow.toLocaleString()}</h2>
               <button onClick={() => setShowAudit(!showAudit)} style={{background:'#FFF', color:'#000', border:'none', padding:'10px 20px', borderRadius:'12px', fontWeight:'900', fontSize:'11px'}}>GENERATE AUDIT</button>
            </div>

            {showAudit && (
              <div style={{background: theme.card, padding: '20px', borderRadius: '24px', border: `1px solid ${theme.accent}`}}>
                <p style={{fontSize:'10px', fontWeight:'800', marginBottom:'15px'}}>FLOW BREAKDOWN</p>
                <div style={{display:'flex', justifyContent:'space-between', marginBottom:'8px'}}><span>Monthly Auto-Income:</span><span style={{color:'#34C759'}}>${monthlyIn.toFixed(2)}</span></div>
                <div style={{display:'flex', justifyContent:'space-between', marginBottom:'20px'}}><span>Monthly Auto-Burn:</span><span style={{color:'#FF3B30'}}>${monthlyOut.toFixed(2)}</span></div>
                <button onClick={() => {if(confirm("Wipe all system data?")) {localStorage.clear(); window.location.reload();}}} style={{width:'100%', background:'#FF3B30', color:'#FFF', border:'none', padding:'12px', borderRadius:'12px', fontWeight:'900', fontSize:'11px'}}>FACTORY RESET</button>
              </div>
            )}
          </main>
        )}

        {/* Milestone Alert */}
        {milestoneReached && (
          <div style={{position:'fixed', top:0, left:0, width:'100%', height:'100%', background:'rgba(0,0,0,0.98)', zIndex:5000, display:'flex', alignItems:'center', justifyContent:'center', padding:'40px', boxSizing:'border-box', textAlign:'center'}}>
            <div>
              <p style={{color:theme.accent, fontWeight:'900', letterSpacing:'4px', fontSize:'12px', marginBottom:'10px'}}>LIQUIDITY MILESTONE</p>
              <h1 style={{fontSize:'4rem', margin:'0', fontWeight:'900'}}>${goal.toLocaleString()}</h1>
              <p style={{color:'#8E8E93', fontSize:'14px', margin:'20px 0 40px 0', lineHeight:'1.6'}}>Target liquidity achieved. Logic engine has been recalibrated for the next tier.</p>
              <button onClick={() => setMilestoneReached(false)} style={{background:'#FFF', color:'#000', border:'none', padding:'18px 50px', borderRadius:'40px', fontWeight:'900', letterSpacing:'1px'}}>ACKNOWLEDGE</button>
            </div>
          </div>
        )}

        {isAiOpen && (
          <div style={{ position: 'fixed', bottom: 0, left: 0, width: '100%', height: '350px', background: '#000', borderTop: `2px solid ${theme.accent}`, padding: '30px', boxSizing: 'border-box', zIndex: 1000 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
              <span style={{ fontWeight: '900', fontSize: '12px' }}>COACH ENGINE</span>
              <button onClick={() => setIsAiOpen(false)} style={{ background: 'none', border: 'none', color: '#FFF', fontSize: '24px' }}>×</button>
            </div>
            <div style={{ background: theme.card, padding: '20px', borderRadius: '15px', color: '#FFF', fontSize: '14px', border: `1px solid ${theme.border}` }}>
              System online. Analysis for {founderName} complete. Monthly Velocity is currently ${netFlow.toFixed(2)}.
            </div>
          </div>
        )}

        <nav style={{ position: 'fixed', bottom: '30px', left: '50%', transform: 'translateX(-50%)', width: '260px', background: 'rgba(28,28,30,0.95)', borderRadius: '40px', display: 'flex', justifyContent: 'space-around', padding: '16px', border: '1px solid #444', backdropFilter: 'blur(10px)' }}>
          {['home', 'lab', 'arena'].map(t => (
            <button key={t} onClick={() => setActiveTab(t)} style={{ background: 'none', border: 'none', color: '#FFF', fontWeight: '900', fontSize: '11px', opacity: activeTab === t ? 1 : 0.3 }}>{t.toUpperCase()}</button>
          ))}
        </nav>
      </div>
    </div>
  );
}

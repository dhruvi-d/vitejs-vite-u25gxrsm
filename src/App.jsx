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

    // Milestone Logic: Trigger if stack crosses goal
    if (stack >= goal && stack > 0 && !milestoneReached) {
        setMilestoneReached(true);
    } else if (stack < goal) {
        setMilestoneReached(false);
    }
  }, [stack, goal, history, recurring, milestoneReached]);

  // --- RECURRING CALCS ---
  const getMonthlyVal = (amt, term) => {
    const v = Number(amt);
    const rates = { daily: 30.42, weekly: 4.33, monthly: 1, yearly: 1/12 };
    return v * (rates[term] || 1);
  };
  const monthlyIn = recurring.filter(r => r.type === 'income').reduce((acc, r) => acc + getMonthlyVal(r.amount, r.term), 0);
  const monthlyOut = recurring.filter(r => r.type === 'burn').reduce((acc, r) => acc + getMonthlyVal(r.amount, r.term), 0);
  const netFlow = monthlyIn - monthlyOut;

  const currentTheme = isDarkMode ? { bg: '#000', text: '#FFF', card: '#1C1C1E', accent: '#007AFF' } : { bg: '#FFF', text: '#000', card: '#F2F2F7', accent: '#007AFF' };

  return (
    <div style={{ minHeight: '100vh', background: currentTheme.bg, color: currentTheme.text, fontFamily: '-apple-system, sans-serif', padding: '20px', transition: '0.3s' }}>
      <div style={{ maxWidth: '400px', margin: '0 auto', paddingBottom: '100px' }}>
        
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
          <div>
            <b style={{ letterSpacing: '2px', fontSize: '12px' }}>STACKED AI</b>
            <div style={{ fontSize: '8px', color: currentTheme.accent, fontWeight: '900', marginTop: '2px' }}>BY {founderName.toUpperCase()}</div>
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
              <h1 style={{ fontSize: '4.5rem', fontWeight: '900', margin: '10px 0', letterSpacing: '-3px', filter: isStealth ? 'blur(15px)' : 'none' }}>
                ${stack.toLocaleString()}
              </h1>
              <div style={{width: '100%', height: '4px', background: '#333', borderRadius: '2px', marginBottom: '20px', overflow: 'hidden'}}>
                <div style={{width: `${Math.min((stack/goal)*100, 100)}%`, height: '100%', background: currentTheme.accent, transition: '0.5s'}}></div>
              </div>
              <button onClick={() => setIsAiOpen(true)} style={{ width: '100%', padding: '18px', borderRadius: '20px', background: currentTheme.accent, color: '#FFF', border: 'none', fontWeight: '900' }}>✨ CONSULT COACH</button>
            </div>
          </main>
        )}

        {activeTab === 'lab' && (
          <main>
            <div style={{background: currentTheme.card, padding: '20px', borderRadius: '24px', marginBottom: '15px'}}>
               <p style={{ fontSize: '10px', color: '#8E8E93', marginBottom: '15px' }}>LOG FLOW</p>
               <input id="l-label" placeholder="Source" style={{width:'100%', background:'none', border:'none', borderBottom:'1px solid #333', color:currentTheme.text, padding:'10px 0', marginBottom:'10px', outline:'none'}} />
               <input id="l-amt" type="number" placeholder="0.00" style={{width:'100%', background:'none', border:'none', borderBottom:'1px solid #333', color:currentTheme.text, padding:'10px 0', marginBottom:'20px', outline:'none'}} />
               <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'10px'}}>
                  <button onClick={() => {
                    const l = document.getElementById('l-label').value; const a = document.getElementById('l-amt').value;
                    if(l && a) { setHistory([{label: l, amount: Number(a), id: Date.now()}, ...history]); setStack(s => s + Number(a)); }
                  }} style={{padding:'15px', borderRadius:'15px', border:'none', background:'#FFF', color:'#000', fontWeight:'900'}}>INCOME</button>
                  <button onClick={() => {
                    const l = document.getElementById('l-label').value; const a = document.getElementById('l-amt').value;
                    if(l && a) { setHistory([{label: l, amount: -Number(a), id: Date.now()}, ...history]); setStack(s => s - Number(a)); }
                  }} style={{padding:'15px', borderRadius:'15px', border:'none', background:'#333', color:'#FFF', fontWeight:'900'}}>SPEND</button>
               </div>
            </div>
          </main>
        )}

        {activeTab === 'arena' && (
          <main>
            <div style={{background: currentTheme.card, padding: '20px', borderRadius: '24px', marginBottom: '15px'}}>
              <p style={{ fontSize: '10px', color: '#8E8E93', marginBottom: '15px' }}>SYSTEM SETTINGS</p>
              <div style={{display:'flex', justifyContent:'space-between', marginBottom:'15px'}}>
                <span>Current Goal</span>
                <input type="number" onBlur={(e) => setGoal(Number(e.target.value))} style={{background:'none', border:'none', color:currentTheme.accent, textAlign:'right', fontWeight:'900'}} placeholder={goal} />
              </div>
            </div>
            <div style={{textAlign:'center', background:'#000', padding:'20px', border:'1px solid #333', borderRadius:'24px'}}>
               <p style={{fontSize:'10px', color:'#8E8E93'}}>MONTHLY NET</p>
               <h2 style={{color: netFlow >= 0 ? '#34C759' : '#FF3B30', fontSize:'32px'}}>${netFlow.toFixed(2)}</h2>
               <button onClick={() => setShowAudit(!showAudit)} style={{background:'#FFF', color:'#000', border:'none', padding:'8px 15px', borderRadius:'10px', fontWeight:'900', fontSize:'10px'}}>AUDIT SYSTEM</button>
            </div>
            {showAudit && <button onClick={() => {localStorage.clear(); window.location.reload();}} style={{width:'100%', marginTop:'20px', background:'#FF3B30', color:'#FFF', border:'none', padding:'15px', borderRadius:'15px', fontWeight:'900'}}>WIPE ALL DATA</button>}
          </main>
        )}

        {/* Milestone Pop-up */}
        {milestoneReached && (
          <div style={{position:'fixed', top:0, left:0, width:'100%', height:'100%', background:'rgba(0,0,0,0.95)', zIndex:5000, display:'flex', alignItems:'center', justifyContent:'center', padding:'40px', boxSizing:'border-box', textAlign:'center'}}>
            <div>
              <p style={{color:currentTheme.accent, fontWeight:'900', letterSpacing:'4px', fontSize:'12px'}}>MILESTONE REACHED</p>
              <h1 style={{fontSize:'3rem', margin:'20px 0'}}>${goal.toLocaleString()}</h1>
              <p style={{color:'#8E8E93', fontSize:'14px', marginBottom:'30px'}}>Capital target achieved. Liquidity engine scaling to the next level.</p>
              <button onClick={() => setMilestoneReached(false)} style={{background:'#FFF', color:'#000', border:'none', padding:'15px 40px', borderRadius:'30px', fontWeight:'900'}}>ACKNOWLEDGE</button>
            </div>
          </div>
        )}

        <nav style={{ position: 'fixed', bottom: '30px', left: '50%', transform: 'translateX(-50%)', width: '260px', background: 'rgba(28,28,30,0.95)', borderRadius: '40px', display: 'flex', justifyContent: 'space-around', padding: '16px', border: '1px solid #444' }}>
          {['home', 'lab', 'arena'].map(t => (
            <button key={t} onClick={() => setActiveTab(t)} style={{ background: 'none', border: 'none', color: '#FFF', fontWeight: '900', fontSize: '11px', opacity: activeTab === t ? 1 : 0.3 }}>{t.toUpperCase()}</button>
          ))}
        </nav>
      </div>
    </div>
  );
}

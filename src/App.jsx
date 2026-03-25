import React, { useState, useEffect } from 'react';

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isStealth, setIsStealth] = useState(false);
  const [isAiOpen, setIsAiOpen] = useState(false);
  const [showAudit, setShowAudit] = useState(false);
  
  const founderName = "Dhruvi Desai"; 

  // --- DATA ENGINE ---
  const [stack, setStack] = useState(() => JSON.parse(localStorage.getItem('stack')) ?? 0);
  const [goal, setGoal] = useState(() => JSON.parse(localStorage.getItem('goal')) || 10000);
  const [history, setHistory] = useState(() => JSON.parse(localStorage.getItem('history')) || []);
  const [recurring, setRecurring] = useState(() => JSON.parse(localStorage.getItem('recurring')) || []);
  const [maxLevel, setMaxLevel] = useState(() => Math.floor((JSON.parse(localStorage.getItem('stack')) || 0) / 1000));

  useEffect(() => {
    localStorage.setItem('stack', JSON.stringify(stack));
    localStorage.setItem('goal', JSON.stringify(goal));
    localStorage.setItem('history', JSON.stringify(history));
    localStorage.setItem('recurring', JSON.stringify(recurring));
    
    const currentLevel = Math.floor(stack / 1000);
    if (currentLevel > maxLevel) {
        setMaxLevel(currentLevel);
        setAiMsg(`Level ${currentLevel} reached. The stack is scaling.`);
        setIsAiOpen(true);
    }
  }, [stack, goal, history, recurring, maxLevel]);

  const resetSystem = () => {
    if (window.confirm("Wipe all data?")) {
        localStorage.clear();
        window.location.reload();
    }
  };

  // --- CALCS ---
  const getMonthlyVal = (amt, term) => {
    const v = Number(amt);
    const rates = { daily: 30.42, weekly: 4.33, monthly: 1, yearly: 1/12 };
    return v * (rates[term] || 1);
  };
  const monthlyIn = recurring.filter(r => r.type === 'income').reduce((acc, curr) => acc + getMonthlyVal(curr.amount, curr.term), 0);
  const monthlyOut = recurring.filter(r => r.type === 'burn').reduce((acc, curr) => acc + getMonthlyVal(curr.amount, curr.term), 0);
  const netFlow = monthlyIn - monthlyOut;

  const [aiMsg, setAiMsg] = useState(`Stacked AI Online. Founder: ${founderName}`);
  const [userInput, setUserInput] = useState('');

  const askCoach = () => {
    const input = userInput.toLowerCase();
    if (input.includes("founder")) setAiMsg(`${founderName} is the lead architect.`);
    else if (input.includes("burn")) setAiMsg(`Burn rate: $${monthlyOut.toFixed(2)}/mo.`);
    else setAiMsg("Logic synced.");
    setUserInput('');
  };

  const currentStyles = isDarkMode ? { bg: '#000', text: '#FFF', card: '#1C1C1E' } : { bg: '#FFF', text: '#000', card: '#F2F2F7' };

  return (
    <div style={{minHeight: '100vh', background: currentStyles.bg, color: currentStyles.text, fontFamily: 'sans-serif', padding: '20px', paddingBottom: '100px'}}>
      <div style={{maxWidth: '400px', margin: '0 auto'}}>
        <header style={{display: 'flex', justifyContent: 'space-between', marginBottom: '30px'}}>
            <div style={{fontWeight: '900', fontSize: '14px', letterSpacing: '2px'}}>STACKED AI</div>
            <button onClick={() => setIsStealth(!isStealth)} style={{background: isStealth ? '#FF3B30' : '#333', color: '#FFF', border: 'none', padding: '8px 12px', borderRadius: '10px', fontSize: '10px', fontWeight: '800'}}>STEALTH</button>
        </header>

        {activeTab === 'home' && (
            <main>
                <div style={{textAlign: 'center', marginBottom: '40px'}}>
                    <p style={{fontSize: '10px', color: '#8E8E93', fontWeight: '800'}}>TOTAL CAPITAL</p>
                    <h1 style={{fontSize: '4.5rem', fontWeight: '900', margin: '10px 0', filter: isStealth ? 'blur(15px)' : 'none'}}>${stack.toLocaleString()}</h1>
                    <button onClick={() => setIsAiOpen(true)} style={{width: '100%', padding: '15px', borderRadius: '20px', background: '#007AFF', color: '#FFF', border: 'none', fontWeight: '800'}}>CONSULT COACH</button>
                </div>
                <div style={{background: currentStyles.card, padding: '20px', borderRadius: '20px'}}>
                    <p style={{fontSize: '10px', color: '#8E8E93', fontWeight: '800'}}>RECENT</p>
                    {history.slice(0, 3).map(item => (
                        <div key={item.id} style={{display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #333'}}>
                            <span>{item.label}</span>
                            <span style={{color: item.amount > 0 ? '#34C759' : '#FF3B30'}}>{item.amount > 0 ? '+' : ''}${Math.abs(item.amount)}</span>
                        </div>
                    ))}
                </div>
            </main>
        )}

        {activeTab === 'lab' && (
            <main>
                <div style={{background: currentStyles.card, padding: '20px', borderRadius: '20px', marginBottom: '20px'}}>
                    <input id="label" placeholder="Source" style={{width: '100%', background: 'none', border: 'none', borderBottom: '1px solid #333', color: 'inherit', padding: '10px 0', marginBottom: '15px'}} />
                    <input id="amount" type="number" placeholder="0.00" style={{width: '100%', background: 'none', border: 'none', borderBottom: '1px solid #333', color: 'inherit', padding: '10px 0', marginBottom: '15px'}} />
                    <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px'}}>
                        <button onClick={() => {
                            const l = document.getElementById('label').value; const a = document.getElementById('amount').value;
                            if(l && a) { setHistory([{label: l, amount: Number(a), id: Date.now()}, ...history]); setStack(s => s + Number(a)); }
                        }} style={{padding: '15px', borderRadius: '12px', border: 'none', fontWeight: '800', background: '#FFF', color: '#000'}}>+ INCOME</button>
                        <button onClick={() => {
                            const l = document.getElementById('label').value; const a = document.getElementById('amount').value;
                            if(l && a) { setHistory([{label: l, amount: -Math.abs(Number(a)), id: Date.now()}, ...history]); setStack(s => s - Math.abs(Number(a))); }
                        }} style={{padding: '15px', borderRadius: '12px', border: 'none', fontWeight: '800', background: '#333', color: '#FFF'}}>- SPEND</button>
                    </div>
                </div>
                <div style={{background: currentStyles.card, padding: '20px', borderRadius: '20px'}}>
                    <button onClick={() => {
                        const l = prompt("Name?"); const a = prompt("Amount?"); const t = prompt("daily/weekly/monthly/yearly");
                        const type = confirm("Income?") ? 'income' : 'burn';
                        if(l && a && t) setRecurring([...recurring, {label: l, amount: a, term: t, type, id: Date.now()}]);
                    }} style={{width: '100%', padding: '10px', background: 'none', border: '1px dashed #555', color: '#8E8E93', borderRadius: '10px'}}>+ ADD RECURRING</button>
                </div>
            </main>
        )}

        {activeTab === 'arena' && (
            <main>
                <div style={{background: currentStyles.card, padding: '20px', borderRadius: '20px', marginBottom: '20px'}}>
                    <p style={{fontSize: '10px', color: '#8E8E93', fontWeight: '800'}}>CALIBRATION</p>
                    <div style={{display: 'flex', justifyContent: 'space-between', padding: '10px 0'}}>
                        <span>Actual Balance</span>
                        <input type="number" onBlur={(e) => setStack(Number(e.target.value))} style={{background: 'none', border: 'none', color: '#007AFF', textAlign: 'right', fontWeight: '700'}} placeholder={stack} />
                    </div>
                </div>
                <div style={{background: '#000', border: '1px solid #333', padding: '20px', borderRadius: '20px', textAlign: 'center'}}>
                    <p style={{fontSize: '10px', color: '#8E8E93'}}>MONTHLY FLOW</p>
                    <h2 style={{color: netFlow >= 0 ? '#34C759' : '#FF3B30', fontSize: '32px'}}>${netFlow.toFixed(2)}</h2>
                    <button onClick={() => setShowAudit(!showAudit)} style={{background: '#FFF', border: 'none', padding: '8px 15px', borderRadius: '10px', fontWeight: '900', fontSize: '10px'}}>SYSTEM AUDIT</button>
                    {showAudit && <button onClick={resetSystem} style={{display: 'block', width: '100%', marginTop: '20px', background: '#FF3B30', color: '#FFF', border: 'none', padding: '10px', borderRadius: '10px', fontWeight: '800'}}>RESET ALL</button>}
                </div>
            </main>
        )}

        {isAiOpen && (
            <div style={{position: 'fixed', bottom: 0, left: 0, width: '100%', height: '350px', background: '#000', borderTop: '2px solid #007AFF', padding: '30px', boxSizing: 'border-box', zIndex: 100}}>
                <div style={{display: 'flex', justifyContent: 'space-between', color: '#FFF'}}>
                    <span style={{fontWeight: '900', fontSize: '10px'}}>COACH</span>
                    <button onClick={() => setIsAiOpen(false)} style={{background: 'none', border: 'none', color: '#FFF', fontSize: '20px'}}>×</button>
                </div>
                <div style={{background: '#1C1C1E', padding: '20px', borderRadius: '20px', margin: '20px 0', color: '#FFF'}}>{aiMsg}</div>
                <input value={userInput} onChange={e => setUserInput(e.target.value)} onKeyDown={e => e.key==='Enter' && askCoach()} placeholder="Ask..." style={{width: '100%', background: '#333', border: 'none', padding: '15px', borderRadius: '10px', color: '#FFF'}} />
            </div>
        )}

        <nav style={{position: 'fixed', bottom: '30px', left: '50%', transform: 'translateX(-50%)', width: '260px', background: 'rgba(0,0,0,0.9)', borderRadius: '40px', display: 'flex', justifyContent: 'space-around', padding: '15px'}}>
            {['home', 'lab', 'arena'].map(t => (
                <button key={t} onClick={() => setActiveTab(t)} style={{background: 'none', border: 'none', color: '#FFF', fontWeight: '700', opacity: activeTab === t ? 1 : 0.3}}>{t.toUpperCase()}</button>
            ))}
        </nav>
      </div>
    </div>
  );
}

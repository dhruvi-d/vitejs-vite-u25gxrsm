import React, { useState, useEffect } from 'react';

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isStealth, setIsStealth] = useState(false);
  const [isAiOpen, setIsAiOpen] = useState(false);
  const [showAudit, setShowAudit] = useState(false);
  
  const founderName = "Dhruvi Desai"; 

  // --- DATA ENGINE (With Crash Protection) ---
  const [stack, setStack] = useState(() => {
    try { return Number(localStorage.getItem('stack')) || 0; } catch { return 0; }
  });
  const [goal, setGoal] = useState(() => {
    try { return Number(localStorage.getItem('goal')) || 10000; } catch { return 10000; }
  });
  const [history, setHistory] = useState(() => {
    try { return JSON.parse(localStorage.getItem('history')) || []; } catch { return []; }
  });
  const [recurring, setRecurring] = useState(() => {
    try { return JSON.parse(localStorage.getItem('recurring')) || []; } catch { return []; }
  });
  const [maxLevel, setMaxLevel] = useState(() => {
    try { return Math.floor(Number(localStorage.getItem('stack') || 0) / 1000); } catch { return 0; }
  });

  useEffect(() => {
    localStorage.setItem('stack', stack);
    localStorage.setItem('goal', goal);
    localStorage.setItem('history', JSON.stringify(history));
    localStorage.setItem('recurring', JSON.stringify(recurring));
    
    const currentLevel = Math.floor(stack / 1000);
    if (currentLevel > maxLevel) {
        setMaxLevel(currentLevel);
        setAiMsg(`Level ${currentLevel} unlocked. Momentum is scaling.`);
        setIsAiOpen(true);
    }
  }, [stack, goal, history, recurring, maxLevel]);

  // --- LOGIC & CALCS ---
  const getMonthlyVal = (amt, term) => {
    const v = Number(amt);
    const rates = { daily: 30.42, weekly: 4.33, monthly: 1, yearly: 1/12 };
    return v * (rates[term] || 1);
  };
  const monthlyIn = recurring.filter(r => r.type === 'income').reduce((acc, curr) => acc + getMonthlyVal(curr.amount, curr.term), 0);
  const monthlyOut = recurring.filter(r => r.type === 'burn').reduce((acc, curr) => acc + getMonthlyVal(curr.amount, curr.term), 0);
  const netFlow = monthlyIn - monthlyOut;

  // --- COACH AI ---
  const [aiMsg, setAiMsg] = useState(`Stacked AI v6.5 Online. Lead: ${founderName}`);
  const [userInput, setUserInput] = useState('');

  const askCoach = () => {
    const input = userInput.toLowerCase();
    if (input.includes("founder")) setAiMsg(`${founderName} is the lead architect.`);
    else if (input.includes("burn")) setAiMsg(`Burn: $${monthlyOut.toFixed(2)}/mo. Net: $${netFlow.toFixed(2)}.`);
    else setAiMsg("Logic synced with current stack.");
    setUserInput('');
  };

  const currentStyles = isDarkMode ? darkTheme : lightTheme;

  return (
    <div style={{...styles.container, background: currentStyles.bg, color: currentStyles.text}}>
      <div style={styles.page}>
        <header style={styles.header}>
            <div style={styles.logo}>STACKED <span style={styles.aiBadge}>AI</span></div>
            <div style={{display: 'flex', gap: '8px'}}>
                <button onClick={() => setIsStealth(!isStealth)} style={{...styles.themeBtn, background: isStealth ? '#FF3B30' : '#333'}}>STEALTH</button>
                <button onClick={() => setIsDarkMode(!isDarkMode)} style={styles.themeBtn}>{isDarkMode ? 'SNOW' : 'MID'}</button>
            </div>
        </header>

        {activeTab === 'home' && (
            <main>
                <section style={styles.hero}>
                    <p style={styles.label}>LEVEL {Math.floor(stack/1000)} • TOTAL STACK</p>
                    <h1 style={{...styles.bigNum, filter: isStealth ? 'blur(15px)' : 'none'}}>${stack.toLocaleString()}</h1>
                    <div style={{...styles.track, background: currentStyles.track}}>
                        <div style={{...styles.fill, width: `${Math.min((stack/goal*100), 100)}%`, background: '#007AFF'}}></div>
                    </div>
                    <button onClick={() => setIsAiOpen(true)} style={styles.aiTrigger}>✨ CONSULT COACH</button>
                </section>
                <div style={{...styles.vibeCard, background: currentStyles.card}}>
                    <p style={styles.label}>RECENT ACTIVITY</p>
                    {history.slice(0, 3).map(item => (
                        <div key={item.id} style={styles.row}>
                            <span>{item.label}</span>
                            <span style={{color: item.amount > 0 ? '#34C759' : '#FF3B30'}}>${Math.abs(item.amount)}</span>
                        </div>
                    ))}
                </div>
            </main>
        )}

        {activeTab === 'lab' && (
            <main>
                <div style={{...styles.vibeCard, background: currentStyles.card}}>
                    <p style={styles.label}>LOG TRANSACTION</p>
                    <input id="label" placeholder="Source" style={styles.input} />
                    <input id="amount" type="number" placeholder="0.00" style={styles.input} />
                    <div style={styles.grid}>
                        <button onClick={() => {
                            const l = document.getElementById('label').value; const a = document.getElementById('amount').value;
                            if(l && a) { setHistory([{label: l, amount: Number(a), id: Date.now()}, ...history]); setStack(s => s + Number(a)); }
                        }} style={{...styles.mainBtn, background: '#FFF', color: '#000'}}>INCOME</button>
                        <button onClick={() => {
                            const l = document.getElementById('label').value; const a = document.getElementById('amount').value;
                            if(l && a) { setHistory([{label: l, amount: -Number(a), id: Date.now()}, ...history]); setStack(s => s - Number(a)); }
                        }} style={{...styles.mainBtn, background: '#333', color: '#FFF'}}>SPEND</button>
                    </div>
                </div>
                <div style={{...styles.vibeCard, background: currentStyles.card}}>
                    <p style={styles.label}>AUTO-FLOWS</p>
                    <button onClick={() => {
                        const l = prompt("Name?"); const a = prompt("Amount?"); const t = prompt("daily/weekly/monthly/yearly");
                        const type = confirm("Income?") ? 'income' : 'burn';
                        if(l && a && t) setRecurring([{label: l, amount: a, term: t, type, id: Date.now()}, ...recurring]);
                    }} style={styles.addBtn}>+ NEW RECURRING</button>
                </div>
            </main>
        )}

        {activeTab === 'arena' && (
            <main>
                <div style={{...styles.vibeCard, background: currentStyles.card}}>
                    <p style={styles.label}>INITIAL CALIBRATION</p>
                    <div style={styles.row}><span>Actual Balance</span><input type="number" onBlur={(e) => setStack(Number(e.target.value))} style={styles.miniInput} /></div>
                    <div style={styles.row}><span>Target Goal</span><input type="number" onBlur={(e) => setGoal(Number(e.target.value))} style={styles.miniInput} /></div>
                </div>
                <div style={{...styles.vibeCard, background: '#000', textAlign: 'center', border: '1px solid #333'}}>
                    <p style={styles.label}>MONTHLY NET FLOW</p>
                    <h2 style={{color: netFlow >= 0 ? '#34C759' : '#FF3B30', fontSize: '32px'}}>${netFlow.toFixed(2)}</h2>
                    <button onClick={() => setShowAudit(!showAudit)} style={styles.auditBtn}>SYSTEM AUDIT</button>
                </div>
                {showAudit && (
                    <div style={{...styles.vibeCard, background: '#111', border: '1px solid #333'}}>
                        <div style={styles.row}><span>Recur. Income</span><span style={{color:'#34C759'}}>${monthlyIn.toFixed(2)}</span></div>
                        <div style={styles.row}><span>Recur. Burn</span><span style={{color:'#FF3B30'}}>${monthlyOut.toFixed(2)}</span></div>
                        <button onClick={() => {localStorage.clear(); window.location.reload();}} style={styles.resetBtn}>RESET ALL DATA</button>
                    </div>
                )}
            </main>
        )}

        {isAiOpen && (
            <div style={styles.aiDrawer}>
                <div style={styles.flexBetween}>
                    <span style={{fontWeight: '900', fontSize: '10px'}}>COACH ENGINE</span>
                    <button onClick={() => setIsAiOpen(false)} style={styles.closeBtn}>×</button>
                </div>
                <div style={styles.aiBox}><p>{aiMsg}</p></div>
                <div style={{display: 'flex', gap: '10px'}}>
                    <input value={userInput} onChange={e => setUserInput(e.target.value)} onKeyDown={e => e.key==='Enter' && askCoach()} placeholder="Ask..." style={styles.aiInput} />
                    <button onClick={askCoach} style={styles.sendBtn}>→</button>
                </div>
            </div>
        )}
      </div>

      <nav style={styles.nav}>
        {['home', 'lab', 'arena'].map(t => (
            <button key={t} onClick={() => setActiveTab(t)} style={{...styles.navBtn, opacity: activeTab===t?1:0.3}}>{t.toUpperCase()}</button>
        ))}
      </nav>
    </div>
  );
}

const darkTheme = { bg: '#000', text: '#FFF', card: '#1C1C1E', border: '#333', track: '#333' };
const lightTheme = { bg: '#FFF', text: '#000', card: '#F2F2F7', border: '#E5E5EA', track: '#E5E5EA' };

const styles = {
  container: { minHeight: '100vh', fontFamily: 'sans-serif', padding: '0 24px', transition: '0.3s', paddingBottom: '100px' },
  page: { maxWidth: '400px', margin: '0 auto', paddingTop: '40px' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' },
  logo: { fontWeight: '900', fontSize: '12px', letterSpacing: '2px' },
  aiBadge: { background: '#007AFF', color: '#FFF', padding: '2px 6px', borderRadius: '4px', fontSize: '8px' },
  themeBtn: { color: '#FFF', border: 'none', padding: '8px 12px', borderRadius: '12px', fontSize: '9px', fontWeight: '800' },
  hero: { textAlign: 'center', marginBottom: '30px' },
  bigNum: { fontSize: '4.5rem', fontWeight: '900', letterSpacing: '-4px', margin: '10px 0' },
  label: { fontSize: '10px', fontWeight: '800', color: '#8E8E93', letterSpacing: '1px' },
  track: { width: '100%', height: '10px', borderRadius: '10px', overflow: 'hidden', margin: '20px 0' },
  fill: { height: '100%', transition: 'width 1s' },
  aiTrigger: { width: '100%', padding: '18px', borderRadius: '24px', border: 'none', background: '#1C1C1E', color: '#FFF', fontWeight: '800' },
  vibeCard: { padding: '20px', borderRadius: '24px', marginBottom: '15px' },
  row: { display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid #333', fontSize: '13px' },
  input: { width: '100%', background: 'transparent', border: 'none', borderBottom: '1px solid #333', padding: '10px 0', color: 'inherit', marginBottom: '15px', outline: 'none' },
  miniInput: { width: '80px', background: 'transparent', border: 'none', color: '#007AFF', textAlign: 'right', fontWeight: '700' },
  grid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' },
  mainBtn: { border: 'none', padding: '15px', borderRadius: '15px', fontWeight: '800' },
  addBtn: { width: '100%', background: 'none', border: '1px dashed #333', color: '#8E8E93', padding: '10px', borderRadius: '15px' },
  aiDrawer: { position: 'fixed', bottom: 0, left: 0, width: '100%', height: '350px', background: '#000', borderTop: '2px solid #007AFF', padding: '30px', boxSizing: 'border-box', zIndex: 2000 },
  aiBox: { background: '#1C1C1E', padding: '20px', borderRadius: '20px', margin: '20px 0', color: '#FFF' },
  aiInput: { flex: 1, background: '#333', border: 'none', padding: '15px', borderRadius: '15px', color: '#FFF' },
  sendBtn: { background: '#007AFF', border: 'none', color: '#FFF', padding: '0 20px', borderRadius: '15px' },
  closeBtn: { background: 'none', border: 'none', color: '#FFF', fontSize: '24px' },
  flexBetween: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  nav: { position: 'fixed', bottom: '30px', left: '50%', transform: 'translateX(-50%)', width: '260px', background: 'rgba(0,0,0,0.9)', borderRadius: '40px', display: 'flex', justifyContent: 'space-around', padding: '16px' },
  navBtn: { background: 'none', border: 'none', color: '#FFF', fontWeight: '700', fontSize: '11px' },
  auditBtn: { background: '#FFF', color: '#000', border: 'none', padding: '8px 15px', borderRadius: '10px', fontSize: '10px', fontWeight: '900', marginTop: '10px' },
  resetBtn: { width: '100%', background: '#FF3B30', color: '#FFF', border: 'none', padding: '12px', borderRadius: '12px', fontSize: '10px', fontWeight: '900', marginTop: '20px' }
};

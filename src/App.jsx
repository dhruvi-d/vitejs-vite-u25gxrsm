import React, { useState, useEffect } from 'react';

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isStealth, setIsStealth] = useState(false);
  const [isAiOpen, setIsAiOpen] = useState(false);
  const [showAudit, setShowAudit] = useState(false);
  
  // --- FOUNDER IDENTITY ---
  const founderName = "Dhruvi Desai"; 

  const [stack, setStack] = useState(() => JSON.parse(localStorage.getItem('stack')) ?? 0);
  const [goal, setGoal] = useState(() => JSON.parse(localStorage.getItem('goal')) || 10000);
  const [history, setHistory] = useState(() => JSON.parse(localStorage.getItem('history')) || []);
  const [recurring, setRecurring] = useState(() => JSON.parse(localStorage.getItem('recurring')) || []);

  useEffect(() => {
    localStorage.setItem('stack', JSON.stringify(stack));
    localStorage.setItem('goal', JSON.stringify(goal));
    localStorage.setItem('history', JSON.stringify(history));
    localStorage.setItem('recurring', JSON.stringify(recurring));
  }, [stack, goal, history, recurring]);

  // --- ENGINE ---
  const getMonthlyVal = (amt, term) => {
    const v = Number(amt);
    const rates = { daily: 30.42, weekly: 4.33, monthly: 1, yearly: 1/12 };
    return v * (rates[term] || 1);
  };

  const monthlyIn = recurring.filter(r => r.type === 'income').reduce((acc, curr) => acc + getMonthlyVal(curr.amount, curr.term), 0);
  const monthlyOut = recurring.filter(r => r.type === 'burn').reduce((acc, curr) => acc + getMonthlyVal(curr.amount, curr.term), 0);
  const netFlow = monthlyIn - monthlyOut;

  // --- COACH LOGIC ---
  const [aiMsg, setAiMsg] = useState(`System active. Developed by ${founderName}. What's the play?`);
  const [userInput, setUserInput] = useState('');

  const askCoach = () => {
    const input = userInput.toLowerCase();
    if (input.includes("founder") || input.includes("who made") || input.includes("dhruvi")) {
      setAiMsg(`${founderName} is the founder and lead developer. I'm running on the Desai Logic Engine.`);
    } else if (input.includes("expense") || input.includes("burn")) {
      setAiMsg(`Recurring Burn: $${monthlyOut.toFixed(2)}/mo. You're ${monthlyOut > monthlyIn ? 'bleeding capital' : 'stable'}.`);
    } else if (input.includes("income")) {
      setAiMsg(`Automated Income: $${monthlyIn.toFixed(2)}/mo. That's your floor.`);
    } else {
      setAiMsg("Ledger confirmed. Stay focused on the goal.");
    }
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
                <button onClick={() => setIsDarkMode(!isDarkMode)} style={styles.themeBtn}>{isDarkMode ? 'SNOW' : 'MIDNIGHT'}</button>
            </div>
        </header>

        {activeTab === 'home' && (
            <main>
                <section style={styles.hero}>
                    <p style={styles.label}>NET LIQUIDITY</p>
                    <h1 style={{...styles.bigNum, filter: isStealth ? 'blur(15px)' : 'none'}}>${stack.toLocaleString()}</h1>
                    <div style={{...styles.track, background: currentStyles.track}}>
                        <div style={{...styles.fill, width: `${(stack/goal*100)}%`, background: '#007AFF'}}></div>
                    </div>
                    <button onClick={() => setIsAiOpen(true)} style={styles.aiTrigger}>✨ CONSULT COACH</button>
                </section>
                <div style={{...styles.vibeCard, background: currentStyles.card}}>
                    <p style={styles.label}>HISTORY</p>
                    {history.slice(0, 3).map(item => (
                        <div key={item.id} style={styles.row}>
                            <span>{item.label}</span>
                            <span style={{color: item.amount > 0 ? '#34C759' : '#FF3B30'}}>${Math.abs(item.amount)}</span>
                        </div>
                    ))}
                </div>
                <p style={styles.founderTag}>Developed by {founderName} • v5.5</p>
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
                            const l = document.getElementById('label').value;
                            const a = document.getElementById('amount').value;
                            if(l && a) {
                                setHistory([{label: l, amount: Number(a), id: Date.now()}, ...history]);
                                setStack(s => s + Number(a));
                            }
                        }} style={{...styles.mainBtn, background: '#FFF', color: '#000'}}>+ INCOME</button>
                        <button onClick={() => {
                            const l = document.getElementById('label').value;
                            const a = document.getElementById('amount').value;
                            if(l && a) {
                                setHistory([{label: l, amount: -Math.abs(Number(a)), id: Date.now()}, ...history]);
                                setStack(s => s - Math.abs(Number(a)));
                            }
                        }} style={{...styles.mainBtn, background: '#333', color: '#FFF'}}>- SPEND</button>
                    </div>
                </div>
                <div style={{...styles.vibeCard, background: currentStyles.card}}>
                    <p style={styles.label}>AUTO-FLOWS</p>
                    {recurring.map(r => (
                        <div key={r.id} style={styles.row}>
                            <span style={{color: r.type === 'income' ? '#34C759' : '#8E8E93'}}>{r.label}</span>
                            <button onClick={() => setRecurring(recurring.filter(f => f.id !== r.id))} style={styles.delBtn}>×</button>
                        </div>
                    ))}
                    <button onClick={() => {
                        const l = prompt("Name?"); const a = prompt("Amount?"); const t = prompt("daily/weekly/monthly/yearly");
                        const type = confirm("Is this INCOME?") ? 'income' : 'burn';
                        if(l && a && t) setRecurring([...recurring, {label: l, amount: a, term: t, type, id: Date.now()}]);
                    }} style={styles.addBtn}>+ NEW RECURRING</button>
                </div>
            </main>
        )}

        {activeTab === 'arena' && (
            <main>
                <div style={{...styles.vibeCard, background: '#000', color: '#FFF', textAlign: 'center'}}>
                    <p style={styles.label}>MONTHLY FLOW</p>
                    <h2 style={{color: netFlow >= 0 ? '#34C759' : '#FF3B30', fontSize: '32px'}}>${netFlow.toFixed(2)}</h2>
                    <button onClick={() => setShowAudit(!showAudit)} style={styles.auditBtn}>SYSTEM AUDIT</button>
                </div>
                {showAudit && (
                    <div style={{...styles.vibeCard, background: '#111', border: '1px solid #007AFF'}}>
                        <p style={{fontSize: '9px', color: '#007AFF', fontWeight: '900', marginBottom: '10px'}}>FOUNDER'S COMPLIANCE REPORT</p>
                        <div style={styles.row}><span>Lead Developer</span><span>{founderName}</span></div>
                        <div style={styles.row}><span>Recur. Income</span><span>${monthlyIn.toFixed(2)}</span></div>
                        <div style={styles.row}><span>Recur. Burn</span><span>${monthlyOut.toFixed(2)}</span></div>
                    </div>
                )}
            </main>
        )}

        {isAiOpen && (
            <div style={styles.aiDrawer}>
                <div style={styles.flexBetween}>
                    <span style={{fontWeight: '900', fontSize: '10px'}}>STACKED COACH</span>
                    <button onClick={() => setIsAiOpen(false)} style={styles.closeBtn}>×</button>
                </div>
                <div style={styles.aiBox}><p>{aiMsg}</p></div>
                <div style={{display: 'flex', gap: '10px'}}>
                    <input value={userInput} onChange={e => setUserInput(e.target.value)} onKeyDown={e => e.key==='Enter' && askCoach()} placeholder="Ask the coach..." style={styles.aiInput} />
                    <button onClick={askCoach} style={styles.sendBtn}>→</button>
                </div>
            </div>
        )}
      </div>

      <nav style={styles.nav}>
        <button onClick={() => setActiveTab('home')} style={{...styles.navBtn, opacity: activeTab==='home'?1:0.3}}>Home</button>
        <button onClick={() => setActiveTab('lab')} style={{...styles.navBtn, opacity: activeTab==='lab'?1:0.3}}>Lab</button>
        <button onClick={() => setActiveTab('arena')} style={{...styles.navBtn, opacity: activeTab==='arena'?1:0.3}}>Arena</button>
      </nav>
    </div>
  );
}

const lightTheme = { bg: '#FFF', text: '#000', card: '#F2F2F7', border: '#E5E5EA', track: '#E5E5EA' };
const darkTheme = { bg: '#000', text: '#FFF', card: '#1C1C1E', border: '#333', track: '#333' };

const styles = {
  container: { minHeight: '100vh', fontFamily: '-apple-system, sans-serif', padding: '0 24px', transition: '0.3s', paddingBottom: '100px' },
  page: { maxWidth: '400px', margin: '0 auto', paddingTop: '40px' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' },
  logo: { fontWeight: '900', fontSize: '12px', letterSpacing: '2px' },
  aiBadge: { background: '#007AFF', color: '#FFF', padding: '2px 6px', borderRadius: '4px', fontSize: '8px' },
  themeBtn: { color: '#FFF', border: 'none', padding: '8px 12px', borderRadius: '12px', fontSize: '9px', fontWeight: '800', cursor: 'pointer' },
  hero: { textAlign: 'center', marginBottom: '30px' },
  bigNum: { fontSize: '5rem', fontWeight: '900', letterSpacing: '-4px', margin: '10px 0' },
  label: { fontSize: '10px', fontWeight: '800', color: '#8E8E93', letterSpacing: '1px' },
  track: { width: '100%', height: '10px', borderRadius: '10px', overflow: 'hidden', margin: '20px 0' },
  fill: { height: '100%', transition: 'width 1s' },
  aiTrigger: { width: '100%', padding: '18px', borderRadius: '24px', border: 'none', background: '#1C1C1E', color: '#FFF', fontWeight: '800', cursor: 'pointer' },
  vibeCard: { padding: '20px', borderRadius: '24px', marginBottom: '15px', border: '1px solid #333' },
  row: { display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid #333', fontSize: '13px' },
  input: { width: '100%', background: 'transparent', border: 'none', borderBottom: '1px solid #333', padding: '10px 0', color: 'inherit', marginBottom: '15px', outline: 'none' },
  grid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' },
  mainBtn: { border: 'none', padding: '15px', borderRadius: '15px', fontWeight: '800' },
  addBtn: { width: '100%', background: 'none', border: '1px dashed #333', color: '#8E8E93', padding: '10px', borderRadius: '15px', marginBottom: '15px' },
  delBtn: { background: '#333', border: 'none', color: '#FFF', width: '20px', height: '20px', borderRadius: '50%', fontSize: '12px' },
  founderTag: { textAlign: 'center', fontSize: '9px', color: '#8E8E93', marginTop: '20px', fontWeight: '700', letterSpacing: '1px' },
  aiDrawer: { position: 'fixed', bottom: 0, left: 0, width: '100%', height: '350px', background: '#000', borderTop: '2px solid #007AFF', padding: '30px', borderTopLeftRadius: '30px', borderTopRightRadius: '30px', display: 'flex', flexDirection: 'column', zIndex: 2000 },
  aiBox: { background: '#1C1C1E', padding: '20px', borderRadius: '20px', margin: '20px 0', color: '#FFF' },
  aiInput: { flex: 1, background: '#333', border: 'none', padding: '15px', borderRadius: '15px', color: '#FFF' },
  sendBtn: { background: '#007AFF', border: 'none', color: '#FFF', padding: '0 20px', borderRadius: '15px' },
  closeBtn: { background: 'none', border: 'none', color: '#FFF', fontSize: '24px' },
  flexBetween: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  nav: { position: 'fixed', bottom: '30px', left: '50%', transform: 'translateX(-50%)', width: '260px', background: 'rgba(0,0,0,0.9)', borderRadius: '40px', display: 'flex', justifyContent: 'space-around', padding: '16px' },
  navBtn: { background: 'none', border: 'none', color: '#FFF', fontWeight: '700', fontSize: '12px' },
  auditBtn: { background: '#FFF', color: '#000', border: 'none', padding: '8px 15px', borderRadius: '10px', fontSize: '10px', fontWeight: '900', marginTop: '10px' }
};

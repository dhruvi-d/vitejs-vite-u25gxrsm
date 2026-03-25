import React, { useState, useEffect } from 'react';

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  // --- CORE DATA ---
  const [stack, setStack] = useState(() => JSON.parse(localStorage.getItem('stack')) || 5000);
  const [goal, setGoal] = useState(() => JSON.parse(localStorage.getItem('goal')) || 100000);
  const [history, setHistory] = useState(() => JSON.parse(localStorage.getItem('history')) || []);
  const [recurring, setRecurring] = useState(() => JSON.parse(localStorage.getItem('recurring')) || []);
  const [streak, setStreak] = useState(() => JSON.parse(localStorage.getItem('streak')) || 0);

  useEffect(() => {
    localStorage.setItem('stack', JSON.stringify(stack));
    localStorage.setItem('goal', JSON.stringify(goal));
    localStorage.setItem('history', JSON.stringify(history));
    localStorage.setItem('recurring', JSON.stringify(recurring));
    localStorage.setItem('streak', JSON.stringify(streak));
  }, [stack, goal, history, recurring, streak]);

  // --- SOCIAL QUANT & SENTIMENT LOGIC ---
  const totalSpend = Math.abs(history.filter(i => i.amount < 0).reduce((acc, curr) => acc + curr.amount, 0));
  const totalIncome = history.filter(i => i.amount > 0).reduce((acc, curr) => acc + curr.amount, 0);
  const regretItems = history.filter(i => i.sentiment === 'regret').length;
  const socialCredit = Math.max(0, 500 + (streak * 10) - (regretItems * 50));
  
  const progress = Math.min(((stack / goal) * 100), 100).toFixed(1);
  const currentStyles = isDarkMode ? darkTheme : lightTheme;

  const logTransaction = (label, amount, type, sentiment = 'neutral') => {
    if(!label || !amount) return;
    const finalAmt = type === 'income' ? Math.abs(Number(amount)) : -Math.abs(Number(amount));
    setHistory([{ label, amount: finalAmt, sentiment, id: Date.now() }, ...history]);
    setStack(prev => prev + finalAmt);
    if (type === 'income') setStreak(s => s + 1);
  };

  // --- UI COMPONENTS ---
  const HomePage = () => (
    <div style={styles.page}>
      <header style={styles.header}>
        <div style={{...styles.logo, color: currentStyles.text}}>STACKED <span style={styles.aiTag}>SENTIMENT AI</span></div>
        <button onClick={() => setIsDarkMode(!isDarkMode)} style={styles.themeBtn}>{isDarkMode ? 'SNOW' : 'MIDNIGHT'}</button>
      </header>
      
      <section style={styles.hero}>
        <p style={styles.label}>SOCIAL QUANT RANK</p>
        <h1 style={{...styles.bigNum, color: currentStyles.text}}>{socialCredit}</h1>
        <p style={{...styles.streakText, color: currentStyles.text}}>CREDIT STATUS: {socialCredit > 600 ? 'ELITE' : 'OBSERVED'}</p>
      </section>

      <div style={{...styles.vibeCard, background: currentStyles.card, borderColor: currentStyles.border}}>
         <p style={styles.label}>SENTIMENT FEED</p>
         {history.map(item => (
           <div key={item.id} style={{...styles.row, color: currentStyles.text, borderBottomColor: currentStyles.border}}>
             <span>{item.label} {item.sentiment === 'regret' ? '💀' : '🔥'}</span>
             <span style={{color: item.amount > 0 ? '#34C759' : '#FF3B30', fontWeight: '800'}}>
                {item.amount > 0 ? '+' : '-'}${Math.abs(item.amount)}
             </span>
           </div>
         ))}
      </div>
    </div>
  );

  const LabPage = () => {
    const [name, setName] = useState('');
    const [val, setVal] = useState('');
    return (
      <div style={styles.page}>
        <h2 style={{...styles.pageTitle, color: currentStyles.text}}>The Lab</h2>
        <div style={{...styles.vibeCard, background: currentStyles.card, borderColor: currentStyles.border}}>
          <p style={styles.label}>NEW ENTRY</p>
          <input placeholder="Transaction Name" value={name} onChange={e => setName(e.target.value)} style={{...styles.labInput, color: currentStyles.text}} />
          <input type="number" placeholder="0.00" value={val} onChange={e => setVal(e.target.value)} style={{...styles.labInput, color: currentStyles.text}} />
          
          <p style={{...styles.label, marginTop: '20px'}}>VIBE CHECK (SENTIMENT)</p>
          <div style={styles.grid}>
            <button onClick={() => {logTransaction(name, val, 'income', 'hype'); setName(''); setVal('')}} style={{...styles.mainBtn, background: '#34C759'}}>HYPE (INCOME)</button>
            <button onClick={() => {logTransaction(name, val, 'burn', 'regret'); setName(''); setVal('')}} style={{...styles.mainBtn, background: '#FF3B30'}}>REGRET (SPEND)</button>
          </div>
        </div>
      </div>
    );
  };

  const ArenaPage = () => (
    <div style={styles.page}>
      <h2 style={{...styles.pageTitle, color: currentStyles.text}}>Sustainability Report</h2>
      <div style={{...styles.vibeCard, background: '#000', color: '#FFF', borderRadius: '24px'}}>
        <p style={styles.miniLabel}>FINANCIAL HEALTH INDEX</p>
        <div style={styles.row}><span>Liquidity (Stack)</span><span>${stack}</span></div>
        <div style={styles.row}><span>Burn Rate (Total Spend)</span><span>-${totalSpend}</span></div>
        <div style={styles.row}><span>Sentiment Efficiency</span><span>{((history.length - regretItems) / history.length * 100 || 0).toFixed(0)}%</span></div>
        <p style={{fontSize: '11px', marginTop: '20px', opacity: 0.7, fontStyle: 'italic'}}>
          "User exhibits high psychological resilience but shows vulnerability in 'Regret-Spending' cycles."
        </p>
      </div>
      <button style={{...styles.mainBtn, background: currentStyles.text, color: currentStyles.bg, marginTop: '20px'}}>CHALLENGE FRIENDS</button>
    </div>
  );

  return (
    <div style={{...styles.container, background: currentStyles.bg}}>
      {activeTab === 'home' && <HomePage />}
      {activeTab === 'lab' && <LabPage />}
      {activeTab === 'arena' && <ArenaPage />}
      <nav style={styles.nav}>
        <button onClick={() => setActiveTab('home')} style={{...styles.navBtn, opacity: activeTab === 'home' ? 1 : 0.3}}>Home</button>
        <button onClick={() => setActiveTab('lab')} style={{...styles.navBtn, opacity: activeTab === 'lab' ? 1 : 0.3}}>Lab</button>
        <button onClick={() => setActiveTab('arena')} style={{...styles.navBtn, opacity: activeTab === 'arena' ? 1 : 0.3}}>Report</button>
      </nav>
    </div>
  );
}

// --- STYLING ---
const lightTheme = { bg: '#FFFFFF', text: '#000', card: '#F9F9FB', border: '#F2F2F7', track: '#F2F2F7' };
const darkTheme = { bg: '#000', text: '#FFF', card: '#1C1C1E', border: '#2C2C2E', track: '#2C2C2E' };

const styles = {
  container: { minHeight: '100vh', fontFamily: '-apple-system, sans-serif', padding: '0 24px', paddingBottom: '120px', transition: 'all 0.3s ease' },
  page: { maxWidth: '400px', margin: '0 auto', paddingTop: '40px' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '60px' },
  logo: { fontWeight: '900', fontSize: '11px', letterSpacing: '2px' },
  aiTag: { background: '#007AFF', color: '#FFF', padding: '2px 6px', borderRadius: '4px', fontSize: '8px', marginLeft: '5px' },
  themeBtn: { background: '#000', color: '#FFF', border: 'none', padding: '8px 16px', borderRadius: '20px', fontSize: '10px', fontWeight: '800' },
  hero: { textAlign: 'center', marginBottom: '40px' },
  bigNum: { fontSize: '8rem', fontWeight: '900', letterSpacing: '-8px', lineHeight: '0.8', margin: 0 },
  label: { fontSize: '9px', fontWeight: '800', color: '#AEAEB2', letterSpacing: '1px', marginBottom: '15px' },
  track: { width: '100%', height: '6px', borderRadius: '10px', marginTop: '30px', overflow: 'hidden' },
  fill: { height: '100%', transition: 'width 1s ease' },
  vibeCard: { padding: '24px', borderRadius: '32px', border: '1px solid', marginBottom: '20px' },
  row: { display: 'flex', justifyContent: 'space-between', padding: '16px 0', borderBottom: '1px solid #333', fontSize: '13px', fontWeight: '600' },
  pageTitle: { fontSize: '32px', fontWeight: '900', letterSpacing: '-1px', marginBottom: '30px' },
  labInput: { width: '100%', background: 'transparent', border: 'none', borderBottom: '1px solid #333', marginBottom: '20px', padding: '10px 0', fontSize: '16px', fontWeight: '600', outline: 'none' },
  grid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' },
  mainBtn: { border: 'none', padding: '18px', borderRadius: '20px', fontWeight: '800', cursor: 'pointer', fontSize: '12px' },
  nav: { position: 'fixed', bottom: '30px', left: '50%', transform: 'translateX(-50%)', width: '260px', background: 'rgba(0,0,0,0.9)', backdropFilter: 'blur(15px)', borderRadius: '40px', display: 'flex', justifyContent: 'space-around', padding: '16px' },
  navBtn: { background: 'none', border: 'none', color: '#FFF', fontWeight: '700', fontSize: '12px' },
  miniLabel: { fontSize: '9px', fontWeight: '800', opacity: 0.5, marginBottom: '10px' }
};

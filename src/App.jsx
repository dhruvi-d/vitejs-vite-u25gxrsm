import React, { useState, useEffect } from 'react';

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isStealth, setIsStealth] = useState(false);
  const [showAudit, setShowAudit] = useState(false);
  
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

  // --- RECURRING ENGINE ---
  const getMonthlyVal = (amt, term) => {
    const v = Number(amt);
    if (term === 'daily') return v * 30.42;
    if (term === 'weekly') return v * 4.33;
    if (term === 'yearly') return v / 12;
    return v;
  };

  const monthlyIn = recurring.filter(r => r.type === 'income').reduce((acc, curr) => acc + getMonthlyVal(curr.amount, curr.term), 0);
  const monthlyOut = recurring.filter(r => r.type === 'burn').reduce((acc, curr) => acc + getMonthlyVal(curr.amount, curr.term), 0);
  const netAutopilot = (monthlyIn - monthlyOut).toFixed(2);
  
  const progress = Math.min(((stack / goal) * 100), 100).toFixed(1);
  const level = Math.floor(progress / 10);
  const currentStyles = isDarkMode ? darkTheme : lightTheme;

  // --- ACTIONS ---
  const logMove = (label, amount, isIncome) => {
    if(!label || !amount) return;
    const finalAmt = isIncome ? Math.abs(Number(amount)) : -Math.abs(Number(amount));
    setHistory([{ label, amount: finalAmt, id: Date.now() }, ...history]);
    setStack(prev => prev + finalAmt);
    if (isIncome) setStreak(s => s + 1);
  };

  const HomePage = () => (
    <div style={styles.page}>
      <header style={styles.header}>
        <div style={{...styles.logo, color: currentStyles.text}}>STACKED</div>
        <div style={{display: 'flex', gap: '8px'}}>
            <button onClick={() => setIsStealth(!isStealth)} style={{...styles.themeBtn, background: isStealth ? '#FF3B30' : '#333'}}>STEALTH</button>
            <button onClick={() => setIsDarkMode(!isDarkMode)} style={styles.themeBtn}>{isDarkMode ? 'SNOW' : 'MIDNIGHT'}</button>
        </div>
      </header>
      
      <section style={styles.hero}>
        <p style={styles.label}>LEVEL {level} • {streak} DAY STREAK</p>
        <h1 style={{...styles.bigNum, color: currentStyles.text, filter: isStealth ? 'blur(15px)' : 'none'}}>${stack.toLocaleString()}</h1>
        <div style={{...styles.track, background: currentStyles.track}}>
          <div style={{...styles.fill, width: `${progress}%`, background: currentStyles.text}}></div>
        </div>
      </section>

      <div style={{...styles.vibeCard, background: currentStyles.card, borderColor: currentStyles.border}}>
         <p style={styles.label}>RECENT MOVES</p>
         {history.slice(0, 5).map(item => (
           <div key={item.id} style={{...styles.row, color: currentStyles.text, borderBottomColor: currentStyles.border}}>
             <span>{item.label}</span>
             <span style={{color: item.amount > 0 ? '#34C759' : '#FF3B30', filter: isStealth ? 'blur(8px)' : 'none'}}>
                {item.amount > 0 ? '+' : '-'}${Math.abs(item.amount)}
             </span>
           </div>
         ))}
      </div>
    </div>
  );

  const LabPage = () => {
    const [n, setN] = useState('');
    const [v, setV] = useState('');
    return (
      <div style={styles.page}>
        <h2 style={{...styles.pageTitle, color: currentStyles.text}}>The Lab</h2>
        <div style={{...styles.vibeCard, background: currentStyles.card, borderColor: currentStyles.border}}>
          <p style={styles.label}>ONE-TIME LOG</p>
          <input placeholder="Item..." value={n} onChange={e => setN(e.target.value)} style={{...styles.labInput, color: currentStyles.text}} />
          <input type="number" placeholder="0.00" value={v} onChange={e => setV(e.target.value)} style={{...styles.labInput, color: currentStyles.text}} />
          <div style={styles.grid}>
            <button onClick={() => {logMove(n, v, true); setN(''); setV('')}} style={{...styles.mainBtn, background: '#000', color: '#FFF'}}>INCOME</button>
            <button onClick={() => {logMove(n, v, false); setN(''); setV('')}} style={{...styles.mainBtn, background: '#F2F2F7', color: '#000'}}>SPEND</button>
          </div>
        </div>

        <div style={{...styles.vibeCard, background: currentStyles.card, borderColor: currentStyles.border}}>
          <p style={styles.label}>ACTIVE RECURRING</p>
          {recurring.map(r => (
            <div key={r.id} style={{...styles.row, color: currentStyles.text, borderBottomColor: currentStyles.border}}>
              <span>{r.label} ({r.term})</span>
              <div style={{display: 'flex', gap: '10px', alignItems: 'center'}}>
                <span style={{color: r.type === 'income' ? '#34C759' : '#FF3B30'}}>${r.amount}</span>
                <button onClick={() => setRecurring(recurring.filter(f => f.id !== r.id))} style={styles.delBtn}>×</button>
              </div>
            </div>
          ))}
          <button onClick={() => {
            const l = prompt("Name (e.g. Salary, Rent)");
            const a = prompt("Amount");
            const t = prompt("Term (daily, weekly, monthly, yearly)");
            const type = confirm("Is this Income?") ? 'income' : 'burn';
            if(l && a && t) setRecurring([...recurring, {label: l, amount: a, term: t, type, id: Date.now()}]);
          }} style={styles.addBtn}>+ NEW RECURRING FLOW</button>
        </div>
      </div>
    );
  };

  const ArenaPage = () => (
    <div style={styles.page}>
      <h2 style={{...styles.pageTitle, color: currentStyles.text}}>The Arena</h2>
      <div style={{...styles.vibeCard, background: '#000', color: '#FFF', borderRadius: '24px'}}>
         <p style={styles.label}>MONTHLY AUTOPILOT</p>
         <h3 style={{fontSize: '32px', margin: 0, color: netAutopilot >= 0 ? '#34C759' : '#FF3B30'}}>${netAutopilot}</h3>
         <p style={{fontSize: '11px', opacity: 0.5}}>This is your expected net flow based on recurring data.</p>
         <button onClick={() => setShowAudit(!showAudit)} style={styles.auditBtn}>
            {showAudit ? 'CLOSE AUDIT' : 'GENERATE IN-DEPTH REPORT'}
         </button>
      </div>

      {showAudit && (
        <div style={{...styles.vibeCard, background: currentStyles.card, borderColor: currentStyles.border, marginTop: '20px'}}>
           <p style={styles.label}>FINANCIAL SUSTAINABILITY AUDIT</p>
           <div style={styles.row}><span>Liquidity Reserve</span><span>${stack}</span></div>
           <div style={styles.row}><span>Monthly Op-Ex</span><span>${monthlyOut.toFixed(2)}</span></div>
           <div style={styles.row}><span>Burn Multiplier</span><span>{(stack / (monthlyOut || 1)).toFixed(1)} months</span></div>
           <p style={{fontSize: '11px', marginTop: '15px', color: '#8E8E93', lineHeight: '1.4'}}>
              Forecast: User is currently maintaining a {(stack/goal*100).toFixed(1)}% solvency rate relative to target capital goals.
           </p>
        </div>
      )}
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
        <button onClick={() => setActiveTab('arena')} style={{...styles.navBtn, opacity: activeTab === 'arena' ? 1 : 0.3}}>Arena</button>
      </nav>
    </div>
  );
}

// --- STYLES ---
const lightTheme = { bg: '#FFF', text: '#000', card: '#F2F2F7', border: '#E5E5EA', track: '#E5E5EA' };
const darkTheme = { bg: '#000', text: '#FFF', card: '#1C1C1E', border: '#333', track: '#333' };

const styles = {
  container: { minHeight: '100vh', fontFamily: '-apple-system, sans-serif', padding: '0 24px', paddingBottom: '120px', transition: 'all 0.3s' },
  page: { maxWidth: '400px', margin: '0 auto', paddingTop: '40px' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '60px' },
  logo: { fontWeight: '900', fontSize: '12px', letterSpacing: '2px' },
  themeBtn: { background: '#333', color: '#FFF', border: 'none', padding: '6px 12px', borderRadius: '12px', fontSize: '9px', fontWeight: '800', cursor: 'pointer' },
  hero: { textAlign: 'center', marginBottom: '40px' },
  bigNum: { fontSize: '4.5rem', fontWeight: '900', letterSpacing: '-3px', margin: 0, transition: 'filter 0.3s' },
  label: { fontSize: '10px', fontWeight: '800', color: '#8E8E93', letterSpacing: '1px' },
  track: { width: '100%', height: '8px', borderRadius: '10px', marginTop: '20px', overflow: 'hidden' },
  fill: { height: '100%', transition: 'width 1s' },
  vibeCard: { padding: '24px', borderRadius: '32px', border: '1px solid', marginBottom: '20px' },
  row: { display: 'flex', justifyContent: 'space-between', padding: '16px 0', borderBottom: '1px solid #333', fontSize: '13px', fontWeight: '600' },
  pageTitle: { fontSize: '32px', fontWeight: '900', marginBottom: '30px' },
  labInput: { width: '100%', background: 'transparent', border: 'none', borderBottom: '1px solid #333', marginBottom: '25px', padding: '10px 0', fontSize: '18px', fontWeight: '600', outline: 'none' },
  grid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' },
  mainBtn: { border: 'none', padding: '18px', borderRadius: '22px', fontWeight: '800', cursor: 'pointer' },
  addBtn: { width: '100%', marginTop: '10px', background: 'transparent', border: '1px dashed #AEAEB2', color: '#AEAEB2', padding: '14px', borderRadius: '18px', fontWeight: '700', cursor: 'pointer' },
  delBtn: { background: 'none', border: 'none', color: '#FF3B30', fontSize: '18px', cursor: 'pointer' },
  nav: { position: 'fixed', bottom: '30px', left: '50%', transform: 'translateX(-50%)', width: '260px', background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(20px)', borderRadius: '40px', display: 'flex', justifyContent: 'space-around', padding: '16px' },
  navBtn: { background: 'none', border: 'none', color: '#FFF', fontWeight: '700', fontSize: '12px' },
  auditBtn: { width: '100%', marginTop: '20px', background: '#333', color: '#FFF', border: 'none', padding: '12px', borderRadius: '12px', fontSize: '10px', fontWeight: '800', cursor: 'pointer' }
};

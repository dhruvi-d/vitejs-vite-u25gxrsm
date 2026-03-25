import React, { useState, useEffect } from 'react';

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [isDarkMode, setIsDarkMode] = useState(false);
  
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

  const monthlyIncome = recurring.filter(r => r.type === 'income').reduce((acc, curr) => acc + Number(curr.amount), 0);
  const monthlyBurn = recurring.filter(r => r.type === 'burn').reduce((acc, curr) => acc + Number(curr.amount), 0);
  const netAutopilot = monthlyIncome - monthlyBurn;
  const progress = Math.min(((stack / goal) * 100), 100).toFixed(1);
  const level = Math.floor(progress / 10);

  const currentStyles = isDarkMode ? darkTheme : lightTheme;

  // --- REFINED LOGGING LOGIC ---
  const logTransaction = (label, amount, type) => {
    if(!label || !amount) return;
    const isIncome = type === 'income';
    const finalAmt = isIncome ? Math.abs(Number(amount)) : -Math.abs(Number(amount));
    
    const newEntry = { label, amount: finalAmt, id: Date.now(), type };
    setHistory([newEntry, ...history]);
    setStack(prev => prev + finalAmt);
    if (isIncome) setStreak(s => s + 1);
  };

  const deleteItem = (id, amount) => {
    setHistory(history.filter(item => item.id !== id));
    setStack(prev => prev - amount);
  };

  const HomePage = () => (
    <div style={styles.page}>
      <header style={styles.header}>
        <div style={{...styles.logo, color: currentStyles.text}}>STACKED</div>
        <button onClick={() => setIsDarkMode(!isDarkMode)} style={styles.themeBtn}>{isDarkMode ? 'SNOW' : 'MIDNIGHT'}</button>
      </header>
      <section style={styles.hero}>
        <p style={styles.label}>LVL {level} • {streak} DAY STREAK</p>
        <h1 style={{...styles.bigNum, color: currentStyles.text}}>{progress}%</h1>
        <div style={{...styles.track, background: currentStyles.track}}>
          <div style={{...styles.fill, width: `${progress}%`, background: currentStyles.text}}></div>
        </div>
      </section>
      
      <div style={{...styles.vibeCard, background: currentStyles.card, borderColor: currentStyles.border}}>
         <p style={styles.label}>RECENT ACTIVITY</p>
         {history.length === 0 && <p style={{fontSize: '12px', opacity: 0.4, textAlign: 'center', padding: '20px'}}>No moves yet.</p>}
         {history.map(item => (
           <div key={item.id} style={{...styles.row, color: currentStyles.text, borderBottomColor: currentStyles.border}}>
             <span>{item.label}</span>
             <div style={{display: 'flex', alignItems: 'center', gap: '12px'}}>
                <span style={{color: item.amount > 0 ? '#34C759' : '#FF3B30', fontWeight: '800'}}>
                    {item.amount > 0 ? '+' : '-'}${Math.abs(item.amount)}
                </span>
                <button onClick={() => deleteItem(item.id, item.amount)} style={styles.deleteCircleSmall}>×</button>
             </div>
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
          <p style={styles.label}>QUICK LOG</p>
          <input placeholder="Chipotle, Paycheck, etc." value={name} onChange={e => setName(e.target.value)} style={{...styles.labInput, color: currentStyles.text}} />
          <input type="number" placeholder="0.00" value={val} onChange={e => setVal(e.target.value)} style={{...styles.labInput, color: currentStyles.text}} />
          <div style={styles.grid}>
            <button onClick={() => {logTransaction(name, val, 'income'); setName(''); setVal('')}} style={{...styles.mainBtn, background: '#000', color: '#FFF'}}>+ INCOME</button>
            <button onClick={() => {logTransaction(name, val, 'burn'); setName(''); setVal('')}} style={{...styles.mainBtn, background: '#F2F2F7', color: '#000'}}>- SPEND</button>
          </div>
        </div>
        <div style={{...styles.vibeCard, background: currentStyles.card, borderColor: currentStyles.border}}>
          <p style={styles.label}>RECURRING FLOWS</p>
          {recurring.map(r => (
            <div key={r.id} style={{...styles.row, color: currentStyles.text, borderBottomColor: currentStyles.border}}>
              <span>{r.label}</span>
              <div style={{display: 'flex', gap: '12px', alignItems: 'center'}}>
                <span style={{color: r.type === 'income' ? '#34C759' : '#FF3B30'}}>${r.amount}</span>
                <button onClick={() => setRecurring(recurring.filter(f => f.id !== r.id))} style={styles.deleteCircleSmall}>×</button>
              </div>
            </div>
          ))}
          <button onClick={() => {
            const l = prompt("Name (e.g. Netflix)");
            const a = prompt("Amount");
            const t = confirm("Is this Income?") ? 'income' : 'burn';
            if(l && a) setRecurring([...recurring, {label: l, amount: a, type: t, id: Date.now()}]);
          }} style={styles.addBtn}>+ ADD RECURRING</button>
        </div>
      </div>
    );
  };

  const ArenaPage = () => (
    <div style={styles.page}>
      <h2 style={{...styles.pageTitle, color: currentStyles.text}}>The Arena</h2>
      <div style={{...styles.shareCard, background: isDarkMode ? '#1C1C1E' : '#000', border: isDarkMode ? '1px solid #333' : 'none'}}>
        <p style={styles.miniLabel}>OFFICIAL STATUS CARD</p>
        <div style={styles.flexBetween}>
          <div>
            <h3 style={{fontSize: '32px', margin: 0}}>LEVEL {level}</h3>
            <p style={{fontSize: '14px', fontWeight: '700', color: netAutopilot >= 0 ? '#34C759' : '#FF3B30'}}>
                {netAutopilot >= 0 ? 'W FLOW' : 'L RATIO'}
            </p>
          </div>
          <div style={styles.shareCircle}>{progress}%</div>
        </div>
        <div style={{marginTop: '40px', display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #333', paddingTop: '20px'}}>
           <div><p style={styles.miniLabel}>MONTHLY NET</p><p style={{margin:0}}>${netAutopilot}</p></div>
           <div><p style={styles.miniLabel}>STREAK</p><p style={{margin:0}}>{streak} DAYS</p></div>
        </div>
      </div>
      <div style={{...styles.vibeCard, background: currentStyles.card, borderColor: currentStyles.border, marginTop: '20px'}}>
          <p style={styles.label}>EDIT GOAL</p>
          <input type="number" value={goal} onChange={(e) => setGoal(Number(e.target.value))} style={{...styles.labInput, color: currentStyles.text, marginBottom: 0}} />
      </div>
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

const lightTheme = { bg: '#FFFFFF', text: '#000000', card: '#F9F9FB', border: '#F2F2F7', track: '#F2F2F7' };
const darkTheme = { bg: '#000000', text: '#FFFFFF', card: '#1C1C1E', border: '#2C2C2E', track: '#2C2C2E' };

const styles = {
  container: { minHeight: '100vh', fontFamily: '-apple-system, sans-serif', padding: '0 24px', paddingBottom: '120px', transition: 'all 0.3s ease' },
  page: { maxWidth: '400px', margin: '0 auto', paddingTop: '40px' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '60px' },
  logo: { fontWeight: '900', fontSize: '13px', letterSpacing: '2px' },
  themeBtn: { background: '#000', color: '#FFF', border: 'none', padding: '8px 16px', borderRadius: '20px', fontSize: '10px', fontWeight: '800', cursor: 'pointer' },
  hero: { textAlign: 'center', marginBottom: '40px' },
  bigNum: { fontSize: '7rem', fontWeight: '900', letterSpacing: '-6px', lineHeight: '0.8', margin: 0 },
  label: { fontSize: '10px', fontWeight: '800', color: '#AEAEB2', letterSpacing: '1px', marginBottom: '15px' },
  track: { width: '100%', height: '8px', borderRadius: '10px', marginTop: '30px', overflow: 'hidden' },
  fill: { height: '100%', transition: 'width 1s cubic-bezier(0.4, 0, 0.2, 1)' },
  vibeCard: { padding: '24px', borderRadius: '32px', border: '1px solid', marginBottom: '20px' },
  flexBetween: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  row: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 0', borderBottom: '1px solid', fontSize: '14px', fontWeight: '600' },
  pageTitle: { fontSize: '32px', fontWeight: '900', letterSpacing: '-1px', marginBottom: '30px' },
  labInput: { width: '100%', background: 'transparent', border: 'none', borderBottom: '1px solid #333', marginBottom: '25px', padding: '10px 0', fontSize: '16px', fontWeight: '600', outline: 'none' },
  grid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' },
  mainBtn: { border: 'none', padding: '20px', borderRadius: '22px', fontWeight: '800', cursor: 'pointer' },
  addBtn: { width: '100%', marginTop: '10px', background: 'transparent', border: '1px dashed #AEAEB2', color: '#AEAEB2', padding: '14px', borderRadius: '18px', fontWeight: '700', cursor: 'pointer' },
  deleteCircleSmall: { width: '20px', height: '20px', borderRadius: '50%', background: '#F2F2F7', color: '#8E8E93', border: 'none', fontWeight: '900', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px' },
  nav: { position: 'fixed', bottom: '30px', left: '50%', transform: 'translateX(-50%)', width: '260px', background: 'rgba(0,0,0,0.9)', backdropFilter: 'blur(15px)', borderRadius: '40px', display: 'flex', justifyContent: 'space-around', padding: '16px' },
  navBtn: { background: 'none', border: 'none', color: '#FFF', fontWeight: '700', fontSize: '12px', cursor: 'pointer' },
  shareCard: { color: '#FFF', padding: '40px 30px', borderRadius: '32px' },
  shareCircle: { width: '80px', height: '80px', borderRadius: '50%', border: '4px solid #FFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', fontWeight: '900' },
  miniLabel: { fontSize: '9px', fontWeight: '800', opacity: 0.5, marginBottom: '5px' }
};

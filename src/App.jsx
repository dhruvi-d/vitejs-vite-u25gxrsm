import React, { useState, useEffect } from 'react';

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [stack, setStack] = useState(() => JSON.parse(localStorage.getItem('stack')) || 5000);
  const [goal, setGoal] = useState(() => JSON.parse(localStorage.getItem('goal')) || 100000);
  const [sending, setSending] = useState(300); 
  const [burning, setBurning] = useState(200);
  const [streak, setStreak] = useState(() => JSON.parse(localStorage.getItem('streak')) || 0);
  const [history, setHistory] = useState(() => JSON.parse(localStorage.getItem('history')) || []);

  useEffect(() => {
    localStorage.setItem('stack', JSON.stringify(stack));
    localStorage.setItem('goal', JSON.stringify(goal));
    localStorage.setItem('streak', JSON.stringify(streak));
    localStorage.setItem('history', JSON.stringify(history));
  }, [stack, goal, streak, history]);

  const progress = ((stack / goal) * 100).toFixed(1);
  const level = Math.floor(progress / 10);
  const vibeRatio = ((sending / (sending + burning)) * 100).toFixed(0);
  const isClutch = vibeRatio >= 50;

  const currentStyles = isDarkMode ? darkTheme : lightTheme;

  const addReceipt = (label, amount) => {
    const newEntry = { label, amount, id: Date.now() };
    setHistory([newEntry, ...history]);
    setStack(prev => prev + Number(amount));
    setStreak(s => s + 1);
  };

  // --- PAGES ---
  const HomePage = () => (
    <div style={styles.page}>
      <header style={styles.header}>
        <div style={{...styles.logo, color: currentStyles.text}}>STACKED</div>
        <button onClick={() => setIsDarkMode(!isDarkMode)} style={styles.themeBtn}>
          {isDarkMode ? 'SNOW' : 'MIDNIGHT'}
        </button>
      </header>
      <section style={styles.hero}>
        <p style={styles.label}>LVL {level} STATUS</p>
        <h1 style={{...styles.bigNum, color: currentStyles.text}}>{progress}%</h1>
        <div style={{...styles.track, background: currentStyles.track}}>
          <div style={{...styles.fill, width: `${progress}%`, background: currentStyles.text}}></div>
        </div>
        <p style={{...styles.streakText, color: currentStyles.text}}>WIN STREAK: {streak} DAYS 🔥</p>
      </section>
      
      <div style={{...styles.vibeCard, background: currentStyles.card, borderColor: currentStyles.border}}>
         <p style={styles.label}>RECENT RECEIPTS</p>
         {history.slice(0, 3).map(item => (
           <div key={item.id} style={{...styles.row, color: currentStyles.text, borderBottomColor: currentStyles.border}}>
             <span>{item.label}</span>
             <span style={{color: '#34C759'}}>+${item.amount}</span>
           </div>
         ))}
         {history.length === 0 && <p style={{fontSize: '12px', opacity: 0.5, textAlign: 'center'}}>No wins logged yet.</p>}
      </div>
    </div>
  );

  const LabPage = () => {
    const [tempLabel, setTempLabel] = useState('');
    const [tempAmt, setTempAmt] = useState('');
    return (
      <div style={styles.page}>
        <h2 style={{...styles.pageTitle, color: currentStyles.text}}>The Lab</h2>
        <div style={{...styles.vibeCard, background: currentStyles.card, borderColor: currentStyles.border}}>
          <p style={styles.label}>LOG A NEW WIN</p>
          <input placeholder="Source (e.g. Side Hustle)" value={tempLabel} onChange={e => setTempLabel(e.target.value)} style={{...styles.labInput, color: currentStyles.text}} />
          <input type="number" placeholder="Amount ($)" value={tempAmt} onChange={e => setTempAmt(e.target.value)} style={{...styles.labInput, color: currentStyles.text}} />
          <button onClick={() => {addReceipt(tempLabel, tempAmt); setTempLabel(''); setTempAmt('')}} style={styles.mainBtn}>LOG RECEIPT</button>
        </div>
        <div style={styles.fieldDark}>
          <label style={styles.tileLabel}>NORTH STAR GOAL</label>
          <input type="number" value={goal} onChange={(e) => setGoal(Number(e.target.value))} style={styles.massiveInput} />
        </div>
      </div>
    );
  };

  const ArenaPage = () => (
    <div style={styles.page}>
      <h2 style={{...styles.pageTitle, color: currentStyles.text}}>The Arena</h2>
      <div style={{...styles.shareCard, background: isDarkMode ? '#1C1C1E' : '#000', border: isDarkMode ? '1px solid #333' : 'none'}}>
        <div style={styles.flexBetween}>
          <div>
            <p style={{fontSize: '24px', fontWeight: '900', margin: 0}}>RANK: {level}</p>
            <p style={{fontSize: '12px', fontWeight: '700', opacity: 0.5}}>{isClutch ? 'W FLOW' : 'L RATIO'}</p>
          </div>
          <div style={styles.shareCircle}>{progress}%</div>
        </div>
        <button style={styles.flexBtn}>SAVE FLEX CARD</button>
      </div>
    </div>
  );

  return (
    <div style={{...styles.container, background: currentStyles.bg}}>
      {activeTab === 'home' && <HomePage />}
      {activeTab === 'lab' && <LabPage />}
      {activeTab === 'arena' && <ArenaPage />}
      
      <nav style={styles.nav}>
        <button onClick={() => setActiveTab('home')} style={{...styles.navBtn, opacity: activeTab === 'home' ? 1 : 0.4}}>Home</button>
        <button onClick={() => setActiveTab('lab')} style={{...styles.navBtn, opacity: activeTab === 'lab' ? 1 : 0.4}}>Lab</button>
        <button onClick={() => setActiveTab('arena')} style={{...styles.navBtn, opacity: activeTab === 'arena' ? 1 : 0.4}}>Arena</button>
      </nav>
    </div>
  );
}

const lightTheme = { bg: '#FFFFFF', text: '#000000', card: '#F9F9FB', border: '#F2F2F7', track: '#F2F2F7' };
const darkTheme = { bg: '#000000', text: '#FFFFFF', card: '#1C1C1E', border: '#2C2C2E', track: '#2C2C2E' };

const styles = {
  container: { minHeight: '100vh', fontFamily: '-apple-system, sans-serif', padding: '0 24px', paddingBottom: '120px', transition: 'background 0.3s ease' },
  page: { maxWidth: '400px', margin: '0 auto', paddingTop: '40px' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '60px' },
  logo: { fontWeight: '900', fontSize: '13px', letterSpacing: '2px' },
  themeBtn: { background: '#000', color: '#FFF', border: 'none', padding: '6px 12px', borderRadius: '20px', fontSize: '9px', fontWeight: '800' },
  hero: { textAlign: 'center', marginBottom: '40px' },
  bigNum: { fontSize: '7rem', fontWeight: '900', letterSpacing: '-6px', lineHeight: '0.8', margin: 0 },
  label: { fontSize: '10px', fontWeight: '800', color: '#AEAEB2', letterSpacing: '1px', marginBottom: '15px' },
  track: { width: '100%', height: '8px', borderRadius: '10px', marginTop: '30px', overflow: 'hidden' },
  fill: { height: '100%', transition: 'width 1.2s ease' },
  streakText: { fontSize: '10px', fontWeight: '800', marginTop: '15px' },
  vibeCard: { padding: '24px', borderRadius: '32px', border: '1px solid', marginBottom: '20px' },
  row: { display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid', fontSize: '14px', fontWeight: '600' },
  pageTitle: { fontSize: '32px', fontWeight: '900', letterSpacing: '-1px', marginBottom: '30px' },
  labInput: { width: '100%', background: 'transparent', border: 'none', borderBottom: '1px solid #333', marginBottom: '20px', padding: '10px 0', fontSize: '16px', fontWeight: '600', outline: 'none' },
  mainBtn: { width: '100%', background: '#34C759', color: '#FFF', border: 'none', padding: '18px', borderRadius: '20px', fontWeight: '800', cursor: 'pointer' },
  nav: { position: 'fixed', bottom: '30px', left: '50%', transform: 'translateX(-50%)', width: '260px', background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(15px)', borderRadius: '40px', display: 'flex', justifyContent: 'space-around', padding: '16px', border: '1px solid rgba(255,255,255,0.1)' },
  navBtn: { background: 'none', border: 'none', color: '#FFF', fontWeight: '700', fontSize: '12px' },
  fieldDark: { background: '#1C1C1E', color: '#FFF', padding: '20px', borderRadius: '24px', marginBottom: '10px' },
  massiveInput: { border: 'none', background: 'none', fontSize: '1.4rem', fontWeight: '800', outline: 'none', color: '#FFF', width: '100%' },
  shareCard: { color: '#FFF', padding: '40px 30px', borderRadius: '32px', marginBottom: '40px' },
  flexBetween: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  shareCircle: { width: '70px', height: '70px', borderRadius: '50%', border: '3px solid #FFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', fontWeight: '900' },
  flexBtn: { width: '100%', marginTop: '30px', background: '#FFF', color: '#000', border: 'none', padding: '15px', borderRadius: '15px', fontWeight: '800' }
};

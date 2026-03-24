import React, { useState, useEffect } from 'react';

export default function App() {
  // --- PERSISTENCE LOGIC (The "Memory") ---
  const [current, setCurrent] = useState(() => {
    const saved = localStorage.getItem('stacked_current');
    return saved !== null ? JSON.parse(saved) : 50000;
  });

  const [goal, setGoal] = useState(() => {
    const saved = localStorage.getItem('stacked_goal');
    return saved !== null ? JSON.parse(saved) : 1000000;
  });

  const [monthlyBurn, setMonthlyBurn] = useState(() => {
    const saved = localStorage.getItem('stacked_burn');
    return saved !== null ? JSON.parse(saved) : 2000;
  });

  useEffect(() => {
    localStorage.setItem('stacked_current', JSON.stringify(current));
    localStorage.setItem('stacked_goal', JSON.stringify(goal));
    localStorage.setItem('stacked_burn', JSON.stringify(monthlyBurn));
  }, [current, goal, monthlyBurn]);

  // --- MATH ENGINE ---
  const alignment = ((current / goal) * 100).toFixed(1);
  const runway = monthlyBurn > 0 ? (current / monthlyBurn).toFixed(0) : "∞";

  // --- SHARE FUNCTION (The "Flex") ---
  const handleShare = () => {
    const text = `My North Star Alignment is ${alignment}% on Stacked AI. Get on my level.`;
    alert("Share Card Generated: " + text + "\n\n(In production, this would trigger the Instagram Share API)");
  };

  return (
    <div style={styles.app}>
      {/* Navigation */}
      <div style={styles.nav}>
        <div style={styles.logo}>STACKED <span style={{color: '#FFD700'}}>AI</span></div>
        <button onClick={handleShare} style={styles.shareBtn}>SHARE ALIGNMENT</button>
      </div>

      {/* Gamified Mission */}
      <div style={styles.questContainer}>
        <div style={styles.quest}>
          <span style={styles.questHighlight}>DAILY MISSION:</span> MOVE $50 TO YOUR STACK
        </div>
      </div>

      {/* Main Alignment Display */}
      <main style={styles.hero}>
        <h2 style={styles.subhead}>NORTH STAR ALIGNMENT</h2>
        <div style={styles.mainDisplay}>{alignment}%</div>
        <div style={styles.runwayText}>FINANCIAL RUNWAY: <span style={{color: '#fff'}}>{runway} MONTHS</span></div>
      </main>

      {/* Input Grid */}
      <div style={styles.controlGrid}>
        <div style={styles.card}>
          <label style={styles.cardLabel}>TOTAL LIQUIDITY (THE STACK)</label>
          <input type="number" value={current} onChange={(e) => setCurrent(Number(e.target.value))} style={styles.cardInput} />
        </div>
        <div style={styles.card}>
          <label style={styles.cardLabel}>MONTHLY SPEND (THE BURN)</label>
          <input type="number" value={monthlyBurn} onChange={(e) => setMonthlyBurn(Number(e.target.value))} style={styles.cardInput} />
        </div>
        <div style={styles.card}>
          <label style={styles.cardLabel}>GOAL (THE NORTH STAR)</label>
          <input type="number" value={goal} onChange={(e) => setGoal(Number(e.target.value))} style={styles.cardInput} />
        </div>
      </div>

      <footer style={styles.footer}>
        DESIGNED BY DHRUVI DESAI | PROTOTYPE V1.0.4
      </footer>
    </div>
  );
}

const styles = {
  app: { backgroundColor: '#050505', color: '#fff', minHeight: '100vh', padding: '40px', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif', boxSizing: 'border-box' },
  nav: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' },
  logo: { fontSize: '1.2rem', fontWeight: '900', letterSpacing: '-1px' },
  shareBtn: { background: '#FFD700', color: '#000', border: 'none', padding: '8px 16px', borderRadius: '6px', fontWeight: 'bold', fontSize: '11px', cursor: 'pointer' },
  questContainer: { display: 'flex', justifyContent: 'center', marginBottom: '30px' },
  quest: { background: '#111', padding: '12px 24px', borderRadius: '100px', fontSize: '11px', border: '1px solid #222', color: '#888' },
  questHighlight: { color: '#FFD700', fontWeight: 'bold', marginRight: '8px' },
  hero: { textAlign: 'center', padding: '80px 0', borderTop: '1px solid #111', borderBottom: '1px solid #111', marginBottom: '50px' },
  subhead: { fontSize: '11px', color: '#444', letterSpacing: '4px', marginBottom: '15px', fontWeight: '800' },
  mainDisplay: { fontSize: 'min(20vw, 12rem)', fontWeight: '900', margin: '0', lineHeight: '0.8', letterSpacing: '-8px' },
  runwayText: { marginTop: '30px', color: '#555', fontSize: '12px', letterSpacing: '2px', fontWeight: 'bold' },
  controlGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '15px', maxWidth: '1000px', margin: '0 auto' },
  card: { background: '#0F0F0F', padding: '24px', borderRadius: '16px', border: '1px solid #181818' },
  cardLabel: { display: 'block', fontSize: '9px', color: '#444', marginBottom: '10px', letterSpacing: '1px', fontWeight: 'bold' },
  cardInput: { background: 'none', border: 'none', color: '#fff', fontSize: '1.8rem', fontWeight: 'bold', outline: 'none', width: '100%' },
  footer: { marginTop: '60px', textAlign: 'center', fontSize: '9px', color: '#222', letterSpacing: '2px' }
};
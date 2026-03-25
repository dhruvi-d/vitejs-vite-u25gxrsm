import React, { useState, useEffect } from 'react';

export default function App() {
  const [stack, setStack] = useState(() => JSON.parse(localStorage.getItem('stack')) || 5000);
  const [goal, setGoal] = useState(() => JSON.parse(localStorage.getItem('goal')) || 10000);
  const [sending, setSending] = useState(300); // Future Wealth
  const [burning, setBurning] = useState(200); // Lifestyle

  useEffect(() => {
    localStorage.setItem('stack', JSON.stringify(stack));
    localStorage.setItem('goal', JSON.stringify(goal));
  }, [stack, goal]);

  const progress = ((stack / goal) * 100).toFixed(1);
  const level = Math.floor(progress / 10);
  const vibeRatio = ((sending / (sending + burning)) * 100).toFixed(0);
  const isClutch = vibeRatio >= 50;

  return (
    <div style={styles.container}>
      <main style={styles.main}>
        <header style={styles.header}>
          <div style={styles.logo}>STACKED</div>
          <div style={{...styles.status, background: isClutch ? '#000' : '#F2F2F7', color: isClutch ? '#FFF' : '#000'}}>
            {isClutch ? 'VERIFIED CLUTCH' : 'IMPROVING'}
          </div>
        </header>

        <section style={styles.hero}>
          <p style={styles.label}>LEVEL {level} PROGRESS</p>
          <h1 style={styles.bigNum}>{progress}%</h1>
          <div style={styles.track}><div style={{...styles.fill, width: `${progress}%`}}></div></div>
        </section>

        <div style={styles.vibeCard}>
          <div style={styles.vibeHeader}>
            <span style={styles.vibeLabel}>VIBE CHECK</span>
            <span style={{fontWeight: '900', color: isClutch ? '#34C759' : '#FF3B30'}}>{isClutch ? 'W FLOW' : 'L RATIO'}</span>
          </div>
          <div style={styles.grid}>
            <div style={styles.tile}>
              <label style={styles.tileLabel}>SENDING (INVEST)</label>
              <input type="number" value={sending} onChange={(e) => setSending(Number(e.target.value))} style={styles.input} />
            </div>
            <div style={styles.tile}>
              <label style={styles.tileLabel}>BURNING (SPEND)</label>
              <input type="number" value={burning} onChange={(e) => setBurning(Number(e.target.value))} style={styles.input} />
            </div>
          </div>
        </div>

        <section style={styles.footer}>
          <div style={styles.field}>
            <label style={styles.tileLabel}>TOTAL LIQUID STACK ($)</label>
            <input type="number" value={stack} onChange={(e) => setStack(Number(e.target.value))} style={styles.massiveInput} />
          </div>
          <div style={styles.field}>
            <label style={styles.tileLabel}>NORTH STAR GOAL ($)</label>
            <input type="number" value={goal} onChange={(e) => setGoal(Number(e.target.value))} style={styles.massiveInput} />
          </div>
        </section>
      </main>
    </div>
  );
}

const styles = {
  container: { background: '#FFFFFF', minHeight: '100vh', fontFamily: '-apple-system, sans-serif', color: '#000', padding: '0 24px' },
  main: { maxWidth: '400px', margin: '0 auto', paddingTop: '60px' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '80px' },
  logo: { fontWeight: '900', fontSize: '13px', letterSpacing: '2px' },
  status: { fontSize: '9px', fontWeight: '800', padding: '6px 12px', borderRadius: '30px' },
  hero: { textAlign: 'center', marginBottom: '50px' },
  label: { fontSize: '10px', fontWeight: '700', color: '#AEAEB2', letterSpacing: '1px', marginBottom: '10px' },
  bigNum: { fontSize: '7rem', fontWeight: '900', letterSpacing: '-6px', lineHeight: '0.8', margin: 0 },
  track: { width: '100%', height: '8px', background: '#F2F2F7', borderRadius: '10px', marginTop: '30px', overflow: 'hidden' },
  fill: { height: '100%', background: '#000', transition: 'width 1.2s cubic-bezier(0.2, 0.8, 0.2, 1)' },
  vibeCard: { background: '#F9F9FB', padding: '24px', borderRadius: '32px', border: '1px solid #F2F2F7', marginBottom: '20px' },
  vibeHeader: { display: 'flex', justifyContent: 'space-between', marginBottom: '15px' },
  vibeLabel: { fontSize: '9px', fontWeight: '900', color: '#8E8E93' },
  grid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' },
  tile: { background: '#FFF', padding: '12px', borderRadius: '16px', border: '1px solid #F2F2F7' },
  tileLabel: { fontSize: '8px', fontWeight: '800', color: '#AEAEB2', marginBottom: '4px', display: 'block' },
  input: { border: 'none', background: 'none', fontSize: '1.2rem', fontWeight: '700', outline: 'none', width: '100%' },
  footer: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' },
  field: { background: '#000', color: '#FFF', padding: '20px', borderRadius: '24px' },
  massiveInput: { border: 'none', background: 'none', fontSize: '1.4rem', fontWeight: '800', outline: 'none', color: '#FFF', width: '100%' }
};
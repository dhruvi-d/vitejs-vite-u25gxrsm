import React, { useState, useEffect } from 'react';

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isStealth, setIsStealth] = useState(false);
  const [isAiOpen, setIsAiOpen] = useState(false);
  
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

  // --- COACH AI ENGINE ---
  const [aiMsg, setAiMsg] = useState("Yo! I'm tracking the play. What's the move today?");
  const [userInput, setUserInput] = useState('');

  const askCoach = () => {
    const input = userInput.toLowerCase();
    let response = "Let me look at the numbers... ";
    
    if (input.includes("buy") || input.includes("afford") || input.includes("shoes") || input.includes("food")) {
      const pct = ((200 / stack) * 100).toFixed(0); // Example check for a $200 item
      response = stack > 2000 
        ? `You're up right now, so you can grab it. But just so you know, that's like ${pct}% of your current liquid stack. Still want to pull the trigger?` 
        : `Honestly? Probably a bad move. Your stack is looking a bit thin to be dropping bread on that right now. Let's stack a few more wins first.`;
    } else if (input.includes("goal") || input.includes("far")) {
      response = `You're ${(stack/goal*100).toFixed(1)}% of the way to the big goal. If we keep the burn low this week, we're on track for a level up.`;
    } else if (input.includes("save") || input.includes("help")) {
      response = "The best move right now? Check your recurring flows. If we can cut one small subscription, your 'Autopilot' score goes way up.";
    } else {
      response = "I caught that. Let's keep the momentum going. Every dollar logged is a step toward the goal.";
    }
    setAiMsg(response);
    setUserInput('');
  };

  const currentStyles = isDarkMode ? darkTheme : lightTheme;

  return (
    <div style={{...styles.container, background: currentStyles.bg}}>
      <div style={styles.page}>
        <header style={styles.header}>
            <div style={{...styles.logo, color: currentStyles.text}}>STACKED <span style={styles.aiBadge}>AI</span></div>
            <div style={{display: 'flex', gap: '8px'}}>
                <button onClick={() => setIsStealth(!isStealth)} style={{...styles.themeBtn, background: isStealth ? '#FF3B30' : '#333'}}>STEALTH</button>
                <button onClick={() => setIsDarkMode(!isDarkMode)} style={styles.themeBtn}>{isDarkMode ? 'SNOW' : 'MIDNIGHT'}</button>
            </div>
        </header>

        {activeTab === 'home' && (
            <section style={styles.hero}>
                <p style={styles.label}>TOTAL STACK</p>
                <h1 style={{...styles.bigNum, color: currentStyles.text, filter: isStealth ? 'blur(15px)' : 'none'}}>${stack.toLocaleString()}</h1>
                <div style={{...styles.track, background: currentStyles.track}}>
                    <div style={{...styles.fill, width: `${(stack/goal*100)}%`, background: '#007AFF'}}></div>
                </div>
                <button onClick={() => setIsAiOpen(true)} style={styles.aiTrigger}>✨ CHAT WITH COACH</button>
            </section>
        )}

        {/* AI DRAWER */}
        {isAiOpen && (
            <div style={styles.aiDrawer}>
                <div style={styles.flexBetween}>
                    <span style={{fontWeight: '900', fontSize: '10px', letterSpacing: '1px'}}>COACH ADVICE</span>
                    <button onClick={() => setIsAiOpen(false)} style={styles.closeBtn}>×</button>
                </div>
                <div style={styles.aiBox}>
                    <p style={styles.aiText}>{aiMsg}</p>
                </div>
                <div style={{display: 'flex', gap: '10px', marginTop: 'auto'}}>
                    <input 
                        value={userInput} 
                        onChange={(e) => setUserInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && askCoach()}
                        placeholder="Talk to the coach..." 
                        style={styles.aiInput} 
                    />
                    <button onClick={askCoach} style={styles.sendBtn}>Send</button>
                </div>
            </div>
        )}
      </div>

      <nav style={styles.nav}>
        <button onClick={() => setActiveTab('home')} style={{...styles.navBtn, opacity: activeTab === 'home' ? 1 : 0.3}}>Home</button>
        <button onClick={() => setActiveTab('lab')} style={{...styles.navBtn, opacity: activeTab === 'lab' ? 1 : 0.3}}>Lab</button>
        <button onClick={() => setActiveTab('arena')} style={{...styles.navBtn, opacity: activeTab === 'arena' ? 1 : 0.3}}>Arena</button>
      </nav>
    </div>
  );
}

const lightTheme = { bg: '#FFF', text: '#000', card: '#F2F2F7', border: '#E5E5EA', track: '#E5E5EA' };
const darkTheme = { bg: '#000', text: '#FFF', card: '#1C1C1E', border: '#333', track: '#333' };

const styles = {
  container: { minHeight: '100vh', fontFamily: '-apple-system, sans-serif', padding: '0 24px', transition: '0.3s' },
  page: { maxWidth: '400px', margin: '0 auto', paddingTop: '40px' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '60px' },
  logo: { fontWeight: '900', fontSize: '12px', letterSpacing: '2px' },
  aiBadge: { background: '#007AFF', color: '#FFF', padding: '2px 6px', borderRadius: '4px', fontSize: '8px' },
  themeBtn: { color: '#FFF', border: 'none', padding: '8px 12px', borderRadius: '12px', fontSize: '9px', fontWeight: '800', cursor: 'pointer' },
  hero: { textAlign: 'center' },
  bigNum: { fontSize: '5rem', fontWeight: '900', letterSpacing: '-4px', margin: '10px 0' },
  label: { fontSize: '10px', fontWeight: '800', color: '#8E8E93' },
  track: { width: '100%', height: '10px', borderRadius: '10px', background: '#333', overflow: 'hidden', margin: '20px 0' },
  fill: { height: '100%', transition: 'width 1s' },
  aiTrigger: { width: '100%', padding: '18px', borderRadius: '24px', border: 'none', background: '#1C1C1E', color: '#FFF', fontWeight: '800', cursor: 'pointer', marginTop: '20px' },
  aiDrawer: { position: 'fixed', bottom: 0, left: 0, width: '100%', height: '350px', background: '#000', borderTop: '2px solid #007AFF', padding: '30px', borderTopLeftRadius: '30px', borderTopRightRadius: '30px', display: 'flex', flexDirection: 'column', zIndex: 2000 },
  aiBox: { background: '#1C1C1E', padding: '20px', borderRadius: '20px', margin: '20px 0' },
  aiText: { color: '#FFF', fontSize: '15px', lineHeight: '1.4', margin: 0 },
  aiInput: { flex: 1, background: '#333', border: 'none', padding: '15px', borderRadius: '15px', color: '#FFF', outline: 'none' },
  sendBtn: { background: '#007AFF', border: 'none', color: '#FFF', padding: '0 20px', borderRadius: '15px', fontWeight: '800' },
  closeBtn: { background: 'none', border: 'none', color: '#8E8E93', fontSize: '24px', cursor: 'pointer' },
  flexBetween: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#FFF' },
  nav: { position: 'fixed', bottom: '30px', left: '50%', transform: 'translateX(-50%)', width: '260px', background: 'rgba(0,0,0,0.9)', backdropFilter: 'blur(10px)', borderRadius: '40px', display: 'flex', justifyContent: 'space-around', padding: '16px', zIndex: 1000 },
  navBtn: { background: 'none', border: 'none', color: '#FFF', fontWeight: '700', fontSize: '12px' }
};

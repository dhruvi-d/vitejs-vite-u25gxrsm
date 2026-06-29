import React, { useState, useEffect } from 'react';

export default function App() {
  const [activeTicker, setActiveTicker] = useState('NVDA');
  const [portfolioBalance, setPortfolioBalance] = useState(100000.00);
  const [systemLogs, setSystemLogs] = useState(['Stacked AI Core initialized. Neural weights mapped.']);
  
  // Simulated Live Market Data Matrices (Equity Volatility)
  const [marketMatrix, setMarketMatrix] = useState({
    NVDA: { price: 135.20, history: [132, 133, 131, 134, 135], trend: 'BULLISH' },
    AAPL: { price: 182.50, history: [185, 184, 183, 182, 182.5], trend: 'BEARISH' },
    TSLA: { price: 210.15, history: [195, 200, 204, 208, 210.15], trend: 'VOLATILE' }
  });

  // --- THE PROPRIETARY AI FINANCE ENGINE (Core Machine Learning Logic) ---
  const runQuantitativePrediction = (ticker) => {
    const data = marketMatrix[ticker];
    const historicalPrices = data.history;
    
    // 1. Calculate Simple Moving Average (SMA): Sum of history / period
    const sum = historicalPrices.reduce((acc, p) => acc + p, 0);
    const sma = sum / historicalPrices.length;

    // 2. Linear Regression Delta Calculation (Shorthand Trend Vector)
    // Compares the latest price to the older baseline price to evaluate velocity
    const priceVelocity = data.price - historicalPrices[0];
    
    // 3. Algorithmic AI Signal Generation
    let signal = 'HOLD';
    let confidenceScore = 0;
    let predictedTarget = data.price;

    if (priceVelocity > 0 && data.price > sma) {
      signal = 'STRONG BUY';
      confidenceScore = 88;
      predictedTarget = data.price + (priceVelocity * 0.45); // Extrapolate growth
    } else if (priceVelocity < 0 && data.price < sma) {
      signal = 'LIQUIDATE / SHORT';
      confidenceScore = 92;
      predictedTarget = data.price + (priceVelocity * 0.60); // Extrapolate decay
    } else {
      signal = 'ACCUMULATE';
      confidenceScore = 64;
      predictedTarget = data.price * 1.01;
    }

    setSystemLogs(prev => [
      `[AI MODEL RUN]: Evaluated ${ticker} | SMA: $${sma.toFixed(2)} | Momentum Velocity: ${priceVelocity > 0 ? '+' : ''}${priceVelocity.toFixed(2)}`,
      `[PREDICTION]: Signal Generated: ${signal} (${confidenceScore}% Confidence) -> Target Horizon: $${predictedTarget.toFixed(2)}`,
      ...prev.slice(0, 8)
    ]);
  };

  // Automated background market tick simulator
  useEffect(() => {
    const interval = setInterval(() => {
      setMarketMatrix(prev => {
        const copy = { ...prev };
        Object.keys(copy).forEach(ticker => {
          const drift = (Math.random() * 2 - 1) * (ticker === 'TSLA' ? 2 : 0.8);
          const currentPrice = copy[ticker].price + drift;
          const updatedHistory = [...copy[ticker].history.slice(1), currentPrice];
          
          copy[ticker] = {
            ...copy[ticker],
            price: currentPrice,
            history: updatedHistory
          };
        });
        return copy;
      });
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ minHeight: '100vh', background: '#05050A', color: '#E4E4E7', fontFamily: 'monospace', padding: '32px 16px' }}>
      <div style={{ maxWidth: '460px', margin: '0 auto' }}>
        
        {/* EQUITY TERMINAL HEADER */}
        <header style={{ borderBottom: '1px solid #181825', paddingBottom: '16px', marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <b style={{ letterSpacing: '2px', color: '#FFF', fontSize: '13px' }}>STACKED // PROPRIETARY_AI</b>
            <div style={{ fontSize: '9px', color: '#007AFF', marginTop: '2px' }}>EQUITY PATTERN ENGINE v4.0</div>
          </div>
          <span style={{ fontSize: '9px', background: '#007AFF1A', color: '#007AFF', padding: '4px 8px', borderRadius: '4px', border: '1px solid #007AFF33' }}>PROD_NODE</span>
        </header>

        {/* LIQUID POOL DISPLAY */}
        <section style={{ background: '#0C0C14', border: '1px solid #181825', padding: '20px', borderRadius: '12px', marginBottom: '20px' }}>
          <span style={{ fontSize: '10px', color: '#71717A' }}>SIMULATED INSTITUTIONAL CAPITAL</span>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 'bold', margin: '6px 0', color: '#FFF' }}>
            ${portfolioBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </h2>
        </section>

        {/* EQUITY WATCHLIST TARGET MATRIX */}
        <section style={{ marginBottom: '20px' }}>
          <p style={{ fontSize: '10px', color: '#71717A', marginBottom: '10px' }}>// QUANTITATIVE MONITOR FEED</p>
          {Object.keys(marketMatrix).map(ticker => {
            const data = marketMatrix[ticker];
            return (
              <div key={ticker} onClick={() => setActiveTicker(ticker)} style={{ background: '#0C0C14', border: `1px solid ${activeTicker === ticker ? '#007AFF' : '#181825'}`, padding: '14px', borderRadius: '10px', marginBottom: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}>
                <div>
                  <b style={{ fontSize: '14px', color: '#FFF' }}>{ticker}</b>
                  <div style={{ fontSize: '10px', color: '#71717A', marginTop: '2px' }}>Trend Context: {data.trend}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '14px', fontWeight: 'bold', fontVariantNumeric: 'tabular-nums' }}>${data.price.toFixed(2)}</span>
                </div>
              </div>
            );
          })}
        </section>

        {/* COMPUTE PREDICTION CTA */}
        <button 
          onClick={() => runQuantitativePrediction(activeTicker)}
          style={{ width: '100%', padding: '16px', borderRadius: '12px', background: '#007AFF', color: '#FFF', border: 'none', fontWeight: 'bold', fontSize: '12px', cursor: 'pointer', marginBottom: '20px', letterSpacing: '1px' }}
        >
          RUN PREDICTIVE NEURAL INSTANCE FOR {activeTicker}
        </button>

        {/* AI TERMINAL OUTPUT INTERFACE */}
        <section style={{ background: '#000', border: '1px solid #181825', padding: '16px', borderRadius: '12px' }}>
          <p style={{ fontSize: '10px', color: '#71717A', margin: '0 0 10px 0' }}>// LOGICAL INFERENCE PIPELINE OUTFLOW</p>
          <div style={{ height: '140px', overflowY: 'auto', fontSize: '11px', color: '#A1A1AA', lineHeight: '1.6' }}>
            {systemLogs.map((log, idx) => (
              <div key={idx} style={{ marginBottom: '6px' }}>&gt; {log}</div>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}

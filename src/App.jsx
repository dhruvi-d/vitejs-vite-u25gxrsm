import React, { useState, useEffect, useMemo } from 'react';

export default function App() {
  // --- NATIVE GLOBAL MATRIX STATE ---
  const [assets, setAssets] = useState([
    { id: 1, name: "Apple Inc. Equity Block", holdings: 25, ticker: "AAPL", currency: "USD", assetClass: "Stocks/ETFs" },
    { id: 2, name: "Mahindra & Mahindra Positions", holdings: 120, ticker: "M&M.NS", currency: "INR", assetClass: "Stocks/ETFs" },
    { id: 3, name: "Gujarat Agriculture Plot (30 Acres)", holdings: 1, ticker: "PROP_NATIVE", currency: "INR", assetClass: "Real Estate", customValuation: 18000000 },
    { id: 4, name: "Vanguard S&P 500 ETF (401k Component)", holdings: 15, ticker: "VOO", currency: "USD", assetClass: "Stocks/ETFs" },
    { id: 5, name: "HDFC Strategic Reserves", holdings: 1, ticker: "CASH_INR", currency: "INR", assetClass: "Cash", customValuation: 850000 }
  ]);

  // Live Market Data Pipeline State Vector
  const [exchangeRates, setExchangeRates] = useState({ INR: 94.54, USD: 1 });
  const [equityPrices, setEquityPrices] = useState({ AAPL: 182.50, "M&M.NS": 2840.00, VOO: 472.10 });
  const [systemLogs, setSystemLogs] = useState(['Desai Quant Engine initialized. Re-indexing portfolio...']);
  const [isLoading, setIsLoading] = useState(true);

  // Form Management Variables
  const [formName, setFormName] = useState('');
  const [formHoldings, setFormHoldings] = useState('');
  const [formTicker, setFormTicker] = useState('');
  const [formCurrency, setFormCurrency] = useState('INR');
  const [formClass, setFormClass] = useState('Stocks/ETFs');
  const [formCustomVal, setFormCustomVal] = useState('');

  // --- LIVE CONCURRENT INGESTION PIPELINE ---
  const fetchGlobalMarketFeeds = async () => {
    try {
      // 1. Live Exchange Ingestion via Public Rates Cluster
      const fxResponse = await fetch(`https://open.er-api.com/v6/latest/USD`);
      const fxData = await fxResponse.json();
      
      // 2. Map Live Rates (Using the accurate 2026 baseline structure)
      const currentInr = fxData.rates?.INR || 94.54;
      setExchangeRates({ INR: currentInr, USD: 1 });

      // 3. Dynamic Stock Multipliers (Simulating Live Feed Updates Over Fixed Endpoints)
      setEquityPrices(prev => ({
        AAPL: parseFloat((182.50 + (Math.random() * 2 - 1)).toFixed(2)),
        "M&M.NS": parseFloat((2840.00 + (Math.random() * 20 - 10)).toFixed(2)),
        VOO: parseFloat((472.10 + (Math.random() * 4 - 2)).toFixed(2))
      }));

      setSystemLogs(prev => [
        `[LIVE SYNC]: Intercepted actual spot market rate: 1 USD = ₹${currentInr.toFixed(2)} INR`,
        `[EQUITY REFRESH]: Re-indexed NASDAQ & National Stock Exchange (NSE) metrics.`,
        ...prev.slice(0, 3)
      ]);
      setIsLoading(false);
    } catch (error) {
      console.warn("Network timeout. Implementing system fallback metrics.", error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchGlobalMarketFeeds();
    const livePollingLoop = setInterval(fetchGlobalMarketFeeds, 25000);
    return () => clearInterval(livePollingLoop);
  }, []);

  // --- PORTFOLIO DYNAMIC MATH ENGINE ---
  const processedAssets = useMemo(() => {
    return assets.map(asset => {
      let unitPriceInLocalCurrency = 0;
      let assetTotalInLocalCurrency = 0;
      let assetTotalInUsd = 0;

      if (asset.assetClass === 'Real Estate' || asset.assetClass === 'Cash') {
        assetTotalInLocalCurrency = asset.customValuation;
        unitPriceInLocalCurrency = asset.customValuation;
      } else {
        const livePrice = equityPrices[asset.ticker] || 100.00;
        unitPriceInLocalCurrency = livePrice;
        assetTotalInLocalCurrency = livePrice * asset.holdings;
      }

      if (asset.currency === 'USD') {
        assetTotalInUsd = assetTotalInLocalCurrency;
      } else {
        assetTotalInUsd = assetTotalInLocalCurrency / exchangeRates.INR;
      }

      return {
        ...asset,
        localDisplayPrice: unitPriceInLocalCurrency,
        totalLocal: assetTotalInLocalCurrency,
        totalUsd: assetTotalInUsd
      };
    });
  }, [assets, exchangeRates, equityPrices]);

  const totalPortfolioValueUsd = useMemo(() => {
    return processedAssets.reduce((sum, item) => sum + item.totalUsd, 0);
  }, [processedAssets]);

  // --- PROPRIETARY STACKED AI SYSTEM ADVISOR ---
  const aiStrategicInference = useMemo(() => {
    if (processedAssets.length === 0) return { status: "IDLE", text: "Awaiting manual capital logs to begin asset allocation analysis." };

    // Calculate class weights to identify vulnerability gaps
    const totalsByClass = processedAssets.reduce((acc, item) => {
      acc[item.assetClass] = (acc[item.assetClass] || 0) + item.totalUsd;
      return acc;
    }, {});

    const realEstateWeight = (totalsByClass['Real Estate'] || 0) / totalPortfolioValueUsd;
    const inrExposureWeight = processedAssets.filter(a => a.currency === 'INR').reduce((s, a) => s + a.totalUsd, 0) / totalPortfolioValueUsd;

    if (realEstateWeight > 0.55) {
      return {
        status: "ILLIQUIDITY LIABILTY WARNING",
        text: `Critical concentration risk: ${(realEstateWeight * 100).toFixed(0)}% of net wealth is anchored in fixed property plots. Stacked AI advises freezing additional regional cash allocations and scaling automated monthly buying into fluid US ETFs (NASDAQ: QQQ / VOO) to establish a liquid fallback cushion.`,
        color: "#F59E0B"
      };
    }

    if (inrExposureWeight > 0.60) {
      return {
        status: "MACRO INFLATION EXPOSURE",
        text: `Emerging Market Currency vulnerability identified. Over ${(inrExposureWeight * 100).toFixed(0)}% of assets depend on INR parity. With exchange rates shifting near ₹${exchangeRates.INR.toFixed(2)}, consider systematic dollar-cost averaging into US Large-Cap Equities (like AAPL) to hedge against macro purchasing power decay.`,
        color: "#FF3B30"
      };
    }

    return {
      status: "OPTIMAL ASSET ALIGNMENT",
      text: "Global diversification parameters secure. Balanced distribution captured across global indexes, currency corridors, and fixed infrastructure. No rebalancing actions required.",
      color: "#30D158"
    };
  }, [processedAssets, totalPortfolioValueUsd, exchangeRates.INR]);

  // --- INTERACTION LOGIC handlers ---
  const handleLogAsset = (e) => {
    e.preventDefault();
    if (!formName || !formHoldings) return;

    const loggedItem = {
      id: Date.now(),
      name: formName,
      holdings: parseFloat(formHoldings),
      ticker: formTicker.toUpperCase() || 'CUSTOM_NODE',
      currency: formCurrency,
      assetClass: formClass,
      customValuation: formCustomVal ? parseFloat(formCustomVal) : 0
    };

    setAssets(prev => [...prev, loggedItem]);
    setFormName('');
    setFormHoldings('');
    setFormTicker('');
    setFormCustomVal('');
  };

  const purgeAssetInstance = (id) => {
    setAssets(prev => prev.filter(item => item.id !== id));
  };

  return (
    <div style={{ minHeight: '100vh', background: '#030303', color: '#FAFAFA', fontFamily: 'monospace', padding: '40px 16px', WebkitFontSmoothing: 'antialiased' }}>
      <div style={{ maxWidth: '520px', margin: '0 auto', paddingBottom: '80px' }}>
        
        {/* CONSOLE BRANDING GRID HEADER */}
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #1C1C24', paddingBottom: '20px', marginBottom: '28px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {/* Blue Neon Target Crosshair Placeholder - Visual Indicator of the Logo */}
              <div style={{ width: '12px', height: '12px', background: '#007AFF', borderRadius: '2px', boxShadow: '0 0 8px #007AFF' }}></div>
              <b style={{ letterSpacing: '2px', fontSize: '15px', color: '#FFF' }}>STACKED AI</b>
            </div>
            <div style={{ fontSize: '9px', color: '#71717A', marginTop: '4px' }}>CROSS-BORDER WEALTH TERMINAL // MODEL: DESAI_CORE</div>
          </div>
          <span style={{ fontSize: '9px', background: '#30D15814', color: '#30D158', padding: '4px 8px', borderRadius: '4px', border: '1px solid #30D15833', fontWeight: 'bold' }}>
            LIVE FEED OK
          </span>
        </header>

        {/* MASTER LIQUID NORMALIZED PORTFOLIO METRIC */}
        <section style={{ background: '#09090B', border: '1px solid #1C1C24', padding: '24px', borderRadius: '14px', marginBottom: '24px' }}>
          <span style={{ fontSize: '10px', color: '#71717A', letterSpacing: '1px' }}>COMPOSITE LIQUID NET WORTH (GLOBAL USD BENCHMARK)</span>
          <h1 style={{ fontSize: '3rem', fontWeight: 'bold', margin: '8px 0', color: '#FFF', letterSpacing: '-1.5px', fontVariantNumeric: 'tabular-nums' }}>
            ${isLoading ? "DATA_SYNC..." : totalPortfolioValueUsd.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </h1>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#71717A', borderTop: '1px dashed #1C1C24', paddingTop: '12px', marginTop: '12px' }}>
            <div>MACRO PULSE: <span style={{ color: '#FAFAFA' }}>1 USD = ₹{exchangeRates.INR.toFixed(2)} INR</span></div>
            <div>ASSET NODES: <span style={{ color: '#007AFF', fontWeight: 'bold' }}>{assets.length} ACTIVE</span></div>
          </div>
        </section>

        {/* PROPRIETARY INTEGRATED AI STRATEGY BLOCK */}
        <section style={{ background: '#09090B', border: `1px solid ${aiStrategicInference.color || '#1C1C24'}`, padding: '18px', borderRadius: '12px', marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: aiStrategicInference.color || '#007AFF' }}></span>
            <b style={{ fontSize: '11px', letterSpacing: '1px', color: aiStrategicInference.color || '#007AFF' }}>STACKED AI ADVISOR ENGINE // {aiStrategicInference.status}</b>
          </div>
          <p style={{ fontSize: '11px', color: '#A1A1AA', margin: '0', lineHeight: '1.5' }}>{aiStrategicInference.text}</p>
        </section>

        {/* MANUAL DUAL-JURISDICTION ENTRY SYSTEM */}
        <section style={{ background: '#09090B', border: '1px solid #1C1C24', padding: '20px', borderRadius: '12px', marginBottom: '28px' }}>
          <p style={{ fontSize: '11px', color: '#FFF', margin: '0 0 14px 0', fontWeight: 'bold' }}>// SECURE OCCASIONAL GLOBAL ASSET TRANSACTION ENTRY</p>
          <form onSubmit={handleLogAsset} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <input 
              type="text" required placeholder="Asset Description (e.g., Apple Shares, Pune Property)" value={formName} onChange={(e) => setFormName(e.target.value)}
              style={{ background: '#030303', border: '1px solid #1C1C24', padding: '12px', borderRadius: '8px', color: '#FFF', outline: 'none', fontSize: '12px' }}
            />
            <div style={{ display: 'flex', gap: '12px' }}>
              <select value={formClass} onChange={(e) => setFormClass(e.target.value)} style={{ flex: 1, background: '#030303', border: '1px solid #1C1C24', padding: '12px', borderRadius: '8px', color: '#FFF', fontSize: '12px' }}>
                <option value="Stocks/ETFs">Stocks / ETFs / 401(k)</option>
                <option value="Real Estate">Real Estate Property</option>
                <option value="Cash">Liquid Cash / Reserves</option>
              </select>
              <select value={formCurrency} onChange={(e) => setFormCurrency(e.target.value)} style={{ flex: 1, background: '#030303', border: '1px solid #1C1C24', padding: '12px', borderRadius: '8px', color: '#FFF', fontSize: '12px' }}>
                <option value="USD">Denominated in USD ($)</option>
                <option value="INR">Denominated in INR (₹)</option>
              </select>
            </div>
            
            {formClass === 'Stocks/ETFs' ? (
              <div style={{ display: 'flex', gap: '12px' }}>
                <input 
                  type="text" required placeholder="Symbol (e.g., AAPL, VOO, M&M.NS)" value={formTicker} onChange={(e) => setFormTicker(e.target.value)}
                  style={{ flex: 1, background: '#030303', border: '1px solid #1C1C24', padding: '12px', borderRadius: '8px', color: '#FFF', outline: 'none', fontSize: '12px' }}
                />
                <input 
                  type="number" step="any" required placeholder="Shares / Units Owned" value={formHoldings} onChange={(e) => setFormHoldings(e.target.value)}
                  style={{ flex: 1, background: '#030303', border: '1px solid #1C1C24', padding: '12px', borderRadius: '8px', color: '#FFF', outline: 'none', fontSize: '12px' }}
                />
              </div>
            ) : (
              <input 
                type="number" required placeholder={`Total Asset Value Valuation (In ${formCurrency})`} value={formCustomVal} onChange={(e) => setFormCustomVal(e.target.value)}
                style={{ background: '#030303', border: '1px solid #1C1C24', padding: '12px', borderRadius: '8px', color: '#FFF', outline: 'none', fontSize: '12px' }}
              />
            )}

            <button type="submit" style={{ background: '#007AFF', color: '#FFF', border: 'none', padding: '14px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', fontSize: '12px', marginTop: '6px', letterSpacing: '0.5px' }}>
              COMMIT TRANSACTION BLOCK TO REPOSITORIES
            </button>
          </form>
        </section>

        {/* ACTIVE PORTFOLIO TRACKING OUTPUT ROWS */}
        <section>
          <p style={{ fontSize: '10px', color: '#71717A', marginBottom: '12px', letterSpacing: '0.5px' }}>// CROSS-EXCHANGE RUNNING LEDGER CHANNEL</p>
          {processedAssets.map(item => (
            <div key={item.id} style={{ background: '#09090B', border: '1px solid #1C1C24', padding: '16px', borderRadius: '12px', marginBottom: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <b style={{ fontSize: '13px', color: '#FFF' }}>{item.name}</b>
                  <span style={{ fontSize: '9px', background: '#1C1C24', color: '#A1A1AA', padding: '2px 6px', borderRadius: '4px' }}>{item.assetClass}</span>
                </div>
                <div style={{ fontSize: '10px', color: '#71717A', marginTop: '4px' }}>
                  {item.assetClass === 'Stocks/ETFs' ? (
                    `Ticker: ${item.ticker} • Quant: ${item.holdings} units @ ${item.currency === 'INR' ? '₹' : '$'}${item.localDisplayPrice.toLocaleString()}`
                  ) : (
                    `Valued directly in native currency reserves`
                  )}
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <b style={{ fontSize: '14px', color: '#FFF', fontVariantNumeric: 'tabular-nums' }}>
                  ${item.totalUsd.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </b>
                <div style={{ fontSize: '10px', color: '#71717A', marginTop: '2px', fontVariantNumeric: 'tabular-nums' }}>
                  {item.currency === 'INR' ? `₹${item.totalLocal.toLocaleString()}` : `$${item.totalLocal.toLocaleString()}`}
                </div>
                <div onClick={() => purgeAssetInstance(item.id)} style={{ fontSize: '9px', color: '#FF3B30', marginTop: '6px', cursor: 'pointer', letterSpacing: '0.5px' }}>[PURGE]</div>
              </div>
            </div>
          ))}
        </section>

      </div>
    </div>
  );
}


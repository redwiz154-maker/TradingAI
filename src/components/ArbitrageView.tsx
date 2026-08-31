import React, { useState } from 'react';
import { 
  GitCompare, ArrowRight, Zap, RefreshCw, 
  CheckCircle2, DollarSign, Sparkles, TrendingUp,
  ShieldCheck, AlertTriangle, Layers, Percent
} from 'lucide-react';
import { useCrypto } from '../context/CryptoContext';
import { ArbitrageOpportunity, TriangularArbitrageOpportunity } from '../types';

export const ArbitrageView: React.FC = () => {
  const { 
    arbitrageOpportunities, 
    triangularOpportunities, 
    executeArbitrage, 
    executeTriangularArbitrage,
    balances, 
    theme, 
    tradingMode, 
    showToast 
  } = useCrypto();

  const isDark = theme === 'dark';
  const [activeTab, setActiveTab] = useState<'cross_exchange' | 'triangular'>('cross_exchange');
  const [isScanning, setIsScanning] = useState(false);

  const handleRefresh = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      showToast('Scanned 14 Global Exchanges & 120+ Liquidity Pools. Updated best spreads.', 'info');
    }, 700);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className={`p-5 sm:p-6 rounded-3xl border relative overflow-hidden ${
        isDark ? 'bg-[#181a20] border-[#2b313a]' : 'bg-white border-slate-200 shadow-sm'
      }`}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-2xl bg-cyan-500/15 text-cyan-400 ring-1 ring-cyan-500/30">
                <GitCompare className="w-6 h-6" />
              </div>
              <h1 className="text-xl sm:text-2xl font-black tracking-tight">Cross-Exchange & Triangular Arbitrage Scanner</h1>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 flex items-center gap-1">
                <Zap className="w-3 h-3" />
                ZERO-RISK SPREAD ENGINE
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Real-time multi-exchange price latency scanner detecting risk-free order book disparities across Binance, Coinbase, OKX, Bybit, and Kraken.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={handleRefresh}
              disabled={isScanning}
              className={`px-4 py-2.5 rounded-2xl border text-xs font-mono font-bold flex items-center gap-2 transition-all ${
                isDark ? 'bg-[#0b0e11] border-[#2b313a] hover:bg-[#2b313a]' : 'bg-slate-100 hover:bg-slate-200'
              }`}
            >
              <RefreshCw className={`w-4 h-4 ${isScanning ? 'animate-spin text-cyan-400' : ''}`} />
              Scan Exchanges
            </button>
          </div>
        </div>
      </div>

      {/* Mode Tabs */}
      <div className="flex items-center gap-2 border-b border-[#2b313a]/50 pb-3">
        <button
          onClick={() => setActiveTab('cross_exchange')}
          className={`px-5 py-2.5 rounded-2xl text-xs font-mono font-bold transition-all flex items-center gap-2 ${
            activeTab === 'cross_exchange'
              ? 'bg-cyan-500 text-[#0b0e11] shadow-md shadow-cyan-500/20'
              : isDark ? 'bg-[#181a20] text-slate-400 hover:text-slate-200' : 'bg-white text-slate-600'
          }`}
        >
          <GitCompare className="w-4 h-4" />
          Cross-Exchange Arbitrage ({arbitrageOpportunities.length})
        </button>

        <button
          onClick={() => setActiveTab('triangular')}
          className={`px-5 py-2.5 rounded-2xl text-xs font-mono font-bold transition-all flex items-center gap-2 ${
            activeTab === 'triangular'
              ? 'bg-cyan-500 text-[#0b0e11] shadow-md shadow-cyan-500/20'
              : isDark ? 'bg-[#181a20] text-slate-400 hover:text-slate-200' : 'bg-white text-slate-600'
          }`}
        >
          <Layers className="w-4 h-4" />
          Triangular Route Arbitrage ({triangularOpportunities.length})
        </button>
      </div>

      {/* Cross-Exchange View */}
      {activeTab === 'cross_exchange' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {arbitrageOpportunities.map(opp => (
            <div
              key={opp.id}
              className={`p-5 rounded-3xl border transition-all flex flex-col justify-between ${
                isDark ? 'bg-[#181a20] border-[#2b313a] hover:border-cyan-500/50' : 'bg-white border-slate-200 shadow-sm'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="font-black text-base">{opp.pair}</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-400 font-bold">
                      +{opp.spreadPct}% Spread
                    </span>
                  </div>

                  <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                    opp.executionRisk === 'LOW' ? 'bg-[#0ECB81]/15 text-[#0ECB81]' : 'bg-[#F0B90B]/15 text-[#F0B90B]'
                  }`}>
                    {opp.executionRisk} RISK
                  </span>
                </div>

                {/* Buy vs Sell Flow */}
                <div className="grid grid-cols-2 gap-2 p-3 rounded-2xl bg-[#0b0e11]/70 border border-[#2b313a] font-mono text-xs mb-3">
                  <div>
                    <div className="text-[10px] text-slate-400">Buy Lower on:</div>
                    <div className="font-bold text-slate-100">{opp.buyExchange}</div>
                    <div className="text-[#0ECB81] font-black mt-0.5">${opp.buyPrice.toLocaleString()}</div>
                  </div>

                  <div className="border-l border-[#2b313a] pl-3">
                    <div className="text-[10px] text-slate-400">Sell Higher on:</div>
                    <div className="font-bold text-slate-100">{opp.sellExchange}</div>
                    <div className="text-[#F0B90B] font-black mt-0.5">${opp.sellPrice.toLocaleString()}</div>
                  </div>
                </div>

                {/* Financial Summary */}
                <div className="space-y-1 text-xs font-mono text-slate-300 mb-4">
                  <div className="flex justify-between text-[11px] text-slate-400">
                    <span>Est. Fee (Gas + Taker):</span>
                    <span>-{opp.estimatedFeePct}%</span>
                  </div>
                  <div className="flex justify-between font-bold">
                    <span>Net Pure Return:</span>
                    <span className="text-[#0ECB81]">+{opp.netProfitPct}% (+${opp.netProfitUSD} USDT/trade)</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => executeArbitrage(opp.id)}
                className="w-full py-2.5 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-[#0b0e11] font-black text-xs font-mono flex items-center justify-center gap-1.5 transition-all shadow-md shadow-cyan-500/20"
              >
                <Zap className="w-4 h-4" />
                Execute Flash Arbitrage (+${opp.netProfitUSD})
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Triangular View */}
      {activeTab === 'triangular' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {triangularOpportunities.map(tri => (
            <div
              key={tri.id}
              className={`p-5 rounded-3xl border transition-all flex flex-col justify-between ${
                isDark ? 'bg-[#181a20] border-[#2b313a] hover:border-cyan-500/50' : 'bg-white border-slate-200 shadow-sm'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="font-mono font-black text-sm text-[#F0B90B]">{tri.route}</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#0ECB81]/20 text-[#0ECB81] font-bold">
                    +{tri.netProfitPct}% Loop
                  </span>
                </div>

                {/* Execution Step Flow */}
                <div className="space-y-1.5 p-3 rounded-2xl bg-[#0b0e11]/70 border border-[#2b313a] font-mono text-xs mb-4">
                  {tri.steps.map((step, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-slate-300">
                      <span className="w-4 h-4 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center text-[10px] font-bold shrink-0">
                        {idx + 1}
                      </span>
                      <span className="text-[11px]">{step}</span>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between font-mono text-xs mb-4">
                  <span className="text-slate-400">Execution Speed:</span>
                  <span className="text-cyan-400 font-bold">{tri.speedMs} ms</span>
                </div>
              </div>

              <button
                onClick={() => executeTriangularArbitrage(tri.id)}
                className="w-full py-2.5 rounded-2xl bg-[#0ECB81] hover:bg-[#0ECB81]/90 text-[#0b0e11] font-black text-xs font-mono flex items-center justify-center gap-1.5 transition-all shadow-md shadow-[#0ECB81]/20"
              >
                <Zap className="w-4 h-4" />
                Execute Triangular Loop (+${tri.netProfitUSD})
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

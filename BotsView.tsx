import React, { useState } from 'react';
import { 
  Bot, Sparkles, TrendingUp, Zap, Play, 
  Pause, Trash2, ArrowRight, ShieldCheck, 
  Cpu, CheckCircle2, HelpCircle, Activity 
} from 'lucide-react';
import { useCrypto } from '../context/CryptoContext';
import { GridBot } from '../types';

export const BotsView: React.FC = () => {
  const { 
    selectedCoin, 
    coins, 
    setSelectedCoin, 
    gridBots, 
    createGridBot, 
    toggleBotStatus, 
    stopBot, 
    balances, 
    theme, 
    formatPrice 
  } = useCrypto();

  const [activeTab, setActiveTab] = useState<'create' | 'running' | 'ai_signals'>('create');
  const [botType, setBotType] = useState<'spot_grid' | 'futures_grid' | 'dca_martingale'>('spot_grid');

  // Form states for bot creation
  const [lowerPrice, setLowerPrice] = useState<string>((selectedCoin.price * 0.9).toFixed(selectedCoin.precision));
  const [upperPrice, setUpperPrice] = useState<string>((selectedCoin.price * 1.15).toFixed(selectedCoin.precision));
  const [gridsCount, setGridsCount] = useState<number>(20);
  const [investment, setInvestment] = useState<string>('1000');

  const isDark = theme === 'dark';

  const handleCreateBot = (e: React.FormEvent) => {
    e.preventDefault();
    const lPrice = parseFloat(lowerPrice);
    const uPrice = parseFloat(upperPrice);
    const invest = parseFloat(investment);

    if (!lPrice || !uPrice || !invest || lPrice >= uPrice || invest <= 0) return;

    createGridBot({
      pair: selectedCoin.pair,
      name: `${selectedCoin.symbol} ${botType === 'spot_grid' ? 'Spot Grid' : botType === 'futures_grid' ? 'Futures Grid' : 'DCA Bot'}`,
      type: botType,
      status: 'running',
      lowerPrice: lPrice,
      upperPrice: uPrice,
      grids: gridsCount,
      investment: invest
    });

    setActiveTab('running');
  };

  // AI Signal Calculations
  const rsiVal = 58.4;
  const signalScore = selectedCoin.change24h > 5 ? 'STRONG BUY' : selectedCoin.change24h > 0 ? 'BUY' : 'NEUTRAL / ACCUMULATE';
  const supportZone = (selectedCoin.price * 0.94).toFixed(selectedCoin.precision);
  const resistanceZone = (selectedCoin.price * 1.08).toFixed(selectedCoin.precision);

  return (
    <div className={`flex flex-col h-full overflow-y-auto p-4 lg:p-6 space-y-6 ${
      isDark ? 'bg-[#0b0e11] text-slate-100' : 'bg-slate-50 text-slate-900'
    }`}>
      {/* Top Banner */}
      <div className={`p-6 rounded-3xl border flex flex-wrap items-center justify-between gap-6 relative overflow-hidden ${
        isDark ? 'bg-gradient-to-r from-[#181a20] to-[#1e2329] border-[#2b313a]' : 'bg-white border-slate-200 shadow-md'
      }`}>
        <div className="space-y-1.5 z-10">
          <div className="flex items-center gap-2 text-[#F0B90B] font-bold text-xs">
            <Bot className="w-4 h-4" />
            <span>BINANCE AI STRATEGY POOL</span>
          </div>
          <h2 className="text-2xl font-black tracking-tight">Automated AI & Grid Trading Bots</h2>
          <p className="text-xs text-slate-400 max-w-xl">
            Execute 24/7 automated arbitrage and dollar-cost averaging with institutional quantitative algorithms. Zero coding required.
          </p>
        </div>

        <div className="flex items-center gap-3 z-10">
          <button
            onClick={() => setActiveTab('create')}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs transition-all ${
              activeTab === 'create' 
                ? 'bg-[#F0B90B] text-[#181a20] shadow-md shadow-[#F0B90B]/20' 
                : isDark ? 'bg-[#2b313a] text-slate-300' : 'bg-slate-100 text-slate-700'
            }`}
          >
            Create Trading Bot
          </button>
          <button
            onClick={() => setActiveTab('running')}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs transition-all ${
              activeTab === 'running' 
                ? 'bg-[#F0B90B] text-[#181a20] shadow-md shadow-[#F0B90B]/20' 
                : isDark ? 'bg-[#2b313a] text-slate-300' : 'bg-slate-100 text-slate-700'
            }`}
          >
            Running Bots ({gridBots.length})
          </button>
          <button
            onClick={() => setActiveTab('ai_signals')}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all ${
              activeTab === 'ai_signals' 
                ? 'bg-[#00C8FF] text-[#181a20] shadow-md shadow-[#00C8FF]/20' 
                : isDark ? 'bg-[#2b313a] text-cyan-400' : 'bg-cyan-50 text-cyan-700'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Copilot Signals</span>
          </button>
        </div>
      </div>

      {/* Main Tab Content */}
      {activeTab === 'create' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Bot Configuration Form (7 cols) */}
          <div className={`lg:col-span-7 p-6 rounded-3xl border ${
            isDark ? 'bg-[#121418] border-[#1e2329]' : 'bg-white border-slate-200 shadow-sm'
          }`}>
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
              <span>Setup Automated Strategy for</span>
              <span className="text-[#F0B90B] font-mono">{selectedCoin.pair}</span>
            </h3>

            {/* Bot Strategy Selector */}
            <div className="grid grid-cols-3 gap-2 mb-6">
              {[
                { id: 'spot_grid', label: 'Spot Grid', desc: 'Buy low, sell high in ranges' },
                { id: 'futures_grid', label: 'Futures Grid', desc: '2-way leverage arbitrage' },
                { id: 'dca_martingale', label: 'DCA Martingale', desc: 'Auto recurring buy dips' }
              ].map(b => (
                <button
                  key={b.id}
                  type="button"
                  onClick={() => setBotType(b.id as any)}
                  className={`p-3 rounded-2xl border text-left transition-all ${
                    botType === b.id
                      ? 'border-[#F0B90B] bg-[#F0B90B]/10 text-[#F0B90B]'
                      : isDark ? 'border-[#2b313a] bg-[#181a20] text-slate-300' : 'border-slate-200 bg-slate-50 text-slate-700'
                  }`}
                >
                  <div className="font-bold text-xs mb-1">{b.label}</div>
                  <div className="text-[10px] text-slate-400 leading-tight">{b.desc}</div>
                </button>
              ))}
            </div>

            {/* Form */}
            <form onSubmit={handleCreateBot} className="space-y-4 text-xs font-mono">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 block text-[11px] mb-1">Lower Price Bound (USDT)</label>
                  <input
                    type="number"
                    step="any"
                    value={lowerPrice}
                    onChange={(e) => setLowerPrice(e.target.value)}
                    className={`w-full p-3 rounded-xl border focus:outline-none focus:border-[#F0B90B] font-bold ${
                      isDark ? 'bg-[#0b0e11] border-[#2b313a] text-slate-100' : 'bg-slate-50 border-slate-200 text-slate-900'
                    }`}
                  />
                </div>
                <div>
                  <label className="text-slate-400 block text-[11px] mb-1">Upper Price Bound (USDT)</label>
                  <input
                    type="number"
                    step="any"
                    value={upperPrice}
                    onChange={(e) => setUpperPrice(e.target.value)}
                    className={`w-full p-3 rounded-xl border focus:outline-none focus:border-[#F0B90B] font-bold ${
                      isDark ? 'bg-[#0b0e11] border-[#2b313a] text-slate-100' : 'bg-slate-50 border-slate-200 text-slate-900'
                    }`}
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-400 block text-[11px] mb-1">
                  Grid Intervals Count ({gridsCount} Levels | Est. Profit per Grid: ~0.65%)
                </label>
                <input
                  type="range"
                  min="5"
                  max="100"
                  value={gridsCount}
                  onChange={(e) => setGridsCount(parseInt(e.target.value))}
                  className="w-full accent-[#F0B90B] cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-slate-400 text-[11px]">Investment Capital (USDT)</label>
                  <span className="text-[10px] text-slate-400">
                    Avail: ${(balances.spot.USDT || 0).toLocaleString('en-US')} USDT
                  </span>
                </div>
                <input
                  type="number"
                  step="any"
                  value={investment}
                  onChange={(e) => setInvestment(e.target.value)}
                  placeholder="e.g. 1000"
                  className={`w-full p-3 rounded-xl border focus:outline-none focus:border-[#F0B90B] font-bold text-sm ${
                    isDark ? 'bg-[#0b0e11] border-[#2b313a] text-slate-100' : 'bg-slate-50 border-slate-200 text-slate-900'
                  }`}
                />
              </div>

              {/* Bot Simulation Metrics */}
              <div className={`p-4 rounded-2xl border space-y-2 text-[11px] ${
                isDark ? 'bg-[#181a20] border-[#2b313a]' : 'bg-slate-50 border-slate-200'
              }`}>
                <div className="flex justify-between text-slate-400">
                  <span>Simulated Backtested APY:</span>
                  <span className="text-[#0ECB81] font-bold text-sm">48.60% APR</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Price Range Coverage:</span>
                  <span className="text-slate-200 font-bold">-${formatPrice(parseFloat(lowerPrice) || 0)} ~ ${formatPrice(parseFloat(upperPrice) || 0)}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Zero-Loss Guarantee:</span>
                  <span className="text-[#0ECB81] flex items-center gap-1 font-bold">
                    <ShieldCheck className="w-3.5 h-3.5" /> Backed by Auto-Stop Protection
                  </span>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-2xl bg-[#F0B90B] hover:bg-[#FCD535] text-[#181a20] font-black text-sm shadow-lg shadow-[#F0B90B]/25 active:scale-98 transition-all"
              >
                Launch Automated {botType === 'spot_grid' ? 'Spot Grid' : 'Bot'} Strategy
              </button>
            </form>
          </div>

          {/* Quick AI Strategy Recommendations (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className={`p-5 rounded-3xl border ${
              isDark ? 'bg-[#121418] border-[#1e2329]' : 'bg-white border-slate-200 shadow-sm'
            }`}>
              <div className="flex items-center gap-2 text-[#00C8FF] font-bold text-xs mb-3">
                <Sparkles className="w-4 h-4" />
                <span>Top Ranked Community Bot Presets</span>
              </div>

              <div className="space-y-3">
                {[
                  { name: 'BTC 30-Day Volatility Harvester', apy: '62.4%', users: 4890, pair: 'BTC/USDT' },
                  { name: 'ETH Bull Momentum Martingale', apy: '78.9%', users: 3120, pair: 'ETH/USDT' },
                  { name: 'SOL High Frequency Scalper', apy: '112.5%', users: 8450, pair: 'SOL/USDT' }
                ].map((preset, idx) => (
                  <div
                    key={idx}
                    className={`p-3.5 rounded-2xl border flex items-center justify-between ${
                      isDark ? 'bg-[#181a20] border-[#2b313a]' : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    <div>
                      <h5 className="font-bold text-xs text-slate-100">{preset.name}</h5>
                      <div className="flex items-center gap-3 text-[10px] text-slate-400 mt-1 font-mono">
                        <span>{preset.pair}</span>
                        <span>•</span>
                        <span className="text-[#0ECB81] font-bold">{preset.apy} APY</span>
                        <span>•</span>
                        <span>{preset.users} copiers</span>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        const targetCoin = coins.find(c => c.pair === preset.pair) || selectedCoin;
                        setSelectedCoin(targetCoin);
                        setLowerPrice((targetCoin.price * 0.88).toFixed(targetCoin.precision));
                        setUpperPrice((targetCoin.price * 1.18).toFixed(targetCoin.precision));
                        setInvestment('1500');
                      }}
                      className="px-3 py-1.5 rounded-xl bg-[#F0B90B]/20 hover:bg-[#F0B90B] text-[#F0B90B] hover:text-[#181a20] font-bold text-xs transition-colors"
                    >
                      Copy
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Running Bots Tab */}
      {activeTab === 'running' && (
        <div className="space-y-4">
          {gridBots.length === 0 ? (
            <div className="text-center py-16 text-slate-500">
              <Bot className="w-12 h-12 mx-auto mb-3 opacity-30 text-[#F0B90B]" />
              <h4 className="font-bold text-base text-slate-300">No Active Trading Bots</h4>
              <p className="text-xs max-w-sm mx-auto mt-1">Create an automated grid bot or copy an AI preset to start earning volatility profits 24/7.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {gridBots.map(bot => {
                const isRunning = bot.status === 'running';
                return (
                  <div
                    key={bot.id}
                    className={`p-5 rounded-3xl border flex flex-col justify-between ${
                      isDark ? 'bg-[#181a20] border-[#2b313a]' : 'bg-white border-slate-200 shadow-sm'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <span className={`w-2 h-2 rounded-full ${isRunning ? 'bg-[#0ECB81] animate-pulse' : 'bg-amber-400'}`} />
                          <span className="font-bold text-sm">{bot.name}</span>
                        </div>
                        <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold ${
                          isRunning ? 'bg-[#0ECB81]/20 text-[#0ECB81]' : 'bg-amber-500/20 text-amber-500'
                        }`}>
                          {bot.status}
                        </span>
                      </div>

                      <div className="space-y-2 text-xs font-mono mb-4">
                        <div className="flex justify-between text-slate-400">
                          <span>Investment:</span>
                          <span className="font-bold text-slate-200">${bot.investment.toLocaleString()} USDT</span>
                        </div>
                        <div className="flex justify-between text-slate-400">
                          <span>Total Realized Profit:</span>
                          <span className="font-bold text-[#0ECB81]">+${bot.totalProfit.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-slate-400">
                          <span>Grid Arbitrages Filled:</span>
                          <span className="font-bold text-slate-200">{bot.arbitrageCount} times</span>
                        </div>
                        <div className="flex justify-between text-slate-400">
                          <span>Price Bounds:</span>
                          <span className="text-slate-300">${bot.lowerPrice} ~ ${bot.upperPrice}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pt-3 border-t border-slate-700/40">
                      <button
                        onClick={() => toggleBotStatus(bot.id)}
                        className={`flex-1 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors ${
                          isRunning
                            ? 'bg-amber-500/20 text-amber-400 hover:bg-amber-500 hover:text-slate-900'
                            : 'bg-[#0ECB81]/20 text-[#0ECB81] hover:bg-[#0ECB81] hover:text-white'
                        }`}
                      >
                        {isRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                        <span>{isRunning ? 'Pause Bot' : 'Resume Bot'}</span>
                      </button>

                      <button
                        onClick={() => stopBot(bot.id)}
                        className="p-2 rounded-xl bg-rose-500/20 text-rose-400 hover:bg-rose-500 hover:text-white transition-colors"
                        title="Stop & Cash Out Bot"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* AI Copilot Technical Signals Tab */}
      {activeTab === 'ai_signals' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main AI Signal Radar */}
          <div className={`lg:col-span-2 p-6 rounded-3xl border ${
            isDark ? 'bg-[#121418] border-[#1e2329]' : 'bg-white border-slate-200 shadow-sm'
          }`}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Cpu className="w-5 h-5 text-[#00C8FF]" />
                <h3 className="font-black text-lg">AI Technical Sentiment Radar</h3>
              </div>
              <span className="px-3 py-1 rounded-full bg-[#0ECB81]/20 text-[#0ECB81] font-mono font-bold text-xs">
                {signalScore}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              <div className={`p-4 rounded-2xl border ${isDark ? 'bg-[#181a20] border-[#2b313a]' : 'bg-slate-50 border-slate-200'}`}>
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">RSI (14) Momentum</span>
                <span className="text-xl font-bold font-mono text-[#9945FF]">{rsiVal}</span>
                <span className="text-[10px] text-slate-400 block mt-1">Healthy Bull Trend</span>
              </div>

              <div className={`p-4 rounded-2xl border ${isDark ? 'bg-[#181a20] border-[#2b313a]' : 'bg-slate-50 border-slate-200'}`}>
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Key Support Zone</span>
                <span className="text-xl font-bold font-mono text-[#0ECB81]">${supportZone}</span>
                <span className="text-[10px] text-slate-400 block mt-1">Strong Buy Wall</span>
              </div>

              <div className={`p-4 rounded-2xl border ${isDark ? 'bg-[#181a20] border-[#2b313a]' : 'bg-slate-50 border-slate-200'}`}>
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Target Resistance</span>
                <span className="text-xl font-bold font-mono text-[#F6465D]">${resistanceZone}</span>
                <span className="text-[10px] text-slate-400 block mt-1">Take Profit Target</span>
              </div>
            </div>

            <div className={`p-4 rounded-2xl border ${isDark ? 'bg-[#181a20] border-[#2b313a]' : 'bg-slate-50 border-slate-200'}`}>
              <h5 className="font-bold text-xs text-[#F0B90B] mb-1">AI Recommendation Summary:</h5>
              <p className="text-xs text-slate-300 leading-relaxed font-sans">
                {selectedCoin.symbol} is showing positive volume divergence across 4-hour timeframes with MACD bull crossover confirmed. 
                Suggested entry around <strong className="text-slate-100">${formatPrice(selectedCoin.price)}</strong> with stop-loss set below <strong className="text-rose-400">${supportZone}</strong>.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

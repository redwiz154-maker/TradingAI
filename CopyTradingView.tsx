import React, { useState } from 'react';
import { 
  Users, TrendingUp, ShieldCheck, Award, Flame, 
  Sparkles, CheckCircle2, AlertCircle, Play, Pause, 
  StopCircle, ArrowUpRight, DollarSign, BarChart2,
  Sliders, Star, Wallet
} from 'lucide-react';
import { useCrypto } from '../context/CryptoContext';
import { MasterTrader } from '../types';

export const CopyTradingView: React.FC = () => {
  const { 
    masterTraders, 
    copiedSubscriptions, 
    copyTrader, 
    stopCopyingTrader, 
    balances, 
    theme, 
    tradingMode, 
    showToast 
  } = useCrypto();

  const isDark = theme === 'dark';
  const [selectedTrader, setSelectedTrader] = useState<MasterTrader | null>(null);
  const [copyModalOpen, setCopyModalOpen] = useState(false);
  const [copyAmount, setCopyAmount] = useState('1000');
  const [maxLev, setMaxLev] = useState(20);
  const [stopLossRatio, setStopLossRatio] = useState(15); // 15%
  const [filterStyle, setFilterStyle] = useState<'ALL' | 'AI_QUANT' | 'ELITE' | 'MASTER'>('ALL');

  const filteredTraders = masterTraders.filter(t => {
    if (filterStyle === 'ALL') return true;
    return t.badge === filterStyle;
  });

  const handleOpenCopy = (trader: MasterTrader) => {
    setSelectedTrader(trader);
    setCopyModalOpen(true);
  };

  const handleConfirmCopy = () => {
    if (!selectedTrader) return;
    const amount = parseFloat(copyAmount);
    if (!amount || amount < 50) {
      showToast('Minimum copy allocation is $50 USDT', 'error');
      return;
    }

    const success = copyTrader(selectedTrader.id, amount, maxLev, stopLossRatio / 100);
    if (success) {
      setCopyModalOpen(false);
    }
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
              <div className="p-2 rounded-2xl bg-[#F0B90B]/15 text-[#F0B90B] ring-1 ring-[#F0B90B]/30">
                <Users className="w-6 h-6" />
              </div>
              <h1 className="text-xl sm:text-2xl font-black tracking-tight">AI & Master Copy Trading</h1>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#F0B90B]/15 text-[#F0B90B] border border-[#F0B90B]/30 flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                1-CLICK AUTO MIRROR
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Automatically mirror institutional quant algorithms and top verified traders with customizable risk limits, stop-loss protection, and zero management fees.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className={`px-4 py-2 rounded-2xl border text-xs font-mono font-bold ${
              isDark ? 'bg-[#0b0e11] border-[#2b313a]' : 'bg-slate-100 border-slate-200'
            }`}>
              <span className="text-slate-400">Available Spot USDT: </span>
              <span className="text-[#0ECB81] font-black">${balances.spot.USDT.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Active Copied Subscriptions */}
      {copiedSubscriptions.length > 0 && (
        <div className={`p-5 rounded-3xl border ${
          isDark ? 'bg-[#181a20] border-[#2b313a]' : 'bg-white border-slate-200 shadow-sm'
        }`}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-[#0ECB81]" />
              <h2 className="text-base font-black">My Active Copied Portfolios ({copiedSubscriptions.length})</h2>
            </div>
            <span className="text-xs font-mono text-slate-400">
              Auto-Mirror Active in {tradingMode.toUpperCase()}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {copiedSubscriptions.map(sub => {
              const trader = masterTraders.find(t => t.id === sub.traderId);
              if (!trader) return null;

              return (
                <div
                  key={sub.traderId}
                  className={`p-4 rounded-2xl border ${
                    isDark ? 'bg-[#0b0e11] border-[#2b313a]' : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2.5">
                      <span className="text-2xl">{trader.avatar}</span>
                      <div>
                        <div className="font-black text-sm flex items-center gap-1.5">
                          {trader.name}
                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#F0B90B]/20 text-[#F0B90B] font-mono">
                            {trader.badge}
                          </span>
                        </div>
                        <span className="text-[11px] text-slate-400 font-mono">
                          Allocated: ${sub.allocatedAmountUSD.toLocaleString()} USDT
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => stopCopyingTrader(sub.traderId)}
                      className="px-3 py-1 rounded-xl bg-red-500/15 hover:bg-red-500/25 text-red-400 text-xs font-mono font-bold transition-all"
                    >
                      Stop Copy
                    </button>
                  </div>

                  <div className="grid grid-cols-3 gap-2 py-2 border-y border-[#2b313a]/50 text-center font-mono text-xs">
                    <div>
                      <div className="text-[10px] text-slate-400">Est. PnL</div>
                      <div className="font-bold text-[#0ECB81]">
                        +${(sub.allocatedAmountUSD * 0.045).toFixed(2)}
                      </div>
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-400">Active Trades</div>
                      <div className="font-bold text-slate-100">{sub.activeCopiedPositions}</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-400">Max Lev</div>
                      <div className="font-bold text-[#F0B90B]">{sub.maxLeverage}x</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {(['ALL', 'AI_QUANT', 'ELITE', 'MASTER'] as const).map(badge => (
          <button
            key={badge}
            onClick={() => setFilterStyle(badge)}
            className={`px-4 py-2 rounded-2xl text-xs font-mono font-bold transition-all shrink-0 ${
              filterStyle === badge
                ? 'bg-[#F0B90B] text-[#181a20] shadow-md shadow-[#F0B90B]/20'
                : isDark ? 'bg-[#181a20] text-slate-300 hover:bg-[#2b313a]' : 'bg-white text-slate-700 border border-slate-200'
            }`}
          >
            {badge === 'ALL' ? '🌟 All Master Traders' : badge === 'AI_QUANT' ? '🤖 AI Autonomous Bots' : badge === 'ELITE' ? '👑 Elite Strategists' : '⚡ Master Scalpers'}
          </button>
        ))}
      </div>

      {/* Master Traders Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTraders.map(trader => {
          const isCopied = copiedSubscriptions.some(s => s.traderId === trader.id);

          return (
            <div
              key={trader.id}
              className={`p-5 rounded-3xl border transition-all hover:border-[#F0B90B]/50 flex flex-col justify-between ${
                isDark ? 'bg-[#181a20] border-[#2b313a]' : 'bg-white border-slate-200 shadow-sm'
              }`}
            >
              <div>
                {/* Top Profile Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-[#0b0e11] border border-[#2b313a] flex items-center justify-center text-2xl">
                      {trader.avatar}
                    </div>
                    <div>
                      <div className="font-black text-sm flex items-center gap-1.5">
                        {trader.name}
                      </div>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                          trader.badge === 'AI_QUANT' ? 'bg-purple-500/20 text-purple-400' : 'bg-[#F0B90B]/20 text-[#F0B90B]'
                        }`}>
                          {trader.badge}
                        </span>
                        <span className="text-[11px] text-slate-400 font-mono">
                          {trader.tradingStyle}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right font-mono">
                    <div className="text-[10px] text-slate-400">Profit Share</div>
                    <div className="text-xs font-bold text-slate-200">{trader.profitSharePct}%</div>
                  </div>
                </div>

                {/* Key Metrics */}
                <div className="grid grid-cols-3 gap-2 p-3 rounded-2xl bg-[#0b0e11]/60 border border-[#2b313a]/60 text-center font-mono mb-4">
                  <div>
                    <div className="text-[10px] text-slate-400">30D ROI</div>
                    <div className="text-base font-black text-[#0ECB81]">+{trader.roi30d}%</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-400">Win Rate</div>
                    <div className="text-base font-black text-slate-100">{trader.winRate}%</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-400">Max DD</div>
                    <div className="text-base font-black text-slate-300">{trader.maxDrawdown}%</div>
                  </div>
                </div>

                {/* Recent Trade History Snippet */}
                <div className="space-y-1.5 mb-4">
                  <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400">Recent Completed Trades:</div>
                  <div className="space-y-1">
                    {trader.recentTrades.map((t, idx) => (
                      <div key={idx} className="flex items-center justify-between text-xs font-mono p-1.5 rounded-lg bg-slate-900/40">
                        <span className="text-slate-300 font-bold">{t.pair} ({t.side} {t.leverage}x)</span>
                        <span className="text-[#0ECB81] font-bold">+{t.roi}% (+${t.pnlUSD.toLocaleString()})</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Follow / Copy Action Bar */}
              <div className="pt-2 border-t border-[#2b313a]/50 flex items-center justify-between">
                <div className="text-[11px] font-mono text-slate-400">
                  <span>Followers: <strong>{trader.followers}</strong>/{trader.maxFollowers}</span>
                </div>

                {isCopied ? (
                  <button
                    onClick={() => stopCopyingTrader(trader.id)}
                    className="px-4 py-2 rounded-xl bg-red-500/20 text-red-400 font-bold text-xs font-mono"
                  >
                    Managing Copy
                  </button>
                ) : (
                  <button
                    onClick={() => handleOpenCopy(trader)}
                    className="px-5 py-2 rounded-xl bg-[#F0B90B] hover:bg-[#F0B90B]/90 text-[#181a20] font-black text-xs font-mono shadow-md shadow-[#F0B90B]/20 transition-all flex items-center gap-1.5"
                  >
                    <Users className="w-3.5 h-3.5" />
                    Copy Now
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Copy Settings Modal */}
      {copyModalOpen && selectedTrader && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className={`w-full max-w-md p-6 rounded-3xl border shadow-2xl ${
            isDark ? 'bg-[#181a20] border-[#2b313a]' : 'bg-white border-slate-200'
          }`}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{selectedTrader.avatar}</span>
                <div>
                  <h3 className="text-base font-black">Copy @{selectedTrader.name}</h3>
                  <p className="text-xs text-slate-400">Mode: {tradingMode.toUpperCase()} Portfolio</p>
                </div>
              </div>
            </div>

            <div className="space-y-4 font-mono text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Investment Amount (USDT)</label>
                <div className="relative">
                  <input
                    type="number"
                    value={copyAmount}
                    onChange={(e) => setCopyAmount(e.target.value)}
                    className={`w-full px-3 py-2.5 rounded-xl border text-sm font-bold ${
                      isDark ? 'bg-[#0b0e11] border-[#2b313a] text-slate-100' : 'bg-slate-50 border-slate-300'
                    }`}
                  />
                  <span className="absolute right-3 top-2.5 text-slate-400 font-bold">USDT</span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-400 mt-1">
                  <span>Available: ${balances.spot.USDT.toFixed(2)} USDT</span>
                  <div className="flex gap-1">
                    {['500', '1000', '2500', '5000'].map(val => (
                      <button
                        key={val}
                        onClick={() => setCopyAmount(val)}
                        className="px-1.5 py-0.5 rounded bg-[#2b313a] text-slate-200 hover:text-[#F0B90B]"
                      >
                        ${val}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <label className="text-slate-400">Max Mirror Leverage Cap</label>
                  <span className="text-[#F0B90B] font-bold">{maxLev}x</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="50"
                  value={maxLev}
                  onChange={(e) => setMaxLev(parseInt(e.target.value))}
                  className="w-full accent-[#F0B90B]"
                />
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <label className="text-slate-400">Max Loss Protection (Stop Loss)</label>
                  <span className="text-red-400 font-bold">-{stopLossRatio}%</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="40"
                  value={stopLossRatio}
                  onChange={(e) => setStopLossRatio(parseInt(e.target.value))}
                  className="w-full accent-red-400"
                />
              </div>

              <div className="p-3 rounded-xl bg-[#0b0e11] border border-[#2b313a] text-slate-300 space-y-1">
                <div className="flex justify-between">
                  <span>Trader Win Rate:</span>
                  <span className="font-bold text-[#0ECB81]">{selectedTrader.winRate}%</span>
                </div>
                <div className="flex justify-between">
                  <span>Profit Sharing:</span>
                  <span className="font-bold text-slate-200">{selectedTrader.profitSharePct}% on profits</span>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => setCopyModalOpen(false)}
                  className={`flex-1 py-2.5 rounded-xl text-xs font-bold ${
                    isDark ? 'bg-[#0b0e11] hover:bg-[#2b313a]' : 'bg-slate-100'
                  }`}
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmCopy}
                  className="flex-1 py-2.5 rounded-xl bg-[#F0B90B] hover:bg-[#F0B90B]/90 text-[#181a20] font-black text-xs shadow-lg shadow-[#F0B90B]/20"
                >
                  Start Auto-Copying
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

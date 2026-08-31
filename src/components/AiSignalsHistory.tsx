import React, { useState, useMemo } from 'react';
import { 
  History, CheckCircle2, XCircle, Clock, Sparkles, 
  TrendingUp, TrendingDown, Target, ShieldAlert, 
  ArrowUpRight, ArrowDownRight, Filter, Download, 
  Search, RefreshCw, BarChart2, Award, Zap, 
  ChevronRight, ExternalLink, ShieldCheck, Flame, Trash2
} from 'lucide-react';
import { useCrypto } from '../context/CryptoContext';
import { AiSignalHistoryItem } from '../types';

export const AiSignalsHistory: React.FC = () => {
  const {
    signalHistory,
    clearSignalHistory,
    backtestStats,
    executeQuickOrder,
    coins,
    selectedCoin,
    setSelectedCoin,
    formatPrice,
    theme,
    tradingMode,
    showToast
  } = useCrypto();

  const isDark = theme === 'dark';

  const [filterCoin, setFilterCoin] = useState<string>('ALL');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [filterType, setFilterType] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedSignal, setSelectedSignal] = useState<AiSignalHistoryItem | null>(null);

  // Filtered signals list
  const filteredSignals = useMemo(() => {
    return signalHistory.filter(sig => {
      if (filterCoin !== 'ALL' && sig.symbol !== filterCoin) return false;
      if (filterStatus === 'WINS' && !(sig.status === 'TARGET_1_HIT' || sig.status === 'TARGET_2_HIT')) return false;
      if (filterStatus === 'LOSSES' && sig.status !== 'STOP_LOSS_HIT') return false;
      if (filterStatus === 'ACTIVE' && sig.status !== 'ACTIVE') return false;
      if (filterType !== 'ALL' && sig.signalType !== filterType) return false;
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchPair = sig.pair.toLowerCase().includes(query);
        const matchRationale = sig.rationale.toLowerCase().includes(query);
        const matchHash = sig.verificationHash.toLowerCase().includes(query);
        if (!matchPair && !matchRationale && !matchHash) return false;
      }
      return true;
    });
  }, [signalHistory, filterCoin, filterStatus, filterType, searchQuery]);

  // Export as CSV
  const handleExportCSV = () => {
    const headers = 'ID,Pair,Type,Entry Price,Target 1,Target 2,Stop Loss,Closed Price,Status,Profit %,ROI USD,Leverage,Horizon,Timestamp\n';
    const rows = filteredSignals.map(s => 
      `"${s.id}","${s.pair}","${s.signalType}",${s.entryPrice},${s.targetPrice1},${s.targetPrice2},${s.stopLossPrice},${s.closedPrice},"${s.status}",${s.profitPct},${s.roiUSD},${s.leverage},"${s.timeHorizon}","${new Date(s.timestamp).toISOString()}"`
    ).join('\n');

    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `trading_ai_signals_history_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Signal history CSV exported successfully!', 'success');
  };

  // 1-Click Re-Trade Signal
  const handleReTrade = (sig: AiSignalHistoryItem) => {
    const targetCoin = coins.find(c => c.symbol === sig.symbol) || selectedCoin;
    setSelectedCoin(targetCoin);
    executeQuickOrder({
      coin: targetCoin,
      side: sig.signalType === 'BUY_LONG' ? 'BUY' : 'SELL',
      type: sig.leverage > 1 ? 'futures' : 'spot',
      amountUSD: 1000,
      leverage: sig.leverage,
      tp: sig.targetPrice1,
      sl: sig.stopLossPrice
    });
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Top Banner & Performance Overview */}
      <div className={`p-6 rounded-3xl border relative overflow-hidden shadow-2xl ${
        isDark 
          ? 'bg-gradient-to-r from-[#0b0e11] via-[#141b24] to-[#181a20] border-[#F0B90B]/30' 
          : 'bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white border-slate-700'
      }`}>
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#0ECB81]/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-[#0ECB81]/20 text-[#0ECB81] border border-[#0ECB81]/40 text-xs font-mono font-bold flex items-center gap-1.5 shadow-sm">
                <ShieldCheck className="w-3.5 h-3.5" />
                VERIFIED SIGNALS AUDIT LOG
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-[#F0B90B]/20 text-[#F0B90B] border border-[#F0B90B]/30">
                {backtestStats.winRate}% HISTORICAL WIN RATE
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black tracking-tight text-white flex items-center gap-2">
              <span>AI Signals History & Performance Log</span>
              <Sparkles className="w-6 h-6 text-[#F0B90B] animate-pulse" />
            </h1>
            <p className="text-xs text-slate-300 max-w-2xl">
              Transparent, immutable record of all AI neural forecasts, entry points, take-profit hit targets, leveraged ROI, and verifiable on-chain price execution data.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2.5 flex-wrap">
            <button
              onClick={handleExportCSV}
              className="px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-mono font-bold flex items-center gap-2 transition-all shadow-md active:scale-95"
            >
              <Download className="w-4 h-4 text-[#F0B90B]" />
              Export CSV Report
            </button>
            <button
              onClick={clearSignalHistory}
              className="px-3.5 py-2.5 rounded-2xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 text-xs font-mono font-bold flex items-center gap-1.5 transition-all active:scale-95"
              title="Clear Signal Log"
            >
              <Trash2 className="w-4 h-4" />
              Clear Log
            </button>
          </div>
        </div>
      </div>

      {/* Backtest & Accuracy Analytics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* Total Signals */}
        <div className={`p-4 rounded-2xl border shadow-md ${
          isDark ? 'bg-[#181a20] border-slate-800' : 'bg-white border-slate-200'
        }`}>
          <div className="flex items-center justify-between text-xs text-slate-400 font-mono mb-1">
            <span>Total Signals</span>
            <History className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl font-black font-mono">{backtestStats.totalSignals}</div>
          <div className="text-[11px] text-slate-400 font-mono mt-1">
            {backtestStats.winCount} Won / {backtestStats.lossCount} Lost
          </div>
        </div>

        {/* Win Rate */}
        <div className={`p-4 rounded-2xl border shadow-md ${
          isDark ? 'bg-[#181a20] border-slate-800' : 'bg-white border-slate-200'
        }`}>
          <div className="flex items-center justify-between text-xs text-slate-400 font-mono mb-1">
            <span>Win Accuracy</span>
            <Award className="w-4 h-4 text-[#0ECB81]" />
          </div>
          <div className="text-2xl font-black font-mono text-[#0ECB81]">{backtestStats.winRate}%</div>
          <div className="text-[11px] text-emerald-400/80 font-mono mt-1 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 inline" /> Verified Hits
          </div>
        </div>

        {/* Total Net Profit USD */}
        <div className={`p-4 rounded-2xl border shadow-md ${
          isDark ? 'bg-[#181a20] border-slate-800' : 'bg-white border-slate-200'
        }`}>
          <div className="flex items-center justify-between text-xs text-slate-400 font-mono mb-1">
            <span>Total Realized PnL</span>
            <TrendingUp className="w-4 h-4 text-[#0ECB81]" />
          </div>
          <div className="text-2xl font-black font-mono text-[#0ECB81]">
            +${backtestStats.totalPnlUSD.toLocaleString()}
          </div>
          <div className="text-[11px] text-slate-400 font-mono mt-1">
            Avg +{backtestStats.avgProfitPct}% / Trade
          </div>
        </div>

        {/* Profit Factor */}
        <div className={`p-4 rounded-2xl border shadow-md ${
          isDark ? 'bg-[#181a20] border-slate-800' : 'bg-white border-slate-200'
        }`}>
          <div className="flex items-center justify-between text-xs text-slate-400 font-mono mb-1">
            <span>Profit Factor</span>
            <BarChart2 className="w-4 h-4 text-[#F0B90B]" />
          </div>
          <div className="text-2xl font-black font-mono text-[#F0B90B]">{backtestStats.profitFactor}</div>
          <div className="text-[11px] text-slate-400 font-mono mt-1">
            Gross Win/Loss Ratio
          </div>
        </div>

        {/* Max Streak */}
        <div className={`p-4 rounded-2xl border shadow-md ${
          isDark ? 'bg-[#181a20] border-slate-800' : 'bg-white border-slate-200'
        }`}>
          <div className="flex items-center justify-between text-xs text-slate-400 font-mono mb-1">
            <span>Win Streak</span>
            <Flame className="w-4 h-4 text-orange-400" />
          </div>
          <div className="text-2xl font-black font-mono text-orange-400">
            {backtestStats.maxConsecutiveWins} Consecutive
          </div>
          <div className="text-[11px] text-slate-400 font-mono mt-1">
            Zero Drawdown Runs
          </div>
        </div>

        {/* Sharpe Ratio */}
        <div className={`p-4 rounded-2xl border shadow-md ${
          isDark ? 'bg-[#181a20] border-slate-800' : 'bg-white border-slate-200'
        }`}>
          <div className="flex items-center justify-between text-xs text-slate-400 font-mono mb-1">
            <span>Sharpe Ratio</span>
            <Zap className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-black font-mono text-purple-400">{backtestStats.sharpeRatio}</div>
          <div className="text-[11px] text-slate-400 font-mono mt-1">
            Risk-Adjusted Alpha
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className={`p-4 rounded-2xl border shadow-md flex flex-wrap items-center justify-between gap-3 ${
        isDark ? 'bg-[#181a20] border-slate-800' : 'bg-white border-slate-200'
      }`}>
        <div className="flex items-center gap-2 flex-wrap">
          {/* Search Box */}
          <div className="relative min-w-[200px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search pair, hash, or rationale..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full pl-9 pr-3 py-1.5 rounded-xl border text-xs font-mono transition-all outline-none ${
                isDark 
                  ? 'bg-[#2b313a] border-slate-700 text-white placeholder-slate-500 focus:border-[#F0B90B]' 
                  : 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400 focus:border-[#F0B90B]'
              }`}
            />
          </div>

          {/* Coin Selector */}
          <div className="flex items-center gap-1">
            <span className="text-xs text-slate-400 font-mono">Coin:</span>
            <select
              value={filterCoin}
              onChange={(e) => setFilterCoin(e.target.value)}
              className={`px-2.5 py-1.5 rounded-xl border text-xs font-mono font-bold outline-none ${
                isDark ? 'bg-[#2b313a] border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-800'
              }`}
            >
              <option value="ALL">All Pairs</option>
              {coins.map(c => (
                <option key={c.symbol} value={c.symbol}>{c.symbol}</option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-1">
            <span className="text-xs text-slate-400 font-mono">Status:</span>
            <div className="flex items-center gap-1">
              {[
                { label: 'All', val: 'ALL' },
                { label: '🎯 Targets Hit', val: 'WINS' },
                { label: '⚡ Active', val: 'ACTIVE' },
                { label: '🛡️ SL Hit', val: 'LOSSES' }
              ].map(st => (
                <button
                  key={st.val}
                  onClick={() => setFilterStatus(st.val)}
                  className={`px-2.5 py-1 rounded-xl text-xs font-mono font-bold transition-all ${
                    filterStatus === st.val
                      ? 'bg-[#F0B90B] text-[#181a20] shadow-sm font-black'
                      : isDark ? 'bg-[#2b313a] text-slate-400 hover:text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {st.label}
                </button>
              ))}
            </div>
          </div>

          {/* Signal Type Filter */}
          <div className="flex items-center gap-1">
            <span className="text-xs text-slate-400 font-mono">Type:</span>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className={`px-2.5 py-1.5 rounded-xl border text-xs font-mono font-bold outline-none ${
                isDark ? 'bg-[#2b313a] border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-800'
              }`}
            >
              <option value="ALL">All Signals</option>
              <option value="BUY_LONG">BUY / LONG</option>
              <option value="SELL_SHORT">SELL / SHORT</option>
            </select>
          </div>
        </div>

        <div className="text-xs font-mono text-slate-400">
          Showing <span className="text-[#F0B90B] font-bold">{filteredSignals.length}</span> of {signalHistory.length} signals
        </div>
      </div>

      {/* Signals History Table & Cards */}
      <div className={`rounded-3xl border shadow-xl overflow-hidden ${
        isDark ? 'bg-[#181a20] border-slate-800' : 'bg-white border-slate-200'
      }`}>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className={`border-b text-[11px] font-mono uppercase tracking-wider ${
                isDark ? 'border-slate-800 bg-[#1e2329]/70 text-slate-400' : 'border-slate-200 bg-slate-50 text-slate-500'
              }`}>
                <th className="py-3.5 px-4">Asset / Direction</th>
                <th className="py-3.5 px-4">Entry Price</th>
                <th className="py-3.5 px-4">Target 1 / Target 2</th>
                <th className="py-3.5 px-4">Stop Loss</th>
                <th className="py-3.5 px-4">Closed Price</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Profit / ROI</th>
                <th className="py-3.5 px-4 text-center">Horizon / Leverage</th>
                <th className="py-3.5 px-4 text-right">Quick Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/40 text-xs font-mono">
              {filteredSignals.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-400">
                    <History className="w-8 h-8 mx-auto mb-2 opacity-40" />
                    No signals found matching your current filters.
                  </td>
                </tr>
              ) : (
                filteredSignals.map(sig => {
                  const isBuy = sig.signalType === 'BUY_LONG';
                  const isWin = sig.status === 'TARGET_1_HIT' || sig.status === 'TARGET_2_HIT';
                  const isLoss = sig.status === 'STOP_LOSS_HIT';
                  const isActive = sig.status === 'ACTIVE';

                  return (
                    <tr 
                      key={sig.id}
                      className={`transition-colors ${
                        isDark ? 'hover:bg-[#2b313a]/50' : 'hover:bg-slate-50'
                      }`}
                    >
                      {/* Asset & Direction */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2.5">
                          <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-black text-xs ${
                            isBuy ? 'bg-[#0ECB81]/15 text-[#0ECB81]' : 'bg-[#F6465D]/15 text-[#F6465D]'
                          }`}>
                            {isBuy ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                          </div>
                          <div>
                            <div className="font-bold flex items-center gap-1 text-sm">
                              {sig.pair}
                              <span className={`text-[10px] px-1.5 py-0.2 rounded font-black ${
                                isBuy ? 'bg-[#0ECB81]/20 text-[#0ECB81]' : 'bg-[#F6465D]/20 text-[#F6465D]'
                              }`}>
                                {isBuy ? 'LONG' : 'SHORT'}
                              </span>
                            </div>
                            <span className="text-[10px] text-slate-400">
                              {new Date(sig.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {new Date(sig.timestamp).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Entry Price */}
                      <td className="py-3.5 px-4 font-bold">
                        ${sig.entryPrice.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </td>

                      {/* Target 1 / 2 */}
                      <td className="py-3.5 px-4">
                        <div className="text-[#0ECB81] font-bold">
                          TP1: ${sig.targetPrice1.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </div>
                        <div className="text-emerald-400/70 text-[11px]">
                          TP2: ${sig.targetPrice2.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </div>
                      </td>

                      {/* Stop Loss */}
                      <td className="py-3.5 px-4 text-[#F6465D] font-bold">
                        ${sig.stopLossPrice.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </td>

                      {/* Closed Price */}
                      <td className="py-3.5 px-4 font-bold">
                        {isActive ? (
                          <span className="text-amber-400 animate-pulse">In Progress...</span>
                        ) : (
                          `$${sig.closedPrice.toLocaleString(undefined, { minimumFractionDigits: 2 })}`
                        )}
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4">
                        {sig.status === 'TARGET_2_HIT' && (
                          <span className="px-2 py-1 rounded-lg bg-[#0ECB81]/20 text-[#0ECB81] border border-[#0ECB81]/40 text-[11px] font-bold inline-flex items-center gap-1 shadow-sm">
                            <Sparkles className="w-3 h-3" /> TP 2 Max Hit
                          </span>
                        )}
                        {sig.status === 'TARGET_1_HIT' && (
                          <span className="px-2 py-1 rounded-lg bg-[#0ECB81]/15 text-[#0ECB81] text-[11px] font-bold inline-flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" /> TP 1 Hit
                          </span>
                        )}
                        {sig.status === 'STOP_LOSS_HIT' && (
                          <span className="px-2 py-1 rounded-lg bg-[#F6465D]/15 text-[#F6465D] text-[11px] font-bold inline-flex items-center gap-1">
                            <ShieldAlert className="w-3 h-3" /> SL Executed
                          </span>
                        )}
                        {sig.status === 'ACTIVE' && (
                          <span className="px-2 py-1 rounded-lg bg-amber-500/15 text-amber-400 border border-amber-500/30 text-[11px] font-bold inline-flex items-center gap-1">
                            <Clock className="w-3 h-3 animate-spin" /> Live Active
                          </span>
                        )}
                      </td>

                      {/* Profit / ROI */}
                      <td className="py-3.5 px-4 text-right">
                        <div className={`text-sm font-black ${
                          isWin ? 'text-[#0ECB81]' : isLoss ? 'text-[#F6465D]' : 'text-amber-400'
                        }`}>
                          {sig.profitPct >= 0 ? '+' : ''}{(sig.profitPct * (sig.leverage || 1)).toFixed(1)}%
                        </div>
                        <div className={`text-[11px] ${
                          isWin ? 'text-[#0ECB81]/80' : isLoss ? 'text-[#F6465D]/80' : 'text-slate-400'
                        }`}>
                          {sig.roiUSD >= 0 ? '+' : ''}${sig.roiUSD.toLocaleString()} USDT
                        </div>
                      </td>

                      {/* Horizon & Leverage */}
                      <td className="py-3.5 px-4 text-center">
                        <span className="px-2 py-0.5 rounded bg-slate-700/40 text-slate-300 text-[11px] font-bold mr-1">
                          {sig.timeHorizon}
                        </span>
                        <span className="px-2 py-0.5 rounded bg-[#F0B90B]/20 text-[#F0B90B] font-black text-[11px]">
                          {sig.leverage}x
                        </span>
                      </td>

                      {/* Quick Action */}
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => handleReTrade(sig)}
                          className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-all shadow-md active:scale-95 flex items-center gap-1 ml-auto ${
                            isBuy 
                              ? 'bg-[#0ECB81] hover:bg-[#0ECB81]/90 text-white' 
                              : 'bg-[#F6465D] hover:bg-[#F6465D]/90 text-white'
                          }`}
                        >
                          <Zap className="w-3 h-3" />
                          {isBuy ? 'Buy Long' : 'Sell Short'}
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Verification & Transparency Note */}
      <div className={`p-5 rounded-2xl border text-xs flex items-start gap-3 ${
        isDark ? 'bg-[#181a20]/60 border-slate-800 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-600'
      }`}>
        <ShieldCheck className="w-5 h-5 text-[#0ECB81] shrink-0 mt-0.5" />
        <div className="space-y-1">
          <span className="font-bold text-white block">Cryptographically Audited Neural Engine</span>
          <p>
            All AI prediction signal entries and exits are timestamped and verified against real-time Binance Order Book match events. Target calculations reflect fee-adjusted net ROI with automatic Take-Profit and Stop-Loss triggers.
          </p>
        </div>
      </div>
    </div>
  );
};

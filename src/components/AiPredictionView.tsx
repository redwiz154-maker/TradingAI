import React, { useState } from 'react';
import { 
  Sparkles, TrendingUp, TrendingDown, Target, ShieldAlert, 
  Zap, Brain, Cpu, BarChart2, Activity, ArrowRight, 
  CheckCircle2, AlertTriangle, Play, RefreshCw, Layers, 
  Sliders, MessageSquare, Send, Check, ShieldCheck, Flame,
  History, ArrowUpRight, ArrowDownRight, DollarSign
} from 'lucide-react';
import { useCrypto } from '../context/CryptoContext';
import { CryptoCoin } from '../types';
import { generateAiPrediction } from '../data/newsAndPredictionData';
import { AiSignalsHistory } from './AiSignalsHistory';
import { TechnicalScreener } from './TechnicalScreener';

export const AiPredictionView: React.FC = () => {
  const {
    selectedCoin,
    setSelectedCoin,
    coins,
    predictionHorizon,
    setPredictionHorizon,
    activePrediction,
    executeAiSignal,
    executeQuickOrder,
    signalHistory,
    backtestStats,
    tradingMode,
    formatPrice,
    balances,
    theme,
    copilotMessages,
    sendCopilotMessage,
    showToast
  } = useCrypto();

  const [activeTab, setActiveTab] = useState<'FORECAST' | 'HISTORY' | 'SCREENER' | 'COPILOT'>('FORECAST');
  const [tradeAmountUSD, setTradeAmountUSD] = useState<number>(1000);
  const [executionType, setExecutionType] = useState<'futures' | 'spot'>('futures');
  const [selectedLeverage, setSelectedLeverage] = useState<number>(20);
  const [customTp, setCustomTp] = useState<string>('');
  const [customSl, setCustomSl] = useState<string>('');
  const [copilotInput, setCopilotInput] = useState('');
  const [isExecuting, setIsExecuting] = useState(false);

  const isDark = theme === 'dark';
  const isBullish = activePrediction.direction === 'BULLISH';

  const availableUsdt = executionType === 'futures' 
    ? (balances.futures.USDT || 0) 
    : (balances.spot.USDT || 0);

  // Instant BUY (Long) Action
  const handleBuyOrder = () => {
    setIsExecuting(true);
    setTimeout(() => {
      executeQuickOrder({
        coin: selectedCoin,
        side: 'BUY',
        type: executionType,
        amountUSD: tradeAmountUSD,
        leverage: executionType === 'futures' ? selectedLeverage : 1,
        tp: customTp ? parseFloat(customTp) : activePrediction.targetPrice,
        sl: customSl ? parseFloat(customSl) : activePrediction.stopLossPrice
      });
      setIsExecuting(false);
    }, 350);
  };

  // Instant SELL (Short) Action
  const handleSellOrder = () => {
    setIsExecuting(true);
    setTimeout(() => {
      executeQuickOrder({
        coin: selectedCoin,
        side: 'SELL',
        type: executionType,
        amountUSD: tradeAmountUSD,
        leverage: executionType === 'futures' ? selectedLeverage : 1,
        tp: customTp ? parseFloat(customTp) : (selectedCoin.price * 0.95),
        sl: customSl ? parseFloat(customSl) : (selectedCoin.price * 1.03)
      });
      setIsExecuting(false);
    }, 350);
  };

  const handleSendCopilot = (e: React.FormEvent) => {
    e.preventDefault();
    if (!copilotInput.trim()) return;
    sendCopilotMessage(copilotInput);
    setCopilotInput('');
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Top AI Engine Header Banner */}
      <div className={`p-6 rounded-3xl border relative overflow-hidden shadow-2xl ${
        isDark 
          ? 'bg-gradient-to-r from-[#0b0e11] via-[#141b24] to-[#181a20] border-[#F0B90B]/30' 
          : 'bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white border-slate-700'
      }`}>
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#F0B90B]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-3 py-1 rounded-full bg-[#F0B90B]/20 text-[#F0B90B] border border-[#F0B90B]/40 text-xs font-mono font-bold flex items-center gap-1.5 shadow-sm">
                <Brain className="w-3.5 h-3.5" />
                NEURAL QUANT PREDICTOR V4.2
              </span>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-mono font-bold ${
                tradingMode === 'demo' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' : 'bg-[#0ECB81]/20 text-[#0ECB81] border border-[#0ECB81]/30'
              }`}>
                {tradingMode === 'demo' ? '🎮 DEMO PAPER TRADING ($100k)' : '💼 REAL ACCOUNT EXECUTION'}
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-[#0ECB81]/20 text-[#0ECB81] border border-[#0ECB81]/30">
                🎯 {backtestStats.winRate}% Verified Accuracy
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black tracking-tight text-white flex items-center gap-2">
              <span>Trading AI Price Prediction & Signals Terminal</span>
              <Sparkles className="w-6 h-6 text-[#F0B90B] animate-pulse" />
            </h1>
            <p className="text-xs text-slate-300 max-w-2xl">
              Deep neural price forecasting with multi-timeframe analytics, instant 1-click Buy Long & Sell Short execution, and verifiable historical signal audit tracking.
            </p>
          </div>

          {/* Sub-Tabs Selector */}
          <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-black/40 border border-white/10 flex-wrap">
            <button
              onClick={() => setActiveTab('FORECAST')}
              className={`px-3.5 py-2 rounded-xl font-mono text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'FORECAST'
                  ? 'bg-[#F0B90B] text-[#181a20] shadow-md shadow-[#F0B90B]/20 font-black'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Forecast & Trade</span>
            </button>
            <button
              onClick={() => setActiveTab('HISTORY')}
              className={`px-3.5 py-2 rounded-xl font-mono text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'HISTORY'
                  ? 'bg-[#F0B90B] text-[#181a20] shadow-md shadow-[#F0B90B]/20 font-black'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <History className="w-3.5 h-3.5" />
              <span>Signals History ({signalHistory.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('SCREENER')}
              className={`px-3.5 py-2 rounded-xl font-mono text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'SCREENER'
                  ? 'bg-[#F0B90B] text-[#181a20] shadow-md shadow-[#F0B90B]/20 font-black'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <Activity className="w-3.5 h-3.5" />
              <span>Screener</span>
            </button>
            <button
              onClick={() => setActiveTab('COPILOT')}
              className={`px-3.5 py-2 rounded-xl font-mono text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'COPILOT'
                  ? 'bg-[#F0B90B] text-[#181a20] shadow-md shadow-[#F0B90B]/20 font-black'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <Brain className="w-3.5 h-3.5" />
              <span>Copilot Chat</span>
            </button>
          </div>
        </div>
      </div>

      {/* Render History Tab */}
      {activeTab === 'HISTORY' && (
        <AiSignalsHistory />
      )}

      {/* Render Screener Tab */}
      {activeTab === 'SCREENER' && (
        <TechnicalScreener />
      )}

      {/* Render Copilot Full Tab */}
      {activeTab === 'COPILOT' && (
        <div className={`p-6 rounded-3xl border shadow-xl space-y-4 max-w-4xl mx-auto flex flex-col h-[600px] ${
          isDark ? 'bg-[#181a20] border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-900'
        }`}>
          <div className="flex items-center justify-between pb-3 border-b border-slate-700/30">
            <div className="flex items-center gap-2">
              <Brain className="w-5 h-5 text-[#F0B90B]" />
              <div>
                <h3 className="font-black text-sm">Trading AI Strategy Copilot</h3>
                <p className="text-[11px] text-slate-400">Ask about trade setups, support/resistance, RSI divergence, or macro news</p>
              </div>
            </div>
            <span className="px-2.5 py-0.5 rounded-full bg-[#0ECB81]/15 text-[#0ECB81] text-xs font-mono font-bold">
              🟢 Ready
            </span>
          </div>

          <div className="flex-1 overflow-y-auto space-y-3 pr-2 text-xs">
            {copilotMessages.map(msg => (
              <div
                key={msg.id}
                className={`p-4 rounded-2xl max-w-[85%] leading-relaxed ${
                  msg.sender === 'ai'
                    ? isDark ? 'bg-[#0b0e11] text-slate-200 border border-slate-800' : 'bg-slate-100 text-slate-800 border border-slate-200'
                    : 'bg-[#F0B90B] text-[#181a20] font-medium ml-auto shadow-md'
                }`}
              >
                <p className="whitespace-pre-line">{msg.text}</p>
              </div>
            ))}
          </div>

          <form onSubmit={handleSendCopilot} className="flex gap-2 pt-3 border-t border-slate-700/30">
            <input
              type="text"
              value={copilotInput}
              onChange={e => setCopilotInput(e.target.value)}
              placeholder={`Ask AI Copilot for a trade setup on ${selectedCoin.symbol} (e.g. 'What is the best entry for BTC right now?')...`}
              className={`flex-1 px-4 py-3 rounded-2xl text-xs border outline-none font-sans ${
                isDark ? 'bg-[#0b0e11] border-slate-700 text-white placeholder-slate-500' : 'bg-slate-50 border-slate-300 text-slate-900'
              }`}
            />
            <button
              type="submit"
              className="px-5 py-3 rounded-2xl bg-[#F0B90B] hover:bg-[#FCD535] text-[#181a20] font-black text-xs flex items-center gap-1.5 transition-colors shadow-md"
            >
              <Send className="w-4 h-4" />
              Send
            </button>
          </form>
        </div>
      )}

      {/* Main Forecast & Execution View */}
      {activeTab === 'FORECAST' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left 7 Cols: Active Forecast Details */}
          <div className="lg:col-span-7 space-y-6">
            {/* Featured Prediction Hero Card */}
            <div className={`p-6 rounded-3xl border shadow-xl space-y-6 relative overflow-hidden ${
              isDark ? 'bg-[#181a20] border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-900'
            }`}>
              {/* Coin Header & Selector */}
              <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-700/30">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-lg shadow-md ${selectedCoin.iconBg}`}>
                    {selectedCoin.symbol.slice(0, 3)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-xl font-black">{selectedCoin.pair}</h2>
                      <span className="text-xs font-mono px-2 py-0.5 rounded-lg bg-slate-700/40 text-slate-300">
                        {selectedCoin.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-sm font-mono font-bold text-slate-400">Current:</span>
                      <span className="text-lg font-mono font-black text-white">
                        ${formatPrice(selectedCoin.price, selectedCoin.precision)}
                      </span>
                      <span className={`text-xs font-mono font-bold px-1.5 py-0.5 rounded ${
                        selectedCoin.change24h >= 0 ? 'bg-[#0ECB81]/15 text-[#0ECB81]' : 'bg-[#F6465D]/15 text-[#F6465D]'
                      }`}>
                        {selectedCoin.change24h >= 0 ? '+' : ''}{selectedCoin.change24h}%
                      </span>
                    </div>
                  </div>
                </div>

                {/* Quick Coin Picker */}
                <div className="flex items-center gap-1.5 flex-wrap">
                  {coins.slice(0, 6).map(c => (
                    <button
                      key={c.id}
                      onClick={() => setSelectedCoin(c)}
                      className={`px-2.5 py-1.5 rounded-xl font-mono text-xs font-bold transition-all ${
                        selectedCoin.id === c.id
                          ? 'bg-[#F0B90B] text-[#181a20] shadow-md shadow-[#F0B90B]/20 font-black'
                          : isDark ? 'bg-[#2b313a] text-slate-300 hover:text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {c.symbol}
                    </button>
                  ))}
                </div>
              </div>

              {/* Time Horizon Selector */}
              <div className="flex items-center justify-between gap-2 p-3 rounded-2xl bg-black/30 border border-white/5">
                <span className="text-xs text-slate-400 font-mono">Prediction Timeframe:</span>
                <div className="grid grid-cols-5 gap-1">
                  {(['15m', '1h', '4h', '24h', '7d'] as const).map(horizon => (
                    <button
                      key={horizon}
                      onClick={() => setPredictionHorizon(horizon)}
                      className={`px-2.5 py-1 rounded-xl font-mono text-xs font-bold transition-all ${
                        predictionHorizon === horizon
                          ? 'bg-[#F0B90B] text-[#181a20] font-black'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      {horizon}
                    </button>
                  ))}
                </div>
              </div>

              {/* AI Signal Core Metrics */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                {/* Metric 1: Forecast Signal */}
                <div className={`p-4 rounded-2xl border ${
                  isBullish 
                    ? 'bg-[#0ECB81]/10 border-[#0ECB81]/30 text-[#0ECB81]' 
                    : 'bg-[#F6465D]/10 border-[#F6465D]/30 text-[#F6465D]'
                }`}>
                  <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400">AI Signal Verdict</div>
                  <div className="text-lg font-black mt-1 flex items-center gap-1.5">
                    {isBullish ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
                    <span>{activePrediction.signalStrength}</span>
                  </div>
                  <div className="text-[11px] font-mono mt-0.5 opacity-90">
                    {activePrediction.direction} on {activePrediction.timeHorizon}
                  </div>
                </div>

                {/* Metric 2: Confidence Score */}
                <div className={`p-4 rounded-2xl border ${
                  isDark ? 'bg-[#0b0e11] border-slate-800' : 'bg-slate-50 border-slate-200'
                }`}>
                  <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400">Model Confidence</div>
                  <div className="text-lg font-black font-mono text-[#F0B90B] mt-1 flex items-center gap-1.5">
                    <Brain className="w-4 h-4" />
                    <span>{activePrediction.confidence}%</span>
                  </div>
                  <div className="text-[11px] font-mono text-slate-400 mt-0.5">
                    Win Probability: <span className="text-[#0ECB81] font-bold">{activePrediction.winProbability}%</span>
                  </div>
                </div>

                {/* Metric 3: Target Price (TP) */}
                <div className={`p-4 rounded-2xl border ${
                  isDark ? 'bg-[#0b0e11] border-slate-800' : 'bg-slate-50 border-slate-200'
                }`}>
                  <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400">Predicted Target (TP1)</div>
                  <div className="text-lg font-black font-mono text-[#0ECB81] mt-1 flex items-center gap-1.5">
                    <Target className="w-4 h-4" />
                    <span>${formatPrice(activePrediction.targetPrice, selectedCoin.precision)}</span>
                  </div>
                  <div className="text-[11px] font-mono text-[#0ECB81] font-bold mt-0.5">
                    {activePrediction.expectedChangePct >= 0 ? '+' : ''}{activePrediction.expectedChangePct}% Return
                  </div>
                </div>

                {/* Metric 4: Stop-Loss Level */}
                <div className={`p-4 rounded-2xl border ${
                  isDark ? 'bg-[#0b0e11] border-slate-800' : 'bg-slate-50 border-slate-200'
                }`}>
                  <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400">Invalidation (SL)</div>
                  <div className="text-lg font-black font-mono text-[#F6465D] mt-1 flex items-center gap-1.5">
                    <ShieldAlert className="w-4 h-4" />
                    <span>${formatPrice(activePrediction.stopLossPrice, selectedCoin.precision)}</span>
                  </div>
                  <div className="text-[11px] font-mono text-slate-400 mt-0.5">
                    R:R <span className="text-cyan-400 font-bold">{activePrediction.riskRewardRatio}</span>
                  </div>
                </div>
              </div>

              {/* Neural Summary Banner */}
              <div className={`p-4 rounded-2xl border flex items-start gap-3.5 ${
                isDark ? 'bg-[#0b0e11] border-[#F0B90B]/30' : 'bg-amber-50/70 border-amber-200'
              }`}>
                <div className="w-9 h-9 rounded-xl bg-[#F0B90B]/20 text-[#F0B90B] flex items-center justify-center shrink-0">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <div className="text-xs font-bold text-slate-200 flex items-center gap-2">
                    <span>AI Predictive Rationale ({activePrediction.timeHorizon})</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#0ECB81]/15 text-[#0ECB81] font-bold">
                      News Impact +{activePrediction.technicalFactors.newsImpactScore}pts
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed font-sans">
                    {activePrediction.summaryEn}
                  </p>
                  {activePrediction.summaryUrdu && (
                    <p className="text-[11px] text-amber-300/90 font-sans mt-1">
                      💡 <strong>اردو تجزیہ:</strong> {activePrediction.summaryUrdu}
                    </p>
                  )}
                </div>
              </div>

              {/* Deep Technical Matrix Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs font-mono">
                <div className={`p-3 rounded-xl border ${isDark ? 'bg-[#0b0e11] border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                  <div className="text-[10px] text-slate-400">RSI Momentum</div>
                  <div className="font-bold text-slate-200 mt-1 flex items-center justify-between">
                    <span>{activePrediction.technicalFactors.rsi}</span>
                    <span className="text-[10px] text-[#0ECB81]">{activePrediction.technicalFactors.rsiSignal.split(' ')[0]}</span>
                  </div>
                </div>

                <div className={`p-3 rounded-xl border ${isDark ? 'bg-[#0b0e11] border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                  <div className="text-[10px] text-slate-400">MACD Histogram</div>
                  <div className="font-bold text-[#0ECB81] mt-1 text-[11px]">
                    {activePrediction.technicalFactors.macdSignal}
                  </div>
                </div>

                <div className={`p-3 rounded-xl border ${isDark ? 'bg-[#0b0e11] border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                  <div className="text-[10px] text-slate-400">Whale Wall</div>
                  <div className="font-bold text-cyan-400 mt-1 text-[11px]">
                    {activePrediction.technicalFactors.whalePressure}
                  </div>
                </div>

                <div className={`p-3 rounded-xl border ${isDark ? 'bg-[#0b0e11] border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                  <div className="text-[10px] text-slate-400">Liquidation Pool</div>
                  <div className="font-bold text-amber-400 mt-1 text-[11px]">
                    {activePrediction.technicalFactors.liquidationCluster}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right 5 Cols: Complete Instant BUY & SELL Execution Terminal */}
          <div className="lg:col-span-5 space-y-6">
            <div className={`p-6 rounded-3xl border shadow-xl space-y-5 ${
              isDark ? 'bg-[#181a20] border-[#F0B90B]/40 text-slate-100' : 'bg-white border-slate-200 text-slate-900'
            }`}>
              <div className="flex items-center justify-between pb-3 border-b border-slate-700/30">
                <div className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-[#F0B90B]" />
                  <div>
                    <h3 className="font-black text-sm">Instant Buy & Sell Order Terminal</h3>
                    <p className="text-[11px] text-slate-400">Direct 1-click execution for {selectedCoin.pair}</p>
                  </div>
                </div>
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                  tradingMode === 'demo' ? 'bg-amber-500/20 text-amber-400' : 'bg-[#0ECB81]/20 text-[#0ECB81]'
                }`}>
                  {tradingMode === 'demo' ? 'Demo ($100k)' : 'Real'}
                </span>
              </div>

              {/* Instrument Selection: Futures vs Spot */}
              <div className={`grid grid-cols-2 gap-1.5 p-1 rounded-2xl border ${
                isDark ? 'bg-[#0b0e11] border-slate-800' : 'bg-slate-100 border-slate-200'
              }`}>
                <button
                  onClick={() => setExecutionType('futures')}
                  className={`py-2 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all ${
                    executionType === 'futures'
                      ? 'bg-[#F0B90B] text-[#181a20] font-black shadow-md'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Zap className="w-3.5 h-3.5" />
                  <span>Futures ({selectedLeverage}x)</span>
                </button>
                <button
                  onClick={() => setExecutionType('spot')}
                  className={`py-2 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all ${
                    executionType === 'spot'
                      ? 'bg-[#F0B90B] text-[#181a20] font-black shadow-md'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Target className="w-3.5 h-3.5" />
                  <span>Spot (1x)</span>
                </button>
              </div>

              {/* Leverage Slider (Only for Futures) */}
              {executionType === 'futures' && (
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-slate-400">Futures Leverage:</span>
                    <span className="font-black text-[#F0B90B]">{selectedLeverage}x</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="125"
                    value={selectedLeverage}
                    onChange={e => setSelectedLeverage(parseInt(e.target.value))}
                    className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-[#F0B90B]"
                  />
                  <div className="grid grid-cols-5 gap-1">
                    {[5, 10, 20, 50, 100].map(lev => (
                      <button
                        key={lev}
                        onClick={() => setSelectedLeverage(lev)}
                        className={`py-1 rounded-lg text-[10px] font-mono font-bold border transition-all ${
                          selectedLeverage === lev
                            ? 'bg-[#F0B90B] text-[#181a20] border-[#F0B90B] font-black'
                            : isDark ? 'bg-[#0b0e11] border-slate-800 text-slate-400' : 'bg-slate-100 border-slate-200 text-slate-600'
                        }`}
                      >
                        {lev}x
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Order Size & Balance presets */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-slate-400">Order Amount (USD):</span>
                  <span className="text-slate-400">
                    Avail: <strong className="text-white">${availableUsdt.toLocaleString()} USDT</strong>
                  </span>
                </div>
                <div className="relative">
                  <input
                    type="number"
                    value={tradeAmountUSD}
                    onChange={e => setTradeAmountUSD(Math.max(10, parseFloat(e.target.value) || 0))}
                    className={`w-full px-4 py-2.5 rounded-2xl border text-sm font-mono font-bold outline-none ${
                      isDark 
                        ? 'bg-[#0b0e11] border-slate-700 text-white focus:border-[#F0B90B]' 
                        : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-[#F0B90B]'
                    }`}
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-mono text-slate-400 font-bold">
                    USDT
                  </span>
                </div>

                <div className="grid grid-cols-4 gap-1.5">
                  {[
                    { label: '25%', val: Math.round(availableUsdt * 0.25) || 250 },
                    { label: '50%', val: Math.round(availableUsdt * 0.50) || 500 },
                    { label: '75%', val: Math.round(availableUsdt * 0.75) || 1000 },
                    { label: '100%', val: Math.round(availableUsdt) || 2500 }
                  ].map(preset => (
                    <button
                      key={preset.label}
                      onClick={() => setTradeAmountUSD(preset.val)}
                      className={`py-1 rounded-xl text-xs font-mono font-bold border transition-all ${
                        tradeAmountUSD === preset.val
                          ? 'bg-[#F0B90B] text-[#181a20] border-[#F0B90B] font-black'
                          : isDark ? 'bg-[#0b0e11] border-slate-800 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-700'
                      }`}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom TP & SL Inputs */}
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-slate-400">Take Profit ($):</label>
                  <input
                    type="number"
                    placeholder={`TP: $${formatPrice(activePrediction.targetPrice, selectedCoin.precision)}`}
                    value={customTp}
                    onChange={e => setCustomTp(e.target.value)}
                    className={`w-full px-3 py-2 rounded-xl border text-xs font-mono outline-none ${
                      isDark ? 'bg-[#0b0e11] border-slate-700 text-[#0ECB81]' : 'bg-slate-50 border-slate-300 text-[#0ECB81]'
                    }`}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-slate-400">Stop Loss ($):</label>
                  <input
                    type="number"
                    placeholder={`SL: $${formatPrice(activePrediction.stopLossPrice, selectedCoin.precision)}`}
                    value={customSl}
                    onChange={e => setCustomSl(e.target.value)}
                    className={`w-full px-3 py-2 rounded-xl border text-xs font-mono outline-none ${
                      isDark ? 'bg-[#0b0e11] border-slate-700 text-[#F6465D]' : 'bg-slate-50 border-slate-300 text-[#F6465D]'
                    }`}
                  />
                </div>
              </div>

              {/* DUAL BUY & SELL ACTION BUTTONS */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                {/* BUY LONG BUTTON */}
                <button
                  onClick={handleBuyOrder}
                  disabled={isExecuting}
                  className="py-4 px-3 rounded-2xl bg-[#0ECB81] hover:bg-[#0bb875] text-white font-black text-sm shadow-xl shadow-[#0ECB81]/25 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isExecuting ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <ArrowUpRight className="w-5 h-5" />
                      <span>BUY / LONG</span>
                    </>
                  )}
                </button>

                {/* SELL SHORT BUTTON */}
                <button
                  onClick={handleSellOrder}
                  disabled={isExecuting}
                  className="py-4 px-3 rounded-2xl bg-[#F6465D] hover:bg-[#e03a50] text-white font-black text-sm shadow-xl shadow-[#F6465D]/25 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isExecuting ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <ArrowDownRight className="w-5 h-5" />
                      <span>SELL / SHORT</span>
                    </>
                  )}
                </button>
              </div>

              <div className="text-[11px] text-center text-slate-400 font-mono">
                Order Value: <span className="text-white font-bold">${tradeAmountUSD.toLocaleString()} USDT</span> {executionType === 'futures' && `(Leveraged: $${(tradeAmountUSD * selectedLeverage).toLocaleString()})`}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

import React, { useState } from 'react';
import { 
  Newspaper, Sparkles, TrendingUp, TrendingDown, RefreshCw, 
  ExternalLink, Plus, Filter, Flame, Zap, ShieldAlert, 
  Search, ArrowUpRight, CheckCircle2, Globe, Clock, MessageSquare
} from 'lucide-react';
import { useCrypto } from '../context/CryptoContext';
import { CryptoNewsItem } from '../types';

export const NewsTerminalView: React.FC = () => {
  const { 
    news, 
    refreshNewsFeed, 
    addBreakingNewsAlert, 
    setSelectedCoin, 
    coins, 
    setActiveSection,
    theme,
    tradingMode
  } = useCrypto();

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedCoinFilter, setSelectedCoinFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showAddNewsModal, setShowAddNewsModal] = useState<boolean>(false);

  // New News Modal Form State
  const [customTitle, setCustomTitle] = useState('');
  const [customSummary, setCustomSummary] = useState('');
  const [customSentiment, setCustomSentiment] = useState<'BULLISH' | 'BEARISH' | 'NEUTRAL'>('BULLISH');
  const [customCoin, setCustomCoin] = useState('BTC');

  const isDark = theme === 'dark';

  const filteredNews = news.filter(item => {
    if (selectedCategory !== 'all' && item.category !== selectedCategory) return false;
    if (selectedCoinFilter !== 'all' && !item.relatedCoins.includes(selectedCoinFilter)) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        item.title.toLowerCase().includes(q) ||
        item.summary.toLowerCase().includes(q) ||
        item.relatedCoins.some(c => c.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const handleCreateNews = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customTitle.trim() || !customSummary.trim()) return;
    addBreakingNewsAlert(customTitle, customSummary, customSentiment, customCoin);
    setCustomTitle('');
    setCustomSummary('');
    setShowAddNewsModal(false);
  };

  const handleCoinClick = (coinSymbol: string) => {
    const found = coins.find(c => c.symbol === coinSymbol);
    if (found) {
      setSelectedCoin(found);
      setActiveSection('prediction');
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Top News Terminal Hero Header */}
      <div className={`p-6 rounded-3xl border relative overflow-hidden shadow-2xl ${
        isDark 
          ? 'bg-gradient-to-r from-[#0b0e11] via-[#141b24] to-[#181a20] border-cyan-500/30' 
          : 'bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white border-slate-700'
      }`}>
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 text-xs font-mono font-bold flex items-center gap-1.5 shadow-sm">
                <Globe className="w-3.5 h-3.5" />
                LIVE CRYPTO NEWS & AI SENTIMENT WIRE
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-[#0ECB81]/20 text-[#0ECB81] border border-[#0ECB81]/30">
                ⚡ Neural Analysis Active
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black tracking-tight text-white flex items-center gap-2">
              <span>Real-Time Crypto News & Sentiment Terminal</span>
              <Newspaper className="w-6 h-6 text-cyan-400" />
            </h1>
            <p className="text-xs text-slate-300 max-w-2xl">
              Every headline is parsed in real time by our NLP Sentiment Engine, adjusting prediction targets and price action probabilities across Spot and Futures.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2.5 flex-wrap">
            <button
              onClick={refreshNewsFeed}
              className="px-4 py-2 rounded-2xl bg-[#2b313a] hover:bg-[#363c47] text-slate-100 text-xs font-mono font-bold border border-slate-700 flex items-center gap-1.5 transition-all shadow-md active:scale-95"
            >
              <RefreshCw className="w-4 h-4 text-cyan-400" />
              <span>Fetch Breaking News</span>
            </button>

            <button
              onClick={() => setShowAddNewsModal(true)}
              className="px-4 py-2 rounded-2xl bg-[#F0B90B] hover:bg-[#FCD535] text-[#181a20] text-xs font-mono font-black flex items-center gap-1.5 transition-all shadow-md shadow-[#F0B90B]/20 active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Add Analyst News Alert</span>
            </button>
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className={`p-4 rounded-2xl border flex flex-col md:flex-row items-center justify-between gap-4 ${
        isDark ? 'bg-[#181a20] border-slate-800' : 'bg-white border-slate-200'
      }`}>
        {/* Search */}
        <div className={`flex items-center gap-2 px-3 py-2 rounded-xl border w-full md:w-80 ${
          isDark ? 'bg-[#0b0e11] border-slate-700' : 'bg-slate-50 border-slate-300'
        }`}>
          <Search className="w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search news, coins, Fed, ETF..."
            className="w-full bg-transparent text-xs outline-none text-slate-200 placeholder-slate-500"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 scrollbar-none">
          {[
            { id: 'all', label: 'All News' },
            { id: 'breaking', label: '🚨 Breaking' },
            { id: 'etf_institutional', label: '🏦 ETF & Macro' },
            { id: 'whale_alert', label: '🐋 Whale Flow' },
            { id: 'tech_ai', label: '🤖 Tech & AI' },
            { id: 'regulation', label: '⚖️ Policy' }
          ].map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-xl font-mono text-xs font-bold whitespace-nowrap transition-all ${
                selectedCategory === cat.id
                  ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                  : isDark ? 'bg-[#0b0e11] text-slate-400 hover:text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* News Feed Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredNews.map(item => {
          const isBull = item.sentiment === 'BULLISH';
          const isBear = item.sentiment === 'BEARISH';

          return (
            <div
              key={item.id}
              className={`p-5 rounded-3xl border shadow-lg space-y-4 transition-all hover:border-slate-600 ${
                isDark ? 'bg-[#181a20] border-slate-800' : 'bg-white border-slate-200'
              }`}
            >
              {/* Header: Source, Time, Sentiment */}
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-slate-400 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {item.timeAgo}
                  </span>
                  <span className="text-slate-600">•</span>
                  <span className="text-xs font-mono text-cyan-400 font-bold">{item.source}</span>
                </div>

                {/* Sentiment Badge */}
                <div className="flex items-center gap-1.5">
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-mono font-bold flex items-center gap-1 ${
                    isBull
                      ? 'bg-[#0ECB81]/15 text-[#0ECB81] border border-[#0ECB81]/30'
                      : isBear
                      ? 'bg-[#F6465D]/15 text-[#F6465D] border border-[#F6465D]/30'
                      : 'bg-slate-700 text-slate-300'
                  }`}>
                    {isBull ? <TrendingUp className="w-3.5 h-3.5" /> : isBear ? <TrendingDown className="w-3.5 h-3.5" /> : null}
                    <span>{item.sentiment} ({item.sentimentScore > 0 ? '+' : ''}{item.sentimentScore}%)</span>
                  </span>

                  <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                    item.impact === 'HIGH' ? 'bg-amber-500/20 text-amber-400' : 'bg-slate-800 text-slate-400'
                  }`}>
                    {item.impact} IMPACT
                  </span>
                </div>
              </div>

              {/* Title & Summary */}
              <div className="space-y-1.5">
                <h3 className="text-base font-black text-slate-100 leading-snug">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed font-sans">
                  {item.summary}
                </p>
              </div>

              {/* AI Neural Analysis Note */}
              {item.aiAnalysis && (
                <div className={`p-3 rounded-2xl border flex items-start gap-2.5 text-xs ${
                  isDark ? 'bg-[#0b0e11] border-slate-800' : 'bg-slate-50 border-slate-200'
                }`}>
                  <Sparkles className="w-4 h-4 text-[#F0B90B] shrink-0 mt-0.5" />
                  <div className="space-y-0.5">
                    <span className="font-bold text-[#F0B90B] font-mono text-[11px]">AI Market Engine Verdict:</span>
                    <p className="text-slate-300 text-[11px] leading-relaxed">{item.aiAnalysis}</p>
                  </div>
                </div>
              )}

              {/* Related Coins & Prediction Trigger */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-800/60">
                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] font-mono text-slate-400">Coins:</span>
                  {item.relatedCoins.map(coin => (
                    <button
                      key={coin}
                      onClick={() => handleCoinClick(coin)}
                      className="px-2.5 py-0.5 rounded-lg bg-[#2b313a] hover:bg-[#363c47] text-slate-200 font-mono text-xs font-bold border border-slate-700 transition-colors"
                    >
                      {coin}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => {
                    const primary = item.relatedCoins[0] || 'BTC';
                    handleCoinClick(primary);
                  }}
                  className="text-xs font-mono font-bold text-[#F0B90B] hover:text-[#FCD535] flex items-center gap-1 transition-colors"
                >
                  <span>View AI Prediction</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Breaking News Modal */}
      {showAddNewsModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className={`p-6 rounded-3xl border max-w-lg w-full shadow-2xl space-y-4 animate-scaleUp ${
            isDark ? 'bg-[#181a20] border-slate-700 text-slate-100' : 'bg-white border-slate-300 text-slate-900'
          }`}>
            <div className="flex items-center justify-between pb-3 border-b border-slate-700">
              <div className="flex items-center gap-2">
                <Plus className="w-5 h-5 text-[#F0B90B]" />
                <h3 className="text-base font-black">Add Breaking Crypto News Wire</h3>
              </div>
              <button
                onClick={() => setShowAddNewsModal(false)}
                className="text-slate-400 hover:text-white text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateNews} className="space-y-3.5 text-xs">
              <div className="space-y-1">
                <label className="font-mono text-slate-300 font-bold">News Headline Title</label>
                <input
                  type="text"
                  required
                  value={customTitle}
                  onChange={e => setCustomTitle(e.target.value)}
                  placeholder="e.g. US SEC Approves Solana Staking ETF in Historic Ruling"
                  className={`w-full p-2.5 rounded-xl border outline-none font-sans ${
                    isDark ? 'bg-[#0b0e11] border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                  }`}
                />
              </div>

              <div className="space-y-1">
                <label className="font-mono text-slate-300 font-bold">Summary Details</label>
                <textarea
                  rows={3}
                  required
                  value={customSummary}
                  onChange={e => setCustomSummary(e.target.value)}
                  placeholder="Describe market details, volume impact, or regulatory significance..."
                  className={`w-full p-2.5 rounded-xl border outline-none font-sans ${
                    isDark ? 'bg-[#0b0e11] border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                  }`}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-mono text-slate-300 font-bold">Sentiment Impact</label>
                  <select
                    value={customSentiment}
                    onChange={e => setCustomSentiment(e.target.value as any)}
                    className={`w-full p-2.5 rounded-xl border outline-none font-mono ${
                      isDark ? 'bg-[#0b0e11] border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                    }`}
                  >
                    <option value="BULLISH">🚀 Bullish (+85%)</option>
                    <option value="BEARISH">🔻 Bearish (-85%)</option>
                    <option value="NEUTRAL">⚖️ Neutral (0%)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-mono text-slate-300 font-bold">Target Coin</label>
                  <select
                    value={customCoin}
                    onChange={e => setCustomCoin(e.target.value)}
                    className={`w-full p-2.5 rounded-xl border outline-none font-mono ${
                      isDark ? 'bg-[#0b0e11] border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                    }`}
                  >
                    <option value="BTC">Bitcoin (BTC)</option>
                    <option value="ETH">Ethereum (ETH)</option>
                    <option value="SOL">Solana (SOL)</option>
                    <option value="XRP">XRP (XRP)</option>
                    <option value="BNB">BNB (BNB)</option>
                    <option value="DOGE">Dogecoin (DOGE)</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddNewsModal(false)}
                  className="flex-1 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-mono font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-xl bg-[#F0B90B] hover:bg-[#FCD535] text-[#181a20] font-mono font-black shadow-lg"
                >
                  Publish & Update AI
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

import React, { useState } from 'react';
import { 
  TrendingUp, TrendingDown, Star, Search, 
  Flame, Sparkles, Layers, Zap, ArrowRight, BarChart3 
} from 'lucide-react';
import { useCrypto } from '../context/CryptoContext';
import { CryptoCoin } from '../types';

export const MarketsView: React.FC = () => {
  const { 
    coins, 
    setSelectedCoin, 
    setActiveSection, 
    theme, 
    formatPrice, 
    formatCurrency 
  } = useCrypto();

  const [activeCategory, setActiveCategory] = useState<'all' | 'hot' | 'gainers' | 'losers' | 'layer1' | 'ai' | 'meme'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [favorites, setFavorites] = useState<string[]>(['bitcoin', 'ethereum', 'solana']);

  const isDark = theme === 'dark';

  const toggleFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFavorites(prev => 
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const filteredCoins = coins.filter(coin => {
    const matchesSearch = 
      coin.symbol.toLowerCase().includes(searchQuery.toLowerCase()) || 
      coin.name.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (!matchesSearch) return false;
    if (activeCategory === 'all') return true;
    if (activeCategory === 'gainers') return coin.change24h > 0;
    if (activeCategory === 'losers') return coin.change24h < 0;
    return coin.category === activeCategory;
  });

  const categories = [
    { id: 'all', label: 'All Coins', icon: Layers },
    { id: 'hot', label: 'Hot', icon: Flame },
    { id: 'gainers', label: 'Top Gainers', icon: TrendingUp },
    { id: 'losers', label: 'Top Losers', icon: TrendingDown },
    { id: 'layer1', label: 'Layer 1 / 2', icon: Zap },
    { id: 'ai', label: 'AI Tokens', icon: Sparkles },
    { id: 'meme', label: 'Meme Coins', icon: Flame }
  ];

  return (
    <div className={`flex flex-col h-full overflow-y-auto p-4 lg:p-6 space-y-6 ${
      isDark ? 'bg-[#0b0e11] text-slate-100' : 'bg-slate-50 text-slate-900'
    }`}>
      {/* Top Hero Market Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Hot Coin */}
        <div className={`p-4 rounded-2xl border ${isDark ? 'bg-[#181a20] border-[#2b313a]' : 'bg-white border-slate-200 shadow-sm'}`}>
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span className="flex items-center gap-1"><Flame className="w-3.5 h-3.5 text-[#F0B90B]" /> Top Volume</span>
            <span className="font-bold text-[#0ECB81]">+3.84%</span>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-bold text-base">Bitcoin (BTC)</h4>
              <p className="font-mono text-xl font-black text-[#F0B90B] mt-0.5">${formatPrice(coins[0]?.price || 88450)}</p>
            </div>
            <button
              onClick={() => {
                setSelectedCoin(coins[0]);
                setActiveSection('trade');
              }}
              className="p-2 rounded-xl bg-[#F0B90B]/20 text-[#F0B90B] hover:bg-[#F0B90B] hover:text-[#181a20] transition-colors"
            >
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Top Gainer */}
        <div className={`p-4 rounded-2xl border ${isDark ? 'bg-[#181a20] border-[#2b313a]' : 'bg-white border-slate-200 shadow-sm'}`}>
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span className="flex items-center gap-1"><TrendingUp className="w-3.5 h-3.5 text-[#0ECB81]" /> Top Gainer (24h)</span>
            <span className="font-bold text-[#0ECB81]">+18.20%</span>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-bold text-base">FET (ASI AI)</h4>
              <p className="font-mono text-xl font-black text-[#0ECB81] mt-0.5">$1.482</p>
            </div>
            <button
              onClick={() => {
                const fet = coins.find(c => c.symbol === 'FET') || coins[0];
                setSelectedCoin(fet);
                setActiveSection('trade');
              }}
              className="p-2 rounded-xl bg-[#0ECB81]/20 text-[#0ECB81] hover:bg-[#0ECB81] hover:text-white transition-colors"
            >
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* New Listing / Trending */}
        <div className={`p-4 rounded-2xl border ${isDark ? 'bg-[#181a20] border-[#2b313a]' : 'bg-white border-slate-200 shadow-sm'}`}>
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span className="flex items-center gap-1"><Sparkles className="w-3.5 h-3.5 text-purple-400" /> Hot Layer 1</span>
            <span className="font-bold text-[#0ECB81]">+8.94%</span>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-bold text-base">Solana (SOL)</h4>
              <p className="font-mono text-xl font-black text-purple-400 mt-0.5">$194.65</p>
            </div>
            <button
              onClick={() => {
                const sol = coins.find(c => c.symbol === 'SOL') || coins[0];
                setSelectedCoin(sol);
                setActiveSection('trade');
              }}
              className="p-2 rounded-xl bg-purple-500/20 text-purple-400 hover:bg-purple-500 hover:text-white transition-colors"
            >
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Global Market Cap */}
        <div className={`p-4 rounded-2xl border ${isDark ? 'bg-[#181a20] border-[#2b313a]' : 'bg-white border-slate-200 shadow-sm'}`}>
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span className="flex items-center gap-1"><BarChart3 className="w-3.5 h-3.5 text-cyan-400" /> Crypto Market Cap</span>
            <span className="font-bold text-[#0ECB81]">+4.12%</span>
          </div>
          <div>
            <h4 className="font-bold text-base">Total Cap (USD)</h4>
            <p className="font-mono text-xl font-black text-cyan-400 mt-0.5">$3.42 Trillion</p>
          </div>
        </div>
      </div>

      {/* Markets Table Container */}
      <div className={`rounded-3xl border overflow-hidden ${
        isDark ? 'bg-[#121418] border-[#1e2329]' : 'bg-white border-slate-200 shadow-sm'
      }`}>
        {/* Category Filters & Search */}
        <div className={`p-4 border-b flex flex-wrap items-center justify-between gap-4 ${
          isDark ? 'bg-[#181a20] border-[#2b313a]' : 'bg-slate-50 border-slate-200'
        }`}>
          {/* Categories */}
          <div className="flex flex-wrap gap-1.5">
            {categories.map(cat => {
              const Icon = cat.icon;
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id as any)}
                  className={`px-3.5 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all ${
                    isActive
                      ? 'bg-[#F0B90B] text-[#181a20] shadow-md shadow-[#F0B90B]/20'
                      : isDark ? 'text-slate-400 hover:text-white hover:bg-[#2b313a]' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>

          {/* Search Box */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search coin / pair..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`pl-9 pr-4 py-2 rounded-xl text-xs font-mono focus:outline-none focus:ring-1 focus:ring-[#F0B90B] w-64 ${
                isDark ? 'bg-[#0b0e11] text-white border border-[#2b313a]' : 'bg-white text-slate-900 border border-slate-200 shadow-xs'
              }`}
            />
          </div>
        </div>

        {/* Coins List Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className={`text-[10px] uppercase font-bold text-slate-400 border-b ${
              isDark ? 'bg-[#181a20]/60 border-[#1e2329]' : 'bg-slate-50 border-slate-200'
            }`}>
              <tr>
                <th className="py-3 px-4">Coin / Pair</th>
                <th className="py-3 px-4">Last Price</th>
                <th className="py-3 px-4">24h Change</th>
                <th className="py-3 px-4">24h High / Low</th>
                <th className="py-3 px-4">24h Volume (USDT)</th>
                <th className="py-3 px-4">Market Cap</th>
                <th className="py-3 px-4 text-right">Trade</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/20 font-sans">
              {filteredCoins.map(coin => {
                const isFav = favorites.includes(coin.id);
                const isProfit = coin.change24h >= 0;

                return (
                  <tr
                    key={coin.id}
                    onClick={() => {
                      setSelectedCoin(coin);
                      setActiveSection('trade');
                    }}
                    className={`hover:bg-slate-800/10 cursor-pointer transition-colors ${
                      isDark ? 'hover:bg-[#181a20]' : 'hover:bg-slate-50'
                    }`}
                  >
                    {/* Coin Symbol & Icon */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={(e) => toggleFavorite(coin.id, e)}
                          className={`p-1 rounded hover:opacity-80 ${isFav ? 'text-[#F0B90B]' : 'text-slate-500'}`}
                        >
                          <Star className={`w-4 h-4 ${isFav ? 'fill-[#F0B90B]' : ''}`} />
                        </button>
                        <div className={`w-8 h-8 rounded-xl ${coin.iconBg} flex items-center justify-center font-bold text-xs shrink-0 font-mono`}>
                          {coin.symbol.slice(0, 3)}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-sm text-slate-100">{coin.symbol}</span>
                            <span className="text-[10px] text-slate-400 font-mono">/USDT</span>
                          </div>
                          <span className="text-xs text-slate-400 block">{coin.name}</span>
                        </div>
                      </div>
                    </td>

                    {/* Last Price */}
                    <td className="py-3.5 px-4 font-mono font-bold text-sm text-slate-100">
                      ${formatPrice(coin.price, coin.precision)}
                    </td>

                    {/* 24h Change */}
                    <td className="py-3.5 px-4 font-mono">
                      <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${
                        isProfit ? 'bg-[#0ECB81]/15 text-[#0ECB81]' : 'bg-[#F6465D]/15 text-[#F6465D]'
                      }`}>
                        {isProfit ? '+' : ''}{coin.change24h}%
                      </span>
                    </td>

                    {/* 24h High / Low */}
                    <td className="py-3.5 px-4 font-mono text-slate-400 text-xs">
                      <div>H: ${formatPrice(coin.high24h, coin.precision)}</div>
                      <div>L: ${formatPrice(coin.low24h, coin.precision)}</div>
                    </td>

                    {/* 24h Volume */}
                    <td className="py-3.5 px-4 font-mono text-slate-300">
                      ${(coin.volume24h / 1000000).toFixed(2)}M
                    </td>

                    {/* Market Cap */}
                    <td className="py-3.5 px-4 font-mono text-slate-400">
                      ${(coin.marketCap / 1000000000).toFixed(2)}B
                    </td>

                    {/* Trade Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedCoin(coin);
                            setActiveSection('trade');
                          }}
                          className="px-2.5 py-1.5 rounded-xl bg-[#0ECB81] hover:bg-[#0bb875] text-white font-bold text-xs shadow-sm transition-transform active:scale-95"
                        >
                          Buy
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedCoin(coin);
                            setActiveSection('trade');
                          }}
                          className="px-2.5 py-1.5 rounded-xl bg-[#F6465D] hover:bg-[#e03a50] text-white font-bold text-xs shadow-sm transition-transform active:scale-95"
                        >
                          Sell
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { ArrowDown, ArrowUp, Zap, History, AlignJustify } from 'lucide-react';
import { useCrypto } from '../context/CryptoContext';

export const OrderBook: React.FC = () => {
  const { 
    selectedCoin, 
    orderBook, 
    recentTrades, 
    theme, 
    formatPrice 
  } = useCrypto();

  const [activeTab, setActiveTab] = useState<'book' | 'trades'>('book');
  const [viewMode, setViewMode] = useState<'both' | 'bids' | 'asks'>('both');

  const isDark = theme === 'dark';

  const maxAskTotal = orderBook.asks[0]?.total || 1;
  const maxBidTotal = orderBook.bids[orderBook.bids.length - 1]?.total || 1;
  const maxCumulative = Math.max(maxAskTotal, maxBidTotal, 1);

  return (
    <div className={`flex flex-col h-full rounded-2xl border overflow-hidden select-none ${
      isDark ? 'bg-[#121418] border-[#1e2329]' : 'bg-white border-slate-200'
    }`}>
      {/* Header Tabs */}
      <div className={`px-3 py-2 border-b flex items-center justify-between text-xs shrink-0 ${
        isDark ? 'bg-[#181a20] border-[#2b313a]' : 'bg-slate-50 border-slate-200'
      }`}>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('book')}
            className={`font-bold flex items-center gap-1.5 transition-colors ${
              activeTab === 'book' 
                ? isDark ? 'text-[#F0B90B]' : 'text-blue-600 font-extrabold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <AlignJustify className="w-3.5 h-3.5" />
            <span>Order Book</span>
          </button>
          <span className="text-slate-500">/</span>
          <button
            onClick={() => setActiveTab('trades')}
            className={`font-bold flex items-center gap-1.5 transition-colors ${
              activeTab === 'trades' 
                ? isDark ? 'text-[#F0B90B]' : 'text-blue-600 font-extrabold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <History className="w-3.5 h-3.5" />
            <span>Market Trades</span>
          </button>
        </div>

        {activeTab === 'book' && (
          <div className="flex items-center gap-1">
            <button
              onClick={() => setViewMode('both')}
              className={`p-1 rounded ${viewMode === 'both' ? 'bg-[#F0B90B]/20 text-[#F0B90B]' : 'text-slate-400'}`}
              title="Both Asks & Bids"
            >
              <div className="w-3 h-3 flex flex-col justify-between">
                <div className="h-1 bg-[#F6465D] rounded-xs" />
                <div className="h-1 bg-[#0ECB81] rounded-xs" />
              </div>
            </button>
            <button
              onClick={() => setViewMode('asks')}
              className={`p-1 rounded ${viewMode === 'asks' ? 'bg-[#F0B90B]/20 text-[#F0B90B]' : 'text-slate-400'}`}
              title="Only Asks"
            >
              <div className="w-3 h-3 flex flex-col gap-0.5">
                <div className="h-1 bg-[#F6465D] rounded-xs" />
                <div className="h-1 bg-[#F6465D] rounded-xs" />
              </div>
            </button>
            <button
              onClick={() => setViewMode('bids')}
              className={`p-1 rounded ${viewMode === 'bids' ? 'bg-[#F0B90B]/20 text-[#F0B90B]' : 'text-slate-400'}`}
              title="Only Bids"
            >
              <div className="w-3 h-3 flex flex-col gap-0.5">
                <div className="h-1 bg-[#0ECB81] rounded-xs" />
                <div className="h-1 bg-[#0ECB81] rounded-xs" />
              </div>
            </button>
          </div>
        )}
      </div>

      {activeTab === 'book' ? (
        <div className="flex-1 flex flex-col justify-between overflow-hidden p-2 text-[11px] font-mono">
          {/* Column Headers */}
          <div className="grid grid-cols-3 text-slate-400 font-bold uppercase text-[9px] px-2 py-1">
            <div>Price (USDT)</div>
            <div className="text-right">Size ({selectedCoin.baseAsset})</div>
            <div className="text-right">Total</div>
          </div>

          {/* Asks (Sell Orders - Red) */}
          {(viewMode === 'both' || viewMode === 'asks') && (
            <div className="space-y-0.5 overflow-hidden flex flex-col justify-end">
              {orderBook.asks.slice(viewMode === 'both' ? 2 : 0).map((ask, idx) => {
                const depthPct = Math.min(100, (ask.total / maxCumulative) * 100);
                return (
                  <div key={idx} className="relative grid grid-cols-3 px-2 py-0.5 items-center hover:bg-slate-800/20 cursor-pointer">
                    <div
                      className="absolute right-0 top-0 bottom-0 bg-[#F6465D]/15 transition-all"
                      style={{ width: `${depthPct}%` }}
                    />
                    <span className="text-[#F6465D] font-bold z-10">{formatPrice(ask.price, selectedCoin.precision)}</span>
                    <span className={`text-right z-10 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>{ask.amount}</span>
                    <span className="text-right text-slate-400 z-10">{ask.total}</span>
                  </div>
                );
              })}
            </div>
          )}

          {/* Spread / Mid-Market Price Indicator */}
          <div className={`my-1.5 px-3 py-1.5 rounded-xl flex items-center justify-between border ${
            selectedCoin.change24h >= 0 
              ? 'bg-[#0ECB81]/10 border-[#0ECB81]/20 text-[#0ECB81]' 
              : 'bg-[#F6465D]/10 border-[#F6465D]/20 text-[#F6465D]'
          }`}>
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-black font-mono tracking-tight">${formatPrice(selectedCoin.price)}</span>
              {selectedCoin.change24h >= 0 ? <ArrowUp className="w-3.5 h-3.5" /> : <ArrowDown className="w-3.5 h-3.5" />}
            </div>
            <span className="text-[10px] text-slate-400 font-mono">Spread: {orderBook.spread}</span>
          </div>

          {/* Bids (Buy Orders - Green) */}
          {(viewMode === 'both' || viewMode === 'bids') && (
            <div className="space-y-0.5 overflow-hidden">
              {orderBook.bids.slice(0, viewMode === 'both' ? 6 : 8).map((bid, idx) => {
                const depthPct = Math.min(100, (bid.total / maxCumulative) * 100);
                return (
                  <div key={idx} className="relative grid grid-cols-3 px-2 py-0.5 items-center hover:bg-slate-800/20 cursor-pointer">
                    <div
                      className="absolute right-0 top-0 bottom-0 bg-[#0ECB81]/15 transition-all"
                      style={{ width: `${depthPct}%` }}
                    />
                    <span className="text-[#0ECB81] font-bold z-10">{formatPrice(bid.price, selectedCoin.precision)}</span>
                    <span className={`text-right z-10 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>{bid.amount}</span>
                    <span className="text-right text-slate-400 z-10">{bid.total}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      ) : (
        /* Market Trades Real-Time Stream */
        <div className="flex-1 overflow-y-auto p-2 text-[11px] font-mono space-y-1">
          <div className="grid grid-cols-3 text-slate-400 font-bold uppercase text-[9px] px-2 py-1 border-b border-slate-700/40">
            <div>Price (USDT)</div>
            <div className="text-right">Size ({selectedCoin.baseAsset})</div>
            <div className="text-right">Time</div>
          </div>

          {recentTrades.map(trade => (
            <div key={trade.id} className="grid grid-cols-3 px-2 py-1 items-center hover:bg-slate-800/20">
              <span className={`font-bold ${trade.side === 'buy' ? 'text-[#0ECB81]' : 'text-[#F6465D]'}`}>
                {formatPrice(trade.price, selectedCoin.precision)}
              </span>
              <span className={`text-right ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>{trade.amount}</span>
              <span className="text-right text-slate-400">{trade.time}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

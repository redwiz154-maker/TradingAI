import React from 'react';
import { 
  Zap, Flame, ShieldAlert, BarChart2, 
  TrendingUp, TrendingDown, Clock, Activity 
} from 'lucide-react';
import { useCrypto } from '../context/CryptoContext';
import { TradingViewChart } from './TradingViewChart';
import { OrderBook } from './OrderBook';
import { TradeForm } from './TradeForm';
import { OrdersAndPositions } from './OrdersAndPositions';

export const FuturesView: React.FC = () => {
  const { 
    selectedCoin, 
    leverage, 
    marginMode, 
    theme, 
    formatPrice, 
    positions 
  } = useCrypto();

  const isDark = theme === 'dark';

  return (
    <div className={`flex flex-col h-full overflow-hidden ${
      isDark ? 'bg-[#0b0e11] text-slate-100' : 'bg-slate-50 text-slate-900'
    }`}>
      {/* Top Perpetual Futures Contract Status Bar */}
      <div className={`px-4 py-2 border-b flex flex-wrap items-center justify-between gap-4 text-xs shrink-0 ${
        isDark ? 'bg-[#181a20] border-[#2b313a]' : 'bg-white border-slate-200 shadow-xs'
      }`}>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="font-black text-sm tracking-wide text-slate-100">{selectedCoin.symbol}USDT</span>
            <span className="px-2 py-0.5 rounded-full bg-[#F0B90B]/20 text-[#F0B90B] font-mono text-[10px] font-bold border border-[#F0B90B]/30">
              Perpetual
            </span>
          </div>

          <div className="flex items-center gap-1.5 font-mono">
            <span className="text-base font-black text-[#F0B90B]">${formatPrice(selectedCoin.price)}</span>
            <span className={`text-xs font-bold ${selectedCoin.change24h >= 0 ? 'text-[#0ECB81]' : 'text-[#F6465D]'}`}>
              {selectedCoin.change24h >= 0 ? '+' : ''}{selectedCoin.change24h}%
            </span>
          </div>
        </div>

        {/* Futures Technical Stats */}
        <div className="flex flex-wrap items-center gap-6 text-[11px] font-mono text-slate-400">
          <div>
            <span className="text-slate-500 block text-[9px] uppercase font-bold">Index Price</span>
            <span className="text-slate-200 font-bold">${formatPrice(selectedCoin.price * 0.9998)}</span>
          </div>
          <div>
            <span className="text-slate-500 block text-[9px] uppercase font-bold">Funding / Countdown</span>
            <span className="text-[#F0B90B] font-bold">+{selectedCoin.fundingRate.toFixed(4)}%</span>
            <span className="text-slate-400 text-[10px] ml-1.5">({selectedCoin.fundingCountdown})</span>
          </div>
          <div>
            <span className="text-slate-500 block text-[9px] uppercase font-bold">24h High</span>
            <span className="text-[#0ECB81] font-bold">${formatPrice(selectedCoin.high24h)}</span>
          </div>
          <div>
            <span className="text-slate-500 block text-[9px] uppercase font-bold">24h Low</span>
            <span className="text-[#F6465D] font-bold">${formatPrice(selectedCoin.low24h)}</span>
          </div>

          {/* Long / Short Sentiment Bar */}
          <div className="w-36 hidden lg:block">
            <div className="flex justify-between text-[9px] font-bold mb-0.5">
              <span className="text-[#0ECB81]">Long 62.4%</span>
              <span className="text-[#F6465D]">37.6% Short</span>
            </div>
            <div className="h-1.5 w-full bg-[#F6465D] rounded-full overflow-hidden flex">
              <div className="h-full bg-[#0ECB81]" style={{ width: '62.4%' }} />
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid Workspace */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-2 p-2 overflow-hidden">
        {/* Left / Center: Interactive Chart & Bottom Positions Management (8 cols) */}
        <div className="lg:col-span-8 flex flex-col gap-2 h-full overflow-hidden">
          {/* Main Candlestick Chart */}
          <div className="flex-1 min-h-[360px]">
            <TradingViewChart />
          </div>

          {/* Bottom Positions & Orders Panel */}
          <div className="h-64 shrink-0">
            <OrdersAndPositions defaultTab="positions" />
          </div>
        </div>

        {/* Right: Order Book & Futures Trade Form (4 cols) */}
        <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-2 h-full overflow-hidden">
          {/* Order Book */}
          <div className="flex-1 min-h-[260px]">
            <OrderBook />
          </div>

          {/* Futures Execution Panel */}
          <div className="h-[430px] shrink-0">
            <TradeForm isFuturesMode={true} />
          </div>
        </div>
      </div>
    </div>
  );
};

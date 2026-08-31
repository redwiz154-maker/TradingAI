import React, { useState } from 'react';
import { 
  Calculator, X, Target, Flame, Percent, 
  DollarSign, TrendingUp, TrendingDown, ShieldAlert
} from 'lucide-react';
import { useCrypto } from '../context/CryptoContext';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const TradingCalculatorModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const { selectedCoin, theme } = useCrypto();
  const isDark = theme === 'dark';

  const [activeTab, setActiveTab] = useState<'pnl' | 'target' | 'liquidation'>('pnl');

  // PnL Calculator Inputs
  const [side, setSide] = useState<'LONG' | 'SHORT'>('LONG');
  const [leverage, setLeverage] = useState(20);
  const [entryPrice, setEntryPrice] = useState(selectedCoin.price.toString());
  const [exitPrice, setExitPrice] = useState((selectedCoin.price * 1.05).toFixed(selectedCoin.precision));
  const [quantityUSD, setQuantityUSD] = useState('1000');

  // Target Price Inputs
  const [targetRoi, setTargetRoi] = useState('50'); // 50% ROI

  // Liquidation Price Inputs
  const [marginUSD, setMarginUSD] = useState('500');

  if (!isOpen) return null;

  // Compute PnL
  const entry = parseFloat(entryPrice) || selectedCoin.price;
  const exit = parseFloat(exitPrice) || selectedCoin.price;
  const qty = parseFloat(quantityUSD) || 1000;
  const initialMargin = qty / leverage;

  const priceDiffPct = side === 'LONG' ? (exit - entry) / entry : (entry - exit) / entry;
  const pnlUSD = qty * priceDiffPct;
  const roiPct = (pnlUSD / initialMargin) * 100;

  // Compute Target Price
  const desiredRoi = parseFloat(targetRoi) || 50;
  const requiredPriceMovePct = (desiredRoi / 100) / leverage;
  const targetExitPrice = side === 'LONG' 
    ? entry * (1 + requiredPriceMovePct)
    : entry * (1 - requiredPriceMovePct);

  // Compute Liquidation Price
  const maintMarginRatio = 0.005; // 0.5%
  const liqPrice = side === 'LONG'
    ? entry * (1 - (1 / leverage) + maintMarginRatio)
    : entry * (1 + (1 / leverage) - maintMarginRatio);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
      <div className={`w-full max-w-lg rounded-3xl border shadow-2xl overflow-hidden ${
        isDark ? 'bg-[#181a20] border-[#2b313a]' : 'bg-white border-slate-200'
      }`}>
        {/* Header */}
        <div className="p-5 border-b border-[#2b313a]/50 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-2xl bg-[#F0B90B]/15 text-[#F0B90B]">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-black">Trading & Liquidation Calculator</h2>
              <p className="text-[11px] text-slate-400 font-mono">Calculate exact PnL, Target ROI, & Risk Limits</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-100 hover:bg-[#2b313a] transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switcher */}
        <div className="grid grid-cols-3 p-2 bg-[#0b0e11]/60 border-b border-[#2b313a]/50 gap-1 text-xs font-mono font-bold">
          <button
            onClick={() => setActiveTab('pnl')}
            className={`py-2 rounded-xl transition-all ${
              activeTab === 'pnl' ? 'bg-[#F0B90B] text-[#181a20]' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            PnL & Margin
          </button>
          <button
            onClick={() => setActiveTab('target')}
            className={`py-2 rounded-xl transition-all ${
              activeTab === 'target' ? 'bg-[#F0B90B] text-[#181a20]' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Target Price
          </button>
          <button
            onClick={() => setActiveTab('liquidation')}
            className={`py-2 rounded-xl transition-all ${
              activeTab === 'liquidation' ? 'bg-[#F0B90B] text-[#181a20]' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Liquidation Price
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-4 font-mono text-xs">
          {/* Side Selector */}
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => setSide('LONG')}
              className={`py-2.5 rounded-xl font-black transition-all flex items-center justify-center gap-1.5 ${
                side === 'LONG'
                  ? 'bg-[#0ECB81] text-[#0b0e11] shadow-md shadow-[#0ECB81]/20'
                  : isDark ? 'bg-[#0b0e11] text-slate-400' : 'bg-slate-100 text-slate-600'
              }`}
            >
              <TrendingUp className="w-4 h-4" /> LONG / BUY
            </button>
            <button
              onClick={() => setSide('SHORT')}
              className={`py-2.5 rounded-xl font-black transition-all flex items-center justify-center gap-1.5 ${
                side === 'SHORT'
                  ? 'bg-[#F6465D] text-white shadow-md shadow-[#F6465D]/20'
                  : isDark ? 'bg-[#0b0e11] text-slate-400' : 'bg-slate-100 text-slate-600'
              }`}
            >
              <TrendingDown className="w-4 h-4" /> SHORT / SELL
            </button>
          </div>

          {/* Leverage Slider */}
          <div>
            <div className="flex justify-between mb-1">
              <label className="text-slate-400">Leverage</label>
              <span className="text-[#F0B90B] font-bold">{leverage}x</span>
            </div>
            <input
              type="range"
              min="1"
              max="125"
              value={leverage}
              onChange={(e) => setLeverage(parseInt(e.target.value))}
              className="w-full accent-[#F0B90B]"
            />
          </div>

          {/* Dynamic Inputs based on tab */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-400 mb-1">Entry Price (USDT)</label>
              <input
                type="number"
                value={entryPrice}
                onChange={(e) => setEntryPrice(e.target.value)}
                className={`w-full px-3 py-2 rounded-xl border text-sm font-bold ${
                  isDark ? 'bg-[#0b0e11] border-[#2b313a] text-slate-100' : 'bg-slate-50 border-slate-300'
                }`}
              />
            </div>

            {activeTab === 'pnl' && (
              <div>
                <label className="block text-slate-400 mb-1">Exit Price (USDT)</label>
                <input
                  type="number"
                  value={exitPrice}
                  onChange={(e) => setExitPrice(e.target.value)}
                  className={`w-full px-3 py-2 rounded-xl border text-sm font-bold ${
                    isDark ? 'bg-[#0b0e11] border-[#2b313a] text-slate-100' : 'bg-slate-50 border-slate-300'
                  }`}
                />
              </div>
            )}

            {activeTab === 'target' && (
              <div>
                <label className="block text-slate-400 mb-1">Desired ROI (%)</label>
                <input
                  type="number"
                  value={targetRoi}
                  onChange={(e) => setTargetRoi(e.target.value)}
                  className={`w-full px-3 py-2 rounded-xl border text-sm font-bold ${
                    isDark ? 'bg-[#0b0e11] border-[#2b313a] text-slate-100' : 'bg-slate-50 border-slate-300'
                  }`}
                />
              </div>
            )}

            {activeTab === 'liquidation' && (
              <div>
                <label className="block text-slate-400 mb-1">Position Value (USDT)</label>
                <input
                  type="number"
                  value={quantityUSD}
                  onChange={(e) => setQuantityUSD(e.target.value)}
                  className={`w-full px-3 py-2 rounded-xl border text-sm font-bold ${
                    isDark ? 'bg-[#0b0e11] border-[#2b313a] text-slate-100' : 'bg-slate-50 border-slate-300'
                  }`}
                />
              </div>
            )}
          </div>

          {activeTab === 'pnl' && (
            <div>
              <label className="block text-slate-400 mb-1">Position Notional Value (USDT)</label>
              <input
                type="number"
                value={quantityUSD}
                onChange={(e) => setQuantityUSD(e.target.value)}
                className={`w-full px-3 py-2 rounded-xl border text-sm font-bold ${
                  isDark ? 'bg-[#0b0e11] border-[#2b313a] text-slate-100' : 'bg-slate-50 border-slate-300'
                }`}
              />
            </div>
          )}

          {/* Results Box */}
          <div className="p-4 rounded-2xl bg-[#0b0e11] border border-[#2b313a] space-y-2">
            {activeTab === 'pnl' && (
              <>
                <div className="flex justify-between">
                  <span className="text-slate-400">Required Margin:</span>
                  <span className="font-bold text-slate-200">${initialMargin.toFixed(2)} USDT</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Expected Profit (USD):</span>
                  <span className={`font-black text-sm ${pnlUSD >= 0 ? 'text-[#0ECB81]' : 'text-[#F6465D]'}`}>
                    {pnlUSD >= 0 ? '+' : ''}${pnlUSD.toFixed(2)} USDT
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Estimated Return on Equity (ROE):</span>
                  <span className={`font-black text-sm ${roiPct >= 0 ? 'text-[#0ECB81]' : 'text-[#F6465D]'}`}>
                    {roiPct >= 0 ? '+' : ''}{roiPct.toFixed(2)}%
                  </span>
                </div>
              </>
            )}

            {activeTab === 'target' && (
              <>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Required Price Change:</span>
                  <span className="font-bold text-slate-200">{requiredPriceMovePct >= 0 ? '+' : ''}{(requiredPriceMovePct * 100).toFixed(2)}%</span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-[#2b313a]">
                  <span className="text-slate-400">Target Take Profit Price:</span>
                  <span className="font-black text-base text-[#0ECB81]">${targetExitPrice.toFixed(selectedCoin.precision)} USDT</span>
                </div>
              </>
            )}

            {activeTab === 'liquidation' && (
              <>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Maintenance Margin Buffer:</span>
                  <span className="font-bold text-slate-200">0.50%</span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-[#2b313a]">
                  <span className="text-slate-400">Estimated Liquidation Price:</span>
                  <span className="font-black text-base text-red-400">${liqPrice.toFixed(selectedCoin.precision)} USDT</span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

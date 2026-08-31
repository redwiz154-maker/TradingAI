import React, { useState } from 'react';
import { Repeat, ArrowDown, ShieldCheck, Check, Sparkles, X } from 'lucide-react';
import { useCrypto } from '../context/CryptoContext';

export const ConvertModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const { 
    coins, 
    balances, 
    convertAssets, 
    theme, 
    formatPrice 
  } = useCrypto();

  const [fromAsset, setFromAsset] = useState<string>('USDT');
  const [toAsset, setToAsset] = useState<string>('BTC');
  const [fromAmount, setFromAmount] = useState<string>('1000');

  if (!isOpen) return null;

  const isDark = theme === 'dark';

  const numFrom = parseFloat(fromAmount) || 0;
  const fromCoin = coins.find(c => c.baseAsset === fromAsset);
  const toCoin = coins.find(c => c.baseAsset === toAsset);

  const fromUSD = fromAsset === 'USDT' || fromAsset === 'USD' ? 1 : fromCoin?.price || 1;
  const toUSD = toAsset === 'USDT' || toAsset === 'USD' ? 1 : toCoin?.price || 1;

  const totalUSD = numFrom * fromUSD;
  const estimatedReceived = (totalUSD / toUSD).toFixed(toAsset === 'USDT' ? 2 : 6);
  const conversionRate = (fromUSD / toUSD).toFixed(toAsset === 'USDT' ? 2 : 8);

  const handleSwapAssets = () => {
    const temp = fromAsset;
    setFromAsset(toAsset);
    setToAsset(temp);
  };

  const handleConvert = (e: React.FormEvent) => {
    e.preventDefault();
    if (numFrom <= 0) return;
    const res = convertAssets(fromAsset, toAsset, numFrom);
    if (res.success) {
      onClose();
    }
  };

  const assetOptions = ['USDT', 'BTC', 'ETH', 'BNB', 'SOL', 'XRP', 'DOGE', 'FET', 'PEPE'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-fadeIn">
      <div className={`p-6 rounded-3xl border max-w-md w-full space-y-4 text-xs font-sans relative ${
        isDark ? 'bg-[#181a20] border-[#F0B90B]/40 text-slate-100' : 'bg-white border-slate-200 text-slate-900 shadow-2xl'
      }`}>
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-700/40">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#F0B90B]/20 text-[#F0B90B] flex items-center justify-center font-bold">
              <Repeat className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-black text-base">Binance Convert & Swap</h3>
              <span className="text-[10px] text-[#0ECB81] font-bold">0% Transaction Fees • Guaranteed Quote</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleConvert} className="space-y-3 font-mono">
          {/* From Input */}
          <div className={`p-3.5 rounded-2xl border ${isDark ? 'bg-[#0b0e11] border-[#2b313a]' : 'bg-slate-50 border-slate-200'}`}>
            <div className="flex justify-between text-slate-400 mb-1.5 text-[11px]">
              <span>From (Spend)</span>
              <span>Available: {(balances.spot[fromAsset] || 0)} {fromAsset}</span>
            </div>
            <div className="flex items-center justify-between gap-3">
              <input
                type="number"
                step="any"
                value={fromAmount}
                onChange={(e) => setFromAmount(e.target.value)}
                placeholder="0.00"
                className="w-full bg-transparent font-bold text-lg text-slate-100 focus:outline-none"
              />
              <select
                value={fromAsset}
                onChange={(e) => setFromAsset(e.target.value)}
                className="p-2 rounded-xl bg-[#2b313a] text-slate-100 font-bold text-xs focus:outline-none cursor-pointer"
              >
                {assetOptions.map(a => (
                  <option key={a} value={a} disabled={a === toAsset}>{a}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Swap Middle Button */}
          <div className="flex justify-center -my-1 relative z-10">
            <button
              type="button"
              onClick={handleSwapAssets}
              className="p-2 rounded-full bg-[#2b313a] hover:bg-[#F0B90B] text-slate-200 hover:text-[#181a20] shadow-md border border-slate-700 transition-colors"
            >
              <ArrowDown className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* To Input */}
          <div className={`p-3.5 rounded-2xl border ${isDark ? 'bg-[#0b0e11] border-[#2b313a]' : 'bg-slate-50 border-slate-200'}`}>
            <div className="flex justify-between text-slate-400 mb-1.5 text-[11px]">
              <span>To (Receive Guaranteed)</span>
              <span>Estimated Rate</span>
            </div>
            <div className="flex items-center justify-between gap-3">
              <div className="font-bold text-lg text-[#0ECB81]">{estimatedReceived}</div>
              <select
                value={toAsset}
                onChange={(e) => setToAsset(e.target.value)}
                className="p-2 rounded-xl bg-[#2b313a] text-slate-100 font-bold text-xs focus:outline-none cursor-pointer"
              >
                {assetOptions.map(a => (
                  <option key={a} value={a} disabled={a === fromAsset}>{a}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Quote summary */}
          <div className={`p-3 rounded-2xl border space-y-1 text-[11px] text-slate-400 ${
            isDark ? 'bg-[#0b0e11] border-slate-800' : 'bg-slate-50 border-slate-200'
          }`}>
            <div className="flex justify-between">
              <span>Price Rate:</span>
              <span className="font-bold text-slate-200">1 {fromAsset} = {conversionRate} {toAsset}</span>
            </div>
            <div className="flex justify-between">
              <span>Slippage:</span>
              <span className="text-[#0ECB81] font-bold">0.00% (Guaranteed)</span>
            </div>
            <div className="flex justify-between">
              <span>Deposit To:</span>
              <span className="text-slate-200 font-bold">Spot Wallet</span>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={numFrom <= 0}
            className="w-full py-3.5 rounded-2xl bg-[#F0B90B] hover:bg-[#FCD535] text-[#181a20] font-black text-sm shadow-lg shadow-[#F0B90B]/25 active:scale-98 transition-all disabled:opacity-50"
          >
            Confirm 0-Fee Swap
          </button>
        </form>
      </div>
    </div>
  );
};

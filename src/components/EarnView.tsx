import React, { useState } from 'react';
import { 
  Sparkles, Lock, ShieldCheck, Zap, 
  Coins, ArrowRight, CheckCircle, Clock 
} from 'lucide-react';
import { useCrypto } from '../context/CryptoContext';
import { STAKING_PRODUCTS } from '../data/cryptoData';
import { StakingProduct } from '../types';

export const EarnView: React.FC = () => {
  const { 
    stakedPositions, 
    stakeAsset, 
    unstakeAsset, 
    claimAllEarnInterest, 
    balances, 
    theme, 
    formatPrice 
  } = useCrypto();

  const [selectedProduct, setSelectedProduct] = useState<StakingProduct | null>(null);
  const [stakeAmount, setStakeAmount] = useState<string>('');
  const [filterCat, setFilterCat] = useState<'all' | 'simple_earn' | 'launchpool' | 'locked_staking'>('all');

  const isDark = theme === 'dark';

  const handleStakeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct) return;
    const num = parseFloat(stakeAmount);
    if (!num || num <= 0) return;

    const success = stakeAsset(selectedProduct.id, num);
    if (success) {
      setSelectedProduct(null);
      setStakeAmount('');
    }
  };

  const filteredProducts = STAKING_PRODUCTS.filter(p => 
    filterCat === 'all' ? true : p.category === filterCat
  );

  const totalAccruedYield = stakedPositions.reduce((sum, item) => sum + item.accruedInterest, 0);

  return (
    <div className={`flex flex-col h-full overflow-y-auto p-4 lg:p-6 space-y-6 ${
      isDark ? 'bg-[#0b0e11] text-slate-100' : 'bg-slate-50 text-slate-900'
    }`}>
      {/* Top Banner with Real-time Compounding Counter */}
      <div className={`p-6 rounded-3xl border flex flex-wrap items-center justify-between gap-6 ${
        isDark ? 'bg-gradient-to-r from-[#181a20] to-[#1e2329] border-[#2b313a]' : 'bg-white border-slate-200 shadow-md'
      }`}>
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-[#F0B90B] font-bold text-xs">
            <Sparkles className="w-4 h-4" />
            <span>BINANCE SIMPLE EARN & STAKING</span>
          </div>
          <h2 className="text-2xl font-black tracking-tight">Earn Daily Compound Crypto Yields</h2>
          <p className="text-xs text-slate-400 max-w-xl">
            Deposit idle USDT, BTC, BNB, and SOL into insured protocol vaults. Real-time compounding interest calculated and credited every single second.
          </p>
        </div>

        {/* Live Staking Yield Counter Box */}
        <div className={`p-4 rounded-2xl border flex items-center gap-4 ${
          isDark ? 'bg-[#0b0e11] border-[#2b313a]' : 'bg-slate-50 border-slate-200'
        }`}>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
              Live Accrued Interest
            </span>
            <div className="flex items-center gap-1.5 font-mono text-xl font-black text-[#0ECB81]">
              <Coins className="w-5 h-5" />
              <span>+${totalAccruedYield.toFixed(6)}</span>
            </div>
          </div>
          <button
            onClick={claimAllEarnInterest}
            disabled={totalAccruedYield <= 0}
            className="px-4 py-2 rounded-xl bg-[#0ECB81] hover:bg-[#0ECB81]/90 text-white font-bold text-xs shadow-md shadow-[#0ECB81]/20 active:scale-95 disabled:opacity-40 transition-all"
          >
            Claim All
          </button>
        </div>
      </div>

      {/* Active User Staking Positions */}
      {stakedPositions.length > 0 && (
        <div className={`p-6 rounded-3xl border ${
          isDark ? 'bg-[#121418] border-[#1e2329]' : 'bg-white border-slate-200 shadow-sm'
        }`}>
          <h3 className="font-bold text-base mb-4 flex items-center gap-2">
            <span>My Active Staking Positions</span>
            <span className="px-2 py-0.5 rounded bg-[#0ECB81]/20 text-[#0ECB81] font-mono text-xs font-bold">
              {stakedPositions.filter(s => s.status === 'active').length} Active
            </span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {stakedPositions.map(pos => {
              if (pos.status !== 'active') return null;
              return (
                <div
                  key={pos.id}
                  className={`p-4 rounded-2xl border flex flex-col justify-between ${
                    isDark ? 'bg-[#181a20] border-[#2b313a]' : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm text-slate-100">{pos.asset} Staking</span>
                      <span className="px-2 py-0.5 rounded bg-[#0ECB81]/20 text-[#0ECB81] font-mono text-xs font-bold">
                        {pos.apr}% APR
                      </span>
                    </div>

                    <div className="space-y-1 text-xs font-mono text-slate-400">
                      <div className="flex justify-between">
                        <span>Principal:</span>
                        <span className="font-bold text-slate-200">{pos.amount} {pos.asset}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Live Accrued:</span>
                        <span className="font-bold text-[#0ECB81]">+{pos.accruedInterest.toFixed(6)} {pos.asset}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Duration:</span>
                        <span className="text-slate-300 capitalize">{pos.durationDays === 'flexible' ? 'Flexible (Instant Redeem)' : `${pos.durationDays} Days`}</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => unstakeAsset(pos.id)}
                    className="w-full mt-3 py-2 rounded-xl bg-slate-700/30 hover:bg-rose-500/20 text-slate-300 hover:text-rose-400 font-bold text-xs border border-slate-700/40 transition-colors"
                  >
                    Redeem to Spot Wallet
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Staking Products Catalog */}
      <div className={`p-6 rounded-3xl border ${
        isDark ? 'bg-[#121418] border-[#1e2329]' : 'bg-white border-slate-200 shadow-sm'
      }`}>
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <h3 className="font-bold text-lg">Guaranteed Yield Products</h3>

          {/* Category tabs */}
          <div className="flex gap-2 text-xs font-bold">
            {[
              { id: 'all', label: 'All Products' },
              { id: 'simple_earn', label: 'Simple Flexible Earn' },
              { id: 'launchpool', label: 'Launchpool & BNB Vault' },
              { id: 'locked_staking', label: 'Locked Staking' }
            ].map(cat => (
              <button
                key={cat.id}
                onClick={() => setFilterCat(cat.id as any)}
                className={`px-3 py-1.5 rounded-xl transition-all ${
                  filterCat === cat.id
                    ? 'bg-[#F0B90B] text-[#181a20] shadow-xs'
                    : isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Product Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredProducts.map(prod => (
            <div
              key={prod.id}
              className={`p-5 rounded-3xl border flex flex-col justify-between transition-all hover:border-[#F0B90B]/50 ${
                isDark ? 'bg-[#181a20] border-[#2b313a]' : 'bg-slate-50 border-slate-200 shadow-xs'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-base text-slate-100">{prod.name}</span>
                  <span className="px-2 py-0.5 rounded-lg bg-[#0ECB81]/20 text-[#0ECB81] font-mono text-sm font-black">
                    {prod.apr}% APR
                  </span>
                </div>

                <p className="text-xs text-slate-400 mb-4 leading-relaxed font-sans">{prod.description}</p>

                <div className="space-y-1.5 text-xs font-mono text-slate-400 mb-4">
                  <div className="flex justify-between">
                    <span>Duration:</span>
                    <span className="font-bold text-slate-200 capitalize">
                      {prod.durationDays === 'flexible' ? 'Flexible (Instant Exit)' : `${prod.durationDays} Days Locked`}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Min Deposit:</span>
                    <span className="font-bold text-slate-200">{prod.minDeposit} {prod.asset}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Spot Available:</span>
                    <span className="font-bold text-[#F0B90B]">
                      {(balances.spot[prod.asset] || 0)} {prod.asset}
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => {
                  setSelectedProduct(prod);
                  setStakeAmount((balances.spot[prod.asset] || 0).toString());
                }}
                className="w-full py-2.5 rounded-xl bg-[#F0B90B] hover:bg-[#FCD535] text-[#181a20] font-black text-xs shadow-md shadow-[#F0B90B]/20 transition-transform active:scale-95"
              >
                Stake {prod.asset}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Stake Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
          <div className="p-6 rounded-3xl bg-[#181a20] border border-[#F0B90B]/50 max-w-md w-full space-y-4 text-xs font-sans animate-fadeIn">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-lg text-slate-100">Deposit into {selectedProduct.name}</h3>
              <span className="px-2.5 py-1 rounded-lg bg-[#0ECB81]/20 text-[#0ECB81] font-mono font-bold">
                {selectedProduct.apr}% APR
              </span>
            </div>

            <form onSubmit={handleStakeSubmit} className="space-y-4 font-mono">
              <div>
                <div className="flex justify-between text-slate-400 mb-1 text-[11px]">
                  <span>Amount to Stake ({selectedProduct.asset})</span>
                  <span>Available: {(balances.spot[selectedProduct.asset] || 0)} {selectedProduct.asset}</span>
                </div>
                <input
                  type="number"
                  step="any"
                  value={stakeAmount}
                  onChange={(e) => setStakeAmount(e.target.value)}
                  placeholder={`Min: ${selectedProduct.minDeposit}`}
                  className="w-full p-3 rounded-xl bg-[#0b0e11] border border-[#2b313a] text-slate-100 font-bold text-sm focus:outline-none focus:border-[#F0B90B]"
                />
              </div>

              <div className="p-3 rounded-xl bg-[#0b0e11] border border-slate-800 text-[11px] space-y-1 text-slate-400">
                <div className="flex justify-between">
                  <span>Interest Distribution:</span>
                  <span className="text-[#0ECB81] font-bold">Every Second (Live Compound)</span>
                </div>
                <div className="flex justify-between">
                  <span>Principal Redemption:</span>
                  <span className="text-slate-200 font-bold">Instant to Spot Wallet</span>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedProduct(null)}
                  className="flex-1 py-2.5 rounded-xl bg-[#2b313a] text-slate-300 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-[#F0B90B] text-[#181a20] font-black"
                >
                  Confirm Staking
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

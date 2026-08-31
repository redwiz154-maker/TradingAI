import React, { useState } from 'react';
import { 
  Wallet, ArrowDownCircle, ArrowUpCircle, 
  Repeat, Eye, EyeOff, ShieldCheck, PieChart, 
  Layers, ArrowRightLeft, Clock, Search 
} from 'lucide-react';
import { useCrypto } from '../context/CryptoContext';
import { WalletBalances } from '../types';

export const WalletView: React.FC<{
  onOpenDeposit: () => void;
  onOpenWithdraw: () => void;
}> = ({ onOpenDeposit, onOpenWithdraw }) => {
  const { 
    balances, 
    totalPortfolioUSD, 
    coins, 
    transferWallet, 
    theme, 
    formatPrice, 
    formatCurrency 
  } = useCrypto();

  const [hideBalances, setHideBalances] = useState(false);
  const [activeSubWallet, setActiveSubWallet] = useState<keyof WalletBalances>('spot');
  const [transferModal, setTransferModal] = useState(false);

  // Transfer form state
  const [fromWallet, setFromWallet] = useState<keyof WalletBalances>('spot');
  const [toWallet, setToWallet] = useState<keyof WalletBalances>('futures');
  const [transferAsset, setTransferAsset] = useState<string>('USDT');
  const [transferAmount, setTransferAmount] = useState<string>('');

  const isDark = theme === 'dark';

  const btcPrice = coins.find(c => c.symbol === 'BTC')?.price || 88450;
  const btcEquivalent = (totalPortfolioUSD / btcPrice).toFixed(6);

  const handleTransferSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const num = parseFloat(transferAmount);
    if (!num || num <= 0) return;

    const success = transferWallet(fromWallet, toWallet, transferAsset, num);
    if (success) {
      setTransferModal(false);
      setTransferAmount('');
    }
  };

  const walletTabs: { id: keyof WalletBalances; label: string; desc: string }[] = [
    { id: 'spot', label: 'Spot Account', desc: 'Trading & Cash balances' },
    { id: 'futures', label: 'Futures Margin', desc: 'USDT-M Perpetual margin' },
    { id: 'earn', label: 'Simple Earn', desc: 'Compounding staking yields' },
    { id: 'funding', label: 'Funding / P2P', desc: 'P2P escrow & deposits' }
  ];

  return (
    <div className={`flex flex-col h-full overflow-y-auto p-4 lg:p-6 space-y-6 ${
      isDark ? 'bg-[#0b0e11] text-slate-100' : 'bg-slate-50 text-slate-900'
    }`}>
      {/* Top Portfolio Summary Header */}
      <div className={`p-6 rounded-3xl border flex flex-wrap items-center justify-between gap-6 ${
        isDark ? 'bg-gradient-to-r from-[#181a20] to-[#1e2329] border-[#2b313a]' : 'bg-white border-slate-200 shadow-md'
      }`}>
        <div className="space-y-2">
          <div className="flex items-center gap-3 text-xs text-slate-400 font-bold">
            <span className="flex items-center gap-1.5 text-[#F0B90B]">
              <Wallet className="w-4 h-4" /> Estimated Total Balance
            </span>
            <button
              onClick={() => setHideBalances(!hideBalances)}
              className="p-1 rounded-lg hover:text-white transition-colors"
              title={hideBalances ? 'Show Balances' : 'Hide Balances'}
            >
              {hideBalances ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            </button>
          </div>

          <div className="flex items-baseline gap-3">
            <h1 className="text-3xl lg:text-4xl font-black font-mono tracking-tight text-[#F0B90B]">
              {hideBalances ? '••••••••' : formatCurrency(totalPortfolioUSD)}
            </h1>
            <span className="text-sm font-mono text-slate-400 font-bold">
              ≈ {hideBalances ? '••••' : btcEquivalent} BTC
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono">
            <span className="text-slate-400">Today's Realized PnL:</span>
            <span className="text-[#0ECB81] font-bold">+$482.50 (+1.84%)</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={onOpenDeposit}
            className="px-4 py-2.5 rounded-xl bg-[#F0B90B] hover:bg-[#FCD535] text-[#181a20] font-black text-xs flex items-center gap-1.5 shadow-md shadow-[#F0B90B]/20 active:scale-95 transition-all"
          >
            <ArrowDownCircle className="w-4 h-4" />
            <span>Deposit Crypto</span>
          </button>

          <button
            onClick={onOpenWithdraw}
            className="px-4 py-2.5 rounded-xl bg-[#2b313a] hover:bg-slate-700 text-slate-100 font-bold text-xs flex items-center gap-1.5 transition-colors"
          >
            <ArrowUpCircle className="w-4 h-4" />
            <span>Withdraw</span>
          </button>

          <button
            onClick={() => setTransferModal(true)}
            className="px-4 py-2.5 rounded-xl bg-[#2b313a] hover:bg-slate-700 text-slate-100 font-bold text-xs flex items-center gap-1.5 transition-colors"
          >
            <ArrowRightLeft className="w-4 h-4 text-[#F0B90B]" />
            <span>Internal Transfer</span>
          </button>
        </div>
      </div>

      {/* Sub-Accounts Grid Tabs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {walletTabs.map(tab => {
          let walletSumUSD = 0;
          (Object.entries(balances[tab.id] || {}) as [string, number][]).forEach(([asset, amount]) => {
            if (asset === 'USDT' || asset === 'USD') walletSumUSD += (amount as number);
            else {
              const coin = coins.find(c => c.baseAsset === asset);
              walletSumUSD += (amount as number) * (coin?.price || 0);
            }
          });

          const isActive = activeSubWallet === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveSubWallet(tab.id)}
              className={`p-5 rounded-3xl border text-left transition-all ${
                isActive
                  ? 'border-[#F0B90B] bg-[#F0B90B]/10 shadow-md shadow-[#F0B90B]/10'
                  : isDark ? 'border-[#2b313a] bg-[#181a20] hover:border-slate-700' : 'border-slate-200 bg-white shadow-sm'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-sm text-slate-100">{tab.label}</span>
                <span className="text-[10px] text-slate-400">{tab.desc}</span>
              </div>
              <div className="text-xl font-black font-mono text-[#F0B90B]">
                {hideBalances ? '••••••' : `$${walletSumUSD.toLocaleString('en-US', { minimumFractionDigits: 2 })}`}
              </div>
            </button>
          );
        })}
      </div>

      {/* Detailed Asset Balances Table for Active Sub-Wallet */}
      <div className={`p-6 rounded-3xl border overflow-hidden ${
        isDark ? 'bg-[#121418] border-[#1e2329]' : 'bg-white border-slate-200 shadow-sm'
      }`}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-base text-slate-100 capitalize">
            {activeSubWallet} Account Asset Holdings
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className={`text-[10px] uppercase font-bold text-slate-400 border-b ${
              isDark ? 'bg-[#181a20] border-[#1e2329]' : 'bg-slate-50 border-slate-200'
            }`}>
              <tr>
                <th className="py-3 px-4">Asset</th>
                <th className="py-3 px-4">Total Amount</th>
                <th className="py-3 px-4">Live Coin Price</th>
                <th className="py-3 px-4">Value (USD)</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/20 font-sans">
              {(Object.entries(balances[activeSubWallet] || {}) as [string, number][]).map(([asset, amount]) => {
                const coin = coins.find(c => c.baseAsset === asset);
                const price = asset === 'USDT' || asset === 'USD' ? 1 : coin?.price || 0;
                const valueUSD = (amount as number) * price;

                return (
                  <tr key={asset} className={`hover:bg-slate-800/10 ${isDark ? 'hover:bg-[#181a20]' : 'hover:bg-slate-50'}`}>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-amber-500/10 text-[#F0B90B] font-bold text-xs flex items-center justify-center font-mono">
                          {asset.slice(0, 3)}
                        </div>
                        <span className="font-bold text-sm text-slate-100">{asset}</span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 font-mono font-bold text-slate-200">
                      {hideBalances ? '••••' : amount.toLocaleString()}
                    </td>

                    <td className="py-3.5 px-4 font-mono text-slate-400">
                      ${formatPrice(price)}
                    </td>

                    <td className="py-3.5 px-4 font-mono font-bold text-[#F0B90B]">
                      {hideBalances ? '••••' : `$${valueUSD.toLocaleString('en-US', { minimumFractionDigits: 2 })}`}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => {
                          setTransferAsset(asset);
                          setTransferModal(true);
                        }}
                        className="px-3 py-1 rounded-lg bg-[#2b313a] hover:bg-[#F0B90B] hover:text-[#181a20] text-slate-300 font-bold text-xs transition-colors"
                      >
                        Transfer
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Internal Transfer Modal */}
      {transferModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
          <div className="p-6 rounded-3xl bg-[#181a20] border border-[#F0B90B]/50 max-w-md w-full space-y-4 text-xs font-sans animate-fadeIn">
            <h3 className="font-bold text-lg text-slate-100 flex items-center gap-2">
              <ArrowRightLeft className="w-5 h-5 text-[#F0B90B]" />
              <span>Internal Wallet Transfer</span>
            </h3>

            <form onSubmit={handleTransferSubmit} className="space-y-4 font-mono">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 block text-[11px] mb-1">From Account</label>
                  <select
                    value={fromWallet}
                    onChange={(e) => setFromWallet(e.target.value as any)}
                    className="w-full p-2.5 rounded-xl bg-[#0b0e11] border border-[#2b313a] text-slate-200 font-bold focus:outline-none"
                  >
                    <option value="spot">Spot Account</option>
                    <option value="futures">Futures Margin</option>
                    <option value="earn">Simple Earn</option>
                    <option value="funding">Funding / P2P</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-400 block text-[11px] mb-1">To Account</label>
                  <select
                    value={toWallet}
                    onChange={(e) => setToWallet(e.target.value as any)}
                    className="w-full p-2.5 rounded-xl bg-[#0b0e11] border border-[#2b313a] text-slate-200 font-bold focus:outline-none"
                  >
                    <option value="futures">Futures Margin</option>
                    <option value="spot">Spot Account</option>
                    <option value="earn">Simple Earn</option>
                    <option value="funding">Funding / P2P</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-slate-400 block text-[11px] mb-1">Asset to Transfer</label>
                <select
                  value={transferAsset}
                  onChange={(e) => setTransferAsset(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-[#0b0e11] border border-[#2b313a] text-slate-200 font-bold focus:outline-none"
                >
                  <option value="USDT">USDT (Tether)</option>
                  <option value="BTC">BTC (Bitcoin)</option>
                  <option value="ETH">ETH (Ethereum)</option>
                  <option value="BNB">BNB (Binance Coin)</option>
                  <option value="SOL">SOL (Solana)</option>
                </select>
              </div>

              <div>
                <div className="flex justify-between text-slate-400 mb-1 text-[11px]">
                  <span>Transfer Amount</span>
                  <span>
                    Available: {(balances[fromWallet][transferAsset] || 0)} {transferAsset}
                  </span>
                </div>
                <input
                  type="number"
                  step="any"
                  value={transferAmount}
                  onChange={(e) => setTransferAmount(e.target.value)}
                  placeholder="0.00"
                  className="w-full p-3 rounded-xl bg-[#0b0e11] border border-[#2b313a] text-slate-100 font-bold text-sm focus:outline-none focus:border-[#F0B90B]"
                />
              </div>

              <div className="p-3 rounded-xl bg-[#0b0e11] border border-slate-800 text-[11px] space-y-1 text-slate-400">
                <div className="flex justify-between">
                  <span>Transfer Fee:</span>
                  <span className="text-[#0ECB81] font-bold">0.00 USDT (Free)</span>
                </div>
                <div className="flex justify-between">
                  <span>Execution Speed:</span>
                  <span className="text-slate-200 font-bold">Instant</span>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setTransferModal(false)}
                  className="flex-1 py-2.5 rounded-xl bg-[#2b313a] text-slate-300 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-[#F0B90B] text-[#181a20] font-black"
                >
                  Confirm Transfer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

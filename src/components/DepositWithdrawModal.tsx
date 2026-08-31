import React, { useState } from 'react';
import { 
  ArrowDownCircle, ArrowUpCircle, Copy, Check, 
  QrCode, ShieldCheck, X, AlertCircle 
} from 'lucide-react';
import { useCrypto } from '../context/CryptoContext';

export const DepositWithdrawModal: React.FC<{
  isOpen: boolean;
  mode: 'deposit' | 'withdraw';
  onClose: () => void;
}> = ({ isOpen, mode: initialMode, onClose }) => {
  const { 
    balances, 
    depositCrypto, 
    withdrawCrypto, 
    theme, 
    showToast 
  } = useCrypto();

  const [mode, setMode] = useState<'deposit' | 'withdraw'>(initialMode);
  const [selectedAsset, setSelectedAsset] = useState<string>('USDT');
  const [network, setNetwork] = useState<string>('TRC20');
  const [amount, setAmount] = useState<string>('500');
  const [withdrawAddress, setWithdrawAddress] = useState<string>('');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const isDark = theme === 'dark';

  const addresses: Record<string, string> = {
    TRC20: 'TX8Q2f9N4Lh8y7bM5cK4zG1pQ9wR3vS7eT',
    ERC20: '0x71C...8849b294A06B95bEC09a',
    BEP20: '0x32A...F0b90b848092BEEF99a',
    Solana: '7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU'
  };

  const currentAddress = addresses[network] || addresses.TRC20;

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(currentAddress);
    setCopied(true);
    showToast('Deposit address copied to clipboard!', 'info');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDeposit = (e: React.FormEvent) => {
    e.preventDefault();
    const num = parseFloat(amount);
    if (!num || num <= 0) return;
    depositCrypto(selectedAsset, num);
    onClose();
  };

  const handleWithdraw = (e: React.FormEvent) => {
    e.preventDefault();
    const num = parseFloat(amount);
    if (!num || num <= 0 || !withdrawAddress) return;
    const success = withdrawCrypto(selectedAsset, num, withdrawAddress);
    if (success) {
      onClose();
    }
  };

  const assetList = ['USDT', 'BTC', 'ETH', 'BNB', 'SOL', 'XRP', 'DOGE'];
  const networks = ['TRC20', 'ERC20', 'BEP20', 'Solana'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-fadeIn">
      <div className={`p-6 rounded-3xl border max-w-lg w-full space-y-4 text-xs font-sans relative ${
        isDark ? 'bg-[#181a20] border-[#F0B90B]/40 text-slate-100' : 'bg-white border-slate-200 text-slate-900 shadow-2xl'
      }`}>
        {/* Header with Mode Toggle */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-700/40">
          <div className="flex items-center gap-2">
            <div className={`flex p-1 rounded-xl border ${isDark ? 'bg-[#0b0e11] border-[#2b313a]' : 'bg-slate-100 border-slate-200'}`}>
              <button
                onClick={() => setMode('deposit')}
                className={`px-4 py-1.5 rounded-lg font-bold text-xs transition-all ${
                  mode === 'deposit' ? 'bg-[#F0B90B] text-[#181a20] shadow-xs' : 'text-slate-400'
                }`}
              >
                Deposit Crypto
              </button>
              <button
                onClick={() => setMode('withdraw')}
                className={`px-4 py-1.5 rounded-lg font-bold text-xs transition-all ${
                  mode === 'withdraw' ? 'bg-[#F0B90B] text-[#181a20] shadow-xs' : 'text-slate-400'
                }`}
              >
                Withdraw Crypto
              </button>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Asset & Network Selectors */}
        <div className="grid grid-cols-2 gap-3 font-mono">
          <div>
            <label className="text-slate-400 block text-[11px] mb-1 font-sans">Select Coin</label>
            <select
              value={selectedAsset}
              onChange={(e) => setSelectedAsset(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-[#0b0e11] border border-[#2b313a] text-slate-200 font-bold focus:outline-none"
            >
              {assetList.map(a => (
                <option key={a} value={a}>{a}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-slate-400 block text-[11px] mb-1 font-sans">Transfer Network</label>
            <select
              value={network}
              onChange={(e) => setNetwork(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-[#0b0e11] border border-[#2b313a] text-slate-200 font-bold focus:outline-none"
            >
              {networks.map(n => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
          </div>
        </div>

        {mode === 'deposit' ? (
          /* Deposit Tab View */
          <form onSubmit={handleDeposit} className="space-y-4 font-mono">
            {/* QR Code & Deposit Address Box */}
            <div className={`p-4 rounded-2xl border flex flex-col sm:flex-row items-center gap-4 ${
              isDark ? 'bg-[#0b0e11] border-[#2b313a]' : 'bg-slate-50 border-slate-200'
            }`}>
              {/* Mock QR Canvas */}
              <div className="w-28 h-28 bg-white p-2 rounded-xl flex items-center justify-center shrink-0 shadow-md">
                <div className="w-full h-full border-2 border-slate-900 border-dashed rounded flex flex-col items-center justify-center text-slate-900">
                  <QrCode className="w-16 h-16" />
                </div>
              </div>

              <div className="flex-1 space-y-2 text-left w-full">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">
                  {selectedAsset} Deposit Address ({network})
                </span>
                <div className="p-2 rounded-lg bg-[#181a20] border border-slate-800 text-[11px] break-all font-bold text-[#F0B90B]">
                  {currentAddress}
                </div>
                <button
                  type="button"
                  onClick={handleCopyAddress}
                  className="px-3 py-1.5 rounded-lg bg-[#2b313a] hover:bg-[#F0B90B] text-slate-200 hover:text-[#181a20] font-bold text-xs flex items-center gap-1.5 transition-colors"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-[#0ECB81]" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Address Copied' : 'Copy Address'}</span>
                </button>
              </div>
            </div>

            {/* Simulated Deposit Amount Input */}
            <div>
              <label className="text-slate-400 block text-[11px] mb-1 font-sans">
                Simulate Blockchain Deposit Amount ({selectedAsset})
              </label>
              <input
                type="number"
                step="any"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter deposit amount"
                className="w-full p-3 rounded-xl bg-[#0b0e11] border border-[#2b313a] text-slate-100 font-bold text-sm focus:outline-none focus:border-[#F0B90B]"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-2xl bg-[#F0B90B] hover:bg-[#FCD535] text-[#181a20] font-black text-sm shadow-lg shadow-[#F0B90B]/25 active:scale-98 transition-all"
            >
              Simulate Blockchain Network Confirmation (+{amount} {selectedAsset})
            </button>
          </form>
        ) : (
          /* Withdraw Tab View */
          <form onSubmit={handleWithdraw} className="space-y-3 font-mono">
            <div>
              <label className="text-slate-400 block text-[11px] mb-1 font-sans">Recipient Blockchain Address</label>
              <input
                type="text"
                placeholder={`Paste recipient ${selectedAsset} address...`}
                value={withdrawAddress}
                onChange={(e) => setWithdrawAddress(e.target.value)}
                required
                className="w-full p-3 rounded-xl bg-[#0b0e11] border border-[#2b313a] text-slate-100 font-bold text-xs focus:outline-none focus:border-[#F0B90B]"
              />
            </div>

            <div>
              <div className="flex justify-between text-slate-400 mb-1 text-[11px] font-sans">
                <span>Withdrawal Amount</span>
                <span>Available: {(balances.spot[selectedAsset] || 0)} {selectedAsset}</span>
              </div>
              <input
                type="number"
                step="any"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="w-full p-3 rounded-xl bg-[#0b0e11] border border-[#2b313a] text-slate-100 font-bold text-sm focus:outline-none focus:border-[#F0B90B]"
              />
            </div>

            <div className="p-3 rounded-xl bg-[#0b0e11] border border-slate-800 text-[11px] space-y-1 text-slate-400">
              <div className="flex justify-between">
                <span>Network Gas Fee:</span>
                <span className="text-[#F0B90B] font-bold">1.00 USDT</span>
              </div>
              <div className="flex justify-between">
                <span>Estimated Arrival:</span>
                <span className="text-slate-200 font-bold">12 Network Confirmations (~2 mins)</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={!withdrawAddress || parseFloat(amount) <= 0}
              className="w-full py-3.5 rounded-2xl bg-[#F6465D] hover:bg-[#F6465D]/90 text-white font-black text-sm shadow-lg shadow-[#F6465D]/25 active:scale-98 transition-all disabled:opacity-50"
            >
              Confirm Withdrawal ({amount} {selectedAsset})
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { 
  Bell, X, Plus, Trash2, Volume2, VolumeX, 
  ArrowUpRight, ArrowDownRight, CheckCircle2, Play
} from 'lucide-react';
import { useCrypto } from '../context/CryptoContext';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const PriceAlertsModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const { 
    priceAlerts, 
    addPriceAlert, 
    removePriceAlert, 
    triggerPriceAlertTest, 
    coins, 
    selectedCoin, 
    theme 
  } = useCrypto();

  const isDark = theme === 'dark';

  const [symbol, setSymbol] = useState(selectedCoin.symbol);
  const [targetPrice, setTargetPrice] = useState(selectedCoin.price.toString());
  const [condition, setCondition] = useState<'ABOVE' | 'BELOW'>('ABOVE');
  const [note, setNote] = useState('');

  if (!isOpen) return null;

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const price = parseFloat(targetPrice);
    if (!price || price <= 0) return;

    addPriceAlert(symbol, price, condition, note);
    setNote('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
      <div className={`w-full max-w-lg rounded-3xl border shadow-2xl overflow-hidden ${
        isDark ? 'bg-[#181a20] border-[#2b313a]' : 'bg-white border-slate-200'
      }`}>
        {/* Header */}
        <div className="p-5 border-b border-[#2b313a]/50 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-2xl bg-[#F0B90B]/15 text-[#F0B90B]">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-black">Crypto Price Alerts Engine</h2>
              <p className="text-[11px] text-slate-400 font-mono">Instant notifications & sound chimes when price targets trigger</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-100 hover:bg-[#2b313a] transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto font-mono text-xs">
          {/* Create Alert Form */}
          <form onSubmit={handleAdd} className="p-4 rounded-2xl bg-[#0b0e11] border border-[#2b313a] space-y-3">
            <div className="font-bold text-slate-200 flex items-center gap-1.5">
              <Plus className="w-4 h-4 text-[#F0B90B]" />
              Create New Price Alert
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-slate-400 mb-1">Coin</label>
                <select
                  value={symbol}
                  onChange={(e) => {
                    setSymbol(e.target.value);
                    const found = coins.find(c => c.symbol === e.target.value);
                    if (found) setTargetPrice(found.price.toString());
                  }}
                  className={`w-full px-3 py-2 rounded-xl border font-bold ${
                    isDark ? 'bg-[#181a20] border-[#2b313a] text-slate-100' : 'bg-slate-50 border-slate-300'
                  }`}
                >
                  {coins.map(c => (
                    <option key={c.symbol} value={c.symbol}>{c.symbol} - ${c.price.toLocaleString()}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Condition</label>
                <select
                  value={condition}
                  onChange={(e) => setCondition(e.target.value as any)}
                  className={`w-full px-3 py-2 rounded-xl border font-bold ${
                    isDark ? 'bg-[#181a20] border-[#2b313a] text-slate-100' : 'bg-slate-50 border-slate-300'
                  }`}
                >
                  <option value="ABOVE">Rises Above (≥)</option>
                  <option value="BELOW">Drops Below (≤)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-slate-400 mb-1">Target Price (USDT)</label>
              <input
                type="number"
                step="any"
                value={targetPrice}
                onChange={(e) => setTargetPrice(e.target.value)}
                className={`w-full px-3 py-2 rounded-xl border font-bold ${
                  isDark ? 'bg-[#181a20] border-[#2b313a] text-slate-100' : 'bg-slate-50 border-slate-300'
                }`}
                placeholder="Target Price"
                required
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1">Custom Note (Optional)</label>
              <input
                type="text"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className={`w-full px-3 py-2 rounded-xl border ${
                  isDark ? 'bg-[#181a20] border-[#2b313a] text-slate-100' : 'bg-slate-50 border-slate-300'
                }`}
                placeholder="e.g. Resistance breakout, take profit zone"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-[#F0B90B] hover:bg-[#F0B90B]/90 text-[#181a20] font-black text-xs shadow-md shadow-[#F0B90B]/20 transition-all flex items-center justify-center gap-1.5"
            >
              <Bell className="w-3.5 h-3.5" />
              Set Price Alert
            </button>
          </form>

          {/* Active Alerts List */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-slate-400 font-bold">
              <span>Active Alerts ({priceAlerts.length})</span>
            </div>

            {priceAlerts.length === 0 ? (
              <div className="text-center py-6 text-slate-400">No active alerts set.</div>
            ) : (
              priceAlerts.map(alert => (
                <div
                  key={alert.id}
                  className={`p-3 rounded-2xl border flex items-center justify-between gap-3 ${
                    isDark ? 'bg-[#0b0e11] border-[#2b313a]' : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-black text-sm">{alert.pair}</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        alert.condition === 'ABOVE' ? 'bg-[#0ECB81]/15 text-[#0ECB81]' : 'bg-[#F6465D]/15 text-[#F6465D]'
                      }`}>
                        {alert.condition === 'ABOVE' ? '≥' : '≤'} ${alert.targetPrice.toLocaleString()}
                      </span>
                    </div>
                    {alert.note && <div className="text-[11px] text-slate-400">{alert.note}</div>}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => triggerPriceAlertTest(alert.id)}
                      title="Test Audio Trigger"
                      className="p-2 rounded-xl bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 transition-all"
                    >
                      <Play className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => removePriceAlert(alert.id)}
                      className="p-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-all"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

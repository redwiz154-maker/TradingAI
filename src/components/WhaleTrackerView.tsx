import React, { useState } from 'react';
import { 
  Radar, ArrowDownRight, ArrowUpRight, ShieldCheck, 
  ExternalLink, Sparkles, Filter, Activity, TrendingUp, 
  TrendingDown, RefreshCw, Zap, Flame, Building2, Wallet,
  PlusCircle, CheckCircle2
} from 'lucide-react';
import { useCrypto } from '../context/CryptoContext';
import { WhaleTransaction } from '../types';

export const WhaleTrackerView: React.FC = () => {
  const { 
    whaleTransactions, 
    exchangeFlows, 
    addWhaleAlert, 
    executeQuickOrder, 
    coins, 
    theme, 
    tradingMode, 
    showToast 
  } = useCrypto();

  const isDark = theme === 'dark';
  const [selectedFilter, setSelectedFilter] = useState<'ALL' | 'BTC' | 'ETH' | 'SOL' | 'USDT'>('ALL');
  const [selectedSentiment, setSelectedSentiment] = useState<'ALL' | 'BULLISH' | 'BEARISH'>('ALL');
  const [customModalOpen, setCustomModalOpen] = useState(false);

  // Custom Whale TX State
  const [customCoin, setCustomCoin] = useState('BTC');
  const [customAmountUSD, setCustomAmountUSD] = useState('150000000');
  const [customType, setCustomType] = useState<'EXCHANGE_INFLOW' | 'EXCHANGE_OUTFLOW' | 'TRANSFER'>('EXCHANGE_INFLOW');
  const [customSentiment, setCustomSentiment] = useState<'BULLISH' | 'BEARISH'>('BEARISH');

  const filteredTxs = whaleTransactions.filter(tx => {
    const matchCoin = selectedFilter === 'ALL' || tx.coinSymbol === selectedFilter;
    const matchSentiment = selectedSentiment === 'ALL' || tx.sentiment === selectedSentiment;
    return matchCoin && matchSentiment;
  });

  const handleSimulateWhale = () => {
    const coinObj = coins.find(c => c.symbol === customCoin) || coins[0];
    const amountUSD = parseFloat(customAmountUSD) || 100000000;
    const amountCoin = amountUSD / coinObj.price;

    addWhaleAlert({
      coinSymbol: coinObj.symbol,
      coinName: coinObj.name,
      amount: Number(amountCoin.toFixed(2)),
      amountUSD: amountUSD,
      fromType: customType === 'EXCHANGE_INFLOW' ? 'wallet' : 'exchange',
      fromLabel: customType === 'EXCHANGE_INFLOW' ? 'Whale Entity #88' : 'Binance Cold Vault',
      toType: customType === 'EXCHANGE_INFLOW' ? 'exchange' : 'wallet',
      toLabel: customType === 'EXCHANGE_INFLOW' ? 'Binance Prime Vault' : 'Anonymous Whale Safe',
      alertType: customType,
      sentiment: customSentiment,
      impactDescription: customType === 'EXCHANGE_INFLOW' 
        ? `Massive $${(amountUSD / 1e6).toFixed(1)}M ${coinObj.symbol} deposit to exchange order books. Sell/Hedging pressure expected.`
        : `Institutional withdrawal of $${(amountUSD / 1e6).toFixed(1)}M ${coinObj.symbol} into off-market hardware storage. Squeeze potential.`
    });

    setCustomModalOpen(false);
  };

  const handleFollowTrade = (tx: WhaleTransaction) => {
    const coinObj = coins.find(c => c.symbol === tx.coinSymbol) || coins[0];
    const side = tx.sentiment === 'BULLISH' ? 'BUY' : 'SELL';
    const amount = 500; // $500 quick follow trade

    executeQuickOrder({
      coin: coinObj,
      side,
      type: 'futures',
      amountUSD: amount,
      leverage: 15,
      tp: side === 'BUY' ? coinObj.price * 1.05 : coinObj.price * 0.95,
      sl: side === 'BUY' ? coinObj.price * 0.97 : coinObj.price * 1.03
    });

    showToast(`⚡ Followed Whale move on ${coinObj.pair} (${side} $${amount} USDT @ 15x)!`, 'success');
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className={`p-5 sm:p-6 rounded-3xl border relative overflow-hidden ${
        isDark ? 'bg-[#181a20] border-[#2b313a]' : 'bg-white border-slate-200 shadow-sm'
      }`}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-2xl bg-[#0ECB81]/15 text-[#0ECB81] ring-1 ring-[#0ECB81]/30">
                <Radar className="w-6 h-6 animate-spin" style={{ animationDuration: '8s' }} />
              </div>
              <h1 className="text-xl sm:text-2xl font-black tracking-tight">On-Chain Whale & Liquidity Radar</h1>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#0ECB81]/15 text-[#0ECB81] border border-[#0ECB81]/30 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#0ECB81] animate-ping" />
                LIVE BLOCKCHAIN FEED
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Real-time multi-chain telemetry detecting $10M+ wallet transfers, exchange inflows/outflows, and institutional accumulator addresses.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setCustomModalOpen(true)}
              className="px-4 py-2.5 rounded-2xl bg-[#0ECB81] hover:bg-[#0ECB81]/90 text-[#0b0e11] font-bold text-xs flex items-center gap-2 transition-all shadow-lg shadow-[#0ECB81]/20"
            >
              <PlusCircle className="w-4 h-4" />
              Simulate Whale Pulse
            </button>
          </div>
        </div>
      </div>

      {/* Exchange Net Flow Statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {exchangeFlows.map((flow) => {
          const isOutflow = flow.netInflowUSD < 0;
          return (
            <div 
              key={flow.exchange}
              className={`p-4 rounded-2xl border transition-all ${
                isDark ? 'bg-[#181a20] border-[#2b313a]' : 'bg-white border-slate-200 shadow-sm'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-[#F0B90B]" />
                  <span className="font-bold text-xs">{flow.exchange}</span>
                </div>
                <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${
                  isOutflow ? 'bg-[#0ECB81]/10 text-[#0ECB81]' : 'bg-[#F6465D]/10 text-[#F6465D]'
                }`}>
                  {isOutflow ? 'OUTFLOW (Bullish)' : 'INFLOW (Bearish)'}
                </span>
              </div>
              <div className="text-lg font-mono font-black">
                {flow.netInflowBTC < 0 ? '' : '+'}{flow.netInflowBTC.toLocaleString()} BTC
              </div>
              <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono mt-1">
                <span>Net USD:</span>
                <span className={isOutflow ? 'text-[#0ECB81]' : 'text-[#F6465D]'}>
                  {flow.netInflowUSD < 0 ? '-' : '+'}${Math.abs(flow.netInflowUSD / 1e6).toFixed(1)}M
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Filter and Whale Transaction Table */}
      <div className={`p-5 rounded-3xl border ${
        isDark ? 'bg-[#181a20] border-[#2b313a]' : 'bg-white border-slate-200 shadow-sm'
      }`}>
        {/* Filters */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 mb-4 border-b border-[#2b313a]/50">
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-mono text-slate-400 mr-2 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" /> Coin:
            </span>
            {(['ALL', 'BTC', 'ETH', 'SOL', 'USDT'] as const).map(asset => (
              <button
                key={asset}
                onClick={() => setSelectedFilter(asset)}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all ${
                  selectedFilter === asset
                    ? 'bg-[#F0B90B] text-[#181a20]'
                    : isDark ? 'bg-[#0b0e11] text-slate-300 hover:bg-[#2b313a]' : 'bg-slate-100 text-slate-700'
                }`}
              >
                {asset}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-xs font-mono text-slate-400 mr-2">Sentiment:</span>
            {(['ALL', 'BULLISH', 'BEARISH'] as const).map(sent => (
              <button
                key={sent}
                onClick={() => setSelectedSentiment(sent)}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all ${
                  selectedSentiment === sent
                    ? sent === 'BULLISH' ? 'bg-[#0ECB81] text-[#0b0e11]' : sent === 'BEARISH' ? 'bg-[#F6465D] text-white' : 'bg-blue-600 text-white'
                    : isDark ? 'bg-[#0b0e11] text-slate-300 hover:bg-[#2b313a]' : 'bg-slate-100 text-slate-700'
                }`}
              >
                {sent}
              </button>
            ))}
          </div>
        </div>

        {/* Transactions List */}
        <div className="space-y-3">
          {filteredTxs.length === 0 ? (
            <div className="text-center py-12 text-slate-400 font-mono text-xs">
              No whale transactions matching selected filter.
            </div>
          ) : (
            filteredTxs.map((tx) => {
              const isBull = tx.sentiment === 'BULLISH';
              return (
                <div
                  key={tx.id}
                  className={`p-4 rounded-2xl border transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                    isDark ? 'bg-[#0b0e11]/70 border-[#2b313a] hover:border-[#F0B90B]/40' : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`p-2.5 rounded-2xl shrink-0 mt-1 ${
                      isBull ? 'bg-[#0ECB81]/15 text-[#0ECB81]' : 'bg-[#F6465D]/15 text-[#F6465D]'
                    }`}>
                      {isBull ? <ArrowUpRight className="w-5 h-5" /> : <ArrowDownRight className="w-5 h-5" />}
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-black text-sm">{tx.amount.toLocaleString()} {tx.coinSymbol}</span>
                        <span className="text-xs font-mono font-bold text-slate-400">
                          (${tx.amountUSD >= 1e9 ? `${(tx.amountUSD / 1e9).toFixed(2)}B` : `${(tx.amountUSD / 1e6).toFixed(1)}M`} USD)
                        </span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                          isBull ? 'bg-[#0ECB81]/20 text-[#0ECB81]' : 'bg-[#F6465D]/20 text-[#F6465D]'
                        }`}>
                          {tx.alertType.replace('_', ' ')} • {tx.sentiment}
                        </span>
                      </div>

                      <div className="text-xs text-slate-300">
                        {tx.impactDescription}
                      </div>

                      <div className="flex items-center gap-4 text-[11px] font-mono text-slate-400">
                        <span>From: <strong className="text-slate-200">{tx.fromLabel}</strong></span>
                        <span>➔</span>
                        <span>To: <strong className="text-slate-200">{tx.toLabel}</strong></span>
                        <span>•</span>
                        <span>Tx: <code className="text-[#F0B90B]">{tx.txHash}</code></span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                    <button
                      onClick={() => handleFollowTrade(tx)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold font-mono transition-all flex items-center gap-1.5 ${
                        isBull
                          ? 'bg-[#0ECB81] hover:bg-[#0ECB81]/90 text-[#0b0e11]'
                          : 'bg-[#F6465D] hover:bg-[#F6465D]/90 text-white'
                      }`}
                    >
                      <Zap className="w-3.5 h-3.5" />
                      Follow Whale ({isBull ? 'LONG' : 'SHORT'})
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Simulate Modal */}
      {customModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className={`w-full max-w-md p-6 rounded-3xl border shadow-2xl ${
            isDark ? 'bg-[#181a20] border-[#2b313a]' : 'bg-white border-slate-200'
          }`}>
            <h3 className="text-lg font-black mb-1">Simulate Live Whale Pulse</h3>
            <p className="text-xs text-slate-400 mb-4">Inject an on-chain whale transaction to test AI sentiment feedback.</p>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1">Crypto Asset</label>
                <select
                  value={customCoin}
                  onChange={(e) => setCustomCoin(e.target.value)}
                  className={`w-full px-3 py-2 rounded-xl text-sm font-mono border ${
                    isDark ? 'bg-[#0b0e11] border-[#2b313a] text-slate-100' : 'bg-slate-50 border-slate-300'
                  }`}
                >
                  {coins.map(c => (
                    <option key={c.symbol} value={c.symbol}>{c.symbol} - {c.name} (${c.price.toLocaleString()})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1">Transfer Amount (USD)</label>
                <input
                  type="number"
                  value={customAmountUSD}
                  onChange={(e) => setCustomAmountUSD(e.target.value)}
                  className={`w-full px-3 py-2 rounded-xl text-sm font-mono border ${
                    isDark ? 'bg-[#0b0e11] border-[#2b313a] text-slate-100' : 'bg-slate-50 border-slate-300'
                  }`}
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-1">Alert Type</label>
                  <select
                    value={customType}
                    onChange={(e) => setCustomType(e.target.value as any)}
                    className={`w-full px-3 py-2 rounded-xl text-xs font-mono border ${
                      isDark ? 'bg-[#0b0e11] border-[#2b313a] text-slate-100' : 'bg-slate-50 border-slate-300'
                    }`}
                  >
                    <option value="EXCHANGE_INFLOW">Exchange Inflow</option>
                    <option value="EXCHANGE_OUTFLOW">Exchange Outflow</option>
                    <option value="TRANSFER">Cold Transfer</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-1">Sentiment</label>
                  <select
                    value={customSentiment}
                    onChange={(e) => setCustomSentiment(e.target.value as any)}
                    className={`w-full px-3 py-2 rounded-xl text-xs font-mono border ${
                      isDark ? 'bg-[#0b0e11] border-[#2b313a] text-slate-100' : 'bg-slate-50 border-slate-300'
                    }`}
                  >
                    <option value="BULLISH">Bullish</option>
                    <option value="BEARISH">Bearish</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => setCustomModalOpen(false)}
                  className={`flex-1 py-2.5 rounded-xl text-xs font-bold ${
                    isDark ? 'bg-[#0b0e11] hover:bg-[#2b313a]' : 'bg-slate-100'
                  }`}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSimulateWhale}
                  className="flex-1 py-2.5 rounded-xl bg-[#0ECB81] hover:bg-[#0ECB81]/90 text-[#0b0e11] font-bold text-xs shadow-lg shadow-[#0ECB81]/20"
                >
                  Broadcast Alert
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

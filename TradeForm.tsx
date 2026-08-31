import React, { useState, useEffect } from 'react';
import { 
  ArrowUpRight, ArrowDownRight, Zap, Shield, 
  HelpCircle, Percent, Sliders, ChevronDown, Check 
} from 'lucide-react';
import { useCrypto } from '../context/CryptoContext';
import { OrderType, OrderSide, MarginMode } from '../types';

export const TradeForm: React.FC<{ isFuturesMode?: boolean }> = ({ isFuturesMode = false }) => {
  const {
    selectedCoin,
    balances,
    placeSpotOrder,
    openFuturesPosition,
    leverage,
    setLeverage,
    marginMode,
    setMarginMode,
    theme,
    formatPrice
  } = useCrypto();

  const [orderType, setOrderType] = useState<OrderType>('limit');
  const [activeSide, setActiveSide] = useState<OrderSide>('buy');
  const [priceInput, setPriceInput] = useState<string>(selectedCoin.price.toString());
  const [amountInput, setAmountInput] = useState<string>('');
  const [takeProfit, setTakeProfit] = useState<string>('');
  const [stopLoss, setStopLoss] = useState<string>('');
  const [leverageModal, setLeverageModal] = useState(false);
  const [marginModal, setMarginModal] = useState(false);

  const isDark = theme === 'dark';

  // Sync price input with coin change if limit order is active
  useEffect(() => {
    setPriceInput(selectedCoin.price.toString());
  }, [selectedCoin.id]);

  const numPrice = orderType === 'market' ? selectedCoin.price : parseFloat(priceInput) || selectedCoin.price;
  const numAmount = parseFloat(amountInput) || 0;
  const totalValueUSD = numPrice * numAmount;

  // Available Balances
  const usdtBalance = isFuturesMode 
    ? balances.futures.USDT || 0 
    : balances.spot.USDT || 0;
  const baseAssetBalance = balances.spot[selectedCoin.baseAsset] || 0;

  // Percentage allocation handler
  const handlePercentage = (pct: number) => {
    if (activeSide === 'buy') {
      const maxUSD = isFuturesMode ? usdtBalance * leverage : usdtBalance;
      const targetUSD = maxUSD * (pct / 100);
      const calculatedAmount = targetUSD / numPrice;
      setAmountInput(calculatedAmount.toFixed(selectedCoin.precision > 2 ? 4 : 3));
    } else {
      if (isFuturesMode) {
        const maxUSD = usdtBalance * leverage;
        const targetUSD = maxUSD * (pct / 100);
        const calculatedAmount = targetUSD / numPrice;
        setAmountInput(calculatedAmount.toFixed(selectedCoin.precision > 2 ? 4 : 3));
      } else {
        const targetAmount = baseAssetBalance * (pct / 100);
        setAmountInput(targetAmount.toFixed(selectedCoin.precision > 2 ? 4 : 3));
      }
    }
  };

  // Liquidation calculation for futures
  const liqBuffer = 0.95 / leverage;
  const estimatedLiqPrice = activeSide === 'buy'
    ? numPrice * (1 - liqBuffer)
    : numPrice * (1 + liqBuffer);
  const requiredMargin = isFuturesMode ? (totalValueUSD / leverage) : totalValueUSD;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (numAmount <= 0) return;

    const tpVal = takeProfit ? parseFloat(takeProfit) : undefined;
    const slVal = stopLoss ? parseFloat(stopLoss) : undefined;

    if (isFuturesMode) {
      const success = openFuturesPosition({
        side: activeSide === 'buy' ? 'long' : 'short',
        orderType: orderType === 'market' ? 'market' : 'limit',
        price: orderType === 'limit' ? numPrice : undefined,
        amount: numAmount,
        leverage,
        marginMode,
        tp: tpVal,
        sl: slVal
      });
      if (success) {
        setAmountInput('');
        setTakeProfit('');
        setStopLoss('');
      }
    } else {
      const success = placeSpotOrder({
        type: orderType,
        side: activeSide,
        price: numPrice,
        amount: numAmount,
        tp: tpVal,
        sl: slVal
      });
      if (success) {
        setAmountInput('');
        setTakeProfit('');
        setStopLoss('');
      }
    }
  };

  return (
    <div className={`flex flex-col h-full rounded-2xl border overflow-hidden select-none p-3.5 ${
      isDark ? 'bg-[#121418] border-[#1e2329]' : 'bg-white border-slate-200'
    }`}>
      {/* Top Mode Header: Spot / Margin / Futures Controls */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-700/30 mb-3 text-xs">
        {isFuturesMode ? (
          <div className="flex items-center gap-2">
            {/* Margin Mode Selector */}
            <button
              onClick={() => setMarginModal(!marginModal)}
              className="px-2.5 py-1 rounded-lg bg-[#2b313a] text-slate-200 font-mono font-bold flex items-center gap-1 hover:bg-slate-700"
            >
              <span className="uppercase">{marginMode}</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {/* Leverage Button */}
            <button
              onClick={() => setLeverageModal(!leverageModal)}
              className="px-3 py-1 rounded-lg bg-[#F0B90B]/20 text-[#F0B90B] border border-[#F0B90B]/40 font-mono font-black flex items-center gap-1 hover:bg-[#F0B90B]/30"
            >
              <span>{leverage}x</span>
              <Sliders className="w-3 h-3" />
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-1.5 font-bold text-xs">
            <span className={isDark ? 'text-white' : 'text-slate-900'}>Spot Exchange</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#0ECB81]/20 text-[#0ECB81] font-mono">0.1% Fee</span>
          </div>
        )}

        {/* Order Types */}
        <div className="flex gap-1 bg-[#181a20] p-0.5 rounded-lg border border-slate-700/50 text-[11px]">
          {(['limit', 'market', 'stop_limit'] as OrderType[]).map(type => (
            <button
              key={type}
              onClick={() => setOrderType(type)}
              className={`px-2 py-0.5 rounded capitalize font-medium transition-colors ${
                orderType === type 
                  ? 'bg-[#2b313a] text-[#F0B90B] font-bold' 
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {type.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Leverage Slider Modal */}
      {leverageModal && (
        <div className="p-3.5 mb-3 rounded-xl bg-[#181a20] border border-[#F0B90B]/40 space-y-3 animate-fadeIn">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-[#F0B90B]">Adjust Leverage ({leverage}x)</span>
            <span className="text-[10px] text-slate-400">Max: 125x</span>
          </div>
          <input
            type="range"
            min="1"
            max="125"
            value={leverage}
            onChange={(e) => setLeverage(parseInt(e.target.value))}
            className="w-full accent-[#F0B90B] cursor-pointer"
          />
          <div className="flex justify-between text-[10px] font-mono text-slate-400">
            {[1, 5, 10, 20, 50, 75, 100, 125].map(v => (
              <button
                key={v}
                onClick={() => setLeverage(v)}
                className={`hover:text-[#F0B90B] ${leverage === v ? 'text-[#F0B90B] font-bold' : ''}`}
              >
                {v}x
              </button>
            ))}
          </div>
          <button
            onClick={() => setLeverageModal(false)}
            className="w-full py-1 rounded-lg bg-[#F0B90B] text-[#181a20] font-bold text-xs"
          >
            Confirm {leverage}x Leverage
          </button>
        </div>
      )}

      {/* Buy / Long vs Sell / Short Toggle Tabs */}
      <div className="grid grid-cols-2 gap-2 mb-3">
        <button
          onClick={() => setActiveSide('buy')}
          className={`py-2 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all ${
            activeSide === 'buy'
              ? 'bg-[#0ECB81] text-white shadow-md shadow-[#0ECB81]/20'
              : isDark ? 'bg-[#1e2329] text-slate-400' : 'bg-slate-100 text-slate-600'
          }`}
        >
          <ArrowUpRight className="w-4 h-4" />
          <span>{isFuturesMode ? 'Open Long' : `Buy ${selectedCoin.baseAsset}`}</span>
        </button>

        <button
          onClick={() => setActiveSide('sell')}
          className={`py-2 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all ${
            activeSide === 'sell'
              ? 'bg-[#F6465D] text-white shadow-md shadow-[#F6465D]/20'
              : isDark ? 'bg-[#1e2329] text-slate-400' : 'bg-slate-100 text-slate-600'
          }`}
        >
          <ArrowDownRight className="w-4 h-4" />
          <span>{isFuturesMode ? 'Open Short' : `Sell ${selectedCoin.baseAsset}`}</span>
        </button>
      </div>

      {/* Available Balance Overview */}
      <div className="flex items-center justify-between text-[11px] mb-2 px-1 text-slate-400 font-mono">
        <span>Available:</span>
        <span className="font-bold text-slate-200">
          {activeSide === 'buy' || isFuturesMode
            ? `${usdtBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })} USDT`
            : `${baseAssetBalance} ${selectedCoin.baseAsset}`}
        </span>
      </div>

      {/* Main Order Form Inputs */}
      <form onSubmit={handleSubmit} className="space-y-2.5 flex-1 flex flex-col justify-between">
        <div className="space-y-2.5">
          {/* Price Input (if not market) */}
          {orderType !== 'market' ? (
            <div className={`p-2 rounded-xl border flex items-center justify-between ${
              isDark ? 'bg-[#0b0e11] border-[#2b313a]' : 'bg-slate-50 border-slate-200'
            }`}>
              <span className="text-[10px] uppercase font-bold text-slate-400 pl-1">Price</span>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  step="any"
                  value={priceInput}
                  onChange={(e) => setPriceInput(e.target.value)}
                  className="w-28 text-right font-mono font-bold text-xs bg-transparent focus:outline-none text-slate-100"
                />
                <span className="text-[10px] font-mono text-slate-400 pr-1">USDT</span>
              </div>
            </div>
          ) : (
            <div className={`p-2.5 rounded-xl border flex items-center justify-between text-xs ${
              isDark ? 'bg-[#0b0e11] border-[#2b313a] text-slate-400' : 'bg-slate-50 border-slate-200 text-slate-500'
            }`}>
              <span>Price</span>
              <span className="font-bold font-mono text-[#F0B90B]">Best Market Execution</span>
            </div>
          )}

          {/* Amount Input */}
          <div className={`p-2 rounded-xl border flex items-center justify-between ${
            isDark ? 'bg-[#0b0e11] border-[#2b313a]' : 'bg-slate-50 border-slate-200'
          }`}>
            <span className="text-[10px] uppercase font-bold text-slate-400 pl-1">Amount</span>
            <div className="flex items-center gap-2">
              <input
                type="number"
                step="any"
                placeholder="0.00"
                value={amountInput}
                onChange={(e) => setAmountInput(e.target.value)}
                className="w-28 text-right font-mono font-bold text-xs bg-transparent focus:outline-none text-slate-100"
              />
              <span className="text-[10px] font-mono text-slate-400 pr-1">{selectedCoin.baseAsset}</span>
            </div>
          </div>

          {/* Quick Percentage Slider / Buttons */}
          <div className="grid grid-cols-4 gap-1">
            {[25, 50, 75, 100].map(pct => (
              <button
                type="button"
                key={pct}
                onClick={() => handlePercentage(pct)}
                className={`py-1 rounded-lg text-[10px] font-mono font-bold transition-colors ${
                  isDark 
                    ? 'bg-[#181a20] hover:bg-[#2b313a] text-slate-300' 
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                {pct}%
              </button>
            ))}
          </div>

          {/* TP / SL Expandable Inputs */}
          <div className="grid grid-cols-2 gap-2 pt-1">
            <div className={`p-1.5 rounded-lg border text-[10px] ${
              isDark ? 'bg-[#0b0e11] border-[#2b313a]' : 'bg-slate-50 border-slate-200'
            }`}>
              <span className="text-slate-400 block text-[9px]">Take Profit (USDT)</span>
              <input
                type="number"
                step="any"
                placeholder="Optional TP"
                value={takeProfit}
                onChange={(e) => setTakeProfit(e.target.value)}
                className="w-full bg-transparent font-mono font-bold text-slate-200 focus:outline-none"
              />
            </div>

            <div className={`p-1.5 rounded-lg border text-[10px] ${
              isDark ? 'bg-[#0b0e11] border-[#2b313a]' : 'bg-slate-50 border-slate-200'
            }`}>
              <span className="text-slate-400 block text-[9px]">Stop Loss (USDT)</span>
              <input
                type="number"
                step="any"
                placeholder="Optional SL"
                value={stopLoss}
                onChange={(e) => setStopLoss(e.target.value)}
                className="w-full bg-transparent font-mono font-bold text-slate-200 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Order Summary & Metrics */}
        <div className="space-y-1.5 pt-2 border-t border-slate-700/40 text-[11px] font-mono text-slate-400">
          <div className="flex justify-between">
            <span>Order Value:</span>
            <span className="font-bold text-slate-200">${totalValueUSD.toFixed(2)} USDT</span>
          </div>

          {isFuturesMode && (
            <>
              <div className="flex justify-between">
                <span>Cost / Margin:</span>
                <span className="font-bold text-[#F0B90B]">${requiredMargin.toFixed(2)} USDT</span>
              </div>
              <div className="flex justify-between">
                <span>Est. Liq. Price:</span>
                <span className="font-bold text-[#F6465D]">${formatPrice(estimatedLiqPrice, selectedCoin.precision)}</span>
              </div>
            </>
          )}
        </div>

        {/* Submit Execution Button */}
        <button
          type="submit"
          disabled={numAmount <= 0}
          className={`w-full py-3 rounded-xl font-bold text-sm tracking-wide transition-all shadow-lg active:scale-98 disabled:opacity-50 disabled:cursor-not-allowed ${
            activeSide === 'buy'
              ? 'bg-[#0ECB81] hover:bg-[#0ECB81]/90 text-white shadow-[#0ECB81]/25'
              : 'bg-[#F6465D] hover:bg-[#F6465D]/90 text-white shadow-[#F6465D]/25'
          }`}
        >
          {activeSide === 'buy' ? (
            isFuturesMode ? `Open Long ${leverage}x` : `Buy ${selectedCoin.baseAsset}`
          ) : (
            isFuturesMode ? `Open Short ${leverage}x` : `Sell ${selectedCoin.baseAsset}`
          )}
        </button>
      </form>
    </div>
  );
};

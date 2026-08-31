import React, { useState } from 'react';
import { 
  FileText, Zap, Clock, Wallet, X, 
  Check, Edit3, ArrowUpRight, ArrowDownRight, Trash2 
} from 'lucide-react';
import { useCrypto } from '../context/CryptoContext';

export const OrdersAndPositions: React.FC<{ defaultTab?: 'orders' | 'positions' | 'history' | 'assets' }> = ({
  defaultTab = 'positions'
}) => {
  const {
    orders,
    cancelOrder,
    positions,
    closeFuturesPosition,
    updatePositionTPSL,
    tradeHistory,
    balances,
    selectedCoin,
    theme,
    formatPrice
  } = useCrypto();

  const [activeTab, setActiveTab] = useState<'orders' | 'positions' | 'history' | 'assets'>(defaultTab);
  const [editingPosId, setEditingPosId] = useState<string | null>(null);
  const [editTP, setEditTP] = useState('');
  const [editSL, setEditSL] = useState('');

  const isDark = theme === 'dark';

  const handleOpenEdit = (posId: string, currentTP?: number, currentSL?: number) => {
    setEditingPosId(posId);
    setEditTP(currentTP ? currentTP.toString() : '');
    setEditSL(currentSL ? currentSL.toString() : '');
  };

  const handleSaveTPSL = (posId: string) => {
    updatePositionTPSL(
      posId,
      editTP ? parseFloat(editTP) : undefined,
      editSL ? parseFloat(editSL) : undefined
    );
    setEditingPosId(null);
  };

  return (
    <div className={`flex flex-col h-full rounded-2xl border overflow-hidden select-none ${
      isDark ? 'bg-[#121418] border-[#1e2329]' : 'bg-white border-slate-200'
    }`}>
      {/* Tab Navigation */}
      <div className={`px-4 py-2 border-b flex items-center justify-between text-xs shrink-0 ${
        isDark ? 'bg-[#181a20] border-[#2b313a]' : 'bg-slate-50 border-slate-200'
      }`}>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('positions')}
            className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-colors ${
              activeTab === 'positions'
                ? isDark ? 'bg-[#2b313a] text-[#F0B90B]' : 'bg-white text-blue-600 shadow-xs'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Positions ({positions.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-colors ${
              activeTab === 'orders'
                ? isDark ? 'bg-[#2b313a] text-[#F0B90B]' : 'bg-white text-blue-600 shadow-xs'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Open Orders ({orders.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('history')}
            className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-colors ${
              activeTab === 'history'
                ? isDark ? 'bg-[#2b313a] text-[#F0B90B]' : 'bg-white text-blue-600 shadow-xs'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Trade History ({tradeHistory.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('assets')}
            className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-colors ${
              activeTab === 'assets'
                ? isDark ? 'bg-[#2b313a] text-[#F0B90B]' : 'bg-white text-blue-600 shadow-xs'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Wallet className="w-3.5 h-3.5" />
            <span>Pair Assets</span>
          </button>
        </div>
      </div>

      {/* Main Tab Content */}
      <div className="flex-1 overflow-auto p-3 text-xs font-mono">
        {/* Positions Table */}
        {activeTab === 'positions' && (
          positions.length === 0 ? (
            <div className="text-center py-10 text-slate-500">
              <Zap className="w-8 h-8 mx-auto mb-2 opacity-30" />
              <span>No active futures positions. Open Long or Short with up to 125x leverage!</span>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="grid grid-cols-8 text-[10px] uppercase font-bold text-slate-400 px-3 py-1">
                <div>Contract</div>
                <div>Size</div>
                <div>Entry Price</div>
                <div>Mark Price</div>
                <div>Liq. Price</div>
                <div>Margin</div>
                <div>PnL (ROE %)</div>
                <div className="text-right">Action</div>
              </div>

              {positions.map(pos => {
                const isLong = pos.side === 'long';
                const isProfit = pos.pnl >= 0;

                return (
                  <div
                    key={pos.id}
                    className={`grid grid-cols-8 px-3 py-2.5 rounded-xl items-center border transition-all ${
                      isDark ? 'bg-[#181a20] border-[#2b313a] hover:border-slate-700' : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    {/* Pair & Side */}
                    <div className="flex items-center gap-1.5">
                      <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold uppercase ${
                        isLong ? 'bg-[#0ECB81]/20 text-[#0ECB81]' : 'bg-[#F6465D]/20 text-[#F6465D]'
                      }`}>
                        {pos.side} {pos.leverage}x
                      </span>
                      <span className="font-bold text-slate-200">{pos.pair}</span>
                    </div>

                    {/* Size */}
                    <div className="text-slate-200 font-bold">{pos.size}</div>

                    {/* Entry Price */}
                    <div className="text-slate-300">${formatPrice(pos.entryPrice)}</div>

                    {/* Mark Price */}
                    <div className="text-slate-200 font-bold">${formatPrice(pos.markPrice)}</div>

                    {/* Liq Price */}
                    <div className="text-[#F6465D] font-bold">${formatPrice(pos.liquidationPrice)}</div>

                    {/* Margin */}
                    <div className="text-slate-300">${pos.margin.toFixed(2)}</div>

                    {/* PnL & ROE */}
                    <div className="flex flex-col">
                      <span className={`font-bold ${isProfit ? 'text-[#0ECB81]' : 'text-[#F6465D]'}`}>
                        {isProfit ? '+' : ''}${pos.pnl.toFixed(2)}
                      </span>
                      <span className={`text-[10px] font-bold ${isProfit ? 'text-[#0ECB81]' : 'text-[#F6465D]'}`}>
                        ({isProfit ? '+' : ''}{pos.pnlPercentage.toFixed(2)}%)
                      </span>
                    </div>

                    {/* Actions & TP/SL */}
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleOpenEdit(pos.id, pos.tp, pos.sl)}
                        className="p-1 rounded bg-[#2b313a] text-slate-300 hover:text-[#F0B90B]"
                        title="Edit TP/SL"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => closeFuturesPosition(pos.id)}
                        className="px-2.5 py-1 rounded-lg bg-[#F6465D]/20 hover:bg-[#F6465D] text-[#F6465D] hover:text-white font-bold text-xs transition-colors"
                      >
                        Market Close
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )
        )}

        {/* Edit TP/SL Modal Inline */}
        {editingPosId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
            <div className="p-5 rounded-2xl bg-[#181a20] border border-[#F0B90B]/40 max-w-sm w-full space-y-4 text-xs font-sans">
              <h3 className="font-bold text-base text-[#F0B90B]">Set Take Profit & Stop Loss</h3>
              <div className="space-y-3 font-mono">
                <div>
                  <label className="text-slate-400 block text-[11px] mb-1">Take Profit Trigger (USDT)</label>
                  <input
                    type="number"
                    step="any"
                    value={editTP}
                    onChange={(e) => setEditTP(e.target.value)}
                    placeholder="e.g. 95000"
                    className="w-full p-2.5 rounded-xl bg-[#0b0e11] border border-[#2b313a] text-slate-100 font-bold focus:outline-none focus:border-[#F0B90B]"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block text-[11px] mb-1">Stop Loss Trigger (USDT)</label>
                  <input
                    type="number"
                    step="any"
                    value={editSL}
                    onChange={(e) => setEditSL(e.target.value)}
                    placeholder="e.g. 84000"
                    className="w-full p-2.5 rounded-xl bg-[#0b0e11] border border-[#2b313a] text-slate-100 font-bold focus:outline-none focus:border-[#F6465D]"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setEditingPosId(null)}
                  className="flex-1 py-2 rounded-xl bg-[#2b313a] text-slate-300 font-bold"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleSaveTPSL(editingPosId)}
                  className="flex-1 py-2 rounded-xl bg-[#F0B90B] text-[#181a20] font-bold"
                >
                  Confirm TP/SL
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Open Orders Table */}
        {activeTab === 'orders' && (
          orders.length === 0 ? (
            <div className="text-center py-10 text-slate-500">
              <FileText className="w-8 h-8 mx-auto mb-2 opacity-30" />
              <span>No open limit orders. Place a limit order on Spot or Futures!</span>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="grid grid-cols-7 text-[10px] uppercase font-bold text-slate-400 px-3 py-1">
                <div>Time</div>
                <div>Pair</div>
                <div>Type / Side</div>
                <div>Price</div>
                <div>Amount</div>
                <div>Total</div>
                <div className="text-right">Action</div>
              </div>

              {orders.map(order => (
                <div
                  key={order.id}
                  className={`grid grid-cols-7 px-3 py-2 rounded-xl items-center border ${
                    isDark ? 'bg-[#181a20] border-[#2b313a]' : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <div className="text-slate-400 text-[10px]">
                    {new Date(order.createdAt).toLocaleTimeString()}
                  </div>
                  <div className="font-bold text-slate-200">{order.pair}</div>
                  <div>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      order.side === 'buy' ? 'bg-[#0ECB81]/20 text-[#0ECB81]' : 'bg-[#F6465D]/20 text-[#F6465D]'
                    }`}>
                      {order.type} {order.side}
                    </span>
                  </div>
                  <div className="font-mono text-slate-200 font-bold">${formatPrice(order.price)}</div>
                  <div className="font-mono text-slate-300">{order.amount}</div>
                  <div className="font-mono text-slate-400">${order.total.toFixed(2)}</div>
                  <div className="text-right">
                    <button
                      onClick={() => cancelOrder(order.id)}
                      className="px-2.5 py-1 rounded-lg bg-rose-500/10 hover:bg-rose-500 text-rose-400 hover:text-white font-bold text-[11px] transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )
        )}

        {/* Trade History */}
        {activeTab === 'history' && (
          tradeHistory.length === 0 ? (
            <div className="text-center py-10 text-slate-500">
              <Clock className="w-8 h-8 mx-auto mb-2 opacity-30" />
              <span>No trade execution records yet.</span>
            </div>
          ) : (
            <div className="space-y-1.5">
              <div className="grid grid-cols-6 text-[10px] uppercase font-bold text-slate-400 px-3 py-1">
                <div>Time</div>
                <div>Pair</div>
                <div>Side</div>
                <div>Executed Price</div>
                <div>Filled Size</div>
                <div className="text-right">Total (USDT)</div>
              </div>

              {tradeHistory.map(item => (
                <div
                  key={item.id}
                  className={`grid grid-cols-6 px-3 py-2 rounded-xl items-center border ${
                    isDark ? 'bg-[#181a20] border-[#2b313a]' : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <div className="text-slate-400 text-[10px]">
                    {new Date(item.createdAt).toLocaleTimeString()}
                  </div>
                  <div className="font-bold text-slate-200">{item.pair}</div>
                  <div>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      item.side === 'buy' ? 'bg-[#0ECB81]/20 text-[#0ECB81]' : 'bg-[#F6465D]/20 text-[#F6465D]'
                    }`}>
                      {item.side}
                    </span>
                  </div>
                  <div className="font-bold text-slate-200">${formatPrice(item.price)}</div>
                  <div className="text-slate-300">{item.amount}</div>
                  <div className="text-right font-bold text-slate-200">${item.total.toFixed(2)}</div>
                </div>
              ))}
            </div>
          )
        )}

        {/* Assets (Current Pair) */}
        {activeTab === 'assets' && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-2">
            <div className={`p-4 rounded-xl border ${isDark ? 'bg-[#181a20] border-[#2b313a]' : 'bg-slate-50 border-slate-200'}`}>
              <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Spot USDT Balance</span>
              <span className="text-xl font-bold font-mono text-[#F0B90B]">
                ${(balances.spot.USDT || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </span>
            </div>

            <div className={`p-4 rounded-xl border ${isDark ? 'bg-[#181a20] border-[#2b313a]' : 'bg-slate-50 border-slate-200'}`}>
              <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Spot {selectedCoin.baseAsset} Holding</span>
              <span className="text-xl font-bold font-mono text-[#0ECB81]">
                {(balances.spot[selectedCoin.baseAsset] || 0)} {selectedCoin.baseAsset}
              </span>
            </div>

            <div className={`p-4 rounded-xl border ${isDark ? 'bg-[#181a20] border-[#2b313a]' : 'bg-slate-50 border-slate-200'}`}>
              <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Futures USDT Margin</span>
              <span className="text-xl font-bold font-mono text-[#00C8FF]">
                ${(balances.futures.USDT || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

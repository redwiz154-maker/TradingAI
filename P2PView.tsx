import React, { useState } from 'react';
import { 
  Users, ShieldCheck, CheckCircle2, Clock, 
  MessageSquare, Send, ArrowRight, DollarSign, 
  HelpCircle, AlertCircle, RefreshCw 
} from 'lucide-react';
import { useCrypto } from '../context/CryptoContext';
import { P2P_OFFERS } from '../data/cryptoData';
import { P2POffer } from '../types';

export const P2PView: React.FC = () => {
  const { 
    depositCrypto, 
    balances, 
    theme, 
    formatCurrency, 
    showToast 
  } = useCrypto();

  const [tradeType, setTradeType] = useState<'buy' | 'sell'>('sell'); // 'sell' in offer means user is buying
  const [selectedCrypto, setSelectedCrypto] = useState<'USDT' | 'BTC' | 'ETH' | 'BNB'>('USDT');
  const [selectedFiat, setSelectedFiat] = useState<string>('PKR');

  // Active Escrow Trade Simulator
  const [activeTradeOffer, setActiveTradeOffer] = useState<P2POffer | null>(null);
  const [tradeFiatAmount, setTradeFiatAmount] = useState<string>('25000');
  const [escrowStep, setEscrowStep] = useState<1 | 2 | 3>(1);
  const [messages, setMessages] = useState<{ sender: 'merchant' | 'user'; text: string; time: string }[]>([]);
  const [chatInput, setChatInput] = useState('');

  const isDark = theme === 'dark';

  const handleStartTrade = (offer: P2POffer) => {
    setActiveTradeOffer(offer);
    setEscrowStep(1);
    setMessages([
      {
        sender: 'merchant',
        text: `Salam! Welcome. Please transfer ${tradeFiatAmount} ${offer.fiatCurrency} to my account. I will release ${offer.cryptoType} within 1 minute after receiving payment screenshot.`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const newMsg = {
      sender: 'user' as const,
      text: chatInput,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages(prev => [...prev, newMsg]);
    setChatInput('');

    // Simulate merchant auto-reply
    setTimeout(() => {
      setMessages(prev => [
        ...prev,
        {
          sender: 'merchant',
          text: 'Payment received! Releasing crypto now from escrow. Thank you for trading with Binance VIP merchant.',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    }, 2500);
  };

  const handleConfirmPaid = () => {
    setEscrowStep(2);
    setTimeout(() => {
      if (activeTradeOffer) {
        const receivedCrypto = parseFloat(tradeFiatAmount) / activeTradeOffer.price;
        depositCrypto(activeTradeOffer.cryptoType, Number(receivedCrypto.toFixed(4)));
        setEscrowStep(3);
      }
    }, 3000);
  };

  const filteredOffers = P2P_OFFERS.filter(o => 
    o.cryptoType === selectedCrypto && 
    (selectedFiat === 'ALL' || o.fiatCurrency === selectedFiat)
  );

  return (
    <div className={`flex flex-col h-full overflow-y-auto p-4 lg:p-6 space-y-6 ${
      isDark ? 'bg-[#0b0e11] text-slate-100' : 'bg-slate-50 text-slate-900'
    }`}>
      {/* Top Banner */}
      <div className={`p-6 rounded-3xl border flex flex-wrap items-center justify-between gap-6 ${
        isDark ? 'bg-gradient-to-r from-[#181a20] to-[#1e2329] border-[#2b313a]' : 'bg-white border-slate-200 shadow-md'
      }`}>
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-[#0ECB81] font-bold text-xs">
            <ShieldCheck className="w-4 h-4" />
            <span>BINANCE VERIFIED P2P ESCROW</span>
          </div>
          <h2 className="text-2xl font-black tracking-tight">Buy & Sell Crypto with Local Currency</h2>
          <p className="text-xs text-slate-400 max-w-xl">
            0% transaction fee. Secure escrow protection. Instant payment via Bank Transfer, JazzCash, EasyPaisa, Nayapay, Raast, Wise, and Zelle.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Buy / Sell Tabs */}
          <div className={`flex p-1 rounded-2xl border ${isDark ? 'bg-[#0b0e11] border-[#2b313a]' : 'bg-slate-100 border-slate-200'}`}>
            <button
              onClick={() => setTradeType('sell')}
              className={`px-5 py-2 rounded-xl font-black text-xs transition-all ${
                tradeType === 'sell' ? 'bg-[#0ECB81] text-white shadow-md shadow-[#0ECB81]/20' : 'text-slate-400'
              }`}
            >
              Buy Crypto
            </button>
            <button
              onClick={() => setTradeType('buy')}
              className={`px-5 py-2 rounded-xl font-black text-xs transition-all ${
                tradeType === 'buy' ? 'bg-[#F6465D] text-white shadow-md shadow-[#F6465D]/20' : 'text-slate-400'
              }`}
            >
              Sell Crypto
            </button>
          </div>
        </div>
      </div>

      {/* Filter Bar: Crypto Assets & Fiat Currencies */}
      <div className={`p-4 rounded-2xl border flex flex-wrap items-center justify-between gap-4 ${
        isDark ? 'bg-[#181a20] border-[#2b313a]' : 'bg-white border-slate-200 shadow-xs'
      }`}>
        {/* Crypto coins */}
        <div className="flex items-center gap-2">
          {(['USDT', 'BTC', 'ETH', 'BNB'] as const).map(c => (
            <button
              key={c}
              onClick={() => setSelectedCrypto(c)}
              className={`px-4 py-1.5 rounded-xl font-bold text-xs font-mono transition-all ${
                selectedCrypto === c
                  ? 'bg-[#F0B90B] text-[#181a20] shadow-xs'
                  : isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        {/* Fiat Currency selector */}
        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="text-slate-400 font-sans">Currency:</span>
          {(['PKR', 'USD', 'ALL'] as const).map(fiat => (
            <button
              key={fiat}
              onClick={() => setSelectedFiat(fiat)}
              className={`px-3 py-1 rounded-lg border font-bold ${
                selectedFiat === fiat
                  ? 'bg-[#2b313a] text-[#F0B90B] border-[#F0B90B]/50'
                  : isDark ? 'border-[#2b313a] text-slate-400' : 'border-slate-200 text-slate-600'
              }`}
            >
              {fiat}
            </button>
          ))}
        </div>
      </div>

      {/* P2P Merchant Listings Table */}
      <div className={`p-6 rounded-3xl border overflow-hidden ${
        isDark ? 'bg-[#121418] border-[#1e2329]' : 'bg-white border-slate-200 shadow-sm'
      }`}>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className={`text-[10px] uppercase font-bold text-slate-400 border-b ${
              isDark ? 'bg-[#181a20] border-[#1e2329]' : 'bg-slate-50 border-slate-200'
            }`}>
              <tr>
                <th className="py-3 px-4">Merchant (SAFU Verified)</th>
                <th className="py-3 px-4">Unit Price</th>
                <th className="py-3 px-4">Available / Limit</th>
                <th className="py-3 px-4">Payment Methods</th>
                <th className="py-3 px-4 text-right">Trade</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/20 font-sans">
              {filteredOffers.map(offer => (
                <tr key={offer.id} className={`hover:bg-slate-800/10 ${isDark ? 'hover:bg-[#181a20]' : 'hover:bg-slate-50'}`}>
                  {/* Merchant Name */}
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-amber-500/20 text-[#F0B90B] font-black text-xs flex items-center justify-center">
                        {offer.merchantName[0]}
                      </div>
                      <div>
                        <div className="flex items-center gap-1">
                          <span className="font-bold text-sm text-slate-100">{offer.merchantName}</span>
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#0ECB81]" />
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono">
                          {offer.ordersCount} orders | {offer.completionRate}% completion
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Price */}
                  <td className="py-4 px-4 font-mono font-black text-base text-slate-100">
                    {offer.price.toLocaleString()} <span className="text-xs text-slate-400">{offer.fiatCurrency}</span>
                  </td>

                  {/* Available & Limits */}
                  <td className="py-4 px-4 font-mono text-xs text-slate-300">
                    <div>Avail: <strong className="text-slate-100">{offer.availableCrypto.toLocaleString()} {offer.cryptoType}</strong></div>
                    <div className="text-[10px] text-slate-400">Limit: {offer.minLimit.toLocaleString()} ~ {offer.maxLimit.toLocaleString()} {offer.fiatCurrency}</div>
                  </td>

                  {/* Payment Methods */}
                  <td className="py-4 px-4">
                    <div className="flex flex-wrap gap-1">
                      {offer.paymentMethods.map((pm, i) => (
                        <span key={i} className="px-2 py-0.5 rounded-md bg-[#2b313a] text-slate-300 text-[10px] font-medium">
                          {pm}
                        </span>
                      ))}
                    </div>
                  </td>

                  {/* Action Button */}
                  <td className="py-4 px-4 text-right">
                    <button
                      onClick={() => handleStartTrade(offer)}
                      className={`px-4 py-2 rounded-xl font-black text-xs shadow-md active:scale-95 transition-all ${
                        tradeType === 'sell'
                          ? 'bg-[#0ECB81] hover:bg-[#0ECB81]/90 text-white shadow-[#0ECB81]/20'
                          : 'bg-[#F6465D] hover:bg-[#F6465D]/90 text-white shadow-[#F6465D]/20'
                      }`}
                    >
                      {tradeType === 'sell' ? `Buy ${offer.cryptoType}` : `Sell ${offer.cryptoType}`}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* P2P Live Trade Escrow Window Modal */}
      {activeTradeOffer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
          <div className="p-6 rounded-3xl bg-[#181a20] border border-[#F0B90B]/50 max-w-2xl w-full space-y-4 text-xs font-sans animate-fadeIn">
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-700/50">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-[#0ECB81]" />
                <h3 className="font-bold text-base text-slate-100">
                  Binance P2P Escrow Order #P2P-884920
                </h3>
              </div>
              <button
                onClick={() => setActiveTradeOffer(null)}
                className="text-slate-400 hover:text-white font-bold"
              >
                ✕ Close
              </button>
            </div>

            {/* Stepper */}
            <div className="flex items-center justify-between p-3 rounded-2xl bg-[#0b0e11] border border-slate-800 text-[11px] font-mono">
              <div className={`flex items-center gap-1.5 ${escrowStep >= 1 ? 'text-[#F0B90B] font-bold' : 'text-slate-500'}`}>
                <span className="w-5 h-5 rounded-full bg-[#F0B90B]/20 flex items-center justify-center">1</span>
                <span>Payment</span>
              </div>
              <div className="h-0.5 w-12 bg-slate-700" />
              <div className={`flex items-center gap-1.5 ${escrowStep >= 2 ? 'text-[#F0B90B] font-bold' : 'text-slate-500'}`}>
                <span className="w-5 h-5 rounded-full bg-[#F0B90B]/20 flex items-center justify-center">2</span>
                <span>Confirming</span>
              </div>
              <div className="h-0.5 w-12 bg-slate-700" />
              <div className={`flex items-center gap-1.5 ${escrowStep >= 3 ? 'text-[#0ECB81] font-bold' : 'text-slate-500'}`}>
                <span className="w-5 h-5 rounded-full bg-[#0ECB81]/20 flex items-center justify-center">3</span>
                <span>Released!</span>
              </div>
            </div>

            {/* Step 1 & 2: Payment Details & Merchant Chat */}
            {escrowStep < 3 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Left: Payment info */}
                <div className="p-4 rounded-2xl bg-[#0b0e11] border border-slate-800 space-y-3 font-mono">
                  <h4 className="font-bold text-xs text-slate-200">Merchant Payment Info</h4>
                  <div className="space-y-1.5 text-slate-400 text-[11px]">
                    <div className="flex justify-between">
                      <span>Merchant Name:</span>
                      <span className="text-slate-100 font-bold">{activeTradeOffer.merchantName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Bank / Wallet:</span>
                      <span className="text-[#F0B90B] font-bold">Meezan Bank / JazzCash</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Account Number:</span>
                      <span className="text-slate-100 font-bold">0104-0105829102</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Amount to Send:</span>
                      <span className="text-[#0ECB81] font-black text-sm">{tradeFiatAmount} {activeTradeOffer.fiatCurrency}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Crypto to Receive:</span>
                      <span className="text-slate-100 font-bold">
                        {(parseFloat(tradeFiatAmount) / activeTradeOffer.price).toFixed(4)} {activeTradeOffer.cryptoType}
                      </span>
                    </div>
                  </div>

                  {escrowStep === 1 ? (
                    <button
                      onClick={handleConfirmPaid}
                      className="w-full mt-3 py-2.5 rounded-xl bg-[#0ECB81] hover:bg-[#0ECB81]/90 text-white font-bold text-xs shadow-md shadow-[#0ECB81]/20"
                    >
                      Transferred, Notify Seller
                    </button>
                  ) : (
                    <div className="w-full mt-3 py-2.5 rounded-xl bg-amber-500/20 text-amber-400 font-bold text-xs flex items-center justify-center gap-2">
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Seller is verifying payment...</span>
                    </div>
                  )}
                </div>

                {/* Right: Live Chat with Merchant */}
                <div className="flex flex-col h-64 rounded-2xl bg-[#0b0e11] border border-slate-800 p-3">
                  <div className="text-[10px] text-slate-400 pb-2 border-b border-slate-800 font-bold flex items-center gap-1.5">
                    <MessageSquare className="w-3.5 h-3.5 text-[#F0B90B]" />
                    <span>Live Merchant Chat</span>
                  </div>

                  <div className="flex-1 overflow-y-auto space-y-2 py-2">
                    {messages.map((m, idx) => (
                      <div
                        key={idx}
                        className={`p-2 rounded-xl text-[11px] max-w-[85%] ${
                          m.sender === 'user'
                            ? 'ml-auto bg-[#F0B90B] text-[#181a20] font-medium'
                            : 'bg-[#181a20] text-slate-200'
                        }`}
                      >
                        <div>{m.text}</div>
                        <span className="text-[9px] opacity-60 block text-right mt-0.5">{m.time}</span>
                      </div>
                    ))}
                  </div>

                  <form onSubmit={handleSendMessage} className="flex gap-1.5 pt-2 border-t border-slate-800">
                    <input
                      type="text"
                      placeholder="Type a message to merchant..."
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      className="flex-1 px-3 py-1.5 rounded-xl bg-[#181a20] border border-slate-700 text-xs text-white focus:outline-none"
                    />
                    <button
                      type="submit"
                      className="p-2 rounded-xl bg-[#F0B90B] text-[#181a20] font-bold hover:bg-[#FCD535]"
                    >
                      <Send className="w-3.5 h-3.5" />
                    </button>
                  </form>
                </div>
              </div>
            ) : (
              /* Step 3: Success Screen */
              <div className="text-center py-8 space-y-3 font-mono">
                <CheckCircle2 className="w-16 h-16 mx-auto text-[#0ECB81] animate-bounce" />
                <h4 className="font-black text-lg text-slate-100">P2P Trade Completed Successfully!</h4>
                <p className="text-xs text-slate-400 max-w-sm mx-auto font-sans">
                  The merchant released <strong className="text-[#0ECB81]">{(parseFloat(tradeFiatAmount) / activeTradeOffer.price).toFixed(4)} {activeTradeOffer.cryptoType}</strong> from Binance SAFU Escrow into your Spot Wallet.
                </p>
                <button
                  onClick={() => setActiveTradeOffer(null)}
                  className="px-6 py-2.5 rounded-xl bg-[#F0B90B] text-[#181a20] font-black text-xs shadow-md"
                >
                  Back to P2P Marketplace
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

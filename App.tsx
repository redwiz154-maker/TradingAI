import React, { useState } from 'react';
import { 
  CheckCircle2, AlertCircle, Info, ShieldCheck, 
  TrendingUp, Zap, Bot, Sparkles, Wallet, Users, Repeat,
  Brain, Newspaper, LayoutGrid, Gamepad2, Radar, GitCompare, Calculator, Bell
} from 'lucide-react';
import { CryptoProvider, useCrypto } from './context/CryptoContext';
import { Header } from './components/Header';
import { TradingViewChart } from './components/TradingViewChart';
import { OrderBook } from './components/OrderBook';
import { TradeForm } from './components/TradeForm';
import { OrdersAndPositions } from './components/OrdersAndPositions';
import { MarketsView } from './components/MarketsView';
import { FuturesView } from './components/FuturesView';
import { BotsView } from './components/BotsView';
import { EarnView } from './components/EarnView';
import { WalletView } from './components/WalletView';
import { P2PView } from './components/P2PView';
import { AiPredictionView } from './components/AiPredictionView';
import { NewsTerminalView } from './components/NewsTerminalView';
import { WhaleTrackerView } from './components/WhaleTrackerView';
import { CopyTradingView } from './components/CopyTradingView';
import { ArbitrageView } from './components/ArbitrageView';
import { TradingCalculatorModal } from './components/TradingCalculatorModal';
import { PriceAlertsModal } from './components/PriceAlertsModal';
import { ConvertModal } from './components/ConvertModal';
import { DepositWithdrawModal } from './components/DepositWithdrawModal';
import { ApkDownloadModal } from './components/ApkDownloadModal';

function MainAppContent() {
  const { 
    activeSection, 
    setActiveSection,
    theme, 
    tradingMode,
    toastMessage 
  } = useCrypto();

  const [convertModalOpen, setConvertModalOpen] = useState(false);
  const [depositModalOpen, setDepositModalOpen] = useState(false);
  const [depositModalMode, setDepositModalMode] = useState<'deposit' | 'withdraw'>('deposit');
  const [apkModalOpen, setApkModalOpen] = useState(false);
  const [calculatorModalOpen, setCalculatorModalOpen] = useState(false);
  const [alertsModalOpen, setAlertsModalOpen] = useState(false);

  const isDark = theme === 'dark';

  const handleOpenDeposit = () => {
    setDepositModalMode('deposit');
    setDepositModalOpen(true);
  };

  const handleOpenWithdraw = () => {
    setDepositModalMode('withdraw');
    setDepositModalOpen(true);
  };

  return (
    <div className={`flex flex-col h-screen w-screen overflow-hidden font-sans select-none ${
      isDark ? 'bg-[#0b0e11] text-slate-100' : 'bg-slate-50 text-slate-900'
    }`}>
      {/* Trading AI Header */}
      <Header
        onOpenDeposit={handleOpenDeposit}
        onOpenConvert={() => setConvertModalOpen(true)}
        onOpenApkModal={() => setApkModalOpen(true)}
        onOpenCalculator={() => setCalculatorModalOpen(true)}
        onOpenAlerts={() => setAlertsModalOpen(true)}
      />

      {/* Main View Area */}
      <main className="flex-1 overflow-hidden relative">
        {/* Real-time AI Price Prediction Terminal */}
        {activeSection === 'prediction' && (
          <div className="h-full overflow-y-auto p-3 sm:p-6">
            <div className="max-w-7xl mx-auto">
              <AiPredictionView />
            </div>
          </div>
        )}

        {/* Live Crypto News & AI Sentiment Terminal */}
        {activeSection === 'news' && (
          <div className="h-full overflow-y-auto p-3 sm:p-6">
            <div className="max-w-7xl mx-auto">
              <NewsTerminalView />
            </div>
          </div>
        )}

        {/* On-Chain Whale & Liquidity Radar */}
        {activeSection === 'whale-tracker' && (
          <div className="h-full overflow-y-auto p-3 sm:p-6">
            <div className="max-w-7xl mx-auto">
              <WhaleTrackerView />
            </div>
          </div>
        )}

        {/* AI & Master Copy Trading */}
        {activeSection === 'copy-trading' && (
          <div className="h-full overflow-y-auto p-3 sm:p-6">
            <div className="max-w-7xl mx-auto">
              <CopyTradingView />
            </div>
          </div>
        )}

        {/* Arbitrage Scanner */}
        {activeSection === 'arbitrage' && (
          <div className="h-full overflow-y-auto p-3 sm:p-6">
            <div className="max-w-7xl mx-auto">
              <ArbitrageView />
            </div>
          </div>
        )}

        {/* Spot Trading Pro Workspace */}
        {activeSection === 'trade' && (
          <div className="h-full grid grid-cols-1 lg:grid-cols-12 gap-2 p-2 overflow-hidden">
            {/* Left/Center: Candlestick Chart & Bottom Orders Panel (8 cols) */}
            <div className="lg:col-span-8 flex flex-col gap-2 h-full overflow-hidden">
              <div className="flex-1 min-h-[360px]">
                <TradingViewChart />
              </div>
              <div className="h-64 shrink-0">
                <OrdersAndPositions defaultTab="orders" />
              </div>
            </div>

            {/* Right: Order Book & Spot Trade Form (4 cols) */}
            <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-2 h-full overflow-hidden">
              <div className="flex-1 min-h-[260px]">
                <OrderBook />
              </div>
              <div className="h-[430px] shrink-0">
                <TradeForm isFuturesMode={false} />
              </div>
            </div>
          </div>
        )}

        {/* Futures 125x Workspace */}
        {activeSection === 'futures' && (
          <FuturesView />
        )}

        {/* Markets Dashboard */}
        {activeSection === 'markets' && (
          <MarketsView />
        )}

        {/* AI & Grid Bots */}
        {activeSection === 'bots' && (
          <BotsView />
        )}

        {/* Simple Earn & Staking */}
        {activeSection === 'earn' && (
          <EarnView />
        )}

        {/* Wallet & Portfolio Assets */}
        {activeSection === 'wallet' && (
          <WalletView
            onOpenDeposit={handleOpenDeposit}
            onOpenWithdraw={handleOpenWithdraw}
          />
        )}

        {/* P2P Express Trading */}
        {activeSection === 'p2p' && (
          <P2PView />
        )}

        {/* 0-Fee Convert Quick View fallback */}
        {activeSection === 'convert' && (
          <div className="h-full flex items-center justify-center p-4">
            <div className="text-center space-y-4 max-w-md">
              <div className="w-16 h-16 rounded-3xl bg-[#F0B90B]/20 text-[#F0B90B] flex items-center justify-center mx-auto">
                <Repeat className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-black">Trading AI Instant 0-Fee Convert</h2>
              <p className="text-xs text-slate-400">Convert BTC, ETH, SOL, BNB, USDT and 50+ tokens instantly with 0 transaction fees and guaranteed rates.</p>
              <button
                onClick={() => setConvertModalOpen(true)}
                className="px-6 py-3 rounded-2xl bg-[#F0B90B] text-[#181a20] font-black text-sm shadow-lg shadow-[#F0B90B]/20"
              >
                Open Convert Window
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Mobile Bottom Navigation Bar */}
      <div className={`md:hidden border-t px-2 py-1.5 flex items-center justify-around z-30 shrink-0 select-none ${
        isDark ? 'bg-[#181a20] border-[#2b313a]' : 'bg-white border-slate-200 shadow-lg'
      }`}>
        {[
          { id: 'prediction' as const, label: 'AI Predict', icon: Brain, isAi: true },
          { id: 'trade' as const, label: 'Spot', icon: TrendingUp },
          { id: 'futures' as const, label: 'Futures', icon: Zap },
          { id: 'whale-tracker' as const, label: 'Whales', icon: Radar },
          { id: 'news' as const, label: 'News', icon: Newspaper },
          { id: 'wallet' as const, label: 'Wallet', icon: Wallet }
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeSection === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSection(tab.id)}
              className={`flex flex-col items-center gap-0.5 py-1 px-2.5 rounded-xl transition-all relative ${
                isActive
                  ? isDark ? 'text-[#F0B90B] font-bold' : 'text-blue-600 font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Icon className={`w-4 h-4 ${tab.isAi && isActive ? 'text-[#F0B90B] animate-bounce' : ''}`} />
              <span className="text-[10px] font-mono">{tab.label}</span>
              {isActive && (
                <span className="w-1 h-1 rounded-full bg-[#F0B90B] absolute bottom-0.5" />
              )}
            </button>
          );
        })}
      </div>

      {/* Convert Modal */}
      <ConvertModal
        isOpen={convertModalOpen}
        onClose={() => setConvertModalOpen(false)}
      />

      {/* Deposit / Withdraw Modal */}
      <DepositWithdrawModal
        isOpen={depositModalOpen}
        mode={depositModalMode}
        onClose={() => setDepositModalOpen(false)}
      />

      {/* APK & Android App Download Modal */}
      <ApkDownloadModal
        isOpen={apkModalOpen}
        onClose={() => setApkModalOpen(false)}
      />

      {/* Trading & Liquidation Calculator Modal */}
      <TradingCalculatorModal
        isOpen={calculatorModalOpen}
        onClose={() => setCalculatorModalOpen(false)}
      />

      {/* Price Alerts Modal */}
      <PriceAlertsModal
        isOpen={alertsModalOpen}
        onClose={() => setAlertsModalOpen(false)}
      />

      {/* Toast Notification */}
      {toastMessage && (
        <div className={`fixed bottom-14 md:bottom-8 right-8 z-50 px-4 py-3 rounded-2xl border shadow-2xl flex items-center gap-3 text-xs font-mono font-bold animate-slideUp backdrop-blur-md ${
          toastMessage.type === 'success'
            ? 'bg-[#0b0e11]/95 border-[#0ECB81] text-[#0ECB81]'
            : toastMessage.type === 'error'
              ? 'bg-[#0b0e11]/95 border-[#F6465D] text-[#F6465D]'
              : 'bg-[#0b0e11]/95 border-[#F0B90B] text-[#F0B90B]'
        }`}>
          {toastMessage.type === 'success' && <CheckCircle2 className="w-4 h-4 text-[#0ECB81] shrink-0" />}
          {toastMessage.type === 'error' && <AlertCircle className="w-4 h-4 text-[#F6465D] shrink-0" />}
          {toastMessage.type === 'info' && <Info className="w-4 h-4 text-[#F0B90B] shrink-0" />}
          <span className="text-slate-100">{toastMessage.text}</span>
        </div>
      )}
    </div>
  );
}

export default function App() {
  return (
    <CryptoProvider>
      <MainAppContent />
    </CryptoProvider>
  );
}



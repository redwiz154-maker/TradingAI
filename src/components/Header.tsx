import React, { useState } from 'react';
import { 
  TrendingUp, Wallet, ArrowDownCircle, ArrowUpCircle, 
  Search, Bell, Globe, DollarSign, Volume2, VolumeX, 
  Moon, Sun, ChevronDown, Check, Zap, Layers, 
  ShieldCheck, UserCheck, Bot, Sparkles, Repeat, Users,
  Smartphone, Download, Brain, Newspaper, RotateCcw, Gamepad2,
  Radar, GitCompare, Calculator
} from 'lucide-react';
import { useCrypto } from '../context/CryptoContext';
import { ViewSection, Currency, Language } from '../types';

export const Header: React.FC<{
  onOpenDeposit: () => void;
  onOpenConvert: () => void;
  onOpenApkModal?: () => void;
  onOpenCalculator?: () => void;
  onOpenAlerts?: () => void;
}> = ({ onOpenDeposit, onOpenConvert, onOpenApkModal, onOpenCalculator, onOpenAlerts }) => {
  const {
    activeSection,
    setActiveSection,
    coins,
    selectedCoin,
    setSelectedCoin,
    currency,
    setCurrency,
    language,
    setLanguage,
    theme,
    setTheme,
    soundEnabled,
    setSoundEnabled,
    tradingMode,
    setTradingMode,
    resetDemoBalance,
    demoStats,
    priceAlerts,
    totalPortfolioUSD,
    formatCurrency,
    formatPrice
  } = useCrypto();

  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currencyDropdown, setCurrencyDropdown] = useState(false);
  const [langDropdown, setLangDropdown] = useState(false);
  const [walletPopover, setWalletPopover] = useState(false);

  const filteredCoins = coins.filter(c => 
    c.symbol.toLowerCase().includes(searchQuery.toLowerCase()) || 
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const navItems: { id: ViewSection; label: string; labelUrdu: string; icon: any; badge?: string }[] = [
    { id: 'prediction', label: 'AI Predictor', labelUrdu: 'اے آئی پیشن گوئی', icon: Brain, badge: '91%' },
    { id: 'trade', label: 'Spot', labelUrdu: 'اسپاٹ ٹریڈنگ', icon: TrendingUp },
    { id: 'futures', label: 'Futures', labelUrdu: 'فیوچرز (125x)', icon: Zap, badge: '125x' },
    { id: 'whale-tracker', label: 'Whale Radar', labelUrdu: 'وہیل ریڈار', icon: Radar, badge: 'WHALE' },
    { id: 'copy-trading', label: 'Copy Trading', labelUrdu: 'کاپی ٹریڈنگ', icon: Users, badge: 'PRO' },
    { id: 'arbitrage', label: 'Arbitrage', labelUrdu: 'آربٹریج', icon: GitCompare, badge: 'FLASH' },
    { id: 'news', label: 'Crypto News', labelUrdu: 'کرپٹو خبریں', icon: Newspaper, badge: 'LIVE' },
    { id: 'bots', label: 'AI Bots', labelUrdu: 'ٹریڈنگ بوٹس', icon: Bot, badge: 'AI' },
    { id: 'markets', label: 'Markets', labelUrdu: 'مارکیٹس', icon: Layers },
    { id: 'earn', label: 'Earn', labelUrdu: 'اسٹیکنگ و منافع', icon: Sparkles, badge: '19.4%' },
    { id: 'p2p', label: 'P2P Express', labelUrdu: 'پی ٹو پی', icon: Users },
    { id: 'wallet', label: 'Wallet', labelUrdu: 'والٹ و اثاثے', icon: Wallet }
  ];

  const isDark = theme === 'dark';

  return (
    <header className={`sticky top-0 z-40 border-b select-none transition-colors ${
      isDark 
        ? 'bg-[#181a20] border-[#2b313a] text-slate-100' 
        : 'bg-white border-slate-200 text-slate-900 shadow-sm'
    }`}>
      {/* Top Notification / Ticker Highlight Bar */}
      <div className={`px-4 py-1.5 text-xs border-b overflow-x-auto flex items-center justify-between gap-6 scrollbar-none ${
        isDark ? 'bg-[#0b0e11] border-[#1e2329] text-slate-400' : 'bg-slate-50 border-slate-200 text-slate-600'
      }`}>
        <div className="flex items-center gap-6 shrink-0">
          <div className="flex items-center gap-1.5 text-[#F0B90B] font-bold text-[11px]">
            <span className="inline-block w-2 h-2 rounded-full bg-[#F0B90B] animate-pulse"></span>
            <span>TRADING AI QUANT ENGINE</span>
          </div>

          {coins.slice(0, 5).map(c => (
            <button
              key={c.id}
              onClick={() => {
                setSelectedCoin(c);
                if (activeSection !== 'trade' && activeSection !== 'futures' && activeSection !== 'prediction') {
                  setActiveSection('prediction');
                }
              }}
              className="flex items-center gap-2 hover:opacity-80 transition-opacity"
            >
              <span className="font-semibold text-slate-300">{c.symbol}</span>
              <span className="font-mono text-slate-100 font-bold">${formatPrice(c.price)}</span>
              <span className={`font-mono text-[10px] font-bold ${c.change24h >= 0 ? 'text-[#0ECB81]' : 'text-[#F6465D]'}`}>
                {c.change24h >= 0 ? '+' : ''}{c.change24h}%
              </span>
            </button>
          ))}
        </div>

        <div className="flex items-center gap-4 shrink-0 text-[11px]">
          <div className="flex items-center gap-1 text-[#0ECB81]">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span className="font-medium">100% Reserve Proof (SAFU)</span>
          </div>
          <span className="text-slate-500">|</span>
          <div className="text-slate-400">24h AI Predictions: <span className="font-mono text-[#F0B90B] font-bold">14,820 Signals</span></div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="px-4 lg:px-6 h-14 flex items-center justify-between gap-4">
        {/* Brand Logo & Nav Tabs */}
        <div className="flex items-center gap-5">
          <button 
            onClick={() => setActiveSection('prediction')}
            className="flex items-center gap-2.5 group cursor-pointer focus:outline-none"
          >
            {/* Authentic Trading AI Quantum Spark Logo */}
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#F0B90B] via-[#f7d046] to-[#0ECB81] flex items-center justify-center shadow-md shadow-[#F0B90B]/25 group-hover:scale-105 transition-transform">
              <Brain className="w-5 h-5 text-[#181a20]" />
            </div>
            <div className="flex flex-col text-left">
              <div className="flex items-center gap-1.5">
                <span className="font-black tracking-wider text-base leading-none text-[#F0B90B]">TRADING</span>
                <span className="font-black tracking-wider text-base leading-none text-[#0ECB81]">AI</span>
              </div>
              <span className="text-[9px] font-bold tracking-widest text-slate-400 uppercase">Binance Pro Engine</span>
            </div>
          </button>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-0.5">
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id)}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all relative ${
                    isActive 
                      ? isDark 
                        ? 'bg-[#2b313a] text-[#F0B90B]' 
                        : 'bg-slate-100 text-blue-600'
                      : isDark
                        ? 'text-slate-300 hover:text-white hover:bg-[#1e2329]'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{language === 'roman-urdu' ? item.labelUrdu : item.label}</span>
                  {item.badge && (
                    <span className={`px-1.5 py-0.2 rounded-full text-[9px] font-mono font-bold ${
                      item.badge === 'LIVE' ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30' : 'bg-[#F0B90B]/20 text-[#F0B90B] border border-[#F0B90B]/30'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                  {isActive && (
                    <div className="absolute -bottom-[13px] left-2 right-2 h-0.5 bg-[#F0B90B]" />
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Right Action Bar */}
        <div className="flex items-center gap-2.5">
          {/* Real vs Demo Trading Mode Toggle */}
          <div className={`p-0.5 rounded-xl border flex items-center shadow-inner ${
            isDark ? 'bg-[#0b0e11] border-slate-700' : 'bg-slate-100 border-slate-300'
          }`}>
            <button
              onClick={() => setTradingMode('real')}
              className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition-all ${
                tradingMode === 'real'
                  ? 'bg-[#0ECB81] text-[#181a20] shadow-sm font-black'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Real
            </button>
            <button
              onClick={() => setTradingMode('demo')}
              className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition-all flex items-center gap-1 ${
                tradingMode === 'demo'
                  ? 'bg-amber-400 text-[#181a20] shadow-sm font-black'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Gamepad2 className="w-3 h-3" />
              <span>Demo ($100k)</span>
            </button>
          </div>

          {/* Quick Search Pair Modal Trigger */}
          <div className="relative">
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className={`p-2 rounded-xl border text-xs flex items-center gap-2 transition-colors ${
                isDark 
                  ? 'bg-[#0b0e11] border-[#2b313a] text-slate-300 hover:border-slate-600' 
                  : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-slate-300'
              }`}
              title="Search Crypto Pairs"
            >
              <Search className="w-3.5 h-3.5 text-slate-400" />
              <span className="hidden sm:inline font-mono font-medium">{selectedCoin.pair}</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {/* Quick Search Popover */}
            {searchOpen && (
              <div className={`absolute right-0 mt-2 w-72 p-3 rounded-2xl border shadow-2xl z-50 animate-fadeIn ${
                isDark ? 'bg-[#181a20] border-[#2b313a]' : 'bg-white border-slate-200'
              }`}>
                <div className="relative mb-2">
                  <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search coin (BTC, ETH, SOL...)"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    autoFocus
                    className={`w-full pl-8 pr-3 py-1.5 rounded-xl text-xs font-mono focus:outline-none focus:ring-1 focus:ring-[#F0B90B] ${
                      isDark ? 'bg-[#0b0e11] text-white border border-[#2b313a]' : 'bg-slate-50 text-slate-900 border border-slate-200'
                    }`}
                  />
                </div>

                <div className="max-h-56 overflow-y-auto space-y-1">
                  {filteredCoins.map(coin => (
                    <button
                      key={coin.id}
                      onClick={() => {
                        setSelectedCoin(coin);
                        setSearchOpen(false);
                        setSearchQuery('');
                      }}
                      className={`w-full px-2.5 py-2 rounded-xl flex items-center justify-between text-xs transition-colors ${
                        coin.id === selectedCoin.id 
                          ? isDark ? 'bg-[#2b313a] text-[#F0B90B]' : 'bg-slate-100 text-blue-600'
                          : isDark ? 'hover:bg-[#2b313a] text-slate-300' : 'hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-bold">{coin.symbol}</span>
                        <span className="text-[10px] text-slate-400">{coin.name}</span>
                      </div>
                      <div className="text-right font-mono">
                        <div>${formatPrice(coin.price)}</div>
                        <div className={`text-[10px] font-bold ${coin.change24h >= 0 ? 'text-[#0ECB81]' : 'text-[#F6465D]'}`}>
                          {coin.change24h >= 0 ? '+' : ''}{coin.change24h}%
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Quick Convert Button */}
          <button
            onClick={onOpenConvert}
            className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all ${
              isDark 
                ? 'bg-[#1e2329] border-[#2b313a] text-slate-200 hover:border-[#F0B90B] hover:text-[#F0B90B]' 
                : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
            }`}
          >
            <Repeat className="w-3.5 h-3.5" />
            <span>0-Fee Swap</span>
          </button>

          {/* Download ZIP & APK / Android App Button */}
          {onOpenApkModal && (
            <button
              onClick={onOpenApkModal}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all ${
                isDark
                  ? 'bg-[#F0B90B]/15 border-[#F0B90B]/40 text-[#F0B90B] hover:bg-[#F0B90B]/25 hover:border-[#F0B90B]'
                  : 'bg-amber-50 border-amber-300 text-amber-800 hover:bg-amber-100'
              }`}
              title="Download ZIP Source Code or Android APK"
            >
              <Download className="w-3.5 h-3.5" />
              <span>ZIP / APK</span>
              <span className="hidden md:inline px-1 py-0.2 rounded text-[9px] font-mono bg-[#F0B90B] text-[#181a20] font-black">
                FREE
              </span>
            </button>
          )}

          {/* Deposit Button */}
          <button
            onClick={onOpenDeposit}
            className="px-3.5 py-1.5 rounded-xl bg-[#F0B90B] hover:bg-[#FCD535] text-[#181a20] font-bold text-xs flex items-center gap-1.5 shadow-md shadow-[#F0B90B]/20 active:scale-95 transition-all"
          >
            <ArrowDownCircle className="w-3.5 h-3.5" />
            <span>Deposit</span>
          </button>

          {/* Wallet Balance Glance Popover */}
          <div className="relative">
            <button
              onClick={() => setWalletPopover(!walletPopover)}
              className={`p-2 rounded-xl border text-xs flex items-center gap-2 transition-colors ${
                tradingMode === 'demo'
                  ? 'bg-amber-500/15 border-amber-500/40 text-amber-400'
                  : isDark ? 'bg-[#0b0e11] border-[#2b313a] text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-800'
              }`}
            >
              <Wallet className="w-4 h-4 text-[#F0B90B]" />
              <span className="hidden sm:inline font-mono font-bold">{formatCurrency(totalPortfolioUSD)}</span>
              {tradingMode === 'demo' && (
                <span className="text-[9px] font-mono font-black px-1.5 py-0.2 rounded bg-amber-400 text-black">DEMO</span>
              )}
            </button>

            {walletPopover && (
              <div className={`absolute right-0 mt-2 w-72 p-4 rounded-2xl border shadow-2xl z-50 animate-fadeIn ${
                isDark ? 'bg-[#181a20] border-[#2b313a]' : 'bg-white border-slate-200'
              }`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] uppercase font-bold text-slate-400">
                    {tradingMode === 'demo' ? '🎮 Virtual Demo Portfolio' : '💼 Real Net Worth'}
                  </span>
                  <span className={`px-2 py-0.5 rounded font-mono text-[10px] font-bold ${
                    tradingMode === 'demo' ? 'bg-amber-400/20 text-amber-400' : 'bg-[#F0B90B]/20 text-[#F0B90B]'
                  }`}>
                    {tradingMode === 'demo' ? 'PAPER TRADING' : 'VIP 1'}
                  </span>
                </div>
                <div className="text-xl font-bold font-mono text-[#F0B90B] mb-2">
                  {formatCurrency(totalPortfolioUSD)}
                </div>

                {tradingMode === 'demo' && (
                  <div className="mb-3 p-2.5 rounded-xl bg-black/40 border border-amber-500/20 text-[11px] font-mono space-y-1">
                    <div className="flex justify-between text-slate-400">
                      <span>Simulated Trades:</span>
                      <span className="text-white font-bold">{demoStats.totalTrades}</span>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>Demo Win Rate:</span>
                      <span className="text-[#0ECB81] font-bold">{demoStats.winRate}%</span>
                    </div>
                    <button
                      onClick={resetDemoBalance}
                      className="w-full mt-2 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 font-bold text-[11px] flex items-center justify-center gap-1 transition-colors"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>Reset Demo Funds ($100k)</span>
                    </button>
                  </div>
                )}

                <button
                  onClick={() => {
                    setActiveSection('wallet');
                    setWalletPopover(false);
                  }}
                  className="w-full py-2 rounded-xl bg-[#F0B90B] hover:bg-[#FCD535] text-[#181a20] font-bold text-xs transition-colors text-center"
                >
                  Manage Portfolio & Assets
                </button>
              </div>
            )}
          </div>

          {/* Currency Dropdown */}
          <div className="relative">
            <button
              onClick={() => setCurrencyDropdown(!currencyDropdown)}
              className={`p-2 rounded-xl border text-xs font-mono font-bold transition-colors ${
                isDark ? 'bg-[#0b0e11] border-[#2b313a] text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-700'
              }`}
              title="Change Currency"
            >
              {currency}
            </button>

            {currencyDropdown && (
              <div className={`absolute right-0 mt-2 w-32 p-1 rounded-xl border shadow-2xl z-50 animate-fadeIn ${
                isDark ? 'bg-[#181a20] border-[#2b313a]' : 'bg-white border-slate-200'
              }`}>
                {(['USD', 'PKR', 'EUR', 'AED', 'GBP'] as Currency[]).map(curr => (
                  <button
                    key={curr}
                    onClick={() => {
                      setCurrency(curr);
                      setCurrencyDropdown(false);
                    }}
                    className={`w-full px-3 py-1.5 rounded-lg text-xs font-mono flex items-center justify-between ${
                      currency === curr 
                        ? 'bg-[#F0B90B]/20 text-[#F0B90B] font-bold' 
                        : isDark ? 'text-slate-300 hover:bg-[#2b313a]' : 'text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <span>{curr}</span>
                    {currency === curr && <Check className="w-3 h-3" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Calculator Trigger */}
          {onOpenCalculator && (
            <button
              onClick={onOpenCalculator}
              className={`p-2 rounded-xl border text-xs transition-colors ${
                isDark ? 'bg-[#0b0e11] border-[#2b313a] text-slate-300 hover:text-[#F0B90B] hover:border-[#F0B90B]' : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
              title="Open Trading & Liquidation Calculator"
            >
              <Calculator className="w-4 h-4" />
            </button>
          )}

          {/* Price Alerts Trigger */}
          {onOpenAlerts && (
            <button
              onClick={onOpenAlerts}
              className={`p-2 rounded-xl border text-xs transition-colors relative ${
                isDark ? 'bg-[#0b0e11] border-[#2b313a] text-slate-300 hover:text-[#F0B90B] hover:border-[#F0B90B]' : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
              title="Manage Crypto Price Alerts"
            >
              <Bell className="w-4 h-4" />
              {priceAlerts.length > 0 && (
                <span className="w-2 h-2 rounded-full bg-[#F0B90B] absolute top-1.5 right-1.5" />
              )}
            </button>
          )}

          {/* Sound Toggle */}
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`p-2 rounded-xl border text-xs transition-colors ${
              isDark ? 'bg-[#0b0e11] border-[#2b313a] text-slate-400 hover:text-white' : 'bg-slate-50 border-slate-200 text-slate-600'
            }`}
            title={soundEnabled ? 'Disable Trading Sounds' : 'Enable Trading Sounds'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-[#0ECB81]" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
          </button>

          {/* Theme Toggle */}
          <button
            onClick={() => setTheme(isDark ? 'light' : 'dark')}
            className={`p-2 rounded-xl border text-xs transition-colors ${
              isDark ? 'bg-[#0b0e11] border-[#2b313a] text-slate-400 hover:text-white' : 'bg-slate-50 border-slate-200 text-slate-600'
            }`}
            title="Toggle Theme"
          >
            {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
          </button>
        </div>
      </div>
    </header>
  );
};


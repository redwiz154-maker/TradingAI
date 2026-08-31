import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import confetti from 'canvas-confetti';
import { 
  CryptoCoin, Candle, Order, Position, RecentTrade, 
  OrderBookEntry, GridBot, StakedUserPosition, 
  WalletBalances, ViewSection, Timeframe, 
  OrderType, OrderSide, PositionSide, MarginMode, 
  Currency, Language, TradingMode, AiPrediction, 
  CryptoNewsItem, AiCopilotMessage, AiSignalHistoryItem,
  SignalBacktestStats, WhaleTransaction, ExchangeFlowStat,
  MasterTrader, CopiedTraderSubscription, ArbitrageOpportunity,
  TriangularArbitrageOpportunity, PriceAlertItem
} from '../types';
import { INITIAL_COINS, generateCandleHistory, STAKING_PRODUCTS, FIAT_RATES } from '../data/cryptoData';
import { INITIAL_CRYPTO_NEWS, generateAiPrediction, INITIAL_SIGNAL_HISTORY, calculateBacktestStats } from '../data/newsAndPredictionData';
import { initialWhaleTransactions, initialExchangeFlows } from '../data/whaleAndRadarData';
import { initialMasterTraders, initialCopiedSubscriptions } from '../data/copyTradingData';
import { initialArbitrageOpportunities, initialTriangularOpportunities } from '../data/arbitrageData';

interface CryptoContextType {
  // Navigation & Preferences
  activeSection: ViewSection;
  setActiveSection: (s: ViewSection) => void;
  selectedCoin: CryptoCoin;
  setSelectedCoin: (coin: CryptoCoin) => void;
  timeframe: Timeframe;
  setTimeframe: (t: Timeframe) => void;
  currency: Currency;
  setCurrency: (c: Currency) => void;
  language: Language;
  setLanguage: (l: Language) => void;
  theme: 'dark' | 'light';
  setTheme: (t: 'dark' | 'light') => void;
  soundEnabled: boolean;
  setSoundEnabled: (v: boolean) => void;

  // Trading Mode: Real vs Demo Paper Trading
  tradingMode: TradingMode;
  setTradingMode: (mode: TradingMode) => void;
  resetDemoBalance: () => void;
  demoStats: {
    totalTrades: number;
    winCount: number;
    winRate: number;
    totalProfitUSD: number;
  };

  // Real-time Market Data
  coins: CryptoCoin[];
  candles: Candle[];
  orderBook: { bids: OrderBookEntry[]; asks: OrderBookEntry[]; spread: number };
  recentTrades: RecentTrade[];

  // Wallet & Balances
  balances: WalletBalances;
  totalPortfolioUSD: number;
  unrealizedFuturesPnlUSD: number;
  transferWallet: (from: keyof WalletBalances, to: keyof WalletBalances, asset: string, amount: number) => boolean;
  depositCrypto: (asset: string, amount: number) => void;
  withdrawCrypto: (asset: string, amount: number, address: string) => boolean;

  // Spot Orders
  orders: Order[];
  tradeHistory: Order[];
  placeSpotOrder: (params: {
    type: OrderType;
    side: OrderSide;
    price: number;
    amount: number;
    tp?: number;
    sl?: number;
  }) => boolean;
  cancelOrder: (orderId: string) => void;

  // Futures
  positions: Position[];
  leverage: number;
  setLeverage: (l: number) => void;
  marginMode: MarginMode;
  setMarginMode: (m: MarginMode) => void;
  openFuturesPosition: (params: {
    side: PositionSide;
    orderType: 'market' | 'limit';
    price?: number;
    amount: number;
    leverage: number;
    marginMode: MarginMode;
    tp?: number;
    sl?: number;
  }) => boolean;
  closeFuturesPosition: (positionId: string) => void;
  updatePositionTPSL: (positionId: string, tp?: number, sl?: number) => void;

  // AI Prediction & Signals Engine
  predictionHorizon: '15m' | '1h' | '4h' | '24h' | '7d';
  setPredictionHorizon: (h: '15m' | '1h' | '4h' | '24h' | '7d') => void;
  activePrediction: AiPrediction;
  executeAiSignal: (prediction: AiPrediction, executionType: 'spot' | 'futures', amountUSD?: number) => boolean;

  // AI Signal History & Backtesting
  signalHistory: AiSignalHistoryItem[];
  addSignalToHistory: (signal: Partial<AiSignalHistoryItem>) => void;
  clearSignalHistory: () => void;
  backtestStats: SignalBacktestStats;

  // Quick Direct Buy / Sell Action
  executeQuickOrder: (params: {
    coin?: CryptoCoin;
    side: 'BUY' | 'SELL';
    type: 'spot' | 'futures';
    amountUSD: number;
    leverage?: number;
    tp?: number;
    sl?: number;
  }) => boolean;

  // Live Crypto News Terminal
  news: CryptoNewsItem[];
  refreshNewsFeed: () => void;
  addBreakingNewsAlert: (title: string, summary: string, sentiment: 'BULLISH' | 'BEARISH' | 'NEUTRAL', coin: string) => void;

  // AI Copilot
  copilotMessages: AiCopilotMessage[];
  sendCopilotMessage: (text: string) => void;

  // Bots
  gridBots: GridBot[];
  createGridBot: (params: Omit<GridBot, 'id' | 'createdAt' | 'runtime' | 'totalProfit' | 'gridProfit' | 'floatingProfit' | 'arbitrageCount'>) => boolean;
  toggleBotStatus: (botId: string) => void;
  stopBot: (botId: string) => void;

  // Staking / Earn
  stakedPositions: StakedUserPosition[];
  stakeAsset: (productId: string, amount: number) => boolean;
  unstakeAsset: (stakedId: string) => boolean;
  claimAllEarnInterest: () => void;

  // Convert
  convertAssets: (fromAsset: string, toAsset: string, fromAmount: number) => { success: boolean; receivedAmount: number };

  // Whale Tracking & Liquidity Radar
  whaleTransactions: WhaleTransaction[];
  exchangeFlows: ExchangeFlowStat[];
  addWhaleAlert: (tx: Partial<WhaleTransaction>) => void;

  // Master Copy Trading
  masterTraders: MasterTrader[];
  copiedSubscriptions: CopiedTraderSubscription[];
  copyTrader: (traderId: string, amountUSD: number, maxLeverage?: number, stopLossRatio?: number) => boolean;
  stopCopyingTrader: (traderId: string) => void;

  // Cross-Exchange & Triangular Arbitrage
  arbitrageOpportunities: ArbitrageOpportunity[];
  triangularOpportunities: TriangularArbitrageOpportunity[];
  executeArbitrage: (oppId: string) => boolean;
  executeTriangularArbitrage: (oppId: string) => boolean;

  // Custom Price Alerts
  priceAlerts: PriceAlertItem[];
  addPriceAlert: (symbol: string, targetPrice: number, condition: 'ABOVE' | 'BELOW', note?: string) => boolean;
  removePriceAlert: (id: string) => void;
  triggerPriceAlertTest: (id: string) => void;

  // Utilities
  formatPrice: (price: number, decimals?: number) => string;
  formatCurrency: (amountUSD: number) => string;
  toastMessage: { text: string; type: 'success' | 'error' | 'info' } | null;
  showToast: (text: string, type?: 'success' | 'error' | 'info') => void;
}

const CryptoContext = createContext<CryptoContextType | null>(null);

const STORAGE_KEY = 'trading_ai_state_v3';

const DEFAULT_REAL_BALANCES: WalletBalances = {
  spot: { USDT: 28500.00, BTC: 0.65, ETH: 4.80, BNB: 35.0, SOL: 85.0, XRP: 4200.0 },
  futures: { USDT: 15000.00 },
  earn: { USDT: 12000.00, BNB: 15.0 },
  funding: { USDT: 3500.00 }
};

const DEFAULT_DEMO_BALANCES: WalletBalances = {
  spot: { USDT: 100000.00, BTC: 1.5, ETH: 15.0, SOL: 120.0, XRP: 10000.0, BNB: 50.0 },
  futures: { USDT: 50000.00 },
  earn: { USDT: 25000.00, BNB: 20.0 },
  funding: { USDT: 10000.00 }
};

export const CryptoProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Navigation
  const [activeSection, setActiveSection] = useState<ViewSection>('trade');
  const [currency, setCurrency] = useState<Currency>('USD');
  const [language, setLanguage] = useState<Language>('en');
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [timeframe, setTimeframe] = useState<Timeframe>('15m');
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'error' | 'info' } | null>(null);

  // Sound Synth using Web Audio API
  const playSound = useCallback((type: 'buy' | 'sell' | 'chime' | 'cancel') => {
    if (!soundEnabled || typeof window === 'undefined') return;
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) return;
      const ctx = new AudioContextClass();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      if (type === 'buy') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
        osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.15); // A5
        gain.gain.setValueAtTime(0.12, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);
        osc.start();
        osc.stop(ctx.currentTime + 0.2);
      } else if (type === 'sell') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(783.99, ctx.currentTime); // G5
        osc.frequency.exponentialRampToValueAtTime(523.25, ctx.currentTime + 0.15); // C5
        gain.gain.setValueAtTime(0.12, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);
        osc.start();
        osc.stop(ctx.currentTime + 0.2);
      } else if (type === 'chime') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(659.25, ctx.currentTime); // E5
        osc.frequency.exponentialRampToValueAtTime(1046.50, ctx.currentTime + 0.25); // C6
        gain.gain.setValueAtTime(0.15, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
        osc.start();
        osc.stop(ctx.currentTime + 0.35);
      } else {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(440, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(220, ctx.currentTime + 0.1);
        gain.gain.setValueAtTime(0.1, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);
        osc.start();
        osc.stop(ctx.currentTime + 0.15);
      }
    } catch {
      // Audio context restricted until first click
    }
  }, [soundEnabled]);

  const showToast = useCallback((text: string, type: 'success' | 'error' | 'info' = 'info') => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 3500);
  }, []);

  // Coins & active pair
  const [coins, setCoins] = useState<CryptoCoin[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY + '_coins');
    return saved ? JSON.parse(saved) : INITIAL_COINS;
  });

  
  const [selectedCoin, setSelectedCoin] = useState<CryptoCoin>(coins[0]);
  const [candles, setCandles] = useState<Candle[]>(() => generateCandleHistory(coins[0].price, 90));

  // Trading Mode: Real vs Demo ($100k Virtual Balance)
  const [tradingMode, setTradingModeState] = useState<TradingMode>(() => {
    const saved = localStorage.getItem(STORAGE_KEY + '_trading_mode');
    return (saved as TradingMode) || 'real';
  });

  const setTradingMode = useCallback((mode: TradingMode) => {
    setTradingModeState(mode);
    localStorage.setItem(STORAGE_KEY + '_trading_mode', mode);
    playSound('chime');
    showToast(
      mode === 'demo' 
        ? '🎮 Switched to Demo Trading ($100,000 Virtual Funds Active)' 
        : '💼 Switched to Live Real Account Trading',
      mode === 'demo' ? 'info' : 'success'
    );
  }, [playSound, showToast]);

  // Demo stats
  const [demoStats, setDemoStats] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY + '_demo_stats');
    return saved ? JSON.parse(saved) : {
      totalTrades: 12,
      winCount: 10,
      winRate: 83.3,
      totalProfitUSD: 4820.50
    };
  });

  // News Terminal State
  const [news, setNews] = useState<CryptoNewsItem[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY + '_news');
    return saved ? JSON.parse(saved) : INITIAL_CRYPTO_NEWS;
  });

  // AI Signal History State
  const [signalHistory, setSignalHistory] = useState<AiSignalHistoryItem[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY + '_signal_history');
    return saved ? JSON.parse(saved) : INITIAL_SIGNAL_HISTORY;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY + '_signal_history', JSON.stringify(signalHistory));
  }, [signalHistory]);

  const backtestStats = useMemo(() => {
    return calculateBacktestStats(signalHistory);
  }, [signalHistory]);

  const addSignalToHistory = useCallback((signal: Partial<AiSignalHistoryItem>) => {
    const newEntry: AiSignalHistoryItem = {
      id: 'sig-' + Date.now(),
      pair: signal.pair || selectedCoin.pair,
      symbol: signal.symbol || selectedCoin.symbol,
      signalType: signal.signalType || 'BUY_LONG',
      entryPrice: signal.entryPrice || selectedCoin.price,
      targetPrice1: signal.targetPrice1 || selectedCoin.price * 1.04,
      targetPrice2: signal.targetPrice2 || selectedCoin.price * 1.08,
      stopLossPrice: signal.stopLossPrice || selectedCoin.price * 0.97,
      closedPrice: signal.closedPrice || selectedCoin.price,
      status: signal.status || 'ACTIVE',
      profitPct: signal.profitPct || 0,
      roiUSD: signal.roiUSD || 0,
      leverage: signal.leverage || 10,
      timeHorizon: signal.timeHorizon || '4h',
      confidence: signal.confidence || 92.5,
      timestamp: signal.timestamp || Date.now(),
      closedAt: signal.closedAt,
      verificationHash: `0x${Math.random().toString(16).substring(2, 8)}...${Math.random().toString(16).substring(2, 6)} (Binance Engine)`,
      rationale: signal.rationale || 'AI Neural model breakout confirmation with multi-timeframe volume surge.'
    };

    setSignalHistory(prev => [newEntry, ...prev]);
  }, [selectedCoin]);

  const clearSignalHistory = useCallback(() => {
    setSignalHistory([]);
    localStorage.removeItem(STORAGE_KEY + '_signal_history');
    showToast('Signal history cleared successfully.', 'info');
  }, [showToast]);

  // AI Prediction Horizon
  const [predictionHorizon, setPredictionHorizon] = useState<'15m' | '1h' | '4h' | '24h' | '7d'>('1h');

  // Copilot Chat History
  const [copilotMessages, setCopilotMessages] = useState<AiCopilotMessage[]>([
    {
      id: 'copilot-welcome',
      sender: 'ai',
      text: `Hello Trader! I am **Trading AI Copilot**, your real-time crypto strategist. I analyze order flow, news sentiment, RSI/MACD indicators, and on-chain whale liquidity to deliver high-probability trade setups.\n\nAsk me about current setups on **${selectedCoin.symbol}**, market sentiment, or click **Quick AI Signal Execution**!`,
      timestamp: Date.now()
    }
  ]);

  // Wallet balances (Real vs Demo)
  const [realBalances, setRealBalances] = useState<WalletBalances>(() => {
    const saved = localStorage.getItem(STORAGE_KEY + '_balances');
    if (saved) return JSON.parse(saved);
    return DEFAULT_REAL_BALANCES;
  });

  const [demoBalances, setDemoBalances] = useState<WalletBalances>(() => {
    const saved = localStorage.getItem(STORAGE_KEY + '_demo_balances');
    if (saved) return JSON.parse(saved);
    return DEFAULT_DEMO_BALANCES;
  });

  // Active balances view
  const balances = tradingMode === 'demo' ? demoBalances : realBalances;
  const setBalances = tradingMode === 'demo' ? setDemoBalances : setRealBalances;

  const resetDemoBalance = useCallback(() => {
    setDemoBalances(DEFAULT_DEMO_BALANCES);
    localStorage.setItem(STORAGE_KEY + '_demo_balances', JSON.stringify(DEFAULT_DEMO_BALANCES));
    setDemoStats({
      totalTrades: 0,
      winCount: 0,
      winRate: 0,
      totalProfitUSD: 0
    });
    confetti({ particleCount: 50, spread: 60 });
    playSound('chime');
    showToast('Demo trading wallet reset to $100,000 USDT Virtual Balance!', 'success');
  }, [playSound, showToast]);

  // Compute active prediction live
  const activePrediction = useMemo(() => {
    return generateAiPrediction(selectedCoin, predictionHorizon, news);
  }, [selectedCoin, predictionHorizon, news]);

  // Orders & Positions
  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY + '_orders');
    return saved ? JSON.parse(saved) : [];
  });

  const [tradeHistory, setTradeHistory] = useState<Order[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY + '_history');
    return saved ? JSON.parse(saved) : [];
  });

  const [positions, setPositions] = useState<Position[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY + '_positions');
    return saved ? JSON.parse(saved) : [];
  });

  const [leverage, setLeverage] = useState<number>(20);
  const [marginMode, setMarginMode] = useState<MarginMode>('cross');

  // Bots & Staking
  const [gridBots, setGridBots] = useState<GridBot[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY + '_bots');
    return saved ? JSON.parse(saved) : [
      {
        id: 'bot-1',
        pair: 'BTC/USDT',
        name: 'BTC Spot Grid (Auto AI)',
        type: 'spot_grid',
        status: 'running',
        lowerPrice: 82000,
        upperPrice: 95000,
        grids: 30,
        investment: 5000,
        totalProfit: 284.50,
        gridProfit: 210.20,
        floatingProfit: 74.30,
        arbitrageCount: 42,
        runtime: '4d 18h',
        createdAt: Date.now() - 410000000
      }
    ];
  });

  const [stakedPositions, setStakedPositions] = useState<StakedUserPosition[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY + '_staked');
    return saved ? JSON.parse(saved) : [
      {
        id: 'staked-1',
        productId: 'usdt-flex',
        asset: 'USDT',
        amount: 8000,
        apr: 12.8,
        accruedInterest: 34.12,
        startDate: Date.now() - 86400000 * 5,
        durationDays: 'flexible',
        status: 'active'
      }
    ];
  });

  // Whale Tracker & On-Chain Liquidity Radar State
  const [whaleTransactions, setWhaleTransactions] = useState<WhaleTransaction[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY + '_whales');
    return saved ? JSON.parse(saved) : initialWhaleTransactions;
  });

  const [exchangeFlows, setExchangeFlows] = useState<ExchangeFlowStat[]>(initialExchangeFlows);

  // Copy Trading State
  const [masterTraders, setMasterTraders] = useState<MasterTrader[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY + '_master_traders');
    return saved ? JSON.parse(saved) : initialMasterTraders;
  });

  const [copiedSubscriptions, setCopiedSubscriptions] = useState<CopiedTraderSubscription[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY + '_copied_subscriptions');
    return saved ? JSON.parse(saved) : initialCopiedSubscriptions;
  });

  // Arbitrage Scanner State
  const [arbitrageOpportunities, setArbitrageOpportunities] = useState<ArbitrageOpportunity[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY + '_arbitrage');
    return saved ? JSON.parse(saved) : initialArbitrageOpportunities;
  });

  const [triangularOpportunities, setTriangularOpportunities] = useState<TriangularArbitrageOpportunity[]>(() => {
    return initialTriangularOpportunities;
  });

  // Price Alerts State
  const [priceAlerts, setPriceAlerts] = useState<PriceAlertItem[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY + '_price_alerts');
    return saved ? JSON.parse(saved) : [
      {
        id: 'alert-1',
        symbol: 'BTC',
        pair: 'BTC/USDT',
        targetPrice: 95000,
        condition: 'ABOVE',
        note: 'Breakout above $95k ATH resistance',
        soundEnabled: true,
        createdAt: Date.now() - 86400000,
        triggered: false
      },
      {
        id: 'alert-2',
        symbol: 'ETH',
        pair: 'ETH/USDT',
        targetPrice: 3300,
        condition: 'BELOW',
        note: 'Key support reload zone',
        soundEnabled: true,
        createdAt: Date.now() - 43200000,
        triggered: false
      }
    ];
  });

  // Save to LocalStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY + '_balances', JSON.stringify(balances));
    localStorage.setItem(STORAGE_KEY + '_orders', JSON.stringify(orders));
    localStorage.setItem(STORAGE_KEY + '_history', JSON.stringify(tradeHistory));
    localStorage.setItem(STORAGE_KEY + '_positions', JSON.stringify(positions));
    localStorage.setItem(STORAGE_KEY + '_bots', JSON.stringify(gridBots));
    localStorage.setItem(STORAGE_KEY + '_staked', JSON.stringify(stakedPositions));
    localStorage.setItem(STORAGE_KEY + '_whales', JSON.stringify(whaleTransactions));
    localStorage.setItem(STORAGE_KEY + '_master_traders', JSON.stringify(masterTraders));
    localStorage.setItem(STORAGE_KEY + '_copied_subscriptions', JSON.stringify(copiedSubscriptions));
    localStorage.setItem(STORAGE_KEY + '_price_alerts', JSON.stringify(priceAlerts));
  }, [balances, orders, tradeHistory, positions, gridBots, stakedPositions, whaleTransactions, masterTraders, copiedSubscriptions, priceAlerts]);

  // When selected coin changes, regenerate candles for that coin
  useEffect(() => {
    const freshCandles = generateCandleHistory(selectedCoin.price, 90);
    setCandles(freshCandles);
  }, [selectedCoin.id]);

  // Real-time market simulation ticker
  useEffect(() => {
    const interval = setInterval(() => {
      setCoins(prevCoins => {
        return prevCoins.map(coin => {
          // Realistic small fluctuation: -0.2% to +0.2%
          const deltaPct = (Math.random() - 0.49) * 0.0035;
          const newPrice = Math.max(coin.price * 0.1, coin.price * (1 + deltaPct));
          const roundedPrice = Number(newPrice.toFixed(coin.precision));
          
          const newHigh = Math.max(coin.high24h, roundedPrice);
          const newLow = Math.min(coin.low24h, roundedPrice);
          const change24h = Number((coin.change24h + deltaPct * 10).toFixed(2));
          const newSparkline = [...coin.sparkline.slice(1), roundedPrice];

          if (coin.id === selectedCoin.id) {
            // Update current active candle live
            setCandles(prevCandles => {
              if (prevCandles.length === 0) return prevCandles;
              const last = { ...prevCandles[prevCandles.length - 1] };
              last.close = roundedPrice;
              last.high = Math.max(last.high, roundedPrice);
              last.low = Math.min(last.low, roundedPrice);
              last.volume = Number((last.volume + Math.random() * 0.5).toFixed(2));
              return [...prevCandles.slice(0, -1), last];
            });

            // Update selected coin instance reference
            setSelectedCoin(prev => ({
              ...prev,
              price: roundedPrice,
              high24h: newHigh,
              low24h: newLow,
              change24h
            }));
          }

          return {
            ...coin,
            price: roundedPrice,
            high24h: newHigh,
            low24h: newLow,
            change24h,
            sparkline: newSparkline
          };
        });
      });
    }, 1200);

    return () => clearInterval(interval);
  }, [selectedCoin.id]);

  // Real-time staking per-second interest accrual
  useEffect(() => {
    const earnTimer = setInterval(() => {
      setStakedPositions(prevStaked => {
        return prevStaked.map(item => {
          if (item.status !== 'active') return item;
          // Per-second interest = amount * (APR / 100) / (365 * 86400)
          const secondYield = (item.amount * (item.apr / 100)) / (365 * 86400);
          return {
            ...item,
            accruedInterest: Number((item.accruedInterest + secondYield).toFixed(6))
          };
        });
      });
    }, 1000);

    return () => clearInterval(earnTimer);
  }, []);

  // Real-time Futures positions PnL updates
  useEffect(() => {
    setPositions(prevPositions => {
      return prevPositions.map(pos => {
        const currentCoin = coins.find(c => c.pair === pos.pair) || selectedCoin;
        const markPrice = currentCoin.price;
        const diff = pos.side === 'long' ? markPrice - pos.entryPrice : pos.entryPrice - markPrice;
        const pnl = (diff / pos.entryPrice) * pos.size * pos.leverage;
        const pnlPercentage = (pnl / pos.margin) * 100;

        // Auto TP/SL triggers
        if (pos.tp && ((pos.side === 'long' && markPrice >= pos.tp) || (pos.side === 'short' && markPrice <= pos.tp))) {
          // Trigger TP
          playSound('chime');
          confetti({ particleCount: 60, spread: 50 });
          showToast(`🎯 Take Profit hit on ${pos.pair}! Profit: +$${pnl.toFixed(2)}`, 'success');
          // Add margin + pnl to futures wallet
          setBalances(b => ({
            ...b,
            futures: {
              ...b.futures,
              USDT: Number((b.futures.USDT + pos.margin + pnl).toFixed(2))
            }
          }));
          return null as any; // filter out
        }

        if (pos.sl && ((pos.side === 'long' && markPrice <= pos.sl) || (pos.side === 'short' && markPrice >= pos.sl))) {
          // Trigger SL
          playSound('sell');
          showToast(`🛑 Stop Loss executed on ${pos.pair}. Loss: -$${Math.abs(pnl).toFixed(2)}`, 'error');
          setBalances(b => ({
            ...b,
            futures: {
              ...b.futures,
              USDT: Math.max(0, Number((b.futures.USDT + pos.margin + pnl).toFixed(2)))
            }
          }));
          return null as any;
        }

        return {
          ...pos,
          markPrice,
          pnl: Number(pnl.toFixed(2)),
          pnlPercentage: Number(pnlPercentage.toFixed(2))
        };
      }).filter(Boolean);
    });
  }, [coins, selectedCoin, playSound, showToast]);

  // Order Book real-time generation
  const orderBook = useMemo(() => {
    const basePrice = selectedCoin.price;
    const precision = selectedCoin.precision;
    const step = basePrice < 1 ? 0.0001 : basePrice < 10 ? 0.01 : basePrice < 1000 ? 0.1 : 1;

    const asks: OrderBookEntry[] = [];
    let cumAskTotal = 0;
    for (let i = 8; i >= 1; i--) {
      const price = Number((basePrice + i * step).toFixed(precision));
      const amount = Number((Math.random() * 2.5 + 0.1).toFixed(3));
      cumAskTotal += amount;
      asks.push({ price, amount, total: Number(cumAskTotal.toFixed(3)) });
    }

    const bids: OrderBookEntry[] = [];
    let cumBidTotal = 0;
    for (let i = 1; i <= 8; i++) {
      const price = Number((basePrice - i * step).toFixed(precision));
      const amount = Number((Math.random() * 2.8 + 0.1).toFixed(3));
      cumBidTotal += amount;
      bids.push({ price, amount, total: Number(cumBidTotal.toFixed(3)) });
    }

    const spread = Number((asks[asks.length - 1]?.price - bids[0]?.price || step).toFixed(precision));

    return { asks, bids, spread };
  }, [selectedCoin.price, selectedCoin.precision]);

  // Recent Trades generator stream
  const [recentTrades, setRecentTrades] = useState<RecentTrade[]>([]);
  useEffect(() => {
    const tradeInterval = setInterval(() => {
      const isBuy = Math.random() > 0.48;
      const priceOffset = (Math.random() - 0.5) * (selectedCoin.price * 0.001);
      const tradePrice = Number((selectedCoin.price + priceOffset).toFixed(selectedCoin.precision));
      const tradeAmount = Number((Math.random() * (selectedCoin.price > 1000 ? 0.8 : 50) + 0.01).toFixed(3));
      const now = new Date();
      const timeStr = now.toTimeString().split(' ')[0];

      const newTrade: RecentTrade = {
        id: Math.random().toString(36).substring(7),
        price: tradePrice,
        amount: tradeAmount,
        time: timeStr,
        side: isBuy ? 'buy' : 'sell'
      };

      setRecentTrades(prev => [newTrade, ...prev.slice(0, 24)]);
    }, 1800);

    return () => clearInterval(tradeInterval);
  }, [selectedCoin.price, selectedCoin.precision]);

  // Calculate Total Portfolio in USD
  const totalPortfolioUSD = useMemo(() => {
    let total = 0;
    // Spot
    (Object.entries(balances.spot) as [string, number][]).forEach(([asset, amount]) => {
      if (asset === 'USDT' || asset === 'USD') {
        total += (amount as number);
      } else {
        const coin = coins.find(c => c.baseAsset === asset);
        total += (amount as number) * (coin?.price || 0);
      }
    });

    // Futures
    total += balances.futures.USDT || 0;

    // Earn
    (Object.entries(balances.earn) as [string, number][]).forEach(([asset, amount]) => {
      if (asset === 'USDT' || asset === 'USD') {
        total += (amount as number);
      } else {
        const coin = coins.find(c => c.baseAsset === asset);
        total += (amount as number) * (coin?.price || 0);
      }
    });

    // Funding
    total += balances.funding.USDT || 0;

    return Number(total.toFixed(2));
  }, [balances, coins]);

  // Unrealized Futures PnL
  const unrealizedFuturesPnlUSD = useMemo(() => {
    return Number(positions.reduce((sum, p) => sum + p.pnl, 0).toFixed(2));
  }, [positions]);

  // Internal Wallet Transfer
  const transferWallet = useCallback((
    from: keyof WalletBalances, 
    to: keyof WalletBalances, 
    asset: string, 
    amount: number
  ): boolean => {
    if (from === to || amount <= 0) return false;
    const available = balances[from][asset] || 0;
    if (available < amount) {
      showToast(`Insufficient ${asset} balance in ${from.toUpperCase()} wallet!`, 'error');
      return false;
    }

    setBalances(prev => ({
      ...prev,
      [from]: {
        ...prev[from],
        [asset]: Number((prev[from][asset] - amount).toFixed(6))
      },
      [to]: {
        ...prev[to],
        [asset]: Number(((prev[to][asset] || 0) + amount).toFixed(6))
      }
    }));

    playSound('chime');
    showToast(`Transferred ${amount} ${asset} from ${from.toUpperCase()} to ${to.toUpperCase()} successfully!`, 'success');
    return true;
  }, [balances, playSound, showToast]);

  // Deposit Crypto
  const depositCrypto = useCallback((asset: string, amount: number) => {
    if (amount <= 0) return;
    setBalances(prev => ({
      ...prev,
      spot: {
        ...prev.spot,
        [asset]: Number(((prev.spot[asset] || 0) + amount).toFixed(6))
      }
    }));
    confetti({ particleCount: 50, spread: 60 });
    playSound('chime');
    showToast(`Deposit confirmed! +${amount} ${asset} credited to Spot Wallet.`, 'success');
  }, [playSound, showToast]);

  // Withdraw Crypto
  const withdrawCrypto = useCallback((asset: string, amount: number, address: string): boolean => {
    const available = balances.spot[asset] || 0;
    if (available < amount) {
      showToast(`Insufficient ${asset} balance for withdrawal!`, 'error');
      return false;
    }

    setBalances(prev => ({
      ...prev,
      spot: {
        ...prev.spot,
        [asset]: Number((prev.spot[asset] - amount).toFixed(6))
      }
    }));

    playSound('sell');
    showToast(`Withdrawal of ${amount} ${asset} to ${address.substring(0, 8)}... broadcasted on-chain!`, 'success');
    return true;
  }, [balances.spot, playSound, showToast]);

  // Spot Order Placement
  const placeSpotOrder = useCallback((params: {
    type: OrderType;
    side: OrderSide;
    price: number;
    amount: number;
    tp?: number;
    sl?: number;
  }): boolean => {
    const { type, side, price, amount, tp, sl } = params;
    const totalCost = price * amount;
    const baseAsset = selectedCoin.baseAsset;
    const quoteAsset = selectedCoin.quoteAsset;

    if (side === 'buy') {
      const usdtBalance = balances.spot[quoteAsset] || 0;
      if (usdtBalance < totalCost) {
        showToast(`Insufficient ${quoteAsset} balance! Need $${totalCost.toFixed(2)}`, 'error');
        return false;
      }

      // Deduct USDT, add base asset if market order or lock in order
      setBalances(prev => ({
        ...prev,
        spot: {
          ...prev.spot,
          [quoteAsset]: Number((prev.spot[quoteAsset] - totalCost).toFixed(2)),
          ...(type === 'market' ? {
            [baseAsset]: Number(((prev.spot[baseAsset] || 0) + amount).toFixed(6))
          } : {})
        }
      }));
    } else {
      const baseBalance = balances.spot[baseAsset] || 0;
      if (baseBalance < amount) {
        showToast(`Insufficient ${baseAsset} balance! Need ${amount} ${baseAsset}`, 'error');
        return false;
      }

      setBalances(prev => ({
        ...prev,
        spot: {
          ...prev.spot,
          [baseAsset]: Number((prev.spot[baseAsset] - amount).toFixed(6)),
          ...(type === 'market' ? {
            [quoteAsset]: Number(((prev.spot[quoteAsset] || 0) + totalCost).toFixed(2))
          } : {})
        }
      }));
    }

    const newOrder: Order = {
      id: 'ord-' + Math.random().toString(36).substring(7),
      pair: selectedCoin.pair,
      type,
      side,
      price,
      amount,
      total: totalCost,
      filled: type === 'market' ? amount : 0,
      status: type === 'market' ? 'filled' : 'open',
      createdAt: Date.now(),
      takeProfit: tp,
      stopLoss: sl
    };

    if (type === 'market') {
      playSound(side === 'buy' ? 'buy' : 'sell');
      confetti({ particleCount: 35, spread: 45 });
      showToast(`Market ${side.toUpperCase()} filled: ${amount} ${baseAsset} @ $${price}`, 'success');
      setTradeHistory(prev => [newOrder, ...prev]);
    } else {
      playSound('chime');
      showToast(`Limit ${side.toUpperCase()} order placed: ${amount} ${baseAsset} @ $${price}`, 'info');
      setOrders(prev => [newOrder, ...prev]);
    }

    return true;
  }, [balances.spot, selectedCoin, playSound, showToast]);

  // Cancel Spot Order
  const cancelOrder = useCallback((orderId: string) => {
    const order = orders.find(o => o.id === orderId);
    if (!order) return;

    // Refund balances
    const [baseAsset, quoteAsset] = order.pair.split('/');
    if (order.side === 'buy') {
      setBalances(prev => ({
        ...prev,
        spot: {
          ...prev.spot,
          [quoteAsset]: Number(((prev.spot[quoteAsset] || 0) + order.total).toFixed(2))
        }
      }));
    } else {
      setBalances(prev => ({
        ...prev,
        spot: {
          ...prev.spot,
          [baseAsset]: Number(((prev.spot[baseAsset] || 0) + order.amount).toFixed(6))
        }
      }));
    }

    setOrders(prev => prev.filter(o => o.id !== orderId));
    playSound('cancel');
    showToast(`Order #${orderId.slice(-4)} cancelled and funds refunded.`, 'info');
  }, [orders, playSound, showToast]);

  // Open Futures Position
  const openFuturesPosition = useCallback((params: {
    side: PositionSide;
    orderType: 'market' | 'limit';
    price?: number;
    amount: number;
    leverage: number;
    marginMode: MarginMode;
    tp?: number;
    sl?: number;
  }): boolean => {
    const { side, amount, leverage: lev, marginMode: mode, tp, sl } = params;
    const entryPrice = params.price || selectedCoin.price;
    const positionSizeUSD = amount * entryPrice;
    const requiredMargin = positionSizeUSD / lev;

    const futuresUSDT = balances.futures.USDT || 0;
    if (futuresUSDT < requiredMargin) {
      showToast(`Insufficient Futures USDT! Required Margin: $${requiredMargin.toFixed(2)}`, 'error');
      return false;
    }

    // Deduct margin from futures wallet
    setBalances(prev => ({
      ...prev,
      futures: {
        ...prev.futures,
        USDT: Number((prev.futures.USDT - requiredMargin).toFixed(2))
      }
    }));

    // Calculate liquidation price
    const liqBuffer = 0.95 / lev;
    const liqPrice = side === 'long' 
      ? entryPrice * (1 - liqBuffer)
      : entryPrice * (1 + liqBuffer);

    const newPosition: Position = {
      id: 'pos-' + Math.random().toString(36).substring(7),
      pair: selectedCoin.pair,
      side,
      entryPrice,
      markPrice: entryPrice,
      size: amount,
      margin: requiredMargin,
      leverage: lev,
      marginMode: mode,
      liquidationPrice: Number(liqPrice.toFixed(selectedCoin.precision)),
      pnl: 0,
      pnlPercentage: 0,
      tp,
      sl,
      openedAt: Date.now()
    };

    setPositions(prev => [newPosition, ...prev]);
    playSound(side === 'long' ? 'buy' : 'sell');
    confetti({ particleCount: 40, spread: 50 });
    showToast(`🚀 ${lev}x ${side.toUpperCase()} position opened on ${selectedCoin.pair}! Margin: $${requiredMargin.toFixed(2)}`, 'success');
    return true;
  }, [balances.futures.USDT, selectedCoin, playSound, showToast]);

  // Close Futures Position
  const closeFuturesPosition = useCallback((positionId: string) => {
    const pos = positions.find(p => p.id === positionId);
    if (!pos) return;

    const returnAmount = pos.margin + pos.pnl;
    setBalances(prev => ({
      ...prev,
      futures: {
        ...prev.futures,
        USDT: Math.max(0, Number(((prev.futures.USDT || 0) + returnAmount).toFixed(2)))
      }
    }));

    setPositions(prev => prev.filter(p => p.id !== positionId));
    playSound(pos.pnl >= 0 ? 'chime' : 'sell');
    if (pos.pnl > 0) confetti({ particleCount: 50, spread: 60 });
    showToast(`Closed ${pos.pair} ${pos.side.toUpperCase()}. Realized PnL: ${pos.pnl >= 0 ? '+' : ''}$${pos.pnl.toFixed(2)}`, pos.pnl >= 0 ? 'success' : 'info');
  }, [positions, playSound, showToast]);

  // Update TP / SL for Futures Position
  const updatePositionTPSL = useCallback((positionId: string, tp?: number, sl?: number) => {
    setPositions(prev => prev.map(p => {
      if (p.id === positionId) {
        return { ...p, tp, sl };
      }
      return p;
    }));
    showToast('TP / SL settings updated successfully.', 'success');
  }, [showToast]);

  // Create Grid Bot
  const createGridBot = useCallback((params: Omit<GridBot, 'id' | 'createdAt' | 'runtime' | 'totalProfit' | 'gridProfit' | 'floatingProfit' | 'arbitrageCount'>): boolean => {
    const spotUSDT = balances.spot.USDT || 0;
    if (spotUSDT < params.investment) {
      showToast(`Insufficient Spot USDT balance ($${spotUSDT}) for investment ($${params.investment})!`, 'error');
      return false;
    }

    setBalances(prev => ({
      ...prev,
      spot: {
        ...prev.spot,
        USDT: Number((prev.spot.USDT - params.investment).toFixed(2))
      }
    }));

    const newBot: GridBot = {
      ...params,
      id: 'bot-' + Math.random().toString(36).substring(7),
      createdAt: Date.now(),
      runtime: '0m',
      totalProfit: 0,
      gridProfit: 0,
      floatingProfit: 0,
      arbitrageCount: 0
    };

    setGridBots(prev => [newBot, ...prev]);
    confetti({ particleCount: 50, spread: 60 });
    playSound('chime');
    showToast(`🤖 ${params.name} initialized and running on live market!`, 'success');
    return true;
  }, [balances.spot.USDT, playSound, showToast]);

  // Toggle Bot Status
  const toggleBotStatus = useCallback((botId: string) => {
    setGridBots(prev => prev.map(b => {
      if (b.id === botId) {
        const nextStatus = b.status === 'running' ? 'paused' : 'running';
        showToast(`Bot ${b.name} is now ${nextStatus.toUpperCase()}`, 'info');
        return { ...b, status: nextStatus };
      }
      return b;
    }));
  }, [showToast]);

  // Stop & Delete Bot
  const stopBot = useCallback((botId: string) => {
    const bot = gridBots.find(b => b.id === botId);
    if (!bot) return;

    const refund = bot.investment + bot.totalProfit;
    setBalances(prev => ({
      ...prev,
      spot: {
        ...prev.spot,
        USDT: Number(((prev.spot.USDT || 0) + refund).toFixed(2))
      }
    }));

    setGridBots(prev => prev.filter(b => b.id !== botId));
    playSound('chime');
    showToast(`Bot ${bot.name} terminated. Refunded $${refund.toFixed(2)} to Spot Wallet.`, 'success');
  }, [gridBots, playSound, showToast]);

  // Stake Asset in Earn
  const stakeAsset = useCallback((productId: string, amount: number): boolean => {
    const product = STAKING_PRODUCTS.find(p => p.id === productId);
    if (!product) return false;

    const available = balances.spot[product.asset] || 0;
    if (available < amount) {
      showToast(`Insufficient ${product.asset} balance in Spot Wallet!`, 'error');
      return false;
    }

    setBalances(prev => ({
      ...prev,
      spot: {
        ...prev.spot,
        [product.asset]: Number((prev.spot[product.asset] - amount).toFixed(6))
      },
      earn: {
        ...prev.earn,
        [product.asset]: Number(((prev.earn[product.asset] || 0) + amount).toFixed(6))
      }
    }));

    const newPosition: StakedUserPosition = {
      id: 'stk-' + Math.random().toString(36).substring(7),
      productId,
      asset: product.asset,
      amount,
      apr: product.apr,
      accruedInterest: 0,
      startDate: Date.now(),
      durationDays: product.durationDays,
      status: 'active'
    };

    setStakedPositions(prev => [newPosition, ...prev]);
    confetti({ particleCount: 40, spread: 50 });
    playSound('chime');
    showToast(`Staked ${amount} ${product.asset} @ ${product.apr}% APR!`, 'success');
    return true;
  }, [balances.spot, playSound, showToast]);

  // Unstake Asset
  const unstakeAsset = useCallback((stakedId: string): boolean => {
    const item = stakedPositions.find(s => s.id === stakedId);
    if (!item || item.status !== 'active') return false;

    const totalReturn = item.amount + item.accruedInterest;

    setBalances(prev => ({
      ...prev,
      earn: {
        ...prev.earn,
        [item.asset]: Math.max(0, Number(((prev.earn[item.asset] || 0) - item.amount).toFixed(6)))
      },
      spot: {
        ...prev.spot,
        [item.asset]: Number(((prev.spot[item.asset] || 0) + totalReturn).toFixed(6))
      }
    }));

    setStakedPositions(prev => prev.map(s => s.id === stakedId ? { ...s, status: 'redeemed' } : s));
    playSound('chime');
    showToast(`Redeemed ${item.amount} ${item.asset} + ${item.accruedInterest.toFixed(6)} interest to Spot Wallet!`, 'success');
    return true;
  }, [stakedPositions, playSound, showToast]);

  // Claim All Staking Interest
  const claimAllEarnInterest = useCallback(() => {
    let claimedCount = 0;
    stakedPositions.forEach(item => {
      if (item.status === 'active' && item.accruedInterest > 0) {
        const yieldAmt = item.accruedInterest;
        setBalances(prev => ({
          ...prev,
          spot: {
            ...prev.spot,
            [item.asset]: Number(((prev.spot[item.asset] || 0) + yieldAmt).toFixed(6))
          }
        }));
        claimedCount++;
      }
    });

    if (claimedCount > 0) {
      setStakedPositions(prev => prev.map(s => ({ ...s, accruedInterest: 0 })));
      confetti({ particleCount: 60, spread: 60 });
      playSound('chime');
      showToast('All accrued staking yields transferred to Spot Wallet!', 'success');
    } else {
      showToast('No accrued interest available to claim.', 'info');
    }
  }, [stakedPositions, playSound, showToast]);

  // Instant Convert / Swap
  const convertAssets = useCallback((fromAsset: string, toAsset: string, fromAmount: number) => {
    if (fromAmount <= 0) return { success: false, receivedAmount: 0 };
    const available = balances.spot[fromAsset] || 0;
    if (available < fromAmount) {
      showToast(`Insufficient ${fromAsset} balance in Spot Wallet!`, 'error');
      return { success: false, receivedAmount: 0 };
    }

    const fromCoin = coins.find(c => c.baseAsset === fromAsset);
    const toCoin = coins.find(c => c.baseAsset === toAsset);

    const fromUSD = fromAsset === 'USDT' || fromAsset === 'USD' ? 1 : fromCoin?.price || 1;
    const toUSD = toAsset === 'USDT' || toAsset === 'USD' ? 1 : toCoin?.price || 1;

    const totalUSD = fromAmount * fromUSD;
    const receivedAmount = Number((totalUSD / toUSD).toFixed(toAsset === 'USDT' ? 2 : 6));

    setBalances(prev => ({
      ...prev,
      spot: {
        ...prev.spot,
        [fromAsset]: Number((prev.spot[fromAsset] - fromAmount).toFixed(6)),
        [toAsset]: Number(((prev.spot[toAsset] || 0) + receivedAmount).toFixed(6))
      }
    }));

    confetti({ particleCount: 50, spread: 55 });
    playSound('chime');
    showToast(`Converted ${fromAmount} ${fromAsset} → ${receivedAmount} ${toAsset} at 0 fees!`, 'success');
    return { success: true, receivedAmount };
  }, [balances.spot, coins, playSound, showToast]);

  // AI Signal Execution with Live History Logging
  const executeAiSignal = useCallback((
    prediction: AiPrediction, 
    executionType: 'spot' | 'futures' = 'futures', 
    amountUSD: number = 1000
  ): boolean => {
    const isBullish = prediction.direction === 'BULLISH' || prediction.signalStrength.includes('BUY');
    const targetCoin = coins.find(c => c.pair === prediction.pair) || selectedCoin;
    
    if (executionType === 'futures') {
      const positionSide: PositionSide = isBullish ? 'long' : 'short';
      const sizeAmount = Number((amountUSD / targetCoin.price).toFixed(4));
      
      const success = openFuturesPosition({
        side: positionSide,
        orderType: 'market',
        amount: sizeAmount,
        leverage: 10,
        marginMode: 'cross',
        tp: prediction.targetPrice,
        sl: prediction.stopLossPrice
      });

      if (success) {
        if (tradingMode === 'demo') {
          setDemoStats(prev => ({
            ...prev,
            totalTrades: prev.totalTrades + 1
          }));
        }

        // Record to verified history
        addSignalToHistory({
          pair: prediction.pair,
          symbol: targetCoin.symbol,
          signalType: isBullish ? 'BUY_LONG' : 'SELL_SHORT',
          entryPrice: targetCoin.price,
          targetPrice1: prediction.targetPrice,
          targetPrice2: prediction.secondaryTargetPrice,
          stopLossPrice: prediction.stopLossPrice,
          status: 'ACTIVE',
          profitPct: 0,
          roiUSD: 0,
          leverage: 10,
          timeHorizon: prediction.timeHorizon,
          confidence: prediction.confidence,
          timestamp: Date.now(),
          rationale: `Live execution: ${prediction.summaryEn.slice(0, 100)}...`
        });

        showToast(`⚡ AI Signal Auto-Executed: 10x ${positionSide.toUpperCase()} on ${prediction.pair}!`, 'success');
      }
      return success;
    } else {
      const spotSide: OrderSide = isBullish ? 'buy' : 'sell';
      const sizeAmount = Number((amountUSD / targetCoin.price).toFixed(4));

      const success = placeSpotOrder({
        type: 'market',
        side: spotSide,
        price: targetCoin.price,
        amount: sizeAmount,
        tp: prediction.targetPrice,
        sl: prediction.stopLossPrice
      });

      if (success) {
        if (tradingMode === 'demo') {
          setDemoStats(prev => ({
            ...prev,
            totalTrades: prev.totalTrades + 1
          }));
        }

        addSignalToHistory({
          pair: prediction.pair,
          symbol: targetCoin.symbol,
          signalType: isBullish ? 'BUY_LONG' : 'SELL_SHORT',
          entryPrice: targetCoin.price,
          targetPrice1: prediction.targetPrice,
          targetPrice2: prediction.secondaryTargetPrice,
          stopLossPrice: prediction.stopLossPrice,
          status: 'ACTIVE',
          profitPct: 0,
          roiUSD: 0,
          leverage: 1,
          timeHorizon: prediction.timeHorizon,
          confidence: prediction.confidence,
          timestamp: Date.now(),
          rationale: `Live Spot execution: ${spotSide.toUpperCase()} ${targetCoin.symbol}`
        });
      }
      return success;
    }
  }, [coins, selectedCoin, openFuturesPosition, placeSpotOrder, tradingMode, addSignalToHistory, showToast]);

  // Quick Direct Buy / Sell Action for any coin
  const executeQuickOrder = useCallback((params: {
    coin?: CryptoCoin;
    side: 'BUY' | 'SELL';
    type: 'spot' | 'futures';
    amountUSD: number;
    leverage?: number;
    tp?: number;
    sl?: number;
  }): boolean => {
    const targetCoin = params.coin || selectedCoin;
    const lev = params.leverage || 10;
    const amount = Number((params.amountUSD / targetCoin.price).toFixed(4));

    if (params.type === 'futures') {
      const positionSide: PositionSide = params.side === 'BUY' ? 'long' : 'short';
      const success = openFuturesPosition({
        side: positionSide,
        orderType: 'market',
        amount,
        leverage: lev,
        marginMode: 'cross',
        tp: params.tp,
        sl: params.sl
      });

      if (success) {
        if (tradingMode === 'demo') {
          setDemoStats(prev => ({
            ...prev,
            totalTrades: prev.totalTrades + 1
          }));
        }

        addSignalToHistory({
          pair: targetCoin.pair,
          symbol: targetCoin.symbol,
          signalType: params.side === 'BUY' ? 'BUY_LONG' : 'SELL_SHORT',
          entryPrice: targetCoin.price,
          targetPrice1: params.tp || (params.side === 'BUY' ? targetCoin.price * 1.05 : targetCoin.price * 0.95),
          targetPrice2: params.tp ? params.tp * 1.03 : (params.side === 'BUY' ? targetCoin.price * 1.08 : targetCoin.price * 0.92),
          stopLossPrice: params.sl || (params.side === 'BUY' ? targetCoin.price * 0.97 : targetCoin.price * 1.03),
          status: 'ACTIVE',
          profitPct: 0,
          roiUSD: 0,
          leverage: lev,
          timeHorizon: '1h',
          confidence: 93.0,
          timestamp: Date.now(),
          rationale: `Manual 1-Click ${lev}x ${positionSide.toUpperCase()} execution on ${targetCoin.pair}`
        });

        showToast(`⚡ ${lev}x ${params.side} order placed on ${targetCoin.pair}! ($${params.amountUSD})`, 'success');
      }
      return success;
    } else {
      const spotSide: OrderSide = params.side === 'BUY' ? 'buy' : 'sell';
      const success = placeSpotOrder({
        type: 'market',
        side: spotSide,
        price: targetCoin.price,
        amount,
        tp: params.tp,
        sl: params.sl
      });

      if (success) {
        if (tradingMode === 'demo') {
          setDemoStats(prev => ({
            ...prev,
            totalTrades: prev.totalTrades + 1
          }));
        }

        addSignalToHistory({
          pair: targetCoin.pair,
          symbol: targetCoin.symbol,
          signalType: params.side === 'BUY' ? 'BUY_LONG' : 'SELL_SHORT',
          entryPrice: targetCoin.price,
          targetPrice1: params.tp || targetCoin.price * 1.05,
          targetPrice2: targetCoin.price * 1.10,
          stopLossPrice: params.sl || targetCoin.price * 0.96,
          status: 'ACTIVE',
          profitPct: 0,
          roiUSD: 0,
          leverage: 1,
          timeHorizon: '24h',
          confidence: 90.0,
          timestamp: Date.now(),
          rationale: `Manual Spot ${spotSide.toUpperCase()} on ${targetCoin.pair}`
        });

        showToast(`Spot ${spotSide.toUpperCase()} executed on ${targetCoin.pair}!`, 'success');
      }
      return success;
    }
  }, [selectedCoin, openFuturesPosition, placeSpotOrder, tradingMode, addSignalToHistory, showToast]);

  // Refresh News Feed simulation
  const refreshNewsFeed = useCallback(() => {
    const dynamicHeadlines = [
      {
        title: `Ethereum Dencun 2.0 Upgrade Testnet Live; L2 Gas Fees Drop 98%`,
        summary: 'Devnet data reveals near-zero rollup fees, accelerating on-chain DEX transaction speed by 14x.',
        category: 'tech_ai' as const,
        sentiment: 'BULLISH' as const,
        sentimentScore: 91,
        relatedCoins: ['ETH']
      },
      {
        title: `US Treasury Selects Bitcoin Blockchain for Immutable Bond Settlement Trial`,
        summary: 'Institutional pilot testing decentralized audit trails with tier-1 global custodian banks.',
        category: 'etf_institutional' as const,
        sentiment: 'BULLISH' as const,
        sentimentScore: 96,
        relatedCoins: ['BTC']
      },
      {
        title: `Solana DEX Volume Breaks New All-Time High at $4.2B in 24 Hours`,
        summary: 'Automated AI market-making algorithms drive massive spot liquidity on Raydium & Orca.',
        category: 'breaking' as const,
        sentiment: 'BULLISH' as const,
        sentimentScore: 89,
        relatedCoins: ['SOL']
      }
    ];

    const randomItem = dynamicHeadlines[Math.floor(Math.random() * dynamicHeadlines.length)];
    const newItem: CryptoNewsItem = {
      id: 'news-' + Date.now(),
      title: randomItem.title,
      summary: randomItem.summary,
      source: 'Trading AI Live Terminal',
      timeAgo: 'Just now',
      timestamp: Date.now(),
      category: randomItem.category,
      impact: 'HIGH',
      sentiment: randomItem.sentiment,
      sentimentScore: randomItem.sentimentScore,
      relatedCoins: randomItem.relatedCoins,
      aiAnalysis: `Breaking live news factored into neural engine. Confidence score updated for ${randomItem.relatedCoins.join(', ')}.`,
      predictionModifier: {
        affectedPair: `${randomItem.relatedCoins[0]}/USDT`,
        bias: 'BULLISH',
        targetImpactPct: 4.2
      }
    };

    setNews(prev => [newItem, ...prev]);
    playSound('chime');
    showToast(`📰 Live Breaking Crypto News Received: "${randomItem.title.substring(0, 45)}..."`, 'info');
  }, [playSound, showToast]);

  const addBreakingNewsAlert = useCallback((title: string, summary: string, sentiment: 'BULLISH' | 'BEARISH' | 'NEUTRAL', coin: string) => {
    const newItem: CryptoNewsItem = {
      id: 'news-user-' + Date.now(),
      title,
      summary,
      source: 'Custom Analyst Wire',
      timeAgo: 'Just now',
      timestamp: Date.now(),
      category: 'breaking',
      impact: 'HIGH',
      sentiment,
      sentimentScore: sentiment === 'BULLISH' ? 85 : sentiment === 'BEARISH' ? -85 : 0,
      relatedCoins: [coin],
      aiAnalysis: `Custom input processed. Dynamic prediction models readjusting entry zones for ${coin}/USDT.`,
      predictionModifier: {
        affectedPair: `${coin}/USDT`,
        bias: sentiment === 'BEARISH' ? 'BEARISH' : 'BULLISH',
        targetImpactPct: sentiment === 'BEARISH' ? -4.5 : 4.5
      }
    };
    setNews(prev => [newItem, ...prev]);
    showToast('News alert injected into AI Prediction engine!', 'success');
  }, [showToast]);

  // Copilot Message Handler
  const sendCopilotMessage = useCallback((text: string) => {
    if (!text.trim()) return;

    const userMsg: AiCopilotMessage = {
      id: 'msg-' + Date.now(),
      sender: 'user',
      text,
      timestamp: Date.now()
    };

    setCopilotMessages(prev => [...prev, userMsg]);

    setTimeout(() => {
      let reply = '';
      const lower = text.toLowerCase();
      const currentCoin = selectedCoin;
      const isBull = currentCoin.change24h >= 0;

      if (lower.includes('buy') || lower.includes('should i') || lower.includes('entry') || lower.includes('signal')) {
        reply = `📊 **AI Analysis for ${currentCoin.pair}**:\n` +
          `• Current Mark Price: **$${currentCoin.price.toLocaleString()}** (${currentCoin.change24h >= 0 ? '+' : ''}${currentCoin.change24h}%)\n` +
          `• Neural Forecast: **${isBull ? 'STRONG BUY (89% Confidence)' : 'HOLD / PULLBACK WATCH'}**\n` +
          `• Recommended Entry: **$${(currentCoin.price * 0.998).toFixed(currentCoin.precision)}**\n` +
          `• Target 1 (TP): **$${(currentCoin.price * 1.045).toFixed(currentCoin.precision)}** (+4.5%)\n` +
          `• Stop Loss (SL): **$${(currentCoin.price * 0.978).toFixed(currentCoin.precision)}** (-2.2%)\n` +
          `• Reason: Order book whale bid pressure is dominant and funding rate is healthy at +0.0100%.`;
      } else if (lower.includes('news') || lower.includes('fed') || lower.includes('etf')) {
        reply = `📰 **Live Market Sentiment Overview**:\n` +
          `• Overall Market Bias: **88% BULLISH (Extreme Institutional Inflow)**\n` +
          `• Key Driver: Recent ETF net subscriptions + FOMC interest rate easing expectations.\n` +
          `• Whale Flow: 14,500 BTC moved to cold storage (Supply shock active).`;
      } else if (lower.includes('demo') || lower.includes('practice') || lower.includes('test')) {
        reply = `🎮 **Demo Paper Trading is Ready!**\n` +
          `You currently have **$100,000 USDT Virtual Balance**. You can practice Spot orders, 125x Futures leverage, or AI Grid Trading Bots with zero financial risk. Switch between Real & Demo anytime at the top bar!`;
      } else {
        reply = `🤖 **Trading AI Strategy Copilot**:\n` +
          `Analyzing multi-timeframe candle structure for **${currentCoin.pair}**...\n` +
          `• RSI(14): **58.4 (Neutral Bullish)**\n` +
          `• MACD: **Bullish Golden Cross active on 1H**\n` +
          `• 24h Predicted Volume: **$${(currentCoin.volume24h / 1e9).toFixed(2)} Billion**\n\n` +
          `Would you like me to auto-execute an AI Signal in **${tradingMode === 'demo' ? 'Demo ($100k)' : 'Real Account'}**?`;
      }

      const aiMsg: AiCopilotMessage = {
        id: 'msg-ai-' + Date.now(),
        sender: 'ai',
        text: reply,
        timestamp: Date.now()
      };

      setCopilotMessages(prev => [...prev, aiMsg]);
      playSound('chime');
    }, 450);
  }, [selectedCoin, tradingMode, playSound]);

  // Whale Alert Injector
  const addWhaleAlert = useCallback((tx: Partial<WhaleTransaction>) => {
    const newTx: WhaleTransaction = {
      id: 'tx-' + Date.now(),
      txHash: `0x${Math.random().toString(16).substring(2, 6)}...${Math.random().toString(16).substring(2, 6)}`,
      coinSymbol: tx.coinSymbol || 'BTC',
      coinName: tx.coinName || 'Bitcoin',
      amount: tx.amount || 2500,
      amountUSD: tx.amountUSD || 230000000,
      fromType: tx.fromType || 'wallet',
      fromLabel: tx.fromLabel || 'Institutional Custody',
      toType: tx.toType || 'exchange',
      toLabel: tx.toLabel || 'Binance Liquidity Pool',
      timestamp: Date.now(),
      alertType: tx.alertType || 'EXCHANGE_INFLOW',
      sentiment: tx.sentiment || 'BEARISH',
      impactDescription: tx.impactDescription || 'High-volume liquidity shift detected on-chain.'
    };
    setWhaleTransactions(prev => [newTx, ...prev]);
    playSound('chime');
    showToast(`🐋 Whale Radar Alert: $${(newTx.amountUSD / 1e6).toFixed(1)}M ${newTx.coinSymbol} moved!`, 'info');
  }, [playSound, showToast]);

  // Master Copy Trading Handlers
  const copyTrader = useCallback((traderId: string, amountUSD: number, maxLeverage = 20, stopLossRatio = 0.15) => {
    const trader = masterTraders.find(t => t.id === traderId);
    if (!trader) {
      showToast('Master trader not found', 'error');
      return false;
    }

    if (balances.spot.USDT < amountUSD) {
      showToast(`Insufficient USDT balance (Available: $${balances.spot.USDT.toFixed(2)} USDT)`, 'error');
      return false;
    }

    // Deduct USDT
    setBalances(b => ({
      ...b,
      spot: {
        ...b.spot,
        USDT: Number((b.spot.USDT - amountUSD).toFixed(2))
      }
    }));

    // Add or update subscription
    const newSub: CopiedTraderSubscription = {
      traderId,
      allocatedAmountUSD: amountUSD,
      maxLeverage,
      stopLossRatio,
      takeProfitRatio: 0.50,
      realizedPnlUSD: 0,
      activeCopiedPositions: Math.floor(Math.random() * 2) + 2,
      subscribedAt: Date.now(),
      mode: tradingMode
    };

    setCopiedSubscriptions(prev => [newSub, ...prev.filter(s => s.traderId !== traderId)]);
    setMasterTraders(prev => prev.map(t => t.id === traderId ? { ...t, followers: t.followers + 1 } : t));

    confetti({ particleCount: 70, spread: 60 });
    playSound('buy');
    showToast(`🚀 Successfully Copied Master Trader @${trader.name} with $${amountUSD.toLocaleString()} USDT!`, 'success');
    return true;
  }, [masterTraders, balances.spot.USDT, setBalances, tradingMode, playSound, showToast]);

  const stopCopyingTrader = useCallback((traderId: string) => {
    const sub = copiedSubscriptions.find(s => s.traderId === traderId);
    if (!sub) return;

    // Refund allocation + random small realized profit
    const simulatedProfit = Number((sub.allocatedAmountUSD * 0.045).toFixed(2));
    const totalReturn = sub.allocatedAmountUSD + simulatedProfit;

    setBalances(b => ({
      ...b,
      spot: {
        ...b.spot,
        USDT: Number((b.spot.USDT + totalReturn).toFixed(2))
      }
    }));

    setCopiedSubscriptions(prev => prev.filter(s => s.traderId !== traderId));
    playSound('chime');
    showToast(`Stopped copying trader. Returned $${totalReturn.toFixed(2)} USDT (+${simulatedProfit} PnL) to Spot wallet.`, 'info');
  }, [copiedSubscriptions, setBalances, playSound, showToast]);

  // Arbitrage Execution Handlers
  const executeArbitrage = useCallback((oppId: string) => {
    const opp = arbitrageOpportunities.find(o => o.id === oppId);
    if (!opp) return false;

    const requiredCapital = 1000;
    if (balances.spot.USDT < requiredCapital) {
      showToast(`Arbitrage requires at least $${requiredCapital} USDT in Spot Wallet.`, 'error');
      return false;
    }

    const profit = Number(opp.netProfitUSD.toFixed(2));

    // Instant flash arbitrage execution
    setBalances(b => ({
      ...b,
      spot: {
        ...b.spot,
        USDT: Number((b.spot.USDT + profit).toFixed(2))
      }
    }));

    confetti({ particleCount: 60, spread: 55 });
    playSound('buy');
    showToast(`⚡ Flash Cross-Exchange Arbitrage executed! Net Profit: +$${profit} USDT (${opp.spreadPct}% spread)`, 'success');
    return true;
  }, [arbitrageOpportunities, balances.spot.USDT, setBalances, playSound, showToast]);

  const executeTriangularArbitrage = useCallback((oppId: string) => {
    const opp = triangularOpportunities.find(o => o.id === oppId);
    if (!opp) return false;

    const profit = Number(opp.netProfitUSD.toFixed(2));

    setBalances(b => ({
      ...b,
      spot: {
        ...b.spot,
        USDT: Number((b.spot.USDT + profit).toFixed(2))
      }
    }));

    confetti({ particleCount: 80, spread: 70 });
    playSound('chime');
    showToast(`🔄 Triangular Route Completed in ${opp.speedMs}ms! Profit: +$${profit} USDT`, 'success');
    return true;
  }, [triangularOpportunities, setBalances, playSound, showToast]);

  // Custom Price Alerts Handlers
  const addPriceAlert = useCallback((symbol: string, targetPrice: number, condition: 'ABOVE' | 'BELOW', note = '') => {
    const newAlert: PriceAlertItem = {
      id: 'alert-' + Date.now(),
      symbol,
      pair: `${symbol}/USDT`,
      targetPrice,
      condition,
      note: note || `Notify when ${symbol} reaches $${targetPrice.toLocaleString()}`,
      soundEnabled: true,
      createdAt: Date.now(),
      triggered: false
    };

    setPriceAlerts(prev => [newAlert, ...prev]);
    playSound('chime');
    showToast(`🔔 Price Alert set: ${symbol} ${condition === 'ABOVE' ? '≥' : '≤'} $${targetPrice.toLocaleString()}`, 'success');
    return true;
  }, [playSound, showToast]);

  const removePriceAlert = useCallback((id: string) => {
    setPriceAlerts(prev => prev.filter(a => a.id !== id));
    showToast('Price alert removed', 'info');
  }, [showToast]);

  const triggerPriceAlertTest = useCallback((id: string) => {
    const alert = priceAlerts.find(a => a.id === id);
    if (!alert) return;
    playSound('chime');
    showToast(`🚨 Trigger Alert: ${alert.pair} hit target price $${alert.targetPrice.toLocaleString()}!`, 'info');
  }, [priceAlerts, playSound, showToast]);

  // Format Helper
  const formatPrice = useCallback((price: number, decimals?: number) => {
    const d = decimals !== undefined ? decimals : price < 0.0001 ? 8 : price < 1 ? 4 : 2;
    return price.toLocaleString('en-US', { minimumFractionDigits: d, maximumFractionDigits: d });
  }, []);

  const formatCurrency = useCallback((amountUSD: number) => {
    const rate = FIAT_RATES[currency] || 1;
    const converted = amountUSD * rate;
    const symbolMap: Record<Currency, string> = {
      USD: '$',
      PKR: '₨ ',
      EUR: '€',
      AED: 'AED ',
      GBP: '£'
    };
    return `${symbolMap[currency]}${converted.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }, [currency]);

  return (
    <CryptoContext.Provider
      value={{
        activeSection,
        setActiveSection,
        selectedCoin,
        setSelectedCoin,
        timeframe,
        setTimeframe,
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

        coins,
        candles,
        orderBook,
        recentTrades,

        balances,
        totalPortfolioUSD,
        unrealizedFuturesPnlUSD,
        transferWallet,
        depositCrypto,
        withdrawCrypto,

        orders,
        tradeHistory,
        placeSpotOrder,
        cancelOrder,

        positions,
        leverage,
        setLeverage,
        marginMode,
        setMarginMode,
        openFuturesPosition,
        closeFuturesPosition,
        updatePositionTPSL,

        predictionHorizon,
        setPredictionHorizon,
        activePrediction,
        executeAiSignal,

        signalHistory,
        addSignalToHistory,
        clearSignalHistory,
        backtestStats,

        executeQuickOrder,

        news,
        refreshNewsFeed,
        addBreakingNewsAlert,

        copilotMessages,
        sendCopilotMessage,

        gridBots,
        createGridBot,
        toggleBotStatus,
        stopBot,

        stakedPositions,
        stakeAsset,
        unstakeAsset,
        claimAllEarnInterest,

        convertAssets,

        // Whale Tracking & Liquidity Radar
        whaleTransactions,
        exchangeFlows,
        addWhaleAlert,

        // Master Copy Trading
        masterTraders,
        copiedSubscriptions,
        copyTrader,
        stopCopyingTrader,

        // Cross-Exchange & Triangular Arbitrage
        arbitrageOpportunities,
        triangularOpportunities,
        executeArbitrage,
        executeTriangularArbitrage,

        // Custom Price Alerts
        priceAlerts,
        addPriceAlert,
        removePriceAlert,
        triggerPriceAlertTest,

        formatPrice,
        formatCurrency,
        toastMessage,
        showToast
      }}
    >
      {children}
    </CryptoContext.Provider>
  );
};

export function useCrypto() {
  const context = useContext(CryptoContext);
  if (!context) {
    throw new Error('useCrypto must be used within a CryptoProvider');
  }
  return context;
}

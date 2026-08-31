export type ViewSection = 
  | 'trade' 
  | 'futures' 
  | 'prediction'
  | 'news'
  | 'markets' 
  | 'bots' 
  | 'copy-trading'
  | 'whale-tracker'
  | 'arbitrage'
  | 'earn' 
  | 'wallet' 
  | 'p2p' 
  | 'convert';

export type TradingMode = 'real' | 'demo';

export type Timeframe = '1s' | '1m' | '5m' | '15m' | '1h' | '4h' | '1D' | '1W';

export type OrderType = 'limit' | 'market' | 'stop_limit' | 'oco';
export type OrderSide = 'buy' | 'sell';
export type PositionSide = 'long' | 'short';
export type MarginMode = 'cross' | 'isolated';
export type Currency = 'USD' | 'PKR' | 'EUR' | 'AED' | 'GBP';
export type Language = 'en' | 'roman-urdu';

export interface CryptoCoin {
  id: string;
  symbol: string;
  name: string;
  pair: string; // e.g. 'BTC/USDT'
  baseAsset: string; // 'BTC'
  quoteAsset: string; // 'USDT'
  price: number;
  change24h: number;
  high24h: number;
  low24h: number;
  volume24h: number;
  marketCap: number;
  fundingRate: number; // e.g. 0.0100 %
  fundingCountdown: string; // e.g. '04:12:35'
  sparkline: number[];
  category: 'hot' | 'gainers' | 'losers' | 'layer1' | 'ai' | 'meme' | 'defi' | 'all';
  precision: number;
  minAmount: number;
  iconBg: string;
  iconColor: string;
}

export interface Candle {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface OrderBookEntry {
  price: number;
  amount: number;
  total: number;
}

export interface RecentTrade {
  id: string;
  price: number;
  amount: number;
  time: string;
  side: 'buy' | 'sell';
}

export interface Order {
  id: string;
  pair: string;
  type: OrderType;
  side: OrderSide;
  price: number;
  amount: number;
  total: number;
  filled: number;
  status: 'open' | 'filled' | 'cancelled';
  createdAt: number;
  isFutures?: boolean;
  leverage?: number;
  takeProfit?: number;
  stopLoss?: number;
}

export interface Position {
  id: string;
  pair: string;
  side: PositionSide;
  entryPrice: number;
  markPrice: number;
  size: number;
  margin: number;
  leverage: number;
  marginMode: MarginMode;
  liquidationPrice: number;
  pnl: number;
  pnlPercentage: number;
  tp?: number;
  sl?: number;
  openedAt: number;
}

export interface GridBot {
  id: string;
  pair: string;
  name: string;
  type: 'spot_grid' | 'futures_grid' | 'dca_martingale' | 'infinity';
  status: 'running' | 'paused' | 'stopped';
  lowerPrice: number;
  upperPrice: number;
  grids: number;
  investment: number;
  totalProfit: number;
  gridProfit: number;
  floatingProfit: number;
  arbitrageCount: number;
  runtime: string;
  createdAt: number;
}

export interface StakingProduct {
  id: string;
  asset: string;
  name: string;
  apr: number; // % e.g. 12.8
  durationDays: number | 'flexible';
  minDeposit: number;
  maxDeposit: number;
  totalStaked: number;
  category: 'simple_earn' | 'launchpool' | 'locked_staking';
  description: string;
}

export interface StakedUserPosition {
  id: string;
  productId: string;
  asset: string;
  amount: number;
  apr: number;
  accruedInterest: number;
  startDate: number;
  durationDays: number | 'flexible';
  status: 'active' | 'redeemed';
}

export interface P2POffer {
  id: string;
  merchantName: string;
  ordersCount: number;
  completionRate: number;
  verified: boolean;
  cryptoType: 'USDT' | 'BTC' | 'ETH' | 'BNB';
  type: 'buy' | 'sell';
  price: number;
  fiatCurrency: string; // 'PKR', 'USD', etc.
  availableCrypto: number;
  minLimit: number;
  maxLimit: number;
  paymentMethods: string[];
  responseTime: string;
}

export interface WalletBalances {
  spot: Record<string, number>; // e.g. { USDT: 14520.50, BTC: 0.45, ETH: 3.2, BNB: 12.0, SOL: 45.0 }
  futures: Record<string, number>; // { USDT: 5000.00 }
  earn: Record<string, number>; // { USDT: 8200.00, BTC: 0.15 }
  funding: Record<string, number>; // { USDT: 1200.00 }
}

export interface TechnicalIndicator {
  name: 'MA' | 'EMA' | 'BOLL' | 'RSI' | 'MACD' | 'VOL';
  enabled: boolean;
  params: number[];
  color?: string;
}

export interface AiPrediction {
  id: string;
  pair: string;
  symbol: string;
  timeHorizon: '15m' | '1h' | '4h' | '24h' | '7d';
  direction: 'BULLISH' | 'BEARISH' | 'NEUTRAL';
  confidence: number; // e.g. 92.4
  currentPrice: number;
  targetPrice: number;
  secondaryTargetPrice: number;
  stopLossPrice: number;
  expectedChangePct: number;
  signalStrength: 'STRONG BUY' | 'BUY' | 'NEUTRAL' | 'SELL' | 'STRONG SELL';
  winProbability: number; // e.g. 87.5%
  riskRewardRatio: string; // e.g. "1:3.4"
  technicalFactors: {
    rsi: number;
    rsiSignal: 'Oversold (Bullish)' | 'Overbought (Bearish)' | 'Neutral Momentum';
    macdSignal: 'Bullish Golden Cross' | 'Bearish Death Cross' | 'Consolidating';
    emaTrend: 'Strong Uptrend (Above 200 EMA)' | 'Downtrend (Below 200 EMA)' | 'Neutral Ribbon';
    whalePressure: string; // "74% Whale Bid Dominance"
    orderBookRatio: number; // e.g. 1.85 (Bids/Asks)
    volatilityIndex: 'High Volatility' | 'Compression Breakout' | 'Normal';
    liquidationCluster: string; // "$84.2M Shorts at Risk at $91.5k"
    supportLevel: number;
    resistanceLevel: number;
    newsImpactScore: number; // +8.5 or -4.2
  };
  summaryUrdu?: string;
  summaryEn: string;
  recommendedAction: string;
  generatedAt: number;
}

export interface CryptoNewsItem {
  id: string;
  title: string;
  summary: string;
  source: string;
  sourceIcon?: string;
  timeAgo: string;
  timestamp: number;
  category: 'breaking' | 'fed_macro' | 'etf_institutional' | 'whale_alert' | 'regulation' | 'tech_ai';
  impact: 'HIGH' | 'MEDIUM' | 'LOW';
  sentiment: 'BULLISH' | 'BEARISH' | 'NEUTRAL';
  sentimentScore: number; // -100 to +100
  relatedCoins: string[]; // e.g. ['BTC', 'ETH', 'SOL']
  aiAnalysis: string;
  predictionModifier: {
    affectedPair: string;
    bias: 'BULLISH' | 'BEARISH';
    targetImpactPct: number;
  };
  url?: string;
}

export interface AiCopilotMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: number;
  tradeSuggestion?: {
    pair: string;
    action: 'BUY' | 'SELL';
    price: number;
    leverage?: number;
    tp: number;
    sl: number;
    confidence: number;
  };
}

export interface AiSignalHistoryItem {
  id: string;
  pair: string;
  symbol: string;
  signalType: 'BUY_LONG' | 'SELL_SHORT';
  entryPrice: number;
  targetPrice1: number;
  targetPrice2: number;
  stopLossPrice: number;
  closedPrice: number;
  status: 'TARGET_1_HIT' | 'TARGET_2_HIT' | 'STOP_LOSS_HIT' | 'ACTIVE';
  profitPct: number;
  roiUSD: number;
  leverage: number;
  timeHorizon: '15m' | '1h' | '4h' | '24h' | '7d';
  confidence: number;
  timestamp: number;
  closedAt?: number;
  verificationHash: string;
  rationale: string;
}

export interface SignalBacktestStats {
  totalSignals: number;
  winCount: number;
  lossCount: number;
  winRate: number;
  avgProfitPct: number;
  totalPnlUSD: number;
  profitFactor: number;
  maxConsecutiveWins: number;
  sharpeRatio: number;
}

// Whale Tracking & Liquidity Radar
export interface WhaleTransaction {
  id: string;
  txHash: string;
  coinSymbol: string;
  coinName: string;
  amount: number;
  amountUSD: number;
  fromType: 'wallet' | 'exchange' | 'mining_pool';
  fromLabel: string;
  toType: 'wallet' | 'exchange' | 'smart_contract';
  toLabel: string;
  timestamp: number;
  alertType: 'TRANSFER' | 'BUY_WALL' | 'SELL_WALL' | 'LIQUIDATION' | 'EXCHANGE_INFLOW' | 'EXCHANGE_OUTFLOW';
  sentiment: 'BULLISH' | 'BEARISH' | 'NEUTRAL';
  impactDescription: string;
}

export interface ExchangeFlowStat {
  exchange: string;
  netInflowBTC: number;
  netInflowUSD: number;
  dominantTrend: 'INFLOW_BEARISH' | 'OUTFLOW_BULLISH' | 'BALANCED';
  reservesUSD: number;
}

// Copy Trading & Master Traders
export interface MasterTrader {
  id: string;
  name: string;
  avatar: string;
  badge: 'ELITE' | 'MASTER' | 'AI_QUANT' | 'PRO';
  roi30d: number;
  winRate: number;
  pnlTotalUSD: number;
  maxDrawdown: number;
  followers: number;
  maxFollowers: number;
  profitSharePct: number;
  aumUSD: number;
  tradingStyle: 'Scalping' | 'Swing' | 'Trend Following' | 'AI Multi-Grid';
  favoritePairs: string[];
  recentTrades: {
    pair: string;
    side: 'LONG' | 'SHORT';
    leverage: number;
    roi: number;
    pnlUSD: number;
    time: string;
  }[];
}

export interface CopiedTraderSubscription {
  traderId: string;
  allocatedAmountUSD: number;
  maxLeverage: number;
  stopLossRatio: number;
  takeProfitRatio: number;
  realizedPnlUSD: number;
  activeCopiedPositions: number;
  subscribedAt: number;
  mode: 'real' | 'demo';
}

// Cross-Exchange Arbitrage & Triangular
export interface ArbitrageOpportunity {
  id: string;
  pair: string;
  symbol: string;
  buyExchange: string;
  buyPrice: number;
  sellExchange: string;
  sellPrice: number;
  spreadPct: number;
  estimatedFeePct: number;
  netProfitPct: number;
  netProfitUSD: number;
  liquidityUSD: number;
  executionRisk: 'LOW' | 'MEDIUM' | 'HIGH';
  status: 'ACTIVE' | 'EXECUTING' | 'COMPLETED';
}

export interface TriangularArbitrageOpportunity {
  id: string;
  route: string; // e.g. "USDT -> BTC -> ETH -> USDT"
  steps: string[];
  startingAmount: number;
  estimatedReturn: number;
  netProfitPct: number;
  netProfitUSD: number;
  speedMs: number;
}

// Custom Price Alerts
export interface PriceAlertItem {
  id: string;
  symbol: string;
  pair: string;
  targetPrice: number;
  condition: 'ABOVE' | 'BELOW';
  note: string;
  soundEnabled: boolean;
  createdAt: number;
  triggered: boolean;
  triggeredAt?: number;
}



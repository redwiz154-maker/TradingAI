import { MasterTrader, CopiedTraderSubscription } from '../types';

export const initialMasterTraders: MasterTrader[] = [
  {
    id: 'trader-01',
    name: 'Satoshi_Quant_AI',
    avatar: '🤖',
    badge: 'AI_QUANT',
    roi30d: 482.6,
    winRate: 94.8,
    pnlTotalUSD: 1845200,
    maxDrawdown: 3.2,
    followers: 1842,
    maxFollowers: 2000,
    profitSharePct: 10,
    aumUSD: 8450000,
    tradingStyle: 'AI Multi-Grid',
    favoritePairs: ['BTC/USDT', 'ETH/USDT', 'SOL/USDT'],
    recentTrades: [
      { pair: 'BTC/USDT', side: 'LONG', leverage: 20, roi: 64.2, pnlUSD: 12840, time: '14m ago' },
      { pair: 'SOL/USDT', side: 'LONG', leverage: 15, roi: 88.5, pnlUSD: 9450, time: '1h ago' },
      { pair: 'ETH/USDT', side: 'SHORT', leverage: 10, roi: 32.0, pnlUSD: 4800, time: '3h ago' }
    ]
  },
  {
    id: 'trader-02',
    name: 'WhaleHunter_Pro',
    avatar: '🐋',
    badge: 'ELITE',
    roi30d: 341.2,
    winRate: 91.2,
    pnlTotalUSD: 1240800,
    maxDrawdown: 4.8,
    followers: 1420,
    maxFollowers: 1500,
    profitSharePct: 12,
    aumUSD: 6200000,
    tradingStyle: 'Trend Following',
    favoritePairs: ['BTC/USDT', 'BNB/USDT', 'AVAX/USDT'],
    recentTrades: [
      { pair: 'BTC/USDT', side: 'LONG', leverage: 25, roi: 112.4, pnlUSD: 24500, time: '32m ago' },
      { pair: 'BNB/USDT', side: 'LONG', leverage: 10, roi: 45.2, pnlUSD: 7600, time: '4h ago' }
    ]
  },
  {
    id: 'trader-03',
    name: 'AlphaScalp_Matrix',
    avatar: '⚡',
    badge: 'MASTER',
    roi30d: 268.4,
    winRate: 88.6,
    pnlTotalUSD: 895400,
    maxDrawdown: 2.9,
    followers: 980,
    maxFollowers: 1000,
    profitSharePct: 8,
    aumUSD: 4100000,
    tradingStyle: 'Scalping',
    favoritePairs: ['SOL/USDT', 'DOGE/USDT', 'NEAR/USDT'],
    recentTrades: [
      { pair: 'SOL/USDT', side: 'LONG', leverage: 50, roi: 145.0, pnlUSD: 14500, time: '5m ago' },
      { pair: 'DOGE/USDT', side: 'LONG', leverage: 20, roi: 48.0, pnlUSD: 3800, time: '45m ago' }
    ]
  },
  {
    id: 'trader-04',
    name: 'Macro_CryptoQueen',
    avatar: '👑',
    badge: 'ELITE',
    roi30d: 215.8,
    winRate: 92.4,
    pnlTotalUSD: 1450000,
    maxDrawdown: 3.8,
    followers: 1250,
    maxFollowers: 1500,
    profitSharePct: 10,
    aumUSD: 7800000,
    tradingStyle: 'Swing',
    favoritePairs: ['BTC/USDT', 'ETH/USDT', 'LINK/USDT'],
    recentTrades: [
      { pair: 'LINK/USDT', side: 'LONG', leverage: 10, roi: 72.5, pnlUSD: 8900, time: '2h ago' },
      { pair: 'ETH/USDT', side: 'LONG', leverage: 15, roi: 54.0, pnlUSD: 11200, time: '6h ago' }
    ]
  },
  {
    id: 'trader-05',
    name: 'DeepNeural_GridBot',
    avatar: '🧠',
    badge: 'AI_QUANT',
    roi30d: 198.5,
    winRate: 96.2,
    pnlTotalUSD: 640000,
    maxDrawdown: 1.8,
    followers: 1950,
    maxFollowers: 2000,
    profitSharePct: 5,
    aumUSD: 9100000,
    tradingStyle: 'AI Multi-Grid',
    favoritePairs: ['BTC/USDT', 'SOL/USDT', 'XRP/USDT', 'ADA/USDT'],
    recentTrades: [
      { pair: 'BTC/USDT', side: 'LONG', leverage: 5, roi: 18.2, pnlUSD: 3400, time: '12m ago' },
      { pair: 'XRP/USDT', side: 'LONG', leverage: 8, roi: 24.5, pnlUSD: 2900, time: '1h ago' }
    ]
  }
];

export const initialCopiedSubscriptions: CopiedTraderSubscription[] = [
  {
    traderId: 'trader-01',
    allocatedAmountUSD: 2000,
    maxLeverage: 20,
    stopLossRatio: 0.15,
    takeProfitRatio: 0.50,
    realizedPnlUSD: 486.50,
    activeCopiedPositions: 3,
    subscribedAt: Date.now() - 1000 * 60 * 60 * 48,
    mode: 'demo'
  }
];

import { CryptoCoin, StakingProduct, P2POffer, Candle } from '../types';

export const INITIAL_COINS: CryptoCoin[] = [
  {
    id: 'bitcoin',
    symbol: 'BTC',
    name: 'Bitcoin',
    pair: 'BTC/USDT',
    baseAsset: 'BTC',
    quoteAsset: 'USDT',
    price: 88450.20,
    change24h: 3.84,
    high24h: 89620.00,
    low24h: 84910.50,
    volume24h: 42180450200,
    marketCap: 1742000000000,
    fundingRate: 0.0100,
    fundingCountdown: '03:42:15',
    sparkline: [84910, 85200, 86100, 85800, 87200, 88100, 87600, 88450],
    category: 'hot',
    precision: 2,
    minAmount: 0.0001,
    iconBg: 'bg-amber-500/10 text-amber-500',
    iconColor: '#F7931A'
  },
  {
    id: 'ethereum',
    symbol: 'ETH',
    name: 'Ethereum',
    pair: 'ETH/USDT',
    baseAsset: 'ETH',
    quoteAsset: 'USDT',
    price: 3280.45,
    change24h: 5.12,
    high24h: 3340.00,
    low24h: 3110.20,
    volume24h: 18450200100,
    marketCap: 395000000000,
    fundingRate: 0.0085,
    fundingCountdown: '03:42:15',
    sparkline: [3110, 3150, 3210, 3190, 3240, 3260, 3280],
    category: 'layer1',
    precision: 2,
    minAmount: 0.001,
    iconBg: 'bg-blue-500/10 text-blue-500',
    iconColor: '#627EEA'
  },
  {
    id: 'binance-coin',
    symbol: 'BNB',
    name: 'BNB',
    pair: 'BNB/USDT',
    baseAsset: 'BNB',
    quoteAsset: 'USDT',
    price: 642.80,
    change24h: 2.45,
    high24h: 654.00,
    low24h: 625.10,
    volume24h: 1950000000,
    marketCap: 94000000000,
    fundingRate: 0.0050,
    fundingCountdown: '03:42:15',
    sparkline: [625, 630, 638, 635, 640, 642.8],
    category: 'hot',
    precision: 2,
    minAmount: 0.01,
    iconBg: 'bg-yellow-500/10 text-yellow-500',
    iconColor: '#F3BA2F'
  },
  {
    id: 'solana',
    symbol: 'SOL',
    name: 'Solana',
    pair: 'SOL/USDT',
    baseAsset: 'SOL',
    quoteAsset: 'USDT',
    price: 194.65,
    change24h: 8.94,
    high24h: 198.50,
    low24h: 177.20,
    volume24h: 7850000000,
    marketCap: 91000000000,
    fundingRate: 0.0125,
    fundingCountdown: '03:42:15',
    sparkline: [177, 181, 186, 184, 191, 194.65],
    category: 'layer1',
    precision: 2,
    minAmount: 0.05,
    iconBg: 'bg-purple-500/10 text-purple-500',
    iconColor: '#14F195'
  },
  {
    id: 'ripple',
    symbol: 'XRP',
    name: 'XRP',
    pair: 'XRP/USDT',
    baseAsset: 'XRP',
    quoteAsset: 'USDT',
    price: 2.3420,
    change24h: 14.85,
    high24h: 2.4800,
    low24h: 1.9800,
    volume24h: 12400000000,
    marketCap: 133000000000,
    fundingRate: 0.0150,
    fundingCountdown: '03:42:15',
    sparkline: [1.98, 2.05, 2.15, 2.22, 2.34],
    category: 'gainers',
    precision: 4,
    minAmount: 1,
    iconBg: 'bg-slate-500/10 text-slate-500',
    iconColor: '#23292F'
  },
  {
    id: 'dogecoin',
    symbol: 'DOGE',
    name: 'Dogecoin',
    pair: 'DOGE/USDT',
    baseAsset: 'DOGE',
    quoteAsset: 'USDT',
    price: 0.2845,
    change24h: -2.15,
    high24h: 0.3010,
    low24h: 0.2780,
    volume24h: 3100000000,
    marketCap: 41000000000,
    fundingRate: -0.0020,
    fundingCountdown: '03:42:15',
    sparkline: [0.295, 0.301, 0.288, 0.282, 0.2845],
    category: 'meme',
    precision: 4,
    minAmount: 10,
    iconBg: 'bg-amber-400/10 text-amber-400',
    iconColor: '#C2A633'
  },
  {
    id: 'artificial-superintelligence-alliance',
    symbol: 'FET',
    name: 'Artificial Superintelligence',
    pair: 'FET/USDT',
    baseAsset: 'FET',
    quoteAsset: 'USDT',
    price: 1.482,
    change24h: 18.20,
    high24h: 1.540,
    low24h: 1.220,
    volume24h: 890000000,
    marketCap: 3800000000,
    fundingRate: 0.0180,
    fundingCountdown: '03:42:15',
    sparkline: [1.22, 1.28, 1.35, 1.42, 1.482],
    category: 'ai',
    precision: 3,
    minAmount: 5,
    iconBg: 'bg-cyan-500/10 text-cyan-500',
    iconColor: '#00C8FF'
  },
  {
    id: 'pepe',
    symbol: 'PEPE',
    name: 'Pepe',
    pair: 'PEPE/USDT',
    baseAsset: 'PEPE',
    quoteAsset: 'USDT',
    price: 0.00001842,
    change24h: 9.60,
    high24h: 0.00001920,
    low24h: 0.00001650,
    volume24h: 2150000000,
    marketCap: 7700000000,
    fundingRate: 0.0100,
    fundingCountdown: '03:42:15',
    sparkline: [0.0000165, 0.0000172, 0.0000179, 0.00001842],
    category: 'meme',
    precision: 8,
    minAmount: 100000,
    iconBg: 'bg-emerald-500/10 text-emerald-500',
    iconColor: '#439B48'
  },
  {
    id: 'sui',
    symbol: 'SUI',
    name: 'Sui',
    pair: 'SUI/USDT',
    baseAsset: 'SUI',
    quoteAsset: 'USDT',
    price: 3.1240,
    change24h: 7.40,
    high24h: 3.2500,
    low24h: 2.8800,
    volume24h: 1650000000,
    marketCap: 8900000000,
    fundingRate: 0.0090,
    fundingCountdown: '03:42:15',
    sparkline: [2.88, 2.95, 3.05, 3.124],
    category: 'layer1',
    precision: 4,
    minAmount: 1,
    iconBg: 'bg-sky-500/10 text-sky-500',
    iconColor: '#2A82E4'
  },
  {
    id: 'avalanche-2',
    symbol: 'AVAX',
    name: 'Avalanche',
    pair: 'AVAX/USDT',
    baseAsset: 'AVAX',
    quoteAsset: 'USDT',
    price: 34.80,
    change24h: -1.80,
    high24h: 36.20,
    low24h: 34.10,
    volume24h: 780000000,
    marketCap: 14200000000,
    fundingRate: 0.0030,
    fundingCountdown: '03:42:15',
    sparkline: [35.9, 36.2, 35.1, 34.8],
    category: 'layer1',
    precision: 2,
    minAmount: 0.1,
    iconBg: 'bg-red-500/10 text-red-500',
    iconColor: '#E84142'
  },
  {
    id: 'near',
    symbol: 'NEAR',
    name: 'NEAR Protocol',
    pair: 'NEAR/USDT',
    baseAsset: 'NEAR',
    quoteAsset: 'USDT',
    price: 6.42,
    change24h: 11.20,
    high24h: 6.65,
    low24h: 5.75,
    volume24h: 620000000,
    marketCap: 7800000000,
    fundingRate: 0.0110,
    fundingCountdown: '03:42:15',
    sparkline: [5.75, 5.95, 6.15, 6.30, 6.42],
    category: 'ai',
    precision: 2,
    minAmount: 1,
    iconBg: 'bg-slate-700/10 text-slate-700',
    iconColor: '#000000'
  },
  {
    id: 'cardano',
    symbol: 'ADA',
    name: 'Cardano',
    pair: 'ADA/USDT',
    baseAsset: 'ADA',
    quoteAsset: 'USDT',
    price: 0.7850,
    change24h: -3.40,
    high24h: 0.8250,
    low24h: 0.7720,
    volume24h: 920000000,
    marketCap: 28000000000,
    fundingRate: 0.0010,
    fundingCountdown: '03:42:15',
    sparkline: [0.815, 0.825, 0.795, 0.785],
    category: 'losers',
    precision: 4,
    minAmount: 5,
    iconBg: 'bg-blue-600/10 text-blue-600',
    iconColor: '#0033AD'
  }
];

// Generate authentic historical Candlestick data for any coin and timeframe
export function generateCandleHistory(basePrice: number, count: number = 80): Candle[] {
  const candles: Candle[] = [];
  const now = Date.now();
  const intervalMs = 60 * 1000; // 1 min steps
  let currentPrice = basePrice * 0.94; // start slightly lower for 24h trend

  for (let i = count; i >= 0; i--) {
    const time = now - i * intervalMs;
    const volatility = currentPrice * 0.004; // 0.4% noise
    const delta = (Math.random() - 0.48) * volatility;
    const open = currentPrice;
    const close = Math.max(open * 0.1, open + delta);
    const high = Math.max(open, close) + Math.random() * volatility * 0.8;
    const low = Math.min(open, close) - Math.random() * volatility * 0.8;
    const volume = (Math.random() * 50 + 10) * (basePrice > 1000 ? 0.5 : 50);

    candles.push({
      time,
      open: Number(open.toFixed(basePrice < 1 ? 6 : 2)),
      high: Number(high.toFixed(basePrice < 1 ? 6 : 2)),
      low: Number(low.toFixed(basePrice < 1 ? 6 : 2)),
      close: Number(close.toFixed(basePrice < 1 ? 6 : 2)),
      volume: Number(volume.toFixed(2))
    });

    currentPrice = close;
  }

  // Ensure last close matches current basePrice
  if (candles.length > 0) {
    candles[candles.length - 1].close = basePrice;
    candles[candles.length - 1].high = Math.max(candles[candles.length - 1].high, basePrice);
    candles[candles.length - 1].low = Math.min(candles[candles.length - 1].low, basePrice);
  }

  return candles;
}

export const STAKING_PRODUCTS: StakingProduct[] = [
  {
    id: 'usdt-flex',
    asset: 'USDT',
    name: 'Tether Flexible Earn',
    apr: 12.8,
    durationDays: 'flexible',
    minDeposit: 10,
    maxDeposit: 1000000,
    totalStaked: 184500000,
    category: 'simple_earn',
    description: 'Earn real-time compound interest paid every single second. Withdraw anytime instantly.'
  },
  {
    id: 'btc-flex',
    asset: 'BTC',
    name: 'Bitcoin Yield Saver',
    apr: 4.5,
    durationDays: 'flexible',
    minDeposit: 0.001,
    maxDeposit: 50,
    totalStaked: 12450,
    category: 'simple_earn',
    description: 'Grow your BTC holding with automated daily distribution into Spot Wallet.'
  },
  {
    id: 'bnb-locked-60',
    asset: 'BNB',
    name: 'BNB Vault & Launchpool',
    apr: 19.4,
    durationDays: 60,
    minDeposit: 0.1,
    maxDeposit: 5000,
    totalStaked: 890000,
    category: 'launchpool',
    description: 'Dual reward system: Earn high BNB staking yield + receive automatic Launchpool new token drops!'
  },
  {
    id: 'sol-locked-30',
    asset: 'SOL',
    name: 'Solana Validator Staking',
    apr: 10.2,
    durationDays: 30,
    minDeposit: 0.5,
    maxDeposit: 20000,
    totalStaked: 450000,
    category: 'locked_staking',
    description: 'Direct on-chain validator delegation with institutional grade slashing protection.'
  },
  {
    id: 'eth-flex',
    asset: 'ETH',
    name: 'Ethereum Liquid Staking',
    apr: 5.8,
    durationDays: 'flexible',
    minDeposit: 0.01,
    maxDeposit: 500,
    totalStaked: 78000,
    category: 'simple_earn',
    description: 'Receive wrapped WBETH with daily automatic staking yield re-investment.'
  }
];

export const P2P_OFFERS: P2POffer[] = [
  {
    id: 'p2p-1',
    merchantName: 'CryptoKing_Express (VIP)',
    ordersCount: 4280,
    completionRate: 99.8,
    verified: true,
    cryptoType: 'USDT',
    type: 'sell', // User buys from merchant
    price: 284.50,
    fiatCurrency: 'PKR',
    availableCrypto: 15420.00,
    minLimit: 5000,
    maxLimit: 1000000,
    paymentMethods: ['Bank Transfer', 'JazzCash', 'EasyPaisa', 'Raast'],
    responseTime: '1 min'
  },
  {
    id: 'p2p-2',
    merchantName: 'FastPay_Global',
    ordersCount: 1920,
    completionRate: 98.6,
    verified: true,
    cryptoType: 'USDT',
    type: 'sell',
    price: 284.85,
    fiatCurrency: 'PKR',
    availableCrypto: 8200.00,
    minLimit: 2000,
    maxLimit: 500000,
    paymentMethods: ['Nayapay', 'Sadapay', 'Meezan Bank'],
    responseTime: '2 mins'
  },
  {
    id: 'p2p-3',
    merchantName: 'AlphaTrader_USD',
    ordersCount: 3100,
    completionRate: 99.5,
    verified: true,
    cryptoType: 'USDT',
    type: 'sell',
    price: 1.002,
    fiatCurrency: 'USD',
    availableCrypto: 50000.00,
    minLimit: 100,
    maxLimit: 20000,
    paymentMethods: ['Wise', 'Bank Wire', 'Zelle', 'Revolut'],
    responseTime: '3 mins'
  },
  {
    id: 'p2p-4',
    merchantName: 'CashPro_Merchant',
    ordersCount: 890,
    completionRate: 99.1,
    verified: true,
    cryptoType: 'USDT',
    type: 'buy', // User sells to merchant
    price: 283.90,
    fiatCurrency: 'PKR',
    availableCrypto: 25000.00,
    minLimit: 10000,
    maxLimit: 1500000,
    paymentMethods: ['Bank Transfer', 'Raast', 'EasyPaisa'],
    responseTime: '1 min'
  },
  {
    id: 'p2p-5',
    merchantName: 'BinanceOTC_Direct',
    ordersCount: 8450,
    completionRate: 100.0,
    verified: true,
    cryptoType: 'BTC',
    type: 'sell',
    price: 25200000,
    fiatCurrency: 'PKR',
    availableCrypto: 4.85,
    minLimit: 50000,
    maxLimit: 5000000,
    paymentMethods: ['Bank Transfer', 'Meezan Bank', 'Faysal Bank'],
    responseTime: 'instant'
  }
];

export const FIAT_RATES: Record<string, number> = {
  USD: 1,
  USDT: 1,
  PKR: 284.50,
  EUR: 0.95,
  AED: 3.67,
  GBP: 0.81
};

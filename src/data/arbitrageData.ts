import { ArbitrageOpportunity, TriangularArbitrageOpportunity } from '../types';

export const initialArbitrageOpportunities: ArbitrageOpportunity[] = [
  {
    id: 'arb-01',
    pair: 'SOL/USDT',
    symbol: 'SOL',
    buyExchange: 'Binance Spot',
    buyPrice: 184.20,
    sellExchange: 'Coinbase Pro',
    sellPrice: 186.95,
    spreadPct: 1.49,
    estimatedFeePct: 0.18,
    netProfitPct: 1.31,
    netProfitUSD: 131.00,
    liquidityUSD: 1450000,
    executionRisk: 'LOW',
    status: 'ACTIVE'
  },
  {
    id: 'arb-02',
    pair: 'XRP/USDT',
    symbol: 'XRP',
    buyExchange: 'OKX',
    buyPrice: 0.6120,
    sellExchange: 'Upbit Korea',
    sellPrice: 0.6285,
    spreadPct: 2.70,
    estimatedFeePct: 0.22,
    netProfitPct: 2.48,
    netProfitUSD: 248.00,
    liquidityUSD: 890000,
    executionRisk: 'LOW',
    status: 'ACTIVE'
  },
  {
    id: 'arb-03',
    pair: 'BTC/USDT',
    symbol: 'BTC',
    buyExchange: 'Kraken',
    buyPrice: 91450.00,
    sellExchange: 'Binance Futures',
    sellPrice: 92120.00,
    spreadPct: 0.73,
    estimatedFeePct: 0.08,
    netProfitPct: 0.65,
    netProfitUSD: 65.00,
    liquidityUSD: 12500000,
    executionRisk: 'LOW',
    status: 'ACTIVE'
  },
  {
    id: 'arb-04',
    pair: 'DOGE/USDT',
    symbol: 'DOGE',
    buyExchange: 'Bybit',
    buyPrice: 0.1840,
    sellExchange: 'Gate.io',
    sellPrice: 0.1895,
    spreadPct: 2.99,
    estimatedFeePct: 0.25,
    netProfitPct: 2.74,
    netProfitUSD: 274.00,
    liquidityUSD: 420000,
    executionRisk: 'MEDIUM',
    status: 'ACTIVE'
  },
  {
    id: 'arb-05',
    pair: 'ETH/USDT',
    symbol: 'ETH',
    buyExchange: 'Binance Spot',
    buyPrice: 3420.50,
    sellExchange: 'Bitfinex',
    sellPrice: 3458.20,
    spreadPct: 1.10,
    estimatedFeePct: 0.15,
    netProfitPct: 0.95,
    netProfitUSD: 95.00,
    liquidityUSD: 4800000,
    executionRisk: 'LOW',
    status: 'ACTIVE'
  }
];

export const initialTriangularOpportunities: TriangularArbitrageOpportunity[] = [
  {
    id: 'tri-01',
    route: 'USDT ➔ BTC ➔ ETH ➔ USDT',
    steps: [
      'Buy BTC with USDT @ $91,620',
      'Swap BTC to ETH @ 0.0373 BTC/ETH',
      'Sell ETH for USDT @ $3,450'
    ],
    startingAmount: 10000,
    estimatedReturn: 10084,
    netProfitPct: 0.84,
    netProfitUSD: 84.00,
    speedMs: 420
  },
  {
    id: 'tri-02',
    route: 'USDT ➔ SOL ➔ BNB ➔ USDT',
    steps: [
      'Buy SOL with USDT @ $184.20',
      'Swap SOL to BNB @ 0.288 SOL/BNB',
      'Sell BNB for USDT @ $642.00'
    ],
    startingAmount: 5000,
    estimatedReturn: 5062.50,
    netProfitPct: 1.25,
    netProfitUSD: 62.50,
    speedMs: 380
  },
  {
    id: 'tri-03',
    route: 'USDT ➔ XRP ➔ BTC ➔ USDT',
    steps: [
      'Buy XRP with USDT @ $0.618',
      'Swap XRP to BTC @ 0.00000674',
      'Sell BTC for USDT @ $91,850'
    ],
    startingAmount: 2500,
    estimatedReturn: 2528.75,
    netProfitPct: 1.15,
    netProfitUSD: 28.75,
    speedMs: 510
  }
];

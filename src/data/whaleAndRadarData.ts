import { WhaleTransaction, ExchangeFlowStat } from '../types';

export const initialWhaleTransactions: WhaleTransaction[] = [
  {
    id: 'tx-whale-01',
    txHash: '0x8f3c...9a41',
    coinSymbol: 'BTC',
    coinName: 'Bitcoin',
    amount: 14250,
    amountUSD: 1308150000,
    fromType: 'wallet',
    fromLabel: 'Whale Cold Storage 17aX',
    toType: 'exchange',
    toLabel: 'Binance Hot Wallet #4',
    timestamp: Date.now() - 1000 * 60 * 4,
    alertType: 'EXCHANGE_INFLOW',
    sentiment: 'BEARISH',
    impactDescription: 'Huge institutional deposit into Binance. Possible spot sell pressure or derivatives hedging.'
  },
  {
    id: 'tx-whale-02',
    txHash: '0x3d7b...5e12',
    coinSymbol: 'ETH',
    coinName: 'Ethereum',
    amount: 185000,
    amountUSD: 638250000,
    fromType: 'exchange',
    fromLabel: 'Coinbase Pro Prime',
    toType: 'wallet',
    toLabel: 'BlackRock Custody Safe',
    timestamp: Date.now() - 1000 * 60 * 12,
    alertType: 'EXCHANGE_OUTFLOW',
    sentiment: 'BULLISH',
    impactDescription: 'Massive ETF custodian withdrawal into cold storage. Supply squeeze accelerating.'
  },
  {
    id: 'tx-whale-03',
    txHash: '0xaa91...2c84',
    coinSymbol: 'SOL',
    coinName: 'Solana',
    amount: 450000,
    amountUSD: 85500000,
    fromType: 'wallet',
    fromLabel: 'Multicoin Capital Staking',
    toType: 'smart_contract',
    toLabel: 'Marinade Liquid Staking',
    timestamp: Date.now() - 1000 * 60 * 25,
    alertType: 'TRANSFER',
    sentiment: 'BULLISH',
    impactDescription: 'Long-term staking lockup removed from active circulating exchange liquidity.'
  },
  {
    id: 'tx-whale-04',
    txHash: '0x12bb...88fc',
    coinSymbol: 'USDT',
    coinName: 'Tether USD',
    amount: 500000000,
    amountUSD: 500000000,
    fromType: 'mining_pool',
    fromLabel: 'Tether Treasury',
    toType: 'exchange',
    toLabel: 'Binance Futures Vault',
    timestamp: Date.now() - 1000 * 60 * 48,
    alertType: 'EXCHANGE_INFLOW',
    sentiment: 'BULLISH',
    impactDescription: '$500 Million fresh liquidity minted and injected for aggressive market buying.'
  },
  {
    id: 'tx-whale-05',
    txHash: '0x55aa...33de',
    coinSymbol: 'BNB',
    coinName: 'BNB',
    amount: 85000,
    amountUSD: 54400000,
    fromType: 'wallet',
    fromLabel: 'Institutional VC Fund',
    toType: 'smart_contract',
    toLabel: 'BNB Auto-Burn Smart Contract',
    timestamp: Date.now() - 1000 * 60 * 75,
    alertType: 'TRANSFER',
    sentiment: 'BULLISH',
    impactDescription: 'Quarterly deflationary burn mechanism executed on-chain.'
  },
  {
    id: 'tx-whale-06',
    txHash: '0x99cc...71ab',
    coinSymbol: 'XRP',
    coinName: 'Ripple',
    amount: 120000000,
    amountUSD: 74400000,
    fromType: 'exchange',
    fromLabel: 'Upbit Exchange',
    toType: 'wallet',
    toLabel: 'Whale Accumulation #9',
    timestamp: Date.now() - 1000 * 60 * 110,
    alertType: 'EXCHANGE_OUTFLOW',
    sentiment: 'BULLISH',
    impactDescription: 'Massive Asian market accumulation moved to private air-gapped hardware wallet.'
  }
];

export const initialExchangeFlows: ExchangeFlowStat[] = [
  {
    exchange: 'Binance',
    netInflowBTC: -4250,
    netInflowUSD: -390150000,
    dominantTrend: 'OUTFLOW_BULLISH',
    reservesUSD: 68450000000
  },
  {
    exchange: 'Coinbase Pro',
    netInflowBTC: -6120,
    netInflowUSD: -561816000,
    dominantTrend: 'OUTFLOW_BULLISH',
    reservesUSD: 42300000000
  },
  {
    exchange: 'OKX',
    netInflowBTC: 1240,
    netInflowUSD: 113832000,
    dominantTrend: 'INFLOW_BEARISH',
    reservesUSD: 19800000000
  },
  {
    exchange: 'Bybit',
    netInflowBTC: -1890,
    netInflowUSD: -173502000,
    dominantTrend: 'OUTFLOW_BULLISH',
    reservesUSD: 15400000000
  },
  {
    exchange: 'Kraken',
    netInflowBTC: 430,
    netInflowUSD: 39474000,
    dominantTrend: 'BALANCED',
    reservesUSD: 11200000000
  }
];

import React, { useState, useRef, useEffect, useMemo } from 'react';
import { 
  BarChart2, Activity, Maximize2, RefreshCw, 
  Eye, TrendingUp, SlidersHorizontal, Layers 
} from 'lucide-react';
import { useCrypto } from '../context/CryptoContext';
import { Timeframe, Candle } from '../types';

export const TradingViewChart: React.FC = () => {
  const { 
    selectedCoin, 
    candles, 
    timeframe, 
    setTimeframe, 
    theme, 
    formatPrice 
  } = useCrypto();

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [chartType, setChartType] = useState<'candles' | 'line' | 'depth'>('candles');
  const [showMA, setShowMA] = useState(true);
  const [showBOLL, setShowBOLL] = useState(false);
  const [showRSI, setShowRSI] = useState(true);
  const [showMACD, setShowMACD] = useState(false);
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  const isDark = theme === 'dark';

  // Calculate Technical Indicators
  const { ma7, ma25, ma99, rsi, upperBoll, lowerBoll, midBoll } = useMemo(() => {
    const closes = candles.map(c => c.close);
    const len = closes.length;

    // Moving Averages
    const calcMA = (period: number) => {
      const result: (number | null)[] = [];
      for (let i = 0; i < len; i++) {
        if (i < period - 1) {
          result.push(null);
        } else {
          const slice = closes.slice(i - period + 1, i + 1);
          const sum = slice.reduce((a, b) => a + b, 0);
          result.push(sum / period);
        }
      }
      return result;
    };

    // Bollinger Bands (20, 2)
    const calcBoll = (period = 20, multiplier = 2) => {
      const mid: (number | null)[] = [];
      const upper: (number | null)[] = [];
      const lower: (number | null)[] = [];

      for (let i = 0; i < len; i++) {
        if (i < period - 1) {
          mid.push(null); upper.push(null); lower.push(null);
        } else {
          const slice = closes.slice(i - period + 1, i + 1);
          const avg = slice.reduce((a, b) => a + b, 0) / period;
          const variance = slice.reduce((a, b) => a + Math.pow(b - avg, 2), 0) / period;
          const stdDev = Math.sqrt(variance);
          mid.push(avg);
          upper.push(avg + multiplier * stdDev);
          lower.push(avg - multiplier * stdDev);
        }
      }
      return { mid, upper, lower };
    };

    // RSI (14)
    const calcRSI = (period = 14) => {
      const result: (number | null)[] = [];
      if (len < period + 1) return Array(len).fill(50);

      let gains = 0;
      let losses = 0;

      for (let i = 1; i <= period; i++) {
        const diff = closes[i] - closes[i - 1];
        if (diff >= 0) gains += diff;
        else losses += Math.abs(diff);
      }

      let avgGain = gains / period;
      let avgLoss = losses / period;
      result.push(...Array(period).fill(null));
      let rs = avgLoss === 0 ? 100 : avgGain / avgLoss;
      result.push(100 - (100 / (1 + rs)));

      for (let i = period + 1; i < len; i++) {
        const diff = closes[i] - closes[i - 1];
        const gain = diff >= 0 ? diff : 0;
        const loss = diff < 0 ? Math.abs(diff) : 0;

        avgGain = (avgGain * (period - 1) + gain) / period;
        avgLoss = (avgLoss * (period - 1) + loss) / period;

        rs = avgLoss === 0 ? 100 : avgGain / avgLoss;
        result.push(100 - (100 / (1 + rs)));
      }

      return result;
    };

    const ma7Vals = calcMA(7);
    const ma25Vals = calcMA(25);
    const ma99Vals = calcMA(99);
    const boll = calcBoll(20, 2);
    const rsiVals = calcRSI(14);

    return {
      ma7: ma7Vals,
      ma25: ma25Vals,
      ma99: ma99Vals,
      rsi: rsiVals,
      midBoll: boll.mid,
      upperBoll: boll.upper,
      lowerBoll: boll.lower
    };
  }, [candles]);

  // Main Canvas Rendering Engine
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container || candles.length === 0) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = container.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    ctx.scale(dpr, dpr);

    // Color theme
    const bgCol = isDark ? '#121418' : '#ffffff';
    const gridCol = isDark ? '#1e2329' : '#f0f3f6';
    const textCol = isDark ? '#848e9c' : '#707a8a';
    const green = '#0ECB81';
    const red = '#F6465D';

    ctx.fillStyle = bgCol;
    ctx.fillRect(0, 0, width, height);

    // Layout partitioning
    const rightMargin = 72;
    const bottomMargin = 26;
    const subHeight = showRSI || showMACD ? 75 : 0;
    const mainHeight = height - bottomMargin - subHeight;
    const chartWidth = width - rightMargin;

    // Price scaling
    const visibleCandles = candles.slice(-70);
    const count = visibleCandles.length;
    if (count === 0) return;

    let minPrice = Math.min(...visibleCandles.map(c => c.low));
    let maxPrice = Math.max(...visibleCandles.map(c => c.high));

    if (showBOLL) {
      const bUpper = upperBoll.slice(-70).filter(Boolean) as number[];
      const bLower = lowerBoll.slice(-70).filter(Boolean) as number[];
      if (bUpper.length) maxPrice = Math.max(maxPrice, ...bUpper);
      if (bLower.length) minPrice = Math.min(minPrice, ...bLower);
    }

    const pricePadding = (maxPrice - minPrice) * 0.08 || 1;
    minPrice -= pricePadding;
    maxPrice += pricePadding;
    const priceRange = maxPrice - minPrice;

    const getY = (price: number) => {
      return mainHeight - ((price - minPrice) / priceRange) * mainHeight;
    };

    const candleWidth = Math.max(2, (chartWidth / count) * 0.7);
    const candleStep = chartWidth / count;

    // 1. Draw Grid Lines
    ctx.strokeStyle = gridCol;
    ctx.lineWidth = 1;

    // Horizontal Price Grids
    const gridSteps = 5;
    for (let i = 0; i <= gridSteps; i++) {
      const y = (mainHeight / gridSteps) * i;
      const price = maxPrice - (priceRange / gridSteps) * i;

      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(chartWidth, y);
      ctx.stroke();

      // Right Axis Label
      ctx.fillStyle = textCol;
      ctx.font = '10px JetBrains Mono, monospace';
      ctx.textAlign = 'left';
      ctx.fillText(formatPrice(price, selectedCoin.precision), chartWidth + 6, y + 3);
    }

    // 2. Draw Volume Bars in background
    const maxVol = Math.max(...visibleCandles.map(c => c.volume), 1);
    visibleCandles.forEach((c, idx) => {
      const x = idx * candleStep + candleStep / 2;
      const volH = (c.volume / maxVol) * (mainHeight * 0.22);
      const isUp = c.close >= c.open;
      ctx.fillStyle = isUp ? 'rgba(14, 203, 129, 0.18)' : 'rgba(246, 70, 93, 0.18)';
      ctx.fillRect(x - candleWidth / 2, mainHeight - volH, candleWidth, volH);
    });

    // 3. Draw Bollinger Bands (if enabled)
    if (showBOLL) {
      const vUpper = upperBoll.slice(-70);
      const vLower = lowerBoll.slice(-70);
      const vMid = midBoll.slice(-70);

      ctx.fillStyle = 'rgba(240, 185, 11, 0.04)';
      ctx.beginPath();
      let started = false;
      vUpper.forEach((val, i) => {
        if (val !== null) {
          const x = i * candleStep + candleStep / 2;
          const y = getY(val);
          if (!started) { ctx.moveTo(x, y); started = true; }
          else ctx.lineTo(x, y);
        }
      });
      for (let i = vLower.length - 1; i >= 0; i--) {
        const val = vLower[i];
        if (val !== null) {
          const x = i * candleStep + candleStep / 2;
          const y = getY(val);
          ctx.lineTo(x, y);
        }
      }
      ctx.closePath();
      ctx.fill();

      // Lines
      const drawLine = (vals: (number | null)[], color: string) => {
        ctx.strokeStyle = color;
        ctx.lineWidth = 1;
        ctx.beginPath();
        let s = false;
        vals.forEach((v, i) => {
          if (v !== null) {
            const x = i * candleStep + candleStep / 2;
            const y = getY(v);
            if (!s) { ctx.moveTo(x, y); s = true; }
            else ctx.lineTo(x, y);
          }
        });
        ctx.stroke();
      };

      drawLine(vUpper, 'rgba(240, 185, 11, 0.4)');
      drawLine(vMid, 'rgba(240, 185, 11, 0.7)');
      drawLine(vLower, 'rgba(240, 185, 11, 0.4)');
    }

    // 4. Draw Main Candlesticks or Line
    if (chartType === 'candles') {
      visibleCandles.forEach((c, idx) => {
        const x = idx * candleStep + candleStep / 2;
        const isUp = c.close >= c.open;
        const col = isUp ? green : red;

        ctx.strokeStyle = col;
        ctx.fillStyle = col;
        ctx.lineWidth = 1.2;

        // Wick
        const yHigh = getY(c.high);
        const yLow = getY(c.low);
        ctx.beginPath();
        ctx.moveTo(x, yHigh);
        ctx.lineTo(x, yLow);
        ctx.stroke();

        // Body
        const yOpen = getY(c.open);
        const yClose = getY(c.close);
        const top = Math.min(yOpen, yClose);
        const bodyH = Math.max(1.5, Math.abs(yOpen - yClose));
        ctx.fillRect(x - candleWidth / 2, top, candleWidth, bodyH);
      });
    } else if (chartType === 'line') {
      ctx.strokeStyle = '#F0B90B';
      ctx.lineWidth = 2;
      ctx.beginPath();
      visibleCandles.forEach((c, idx) => {
        const x = idx * candleStep + candleStep / 2;
        const y = getY(c.close);
        if (idx === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.stroke();

      // Area fill
      const grad = ctx.createLinearGradient(0, 0, 0, mainHeight);
      grad.addColorStop(0, 'rgba(240, 185, 11, 0.25)');
      grad.addColorStop(1, 'rgba(240, 185, 11, 0.0)');
      ctx.fillStyle = grad;
      ctx.lineTo(chartWidth, mainHeight);
      ctx.lineTo(0, mainHeight);
      ctx.closePath();
      ctx.fill();
    }

    // 5. Draw Moving Averages (MA7, MA25, MA99)
    if (showMA && chartType === 'candles') {
      const drawMA = (vals: (number | null)[], color: string) => {
        const sliced = vals.slice(-70);
        ctx.strokeStyle = color;
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        let s = false;
        sliced.forEach((v, i) => {
          if (v !== null) {
            const x = i * candleStep + candleStep / 2;
            const y = getY(v);
            if (!s) { ctx.moveTo(x, y); s = true; }
            else ctx.lineTo(x, y);
          }
        });
        ctx.stroke();
      };

      drawMA(ma7, '#F0B90B'); // MA7 Yellow
      drawMA(ma25, '#9945FF'); // MA25 Purple
      drawMA(ma99, '#00C8FF'); // MA99 Cyan
    }

    // 6. Current Price Pulsing Line
    const currentPrice = selectedCoin.price;
    const currentY = getY(currentPrice);
    ctx.setLineDash([4, 4]);
    ctx.strokeStyle = '#F0B90B';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, currentY);
    ctx.lineTo(chartWidth, currentY);
    ctx.stroke();
    ctx.setLineDash([]);

    // Right Badge for Current Price
    ctx.fillStyle = '#F0B90B';
    ctx.fillRect(chartWidth + 2, currentY - 9, rightMargin - 4, 18);
    ctx.fillStyle = '#181a20';
    ctx.font = 'bold 10px JetBrains Mono, monospace';
    ctx.textAlign = 'left';
    ctx.fillText(formatPrice(currentPrice, selectedCoin.precision), chartWidth + 6, currentY + 3.5);

    // 7. Sub-Chart for RSI(14)
    if (showRSI) {
      const subTop = mainHeight;
      ctx.strokeStyle = gridCol;
      ctx.beginPath();
      ctx.moveTo(0, subTop);
      ctx.lineTo(width, subTop);
      ctx.stroke();

      // RSI bounds
      const y70 = subTop + subHeight * 0.3;
      const y30 = subTop + subHeight * 0.7;

      ctx.strokeStyle = isDark ? '#2b313a' : '#e2e8f0';
      ctx.setLineDash([2, 2]);
      ctx.beginPath();
      ctx.moveTo(0, y70); ctx.lineTo(chartWidth, y70);
      ctx.moveTo(0, y30); ctx.lineTo(chartWidth, y30);
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.fillStyle = textCol;
      ctx.font = '9px JetBrains Mono, monospace';
      ctx.fillText('70', chartWidth + 6, y70 + 3);
      ctx.fillText('30', chartWidth + 6, y30 + 3);

      const rsiSliced = rsi.slice(-70);
      ctx.strokeStyle = '#9945FF';
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      let started = false;
      rsiSliced.forEach((val, i) => {
        if (val !== null) {
          const x = i * candleStep + candleStep / 2;
          const y = subTop + (1 - val / 100) * subHeight;
          if (!started) { ctx.moveTo(x, y); started = true; }
          else ctx.lineTo(x, y);
        }
      });
      ctx.stroke();

      // RSI Label
      ctx.fillStyle = '#9945FF';
      const lastRSI = rsiSliced[rsiSliced.length - 1] || 50;
      ctx.fillText(`RSI(14): ${lastRSI.toFixed(1)}`, 8, subTop + 14);
    }

    // 8. Crosshair on Hover
    if (hoverIndex !== null && hoverIndex >= 0 && hoverIndex < count) {
      const candle = visibleCandles[hoverIndex];
      const hx = hoverIndex * candleStep + candleStep / 2;
      const hy = getY(candle.close);

      ctx.strokeStyle = isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)';
      ctx.setLineDash([2, 2]);
      ctx.beginPath();
      ctx.moveTo(hx, 0); ctx.lineTo(hx, height - bottomMargin);
      ctx.moveTo(0, hy); ctx.lineTo(chartWidth, hy);
      ctx.stroke();
      ctx.setLineDash([]);

      // Bottom date box
      const timeStr = new Date(candle.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      ctx.fillStyle = isDark ? '#2b313a' : '#e2e8f0';
      ctx.fillRect(hx - 24, height - bottomMargin + 4, 48, 18);
      ctx.fillStyle = textCol;
      ctx.font = '9px JetBrains Mono, monospace';
      ctx.textAlign = 'center';
      ctx.fillText(timeStr, hx, height - bottomMargin + 16);
    }

  }, [candles, selectedCoin, chartType, showMA, showBOLL, showRSI, showMACD, hoverIndex, isDark, formatPrice, ma7, ma25, ma99, rsi, upperBoll, lowerBoll, midBoll]);

  // Handle Mouse Move for Crosshair
  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const rightMargin = 72;
    const chartWidth = rect.width - rightMargin;
    const visibleCount = 70;
    const step = chartWidth / visibleCount;
    const index = Math.floor(x / step);
    if (index >= 0 && index < visibleCount) {
      setHoverIndex(index);
    } else {
      setHoverIndex(null);
    }
  };

  const activeCandle = hoverIndex !== null && candles.slice(-70)[hoverIndex] 
    ? candles.slice(-70)[hoverIndex] 
    : candles[candles.length - 1];

  const timeframes: Timeframe[] = ['1s', '1m', '5m', '15m', '1h', '4h', '1D', '1W'];

  return (
    <div ref={containerRef} className={`flex flex-col h-full rounded-2xl border overflow-hidden select-none ${
      isDark ? 'bg-[#121418] border-[#1e2329]' : 'bg-white border-slate-200'
    }`}>
      {/* Chart Toolbar */}
      <div className={`px-4 py-2 border-b flex flex-wrap items-center justify-between gap-3 text-xs ${
        isDark ? 'bg-[#181a20] border-[#2b313a]' : 'bg-slate-50 border-slate-200'
      }`}>
        {/* Timeframes */}
        <div className="flex items-center gap-1">
          <span className="text-[10px] font-bold uppercase text-slate-400 mr-1 hidden sm:inline">Time:</span>
          {timeframes.map(tf => (
            <button
              key={tf}
              onClick={() => setTimeframe(tf)}
              className={`px-2 py-1 rounded-md font-mono font-bold text-xs transition-colors ${
                timeframe === tf 
                  ? 'bg-[#F0B90B] text-[#181a20] shadow-xs' 
                  : isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {tf}
            </button>
          ))}
        </div>

        {/* Chart View & Indicators */}
        <div className="flex items-center gap-2">
          {/* Chart Type */}
          <div className={`flex p-0.5 rounded-lg border ${isDark ? 'bg-[#0b0e11] border-[#2b313a]' : 'bg-white border-slate-200'}`}>
            <button
              onClick={() => setChartType('candles')}
              className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                chartType === 'candles' ? 'bg-[#F0B90B] text-[#181a20]' : 'text-slate-400'
              }`}
            >
              Candles
            </button>
            <button
              onClick={() => setChartType('line')}
              className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                chartType === 'line' ? 'bg-[#F0B90B] text-[#181a20]' : 'text-slate-400'
              }`}
            >
              Line
            </button>
          </div>

          {/* Indicators Toggles */}
          <div className="flex items-center gap-1 text-[11px] font-mono">
            <button
              onClick={() => setShowMA(!showMA)}
              className={`px-1.5 py-0.5 rounded border transition-colors ${
                showMA ? 'bg-[#F0B90B]/20 text-[#F0B90B] border-[#F0B90B]/40' : 'text-slate-500 border-transparent'
              }`}
            >
              MA
            </button>
            <button
              onClick={() => setShowBOLL(!showBOLL)}
              className={`px-1.5 py-0.5 rounded border transition-colors ${
                showBOLL ? 'bg-[#00C8FF]/20 text-[#00C8FF] border-[#00C8FF]/40' : 'text-slate-500 border-transparent'
              }`}
            >
              BOLL
            </button>
            <button
              onClick={() => setShowRSI(!showRSI)}
              className={`px-1.5 py-0.5 rounded border transition-colors ${
                showRSI ? 'bg-[#9945FF]/20 text-[#9945FF] border-[#9945FF]/40' : 'text-slate-500 border-transparent'
              }`}
            >
              RSI
            </button>
          </div>
        </div>
      </div>

      {/* OHLCV Live Readout Stats Banner */}
      {activeCandle && (
        <div className={`px-4 py-1.5 text-[11px] font-mono flex flex-wrap items-center gap-3 border-b ${
          isDark ? 'bg-[#121418] border-[#1e2329] text-slate-400' : 'bg-white border-slate-100 text-slate-500'
        }`}>
          <span>O: <strong className="text-slate-200">${formatPrice(activeCandle.open)}</strong></span>
          <span>H: <strong className="text-[#0ECB81]">${formatPrice(activeCandle.high)}</strong></span>
          <span>L: <strong className="text-[#F6465D]">${formatPrice(activeCandle.low)}</strong></span>
          <span>C: <strong className="text-slate-200">${formatPrice(activeCandle.close)}</strong></span>
          <span>Vol: <strong className="text-slate-300">{activeCandle.volume} {selectedCoin.baseAsset}</strong></span>
          {showMA && (
            <div className="hidden lg:flex items-center gap-2 text-[10px]">
              <span className="text-[#F0B90B]">MA(7): ${formatPrice(activeCandle.close * 0.998)}</span>
              <span className="text-[#9945FF]">MA(25): ${formatPrice(activeCandle.close * 0.992)}</span>
              <span className="text-[#00C8FF]">MA(99): ${formatPrice(activeCandle.close * 0.975)}</span>
            </div>
          )}
        </div>
      )}

      {/* Canvas Chart Area */}
      <div className="flex-1 relative w-full h-full min-h-[360px]">
        <canvas
          ref={canvasRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={() => setHoverIndex(null)}
          className="absolute inset-0 cursor-crosshair"
        />
      </div>
    </div>
  );
};

import { ComposedChart, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Bar, BarChart } from 'recharts';
import { TrendingUp } from 'lucide-react';

const StockChart = ({ chartData, loading, symbol }) => {
  if (loading) {
    return (
      <div className="bg-slate-800 rounded-xl shadow-lg border border-slate-700 p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-slate-700 rounded w-1/3 mb-4"></div>
          <div className="h-64 bg-slate-700 rounded"></div>
        </div>
      </div>
    );
  }

  if (!chartData || chartData.length === 0) {
    return null;
  }

  // Calculate price range
  const minPrice = Math.min(...chartData.map(d => d.low));
  const maxPrice = Math.max(...chartData.map(d => d.high));
  const priceRange = maxPrice - minPrice;
  const yAxisDomain = [minPrice - priceRange * 0.05, maxPrice + priceRange * 0.05];

  // Prepare data for candlestick visualization
  const candlestickData = chartData.map((item, index) => ({
    ...item,
    index,
    isPositive: item.close >= item.open,
    bodyTop: Math.max(item.open, item.close),
    bodyBottom: Math.min(item.open, item.close),
    bodyHeight: Math.abs(item.close - item.open),
    range: item.high - item.low,
  }));

  // Custom tooltip
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const change = data.close - data.open;
      const changePercent = ((change / data.open) * 100).toFixed(2);
      const isPositive = change >= 0;
      
      return (
        <div className="bg-slate-800 border border-slate-600 rounded-lg p-3 shadow-xl">
          <p className="font-semibold text-slate-100 mb-2">{data.date}</p>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between gap-4">
              <span className="text-slate-400">Open:</span>
              <span className="font-medium text-slate-200">${data.open.toFixed(2)}</span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-slate-400">High:</span>
              <span className="font-medium text-emerald-400">${data.high.toFixed(2)}</span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-slate-400">Low:</span>
              <span className="font-medium text-red-400">${data.low.toFixed(2)}</span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-slate-400">Close:</span>
              <span className={`font-medium ${isPositive ? 'text-emerald-400' : 'text-red-400'}`}>
                ${data.close.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between gap-4 pt-1 border-t border-slate-700">
              <span className="text-slate-400">Change:</span>
              <span className={`font-semibold ${isPositive ? 'text-emerald-400' : 'text-red-400'}`}>
                {isPositive ? '+' : ''}${change.toFixed(2)} ({isPositive ? '+' : ''}{changePercent}%)
              </span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  // Custom shape for candlestick
  const CandlestickBar = (props) => {
    const { x, y, width, payload } = props;
    const { open, high, low, close, isPositive } = payload;
    
    const bodyTop = Math.max(open, close);
    const bodyBottom = Math.min(open, close);
    const bodyHeight = bodyTop - bodyBottom;
    
    // Scale to chart coordinates
    const scaleY = (price) => {
      const range = maxPrice - minPrice;
      const chartHeight = 300;
      return chartHeight - ((price - minPrice) / range) * chartHeight;
    };
    
    const centerX = x + width / 2;
    const bodyColor = isPositive ? '#10b981' : '#ef4444';
    const wickColor = '#94a3b8';
    const barWidth = Math.max(width * 0.6, 4);
    
    const highY = scaleY(high);
    const lowY = scaleY(low);
    const bodyTopY = scaleY(bodyTop);
    const bodyBottomY = scaleY(bodyBottom);
    const bodyRectHeight = Math.max((bodyHeight / (maxPrice - minPrice)) * 300, 2);
    
    return (
      <g>
        {/* Upper wick */}
        <line
          x1={centerX}
          y1={highY}
          x2={centerX}
          y2={bodyTopY}
          stroke={wickColor}
          strokeWidth={1.5}
        />
        {/* Body rectangle */}
        <rect
          x={x + (width - barWidth) / 2}
          y={bodyTopY}
          width={barWidth}
          height={bodyRectHeight}
          fill={bodyColor}
          stroke={bodyColor}
          strokeWidth={1}
        />
        {/* Lower wick */}
        <line
          x1={centerX}
          y1={bodyBottomY}
          x2={centerX}
          y2={lowY}
          stroke={wickColor}
          strokeWidth={1.5}
        />
      </g>
    );
  };

  return (
    <div className="bg-slate-800 rounded-xl shadow-lg border border-slate-700 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-slate-100 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-cyan-400" />
          Candlestick Chart - {symbol}
        </h3>
        <span className="text-sm text-slate-400">Ultimele 30 zile</span>
      </div>
      
      <ResponsiveContainer width="100%" height={400}>
        <ComposedChart
          data={candlestickData}
          margin={{ top: 20, right: 20, left: 20, bottom: 60 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
          <XAxis 
            dataKey="date" 
            stroke="#94a3b8"
            fontSize={11}
            tick={{ fill: '#94a3b8' }}
            interval="preserveStartEnd"
            angle={-45}
            textAnchor="end"
            height={80}
          />
          <YAxis 
            stroke="#94a3b8"
            fontSize={12}
            tick={{ fill: '#94a3b8' }}
            domain={yAxisDomain}
            tickFormatter={(value) => `$${value.toFixed(0)}`}
            width={70}
          />
          <Tooltip content={<CustomTooltip />} />
          
          {/* Use Bar with custom shape for candlesticks */}
          <Bar
            dataKey="high"
            shape={<CandlestickBar />}
            isAnimationActive={false}
          >
            {candlestickData.map((entry, index) => (
              <Cell key={`cell-${index}`} />
            ))}
          </Bar>
        </ComposedChart>
      </ResponsiveContainer>
      
      <div className="mt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-sm">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-emerald-500 rounded"></div>
            <span className="text-slate-400">Bullish (Close &gt; Open)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-500 rounded"></div>
            <span className="text-slate-400">Bearish (Close &lt; Open)</span>
          </div>
        </div>
        <div className="text-slate-400">
          <span className="font-medium">Range: </span>
          <span className="text-red-400">${minPrice.toFixed(2)}</span>
          <span className="mx-2">-</span>
          <span className="text-emerald-400">${maxPrice.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
};

export default StockChart;

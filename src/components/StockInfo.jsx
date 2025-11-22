import { TrendingUp, TrendingDown, DollarSign, BarChart3, TrendingUp as Growth, Percent, Info } from 'lucide-react';
import { getIndustryAverage } from '../utils/api';

const StockInfo = ({ stockData, overviewData, loading }) => {
  if (loading) {
    return (
      <div className="bg-slate-800 rounded-xl shadow-lg border border-slate-700 p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-slate-700 rounded w-1/3"></div>
          <div className="h-4 bg-slate-700 rounded w-1/2"></div>
          <div className="grid grid-cols-2 gap-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-20 bg-slate-700 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!stockData || !overviewData) {
    return null;
  }

  const isPositive = stockData.change >= 0;
  const changeColor = isPositive ? 'text-emerald-400' : 'text-red-400';
  const changeBg = isPositive ? 'bg-emerald-500/20 border-emerald-500/30' : 'bg-red-500/20 border-red-500/30';
  
  // Industry comparison
  const industryAvgPE = getIndustryAverage(overviewData.sector);
  const peComparison = overviewData.peRatio > 0 && industryAvgPE > 0
    ? ((overviewData.peRatio / industryAvgPE - 1) * 100)
    : 0;
  const peComparisonColor = Math.abs(peComparison) < 10 ? 'text-cyan-400' : 
    peComparison > 0 ? 'text-orange-400' : 'text-emerald-400';

  return (
    <div className="bg-slate-800 rounded-xl shadow-lg border border-slate-700 p-6 h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-slate-100">{overviewData.name || stockData.symbol}</h2>
          <p className="text-slate-400 text-sm mb-2">{overviewData.sector} • {overviewData.industry}</p>
          {overviewData.description && (
            <p className="text-slate-300 text-sm mt-3 leading-relaxed line-clamp-3">
              {overviewData.description}
            </p>
          )}
        </div>
        <div className="text-right ml-4">
          <div className="text-3xl font-bold text-slate-100">${stockData.price.toFixed(2)}</div>
          <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-full border ${changeBg} ${changeColor} font-semibold text-sm mt-1`}>
            {isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
            {isPositive ? '+' : ''}{stockData.change.toFixed(2)} ({stockData.changePercent})
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 flex-1">
        <MetricCard
          icon={<DollarSign className="w-5 h-5" />}
          label="Market Cap"
          value={`$${(overviewData.marketCap / 1e9).toFixed(2)}B`}
        />
        <MetricCard
          icon={<BarChart3 className="w-5 h-5" />}
          label="P/E Ratio"
          value={overviewData.peRatio.toFixed(2)}
          comparison={industryAvgPE > 0 ? {
            label: `Media industrie: ${industryAvgPE}`,
            value: `${peComparison >= 0 ? '+' : ''}${peComparison.toFixed(1)}%`,
            color: peComparisonColor
          } : null}
        />
        <MetricCard
          icon={<Growth className="w-5 h-5" />}
          label="EPS"
          value={`$${overviewData.eps.toFixed(2)}`}
        />
        <MetricCard
          icon={<DollarSign className="w-5 h-5" />}
          label="Revenue"
          value={`$${(overviewData.revenue / 1e9).toFixed(2)}B`}
        />
        <MetricCard
          icon={<Percent className="w-5 h-5" />}
          label="Profit Margin"
          value={`${overviewData.profitMargin.toFixed(2)}%`}
        />
        <MetricCard
          icon={<TrendingUp className="w-5 h-5" />}
          label="52W High"
          value={`$${overviewData.fiftyTwoWeekHigh.toFixed(2)}`}
        />
        <MetricCard
          icon={<TrendingDown className="w-5 h-5" />}
          label="52W Low"
          value={`$${overviewData.fiftyTwoWeekLow.toFixed(2)}`}
        />
        <MetricCard
          icon={<BarChart3 className="w-5 h-5" />}
          label="Beta"
          value={overviewData.beta.toFixed(2)}
        />
        <MetricCard
          icon={<Percent className="w-5 h-5" />}
          label="Dividend Yield"
          value={overviewData.dividendYield > 1 
            ? `${overviewData.dividendYield.toFixed(2)}%` 
            : `${(overviewData.dividendYield * 100).toFixed(2)}%`}
        />
      </div>
    </div>
  );
};

const MetricCard = ({ icon, label, value, comparison }) => (
  <div className="bg-slate-700/50 rounded-lg p-4 border border-slate-600/50 hover:border-slate-500 transition-colors flex flex-col justify-center items-center text-center">
    <div className="flex items-center justify-center gap-2 text-slate-400 mb-2">
      {icon}
      <span className="text-sm font-medium">{label}</span>
    </div>
    <div className="text-xl font-bold text-slate-100 mb-1">{value}</div>
    {comparison && (
      <div className="flex items-center justify-center gap-1 text-xs">
        <Info className="w-3 h-3 text-slate-500" />
        <span className="text-slate-500">{comparison.label}</span>
        <span className={`font-semibold ${comparison.color}`}>
          ({comparison.value})
        </span>
      </div>
    )}
  </div>
);

export default StockInfo;
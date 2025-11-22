import { Brain, TrendingUp, TrendingDown, CheckCircle, AlertCircle, Target, MessageSquare, BarChart3, Activity, Volume2 } from 'lucide-react';

const AIAnalysis = ({ analysis, loading, newsSentiment }) => {
  if (loading) {
    return (
      <div className="bg-slate-800 rounded-xl shadow-lg border border-slate-700 p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-slate-700 rounded w-1/3"></div>
          <div className="h-4 bg-slate-700 rounded w-full"></div>
          <div className="h-4 bg-slate-700 rounded w-5/6"></div>
          <div className="h-4 bg-slate-700 rounded w-4/6"></div>
        </div>
      </div>
    );
  }

  if (!analysis) {
    return null;
  }

  const getVerdictColor = (verdict) => {
    if (verdict.includes('SUBEVALUATĂ')) return 'text-emerald-400 bg-emerald-500/20 border-emerald-500/30';
    if (verdict.includes('SUPRAEVALUATĂ')) return 'text-red-400 bg-red-500/20 border-red-500/30';
    return 'text-cyan-400 bg-cyan-500/20 border-cyan-500/30';
  };

  const getVerdictIcon = (verdict) => {
    if (verdict.includes('SUBEVALUATĂ')) return <TrendingUp className="w-5 h-5" />;
    if (verdict.includes('SUPRAEVALUATĂ')) return <TrendingDown className="w-5 h-5" />;
    return <CheckCircle className="w-5 h-5" />;
  };

  const confidencePercentage = (analysis.confidenceScore / 10) * 100;

  return (
    <div className="bg-slate-800 rounded-xl shadow-lg border border-slate-700 p-6 h-full flex flex-col">
      <h3 className="text-xl font-bold text-slate-100 mb-4 flex items-center gap-2">
        <Brain className="w-5 h-5 text-cyan-400" />
        AI Analysis
      </h3>

      <div className="space-y-6 flex-1 overflow-y-auto">
        {/* News Sentiment Indicator */}
        {newsSentiment && (
          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm border ${
            newsSentiment === 'positive' ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' :
            newsSentiment === 'negative' ? 'bg-red-500/20 text-red-300 border-red-500/30' :
            'bg-slate-700/50 text-slate-300 border-slate-600/50'
          }`}>
            <MessageSquare className="w-4 h-4" />
            News Sentiment: {newsSentiment === 'positive' ? 'Pozitiv' : newsSentiment === 'negative' ? 'Negativ' : 'Neutru'}
          </div>
        )}

        {/* Verdict */}
        <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-semibold border ${getVerdictColor(analysis.verdict)}`}>
          {getVerdictIcon(analysis.verdict)}
          {analysis.verdict}
        </div>

        {/* Fair Value */}
        <div className="bg-slate-700/50 rounded-lg p-4 border border-slate-600/50">
          <div className="flex items-center gap-2 text-slate-400 mb-2">
            <Target className="w-5 h-5" />
            <span className="font-medium">Estimated Fair Value</span>
          </div>
          <div className="text-2xl font-bold text-slate-100">
            ${analysis.estimatedFairValue.toFixed(2)}
          </div>
        </div>

        {/* Confidence Score */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-slate-400">Confidence Score</span>
            <span className="text-sm font-bold text-slate-100">{analysis.confidenceScore}/10</span>
          </div>
          <div className="w-full bg-slate-700 rounded-full h-3">
            <div
              className="bg-gradient-to-r from-cyan-500 to-blue-500 h-3 rounded-full transition-all duration-300"
              style={{ width: `${confidencePercentage}%` }}
            ></div>
          </div>
        </div>

        {/* Reasoning */}
        {analysis.reasoning && analysis.reasoning.length > 0 && (
          <div>
            <h4 className="font-semibold text-slate-200 mb-3">Raționament</h4>
            <ul className="space-y-2">
              {analysis.reasoning.map((reason, index) => (
                <li key={index} className="flex items-start gap-2 text-sm text-slate-300">
                  <span className="text-cyan-400 mt-1">•</span>
                  <span>{reason}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Technical Indicators */}
        {analysis.technicalIndicators && (
          <div>
            <h4 className="font-semibold text-slate-200 mb-3 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-cyan-400" />
              Indicatori Tehnici (1 zi)
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              <IndicatorCard
                label="RSI (14)"
                value={analysis.technicalIndicators.rsi.toFixed(1)}
                status={analysis.technicalIndicators.rsi > 70 ? 'overbought' : analysis.technicalIndicators.rsi < 30 ? 'oversold' : 'neutral'}
                icon={<Activity className="w-4 h-4" />}
              />
              <IndicatorCard
                label="MACD"
                value={`${analysis.technicalIndicators.macd.value > 0 ? '+' : ''}${analysis.technicalIndicators.macd.value.toFixed(2)}`}
                status={analysis.technicalIndicators.macd.histogram > 0 ? 'bullish' : 'bearish'}
                icon={<TrendingUp className="w-4 h-4" />}
              />
              <IndicatorCard
                label="SMA 20"
                value={`$${analysis.technicalIndicators.sma20.toFixed(2)}`}
                status={analysis.technicalIndicators.sma20 > analysis.technicalIndicators.sma50 ? 'bullish' : 'bearish'}
                icon={<BarChart3 className="w-4 h-4" />}
              />
              <IndicatorCard
                label="Volume Ratio"
                value={`${analysis.technicalIndicators.volume.ratio.toFixed(2)}x`}
                status={analysis.technicalIndicators.volume.ratio > 1.5 ? 'high' : analysis.technicalIndicators.volume.ratio < 0.5 ? 'low' : 'normal'}
                icon={<Volume2 className="w-4 h-4" />}
              />
              <IndicatorCard
                label="Volatilitate"
                value={`${analysis.technicalIndicators.volatility.toFixed(2)}%`}
                status={analysis.technicalIndicators.volatility > 3 ? 'high' : analysis.technicalIndicators.volatility < 1 ? 'low' : 'normal'}
                icon={<Activity className="w-4 h-4" />}
              />
            </div>
          </div>
        )}

        {/* Bull & Bear Case */}
        <div className="grid md:grid-cols-2 gap-4">
          {analysis.bullCase && (
            <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-5 h-5 text-emerald-400" />
                <h4 className="font-semibold text-emerald-300">Bull Case</h4>
              </div>
              <p className="text-sm text-slate-300">{analysis.bullCase}</p>
            </div>
          )}
          {analysis.bearCase && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <TrendingDown className="w-5 h-5 text-red-400" />
                <h4 className="font-semibold text-red-300">Bear Case</h4>
              </div>
              <p className="text-sm text-slate-300">{analysis.bearCase}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const IndicatorCard = ({ label, value, status, icon }) => {
  const getStatusColor = (status) => {
    if (status === 'overbought' || status === 'bearish' || status === 'high') return 'text-red-400 bg-red-500/10 border-red-500/30';
    if (status === 'oversold' || status === 'bullish' || status === 'low') return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
    return 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30';
  };

  return (
    <div className={`bg-slate-700/50 rounded-lg p-3 border ${getStatusColor(status)}`}>
      <div className="flex items-center gap-2 text-slate-400 mb-1 text-xs">
        {icon}
        <span>{label}</span>
      </div>
      <div className="text-lg font-bold text-slate-100">{value}</div>
    </div>
  );
};

export default AIAnalysis;

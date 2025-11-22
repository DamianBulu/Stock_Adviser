import { useState } from 'react';
import { Search, LogOut } from 'lucide-react';
import StockInfo from './StockInfo';
import StockChart from './StockChart';
import NewsCard from './NewsCard';
import AIAnalysis from './AIAnalysis';
import ChatInterface from './ChatInterface'; // IMPORTAT AICI
import {
  fetchStockQuote,
  fetchStockOverview,
  fetchCompanyNews,
  fetchStockHistory,
  analyzeStockWithAI,
  calculateOverallSentiment,
  calculateTechnicalIndicators
} from '../utils/api';

const Dashboard = ({ username, onLogout }) => {
  const [searchSymbol, setSearchSymbol] = useState('');
  const [stockData, setStockData] = useState(null);
  const [overviewData, setOverviewData] = useState(null);
  const [news, setNews] = useState([]);
  const [analysis, setAnalysis] = useState(null);
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchSymbol.trim()) return;

    setLoading(true);
    setError('');
    setStockData(null);
    setOverviewData(null);
    setNews([]);
    setAnalysis(null);
    setChartData(null);

    try {
      const symbol = searchSymbol.trim().toUpperCase();

      // Fetch all data in parallel
      const [quote, overview, newsData, history] = await Promise.all([
        fetchStockQuote(symbol),
        fetchStockOverview(symbol),
        fetchCompanyNews(symbol),
        fetchStockHistory(symbol).catch(err => {
          console.warn('Chart data fetch failed:', err);
          return null;
        }),
      ]);

      setStockData(quote);
      setOverviewData(overview);
      setNews(newsData);
      setChartData(history);

      // Calculate technical indicators
      const technicalIndicators = history && history.length > 0 
        ? calculateTechnicalIndicators(history, quote.price)
        : null;

      // Fetch AI analysis with technical indicators
      try {
        const aiAnalysis = await analyzeStockWithAI(quote, overview, newsData, technicalIndicators);
        setAnalysis({ ...aiAnalysis, technicalIndicators });
      } catch (aiError) {
        console.error('AI analysis error:', aiError);
        setError(`Analiza AI a eșuat: ${aiError.message}.`);
      }
    } catch (err) {
      setError(err.message || 'Eroare la căutarea companiei');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Header */}
      <header className="bg-slate-800 shadow-lg border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-100">Hermes</h1>
              <p className="text-sm text-slate-400">
                Bun venit, <span className="font-semibold text-slate-200">{username}</span>!
              </p>
            </div>
            <button
              onClick={onLogout}
              className="flex items-center gap-2 px-4 py-2 text-slate-300 hover:bg-slate-700 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Search Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <form onSubmit={handleSearch} className="mb-6">
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type="text"
                value={searchSymbol}
                onChange={(e) => setSearchSymbol(e.target.value.toUpperCase())}
                placeholder="Caută simbol companie (ex: AAPL, TSLA, MSFT)"
                className="w-full pl-10 pr-4 py-3 bg-slate-800 border border-slate-600 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none text-base sm:text-lg text-slate-100 placeholder-slate-500"
                disabled={loading}
              />
            </div>
            <button
              type="submit"
              disabled={loading || !searchSymbol.trim()}
              className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white px-6 sm:px-8 py-3 rounded-lg font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Caută...
                </>
              ) : (
                <>
                  <Search className="w-5 h-5" />
                  Search
                </>
              )}
            </button>
          </div>
        </form>

        {error && (
          <div className="bg-red-900/30 border border-red-700/50 text-red-300 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Content Grid */}
        {stockData && (
          <div className="space-y-6">
            {/* Chart - Full Width */}
            <StockChart
              chartData={chartData}
              loading={loading}
              symbol={stockData.symbol}
            />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Left Column - Info & News */}
              <div className="flex flex-col gap-4">
                <div className="flex-1 min-h-[500px]">
                  <StockInfo stockData={stockData} overviewData={overviewData} loading={loading} />
                </div>
                <div className="flex-1 min-h-[500px]">
                  <NewsCard news={news} loading={loading} />
                </div>
              </div>

              {/* Right Column - AI Analysis & Chat */}
              <div className="flex flex-col gap-4">
                <div className="flex-1 min-h-[500px]">
                  <AIAnalysis
                    analysis={analysis}
                    loading={loading}
                    newsSentiment={calculateOverallSentiment(news)}
                  />
                </div>
                <div className="flex-1 min-h-[500px]">
                  <ChatInterface
                    stockData={stockData}
                    overviewData={overviewData}
                    analysis={analysis}
                    news={news}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {!stockData && !loading && (
          <div className="text-center py-12">
            <Search className="w-16 h-16 text-slate-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-300 mb-2">
              Caută o companie pentru a începe
            </h3>
            <p className="text-slate-500">
              Introdu un simbol de acțiune (ex: AAPL, TSLA, MSFT)
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
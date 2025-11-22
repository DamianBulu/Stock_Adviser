import { Newspaper, ExternalLink, Calendar, TrendingUp, TrendingDown, Minus } from 'lucide-react';

const NewsCard = ({ news, loading }) => {
  if (loading) {
    return (
      <div className="bg-slate-800 rounded-xl shadow-lg border border-slate-700 p-6">
        <h3 className="text-xl font-bold text-slate-100 mb-4 flex items-center gap-2">
          <Newspaper className="w-5 h-5 text-cyan-400" />
          Latest News
        </h3>
        <div className="space-y-4">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="animate-pulse">
              <div className="h-4 bg-slate-700 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-slate-700 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!news || news.length === 0) {
    return (
      <div className="bg-slate-800 rounded-xl shadow-lg border border-slate-700 p-6">
        <h3 className="text-xl font-bold text-slate-100 mb-4 flex items-center gap-2">
          <Newspaper className="w-5 h-5 text-cyan-400" />
          Latest News
        </h3>
        <p className="text-slate-400 text-center py-8">Nu s-au găsit știri pentru această companie.</p>
      </div>
    );
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'Date unknown';
    const date = new Date(dateString);
    return date.toLocaleDateString('ro-RO', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const getSentimentIcon = (sentiment) => {
    if (sentiment === 'positive') return <TrendingUp className="w-3 h-3 text-emerald-400" />;
    if (sentiment === 'negative') return <TrendingDown className="w-3 h-3 text-red-400" />;
    return <Minus className="w-3 h-3 text-slate-500" />;
  };

  const getSentimentColor = (sentiment) => {
    if (sentiment === 'positive') return 'bg-emerald-500/10 border-emerald-500/30';
    if (sentiment === 'negative') return 'bg-red-500/10 border-red-500/30';
    return 'bg-slate-700/50 border-slate-600/50';
  };

  const getSentimentText = (sentiment) => {
    if (sentiment === 'positive') return 'Pozitiv';
    if (sentiment === 'negative') return 'Negativ';
    return 'Neutru';
  };

  return (
    <div className="bg-slate-800 rounded-xl shadow-lg border border-slate-700 p-6 h-full flex flex-col">
      <h3 className="text-xl font-bold text-slate-100 mb-4 flex items-center gap-2">
        <Newspaper className="w-5 h-5 text-cyan-400" />
        Latest News
      </h3>
      <div className="space-y-4 flex-1 overflow-y-auto">
        {news.map((item, index) => (
          <div
            key={index}
            className={`border rounded-lg p-4 hover:border-slate-600 transition-all ${getSentimentColor(item.sentiment)}`}
          >
            <div className="flex items-start justify-between gap-2 mb-2">
              <h4 className="font-semibold text-slate-100 line-clamp-2 flex-1">
                {item.title}
              </h4>
              {item.sentiment && (
                <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-slate-700 border border-slate-600 text-xs font-medium">
                  {getSentimentIcon(item.sentiment)}
                  <span className="text-slate-300">{getSentimentText(item.sentiment)}</span>
                </div>
              )}
            </div>
            {item.description && (
              <p className="text-sm text-slate-400 mb-3 line-clamp-2">
                {item.description}
              </p>
            )}
            <div className="flex items-center justify-between text-xs text-slate-500">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {formatDate(item.date)}
                </span>
                {item.source && (
                  <span className="font-medium">{item.source}</span>
                )}
              </div>
              {item.link && (
                <a
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-cyan-400 hover:text-cyan-300 font-medium transition-colors"
                >
                  Citește
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NewsCard;

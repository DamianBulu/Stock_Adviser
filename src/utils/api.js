// API Configuration
//const ALPHA_VANTAGE_KEY = '22OUPOJD9WBP7FXP'; // Free tier: 25 calls/day
const NEWSDATA_KEY = 'pub_5460c90507744621a2810dc54f1435a5';
//const GEMINI_KEY = 'AIzaSyClioDz6ksmmdsuGyQD1XAvcquOzX5N2po';
const GEMINI_KEY = 'AIzaSyBS7xzwXWGJWwZyfuqlmR4lzc6cUP_Ut3E';
const ALPHA_VANTAGE_KEY = 'OML58IPYMBLIHP4T';
//const ALPHA_VANTAGE_KEY='';
// --- MOCK DATA FOR FALLBACK (When API limit is hit) ---

const MOCK_QUOTE = {
  symbol: 'DEMO (Apple)',
  price: 185.64,
  change: 2.45,
  changePercent: '1.34%',
  volume: '54230000',
  high: 187.00,
  low: 184.20,
  open: 184.50,
  previousClose: 183.19
};

const MOCK_OVERVIEW = {
  symbol: 'DEMO',
  name: 'Apple Inc. (Demo Mode)',
  description: 'Alpha Vantage Rate Limit reached. Showing demo data. Apple Inc. designs, manufactures, and markets smartphones, personal computers, tablets, wearables, and accessories.',
  marketCap: 2800000000000,
  peRatio: 28.5,
  eps: 6.43,
  revenue: 383000000000,
  profitMargin: 25.3,
  fiftyTwoWeekHigh: 199.62,
  fiftyTwoWeekLow: 164.00,
  beta: 1.28,
  dividendYield: 0.005,
  sector: 'Technology',
  industry: 'Consumer Electronics'
};

const getMockHistory = () => {
  const data = [];
  let price = 180;
  const today = new Date();
  for (let i = 30; i > 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    const volatility = (Math.random() - 0.5) * 4;
    price += volatility;
    data.push({
      date: date.toLocaleDateString('ro-RO', { month: 'short', day: 'numeric' }),
      fullDate: date.toISOString().split('T')[0],
      open: price - Math.random(),
      high: price + Math.random(),
      low: price - Math.random(),
      close: price,
      volume: 50000000 + Math.random() * 10000000
    });
  }
  return data;
};
// ------------------------------------------------------

// Industry average P/E ratios for comparison
const INDUSTRY_AVERAGES = {
  'Technology': 28,
  'Consumer Cyclical': 18,
  'Consumer Defensive': 22,
  'Healthcare': 25,
  'Financial Services': 15,
  'Energy': 12,
  'Industrials': 20,
  'Communication Services': 20,
  'Utilities': 18,
  'Real Estate': 25,
  'Basic Materials': 16,
  'default': 20
};

// Alpha Vantage API with Fallback
export const fetchStockQuote = async (symbol) => {
  try {
    const response = await fetch(
      `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${ALPHA_VANTAGE_KEY}`
    );
    const data = await response.json();
    
    // Check for API Limit Note or Error
    if (data['Note'] || data['Information']) {
      console.warn('API Limit reached, using Mock Data for Quote');
      return { ...MOCK_QUOTE, symbol: symbol };
    }

    if (data['Error Message']) {
      throw new Error(data['Error Message']);
    }
    
    const quote = data['Global Quote'];
    if (!quote || !quote['05. price']) {
      // Sometimes empty object means invalid symbol, but mostly API weirdness
      throw new Error('Invalid stock symbol');
    }
    
    return {
      symbol: quote['01. symbol'],
      price: parseFloat(quote['05. price']),
      change: parseFloat(quote['09. change']),
      changePercent: quote['10. change percent'],
      volume: quote['06. volume'],
      high: parseFloat(quote['03. high']),
      low: parseFloat(quote['04. low']),
      open: parseFloat(quote['02. open']),
      previousClose: parseFloat(quote['08. previous close']),
    };
  } catch (error) {
    console.warn(`Fetch quote failed (${error.message}), returning mock data for demo.`);
    return { ...MOCK_QUOTE, symbol: symbol };
  }
};

export const fetchStockOverview = async (symbol) => {
  try {
    const response = await fetch(
      `https://www.alphavantage.co/query?function=OVERVIEW&symbol=${symbol}&apikey=${ALPHA_VANTAGE_KEY}`
    );
    const data = await response.json();
    
    if (data['Note'] || data['Information']) {
      console.warn('API Limit reached, using Mock Data for Overview');
      return { ...MOCK_OVERVIEW, symbol: symbol, name: `${symbol} (Demo Mode)` };
    }

    if (data['Error Message']) {
      throw new Error(data['Error Message']);
    }
    
    if (!data.Symbol) {
      throw new Error('Invalid stock symbol');
    }
    
    return {
      symbol: data.Symbol,
      name: data.Name,
      description: data.Description,
      marketCap: parseFloat(data.MarketCapitalization) || 0,
      peRatio: parseFloat(data.PERatio) || 0,
      eps: parseFloat(data.EPS) || 0,
      revenue: parseFloat(data.RevenueTTM) || 0,
      profitMargin: parseFloat(data.ProfitMargin) || 0,
      fiftyTwoWeekHigh: parseFloat(data['52WeekHigh']) || 0,
      fiftyTwoWeekLow: parseFloat(data['52WeekLow']) || 0,
      beta: parseFloat(data.Beta) || 0,
      dividendYield: parseFloat(data.DividendYield) || 0,
      sector: data.Sector,
      industry: data.Industry,
    };
  } catch (error) {
    console.warn(`Fetch overview failed (${error.message}), returning mock data.`);
    return { ...MOCK_OVERVIEW, symbol: symbol, name: `${symbol} (Demo Mode)` };
  }
};

// Fetch historical stock data for chart
export const fetchStockHistory = async (symbol) => {
  try {
    const response = await fetch(
      `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${symbol}&apikey=${ALPHA_VANTAGE_KEY}&outputsize=compact`
    );
    const data = await response.json();
    
    if (data['Note'] || data['Information']) {
      console.warn('API Limit reached, using Mock Data for History');
      return getMockHistory();
    }

    if (data['Error Message']) {
      throw new Error(data['Error Message']);
    }
    
    const timeSeries = data['Time Series (Daily)'];
    if (!timeSeries) {
      // Sometimes happens on new stocks
      return getMockHistory();
    }
    
    // Convert to array format for chart (last 30 days)
    const dates = Object.keys(timeSeries).sort().slice(-30);
    const chartData = dates.map(date => ({
      date: new Date(date).toLocaleDateString('ro-RO', { month: 'short', day: 'numeric' }),
      fullDate: date,
      open: parseFloat(timeSeries[date]['1. open']),
      high: parseFloat(timeSeries[date]['2. high']),
      low: parseFloat(timeSeries[date]['3. low']),
      close: parseFloat(timeSeries[date]['4. close']),
      volume: parseFloat(timeSeries[date]['5. volume']),
    }));
    
    return chartData; 
  } catch (error) {
    console.warn(`Fetch history failed (${error.message}), returning mock data.`);
    return getMockHistory();
  }
};

// NewsData.io API - Improved filtering for strict relevance
export const fetchCompanyNews = async (symbol) => {
  try {
    // Search with symbol and company name variations for better relevance
    const searchTerms = [
      symbol,
      `${symbol} stock`,
      `${symbol} shares`,
      `${symbol} company`
    ];
    
    // Try multiple searches to get most relevant news
    const allResults = [];
    for (const term of searchTerms.slice(0, 2)) { // Limit to avoid rate limits
      try {
        const response = await fetch(
          `https://newsdata.io/api/1/news?apikey=${NEWSDATA_KEY}&q=${encodeURIComponent(term)}&language=en&category=business&size=10`
        );
        const data = await response.json();
        
        if (data.status === 'success' && data.results) {
          allResults.push(...data.results);
        }
      } catch (err) {
        console.warn(`News search failed for ${term}:`, err);
      }
    }
    
    // Filter for strict relevance - must contain symbol or be clearly related
    const symbolUpper = symbol.toUpperCase();
    const relevantNews = allResults.filter(item => {
      const title = (item.title || '').toUpperCase();
      const description = (item.description || '').toUpperCase();
      const content = `${title} ${description}`;
      
      // Must contain symbol or be clearly stock-related
      return content.includes(symbolUpper) || 
             content.includes('STOCK') || 
             content.includes('SHARES') ||
             content.includes('TRADING') ||
             content.includes('MARKET');
    });
    
    // Remove duplicates and sort by relevance
    const uniqueNews = [];
    const seenTitles = new Set();
    
    for (const item of relevantNews) {
      const titleKey = (item.title || '').toLowerCase();
      if (!seenTitles.has(titleKey)) {
        seenTitles.add(titleKey);
        uniqueNews.push(item);
      }
    }
    
    // Sort by date (most recent first) and take top 4
    uniqueNews.sort((a, b) => {
      const dateA = new Date(a.pubDate || 0);
      const dateB = new Date(b.pubDate || 0);
      return dateB - dateA;
    });
    
    return uniqueNews.slice(0, 4).map(item => ({
      title: item.title,
      description: item.description,
      source: item.source_id,
      date: item.pubDate,
      link: item.link,
      image: item.image_url,
      sentiment: analyzeNewsSentiment(item.title, item.description),
    }));
  } catch (error) {
    console.warn(`Fetch news failed: ${error.message}`);
    return [];
  }
};

// Simple sentiment analysis based on keywords
const analyzeNewsSentiment = (title, description) => {
  const text = `${title} ${description || ''}`.toLowerCase();
  const positiveWords = ['growth', 'profit', 'gain', 'rise', 'surge', 'up', 'beat', 'strong', 'positive', 'bullish', 'success', 'win', 'record', 'high'];
  const negativeWords = ['loss', 'decline', 'fall', 'drop', 'down', 'miss', 'weak', 'negative', 'bearish', 'fail', 'crisis', 'worry', 'concern', 'risk'];
  
  let positiveCount = 0;
  let negativeCount = 0;
  
  positiveWords.forEach(word => {
    if (text.includes(word)) positiveCount++;
  });
  
  negativeWords.forEach(word => {
    if (text.includes(word)) negativeCount++;
  });
  
  if (positiveCount > negativeCount) return 'positive';
  if (negativeCount > positiveCount) return 'negative';
  return 'neutral';
};

// Get industry average for comparison
export const getIndustryAverage = (sector) => {
  return INDUSTRY_AVERAGES[sector] || INDUSTRY_AVERAGES.default;
};

// Calculate overall sentiment from news
export const calculateOverallSentiment = (news) => {
  if (!news || news.length === 0) return 'neutral';
  
  const sentiments = news.map(n => n.sentiment || 'neutral');
  const positiveCount = sentiments.filter(s => s === 'positive').length;
  const negativeCount = sentiments.filter(s => s === 'negative').length;
  
  if (positiveCount > negativeCount) return 'positive';
  if (negativeCount > positiveCount) return 'negative';
  return 'neutral';
};

// Calculate Technical Indicators (1-day timeframe)
export const calculateTechnicalIndicators = (chartData, currentPrice) => {
  if (!chartData || chartData.length < 14) {
    return {
      rsi: 50,
      macd: { value: 0, signal: 0, histogram: 0 },
      sma20: currentPrice,
      sma50: currentPrice,
      volume: { current: 0, average: 0, ratio: 1 },
      volatility: 0
    };
  }

  const closes = chartData.map(d => d.close).reverse();
  const volumes = chartData.map(d => d.volume).reverse();
  const prices = closes;

  // RSI (Relative Strength Index) - 14 period
  const calculateRSI = (prices, period = 14) => {
    if (prices.length < period + 1) return 50;
    
    let gains = 0;
    let losses = 0;
    
    for (let i = 1; i <= period; i++) {
      const change = prices[i] - prices[i - 1];
      if (change > 0) gains += change;
      else losses += Math.abs(change);
    }
    
    const avgGain = gains / period;
    const avgLoss = losses / period;
    
    if (avgLoss === 0) return 100;
    const rs = avgGain / avgLoss;
    return 100 - (100 / (1 + rs));
  };

  // MACD (Moving Average Convergence Divergence)
  const calculateEMA = (prices, period) => {
    const multiplier = 2 / (period + 1);
    let ema = prices.slice(0, period).reduce((a, b) => a + b, 0) / period;
    
    for (let i = period; i < prices.length; i++) {
      ema = (prices[i] * multiplier) + (ema * (1 - multiplier));
    }
    return ema;
  };

  const ema12 = calculateEMA(prices, 12);
  const ema26 = calculateEMA(prices, 26);
  const macdLine = ema12 - ema26;
  const signalLine = calculateEMA([macdLine], 9);
  const histogram = macdLine - signalLine;

  // Simple Moving Averages
  const calculateSMA = (prices, period) => {
    if (prices.length < period) return prices[prices.length - 1];
    const sum = prices.slice(-period).reduce((a, b) => a + b, 0);
    return sum / period;
  };

  const sma20 = calculateSMA(prices, 20);
  const sma50 = calculateSMA(prices, Math.min(50, prices.length));

  // Volume Analysis
  const currentVolume = volumes[volumes.length - 1] || 0;
  const avgVolume = volumes.slice(-20).reduce((a, b) => a + b, 0) / Math.min(20, volumes.length);
  const volumeRatio = avgVolume > 0 ? currentVolume / avgVolume : 1;

  // Volatility (Standard Deviation of returns)
  const returns = [];
  for (let i = 1; i < prices.length; i++) {
    returns.push((prices[i] - prices[i - 1]) / prices[i - 1]);
  }
  const avgReturn = returns.reduce((a, b) => a + b, 0) / returns.length;
  const variance = returns.reduce((sum, r) => sum + Math.pow(r - avgReturn, 2), 0) / returns.length;
  const volatility = Math.sqrt(variance) * 100; // As percentage

  return {
    rsi: Math.round(calculateRSI(closes) * 100) / 100,
    macd: {
      value: Math.round(macdLine * 100) / 100,
      signal: Math.round(signalLine * 100) / 100,
      histogram: Math.round(histogram * 100) / 100
    },
    sma20: Math.round(sma20 * 100) / 100,
    sma50: Math.round(sma50 * 100) / 100,
    volume: {
      current: currentVolume,
      average: Math.round(avgVolume),
      ratio: Math.round(volumeRatio * 100) / 100
    },
    volatility: Math.round(volatility * 100) / 100
  };
};

// Google Gemini API
export const analyzeStockWithAI = async (stockData, overviewData, news, technicalIndicators) => {
  try {
    // Calculate news sentiment
    const newsSentiment = calculateOverallSentiment(news);
    const industryAvgPE = getIndustryAverage(overviewData.sector);
    const peComparison = overviewData.peRatio > 0 
      ? ((overviewData.peRatio / industryAvgPE - 1) * 100).toFixed(1)
      : 0;
    
    // Build news summary for context
    const newsSummary = news.length > 0 
      ? news.slice(0, 3).map(n => `- ${n.title}`).join('\n')
      : 'Nu sunt știri disponibile';
    
    // Technical indicators summary
    const indicatorsSummary = technicalIndicators ? `
INDICATORI TEHNICI (1 zi):
- RSI (14): ${technicalIndicators.rsi} ${technicalIndicators.rsi > 70 ? '(Overbought)' : technicalIndicators.rsi < 30 ? '(Oversold)' : '(Neutral)'}
- MACD: ${technicalIndicators.macd.value.toFixed(2)} | Signal: ${technicalIndicators.macd.signal.toFixed(2)} | Histogram: ${technicalIndicators.macd.histogram.toFixed(2)}
- SMA 20: $${technicalIndicators.sma20.toFixed(2)} | SMA 50: $${technicalIndicators.sma50.toFixed(2)}
- Volume Ratio: ${technicalIndicators.volume.ratio.toFixed(2)}x (${technicalIndicators.volume.ratio > 1.5 ? 'High' : technicalIndicators.volume.ratio < 0.5 ? 'Low' : 'Normal'})
- Volatilitate: ${technicalIndicators.volatility.toFixed(2)}%
` : '';
    
    const prompt = `Ești un analist financiar expert cu experiență în evaluarea companiilor și analiza tehnică. Analizează următoarea companie folosind datele financiare concrete, indicatori tehnici și oferă o analiză detaliată.

CONTEXT PENTRU ANALIZĂ:
- Compară P/E Ratio cu media industriei (${overviewData.sector}: ~${industryAvgPE})
- Ia în considerare growth rate și perspective viitoare
- Analizează news sentiment (${newsSentiment})
- Oferă perspective echilibrate (bull & bear case)
- Folosește datele financiare concrete pentru calcule

DATE COMPANIE:
- Symbol: ${stockData.symbol}
- Preț curent: $${stockData.price}
- Variație zilnică: ${stockData.change >= 0 ? '+' : ''}${stockData.change.toFixed(2)} (${stockData.changePercent})
- P/E Ratio: ${overviewData.peRatio.toFixed(2)} (Media industrie ${overviewData.sector}: ~${industryAvgPE}, Diferență: ${peComparison}%)
- Market Cap: $${(overviewData.marketCap / 1e9).toFixed(2)}B
- Revenue TTM: $${(overviewData.revenue / 1e9).toFixed(2)}B
- Profit Margin: ${overviewData.profitMargin.toFixed(2)}%
- EPS: $${overviewData.eps.toFixed(2)}
- Beta: ${overviewData.beta.toFixed(2)} (volatilitate)
- 52 Week High: $${overviewData.fiftyTwoWeekHigh.toFixed(2)}
- 52 Week Low: $${overviewData.fiftyTwoWeekLow.toFixed(2)}
- Sector: ${overviewData.sector}
- Industry: ${overviewData.industry}

${indicatorsSummary}
ȘTIRI RECENTE (sentiment: ${newsSentiment}):
${newsSummary}

INSTRUCȚIUNI:
1. Analizează indicatorii tehnici (RSI, MACD, Moving Averages) pentru semnale de cumpărare/vânzare
2. Evaluează volumul tranzacționat (volume ratio) pentru confirmare
3. Consideră volatilitatea pentru evaluarea riscului
1. Calculează estimatedFairValue bazat pe P/E comparativ, growth prospects, și fundamentale
2. Compară P/E cu media industriei (tech ~25-30, retail ~15-20, healthcare ~25)
3. Evaluează dacă prețul actual este sub/supra/corect evaluat
4. Oferă raționament clar cu 3-5 puncte cheie
5. Prezintă ambele perspective: bull case (optimist) și bear case (pesimist)
6. Asignează un confidence score (1-10) bazat pe calitatea datelor

Răspunde DOAR cu JSON valid în acest format exact:
{
  "estimatedFairValue": <număr>,
  "verdict": "SUBEVALUATĂ" | "SUPRAEVALUATĂ" | "CORECT EVALUATĂ",
  "reasoning": ["punct 1", "punct 2", "punct 3", "punct 4", "punct 5"],
  "confidenceScore": <1-10>,
  "bullCase": "<text scurt optimist>",
  "bearCase": "<text scurt pesimist>"
}

Fără text suplimentar, doar JSON.`;

    // Use gemini-2.5-flash for better performance
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }]
        }),
      }
    );

    const data = await response.json();
    
    if (!response.ok || !data.candidates || !data.candidates[0]) {
      throw new Error(data.error?.message || 'Failed to get AI analysis');
    }

    const text = data.candidates[0].content.parts[0].text;
    
    // Extract JSON from response (handle markdown code blocks)
    let jsonText = text.trim();
    if (jsonText.startsWith('```')) {
      jsonText = jsonText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    }
    
    // Try to extract JSON object if wrapped in text
    const jsonMatch = jsonText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      jsonText = jsonMatch[0];
    }
    
    let analysis;
    try {
      analysis = JSON.parse(jsonText);
    } catch (parseError) {
      // Fallback if JSON parsing fails
      analysis = {
        estimatedFairValue: 0,
        verdict: 'CORECT EVALUATĂ',
        reasoning: ['Analiza nu a putut fi procesată complet'],
        confidenceScore: 5,
        bullCase: 'Date insuficiente pentru analiză',
        bearCase: 'Date insuficiente pentru analiză',
      };
    }
    
    return {
      estimatedFairValue: analysis.estimatedFairValue || 0,
      verdict: analysis.verdict || 'CORECT EVALUATĂ',
      reasoning: analysis.reasoning || [],
      confidenceScore: analysis.confidenceScore || 5,
      bullCase: analysis.bullCase || '',
      bearCase: analysis.bearCase || '',
    };
  } catch (error) {
    throw new Error(`Failed to analyze stock: ${error.message}`);
  }
};

export const chatWithAI = async (question, stockData, overviewData, verdict) => {
  try {
    const industryAvgPE = getIndustryAverage(overviewData.sector);
    const prompt = `Ești un asistent financiar expert. Răspunde concis și practic la întrebarea:
"${question}"

CONTEXT COMPANIE ${stockData.symbol}:
- Preț curent: $${stockData.price}
- Variație zilnică: ${stockData.change >= 0 ? '+' : ''}${stockData.change.toFixed(2)} (${stockData.changePercent})
- P/E Ratio: ${overviewData.peRatio.toFixed(2)} (Media industrie ${overviewData.sector}: ~${industryAvgPE})
- Market Cap: $${(overviewData.marketCap / 1e9).toFixed(2)}B
- Revenue: $${(overviewData.revenue / 1e9).toFixed(2)}B
- Profit Margin: ${overviewData.profitMargin.toFixed(2)}%
- EPS: $${overviewData.eps.toFixed(2)}
- Beta: ${overviewData.beta.toFixed(2)}
- Sector: ${overviewData.sector}
- Verdict AI anterior: ${verdict}
- 52W Range: $${overviewData.fiftyTwoWeekLow.toFixed(2)} - $${overviewData.fiftyTwoWeekHigh.toFixed(2)}

KNOWLEDGE BASE:
- Compară P/E cu media industriei pentru context
- Tech sector: P/E normal ~25-30
- Retail sector: P/E normal ~15-20
- Healthcare: P/E normal ~25
- Beta > 1 = mai volatil decât piața, Beta < 1 = mai stabil
- Profit margin > 15% = bun, < 5% = slab

Răspunde în 1-3 propoziții, clar, acționabil, și bazat pe date concrete.`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }]
        }),
      }
    );

    const data = await response.json();
    
    if (!response.ok || !data.candidates || !data.candidates[0]) {
      throw new Error(data.error?.message || 'Failed to get AI response');
    }

    return data.candidates[0].content.parts[0].text.trim();
  } catch (error) {
    throw new Error(`Failed to get chat response: ${error.message}`);
  }
};
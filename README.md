# Hermes - AI Stock Analysis Platform

Aplicatie web React pentru analiza companiilor și acțiunilor folosind AI, construită pentru hackathon.

## 🚀 Features

- **Autentificare simplă** - Login hardcodat (username: `damian`, password: `damian123`)
- **Căutare companii** - Search după simbol (AAPL, TSLA, MSFT, etc.)
- **Informații acțiuni** - Preț real-time, P/E Ratio, Market Cap, EPS, Revenue, etc.
- **Știri relevante** - Ultimele 2-4 știri despre companie
- **AI Analysis** - Analiză automată cu:
  - Fair value estimat
  - Verdict (SUBEVALUATĂ/SUPRAEVALUATĂ/CORECT EVALUATĂ)
  - Raționament detaliat
  - Confidence score (1-10)
  - Bull & Bear case
- **AI Chat** - Chat interactiv pentru întrebări despre companie

## 🛠️ Tech Stack

- React 18+
- Vite
- Tailwind CSS
- Lucide React (icons)
- Alpha Vantage API (stock data)
- NewsData.io API (news)
- Google Gemini API (AI analysis)

## 📦 Instalare

```bash
  npm install
```

## 🏃 Rulare

```bash
  npm run dev
```

Aplicația va rula pe `http://localhost:5173`

## 🔑 Credentials

- **Username:** `damian`
- **Password:** `damian123`

## 📝 Note

- Alpha Vantage free tier: 5 calls/minute
- No database - toate datele sunt în React state
- No localStorage - conform restricțiilor

## 🎯 Demo Companies

Testează cu:
- AAPL (Apple)
- TSLA (Tesla)
- MSFT (Microsoft)
- GOOGL (Google)





import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles } from 'lucide-react';
import { chatWithAI } from '../utils/api';

const ChatInterface = ({ stockData, overviewData, analysis, news }) => {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: `Salut! Sunt asistentul tău financiar. Întreabă-mă orice despre ${stockData?.symbol || 'companie'}.` }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Auto-scroll
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  useEffect(scrollToBottom, [messages]);

  const handleSend = async (textToSend) => {
    const messageText = textToSend || input;
    if (!messageText.trim() || !stockData || !overviewData) return;

    // 1. Add User Message
    const newMessages = [...messages, { role: 'user', content: messageText }];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
      // 2. Get AI Response using FULL context
      const response = await chatWithAI(messageText, stockData, overviewData, analysis?.verdict || '', news);

      // 3. Add AI Message
      setMessages([...newMessages, { role: 'assistant', content: response }]);
    } catch (error) {
      setMessages([...newMessages, { role: 'assistant', content: "Eroare de conexiune. Mai încearcă o dată." }]);
    } finally {
      setLoading(false);
    }
  };

  const quickQuestions = [
    "Este un moment bun de cumpărare?",
    "Care sunt riscurile principale?",
    "De ce este prețul așa volatil?",
    "Compară cu media industriei"
  ];

  if (!stockData || !overviewData) {
    return (
      <div className="bg-slate-800 rounded-xl shadow-lg border border-slate-700 p-6 flex flex-col h-[600px]">
        <p className="text-slate-400 text-center py-8">
          Caută o companie pentru a începe conversația.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-slate-800 rounded-xl shadow-lg flex flex-col h-full border border-slate-700">
      {/* Header */}
      <div className="p-4 border-b border-slate-700 bg-slate-700/30 rounded-t-xl flex items-center gap-2">
        <div className="bg-cyan-500/20 p-2 rounded-full">
          <Sparkles className="w-5 h-5 text-cyan-400" />
        </div>
        <div>
          <h3 className="font-bold text-slate-100">AI Financial Advisor</h3>
          <p className="text-xs text-slate-400">Powered by Gemini 2.5 Flash</p>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-900/50">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            {msg.role === 'assistant' && (
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center flex-shrink-0">
                <Bot className="w-5 h-5 text-white" />
              </div>
            )}

            <div className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm leading-relaxed shadow-lg ${
              msg.role === 'user'
                ? 'bg-gradient-to-br from-cyan-600 to-blue-600 text-white rounded-tr-none'
                : 'bg-slate-700 border border-slate-600 text-slate-200 rounded-tl-none'
            }`}>
              {msg.content}
            </div>

            {msg.role === 'user' && (
              <div className="w-8 h-8 rounded-full bg-slate-700 border border-slate-600 flex items-center justify-center flex-shrink-0">
                <User className="w-5 h-5 text-slate-300" />
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div className="flex gap-3">
             <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center">
                <Bot className="w-5 h-5 text-white" />
              </div>
            <div className="bg-slate-700 border border-slate-600 px-4 py-3 rounded-2xl rounded-tl-none shadow-lg">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Actions */}
      <div className="px-4 py-2 bg-slate-800 border-t border-slate-700 overflow-x-auto whitespace-nowrap">
        <div className="flex gap-2">
          {quickQuestions.map((q, i) => (
            <button
              key={i}
              onClick={() => handleSend(q)}
              disabled={loading}
              className="px-3 py-1 text-xs font-medium bg-slate-700 text-cyan-400 rounded-full hover:bg-slate-600 transition-colors border border-slate-600"
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* Input Area */}
      <div className="p-4 bg-slate-800 border-t border-slate-700 rounded-b-xl">
        <form
          onSubmit={(e) => { e.preventDefault(); handleSend(); }}
          className="flex gap-2 relative"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Întreabă despre P/E, riscuri, dividende..."
            disabled={loading}
            className="flex-1 pl-4 pr-12 py-3 bg-slate-700 border border-slate-600 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition-all text-sm text-slate-100 placeholder-slate-500"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="absolute right-2 top-1.5 p-1.5 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-lg hover:from-cyan-500 hover:to-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatInterface;

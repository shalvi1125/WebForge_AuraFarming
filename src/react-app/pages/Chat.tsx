import { useEffect, useState, useRef, KeyboardEvent, ChangeEvent } from 'react';
import { Link } from 'react-router';
import {
  ArrowLeft, Send, BrainCircuit, User,
  Clock, Sparkles, Loader2, ArrowRight,
  Maximize2, Minimize2, Building2,
  AlertCircle, Calendar, ShieldCheck, BarChart3,
} from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

// ── AI capability cards shown on empty state ───────────────
const capabilities = [
  { icon: AlertCircle, title: 'Complaint Analysis', desc: 'Get guidance on filing and tracking hostel complaints', color: 'text-rose-600', bg: 'bg-rose-50' },
  { icon: Calendar,    title: 'Leave Guidance',      desc: 'Understand leave policies and how to apply',           color: 'text-amber-600', bg: 'bg-amber-50' },
  { icon: ShieldCheck, title: 'Hostel Support',      desc: 'Answers on hostel rules, policies, and procedures',    color: 'text-indigo-600', bg: 'bg-indigo-50' },
  { icon: BarChart3,   title: 'Occupancy Insights',  desc: 'Information on room allocation and availability',      color: 'text-cyan-600',   bg: 'bg-cyan-50' },
];

// ── Suggested prompts ──────────────────────────────────────
const quickPrompts = [
  '📋 How do I apply for leave?',
  '🚿 My room has a water leakage issue.',
  '📜 What are the hostel rules?',
  '💳 How do I pay hostel fees?',
  '🔄 How can I request a room change?',
  '👤 What documents are required for a visitor pass?',
  '⏰ What is the hostel curfew timing?',
  '📦 How do I report a broken furniture item?',
  '🌐 Why is the hostel Wi-Fi not working?',
  '🏥 What should I do in a medical emergency?',
];

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [expanded, setExpanded] = useState(false);
  const [statusText, setStatusText] = useState<string | null>(null);
  const [statusTrail, setStatusTrail] = useState<string[]>([]);
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const userPreferences = user.preferences || {};

  useEffect(() => {
    const welcomeMessage: Message = {
      id: '1',
      role: 'assistant',
      content: "👋 Hello! I'm the HostelIQ AI Assistant.\n\nI can help you with hostel policies, leave applications, complaint guidance, fee information, room allocation questions, and general hostel support.\n\nHow can I assist you today?",
      timestamp: new Date(),
    };
    setMessages([welcomeMessage]);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue,
      timestamp: new Date(),
    };

    setMessages((prev: Message[]) => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    const assistantId = (Date.now() + 1).toString();
    const assistantMessage: Message = {
      id: assistantId,
      role: 'assistant',
      content: '',
      timestamp: new Date(),
    };
    setMessages((prev: Message[]) => [...prev, assistantMessage]);

    try {
      setStatusText('Thinking...');
      setStatusTrail([]);

      const historyForServer = [...messages, userMessage].map(m => ({
        role: m.role,
        content: m.content,
      }));

      const res = await fetch('/api/agent/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: historyForServer,
          userPreferences,
        }),
      });

      if (!res.ok || !res.body) throw new Error('Agent request failed');

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let done = false;
      let buffer = '';

      while (!done) {
        const { value, done: doneReading } = await reader.read();
        done = doneReading;
        if (value) {
          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n');
          buffer = lines.pop() || '';
          for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed) continue;
            try {
              const obj = JSON.parse(trimmed);
              if (obj?.type === 'status' && typeof obj.text === 'string') {
                setStatusText((obj as { text: string }).text);
                setStatusTrail((prev: string[]) =>
                  prev.length && prev[prev.length - 1] === (obj as { text: string }).text
                    ? prev
                    : [...prev.slice(-2), (obj as { text: string }).text]
                );
              } else if (obj?.type === 'final' && typeof (obj as { text?: string }).text === 'string') {
                setMessages((prev: Message[]) =>
                  prev.map((msg: Message) => msg.id === assistantId ? { ...msg, content: (obj as { text: string }).text } : msg)
                );
              }
            } catch {
              // ignore parse errors
            }
          }
        }
      }
    } catch {
      setMessages((prev: Message[]) =>
        prev.map((msg: Message) =>
          msg.id === assistantId
            ? { ...msg, content: 'Sorry, something went wrong. Please try again.' }
            : msg
        )
      );
    } finally {
      setIsLoading(false);
      setStatusText(null);
      setStatusTrail([]);
    }
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Render assistant content — preserves markdown image support
  const renderAssistantContent = (content: string) => {
    const parts: Array<{ type: 'text' | 'image'; value: string; alt?: string }> = [];
    const imgRegex = /!\[([^\]]*)\]\((https?:\/\/[^)\s]+)\)/g;
    let lastIndex = 0;
    let match: RegExpExecArray | null;
    while ((match = imgRegex.exec(content)) !== null) {
      const [full, alt, url] = match;
      if (match.index > lastIndex) {
        parts.push({ type: 'text', value: content.slice(lastIndex, match.index) });
      }
      parts.push({ type: 'image', value: url, alt });
      lastIndex = match.index + full.length;
    }
    if (lastIndex < content.length) {
      parts.push({ type: 'text', value: content.slice(lastIndex) });
    }
    return (
      <div className="space-y-3">
        {parts.map((part, i) =>
          part.type === 'image' ? (
            <img
              key={i}
              src={part.value}
              alt={part.alt || ''}
              className="max-w-full rounded-xl shadow-md border border-indigo-100"
              loading="lazy"
            />
          ) : (
            <p key={i} className="whitespace-pre-line text-sm leading-relaxed">
              {part.value}
            </p>
          )
        )}
      </div>
    );
  };

  // Layout variables — preserved from original
  const contentWidthClass    = expanded ? 'w-full max-w-none' : 'max-w-4xl';
  const containerWidthClass  = expanded ? 'w-screen max-w-none px-0' : 'max-w-5xl px-6';
  const containerPaddingY    = expanded ? 'py-0' : 'py-6';
  const containerHeightClass = expanded ? 'h-screen' : 'h-[calc(100vh-72px)]';
  const headerPad            = expanded ? 'p-3' : 'p-5';
  const headerRadius         = expanded ? 'rounded-none' : 'rounded-t-2xl';
  const inputRadius          = expanded ? 'rounded-none' : 'rounded-b-2xl';
  const messagesPad          = expanded ? 'p-6' : 'p-6';
  const messagesBorders      = expanded ? '' : 'border-l border-r';
  const inputPad             = expanded ? 'p-4' : 'p-5';
  const containerMarginX     = expanded ? '' : 'mx-auto';
  const avatarSize           = expanded ? 'w-8 h-8' : 'w-10 h-10';
  const brainIconSize        = expanded ? 'w-4 h-4' : 'w-5 h-5';
  const titleSize            = expanded ? 'text-base' : 'text-lg';

  return (
    <div className="min-h-screen bg-gray-50">

      {/* ── Navbar ── */}
      {!expanded && (
        <nav className="bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm">
          <div className="max-w-5xl mx-auto px-6 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Link to="/student/dashboard" className="flex items-center space-x-1.5 text-gray-500 hover:text-indigo-600 transition-colors text-sm font-medium">
                  <ArrowLeft className="w-4 h-4" />
                  <span>Dashboard</span>
                </Link>
                <div className="w-px h-5 bg-gray-200" />
                <Link to="/" className="flex items-center space-x-2">
                  <div className="w-7 h-7 bg-gradient-to-br from-indigo-600 to-blue-600 rounded-lg flex items-center justify-center">
                    <Building2 className="w-3.5 h-3.5 text-white" />
                  </div>
                  <span className="font-bold text-gray-900 text-sm">HostelIQ</span>
                </Link>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center space-x-1.5 bg-green-50 text-green-700 px-3 py-1.5 rounded-full border border-green-200 text-xs font-medium">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                  <span>AI Online</span>
                </div>
              </div>
            </div>
          </div>
        </nav>
      )}

      {/* ── Chat Container ── */}
      <div className={`${containerWidthClass} ${containerMarginX} ${containerPaddingY} ${containerHeightClass} flex flex-col`}>

        {/* Header */}
        <div className={`bg-white ${headerRadius} border border-gray-100 ${headerPad} border-b-0 shadow-sm`}>
          <div className="flex items-center space-x-3">
            <div className={`${avatarSize} bg-gradient-to-br from-indigo-600 to-blue-600 rounded-xl flex items-center justify-center shadow-md`}>
              <BrainCircuit className={`${brainIconSize} text-white`} />
            </div>
            <div className="flex-1">
              <h2 className={`${titleSize} font-bold text-gray-900`}>HostelIQ AI Assistant</h2>
              {!expanded && (
                <p className="text-gray-400 text-xs mt-0.5">Powered by AI · Hostel support, leave, complaints, fees & more</p>
              )}
            </div>
            <div className="flex items-center gap-2">
              {!expanded && (
                <div className="hidden sm:flex items-center space-x-1.5 bg-green-50 text-green-700 px-3 py-1.5 rounded-full text-xs font-medium border border-green-200">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                  <span>Online</span>
                </div>
              )}
              <button
                onClick={() => setExpanded((v: boolean) => !v)}
                className="p-2 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 hover:text-indigo-600 transition-colors"
                aria-label={expanded ? 'Collapse' : 'Expand'}
              >
                {expanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>

        {/* Messages Area */}
        <div className={`flex-1 bg-white ${messagesBorders} border-gray-100 ${messagesPad} overflow-y-auto shadow-sm`}>

          {/* Empty state: capability cards + prompts shown before messages stack up */}
          {messages.length <= 1 && !isLoading && (
            <div className="mb-8">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">What I can help with</p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                {capabilities.map(c => {
                  const Icon = c.icon;
                  return (
                    <div key={c.title} className={`${c.bg} rounded-xl p-3 border border-transparent`}>
                      <Icon className={`w-5 h-5 ${c.color} mb-2`} />
                      <p className="text-xs font-semibold text-gray-700">{c.title}</p>
                      <p className="text-xs text-gray-400 mt-0.5 leading-snug">{c.desc}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <div className="space-y-5">
            {messages.map((message: Message) => (
              <div key={message.id} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`flex items-start space-x-3 ${contentWidthClass} ${message.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                  {/* Avatar */}
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 shadow-sm ${
                    message.role === 'user'
                      ? 'bg-gradient-to-br from-indigo-100 to-blue-100 border border-indigo-200'
                      : 'bg-gradient-to-br from-indigo-600 to-blue-600'
                  }`}>
                    {message.role === 'user'
                      ? <User className="w-4 h-4 text-indigo-600" />
                      : <BrainCircuit className="w-4 h-4 text-white" />
                    }
                  </div>

                  {/* Bubble */}
                  <div className={`rounded-2xl px-4 py-3 shadow-sm border text-sm ${
                    message.role === 'user'
                      ? 'bg-gradient-to-br from-indigo-600 to-blue-600 text-white border-indigo-500 max-w-xs sm:max-w-sm'
                      : 'bg-white text-gray-800 border-gray-100 flex-1'
                  }`}>
                    {message.role === 'assistant'
                      ? renderAssistantContent(message.content)
                      : <p className="whitespace-pre-line leading-relaxed">{message.content}</p>
                    }
                    <p className={`text-xs mt-2 ${message.role === 'user' ? 'text-indigo-200' : 'text-gray-400'}`}>
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              </div>
            ))}

            {/* Loading indicator — preserved exactly */}
            {isLoading && (
              <div className="flex justify-start">
                <div className={`flex items-start space-x-3 ${contentWidthClass}`}>
                  <div className="w-8 h-8 bg-gradient-to-br from-indigo-600 to-blue-600 rounded-xl flex items-center justify-center shadow-sm">
                    <BrainCircuit className="w-4 h-4 text-white" />
                  </div>
                  <div className="bg-white rounded-2xl px-4 py-3 shadow-sm border border-gray-100">
                    <div className="flex items-center space-x-2">
                      <Loader2 className="w-4 h-4 animate-spin text-indigo-500" />
                      <span className="text-gray-500 text-sm">{statusText || 'AI is thinking...'}</span>
                    </div>
                    {statusTrail.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {statusTrail.map((s: string, i: number) => (
                          <span key={i} className="px-2 py-0.5 rounded-full text-xs bg-indigo-50 text-indigo-600 border border-indigo-100">
                            {s}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Quick Prompts — shown only on initial state */}
        {!expanded && messages.length <= 1 && !isLoading && (
          <div className="bg-white border-l border-r border-gray-100 px-5 py-4 border-t border-gray-50">
            <p className="text-xs text-gray-400 font-medium mb-2.5">✨ Suggested questions</p>
            <div className="flex flex-wrap gap-2">
              {quickPrompts.map((prompt, index) => (
                <button
                  key={index}
                  onClick={() => setInputValue(prompt)}
                  className="bg-gray-50 text-gray-600 hover:bg-indigo-50 hover:text-indigo-700 hover:border-indigo-200 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-150 border border-gray-200"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input Area */}
        <div className={`bg-white ${inputRadius} border border-gray-100 ${inputPad} border-t-0 shadow-sm`}>
          <div className="flex items-end space-x-3">
            <div className="flex-1">
              <textarea
                value={inputValue}
                onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask about leave, complaints, fees, hostel rules, visitor passes..."
                className="w-full resize-none border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition-all text-sm bg-gray-50 placeholder-gray-400"
                rows={2}
                disabled={isLoading}
              />
            </div>
            <button
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isLoading}
              className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white p-3 rounded-xl hover:from-indigo-700 hover:to-blue-700 transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed shadow-md hover:shadow-indigo-200 hover:shadow-lg"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>

          <div className="flex items-center justify-between mt-3 text-xs text-gray-400">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1.5">
                <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                <span>AI-powered responses</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <Clock className="w-3.5 h-3.5 text-indigo-400" />
                <span>Instant support</span>
              </div>
            </div>
            <p>Press Enter to send</p>
          </div>
        </div>

        {/* Footer actions */}
        {!expanded && (
          <div className="mt-5 flex justify-center space-x-4">
            <Link
              to="/student/dashboard"
              className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white px-6 py-2.5 rounded-xl hover:from-indigo-700 hover:to-blue-700 transition-all flex items-center space-x-2 text-sm font-semibold shadow-md hover:shadow-indigo-200 hover:shadow-lg"
            >
              <span>Back to Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/"
              className="border border-indigo-200 text-indigo-600 px-6 py-2.5 rounded-xl hover:bg-indigo-50 transition-all flex items-center space-x-2 text-sm font-semibold bg-white shadow-sm"
            >
              <Building2 className="w-4 h-4" />
              <span>Home</span>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

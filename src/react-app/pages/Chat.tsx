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
  { icon: AlertCircle, title: 'Complaint Analysis', desc: 'AI categorization, priority prediction, and escalation guidance' },
  { icon: Calendar,    title: 'Leave Guidance',      desc: 'Policy answers, application help, and approval tracking' },
  { icon: ShieldCheck, title: 'Hostel Support',      desc: 'Rules, curfew, mess timings, and procedure answers' },
  { icon: BarChart3,   title: 'Smart Insights',      desc: 'Occupancy, fee status, and personalized recommendations' },
];

const aiActions = [
  { label: 'Escalate CMP-041', desc: 'Flag water leakage to warden' },
  { label: 'Check leave status', desc: 'LV-014 pending review' },
  { label: 'Pay outstanding fees', desc: '₹4,500 due 30 Jun' },
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
  const mockResponses: Record<string, string> = {
    leave: "To apply for leave in HostelIQ:\n\n1. Go to **Leave Management** from your dashboard\n2. Click **Apply for Leave** and fill in dates + reason\n3. Your warden (Dr. Priya Mehta) will review within 24 hours\n4. Once approved, security is notified automatically\n\n📋 You have **18 leave days** remaining this semester. Your pending request LV-014 is awaiting warden approval.",
    complaint: "For your water leakage complaint (CMP-041):\n\n✅ **Status:** In Progress — assigned to Rajan Kumar (Plumbing)\n🔴 **Priority:** High (AI-detected based on duration)\n⏱️ **Expected resolution:** 16 Jun 2025\n\nI've flagged this as high priority since it's been open 6 days. Would you like me to escalate to the warden?",
    fee: "Your fee summary:\n\n💳 **Outstanding:** ₹4,500 (Mess Fee + Late Fee)\n📅 **Due date:** 30 Jun 2025\n✅ **Last payment:** ₹8,000 on 01 May\n\nPay before 25 Jun to avoid additional late fees. You can pay via the **Fee Management** page on your dashboard.",
    visitor: "Visitor pass requirements:\n\n📄 Valid government ID of visitor\n📱 Pre-registration at least 24 hours ahead\n👤 Maximum 2 visitors per room at a time\n⏰ Visiting hours: 10 AM – 6 PM\n\nGo to **Visitor Management** to register a new visitor and generate a QR pass.",
    rule: "Key hostel rules for Tagore Hostel:\n\n⏰ Curfew: 10:00 PM (extended to 11 PM during fest week)\n🚫 No cooking in rooms\n🔇 Quiet hours: 11 PM – 6 AM\n📦 Report maintenance issues via the complaint portal\n👥 Visitors must check in at the gate with QR pass",
    default: "I'm the HostelIQ AI Assistant. I can help with:\n\n• Leave applications and policies\n• Complaint tracking and escalation\n• Fee payments and dues\n• Visitor pass registration\n• Room allocation queries\n• Hostel rules and procedures\n\nWhat would you like help with?",
  };

  const getMockResponse = (input: string): string => {
    const lower = input.toLowerCase();
    if (lower.includes('leave') || lower.includes('apply')) return mockResponses.leave;
    if (lower.includes('complaint') || lower.includes('leak') || lower.includes('wi-fi') || lower.includes('water')) return mockResponses.complaint;
    if (lower.includes('fee') || lower.includes('pay') || lower.includes('₹')) return mockResponses.fee;
    if (lower.includes('visitor') || lower.includes('pass') || lower.includes('guest')) return mockResponses.visitor;
    if (lower.includes('rule') || lower.includes('curfew') || lower.includes('policy')) return mockResponses.rule;
    return mockResponses.default;
  };

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
      setStatusText('Analyzing your query...');
      setStatusTrail(['Checking hostel policies', 'Reviewing your profile']);

      await new Promise((r) => setTimeout(r, 1200));

      const responseText = getMockResponse(userMessage.content);
      setMessages((prev: Message[]) =>
        prev.map((msg: Message) => msg.id === assistantId ? { ...msg, content: responseText } : msg)
      );
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
              className="max-w-full rounded-xl shadow-md border border-[#071B34]/10"
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
    <div className={`min-h-screen ${expanded ? 'bg-[#071B34]' : 'bg-[#F5F7FA]'}`}>
      {!expanded && (
        <div className="gradient-mesh-hero relative">
          <div className="glow-orb w-[500px] h-[500px] bg-[#4CC9F0]/10 top-0 left-1/4" />
          <nav className="gradient-mesh-content border-b border-white/5 sticky top-0 z-50">
            <div className="max-w-5xl mx-auto px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Link to="/student/dashboard" className="flex items-center space-x-1.5 text-[#4A5568] hover:text-[#4CC9F0] transition-colors text-sm font-medium">
                    <ArrowLeft className="w-4 h-4" /><span>Dashboard</span>
                  </Link>
                  <div className="w-px h-5 bg-white/10" />
                  <Link to="/" className="flex items-center space-x-2">
                    <div className="w-7 h-7 bg-[#1B4F72] rounded-lg flex items-center justify-center">
                      <Building2 className="w-3.5 h-3.5 text-[#F8FAFC]" />
                    </div>
                    <span className="font-semibold text-[#F8FAFC] text-sm">HostelIQ</span>
                  </Link>
                </div>
                <div className="flex items-center gap-1.5 text-[#4CC9F0] text-xs font-medium">
                  <div className="w-1.5 h-1.5 bg-[#4CC9F0] rounded-full animate-pulse" /><span>AI Online</span>
                </div>
              </div>
            </div>
          </nav>
        </div>
      )}

      {/* ── Chat Container ── */}
      <div className={`${containerWidthClass} ${containerMarginX} ${containerPaddingY} ${containerHeightClass} flex flex-col`}>

        <div className={`${expanded ? 'bg-[#0A2342] border-[#1B4F72]/30' : 'bg-white border-[#071B34]/5'} ${headerRadius} border ${headerPad} border-b-0 shadow-sm`}>
          <div className="flex items-center space-x-3">
            <div className={`${avatarSize} bg-[#071B34] rounded-xl flex items-center justify-center`}>
              <BrainCircuit className={`${brainIconSize} text-[#4CC9F0]`} />
            </div>
            <div className="flex-1">
              <h2 className={`${titleSize} font-semibold ${expanded ? 'text-[#F8FAFC]' : 'text-[#071B34]'}`}>HostelIQ AI Assistant</h2>
              {!expanded && <p className="text-[#4A5568] text-xs mt-0.5">Hostel support, leave, complaints, fees & more</p>}
            </div>
            <button onClick={() => setExpanded((v: boolean) => !v)}
              className={`p-2 rounded-lg border transition-colors ${expanded ? 'border-white/10 text-[#4A5568] hover:text-[#F8FAFC]' : 'border-[#071B34]/10 text-[#4A5568] hover:text-[#071B34]'}`}
              aria-label={expanded ? 'Collapse' : 'Expand'}>
              {expanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <div className={`flex-1 ${expanded ? 'bg-[#071B34]' : 'bg-white'} ${messagesBorders} ${expanded ? 'border-[#1B4F72]/30' : 'border-[#071B34]/5'} ${messagesPad} overflow-y-auto shadow-sm`}>
          {messages.length <= 1 && !isLoading && (
            <div className="mb-10 space-y-10">
              <div>
                <p className="text-xs text-[#1B4F72] uppercase tracking-widest mb-6">Capabilities</p>
                <div className="grid sm:grid-cols-2 gap-px bg-[#071B34]/5 rounded-xl overflow-hidden">
                  {capabilities.map((c) => {
                    const Icon = c.icon;
                    return (
                      <div key={c.title} className={`p-6 ${expanded ? 'bg-[#0A2342]' : 'bg-[#F5F7FA]/50'}`}>
                        <Icon className={`w-5 h-5 ${expanded ? 'text-[#4CC9F0]' : 'text-[#1B4F72]'} mb-3`} />
                        <p className={`text-sm font-medium ${expanded ? 'text-[#F8FAFC]' : 'text-[#071B34]'}`}>{c.title}</p>
                        <p className={`text-xs mt-1 leading-relaxed ${expanded ? 'text-[#4A5568]' : 'text-[#4A5568]'}`}>{c.desc}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
              <div>
                <p className="text-xs text-[#1B4F72] uppercase tracking-widest mb-4">Suggested actions</p>
                <div className="flex flex-wrap gap-2">
                  {aiActions.map((a) => (
                    <button key={a.label} onClick={() => setInputValue(a.label)}
                      className={`text-left px-4 py-3 rounded-lg border transition-colors ${expanded ? 'border-white/10 bg-white/5 hover:bg-white/10 text-[#F8FAFC]' : 'border-[#071B34]/10 bg-white hover:border-[#4CC9F0]/30'}`}>
                      <p className="text-xs font-medium">{a.label}</p>
                      <p className={`text-xs mt-0.5 ${expanded ? 'text-[#4A5568]' : 'text-[#4A5568]'}`}>{a.desc}</p>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          <div className="space-y-5">
            {messages.map((message: Message) => (
              <div key={message.id} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`flex items-start space-x-3 ${contentWidthClass} ${message.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                  {/* Avatar */}
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                    message.role === 'user' ? 'bg-[#071B34]/10' : 'bg-[#071B34]'
                  }`}>
                    {message.role === 'user'
                      ? <User className="w-4 h-4 text-[#1B4F72]" />
                      : <BrainCircuit className="w-4 h-4 text-[#4CC9F0]" />
                    }
                  </div>
                  <div className={`rounded-2xl px-4 py-3 text-sm ${
                    message.role === 'user'
                      ? 'bg-[#071B34] text-[#F8FAFC] max-w-xs sm:max-w-sm'
                      : `${expanded ? 'bg-[#0A2342] text-[#F8FAFC] border border-white/5' : 'bg-[#F5F7FA] text-[#071B34]'} flex-1`
                  }`}>
                    {message.role === 'assistant'
                      ? renderAssistantContent(message.content)
                      : <p className="whitespace-pre-line leading-relaxed">{message.content}</p>
                    }
                    <p className={`text-xs mt-2 ${message.role === 'user' ? 'text-[#4A5568]' : 'text-[#4A5568]'}`}>
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
                  <div className="w-8 h-8 bg-[#071B34] rounded-xl flex items-center justify-center">
                    <BrainCircuit className="w-4 h-4 text-[#4CC9F0]" />
                  </div>
                  <div className={`rounded-2xl px-4 py-3 ${expanded ? 'bg-[#0A2342] border border-white/5' : 'bg-[#F5F7FA]'}`}>
                    <div className="flex items-center space-x-2">
                      <Loader2 className="w-4 h-4 animate-spin text-[#4CC9F0]" />
                      <span className={`text-sm ${expanded ? 'text-[#4A5568]' : 'text-[#4A5568]'}`}>{statusText || 'AI is thinking...'}</span>
                    </div>
                    {statusTrail.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {statusTrail.map((s: string, i: number) => (
                          <span key={i} className="px-2 py-0.5 rounded-full text-xs bg-[#1B4F72]/20 text-[#4CC9F0]">{s}</span>
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
          <div className="bg-white border-l border-r border-[#071B34]/5 px-5 py-4 border-t">
            <p className="text-xs text-[#4A5568] uppercase tracking-widest mb-3">Suggested questions</p>
            <div className="flex flex-wrap gap-2">
              {quickPrompts.map((prompt, index) => (
                <button key={index} onClick={() => setInputValue(prompt)}
                  className="text-[#071B34] hover:text-[#4CC9F0] px-3 py-1.5 rounded-lg text-xs font-medium transition-colors border border-[#071B34]/10 hover:border-[#4CC9F0]/30">
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input Area */}
        <div className={`${expanded ? 'bg-[#0A2342] border-[#1B4F72]/30' : 'bg-white border-[#071B34]/5'} ${inputRadius} border ${inputPad} border-t-0 shadow-sm`}>
          <div className="flex items-end space-x-3">
            <div className="flex-1">
              <textarea value={inputValue} onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setInputValue(e.target.value)} onKeyPress={handleKeyPress}
                placeholder="Ask about leave, complaints, fees, hostel rules, visitor passes..."
                className={`w-full resize-none border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#4CC9F0]/30 transition-all text-sm ${expanded ? 'bg-[#071B34] border-white/10 text-[#F8FAFC] placeholder-[#4A5568]' : 'bg-[#F5F7FA] border-[#071B34]/10 text-[#071B34] placeholder-[#4A5568]'}`}
                rows={2} disabled={isLoading} />
            </div>
            <button onClick={handleSendMessage} disabled={!inputValue.trim() || isLoading}
              className="bg-[#071B34] text-[#F8FAFC] p-3 rounded-xl hover:bg-[#0A2342] transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
              <Send className="w-5 h-5" />
            </button>
          </div>
          <div className="flex items-center justify-between mt-3 text-xs text-[#4A5568]">
            <div className="flex items-center space-x-4">
              <span className="flex items-center gap-1.5"><Sparkles className="w-3.5 h-3.5 text-[#4CC9F0]" /> AI-powered</span>
              <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-[#4CC9F0]" /> Instant support</span>
            </div>
            <p>Press Enter to send</p>
          </div>
        </div>

        {!expanded && (
          <div className="mt-6 flex justify-center gap-4">
            <Link to="/student/dashboard" className="bg-[#071B34] text-[#F8FAFC] px-6 py-2.5 rounded-lg flex items-center gap-2 text-sm font-medium hover:bg-[#0A2342] transition-colors">
              <span>Back to Dashboard</span><ArrowRight className="w-4 h-4" />
            </Link>
            <Link to="/" className="border border-[#071B34]/10 text-[#071B34] px-6 py-2.5 rounded-lg flex items-center gap-2 text-sm font-medium bg-white hover:bg-[#F5F7FA] transition-colors">
              <Building2 className="w-4 h-4" /><span>Home</span>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

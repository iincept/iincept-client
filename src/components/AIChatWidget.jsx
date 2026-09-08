import { useState, useRef, useEffect } from 'react';
import { X, Send, ChevronLeft, User, CheckCheck, ExternalLink } from 'lucide-react';

const WhatsAppIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-1.147 4.193 4.29-1.124zm11.391-7.147c-.244-.122-1.441-.712-1.664-.793-.223-.081-.386-.122-.549.122-.163.244-.63.793-.772.956-.143.163-.285.183-.529.061-.244-.122-1.034-.381-1.97-1.216-.728-.648-1.22-1.45-1.363-1.694-.143-.244-.015-.376.107-.497.11-.11.244-.285.366-.427.122-.143.163-.244.244-.407.081-.163.041-.305-.02-.427-.061-.122-.549-1.321-.752-1.808-.198-.475-.399-.411-.549-.419-.143-.008-.305-.008-.467-.008s-.427.061-.65.305c-.223.244-.854.834-.854 2.036 0 1.201.874 2.361.996 2.524.122.163 1.72 2.627 4.167 3.684.582.252 1.037.402 1.392.515.584.186 1.116.159 1.536.097.47-.07 1.441-.59 1.644-1.16.203-.57.203-1.058.143-1.16-.062-.101-.224-.162-.468-.284z"/>
  </svg>
);

const QUICK_SUGGESTIONS = [
  "💬 Direct WhatsApp Chat",
  "📱 iPhone 16 Best Offers",
  "💻 MacBook Corporate Quote",
  "🛡️ AppleCare+ Inquiry",
  "📦 Track Order Status",
];

const KNOWLEDGE_BASE = [
  {
    keywords: ['iphone', 'iphone 16', 'mobile', 'phone', 'price'],
    answer: "We offer the complete iPhone lineup including iPhone 16 Pro Max, iPhone 16 Pro, iPhone 16, and iPhone 15! All models come with official Apple Warranty and GST Invoice.",
  },
  {
    keywords: ['macbook', 'mac', 'laptop', 'air', 'm3', 'pro'],
    answer: "Our MacBook range includes MacBook Air (M2 & M3) and MacBook Pro 14\" & 16\" (M3 Pro & Max). Get up to 10% instant corporate discount on bulk orders!",
  },
  {
    keywords: ['applecare', 'warranty', 'protection', 'damage', 'repair'],
    answer: "AppleCare+ provides 2 or 3 years of official Apple protection including unlimited accidental damage repairs, battery service below 80% capacity, and 24/7 priority support!",
  },
  {
    keywords: ['gst', 'invoice', 'tax', 'b2b', 'corporate', 'bulk'],
    answer: "Yes! iIncept is an Authorized Apple B2B Partner across Pan-India. We provide 18% GST Input Tax Credit on all purchases with custom corporate invoicing.",
  },
  {
    keywords: ['contact', 'whatsapp', 'phone', 'number', 'call', 'rahul'],
    answer: "You can reach Rahul directly on WhatsApp at +91 8607222417 or click the green button below to start chat immediately!",
  },
  {
    keywords: ['order', 'track', 'status', 'shipping', 'delivery'],
    answer: "Orders are dispatched within 24 hours with Pan-India express delivery. You can track your order status in real time under Profile -> Orders page!",
  },
];

export default function AIChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'bot',
      name: 'Rahul • iIncept Support',
      text: `Hi there! 👋 I am Rahul from iIncept Apple Store Support.\n\nHow can we help you today with Apple products, B2B corporate pricing, or AppleCare+ coverage?\n\nWhatsApp Support: +91 8607222417`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const openWhatsAppDirectly = (customText = '') => {
    const text = customText || 'Hi Rahul, I am visiting iIncept Apple Store and need assistance with Apple products and quotes.';
    const url = `https://wa.me/918607222417?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSend = (textToSend) => {
    const query = textToSend || input;
    if (!query.trim()) return;

    if (query === "💬 Direct WhatsApp Chat") {
      openWhatsAppDirectly();
      return;
    }

    const userMsg = {
      id: Date.now(),
      sender: 'user',
      text: query,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setIsTyping(true);

    // Generate response or trigger WhatsApp
    setTimeout(() => {
      const lowerQuery = query.toLowerCase();
      let replyText = "Thank you for reaching out! Click the green button below to chat with Rahul directly on WhatsApp (+91 8607222417) for instant quotes and product guidance.";

      for (const item of KNOWLEDGE_BASE) {
        if (item.keywords.some((kw) => lowerQuery.includes(kw))) {
          replyText = item.answer;
          break;
        }
      }

      const botMsg = {
        id: Date.now() + 1,
        sender: 'bot',
        name: 'Rahul',
        text: replyText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);
    }, 600);
  };

  return (
    <>
      {/* WhatsApp Floating Launcher Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 w-15 h-15 bg-[#25D366] text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 hover:bg-[#20ba5a] active:scale-95 transition-all duration-300 group cursor-pointer border-2 border-white/20"
          aria-label="Open WhatsApp Support Chat"
          title="Chat on WhatsApp (+91 8607222417)"
        >
          <div className="relative flex items-center justify-center">
            <WhatsAppIcon className="w-8 h-8 text-white drop-shadow-md" />
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center border-2 border-white animate-bounce">
              1
            </span>
          </div>
        </button>
      )}

      {/* WhatsApp Chat Modal Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-[92vw] sm:w-[380px] h-[570px] max-h-[85vh] bg-[#E5DDD5] rounded-3xl shadow-2xl border border-zinc-300 overflow-hidden flex flex-col transition-all duration-300 animate-in fade-in slide-in-from-bottom-5">
          {/* WhatsApp Dark Green Header */}
          <div className="bg-[#075E54] text-white px-4 py-3.5 flex items-center justify-between shrink-0 shadow-md">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-white/10 rounded-full transition-colors cursor-pointer"
                title="Back / Close"
              >
                <ChevronLeft className="w-6 h-6 text-white" />
              </button>
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-[#075E54] font-bold border border-white/40 shadow-xs overflow-hidden">
                  <User className="w-6 h-6 text-zinc-700" />
                </div>
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-400 border-2 border-[#075E54] rounded-full" />
              </div>
              <div className="text-left">
                <h3 className="font-bold text-base leading-snug flex items-center gap-1.5">
                  Rahul
                  <span className="text-[10px] bg-[#25D366] text-zinc-950 font-extrabold px-1.5 py-0.5 rounded-full uppercase tracking-wider">
                    Official
                  </span>
                </h3>
                <p className="text-[11px] text-emerald-100 flex items-center gap-1 font-normal">
                  Typically replies instantly • Online
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 hover:bg-white/10 rounded-full transition-colors cursor-pointer text-emerald-100 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* WhatsApp Chat Wallpaper Messages Container */}
          <div className="flex-grow p-4 overflow-y-auto space-y-4 bg-[#E5DDD5] bg-[radial-gradient(#00000008_1px,transparent_1px)] [background-size:16px_16px]">
            {/* Encryption notice pill */}
            <div className="text-center">
              <span className="bg-[#FFF5C4] text-zinc-700 text-[10.5px] px-3 py-1 rounded-lg shadow-2xs font-medium inline-block max-w-[90%] border border-amber-200/60">
                🔒 Messages are end-to-end encrypted. Tap green button to launch WhatsApp directly.
              </span>
            </div>

            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                {msg.sender === 'bot' && (
                  <span className="text-[11px] font-semibold text-zinc-500 mb-1 ml-1">
                    {msg.name}
                  </span>
                )}
                <div
                  className={`max-w-[85%] rounded-2xl p-3.5 text-xs sm:text-sm leading-relaxed whitespace-pre-line shadow-xs ${
                    msg.sender === 'user'
                      ? 'bg-[#DCF8C6] text-zinc-900 rounded-tr-none border border-emerald-200/70'
                      : 'bg-white text-zinc-900 rounded-tl-none border border-zinc-200/80'
                  }`}
                >
                  {msg.text}

                  {/* Direct Launch WhatsApp Button inside Bot Welcome Message */}
                  {msg.sender === 'bot' && (
                    <div className="mt-3 pt-2 border-t border-zinc-100">
                      <button
                        onClick={() => openWhatsAppDirectly()}
                        className="w-full bg-[#25D366] hover:bg-[#20ba5a] text-white font-bold text-xs py-2 px-3 rounded-xl flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
                      >
                        <WhatsAppIcon className="w-4 h-4 text-white" />
                        <span>Chat on WhatsApp (+91 8607222417)</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}

                  <div className="text-[10px] mt-1.5 text-right text-zinc-400 flex items-center justify-end gap-1">
                    <span>{msg.time}</span>
                    {msg.sender === 'user' && (
                      <CheckCheck className="w-3.5 h-3.5 text-sky-500 inline" />
                    )}
                  </div>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex flex-col items-start">
                <span className="text-[11px] font-semibold text-zinc-500 mb-1 ml-1">Rahul</span>
                <div className="bg-white border border-zinc-200/80 rounded-2xl rounded-tl-none px-4 py-3 shadow-xs">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce"></span>
                    <span className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                    <span className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Suggestion Pills */}
          <div className="px-3 py-2 bg-[#F0F2F5] border-t border-zinc-200 flex gap-2 overflow-x-auto no-scrollbar shrink-0">
            {QUICK_SUGGESTIONS.map((sug, i) => (
              <button
                key={i}
                onClick={() => handleSend(sug)}
                className="whitespace-nowrap px-3 py-1.5 rounded-full bg-white hover:bg-[#25D366] hover:text-white text-zinc-700 text-[11px] font-semibold transition-all cursor-pointer border border-zinc-300 shadow-2xs shrink-0 flex items-center gap-1"
              >
                {sug}
              </button>
            ))}
          </div>

          {/* WhatsApp Footer Input Bar */}
          <div className="p-2.5 bg-[#F0F2F5] border-t border-zinc-200 shrink-0 space-y-1.5">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex items-center gap-2 bg-white rounded-full p-1 pl-4 border border-zinc-300 focus-within:border-[#25D366] focus-within:ring-2 focus-within:ring-[#25D366]/20 transition-all shadow-2xs"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type a message or question..."
                className="flex-grow bg-transparent text-xs sm:text-sm text-zinc-900 focus:outline-none placeholder:text-zinc-400"
              />
              <button
                type="submit"
                disabled={!input.trim()}
                className="w-9 h-9 rounded-full bg-[#25D366] text-white flex items-center justify-center hover:bg-[#20ba5a] disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer shrink-0 shadow-xs"
                title="Send Message"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>

            <div className="text-[10px] text-center text-zinc-400 font-medium flex items-center justify-center gap-1">
              <WhatsAppIcon className="w-3 h-3 text-[#25D366]" />
              <span>Official WhatsApp Business Chat • iIncept Apple Reseller</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, User, Sparkles, Minus, Maximize2 } from 'lucide-react';

const INITIAL_MESSAGES = [
  { role: 'bot', text: "Namaste! I am your EduOdisha Career Assistant. How can I help you find the right college or course in Odisha today?" }
];

export default function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [input, setSearchQ] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { role: 'user', text: input };
    setMessages([...messages, userMessage]);
    setSearchQ('');
    setIsTyping(true);

    // Simulate AI Response
    setTimeout(() => {
      let botResponse = "I'm analyzing the best options for you in Odisha. Could you tell me your preferred city or stream (e.g. Engineering in Bhubaneswar)?";
      
      const q = input.toLowerCase();
      if (q.includes('engineering') || q.includes('b.tech')) {
        botResponse = "For Engineering in Odisha, top choices include VSSUT Burla, OUTR Bhubaneswar, and NIT Rourkela. Private options like KIIT and SOA are also highly rated for placements.";
      } else if (q.includes('medical') || q.includes('mbbs')) {
        botResponse = "SCB Medical College (Cuttack) and AIIMS Bhubaneswar are the premier medical institutions in Odisha. You should also look into MKCG Berhampur.";
      } else if (q.includes('scholarship')) {
        botResponse = "Odisha offers great scholarships like Medhabruti and Post-Matric scholarships for SC/ST/OBC students. You can check the 'Scholarships' section on our site for deadines.";
      }

      const botMessage = { role: 'bot', text: botResponse };
      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col items-end">
      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className={`bg-white shadow-2xl rounded-2xl border border-slate-200 overflow-hidden mb-4 flex flex-col transition-all duration-300 ${
              isMinimized ? 'h-16 w-72' : 'h-[500px] w-[350px] md:w-[400px]'
            }`}
          >
            {/* Header */}
            <div className="bg-primary-900 p-4 text-white flex items-center justify-between shadow-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center border border-white/20">
                  <Sparkles size={20} className="text-accent-400" />
                </div>
                <div>
                  <h3 className="font-bold text-sm leading-none">Career Assistant</h3>
                  <p className="text-[10px] text-blue-200 mt-1 uppercase tracking-widest font-black">EduOdisha AI</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button onClick={() => setIsMinimized(!isMinimized)} className="p-1.5 hover:bg-white/10 rounded-lg transition-colors">
                  {isMinimized ? <Maximize2 size={16} /> : <Minus size={16} />}
                </button>
                <button onClick={() => setIsOpen(false)} className="p-1.5 hover:bg-white/10 rounded-lg transition-colors">
                  <X size={16} />
                </button>
              </div>
            </div>

            {!isMinimized && (
              <>
                {/* Messages */}
                <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50 scrollbar-hide">
                  {messages.map((msg, i) => (
                    <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[85%] p-3 rounded-2xl text-sm font-medium shadow-sm leading-relaxed ${
                        msg.role === 'user' 
                          ? 'bg-primary-900 text-white rounded-tr-none' 
                          : 'bg-white text-slate-700 border border-slate-200 rounded-tl-none'
                      }`}>
                        {msg.text}
                      </div>
                    </div>
                  ))}
                  {isTyping && (
                    <div className="flex justify-start">
                      <div className="bg-white border border-slate-200 p-3 rounded-2xl rounded-tl-none shadow-sm">
                        <div className="flex gap-1">
                          <span className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce" />
                          <span className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce [animation-delay:0.2s]" />
                          <span className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce [animation-delay:0.4s]" />
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Input */}
                <form onSubmit={handleSend} className="p-4 bg-white border-t border-slate-100 flex gap-2">
                  <input
                    type="text"
                    value={input}
                    onChange={e => setSearchQ(e.target.value)}
                    placeholder="Ask about colleges, exams..."
                    className="flex-1 bg-slate-100 border-none rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 ring-primary-500/20"
                  />
                  <button type="submit" className="w-10 h-10 rounded-xl bg-primary-900 text-white flex items-center justify-center hover:bg-primary-800 transition-colors shadow-lg shadow-primary-900/20">
                    <Send size={18} />
                  </button>
                </form>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toggle Button */}
      <button
        onClick={() => {
          setIsOpen(true);
          setIsMinimized(false);
        }}
        className={`w-14 h-14 rounded-full flex items-center justify-center shadow-2xl transition-all hover:scale-110 active:scale-95 group ${
          isOpen ? 'bg-white text-primary-900' : 'bg-primary-900 text-white'
        }`}
      >
        {isOpen ? (
          <Sparkles className="animate-pulse text-accent-500" />
        ) : (
          <MessageSquare className="group-hover:rotate-12 transition-transform" />
        )}
        
        {/* Tooltip */}
        {!isOpen && (
          <div className="absolute right-full mr-4 bg-white px-3 py-1.5 rounded-lg shadow-xl border border-slate-100 text-primary-900 text-xs font-bold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            Need Help? Ask AI Assistant
          </div>
        )}
      </button>
    </div>
  );
}
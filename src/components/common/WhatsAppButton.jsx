import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useLanguage } from '../../context/LanguageContext';
import { useLocation } from 'react-router-dom';
import { FaWhatsapp } from 'react-icons/fa';

const WHATSAPP_CONTENT = {
  en: {
    tooltip: "Need help? Chat with us",
    message: "Hi! I would like to know more about admissions and counselling assistance on EduOdisha."
  },
  hi: {
    tooltip: "मदद चाहिए? व्हाट्सएप करें",
    message: "नमस्ते! मैं एडूओडिशा पर प्रवेश और परामर्श सहायता के बारे में अधिक जानना चाहता हूँ।"
  },
  or: {
    tooltip: "ସହାୟତା ଦରକାର କି? ଚାଟ୍ କରନ୍ତୁ",
    message: "ନମସ୍କାର! ମୁଁ ଏଡୁଓଡ଼ିଶାରେ ଆଡମିଶନ ଏବଂ ପରାମର୍ଶ ସହାୟତା ବିଷୟରେ ଅଧିକ ଜାଣିବାକୁ ଚାହୁଁଛି।"
  }
};

export default function WhatsAppButton() {
  const { language } = useLanguage();
  const { pathname } = useLocation();
  const [showTooltip, setShowTooltip] = useState(false);
  const { colleges } = useSelector((state) => state.compare);
  const isCompareActive = colleges.length > 0;

  // Automatically show the tooltip briefly on mount to attract attention
  useEffect(() => {
    if (pathname.startsWith('/admin')) return;
    const timer = setTimeout(() => {
      setShowTooltip(true);
      // Auto-hide after 5 seconds
      const hideTimer = setTimeout(() => {
        setShowTooltip(false);
      }, 5000);
      return () => clearTimeout(hideTimer);
    }, 1500);

    return () => clearTimeout(timer);
  }, [pathname]);

  // Do not render on admin pages
  if (pathname.startsWith('/admin')) {
    return null;
  }

  const content = WHATSAPP_CONTENT[language] || WHATSAPP_CONTENT.en;
  const whatsappNumber = "917205402554";
  const encodedMsg = encodeURIComponent(content.message);
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMsg}`;

  return (
    <div className={`fixed right-6 z-50 flex items-center select-none pointer-events-none transition-all duration-300 ${
      isCompareActive 
        ? 'bottom-[230px] md:bottom-6' 
        : 'bottom-6'
    }`}>
      
      {/* ─── Tooltip ─── */}
      <div 
        className={`absolute right-full mr-3 px-4 py-2 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl text-xs font-bold whitespace-nowrap transition-all duration-300 transform origin-right flex items-center gap-1.5 ${
          showTooltip 
            ? 'opacity-100 translate-x-0 scale-100 pointer-events-auto' 
            : 'opacity-0 translate-x-4 scale-95 pointer-events-none'
        }`}
      >
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
        {content.tooltip}
        {/* Subtle close arrow */}
        <button 
          onClick={() => setShowTooltip(false)} 
          className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 ml-1.5 transition-colors text-[10px] pointer-events-auto"
          aria-label="Close tooltip"
        >
          ✕
        </button>
      </div>

      {/* ─── Floating Button ─── */}
      <div className="relative group pointer-events-auto">
        
        {/* Pulsing Backlight Effect */}
        <div className="absolute inset-0 bg-emerald-500 rounded-full blur-md opacity-40 group-hover:opacity-75 animate-pulse transition-opacity duration-300" />
        
        {/* Outer Ring Animation */}
        <div className="absolute inset-0 rounded-full border-2 border-emerald-400 animate-ping opacity-25 scale-105 pointer-events-none" />

        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
          className="relative w-14 h-14 bg-emerald-500 hover:bg-emerald-600 active:bg-emerald-700 text-white rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 border border-emerald-400/20"
          aria-label="Chat on WhatsApp"
        >
          {/* React WhatsApp Icon */}
          <FaWhatsapp size={28} />
        </a>

      </div>
    </div>
  );
}

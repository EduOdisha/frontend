import { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useLocation } from 'react-router-dom';

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
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 select-none">
      
      {/* ─── Tooltip ─── */}
      <div 
        className={`px-4 py-2 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl text-xs font-bold whitespace-nowrap transition-all duration-300 transform origin-right shrink-0 flex items-center gap-1.5 ${
          showTooltip 
            ? 'opacity-100 translate-x-0 scale-100' 
            : 'opacity-0 translate-x-4 scale-95 pointer-events-none'
        }`}
      >
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
        {content.tooltip}
        {/* Subtle close arrow */}
        <button 
          onClick={() => setShowTooltip(false)} 
          className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 ml-1.5 transition-colors text-[10px]"
          aria-label="Close tooltip"
        >
          ✕
        </button>
      </div>

      {/* ─── Floating Button ─── */}
      <div className="relative group">
        
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
          {/* Official Premium SVG Icon for WhatsApp */}
          <svg 
            className="w-7 h-7 fill-current" 
            viewBox="0 0 24 24" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.457L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.792 1.451 5.485.002 9.947-4.461 9.95-9.95.002-2.659-1.022-5.16-2.885-7.027C16.639 1.76 14.137.734 11.48.734 5.992.734 1.53 5.197 1.527 10.686c-.001 1.673.452 3.3 1.309 4.757l-.989 3.606 3.71-.973zm11.758-5.36c-.322-.16-1.897-.936-2.193-1.042-.295-.106-.51-.16-.723.16-.213.32-.823 1.042-1.01 1.255-.186.213-.372.24-.694.08-.32-.16-1.353-.499-2.578-1.593-.954-.85-1.596-1.9-1.783-2.22-.186-.32-.02-.493.14-.653.144-.144.32-.373.48-.56.16-.186.213-.32.32-.533.106-.213.053-.4-.027-.56-.08-.16-.723-1.742-1.01-2.435-.28-.673-.564-.582-.773-.593-.2-.01-.43-.01-.659-.01-.229 0-.601.086-.917.433-.315.346-1.203 1.178-1.203 2.877 0 1.699 1.236 3.333 1.408 3.56.172.227 2.433 3.714 5.895 5.21.823.356 1.465.568 1.965.727.828.263 1.58.226 2.176.137.663-.099 1.897-.775 2.164-1.488.267-.713.267-1.326.187-1.45-.08-.124-.294-.213-.615-.373z" />
          </svg>
        </a>

      </div>
    </div>
  );
}

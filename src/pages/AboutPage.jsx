import { Users, Sparkles, PhoneCall, ChevronRight, ArrowUpRight, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ABOUT_CONTENT } from '../locales/aboutTranslations.js';
import { useLanguage } from '../context/LanguageContext';

export default function AboutPage() {
  const { language } = useLanguage();
  const content = ABOUT_CONTENT[language] || ABOUT_CONTENT.en;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 transition-colors duration-300">
      
      {/* ─── HERO SECTION ─── */}
      <section className="relative bg-[#070b13] pt-32 pb-32 overflow-hidden border-b border-slate-900">
        {/* Dynamic Glow Circles */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-primary-600/10 rounded-full blur-[100px] pointer-events-none" />
          <div className="absolute bottom-1/4 right-1/4 w-[450px] h-[450px] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />
          <div className="absolute inset-0 bg-dot-grid opacity-[0.07] pointer-events-none" />
        </div>

        <div className="container-xl relative z-10">
          <div className="max-w-3xl mx-auto text-center flex flex-col items-center space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary-500/10 text-primary-400 text-xs font-bold uppercase tracking-wider border border-primary-500/20">
              <Sparkles size={13} className="text-primary-400 animate-pulse" />
              {content.hero.eyebrow}
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-extrabold text-white tracking-tight leading-[1.1]">
              {content.hero.title} <br className="hidden md:inline"/>
              <span className="bg-gradient-to-r from-primary-400 via-teal-300 to-emerald-400 bg-clip-text text-transparent">
                {content.hero.titleAccent}
              </span>
            </h1>
            
            <p className="text-slate-300 text-base md:text-lg leading-relaxed max-w-2xl font-light">
              {content.hero.subtitle}
            </p>
            
            <div className="flex flex-wrap gap-4 pt-2 justify-center">
              <Link 
                to="/colleges" 
                className="px-6 py-3 rounded-xl bg-primary-600 hover:bg-primary-500 active:bg-primary-700 text-white font-semibold text-sm transition-all duration-300 shadow-lg shadow-primary-500/20 hover:scale-[1.02] flex items-center gap-2"
              >
                Get Started
                <ChevronRight size={16} />
              </Link>
              <a 
                href="#mission" 
                className="px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 hover:border-white/20 font-semibold text-sm transition-all duration-300 backdrop-blur-sm"
              >
                Our Mission
              </a>
            </div>
          </div>
        </div>
      </section>



      {/* ─── MISSION & VISION SECTION ─── */}
      <section id="mission" className="page-section scroll-mt-20">
        <div className="container-xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
            
            {/* Left Col: Narrative info */}
            <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-24">
              <div className="space-y-3">
                <span className="text-xs font-bold uppercase tracking-widest text-primary-600 dark:text-primary-400">
                  Our Purpose
                </span>
                <h2 className="text-3xl md:text-4xl font-display font-extrabold text-slate-900 dark:text-white tracking-tight">
                  {content.mission.title}
                </h2>
              </div>
              <p className="text-slate-500 dark:text-slate-400 text-sm md:text-base leading-relaxed">
                {content.mission.subtitle}
              </p>
              <div className="p-5 rounded-2xl bg-gradient-to-br from-primary-50 to-emerald-50/20 dark:from-primary-950/20 dark:to-slate-900 border border-primary-100/30 dark:border-slate-800/60 space-y-4">
                <h4 className="text-sm font-bold text-slate-800 dark:text-white flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-primary-500" />
                  Spam-Free Guarantee
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  We never sell your phone numbers to telecallers. All student counseling remains fully confidential and guided by pure academic merit.
                </p>
              </div>
            </div>

            {/* Right Col: Values List */}
            <div className="lg:col-span-8 space-y-6">
              {content.mission.values.map((val, idx) => {
                const IconComp = val.icon;
                return (
                  <div 
                    key={idx} 
                    className="bg-white dark:bg-slate-900/40 border border-slate-200/50 dark:border-slate-800/60 rounded-2xl p-6 hover:shadow-xl hover:border-primary-500/20 dark:hover:border-primary-500/20 transition-all duration-300 flex flex-col md:flex-row items-start gap-6 group hover:-translate-y-0.5"
                  >
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border border-slate-200/10 group-hover:scale-110 transition-transform duration-300 ${val.color}`}>
                      <IconComp size={22} />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-lg font-bold font-display text-slate-900 dark:text-white flex items-center gap-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                        {val.title}
                      </h3>
                      <p className="text-slate-500 dark:text-slate-400 text-xs md:text-sm leading-relaxed">
                        {val.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

          </div>
        </div>
      </section>

      {/* ─── SERVICES GRID SECTION ─── */}
      <section className="page-section bg-slate-100/40 dark:bg-slate-900/10 border-y border-slate-200/30 dark:border-slate-800/30">
        <div className="container-xl">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-primary-600 dark:text-primary-400">
              Platform Features
            </span>
            <h2 className="text-3xl md:text-4xl font-display font-extrabold text-slate-900 dark:text-white tracking-tight">
              {content.services.title}
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm md:text-base leading-relaxed">
              {content.services.subtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {content.services.items.map((svc, idx) => {
              const IconComp = svc.icon;
              return (
                <div 
                  key={idx} 
                  className="bg-white dark:bg-slate-900 rounded-2xl p-7 border border-slate-200/60 dark:border-slate-800/60 hover:shadow-2xl hover:border-primary-500/20 dark:hover:border-primary-500/20 transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1"
                >
                  <div className="space-y-4">
                    <div className="w-11 h-11 rounded-xl bg-primary-50 dark:bg-primary-950/40 text-primary-600 dark:text-primary-400 border border-primary-100/50 dark:border-primary-900/30 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300 shadow-sm">
                      <IconComp size={20} />
                    </div>
                    <div className="space-y-2">
                      <h4 className="text-base font-bold font-display text-slate-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                        {svc.title}
                      </h4>
                      <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed">
                        {svc.desc}
                      </p>
                    </div>
                  </div>
                  <div className="pt-6 mt-4 border-t border-slate-100 dark:border-slate-850 flex items-center justify-between text-xs font-semibold text-slate-400 group-hover:text-primary-500 dark:group-hover:text-primary-400 transition-colors">
                    <span>Explore Utility</span>
                    <ArrowUpRight size={14} className="transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── CTA SECTION ─── */}
      <section className="page-section">
        <div className="container-xl">
          <div className="relative bg-gradient-to-br from-slate-900 via-primary-950 to-slate-950 rounded-3xl overflow-hidden py-16 px-6 md:px-16 text-center md:text-left flex flex-col lg:flex-row items-center justify-between gap-10 border border-slate-800 shadow-2xl">
            {/* Background elements */}
            <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-primary-600/10 rounded-full blur-[100px] translate-x-1/4 -translate-y-1/4 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[200px] h-[200px] bg-emerald-500/10 rounded-full blur-[80px] -translate-x-1/4 translate-y-1/4 pointer-events-none" />
            <div className="absolute inset-0 bg-dot-grid opacity-[0.05] pointer-events-none" />

            <div className="max-w-2xl space-y-5 relative z-10">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-bold uppercase tracking-wider border border-emerald-500/20">
                <Users size={11} className="text-emerald-400" />
                1-on-1 Mentorship
              </span>
              <h3 className="text-2xl md:text-4xl font-display font-extrabold text-white tracking-tight leading-tight">
                {content.cta.title}
              </h3>
              <p className="text-slate-300 text-sm md:text-base leading-relaxed font-light">
                {content.cta.desc}
              </p>
              
              {/* Online indicator panel */}
              <div className="flex items-center justify-center md:justify-start gap-4 pt-2">
                <div className="flex -space-x-2">
                  <div className="w-8 h-8 rounded-full border-2 border-slate-900 bg-slate-700 flex items-center justify-center text-[10px] font-bold text-white uppercase font-display">A</div>
                  <div className="w-8 h-8 rounded-full border-2 border-slate-900 bg-primary-700 flex items-center justify-center text-[10px] font-bold text-white uppercase font-display">S</div>
                  <div className="w-8 h-8 rounded-full border-2 border-slate-900 bg-emerald-700 flex items-center justify-center text-[10px] font-bold text-white uppercase font-display">M</div>
                </div>
                <div className="text-left">
                  <div className="text-xs font-bold text-white flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                    Counsellors Active Now
                  </div>
                  <div className="text-[10px] text-slate-400">Response time: &lt; 5 mins</div>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto relative z-10 shrink-0">
              <a 
                href="tel:+917205402554" 
                className="btn-cta bg-accent-500 hover:bg-accent-600 active:bg-accent-700 text-white font-bold py-3.5 px-7 rounded-xl shadow-lg shadow-accent-500/30 flex items-center justify-center gap-2 transition-all duration-300 hover:scale-[1.02]"
              >
                <PhoneCall size={16} />
                {content.cta.btnCall}
              </a>
              <Link 
                to="/colleges" 
                className="btn-secondary bg-white/10 dark:bg-white/5 hover:bg-white/20 text-white border-white/10 hover:border-white/20 py-3.5 px-7 rounded-xl flex items-center justify-center gap-1.5 transition-all duration-300 font-semibold text-sm hover:scale-[1.02]"
              >
                {content.cta.btnBrowse}
                <ChevronRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}

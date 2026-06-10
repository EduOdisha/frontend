import { motion } from 'framer-motion';
import { Search, CheckCircle } from 'lucide-react';

export default function HomeHero({
  slides,
  activeSlide,
  setActiveSlide,
  searchQ,
  setSearchQ,
  searchType,
  setSearchType,
  handleSearch,
  t,
  popularTags,
  navigate
}) {
  return (
    <section className="relative pt-24 pb-16 lg:pt-32 lg:pb-24 overflow-hidden bg-slate-50 dark:bg-slate-950 border-b border-slate-100 dark:border-slate-800/50">
      {/* Background Slideshow Layer */}
      <div className="absolute inset-0 z-0 overflow-hidden bg-slate-50 dark:bg-slate-950">
        {slides.map((slide, idx) => (
          <div
            key={idx}
            className="absolute inset-0 transition-opacity duration-1000 ease-in-out"
            style={{ opacity: activeSlide === idx ? 0.42 : 0 }}
          >
            <img
              src={slide.image}
              alt=""
              className="w-full h-full object-cover select-none"
            />
          </div>
        ))}
        {/* Dotted Grid Pattern Overlay directly over images */}
        <div className="absolute inset-0 bg-dot-grid opacity-100" />

        {/* Subtle gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-50 via-transparent to-slate-50 dark:from-slate-950 dark:to-slate-950" />
      </div>

      {/* Slide Indicator Badge */}
      <div className="absolute bottom-4 right-4 z-20 hidden sm:flex items-center gap-2 bg-white/70 dark:bg-slate-900/70 backdrop-blur-md border border-slate-200/60 dark:border-slate-800/60 px-3 py-1.5 rounded-full shadow-xs text-[11px] text-slate-600 dark:text-slate-400 select-none">
        <span className="w-1.5 h-1.5 rounded-full bg-primary-500 animate-pulse" />
        <span className="font-semibold text-slate-700 dark:text-slate-300">{slides[activeSlide].title}</span>
        <span className="text-slate-300">•</span>
        <span className="text-slate-500 dark:text-slate-400 font-medium">{slides[activeSlide].tag}</span>
      </div>

      {/* Content (relative z-10) */}
      <div className="container-xl relative z-10">
        <div className="max-w-4xl mx-auto text-center flex flex-col items-center">
          {/* Trust badge */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-2 bg-primary-50/90 dark:bg-primary-950/40 backdrop-blur-sm border border-primary-100 dark:border-primary-900/40 text-primary-700 dark:text-primary-400 text-xs font-bold px-3 py-1.5 rounded-full mb-6"
          >
            <CheckCircle size={12} className="text-primary-600" />
            {t('home.trustBadge')}
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.08 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-display font-extrabold text-slate-900 dark:text-white mb-5 leading-[1.15] tracking-tight text-center"
          >
            {t('home.heroTitle1')}
            <br />
            <span className="text-primary-600">{t('home.heroTitle2')}</span>
          </motion.h1>

          {/* Subtext */}
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="text-base sm:text-lg text-slate-700 dark:text-slate-300 mb-8 max-w-2xl leading-relaxed font-medium text-center"
          >
            {t('home.heroSubtitle')}
          </motion.p>

          {/* Search Box */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.22 }}
            className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm border border-slate-200 dark:border-slate-800 rounded-xl shadow-md p-2 w-full max-w-2xl"
          >
            {/* Type Tabs */}
            <div className="flex items-center gap-1 mb-2 px-1 overflow-x-auto scrollbar-hide whitespace-nowrap">
              {['colleges', 'courses', 'exams', 'scholarships'].map(type => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setSearchType(type)}
                  className={`px-3 py-1.5 rounded-md text-xs font-semibold capitalize transition-all shrink-0 ${searchType === type
                    ? 'bg-primary-600 text-white'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                >
                  {t(`navbar.${type}`)}
                </button>
              ))}
            </div>
            {/* Input + Button */}
            <form onSubmit={handleSearch} className="flex items-center gap-2">
              <div className="flex-1 min-w-0 flex items-center gap-2 px-2 sm:px-3">
                <Search size={16} className="text-slate-400 shrink-0" />
                <input
                  type="text"
                  value={searchQ}
                  onChange={e => setSearchQ(e.target.value)}
                  placeholder={t('home.searchPlaceholder').replace('{type}', searchType)}
                  id="hero-search"
                  className="flex-1 min-w-0 py-2.5 text-sm text-slate-700 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-500 bg-transparent outline-none font-medium"
                />
              </div>
              <button type="submit" className="btn-cta py-2.5 px-4 sm:px-6 text-sm rounded-lg shrink-0">
                {t('home.searchBtn')}
              </button>
            </form>
          </motion.div>

          {/* Popular Tags */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.35 }}
            className="mt-5 flex flex-wrap items-center justify-center gap-2"
          >
            <span className="text-xs text-slate-400 dark:text-slate-500 font-semibold uppercase tracking-wider">
              {t('home.popularLabel')}
            </span>
            {(Array.isArray(popularTags) ? popularTags : []).map(tag => (
              <button
                key={tag}
                onClick={() => navigate(`/colleges?search=${encodeURIComponent(tag)}`)}
                className="text-xs font-medium text-slate-600 dark:text-slate-300 hover:text-primary-600 dark:hover:text-primary-400 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-primary-200 dark:hover:border-primary-800 hover:bg-primary-50 dark:hover:bg-primary-950/30 px-3 py-1.5 rounded-lg transition-all"
              >
                {tag}
              </button>
            ))}
          </motion.div>

          {/* Trust row */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.45 }}
            className="mt-8 flex flex-wrap items-center justify-center gap-6"
          >
            {[t('home.freeToUse'), t('home.noSpam'), t('home.expertCounsellors')].map(item => (
              <div key={item} className="flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400 font-medium">
                <CheckCircle size={14} className="text-emerald-500" />
                {item}
              </div>
            ))}
          </motion.div>

          {/* Subtle Carousel Indicator */}
          <div className="mt-12 flex items-center gap-2 bg-white/70 dark:bg-slate-900/70 backdrop-blur-sm px-3.5 py-2 rounded-full border border-slate-200/50 dark:border-slate-800/50 shadow-sm">
            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">{t('home.showing')}</span>
            <span className="text-[10px] font-bold text-primary-600 dark:text-primary-400 uppercase tracking-wider">
              {slides[activeSlide].title} ({slides[activeSlide].tag})
            </span>
            <div className="flex gap-1 ml-2">
              {slides.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveSlide(idx)}
                  className={`w-1.5 h-1.5 rounded-full transition-all ${activeSlide === idx ? 'bg-primary-600 w-3' : 'bg-slate-300 dark:bg-slate-700'
                    }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

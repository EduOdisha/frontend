import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { useSelector } from 'react-redux';
import { toast } from 'react-hot-toast';
import {
  Search, ArrowRight, Star, MapPin,
  School, BookOpen, Award, Users, CheckCircle,
  TrendingUp, Phone, ChevronRight, Calendar,
  Quote, PenLine, X, Send
} from 'lucide-react';
import api from '../utils/api.js';
import CollegeCard from '../components/college/CollegeCard.jsx';
import { useLanguage } from '../context/LanguageContext';

// ─── Animated Counter ─────────────────────────────────────
function AnimatedCounter({ value }) {
  const [display, setDisplay] = useState('0');
  const ref = useRef(null);
  const done = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !done.current) {
          done.current = true;
          const suffix = value.replace(/[0-9]/g, '');
          const num = parseInt(value);
          let n = 0;
          const step = Math.max(1, Math.ceil(num / 50));
          const t = setInterval(() => {
            n = Math.min(n + step, num);
            setDisplay(n + suffix);
            if (n >= num) clearInterval(t);
          }, 20);
        }
      },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [value]);

  return <span ref={ref}>{display}</span>;
}

// ─── Write Review Modal ───────────────────────────────────
function WriteReviewModal({ onClose, onSuccess }) {
  const queryClient = useQueryClient();
  const [form, setForm] = useState({
    rating: 5,
    title: '',
    review: '',
    role: '',
    location: '',
    usedFor: 'College Search',
  });
  const [hovered, setHovered] = useState(0);

  const mutation = useMutation({
    mutationFn: (data) => api.post('/platform-reviews', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['platform-reviews'] });
      toast.success('Review submitted! It will appear after approval.');
      onSuccess?.();
      onClose();
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Failed to submit review');
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.review.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }
    mutation.mutate(form);
  };

  const USED_FOR_OPTIONS = [
    'College Search', 'Counselling', 'Scholarship', 'Exam Info', 'Course Selection', 'Other',
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 12 }}
        className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Share Your Experience</h2>
            <p className="text-xs text-slate-400 mt-0.5">Help other students by reviewing EduOdisha</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-5">
          {/* Star Rating */}
          <div>
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 block">
              Overall Rating <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map(s => (
                <button
                  key={s}
                  type="button"
                  onMouseEnter={() => setHovered(s)}
                  onMouseLeave={() => setHovered(0)}
                  onClick={() => setForm(f => ({ ...f, rating: s }))}
                  className="transition-transform hover:scale-110"
                >
                  <Star
                    size={28}
                    className={`transition-colors ${
                      s <= (hovered || form.rating)
                        ? 'text-amber-400 fill-amber-400'
                        : 'text-slate-200 fill-slate-200'
                    }`}
                  />
                </button>
              ))}
              <span className="text-sm font-bold text-slate-500 ml-1">
                {['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent'][hovered || form.rating]}
              </span>
            </div>
          </div>

          {/* Used for */}
          <div>
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 block">
              I used EduOdisha for
            </label>
            <div className="flex flex-wrap gap-2">
              {USED_FOR_OPTIONS.map(opt => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => setForm(f => ({ ...f, usedFor: opt }))}
                  className={`text-xs font-semibold px-3 py-1.5 rounded-lg border transition-all ${
                    form.usedFor === opt
                      ? 'bg-primary-600 text-white border-primary-600'
                      : 'bg-white text-slate-600 border-slate-200 hover:border-primary-300'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 block">
              Review Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={form.title}
              onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
              placeholder="e.g. Excellent counselling session!"
              maxLength={200}
              className="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400"
            />
          </div>

          {/* Review text */}
          <div>
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 block">
              Your Review <span className="text-red-500">*</span>
            </label>
            <textarea
              value={form.review}
              onChange={e => setForm(f => ({ ...f, review: e.target.value }))}
              placeholder="Tell us about your experience with EduOdisha — the counsellors, platform features, scholarships, etc."
              maxLength={2000}
              rows={4}
              className="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400 resize-none"
            />
            <p className="text-[10px] text-slate-400 mt-1 text-right">{form.review.length}/2000</p>
          </div>

          {/* Role + Location */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 block">
                Your Role
              </label>
              <input
                type="text"
                value={form.role}
                onChange={e => setForm(f => ({ ...f, role: e.target.value }))}
                placeholder="e.g. B.Tech Aspirant"
                maxLength={100}
                className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 block">
                Location
              </label>
              <input
                type="text"
                value={form.location}
                onChange={e => setForm(f => ({ ...f, location: e.target.value }))}
                placeholder="e.g. Bhubaneswar, Odisha"
                maxLength={100}
                className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400"
              />
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={mutation.isPending}
            className="w-full btn-cta py-3 text-sm font-bold rounded-xl flex items-center justify-center gap-2"
          >
            {mutation.isPending ? (
              <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Submitting...</>
            ) : (
              <><Send size={15} /> Submit Review</>
            )}
          </button>

          <p className="text-[10px] text-slate-400 text-center">
            Reviews are moderated and appear after approval.
          </p>
        </form>
      </motion.div>
    </div>
  );
}

// ─── Section Wrapper ──────────────────────────────────────
function Section({ children, className = '' }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.5 }}
      className={className}
    >
      {children}
    </motion.section>
  );
}

// ─── Section Header ───────────────────────────────────────
function SectionHeader({ eyebrow, title, subtitle, action }) {
  return (
    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
      <div className="max-w-xl">
        {eyebrow && (
          <p className="section-eyebrow">
            {eyebrow}
          </p>
        )}
        <h2 className="section-title">{title}</h2>
        {subtitle && <p className="section-subtitle">{subtitle}</p>}
      </div>
      {action && (
        <Link to={action.href} className="btn-secondary group shrink-0">
          {action.label}
          <ArrowRight size={15} className="group-hover:translate-x-0.5 transition-transform" />
        </Link>
      )}
    </div>
  );
}

// ─── Main HomePage ────────────────────────────────────────
export default function HomePage() {
  const navigate = useNavigate();
  const { user } = useSelector(state => state.auth);
  const { t } = useLanguage();
  const [searchQ, setSearchQ] = useState('');
  const [searchType, setSearchType] = useState('colleges');
  const [activeSlide, setActiveSlide] = useState(0);
  const [showReviewModal, setShowReviewModal] = useState(false);

  const slides = [
    {
      image: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800&q=80',
      title: 'IIT Bhubaneswar Campus',
      tag: 'NIRF Rank 47',
      desc: 'Top-tier technology institute offering world-class engineering programmes.'
    },
    {
      image: 'https://media.collegedekho.com/media/img/institute/crawled_images/None/DJI_0011.00_07_04_19.Still018.jpg',
      title: 'NIT Rourkela Library',
      tag: 'Top Engineering College',
      desc: 'Renowned national institute for academic excellence and high placement packages.'
    },
    {
      image: 'https://image-static.collegedunia.com/public/college_data/images/appImage/14878534504.jpg',
      title: 'Ravenshaw Heritage Hall',
      tag: 'Heritage Campus',
      desc: 'Established in 1868, offering rich legacy in arts, science and management.'
    }
  ];

  // Derived from translations
  const STATS = [
    { value: '500+', label: t('home.statsLabels.colleges') },
    { value: '250+', label: t('home.statsLabels.programmes') },
    { value: '120+', label: t('home.statsLabels.scholarships') },
    { value: '1L+',  label: t('home.statsLabels.studentsHelped') },
  ];

  const STREAMS = [
    { icon: '⚙️', label: t('home.streams.engineering'), count: '180+ colleges', href: '/colleges?category=Engineering' },
    { icon: '🏥', label: t('home.streams.medical'),     count: '60+ colleges',  href: '/colleges?category=Medical' },
    { icon: '📊', label: t('home.streams.management'), count: '90+ colleges',  href: '/colleges?category=Management' },
    { icon: '⚖️', label: t('home.streams.law'),        count: '30+ colleges',  href: '/colleges?category=Law' },
    { icon: '💊', label: t('home.streams.pharmacy'),   count: '45+ colleges',  href: '/colleges?category=Pharmacy' },
    { icon: '🎨', label: t('home.streams.artsScience'),count: '95+ colleges',  href: '/colleges?category=Arts+%26+Science' },
  ];

  const WHY_US_ITEMS = t('home.whyUs.items');
  const WHY_US_ICONS = [
    <CheckCircle size={22} className="text-primary-600" />,
    <Phone size={22} className="text-primary-600" />,
    <School size={22} className="text-primary-600" />,
  ];

  const POPULAR_TAGS = t('home.popularTags');

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide(curr => (curr + 1) % slides.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [slides.length]);

  const { data: featuredColleges } = useQuery({
    queryKey: ['featured-colleges'],
    queryFn: () => api.get('/colleges/featured').then(r => r.data.data),
  });

  const { data: scholarships } = useQuery({
    queryKey: ['featured-scholarships'],
    queryFn: () => api.get('/scholarships?limit=3&isFeatured=true').then(r => r.data.data),
  });

  const { data: blogs } = useQuery({
    queryKey: ['recent-blogs'],
    queryFn: () => api.get('/blogs?limit=3&isPublished=true').then(r => r.data.data),
  });

  const { data: platformReviews, isLoading: reviewsLoading } = useQuery({
    queryKey: ['platform-reviews'],
    queryFn: () => api.get('/platform-reviews?limit=6').then(r => r.data.data),
  });

  // Check if logged-in user already reviewed
  const { data: myReview } = useQuery({
    queryKey: ['my-platform-review'],
    queryFn: () => api.get('/platform-reviews/my-review').then(r => r.data.data),
    enabled: !!user,
  });

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQ.trim()) {
      navigate(`/${searchType}?search=${encodeURIComponent(searchQ)}`);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Helmet>
        <title>EduOdisha — Odisha's Most Trusted Education Platform</title>
        <meta
          name="description"
          content="Compare 500+ verified colleges, explore courses & scholarships, and get free career counseling for Odisha students. Find the best B.Tech, MBA, NEET colleges."
        />
      </Helmet>

      {/* ─── Hero ──────────────────────────────────────── */}
      <section className="relative pt-24 pb-16 lg:pt-32 lg:pb-24 overflow-hidden bg-slate-50 border-b border-slate-100">
        {/* Background Slideshow Layer */}
        <div className="absolute inset-0 z-0 overflow-hidden bg-slate-50">
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
          <div className="absolute inset-0 bg-gradient-to-b from-slate-50 via-transparent to-slate-50" />
        </div>

        {/* Slide Indicator Badge */}
        <div className="absolute bottom-4 right-4 z-20 hidden sm:flex items-center gap-2 bg-white/70 backdrop-blur-md border border-slate-200/60 px-3 py-1.5 rounded-full shadow-xs text-[11px] text-slate-600 select-none">
          <span className="w-1.5 h-1.5 rounded-full bg-primary-500 animate-pulse" />
          <span className="font-semibold text-slate-700">{slides[activeSlide].title}</span>
          <span className="text-slate-300">•</span>
          <span className="text-slate-500 font-medium">{slides[activeSlide].tag}</span>
        </div>

        {/* Content (relative z-10) */}
        <div className="container-xl relative z-10">
          <div className="max-w-4xl mx-auto text-center flex flex-col items-center">
            {/* Trust badge */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="inline-flex items-center gap-2 bg-primary-50/90 backdrop-blur-sm border border-primary-100 text-primary-700 text-xs font-bold px-3 py-1.5 rounded-full mb-6"
            >
              <CheckCircle size={12} className="text-primary-600" />
              {t('home.trustBadge')}
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.08 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-display font-extrabold text-slate-900 mb-5 leading-[1.15] tracking-tight text-center"
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
              className="text-base sm:text-lg text-slate-700 mb-8 max-w-2xl leading-relaxed font-medium text-center"
            >
              {t('home.heroSubtitle')}
            </motion.p>

            {/* Search Box */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.22 }}
              className="bg-white/95 backdrop-blur-sm border border-slate-200 rounded-xl shadow-md p-2 w-full max-w-2xl"
            >
              {/* Type Tabs */}
              <div className="flex items-center gap-1 mb-2 px-1">
                {['colleges', 'courses', 'exams', 'scholarships'].map(type => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setSearchType(type)}
                    className={`px-3 py-1.5 rounded-md text-xs font-semibold capitalize transition-all ${searchType === type
                      ? 'bg-primary-600 text-white'
                      : 'text-slate-500 hover:text-slate-700 hover:bg-slate-100'
                      }`}
                  >
                    {t(`navbar.${type}`)}
                  </button>
                ))}
              </div>
              {/* Input + Button */}
              <form onSubmit={handleSearch} className="flex items-center gap-2">
                <div className="flex-1 flex items-center gap-2 px-3">
                  <Search size={16} className="text-slate-400 shrink-0" />
                  <input
                    type="text"
                    value={searchQ}
                    onChange={e => setSearchQ(e.target.value)}
                    placeholder={t('home.searchPlaceholder').replace('{type}', searchType)}
                    id="hero-search"
                    className="flex-1 py-2.5 text-sm text-slate-700 placeholder:text-slate-400 bg-transparent outline-none font-medium"
                  />
                </div>
                <button type="submit" className="btn-cta py-2.5 px-6 text-sm rounded-lg">
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
              <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
                {t('home.popularLabel')}
              </span>
              {(Array.isArray(POPULAR_TAGS) ? POPULAR_TAGS : []).map(tag => (
                <button
                  key={tag}
                  onClick={() => navigate(`/colleges?search=${encodeURIComponent(tag)}`)}
                  className="text-xs font-medium text-slate-600 hover:text-primary-600 bg-white border border-slate-200 hover:border-primary-200 hover:bg-primary-50 px-3 py-1.5 rounded-lg transition-all"
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
                <div key={item} className="flex items-center gap-1.5 text-sm text-slate-500 font-medium">
                  <CheckCircle size={14} className="text-emerald-500" />
                  {item}
                </div>
              ))}
            </motion.div>

            {/* Subtle Carousel Indicator */}
            <div className="mt-12 flex items-center gap-2 bg-white/70 backdrop-blur-sm px-3.5 py-2 rounded-full border border-slate-200/50 shadow-sm">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{t('home.showing')}</span>
              <span className="text-[10px] font-bold text-primary-600 uppercase tracking-wider">
                {slides[activeSlide].title} ({slides[activeSlide].tag})
              </span>
              <div className="flex gap-1 ml-2">
                {slides.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveSlide(idx)}
                    className={`w-1.5 h-1.5 rounded-full transition-all ${activeSlide === idx ? 'bg-primary-600 w-3' : 'bg-slate-300'
                      }`}
                    aria-label={`Go to slide ${idx + 1}`}
                  />
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ─── Stats Bar ────────────────────────────────── */}
      <div className="bg-white border-y border-slate-100">
        <div className="container-xl py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-0 divide-x divide-slate-100">
            {STATS.map((s, i) => (
              <div key={i} className="px-8 first:pl-0 last:pr-0 text-center py-2">
                <div className="stat-value">
                  <AnimatedCounter value={s.value} />
                </div>
                <div className="stat-label">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ─── Featured Colleges ────────────────────────── */}
      <Section className="page-section bg-white">
        <div className="container-xl">
          <SectionHeader
            eyebrow={t('home.featuredColleges.eyebrow')}
            title={t('home.featuredColleges.title')}
            subtitle={t('home.featuredColleges.subtitle')}
            action={{ label: t('home.featuredColleges.action'), href: '/colleges' }}
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {(featuredColleges || Array(4).fill(null)).map((c, i) => (
              <CollegeCard key={c?._id || i} college={c} loading={!featuredColleges} />
            ))}
          </div>
        </div>
      </Section>

      {/* ─── Browse by Stream ─────────────────────────── */}
      <Section className="py-16 bg-slate-50">
        <div className="container-xl">
          <SectionHeader
            eyebrow={t('home.byStream.eyebrow')}
            title={t('home.byStream.title')}
            subtitle={t('home.byStream.subtitle')}
          />
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {STREAMS.map((stream) => (
              <Link
                key={stream.href}
                to={stream.href}
                className="bg-white border border-slate-200 hover:border-primary-200 hover:bg-primary-50 rounded-xl p-5 text-center transition-all duration-200 group"
              >
                <div className="text-3xl mb-3">{stream.icon}</div>
                <h3 className="text-sm font-bold text-slate-800 group-hover:text-primary-600 transition-colors mb-1">
                  {stream.label}
                </h3>
                <p className="text-[11px] text-slate-400 font-medium">{stream.count}</p>
              </Link>
            ))}
          </div>
        </div>
      </Section>

      {/* ─── Popular Exams ────────────────────────────── */}
      <Section className="page-section bg-white">
        <div className="container-xl">
          <SectionHeader
            eyebrow={t('home.exams.eyebrow')}
            title={t('home.exams.title')}
            subtitle={t('home.exams.subtitle')}
            action={{ label: t('home.exams.action'), href: '/exams' }}
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {[
              { name: 'OJEE 2025', type: 'State',      date: 'May 2025', color: 'bg-primary-50 border-primary-200 text-primary-700' },
              { name: 'JEE Main',  type: 'National',   date: 'Jan & Apr', color: 'bg-amber-50 border-amber-200 text-amber-700' },
              { name: 'NEET UG',   type: 'Medical',    date: 'May 2025', color: 'bg-emerald-50 border-emerald-200 text-emerald-700' },
              { name: 'CUET UG',   type: 'Central',    date: 'May 2025', color: 'bg-purple-50 border-purple-200 text-purple-700' },
              { name: 'CAT 2025',  type: 'Management', date: 'Nov 2025', color: 'bg-rose-50 border-rose-200 text-rose-700' },
              { name: 'OPSC OAS',  type: 'Govt Job',   date: 'Dec 2025', color: 'bg-slate-50 border-slate-200 text-slate-700' },
            ].map((exam) => (
              <Link
                key={exam.name}
                to={`/exams?search=${encodeURIComponent(exam.name)}`}
                className={`border rounded-xl p-4 transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 ${exam.color}`}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-bold uppercase tracking-wider opacity-70">
                    {exam.type}
                  </span>
                  <ChevronRight size={13} className="opacity-50" />
                </div>
                <h3 className="text-base font-bold mb-1">{exam.name}</h3>
                <div className="flex items-center gap-1.5 text-[11px] font-medium opacity-70">
                  <Calendar size={11} />
                  {exam.date}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </Section>

      {/* ─── Scholarships ─────────────────────────────── */}
      <Section className="py-16 bg-slate-50">
        <div className="container-xl">
          <SectionHeader
            eyebrow={t('home.scholarships.eyebrow')}
            title={t('home.scholarships.title')}
            subtitle={t('home.scholarships.subtitle')}
            action={{ label: t('home.scholarships.action'), href: '/scholarships' }}
          />
          {scholarships && scholarships.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {scholarships.map(s => (
                <Link
                  key={s._id}
                  to={`/scholarships/${s.slug}`}
                  className="bg-white border border-slate-200 hover:border-primary-200 rounded-xl p-6 transition-all duration-200 hover:shadow-md group"
                >
                  <div className="flex items-start justify-between mb-3">
                    <span className="badge badge-green">{s.category}</span>
                    {s.amount?.value && (
                      <span className="text-sm font-bold text-emerald-600">
                        ₹{(s.amount.value / 1000).toFixed(0)}K
                      </span>
                    )}
                  </div>
                  <h3 className="text-base font-bold text-slate-900 mb-2 line-clamp-2 group-hover:text-primary-600 transition-colors">
                    {s.name}
                  </h3>
                  <p className="text-xs text-slate-500 font-medium mb-3">{s.provider}</p>
                  {s.lastDate && (
                    <div className="flex items-center gap-1.5 text-xs text-slate-400">
                      <Calendar size={12} />
                      {t('home.scholarships.deadline')} {new Date(s.lastDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </div>
                  )}
                </Link>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {['Pre Matric Scholarship', 'Post Matric (SC/ST)', 'OPSC Merit Scholarship'].map((name, i) => (
                <Link
                  key={i}
                  to="/scholarships"
                  className="bg-white border border-slate-200 hover:border-primary-200 rounded-xl p-6 transition-all duration-200 hover:shadow-md group"
                >
                  <div className="flex items-start justify-between mb-3">
                    <span className="badge badge-green">{['Government', 'SC/ST', 'Merit'][i]}</span>
                    <span className="text-sm font-bold text-emerald-600">{['₹10K', '₹25K', '₹15K'][i]}</span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900 mb-2 group-hover:text-primary-600 transition-colors">{name}</h3>
                  <p className="text-xs text-slate-500 mb-3">Government of Odisha</p>
                  <span className="text-xs font-semibold text-primary-600 group-hover:underline">{t('home.scholarships.viewDetails')}</span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </Section>

      {/* ─── Why EduOdisha ────────────────────────────── */}
      <Section className="page-section bg-white">
        <div className="container-xl">
          <div className="max-w-xl mb-10">
            <p className="section-eyebrow">{t('home.whyUs.eyebrow')}</p>
            <h2 className="section-title">{t('home.whyUs.title')}</h2>
            <p className="section-subtitle">{t('home.whyUs.subtitle')}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {(Array.isArray(WHY_US_ITEMS) ? WHY_US_ITEMS : []).map((item, i) => (
              <div key={i} className="border border-slate-200 rounded-xl p-6">
                <div className="w-10 h-10 bg-primary-50 rounded-lg flex items-center justify-center mb-4">
                  {WHY_US_ICONS[i]}
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-2">{item.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* ─── Testimonials ─────────────────────────────── */}
      <Section className="py-16 bg-slate-50">
        <div className="container-xl">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
            <div className="max-w-xl">
              <p className="section-eyebrow">{t('home.testimonials.eyebrow')}</p>
              <h2 className="section-title">{t('home.testimonials.title')}</h2>
              <p className="section-subtitle">{t('home.testimonials.subtitle')}</p>
            </div>
            {/* Write a review CTA */}
            {user && !myReview && (
              <button
                onClick={() => setShowReviewModal(true)}
                className="btn-primary py-2.5 px-5 text-sm flex items-center gap-2 shrink-0 rounded-xl"
              >
                <PenLine size={14} /> {t('home.testimonials.writeReview')}
              </button>
            )}
            {user && myReview && (
              <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600 bg-emerald-50 border border-emerald-200 px-4 py-2 rounded-xl shrink-0">
                <CheckCircle size={14} /> {t('home.testimonials.youReviewed')}
              </div>
            )}
            {!user && (
              <Link to="/login" className="btn-secondary py-2.5 px-5 text-sm flex items-center gap-2 shrink-0 rounded-xl">
                <PenLine size={14} /> {t('home.testimonials.writeReview')}
              </Link>
            )}
          </div>

          {/* Reviews Grid */}
          {reviewsLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {[1, 2, 3].map(i => (
                <div key={i} className="bg-white border border-slate-200 rounded-xl p-6 animate-pulse space-y-3">
                  <div className="flex gap-1">{[...Array(5)].map((_, j) => <div key={j} className="w-3 h-3 bg-slate-100 rounded" />)}</div>
                  <div className="h-3 bg-slate-100 rounded w-full" />
                  <div className="h-3 bg-slate-100 rounded w-5/6" />
                  <div className="h-3 bg-slate-100 rounded w-4/6" />
                  <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
                    <div className="w-9 h-9 rounded-full bg-slate-100" />
                    <div className="space-y-1.5"><div className="h-3 bg-slate-100 rounded w-24" /><div className="h-2 bg-slate-100 rounded w-32" /></div>
                  </div>
                </div>
              ))}
            </div>
          ) : platformReviews && platformReviews.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {platformReviews.map((review) => (
                <div key={review._id} className="bg-white border border-slate-200 rounded-xl p-6 hover:shadow-md transition-shadow duration-200">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-1">
                      {[...Array(review.rating)].map((_, j) => (
                        <Star key={j} size={14} className="text-amber-400 fill-amber-400" />
                      ))}
                      {[...Array(5 - review.rating)].map((_, j) => (
                        <Star key={j} size={14} className="text-slate-200 fill-slate-200" />
                      ))}
                    </div>
                    <div className="flex items-center gap-2">
                      {review.isFeatured && <span className="text-[9px] font-bold text-amber-600 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">⭐ Featured</span>}
                      <span className="text-[10px] font-semibold text-slate-400">
                        {new Date(review.createdAt).getFullYear()}
                      </span>
                    </div>
                  </div>
                  <Quote size={20} className="text-slate-200 mb-3" />
                  {review.title && <p className="text-sm font-bold text-slate-800 mb-1">{review.title}</p>}
                  <p className="text-sm text-slate-600 leading-relaxed mb-5 line-clamp-4">{review.review}</p>
                  {review.usedFor && (
                    <span className="inline-block text-[10px] font-bold text-primary-600 bg-primary-50 border border-primary-100 px-2.5 py-1 rounded-full mb-4">
                      {t('home.testimonials.usedFor')} {review.usedFor}
                    </span>
                  )}
                  <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
                    <div className="w-9 h-9 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold text-sm shrink-0">
                      {review.user?.name?.[0]?.toUpperCase() || '?'}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-slate-900">{review.user?.name || 'Anonymous'}</p>
                      <p className="text-[11px] text-slate-400 font-medium truncate">
                        {[review.role, review.location].filter(Boolean).join(' · ') || 'EduOdisha User'}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* Empty state */
            <div className="bg-white border border-dashed border-slate-300 rounded-2xl py-16 text-center">
              <div className="w-14 h-14 bg-primary-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star size={24} className="text-primary-400" />
              </div>
              <h3 className="text-base font-bold text-slate-700 mb-2">{t('home.testimonials.noReviews')}</h3>
              <p className="text-sm text-slate-400 mb-6 max-w-xs mx-auto">
                {t('home.testimonials.beFirst')}
              </p>
              {user ? (
                <button
                  onClick={() => setShowReviewModal(true)}
                  className="btn-primary py-2.5 px-6 inline-flex items-center gap-2 rounded-xl text-sm font-bold"
                >
                  <PenLine size={14} /> {t('home.testimonials.writeFirst')}
                </button>
              ) : (
                <Link to="/login" className="btn-primary py-2.5 px-6 inline-flex items-center gap-2 rounded-xl text-sm font-bold">
                  <PenLine size={14} /> {t('home.testimonials.loginReview')}
                </Link>
              )}
            </div>
          )}
        </div>
      </Section>

      {/* Write Review Modal */}
      {showReviewModal && (
        <WriteReviewModal
          onClose={() => setShowReviewModal(false)}
          onSuccess={() => setShowReviewModal(false)}
        />
      )}

      {/* ─── Blog Articles ────────────────────────────── */}
      {blogs && blogs.length > 0 && (
        <Section className="page-section bg-white">
          <div className="container-xl">
            <SectionHeader
              eyebrow={t('home.blogs.eyebrow')}
              title={t('home.blogs.title')}
              subtitle={t('home.blogs.subtitle')}
              action={{ label: t('home.blogs.action'), href: '/blogs' }}
            />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {blogs.map(blog => (
                <Link
                  key={blog._id}
                  to={`/blogs/${blog.slug}`}
                  className="group bg-white border border-slate-200 hover:border-slate-300 hover:shadow-md rounded-xl overflow-hidden transition-all duration-200"
                >
                  {blog.image?.url && (
                    <div className="h-44 overflow-hidden">
                      <img
                        src={blog.image.url}
                        alt={blog.title}
                        className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-300"
                        loading="lazy"
                      />
                    </div>
                  )}
                  <div className="p-5">
                    <span className="badge badge-blue mb-3">{blog.category}</span>
                    <h3 className="text-sm font-bold text-slate-900 line-clamp-2 mb-2 group-hover:text-primary-600 transition-colors">
                      {blog.title}
                    </h3>
                    {blog.excerpt && (
                      <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed mb-3">
                        {blog.excerpt}
                      </p>
                    )}
                    <p className="text-[11px] text-slate-400 font-medium">
                      {new Date(blog.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </Section>
      )}

      {/* ─── CTA Strip ────────────────────────────────── */}
      <section className="bg-primary-900 py-14">
        <div className="container-xl">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div>
              <h2 className="text-2xl font-display font-bold text-white mb-2">
                {t('home.cta.title')}
              </h2>
              <p className="text-primary-200 text-sm font-medium">
                {t('home.cta.subtitle')}
              </p>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <a href="tel:+917205402554" className="btn-cta py-3 px-6 text-sm gap-2">
                <Phone size={15} />
                {t('home.cta.callBtn')}
              </a>
              <Link to="/colleges" className="btn-secondary py-3 px-6 text-sm bg-white/10 border-white/20 text-white hover:bg-white/20">
                {t('home.cta.browseBtn')}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

import { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import {
  Search, BookOpen, Award, 
  School, Users, Sparkles, ArrowRight,
  Target,
} from 'lucide-react';
import api from '../utils/api.js';
import CollegeCard from '../components/college/CollegeCard.jsx';

const stats = [
  { label: 'Verified Colleges', val: '500+', icon: School },
  { label: 'Popular Courses', val: '250+', icon: BookOpen },
  { label: 'Active Scholarships', val: '120+', icon: Award },
  { label: 'Expert Counselors', val: '50+', icon: Users },
];

const trendingSearches = ['B.Tech in Bhubaneswar', 'MBA Admission 2025', 'NEET Odisha Cutoff', 'OJEE 2025'];

function AnimatedCounter({ value }) {
  const [count, setCount] = useState('0');
  const ref = useRef(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          const num = parseInt(value.replace(/[^0-9]/g, ''));
          let start = 0;
          const step = Math.ceil(num / 60);
          const timer = setInterval(() => {
            start += step;
            if (start >= num) {
              setCount(value);
              clearInterval(timer);
            } else {
              setCount(start + '+');
            }
          }, 20);
        }
      },
      { threshold: 0.5 },
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [value]);

  return <span ref={ref}>{count}</span>;
}

function FadeIn({ children, delay = 0, className = '' }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export default function HomePage() {
  const navigate = useNavigate();
  const [searchQ, setSearchQ] = useState('');
  const [searchType, setSearchType] = useState('colleges');

  const { data: featuredColleges } = useQuery({
    queryKey: ['featured-colleges'],
    queryFn: () => api.get('/colleges/featured').then((r) => r.data.data),
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
        <title>EduOdisha - Best Colleges, Courses & Exams in Odisha 2025</title>
        <meta name="description" content="Odisha's premier education discovery platform. Compare 500+ verified colleges, courses, scholarships, and get free career counseling." />
      </Helmet>

      {/* Hero Section */}
      <section className="relative min-h-[85vh] flex items-center overflow-hidden bg-hero-pattern pt-20">
        <div className="absolute inset-0 bg-mesh-light opacity-50" />
        
        <div className="container-xl relative z-10 w-full py-12 lg:py-20">
          <div className="max-w-4xl">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 bg-primary-50 text-primary-700 px-4 py-1.5 rounded-full mb-8 text-xs font-bold uppercase tracking-wider border border-primary-100"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Trusted by 50,000+ students in Odisha
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl sm:text-5xl lg:text-7xl font-display font-extrabold text-slate-900 mb-6 leading-[1.1] tracking-tight"
            >
              Find the Best <span className="text-primary-600">College</span>
              <br />
              for Your Future in Odisha
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg text-slate-500 mb-10 max-w-2xl font-normal leading-relaxed"
            >
              Discover 500+ verified colleges, explore 250+ courses, 
              compare rankings &amp; get personalized career counseling—all in one place.
            </motion.p>

            {/* Search Box */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="bg-white p-2 rounded-2xl shadow-2xl shadow-primary-900/10 border border-slate-100 max-w-3xl"
            >
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                <div className="flex bg-slate-50 p-1 rounded-xl shrink-0">
                  {['colleges', 'courses', 'exams'].map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setSearchType(type)}
                      className={`px-4 py-2 rounded-lg text-xs font-bold capitalize transition-all ${
                        searchType === type
                          ? 'bg-white text-primary-700 shadow-sm'
                          : 'text-slate-500 hover:text-slate-800'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
                <form onSubmit={handleSearch} className="flex-1 flex items-center px-3 gap-2">
                  <Search className="text-slate-400 shrink-0" size={18} />
                  <input
                    type="text"
                    value={searchQ}
                    onChange={(e) => setSearchQ(e.target.value)}
                    placeholder={`Search 500+ ${searchType} in Odisha...`}
                    className="w-full py-3 bg-transparent outline-none text-slate-700 font-medium text-sm placeholder:text-slate-400"
                  />
                </form>
                <button
                  type="submit"
                  onClick={handleSearch}
                  className="btn-primary py-3 px-8 rounded-xl text-sm whitespace-nowrap"
                >
                  Find Now
                </button>
              </div>
            </motion.div>

            {/* Trending */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="mt-8 flex flex-wrap items-center gap-3 text-xs"
            >
              <span className="text-slate-400 font-bold uppercase tracking-wider">Trending:</span>
              {trendingSearches.map((link) => (
                <button
                  key={link}
                  onClick={() => navigate(`/colleges?search=${encodeURIComponent(link)}`)}
                  className="text-slate-600 hover:text-primary-700 transition-all font-semibold bg-slate-50 hover:bg-primary-50 px-3 py-1.5 rounded-lg border border-slate-100 hover:border-primary-100"
                >
                  {link}
                </button>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative z-20 -mt-10 mb-10">
        <div className="container-xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="bg-white rounded-xl p-6 border border-slate-100 shadow-sm flex items-center gap-4 hover:border-primary-100 hover:shadow-md transition-all"
              >
                <div className="w-12 h-12 rounded-lg bg-primary-50 flex items-center justify-center text-primary-600 shrink-0">
                  <stat.icon size={24} />
                </div>
                <div>
                  <div className="text-2xl font-bold text-slate-900 leading-tight">
                    <AnimatedCounter value={stat.val} />
                  </div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
                    {stat.label}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Colleges */}
      <section className="py-20 bg-slate-50/50">
        <div className="container-xl">
          <FadeIn>
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
              <div className="max-w-2xl">
                <div className="inline-flex items-center gap-1.5 text-primary-600 font-bold text-xs uppercase tracking-widest mb-3">
                   <Target size={14} /> Top Rated Institutions
                </div>
                <h2 className="section-title">Featured Colleges</h2>
                <p className="section-subtitle">
                  Explore the highest-rated institutions in Odisha based on student reviews, 
                  placement records, and faculty excellence.
                </p>
              </div>
              <Link to="/colleges" className="btn-secondary group">
                View All Colleges
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </FadeIn>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {(featuredColleges || Array(4).fill(null)).map((c, i) => (
              <FadeIn key={c?._id || i} delay={i * 0.1}>
                <CollegeCard college={c} loading={!featuredColleges} />
              </FadeIn>
            ))}
          </div>
        </div>
      </section>
      
    </div>
  );
}

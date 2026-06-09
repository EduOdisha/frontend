import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useQuery } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import { Phone, Calendar, ChevronRight } from 'lucide-react';
import api from '../utils/api.js';
import CollegeCard from '../components/college/CollegeCard.jsx';
import { useLanguage } from '../context/LanguageContext';

// Import Modular Sub-components
import WriteReviewModal from '../components/home/WriteReviewModal';
import HomeHero from '../components/home/HomeHero';
import HomeStats from '../components/home/HomeStats';
import HomeStreams from '../components/home/HomeStreams';
import HomeWhyUs from '../components/home/HomeWhyUs';
import HomeTestimonials from '../components/home/HomeTestimonials';
import { Section, SectionHeader } from '../components/home/HomeSections';

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
  const stats = [
    { value: '500+', label: t('home.statsLabels.colleges') },
    { value: '250+', label: t('home.statsLabels.programmes') },
    { value: '120+', label: t('home.statsLabels.scholarships') },
    { value: '1L+',  label: t('home.statsLabels.studentsHelped') },
  ];

  const streams = [
    { icon: '⚙️', label: t('home.streams.engineering'), count: '180+ colleges', href: '/colleges?category=Engineering' },
    { icon: '🏥', label: t('home.streams.medical'),     count: '60+ colleges',  href: '/colleges?category=Medical' },
    { icon: '📊', label: t('home.streams.management'), count: '90+ colleges',  href: '/colleges?category=Management' },
  ];

  const whyUsItems = t('home.whyUs.items');
  const popularTags = t('home.popularTags');

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

      {/* Hero Banner */}
      <HomeHero
        slides={slides}
        activeSlide={activeSlide}
        setActiveSlide={setActiveSlide}
        searchQ={searchQ}
        setSearchQ={setSearchQ}
        searchType={searchType}
        setSearchType={setSearchType}
        handleSearch={handleSearch}
        t={t}
        popularTags={popularTags}
        navigate={navigate}
      />

      {/* Stats Bar */}
      <HomeStats stats={stats} />

      {/* Featured Colleges */}
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

      {/* Browse by Stream */}
      <HomeStreams streams={streams} t={t} />

      {/* Popular Exams */}
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
              { name: 'CUET UG',   type: 'Central',    date: 'May 2025', color: 'bg-emerald-50 border-emerald-200 text-emerald-700' },
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

      {/* Scholarships */}
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

      {/* Why EduOdisha */}
      <HomeWhyUs items={whyUsItems} t={t} />

      {/* Testimonials */}
      <HomeTestimonials
        user={user}
        myReview={myReview}
        reviewsLoading={reviewsLoading}
        platformReviews={platformReviews}
        setShowReviewModal={setShowReviewModal}
        t={t}
      />

      {/* Write Review Modal */}
      {showReviewModal && (
        <WriteReviewModal
          onClose={() => setShowReviewModal(false)}
          onSuccess={() => setShowReviewModal(false)}
        />
      )}

      {/* Blog Articles */}
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

      {/* CTA Strip */}
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

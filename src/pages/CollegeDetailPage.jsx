import { useState, useRef, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useDispatch, useSelector } from 'react-redux';
import { Helmet } from 'react-helmet-async';
import { updateUserSaved } from '../store/slices/authSlice';
import { addToCompare, removeFromCompare } from '../store/slices/compareSlice';
import { toast } from 'react-hot-toast';
import LeadForm from '../components/common/LeadForm';
import {
  MapPin, Star, Download, Share2, Heart, GitCompare,
  ChevronRight, Calendar, Award, BookOpen,
  Users, Building, IndianRupee, Briefcase,
  CheckCircle2, Globe, Phone, Mail, HelpCircle,
  Image as ImageIcon, MessageSquare, Info,
  TrendingUp, ArrowRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../utils/api';

const TABS = [
  { id: 'overview', label: 'Overview', icon: Info },
  { id: 'admissions', label: 'Admissions', icon: BookOpen },
  { id: 'courses', label: 'Courses & Fees', icon: IndianRupee },
  { id: 'placements', label: 'Placements', icon: Briefcase },
  { id: 'facilities', label: 'Facilities', icon: Building },
  { id: 'gallery', label: 'Gallery', icon: ImageIcon },
  { id: 'reviews', label: 'Reviews', icon: MessageSquare },
  { id: 'faqs', label: 'FAQs', icon: HelpCircle },
  { id: 'contact', label: 'Contact', icon: Phone },
];

const FACILITY_ICONS = {
  hostel: '🏠', library: '📚', sports: '⚽', canteen: '🍽️',
  wifi: '📶', lab: '🔬', transport: '🚌', medicalFacility: '🏥',
  gym: '💪',
};

// ─── Loading Skeleton ─────────────────────────────────────
function DetailSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="skeleton h-56 lg:h-72 w-full" />
      <div className="bg-white border-b border-slate-200 px-6 py-6">
        <div className="container-xl">
          <div className="flex gap-6 items-start">
            <div className="skeleton w-24 h-24 rounded-xl" />
            <div className="flex-1 space-y-3 pt-2">
              <div className="skeleton h-6 w-64 rounded" />
              <div className="skeleton h-4 w-48 rounded" />
              <div className="skeleton h-4 w-80 rounded" />
            </div>
          </div>
        </div>
      </div>
      <div className="container-xl mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          <div className="skeleton h-48 rounded-xl" />
          <div className="skeleton h-32 rounded-xl" />
        </div>
        <div className="skeleton h-80 rounded-xl" />
      </div>
    </div>
  );
}

// ─── Stat Card ────────────────────────────────────────────
function StatCard({ icon: Icon, label, value, color = 'text-primary-600', bg = 'bg-primary-50' }) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 flex items-center gap-4">
      <div className={`w-11 h-11 ${bg} rounded-lg flex items-center justify-center shrink-0`}>
        <Icon size={20} className={color} />
      </div>
      <div>
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-0.5">{label}</p>
        <p className="text-lg font-bold text-slate-900">{value}</p>
      </div>
    </div>
  );
}

// ─── FAQ Accordion ────────────────────────────────────────
function FaqItem({ faq }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-slate-200 rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-slate-50 transition-colors"
      >
        <span className="text-sm font-semibold text-slate-800 pr-4">{faq.question}</span>
        <ChevronRight
          size={16}
          className={`text-slate-400 shrink-0 transition-transform duration-200 ${open ? 'rotate-90' : ''}`}
        />
      </button>
      {open && (
        <div className="px-5 pb-4 pt-0 border-t border-slate-100">
          <p className="text-sm text-slate-600 leading-relaxed">{faq.answer}</p>
        </div>
      )}
    </div>
  );
}

export default function CollegeDetailPage() {
  const { slug } = useParams();
  const dispatch = useDispatch();
  const { colleges: compareList } = useSelector(state => state.compare);
  const { user, isAuthenticated } = useSelector(state => state.auth);
  const [activeTab, setActiveTab] = useState('overview');
  const tabsRef = useRef(null);

  const { data: college, isLoading, error } = useQuery({
    queryKey: ['college', slug],
    queryFn: async () => {
      const { data } = await api.get(`/colleges/${slug}`);
      return data.data;
    },
  });

  const isCurrentlySaved = user?.savedColleges?.some(id => 
    typeof id === 'object' ? id._id === college?._id : id === college?._id
  );

  const [isFavorite, setIsFavorite] = useState(isCurrentlySaved || false);

  useEffect(() => {
    setIsFavorite(isCurrentlySaved || false);
  }, [isCurrentlySaved, college]);

  const { data: similarColleges } = useQuery({
    queryKey: ['similar-colleges', college?.category],
    queryFn: async () => {
      const { data } = await api.get(`/colleges?category=${college?.category}&limit=4`);
      return data.data?.filter(c => c._id !== college?._id).slice(0, 3);
    },
    enabled: !!college,
  });

  const isCompared = compareList.some(c => c._id === college?._id);

  const handleCompare = () => {
    if (isCompared) {
      dispatch(removeFromCompare(college._id));
    } else {
      if (compareList.length >= 4) { toast.error('Max 4 colleges in compare'); return; }
      dispatch(addToCompare(college));
      toast.success('Added to compare');
    }
  };

  const handleSaveCollege = async () => {
    if (!isAuthenticated) {
      toast.error('Please log in to save colleges');
      return;
    }
    try {
      const { data } = await api.post(`/users/save-college/${college._id}`);
      setIsFavorite(data.saved);
      dispatch(updateUserSaved({ savedColleges: data.savedColleges }));
      toast.success(data.saved ? 'College saved to wishlist' : 'Removed from saved');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update saved colleges');
    }
  };

  const switchTab = (id) => {
    setActiveTab(id);
    setTimeout(() => {
      document.getElementById('tab-content')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  if (isLoading) return <DetailSkeleton />;
  if (error || !college) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-slate-800 mb-4">College not found</h2>
        <Link to="/colleges" className="btn-primary">Back to Colleges</Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 pb-16">
      <Helmet>
        <title>{college.name} — Fees, Courses, Placements | EduOdisha</title>
        <meta name="description" content={college.about?.substring(0, 155) || `Explore ${college.name} — fees, courses, placements, rankings and admission process.`} />
      </Helmet>

      {/* ─── Banner ────────────────────────────────────── */}
      <div className="relative h-52 md:h-64 lg:h-72 w-full overflow-hidden bg-slate-200">
        <img
          src={college.banner?.url || 'https://images.unsplash.com/photo-1562774053-701939374585?w=1400&q=80&auto=format&fit=crop'}
          alt={`${college.name} campus`}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />
      </div>

      {/* ─── College Hero ──────────────────────────────── */}
      <div className="bg-white border-b border-slate-200 relative z-10">
        <div className="container-xl">
          {/* College info row */}
          <div className="flex flex-col lg:flex-row gap-6 items-start -mt-14 mb-5 relative z-10">
            {/* Logo */}
            <div className="w-28 h-28 bg-white rounded-xl shadow-lg border-2 border-white flex items-center justify-center overflow-hidden shrink-0 ml-4 lg:ml-0">
              {college.logo?.url ? (
                <img src={college.logo.url} alt={`${college.name} logo`} className="w-full h-full object-contain p-2" />
              ) : (
                <span className="text-3xl font-black text-primary-600">{college.name[0]}</span>
              )}
            </div>

            <div className="flex-1 pt-2 lg:pt-16 px-4 lg:px-0">
              {/* Tags */}
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className="badge badge-blue">{college.type}</span>
                <span className="badge badge-purple">{college.category}</span>
                {college.naacGrade && college.naacGrade !== 'Not Accredited' && (
                  <span className="badge badge-green">NAAC {college.naacGrade}</span>
                )}
                {college.nirfRanking && (
                  <span className="badge badge-amber">NIRF #{college.nirfRanking}</span>
                )}
                {college.isVerified && (
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-primary-700 bg-primary-50 border border-primary-100 px-2.5 py-1 rounded-full">
                    <CheckCircle2 size={11} /> Verified
                  </span>
                )}
              </div>

              <h1 className="text-2xl lg:text-3xl font-display font-extrabold text-slate-900 mb-2 tracking-tight">
                {college.name}
              </h1>

              <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500 mb-4">
                <span className="flex items-center gap-1.5 font-medium">
                  <MapPin size={14} className="text-primary-500" />
                  {college.location?.city}, {college.location?.state}
                </span>
                {college.affiliation && (
                  <span className="flex items-center gap-1.5 font-medium">
                    <Award size={14} className="text-amber-500" />
                    {college.affiliation}
                  </span>
                )}
                {college.established && (
                  <span className="flex items-center gap-1.5 font-medium">
                    <Calendar size={14} className="text-slate-400" />
                    Est. {college.established}
                  </span>
                )}
              </div>

              {/* Rating + Actions */}
              <div className="flex flex-wrap items-center gap-5">
                {college.rating?.average > 0 && (
                  <div className="flex items-center gap-2">
                    <div className="bg-emerald-500 text-white text-sm font-bold px-2.5 py-1 rounded-lg flex items-center gap-1">
                      <Star size={13} className="fill-white" />
                      {college.rating.average.toFixed(1)}
                    </div>
                    <span className="text-sm text-slate-500 font-medium">
                      {college.rating.count} reviews
                    </span>
                  </div>
                )}

                <div className="flex items-center gap-3">
                  <button
                    onClick={handleSaveCollege}
                    className={`flex items-center gap-1.5 text-xs font-semibold transition-colors px-3 py-1.5 rounded-lg border ${
                      isFavorite ? 'text-red-600 bg-red-50 border-red-200' : 'text-slate-500 border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <Heart size={13} className={isFavorite ? 'fill-red-500' : ''} />
                    {isFavorite ? 'Saved' : 'Save'}
                  </button>

                  <button
                    onClick={handleCompare}
                    className={`flex items-center gap-1.5 text-xs font-semibold transition-colors px-3 py-1.5 rounded-lg border ${
                      isCompared ? 'text-primary-600 bg-primary-50 border-primary-200' : 'text-slate-500 border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <GitCompare size={13} />
                    {isCompared ? 'Comparing' : 'Compare'}
                  </button>

                  <button
                    onClick={() => { navigator.clipboard.writeText(window.location.href); toast.success('Link copied!'); }}
                    className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 border border-slate-200 hover:border-slate-300 px-3 py-1.5 rounded-lg transition-colors"
                  >
                    <Share2 size={13} /> Share
                  </button>
                </div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex lg:flex-col gap-3 w-full lg:w-auto px-4 lg:px-0 lg:pt-20 shrink-0">
              <button
                onClick={() => college.brochure?.url ? window.open(college.brochure.url, '_blank') : toast.error('Brochure unavailable')}
                className="flex-1 lg:flex-none btn-secondary py-2.5 text-sm"
              >
                <Download size={15} /> Brochure
              </button>
              <button
                onClick={() => switchTab('contact')}
                className="flex-1 lg:flex-none btn-cta py-2.5 text-sm"
              >
                Apply Now
              </button>
            </div>
          </div>

          {/* Breadcrumbs */}
          <nav className="flex items-center gap-1.5 text-xs text-slate-400 font-medium mb-0 pb-3 px-4 lg:px-0">
            <Link to="/" className="hover:text-primary-600 transition-colors">Home</Link>
            <ChevronRight size={11} />
            <Link to="/colleges" className="hover:text-primary-600 transition-colors">Colleges</Link>
            <ChevronRight size={11} />
            <span className="text-slate-600">{college.shortName || college.name}</span>
          </nav>

          {/* ─── Tabs ─── */}
          <div ref={tabsRef} className="flex items-center gap-0 border-t border-slate-100 overflow-x-auto scrollbar-hide -mx-4 lg:mx-0 px-4 lg:px-0">
            {TABS.map(tab => (
              <button
                key={tab.id}
                onClick={() => switchTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3.5 text-sm font-semibold whitespace-nowrap transition-all relative shrink-0 ${
                  activeTab === tab.id
                    ? 'text-primary-600'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                <tab.icon size={14} />
                {tab.label}
                {activeTab === tab.id && (
                  <motion.div
                    layoutId="tab-indicator"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-600 rounded-t-full"
                  />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ─── Main Content ──────────────────────────────── */}
      <div className="container-xl mt-6" id="tab-content">
        <div className="flex gap-7">
          {/* Left: Tab Content */}
          <div className="flex-1 min-w-0">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.18 }}
              >
                {/* ── Overview ── */}
                {activeTab === 'overview' && (
                  <div className="space-y-5">
                    {/* Quick Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <StatCard icon={IndianRupee} label="Avg. Fees / yr" value={college.fees?.min ? `₹${college.fees.min.toLocaleString()}` : 'N/A'} />
                      <StatCard icon={TrendingUp} label="Avg. Package" value={college.placements?.averagePackage ? `₹${college.placements.averagePackage} LPA` : 'N/A'} color="text-emerald-600" bg="bg-emerald-50" />
                      <StatCard icon={Award} label="NIRF Rank" value={college.nirfRanking ? `#${college.nirfRanking}` : 'N/A'} color="text-amber-600" bg="bg-amber-50" />
                      <StatCard icon={Users} label="Total Seats" value={college.courses?.reduce((s, c) => s + (c.seats || 0), 0) || 'N/A'} color="text-purple-600" bg="bg-purple-50" />
                    </div>

                    {/* About */}
                    <div className="bg-white border border-slate-200 rounded-xl p-6">
                      <h2 className="text-xl font-bold text-slate-900 mb-4">About {college.name}</h2>
                      <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                        {college.about || 'Detailed information about this college will be updated shortly.'}
                      </p>
                    </div>

                    {/* Highlights */}
                    {college.highlights?.length > 0 && (
                      <div className="bg-white border border-slate-200 rounded-xl p-6">
                        <h3 className="text-lg font-bold text-slate-900 mb-4">Key Highlights</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {college.highlights.map((h, i) => (
                            <div key={i} className="flex items-start gap-2.5">
                              <CheckCircle2 size={16} className="text-emerald-500 mt-0.5 shrink-0" />
                              <span className="text-sm text-slate-700 font-medium">{h}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Approvals */}
                    {college.approvals?.length > 0 && (
                      <div className="bg-white border border-slate-200 rounded-xl p-6">
                        <h3 className="text-base font-bold text-slate-900 mb-3">Approvals & Accreditations</h3>
                        <div className="flex flex-wrap gap-2">
                          {college.approvals.map(a => (
                            <span key={a} className="badge badge-blue text-xs">{a}</span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* ── Admissions ── */}
                {activeTab === 'admissions' && (
                  <div className="space-y-5">
                    <div className="bg-white border border-slate-200 rounded-xl p-6">
                      <h2 className="text-xl font-bold text-slate-900 mb-5">Admission Process</h2>
                      <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line mb-6">
                        {college.admissions?.process || 'Admission details will be updated soon.'}
                      </p>

                      {college.admissions?.entranceExams?.length > 0 && (
                        <div>
                          <h3 className="text-base font-bold text-slate-900 mb-3">Required Entrance Exams</h3>
                          <div className="flex flex-wrap gap-2">
                            {college.admissions.entranceExams.map(e => (
                              <Link
                                key={e}
                                to={`/exams?search=${encodeURIComponent(e)}`}
                                className="badge badge-blue hover:bg-primary-100 transition-colors text-sm py-1.5 px-3"
                              >
                                {e}
                              </Link>
                            ))}
                          </div>
                        </div>
                      )}

                      {college.admissions?.applicationLink && (
                        <div className="mt-6 pt-6 border-t border-slate-100">
                          <a
                            href={college.admissions.applicationLink}
                            target="_blank"
                            rel="noreferrer"
                            className="btn-cta py-2.5 inline-flex"
                          >
                            Apply on Official Website <ArrowRight size={15} />
                          </a>
                          {college.admissions.lastDate && (
                            <p className="mt-2 text-xs text-slate-500">
                              Last date: {new Date(college.admissions.lastDate).toLocaleDateString('en-IN')}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* ── Courses & Fees ── */}
                {activeTab === 'courses' && (
                  <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
                    <div className="p-6 border-b border-slate-100">
                      <h2 className="text-xl font-bold text-slate-900">Courses, Fees & Eligibility</h2>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="table-base">
                        <thead>
                          <tr>
                            <th>Course</th>
                            <th>Duration</th>
                            <th>1st Year Fees</th>
                            <th>Seats</th>
                            <th>Eligibility</th>
                          </tr>
                        </thead>
                        <tbody>
                          {college.courses?.length > 0 ? college.courses.map((course, i) => (
                            <tr key={i}>
                              <td className="font-semibold text-slate-900">{course.name}</td>
                              <td className="text-slate-500">{course.duration}</td>
                              <td className="font-semibold text-primary-600">
                                {course.fees?.min ? `₹${course.fees.min.toLocaleString()}` : '—'}
                              </td>
                              <td className="text-slate-600">{course.seats || '—'}</td>
                              <td className="text-slate-500 text-xs">{course.eligibility || '—'}</td>
                            </tr>
                          )) : (
                            <tr>
                              <td colSpan={5} className="text-center text-slate-400 py-8 text-sm">Course details not available yet.</td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* ── Placements ── */}
                {activeTab === 'placements' && (
                  <div className="space-y-5">
                    {/* Stat Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {[
                        { label: 'Average Package', value: college.placements?.averagePackage ? `₹${college.placements.averagePackage} LPA` : 'N/A', color: 'text-primary-600', bg: 'bg-primary-50' },
                        { label: 'Highest Package', value: college.placements?.highestPackage ? `₹${college.placements.highestPackage} LPA` : 'N/A', color: 'text-amber-600', bg: 'bg-amber-50' },
                        { label: 'Placement Rate', value: college.placements?.placementPercentage ? `${college.placements.placementPercentage}%` : 'N/A', color: 'text-emerald-600', bg: 'bg-emerald-50' },
                      ].map(s => (
                        <div key={s.label} className={`${s.bg} border border-slate-200 rounded-xl p-5`}>
                          <p className={`text-xs font-bold uppercase tracking-wide mb-2 ${s.color}`}>{s.label}</p>
                          <p className="text-3xl font-extrabold text-slate-900">{s.value}</p>
                        </div>
                      ))}
                    </div>

                    {/* Description */}
                    {college.placements?.description && (
                      <div className="bg-white border border-slate-200 rounded-xl p-6">
                        <p className="text-sm text-slate-600 leading-relaxed">{college.placements.description}</p>
                      </div>
                    )}

                    {/* Recruiters */}
                    {college.placements?.topRecruiters?.length > 0 && (
                      <div className="bg-white border border-slate-200 rounded-xl p-6">
                        <h3 className="text-base font-bold text-slate-900 mb-4">Top Recruiters</h3>
                        <div className="flex flex-wrap gap-2">
                          {college.placements.topRecruiters.map((r, i) => (
                            <span key={i} className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium text-slate-700">
                              {r}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* ── Facilities ── */}
                {activeTab === 'facilities' && (
                  <div className="bg-white border border-slate-200 rounded-xl p-6">
                    <h2 className="text-xl font-bold text-slate-900 mb-5">Campus Facilities</h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                      {Object.entries(college.facilities || {}).map(([key, value]) => {
                        if (typeof value !== 'boolean') return null;
                        const emoji = FACILITY_ICONS[key] || '✅';
                        const label = key.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase());
                        return (
                          <div
                            key={key}
                            className={`flex items-center gap-3 p-3.5 rounded-xl border transition-all ${
                              value
                                ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                                : 'bg-slate-50 border-slate-100 text-slate-400 opacity-60'
                            }`}
                          >
                            <span className="text-lg">{emoji}</span>
                            <span className="text-sm font-semibold">{label}</span>
                            {!value && <span className="text-xs ml-auto">No</span>}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* ── Gallery ── */}
                {activeTab === 'gallery' && (
                  <div className="bg-white border border-slate-200 rounded-xl p-6">
                    <h2 className="text-xl font-bold text-slate-900 mb-5">Campus Gallery</h2>
                    {college.gallery?.length > 0 ? (
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {college.gallery.map((img, i) => (
                          <div key={i} className="aspect-video rounded-xl overflow-hidden group cursor-pointer">
                            <img
                              src={img.url}
                              alt={`Campus ${i + 1}`}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              loading="lazy"
                            />
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-16 text-slate-400">
                        <ImageIcon size={40} className="mx-auto mb-3 text-slate-200" />
                        <p className="text-sm">Gallery photos will be added soon.</p>
                      </div>
                    )}
                  </div>
                )}

                {/* ── Reviews ── */}
                {activeTab === 'reviews' && (
                  <div className="bg-white border border-slate-200 rounded-xl p-6 text-center py-16">
                    <MessageSquare size={40} className="mx-auto mb-3 text-slate-200" />
                    <h2 className="text-xl font-bold text-slate-800 mb-2">Student Reviews</h2>
                    <p className="text-sm text-slate-500 mb-5">Be the first to share your experience at {college.name}.</p>
                    <button className="btn-primary py-2.5 px-6">Write a Review</button>
                  </div>
                )}

                {/* ── FAQs ── */}
                {activeTab === 'faqs' && (
                  <div className="space-y-3">
                    <div className="bg-white border border-slate-200 rounded-xl p-6 mb-2">
                      <h2 className="text-xl font-bold text-slate-900">Frequently Asked Questions</h2>
                    </div>
                    {college.faqs?.length > 0 ? (
                      college.faqs.map((faq, i) => <FaqItem key={i} faq={faq} />)
                    ) : (
                      <div className="bg-white border border-slate-200 rounded-xl p-8 text-center text-slate-400 text-sm">
                        No FAQs available yet.
                      </div>
                    )}
                  </div>
                )}

                {/* ── Contact ── */}
                {activeTab === 'contact' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="bg-white border border-slate-200 rounded-xl p-6">
                      <h2 className="text-xl font-bold text-slate-900 mb-1">Quick Inquiry</h2>
                      <p className="text-sm text-slate-500 mb-5">Our counselor will call you back within 24 hours.</p>
                      <LeadForm source="College Contact Tab" collegeId={college._id} />
                    </div>

                    <div className="bg-white border border-slate-200 rounded-xl p-6">
                      <h2 className="text-xl font-bold text-slate-900 mb-5">Contact Information</h2>
                      <div className="space-y-5">
                        {college.contact?.website && (
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-primary-50 rounded-lg flex items-center justify-center shrink-0">
                              <Globe size={16} className="text-primary-600" />
                            </div>
                            <div>
                              <p className="text-[11px] font-bold text-slate-400 uppercase mb-0.5">Website</p>
                              <a href={college.contact.website} target="_blank" rel="noreferrer" className="text-sm font-medium text-primary-600 hover:underline break-all">
                                {college.contact.website}
                              </a>
                            </div>
                          </div>
                        )}
                        {college.contact?.phone?.length > 0 && (
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-primary-50 rounded-lg flex items-center justify-center shrink-0">
                              <Phone size={16} className="text-primary-600" />
                            </div>
                            <div>
                              <p className="text-[11px] font-bold text-slate-400 uppercase mb-0.5">Phone</p>
                              {college.contact.phone.map((p, i) => (
                                <a key={i} href={`tel:${p}`} className="block text-sm font-bold text-slate-900 hover:text-primary-600 transition-colors">{p}</a>
                              ))}
                            </div>
                          </div>
                        )}
                        {college.contact?.email && (
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-primary-50 rounded-lg flex items-center justify-center shrink-0">
                              <Mail size={16} className="text-primary-600" />
                            </div>
                            <div>
                              <p className="text-[11px] font-bold text-slate-400 uppercase mb-0.5">Email</p>
                              <a href={`mailto:${college.contact.email}`} className="text-sm font-medium text-slate-900 hover:text-primary-600 transition-colors">
                                {college.contact.email}
                              </a>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* ─── Right Sidebar ─── */}
          <aside className="hidden lg:block w-72 shrink-0">
            <div className="sticky top-24 space-y-5">
              {/* Inquiry Card */}
              <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
                <div className="bg-primary-600 px-5 py-4">
                  <h3 className="text-base font-bold text-white">Get Free Counselling</h3>
                  <p className="text-primary-200 text-xs mt-0.5">Expert counselors will guide you through the admission process.</p>
                </div>
                <div className="p-5">
                  <LeadForm source="College Sidebar" collegeId={college._id} compact />
                </div>
              </div>

              {/* Similar Colleges */}
              {similarColleges?.length > 0 && (
                <div className="bg-white border border-slate-200 rounded-xl p-5">
                  <h3 className="text-sm font-bold text-slate-900 mb-4">Similar Colleges</h3>
                  <div className="space-y-3">
                    {similarColleges.map(c => (
                      <Link
                        key={c._id}
                        to={`/colleges/${c.slug}`}
                        className="flex items-center gap-3 group"
                      >
                        <div className="w-10 h-10 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-center text-primary-600 font-bold text-sm shrink-0 overflow-hidden">
                          {c.logo?.url ? <img src={c.logo.url} alt="" className="w-full h-full object-contain p-1" /> : c.name[0]}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-semibold text-slate-800 truncate group-hover:text-primary-600 transition-colors">
                            {c.name}
                          </h4>
                          <p className="text-xs text-slate-400">{c.location?.city}</p>
                        </div>
                        <ChevronRight size={14} className="text-slate-300 shrink-0" />
                      </Link>
                    ))}
                  </div>
                  <Link to="/colleges" className="block text-center text-xs font-semibold text-primary-600 hover:text-primary-700 mt-4 pt-3 border-t border-slate-100 transition-colors">
                    View All Colleges →
                  </Link>
                </div>
              )}
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
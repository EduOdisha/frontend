import { useState, useRef, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useDispatch, useSelector } from 'react-redux';
import { Helmet } from 'react-helmet-async';
import { updateUserSaved } from '../store/slices/authSlice';
import { addToCompare, removeFromCompare } from '../store/slices/compareSlice';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MapPin, Star, Download, Share2, Heart, GitCompare,
  ChevronRight, Calendar, Award, BookOpen,
  Users, Building, IndianRupee, Briefcase,
  CheckCircle2, Phone, HelpCircle,
  Image as ImageIcon, MessageSquare, Info
} from 'lucide-react';

import api from '../utils/api';
import LeadForm from '../components/common/LeadForm';

// Import subcomponents
import DetailSkeleton from './college-detail/DetailSkeleton';
import OverviewTab from './college-detail/OverviewTab';
import AdmissionsTab from './college-detail/AdmissionsTab';
import CoursesTab from './college-detail/CoursesTab';
import PlacementsTab from './college-detail/PlacementsTab';
import FacilitiesTab from './college-detail/FacilitiesTab';
import GalleryTab from './college-detail/GalleryTab';
import ReviewsTab from './college-detail/ReviewsTab';
import FaqsTab from './college-detail/FaqsTab';
import ContactTab from './college-detail/ContactTab';
import { capitalizeWords, formatAffiliation } from './college-detail/utils';

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
        <title>{capitalizeWords(college.name)} — Fees, Courses, Placements | EduOdisha</title>
        <meta name="description" content={college.about?.substring(0, 155) || `Explore ${capitalizeWords(college.name)} — fees, courses, placements, rankings and admission process.`} />
      </Helmet>

      {/* ─── Banner ────────────────────────────────────── */}
      <div className="relative h-52 md:h-64 lg:h-72 w-full overflow-hidden bg-slate-200">
        <img
          src={college.banner?.url || 'https://images.unsplash.com/photo-1562774053-701939374585?w=1400&q=80&auto=format&fit=crop'}
          alt={`${capitalizeWords(college.name)} campus`}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
        
        {/* Breadcrumbs overlaid on the banner */}
        <div className="absolute top-4 left-0 right-0 z-20">
          <div className="container-xl">
            <nav className="flex items-center gap-1.5 text-xs text-slate-200/95 font-semibold px-4 lg:px-0">
              <Link to="/" className="hover:text-white transition-colors">Home</Link>
              <ChevronRight size={11} className="text-slate-400" />
              <Link to="/colleges" className="hover:text-white transition-colors">Colleges</Link>
              <ChevronRight size={11} className="text-slate-400" />
              <span className="text-white font-bold">{capitalizeWords(college.shortName || college.name)}</span>
            </nav>
          </div>
        </div>
      </div>

      {/* ─── College Hero ──────────────────────────────── */}
      <div className="bg-white border-b border-slate-200 relative z-10">
        <div className="container-xl">
          {/* College info row: aligned to baseline of the logo */}
          <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-end mb-6 relative z-10 pt-4">
            {/* Logo */}
            <div className="w-28 h-28 bg-white rounded-xl shadow-lg border-2 border-white flex items-center justify-center overflow-hidden shrink-0 -mt-16 ml-4 lg:ml-0 relative z-20">
              {college.logo?.url ? (
                <img src={college.logo.url} alt={`${capitalizeWords(college.name)} logo`} className="w-full h-full object-contain p-2" />
              ) : (
                <span className="text-3xl font-black text-primary-600">{college.name[0]?.toUpperCase()}</span>
              )}
            </div>

            <div className="flex-1 px-4 lg:px-0">
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
                {capitalizeWords(college.name)}
              </h1>

              <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500 mb-2">
                <span className="flex items-center gap-1.5 font-medium">
                  <MapPin size={14} className="text-primary-500" />
                  {college.location?.city}, {college.location?.state}
                </span>
                {college.affiliation && (
                  <span className="flex items-center gap-1.5 font-medium">
                    <Award size={14} className="text-amber-500" />
                    {formatAffiliation(college.affiliation)}
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

            {/* CTA Buttons aligned to the bottom of the row */}
            <div className="flex lg:flex-col gap-3 w-full lg:w-auto px-4 lg:px-0 shrink-0 pb-1">
              <button
                onClick={() => college.brochure?.url ? window.open(college.brochure.url, '_blank') : toast.error('Brochure unavailable')}
                className="flex-1 lg:flex-none btn-secondary py-2.5 text-sm rounded-xl"
              >
                <Download size={15} /> Brochure
              </button>
              <button
                onClick={() => switchTab('contact')}
                className="flex-1 lg:flex-none btn-cta py-2.5 text-sm rounded-xl"
              >
                Apply Now
              </button>
            </div>
          </div>

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
        <div className="flex gap-7 flex-col lg:flex-row">
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
                {activeTab === 'overview' && <OverviewTab college={college} />}
                {activeTab === 'admissions' && <AdmissionsTab college={college} />}
                {activeTab === 'courses' && <CoursesTab college={college} />}
                {activeTab === 'placements' && <PlacementsTab college={college} />}
                {activeTab === 'facilities' && <FacilitiesTab college={college} />}
                {activeTab === 'gallery' && <GalleryTab college={college} />}
                {activeTab === 'reviews' && <ReviewsTab college={college} />}
                {activeTab === 'faqs' && <FaqsTab college={college} />}
                {activeTab === 'contact' && <ContactTab college={college} />}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* ─── Right Sidebar ─── */}
          <aside className="w-full lg:w-72 shrink-0">
            <div className="space-y-5">
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

              {/* Inquiry Card */}
              <div className="bg-white border border-slate-200 rounded-xl overflow-hidden sticky top-24 shadow-sm">
                <div className="bg-primary-600 px-5 py-4">
                  <h3 className="text-base font-bold text-white">Get Free Counselling</h3>
                  <p className="text-primary-200 text-xs mt-0.5">Expert counselors will guide you through the admission process.</p>
                </div>
                <div className="p-5">
                  <LeadForm source="College Sidebar" collegeId={college._id} compact />
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
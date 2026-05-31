import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { 
  MapPin, Star, Download, Share2, Heart, 
  ChevronRight, Calendar, Award, BookOpen, 
  Users, Building, IndianRupee, Briefcase,
  CheckCircle2, Globe, Phone, Mail, HelpCircle,
  Image as ImageIcon, MessageSquare, Info,
  GitCompare
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../utils/api';
import LeadForm from '../components/common/LeadForm';
import { toast } from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { addToCompare, removeFromCompare } from '../store/slices/compareSlice';

const tabs = [
  { id: 'overview', label: 'Overview', icon: Info },
  { id: 'admissions', label: 'Admissions', icon: BookOpen },
  { id: 'courses', label: 'Courses & Fees', icon: BookOpen },
  { id: 'placements', label: 'Placements', icon: Briefcase },
  { id: 'facilities', label: 'Facilities', icon: Building },
  { id: 'gallery', label: 'Gallery', icon: ImageIcon },
  { id: 'reviews', label: 'Reviews', icon: MessageSquare },
  { id: 'faqs', label: 'FAQs', icon: HelpCircle },
  { id: 'contact', label: 'Contact & Inquiry', icon: Phone },
];

export default function CollegeDetailPage() {
  const { slug } = useParams();
  const dispatch = useDispatch();
  const { colleges: compareList } = useSelector((state) => state.compare);
  const [activeTab, setActiveTab] = useState('overview');
  const [isFavorite, setIsFavorite] = useState(false);

  const { data: college, isLoading, error } = useQuery({
    queryKey: ['college', slug],
    queryFn: async () => {
      const { data } = await api.get(`/colleges/${slug}`);
      return data.data;
    },
  });

  const isCompared = compareList.some((c) => c._id === college?._id);

  const handleCompare = () => {
    if (isCompared) {
      dispatch(removeFromCompare(college._id));
    } else {
      if (compareList.length >= 4) {
        toast.error('You can only compare up to 4 colleges');
        return;
      }
      dispatch(addToCompare(college));
    }
  };

  const { data: similarColleges } = useQuery({
    queryKey: ['similar-colleges', college?.category],
    queryFn: async () => {
      const { data } = await api.get(`/colleges?category=${college?.category}&limit=3`);
      return data.colleges.filter(c => c._id !== college?._id);
    },
    enabled: !!college,
  });

  const handleDownloadBrochure = () => {
    if (college?.brochure?.url) {
      window.open(college.brochure.url, '_blank');
    } else {
      toast.error('Brochure not available at the moment');
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Link copied to clipboard');
  };

  if (isLoading) return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="container-xl animate-pulse">
        <div className="h-64 bg-slate-200 rounded-3xl mb-8"></div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="h-12 bg-slate-200 rounded-xl w-3/4"></div>
            <div className="h-4 bg-slate-200 rounded-lg w-1/2"></div>
            <div className="h-64 bg-slate-200 rounded-2xl"></div>
          </div>
          <div className="h-96 bg-slate-200 rounded-2xl"></div>
        </div>
      </div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen pt-24 flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-slate-800 mb-4">College not found</h2>
        <Link to="/colleges" className="btn-primary">Back to Colleges</Link>
      </div>
    </div>
  );

  if (!college) return null;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-12">
      {/* Banner Section */}
      <div className="relative h-48 md:h-64 lg:h-80 w-full overflow-hidden bg-slate-200 dark:bg-slate-800">
        {college.banner?.url ? (
          <img 
            src={college.banner.url} 
            alt={`${college.name} Banner`}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-r from-primary-900 to-primary-700 opacity-20" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
      </div>

      {/* Hero Content Section */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 relative">
        <div className="container-xl pt-0 pb-0">
          {/* Info overlapping banner */}
          <div className="flex flex-col lg:flex-row gap-8 items-start -mt-12 lg:-mt-16 mb-8 relative z-10 px-4 lg:px-0">
            <div className="relative group">
              <div className="w-32 h-32 lg:w-40 lg:h-40 bg-white rounded-2xl shadow-2xl p-3 border-4 border-white dark:border-slate-900 flex items-center justify-center overflow-hidden">
                <img 
                  src={college.logo?.url || '/placeholder-logo.png'} 
                  alt={college.name}
                  className="w-full h-full object-contain"
                />
              </div>
              {college.isVerified && (
                <div className="absolute bottom-2 right-2 bg-blue-500 text-white p-1.5 rounded-full border-4 border-white dark:border-slate-900 shadow-lg" title="Verified College">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
              )}
            </div>

            <div className="flex-grow pt-4 lg:pt-20">
              <div className="flex flex-wrap items-center gap-3 mb-3">
                <span className="badge badge-blue shadow-sm">{college.type}</span>
                <span className="badge badge-purple shadow-sm">{college.category}</span>
                {college.nirfRanking && (
                  <span className="badge badge-orange shadow-sm border border-orange-200">NIRF #{college.nirfRanking}</span>
                )}
              </div>
              <h1 className="text-3xl lg:text-5xl font-display font-bold text-slate-900 dark:text-white mb-3 tracking-tight">
                {college.name}
              </h1>
              <div className="flex flex-wrap items-center gap-6 text-slate-600 dark:text-slate-400 mb-6">
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-5 h-5 text-primary-500" />
                  <span className="font-medium text-lg">{college.location?.city}, {college.location?.state}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Award className="w-5 h-5 text-amber-500" />
                  <span className="font-medium">{college.affiliation}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-5 h-5 text-slate-400" />
                  <span className="font-medium">Est. {college.established}</span>
                </div>
              </div>
              
              <div className="flex flex-wrap items-center gap-8">
                <div className="flex items-center gap-3">
                  <div className="bg-emerald-500 text-white px-3 py-1.5 rounded-xl flex items-center gap-1.5 font-bold text-lg shadow-lg shadow-emerald-500/20">
                    {college.rating?.average || 0} <Star className="w-5 h-5 fill-current" />
                  </div>
                  <div className="text-sm">
                    <p className="font-bold text-slate-800 dark:text-slate-200">Excellent</p>
                    <p className="text-slate-500">{college.rating?.count || 0} Student Reviews</p>
                  </div>
                </div>
                
                <div className="h-10 w-px bg-slate-200 hidden md:block"></div>
                
                <div className="flex items-center gap-6">
                  <button 
                    onClick={() => setIsFavorite(!isFavorite)}
                    className={`flex flex-col items-center gap-1 text-xs font-bold transition-all ${isFavorite ? 'text-rose-500' : 'text-slate-400 hover:text-rose-500'}`}
                  >
                    <Heart className={`w-6 h-6 ${isFavorite ? 'fill-current' : ''}`} />
                    {isFavorite ? 'SAVED' : 'SAVE'}
                  </button>
                  <button 
                    onClick={handleCompare}
                    className={`flex flex-col items-center gap-1 text-xs font-bold transition-all ${isCompared ? 'text-primary-600' : 'text-slate-400 hover:text-primary-600'}`}
                  >
                    <GitCompare className={`w-6 h-6 ${isCompared ? 'fill-current' : ''}`} />
                    {isCompared ? 'COMPARED' : 'COMPARE'}
                  </button>
                  <button 
                    onClick={handleShare}
                    className="flex flex-col items-center gap-1 text-xs font-bold text-slate-400 hover:text-primary-600 transition-all"
                  >
                    <Share2 className="w-6 h-6" />
                    SHARE
                  </button>
                </div>
              </div>
            </div>

            <div className="flex flex-row lg:flex-col gap-3 w-full lg:w-auto lg:pt-24">
              <button onClick={handleDownloadBrochure} className="btn-secondary flex-grow flex items-center justify-center gap-2 py-4 shadow-xl shadow-slate-200/50">
                <Download className="w-5 h-5" /> Download Brochure
              </button>
              <button onClick={() => {
                setActiveTab('contact');
                const element = document.getElementById('tab-content');
                element?.scrollIntoView({ behavior: 'smooth' });
              }} className="btn-primary flex-grow py-4 shadow-xl shadow-primary-500/20">Apply Now</button>
            </div>
          </div>

          {/* Breadcrumbs (Moved lower) */}
          <nav className="flex items-center gap-2 text-xs text-slate-400 mb-4 px-4 lg:px-0">
            <Link to="/" className="hover:text-primary-600 transition-colors uppercase tracking-widest font-bold">Home</Link>
            <ChevronRight className="w-3 h-3" />
            <Link to="/colleges" className="hover:text-primary-600 transition-colors uppercase tracking-widest font-bold">Colleges</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-slate-500 font-bold uppercase tracking-widest">{college.shortName || college.name}</span>
          </nav>

          {/* Tabs */}
          <div className="flex items-center gap-1 overflow-x-auto whitespace-nowrap scrollbar-hide border-t border-slate-100 dark:border-slate-800">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-4 text-sm font-bold transition-all relative ${
                    activeTab === tab.id 
                    ? 'text-primary-600' 
                    : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                  {activeTab === tab.id && (
                    <motion.div 
                      layoutId="activeTab"
                      className="absolute bottom-0 left-0 right-0 h-1 bg-primary-600 rounded-t-full"
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container-xl mt-8" id="tab-content">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Tab Content */}
          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="space-y-8"
              >
                {/* Overview Tab */}
                {activeTab === 'overview' && (
                  <div className="space-y-8">
                    <section className="card p-8">
                      <h2 className="text-2xl font-display font-bold text-slate-900 dark:text-white mb-4">About {college.name}</h2>
                      <div className="prose prose-slate dark:prose-invert max-w-none">
                        <p className="text-slate-600 dark:text-slate-400 leading-relaxed whitespace-pre-line">
                          {college.about || "Information about this college will be updated soon."}
                        </p>
                      </div>
                      
                      {college.highlights?.length > 0 && (
                        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
                          {college.highlights.map((highlight, idx) => (
                            <div key={idx} className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                              <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{highlight}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </section>

                    <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="card p-4 text-center">
                        <IndianRupee className="w-6 h-6 text-primary-500 mx-auto mb-2" />
                        <p className="text-xs text-slate-500 uppercase font-bold">Avg. Fees</p>
                        <p className="text-lg font-bold text-slate-900 dark:text-white">
                          ₹{college.fees?.min?.toLocaleString() || 'N/A'}
                        </p>
                      </div>
                      <div className="card p-4 text-center">
                        <Briefcase className="w-6 h-6 text-emerald-500 mx-auto mb-2" />
                        <p className="text-xs text-slate-500 uppercase font-bold">Avg. Salary</p>
                        <p className="text-lg font-bold text-slate-900 dark:text-white">
                          ₹{college.placements?.averagePackage?.toLocaleString() || 'N/A'}
                        </p>
                      </div>
                      <div className="card p-4 text-center">
                        <Award className="w-6 h-6 text-amber-500 mx-auto mb-2" />
                        <p className="text-xs text-slate-500 uppercase font-bold">NIRF Rank</p>
                        <p className="text-lg font-bold text-slate-900 dark:text-white">
                          #{college.nirfRanking || 'N/A'}
                        </p>
                      </div>
                      <div className="card p-4 text-center">
                        <Users className="w-6 h-6 text-purple-500 mx-auto mb-2" />
                        <p className="text-xs text-slate-500 uppercase font-bold">Total Intake</p>
                        <p className="text-lg font-bold text-slate-900 dark:text-white">
                          {college.courses?.reduce((acc, curr) => acc + (curr.seats || 0), 0) || 'N/A'}
                        </p>
                      </div>
                    </section>
                  </div>
                )}

                {/* Admissions Tab */}
                {activeTab === 'admissions' && (
                  <div className="card p-8">
                    <h2 className="text-2xl font-display font-bold text-slate-900 dark:text-white mb-6">Admission Process</h2>
                    <div className="prose prose-slate dark:prose-invert max-w-none mb-8">
                      <p className="text-slate-600 dark:text-slate-400 leading-relaxed whitespace-pre-line">
                        {college.admissions?.process || "Admission details for this session will be updated soon."}
                      </p>
                    </div>
                    
                    {college.admissions?.entranceExams?.length > 0 && (
                      <div>
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Required Entrance Exams</h3>
                        <div className="flex flex-wrap gap-3">
                          {college.admissions.entranceExams.map((exam, idx) => (
                            <div key={idx} className="px-6 py-3 rounded-2xl bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300 font-bold border border-primary-100 dark:border-primary-800">
                              {exam}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Courses Tab */}
                {activeTab === 'courses' && (
                  <div className="card p-8">
                    <h2 className="text-2xl font-display font-bold text-slate-900 dark:text-white mb-6">Courses, Fees & Eligibility</h2>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="border-b border-slate-100 dark:border-slate-800">
                            <th className="py-4 px-4 text-sm font-bold text-slate-500 uppercase">Course</th>
                            <th className="py-4 px-4 text-sm font-bold text-slate-500 uppercase">Duration</th>
                            <th className="py-4 px-4 text-sm font-bold text-slate-500 uppercase">First Year Fees</th>
                            <th className="py-4 px-4 text-sm font-bold text-slate-500 uppercase">Eligibility</th>
                          </tr>
                        </thead>
                        <tbody>
                          {college.courses?.map((course, idx) => (
                            <tr key={idx} className="border-b border-slate-50 dark:border-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                              <td className="py-4 px-4 font-bold text-slate-900 dark:text-white">{course.name}</td>
                              <td className="py-4 px-4 text-slate-600 dark:text-slate-400">{course.duration}</td>
                              <td className="py-4 px-4 font-bold text-primary-600">₹{course.fees?.min?.toLocaleString()}</td>
                              <td className="py-4 px-4 text-sm text-slate-600 dark:text-slate-400">{course.eligibility}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* Placements Tab */}
                {activeTab === 'placements' && (
                  <div className="space-y-8">
                    <section className="card p-8">
                      <h2 className="text-2xl font-display font-bold text-slate-900 dark:text-white mb-6">Placement Statistics</h2>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <div className="p-6 rounded-2xl bg-primary-50 dark:bg-primary-900/20 border border-primary-100 dark:border-primary-800">
                          <p className="text-primary-600 dark:text-primary-400 font-bold text-sm uppercase mb-1">Average Package</p>
                          <p className="text-3xl font-bold text-slate-900 dark:text-white">₹{college.placements?.averagePackage} LPA</p>
                        </div>
                        <div className="p-6 rounded-2xl bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800">
                          <p className="text-amber-600 dark:text-amber-400 font-bold text-sm uppercase mb-1">Highest Package</p>
                          <p className="text-3xl font-bold text-slate-900 dark:text-white">₹{college.placements?.highestPackage} LPA</p>
                        </div>
                        <div className="p-6 rounded-2xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800">
                          <p className="text-emerald-600 dark:text-emerald-400 font-bold text-sm uppercase mb-1">Placement %</p>
                          <p className="text-3xl font-bold text-slate-900 dark:text-white">{college.placements?.placementPercentage}%</p>
                        </div>
                      </div>
                      
                      <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Top Recruiters</h3>
                      <div className="flex flex-wrap gap-4">
                        {college.placements?.topRecruiters?.map((recruiter, idx) => (
                          <div key={idx} className="px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-medium">
                            {recruiter}
                          </div>
                        ))}
                      </div>
                    </section>
                  </div>
                )}

                {/* Facilities Tab */}
                {activeTab === 'facilities' && (
                  <div className="card p-8">
                    <h2 className="text-2xl font-display font-bold text-slate-900 dark:text-white mb-6">Infrastructure & Facilities</h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                      {Object.entries(college.facilities || {}).map(([key, value]) => {
                        if (typeof value !== 'boolean' || !value) return null;
                        return (
                          <div key={key} className="flex items-center gap-3 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
                            <div className="w-10 h-10 rounded-full bg-primary-50 dark:bg-primary-900/20 flex items-center justify-center text-primary-600">
                              <Building className="w-5 h-5" />
                            </div>
                            <span className="font-bold text-slate-700 dark:text-slate-300 capitalize">{key}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Gallery Tab */}
                {activeTab === 'gallery' && (
                  <div className="card p-8">
                    <h2 className="text-2xl font-display font-bold text-slate-900 dark:text-white mb-6">Campus Gallery</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {college.gallery?.map((img, idx) => (
                        <div key={idx} className="aspect-video rounded-xl overflow-hidden cursor-pointer group">
                          <img 
                            src={img.url} 
                            alt={`Gallery ${idx}`} 
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Reviews Tab */}
                {activeTab === 'reviews' && (
                  <div className="card p-8 text-center py-20">
                    <MessageSquare className="w-16 h-16 text-slate-200 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">Student Reviews</h2>
                    <p className="text-slate-500 mb-6">No reviews yet for this college. Be the first to share your experience!</p>
                    <button className="btn-primary">Write a Review</button>
                  </div>
                )}

                {/* FAQs Tab */}
                {activeTab === 'faqs' && (
                  <div className="card p-8">
                    <h2 className="text-2xl font-display font-bold text-slate-900 dark:text-white mb-6">Frequently Asked Questions</h2>
                    <div className="space-y-4">
                      {college.faqs?.map((faq, idx) => (
                        <div key={idx} className="p-4 rounded-xl border border-slate-100 dark:border-slate-800">
                          <h4 className="font-bold text-slate-900 dark:text-white mb-2">{faq.question}</h4>
                          <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">{faq.answer}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Contact & Inquiry Tab */}
                {activeTab === 'contact' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in fade-in duration-300">
                    <div className="card p-8">
                      <div className="mb-6">
                        <h2 className="text-2xl font-display font-bold text-slate-900 dark:text-white mb-2">Quick Inquiry</h2>
                        <p className="text-slate-500 text-sm">Fill in your details and our counselor will call you back shortly.</p>
                      </div>
                      <LeadForm source="College Contact Tab" collegeId={college._id} />
                    </div>

                    <div className="space-y-6">
                      <div className="card p-8">
                        <h2 className="text-2xl font-display font-bold text-slate-900 dark:text-white mb-6">Contact Details</h2>
                        <div className="space-y-6">
                          <div className="flex items-start gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-primary-50 dark:bg-primary-900/20 flex items-center justify-center text-primary-600 shrink-0">
                              <Globe className="w-6 h-6" />
                            </div>
                            <div>
                              <p className="text-xs font-bold text-slate-400 uppercase mb-1">Website</p>
                              <a href={college.contact?.website} target="_blank" rel="noreferrer" className="text-lg font-medium text-primary-600 hover:underline break-all">
                                {college.contact?.website}
                              </a>
                            </div>
                          </div>
                          <div className="flex items-start gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-primary-50 dark:bg-primary-900/20 flex items-center justify-center text-primary-600 shrink-0">
                              <Phone className="w-6 h-6" />
                            </div>
                            <div>
                              <p className="text-xs font-bold text-slate-400 uppercase mb-1">Phone</p>
                              {college.contact?.phone?.map((p, i) => (
                                <p key={i} className="text-lg font-bold text-slate-900 dark:text-white">{p}</p>
                              ))}
                            </div>
                          </div>
                          <div className="flex items-start gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-primary-50 dark:bg-primary-900/20 flex items-center justify-center text-primary-600 shrink-0">
                              <Mail className="w-6 h-6" />
                            </div>
                            <div>
                              <p className="text-xs font-bold text-slate-400 uppercase mb-1">Email</p>
                              <p className="text-lg font-medium text-slate-900 dark:text-white">{college.contact?.email}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Sidebar */}
          <aside className="space-y-8">
            {/* Similar Colleges */}
            {similarColleges?.length > 0 && (
              <div className="card p-6">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Similar Colleges</h3>
                <div className="space-y-4">
                  {similarColleges.map((c) => (
                    <Link key={c._id} to={`/colleges/${c.slug}`} className="flex items-center gap-3 group">
                      <div className="w-12 h-12 rounded-lg border border-slate-100 dark:border-slate-800 p-1 shrink-0 overflow-hidden text-primary-600 font-bold flex items-center justify-center bg-slate-50">
                        {c.logo?.url ? <img src={c.logo.url} alt="" className="w-full h-full object-contain" /> : c.name[0]}
                      </div>
                      <div className="overflow-hidden">
                        <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate group-hover:text-primary-600 transition-colors">
                          {c.name}
                        </h4>
                        <p className="text-xs text-slate-500 truncate">{c.location?.city}, Odisha</p>
                      </div>
                    </Link>
                  ))}
                </div>
                <Link to="/colleges" className="btn-ghost w-full mt-4 text-sm justify-center">
                  View All Colleges
                </Link>
              </div>
            )}
          </aside>
        </div>
      </div>
    </div>
  );
}
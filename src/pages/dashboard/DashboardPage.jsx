import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Helmet } from 'react-helmet-async';
import { logoutUser } from '../../store/slices/authSlice';
import api from '../../utils/api';
import {
  LayoutDashboard, GraduationCap, BookOpen, Bell,
  User, LogOut, Settings, Bookmark, ChevronRight,
  Calendar, TrendingUp, ArrowRight, School, Clock, ExternalLink
} from 'lucide-react';

const NAV_ITEMS = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'saved', label: 'Saved Colleges', icon: GraduationCap },
  { id: 'courses', label: 'Saved Courses', icon: BookOpen },
  { id: 'exams', label: 'Exam Reminders', icon: Bell },
  { id: 'profile', label: 'Profile', icon: User },
];

export default function DashboardPage() {
  const { user } = useSelector(state => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [active, setActive] = useState('overview');
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    if (user?.role === 'admin') {
      navigate('/admin', { replace: true });
    }
  }, [user, navigate]);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 8);
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const { data, isLoading } = useQuery({
    queryKey: ['user-dashboard'],
    queryFn: async () => {
      const { data } = await api.get('/users/dashboard');
      return data.data;
    },
  });

  const handleLogout = () => dispatch(logoutUser());

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="min-h-screen bg-slate-50/50 flex">
      <Helmet>
        <title>My Dashboard — EduOdisha</title>
      </Helmet>

      {/* ─── Sidebar ─────────────────────────────────── */}
      <aside className={`hidden md:flex w-60 bg-white border-r border-slate-200/60 flex-col fixed inset-y-0 left-0 z-30 transition-all duration-200 ${isScrolled ? 'pt-16' : 'pt-[102px]'}`}>
        {/* User Profile */}
        <div className="p-5 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-display font-bold text-sm shrink-0 border border-primary-200/50">
              {user?.name?.[0]?.toUpperCase() || 'U'}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-bold text-slate-900 truncate" title={user?.name}>{user?.name || 'Student'}</p>
              <p className="text-xs text-slate-400 truncate" title={user?.email}>{user?.email}</p>
            </div>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 p-3 space-y-1">
          {NAV_ITEMS.map(item => (
            <button
              key={item.id}
              onClick={() => setActive(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-all border-l-2 ${
                active === item.id
                  ? 'bg-primary-50/70 text-primary-700 border-primary-600'
                  : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50 border-transparent'
              }`}
            >
              <item.icon size={16} className={active === item.id ? 'text-primary-600' : 'text-slate-400'} />
              {item.label}
            </button>
          ))}
        </nav>

        {/* Footer Actions */}
        <div className="p-3 border-t border-slate-100 space-y-1">
          {user?.role === 'admin' && (
            <Link
              to="/admin"
              className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-semibold text-primary-700 bg-primary-50/70 hover:bg-primary-100/70 transition-colors"
            >
              <LayoutDashboard size={16} /> Admin Panel
            </Link>
          )}
          <Link
            to="/"
            className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-semibold text-emerald-700 bg-emerald-50/60 hover:bg-emerald-100/70 transition-colors border border-emerald-100/60"
          >
            <ExternalLink size={16} className="text-emerald-500" /> Visit Site
          </Link>
          <button
            onClick={() => setActive('profile')}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-semibold transition-all ${
              active === 'profile'
                ? 'bg-primary-50/70 text-primary-700 border-l-2 border-primary-600'
                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <Settings size={16} className="text-slate-400" /> Settings
          </button>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-semibold text-red-600 hover:bg-red-50/70 transition-colors"
          >
            <LogOut size={16} /> Sign Out
          </button>
        </div>
      </aside>

      {/* ─── Main Content Area ───────────────────────── */}
      <main className="flex-1 md:ml-60 pt-16">
        {/* Main Content Fluid Spacing wrapper to resolve the left/right gaps */}
        <div className="w-full px-4 sm:px-8 lg:px-10 py-8">
          
          {/* Top Welcome Banner Card (matching homepage hero/CTA theme!) */}
          <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-primary-950 to-slate-900 rounded-2xl p-6 sm:p-8 text-white shadow-md mb-8 border border-slate-800">
            {/* Ambient decorative glow filters */}
            <div className="absolute -right-24 -top-24 w-72 h-72 bg-primary-500/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -left-12 -bottom-12 w-48 h-48 bg-accent-500/10 rounded-full blur-3xl pointer-events-none" />
            
            {/* Dotted Grid Pattern */}
            <div className="absolute inset-0 bg-dot-grid opacity-20 pointer-events-none" />
            
            <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <span className="inline-flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-widest text-primary-200 bg-primary-900/60 border border-primary-700/50 px-2.5 py-1 rounded-full shadow-inner">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Student Portal
                </span>
                <h1 className="text-3xl sm:text-4xl font-display font-extrabold text-white mt-3 tracking-tight">
                  {greeting()}, {user?.name?.split(' ')[0] || 'Student'} 👋
                </h1>
                <p className="text-slate-300 text-xs sm:text-sm mt-1.5 font-medium flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary-400" />
                  {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                </p>
              </div>
              
              <Link to="/colleges" className="btn-cta py-3 px-6 text-xs font-bold shadow-lg shadow-accent-600/30 hover:scale-[1.03] active:scale-100 transition-all shrink-0 self-start sm:self-auto flex items-center gap-2 rounded-xl">
                Browse Colleges <ArrowRight size={14} />
              </Link>
            </div>
          </div>

          {/* Mobile Navigation bar */}
          <div className="flex gap-2 overflow-x-auto pb-4 mb-6 md:hidden scrollbar-hide">
            {NAV_ITEMS.map(item => (
              <button
                key={item.id}
                onClick={() => setActive(item.id)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  active === item.id ? 'bg-primary-600 text-white shadow-sm' : 'bg-white border border-slate-200 text-slate-600'
                }`}
              >
                <item.icon size={13} />
                {item.label}
              </button>
            ))}
          </div>

          {/* ── Overview Tab ── */}
          {active === 'overview' && (
            <div className="space-y-6">
              {/* Metric Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                {[
                  { label: 'Saved Colleges', value: data?.savedColleges?.length || 0, icon: GraduationCap, bg: 'bg-indigo-50 text-indigo-600', hoverBg: 'group-hover:bg-indigo-600 group-hover:text-white', href: () => setActive('saved') },
                  { label: 'Applied Courses', value: data?.applications?.length || 0, icon: BookOpen, bg: 'bg-emerald-50 text-emerald-600', hoverBg: 'group-hover:bg-emerald-600 group-hover:text-white', href: () => setActive('courses') },
                  { label: 'Exam Reminders', value: data?.examReminders?.length || 0, icon: Bell, bg: 'bg-amber-50 text-amber-600', hoverBg: 'group-hover:bg-amber-600 group-hover:text-white', href: () => setActive('exams') },
                ].map((card, i) => (
                  <button
                    key={i}
                    onClick={card.href}
                    className="bg-white border border-slate-200/70 rounded-2xl p-5 text-left transition-all duration-300 group flex flex-col justify-between h-36 hover:border-primary-200 hover:shadow-md hover:-translate-y-0.5 cursor-pointer shadow-xs"
                  >
                    {/* Top Row: Icon badge + navigation arrow */}
                    <div className="flex items-center justify-between w-full">
                      <div className={`w-10 h-10 rounded-xl ${card.bg} ${card.hoverBg} flex items-center justify-center transition-all duration-300 shrink-0`}>
                        <card.icon size={18} className="stroke-[2.5]" />
                      </div>
                      <ChevronRight size={16} className="text-slate-300 group-hover:text-primary-500 group-hover:translate-x-0.5 transition-all" />
                    </div>
                    
                    {/* Value + Label */}
                    <div className="mt-3">
                      <p className="text-3xl font-extrabold text-slate-900 tracking-tight leading-none">
                        {isLoading ? (
                          <span className="inline-block w-8 h-8 bg-slate-100 rounded-lg animate-pulse" />
                        ) : (
                          card.value
                        )}
                      </p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2">{card.label}</p>
                    </div>
                  </button>
                ))}
              </div>

              {/* Quick Actions Panel */}
              <div className="bg-white border border-slate-200/60 rounded-2xl p-6 shadow-xs">
                <div className="flex items-center gap-2 mb-4">
                  <span className="w-1.5 h-3 rounded-full bg-primary-500" />
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Quick Actions</h3>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {[
                    { label: 'Browse Colleges', href: '/colleges', icon: School, bg: 'text-indigo-600 bg-indigo-50 border-indigo-100/50' },
                    { label: 'Find Scholarships', href: '/scholarships', icon: TrendingUp, bg: 'text-emerald-600 bg-emerald-50 border-emerald-100/50' },
                    { label: 'Upcoming Exams', href: '/exams', icon: Calendar, bg: 'text-amber-600 bg-amber-50 border-amber-100/50' },
                    { label: 'Career Guidance', href: '/career-guidance', icon: BookOpen, bg: 'text-purple-600 bg-purple-50 border-purple-100/50' },
                  ].map((a, i) => (
                    <Link
                      key={i}
                      to={a.href}
                      className="flex flex-col items-center gap-3.5 p-5 rounded-2xl border border-slate-100/80 hover:-translate-y-1 transition-all duration-300 text-center group bg-slate-50/50 hover:bg-white hover:border-primary-100 hover:shadow-md"
                    >
                      <div className={`w-11 h-11 rounded-xl ${a.bg} border flex items-center justify-center group-hover:scale-110 transition-transform shadow-xs`}>
                        <a.icon size={18} className="stroke-[2]" />
                      </div>
                      <span className="text-xs font-bold text-slate-700 group-hover:text-slate-900 transition-colors">{a.label}</span>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Recent Activity */}
              <div className="bg-white border border-slate-200/60 rounded-2xl overflow-hidden shadow-xs">
                <div className="px-6 py-4 border-b border-slate-100/80 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock size={16} className="text-slate-400" />
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Recent Activity</h3>
                  </div>
                  {data?.activities?.length > 0 && (
                    <span className="text-[10px] bg-slate-100 text-slate-500 font-bold px-2 py-0.5 rounded-full">
                      {data.activities.length} Events
                    </span>
                  )}
                </div>
                
                {data?.activities?.length > 0 ? (
                  <div className="divide-y divide-slate-50">
                    {data.activities.map((a, i) => (
                      <div key={i} className="px-6 py-4 flex items-center gap-4 hover:bg-slate-50/30 transition-colors">
                        <div className="w-2.5 h-2.5 rounded-full bg-primary-500 border-2 border-white ring-2 ring-primary-100 shrink-0" />
                        <p className="text-sm text-slate-700 flex-1 font-medium">{a.text}</p>
                        <span className="text-xs text-slate-400 font-semibold">{a.time}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="px-6 py-14 text-center">
                    <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-100">
                      <Clock size={20} className="text-slate-400" />
                    </div>
                    <p className="text-sm text-slate-500 font-semibold">No activity yet. Start exploring colleges!</p>
                    <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">Shortlist colleges, apply to courses or set reminders to track your journey here.</p>
                    <Link to="/colleges" className="inline-flex items-center gap-1.5 mt-5 text-xs font-bold text-primary-600 hover:text-primary-700 transition-all hover:translate-x-0.5 bg-primary-50/50 hover:bg-primary-50 px-4 py-2 rounded-xl border border-primary-100/40">
                      Explore Colleges <ArrowRight size={13} />
                    </Link>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ── Saved Colleges Tab ── */}
          {active === 'saved' && (
            <div>
              <div className="flex items-center gap-2 mb-5">
                <span className="w-1.5 h-3.5 rounded-full bg-primary-500" />
                <h2 className="text-lg font-bold text-slate-900">Your Shortlisted Colleges</h2>
                {data?.savedColleges?.length > 0 && (
                  <span className="text-[11px] bg-primary-50 text-primary-700 font-bold px-2 py-0.5 rounded-full ml-1.5">
                    {data.savedColleges.length} Shortlisted
                  </span>
                )}
              </div>
              
              {data?.savedColleges?.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {data.savedColleges.map(college => (
                    <div key={college._id} className="bg-white border border-slate-200/60 hover:border-primary-100 hover:shadow-md transition-all duration-300 rounded-2xl p-5 flex items-center justify-between gap-4 group">
                      <div className="flex items-center gap-4 min-w-0">
                        <div className="w-14 h-14 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-primary-600 font-display font-bold text-lg shrink-0 overflow-hidden shadow-inner group-hover:scale-105 transition-transform">
                          {college.logo?.url ? (
                            <img src={college.logo.url} alt="" className="w-full h-full object-contain p-1.5" />
                          ) : (
                            college.name[0]?.toUpperCase()
                          )}
                        </div>
                        <div className="min-w-0">
                          <h4 className="text-sm font-bold text-slate-900 truncate group-hover:text-primary-600 transition-colors" title={college.name}>
                            {college.name}
                          </h4>
                          <p className="text-xs text-slate-500 font-medium flex items-center gap-1.5 mt-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                            {college.location?.city}, Odisha
                          </p>
                        </div>
                      </div>
                      <Link to={`/colleges/${college.slug}`} className="btn-secondary py-2 px-4 text-xs font-semibold shrink-0 rounded-xl group-hover:bg-primary-600 group-hover:text-white group-hover:border-primary-600 transition-all flex items-center gap-1">
                        View Details <ChevronRight size={13} />
                      </Link>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-white border border-slate-200/60 rounded-2xl py-16 text-center shadow-xs">
                  <div className="w-14 h-14 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-100">
                    <Bookmark size={22} className="text-slate-400" />
                  </div>
                  <h3 className="text-base font-bold text-slate-700 mb-2">No saved colleges</h3>
                  <p className="text-sm text-slate-400 mb-6 max-w-xs mx-auto">Save colleges while browsing to compare them and track your application eligibility.</p>
                  <Link to="/colleges" className="btn-primary py-2.5 px-6 inline-flex rounded-xl font-bold">Browse Colleges</Link>
                </div>
              )}
            </div>
          )}

          {/* ── Saved Courses Tab ── */}
          {active === 'courses' && (
            <div>
              <div className="flex items-center gap-2 mb-5">
                <span className="w-1.5 h-3.5 rounded-full bg-primary-500" />
                <h2 className="text-lg font-bold text-slate-900">Your Saved Courses</h2>
                {data?.savedCourses?.length > 0 && (
                  <span className="text-[11px] bg-primary-50 text-primary-700 font-bold px-2 py-0.5 rounded-full ml-1.5">
                    {data.savedCourses.length} Saved
                  </span>
                )}
              </div>
              
              {data?.savedCourses?.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {data.savedCourses.map(course => (
                    <div key={course._id} className="bg-white border border-slate-200/60 hover:border-primary-100 hover:shadow-md transition-all duration-300 rounded-2xl p-5 flex items-center justify-between gap-4 group">
                      <div className="flex items-center gap-4 min-w-0">
                        <div className="w-14 h-14 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-primary-600 font-display font-bold text-lg shrink-0 overflow-hidden shadow-inner group-hover:scale-105 transition-transform">
                          {course.image?.url ? (
                            <img src={course.image.url} alt="" className="w-full h-full object-contain p-1.5" />
                          ) : (
                            <BookOpen size={20} className="text-primary-600" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <h4 className="text-sm font-bold text-slate-900 truncate group-hover:text-primary-600 transition-colors" title={course.name}>
                            {course.name}
                          </h4>
                          <p className="text-xs text-slate-500 font-medium flex items-center gap-1.5 mt-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                            {course.level} • {course.stream}
                          </p>
                        </div>
                      </div>
                      <Link to={`/courses/${course.slug}`} className="btn-secondary py-2 px-4 text-xs font-semibold shrink-0 rounded-xl group-hover:bg-primary-600 group-hover:text-white group-hover:border-primary-600 transition-all flex items-center gap-1">
                        View Details <ChevronRight size={13} />
                      </Link>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-white border border-slate-200/60 rounded-2xl py-16 text-center shadow-xs">
                  <div className="w-14 h-14 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-100">
                    <BookOpen size={22} className="text-slate-400" />
                  </div>
                  <h3 className="text-base font-bold text-slate-700 mb-2">No saved courses</h3>
                  <p className="text-sm text-slate-400 mb-6 max-w-xs mx-auto">Explore courses and save options you are interested in to review later.</p>
                  <Link to="/courses" className="btn-primary py-2.5 px-6 inline-flex rounded-xl font-bold">Browse Courses</Link>
                </div>
              )}
            </div>
          )}

          {/* ── Exam Reminders Tab ── */}
          {active === 'exams' && (
            <div>
              <div className="flex items-center gap-2 mb-5">
                <span className="w-1.5 h-3.5 rounded-full bg-primary-500" />
                <h2 className="text-lg font-bold text-slate-900">Exam Reminders</h2>
                {data?.examReminders?.length > 0 && (
                  <span className="text-[11px] bg-primary-50 text-primary-700 font-bold px-2 py-0.5 rounded-full ml-1.5">
                    {data.examReminders.length} Active
                  </span>
                )}
              </div>
              
              {data?.examReminders?.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {data.examReminders.map(exam => {
                    const rawDate = exam.examDates?.examDate || exam.examDate;
                    const examDateStr = rawDate
                      ? new Date(rawDate).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })
                      : 'To be announced';
                    return (
                      <div key={exam._id} className="bg-white border border-slate-200/60 hover:border-primary-100 hover:shadow-md transition-all duration-300 rounded-2xl p-5 flex items-center justify-between gap-4 group">
                        <div className="flex items-center gap-4 min-w-0">
                          <div className="w-14 h-14 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-primary-600 font-display font-bold text-lg shrink-0 overflow-hidden shadow-inner group-hover:scale-105 transition-transform">
                            {exam.image?.url ? (
                              <img src={exam.image.url} alt="" className="w-full h-full object-contain p-1.5" />
                            ) : (
                              <Bell size={20} className="text-primary-600" />
                            )}
                          </div>
                          <div className="min-w-0">
                            <h4 className="text-sm font-bold text-slate-900 truncate group-hover:text-primary-600 transition-colors" title={exam.name}>
                              {exam.name}
                            </h4>
                            <p className="text-xs text-slate-500 font-medium flex items-center gap-1.5 mt-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                              Exam Date: {examDateStr}
                            </p>
                          </div>
                        </div>
                        <Link to={`/exams/${exam.slug}`} className="btn-secondary py-2 px-4 text-xs font-semibold shrink-0 rounded-xl group-hover:bg-primary-600 group-hover:text-white group-hover:border-primary-600 transition-all flex items-center gap-1">
                          View Details <ChevronRight size={13} />
                        </Link>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="bg-white border border-slate-200/60 rounded-2xl py-16 text-center shadow-xs">
                  <div className="w-14 h-14 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-100">
                    <Bell size={22} className="text-slate-400" />
                  </div>
                  <h3 className="text-base font-bold text-slate-700 mb-2">No reminders set</h3>
                  <p className="text-sm text-slate-400 mb-6 max-w-xs mx-auto">Set reminders for crucial state and national exams like OJEE, JEE Main, or NEET.</p>
                  <Link to="/exams" className="btn-primary py-2.5 px-6 inline-flex rounded-xl font-bold">Explore Exams</Link>
                </div>
              )}
            </div>
          )}

          {/* ── Profile settings Tab ── */}
          {active === 'profile' && (
            <div>
              <div className="flex items-center gap-2 mb-5">
                <span className="w-1.5 h-3.5 rounded-full bg-primary-500" />
                <h2 className="text-lg font-bold text-slate-900">Profile Settings</h2>
              </div>
              
              <div className="bg-white border border-slate-200/60 rounded-2xl p-6 md:p-8 max-w-2xl shadow-xs">
                <div className="space-y-6">
                  {/* Avatar section */}
                  <div className="flex items-center gap-4 pb-6 border-b border-slate-100">
                    <div className="w-16 h-16 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-display font-extrabold text-2xl border-4 border-primary-50/50 shadow-sm shrink-0">
                      {user?.name?.[0]?.toUpperCase() || 'U'}
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-slate-900">{user?.name || 'Student'}</h3>
                      <p className="text-xs text-slate-400 mt-0.5">Manage your student account settings and target stream.</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="label-base text-xs uppercase tracking-wider font-bold text-slate-400">Full Name</label>
                      <input type="text" defaultValue={user?.name} className="input-base focus:border-primary-500 focus:ring-primary-500/10" />
                    </div>
                    <div>
                      <label className="label-base text-xs uppercase tracking-wider font-bold text-slate-400">Email Address</label>
                      <input type="email" defaultValue={user?.email} disabled className="input-base bg-slate-50 cursor-not-allowed text-slate-400 border-slate-200" />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="label-base text-xs uppercase tracking-wider font-bold text-slate-400">Phone Number</label>
                      <input type="tel" defaultValue={user?.phone} placeholder="+91 XXXXX XXXXX" className="input-base focus:border-primary-500 focus:ring-primary-500/10" />
                    </div>
                    <div>
                      <label className="label-base text-xs uppercase tracking-wider font-bold text-slate-400">Target Stream</label>
                      <select className="input-base focus:border-primary-500 focus:ring-primary-500/10 bg-white">
                        <option value="">Select your stream</option>
                        {['Engineering', 'Medical', 'Management', 'Law', 'Arts & Science', 'Other'].map(s => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  
                  <div className="pt-2">
                    <button className="btn-primary py-2.5 px-6 rounded-xl font-bold shadow-md shadow-primary-600/10">Save Changes</button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Helmet } from 'react-helmet-async';
import { logoutUser } from '../../store/slices/authSlice';
import api from '../../utils/api';
import {
  LayoutDashboard, GraduationCap, BookOpen, Bell,
  User, LogOut, Settings, ExternalLink, ArrowRight
} from 'lucide-react';
import OverviewTab from '../../components/dashboard/OverviewTab';
import SavedCollegesTab from '../../components/dashboard/SavedCollegesTab';
import SavedCoursesTab from '../../components/dashboard/SavedCoursesTab';
import ExamRemindersTab from '../../components/dashboard/ExamRemindersTab';
import ProfileSettingsTab from '../../components/dashboard/ProfileSettingsTab';

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
          
          {/* Top Welcome Banner Card */}
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

          {/* Tab Content Rendering */}
          {active === 'overview' && (
            <OverviewTab data={data} isLoading={isLoading} setActive={setActive} />
          )}

          {active === 'saved' && (
            <SavedCollegesTab savedColleges={data?.savedColleges} />
          )}

          {active === 'courses' && (
            <SavedCoursesTab savedCourses={data?.savedCourses} />
          )}

          {active === 'exams' && (
            <ExamRemindersTab examReminders={data?.examReminders} />
          )}

          {active === 'profile' && (
            <ProfileSettingsTab user={user} />
          )}
        </div>
      </main>
    </div>
  );
}
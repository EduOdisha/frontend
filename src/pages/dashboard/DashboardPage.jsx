import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Helmet } from 'react-helmet-async';
import { logoutUser } from '../../store/slices/authSlice';
import api from '../../utils/api';
import {
  LayoutDashboard, GraduationCap, BookOpen, Bell,
  User, LogOut, Settings, Bookmark, ChevronRight,
  Calendar, TrendingUp, ArrowRight, School, Clock
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
  const [active, setActive] = useState('overview');

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
    <div className="min-h-screen bg-slate-50 flex">
      <Helmet>
        <title>My Dashboard — EduOdisha</title>
      </Helmet>

      {/* ─── Sidebar ─────────────────────────────────── */}
      <aside className="hidden md:flex w-60 bg-white border-r border-slate-200 flex-col fixed inset-y-0 left-0 pt-16 z-30">
        {/* User */}
        <div className="p-5 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold text-base shrink-0">
              {user?.name?.[0]?.toUpperCase() || 'U'}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-bold text-slate-900 truncate">{user?.name || 'Student'}</p>
              <p className="text-xs text-slate-400 truncate">{user?.email}</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-3 space-y-0.5">
          {NAV_ITEMS.map(item => (
            <button
              key={item.id}
              onClick={() => setActive(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                active === item.id
                  ? 'bg-primary-50 text-primary-700'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <item.icon size={16} />
              {item.label}
            </button>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-3 border-t border-slate-100 space-y-0.5">
          {user?.role === 'admin' && (
            <Link
              to="/admin"
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold text-primary-700 bg-primary-50 hover:bg-primary-100 transition-colors"
            >
              <LayoutDashboard size={16} /> Admin Panel
            </Link>
          )}
          <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors">
            <Settings size={16} /> Settings
          </button>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
          >
            <LogOut size={16} /> Sign Out
          </button>
        </div>
      </aside>

      {/* ─── Main ────────────────────────────────────── */}
      <main className="flex-1 md:ml-60 pt-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
          {/* Top Bar */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-display font-bold text-slate-900">
                {greeting()}, {user?.name?.split(' ')[0] || 'Student'} 👋
              </h1>
              <p className="text-sm text-slate-500 mt-0.5">
                {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
              </p>
            </div>
            <Link to="/colleges" className="btn-cta py-2 px-4 text-sm hidden sm:flex">
              Browse Colleges <ArrowRight size={14} />
            </Link>
          </div>

          {/* Mobile Nav */}
          <div className="flex gap-2 overflow-x-auto pb-4 mb-6 md:hidden scrollbar-hide">
            {NAV_ITEMS.map(item => (
              <button
                key={item.id}
                onClick={() => setActive(item.id)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                  active === item.id ? 'bg-primary-600 text-white' : 'bg-white border border-slate-200 text-slate-600'
                }`}
              >
                <item.icon size={13} />
                {item.label}
              </button>
            ))}
          </div>

          {/* ── Overview ── */}
          {active === 'overview' && (
            <div className="space-y-6">
              {/* Metric Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { label: 'Saved Colleges', value: data?.savedColleges?.length || 0, icon: GraduationCap, href: () => setActive('saved') },
                  { label: 'Applied Courses', value: data?.applications?.length || 0, icon: BookOpen, href: () => setActive('courses') },
                  { label: 'Exam Reminders', value: data?.reminders?.length || 0, icon: Bell, href: () => setActive('exams') },
                ].map((card, i) => (
                  <button
                    key={i}
                    onClick={card.href}
                    className="bg-white border border-slate-200 hover:border-primary-200 hover:shadow-md rounded-xl p-5 text-left transition-all group"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="w-9 h-9 bg-primary-50 rounded-lg flex items-center justify-center">
                        <card.icon size={16} className="text-primary-600" />
                      </div>
                      <ChevronRight size={14} className="text-slate-300 group-hover:text-primary-400 transition-colors" />
                    </div>
                    <p className="text-2xl font-extrabold text-slate-900">{isLoading ? '—' : card.value}</p>
                    <p className="text-xs text-slate-500 font-medium mt-0.5">{card.label}</p>
                  </button>
                ))}
              </div>

              {/* Quick Actions */}
              <div className="bg-white border border-slate-200 rounded-xl p-5">
                <h3 className="text-sm font-bold text-slate-800 mb-4">Quick Actions</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { label: 'Browse Colleges', href: '/colleges', icon: School },
                    { label: 'Find Scholarships', href: '/scholarships', icon: TrendingUp },
                    { label: 'Upcoming Exams', href: '/exams', icon: Calendar },
                    { label: 'Career Guidance', href: '/career-guidance', icon: BookOpen },
                  ].map((a, i) => (
                    <Link
                      key={i}
                      to={a.href}
                      className="flex flex-col items-center gap-2 p-3 rounded-xl border border-slate-100 hover:border-primary-200 hover:bg-primary-50 transition-all text-center"
                    >
                      <div className="w-9 h-9 bg-slate-50 rounded-lg flex items-center justify-center">
                        <a.icon size={16} className="text-slate-500" />
                      </div>
                      <span className="text-xs font-semibold text-slate-600">{a.label}</span>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Recent Activity */}
              <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
                <div className="px-5 py-4 border-b border-slate-100 flex items-center gap-2">
                  <Clock size={15} className="text-slate-400" />
                  <h3 className="text-sm font-bold text-slate-800">Recent Activity</h3>
                </div>
                {data?.activities?.length > 0 ? (
                  <div className="divide-y divide-slate-100">
                    {data.activities.map((a, i) => (
                      <div key={i} className="px-5 py-3.5 flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-primary-400 shrink-0" />
                        <p className="text-sm text-slate-700 flex-1">{a.text}</p>
                        <span className="text-xs text-slate-400">{a.time}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="px-5 py-12 text-center">
                    <Clock size={32} className="mx-auto text-slate-200 mb-3" />
                    <p className="text-sm text-slate-400">No activity yet. Start exploring colleges!</p>
                    <Link to="/colleges" className="inline-block mt-4 text-sm font-semibold text-primary-600 hover:underline">
                      Browse Colleges →
                    </Link>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ── Saved Colleges ── */}
          {active === 'saved' && (
            <div>
              <h2 className="text-lg font-bold text-slate-900 mb-5">Your Shortlisted Colleges</h2>
              {data?.savedColleges?.length > 0 ? (
                <div className="space-y-3">
                  {data.savedColleges.map(college => (
                    <div key={college._id} className="bg-white border border-slate-200 rounded-xl p-4 flex items-center gap-4">
                      <div className="w-12 h-12 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-center text-primary-600 font-bold shrink-0">
                        {college.logo?.url ? <img src={college.logo.url} alt="" className="w-full h-full object-contain p-1" /> : college.name[0]}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-bold text-slate-900 truncate">{college.name}</h4>
                        <p className="text-xs text-slate-500">{college.location?.city}, Odisha</p>
                      </div>
                      <Link to={`/colleges/${college.slug}`} className="btn-secondary py-1.5 px-3 text-xs shrink-0">
                        View
                      </Link>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-white border border-slate-200 rounded-xl py-16 text-center">
                  <Bookmark size={40} className="mx-auto text-slate-200 mb-3" />
                  <h3 className="text-base font-bold text-slate-700 mb-2">No saved colleges</h3>
                  <p className="text-sm text-slate-400 mb-5">Save colleges while browsing to compare them later.</p>
                  <Link to="/colleges" className="btn-primary py-2.5 px-6 inline-flex">Browse Colleges</Link>
                </div>
              )}
            </div>
          )}

          {/* ── Saved Courses ── */}
          {active === 'courses' && (
            <div className="bg-white border border-slate-200 rounded-xl py-16 text-center">
              <BookOpen size={40} className="mx-auto text-slate-200 mb-3" />
              <h3 className="text-base font-bold text-slate-700 mb-2">No saved courses</h3>
              <p className="text-sm text-slate-400 mb-5">Save courses you're interested in to revisit later.</p>
              <Link to="/courses" className="btn-primary py-2.5 px-6 inline-flex">Browse Courses</Link>
            </div>
          )}

          {/* ── Exam Reminders ── */}
          {active === 'exams' && (
            <div>
              <h2 className="text-lg font-bold text-slate-900 mb-5">Exam Reminders</h2>
              <div className="bg-white border border-slate-200 rounded-xl py-16 text-center">
                <Bell size={40} className="mx-auto text-slate-200 mb-3" />
                <h3 className="text-base font-bold text-slate-700 mb-2">No reminders set</h3>
                <p className="text-sm text-slate-400 mb-5">Add reminders for upcoming entrance exams.</p>
                <Link to="/exams" className="btn-primary py-2.5 px-6 inline-flex">Explore Exams</Link>
              </div>
            </div>
          )}

          {/* ── Profile ── */}
          {active === 'profile' && (
            <div>
              <h2 className="text-lg font-bold text-slate-900 mb-5">Profile Settings</h2>
              <div className="bg-white border border-slate-200 rounded-xl p-6 max-w-xl">
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="label-base">Full Name</label>
                      <input type="text" defaultValue={user?.name} className="input-base" />
                    </div>
                    <div>
                      <label className="label-base">Email</label>
                      <input type="email" defaultValue={user?.email} disabled className="input-base bg-slate-50 cursor-not-allowed text-slate-400" />
                    </div>
                  </div>
                  <div>
                    <label className="label-base">Phone Number</label>
                    <input type="tel" defaultValue={user?.phone} placeholder="+91 XXXXX XXXXX" className="input-base" />
                  </div>
                  <div>
                    <label className="label-base">Target Stream</label>
                    <select className="input-base">
                      <option value="">Select your stream</option>
                      {['Engineering', 'Medical', 'Management', 'Law', 'Arts & Science', 'Other'].map(s => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                  <button className="btn-primary py-2.5 mt-2">Save Changes</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
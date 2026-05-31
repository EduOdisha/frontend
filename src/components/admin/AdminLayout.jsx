import { useState } from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  LayoutDashboard, School, BookOpen, FileText,
  GraduationCap, Users, MessageSquare, FileEdit,
  Menu, X, LogOut, ChevronRight, ExternalLink
} from 'lucide-react';
import { logoutUser } from '../../store/slices/authSlice';
import { toast } from 'react-hot-toast';

const MENU_ITEMS = [
  { name: 'Dashboard', icon: LayoutDashboard, path: '/admin' },
  { name: 'Colleges', icon: School, path: '/admin/colleges' },
  { name: 'Courses', icon: BookOpen, path: '/admin/courses' },
  { name: 'Exams', icon: FileText, path: '/admin/exams' },
  { name: 'Scholarships', icon: GraduationCap, path: '/admin/scholarships' },
  { name: 'Leads', icon: MessageSquare, path: '/admin/leads' },
  { name: 'Blogs', icon: FileEdit, path: '/admin/blogs' },
  { name: 'Users', icon: Users, path: '/admin/users' },
];

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const location = useLocation();
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);

  const handleLogout = () => {
    dispatch(logoutUser());
    toast.success('Signed out');
  };

  const isActive = (path) => location.pathname === path;

  const Sidebar = ({ mobile = false }) => (
    <aside className={`
      ${mobile
        ? 'fixed inset-y-0 left-0 z-50 w-64 flex flex-col bg-slate-900'
        : `fixed inset-y-0 left-0 z-40 flex flex-col bg-slate-900 transition-all duration-200 ${sidebarOpen ? 'w-60' : 'w-16'}`
      }
    `}>
      {/* Logo */}
      <div className={`flex items-center gap-3 px-5 h-14 border-b border-slate-800 shrink-0 ${!sidebarOpen && !mobile ? 'justify-center px-0' : ''}`}>
        <div className="w-7 h-7 bg-primary-600 rounded-lg flex items-center justify-center shrink-0">
          <GraduationCap size={16} className="text-white" />
        </div>
        {(sidebarOpen || mobile) && (
          <span className="font-display font-extrabold text-white text-base">
            Edu<span className="text-primary-400">Odisha</span>
          </span>
        )}
        {(sidebarOpen || mobile) && (
          <span className="ml-auto text-[9px] font-bold bg-primary-800 text-primary-300 px-1.5 py-0.5 rounded uppercase tracking-wider">
            Admin
          </span>
        )}
        {mobile && (
          <button onClick={() => setMobileSidebarOpen(false)} className="ml-auto p-1 text-slate-400 hover:text-white">
            <X size={18} />
          </button>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 px-2 space-y-0.5 overflow-y-auto">
        {MENU_ITEMS.map(item => {
          const active = isActive(item.path);
          return (
            <Link
              key={item.name}
              to={item.path}
              onClick={() => mobile && setMobileSidebarOpen(false)}
              title={!sidebarOpen && !mobile ? item.name : ''}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                active
                  ? 'bg-primary-600 text-white'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              } ${!sidebarOpen && !mobile ? 'justify-center' : ''}`}
            >
              <item.icon size={17} className="shrink-0" />
              {(sidebarOpen || mobile) && <span>{item.name}</span>}
              {(sidebarOpen || mobile) && active && <ChevronRight size={13} className="ml-auto" />}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className={`border-t border-slate-800 p-3 space-y-1 ${!sidebarOpen && !mobile ? 'flex flex-col items-center' : ''}`}>
        {(sidebarOpen || mobile) && (
          <div className="flex items-center gap-3 px-3 py-2 mb-1">
            <div className="w-8 h-8 rounded-full bg-primary-700 flex items-center justify-center text-white font-bold text-sm shrink-0">
              {user?.name?.[0]?.toUpperCase() || 'A'}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-white truncate">{user?.name || 'Admin'}</p>
              <p className="text-[11px] text-slate-500 truncate">{user?.email}</p>
            </div>
          </div>
        )}

        <Link
          to="/"
          target="_blank"
          title="View Site"
          className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-slate-400 hover:bg-slate-800 hover:text-white transition-all ${!sidebarOpen && !mobile ? 'justify-center px-0 w-10 h-10' : ''}`}
        >
          <ExternalLink size={16} className="shrink-0" />
          {(sidebarOpen || mobile) && 'View Site'}
        </Link>

        <button
          onClick={handleLogout}
          className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-red-400 hover:bg-red-900/20 hover:text-red-300 transition-all ${!sidebarOpen && !mobile ? 'justify-center px-0 w-10 h-10' : ''}`}
        >
          <LogOut size={16} className="shrink-0" />
          {(sidebarOpen || mobile) && 'Sign Out'}
        </button>
      </div>
    </aside>
  );

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <Sidebar />
      </div>

      {/* Mobile Sidebar */}
      {mobileSidebarOpen && (
        <>
          <div className="fixed inset-0 bg-black/40 z-40 lg:hidden" onClick={() => setMobileSidebarOpen(false)} />
          <div className="lg:hidden">
            <Sidebar mobile />
          </div>
        </>
      )}

      {/* Main Area */}
      <div className={`flex-1 flex flex-col min-w-0 transition-all duration-200 ${sidebarOpen ? 'lg:ml-60' : 'lg:ml-16'}`}>
        {/* Top Header */}
        <header className="h-14 bg-white border-b border-slate-200 flex items-center px-5 gap-4 sticky top-0 z-30">
          {/* Sidebar Toggle (Desktop) */}
          <button
            onClick={() => setSidebarOpen(o => !o)}
            className="hidden lg:flex p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 transition-colors"
            aria-label="Toggle sidebar"
          >
            <Menu size={18} />
          </button>

          {/* Mobile Toggle */}
          <button
            onClick={() => setMobileSidebarOpen(true)}
            className="lg:hidden p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 transition-colors"
          >
            <Menu size={18} />
          </button>

          {/* Breadcrumb */}
          <div className="flex items-center gap-1.5 text-sm text-slate-500 font-medium ml-1">
            <span>Admin</span>
            <ChevronRight size={13} />
            <span className="text-slate-800 font-semibold capitalize">
              {location.pathname.split('/').filter(Boolean).slice(1).join(' / ') || 'Dashboard'}
            </span>
          </div>

          <div className="ml-auto flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 text-sm text-slate-500">
              Welcome, <span className="font-semibold text-slate-800">{user?.name?.split(' ')[0]}</span>
            </div>
            <div className="w-8 h-8 rounded-full bg-primary-600 flex items-center justify-center text-white font-bold text-sm">
              {user?.name?.[0]?.toUpperCase() || 'A'}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-5 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
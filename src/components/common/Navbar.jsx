import { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logoutUser } from '../../store/slices/authSlice';
import {
  Search, ChevronDown, Menu, X,
  School, BookOpen, GraduationCap, Award,
  Briefcase, FileText, BookMarked, ArrowRight,
  User, LogOut, LayoutDashboard, Phone,
  Mail, MapPin
} from 'lucide-react';
import { toast } from 'react-hot-toast';

// ─── Mega Menu Data ────────────────────────────────────────
const collegesMegaMenu = {
  columns: [
    {
      heading: 'By Stream',
      links: [
        { label: 'Engineering Colleges', href: '/colleges?category=Engineering', icon: '⚙️' },
        { label: 'Medical Colleges', href: '/colleges?category=Medical', icon: '🏥' },
        { label: 'Management Colleges', href: '/colleges?category=Management', icon: '📊' },
        { label: 'Law Colleges', href: '/colleges?category=Law', icon: '⚖️' },
        { label: 'Pharmacy Colleges', href: '/colleges?category=Pharmacy', icon: '💊' },
        { label: 'Arts & Science', href: '/colleges?category=Arts+%26+Science', icon: '🎨' },
      ],
    },
    {
      heading: 'By City',
      links: [
        { label: 'Colleges in Bhubaneswar', href: '/colleges?city=Bhubaneswar' },
        { label: 'Colleges in Cuttack', href: '/colleges?city=Cuttack' },
        { label: 'Colleges in Rourkela', href: '/colleges?city=Rourkela' },
        { label: 'Colleges in Berhampur', href: '/colleges?city=Berhampur' },
        { label: 'Colleges in Sambalpur', href: '/colleges?city=Sambalpur' },
        { label: 'Colleges in Puri', href: '/colleges?city=Puri' },
      ],
    },
    {
      heading: 'By Type',
      links: [
        { label: 'Government Colleges', href: '/colleges?type=Government' },
        { label: 'Private Colleges', href: '/colleges?type=Private' },
        { label: 'Deemed Universities', href: '/colleges?type=Deemed' },
        { label: 'Autonomous Colleges', href: '/colleges?type=Autonomous' },
      ],
    },
  ],
  cta: { label: 'View All 500+ Colleges', href: '/colleges' },
};

const examsMegaMenu = {
  columns: [
    {
      heading: 'Engineering',
      links: [
        { label: 'OJEE 2025', href: '/exams?search=OJEE' },
        { label: 'JEE Main', href: '/exams?search=JEE+Main' },
        { label: 'JEE Advanced', href: '/exams?search=JEE+Advanced' },
        { label: 'BITSAT', href: '/exams?search=BITSAT' },
      ],
    },
    {
      heading: 'Medical',
      links: [
        { label: 'NEET UG', href: '/exams?search=NEET' },
        { label: 'AIIMS', href: '/exams?search=AIIMS' },
        { label: 'JIPMER', href: '/exams?search=JIPMER' },
      ],
    },
    {
      heading: 'Management & Others',
      links: [
        { label: 'CAT 2025', href: '/exams?search=CAT' },
        { label: 'CUET UG', href: '/exams?search=CUET' },
        { label: 'OPSC Exams', href: '/exams?type=Government+Job' },
        { label: 'IBPS 2025', href: '/exams?search=IBPS' },
      ],
    },
  ],
  cta: { label: 'View All Exams', href: '/exams' },
};

const simpleNavLinks = [
  { name: 'Courses', href: '/courses' },
  { name: 'Scholarships', href: '/scholarships' },
  { name: 'Coaching', href: '/coaching' },
  { name: 'Blogs', href: '/blogs' },
];

// ─── Mega Menu Panel ───────────────────────────────────────
function MegaMenuPanel({ data, onClose, align = 'left-0' }) {
  return (
    <div className={`absolute top-full mt-1 w-[760px] bg-white border border-slate-200 rounded-xl shadow-lg overflow-hidden animate-slide-down z-50 ${align}`}>
      <div className="grid grid-cols-3 gap-0 divide-x divide-slate-100 p-6">
        {data.columns.map((col) => (
          <div key={col.heading} className="px-6 first:pl-0 last:pr-0">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-3">
              {col.heading}
            </p>
            <ul className="space-y-1">
              {col.links.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.href}
                    onClick={onClose}
                    className="flex items-center gap-2 py-1.5 px-2 -mx-2 rounded-lg text-sm text-slate-600 hover:text-primary-600 hover:bg-primary-50 transition-all duration-150 font-medium"
                  >
                    {link.icon && <span className="text-base">{link.icon}</span>}
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="bg-slate-50 border-t border-slate-100 px-6 py-3">
        <Link
          to={data.cta.href}
          onClick={onClose}
          className="inline-flex items-center gap-2 text-sm font-semibold text-primary-600 hover:text-primary-700 transition-colors"
        >
          {data.cta.label}
          <ArrowRight size={14} />
        </Link>
      </div>
    </div>
  );
}

// ─── Search Modal ──────────────────────────────────────────
function SearchModal({ onClose }) {
  const [q, setQ] = useState('');
  const [type, setType] = useState('colleges');
  const navigate = useNavigate();
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (q.trim()) {
      navigate(`/${type}?search=${encodeURIComponent(q)}`);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-slate-900/40 backdrop-blur-sm flex items-start justify-center pt-24 px-4" onClick={onClose}>
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden animate-scale-in" onClick={e => e.stopPropagation()}>
        <form onSubmit={handleSearch}>
          <div className="flex items-center border-b border-slate-100 px-5 py-4">
            <Search className="text-slate-400 shrink-0" size={20} />
            <input
              ref={inputRef}
              type="text"
              value={q}
              onChange={e => setQ(e.target.value)}
              placeholder="Search colleges, courses, exams..."
              className="flex-1 px-4 text-slate-800 text-base font-medium placeholder:text-slate-400 outline-none bg-transparent"
            />
            <button type="button" onClick={onClose} className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors">
              <X size={18} className="text-slate-400" />
            </button>
          </div>
        </form>
        <div className="flex items-center gap-2 px-5 py-3 border-b border-slate-100">
          {['colleges', 'courses', 'exams', 'scholarships'].map(t => (
            <button
              key={t}
              onClick={() => setType(t)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${
                type === t ? 'bg-primary-600 text-white' : 'text-slate-500 hover:bg-slate-100'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
        <div className="px-5 py-4">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Trending</p>
          <div className="flex flex-wrap gap-2">
            {['B.Tech Bhubaneswar', 'OJEE 2025', 'MBA Odisha', 'NEET Cutoff', 'Scholarships SC/ST'].map(t => (
              <button
                key={t}
                onClick={() => { setQ(t); }}
                className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-600 hover:border-primary-300 hover:text-primary-600 transition-all"
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main Navbar ───────────────────────────────────────────
export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeMega, setActiveMega] = useState(null); // 'colleges' | 'exams' | null
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isUserOpen, setIsUserOpen] = useState(false);

  const location = useLocation();
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector(state => state.auth);
  const navRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 8);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close everything on route change
  useEffect(() => {
    setActiveMega(null);
    setIsMobileOpen(false);
    setIsUserOpen(false);
  }, [location.pathname]);

  // Close mega on outside click
  useEffect(() => {
    const handler = (e) => {
      if (navRef.current && !navRef.current.contains(e.target)) {
        setActiveMega(null);
        setIsUserOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleLogout = () => {
    dispatch(logoutUser());
    toast.success('Signed out successfully');
  };

  const isActive = (href) => location.pathname === href || location.pathname.startsWith(href + '/');

  return (
    <>
      <header
        ref={navRef}
        className="fixed top-0 left-0 right-0 z-50 flex flex-col"
      >
        {/* Top Subheader Bar */}
        <div
          className={`bg-[#0b0f19] text-slate-300 border-b border-slate-800/80 text-xs transition-all duration-200 origin-top overflow-hidden hidden md:block w-full ${
            isScrolled ? 'h-0 py-0 border-none opacity-0' : 'h-[38px] py-2'
          }`}
        >
          <div className="container-xl flex items-center justify-between">
            {/* Contact details */}
            <div className="flex items-center gap-6">
              <a
                href="tel:+911800001234"
                className="flex items-center gap-1.5 text-slate-400 hover:text-white transition-colors text-[11px] font-medium"
              >
                <Phone size={12} className="text-slate-500" />
                <span>1800-001-234 (Toll Free)</span>
              </a>
              <a
                href="mailto:hello@eduodisha.in"
                className="flex items-center gap-1.5 text-slate-400 hover:text-white transition-colors text-[11px] font-medium"
              >
                <Mail size={12} className="text-slate-500" />
                <span>hello@eduodisha.in</span>
              </a>
              <div className="flex items-center gap-1.5 text-slate-400 text-[11px] font-medium">
                <MapPin size={12} className="text-red-500/90" />
                <span>Bhubaneswar, Odisha</span>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex items-center gap-4 text-[11px] text-slate-400 font-medium">
              <span>We're on your favourite socials!</span>
              <div className="flex items-center gap-3 text-slate-300">
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors flex items-center"
                  aria-label="Facebook"
                >
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c4.56-.93 8-4.96 8-9.75z" />
                  </svg>
                </a>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors flex items-center"
                  aria-label="Instagram"
                >
                  <svg className="w-3.5 h-3.5 stroke-current fill-none stroke-[2]" viewBox="0 0 24 24" aria-hidden="true">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                  </svg>
                </a>
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors flex items-center"
                  aria-label="LinkedIn"
                >
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                  </svg>
                </a>
                <a
                  href="https://youtube.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors flex items-center"
                  aria-label="YouTube"
                >
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M23.498 6.163c-.272-.98-1.04-1.755-2.02-2.027C19.7 3.75 12 3.75 12 3.75s-7.7 0-9.478.486c-.98.272-1.748 1.047-2.02 2.027C0 7.9 0 12 0 12s0 4.1.486 5.837c.272.98 1.04 1.745 2.02 2.017C4.3 20.25 12 20.25 12 20.25s7.7 0 9.478-.486c.98-.272 1.748-1.047 2.02-2.017C24 16.1 24 12 24 12s0-4.1-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Main Navbar */}
        <nav
          className={`transition-all duration-200 ${
            isScrolled
              ? 'bg-white border-b border-slate-200 shadow-sm'
              : 'bg-white border-b border-slate-100'
          }`}
        >
        <div className="container-xl">
          <div className="flex items-center h-16 gap-8">

            {/* ─ Logo ─ */}
            <Link to="/" className="flex items-center gap-2.5 shrink-0" aria-label="EduOdisha Home">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <GraduationCap size={18} className="text-white" />
              </div>
              <span className="font-display font-extrabold text-lg text-slate-900 tracking-tight">
                Edu<span className="text-primary-600">Odisha</span>
              </span>
            </Link>

            {/* ─ Desktop Nav ─ */}
            <div className="hidden lg:flex items-center gap-1 flex-1">
              {/* Colleges — Mega */}
              <div className="relative">
                <button
                  onMouseEnter={() => setActiveMega('colleges')}
                  onMouseLeave={() => setActiveMega(null)}
                  onClick={() => setActiveMega(activeMega === 'colleges' ? null : 'colleges')}
                  className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-semibold transition-all ${
                    isActive('/colleges') || activeMega === 'colleges'
                      ? 'text-primary-600 bg-primary-50'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  Colleges
                  <ChevronDown
                    size={14}
                    className={`transition-transform duration-200 ${activeMega === 'colleges' ? 'rotate-180' : ''}`}
                  />
                </button>
                {activeMega === 'colleges' && (
                  <div onMouseEnter={() => setActiveMega('colleges')} onMouseLeave={() => setActiveMega(null)}>
                    <MegaMenuPanel data={collegesMegaMenu} onClose={() => setActiveMega(null)} align="left-0" />
                  </div>
                )}
              </div>

              {/* Exams — Mega */}
              <div className="relative">
                <button
                  onMouseEnter={() => setActiveMega('exams')}
                  onMouseLeave={() => setActiveMega(null)}
                  onClick={() => setActiveMega(activeMega === 'exams' ? null : 'exams')}
                  className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-semibold transition-all ${
                    isActive('/exams') || activeMega === 'exams'
                      ? 'text-primary-600 bg-primary-50'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  Exams
                  <ChevronDown
                    size={14}
                    className={`transition-transform duration-200 ${activeMega === 'exams' ? 'rotate-180' : ''}`}
                  />
                </button>
                {activeMega === 'exams' && (
                  <div onMouseEnter={() => setActiveMega('exams')} onMouseLeave={() => setActiveMega(null)}>
                    <MegaMenuPanel data={examsMegaMenu} onClose={() => setActiveMega(null)} align="-left-24" />
                  </div>
                )}
              </div>

              {/* Simple Links */}
              {simpleNavLinks.map(link => (
                <Link
                  key={link.name}
                  to={link.href}
                  className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all ${
                    isActive(link.href)
                      ? 'text-primary-600 bg-primary-50'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </div>

            {/* ─ Right Actions ─ */}
            <div className="flex items-center gap-2 ml-auto">
              {/* Search */}
              <button
                onClick={() => setIsSearchOpen(true)}
                id="navbar-search-btn"
                className="p-2 rounded-lg text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition-all"
                aria-label="Open search"
              >
                <Search size={18} />
              </button>

              {/* Counselling CTA — visible md+ */}
              <a
                href="tel:+911800001234"
                className="hidden md:flex items-center gap-1.5 btn-cta py-2 px-4 text-xs"
              >
                <Phone size={13} />
                Free Counselling
              </a>

              {isAuthenticated ? (
                <div className="relative">
                  <button
                    onClick={() => setIsUserOpen(!isUserOpen)}
                    id="navbar-user-btn"
                    className="flex items-center gap-2 p-1 pr-3 rounded-full border border-slate-200 hover:border-slate-300 bg-white transition-all"
                  >
                    <div className="w-8 h-8 rounded-full bg-primary-600 flex items-center justify-center text-white font-bold text-xs">
                      {user?.name?.[0]?.toUpperCase() || 'U'}
                    </div>
                    <span className="text-sm font-semibold text-slate-700 hidden sm:block">
                      {user?.name?.split(' ')[0]}
                    </span>
                    <ChevronDown size={13} className={`text-slate-400 transition-transform ${isUserOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {isUserOpen && (
                    <div className="absolute right-0 top-full mt-2 w-52 bg-white border border-slate-200 rounded-xl shadow-lg animate-slide-down overflow-hidden z-50">
                      <div className="px-4 py-3 border-b border-slate-100">
                        <p className="text-sm font-semibold text-slate-800">{user?.name}</p>
                        <p className="text-xs text-slate-500 truncate">{user?.email}</p>
                      </div>
                      <div className="p-1.5 space-y-0.5">
                        {user?.role === 'admin' && (
                          <Link to="/admin" onClick={() => setIsUserOpen(false)} className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-primary-700 bg-primary-50 hover:bg-primary-100 transition-colors font-semibold">
                            <LayoutDashboard size={15} /> Admin Panel
                          </Link>
                        )}
                        <Link to="/dashboard" onClick={() => setIsUserOpen(false)} className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors font-medium">
                          <User size={15} /> Student Dashboard
                        </Link>
                        <button onClick={() => { handleLogout(); setIsUserOpen(false); }} className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-red-600 hover:bg-red-50 transition-colors font-medium">
                          <LogOut size={15} /> Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Link to="/login" className="hidden sm:block text-sm font-semibold text-slate-600 hover:text-slate-900 px-3 py-2 rounded-lg hover:bg-slate-50 transition-all">
                    Log In
                  </Link>
                  <Link to="/register" className="btn-primary py-2 px-4 text-xs">
                    Join Free
                  </Link>
                </div>
              )}

              {/* Mobile Hamburger */}
              <button
                onClick={() => setIsMobileOpen(!isMobileOpen)}
                className="lg:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-all"
                aria-label="Toggle mobile menu"
              >
                {isMobileOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </div>

        {/* ─ Mobile Drawer ─ */}
        {isMobileOpen && (
          <>
            <div className="fixed inset-0 bg-slate-900/30 z-40 lg:hidden" onClick={() => setIsMobileOpen(false)} />
            <div className="fixed top-16 left-0 right-0 bottom-0 bg-white z-50 lg:hidden overflow-y-auto animate-slide-down">
              <div className="px-4 py-6 space-y-1">
                {/* Search */}
                <button
                  onClick={() => { setIsMobileOpen(false); setIsSearchOpen(true); }}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-500 text-sm font-medium mb-4"
                >
                  <Search size={16} />
                  Search colleges, exams, courses…
                </button>

                <Link to="/colleges" className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-700 hover:bg-primary-50 hover:text-primary-600 font-semibold transition-all">
                  <School size={18} /> Colleges
                </Link>
                <Link to="/courses" className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-700 hover:bg-primary-50 hover:text-primary-600 font-semibold transition-all">
                  <BookOpen size={18} /> Courses
                </Link>
                <Link to="/exams" className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-700 hover:bg-primary-50 hover:text-primary-600 font-semibold transition-all">
                  <FileText size={18} /> Exams
                </Link>
                <Link to="/scholarships" className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-700 hover:bg-primary-50 hover:text-primary-600 font-semibold transition-all">
                  <Award size={18} /> Scholarships
                </Link>
                <Link to="/coaching" className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-700 hover:bg-primary-50 hover:text-primary-600 font-semibold transition-all">
                  <Briefcase size={18} /> Coaching
                </Link>
                <Link to="/blogs" className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-700 hover:bg-primary-50 hover:text-primary-600 font-semibold transition-all">
                  <BookMarked size={18} /> Blogs
                </Link>

                <div className="pt-4 border-t border-slate-100 mt-4 space-y-2">
                  {isAuthenticated ? (
                    <>
                      <Link to="/dashboard" className="flex items-center gap-3 px-4 py-3 rounded-xl text-primary-600 bg-primary-50 font-semibold">
                        <User size={18} /> My Dashboard
                      </Link>
                      <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 font-semibold transition-all">
                        <LogOut size={18} /> Sign Out
                      </button>
                    </>
                  ) : (
                    <>
                      <Link to="/login" className="block text-center w-full btn-secondary py-3">Log In</Link>
                      <Link to="/register" className="block text-center w-full btn-cta py-3">Join Free — It's Free</Link>
                    </>
                  )}
                </div>

                <div className="pt-4">
                  <a href="tel:+911800001234" className="flex items-center justify-center gap-2 w-full py-3 border border-slate-200 rounded-xl text-sm font-semibold text-slate-700">
                    <Phone size={15} /> Free Counselling: 1800-001-234
                  </a>
                </div>
              </div>
            </div>
          </>
        )}
      </nav>
    </header>

      {/* Search Modal */}
      {isSearchOpen && <SearchModal onClose={() => setIsSearchOpen(false)} />}
    </>
  );
}

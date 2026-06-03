import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logoutUser } from '../../store/slices/authSlice';
import {
  ChevronDown, GraduationCap, Phone, Languages, User,
  LogOut, LayoutDashboard, Search, Menu, X
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useLanguage } from '../../context/LanguageContext';
import { useScrollPosition, useOutsideClick } from '../../hooks';
import TopBar from './navbar/TopBar';
import MegaMenuPanel from './navbar/MegaMenuPanel';
import SearchModal from './navbar/SearchModal';
import MobileDrawer from './navbar/MobileDrawer';

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
  cta: { label: 'View All Colleges', href: '/colleges' },
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

// ─── Main Navbar ───────────────────────────────────────────
export default function Navbar() {
  const { language, changeLanguage, t, supportedLanguages } = useLanguage();

  const isScrolled = useScrollPosition(8);
  const [activeMega, setActiveMega] = useState(null); // 'colleges' | 'exams' | null
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isUserOpen, setIsUserOpen] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);

  const location = useLocation();
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector(state => state.auth);
  const navRef = useRef(null);
  const langRef = useRef(null);

  const simpleNavLinks = [
    { name: t('navbar.courses'), href: '/courses' },
    { name: t('navbar.scholarships'), href: '/scholarships' },
    { name: t('navbar.compare'), href: '/compare' },
    { name: t('navbar.blogs'), href: '/blogs' },
  ];

  // Close everything on route change
  useEffect(() => {
    setActiveMega(null);
    setIsMobileOpen(false);
    setIsUserOpen(false);
  }, [location.pathname]);

  // Close mega menu and user dropdown on outside click
  useOutsideClick(navRef, () => {
    setActiveMega(null);
    setIsUserOpen(false);
  });

  // Close language dropdown on outside click
  useOutsideClick(langRef, () => {
    setIsLangOpen(false);
  });

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
        <TopBar isScrolled={isScrolled} />

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
                    {t('navbar.colleges')}
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
                    {t('navbar.exams')}
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
                  href="tel:+917205402554"
                  className="hidden md:flex items-center gap-1.5 btn-cta py-2 px-4 text-xs animate-pulse-subtle"
                >
                  <Phone size={13} />
                  {t('navbar.freeCounselling')}
                </a>

                {/* Language Switcher */}
                <div className="relative" ref={langRef}>
                  <button
                    onClick={() => setIsLangOpen(!isLangOpen)}
                    className="flex items-center gap-1.5 p-2 rounded-lg text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition-all font-semibold text-xs uppercase"
                    aria-label="Change Language"
                  >
                    <Languages size={15} />
                    <span className="hidden sm:inline">{supportedLanguages.find(l => l.code === language)?.shortLabel}</span>
                  </button>

                  {isLangOpen && (
                    <div className="absolute right-0 top-full mt-2 w-40 bg-white border border-slate-200 rounded-xl shadow-lg animate-slide-down overflow-hidden z-50 p-1 space-y-0.5">
                      {supportedLanguages.map((lang) => (
                        <button
                          key={lang.code}
                          onClick={() => {
                            changeLanguage(lang.code);
                            setIsLangOpen(false);
                          }}
                          className={`w-full text-left px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                            language === lang.code
                              ? 'bg-primary-50 text-primary-600 font-bold'
                              : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                          }`}
                        >
                          {lang.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

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
                          {user?.role === 'admin' ? (
                            <Link to="/admin" onClick={() => setIsUserOpen(false)} className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-primary-700 bg-primary-50 hover:bg-primary-100 transition-colors font-semibold">
                              <LayoutDashboard size={15} /> {t('navbar.adminPanel')}
                            </Link>
                          ) : (
                            <Link to="/dashboard" onClick={() => setIsUserOpen(false)} className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors font-medium">
                              <User size={15} /> {t('navbar.studentDashboard')}
                            </Link>
                          )}
                          <button onClick={() => { handleLogout(); setIsUserOpen(false); }} className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-red-600 hover:bg-red-50 transition-colors font-medium">
                            <LogOut size={15} /> {t('navbar.signOut')}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Link to="/login" className="hidden sm:block text-sm font-semibold text-slate-600 hover:text-slate-900 px-3 py-2 rounded-lg hover:bg-slate-50 transition-all">
                      {t('navbar.login')}
                    </Link>
                    <Link to="/register" className="btn-primary py-2 px-4 text-xs">
                      {t('navbar.joinFree')}
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
            <MobileDrawer
              isAuthenticated={isAuthenticated}
              user={user}
              onClose={() => setIsMobileOpen(false)}
              onLogout={handleLogout}
              onSearchOpen={() => setIsSearchOpen(true)}
            />
          )}
        </nav>
      </header>

      {/* Search Modal */}
      {isSearchOpen && <SearchModal onClose={() => setIsSearchOpen(false)} />}
    </>
  );
}

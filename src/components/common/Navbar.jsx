import { useState, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logoutUser } from '../../store/slices/authSlice';
import { toggleTheme } from '../../store/slices/uiSlice';
import {
  ChevronDown, GraduationCap, Phone, Languages, User,
  LogOut, LayoutDashboard, Search, Menu, X, Sun, Moon
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
        { label: 'Engineering Colleges', href: '/colleges?category=Engineering' },
        { label: 'Medical Colleges', href: '/colleges?category=Medical' },
        { label: 'Management Colleges', href: '/colleges?category=Management' },
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
    {
      heading: 'Popular Colleges',
      links: [
        { label: 'IIT Bhubaneswar', href: '/colleges/iit-bhubaneswar' },
        { label: 'NIT Rourkela', href: '/colleges/nit-rourkela' },
        { label: 'KIIT University', href: '/colleges/kiit-university' },
        { label: 'Ravenshaw University', href: '/colleges/ravenshaw-university' },
        { label: 'SOA University', href: '/colleges/soa-university' },
        { label: 'VSSUT Burla', href: '/colleges/vssut-burla' },
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
      ],
    },
    {
      heading: 'Medical',
      links: [
        { label: 'NEET UG', href: '/exams?search=NEET' },
        { label: 'AIIMS BSc', href: '/exams?search=AIIMS+BSc' },
      ],
    },
    {
      heading: 'Management & Others',
      links: [
        { label: 'CAT 2025', href: '/exams?search=CAT' },
        { label: 'CUET UG', href: '/exams?search=CUET' },
        { label: 'OPSC Exams', href: '/exams?type=Government+Job' },
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
  const [prevPathname, setPrevPathname] = useState(location.pathname);

  if (location.pathname !== prevPathname) {
    setPrevPathname(location.pathname);
    setActiveMega(null);
    setIsMobileOpen(false);
    setIsUserOpen(false);
  }

  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector(state => state.auth);
  const theme = useSelector(state => state.ui.theme);
  const navRef = useRef(null);
  const langRef = useRef(null);

  const simpleNavLinks = [
    { name: t('navbar.courses'), href: '/courses' },
    { name: t('navbar.scholarships'), href: '/scholarships' },
    { name: t('navbar.compare'), href: '/compare' },
    { name: t('navbar.blogs'), href: '/blogs' },
    { name: t('footer.links.aboutUs'), href: '/about' },
  ];

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
              ? 'bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shadow-sm'
              : 'bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800'
          }`}
        >
          <div className="container-xl">
            <div className="flex items-center h-16 gap-1 lg:gap-2.5 xl:gap-4">

              {/* ─ Logo ─ */}
              <Link to="/" className="flex items-center gap-2.5 shrink-0" aria-label="EduOdisha Home">
                <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                  <GraduationCap size={18} className="text-white" />
                </div>
                <span className="font-display font-extrabold text-lg text-slate-900 dark:text-white tracking-tight">
                  Edu<span className="text-primary-600">Odisha</span>
                </span>
              </Link>

              {/* ─ Desktop Nav ─ */}
              <div className="hidden lg:flex items-center gap-0.5 flex-grow justify-center">
                {/* Colleges — Mega */}
                <div className="relative">
                  <button
                    onMouseEnter={() => setActiveMega('colleges')}
                    onMouseLeave={() => setActiveMega(null)}
                    onClick={() => setActiveMega(activeMega === 'colleges' ? null : 'colleges')}
                    className={`flex items-center gap-1 px-1.5 xl:px-2 py-2 rounded-lg text-xs xl:text-[13px] font-semibold whitespace-nowrap transition-all ${
                      isActive('/colleges') || activeMega === 'colleges'
                        ? 'text-primary-600 bg-primary-50 dark:bg-primary-950/40'
                        : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800'
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
                      <MegaMenuPanel data={collegesMegaMenu} onClose={() => setActiveMega(null)} align="left-0" headingColor="text-primary-600" />
                    </div>
                  )}
                </div>

                {/* Exams — Mega */}
                <div className="relative">
                  <button
                    onMouseEnter={() => setActiveMega('exams')}
                    onMouseLeave={() => setActiveMega(null)}
                    onClick={() => setActiveMega(activeMega === 'exams' ? null : 'exams')}
                    className={`flex items-center gap-1 px-1.5 xl:px-2 py-2 rounded-lg text-xs xl:text-[13px] font-semibold whitespace-nowrap transition-all ${
                      isActive('/exams') || activeMega === 'exams'
                        ? 'text-primary-600 bg-primary-50 dark:bg-primary-950/40'
                        : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800'
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
                      <MegaMenuPanel data={examsMegaMenu} onClose={() => setActiveMega(null)} align="-left-24" headingColor="text-primary-600" />
                    </div>
                  )}
                </div>

                {/* Simple Links */}
                {simpleNavLinks.map(link => (
                  <Link
                    key={link.name}
                    to={link.href}
                    className={`px-1.5 xl:px-2 py-2 rounded-lg text-xs xl:text-[13px] font-semibold whitespace-nowrap transition-all ${
                      isActive(link.href)
                        ? 'text-primary-600 bg-primary-50 dark:bg-primary-950/40'
                        : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    {link.name}
                  </Link>
                ))}
              </div>

              {/* ─ Right Actions ─ */}
              <div className="flex items-center gap-1 xl:gap-1.5 ml-auto shrink-0">
                {/* Search */}
                <button
                  onClick={() => setIsSearchOpen(true)}
                  id="navbar-search-btn"
                  className="p-2 rounded-lg text-slate-500 hover:text-slate-700 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-slate-200 dark:hover:bg-slate-800 transition-all"
                  aria-label="Open search"
                >
                  <Search size={18} />
                </button>

                {/* Theme Toggle */}
                <button
                  onClick={() => dispatch(toggleTheme())}
                  className="p-2 rounded-lg text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition-all dark:text-slate-400 dark:hover:text-slate-200 dark:hover:bg-slate-800"
                  aria-label="Toggle theme"
                >
                  {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
                </button>

                {/* Counselling CTA — visible md+ */}
                <a
                  href="tel:+917205402554"
                  className="hidden md:flex items-center gap-1 btn-cta py-1.5 px-2 xl:px-3.5 text-[11px] xl:text-xs animate-pulse-subtle whitespace-nowrap"
                >
                  <Phone size={13} />
                  {t('navbar.freeCounselling')}
                </a>

                {/* Language Switcher */}
                <div className="relative" ref={langRef}>
                  <button
                    onClick={() => setIsLangOpen(!isLangOpen)}
                    className="flex items-center gap-1 p-1 lg:p-1.5 rounded-lg text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition-all font-semibold text-[11px] xl:text-xs uppercase"
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
                  <div className="flex items-center gap-1 xl:gap-1.5">
                    <Link to="/login" className="hidden sm:block text-xs xl:text-[13px] font-semibold text-slate-600 hover:text-slate-900 px-1.5 xl:px-2 py-2 rounded-lg hover:bg-slate-50 transition-all">
                      {t('navbar.login')}
                    </Link>
                    <Link to="/register" className="btn-primary py-1.5 px-2.5 xl:px-3.5 text-[11px] xl:text-xs whitespace-nowrap">
                      {t('navbar.joinFree')}
                    </Link>
                  </div>
                )}

                {/* Mobile Hamburger */}
                <button
                  onClick={() => setIsMobileOpen(!isMobileOpen)}
                  className="lg:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 transition-all"
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

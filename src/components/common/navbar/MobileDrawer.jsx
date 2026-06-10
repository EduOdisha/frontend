import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { toggleTheme } from '../../../store/slices/uiSlice';
import {
  Search, School, BookOpen, FileText, Award,
  GitCompare, BookMarked, LayoutDashboard, User, LogOut, Phone, Info,
  Sun, Moon
} from 'lucide-react';
import { useLanguage } from '../../../context/LanguageContext';

/**
 * MobileDrawer navigation drawer for screen sizes under lg.
 * @param {object} props
 * @param {boolean} props.isAuthenticated - Authentication state
 * @param {object|null} props.user - Current user object
 * @param {function} props.onClose - Close drawer callback
 * @param {function} props.onLogout - Logout handler
 * @param {function} props.onSearchOpen - Search modal trigger handler
 */
export default function MobileDrawer({
  isAuthenticated,
  user,
  onClose,
  onLogout,
  onSearchOpen
}) {
  const { language, changeLanguage, t, supportedLanguages } = useLanguage();
  const dispatch = useDispatch();
  const theme = useSelector((state) => state.ui.theme);

  return (
    <>
      <div className="fixed inset-0 bg-slate-900/30 z-40 lg:hidden" onClick={onClose} />
      <div className="fixed top-16 left-0 right-0 bottom-0 bg-white z-50 lg:hidden overflow-y-auto animate-slide-down">
        <div className="px-4 py-6 space-y-1">
          {/* Search */}
          <button
            onClick={() => {
              onClose();
              onSearchOpen();
            }}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-500 text-sm font-medium mb-4"
          >
            <Search size={16} />
            {t('navbar.searchPlaceholder')}
          </button>

          <Link
            to="/colleges"
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-700 hover:bg-primary-50 hover:text-primary-600 font-semibold transition-all"
            onClick={onClose}
          >
            <School size={18} /> {t('navbar.colleges')}
          </Link>
          <Link
            to="/courses"
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-700 hover:bg-primary-50 hover:text-primary-600 font-semibold transition-all"
            onClick={onClose}
          >
            <BookOpen size={18} /> {t('navbar.courses')}
          </Link>
          <Link
            to="/exams"
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-700 hover:bg-primary-50 hover:text-primary-600 font-semibold transition-all"
            onClick={onClose}
          >
            <FileText size={18} /> {t('navbar.exams')}
          </Link>
          <Link
            to="/scholarships"
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-700 hover:bg-primary-50 hover:text-primary-600 font-semibold transition-all"
            onClick={onClose}
          >
            <Award size={18} /> {t('navbar.scholarships')}
          </Link>
          <Link
            to="/compare"
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-700 hover:bg-primary-50 hover:text-primary-600 font-semibold transition-all"
            onClick={onClose}
          >
            <GitCompare size={18} /> {t('navbar.compare')}
          </Link>
          <Link
            to="/blogs"
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-700 hover:bg-primary-50 hover:text-primary-600 font-semibold transition-all"
            onClick={onClose}
          >
            <BookMarked size={18} /> {t('navbar.blogs')}
          </Link>
          <Link
            to="/about"
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-700 hover:bg-primary-50 hover:text-primary-600 font-semibold transition-all"
            onClick={onClose}
          >
            <Info size={18} /> {t('footer.links.aboutUs')}
          </Link>

          <div className="pt-4 border-t border-slate-100 mt-4 space-y-2">
            {isAuthenticated ? (
              <>
                {user?.role === 'admin' ? (
                  <Link
                    to="/admin"
                    onClick={onClose}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-primary-700 bg-primary-50 font-semibold"
                  >
                    <LayoutDashboard size={18} /> {t('navbar.adminPanel')}
                  </Link>
                ) : (
                  <Link
                    to="/dashboard"
                    onClick={onClose}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-primary-600 bg-primary-50 font-semibold"
                  >
                    <User size={18} /> {t('navbar.myDashboard')}
                  </Link>
                )}
                <button
                  onClick={() => {
                    onLogout();
                    onClose();
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 font-semibold transition-all"
                >
                  <LogOut size={18} /> {t('navbar.signOut')}
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="block text-center w-full btn-secondary py-3"
                  onClick={onClose}
                >
                  {t('navbar.login')}
                </Link>
                <Link
                  to="/register"
                  className="block text-center w-full btn-cta py-3"
                  onClick={onClose}
                >
                  {t('navbar.joinFree')}
                </Link>
              </>
            )}
          </div>

          <div className="pt-4">
            <a
              href="tel:+917205402554"
              className="flex items-center justify-center gap-2 w-full py-3 border border-slate-200 rounded-xl text-sm font-semibold text-slate-700"
            >
              <Phone size={15} /> {t('navbar.freeCounselling')}: +91 7205402554
            </a>
          </div>

          {/* Mobile Theme Toggle */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 mt-4 flex items-center justify-between px-1">
            <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Theme / ଥିମ୍</span>
            <button
              onClick={() => {
                dispatch(toggleTheme());
                onClose();
              }}
              className="flex items-center gap-2 px-4 py-2 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all cursor-pointer"
            >
              {theme === 'dark' ? (
                <>
                  <Sun size={14} className="text-amber-500" /> Light Mode
                </>
              ) : (
                <>
                  <Moon size={14} className="text-slate-500" /> Dark Mode
                </>
              )}
            </button>
          </div>

          {/* Mobile Language Selector */}
          <div className="pt-4 border-t border-slate-100 mt-4">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 px-1">
              Choose Language / ସିଲେକ୍ଟ ଲାଙ୍ଗୁଏଜ୍
            </p>
            <div className="grid grid-cols-3 gap-2">
              {supportedLanguages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => {
                    changeLanguage(lang.code);
                    onClose();
                  }}
                  className={`py-2 px-3 rounded-xl text-xs font-bold transition-all border ${
                    language === lang.code
                      ? 'bg-primary-600 text-white border-primary-600 shadow-sm shadow-primary-600/10'
                      : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  {lang.label.split(' ')[0]}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { 
  School, BookOpen, GraduationCap, 
  Sparkles
} from 'lucide-react';

const navLinks = [
  { name: 'Colleges', href: '/colleges', icon: School },
  { name: 'Courses', href: '/courses', icon: BookOpen },
  { name: 'Exams', href: '/exams', icon: GraduationCap },
  { name: 'Scholarships', href: '/scholarships', icon: Sparkles },
  { name: 'Guidance', href: '/career-guidance', icon: null },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isUserOpen, setIsUserOpen] = useState(false);

  const location = useLocation();
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const isHome = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setIsUserOpen(false), 0);
    return () => clearTimeout(timer);
  }, [location.pathname]);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white border-b border-slate-200 shadow-sm py-2'
          : isHome
            ? 'bg-transparent py-4'
            : 'bg-white border-b border-slate-200 py-2'
      }`}
    >
      <div className="container-xl">
        <div className="flex items-center justify-between gap-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 shrink-0 group">
            <div className="w-10 h-10 rounded-lg bg-primary-600 flex items-center justify-center text-white shadow-md shadow-primary-600/20 group-hover:bg-primary-700 transition-colors">
              <span className="font-display font-black text-xl">E</span>
            </div>
            <div className="hidden sm:flex flex-col">
              <span className={`font-display font-extrabold text-xl leading-none tracking-tight ${
                isHome && !isScrolled ? 'text-white' : 'text-slate-900'
              }`}>
                EduOdisha
              </span>
              <span className={`text-[10px] font-bold tracking-widest uppercase mt-0.5 ${
                isHome && !isScrolled ? 'text-primary-200' : 'text-primary-600'
              }`}>
                Gateway to Success
              </span>
            </div>
          </Link>

          {/* Desktop Links */}
          <div className="hidden lg:flex items-center gap-1 ml-auto">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                  location.pathname === link.href
                    ? isHome && !isScrolled ? 'bg-white/20 text-white' : 'bg-primary-50 text-primary-700'
                    : isHome && !isScrolled ? 'text-white/80 hover:text-white hover:bg-white/10' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 ml-4">
            {isAuthenticated ? (
              <div className="relative">
                <button 
                  onClick={() => setIsUserOpen(!isUserOpen)}
                  className={`flex items-center gap-2 p-1 pr-3 rounded-full border transition-all ${
                    isHome && !isScrolled ? 'bg-white/10 border-white/20 hover:bg-white/20' : 'bg-white border-slate-200 hover:border-primary-300'
                  }`}
                >
                  <div className="w-8 h-8 rounded-full bg-primary-600 flex items-center justify-center text-white font-bold text-xs">
                    {user?.name?.[0] || 'U'}
                  </div>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login" className={`text-sm font-semibold px-4 py-2 rounded-lg transition-all hidden md:block ${
                  isHome && !isScrolled ? 'text-white hover:bg-white/10' : 'text-slate-600 hover:bg-slate-50'
                }`}>
                  Log In
                </Link>
                <Link to="/register" className="btn-primary py-2 px-5 text-sm whitespace-nowrap">
                  Join Free
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

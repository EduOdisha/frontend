import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Mail, Phone, ArrowUpRight } from 'lucide-react';
import api from '../../utils/api';
import { useLanguage } from '../../context/LanguageContext';

const SOCIAL_LINKS = [
  { label: 'Facebook', href: '#', icon: 'f' },
  { label: 'Twitter / X', href: '#', icon: 'X' },
  { label: 'LinkedIn', href: '#', icon: 'in' },
  { label: 'Instagram', href: '#', icon: 'ig' },
  { label: 'YouTube', href: '#', icon: '▶' },
];

export default function Footer() {
  const { t } = useLanguage();
  const [stats, setStats] = useState({
    colleges: 10,
    courses: 6,
    exams: 7,
    scholarships: 6
  });

  useEffect(() => {
    let isMounted = true;
    const fetchStats = async () => {
      try {
        const { data } = await api.get('/colleges/public-stats');
        if (isMounted && data?.success && data?.data) {
          setStats({
            colleges: data.data.colleges ?? 10,
            courses: data.data.courses ?? 6,
            exams: data.data.exams ?? 7,
            scholarships: data.data.scholarships ?? 6
          });
        }
      } catch {
        // Fallback to defaults already configured in state
      }
    };
    fetchStats();
    return () => {
      isMounted = false;
    };
  }, []);

  // Build link groups from translations
  const FOOTER_LINKS = [
    {
      title: t('footer.groups.explore'),
      links: [
        { name: t('footer.links.topColleges'),    href: '/colleges' },
        { name: t('footer.links.popularCourses'), href: '/courses' },
        { name: t('footer.links.entranceExams'),  href: '/exams' },
        { name: t('footer.links.scholarships'),   href: '/scholarships' },
        { name: t('footer.links.compareColleges'),href: '/compare' },
      ],
    },
    {
      title: t('footer.groups.byStream'),
      links: [
        { name: t('footer.links.engineering'), href: '/colleges?category=Engineering' },
        { name: t('footer.links.medical'),     href: '/colleges?category=Medical' },
        { name: t('footer.links.management'),  href: '/colleges?category=Management' },
        { name: t('footer.links.nursing'),     href: '/colleges?category=Nursing' },
      ],
    },
    {
      title: t('footer.groups.company'),
      links: [
        { name: t('footer.links.aboutUs'),        href: '/about' },
        { name: t('footer.links.blog'),            href: '/blogs' },
        { name: t('footer.links.careerGuidance'),  href: '/career-guidance' },
        { name: t('footer.links.contactUs'),       href: '/contact' },
        { name: t('footer.links.advertise'),       href: '/advertise' },
      ],
    },
    {
      title: t('footer.groups.legal'),
      links: [
        { name: t('footer.links.privacyPolicy'),  href: '/privacy' },
        { name: t('footer.links.termsOfService'), href: '/terms' },
        { name: t('footer.links.cookiePolicy'),   href: '/cookies' },
        { name: t('footer.links.disclaimer'),     href: '/disclaimer' },
      ],
    },
  ];

  return (
    <footer className="bg-slate-900 text-slate-400">
      {/* Stats Bar */}
      <div className="border-b border-slate-800/80 bg-slate-950/30">
        <div className="container-xl py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center md:text-left">
            <div className="space-y-1">
              <span className="text-2xl font-black text-white tracking-tight">{stats.colleges}</span>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">{t('footer.stats.colleges')}</p>
            </div>
            <div className="space-y-1">
              <span className="text-2xl font-black text-white tracking-tight">{stats.courses}</span>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">{t('footer.stats.courses')}</p>
            </div>
            <div className="space-y-1">
              <span className="text-2xl font-black text-white tracking-tight">{stats.exams}</span>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">{t('footer.stats.exams')}</p>
            </div>
            <div className="space-y-1">
              <span className="text-2xl font-black text-white tracking-tight">{stats.scholarships}</span>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">{t('footer.stats.scholarships')}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Top Section */}
      <div className="container-xl pt-14 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-6 gap-10">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-2.5 mb-5">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-black text-base">E</span>
              </div>
              <span className="font-display font-extrabold text-xl text-white tracking-tight">
                Edu<span className="text-primary-400">Odisha</span>
              </span>
            </Link>

            <p className="text-sm text-slate-400 mb-6 leading-relaxed max-w-xs">
              {t('footer.tagline')}
            </p>

            {/* Contact mini-cards */}
            <div className="space-y-3">
              <a href="tel:+917205402554" className="flex items-center gap-2.5 text-sm text-slate-400 hover:text-white transition-colors group">
                <div className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400 group-hover:border-primary-700 group-hover:text-primary-400 transition-all shrink-0">
                  <Phone size={14} />
                </div>
                +91 7205402554
              </a>
              <a href="mailto:eduodisha121@gmail.com" className="flex items-center gap-2.5 text-sm text-slate-400 hover:text-white transition-colors group">
                <div className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400 group-hover:border-primary-700 group-hover:text-primary-400 transition-all shrink-0">
                  <Mail size={14} />
                </div>
                eduodisha121@gmail.com
              </a>
              <div className="flex items-center gap-2.5 text-sm text-slate-500">
                <div className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center shrink-0">
                  <MapPin size={14} />
                </div>
                Bhubaneswar, Odisha — 751001
              </div>
            </div>

            {/* Social */}
            <div className="flex items-center gap-2 mt-6">
              {SOCIAL_LINKS.map(s => (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  className="w-9 h-9 rounded-lg bg-slate-800 border border-slate-700 hover:border-primary-600 hover:bg-primary-700 hover:text-white flex items-center justify-center text-slate-400 text-[11px] font-bold transition-all duration-200"
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Link Columns */}
          {FOOTER_LINKS.map(group => (
            <div key={group.title}>
              <h3 className="text-white font-bold text-xs uppercase tracking-widest mb-4">{group.title}</h3>
              <ul className="space-y-2.5">
                {group.links.map(link => (
                  <li key={link.href}>
                    <Link
                      to={link.href}
                      className="text-sm text-slate-400 hover:text-white transition-colors font-medium"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-slate-800">
        <div className="container-xl py-5 flex flex-col md:flex-row items-center justify-center gap-4">
          <p className="text-xs text-slate-500 font-medium">
            {t('footer.copyright').replace('{year}', new Date().getFullYear())}
          </p>

          <div className="flex items-center gap-4">
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-white transition-colors"
            >
              {t('footer.backToTop')} <ArrowUpRight size={12} />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}

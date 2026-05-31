import { Link } from 'react-router-dom';
import { MapPin, Mail, Phone, ArrowUpRight } from 'lucide-react';

const FOOTER_LINKS = [
  {
    title: 'Explore',
    links: [
      { name: 'Top Colleges', href: '/colleges' },
      { name: 'Popular Courses', href: '/courses' },
      { name: 'Entrance Exams', href: '/exams' },
      { name: 'Scholarships', href: '/scholarships' },
      { name: 'Coaching Centers', href: '/coaching' },
    ],
  },
  {
    title: 'By Stream',
    links: [
      { name: 'Engineering', href: '/colleges?category=Engineering' },
      { name: 'Medical', href: '/colleges?category=Medical' },
      { name: 'Management', href: '/colleges?category=Management' },
      { name: 'Law', href: '/colleges?category=Law' },
      { name: 'Pharmacy', href: '/colleges?category=Pharmacy' },
    ],
  },
  {
    title: 'Company',
    links: [
      { name: 'About Us', href: '/about' },
      { name: 'Blog', href: '/blogs' },
      { name: 'Career Guidance', href: '/career-guidance' },
      { name: 'Contact Us', href: '/contact' },
      { name: 'Advertise', href: '/advertise' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { name: 'Privacy Policy', href: '/privacy' },
      { name: 'Terms of Service', href: '/terms' },
      { name: 'Cookie Policy', href: '/cookies' },
      { name: 'Disclaimer', href: '/disclaimer' },
    ],
  },
];

const SOCIAL_LINKS = [
  { label: 'Facebook', href: '#', icon: 'f' },
  { label: 'Twitter / X', href: '#', icon: 'X' },
  { label: 'LinkedIn', href: '#', icon: 'in' },
  { label: 'Instagram', href: '#', icon: 'ig' },
  { label: 'YouTube', href: '#', icon: '▶' },
];

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400">
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
              Odisha's most comprehensive education platform. Helping students make informed decisions through verified data and expert counselling.
            </p>

            {/* Contact mini-cards */}
            <div className="space-y-3">
              <a href="tel:+911800001234" className="flex items-center gap-2.5 text-sm text-slate-400 hover:text-white transition-colors group">
                <div className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400 group-hover:border-primary-700 group-hover:text-primary-400 transition-all shrink-0">
                  <Phone size={14} />
                </div>
                1800-001-234 (Free)
              </a>
              <a href="mailto:hello@eduodisha.in" className="flex items-center gap-2.5 text-sm text-slate-400 hover:text-white transition-colors group">
                <div className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400 group-hover:border-primary-700 group-hover:text-primary-400 transition-all shrink-0">
                  <Mail size={14} />
                </div>
                hello@eduodisha.in
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
                  <li key={link.name}>
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
        <div className="container-xl py-5 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-500 font-medium">
            © {new Date().getFullYear()} EduOdisha Technologies Pvt. Ltd. All rights reserved.
          </p>

          <div className="flex items-center gap-4">
            <span className="text-xs text-slate-600 font-medium">🏫 Made with ❤️ in Odisha</span>
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-white transition-colors"
            >
              Back to top <ArrowUpRight size={12} />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}

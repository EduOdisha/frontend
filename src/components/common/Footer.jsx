import { Link } from 'react-router-dom';
import { MapPin, Mail, Phone, ChevronRight, ArrowUp } from 'lucide-react';

const footerLinks = [
  {
    title: 'Explore',
    links: [
      { name: 'Top Colleges', href: '/colleges' },
      { name: 'Popular Courses', href: '/courses' },
      { name: 'Entrance Exams', href: '/exams' },
      { name: 'Scholarships', href: '/scholarships' },
    ],
  },
  {
    title: 'Categories',
    links: [
      { name: 'Engineering', href: '/colleges?category=Engineering' },
      { name: 'Management', href: '/colleges?category=Management' },
      { name: 'Medical', href: '/colleges?category=Medical' },
      { name: 'Law', href: '/colleges?category=Law' },
    ],
  },
  {
    title: 'Support',
    links: [
      { name: 'About Us', href: '/about' },
      { name: 'Contact Us', href: '/contact' },
      { name: 'Privacy Policy', href: '/privacy' },
      { name: 'Terms of Service', href: '/terms' },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 pt-20 pb-10">
      <div className="container-xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-3 mb-6 group">
              <div className="w-10 h-10 rounded-lg bg-primary-600 flex items-center justify-center text-white shadow-lg shadow-primary-600/20 transition-transform group-hover:scale-105">
                <span className="font-display font-black text-xl">E</span>
              </div>
              <div className="flex flex-col">
                <span className="font-display font-extrabold text-xl leading-none text-white tracking-tight">
                  EduOdisha
                </span>
                <span className="text-[10px] font-bold tracking-widest uppercase text-primary-400 mt-1">
                  Empowering Future
                </span>
              </div>
            </Link>
            <p className="text-slate-400 mb-8 max-w-sm leading-relaxed text-sm font-medium">
              Odisha's most comprehensive educational discovery platform. 
              Helping students make informed decisions through data-driven insights.
            </p>
            <div className="flex items-center gap-3">
              {['FB', 'TW', 'LN', 'IG'].map((social) => (
                <a
                  key={social}
                  href="#"
                  className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-primary-600 hover:text-white transition-all duration-300 border border-slate-700 hover:border-primary-500 text-[10px] font-bold"
                >
                  {social}
                </a>
              ))}
            </div>
          </div>

          {footerLinks.map((group) => (
            <div key={group.title}>
              <h3 className="text-white font-bold mb-6 text-xs uppercase tracking-[0.2em]">{group.title}</h3>
              <ul className="space-y-4">
                {group.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.href}
                      className="text-slate-400 hover:text-white transition-colors text-sm font-semibold flex items-center group"
                    >
                      <ChevronRight
                        size={14}
                        className="opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all mr-2 text-primary-500"
                      />
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-10 border-y border-slate-800/50 mb-10">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-slate-800/50 border border-slate-700 flex items-center justify-center text-primary-400">
              <Phone size={20} />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-0.5">Helpline</p>
              <p className="text-white font-bold text-sm">+91 1800-270-1234</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-slate-800/50 border border-slate-700 flex items-center justify-center text-primary-400">
              <Mail size={20} />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-0.5">Email Support</p>
              <p className="text-white font-bold text-sm">contact@eduodisha.in</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-slate-800/50 border border-slate-700 flex items-center justify-center text-primary-400">
              <MapPin size={20} />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-0.5">Office</p>
              <p className="text-white font-bold text-sm">Bhubaneswar, Odisha</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">
            &copy; {new Date().getFullYear()} EduOdisha. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
             <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="text-primary-500 hover:text-primary-400 transition-colors flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest"
            >
              <span>Back to Top</span>
              <ArrowUp size={14} />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}

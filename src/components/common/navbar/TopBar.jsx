import React from 'react';
import { Phone, Mail, MapPin } from 'lucide-react';

/**
 * TopBar component displays metadata subheader bar at the top of the viewport.
 * @param {object} props
 * @param {boolean} props.isScrolled - Hide state indicator
 */
export default function TopBar({ isScrolled }) {
  return (
    <div
      className={`bg-[#0b0f19] text-slate-300 border-b border-slate-800/80 text-xs transition-all duration-200 origin-top overflow-hidden hidden md:block w-full ${
        isScrolled ? 'h-0 py-0 border-none opacity-0' : 'h-[38px] py-2'
      }`}
    >
      <div className="container-xl flex items-center justify-between">
        {/* Contact details */}
        <div className="flex items-center gap-6">
          <a
            href="tel:+917205402554"
            className="flex items-center gap-1.5 text-slate-400 hover:text-white transition-colors text-[11px] font-medium"
          >
            <Phone size={12} className="text-slate-500" />
            <span>+91 7205402554</span>
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
  );
}

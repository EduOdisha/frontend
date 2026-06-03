import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

/**
 * MegaMenuPanel component displays grouped link directories in a dropdown.
 * @param {object} props
 * @param {object} props.data - Menu structured columns and cta
 * @param {function} props.onClose - Closure callback
 * @param {string} [props.align] - Alignment CSS class
 */
export default function MegaMenuPanel({ data, onClose, align = 'left-0' }) {
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

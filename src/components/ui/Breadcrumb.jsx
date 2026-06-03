import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

/**
 * Breadcrumb component for hierarchical page navigation.
 * @param {object} props
 * @param {Array<{label: string, href?: string}>} props.items - List of breadcrumb items
 * @param {string} [props.className] - Additional CSS class name
 */
export default function Breadcrumb({ items, className = 'mb-4 text-slate-400' }) {
  return (
    <nav className={`flex flex-wrap items-center gap-1.5 text-xs font-medium ${className}`} aria-label="Breadcrumb">
      {items.map((item, idx) => {
        const isLast = idx === items.length - 1;
        return (
          <React.Fragment key={idx}>
            {idx > 0 && <ChevronRight size={12} className="text-slate-400 dark:text-slate-500 shrink-0" />}
            {isLast ? (
              <span className="text-slate-600 dark:text-slate-300 font-semibold">{item.label}</span>
            ) : (
              <Link to={item.href || '#'} className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                {item.label}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
}

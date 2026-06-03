import React from 'react';

/**
 * Reusable PageHero component for consistent page titles and subheadings.
 * @param {object} props
 * @param {string} props.title - Main header title
 * @param {string} [props.subtitle] - Optional subtitle/tagline below the header
 * @param {string} [props.className] - Additional CSS classes
 */
export default function PageHero({ title, subtitle, className = 'mb-10' }) {
  return (
    <div className={className}>
      <h1 className="text-3xl md:text-4xl font-display font-bold text-slate-900 dark:text-white mb-4">
        {title}
      </h1>
      {subtitle && (
        <p className="text-slate-500 dark:text-slate-400 text-base md:text-lg max-w-3xl leading-relaxed">
          {subtitle}
        </p>
      )}
    </div>
  );
}

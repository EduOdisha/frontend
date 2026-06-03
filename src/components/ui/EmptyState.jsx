import React from 'react';

/**
 * Reusable EmptyState component for search/filter results with zero items.
 * @param {object} props
 * @param {React.ComponentType} props.icon - Lucide icon component
 * @param {string} props.title - Title text
 * @param {string} props.subtitle - Description text
 * @param {string} [props.actionText] - Label for the CTA button
 * @param {function} [props.onAction] - Action handler for the CTA button
 */
export default function EmptyState({ icon: Icon, title, subtitle, actionText, onAction }) {
  return (
    <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-3xl border-2 border-dashed border-slate-100 dark:border-slate-800">
      <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
        {Icon && <Icon size={24} className="text-slate-400 dark:text-slate-500" />}
      </div>
      <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-2">{title}</h3>
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-5 max-w-md mx-auto">{subtitle}</p>
      {actionText && onAction && (
        <button
          onClick={onAction}
          className="btn-primary py-2 px-5 text-sm transition-all"
        >
          {actionText}
        </button>
      )}
    </div>
  );
}

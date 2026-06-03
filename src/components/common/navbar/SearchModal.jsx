import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X } from 'lucide-react';
import { useLanguage } from '../../../context/LanguageContext';

/**
 * SearchModal overlay for searching colleges, courses, exams, scholarships.
 * @param {object} props
 * @param {function} props.onClose - Dismiss callback
 */
export default function SearchModal({ onClose }) {
  const { t } = useLanguage();
  const [q, setQ] = useState('');
  const [type, setType] = useState('colleges');
  const navigate = useNavigate();
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (q.trim()) {
      navigate(`/${type}?search=${encodeURIComponent(q)}`);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-slate-900/40 backdrop-blur-sm flex items-start justify-center pt-24 px-4" onClick={onClose}>
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden animate-scale-in" onClick={e => e.stopPropagation()}>
        <form onSubmit={handleSearch}>
          <div className="flex items-center border-b border-slate-100 px-5 py-4">
            <Search className="text-slate-400 shrink-0" size={20} />
            <input
              ref={inputRef}
              type="text"
              value={q}
              onChange={e => setQ(e.target.value)}
              placeholder={t('navbar.searchPlaceholder')}
              className="flex-1 px-4 text-slate-800 text-base font-medium placeholder:text-slate-400 outline-none bg-transparent"
            />
            <button type="button" onClick={onClose} className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors">
              <X size={18} className="text-slate-400" />
            </button>
          </div>
        </form>
        <div className="flex items-center gap-2 px-5 py-3 border-b border-slate-100">
          {['colleges', 'courses', 'exams', 'scholarships'].map(tab => (
            <button
              key={tab}
              onClick={() => setType(tab)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${
                type === tab ? 'bg-primary-600 text-white' : 'text-slate-500 hover:bg-slate-100'
              }`}
            >
              {t(`navbar.${tab}`)}
            </button>
          ))}
        </div>
        <div className="px-5 py-4">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Trending</p>
          <div className="flex flex-wrap gap-2">
            {['B.Tech Bhubaneswar', 'OJEE 2025', 'MBA Odisha', 'NEET Cutoff', 'Scholarships SC/ST'].map(item => (
              <button
                key={item}
                onClick={() => {
                  setQ(item);
                }}
                className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-600 hover:border-primary-300 hover:text-primary-600 transition-all"
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

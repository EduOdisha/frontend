import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Helmet } from 'react-helmet-async';
import { Search, ChevronRight, Award, ChevronDown, ChevronLeft } from 'lucide-react';
import api from '../utils/api.js';
import ExamCard from '../components/exam/ExamCard.jsx';
import { useLanguage } from '../context/LanguageContext';

const types = ['National', 'State', 'University'];
const levelHierarchy = [
  { id: '10th', label: '10th', type: 'level' },
  { id: '12th', label: '12th', type: 'level' },
  {
    id: 'Undergraduate (UG)',
    label: 'Undergraduate (UG)',
    subcategories: [
      { id: 'B.Tech', label: 'B.Tech', type: 'course' },
      { id: 'BCA', label: 'BCA', type: 'course' },
      { id: 'BBA', label: 'BBA', type: 'course' },
      { id: 'B.Sc', label: 'B.Sc', type: 'course' },
      { id: 'Diploma', label: 'Diploma', type: 'level' }
    ]
  },
  {
    id: 'Postgraduate (PG)',
    label: 'Postgraduate (PG)',
    subcategories: [
      { id: 'MBA', label: 'MBA', type: 'course' },
      { id: 'MCA', label: 'MCA', type: 'course' },
      { id: 'M.Tech', label: 'M.Tech', type: 'course' }
    ]
  },
  { id: 'Any', label: 'Any', type: 'level' }
];

export default function ExamsPage() {
  const { t } = useLanguage();
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState({
    type: [],
    level: [],
    course: [],
    search: '',
  });

  const [expandedLevels, setExpandedLevels] = useState({
    'Undergraduate (UG)': false,
    'Postgraduate (PG)': false,
  });

  const toggleExpand = (levelId) => {
    setExpandedLevels(prev => ({
      ...prev,
      [levelId]: !prev[levelId]
    }));
  };

  const { data, isLoading } = useQuery({
    queryKey: ['exams', filters, page],
    queryFn: () => {
      const params = new URLSearchParams();
      if (filters.search) params.append('search', filters.search);
      if (filters.type.length) params.append('type', filters.type.join(','));
      if (filters.level.length) params.append('level', filters.level.join(','));
      if (filters.course.length) params.append('course', filters.course.join(','));
      params.append('page', page);
      params.append('limit', 6);
      
      return api.get(`/exams?${params.toString()}`).then(r => r.data);
    },
  });

  const handleFilterChange = (type, value) => {
    setPage(1);
    setFilters(prev => {
      const current = prev[type];
      const next = current.includes(value) 
        ? current.filter(v => v !== value) 
        : [...current, value];
      return { ...prev, [type]: next };
    });
  };

  const hasActiveFilters = 
    filters.type.length > 0 || 
    filters.level.length > 0 || 
    filters.course.length > 0 || 
    filters.search !== '';

  const handleClearAll = () => {
    setPage(1);
    setFilters({
      type: [],
      level: [],
      course: [],
      search: '',
    });
  };

  return (
    <div className="bg-slate-50 min-h-screen py-10">
      <Helmet>
        <title>Upcoming Entrance Exams 2024 - Dates, Syllabus & Pattern | EduOdisha</title>
      </Helmet>

      <div className="container-xl">
        <div className="flex items-center gap-2 text-xs font-medium text-slate-400 mb-8">
          <span>{t('common.home')}</span>
          <ChevronRight className="w-3 h-3" />
          <span className="text-primary-600">{t('exams.breadcrumb')}</span>
        </div>

        <div className="mb-10">
          <h1 className="text-3xl md:text-4xl font-display font-bold text-slate-900 mb-4">
            {t('exams.pageTitle')}
          </h1>
          <p className="text-slate-500 max-w-3xl">
            {t('exams.subtitle')}
          </p>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar Filters */}
          <aside className="space-y-8">
            <div className="bg-primary-600 text-white rounded-2xl overflow-hidden shadow-sm border border-primary-700">
              <div className="bg-primary-600 px-6 py-4 border-b border-white/10 flex items-center justify-between text-white">
                <h3 className="font-bold text-white text-sm">{t('exams.filters')}</h3>
                {hasActiveFilters && (
                  <button 
                    onClick={handleClearAll}
                    className="text-xs font-bold text-white/95 hover:text-white transition-colors cursor-pointer"
                  >
                    Clear All
                  </button>
                )}
              </div>
              
              <div className="p-6 space-y-6">
                <div>
                  <h4 className="text-xs font-bold text-white/70 uppercase tracking-widest mb-4">{t('exams.examType')}</h4>
                  <div className="space-y-2">
                    {types.map(type => (
                      <label key={type} className="flex items-center gap-3 cursor-pointer group">
                        <input 
                          type="checkbox" 
                          checked={filters.type.includes(type)}
                          onChange={() => handleFilterChange('type', type)}
                          className="w-4 h-4 rounded border-white/30 bg-white/10 text-primary-600 focus:ring-2 focus:ring-white/40 cursor-pointer"
                        />
                        <span className="text-sm text-white/80 group-hover:text-white transition-colors">{type}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-bold text-white/70 uppercase tracking-widest mb-4">{t('exams.level')}</h4>
                  <div className="space-y-3">
                    {levelHierarchy.map(item => {
                      const hasSubs = !!item.subcategories;
                      const isExpanded = expandedLevels[item.id];
                      
                      return (
                        <div key={item.id} className="space-y-1">
                          {hasSubs ? (
                            <button
                              type="button"
                              onClick={() => toggleExpand(item.id)}
                              className="flex items-center justify-between w-full text-left py-1.5 text-sm font-semibold text-white/90 hover:text-white transition-colors group cursor-pointer"
                            >
                              <span>{item.label}</span>
                              <ChevronDown className={`w-4 h-4 text-white/60 group-hover:text-white transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} />
                            </button>
                          ) : (
                            <label className="flex items-center gap-3 cursor-pointer group w-full py-1">
                              <input 
                                type="checkbox" 
                                checked={filters.level.includes(item.id)}
                                onChange={() => handleFilterChange('level', item.id)}
                                className="w-4 h-4 rounded border-white/30 bg-white/10 text-primary-600 focus:ring-2 focus:ring-white/40 cursor-pointer"
                              />
                              <span className="text-sm text-white/80 group-hover:text-white transition-colors">{item.label}</span>
                            </label>
                          )}
                          
                          {hasSubs && isExpanded && (
                            <div className="pl-7 space-y-2 py-1 border-l border-white/10 ml-2 animate-slide-down">
                              {item.subcategories.map(sub => (
                                <label key={sub.id} className="flex items-center gap-3 cursor-pointer group">
                                  <input 
                                    type="checkbox" 
                                    checked={sub.type === 'level' ? filters.level.includes(sub.id) : filters.course.includes(sub.id)}
                                    onChange={() => handleFilterChange(sub.type, sub.id)}
                                    className="w-3.5 h-3.5 rounded border-white/30 bg-white/10 text-primary-600 focus:ring-2 focus:ring-white/40 cursor-pointer"
                                  />
                                  <span className="text-xs text-white/70 group-hover:text-white transition-colors">{sub.label}</span>
                                </label>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl p-4 mb-6 shadow-sm border border-slate-100 flex items-center gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input 
                  type="text"
                  placeholder={t('exams.searchPlaceholder')}
                  className="w-full pl-10 pr-4 py-2 text-sm rounded-xl border border-slate-100 bg-slate-50 focus:ring-2 focus:ring-primary-100 outline-none transition-all"
                  value={filters.search}
                  onChange={(e) => {
                    setPage(1);
                    setFilters({ ...filters, search: e.target.value });
                  }}
                />
              </div>
            </div>

            {isLoading ? (
              <div className="grid sm:grid-cols-2 gap-6">
                {Array(4).fill(0).map((_, i) => <ExamCard key={i} loading={true} />)}
              </div>
            ) : data?.data?.length > 0 ? (
              <>
                <div className="grid sm:grid-cols-2 gap-6">
                  {data.data.map(exam => (
                    <ExamCard key={exam._id} exam={exam} />
                  ))}
                </div>

                {/* Pagination Controls */}
                {data?.pages > 1 && (
                  <div className="flex items-center justify-center gap-1.5 mt-10">
                    <button
                      onClick={() => setPage(p => Math.max(1, p - 1))}
                      disabled={page === 1}
                      className={`w-9 h-9 rounded-xl flex items-center justify-center border transition-all cursor-pointer select-none
                        ${page === 1
                          ? 'border-slate-200 text-slate-300 pointer-events-none'
                          : 'border-slate-200 text-slate-600 hover:border-primary-500 hover:text-primary-600 bg-white hover:bg-primary-50/20'
                        }`}
                    >
                      <ChevronLeft size={16} />
                    </button>

                    {Array.from({ length: data.pages }, (_, i) => i + 1).map(p => (
                      <button
                        key={p}
                        onClick={() => setPage(p)}
                        className={`w-9 h-9 rounded-xl text-xs font-bold transition-all cursor-pointer select-none
                          ${page === p
                            ? 'bg-primary-600 text-white shadow-md shadow-primary-600/10'
                            : 'border border-slate-200 text-slate-600 hover:border-primary-500 hover:text-primary-600 bg-white hover:bg-primary-50/20'
                          }`}
                      >
                        {p}
                      </button>
                    ))}

                    <button
                      onClick={() => setPage(p => Math.min(data.pages, p + 1))}
                      disabled={page === data.pages}
                      className={`w-9 h-9 rounded-xl flex items-center justify-center border transition-all cursor-pointer select-none
                        ${page === data.pages
                          ? 'border-slate-200 text-slate-300 pointer-events-none'
                          : 'border-slate-200 text-slate-600 hover:border-primary-500 hover:text-primary-600 bg-white hover:bg-primary-50/20'
                        }`}
                    >
                      <ChevronRight size={16} />
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-slate-100">
                <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-400">
                  <Award className="w-10 h-10" />
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-2">{t('exams.noExams')}</h3>
                <p className="text-slate-500">{t('exams.noExamsSubtitle')}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

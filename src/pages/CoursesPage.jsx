import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Helmet } from 'react-helmet-async';
import { Search, ChevronRight, BookOpen, ChevronDown } from 'lucide-react';
import api from '../utils/api.js';
import CourseCard from '../components/course/CourseCard.jsx';
import { useLanguage } from '../context/LanguageContext';

const levelHierarchy = [
  {
    id: 'Undergraduate (UG)',
    label: 'Undergraduate (UG)',
    subcategories: [
      { id: 'B.Tech', label: 'B.Tech', type: 'shortName' },
      { id: 'BCA', label: 'BCA', type: 'shortName' },
      { id: 'BBA', label: 'BBA', type: 'shortName' },
      { id: 'B.Sc', label: 'B.Sc', type: 'shortName' },
      { id: 'Diploma', label: 'Diploma', type: 'level' }
    ]
  },
  {
    id: 'Postgraduate (PG)',
    label: 'Postgraduate (PG)',
    subcategories: [
      { id: 'MBA', label: 'MBA', type: 'shortName' },
      { id: 'MCA', label: 'MCA', type: 'shortName' },
      { id: 'M.Tech', label: 'M.Tech', type: 'shortName' }
    ]
  }
];

const streams = ['Engineering', 'Medical', 'Management', 'Nursing'];

export default function CoursesPage() {
  const { t } = useLanguage();
  const [filters, setFilters] = useState({
    level: [],
    stream: [],
    shortName: [],
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
    queryKey: ['courses', filters],
    queryFn: () => {
      const params = new URLSearchParams();
      if (filters.search) params.append('search', filters.search);
      if (filters.level.length) params.append('level', filters.level.join(','));
      if (filters.stream.length) params.append('stream', filters.stream.join(','));
      if (filters.shortName.length) params.append('shortName', filters.shortName.join(','));
      
      return api.get(`/courses?${params.toString()}`).then(r => r.data);
    },
  });

  const handleFilterChange = (type, value) => {
    setFilters(prev => {
      const current = prev[type];
      const next = current.includes(value) 
        ? current.filter(v => v !== value) 
        : [...current, value];
      return { ...prev, [type]: next };
    });
  };

  const hasActiveFilters = 
    filters.level.length > 0 || 
    filters.stream.length > 0 || 
    filters.shortName.length > 0 || 
    filters.search !== '';

  const handleClearAll = () => {
    setFilters({
      level: [],
      stream: [],
      shortName: [],
      search: '',
    });
  };

  return (
    <div className="bg-slate-50 dark:bg-slate-950 min-h-screen py-10">
      <Helmet>
        <title>Top Courses & Career Options in Odisha | EduOdisha</title>
      </Helmet>

      <div className="container-xl">
        <div className="flex items-center gap-2 text-xs font-medium text-slate-400 mb-8">
          <span>{t('common.home')}</span>
          <ChevronRight className="w-3 h-3" />
          <span className="text-primary-600">{t('courses.breadcrumb')}</span>
        </div>

        <div className="mb-10">
          <h1 className="text-3xl md:text-4xl font-display font-bold text-slate-900 dark:text-white mb-4">
            {t('courses.pageTitle')}
          </h1>
          <p className="text-slate-500 dark:text-slate-400 max-w-3xl">
            {t('courses.subtitle')}
          </p>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar Filters */}
          <aside className="space-y-8">
            <div className="bg-primary-600 text-white rounded-2xl overflow-hidden shadow-sm border border-primary-700">
              <div className="bg-primary-600 px-6 py-4 border-b border-white/10 flex items-center justify-between text-white">
                <h3 className="font-bold text-white text-sm">{t('courses.filters')}</h3>
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
                  <h4 className="text-xs font-bold text-white/70 uppercase tracking-widest mb-4">{t('courses.level')}</h4>
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
                                    checked={sub.type === 'level' ? filters.level.includes(sub.id) : filters.shortName.includes(sub.id)}
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

                <div>
                  <h4 className="text-xs font-bold text-white/70 uppercase tracking-widest mb-4">{t('courses.stream')}</h4>
                  <div className="space-y-2">
                    {streams.map(stream => (
                      <label key={stream} className="flex items-center gap-3 cursor-pointer group">
                        <input 
                          type="checkbox" 
                          checked={filters.stream.includes(stream)}
                          onChange={() => handleFilterChange('stream', stream)}
                          className="w-4 h-4 rounded border-white/30 bg-white/10 text-primary-600 focus:ring-2 focus:ring-white/40 cursor-pointer"
                        />
                        <span className="text-sm text-white/80 group-hover:text-white transition-colors">{stream}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 mb-6 shadow-sm border border-slate-100 dark:border-slate-800 flex items-center gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input 
                  type="text"
                  placeholder={t('courses.searchPlaceholder')}
                  className="w-full pl-10 pr-4 py-2 text-sm rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-primary-100 outline-none transition-all"
                  value={filters.search}
                  onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                />
              </div>
            </div>

            {isLoading ? (
              <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {Array(6).fill(0).map((_, i) => <CourseCard key={i} loading={true} />)}
              </div>
            ) : data?.data?.length > 0 ? (
              <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {data.data.map(course => (
                  <CourseCard key={course._id} course={course} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-3xl border-2 border-dashed border-slate-100 dark:border-slate-800">
                <div className="w-20 h-20 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-400">
                  <BookOpen className="w-10 h-10" />
                </div>
                <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">{t('courses.noCourses')}</h3>
                <p className="text-slate-500 dark:text-slate-400">{t('courses.noCoursesSubtitle')}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

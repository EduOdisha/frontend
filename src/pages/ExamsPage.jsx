import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Helmet } from 'react-helmet-async';
import { Search, ChevronRight, Award } from 'lucide-react';
import api from '../utils/api.js';
import ExamCard from '../components/exam/ExamCard.jsx';
import { useLanguage } from '../context/LanguageContext';

const types = ['National', 'State', 'University'];
const levels = ['UG', 'PG', 'Diploma', '12th', '10th', 'Any'];

export default function ExamsPage() {
  const { t } = useLanguage();
  const [filters, setFilters] = useState({
    type: [],
    level: [],
    search: '',
  });

  const { data, isLoading } = useQuery({
    queryKey: ['exams', filters],
    queryFn: () => {
      const params = new URLSearchParams();
      if (filters.search) params.append('search', filters.search);
      if (filters.type.length) params.append('type', filters.type.join(','));
      if (filters.level.length) params.append('level', filters.level.join(','));
      
      return api.get(`/exams?${params.toString()}`).then(r => r.data);
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
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
              <h3 className="font-bold text-slate-800 mb-6">{t('exams.filters')}</h3>
              
              <div className="space-y-6">
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">{t('exams.examType')}</h4>
                  <div className="space-y-2">
                    {types.map(type => (
                      <label key={type} className="flex items-center gap-3 cursor-pointer group">
                        <input 
                          type="checkbox" 
                          checked={filters.type.includes(type)}
                          onChange={() => handleFilterChange('type', type)}
                          className="w-4 h-4 rounded border-slate-300 text-primary-600 focus:ring-primary-500"
                        />
                        <span className="text-sm text-slate-600 group-hover:text-slate-900 transition-colors">{type}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">{t('exams.level')}</h4>
                  <div className="space-y-2">
                    {levels.map(level => (
                      <label key={level} className="flex items-center gap-3 cursor-pointer group">
                        <input 
                          type="checkbox" 
                          checked={filters.level.includes(level)}
                          onChange={() => handleFilterChange('level', level)}
                          className="w-4 h-4 rounded border-slate-300 text-primary-600 focus:ring-primary-500"
                        />
                        <span className="text-sm text-slate-600 group-hover:text-slate-900 transition-colors">{level}</span>
                      </label>
                    ))}
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
                  onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                />
              </div>
            </div>

            {isLoading ? (
              <div className="grid sm:grid-cols-2 gap-6">
                {Array(4).fill(0).map((_, i) => <ExamCard key={i} loading={true} />)}
              </div>
            ) : data?.data?.length > 0 ? (
              <div className="grid sm:grid-cols-2 gap-6">
                {data.data.map(exam => (
                  <ExamCard key={exam._id} exam={exam} />
                ))}
              </div>
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

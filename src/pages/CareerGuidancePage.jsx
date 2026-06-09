import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { GraduationCap, BookOpen, Target, Award, ArrowRight, Briefcase, Microscope, Building2, PenTool } from 'lucide-react';
import api from '../utils/api';
import { useLanguage } from '../context/LanguageContext';

export default function CareerGuidancePage() {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState('after10');

  const { data: careerData, isLoading: loading } = useQuery({
    queryKey: ['careers'],
    queryFn: async () => {
      const { data } = await api.get('/careers');
      return data.data;
    }
  });

  const getIcon = (title) => {
    const t = title.toLowerCase();
    if (t.includes('science') || t.includes('engineering') || t.includes('medical')) return <Microscope className="w-6 h-6" />;
    if (t.includes('commerce') || t.includes('management')) return <Building2 className="w-6 h-6" />;
    if (t.includes('arts')) return <PenTool className="w-6 h-6" />;
    return <GraduationCap className="w-6 h-6" />;
  };

  if (loading) {
    return (
      <div className="pt-32 pb-16 container mx-auto px-4">
        <div className="animate-pulse">
          <div className="h-10 bg-slate-200 dark:bg-slate-800 rounded w-1/3 mx-auto mb-12" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-64 bg-slate-200 dark:bg-slate-800 rounded-3xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-20 pb-16 min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Hero Section */}
      <section className="bg-primary-900 text-white py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full translate-x-1/2 -translate-y-1/2 blur-3xl" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary-400 rounded-full -translate-x-1/2 translate-y-1/2 blur-3xl" />
        </div>
        
        <div className="container mx-auto px-4 relative z-10 text-center">
          <GraduationCap className="w-16 h-16 text-primary-400 mx-auto mb-6" />
          <h1 className="text-4xl md:text-6xl font-display font-bold text-white mb-6">{t('career.pageTitle')}</h1>
          <p className="text-primary-100 max-w-2xl mx-auto text-xl leading-relaxed">
            {t('career.subtitle')}
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 -mt-10">
        {/* Tab Switcher */}
        <div className="max-w-md mx-auto bg-white dark:bg-slate-900 p-2 rounded-2xl shadow-xl flex mb-16 relative z-20">
          <button
            onClick={() => setActiveTab('after10')}
            className={`flex-1 py-4 px-6 rounded-xl font-bold transition-all ${
              activeTab === 'after10' 
                ? 'bg-primary-600 text-white shadow-lg shadow-primary-600/20' 
                : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            {t('career.after10')}
          </button>
          <button
            onClick={() => setActiveTab('after12')}
            className={`flex-1 py-4 px-6 rounded-xl font-bold transition-all ${
              activeTab === 'after12' 
                ? 'bg-primary-600 text-white shadow-lg shadow-primary-600/20' 
                : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            {t('career.after12')}
          </button>
        </div>

        {/* Career Paths Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {careerData && Object.entries(careerData[activeTab]).map(([key, value]) => (
            <div key={key} className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-100 dark:border-slate-800 hover:shadow-2xl hover:shadow-primary-900/5 transition-all group">
              <div className="w-14 h-14 bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                {getIcon(value.title)}
              </div>
              
              <h3 className="text-2xl font-display font-bold text-slate-900 dark:text-white mb-4">
                {value.title}
              </h3>

              <div className="space-y-6">
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                    <Target className="w-3 h-3 text-primary-500" />
                    {t('career.keyCareerPaths')}
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {value.paths.map(path => (
                      <span key={path} className="px-3 py-1 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg text-sm font-medium border border-slate-100 dark:border-slate-700">
                        {path}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                    <BookOpen className="w-3 h-3 text-primary-500" />
                    {t('career.recommendedCourses')}
                  </h4>
                  <ul className="grid grid-cols-1 gap-2">
                    {value.courses.map(course => (
                      <li key={course} className="text-slate-600 dark:text-slate-400 text-sm flex items-start gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary-400 mt-1.5" />
                        {course}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                    <Award className="w-3 h-3 text-primary-500" />
                    {t('career.topExams')}
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {value.exams.map(exam => (
                      <span key={exam} className="px-3 py-1 bg-primary-50 dark:bg-primary-900/10 text-primary-700 dark:text-primary-400 rounded-lg text-xs font-bold border border-primary-100 dark:border-primary-900/30">
                        {exam}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-6 border-t border-slate-100 dark:border-slate-800">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                    <Briefcase className="w-3 h-3 text-primary-500" />
                    {t('career.salaryOutlook')}
                  </h4>
                  <p className="text-slate-800 dark:text-slate-200 font-bold text-sm">
                    {value.salary}
                  </p>
                </div>
              </div>

              <button className="w-full mt-8 py-4 bg-slate-50 dark:bg-slate-800 hover:bg-primary-600 hover:text-white text-primary-600 font-bold rounded-2xl transition-all flex items-center justify-center gap-2 group/btn">
                {t('career.downloadGuide')} <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
              </button>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="mt-20 p-8 md:p-12 bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="max-w-lg">
            <h3 className="text-3xl font-display font-bold text-slate-900 dark:text-white mb-4">{t('career.ctaTitle')}</h3>
            <p className="text-slate-600 dark:text-slate-400">
              {t('career.ctaSubtitle')}
            </p>
          </div>
          <button className="btn-primary py-4 px-10 rounded-2xl text-lg shadow-xl shadow-primary-600/20 whitespace-nowrap">
            {t('career.ctaBtn')}
          </button>
        </div>
      </div>
    </div>
  );
}
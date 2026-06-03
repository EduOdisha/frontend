import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Helmet } from 'react-helmet-async';
import { Search, ChevronRight, GraduationCap } from 'lucide-react';
import api from '../utils/api.js';
import ScholarshipCard from '../components/scholarship/ScholarshipCard.jsx';

const categories = ['Merit', 'SC/ST', 'OBC', 'Minority', 'Disability', 'Girls', 'Post Matric', 'Pre Matric', 'Other'];
const types = ['Government', 'Private', 'NGO', 'University', 'International'];
const levels = ['10th', '12th', 'UG', 'PG', 'Diploma', 'PhD', 'Any'];

export default function ScholarshipsPage() {
  const [filters, setFilters] = useState({
    category: [],
    type: [],
    level: [],
    search: '',
  });

  const { data, isLoading } = useQuery({
    queryKey: ['scholarships', filters],
    queryFn: () => {
      const params = new URLSearchParams();
      if (filters.search) params.append('search', filters.search);
      if (filters.category.length) params.append('category', filters.category.join(','));
      if (filters.type.length) params.append('type', filters.type.join(','));
      if (filters.level.length) params.append('level', filters.level.join(','));
      
      return api.get(`/scholarships?${params.toString()}`).then(r => r.data);
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
    <div className="bg-slate-50 dark:bg-slate-950 min-h-screen py-10">
      <Helmet>
        <title>Scholarships for Odisha Students 2024 - Apply Online | EduOdisha</title>
      </Helmet>

      <div className="container-xl">
        <div className="flex items-center gap-2 text-xs font-medium text-slate-400 mb-8">
          <span>Home</span>
          <ChevronRight className="w-3 h-3" />
          <span className="text-primary-600">Scholarships</span>
        </div>

        <div className="mb-10">
          <h1 className="text-3xl md:text-4xl font-display font-bold text-slate-900 dark:text-white mb-4">
            Scholarships & Grants
          </h1>
          <p className="text-slate-500 dark:text-slate-400 max-w-3xl">
            Find and apply for the latest government and private scholarships. Filter by category, level, and eligibility to find the best funding for your education.
          </p>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar Filters */}
          <aside className="space-y-8">
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-800">
              <h3 className="font-bold text-slate-800 dark:text-white mb-6">Filters</h3>
              
              <div className="space-y-6">
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Category</h4>
                  <div className="space-y-2">
                    {categories.map(cat => (
                      <label key={cat} className="flex items-center gap-3 cursor-pointer group">
                        <input 
                          type="checkbox" 
                          checked={filters.category.includes(cat)}
                          onChange={() => handleFilterChange('category', cat)}
                          className="w-4 h-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                        />
                        <span className="text-sm text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">{cat}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Type</h4>
                  <div className="space-y-2">
                    {types.map(type => (
                      <label key={type} className="flex items-center gap-3 cursor-pointer group">
                        <input 
                          type="checkbox" 
                          checked={filters.type.includes(type)}
                          onChange={() => handleFilterChange('type', type)}
                          className="w-4 h-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                        />
                        <span className="text-sm text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">{type}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Level</h4>
                  <div className="space-y-2">
                    {levels.map(level => (
                      <label key={level} className="flex items-center gap-3 cursor-pointer group">
                        <input 
                          type="checkbox" 
                          checked={filters.level.includes(level)}
                          onChange={() => handleFilterChange('level', level)}
                          className="w-4 h-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                        />
                        <span className="text-sm text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">{level}</span>
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
                  placeholder="Search scholarships..."
                  className="w-full pl-10 pr-4 py-2 text-sm rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-emerald-100 outline-none transition-all"
                  value={filters.search}
                  onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                />
              </div>
            </div>

            {isLoading ? (
              <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {Array(6).fill(0).map((_, i) => <ScholarshipCard key={i} loading={true} />)}
              </div>
            ) : data?.data?.length > 0 ? (
              <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {data.data.map(scholarship => (
                  <ScholarshipCard key={scholarship._id} scholarship={scholarship} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-3xl border-2 border-dashed border-slate-100 dark:border-slate-800">
                <div className="w-20 h-20 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-400">
                  <GraduationCap className="w-10 h-10" />
                </div>
                <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">No scholarships found</h3>
                <p className="text-slate-500 dark:text-slate-400">Try adjusting your filters or search terms.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Helmet } from 'react-helmet-async';
import { SlidersHorizontal, Search, ChevronRight, Grid, List as ListIcon } from 'lucide-react';
import api from '../utils/api.js';
import CollegeCard from '../components/college/CollegeCard.jsx';
import FilterSidebar from '../components/college/FilterSidebar.jsx';

export default function CollegesPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [view, setView] = useState('grid');
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Get initial filters from URL
  const [filters, setFilters] = useState({
    city: searchParams.get('city') ? [searchParams.get('city')] : [],
    type: searchParams.get('type') ? [searchParams.get('type')] : [],
    category: searchParams.get('category') ? [searchParams.get('category')] : [],
    minFees: searchParams.get('minFees') || '',
    maxFees: searchParams.get('maxFees') || '',
    search: searchParams.get('search') || '',
  });

  const { data, isLoading } = useQuery({
    queryKey: ['colleges', filters],
    queryFn: () => {
      const params = new URLSearchParams();
      if (filters.search) params.append('search', filters.search);
      if (filters.city.length) params.append('city', filters.city.join(','));
      if (filters.type.length) params.append('type', filters.type.join(','));
      if (filters.category.length) params.append('category', filters.category.join(','));
      if (filters.minFees) params.append('minFees', filters.minFees);
      if (filters.maxFees) params.append('maxFees', filters.maxFees);
      
      return api.get(`/colleges?${params.toString()}`).then(r => r.data);
    },
  });

  return (
    <div className="bg-slate-50 dark:bg-slate-950 min-h-screen py-10">
      <Helmet>
        <title>Best Colleges in Odisha 2024 - Rankings, Fees & Admissions | EduOdisha</title>
      </Helmet>

      <div className="container-xl">
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-xs font-medium text-slate-400 mb-8">
          <span>Home</span>
          <ChevronRight className="w-3 h-3" />
          <span className="text-primary-600 font-bold">Colleges in Odisha</span>
        </div>

        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl md:text-4xl font-display font-bold text-slate-900 dark:text-white mb-4">
            Found <span className="text-secondary-500">{data?.total || 0}</span> Colleges in Odisha
          </h1>
          <p className="text-slate-500 dark:text-slate-400 max-w-3xl leading-relaxed">
            Explore top-rated government and private colleges in Odisha. Filter by city, fees, stream, and more to find your perfect fit.
          </p>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Desktop Sidebar */}
          <aside className="hidden lg:block">
            <FilterSidebar filters={filters} setFilters={setFilters} />
          </aside>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Toolbar */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 mb-8 shadow-sm border border-slate-200/60 dark:border-slate-800 flex flex-wrap items-center justify-between gap-6">
              <div className="relative flex-1 min-w-[280px]">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
                <input 
                  type="text"
                  placeholder="Search by college name, city or course..."
                  className="w-full pl-12 pr-4 py-3 text-sm rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 focus:bg-white dark:focus:bg-slate-800 focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 outline-none transition-all"
                  value={filters.search}
                  onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                />
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center bg-slate-100 dark:bg-slate-800/80 p-1 rounded-xl">
                  <button 
                    onClick={() => setView('grid')}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${view === 'grid' ? 'bg-white dark:bg-slate-700 shadow-sm text-primary-600' : 'text-slate-500 hover:text-slate-700'}`}
                  >
                    <Grid className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Grid</span>
                  </button>
                  <button 
                    onClick={() => setView('list')}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${view === 'list' ? 'bg-white dark:bg-slate-700 shadow-sm text-primary-600' : 'text-slate-500 hover:text-slate-700'}`}
                  >
                    <ListIcon className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">List</span>
                  </button>
                </div>

                <div className="h-8 w-[1px] bg-slate-200 dark:bg-slate-800 mx-1 hidden sm:block"></div>

                <button 
                  onClick={() => setShowMobileFilters(true)}
                  className="lg:hidden flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary-600 text-white text-sm font-bold hover:bg-primary-700 transition-all shadow-lg shadow-primary-600/20"
                >
                  <SlidersHorizontal className="w-4 h-4" /> 
                  <span>Filters</span>
                </button>
              </div>
            </div>

            {/* College List */}
            {isLoading ? (
              <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {Array(6).fill(0).map((_, i) => <CollegeCard key={i} loading={true} />)}
              </div>
            ) : data?.data?.length > 0 ? (
              <div className={view === 'grid' ? "grid sm:grid-cols-2 xl:grid-cols-3 gap-6" : "space-y-6"}>
                {data.data.map(college => (
                  <CollegeCard key={college._id} college={college} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-3xl border-2 border-dashed border-slate-100 dark:border-slate-800 shadow-sm">
                <div className="w-20 h-20 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-400">
                  <Search className="w-10 h-10" />
                </div>
                <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">No colleges found</h3>
                <p className="text-slate-500 dark:text-slate-400">Try adjusting your filters or search terms.</p>
                <button 
                  onClick={() => setFilters({ city: [], type: [], category: [], minFees: '', maxFees: '', search: '' })}
                  className="mt-6 text-secondary-600 font-bold hover:text-secondary-700 transition-colors"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filter Modal */}
      {showMobileFilters && (
        <div className="fixed inset-0 z-[60] lg:hidden">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowMobileFilters(false)} />
          <div className="absolute right-0 top-0 bottom-0 w-[280px] bg-white dark:bg-slate-900 animate-in slide-in-from-right duration-300 overflow-y-auto">
            <FilterSidebar filters={filters} setFilters={setFilters} onClose={() => setShowMobileFilters(false)} />
          </div>
        </div>
      )}
    </div>
  );
}

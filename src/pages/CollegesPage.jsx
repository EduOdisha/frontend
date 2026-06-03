import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Helmet } from 'react-helmet-async';
import { SlidersHorizontal, Search, ChevronRight, Grid, List as ListIcon, X, ArrowUpDown } from 'lucide-react';
import api from '../utils/api.js';
import CollegeCard from '../components/college/CollegeCard.jsx';
import FilterSidebar from '../components/college/FilterSidebar.jsx';
import { formatLPA } from '../utils/format';
import { useLanguage } from '../context/LanguageContext';



export default function CollegesPage() {
  const [searchParams] = useSearchParams();
  const [view, setView] = useState('grid');
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [sort, setSort] = useState('');
  const { t } = useLanguage();

  const SORT_OPTIONS = [
    { value: '', label: t('colleges.sortOptions.relevance') },
    { value: 'rating', label: t('colleges.sortOptions.highestRated') },
    { value: 'fees_asc', label: t('colleges.sortOptions.feesLowHigh') },
    { value: 'fees_desc', label: t('colleges.sortOptions.feesHighLow') },
    { value: 'nirf', label: t('colleges.sortOptions.nirfRank') },
  ];

  const [filters, setFilters] = useState({
    city: searchParams.get('city') ? [searchParams.get('city')] : [],
    type: searchParams.get('type') ? [searchParams.get('type')] : [],
    category: searchParams.get('category') ? [searchParams.get('category')] : [],
    minFees: '',
    maxFees: '',
    search: searchParams.get('search') || '',
  });

  const { data, isLoading } = useQuery({
    queryKey: ['colleges', filters, sort],
    queryFn: () => {
      const params = new URLSearchParams();
      if (filters.search) params.append('search', filters.search);
      if (filters.city.length) params.append('city', filters.city.join(','));
      if (filters.type.length) params.append('type', filters.type.join(','));
      if (filters.category.length) params.append('category', filters.category.join(','));
      if (filters.minFees) params.append('minFees', filters.minFees);
      if (filters.maxFees) params.append('maxFees', filters.maxFees);
      if (sort) params.append('sort', sort);
      return api.get(`/colleges?${params.toString()}`).then(r => r.data);
    },
  });

  const total = data?.total || 0;
  const colleges = data?.data || [];
  const activeFilterCount = [...filters.city, ...filters.type, ...filters.category, filters.minFees, filters.maxFees].filter(Boolean).length;

  return (
    <div className="bg-slate-50 min-h-screen">
      <Helmet>
        <title>Best Colleges in Odisha 2025 — Rankings, Fees & Admissions | EduOdisha</title>
        <meta name="description" content="Compare 500+ verified colleges in Odisha by fees, placements, stream, and city. Find the best engineering, medical, management college with free counselling." />
      </Helmet>

      {/* ─── Page Header ─────────────────────────────── */}
      <div className="bg-white border-b border-slate-200">
        <div className="container-xl py-6">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-1.5 text-xs font-medium text-slate-400 mb-4">
            <Link to="/" className="hover:text-primary-600 transition-colors">{t('common.home')}</Link>
            <ChevronRight size={12} />
            <span className="text-slate-600 font-semibold">{t('colleges.breadcrumb')}</span>
          </nav>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-display font-bold text-slate-900 mb-1">
                {isLoading ? t('colleges.searching') : t('colleges.collegesFound').replace('{count}', total.toLocaleString())}
              </h1>
              <p className="text-sm text-slate-500">
                {t('colleges.subtitle')}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container-xl py-8">
        <div className="flex gap-7">
          {/* ─── Desktop Sidebar ─── */}
          <aside className="hidden lg:block w-64 shrink-0">
            <div className="sticky top-24">
              <FilterSidebar filters={filters} setFilters={setFilters} />
            </div>
          </aside>

          {/* ─── Main Content ─── */}
          <div className="flex-1 min-w-0">
            {/* Toolbar */}
            <div className="bg-white border border-slate-200 rounded-xl p-3 mb-6 flex flex-wrap items-center gap-3">
              {/* Search Input */}
              <div className="relative flex-1 min-w-[200px]">
                <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search college name or city…"
                  value={filters.search}
                  onChange={e => setFilters(p => ({ ...p, search: e.target.value }))}
                  className="w-full pl-9 pr-4 py-2.5 text-sm rounded-lg border border-slate-200 focus:border-primary-400 focus:ring-2 focus:ring-primary-500/10 bg-white outline-none transition-all"
                />
                {filters.search && (
                  <button onClick={() => setFilters(p => ({ ...p, search: '' }))} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                    <X size={14} />
                  </button>
                )}
              </div>

              {/* Sort */}
              <div className="relative">
                <select
                  value={sort}
                  onChange={e => setSort(e.target.value)}
                  className="appearance-none pl-8 pr-8 py-2.5 text-sm font-medium text-slate-600 border border-slate-200 rounded-lg bg-white focus:border-primary-400 outline-none cursor-pointer"
                >
                  {SORT_OPTIONS.map(o => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
                <ArrowUpDown size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              </div>

              {/* View Toggle */}
              <div className="flex items-center bg-slate-100 p-1 rounded-lg gap-0.5">
                <button
                  onClick={() => setView('grid')}
                  className={`p-1.5 rounded-md transition-all ${view === 'grid' ? 'bg-white shadow-sm text-primary-600' : 'text-slate-400 hover:text-slate-600'}`}
                  aria-label="Grid view"
                >
                  <Grid size={15} />
                </button>
                <button
                  onClick={() => setView('list')}
                  className={`p-1.5 rounded-md transition-all ${view === 'list' ? 'bg-white shadow-sm text-primary-600' : 'text-slate-400 hover:text-slate-600'}`}
                  aria-label="List view"
                >
                  <ListIcon size={15} />
                </button>
              </div>

              {/* Mobile Filter Button */}
              <button
                onClick={() => setShowMobileFilters(true)}
                className="lg:hidden flex items-center gap-2 btn-secondary py-2 text-sm relative"
              >
                <SlidersHorizontal size={15} />
                {t('colleges.mobileFilters')}
                {activeFilterCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-primary-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    {activeFilterCount}
                  </span>
                )}
              </button>
            </div>

            {/* Results Summary */}
            {!isLoading && (
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm text-slate-500 font-medium">
                  Showing <span className="font-bold text-slate-800">{colleges.length}</span> of <span className="font-bold text-slate-800">{total}</span> colleges
                </p>
              </div>
            )}

            {/* College Grid / List */}
            {isLoading ? (
              <div className={view === 'grid' ? 'grid sm:grid-cols-2 xl:grid-cols-3 gap-5' : 'space-y-4'}>
                {Array(6).fill(0).map((_, i) => <CollegeCard key={i} loading />)}
              </div>
            ) : colleges.length > 0 ? (
              <div className={view === 'grid' ? 'grid sm:grid-cols-2 xl:grid-cols-3 gap-5' : 'space-y-4'}>
                {colleges.map(college => (
                  view === 'list'
                    ? <CollegeListRow key={college._id} college={college} />
                    : <CollegeCard key={college._id} college={college} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-white border border-slate-200 rounded-xl">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search size={24} className="text-slate-300" />
                </div>
                <h3 className="text-lg font-bold text-slate-800 mb-2">{t('colleges.noColleges')}</h3>
                <p className="text-sm text-slate-500 mb-5">{t('colleges.noCollegesSubtitle')}</p>
                <button
                  onClick={() => setFilters({ city: [], type: [], category: [], minFees: '', maxFees: '', search: '' })}
                  className="btn-primary py-2 px-5"
                >
                  {t('colleges.clearFilters')}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ─── Mobile Filter Drawer ─── */}
      {showMobileFilters && (
        <div className="fixed inset-0 z-[60] lg:hidden">
          <div className="absolute inset-0 bg-slate-900/40" onClick={() => setShowMobileFilters(false)} />
          <div className="absolute right-0 top-0 bottom-0 w-80 bg-white shadow-2xl overflow-y-auto">
            <FilterSidebar filters={filters} setFilters={setFilters} onClose={() => setShowMobileFilters(false)} />
          </div>
        </div>
      )}
    </div>
  );
}

// ─── List View Row ────────────────────────────────────────
function CollegeListRow({ college }) {
  return (
    <div className="bg-white border border-slate-200 hover:border-slate-300 hover:shadow-md rounded-xl p-4 flex gap-4 transition-all duration-200 group">
      <div className="w-20 h-20 rounded-lg bg-slate-100 overflow-hidden shrink-0">
        <img
          src={college.banner?.url || 'https://images.unsplash.com/photo-1562774053-701939374585?w=200&q=80'}
          alt={college.name}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2 mb-1">
          <Link to={`/colleges/${college.slug}`}>
            <h3 className="text-sm font-bold text-slate-900 group-hover:text-primary-600 transition-colors line-clamp-1">
              {college.name}
            </h3>
          </Link>
          <span className="badge badge-blue shrink-0">{college.type}</span>
        </div>
        <p className="text-xs text-slate-500 mb-2">{college.location?.city}, Odisha · {college.affiliation}</p>
        <div className="flex flex-wrap items-center gap-4 text-xs">
          <span className="text-slate-600 font-medium">
            Fees: <strong className="text-slate-800">₹{college.fees?.min?.toLocaleString() || 'N/A'}</strong>
          </span>
          <span className="text-emerald-600 font-medium">
            Pkg: <strong>{formatLPA(college.placements?.highestPackage)}</strong>
          </span>
          {college.nirfRanking && (
            <span className="text-slate-600 font-medium">NIRF: <strong>#{college.nirfRanking}</strong></span>
          )}
        </div>
      </div>
      <div className="flex items-center">
        <Link to={`/colleges/${college.slug}`} className="btn-primary py-2 px-4 text-xs whitespace-nowrap">
          Details
        </Link>
      </div>
    </div>
  );
}

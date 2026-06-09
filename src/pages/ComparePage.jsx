import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { X, Star, MapPin, Building, GraduationCap, IndianRupee, Briefcase, Award } from 'lucide-react';
import { removeFromCompare } from '../store/slices/compareSlice';
import { formatLPA } from '../utils/format';
import { useLanguage } from '../context/LanguageContext';

export default function ComparePage() {
  const { colleges } = useSelector((state) => state.compare);
  const dispatch = useDispatch();
  const { t } = useLanguage();

  const parameters = [
    { label: t('compare.params.rating'),          key: 'rating',        icon: Star,         getValue: (c) => `${c.rating?.average || '4.0'} / 5` },
    { label: t('compare.params.location'),        key: 'location',      icon: MapPin,       getValue: (c) => `${c.location?.city}, Odisha` },
    { label: t('compare.params.affiliation'),     key: 'affiliation',   icon: Award,        getValue: (c) => c.affiliation },
    { label: t('compare.params.fees'),            key: 'fees',          icon: IndianRupee,  getValue: (c) => `₹${c.fees?.min?.toLocaleString()} - ₹${c.fees?.max?.toLocaleString()}` },
    { label: t('compare.params.highestPackage'),  key: 'placements',    icon: Briefcase,    getValue: (c) => formatLPA(c.placements?.highestPackage) },
    { label: t('compare.params.avgPackage'),      key: 'placements_avg',icon: Briefcase,    getValue: (c) => formatLPA(c.placements?.averagePackage) },
    { label: t('compare.params.naac'),            key: 'naac',          icon: GraduationCap,getValue: (c) => c.naacGrade || 'A+' },
    { label: t('compare.params.hostel'),          key: 'hostel',        icon: Building,     getValue: (c) => c.facilities?.hostel ? 'Yes' : 'No' },
    { label: t('compare.params.facilities'),      key: 'facilities',    icon: Building,     getValue: (c) => {
      const active = Object.entries(c.facilities || {})
        .filter(([, v]) => v === true)
        .map(([k]) => k);
      return active.slice(0, 3).join(', ') + (active.length > 3 ? '...' : '');
    }},
  ];

  if (colleges.length === 0) {
    return (
      <div className="min-h-screen pt-32 pb-12 flex items-center justify-center">
        <div className="text-center max-w-md px-6">
          <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-400">
            <Building className="w-10 h-10" />
          </div>
          <h2 className="text-3xl font-display font-bold text-slate-900 dark:text-white mb-4">{t('compare.emptyTitle')}</h2>
          <p className="text-slate-500 mb-8">{t('compare.emptySubtitle')}</p>
          <Link to="/colleges" className="btn-primary inline-flex">
            {t('compare.browseColleges')}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-12 bg-slate-50 dark:bg-slate-950">
      <div className="container-xl">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl lg:text-4xl font-display font-bold text-slate-900 dark:text-white mb-2">
              {t('compare.pageTitle')}
            </h1>
            <p className="text-slate-500">{t('compare.subtitle')}</p>
          </div>
          <p className="text-sm font-bold text-primary-600 bg-primary-50 dark:bg-primary-900/20 px-4 py-2 rounded-full">
            {t('compare.collegesSelected').replace('{count}', colleges.length)}
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="p-8 w-64 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800 text-left align-top">
                    <p className="text-xs font-black text-slate-400 uppercase tracking-widest mt-4">{t('compare.parameters')}</p>
                  </th>
                  {colleges.map((college) => (
                    <th key={college._id} className="p-8 min-w-[280px] border-b border-l border-slate-100 dark:border-slate-800 relative group">
                      <button 
                        onClick={() => dispatch(removeFromCompare(college._id))}
                        className="absolute top-4 right-4 p-2 bg-slate-100 dark:bg-slate-800 rounded-full text-slate-400 hover:bg-rose-500 hover:text-white transition-all opacity-0 group-hover:opacity-100"
                      >
                        <X className="w-4 h-4" />
                      </button>
                      
                      <div className="flex flex-col items-center text-center">
                        <div className="w-20 h-20 bg-white rounded-2xl shadow-md p-2 border border-slate-100 dark:border-slate-700 mb-4 flex items-center justify-center">
                          <img src={college.logo?.url} alt={college.name} className="w-full h-full object-contain" />
                        </div>
                        <h3 className="font-display font-bold text-slate-900 dark:text-white line-clamp-2 mb-2">
                          {college.name}
                        </h3>
                        <Link to={`/colleges/${college.slug}`} className="text-xs font-bold text-primary-600 hover:underline">
                          View Details
                        </Link>
                        <Link to={`/colleges/${college.slug}/apply`} className="btn-primary w-full py-2 mt-4 text-[10px]">
                          Apply Now
                        </Link>
                      </div>
                    </th>
                  ))}
                  {Array.from({ length: Math.max(0, 4 - colleges.length) }).map((_, i) => (
                    <th key={`empty-${i}`} className="p-8 min-w-[280px] border-b border-l border-slate-100 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-900/30">
                      <Link to="/colleges" className="flex flex-col items-center justify-center h-full text-slate-300 hover:text-primary-400 transition-colors">
                        <div className="w-20 h-20 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800 flex items-center justify-center mb-4">
                          <span className="text-3xl">+</span>
                        </div>
                        <p className="text-sm font-bold">Add College</p>
                      </Link>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {parameters.map((param) => {
                  const Icon = param.icon;
                  return (
                    <tr key={param.key} className="group hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                      <td className="p-6 bg-slate-50/50 dark:bg-slate-800/20 border-b border-slate-100 dark:border-slate-800">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-white dark:bg-slate-800 shadow-sm flex items-center justify-center text-slate-400 group-hover:text-primary-600 transition-colors">
                            <Icon className="w-4 h-4" />
                          </div>
                          <span className="text-sm font-bold text-slate-700 dark:text-slate-300">{param.label}</span>
                        </div>
                      </td>
                      {colleges.map((college) => (
                        <td key={college._id} className="p-6 border-b border-l border-slate-100 dark:border-slate-800 text-center">
                          <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
                            {param.getValue(college)}
                          </span>
                        </td>
                      ))}
                      {Array.from({ length: Math.max(0, 4 - colleges.length) }).map((_, i) => (
                        <td key={`empty-cell-${i}`} className="p-6 border-b border-l border-slate-100 dark:border-slate-800 bg-slate-50/10 dark:bg-slate-900/10"></td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

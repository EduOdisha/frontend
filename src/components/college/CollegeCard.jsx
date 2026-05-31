import { Link } from 'react-router-dom';
import { MapPin, Star, ArrowRight, Building2, CheckCircle } from 'lucide-react';

export default function CollegeCard({ college, loading }) {
  if (loading) {
    return (
      <div className="card animate-pulse border-slate-100">
        <div className="bg-slate-200 h-44 w-full" />
        <div className="p-4 space-y-3">
          <div className="h-4 bg-slate-200 rounded w-3/4" />
          <div className="h-3 bg-slate-200 rounded w-1/2" />
        </div>
      </div>
    );
  }

  return (
    <div className="card group border-slate-200/60 hover:border-primary-200 transition-all duration-300">
      <div className="relative h-44 overflow-hidden">
        <img
          src={college.banner?.url || 'https://images.unsplash.com/photo-1541339907198-e08759dfc3ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'}
          alt={college.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent" />
        <div className="absolute bottom-3 left-3 flex items-center gap-1 bg-white/95 backdrop-blur-sm px-2 py-1 rounded-md shadow-sm border border-slate-100">
          <Star className="w-3 h-3 text-secondary-500 fill-secondary-500" />
          <span className="text-[11px] font-bold text-slate-800">{college.rating?.average || '4.2'}</span>
        </div>
        {college.isFeatured && (
          <div className="absolute top-3 left-3 bg-secondary-500 text-white text-[10px] font-bold px-2 py-1 rounded shadow-sm">
            Top Rated
          </div>
        )}
        <div className="absolute -bottom-1 right-3 w-12 h-12 bg-white rounded-lg shadow-md border border-slate-100 p-1 flex items-center justify-center overflow-hidden">
          <img src={college.logo?.url || '/placeholder-logo.png'} alt="Logo" className="w-full h-full object-contain" />
        </div>
      </div>

      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] font-bold text-primary-600 uppercase tracking-wider bg-primary-50 px-2 py-0.5 rounded">
            {college.category}
          </span>
          <div className="flex items-center gap-1 text-slate-400 text-[10px] font-semibold">
            <MapPin size={10} />
            <span>{college.location?.city}</span>
          </div>
        </div>

        <Link to={`/colleges/${college.slug}`}>
          <h3 className="font-display font-bold text-slate-900 text-base mb-3 line-clamp-2 min-h-[3rem] group-hover:text-primary-600 transition-colors leading-tight">
            {college.name}
          </h3>
        </Link>

        <div className="grid grid-cols-2 gap-3 py-3 border-y border-slate-50 mb-4">
          <div>
            <p className="text-[10px] text-slate-400 font-semibold mb-0.5">Avg Fees</p>
            <p className="text-sm font-bold text-slate-800">₹{college.fees?.min?.toLocaleString() || '65K'}</p>
          </div>
          <div className="border-l border-slate-100 pl-3">
            <p className="text-[10px] text-slate-400 font-semibold mb-0.5">Highest Lpa</p>
            <p className="text-sm font-bold text-emerald-600">₹{college.placements?.highestPackage || '12'} LPA</p>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
             <div className="flex items-center gap-1 text-[10px] font-semibold text-slate-500">
                <Building2 size={12} className="text-slate-400" />
                <span>{college.type}</span>
             </div>
             {college.isVerified && (
               <div className="flex items-center gap-0.5 text-[10px] font-bold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded">
                 <CheckCircle size={10} /> Verified
               </div>
             )}
          </div>
          <Link
            to={`/colleges/${college.slug}`}
            className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-primary-600 hover:text-white transition-all duration-300 shadow-sm"
          >
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
}

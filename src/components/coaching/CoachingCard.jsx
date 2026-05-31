import { Link } from 'react-router-dom';
import { MapPin, Star, Users, ArrowRight } from 'lucide-react';

export default function CoachingCard({ coaching, loading }) {
  if (loading) {
    return (
      <div className="card animate-pulse">
        <div className="bg-slate-200 dark:bg-slate-800 h-40 rounded-t-2xl" />
        <div className="p-5 space-y-3">
          <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-3/4" />
          <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-1/2" />
          <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="card group hover:shadow-card-hover transition-all duration-300">
      <div className="relative overflow-hidden h-40 rounded-t-2xl">
        <img 
          src={coaching.logo?.url || 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'} 
          alt={coaching.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute top-3 right-3 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm px-2 py-1 rounded-lg flex items-center gap-1 shadow-sm">
          <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
          <span className="text-xs font-bold text-slate-800 dark:text-white">{coaching.rating?.average || '4.5'}</span>
        </div>
      </div>

      <div className="p-5">
        <div className="flex items-center gap-1 text-slate-400 text-[10px] font-bold uppercase mb-2">
          <MapPin className="w-3 h-3" />
          <span>{coaching.location?.city}, Odisha</span>
        </div>
        
        <h3 className="font-display font-bold text-slate-800 dark:text-white mb-3 line-clamp-1 group-hover:text-primary-600 transition-colors">
          {coaching.name}
        </h3>

        <div className="flex items-center gap-4 mb-4">
          <div className="flex items-center gap-1.5">
            <Users className="w-4 h-4 text-primary-500" />
            <span className="text-xs text-slate-600 dark:text-slate-400">{coaching.category || 'Competitive Exams'}</span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
          <Link to={`/coaching/${coaching.slug}`} className="text-xs font-bold text-slate-500 hover:text-primary-600 flex items-center gap-1 transition-colors">
            View Details <ArrowRight className="w-3 h-3" />
          </Link>
          <button className="btn-primary py-2 px-4 text-[10px] uppercase tracking-wider">
            Enquire
          </button>
        </div>
      </div>
    </div>
  );
}

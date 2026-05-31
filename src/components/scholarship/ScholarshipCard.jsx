import { Link } from 'react-router-dom';
import { IndianRupee, Calendar, CheckCircle2 } from 'lucide-react';

export default function ScholarshipCard({ scholarship, loading }) {
  if (loading) {
    return (
      <div className="card animate-pulse p-5">
        <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/4 mb-4" />
        <div className="h-5 bg-slate-200 dark:bg-slate-800 rounded w-3/4 mb-3" />
        <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-full" />
      </div>
    );
  }

  const lastDate = scholarship.lastDate ? new Date(scholarship.lastDate).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'short'
  }) : 'Ongoing';

  return (
    <div className="card p-5 hover:border-emerald-200 transition-all group border-t-4 border-t-emerald-500">
      <div className="flex items-center justify-between mb-3">
        <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 px-2 py-0.5 rounded-full uppercase tracking-wider">
          {scholarship.category || 'Government'}
        </span>
        <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400">
          <Calendar className="w-3 h-3" />
          <span>Ends: {lastDate}</span>
        </div>
      </div>

      <h3 className="font-bold text-slate-800 dark:text-white mb-2 line-clamp-1 group-hover:text-emerald-600 transition-colors">
        {scholarship.name}
      </h3>
      
      <p className="text-xs text-slate-500 dark:text-slate-400 mb-5 line-clamp-2">
        Offered by: <span className="font-semibold">{scholarship.provider || 'Odisha Govt'}</span>. Open for {scholarship.level?.join(', ') || 'UG/PG'} students.
      </p>

      <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-3 flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600">
            <IndianRupee className="w-4 h-4" />
          </div>
          <div>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">Amount</p>
            <p className="text-xs font-bold text-emerald-600">{scholarship.amount?.value ? `₹${scholarship.amount.value.toLocaleString()}` : 'Full Funding'}</p>
          </div>
        </div>
        <CheckCircle2 className="w-4 h-4 text-emerald-500 opacity-50" />
      </div>

      <Link to={`/scholarships/${scholarship.slug}`} className="btn-ghost w-full py-2 text-xs font-bold border border-slate-100 dark:border-slate-800 hover:bg-emerald-50 hover:text-emerald-600 hover:border-emerald-100 transition-all">
        View Eligibility
      </Link>
    </div>
  );
}
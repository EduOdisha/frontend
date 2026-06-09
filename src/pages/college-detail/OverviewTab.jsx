import { IndianRupee, TrendingUp, Award, Users, CheckCircle2 } from 'lucide-react';
import StatCard from './StatCard';
import { formatLPA } from '../../utils/format';
import { capitalizeWords } from './utils';

export default function OverviewTab({ college }) {
  return (
    <div className="space-y-5">
      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard icon={IndianRupee} label="Avg. Fees / yr" value={college.fees?.min ? `₹${college.fees.min.toLocaleString()}` : 'N/A'} />
        <StatCard icon={TrendingUp} label="Avg. Package" value={formatLPA(college.placements?.averagePackage)} color="text-emerald-600" bg="bg-emerald-50" />
        <StatCard icon={Award} label="NIRF Rank" value={college.nirfRanking ? `#${college.nirfRanking}` : 'N/A'} color="text-amber-600" bg="bg-amber-50" />
        <StatCard icon={Users} label="Total Seats" value={college.courses?.reduce((s, c) => s + (c.seats || 0), 0) || 'N/A'} color="text-primary-600" bg="bg-primary-50" />
      </div>

      {/* About */}
      <div className="bg-white border border-slate-200 rounded-xl p-6">
        <h2 className="text-xl font-bold text-slate-900 mb-4">About {capitalizeWords(college.name)}</h2>
        <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
          {college.about || 'Detailed information about this college will be updated shortly.'}
        </p>
      </div>

      {/* Highlights */}
      {college.highlights?.length > 0 && (
        <div className="bg-white border border-slate-200 rounded-xl p-6">
          <h3 className="text-lg font-bold text-slate-900 mb-4">Key Highlights</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {college.highlights.map((h, i) => (
              <div key={i} className="flex items-start gap-2.5">
                <CheckCircle2 size={16} className="text-emerald-500 mt-0.5 shrink-0" />
                <span className="text-sm text-slate-700 font-medium">{h}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Approvals */}
      {college.approvals?.length > 0 && (
        <div className="bg-white border border-slate-200 rounded-xl p-6">
          <h3 className="text-base font-bold text-slate-900 mb-3">Approvals & Accreditations</h3>
          <div className="flex flex-wrap gap-2">
            {college.approvals.map(a => (
              <span key={a} className="badge badge-blue text-xs">{a}</span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

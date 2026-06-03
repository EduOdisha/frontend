import { formatLPA } from '../../utils/format';

export default function PlacementsTab({ college }) {
  return (
    <div className="space-y-5">
      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: 'Average Package', value: formatLPA(college.placements?.averagePackage), color: 'text-primary-600', bg: 'bg-primary-50' },
          { label: 'Highest Package', value: formatLPA(college.placements?.highestPackage), color: 'text-amber-600', bg: 'bg-amber-50' },
          { label: 'Placement Rate', value: college.placements?.placementPercentage ? `${college.placements.placementPercentage}%` : 'N/A', color: 'text-emerald-600', bg: 'bg-emerald-50' },
        ].map(s => (
          <div key={s.label} className={`${s.bg} border border-slate-200 rounded-xl p-5`}>
            <p className={`text-xs font-bold uppercase tracking-wide mb-2 ${s.color}`}>{s.label}</p>
            <p className="text-3xl font-extrabold text-slate-900">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Description */}
      {college.placements?.description && (
        <div className="bg-white border border-slate-200 rounded-xl p-6">
          <p className="text-sm text-slate-600 leading-relaxed">{college.placements.description}</p>
        </div>
      )}

      {/* Recruiters */}
      {college.placements?.topRecruiters?.length > 0 && (
        <div className="bg-white border border-slate-200 rounded-xl p-6">
          <h3 className="text-base font-bold text-slate-900 mb-4">Top Recruiters</h3>
          <div className="flex flex-wrap gap-2">
            {college.placements.topRecruiters.map((r, i) => (
              <span key={i} className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium text-slate-700">
                {r}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

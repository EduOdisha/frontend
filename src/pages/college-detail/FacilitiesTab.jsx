const FACILITY_ICONS = {
  hostel: '🏠', library: '📚', sports: '⚽', canteen: '🍽️',
  wifi: '📶', lab: '🔬', transport: '🚌', medicalFacility: '🏥',
  gym: '💪',
};

export default function FacilitiesTab({ college }) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6">
      <h2 className="text-xl font-bold text-slate-900 mb-5">Campus Facilities</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {Object.entries(college.facilities || {}).map(([key, value]) => {
          if (typeof value !== 'boolean') return null;
          const emoji = FACILITY_ICONS[key] || '✅';
          const label = key.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase());
          return (
            <div
              key={key}
              className={`flex items-center gap-3 p-3.5 rounded-xl border transition-all ${
                value
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                  : 'bg-slate-50 border-slate-100 text-slate-400 opacity-60'
              }`}
            >
              <span className="text-lg">{emoji}</span>
              <span className="text-sm font-semibold">{label}</span>
              {!value && <span className="text-xs ml-auto">No</span>}
            </div>
          );
        })}
      </div>
    </div>
  );
}

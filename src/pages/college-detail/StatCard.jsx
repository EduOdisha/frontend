export default function StatCard({ icon: Icon, label, value, color = 'text-primary-600', bg = 'bg-primary-50' }) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 flex items-center gap-4">
      <div className={`w-11 h-11 ${bg} rounded-lg flex items-center justify-center shrink-0`}>
        <Icon size={20} className={color} />
      </div>
      <div>
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-0.5">{label}</p>
        <p className="text-lg font-bold text-slate-900">{value}</p>
      </div>
    </div>
  );
}

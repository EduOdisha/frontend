import { Plus, Trash2 } from 'lucide-react';

export const Label = ({ children, required }) => (
  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
    {children}{required && <span className="text-red-500 ml-1">*</span>}
  </label>
);

export const Input = ({ className = '', ...props }) => (
  <input
    className={`w-full px-3.5 py-2.5 text-sm text-slate-800 bg-slate-50/50 border border-slate-200/80 rounded-xl
      hover:bg-white hover:border-slate-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500
      placeholder:text-slate-300 transition-all ${className}`}
    {...props}
  />
);

export const Textarea = ({ className = '', ...props }) => (
  <textarea
    className={`w-full px-3.5 py-2.5 text-sm text-slate-800 bg-slate-50/50 border border-slate-200/80 rounded-xl
      hover:bg-white hover:border-slate-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500
      placeholder:text-slate-300 transition-all resize-none ${className}`}
    {...props}
  />
);

export const Select = ({ children, className = '', ...props }) => (
  <div className="relative w-full">
    <select
      className={`w-full pl-3.5 pr-10 py-2.5 text-sm text-slate-800 bg-slate-50/50 border border-slate-200/80 rounded-xl
        hover:bg-white hover:border-slate-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500
        transition-all appearance-none cursor-pointer ${className}`}
      {...props}
    >
      {children}
    </select>
    <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
      </svg>
    </div>
  </div>
);

export const Switch = ({ checked, onChange }) => (
  <button
    type="button"
    onClick={onChange}
    className={`w-10 h-6 flex items-center rounded-full p-1 transition-all duration-200 outline-none shrink-0
      ${checked ? 'bg-emerald-500 shadow-sm shadow-emerald-500/20' : 'bg-slate-200'}`}
  >
    <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-all duration-200 ${checked ? 'translate-x-4' : 'translate-x-0'}`} />
  </button>
);

export const SectionCard = ({ icon: Icon, title, subtitle, children, accent = 'primary' }) => {
  const colors = {
    primary: 'bg-primary-50 text-primary-600 border-primary-100/50',
    purple: 'bg-emerald-50 text-emerald-600 border-emerald-100/50',
    emerald: 'bg-emerald-50 text-emerald-600 border-emerald-100/50',
    amber: 'bg-amber-50 text-amber-600 border-amber-100/50',
    blue: 'bg-blue-50 text-blue-600 border-blue-100/50',
    rose: 'bg-rose-50 text-rose-600 border-rose-100/50',
    slate: 'bg-slate-100 text-slate-600 border-slate-200/50',
  };
  return (
    <div className="bg-white border border-slate-200/70 rounded-2xl shadow-xs overflow-hidden hover:shadow-sm transition-all duration-200">
      <div className="flex items-center gap-3 px-5 py-4 bg-slate-50/50 border-b border-slate-100">
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border ${colors[accent] || colors.primary}`}>
          <Icon size={15} />
        </div>
        <div>
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">{title}</h3>
          {subtitle && <p className="text-[10px] text-slate-400 mt-0.5">{subtitle}</p>}
        </div>
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
};

export const AddButton = ({ onClick, label = 'Add' }) => (
  <button
    type="button"
    onClick={onClick}
    className="flex items-center gap-1.5 text-xs font-bold text-primary-600 hover:text-primary-700
      bg-primary-50 hover:bg-primary-100 border border-primary-200 px-3 py-1.5 rounded-lg transition-all"
  >
    <Plus size={12} /> {label}
  </button>
);

export const RemoveButton = ({ onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className="flex-shrink-0 w-8 h-8 flex items-center justify-center text-red-400
      hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
  >
    <Trash2 size={14} />
  </button>
);

export const FacilityToggle = ({ label, checked, onChange }) => (
  <div className={`flex items-center justify-between p-3.5 rounded-xl border-2 transition-all select-none
    ${checked
      ? 'border-primary-300 bg-primary-50/40 text-primary-800'
      : 'border-slate-200 bg-white text-slate-500 hover:border-slate-300'
    }`}
  >
    <span className="text-xs font-bold capitalize">{label}</span>
    <Switch
      checked={checked}
      onChange={onChange}
    />
  </div>
);

export const Chip = ({ value, onChange, onRemove, placeholder }) => (
  <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5">
    <Input
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="border-0 bg-transparent p-0 text-xs font-semibold text-slate-700 focus:ring-0 w-28"
    />
    <RemoveButton onClick={onRemove} />
  </div>
);

export const SalaryBar = ({ label, value, max, color }) => {
  const pct = max > 0 ? Math.min((value / max) * 100, 100) : 0;
  const gradients = {
    'text-emerald-600': 'from-emerald-400 to-emerald-600',
    'text-blue-600': 'from-blue-400 to-emerald-600',
    'text-purple-600': 'from-emerald-400 to-emerald-600',
  };
  const gradient = gradients[color] || 'from-slate-400 to-slate-600';
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">{label}</span>
        <span className={`text-xs font-extrabold ${color}`}>₹{value > 0 ? `${value} LPA` : '—'}</span>
      </div>
      <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
        <div className={`h-full rounded-full transition-all duration-500 bg-gradient-to-r ${gradient}`}
          style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
};


import { useState } from 'react';
import { ChevronDown, X, SlidersHorizontal } from 'lucide-react';

const CITIES = ['Bhubaneswar', 'Cuttack', 'Rourkela', 'Berhampur', 'Sambalpur', 'Puri', 'Balasore', 'Baripada'];
const TYPES = ['Government', 'Private', 'Deemed', 'Autonomous', 'Central'];
const CATEGORIES = ['Engineering', 'Medical', 'Management', 'Arts & Science', 'Law', 'Pharmacy', 'Nursing', 'Polytechnic'];
const NAAC = ['A++', 'A+', 'A', 'B++', 'B+'];

function FilterSection({ title, children, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-slate-100 pb-4 mb-4">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between py-1 group"
      >
        <span className="text-sm font-semibold text-slate-700">{title}</span>
        <ChevronDown
          size={15}
          className={`text-slate-400 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </button>
      {open && <div className="mt-3 space-y-1.5">{children}</div>}
    </div>
  );
}

function CheckItem({ label, checked, onChange }) {
  return (
    <label className="flex items-center gap-2.5 cursor-pointer group">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="w-4 h-4 rounded border-slate-300 text-primary-600 focus:ring-primary-500 cursor-pointer"
      />
      <span className="text-sm text-slate-600 group-hover:text-slate-900 font-medium select-none">
        {label}
      </span>
    </label>
  );
}

export default function FilterSidebar({ filters, setFilters, onClose }) {
  const toggle = (key, val) => {
    setFilters(prev => ({
      ...prev,
      [key]: prev[key].includes(val)
        ? prev[key].filter(v => v !== val)
        : [...prev[key], val],
    }));
  };

  const activeCount = [
    ...filters.city,
    ...filters.type,
    ...filters.category,
    filters.minFees ? 1 : 0,
    filters.maxFees ? 1 : 0,
  ].filter(Boolean).length;

  const clearAll = () => {
    setFilters({ city: [], type: [], category: [], minFees: '', maxFees: '', search: filters.search });
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
      {/* Header */}
      <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <SlidersHorizontal size={15} className="text-slate-500" />
          <h2 className="text-sm font-bold text-slate-800">Filters</h2>
          {activeCount > 0 && (
            <span className="text-[10px] font-bold bg-primary-600 text-white px-2 py-0.5 rounded-full">
              {activeCount}
            </span>
          )}
        </div>
        <div className="flex items-center gap-3">
          {activeCount > 0 && (
            <button
              onClick={clearAll}
              className="text-xs font-semibold text-primary-600 hover:text-primary-700 transition-colors"
            >
              Clear all
            </button>
          )}
          {onClose && (
            <button onClick={onClose} className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors">
              <X size={16} className="text-slate-400" />
            </button>
          )}
        </div>
      </div>

      {/* Active filter chips */}
      {activeCount > 0 && (
        <div className="px-5 py-3 border-b border-slate-100 flex flex-wrap gap-1.5">
          {[...filters.city, ...filters.type, ...filters.category].map(f => (
            <span key={f} className="inline-flex items-center gap-1 bg-primary-50 border border-primary-100 text-primary-700 text-[11px] font-semibold px-2 py-1 rounded-md">
              {f}
              <button onClick={() => {
                const key = filters.city.includes(f) ? 'city' : filters.type.includes(f) ? 'type' : 'category';
                toggle(key, f);
              }}>
                <X size={10} />
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Filter Groups */}
      <div className="p-5">
        <FilterSection title="City">
          {CITIES.map(c => (
            <CheckItem
              key={c}
              label={c}
              checked={filters.city.includes(c)}
              onChange={() => toggle('city', c)}
            />
          ))}
        </FilterSection>

        <FilterSection title="Type">
          {TYPES.map(t => (
            <CheckItem
              key={t}
              label={t}
              checked={filters.type.includes(t)}
              onChange={() => toggle('type', t)}
            />
          ))}
        </FilterSection>

        <FilterSection title="Stream / Category">
          {CATEGORIES.map(c => (
            <CheckItem
              key={c}
              label={c}
              checked={filters.category.includes(c)}
              onChange={() => toggle('category', c)}
            />
          ))}
        </FilterSection>

        <FilterSection title="Annual Fees Range" defaultOpen={false}>
          <div className="space-y-2.5">
            <div>
              <label className="label-base">Min Fees (₹)</label>
              <input
                type="number"
                value={filters.minFees}
                onChange={e => setFilters(p => ({ ...p, minFees: e.target.value }))}
                placeholder="e.g. 50000"
                className="input-base"
              />
            </div>
            <div>
              <label className="label-base">Max Fees (₹)</label>
              <input
                type="number"
                value={filters.maxFees}
                onChange={e => setFilters(p => ({ ...p, maxFees: e.target.value }))}
                placeholder="e.g. 500000"
                className="input-base"
              />
            </div>
          </div>
        </FilterSection>
      </div>
    </div>
  );
}
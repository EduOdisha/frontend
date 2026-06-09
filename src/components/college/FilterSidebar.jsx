import { useState } from 'react';
import { ChevronDown, X, SlidersHorizontal } from 'lucide-react';

const CITIES = ['Bhubaneswar', 'Cuttack', 'Rourkela', 'Berhampur', 'Sambalpur', 'Puri', 'Balasore', 'Baripada'];
const TYPES = ['Government', 'Private', 'Deemed', 'Autonomous', 'Central'];
const CATEGORIES = ['Engineering', 'Medical', 'Management', 'Nursing', 'Polytechnic'];

function FilterSection({ title, children, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-white/10 pb-4 mb-4">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between py-1 group cursor-pointer"
      >
        <span className="text-sm font-semibold text-white/90 group-hover:text-white transition-colors">{title}</span>
        <ChevronDown
          size={15}
          className={`text-white/60 group-hover:text-white/90 transition-all duration-200 ${open ? 'rotate-180' : ''}`}
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
        className="w-4 h-4 rounded border-white/30 bg-white/10 text-primary-600 focus:ring-2 focus:ring-white/40 cursor-pointer transition-all"
      />
      <span className="text-sm text-white/80 group-hover:text-white font-medium select-none transition-colors">
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
    <div className="bg-primary-600 text-white border border-primary-700 rounded-xl overflow-hidden shadow-md transition-all">
      {/* Header */}
      <div className="px-5 py-4 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <SlidersHorizontal size={15} className="text-white" />
          <h2 className="text-sm font-bold text-white">Filters</h2>
          {activeCount > 0 && (
            <span className="text-[10px] font-bold bg-white text-primary-600 px-2 py-0.5 rounded-full">
              {activeCount}
            </span>
          )}
        </div>
        <div className="flex items-center gap-3">
          {activeCount > 0 && (
            <button
              onClick={clearAll}
              className="text-xs font-semibold text-white/90 hover:text-white transition-colors cursor-pointer"
            >
              Clear all
            </button>
          )}
          {onClose && (
            <button onClick={onClose} className="p-1.5 hover:bg-primary-700 rounded-lg transition-colors cursor-pointer">
              <X size={16} className="text-white" />
            </button>
          )}
        </div>
      </div>

      {/* Active filter chips */}
      {activeCount > 0 && (
        <div className="px-5 py-3 border-b border-white/10 flex flex-wrap gap-1.5 bg-primary-700/30">
          {[...filters.city, ...filters.type, ...filters.category].map(f => (
            <span key={f} className="inline-flex items-center gap-1 bg-white/10 border border-white/20 text-white text-[11px] font-semibold px-2 py-1 rounded-md">
              {f}
              <button onClick={() => {
                const key = filters.city.includes(f) ? 'city' : filters.type.includes(f) ? 'type' : 'category';
                toggle(key, f);
              }} className="cursor-pointer hover:text-red-200 transition-colors">
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
              <label className="block text-xs font-semibold text-white/80 mb-1.5">Min Fees (₹)</label>
              <input
                type="number"
                value={filters.minFees}
                onChange={e => setFilters(p => ({ ...p, minFees: e.target.value }))}
                placeholder="e.g. 50000"
                className="w-full px-3 py-2 text-xs text-white bg-white/10 border border-white/20 rounded-lg placeholder:text-white/40 focus:border-white focus:ring-2 focus:ring-white/20 transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-white/80 mb-1.5">Max Fees (₹)</label>
              <input
                type="number"
                value={filters.maxFees}
                onChange={e => setFilters(p => ({ ...p, maxFees: e.target.value }))}
                placeholder="e.g. 500000"
                className="w-full px-3 py-2 text-xs text-white bg-white/10 border border-white/20 rounded-lg placeholder:text-white/40 focus:border-white focus:ring-2 focus:ring-white/20 transition-all"
              />
            </div>
          </div>
        </FilterSection>
      </div>
    </div>
  );
}
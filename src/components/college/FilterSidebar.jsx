import { X } from 'lucide-react';

const cities = ['Bhubaneswar', 'Cuttack', 'Berhampur', 'Rourkela', 'Sambalpur', 'Puri', 'Balasore'];
const types = ['Government', 'Private', 'Deemed', 'Autonomous'];
const categories = ['Engineering', 'Medical', 'Management', 'Arts & Science', 'Law', 'Pharmacy', 'Nursing'];

export default function FilterSidebar({ filters, setFilters, onClose }) {
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      const currentValues = filters[name] || [];
      if (checked) {
        setFilters({ ...filters, [name]: [...currentValues, value] });
      } else {
        setFilters({ ...filters, [name]: currentValues.filter(v => v !== value) });
      }
    } else {
      setFilters({ ...filters, [name]: value });
    }
  };

  const clearFilters = () => {
    setFilters({ city: [], type: [], category: [], minFees: '', maxFees: '' });
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-800">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-bold text-slate-800 dark:text-white">Filters</h3>
        <button onClick={clearFilters} className="text-xs text-primary-600 font-bold hover:underline">Clear All</button>
        {onClose && <button onClick={onClose} className="lg:hidden p-1 rounded-lg bg-slate-100 dark:bg-slate-800"><X className="w-4 h-4" /></button>}
      </div>

      <div className="space-y-8">
        {/* City Filter */}
        <div>
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Location</h4>
          <div className="space-y-2 max-h-48 overflow-y-auto scrollbar-hide">
            {cities.map(city => (
              <label key={city} className="flex items-center gap-3 cursor-pointer group">
                <input 
                  type="checkbox" 
                  name="city" 
                  value={city}
                  checked={filters.city?.includes(city)}
                  onChange={handleChange}
                  className="w-4 h-4 rounded border-slate-300 text-primary-600 focus:ring-primary-500 transition-all"
                />
                <span className="text-sm text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">{city}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Type Filter */}
        <div>
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">College Type</h4>
          <div className="space-y-2">
            {types.map(type => (
              <label key={type} className="flex items-center gap-3 cursor-pointer group">
                <input 
                  type="checkbox" 
                  name="type" 
                  value={type}
                  checked={filters.type?.includes(type)}
                  onChange={handleChange}
                  className="w-4 h-4 rounded border-slate-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="text-sm text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white">{type}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Category Filter */}
        <div>
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Stream / Category</h4>
          <div className="space-y-2">
            {categories.map(cat => (
              <label key={cat} className="flex items-center gap-3 cursor-pointer group">
                <input 
                  type="checkbox" 
                  name="category" 
                  value={cat}
                  checked={filters.category?.includes(cat)}
                  onChange={handleChange}
                  className="w-4 h-4 rounded border-slate-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="text-sm text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white">{cat}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Fees Range */}
        <div>
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Fees Range (Per Year)</h4>
          <div className="grid grid-cols-2 gap-2">
            <input 
              type="number" 
              name="minFees" 
              placeholder="Min" 
              value={filters.minFees}
              onChange={handleChange}
              className="input-field py-2 text-xs" 
            />
            <input 
              type="number" 
              name="maxFees" 
              placeholder="Max" 
              value={filters.maxFees}
              onChange={handleChange}
              className="input-field py-2 text-xs" 
            />
          </div>
        </div>
      </div>
    </div>
  );
}
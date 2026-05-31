import { useState } from 'react';
import { X, Save, Plus, Trash2 } from 'lucide-react';
import { toast } from 'react-hot-toast';

const CourseForm = ({ course, onSubmit, onClose, loading }) => {
  const [formData, setFormData] = useState(course || {
    name: '',
    level: 'UG',
    stream: 'Engineering',
    duration: '',
    fees: { min: 0, max: 0, description: '' },
    eligibility: '',
    careerScope: '',
    about: '',
    isActive: true,
    isFeatured: false,
  });

  const [activeTab, setActiveTab] = useState('basic');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: type === 'checkbox' ? checked : value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name) return toast.error('Course name is required');
    onSubmit(formData);
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-slate-900 rounded-2xl shadow-2xl overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
        <h2 className="text-xl font-bold text-slate-800 dark:text-white">
          {course ? 'Edit Course' : 'Add New Course'}
        </h2>
        <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
          <X size={20} />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-100 dark:border-slate-800 px-6">
        {['basic', 'details'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`py-3 px-4 text-sm font-bold capitalize transition-all relative ${
              activeTab === tab ? 'text-primary-600' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            {tab}
            {activeTab === tab && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-600 rounded-t-full" />
            )}
          </button>
        ))}
      </div>

      {/* Form Content */}
      <form onSubmit={handleSubmit} className="flex-grow overflow-y-auto p-6 space-y-6 scrollbar-hide">
        {activeTab === 'basic' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="label">Course Name *</label>
              <input 
                type="text" name="name" value={formData.name} onChange={handleChange}
                placeholder="e.g. B.Tech Computer Science" className="input-field" required
              />
            </div>
            <div>
              <label className="label">Level</label>
              <select name="level" value={formData.level} onChange={handleChange} className="input-field">
                <option value="UG">UG (Undergraduate)</option>
                <option value="PG">PG (Postgraduate)</option>
                <option value="Diploma">Diploma</option>
                <option value="ITI">ITI</option>
                <option value="PhD">PhD</option>
                <option value="Certificate">Certificate</option>
              </select>
            </div>
            <div>
              <label className="label">Stream</label>
              <select name="stream" value={formData.stream} onChange={handleChange} className="input-field">
                <option value="Engineering">Engineering</option>
                <option value="Medical">Medical</option>
                <option value="Management">Management</option>
                <option value="Arts & Science">Arts & Science</option>
                <option value="Law">Law</option>
                <option value="Commerce">Commerce</option>
                <option value="Vocational">Skill / Vocational</option>
              </select>
            </div>
            <div>
              <label className="label">Duration</label>
              <input 
                type="text" name="duration" value={formData.duration} onChange={handleChange}
                placeholder="e.g. 4 Years" className="input-field"
              />
            </div>
            <div className="flex gap-6 items-center pt-8">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" name="isActive" checked={formData.isActive} onChange={handleChange} className="w-4 h-4 rounded text-primary-600" />
                <span className="text-sm font-medium">Active</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" name="isFeatured" checked={formData.isFeatured} onChange={handleChange} className="w-4 h-4 rounded text-primary-600" />
                <span className="text-sm font-medium">Featured</span>
              </label>
            </div>
          </div>
        )}

        {activeTab === 'details' && (
          <div className="space-y-6">
            <div>
              <label className="label">About Course</label>
              <textarea 
                name="about" value={formData.about} onChange={handleChange}
                rows="4" className="input-field resize-none" placeholder="Detailed description..."
              ></textarea>
            </div>
            <div>
              <label className="label">Eligibility Criteria</label>
              <textarea 
                name="eligibility" value={formData.eligibility} onChange={handleChange}
                rows="3" className="input-field resize-none" placeholder="Who can apply?"
              ></textarea>
            </div>
            <div>
              <label className="label">Career Scope & Salary</label>
              <textarea 
                name="careerScope" value={formData.careerScope} onChange={handleChange}
                rows="3" className="input-field resize-none" placeholder="Job opportunities..."
              ></textarea>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="label">Min Fees (Annual)</label>
                <input type="number" name="fees.min" value={formData.fees.min} onChange={handleChange} className="input-field" />
              </div>
              <div>
                <label className="label">Max Fees (Annual)</label>
                <input type="number" name="fees.max" value={formData.fees.max} onChange={handleChange} className="input-field" />
              </div>
            </div>
          </div>
        )}
      </form>

      {/* Footer Actions */}
      <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-3">
        <button onClick={onClose} className="btn-secondary">Cancel</button>
        <button 
          onClick={handleSubmit} 
          disabled={loading}
          className="btn-primary flex items-center gap-2"
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <>
              <Save size={18} />
              {course ? 'Update Course' : 'Create Course'}
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default CourseForm;
import { useState } from 'react';
import { X, Save, Plus, Trash2, Image as ImageIcon, Upload } from 'lucide-react';
import { toast } from 'react-hot-toast';

const CollegeForm = ({ college, onSubmit, onClose, loading }) => {
  const [formData, setFormData] = useState(college || {
    name: '',
    shortName: '',
    type: 'Private',
    category: 'Engineering',
    location: {
      address: '', city: 'Bhubaneswar', district: '', state: 'Odisha', pincode: '',
    },
    established: new Date().getFullYear(),
    affiliation: '',
    naacGrade: '',
    nirfRanking: '',
    about: '',
    highlights: [''],
    logo: { url: '' },
    banner: { url: '' },
    gallery: [{ url: '' }],
    courses: [{ name: '', duration: '', fees: { min: 0, max: 0 }, seats: 0, eligibility: '' }],
    fees: { min: 0, max: 0, description: '' },
    admissions: { process: '', entranceExams: [''], applicationLink: '', lastDate: '' },
    placements: { averagePackage: 0, highestPackage: 0, placementPercentage: 0, topRecruiters: [''], description: '' },
    facilities: {
      hostel: false, library: false, sports: false, canteen: false, wifi: false, 
      lab: false, transport: false, medicalFacility: false, gym: false
    },
    faqs: [{ question: '', answer: '' }],
    contact: { email: '', website: '', phone: [''] },
    isActive: true,
    isFeatured: false,
    isVerified: false,
  });

  const [activeTab, setActiveTab] = useState('basic');

  const tabs = [
    { id: 'basic', label: 'Basic' },
    { id: 'images', label: 'Images & Gallery' },
    { id: 'location', label: 'Location' },
    { id: 'admissions', label: 'Admissions' },
    { id: 'courses', label: 'Courses' },
    { id: 'placements', label: 'Placements' },
    { id: 'facilities', label: 'Facilities' },
    { id: 'faqs', label: 'FAQs' },
    { id: 'contact', label: 'Contact' },
  ];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.includes('.')) {
      const keys = name.split('.');
      if (keys.length === 2) {
        setFormData(prev => ({
          ...prev,
          [keys[0]]: { ...prev[keys[0]], [keys[1]]: type === 'checkbox' ? checked : value }
        }));
      } else if (keys.length === 3) {
        setFormData(prev => ({
          ...prev,
          [keys[0]]: {
            ...prev[keys[0]],
            [keys[1]]: { ...prev[keys[0]][keys[1]], [keys[2]]: value }
          }
        }));
      }
    } else {
      setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    }
  };

  const handleArrayChange = (field, index, value, subField = null) => {
    const newArray = [...formData[field]];
    if (subField) {
      newArray[index] = { ...newArray[index], [subField]: value };
    } else {
      newArray[index] = value;
    }
    setFormData({ ...formData, [field]: newArray });
  };

  const addArrayItem = (field, defaultValue) => {
    setFormData({ ...formData, [field]: [...formData[field], defaultValue] });
  };

  const removeArrayItem = (field, index) => {
    setFormData({ ...formData, [field]: formData[field].filter((_, i) => i !== index) });
  };

  const handleNestedArrayChange = (parent, field, index, value) => {
    const newArray = [...formData[parent][field]];
    newArray[index] = value;
    setFormData({
      ...formData,
      [parent]: { ...formData[parent], [field]: newArray }
    });
  };

  const addNestedArrayItem = (parent, field, defaultValue) => {
    setFormData({
      ...formData,
      [parent]: { ...formData[parent], [field]: [...formData[parent][field], defaultValue] }
    });
  };

  const removeNestedArrayItem = (parent, field, index) => {
    const newArray = formData[parent][field].filter((_, i) => i !== index);
    setFormData({
      ...formData,
      [parent]: { ...formData[parent], [field]: newArray }
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name) return toast.error('College name is required');
    onSubmit(formData);
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-slate-900 rounded-2xl shadow-2xl overflow-hidden text-slate-800 dark:text-slate-100">
      <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
        <h2 className="text-xl font-bold">{college ? 'Edit College' : 'Add New College'}</h2>
        <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"><X size={20} /></button>
      </div>

      <div className="flex border-b border-slate-100 dark:border-slate-800 px-6 overflow-x-auto scrollbar-hide">
        {tabs.map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`py-3 px-4 text-xs font-bold capitalize transition-all relative whitespace-nowrap ${activeTab === tab.id ? 'text-primary-600' : 'text-slate-500 hover:text-slate-700'}`}>
            {tab.label}
            {activeTab === tab.id && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-600 rounded-t-full" />}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="flex-grow overflow-y-auto p-6 space-y-6 scrollbar-hide">
        {activeTab === 'basic' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in duration-300">
            <div className="md:col-span-2">
              <label className="label">College Name *</label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} className="input-field" required />
            </div>
            <div>
              <label className="label">Short Name</label>
              <input type="text" name="shortName" value={formData.shortName} onChange={handleChange} className="input-field" />
            </div>
            <div>
              <label className="label">Established Year</label>
              <input type="number" name="established" value={formData.established} onChange={handleChange} className="input-field" />
            </div>
            <div>
              <label className="label">Type</label>
              <select name="type" value={formData.type} onChange={handleChange} className="input-field">
                {['Government', 'Private', 'Deemed', 'Autonomous', 'Central'].map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Category</label>
              <select name="category" value={formData.category} onChange={handleChange} className="input-field">
                {['Engineering', 'Medical', 'Management', 'Arts & Science', 'Law', 'Pharmacy', 'Nursing', 'Polytechnic', 'Other'].map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="label flex items-center justify-between">Highlights <button type="button" onClick={() => addArrayItem('highlights', '')} className="text-primary-600 text-[10px] font-bold uppercase">+ Add</button></label>
              <div className="space-y-2">
                {formData.highlights.map((h, i) => (
                  <div key={i} className="flex gap-2">
                    <input type="text" value={h} onChange={(e) => handleArrayChange('highlights', i, e.target.value)} className="input-field py-2" />
                    <button type="button" onClick={() => removeArrayItem('highlights', i)} className="text-red-500"><Trash2 size={16} /></button>
                  </div>
                ))}
              </div>
            </div>
            <div className="md:col-span-2 flex gap-6 pt-2">
              {['isActive', 'isFeatured', 'isVerified'].map(flag => (
                <label key={flag} className="flex items-center gap-2 cursor-pointer"><input type="checkbox" name={flag} checked={formData[flag]} onChange={handleChange} className="w-4 h-4 rounded text-primary-600" /> <span className="text-sm font-medium">{flag.replace('is', '')}</span></label>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'images' && (
          <div className="space-y-8 animate-in fade-in duration-300">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Logo Section */}
              <div className="space-y-4">
                <label className="label">College Logo URL</label>
                <div className="relative group">
                  <input 
                    type="url" name="logo.url" value={formData.logo?.url} onChange={handleChange} 
                    className="input-field pr-12" placeholder="https://image-link.com/logo.png" 
                  />
                  <ImageIcon className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                </div>
                {formData.logo?.url && (
                  <div className="w-32 h-32 rounded-xl border border-slate-200 dark:border-slate-700 p-2 bg-slate-50 dark:bg-slate-800">
                    <img src={formData.logo.url} alt="Logo Preview" className="w-full h-full object-contain" />
                  </div>
                )}
              </div>

              {/* Banner Section */}
              <div className="space-y-4">
                <label className="label">College Banner URL</label>
                <div className="relative group">
                  <input 
                    type="url" name="banner.url" value={formData.banner?.url} onChange={handleChange} 
                    className="input-field pr-12" placeholder="https://image-link.com/banner.jpg" 
                  />
                  <ImageIcon className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                </div>
                {formData.banner?.url && (
                  <div className="aspect-video w-full rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden bg-slate-50 dark:bg-slate-800">
                    <img src={formData.banner.url} alt="Banner Preview" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>
            </div>

            {/* Gallery Section */}
            <div className="space-y-4">
              <label className="label flex items-center justify-between">
                Campus Gallery Images
                <button type="button" onClick={() => addArrayItem('gallery', { url: '' })} className="text-primary-600 text-[10px] font-bold uppercase">+ Add Image</button>
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {formData.gallery?.map((img, i) => (
                  <div key={i} className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-slate-400 uppercase">Image {i+1}</span>
                      <button type="button" onClick={() => removeArrayItem('gallery', i)} className="text-red-500 hover:bg-red-50 p-1 rounded-lg transition-colors"><Trash2 size={16} /></button>
                    </div>
                    <input 
                      type="url" value={img.url} 
                      onChange={(e) => handleArrayChange('gallery', i, e.target.value, 'url')} 
                      className="input-field py-2" placeholder="Enter image URL..." 
                    />
                    {img.url && (
                      <div className="aspect-video w-full rounded-xl overflow-hidden shadow-sm">
                        <img src={img.url} alt={`Gallery ${i}`} className="w-full h-full object-cover" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'location' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="label">Full Address</label>
              <input type="text" name="location.address" value={formData.location.address} onChange={handleChange} className="input-field" />
            </div>
            <div>
              <label className="label">City</label>
              <select name="location.city" value={formData.location.city} onChange={handleChange} className="input-field">
                {['Bhubaneswar', 'Cuttack', 'Berhampur', 'Rourkela', 'Sambalpur', 'Puri', 'Balasore', 'Koraput', 'Jharsuguda', 'Baripada', 'Other'].map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="label">District</label>
              <input type="text" name="location.district" value={formData.location.district} onChange={handleChange} className="input-field" />
            </div>
          </div>
        )}

        {activeTab === 'admissions' && (
          <div className="space-y-6">
            <div>
              <label className="label">About College</label>
              <textarea name="about" value={formData.about} onChange={handleChange} rows="4" className="input-field resize-none"></textarea>
            </div>
            <div>
              <label className="label">Admission Process</label>
              <textarea name="admissions.process" value={formData.admissions.process} onChange={handleChange} rows="3" className="input-field resize-none"></textarea>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="label">NAAC Grade</label>
                <input type="text" name="naacGrade" value={formData.naacGrade} onChange={handleChange} className="input-field" />
              </div>
              <div>
                <label className="label">NIRF Ranking</label>
                <input type="number" name="nirfRanking" value={formData.nirfRanking} onChange={handleChange} className="input-field" />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'courses' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between"><h3 className="font-bold">Courses</h3><button type="button" onClick={() => addArrayItem('courses', { name: '', duration: '', fees: { min: 0, max: 0 }, seats: 0, eligibility: '' })} className="btn-primary py-2 px-4 text-xs">+ Add</button></div>
            {formData.courses.map((course, i) => (
              <div key={i} className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 relative">
                <button type="button" onClick={() => removeArrayItem('courses', i)} className="absolute top-4 right-4 text-red-500"><Trash2 size={16} /></button>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                  <div className="md:col-span-2"><label className="label">Course Name</label><input type="text" value={course.name} onChange={(e) => handleArrayChange('courses', i, e.target.value, 'name')} className="input-field py-2" /></div>
                  <div><label className="label">Duration</label><input type="text" value={course.duration} onChange={(e) => handleArrayChange('courses', i, e.target.value, 'duration')} className="input-field py-2" /></div>
                  <div><label className="label">Fees</label><input type="number" value={course.fees.min} onChange={(e) => { const n = [...formData.courses]; n[i].fees.min = parseInt(e.target.value); setFormData({...formData, courses: n}); }} className="input-field py-2" /></div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'placements' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div><label className="label">Average (LPA)</label><input type="number" step="0.1" name="placements.averagePackage" value={formData.placements.averagePackage} onChange={handleChange} className="input-field" /></div>
              <div><label className="label">Highest (LPA)</label><input type="number" step="0.1" name="placements.highestPackage" value={formData.placements.highestPackage} onChange={handleChange} className="input-field" /></div>
              <div><label className="label">Placement %</label><input type="number" name="placements.placementPercentage" value={formData.placements.placementPercentage} onChange={handleChange} className="input-field" /></div>
            </div>
            <div>
              <label className="label flex items-center justify-between">Top Recruiters <button type="button" onClick={() => addNestedArrayItem('placements', 'topRecruiters', '')} className="text-primary-600 text-[10px] font-bold uppercase">+ Add</button></label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {formData.placements.topRecruiters.map((r, i) => (
                  <div key={i} className="flex gap-2">
                    <input type="text" value={r} onChange={(e) => handleNestedArrayChange('placements', 'topRecruiters', i, e.target.value)} className="input-field py-2 text-xs" />
                    <button type="button" onClick={() => removeNestedArrayItem('placements', 'topRecruiters', i)} className="text-red-500"><Trash2 size={16} /></button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'facilities' && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {Object.keys(formData.facilities).map(f => (
              <label key={f} className="flex items-center gap-3 p-4 rounded-xl border border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer">
                <input type="checkbox" name={`facilities.${f}`} checked={formData.facilities[f]} onChange={handleChange} className="w-5 h-5 rounded text-primary-600" />
                <span className="font-bold text-sm capitalize">{f.replace(/([A-Z])/g, ' $1')}</span>
              </label>
            ))}
          </div>
        )}

        {activeTab === 'faqs' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between"><h3 className="font-bold">FAQs</h3><button type="button" onClick={() => addArrayItem('faqs', { question: '', answer: '' })} className="btn-primary py-2 px-4 text-xs">+ Add</button></div>
            {formData.faqs.map((faq, i) => (
              <div key={i} className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-3">
                <div className="flex justify-end"><button type="button" onClick={() => removeArrayItem('faqs', i)} className="text-red-500"><Trash2 size={16} /></button></div>
                <input type="text" value={faq.question} onChange={(e) => handleArrayChange('faqs', i, e.target.value, 'question')} placeholder="Question" className="input-field font-bold" />
                <textarea value={faq.answer} onChange={(e) => handleArrayChange('faqs', i, e.target.value, 'answer')} placeholder="Answer" rows="2" className="input-field resize-none"></textarea>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'contact' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div><label className="label">Website</label><input type="url" name="contact.website" value={formData.contact.website} onChange={handleChange} className="input-field" /></div>
            <div><label className="label">Email</label><input type="email" name="contact.email" value={formData.contact.email} onChange={handleChange} className="input-field" /></div>
            <div className="md:col-span-2 space-y-4">
              <label className="label flex items-center justify-between">Phones <button type="button" onClick={() => addNestedArrayItem('contact', 'phone', '')} className="text-primary-600 text-[10px] font-bold uppercase">+ Add</button></label>
              {formData.contact.phone.map((p, i) => (
                <div key={i} className="flex gap-2">
                  <input type="text" value={p} onChange={(e) => handleNestedArrayChange('contact', 'phone', i, e.target.value)} className="input-field py-2" />
                  <button type="button" onClick={() => removeNestedArrayItem('contact', 'phone', i)} className="text-red-500"><Trash2 size={16} /></button>
                </div>
              ))}
            </div>
          </div>
        )}
      </form>

      <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-3 bg-slate-50/50 dark:bg-slate-800/50">
        <button onClick={onClose} className="btn-secondary">Cancel</button>
        <button onClick={handleSubmit} disabled={loading} className="btn-primary flex items-center gap-2">
          {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><Save size={18} /> {college ? 'Update' : 'Create'}</>}
        </button>
      </div>
    </div>
  );
};

export default CollegeForm;
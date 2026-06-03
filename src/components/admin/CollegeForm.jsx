import { useState } from 'react';
import {
  X, Save, Plus, Trash2, Image as ImageIcon,
  Building2, MapPin, GraduationCap, BookOpen,
  TrendingUp, Wrench, HelpCircle, Phone, CheckCircle,
  Globe, Mail, Star, Award, Users, DollarSign,
} from 'lucide-react';
import { toast } from 'react-hot-toast';

// ─── Reusable Field Components ─────────────────────────────────────────────
const Label = ({ children, required }) => (
  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
    {children}{required && <span className="text-red-500 ml-1">*</span>}
  </label>
);

const Input = ({ className = '', ...props }) => (
  <input
    className={`w-full px-3.5 py-2.5 text-sm text-slate-800 bg-slate-50/50 border border-slate-200/80 rounded-xl
      hover:bg-white hover:border-slate-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500
      placeholder:text-slate-300 transition-all ${className}`}
    {...props}
  />
);

const Textarea = ({ className = '', ...props }) => (
  <textarea
    className={`w-full px-3.5 py-2.5 text-sm text-slate-800 bg-slate-50/50 border border-slate-200/80 rounded-xl
      hover:bg-white hover:border-slate-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500
      placeholder:text-slate-300 transition-all resize-none ${className}`}
    {...props}
  />
);

const Select = ({ children, className = '', ...props }) => (
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

const Switch = ({ checked, onChange }) => (
  <button
    type="button"
    onClick={onChange}
    className={`w-10 h-6 flex items-center rounded-full p-1 transition-all duration-200 outline-none shrink-0
      ${checked ? 'bg-emerald-500 shadow-sm shadow-emerald-500/20' : 'bg-slate-200'}`}
  >
    <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-all duration-200 ${checked ? 'translate-x-4' : 'translate-x-0'}`} />
  </button>
);

const SectionCard = ({ icon: Icon, title, subtitle, children, accent = 'primary' }) => {
  const colors = {
    primary: 'bg-primary-50 text-primary-600 border-primary-100/50',
    purple: 'bg-purple-50 text-purple-600 border-purple-100/50',
    emerald: 'bg-emerald-50 text-emerald-600 border-emerald-100/50',
    amber: 'bg-amber-50 text-amber-600 border-amber-100/50',
    blue: 'bg-blue-50 text-blue-600 border-blue-100/50',
    rose: 'bg-rose-50 text-rose-600 border-rose-100/50',
  };
  return (
    <div className="bg-white border border-slate-200/70 rounded-2xl shadow-xs overflow-hidden hover:shadow-sm transition-all duration-200">
      <div className="flex items-center gap-3 px-5 py-4 bg-slate-50/50 border-b border-slate-100">
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border ${colors[accent]}`}>
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

const AddButton = ({ onClick, label = 'Add' }) => (
  <button
    type="button"
    onClick={onClick}
    className="flex items-center gap-1.5 text-xs font-bold text-primary-600 hover:text-primary-700
      bg-primary-50 hover:bg-primary-100 border border-primary-200 px-3 py-1.5 rounded-lg transition-all"
  >
    <Plus size={12} /> {label}
  </button>
);

const RemoveButton = ({ onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className="flex-shrink-0 w-8 h-8 flex items-center justify-center text-red-400
      hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
  >
    <Trash2 size={14} />
  </button>
);

const FacilityToggle = ({ label, checked, onChange }) => (
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

// ─── Tab Icons ──────────────────────────────────────────────────────────────
const TAB_ICONS = {
  basic: Building2,
  images: ImageIcon,
  location: MapPin,
  admissions: GraduationCap,
  courses: BookOpen,
  placements: TrendingUp,
  facilities: Wrench,
  faqs: HelpCircle,
  contact: Phone,
};

// ─── Main Form ──────────────────────────────────────────────────────────────
const CollegeForm = ({ college, onSubmit, onClose, loading }) => {
  const [formData, setFormData] = useState(college || {
    name: '', shortName: '', type: 'Private', category: 'Engineering',
    location: { address: '', city: 'Bhubaneswar', district: '', state: 'Odisha', pincode: '' },
    established: new Date().getFullYear(),
    affiliation: '', naacGrade: '', nirfRanking: '', about: '',
    highlights: [''],
    logo: { url: '' }, banner: { url: '' }, gallery: [{ url: '' }],
    courses: [{ name: '', duration: '', fees: { min: 0, max: 0 }, seats: 0, eligibility: '' }],
    fees: { min: 0, max: 0, description: '' },
    admissions: { process: '', entranceExams: [''], applicationLink: '', lastDate: '' },
    placements: { averagePackage: 0, highestPackage: 0, placementPercentage: 0, topRecruiters: [''], description: '' },
    facilities: {
      hostel: false, library: false, sports: false, canteen: false, wifi: false,
      lab: false, transport: false, medicalFacility: false, gym: false,
    },
    faqs: [{ question: '', answer: '' }],
    contact: { email: '', website: '', phone: [''] },
    isActive: true, isFeatured: false, isVerified: false,
  });

  const [activeTab, setActiveTab] = useState('basic');

  const tabs = [
    { id: 'basic', label: 'Basic Info' },
    { id: 'images', label: 'Images & Media' },
    { id: 'location', label: 'Location' },
    { id: 'admissions', label: 'Admissions' },
    { id: 'courses', label: 'Courses Offered' },
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
        setFormData(prev => ({ ...prev, [keys[0]]: { ...prev[keys[0]], [keys[1]]: type === 'checkbox' ? checked : value } }));
      } else if (keys.length === 3) {
        setFormData(prev => ({ ...prev, [keys[0]]: { ...prev[keys[0]], [keys[1]]: { ...prev[keys[0]][keys[1]], [keys[2]]: value } } }));
      }
    } else {
      setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    }
  };

  const handleArrayChange = (field, index, value, subField = null) => {
    const newArray = [...formData[field]];
    if (subField) newArray[index] = { ...newArray[index], [subField]: value };
    else newArray[index] = value;
    setFormData({ ...formData, [field]: newArray });
  };

  const addArrayItem = (field, defaultValue) =>
    setFormData({ ...formData, [field]: [...formData[field], defaultValue] });

  const removeArrayItem = (field, index) =>
    setFormData({ ...formData, [field]: formData[field].filter((_, i) => i !== index) });

  const handleNestedArrayChange = (parent, field, index, value) => {
    const newArray = [...formData[parent][field]];
    newArray[index] = value;
    setFormData({ ...formData, [parent]: { ...formData[parent], [field]: newArray } });
  };

  const addNestedArrayItem = (parent, field, defaultValue) =>
    setFormData({ ...formData, [parent]: { ...formData[parent], [field]: [...formData[parent][field], defaultValue] } });

  const removeNestedArrayItem = (parent, field, index) => {
    const newArray = formData[parent][field].filter((_, i) => i !== index);
    setFormData({ ...formData, [parent]: { ...formData[parent], [field]: newArray } });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name) return toast.error('College name is required');
    onSubmit(formData);
  };

  const FACILITY_LABELS = {
    hostel: 'Hostel', library: 'Library', sports: 'Sports', canteen: 'Canteen',
    wifi: 'Wi-Fi', lab: 'Labs', transport: 'Transport', medicalFacility: 'Medical', gym: 'Gym',
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-100">
      {/* ─── Header ─────────────────────────────────────── */}
      <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-slate-100 shrink-0">
        <div>
          <h2 className="text-lg font-bold text-slate-900">{college ? 'Edit College' : 'Add New College'}</h2>
          <p className="text-xs text-slate-400 mt-0.5">Manage data across specialized departments</p>
        </div>
        <button onClick={onClose}
          className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-all">
          <X size={17} />
        </button>
      </div>

      {/* ─── Main Body Container (Sidebar + Content) ────── */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        
        {/* ─── Left Sidebar Tabs ────────────────────────── */}
        <div className="w-full md:w-56 bg-slate-50/50 border-b md:border-b-0 md:border-r border-slate-200/60 flex flex-row md:flex-col p-4 shrink-0 overflow-x-auto md:overflow-y-auto gap-1 scrollbar-hide">
          {tabs.map(tab => {
            const Icon = TAB_ICONS[tab.id];
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2.5 px-3 py-2.5 md:py-3 text-xs font-bold rounded-xl transition-all w-auto md:w-full text-left cursor-pointer shrink-0 whitespace-nowrap
                  ${isActive
                    ? 'bg-primary-600 text-white shadow-md shadow-primary-600/10 font-bold'
                    : 'text-slate-500 hover:bg-slate-100 hover:text-slate-800'
                  }`}
              >
                <Icon size={15} className={`shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* ─── Right Form Content ───────────────────────── */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide bg-white">

          {/* ══ BASIC ══════════════════════════════════════ */}
          {activeTab === 'basic' && (
            <div className="space-y-5">
              <SectionCard icon={Building2} title="College Identity" subtitle="Core registration details" accent="primary">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <Label required>College Name</Label>
                    <Input name="name" value={formData.name} onChange={handleChange} placeholder="e.g. KIIT University" required />
                  </div>
                  <div>
                    <Label>Short Name / Acronym</Label>
                    <Input name="shortName" value={formData.shortName} onChange={handleChange} placeholder="e.g. KIIT" />
                  </div>
                  <div>
                    <Label>Established Year</Label>
                    <Input type="number" name="established" value={formData.established} onChange={handleChange} placeholder="e.g. 1992" />
                  </div>
                  <div>
                    <Label required>College Type</Label>
                    <Select name="type" value={formData.type} onChange={handleChange}>
                      {['Government', 'Private', 'Deemed', 'Autonomous', 'Central'].map(t => <option key={t}>{t}</option>)}
                    </Select>
                  </div>
                  <div>
                    <Label required>Category / Stream</Label>
                    <Select name="category" value={formData.category} onChange={handleChange}>
                      {['Engineering', 'Medical', 'Management', 'Arts & Science', 'Law', 'Pharmacy', 'Nursing', 'Polytechnic', 'Other'].map(c => <option key={c}>{c}</option>)}
                    </Select>
                  </div>
                  <div className="md:col-span-2">
                    <Label>Affiliation</Label>
                    <Input name="affiliation" value={formData.affiliation} onChange={handleChange} placeholder="e.g. Deemed to be University / Biju Patnaik University" />
                  </div>
                </div>
              </SectionCard>

              <SectionCard icon={Award} title="Rankings & Accreditation" accent="amber">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>NAAC Grade</Label>
                    <Select name="naacGrade" value={formData.naacGrade} onChange={handleChange}>
                      <option value="">Not Accredited</option>
                      {['A++', 'A+', 'A', 'B++', 'B+', 'B', 'C'].map(g => <option key={g}>{g}</option>)}
                    </Select>
                  </div>
                  <div>
                    <Label>NIRF Ranking</Label>
                    <Input type="number" name="nirfRanking" value={formData.nirfRanking} onChange={handleChange} placeholder="e.g. 47" />
                  </div>
                </div>
              </SectionCard>

              <SectionCard icon={Star} title="Highlights" subtitle="Key selling points (shown as bullet points)" accent="purple">
                <div className="space-y-3">
                  {formData.highlights.map((h, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-primary-50 border border-primary-100 text-primary-600 flex items-center justify-center text-[10px] font-bold shrink-0">{i + 1}</span>
                      <Input value={h} onChange={(e) => handleArrayChange('highlights', i, e.target.value)} placeholder="e.g. 95% placement rate" />
                      <RemoveButton onClick={() => removeArrayItem('highlights', i)} />
                    </div>
                  ))}
                  <AddButton onClick={() => addArrayItem('highlights', '')} label="Add Highlight" />
                </div>
              </SectionCard>

              <SectionCard icon={CheckCircle} title="Visibility Status" accent="emerald">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {[
                    { key: 'isActive', label: 'Active', desc: 'Visible on site' },
                    { key: 'isFeatured', label: 'Featured', desc: 'Show on homepage' },
                    { key: 'isVerified', label: 'Verified', desc: 'Verified badge' },
                  ].map(({ key, label, desc }) => (
                    <div key={key} className={`flex items-center justify-between p-4 rounded-xl border-2 transition-all select-none
                      ${formData[key] ? 'border-emerald-300 bg-emerald-50/40 text-emerald-800' : 'border-slate-200 bg-white hover:border-slate-300 text-slate-500'}`}
                    >
                      <div className="flex flex-col gap-0.5">
                        <span className="text-xs font-bold">{label}</span>
                        <span className="text-[10px] text-slate-400">{desc}</span>
                      </div>
                      <Switch
                        checked={formData[key]}
                        onChange={() => setFormData(prev => ({ ...prev, [key]: !prev[key] }))}
                      />
                    </div>
                  ))}
                </div>
              </SectionCard>
            </div>
          )}

          {/* ══ IMAGES ═════════════════════════════════════ */}
          {activeTab === 'images' && (
            <div className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <SectionCard icon={ImageIcon} title="College Logo" subtitle="Square format recommended (PNG/SVG)" accent="primary">
                  <div className="space-y-3">
                    <div className="relative">
                      <Input type="url" name="logo.url" value={formData.logo?.url} onChange={handleChange} placeholder="https://example.com/logo.png" className="pr-10" />
                      <ImageIcon size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-300" />
                    </div>
                    {formData.logo?.url ? (
                      <div className="w-full aspect-square max-w-[120px] mx-auto rounded-2xl border-2 border-slate-100 p-3 bg-slate-50">
                        <img src={formData.logo.url} alt="Logo" className="w-full h-full object-contain" />
                      </div>
                    ) : (
                      <div className="w-full h-28 rounded-xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-300 gap-2">
                        <ImageIcon size={28} />
                        <span className="text-[10px] font-semibold">Logo preview</span>
                      </div>
                    )}
                  </div>
                </SectionCard>

                <SectionCard icon={ImageIcon} title="College Banner" subtitle="Landscape 16:9 recommended" accent="blue">
                  <div className="space-y-3">
                    <div className="relative">
                      <Input type="url" name="banner.url" value={formData.banner?.url} onChange={handleChange} placeholder="https://example.com/banner.jpg" className="pr-10" />
                      <ImageIcon size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-300" />
                    </div>
                    {formData.banner?.url ? (
                      <div className="aspect-video w-full rounded-xl overflow-hidden border border-slate-200">
                        <img src={formData.banner.url} alt="Banner" className="w-full h-full object-cover" />
                      </div>
                    ) : (
                      <div className="aspect-video w-full rounded-xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-300 gap-2">
                        <ImageIcon size={28} />
                        <span className="text-[10px] font-semibold">Banner preview</span>
                      </div>
                    )}
                  </div>
                </SectionCard>
              </div>

              <SectionCard icon={ImageIcon} title="Campus Gallery" subtitle="Add multiple campus images" accent="purple">
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {formData.gallery?.map((img, i) => (
                      <div key={i} className="bg-slate-50/40 rounded-xl border border-slate-200 p-3 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Image {i + 1}</span>
                          <RemoveButton onClick={() => removeArrayItem('gallery', i)} />
                        </div>
                        <Input type="url" value={img.url} onChange={(e) => handleArrayChange('gallery', i, e.target.value, 'url')} placeholder="https://..." />
                        {img.url ? (
                          <div className="aspect-video rounded-lg overflow-hidden border border-slate-200">
                            <img src={img.url} alt="" className="w-full h-full object-cover" />
                          </div>
                        ) : (
                          <div className="aspect-video rounded-lg bg-slate-100 flex items-center justify-center text-slate-300 border border-dashed border-slate-200">
                            <ImageIcon size={20} />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                  <AddButton onClick={() => addArrayItem('gallery', { url: '' })} label="Add Gallery Image" />
                </div>
              </SectionCard>
            </div>
          )}

          {/* ══ LOCATION ═══════════════════════════════════ */}
          {activeTab === 'location' && (
            <div className="space-y-5">
              <SectionCard icon={MapPin} title="Campus Address" subtitle="Where is the college located?" accent="rose">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <Label>Full Address</Label>
                    <Input name="location.address" value={formData.location.address} onChange={handleChange} placeholder="e.g. KIIT Road, Patia, Bhubaneswar" />
                  </div>
                  <div>
                    <Label required>City</Label>
                    <Select name="location.city" value={formData.location.city} onChange={handleChange}>
                      {['Bhubaneswar', 'Cuttack', 'Berhampur', 'Rourkela', 'Sambalpur', 'Puri', 'Balasore', 'Koraput', 'Jharsuguda', 'Baripada', 'Other'].map(c => <option key={c}>{c}</option>)}
                    </Select>
                  </div>
                  <div>
                    <Label>District</Label>
                    <Input name="location.district" value={formData.location.district} onChange={handleChange} placeholder="e.g. Khordha" />
                  </div>
                  <div>
                    <Label>State</Label>
                    <Input name="location.state" value={formData.location.state} onChange={handleChange} placeholder="Odisha" />
                  </div>
                  <div>
                    <Label>PIN Code</Label>
                    <Input name="location.pincode" value={formData.location.pincode} onChange={handleChange} placeholder="e.g. 751024" maxLength={6} />
                  </div>
                </div>
              </SectionCard>
            </div>
          )}

          {/* ══ ADMISSIONS ═════════════════════════════════ */}
          {activeTab === 'admissions' && (
            <div className="space-y-5">
              <SectionCard icon={Building2} title="About the College" subtitle="Shown on the college detail page" accent="primary">
                <div>
                  <Label>About / Overview</Label>
                  <Textarea name="about" value={formData.about} onChange={handleChange} rows={5} placeholder="Describe the college, its history, achievements, and USPs..." />
                  <p className="text-[10px] text-slate-400 mt-1 text-right">{(formData.about || '').length}/5000</p>
                </div>
              </SectionCard>

              <SectionCard icon={GraduationCap} title="Admission Details" subtitle="Fees, process, and exam requirements" accent="amber">
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Min Annual Fees (₹)</Label>
                      <Input type="number" name="fees.min" value={formData.fees.min} onChange={handleChange} placeholder="e.g. 50000" />
                    </div>
                    <div>
                      <Label>Max Annual Fees (₹)</Label>
                      <Input type="number" name="fees.max" value={formData.fees.max} onChange={handleChange} placeholder="e.g. 200000" />
                    </div>
                  </div>

                  <div>
                    <Label>Admission Process</Label>
                    <Textarea name="admissions.process" value={formData.admissions.process} onChange={handleChange} rows={3} placeholder="Describe the admission process step by step..." />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>Application Link</Label>
                      <Input type="url" name="admissions.applicationLink" value={formData.admissions.applicationLink} onChange={handleChange} placeholder="https://..." />
                    </div>
                    <div>
                      <Label>Last Date to Apply</Label>
                      <Input type="date" name="admissions.lastDate" value={formData.admissions.lastDate} onChange={handleChange} />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <Label>Entrance Exams Accepted</Label>
                      <AddButton onClick={() => addNestedArrayItem('admissions', 'entranceExams', '')} label="Add Exam" />
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {formData.admissions.entranceExams.map((exam, i) => (
                        <div key={i} className="flex items-center gap-1.5 bg-primary-50 border border-primary-100 rounded-lg px-2 py-1">
                          <Input
                            value={exam}
                            onChange={(e) => handleNestedArrayChange('admissions', 'entranceExams', i, e.target.value)}
                            placeholder="e.g. JEE Main"
                            className="border-0 bg-transparent p-0 text-xs font-bold text-primary-700 focus:ring-0 w-24"
                          />
                          <RemoveButton onClick={() => removeNestedArrayItem('admissions', 'entranceExams', i)} />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </SectionCard>
            </div>
          )}

          {/* ══ COURSES ════════════════════════════════════ */}
          {activeTab === 'courses' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-800">Courses Offered</h3>
                  <p className="text-xs text-slate-400 mt-0.5">Programs available at this college</p>
                </div>
                <AddButton
                  onClick={() => addArrayItem('courses', { name: '', duration: '', fees: { min: 0, max: 0 }, seats: 0, eligibility: '' })}
                  label="Add Course"
                />
              </div>

              {formData.courses.map((course, i) => (
                <div key={i} className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
                  <div className="flex items-center justify-between px-5 py-3 bg-slate-50 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-primary-600 text-white text-[10px] font-bold flex items-center justify-center">{i + 1}</span>
                      <span className="text-sm font-bold text-slate-700">{course.name || 'New Course'}</span>
                    </div>
                    <RemoveButton onClick={() => removeArrayItem('courses', i)} />
                  </div>
                  <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <Label required>Course Name</Label>
                      <Input value={course.name} onChange={(e) => handleArrayChange('courses', i, e.target.value, 'name')} placeholder="e.g. B.Tech Computer Science" />
                    </div>
                    <div>
                      <Label>Duration</Label>
                      <Input value={course.duration} onChange={(e) => handleArrayChange('courses', i, e.target.value, 'duration')} placeholder="e.g. 4 Years" />
                    </div>
                    <div>
                      <Label>Total Seats</Label>
                      <Input type="number" value={course.seats}
                        onChange={(e) => { const n = [...formData.courses]; n[i].seats = parseInt(e.target.value) || 0; setFormData({ ...formData, courses: n }); }}
                        placeholder="e.g. 120" />
                    </div>
                    <div>
                      <Label>Min Fees (₹/year)</Label>
                      <Input type="number" value={course.fees.min}
                        onChange={(e) => { const n = [...formData.courses]; n[i].fees.min = parseInt(e.target.value) || 0; setFormData({ ...formData, courses: n }); }}
                        placeholder="e.g. 80000" />
                    </div>
                    <div>
                      <Label>Max Fees (₹/year)</Label>
                      <Input type="number" value={course.fees.max}
                        onChange={(e) => { const n = [...formData.courses]; n[i].fees.max = parseInt(e.target.value) || 0; setFormData({ ...formData, courses: n }); }}
                        placeholder="e.g. 150000" />
                    </div>
                    <div className="md:col-span-2">
                      <Label>Eligibility Criteria</Label>
                      <Input value={course.eligibility} onChange={(e) => handleArrayChange('courses', i, e.target.value, 'eligibility')} placeholder="e.g. 12th with PCM, JEE Main qualified" />
                    </div>
                  </div>
                </div>
              ))}

              {formData.courses.length === 0 && (
                <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl py-12 text-center">
                  <BookOpen size={32} className="mx-auto text-slate-300 mb-3" />
                  <p className="text-sm text-slate-400 font-semibold">No courses added yet</p>
                  <p className="text-xs text-slate-400 mt-1">Click "Add Course" to get started</p>
                </div>
              )}
            </div>
          )}

          {/* ══ PLACEMENTS ═════════════════════════════════ */}
          {activeTab === 'placements' && (
            <div className="space-y-5">
              <SectionCard icon={TrendingUp} title="Placement Statistics" subtitle="Annual placement data" accent="emerald">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-emerald-50/50 rounded-xl p-4 text-center border border-emerald-100">
                    <Label>Average Package (₹)</Label>
                    <Input type="number" name="placements.averagePackage" value={formData.placements.averagePackage} onChange={handleChange} placeholder="850000" className="text-center font-bold text-emerald-700 bg-white mt-2 border border-emerald-200" />
                    <p className="text-[10px] text-emerald-500 mt-1 font-semibold">Annual CTC</p>
                  </div>
                  <div className="bg-blue-50/50 rounded-xl p-4 text-center border border-blue-100">
                    <Label>Highest Package (₹)</Label>
                    <Input type="number" name="placements.highestPackage" value={formData.placements.highestPackage} onChange={handleChange} placeholder="4500000" className="text-center font-bold text-blue-700 bg-white mt-2 border border-blue-200" />
                    <p className="text-[10px] text-blue-500 mt-1 font-semibold">Annual CTC</p>
                  </div>
                  <div className="bg-amber-50/50 rounded-xl p-4 text-center border border-amber-100">
                    <Label>Placement %</Label>
                    <Input type="number" name="placements.placementPercentage" value={formData.placements.placementPercentage} onChange={handleChange} placeholder="95" className="text-center font-bold text-amber-700 bg-white mt-2 border border-amber-200" max={100} min={0} />
                    <p className="text-[10px] text-amber-500 mt-1 font-semibold">of eligible students</p>
                  </div>
                </div>

                <div className="mt-4">
                  <Label>Placement Description</Label>
                  <Textarea name="placements.description" value={formData.placements.description} onChange={handleChange} rows={3} placeholder="Describe placement highlights, industry connections, companies visiting campus..." />
                </div>
              </SectionCard>

              <SectionCard icon={Users} title="Top Recruiters" subtitle="Companies that hire from this college" accent="blue">
                <div className="space-y-3">
                  <div className="flex flex-wrap gap-2">
                    {formData.placements.topRecruiters.map((r, i) => (
                      <div key={i} className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5">
                        <Input
                          value={r}
                          onChange={(e) => handleNestedArrayChange('placements', 'topRecruiters', i, e.target.value)}
                          placeholder="Company name"
                          className="border-0 bg-transparent p-0 text-xs font-bold text-slate-700 focus:ring-0 w-24"
                        />
                        <RemoveButton onClick={() => removeNestedArrayItem('placements', 'topRecruiters', i)} />
                      </div>
                    ))}
                  </div>
                  <AddButton onClick={() => addNestedArrayItem('placements', 'topRecruiters', '')} label="Add Recruiter" />
                </div>
              </SectionCard>
            </div>
          )}

          {/* ══ FACILITIES ═════════════════════════════════ */}
          {activeTab === 'facilities' && (
            <div className="space-y-5">
              <SectionCard icon={Wrench} title="Campus Facilities" subtitle="Toggle available facilities" accent="purple">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {Object.keys(formData.facilities).map(f => (
                    <FacilityToggle
                      key={f}
                      label={FACILITY_LABELS[f] || f}
                      checked={formData.facilities[f]}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        facilities: { ...prev.facilities, [f]: e.target.checked }
                      }))}
                    />
                  ))}
                </div>

                {/* Visual Summary */}
                <div className="mt-5 pt-4 border-t border-slate-100">
                  <p className="text-xs font-bold text-slate-500 mb-3 uppercase tracking-wide">
                    {Object.values(formData.facilities).filter(Boolean).length} of {Object.keys(formData.facilities).length} facilities enabled
                  </p>
                  <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-primary-500 to-emerald-400 rounded-full transition-all duration-500"
                      style={{ width: `${(Object.values(formData.facilities).filter(Boolean).length / Object.keys(formData.facilities).length) * 100}%` }}
                    />
                  </div>
                </div>
              </SectionCard>
            </div>
          )}

          {/* ══ FAQs ═══════════════════════════════════════ */}
          {activeTab === 'faqs' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-800">Frequently Asked Questions</h3>
                  <p className="text-xs text-slate-400 mt-0.5">Common questions students ask about this college</p>
                </div>
                <AddButton onClick={() => addArrayItem('faqs', { question: '', answer: '' })} label="Add FAQ" />
              </div>

              {formData.faqs.map((faq, i) => (
                <div key={i} className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
                  <div className="flex items-center justify-between px-5 py-3 bg-amber-50/50 border-b border-amber-100">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-amber-500 text-white text-[10px] font-bold flex items-center justify-center">Q{i + 1}</span>
                      <span className="text-xs font-bold text-amber-700 truncate">{faq.question || 'New Question'}</span>
                    </div>
                    <RemoveButton onClick={() => removeArrayItem('faqs', i)} />
                  </div>
                  <div className="p-5 space-y-3">
                    <div>
                      <Label required>Question</Label>
                      <Input
                        value={faq.question}
                        onChange={(e) => handleArrayChange('faqs', i, e.target.value, 'question')}
                        placeholder="e.g. What is the average placement package?"
                      />
                    </div>
                    <div>
                      <Label required>Answer</Label>
                      <Textarea
                        value={faq.answer}
                        onChange={(e) => handleArrayChange('faqs', i, e.target.value, 'answer')}
                        rows={3}
                        placeholder="Provide a detailed and helpful answer..."
                      />
                    </div>
                  </div>
                </div>
              ))}

              {formData.faqs.length === 0 && (
                <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl py-12 text-center">
                  <HelpCircle size={32} className="mx-auto text-slate-300 mb-3" />
                  <p className="text-sm text-slate-400 font-semibold">No FAQs added yet</p>
                </div>
              )}
            </div>
          )}

          {/* ══ CONTACT ════════════════════════════════════ */}
          {activeTab === 'contact' && (
            <div className="space-y-5">
              <SectionCard icon={Globe} title="Online Presence" subtitle="Website and email contact" accent="blue">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Official Website</Label>
                    <div className="relative">
                      <Globe size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 animate-pulse" />
                      <Input type="url" name="contact.website" value={formData.contact.website} onChange={handleChange} placeholder="https://college.ac.in" className="pl-9" />
                    </div>
                  </div>
                  <div>
                    <Label>Email Address</Label>
                    <div className="relative">
                      <Mail size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                      <Input type="email" name="contact.email" value={formData.contact.email} onChange={handleChange} placeholder="info@college.ac.in" className="pl-9" />
                    </div>
                  </div>
                </div>
              </SectionCard>

              <SectionCard icon={Phone} title="Phone Numbers" subtitle="Add multiple contact numbers" accent="emerald">
                <div className="space-y-3">
                  {formData.contact.phone.map((p, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-400 shrink-0 w-5 text-right">{i + 1}.</span>
                      <div className="relative flex-1">
                        <Phone size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                        <Input type="tel" value={p} onChange={(e) => handleNestedArrayChange('contact', 'phone', i, e.target.value)} placeholder="+91 XXXXX XXXXX" className="pl-9" />
                      </div>
                      <RemoveButton onClick={() => removeNestedArrayItem('contact', 'phone', i)} />
                    </div>
                  ))}
                  <AddButton onClick={() => addNestedArrayItem('contact', 'phone', '')} label="Add Phone" />
                </div>
              </SectionCard>
            </div>
          )}
        </form>
      </div>

      {/* ─── Footer Actions ──────────────────────────────── */}
      <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 border-t border-slate-100 bg-slate-50/60 shrink-0">
        <div className="hidden sm:block text-xs text-slate-400">
          Tab <span className="font-bold text-slate-600">{tabs.findIndex(t => t.id === activeTab) + 1}</span> of {tabs.length}
          {' — '}<span className="font-bold text-slate-600 capitalize">{tabs.find(t => t.id === activeTab)?.label}</span>
        </div>
        <div className="flex items-center gap-1.5 sm:gap-3 w-full sm:w-auto justify-end">
          {activeTab !== tabs[0].id && (
            <button type="button"
              onClick={() => setActiveTab(tabs[tabs.findIndex(t => t.id === activeTab) - 1].id)}
              className="text-xs font-bold text-slate-500 hover:text-slate-700 px-3 py-2 sm:px-4 sm:py-2.5 rounded-xl border border-slate-200 hover:border-slate-300 bg-white transition-all cursor-pointer">
              ← Back
            </button>
          )}
          {activeTab !== tabs[tabs.length - 1].id ? (
            <button type="button"
              onClick={() => setActiveTab(tabs[tabs.findIndex(t => t.id === activeTab) + 1].id)}
              className="text-xs font-bold text-primary-600 hover:text-primary-700 px-3 py-2 sm:px-4 sm:py-2.5 rounded-xl border border-primary-200 hover:border-primary-300 bg-primary-50 hover:bg-primary-100 transition-all cursor-pointer">
              Next →
            </button>
          ) : null}
          <button type="button" onClick={onClose}
            className="text-xs font-semibold text-slate-500 hover:text-slate-700 px-3 py-2 sm:px-4 sm:py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 transition-all cursor-pointer">
            Cancel
          </button>
          <button onClick={handleSubmit} disabled={loading}
            className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-bold text-white bg-primary-600 hover:bg-primary-700 disabled:opacity-60 px-4 py-2 sm:px-6 sm:py-2.5 rounded-xl transition-all shadow-md shadow-primary-600/20 cursor-pointer">
            {loading
              ? <><span className="w-3.5 h-3.5 sm:w-4 sm:h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Saving...</>
              : <><Save size={14} /> {college ? 'Update' : 'Create'}</>
            }
          </button>
        </div>
      </div>
    </div>
  );
};

export default CollegeForm;
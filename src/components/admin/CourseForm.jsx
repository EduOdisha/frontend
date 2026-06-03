import { useState } from 'react';
import {
  X, Save, Plus, Trash2, Image as ImageIcon,
  BookOpen, Info, GraduationCap, Briefcase,
  DollarSign, CheckCircle, Star, TrendingUp,
  FileText, Layers, Clock, Users,
} from 'lucide-react';
import { toast } from 'react-hot-toast';

// ─── Shared UI Components ──────────────────────────────────────────────────
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
    purple:  'bg-purple-50 text-purple-600 border-purple-100/50',
    emerald: 'bg-emerald-50 text-emerald-600 border-emerald-100/50',
    amber:   'bg-amber-50 text-amber-600 border-amber-100/50',
    blue:    'bg-blue-50 text-blue-600 border-blue-100/50',
    rose:    'bg-rose-50 text-rose-600 border-rose-100/50',
    slate:   'bg-slate-100 text-slate-600 border-slate-200/50',
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

const Chip = ({ value, onChange, onRemove, placeholder }) => (
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

const SalaryBar = ({ label, value, max, color }) => {
  const pct = max > 0 ? Math.min((value / max) * 100, 100) : 0;
  const gradients = {
    'text-emerald-600': 'from-emerald-400 to-emerald-600',
    'text-blue-600': 'from-blue-400 to-indigo-600',
    'text-purple-600': 'from-purple-400 to-purple-600',
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

// ─── Tab config ────────────────────────────────────────────────────────────
const TABS = [
  { id: 'basic',    label: 'Basic Info',    icon: BookOpen },
  { id: 'content',  label: 'Curriculum & Info',  icon: FileText },
  { id: 'career',   label: 'Career Details',   icon: Briefcase },
  { id: 'fees',     label: 'Fees & Salaries', icon: DollarSign },
];

// ─── Main CourseForm ────────────────────────────────────────────────────────
const CourseForm = ({ course, onSubmit, onClose, loading }) => {
  const parseArr = (v) => (Array.isArray(v) ? v : typeof v === 'string' && v ? v.split(',').map(s => s.trim()).filter(Boolean) : ['']);

  const [formData, setFormData] = useState({
    name:            course?.name            || '',
    shortName:       course?.shortName       || '',
    level:           course?.level           || 'UG',
    stream:          course?.stream          || 'Technology',
    duration:        course?.duration        || '',
    image:           { url: course?.image?.url || '' },
    description:     course?.description     || '',
    overview:        course?.overview        || '',
    eligibility:     course?.eligibility     || '',
    admissionProcess:course?.admissionProcess|| '',
    careerScope:     course?.careerScope     || '',
    entranceExams:   parseArr(course?.entranceExams),
    jobRoles:        parseArr(course?.jobRoles),
    skills:          parseArr(course?.skills),
    fees:            { min: course?.fees?.min || 0, max: course?.fees?.max || 0 },
    averageSalary:   {
      entry:  course?.averageSalary?.entry  || 0,
      mid:    course?.averageSalary?.mid    || 0,
      senior: course?.averageSalary?.senior || 0,
    },
    isActive:   course?.isActive   !== false,
    isFeatured: course?.isFeatured || false,
  });

  const [activeTab, setActiveTab] = useState('basic');

  /* ── Handlers ── */
  const set = (field, value) => setFormData(p => ({ ...p, [field]: value }));

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(p => ({ ...p, [parent]: { ...p[parent], [child]: type === 'checkbox' ? checked : value } }));
    } else {
      setFormData(p => ({ ...p, [name]: type === 'checkbox' ? checked : value }));
    }
  };

  const arrChange = (field, i, v) => {
    const a = [...formData[field]]; a[i] = v; set(field, a);
  };
  const arrAdd    = (field)    => set(field, [...formData[field], '']);
  const arrRemove = (field, i) => set(field, formData[field].filter((_, idx) => idx !== i));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return toast.error('Course name is required');
    onSubmit({
      ...formData,
      entranceExams: formData.entranceExams.filter(Boolean),
      jobRoles:      formData.jobRoles.filter(Boolean),
      skills:        formData.skills.filter(Boolean),
      fees:          { min: Number(formData.fees.min), max: Number(formData.fees.max) },
      averageSalary: {
        entry:  Number(formData.averageSalary.entry),
        mid:    Number(formData.averageSalary.mid),
        senior: Number(formData.averageSalary.senior),
      },
    });
  };

  const maxSalary = Math.max(
    Number(formData.averageSalary.senior) || 0,
    1
  );

  return (
    <div className="flex flex-col h-full bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-100">

      {/* ─── Header ─────────────────────────────────────── */}
      <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-slate-100 shrink-0">
        <div>
          <h2 className="text-lg font-bold text-slate-900">{course ? 'Edit Course' : 'Add New Course'}</h2>
          <p className="text-xs text-slate-400 mt-0.5">Fill in the course details across all sections</p>
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
          {TABS.map(tab => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2.5 px-3 py-2.5 md:py-3 text-xs font-bold rounded-xl transition-all w-auto md:w-full text-left cursor-pointer shrink-0 whitespace-nowrap
                  ${active
                    ? 'bg-primary-600 text-white shadow-md shadow-primary-600/10 font-bold'
                    : 'text-slate-500 hover:bg-slate-100 hover:text-slate-800'
                  }`}
              >
                <Icon size={15} className={`shrink-0 ${active ? 'text-white' : 'text-slate-400'}`} />
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
              <SectionCard icon={BookOpen} title="Course Identity" subtitle="Basic details for the catalog" accent="primary">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <Label required>Full Course Name</Label>
                    <Input
                      name="name" value={formData.name} onChange={handleChange}
                      placeholder="e.g. Bachelor of Technology in Computer Science" required
                    />
                  </div>
                  <div>
                    <Label>Short Name / Acronym</Label>
                    <Input
                      name="shortName" value={formData.shortName} onChange={handleChange}
                      placeholder="e.g. B.Tech CSE"
                    />
                  </div>
                  <div>
                    <Label>Duration</Label>
                    <Input
                      name="duration" value={formData.duration} onChange={handleChange}
                      placeholder="e.g. 4 Years / 2 Years"
                    />
                  </div>
                  <div>
                    <Label required>Level</Label>
                    <Select name="level" value={formData.level} onChange={handleChange}>
                      {['10th', '12th', 'UG', 'PG', 'Diploma', 'Certificate', 'Other'].map(l =>
                        <option key={l} value={l}>{l}</option>
                      )}
                    </Select>
                  </div>
                  <div>
                    <Label required>Stream</Label>
                    <Select name="stream" value={formData.stream} onChange={handleChange}>
                      {['Science', 'Commerce', 'Arts', 'Technology', 'Medical', 'Law', 'Design', 'Vocational', 'Other'].map(s =>
                        <option key={s} value={s}>{s}</option>
                      )}
                    </Select>
                  </div>
                </div>
              </SectionCard>

              {/* Image */}
              <SectionCard icon={ImageIcon} title="Course Thumbnail" subtitle="Representative image for listings" accent="blue">
                <div className="flex items-start gap-5">
                  <div className="flex-1 space-y-3">
                    <Label>Image URL</Label>
                    <Input
                      type="url" name="image.url" value={formData.image?.url || ''} onChange={handleChange}
                      placeholder="https://example.com/course-thumbnail.jpg"
                    />
                    <p className="text-[10px] text-slate-400">Recommended: 16:9 ratio, at least 800×450px</p>
                  </div>
                  {formData.image?.url ? (
                    <div className="w-32 h-20 rounded-xl border border-slate-200 overflow-hidden shrink-0 bg-slate-50">
                      <img src={formData.image.url} alt="Preview"
                        className="w-full h-full object-cover"
                        onError={e => { e.target.style.display = 'none'; }} />
                    </div>
                  ) : (
                    <div className="w-32 h-20 rounded-xl border-2 border-dashed border-slate-200 flex items-center justify-center text-slate-300 shrink-0">
                      <ImageIcon size={22} />
                    </div>
                  )}
                </div>
              </SectionCard>

              {/* Status */}
              <SectionCard icon={CheckCircle} title="Visibility Status" subtitle="Control how this course appears on site" accent="emerald">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { key: 'isActive',   label: 'Active',   desc: 'Visible on site' },
                    { key: 'isFeatured', label: 'Featured', desc: 'Show on homepage' },
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

          {/* ══ CONTENT ════════════════════════════════════ */}
          {activeTab === 'content' && (
            <div className="space-y-5">
              <SectionCard icon={Info} title="Description" subtitle="Brief intro shown in course listing cards" accent="primary">
                <Label>Short Description</Label>
                <Textarea
                  name="description" value={formData.description} onChange={handleChange}
                  rows={3} placeholder="A concise summary of the course — what it covers and who it's for..."
                />
                <p className="text-[10px] text-slate-400 mt-1 text-right">{formData.description.length}/500 chars</p>
              </SectionCard>

              <SectionCard icon={FileText} title="Detailed Overview" subtitle="Full curriculum/course content shown on detail page" accent="purple">
                <Label>Course Overview</Label>
                <Textarea
                  name="overview" value={formData.overview} onChange={handleChange}
                  rows={6} placeholder="Cover semester-wise syllabus, subjects, learning outcomes, lab work, projects..."
                />
              </SectionCard>

              <SectionCard icon={GraduationCap} title="Admission Info" subtitle="Who can apply and how" accent="amber">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Eligibility Criteria</Label>
                    <Textarea
                      name="eligibility" value={formData.eligibility} onChange={handleChange}
                      rows={4} placeholder="e.g. 12th with PCM, minimum 60%&#10;JEE Main qualified students&#10;Age: 17–25 years"
                    />
                  </div>
                  <div>
                    <Label>Admission Process</Label>
                    <Textarea
                      name="admissionProcess" value={formData.admissionProcess} onChange={handleChange}
                      rows={4} placeholder="e.g. 1. Register on college portal&#10;2. Upload documents&#10;3. Appear for counselling&#10;4. Fee payment"
                    />
                  </div>
                </div>
              </SectionCard>

              {/* Entrance Exams */}
              <SectionCard icon={Layers} title="Entrance Exams Accepted" subtitle="Exams students need for this course" accent="rose">
                <div className="space-y-3">
                  <div className="flex flex-wrap gap-2">
                    {formData.entranceExams.map((exam, i) => (
                      <Chip key={i} value={exam}
                        onChange={e => arrChange('entranceExams', i, e.target.value)}
                        onRemove={() => arrRemove('entranceExams', i)}
                        placeholder="e.g. JEE Main"
                      />
                    ))}
                  </div>
                  <AddButton onClick={() => arrAdd('entranceExams')} label="Add Exam" />
                </div>
              </SectionCard>
            </div>
          )}

          {/* ══ CAREER ═════════════════════════════════════ */}
          {activeTab === 'career' && (
            <div className="space-y-5">
              <SectionCard icon={TrendingUp} title="Career Scope" subtitle="Industries and opportunities after this course" accent="emerald">
                <Label>Career Scope Description</Label>
                <Textarea
                  name="careerScope" value={formData.careerScope} onChange={handleChange}
                  rows={5} placeholder="Describe career paths, industries hiring, growth potential, and why this course has a bright future..."
                />
              </SectionCard>

              {/* Job Roles */}
              <SectionCard icon={Briefcase} title="Key Job Roles" subtitle="Common positions graduates get hired for" accent="blue">
                <div className="space-y-3">
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {formData.jobRoles.map((role, i) => (
                      <div key={i} className="flex items-center gap-2 bg-blue-50 border border-blue-100 rounded-xl px-3 py-2">
                        <Briefcase size={11} className="text-blue-400 shrink-0" />
                        <Input
                          value={role}
                          onChange={e => arrChange('jobRoles', i, e.target.value)}
                          placeholder="Job title"
                          className="border-0 bg-transparent p-0 text-xs font-semibold text-blue-700 focus:ring-0"
                        />
                        <RemoveButton onClick={() => arrRemove('jobRoles', i)} />
                      </div>
                    ))}
                  </div>
                  <AddButton onClick={() => arrAdd('jobRoles')} label="Add Job Role" />
                </div>
              </SectionCard>

              {/* Skills */}
              <SectionCard icon={Star} title="Skills Learned" subtitle="Key skills students gain from this course" accent="purple">
                <div className="space-y-3">
                  <div className="flex flex-wrap gap-2">
                    {formData.skills.map((skill, i) => (
                      <div key={i} className="flex items-center gap-1.5 bg-purple-50 border border-purple-100 rounded-full px-3 py-1.5">
                        <Input
                          value={skill}
                          onChange={e => arrChange('skills', i, e.target.value)}
                          placeholder="Skill"
                          className="border-0 bg-transparent p-0 text-xs font-bold text-purple-700 focus:ring-0 w-20"
                        />
                        <RemoveButton onClick={() => arrRemove('skills', i)} />
                      </div>
                    ))}
                  </div>
                  <AddButton onClick={() => arrAdd('skills')} label="Add Skill" />
                </div>
              </SectionCard>
            </div>
          )}

          {/* ══ FEES & SALARY ══════════════════════════════ */}
          {activeTab === 'fees' && (
            <div className="space-y-5">
              {/* Fees */}
              <SectionCard icon={DollarSign} title="Course Fees" subtitle="Annual fee range across institutions" accent="amber">
                <div className="grid grid-cols-2 gap-5">
                  <div className="bg-amber-50 rounded-xl p-4 border border-amber-100 text-center">
                    <p className="text-[10px] font-bold text-amber-500 uppercase tracking-wide mb-2">Minimum Fees</p>
                    <Label>Annual Amount (₹)</Label>
                    <Input
                      type="number" name="fees.min" value={formData.fees.min} onChange={handleChange}
                      placeholder="e.g. 50000" className="text-center font-bold text-amber-700 bg-white mt-1 border border-amber-200"
                    />
                    {Number(formData.fees.min) > 0 && (
                      <p className="text-xs font-bold text-amber-600 mt-2">
                        ₹{(Number(formData.fees.min) / 1000).toFixed(0)}K / year
                      </p>
                    )}
                  </div>
                  <div className="bg-rose-50 rounded-xl p-4 border border-rose-100 text-center">
                    <p className="text-[10px] font-bold text-rose-500 uppercase tracking-wide mb-2">Maximum Fees</p>
                    <Label>Annual Amount (₹)</Label>
                    <Input
                      type="number" name="fees.max" value={formData.fees.max} onChange={handleChange}
                      placeholder="e.g. 200000" className="text-center font-bold text-rose-700 bg-white mt-1 border border-rose-200"
                    />
                    {Number(formData.fees.max) > 0 && (
                      <p className="text-xs font-bold text-rose-600 mt-2">
                        ₹{(Number(formData.fees.max) / 1000).toFixed(0)}K / year
                      </p>
                    )}
                  </div>
                </div>
                {Number(formData.fees.min) > 0 && Number(formData.fees.max) > 0 && (
                  <div className="mt-4 bg-slate-50 rounded-xl p-3 border border-slate-100">
                    <p className="text-xs text-slate-500 font-semibold text-center">
                      Fee Range: <span className="text-slate-800 font-bold">
                        ₹{(Number(formData.fees.min) / 1000).toFixed(0)}K – ₹{(Number(formData.fees.max) / 1000).toFixed(0)}K per year
                      </span>
                    </p>
                  </div>
                )}
              </SectionCard>

              {/* Salary */}
              <SectionCard icon={TrendingUp} title="Average Salary After Course" subtitle="Expected salary by experience level (in LPA)" accent="emerald">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
                  {[
                    { key: 'entry',  label: 'Entry Level', placeholder: '4', color: 'bg-emerald-50 border-emerald-100', textColor: 'text-emerald-700' },
                    { key: 'mid',    label: 'Mid Level',   placeholder: '8', color: 'bg-blue-50 border-blue-100',    textColor: 'text-blue-700' },
                    { key: 'senior', label: 'Senior Level', placeholder: '15', color: 'bg-purple-50 border-purple-100', textColor: 'text-purple-700' },
                  ].map(({ key, label, placeholder, color, textColor }) => (
                    <div key={key} className={`rounded-xl p-4 border text-center ${color}`}>
                      <p className={`text-[10px] font-bold uppercase tracking-wide mb-2 ${textColor}`}>{label}</p>
                      <Input
                        type="number"
                        name={`averageSalary.${key}`}
                        value={formData.averageSalary[key]}
                        onChange={handleChange}
                        placeholder={placeholder}
                        className={`text-center font-extrabold bg-white border-0 ${textColor}`}
                      />
                      {Number(formData.averageSalary[key]) > 0 && (
                        <p className={`text-xs font-bold mt-2 ${textColor}`}>
                          ₹{formData.averageSalary[key]} LPA
                        </p>
                      )}
                    </div>
                  ))}
                </div>

                {/* Visual salary bars */}
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 space-y-3">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-3">Salary Progression</p>
                  <SalaryBar label="Entry Level"  value={Number(formData.averageSalary.entry)}  max={maxSalary} color="text-emerald-600" />
                  <SalaryBar label="Mid Level"    value={Number(formData.averageSalary.mid)}    max={maxSalary} color="text-blue-600" />
                  <SalaryBar label="Senior Level" value={Number(formData.averageSalary.senior)} max={maxSalary} color="text-purple-600" />
                </div>
              </SectionCard>
            </div>
          )}
        </form>
      </div>

      {/* ─── Footer ─────────────────────────────────────── */}
      <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 border-t border-slate-100 bg-slate-50/60 shrink-0">
        <div className="hidden sm:block text-xs text-slate-400">
          Tab <span className="font-bold text-slate-600">{TABS.findIndex(t => t.id === activeTab) + 1}</span> of {TABS.length}
          {' — '}<span className="font-bold text-slate-600">{TABS.find(t => t.id === activeTab)?.label}</span>
        </div>
        <div className="flex items-center gap-1.5 sm:gap-3 w-full sm:w-auto justify-end">
          {activeTab !== TABS[0].id && (
            <button type="button"
              onClick={() => setActiveTab(TABS[TABS.findIndex(t => t.id === activeTab) - 1].id)}
              className="text-xs font-bold text-slate-500 hover:text-slate-700 px-3 py-2 sm:px-4 sm:py-2.5 rounded-xl border border-slate-200 hover:border-slate-300 bg-white transition-all cursor-pointer">
              ← Back
            </button>
          )}
          {activeTab !== TABS[TABS.length - 1].id && (
            <button type="button"
              onClick={() => setActiveTab(TABS[TABS.findIndex(t => t.id === activeTab) + 1].id)}
              className="text-xs font-bold text-primary-600 px-3 py-2 sm:px-4 sm:py-2.5 rounded-xl border border-primary-200 bg-primary-50 hover:bg-primary-100 transition-all cursor-pointer">
              Next →
            </button>
          )}
          <button type="button" onClick={onClose}
            className="text-xs font-semibold text-slate-500 hover:text-slate-700 px-3 py-2 sm:px-4 sm:py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 transition-all cursor-pointer">
            Cancel
          </button>
          <button onClick={handleSubmit} disabled={loading}
            className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-bold text-white bg-primary-600 hover:bg-primary-700 disabled:opacity-60 px-4 py-2 sm:px-6 sm:py-2.5 rounded-xl transition-all shadow-md shadow-primary-600/20 cursor-pointer">
            {loading
              ? <><span className="w-3.5 h-3.5 sm:w-4 sm:h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Saving...</>
              : <><Save size={14} />{course ? 'Update' : 'Create'}</>
            }
          </button>
        </div>
      </div>
    </div>
  );
};

export default CourseForm;
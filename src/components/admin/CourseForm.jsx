import { useState } from 'react';
import { X, Save, BookOpen, FileText, Briefcase, DollarSign } from 'lucide-react';
import { toast } from 'react-hot-toast';

import BasicTab from './course-form/BasicTab';
import CurriculumTab from './course-form/CurriculumTab';
import CareerTab from './course-form/CareerTab';
import FeesSalaryTab from './course-form/FeesSalaryTab';

const TABS = [
  { id: 'basic',    label: 'Basic Info',    icon: BookOpen },
  { id: 'content',  label: 'Curriculum & Info',  icon: FileText },
  { id: 'career',   label: 'Career Details',   icon: Briefcase },
  { id: 'fees',     label: 'Fees & Salaries', icon: DollarSign },
];

const CourseForm = ({ course, onSubmit, onClose, loading }) => {
  const parseArr = (v) => (Array.isArray(v) ? v : typeof v === 'string' && v ? v.split(',').map(s => s.trim()).filter(Boolean) : ['']);

  const [formData, setFormData] = useState({
    name:            course?.name            || '',
    shortName:       course?.shortName       || '',
    level:           course?.level           || 'UG',
    stream:          course?.stream          || 'Engineering',
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

  const tabProps = {
    formData,
    handleChange,
    setFormData,
    arrChange,
    arrAdd,
    arrRemove,
  };

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
          {activeTab === 'basic' && <BasicTab {...tabProps} />}
          {activeTab === 'content' && <CurriculumTab {...tabProps} />}
          {activeTab === 'career' && <CareerTab {...tabProps} />}
          {activeTab === 'fees' && <FeesSalaryTab {...tabProps} />}
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
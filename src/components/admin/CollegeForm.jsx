import { useState } from 'react';
import { X, Save } from 'lucide-react';
import { toast } from 'react-hot-toast';

import { TAB_ICONS } from './college-form/TAB_ICONS'; // Let's create this small icon mapping file or define it here
import BasicTab from './college-form/BasicTab';
import ImagesTab from './college-form/ImagesTab';
import LocationTab from './college-form/LocationTab';
import AdmissionsTab from './college-form/AdmissionsTab';
import CoursesTab from './college-form/CoursesTab';
import PlacementsTab from './college-form/PlacementsTab';
import FacilitiesTab from './college-form/FacilitiesTab';
import FaqsTab from './college-form/FaqsTab';
import ContactTab from './college-form/ContactTab';

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
    placements: { averagePackage: '', highestPackage: '', placementPercentage: '', description: '', topRecruiters: [''] },
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

  const tabProps = {
    formData,
    handleChange,
    handleArrayChange,
    addArrayItem,
    removeArrayItem,
    handleNestedArrayChange,
    addNestedArrayItem,
    removeNestedArrayItem,
    setFormData,
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
          {activeTab === 'basic' && <BasicTab {...tabProps} />}
          {activeTab === 'images' && <ImagesTab {...tabProps} />}
          {activeTab === 'location' && <LocationTab {...tabProps} />}
          {activeTab === 'admissions' && <AdmissionsTab {...tabProps} />}
          {activeTab === 'courses' && <CoursesTab {...tabProps} />}
          {activeTab === 'placements' && <PlacementsTab {...tabProps} />}
          {activeTab === 'facilities' && <FacilitiesTab {...tabProps} />}
          {activeTab === 'faqs' && <FaqsTab {...tabProps} />}
          {activeTab === 'contact' && <ContactTab {...tabProps} />}
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
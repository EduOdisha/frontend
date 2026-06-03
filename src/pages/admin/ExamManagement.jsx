import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import api from '../../utils/api';
import { Plus, Search, Edit2, Trash2, Eye, CheckCircle, XCircle, AlertCircle, FileText } from 'lucide-react';
import { toast } from 'react-hot-toast';

function toDateStr(val) {
  return val ? new Date(val).toISOString().split('T')[0] : '';
}

function ExamFormModal({ exam, onClose, onSubmit, loading }) {
  const [form, setForm] = useState({
    name: exam?.name || '',
    shortName: exam?.shortName || exam?.fullName || '',
    type: exam?.type || 'State',
    level: exam?.level || 'UG',
    conductedBy: exam?.conductedBy || exam?.conductingBody || '',
    description: exam?.description || '',
    eligibility: typeof exam?.eligibility === 'object' ? {
      age: exam?.eligibility?.age || '',
      qualification: exam?.eligibility?.qualification || '',
      percentage: exam?.eligibility?.percentage || '',
      domicile: exam?.eligibility?.domicile || '',
    } : {
      age: '',
      qualification: typeof exam?.eligibility === 'string' ? exam.eligibility : '',
      percentage: '',
      domicile: '',
    },
    officialWebsite: exam?.officialWebsite || '',
    image: { url: exam?.image?.url || '' },
    applicationFee: {
      general: exam?.applicationFee?.general || 0,
      sc_st: exam?.applicationFee?.sc_st || 0,
    },
    applicationLink: exam?.applicationLink || '',
    syllabusLink: exam?.syllabusLink || '',
    examDates: {
      applicationStart: toDateStr(exam?.examDates?.applicationStart || exam?.applicationStartDate),
      applicationEnd: toDateStr(exam?.examDates?.applicationEnd || exam?.applicationEndDate),
      examDate: toDateStr(exam?.examDates?.examDate || exam?.examDate),
    },
    isActive: exam?.isActive !== false,
    isFeatured: exam?.isFeatured || false,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name) return toast.error('Exam name is required');
    onSubmit({
      ...form,
      applicationFee: {
        general: Number(form.applicationFee.general) || 0,
        sc_st: Number(form.applicationFee.sc_st) || 0,
      }
    });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-slate-100 px-6 py-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900">{exam ? 'Edit Exam' : 'Add New Exam'}</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-2xl leading-none">&times;</button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label-base">Exam Name *</label>
              <input className="input-base" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="e.g. OJEE 2026" required />
            </div>
            <div>
              <label className="label-base">Short Name</label>
              <input className="input-base" value={form.shortName} onChange={e => setForm(f => ({ ...f, shortName: e.target.value }))} placeholder="e.g. OJEE" />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="label-base">Type</label>
              <select className="input-base" value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))}>
                {['State', 'National', 'University', 'Government Job', 'Banking', 'Other'].map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="label-base">Level</label>
              <select className="input-base" value={form.level} onChange={e => setForm(f => ({ ...f, level: e.target.value }))}>
                {['10th', '12th', 'UG', 'PG', 'Diploma', 'Any'].map(l => <option key={l}>{l}</option>)}
              </select>
            </div>
            <div>
              <label className="label-base">Conducting Body</label>
              <input className="input-base" value={form.conductedBy} onChange={e => setForm(f => ({ ...f, conductedBy: e.target.value }))} placeholder="OJEE Board" />
            </div>
          </div>
          <div>
            <label className="label-base">Description</label>
            <textarea className="input-base" rows={3} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label-base">Exam Logo/Image URL</label>
              <input type="url" className="input-base" value={form.image?.url || ''} onChange={e => setForm(f => ({ ...f, image: { ...f.image, url: e.target.value } }))} placeholder="https://example.com/logo.png" />
            </div>
            {form.image?.url && (
              <div className="flex items-end">
                <div className="w-16 h-16 rounded-xl border border-slate-200 p-1 bg-slate-50 flex items-center justify-center overflow-hidden mb-1">
                  <img src={form.image.url} alt="Exam Logo Preview" className="w-full h-full object-contain" onError={(e) => { e.target.style.display = 'none'; }} />
                </div>
              </div>
            )}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label-base">Eligibility - Qualification</label>
              <input className="input-base" value={form.eligibility.qualification} onChange={e => setForm(f => ({ ...f, eligibility: { ...f.eligibility, qualification: e.target.value } }))} placeholder="e.g. 10+2 with PCM" />
            </div>
            <div>
              <label className="label-base">Eligibility - Age Limit</label>
              <input className="input-base" value={form.eligibility.age} onChange={e => setForm(f => ({ ...f, eligibility: { ...f.eligibility, age: e.target.value } }))} placeholder="e.g. Min 17 years" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label-base">Eligibility - Min Percentage</label>
              <input className="input-base" value={form.eligibility.percentage} onChange={e => setForm(f => ({ ...f, eligibility: { ...f.eligibility, percentage: e.target.value } }))} placeholder="e.g. 50% for General" />
            </div>
            <div>
              <label className="label-base">Eligibility - Domicile</label>
              <input className="input-base" value={form.eligibility.domicile} onChange={e => setForm(f => ({ ...f, eligibility: { ...f.eligibility, domicile: e.target.value } }))} placeholder="e.g. Odisha" />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="label-base">App. Start</label>
              <input type="date" className="input-base" value={form.examDates.applicationStart} onChange={e => setForm(f => ({ ...f, examDates: { ...f.examDates, applicationStart: e.target.value } }))} />
            </div>
            <div>
              <label className="label-base">App. End</label>
              <input type="date" className="input-base" value={form.examDates.applicationEnd} onChange={e => setForm(f => ({ ...f, examDates: { ...f.examDates, applicationEnd: e.target.value } }))} />
            </div>
            <div>
              <label className="label-base">Exam Date</label>
              <input type="date" className="input-base" value={form.examDates.examDate} onChange={e => setForm(f => ({ ...f, examDates: { ...f.examDates, examDate: e.target.value } }))} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label-base">Application Fee (General/OBC)</label>
              <input type="number" className="input-base" value={form.applicationFee.general} onChange={e => setForm(f => ({ ...f, applicationFee: { ...f.applicationFee, general: e.target.value } }))} placeholder="1000" min="0" />
            </div>
            <div>
              <label className="label-base">Application Fee (SC/ST/PWD)</label>
              <input type="number" className="input-base" value={form.applicationFee.sc_st} onChange={e => setForm(f => ({ ...f, applicationFee: { ...f.applicationFee, sc_st: e.target.value } }))} placeholder="500" min="0" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label-base">Application Link (Apply Now)</label>
              <input type="url" className="input-base" value={form.applicationLink} onChange={e => setForm(f => ({ ...f, applicationLink: e.target.value }))} placeholder="https://ojee.nic.in/apply" />
            </div>
            <div>
              <label className="label-base">Syllabus PDF Link</label>
              <input type="url" className="input-base" value={form.syllabusLink} onChange={e => setForm(f => ({ ...f, syllabusLink: e.target.value }))} placeholder="https://ojee.nic.in/syllabus.pdf" />
            </div>
          </div>
          <div>
            <label className="label-base">Official Website</label>
            <input type="url" className="input-base" value={form.officialWebsite} onChange={e => setForm(f => ({ ...f, officialWebsite: e.target.value }))} placeholder="https://ojee.nic.in" />
          </div>
          <div className="flex gap-6 items-center pt-1">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.isActive} onChange={e => setForm(f => ({ ...f, isActive: e.target.checked }))} className="w-4 h-4 rounded border-slate-300 text-primary-600" />
              <span className="text-sm font-medium text-slate-700">Mark as Active</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.isFeatured} onChange={e => setForm(f => ({ ...f, isFeatured: e.target.checked }))} className="w-4 h-4 rounded border-slate-300 text-primary-600" />
              <span className="text-sm font-medium text-slate-700">Mark as Featured (Important)</span>
            </label>
          </div>
          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={loading} className="btn-primary py-2.5 px-6 flex-1">
              {loading ? 'Saving…' : exam ? 'Update Exam' : 'Add Exam'}
            </button>
            <button type="button" onClick={onClose} className="btn-secondary py-2.5 px-5">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function ExamManagement() {
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selected, setSelected] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const qc = useQueryClient();

  useEffect(() => {
    if (searchParams.get('add') === 'true') {
      setSelected(null);
      setShowModal(true);
      setSearchParams({}, { replace: true });
    }
  }, [searchParams]);

  const { data, isLoading } = useQuery({
    queryKey: ['admin-exams', search],
    queryFn: () => api.get(`/exams?search=${search}&limit=100&admin=true`).then(r => r.data),
  });

  const createMutation = useMutation({
    mutationFn: (d) => api.post('/exams', d),
    onSuccess: () => { qc.invalidateQueries(['admin-exams']); toast.success('Exam added'); setShowModal(false); },
    onError: (e) => toast.error(e.response?.data?.message || 'Failed'),
  });

  const updateMutation = useMutation({
    mutationFn: (d) => api.put(`/exams/${d._id}`, d),
    onSuccess: () => { qc.invalidateQueries(['admin-exams']); toast.success('Exam updated'); setShowModal(false); setSelected(null); },
    onError: (e) => toast.error(e.response?.data?.message || 'Failed'),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => api.delete(`/exams/${id}`),
    onSuccess: () => { qc.invalidateQueries(['admin-exams']); toast.success('Exam deleted'); },
    onError: (e) => toast.error(e.response?.data?.message || 'Failed'),
  });

  const handleSubmit = (form) => {
    const cleaned = {
      ...form,
      examDates: Object.fromEntries(
        Object.entries(form.examDates || {}).filter(([, v]) => v !== '')
      ),
    };
    if (selected) updateMutation.mutate({ ...cleaned, _id: selected._id });
    else createMutation.mutate(cleaned);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Exam Management</h1>
          <p className="text-slate-500 text-sm mt-0.5">Add and manage entrance exams listed on the platform.</p>
        </div>
        <button onClick={() => { setSelected(null); setShowModal(true); }} className="btn-primary flex items-center gap-2">
          <Plus size={17} /> Add Exam
        </button>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input type="text" placeholder="Search exams…" value={search} onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 text-sm border border-slate-200 rounded-lg outline-none focus:border-primary-400 bg-white" />
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="table-base">
            <thead><tr><th>Exam</th><th>Type</th><th>Conducting Body</th><th>Exam Date</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              {isLoading ? [1,2,3].map(i => (
                <tr key={i} className="animate-pulse">
                  {[...Array(6)].map((_, j) => <td key={j}><div className="skeleton h-4 w-24 rounded" /></td>)}
                </tr>
              )) : data?.data?.length > 0 ? data.data.map(exam => (
                <tr key={exam._id}>
                  <td>
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-primary-50 rounded-lg flex items-center justify-center overflow-hidden shrink-0 border border-slate-100">
                        {exam.image?.url ? (
                          <img src={exam.image.url} alt={exam.name} className="w-full h-full object-contain p-1" />
                        ) : (
                          <FileText size={14} className="text-primary-600" />
                        )}
                      </div>
                      <div>
                        <p className="font-bold text-sm text-slate-900">{exam.name}</p>
                        <p className="text-xs text-slate-400">{exam.shortName || exam.fullName}</p>
                      </div>
                    </div>
                  </td>
                  <td><span className="badge badge-blue">{exam.type}</span></td>
                  <td className="text-slate-600 text-sm">{exam.conductedBy || exam.conductingBody || '—'}</td>
                  <td className="text-slate-600 text-sm">{exam.examDates?.examDate ? new Date(exam.examDates.examDate).toLocaleDateString('en-IN') : (exam.examDate ? new Date(exam.examDate).toLocaleDateString('en-IN') : '—')}</td>
                  <td>
                    {exam.isActive !== false
                      ? <span className="flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full w-fit"><CheckCircle size={11} /> Active</span>
                      : <span className="flex items-center gap-1 text-xs font-bold text-slate-400 bg-slate-100 px-2.5 py-1 rounded-full w-fit"><XCircle size={11} /> Inactive</span>
                    }
                  </td>
                  <td>
                    <div className="flex items-center gap-1">
                      <button onClick={() => { setSelected(exam); setShowModal(true); }} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"><Edit2 size={15} /></button>
                      <button onClick={() => { if (window.confirm('Delete this exam?')) deleteMutation.mutate(exam._id); }} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"><Trash2 size={15} /></button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr><td colSpan={6} className="py-12 text-center"><AlertCircle size={36} className="mx-auto text-slate-200 mb-2" /><p className="text-slate-400 text-sm">No exams found.</p></td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <ExamFormModal exam={selected} onClose={() => { setShowModal(false); setSelected(null); }}
          onSubmit={handleSubmit} loading={createMutation.isPending || updateMutation.isPending} />
      )}
    </div>
  );
}

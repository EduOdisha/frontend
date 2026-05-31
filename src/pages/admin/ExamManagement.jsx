import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import api from '../../utils/api';
import { Plus, Search, Edit2, Trash2, Eye, CheckCircle, XCircle, AlertCircle, FileText } from 'lucide-react';
import { toast } from 'react-hot-toast';

const EXAM_TYPES = ['Engineering', 'Medical', 'Management', 'Government Job', 'Banking', 'Other'];

function ExamFormModal({ exam, onClose, onSubmit, loading }) {
  const [form, setForm] = useState({
    name: exam?.name || '',
    fullName: exam?.fullName || '',
    type: exam?.type || 'Engineering',
    conductingBody: exam?.conductingBody || '',
    description: exam?.description || '',
    eligibility: exam?.eligibility || '',
    applicationStartDate: exam?.applicationStartDate?.split('T')[0] || '',
    applicationEndDate: exam?.applicationEndDate?.split('T')[0] || '',
    examDate: exam?.examDate?.split('T')[0] || '',
    officialWebsite: exam?.officialWebsite || '',
    isActive: exam?.isActive !== false,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name) return toast.error('Exam name is required');
    onSubmit(form);
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
              <label className="label-base">Short Name *</label>
              <input className="input-base" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="e.g. OJEE" required />
            </div>
            <div>
              <label className="label-base">Type</label>
              <select className="input-base" value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))}>
                {EXAM_TYPES.map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="label-base">Full Name</label>
            <input className="input-base" value={form.fullName} onChange={e => setForm(f => ({ ...f, fullName: e.target.value }))} placeholder="Odisha Joint Entrance Examination" />
          </div>
          <div>
            <label className="label-base">Conducting Body</label>
            <input className="input-base" value={form.conductingBody} onChange={e => setForm(f => ({ ...f, conductingBody: e.target.value }))} placeholder="OJEE Board" />
          </div>
          <div>
            <label className="label-base">Description</label>
            <textarea className="input-base" rows={3} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
          </div>
          <div>
            <label className="label-base">Eligibility</label>
            <input className="input-base" value={form.eligibility} onChange={e => setForm(f => ({ ...f, eligibility: e.target.value }))} placeholder="10+2 with PCM" />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="label-base">App. Start</label>
              <input type="date" className="input-base" value={form.applicationStartDate} onChange={e => setForm(f => ({ ...f, applicationStartDate: e.target.value }))} />
            </div>
            <div>
              <label className="label-base">App. End</label>
              <input type="date" className="input-base" value={form.applicationEndDate} onChange={e => setForm(f => ({ ...f, applicationEndDate: e.target.value }))} />
            </div>
            <div>
              <label className="label-base">Exam Date</label>
              <input type="date" className="input-base" value={form.examDate} onChange={e => setForm(f => ({ ...f, examDate: e.target.value }))} />
            </div>
          </div>
          <div>
            <label className="label-base">Official Website</label>
            <input type="url" className="input-base" value={form.officialWebsite} onChange={e => setForm(f => ({ ...f, officialWebsite: e.target.value }))} placeholder="https://ojee.nic.in" />
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={form.isActive} onChange={e => setForm(f => ({ ...f, isActive: e.target.checked }))} className="w-4 h-4 rounded border-slate-300 text-primary-600" />
            <span className="text-sm font-medium text-slate-700">Mark as Active</span>
          </label>
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
    queryFn: () => api.get(`/exams?search=${search}&limit=100`).then(r => r.data),
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
    if (selected) updateMutation.mutate({ ...form, _id: selected._id });
    else createMutation.mutate(form);
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
                      <div className="w-8 h-8 bg-primary-50 rounded-lg flex items-center justify-center"><FileText size={14} className="text-primary-600" /></div>
                      <div>
                        <p className="font-bold text-sm text-slate-900">{exam.name}</p>
                        <p className="text-xs text-slate-400">{exam.fullName}</p>
                      </div>
                    </div>
                  </td>
                  <td><span className="badge badge-blue">{exam.type}</span></td>
                  <td className="text-slate-600 text-sm">{exam.conductingBody || '—'}</td>
                  <td className="text-slate-600 text-sm">{exam.examDate ? new Date(exam.examDate).toLocaleDateString('en-IN') : '—'}</td>
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

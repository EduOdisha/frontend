import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import api from '../../utils/api';
import { Plus, Search, Edit2, Trash2, Eye, CheckCircle, XCircle, AlertCircle, Award } from 'lucide-react';
import { toast } from 'react-hot-toast';

const SCHOLARSHIP_TYPES = ['Government', 'Private', 'NGO', 'University', 'International'];
const SCHOLARSHIP_CATEGORIES = ['Merit', 'SC/ST', 'OBC', 'Minority', 'Disability', 'Girls', 'Post Matric', 'Pre Matric', 'Other'];

function ScholarshipFormModal({ scholarship, onClose, onSubmit, loading }) {
  const [form, setForm] = useState({
    name: scholarship?.name || '',
    provider: scholarship?.provider || '',
    type: scholarship?.type || 'Government',
    category: scholarship?.category || 'Merit',
    description: scholarship?.description || '',
    eligibility: typeof scholarship?.eligibility === 'object' ? {
      income: scholarship?.eligibility?.income || '',
      percentage: scholarship?.eligibility?.percentage || '',
      category: Array.isArray(scholarship?.eligibility?.category) ? scholarship.eligibility.category.join(', ') : '',
      state: scholarship?.eligibility?.state || 'Odisha',
      course: Array.isArray(scholarship?.eligibility?.course) ? scholarship.eligibility.course.join(', ') : '',
    } : {
      income: '',
      percentage: '',
      category: '',
      state: 'Odisha',
      course: '',
    },
    amount: scholarship?.amount?.value || '',
    lastDate: scholarship?.lastDate?.split('T')[0] || '',
    officialWebsite: scholarship?.officialWebsite || '',
    isActive: scholarship?.isActive !== false,
    isFeatured: scholarship?.isFeatured || false,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.provider) return toast.error('Name and Provider are required');
    
    const formattedEligibility = {
      income: form.eligibility.income,
      percentage: form.eligibility.percentage,
      category: form.eligibility.category ? form.eligibility.category.split(',').map(s => s.trim()).filter(Boolean) : [],
      state: form.eligibility.state || 'Odisha',
      course: form.eligibility.course ? form.eligibility.course.split(',').map(s => s.trim()).filter(Boolean) : [],
    };

    onSubmit({ 
      ...form, 
      eligibility: formattedEligibility,
      amount: { value: Number(form.amount) } 
    });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-slate-100 px-6 py-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900">{scholarship ? 'Edit Scholarship' : 'Add Scholarship'}</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-2xl leading-none">&times;</button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="label-base">Scholarship Name *</label>
            <input className="input-base" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Post Matric Scholarship" required />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="label-base">Provider *</label>
              <input className="input-base" value={form.provider} onChange={e => setForm(f => ({ ...f, provider: e.target.value }))} placeholder="Government of Odisha" required />
            </div>
            <div>
              <label className="label-base">Type</label>
              <select className="input-base" value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))}>
                {SCHOLARSHIP_TYPES.map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="label-base">Category</label>
              <select className="input-base" value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}>
                {SCHOLARSHIP_CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="label-base">Description</label>
            <textarea className="input-base" rows={3} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label-base">Eligibility - Family Income</label>
              <input className="input-base" value={form.eligibility.income} onChange={e => setForm(f => ({ ...f, eligibility: { ...f.eligibility, income: e.target.value } }))} placeholder="e.g. < 2.5 LPA" />
            </div>
            <div>
              <label className="label-base">Eligibility - Min Percentage</label>
              <input className="input-base" value={form.eligibility.percentage} onChange={e => setForm(f => ({ ...f, eligibility: { ...f.eligibility, percentage: e.target.value } }))} placeholder="e.g. 60% in 10th" />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-2">
              <label className="label-base">Eligible Categories (comma separated)</label>
              <input className="input-base" value={form.eligibility.category} onChange={e => setForm(f => ({ ...f, eligibility: { ...f.eligibility, category: e.target.value } }))} placeholder="SC, ST, OBC" />
            </div>
            <div>
              <label className="label-base">State</label>
              <input className="input-base" value={form.eligibility.state} onChange={e => setForm(f => ({ ...f, eligibility: { ...f.eligibility, state: e.target.value } }))} placeholder="Odisha" />
            </div>
          </div>
          <div>
            <label className="label-base">Eligible Courses (comma separated)</label>
            <input className="input-base" value={form.eligibility.course} onChange={e => setForm(f => ({ ...f, eligibility: { ...f.eligibility, course: e.target.value } }))} placeholder="B.Tech, MBBS, B.Sc" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label-base">Amount (₹)</label>
              <input type="number" className="input-base" value={form.amount} onChange={e => setForm(f => ({ ...f, amount: e.target.value }))} placeholder="25000" />
            </div>
            <div>
              <label className="label-base">Last Date</label>
              <input type="date" className="input-base" value={form.lastDate} onChange={e => setForm(f => ({ ...f, lastDate: e.target.value }))} />
            </div>
          </div>
          <div>
            <label className="label-base">Official Website</label>
            <input type="url" className="input-base" value={form.officialWebsite} onChange={e => setForm(f => ({ ...f, officialWebsite: e.target.value }))} placeholder="https://..." />
          </div>
          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.isActive} onChange={e => setForm(f => ({ ...f, isActive: e.target.checked }))} className="w-4 h-4 rounded border-slate-300 text-primary-600" />
              <span className="text-sm font-medium text-slate-700">Active</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.isFeatured} onChange={e => setForm(f => ({ ...f, isFeatured: e.target.checked }))} className="w-4 h-4 rounded border-slate-300 text-primary-600" />
              <span className="text-sm font-medium text-slate-700">Featured on Homepage</span>
            </label>
          </div>
          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={loading} className="btn-primary py-2.5 px-6 flex-1">
              {loading ? 'Saving…' : scholarship ? 'Update' : 'Add Scholarship'}
            </button>
            <button type="button" onClick={onClose} className="btn-secondary py-2.5 px-5">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function ScholarshipManagement() {
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
    queryKey: ['admin-scholarships', search],
    queryFn: () => api.get(`/scholarships?search=${search}&limit=100&admin=true`).then(r => r.data),
  });

  const createMutation = useMutation({
    mutationFn: (d) => api.post('/scholarships', d),
    onSuccess: () => { qc.invalidateQueries(['admin-scholarships']); toast.success('Scholarship added'); setShowModal(false); },
    onError: (e) => toast.error(e.response?.data?.message || 'Failed'),
  });

  const updateMutation = useMutation({
    mutationFn: (d) => api.put(`/scholarships/${d._id}`, d),
    onSuccess: () => { qc.invalidateQueries(['admin-scholarships']); toast.success('Updated'); setShowModal(false); setSelected(null); },
    onError: (e) => toast.error(e.response?.data?.message || 'Failed'),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => api.delete(`/scholarships/${id}`),
    onSuccess: () => { qc.invalidateQueries(['admin-scholarships']); toast.success('Deleted'); },
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
          <h1 className="text-2xl font-bold text-slate-900">Scholarship Management</h1>
          <p className="text-slate-500 text-sm mt-0.5">Manage scholarships available for Odisha students.</p>
        </div>
        <button onClick={() => { setSelected(null); setShowModal(true); }} className="btn-primary flex items-center gap-2">
          <Plus size={17} /> Add Scholarship
        </button>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input type="text" placeholder="Search scholarships…" value={search} onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 text-sm border border-slate-200 rounded-lg outline-none focus:border-primary-400 bg-white" />
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="table-base">
            <thead><tr><th>Scholarship</th><th>Provider</th><th>Category</th><th>Amount</th><th>Deadline</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              {isLoading ? [1,2,3].map(i => (
                <tr key={i} className="animate-pulse">{[...Array(7)].map((_, j) => <td key={j}><div className="skeleton h-4 w-20 rounded" /></td>)}</tr>
              )) : data?.data?.length > 0 ? data.data.map(s => (
                <tr key={s._id}>
                  <td>
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-emerald-50 rounded-lg flex items-center justify-center"><Award size={14} className="text-emerald-600" /></div>
                      <div>
                        <p className="font-bold text-sm text-slate-900">{s.name}</p>
                        {s.isFeatured && <span className="text-[10px] text-accent-600 font-bold">★ Featured</span>}
                      </div>
                    </div>
                  </td>
                  <td className="text-sm text-slate-600">{s.provider}</td>
                  <td><span className="badge badge-green">{s.category}</span></td>
                  <td className="font-semibold text-emerald-600 text-sm">{s.amount?.value ? `₹${s.amount.value.toLocaleString()}` : '—'}</td>
                  <td className="text-sm text-slate-500">{s.lastDate ? new Date(s.lastDate).toLocaleDateString('en-IN') : '—'}</td>
                  <td>
                    {s.isActive !== false
                      ? <span className="flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full w-fit"><CheckCircle size={11} /> Active</span>
                      : <span className="flex items-center gap-1 text-xs font-bold text-slate-400 bg-slate-100 px-2.5 py-1 rounded-full w-fit"><XCircle size={11} /> Inactive</span>
                    }
                  </td>
                  <td>
                    <div className="flex items-center gap-1">
                      <a href={`/scholarships/${s.slug}`} target="_blank" rel="noreferrer" className="p-2 text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"><Eye size={15} /></a>
                      <button onClick={() => { setSelected(s); setShowModal(true); }} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"><Edit2 size={15} /></button>
                      <button onClick={() => { if (window.confirm('Delete?')) deleteMutation.mutate(s._id); }} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"><Trash2 size={15} /></button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr><td colSpan={7} className="py-12 text-center"><AlertCircle size={36} className="mx-auto text-slate-200 mb-2" /><p className="text-slate-400 text-sm">No scholarships found.</p></td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <ScholarshipFormModal scholarship={selected} onClose={() => { setShowModal(false); setSelected(null); }}
          onSubmit={handleSubmit} loading={createMutation.isPending || updateMutation.isPending} />
      )}
    </div>
  );
}

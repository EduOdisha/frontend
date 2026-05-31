import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import api from '../../utils/api';
import { Plus, Search, Edit2, Trash2, AlertCircle, FileEdit, Eye } from 'lucide-react';
import { toast } from 'react-hot-toast';

const BLOG_CATEGORIES = ['Admission', 'Exams', 'Scholarships', 'Career', 'Campus Life', 'Rankings', 'Coaching', 'General'];

function BlogFormModal({ blog, onClose, onSubmit, loading }) {
  const [form, setForm] = useState({
    title: blog?.title || '',
    category: blog?.category || 'General',
    excerpt: blog?.excerpt || '',
    content: blog?.content || '',
    tags: blog?.tags?.join(', ') || '',
    isPublished: blog?.isPublished || false,
    isFeatured: blog?.isFeatured || false,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title || !form.content) return toast.error('Title and content are required');
    onSubmit({ ...form, tags: form.tags.split(',').map(t => t.trim()).filter(Boolean) });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-slate-100 px-6 py-4 flex items-center justify-between">
          <h2 className="text-lg font-bold">{blog ? 'Edit Blog' : 'New Blog Post'}</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-2xl leading-none">&times;</button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="label-base">Title *</label>
            <input className="input-base" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="Top 10 Engineering Colleges in Odisha 2025" required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label-base">Category</label>
              <select className="input-base" value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}>
                {BLOG_CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="label-base">Tags (comma separated)</label>
              <input className="input-base" value={form.tags} onChange={e => setForm(f => ({ ...f, tags: e.target.value }))} placeholder="OJEE, Engineering, 2025" />
            </div>
          </div>
          <div>
            <label className="label-base">Excerpt / Summary</label>
            <textarea className="input-base" rows={2} value={form.excerpt} onChange={e => setForm(f => ({ ...f, excerpt: e.target.value }))} placeholder="A brief summary shown in card previews" />
          </div>
          <div>
            <label className="label-base">Content *</label>
            <textarea className="input-base" rows={8} value={form.content} onChange={e => setForm(f => ({ ...f, content: e.target.value }))} placeholder="Write your full blog post here…" required />
          </div>
          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.isPublished} onChange={e => setForm(f => ({ ...f, isPublished: e.target.checked }))} className="w-4 h-4 rounded border-slate-300 text-primary-600" />
              <span className="text-sm font-medium text-slate-700">Publish immediately</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.isFeatured} onChange={e => setForm(f => ({ ...f, isFeatured: e.target.checked }))} className="w-4 h-4 rounded border-slate-300 text-primary-600" />
              <span className="text-sm font-medium text-slate-700">Feature on Homepage</span>
            </label>
          </div>
          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={loading} className="btn-primary py-2.5 px-6 flex-1">
              {loading ? 'Saving…' : blog ? 'Update Post' : 'Create Post'}
            </button>
            <button type="button" onClick={onClose} className="btn-secondary py-2.5 px-5">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function BlogManagement() {
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
    queryKey: ['admin-blogs', search],
    queryFn: () => api.get(`/blogs?search=${search}&limit=100`).then(r => r.data),
  });

  const createMutation = useMutation({
    mutationFn: (d) => api.post('/blogs', d),
    onSuccess: () => { qc.invalidateQueries(['admin-blogs']); toast.success('Blog post created'); setShowModal(false); },
    onError: (e) => toast.error(e.response?.data?.message || 'Failed'),
  });

  const updateMutation = useMutation({
    mutationFn: (d) => api.put(`/blogs/${d._id}`, d),
    onSuccess: () => { qc.invalidateQueries(['admin-blogs']); toast.success('Updated'); setShowModal(false); setSelected(null); },
    onError: (e) => toast.error(e.response?.data?.message || 'Failed'),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => api.delete(`/blogs/${id}`),
    onSuccess: () => { qc.invalidateQueries(['admin-blogs']); toast.success('Deleted'); },
    onError: (e) => toast.error(e.response?.data?.message || 'Failed'),
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Blog Management</h1>
          <p className="text-slate-500 text-sm mt-0.5">Create and manage articles, guides and insights.</p>
        </div>
        <button onClick={() => { setSelected(null); setShowModal(true); }} className="btn-primary flex items-center gap-2">
          <Plus size={17} /> New Post
        </button>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input type="text" placeholder="Search blog posts…" value={search} onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 text-sm border border-slate-200 rounded-lg outline-none focus:border-primary-400 bg-white" />
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="table-base">
            <thead><tr><th>Title</th><th>Category</th><th>Date</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              {isLoading ? [1,2,3].map(i => (
                <tr key={i} className="animate-pulse">{[...Array(5)].map((_, j) => <td key={j}><div className="skeleton h-4 w-24 rounded" /></td>)}</tr>
              )) : data?.data?.length > 0 ? data.data.map(blog => (
                <tr key={blog._id}>
                  <td>
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-purple-50 rounded-lg flex items-center justify-center"><FileEdit size={14} className="text-purple-600" /></div>
                      <div>
                        <p className="font-bold text-sm text-slate-900 max-w-xs truncate">{blog.title}</p>
                        {blog.isFeatured && <span className="text-[10px] text-accent-600 font-bold">★ Featured</span>}
                      </div>
                    </div>
                  </td>
                  <td><span className="badge badge-purple">{blog.category}</span></td>
                  <td className="text-sm text-slate-500">{new Date(blog.createdAt).toLocaleDateString('en-IN')}</td>
                  <td>
                    {blog.isPublished
                      ? <span className="flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full w-fit">● Published</span>
                      : <span className="flex items-center gap-1 text-xs font-bold text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full w-fit">● Draft</span>
                    }
                  </td>
                  <td>
                    <div className="flex items-center gap-1">
                      <a href={`/blogs/${blog.slug}`} target="_blank" rel="noreferrer" className="p-2 text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"><Eye size={15} /></a>
                      <button onClick={() => { setSelected(blog); setShowModal(true); }} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"><Edit2 size={15} /></button>
                      <button onClick={() => { if (window.confirm('Delete?')) deleteMutation.mutate(blog._id); }} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"><Trash2 size={15} /></button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr><td colSpan={5} className="py-12 text-center"><AlertCircle size={36} className="mx-auto text-slate-200 mb-2" /><p className="text-slate-400 text-sm">No blog posts yet.</p></td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <BlogFormModal blog={selected} onClose={() => { setShowModal(false); setSelected(null); }}
          onSubmit={(form) => { if (selected) updateMutation.mutate({ ...form, _id: selected._id }); else createMutation.mutate(form); }}
          loading={createMutation.isPending || updateMutation.isPending} />
      )}
    </div>
  );
}

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { Star, CheckCircle, Trash2, Search, Pin, PinOff, School, MessageSquare } from 'lucide-react';
import api from '../../utils/api';

const StarDisplay = ({ value, size = 14 }) => (
  <div className="flex items-center gap-0.5">
    {[1, 2, 3, 4, 5].map(s => (
      <Star
        key={s}
        size={size}
        className={s <= value ? 'text-amber-400 fill-amber-400' : 'text-slate-200 fill-slate-200'}
      />
    ))}
  </div>
);

// ─── College Reviews Tab ────────────────────────────────────────────────────
function CollegeReviews() {
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState('pending');
  const [search, setSearch] = useState('');

  const { data: reviews = [], isLoading } = useQuery({
    queryKey: ['admin-reviews', filter],
    queryFn: async () => {
      const { data } = await api.get('/admin/reviews', {
        params: { status: filter === 'all' ? undefined : filter },
      });
      return data.data || [];
    },
  });

  const approveMutation = useMutation({
    mutationFn: (id) => api.put(`/reviews/${id}/approve`),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['admin-reviews'] }); toast.success('Review approved!'); },
    onError: () => toast.error('Failed to approve review'),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => api.delete(`/reviews/${id}`),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['admin-reviews'] }); toast.success('Review deleted'); },
    onError: () => toast.error('Failed to delete review'),
  });

  const filtered = reviews.filter(r => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      r.title?.toLowerCase().includes(q) ||
      r.user?.name?.toLowerCase().includes(q) ||
      r.college?.name?.toLowerCase().includes(q)
    );
  });

  const TABS = [
    { id: 'pending', label: 'Pending' },
    { id: 'approved', label: 'Approved' },
    { id: 'all', label: 'All' },
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex bg-slate-100 rounded-xl p-1 gap-1">
          {TABS.map(t => (
            <button key={t.id} onClick={() => setFilter(t.id)}
              className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${filter === t.id ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
              {t.label}
            </button>
          ))}
        </div>
        <div className="relative flex-1 max-w-sm">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input type="text" value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search by student, college, title..."
            className="w-full pl-9 pr-4 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400 bg-white" />
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-4">{[1, 2, 3].map(i => (
          <div key={i} className="bg-white border border-slate-200 rounded-2xl p-6 animate-pulse">
            <div className="flex gap-4">
              <div className="w-10 h-10 bg-slate-100 rounded-full" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-slate-100 rounded w-1/3" />
                <div className="h-3 bg-slate-100 rounded w-1/2" />
                <div className="h-3 bg-slate-100 rounded w-full" />
              </div>
            </div>
          </div>
        ))}</div>
      ) : filtered.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-2xl py-20 text-center">
          <Star size={40} className="mx-auto mb-3 text-slate-200 fill-slate-200" />
          <p className="text-slate-500 font-semibold">No reviews found</p>
          <p className="text-xs text-slate-400 mt-1">
            {filter === 'pending' ? 'All reviews have been moderated.' : 'No reviews match your search.'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map(review => (
            <div key={review._id}
              className={`bg-white border rounded-2xl p-5 transition-all ${review.isApproved ? 'border-slate-200' : 'border-amber-200 bg-amber-50/30'}`}>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-primary-100 text-primary-700 font-bold text-sm flex items-center justify-center shrink-0">
                  {review.user?.name?.[0]?.toUpperCase() || 'U'}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span className="text-sm font-bold text-slate-900">{review.user?.name || 'Anonymous'}</span>
                    {review.batch && <span className="text-[10px] bg-slate-100 text-slate-500 font-bold px-2 py-0.5 rounded-full">Batch {review.batch}</span>}
                    {review.course && <span className="text-[10px] bg-primary-50 text-primary-600 font-bold px-2 py-0.5 rounded-full">{review.course}</span>}
                    <span className={`ml-auto text-[10px] font-bold px-2.5 py-1 rounded-full ${review.isApproved ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-amber-50 text-amber-700 border border-amber-200'}`}>
                      {review.isApproved ? '✓ Approved' : '⏳ Pending'}
                    </span>
                  </div>
                  {review.college?.name && (
                    <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium mb-2">
                      <School size={12} className="text-slate-400" />{review.college.name}
                    </div>
                  )}
                  <div className="flex items-center gap-3 mb-2">
                    <StarDisplay value={review.rating?.overall} />
                    <span className="text-sm font-bold text-slate-800">{review.title}</span>
                  </div>
                  <p className="text-sm text-slate-600 leading-relaxed mb-3">{review.review}</p>
                  <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                    <span className="text-[11px] text-slate-400 font-medium">
                      {new Date(review.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>
                    <div className="flex items-center gap-2">
                      {!review.isApproved && (
                        <button onClick={() => approveMutation.mutate(review._id)} disabled={approveMutation.isPending}
                          className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-3 py-1.5 rounded-lg transition-colors">
                          <CheckCircle size={13} /> Approve
                        </button>
                      )}
                      <button onClick={() => { if (window.confirm('Delete this review?')) deleteMutation.mutate(review._id); }}
                        disabled={deleteMutation.isPending}
                        className="flex items-center gap-1.5 text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 px-3 py-1.5 rounded-lg transition-colors">
                        <Trash2 size={13} /> Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Platform Reviews Tab ────────────────────────────────────────────────────
function PlatformReviews() {
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState('pending');
  const [search, setSearch] = useState('');

  const { data: reviews = [], isLoading } = useQuery({
    queryKey: ['admin-platform-reviews', filter],
    queryFn: async () => {
      const { data } = await api.get('/admin/platform-reviews', {
        params: { status: filter === 'all' ? undefined : filter },
      });
      return data.data || [];
    },
  });

  const approveMutation = useMutation({
    mutationFn: (id) => api.put(`/admin/platform-reviews/${id}/approve`),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['admin-platform-reviews'] }); toast.success('Review approved!'); },
    onError: () => toast.error('Failed to approve'),
  });

  const featureMutation = useMutation({
    mutationFn: (id) => api.put(`/admin/platform-reviews/${id}/feature`),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['admin-platform-reviews'] });
      queryClient.invalidateQueries({ queryKey: ['platform-reviews'] });
      toast.success('Featured status toggled');
    },
    onError: () => toast.error('Failed to update'),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => api.delete(`/admin/platform-reviews/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-platform-reviews'] });
      queryClient.invalidateQueries({ queryKey: ['platform-reviews'] });
      toast.success('Review deleted');
    },
    onError: () => toast.error('Failed to delete'),
  });

  const filtered = reviews.filter(r => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      r.title?.toLowerCase().includes(q) ||
      r.user?.name?.toLowerCase().includes(q) ||
      r.review?.toLowerCase().includes(q)
    );
  });

  const TABS = [
    { id: 'pending', label: 'Pending' },
    { id: 'approved', label: 'Approved' },
    { id: 'featured', label: '⭐ Featured' },
    { id: 'all', label: 'All' },
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex bg-slate-100 rounded-xl p-1 gap-1 flex-wrap">
          {TABS.map(t => (
            <button key={t.id} onClick={() => setFilter(t.id)}
              className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${filter === t.id ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
              {t.label}
            </button>
          ))}
        </div>
        <div className="relative flex-1 max-w-sm">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input type="text" value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search by student, title, review..."
            className="w-full pl-9 pr-4 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400 bg-white" />
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-4">{[1, 2, 3].map(i => (
          <div key={i} className="bg-white border border-slate-200 rounded-2xl p-6 animate-pulse">
            <div className="flex gap-4">
              <div className="w-10 h-10 bg-slate-100 rounded-full" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-slate-100 rounded w-1/3" />
                <div className="h-3 bg-slate-100 rounded w-1/2" />
                <div className="h-3 bg-slate-100 rounded w-full" />
              </div>
            </div>
          </div>
        ))}</div>
      ) : filtered.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-2xl py-20 text-center">
          <MessageSquare size={40} className="mx-auto mb-3 text-slate-200" />
          <p className="text-slate-500 font-semibold">No platform reviews found</p>
          <p className="text-xs text-slate-400 mt-1">
            {filter === 'pending' ? 'No reviews awaiting approval.' : 'No reviews match your search.'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map(review => (
            <div key={review._id}
              className={`bg-white border rounded-2xl p-5 transition-all ${
                review.isFeatured
                  ? 'border-amber-300 bg-amber-50/20'
                  : review.isApproved
                  ? 'border-slate-200'
                  : 'border-amber-200 bg-amber-50/30'
              }`}>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-primary-100 text-primary-700 font-bold text-sm flex items-center justify-center shrink-0">
                  {review.user?.name?.[0]?.toUpperCase() || 'U'}
                </div>
                <div className="flex-1 min-w-0">
                  {/* Top Row */}
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span className="text-sm font-bold text-slate-900">{review.user?.name || 'Anonymous'}</span>
                    {review.role && <span className="text-[10px] bg-primary-50 text-primary-600 font-bold px-2 py-0.5 rounded-full">{review.role}</span>}
                    {review.location && <span className="text-[10px] bg-slate-100 text-slate-500 font-bold px-2 py-0.5 rounded-full">{review.location}</span>}
                    {review.usedFor && <span className="text-[10px] bg-blue-50 text-blue-600 font-bold px-2 py-0.5 rounded-full">{review.usedFor}</span>}
                    {review.isFeatured && <span className="text-[10px] bg-amber-50 text-amber-700 border border-amber-200 font-bold px-2 py-0.5 rounded-full">⭐ Featured</span>}
                    <span className={`ml-auto text-[10px] font-bold px-2.5 py-1 rounded-full ${review.isApproved ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-amber-50 text-amber-700 border border-amber-200'}`}>
                      {review.isApproved ? '✓ Approved' : '⏳ Pending'}
                    </span>
                  </div>

                  {/* Rating + Title */}
                  <div className="flex items-center gap-3 mb-2">
                    <StarDisplay value={review.rating} />
                    <span className="text-sm font-bold text-slate-800">{review.title}</span>
                  </div>

                  {/* Review text */}
                  <p className="text-sm text-slate-600 leading-relaxed mb-3">{review.review}</p>

                  {/* Date + Actions */}
                  <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                    <span className="text-[11px] text-slate-400 font-medium">
                      {new Date(review.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      {' · '}{review.user?.email}
                    </span>
                    <div className="flex items-center gap-2">
                      {!review.isApproved && (
                        <button onClick={() => approveMutation.mutate(review._id)} disabled={approveMutation.isPending}
                          className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-3 py-1.5 rounded-lg transition-colors">
                          <CheckCircle size={13} /> Approve
                        </button>
                      )}
                      {review.isApproved && (
                        <button onClick={() => featureMutation.mutate(review._id)} disabled={featureMutation.isPending}
                          className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg border transition-colors ${
                            review.isFeatured
                              ? 'text-amber-700 bg-amber-50 border-amber-200 hover:bg-amber-100'
                              : 'text-slate-600 bg-slate-50 border-slate-200 hover:bg-slate-100'
                          }`}>
                          {review.isFeatured ? <PinOff size={13} /> : <Pin size={13} />}
                          {review.isFeatured ? 'Unfeature' : 'Feature'}
                        </button>
                      )}
                      <button onClick={() => { if (window.confirm('Delete this review?')) deleteMutation.mutate(review._id); }}
                        disabled={deleteMutation.isPending}
                        className="flex items-center gap-1.5 text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 px-3 py-1.5 rounded-lg transition-colors">
                        <Trash2 size={13} /> Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Main ReviewManagement ───────────────────────────────────────────────────
export default function ReviewManagement() {
  const [activeTab, setActiveTab] = useState('platform'); // 'platform' | 'college'

  const MAIN_TABS = [
    { id: 'platform', label: '💬 Platform Reviews', desc: 'Reviews about EduOdisha services & counselling' },
    { id: 'college', label: '🏫 College Reviews', desc: 'Student reviews for specific colleges' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Review Management</h1>
          <p className="text-sm text-slate-500 mt-0.5">Moderate and approve reviews from students</p>
        </div>
      </div>

      {/* Main Tabs */}
      <div className="flex gap-3 border-b border-slate-200">
        {MAIN_TABS.map(t => (
          <button key={t.id} onClick={() => setActiveTab(t.id)}
            className={`pb-3 px-1 text-sm font-bold transition-all border-b-2 -mb-px ${
              activeTab === t.id
                ? 'border-primary-600 text-primary-700'
                : 'border-transparent text-slate-400 hover:text-slate-700'
            }`}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'platform' ? <PlatformReviews /> : <CollegeReviews />}
    </div>
  );
}

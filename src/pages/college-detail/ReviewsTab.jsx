import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import { Star, MessageSquare, ThumbsUp, ThumbsDown, Send } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import api from '../../utils/api';

// ─── Star Picker ──────────────────────────────────────
function StarPicker({ value, onChange, size = 24 }) {
  const [hovered, setHovered] = useState(0);
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map(s => (
        <button
          key={s}
          type="button"
          onClick={() => onChange(s)}
          onMouseEnter={() => setHovered(s)}
          onMouseLeave={() => setHovered(0)}
          className="transition-transform hover:scale-110"
        >
          <Star
            size={size}
            className={`transition-colors ${
              s <= (hovered || value)
                ? 'text-amber-400 fill-amber-400'
                : 'text-slate-200 fill-slate-200'
            }`}
          />
        </button>
      ))}
    </div>
  );
}

// ─── Star Display ─────────────────────────────────────
function StarRow({ value, size = 14 }) {
  return (
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
}

export default function ReviewsTab({ college }) {
  const { isAuthenticated } = useSelector(state => state.auth);
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    title: '', review: '',
    pros: [''], cons: [''],
    batch: '', course: '',
    rating: { overall: 0, academics: 0, infrastructure: 0, placements: 0, faculty: 0, value: 0 },
  });

  const { data: reviews = [] } = useQuery({
    queryKey: ['college-reviews', college._id],
    queryFn: async () => {
      const { data } = await api.get(`/reviews/college/${college._id}`);
      return data.data || [];
    },
  });

  const submitMutation = useMutation({
    mutationFn: (payload) => api.post('/reviews', payload),
    onSuccess: () => {
      toast.success('Review submitted! It will appear after admin approval.');
      setShowForm(false);
      setForm({
        title: '', review: '', pros: [''], cons: [''], batch: '', course: '',
        rating: { overall: 0, academics: 0, infrastructure: 0, placements: 0, faculty: 0, value: 0 },
      });
      queryClient.invalidateQueries({ queryKey: ['college-reviews', college._id] });
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to submit review'),
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (form.rating.overall === 0) return toast.error('Please give an overall rating');
    if (!form.title.trim()) return toast.error('Please add a title');
    if (form.review.trim().length < 30) return toast.error('Review must be at least 30 characters');
    submitMutation.mutate({
      college: college._id,
      ...form,
      pros: form.pros.filter(p => p.trim()),
      cons: form.cons.filter(c => c.trim()),
    });
  };

  const ratingLabels = [
    { key: 'overall', label: 'Overall' },
    { key: 'academics', label: 'Academics' },
    { key: 'infrastructure', label: 'Infrastructure' },
    { key: 'placements', label: 'Placements' },
    { key: 'faculty', label: 'Faculty' },
    { key: 'value', label: 'Value for Money' },
  ];

  // Rating bar distribution
  const ratingDist = [5, 4, 3, 2, 1].map(star => ({
    star,
    count: reviews.filter(r => Math.round(r.rating?.overall) === star).length,
  }));
  const totalReviews = reviews.length;

  return (
    <div className="space-y-5">
      {/* Rating Overview */}
      <div className="bg-white border border-slate-200 rounded-xl p-6">
        <div className="flex flex-col sm:flex-row gap-6 items-start">
          {/* Big Number */}
          <div className="text-center sm:pr-6 sm:border-r border-slate-100 shrink-0">
            <p className="text-5xl font-extrabold text-slate-900">
              {college.rating?.average > 0 ? college.rating.average.toFixed(1) : '—'}
            </p>
            <StarRow value={Math.round(college.rating?.average || 0)} size={18} />
            <p className="text-xs text-slate-400 font-medium mt-1">{totalReviews} reviews</p>
          </div>
          {/* Distribution bars */}
          <div className="flex-1 space-y-1.5 w-full">
            {ratingDist.map(({ star, count }) => (
              <div key={star} className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-500 w-4">{star}</span>
                <Star size={11} className="text-amber-400 fill-amber-400 shrink-0" />
                <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-amber-400 rounded-full transition-all duration-500"
                    style={{ width: totalReviews ? `${(count / totalReviews) * 100}%` : '0%' }}
                  />
                </div>
                <span className="text-xs text-slate-400 w-5 text-right">{count}</span>
              </div>
            ))}
          </div>
          {/* Write review CTA */}
          <div className="shrink-0 self-center">
            {isAuthenticated ? (
              <button
                onClick={() => setShowForm(v => !v)}
                className="btn-primary py-2.5 px-5 text-sm rounded-xl animate-pulse hover:animate-none"
              >
                {showForm ? 'Cancel' : '✏️ Write a Review'}
              </button>
            ) : (
              <Link to="/login" className="btn-secondary py-2.5 px-5 text-sm rounded-xl block text-center">
                Login to Review
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Review Form */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="bg-white border border-primary-200 rounded-xl p-6 shadow-sm"
          >
            <h3 className="text-base font-bold text-slate-900 mb-5 flex items-center gap-2">
              <MessageSquare size={16} className="text-primary-600" /> Share Your Experience
            </h3>
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Star Ratings */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {ratingLabels.map(({ key, label }) => (
                  <div key={key} className="flex items-center justify-between bg-slate-50 rounded-lg px-4 py-2.5">
                    <span className={`text-sm font-semibold ${key === 'overall' ? 'text-primary-700' : 'text-slate-600'}`}>
                      {label} {key === 'overall' && <span className="text-red-500">*</span>}
                    </span>
                    <StarPicker
                      value={form.rating[key]}
                      onChange={v => setForm(f => ({ ...f, rating: { ...f.rating, [key]: v } }))}
                      size={key === 'overall' ? 22 : 18}
                    />
                  </div>
                ))}
              </div>

              {/* Batch + Course */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Batch Year</label>
                  <input
                    type="text"
                    placeholder="e.g. 2021"
                    value={form.batch}
                    onChange={e => setForm(f => ({ ...f, batch: e.target.value }))}
                    className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Course</label>
                  <input
                    type="text"
                    placeholder="e.g. B.Tech CSE"
                    value={form.course}
                    onChange={e => setForm(f => ({ ...f, course: e.target.value }))}
                    className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400"
                  />
                </div>
              </div>

              {/* Title */}
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">
                  Review Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Summarize your experience in one line..."
                  value={form.title}
                  onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                  className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400"
                />
              </div>

              {/* Review Text */}
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">
                  Detailed Review <span className="text-red-500">*</span>
                </label>
                <textarea
                  placeholder="Tell us about the academics, infrastructure, placements, faculty, and campus life..."
                  value={form.review}
                  onChange={e => setForm(f => ({ ...f, review: e.target.value }))}
                  rows={4}
                  className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400 resize-none"
                />
                <p className="text-[10px] text-slate-400 mt-1">Min 30 characters</p>
              </div>

              {/* Pros & Cons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-bold text-slate-500 uppercase">👍 Pros</label>
                    <button
                      type="button"
                      onClick={() => setForm(f => ({ ...f, pros: [...f.pros, ''] }))}
                      className="text-xs font-bold text-primary-600 hover:underline"
                    >
                      + Add Pro
                    </button>
                  </div>
                  <div className="space-y-2">
                    {form.pros.map((p, i) => (
                      <div key={i} className="flex gap-2">
                        <input
                          type="text"
                          placeholder="e.g. Beautiful campus"
                          value={p}
                          onChange={e => {
                            const newPros = [...form.pros];
                            newPros[i] = e.target.value;
                            setForm(f => ({ ...f, pros: newPros }));
                          }}
                          className="flex-1 px-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400"
                        />
                        {form.pros.length > 1 && (
                          <button
                            type="button"
                            onClick={() => setForm(f => ({ ...f, pros: f.pros.filter((_, idx) => idx !== i) }))}
                            className="text-red-500 hover:text-red-700 text-xs px-1"
                          >
                            ×
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-bold text-slate-500 uppercase">👎 Cons</label>
                    <button
                      type="button"
                      onClick={() => setForm(f => ({ ...f, cons: [...f.cons, ''] }))}
                      className="text-xs font-bold text-primary-600 hover:underline"
                    >
                      + Add Con
                    </button>
                  </div>
                  <div className="space-y-2">
                    {form.cons.map((c, i) => (
                      <div key={i} className="flex gap-2">
                        <input
                          type="text"
                          placeholder="e.g. Mess food is average"
                          value={c}
                          onChange={e => {
                            const newCons = [...form.cons];
                            newCons[i] = e.target.value;
                            setForm(f => ({ ...f, cons: newCons }));
                          }}
                          className="flex-1 px-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400"
                        />
                        {form.cons.length > 1 && (
                          <button
                            type="button"
                            onClick={() => setForm(f => ({ ...f, cons: f.cons.filter((_, idx) => idx !== i) }))}
                            className="text-red-500 hover:text-red-700 text-xs px-1"
                          >
                            ×
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={submitMutation.isPending}
                  className="btn-primary py-2 px-6 rounded-xl text-sm font-bold flex items-center gap-2"
                >
                  {submitMutation.isPending ? 'Submitting...' : <><Send size={14} /> Submit Review</>}
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Reviews List */}
      {reviews.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-xl py-12 text-center text-slate-400">
          <MessageSquare size={32} className="mx-auto text-slate-200 mb-3" />
          <p className="text-sm font-semibold">No reviews yet</p>
          <p className="text-xs text-slate-400 mt-1">Be the first to review this college!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map(review => (
            <div key={review._id} className="bg-white border border-slate-200 rounded-xl p-5 space-y-4">
              {/* User + Course */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary-50 flex items-center justify-center text-primary-600 font-extrabold">
                    {review.user?.name ? review.user.name[0].toUpperCase() : 'S'}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-800">
                      {review.user?.name || 'Verified Student'}
                    </h4>
                    <p className="text-xs text-slate-400 font-medium">
                      {review.course} • Batch of {review.batch}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <StarRow value={review.rating?.overall || 0} size={13} />
                  <p className="text-[10px] text-slate-400 mt-1">
                    {new Date(review.createdAt).toLocaleDateString('en-IN')}
                  </p>
                </div>
              </div>

              {/* Title + Content */}
              <div>
                <h5 className="text-sm font-bold text-slate-800 mb-1.5">{review.title}</h5>
                <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-line">
                  {review.review}
                </p>
              </div>

              {/* Breakdown */}
              {review.rating && (
                <div className="flex flex-wrap gap-x-6 gap-y-2 border-t border-slate-100 pt-3 text-[11px] font-semibold text-slate-400">
                  {ratingLabels.map(({ key, label }) =>
                    key !== 'overall' ? (
                      <div key={key} className="flex items-center gap-2">
                        <span className="capitalize">{label}:</span>
                        <StarRow value={review.rating[key]} size={11} />
                      </div>
                    ) : null
                  )}
                </div>
              )}

              {/* Pros & Cons */}
              {(review.pros?.length > 0 || review.cons?.length > 0) && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {review.pros?.length > 0 && (
                    <div className="bg-emerald-50 border border-emerald-100 rounded-lg p-3">
                      <p className="text-[10px] font-bold text-emerald-600 uppercase mb-1.5">👍 Pros</p>
                      {review.pros.map((p, i) => <p key={i} className="text-xs text-emerald-800 font-medium">• {p}</p>)}
                    </div>
                  )}
                  {review.cons?.length > 0 && (
                    <div className="bg-red-50 border border-red-100 rounded-lg p-3">
                      <p className="text-[10px] font-bold text-red-500 uppercase mb-1.5">👎 Cons</p>
                      {review.cons.map((c, i) => <p key={i} className="text-xs text-red-800 font-medium">• {c}</p>)}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { MessageSquare, Send } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import api from '../../../utils/api';
import { StarPicker } from '../../../components/ui';

export default function ReviewForm({ collegeId, onSubmitSuccess, onCancel }) {
  const queryClient = useQueryClient();
  const [form, setForm] = useState({
    title: '', review: '',
    pros: [''], cons: [''],
    batch: '', course: '',
    rating: { overall: 0, academics: 0, infrastructure: 0, placements: 0, faculty: 0, value: 0 },
  });

  const submitMutation = useMutation({
    mutationFn: (payload) => api.post('/reviews', payload),
    onSuccess: () => {
      toast.success('Review submitted! It will appear after admin approval.');
      setForm({
        title: '', review: '', pros: [''], cons: [''], batch: '', course: '',
        rating: { overall: 0, academics: 0, infrastructure: 0, placements: 0, faculty: 0, value: 0 },
      });
      queryClient.invalidateQueries({ queryKey: ['college-reviews', collegeId] });
      onSubmitSuccess?.();
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to submit review'),
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (form.rating.overall === 0) return toast.error('Please give an overall rating');
    if (!form.title.trim()) return toast.error('Please add a title');
    if (form.review.trim().length < 30) return toast.error('Review must be at least 30 characters');
    submitMutation.mutate({
      college: collegeId,
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

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
      className="bg-white border border-primary-200 rounded-xl p-6 shadow-sm"
    >
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <MessageSquare size={16} className="text-primary-600" /> Share Your Experience
        </h3>
        <button
          type="button"
          onClick={onCancel}
          className="text-xs text-slate-500 hover:text-slate-700 font-semibold"
        >
          Cancel
        </button>
      </div>
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
  );
}

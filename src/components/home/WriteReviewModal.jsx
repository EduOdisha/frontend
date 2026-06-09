import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { X, Send } from 'lucide-react';
import { toast } from 'react-hot-toast';
import api from '../../utils/api.js';
import { StarPicker } from '../ui';
export default function WriteReviewModal({ onClose, onSuccess }) {
  const queryClient = useQueryClient();
  const [form, setForm] = useState({
    rating: 5,
    title: '',
    review: '',
    role: '',
    location: '',
    usedFor: 'College Search',
  });

  const mutation = useMutation({
    mutationFn: (data) => api.post('/platform-reviews', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['platform-reviews'] });
      toast.success('Review submitted! It will appear after approval.');
      onSuccess?.();
      onClose();
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Failed to submit review');
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.review.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }
    mutation.mutate(form);
  };

  const USED_FOR_OPTIONS = [
    'College Search', 'Counselling', 'Scholarship', 'Exam Info', 'Course Selection', 'Other',
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 12 }}
        className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Share Your Experience</h2>
            <p className="text-xs text-slate-400 mt-0.5">Help other students by reviewing EduOdisha</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-5">
          {/* Star Rating */}
          <div>
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 block">
              Overall Rating <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center gap-2">
              <StarPicker
                value={form.rating}
                onChange={s => setForm(f => ({ ...f, rating: s }))}
                size={28}
              />
              <span className="text-sm font-bold text-slate-500 ml-1">
                {['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent'][form.rating]}
              </span>
            </div>
          </div>

          {/* Used for */}
          <div>
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 block">
              I used EduOdisha for
            </label>
            <div className="flex flex-wrap gap-2">
              {USED_FOR_OPTIONS.map(opt => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => setForm(f => ({ ...f, usedFor: opt }))}
                  className={`text-xs font-semibold px-3 py-1.5 rounded-lg border transition-all ${
                    form.usedFor === opt
                      ? 'bg-primary-600 text-white border-primary-600'
                      : 'bg-white text-slate-600 border-slate-200 hover:border-primary-300'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 block">
              Review Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={form.title}
              onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
              placeholder="e.g. Excellent counselling session!"
              maxLength={200}
              className="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400"
            />
          </div>

          {/* Review text */}
          <div>
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 block">
              Your Review <span className="text-red-500">*</span>
            </label>
            <textarea
              value={form.review}
              onChange={e => setForm(f => ({ ...f, review: e.target.value }))}
              placeholder="Tell us about your experience with EduOdisha — the counsellors, platform features, scholarships, etc."
              maxLength={2000}
              rows={4}
              className="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400 resize-none"
            />
            <p className="text-[10px] text-slate-400 mt-1 text-right">{form.review.length}/2000</p>
          </div>

          {/* Role + Location */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 block">
                Your Role
              </label>
              <input
                type="text"
                value={form.role}
                onChange={e => setForm(f => ({ ...f, role: e.target.value }))}
                placeholder="e.g. B.Tech Aspirant"
                maxLength={100}
                className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 block">
                Location
              </label>
              <input
                type="text"
                value={form.location}
                onChange={e => setForm(f => ({ ...f, location: e.target.value }))}
                placeholder="e.g. Bhubaneswar, Odisha"
                maxLength={100}
                className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400"
              />
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={mutation.isPending}
            className="w-full btn-cta py-3 text-sm font-bold rounded-xl flex items-center justify-center gap-2"
          >
            {mutation.isPending ? (
              <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Submitting...</>
            ) : (
              <><Send size={15} /> Submit Review</>
            )}
          </button>

          <p className="text-[10px] text-slate-400 text-center">
            Reviews are moderated and appear after approval.
          </p>
        </form>
      </motion.div>
    </div>
  );
}

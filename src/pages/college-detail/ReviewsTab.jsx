import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import { Star } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';
import api from '../../utils/api';
import { StarRow } from '../../components/ui';
import ReviewForm from './reviews/ReviewForm';
import ReviewsList from './reviews/ReviewsList';

export default function ReviewsTab({ college }) {
  const { isAuthenticated } = useSelector(state => state.auth);
  const [showForm, setShowForm] = useState(false);

  const { data: reviews = [] } = useQuery({
    queryKey: ['college-reviews', college._id],
    queryFn: async () => {
      const { data } = await api.get(`/reviews/college/${college._id}`);
      return data.data || [];
    },
  });

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
          <ReviewForm
            collegeId={college._id}
            onCancel={() => setShowForm(false)}
            onSubmitSuccess={() => setShowForm(false)}
          />
        )}
      </AnimatePresence>

      {/* Reviews List */}
      <ReviewsList reviews={reviews} />
    </div>
  );
}

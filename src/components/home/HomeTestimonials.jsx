import { Link } from 'react-router-dom';
import { Star, PenLine, CheckCircle, Quote } from 'lucide-react';
import { Section } from './HomeSections';

export default function HomeTestimonials({
  user,
  myReview,
  reviewsLoading,
  platformReviews,
  setShowReviewModal,
  t
}) {
  return (
    <Section className="py-16 bg-slate-50">
      <div className="container-xl">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div className="max-w-xl">
            <p className="section-eyebrow">{t('home.testimonials.eyebrow')}</p>
            <h2 className="section-title">{t('home.testimonials.title')}</h2>
            <p className="section-subtitle">{t('home.testimonials.subtitle')}</p>
          </div>
          {/* Write a review CTA */}
          {user && !myReview && (
            <button
              onClick={() => setShowReviewModal(true)}
              className="btn-primary py-2.5 px-5 text-sm flex items-center gap-2 shrink-0 rounded-xl"
            >
              <PenLine size={14} /> {t('home.testimonials.writeReview')}
            </button>
          )}
          {user && myReview && (
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600 bg-emerald-50 border border-emerald-200 px-4 py-2 rounded-xl shrink-0">
              <CheckCircle size={14} /> {t('home.testimonials.youReviewed')}
            </div>
          )}
          {!user && (
            <Link to="/login" className="btn-secondary py-2.5 px-5 text-sm flex items-center gap-2 shrink-0 rounded-xl">
              <PenLine size={14} /> {t('home.testimonials.writeReview')}
            </Link>
          )}
        </div>

        {/* Reviews Grid */}
        {reviewsLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-white border border-slate-200 rounded-xl p-6 animate-pulse space-y-3">
                <div className="flex gap-1">{[...Array(5)].map((_, j) => <div key={j} className="w-3 h-3 bg-slate-100 rounded" />)}</div>
                <div className="h-3 bg-slate-100 rounded w-full" />
                <div className="h-3 bg-slate-100 rounded w-5/6" />
                <div className="h-3 bg-slate-100 rounded w-4/6" />
                <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
                  <div className="w-9 h-9 rounded-full bg-slate-100" />
                  <div className="space-y-1.5"><div className="h-3 bg-slate-100 rounded w-24" /><div className="h-2 bg-slate-100 rounded w-32" /></div>
                </div>
              </div>
            ))}
          </div>
        ) : platformReviews && platformReviews.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {platformReviews.map((review) => (
              <div key={review._id} className="bg-white border border-slate-200 rounded-xl p-6 hover:shadow-md transition-shadow duration-200">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-1">
                    {[...Array(review.rating)].map((_, j) => (
                      <Star key={j} size={14} className="text-amber-400 fill-amber-400" />
                    ))}
                    {[...Array(5 - review.rating)].map((_, j) => (
                      <Star key={j} size={14} className="text-slate-200 fill-slate-200" />
                    ))}
                  </div>
                  <div className="flex items-center gap-2">
                    {review.isFeatured && <span className="text-[9px] font-bold text-amber-600 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">⭐ Featured</span>}
                    <span className="text-[10px] font-semibold text-slate-400">
                      {new Date(review.createdAt).getFullYear()}
                    </span>
                  </div>
                </div>
                <Quote size={20} className="text-slate-200 mb-3" />
                {review.title && <p className="text-sm font-bold text-slate-800 mb-1">{review.title}</p>}
                <p className="text-sm text-slate-600 leading-relaxed mb-5 line-clamp-4">{review.review}</p>
                {review.usedFor && (
                  <span className="inline-block text-[10px] font-bold text-primary-600 bg-primary-50 border border-primary-100 px-2.5 py-1 rounded-full mb-4">
                    {t('home.testimonials.usedFor')} {review.usedFor}
                  </span>
                )}
                <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
                  <div className="w-9 h-9 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold text-sm shrink-0">
                    {review.user?.name?.[0]?.toUpperCase() || '?'}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-slate-900">{review.user?.name || 'Anonymous'}</p>
                    <p className="text-[11px] text-slate-400 font-medium truncate">
                      {[review.role, review.location].filter(Boolean).join(' · ') || 'EduOdisha User'}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Empty state */
          <div className="bg-white border border-dashed border-slate-300 rounded-2xl py-16 text-center">
            <div className="w-14 h-14 bg-primary-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Star size={24} className="text-primary-400" />
            </div>
            <h3 className="text-base font-bold text-slate-700 mb-2">{t('home.testimonials.noReviews')}</h3>
            <p className="text-sm text-slate-400 mb-6 max-w-xs mx-auto">
              {t('home.testimonials.beFirst')}
            </p>
            {user ? (
              <button
                onClick={() => setShowReviewModal(true)}
                className="btn-primary py-2.5 px-6 inline-flex items-center gap-2 rounded-xl text-sm font-bold"
              >
                <PenLine size={14} /> {t('home.testimonials.writeFirst')}
              </button>
            ) : (
              <Link to="/login" className="btn-primary py-2.5 px-6 inline-flex items-center gap-2 rounded-xl text-sm font-bold">
                <PenLine size={14} /> {t('home.testimonials.loginReview')}
              </Link>
            )}
          </div>
        )}
      </div>
    </Section>
  );
}

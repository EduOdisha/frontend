import { MessageSquare } from 'lucide-react';
import { StarRow } from '../../../components/ui';

const RATING_LABELS = [
  { key: 'overall', label: 'Overall' },
  { key: 'academics', label: 'Academics' },
  { key: 'infrastructure', label: 'Infrastructure' },
  { key: 'placements', label: 'Placements' },
  { key: 'faculty', label: 'Faculty' },
  { key: 'value', label: 'Value for Money' },
];

export default function ReviewsList({ reviews = [] }) {
  return (
    <div>
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
                  {RATING_LABELS.map(({ key, label }) =>
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

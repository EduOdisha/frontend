import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addToCompare, removeFromCompare } from '../../store/slices/compareSlice';
import { toast } from 'react-hot-toast';
import api from '../../utils/api';
import { updateUserSaved } from '../../store/slices/authSlice';
import { formatLakhs } from '../../utils/format';
import {
  MapPin, Star, Heart, GitCompare,
  CheckCircle
} from 'lucide-react';

// Skeleton loader
function CollegeCardSkeleton() {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
      <div className="skeleton h-44 w-full" />
      <div className="p-4 space-y-3">
        <div className="skeleton h-3.5 w-20 rounded-full" />
        <div className="skeleton h-5 w-4/5 rounded" />
        <div className="skeleton h-4 w-1/2 rounded" />
        <div className="skeleton h-px w-full" />
        <div className="flex gap-4">
          <div className="skeleton h-4 w-20 rounded" />
          <div className="skeleton h-4 w-20 rounded" />
        </div>
        <div className="skeleton h-9 w-full rounded-lg" />
      </div>
    </div>
  );
}

export default function CollegeCard({ college, loading }) {
  const dispatch = useDispatch();
  const { colleges: compareList } = useSelector(state => state.compare);
  const { user, isAuthenticated } = useSelector(state => state.auth);
  
  const isCurrentlySaved = user?.savedColleges?.some(id => 
    typeof id === 'object' ? id._id === college?._id : id === college?._id
  );
  
  const isBookmarked = isCurrentlySaved || false;

  if (loading) return <CollegeCardSkeleton />;
  if (!college) return null;

  const isCompared = compareList.some(c => c._id === college._id);

  const handleCompare = (e) => {
    e.preventDefault();
    if (isCompared) {
      dispatch(removeFromCompare(college._id));
    } else {
      if (compareList.length >= 4) {
        toast.error('Maximum 4 colleges can be compared');
        return;
      }
      dispatch(addToCompare(college));
      toast.success('Added to compare');
    }
  };

  const handleBookmark = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.error('Please log in to save colleges');
      return;
    }
    try {
      const { data } = await api.post(`/users/save-college/${college._id}`);
      dispatch(updateUserSaved({ savedColleges: data.savedColleges }));
      toast.success(data.saved ? 'College saved to wishlist' : 'Removed from saved');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update saved colleges');
    }
  };

  const rating = college.rating?.average || 0;
  const ratingCount = college.rating?.count || 0;
  const avgFees = college.fees?.min;
  const highestLPA = college.placements?.highestPackage;
  const nirfRank = college.nirfRanking;

  return (
    <div className="group bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col">
      {/* Image */}
      <div className="relative h-44 overflow-hidden bg-slate-100 dark:bg-slate-800 shrink-0">
        <img
          src={
            college.banner?.url ||
            `https://images.unsplash.com/photo-1562774053-701939374585?w=600&q=80&auto=format&fit=crop`
          }
          alt={`${college.name} campus`}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
          loading="lazy"
        />

        {/* Overlay Badges */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />

        {/* Top badges */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5">
          {college.isFeatured && (
            <span className="bg-accent-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-md shadow-sm">
              Featured
            </span>
          )}
          {college.isVerified && (
            <span className="bg-white/95 text-primary-700 text-[10px] font-bold px-2 py-0.5 rounded-md shadow-sm flex items-center gap-1">
              <CheckCircle size={10} className="text-primary-600" /> Verified
            </span>
          )}
        </div>

        {/* Bookmark */}
        <button
          onClick={handleBookmark}
          aria-label={isBookmarked ? 'Remove bookmark' : 'Bookmark college'}
          className="absolute top-3 right-3 w-8 h-8 bg-white/95 dark:bg-slate-900/95 hover:bg-white rounded-lg flex items-center justify-center shadow-sm transition-all"
        >
          <Heart
            size={15}
            className={`transition-colors ${isBookmarked ? 'fill-red-500 text-red-500' : 'text-slate-400'}`}
          />
        </button>

        {/* Rating */}
        {rating > 0 && (
          <div className="absolute bottom-3 left-3 flex items-center gap-1 bg-white/95 dark:bg-slate-900/95 px-2 py-1 rounded-md shadow-sm">
            <Star size={12} className="text-amber-400 fill-amber-400" />
            <span className="text-xs font-bold text-slate-800 dark:text-white">{rating.toFixed(1)}</span>
            {ratingCount > 0 && (
              <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">({ratingCount})</span>
            )}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-4">
        {/* Type + Location row */}
        <div className="flex items-center justify-between mb-2">
          <span className="badge badge-blue text-[10px]">{college.category}</span>
          <div className="flex items-center gap-1 text-slate-400 dark:text-slate-500 text-[10px] font-medium">
            <MapPin size={10} />
            <span>{college.location?.city}</span>
          </div>
        </div>

        {/* College Name */}
        <Link
          to={`/colleges/${college.slug}`}
          className="block mb-1"
        >
          <h3 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-2 leading-snug hover:text-primary-600 dark:hover:text-primary-400 transition-colors min-h-[2.5rem]">
            {college.name}
          </h3>
        </Link>

        {/* Affiliation */}
        {college.affiliation && (
          <p className="text-[11px] text-slate-400 dark:text-slate-500 font-medium mb-3 line-clamp-1">
            {college.affiliation}
          </p>
        )}

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-0 border border-slate-100 dark:border-slate-800 rounded-lg overflow-hidden mb-3 mt-auto">
          <div className="text-center py-2.5 px-2">
            <p className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase mb-0.5">Fees</p>
            <p className="text-xs font-bold text-slate-800 dark:text-white">
              {avgFees ? `₹${(avgFees / 1000).toFixed(0)}K` : 'N/A'}
            </p>
          </div>
          <div className="text-center py-2.5 px-2 border-x border-slate-100 dark:border-slate-800">
            <p className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase mb-0.5">Pkg</p>
            <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
              {formatLakhs(highestLPA)}
            </p>
          </div>
          <div className="text-center py-2.5 px-2">
            <p className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase mb-0.5">NIRF</p>
            <p className="text-xs font-bold text-slate-800 dark:text-white">
              {nirfRank ? `#${nirfRank}` : '—'}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <Link
            to={`/colleges/${college.slug}`}
            className="flex-1 text-center btn-primary py-2 text-xs"
          >
            View Details
          </Link>
          <button
            onClick={handleCompare}
            title={isCompared ? 'Remove from compare' : 'Add to compare'}
            className={`p-2 rounded-lg border transition-all ${
              isCompared
                ? 'bg-primary-50 dark:bg-primary-950/40 border-primary-200 dark:border-primary-900/40 text-primary-600 dark:text-primary-400'
                : 'border-slate-200 dark:border-slate-800 text-slate-400 dark:text-slate-500 hover:border-slate-300 dark:hover:border-slate-700 hover:text-slate-600 dark:hover:text-slate-300'
            }`}
          >
            <GitCompare size={15} />
          </button>
        </div>
      </div>
    </div>
  );
}

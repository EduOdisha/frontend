import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Clock, BookOpen, GraduationCap, ArrowRight, Heart } from 'lucide-react';
import { updateUserSaved } from '../../store/slices/authSlice';
import { toast } from 'react-hot-toast';
import api from '../../utils/api';

export default function CourseCard({ course, loading }) {
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector(state => state.auth);

  const isCurrentlySaved = user?.savedCourses?.some(id => 
    typeof id === 'object' ? id._id === course?._id : id === course?._id
  );

  const isBookmarked = isCurrentlySaved || false;

  const handleBookmark = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.error('Please log in to save courses');
      return;
    }
    try {
      const { data } = await api.post(`/users/save-course/${course._id}`);
      dispatch(updateUserSaved({ savedCourses: data.savedCourses }));
      toast.success(data.saved ? 'Course saved to wishlist' : 'Removed from saved');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update saved courses');
    }
  };

  if (loading) {
    return (
      <div className="card animate-pulse p-6 flex flex-col gap-3">
        <div className="h-5 bg-slate-200 rounded w-3/4" />
        <div className="h-3 bg-slate-200 rounded w-1/2" />
        <div className="h-4 bg-slate-200 rounded w-full" />
      </div>
    );
  }

  return (
    <Link
      to={`/courses/${course.slug}`}
      className="card p-6 hover:ring-amber-300 group relative"
    >
      <div className="flex items-start justify-between mb-5">
        <div className="w-14 h-14 rounded-2xl overflow-hidden bg-gradient-to-br from-emerald-50 to-emerald-100 flex items-center justify-center text-emerald-600 ring-1 ring-emerald-200/50 group-hover:scale-110 group-hover:from-emerald-500 group-hover:to-emerald-600 group-hover:text-white group-hover:ring-emerald-400 transition-all duration-300">
          {course.image?.url ? (
            <img src={course.image.url} alt={course.name} className="w-full h-full object-contain p-1.5" />
          ) : (
            <GraduationCap className="w-7 h-7" />
          )}
        </div>
        
        <div className="flex items-center gap-2">
          {course.isFeatured && (
            <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-lg ring-1 ring-amber-200 uppercase">
              Featured
            </span>
          )}
          <button
            onClick={handleBookmark}
            aria-label={isBookmarked ? 'Remove bookmark' : 'Bookmark course'}
            className="w-8 h-8 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200/50 dark:border-slate-700 rounded-lg flex items-center justify-center shadow-xs transition-all cursor-pointer relative z-10"
          >
            <Heart
              size={14}
              className={`transition-colors ${isBookmarked ? 'fill-red-500 text-red-500' : 'text-slate-400'}`}
            />
          </button>
        </div>
      </div>

      <h3 className="font-display font-extrabold text-slate-900 text-lg mb-2 group-hover:text-emerald-700 transition-colors">
        {course.name}
      </h3>

      <p className="text-sm text-slate-500 leading-relaxed mb-5 line-clamp-2">
        {course.description || `Explore career scope, fees, and top colleges for ${course.name} in Odisha.`}
      </p>

      <div className="flex items-center justify-between pt-4 border-t border-slate-100">
        <div className="flex items-center gap-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-emerald-500" />
            <span>{course.duration || '3-4 Years'}</span>
          </div>
          {course.level && (
            <div className="flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-emerald-500" />
              <span>{course.level}</span>
            </div>
          )}
        </div>
        <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-emerald-600 group-hover:translate-x-1 transition-all" />
      </div>
    </Link>
  );
}

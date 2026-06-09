import { Link } from 'react-router-dom';
import { BookOpen, ChevronRight } from 'lucide-react';

export default function SavedCoursesTab({ savedCourses = [] }) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-5">
        <span className="w-1.5 h-3.5 rounded-full bg-primary-500" />
        <h2 className="text-lg font-bold text-slate-900">Your Saved Courses</h2>
        {savedCourses.length > 0 && (
          <span className="text-[11px] bg-primary-50 text-primary-700 font-bold px-2 py-0.5 rounded-full ml-1.5">
            {savedCourses.length} Saved
          </span>
        )}
      </div>
      
      {savedCourses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {savedCourses.map(course => (
            <div key={course._id} className="bg-white border border-slate-200/60 hover:border-primary-100 hover:shadow-md transition-all duration-300 rounded-2xl p-5 flex items-center justify-between gap-4 group">
              <div className="flex items-center gap-4 min-w-0">
                <div className="w-14 h-14 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-primary-600 font-display font-bold text-lg shrink-0 overflow-hidden shadow-inner group-hover:scale-105 transition-transform">
                  {course.image?.url ? (
                    <img src={course.image.url} alt="" className="w-full h-full object-contain p-1.5" />
                  ) : (
                    <BookOpen size={20} className="text-primary-600" />
                  )}
                </div>
                <div className="min-w-0">
                  <h4 className="text-sm font-bold text-slate-900 truncate group-hover:text-primary-600 transition-colors" title={course.name}>
                    {course.name}
                  </h4>
                  <p className="text-xs text-slate-500 font-medium flex items-center gap-1.5 mt-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                    {course.level} • {course.stream}
                  </p>
                </div>
              </div>
              <Link to={`/courses/${course.slug}`} className="btn-secondary py-2 px-4 text-xs font-semibold shrink-0 rounded-xl group-hover:bg-primary-600 group-hover:text-white group-hover:border-primary-600 transition-all flex items-center gap-1">
                View Details <ChevronRight size={13} />
              </Link>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white border border-slate-200/60 rounded-2xl py-16 text-center shadow-xs">
          <div className="w-14 h-14 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-100">
            <BookOpen size={22} className="text-slate-400" />
          </div>
          <h3 className="text-base font-bold text-slate-700 mb-2">No saved courses</h3>
          <p className="text-sm text-slate-400 mb-6 max-w-xs mx-auto">Explore courses and save options you are interested in to review later.</p>
          <Link to="/courses" className="btn-primary py-2.5 px-6 inline-flex rounded-xl font-bold">Browse Courses</Link>
        </div>
      )}
    </div>
  );
}

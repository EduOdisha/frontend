import { Link } from 'react-router-dom';
import { Clock, BookOpen, GraduationCap, ArrowRight } from 'lucide-react';

export default function CourseCard({ course, loading }) {
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
      className="card p-6 hover:ring-amber-300 group"
    >
      <div className="flex items-start justify-between mb-5">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-50 to-emerald-100 flex items-center justify-center text-emerald-600 ring-1 ring-emerald-200/50 group-hover:scale-110 group-hover:from-emerald-500 group-hover:to-emerald-600 group-hover:text-white group-hover:ring-emerald-400 transition-all duration-300">
          <GraduationCap className="w-7 h-7" />
        </div>
        {course.isFeatured && (
          <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-lg ring-1 ring-amber-200 uppercase">
            Featured
          </span>
        )}
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

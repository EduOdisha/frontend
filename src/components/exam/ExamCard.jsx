import { Link } from 'react-router-dom';
import { Calendar, Award, ChevronRight } from 'lucide-react';

export default function ExamCard({ exam, loading }) {
  if (loading) {
    return (
      <div className="card animate-pulse p-6">
        <div className="h-6 bg-slate-200 rounded w-1/3 mb-4" />
        <div className="h-4 bg-slate-200 rounded w-full mb-2" />
        <div className="h-4 bg-slate-200 rounded w-2/3" />
      </div>
    );
  }

  const examDate = exam.examDates?.examDate
    ? new Date(exam.examDates.examDate).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      })
    : 'To be announced';

  return (
    <div className="card p-6 group">
      <div className="flex items-start justify-between mb-4">
        <div>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1.5">
            {exam.type || 'Entrance Exam'}
          </span>
          <h3 className="text-xl font-display font-extrabold text-slate-900">
            {exam.shortName || exam.name}
          </h3>
        </div>
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-50 to-violet-100 flex items-center justify-center text-violet-600 ring-1 ring-violet-200/50 shrink-0 group-hover:scale-110 group-hover:from-violet-500 group-hover:to-violet-600 group-hover:text-white transition-all duration-300">
          <Award className="w-6 h-6" />
        </div>
      </div>

      <p className="text-sm text-slate-500 mb-5 line-clamp-2 leading-relaxed">
        {exam.name}: Comprehensive guide for eligibility, syllabus, and exam pattern.
      </p>

      <div className="flex items-center gap-3 py-3.5 border-y border-slate-100 mb-5">
        <Calendar className="w-4 h-4 text-violet-500 shrink-0" />
        <div className="text-xs">
          <p className="text-slate-400 font-medium">Exam Date</p>
          <p className="text-slate-800 font-bold">{examDate}</p>
        </div>
      </div>

      <Link
        to={`/exams/${exam.slug}`}
        className="inline-flex items-center gap-2 text-sm font-bold text-violet-700 hover:text-violet-600 transition-all group/link"
      >
        View Syllabus
        <ChevronRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
      </Link>
    </div>
  );
}

import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Calendar, Award, ChevronRight, Bell } from 'lucide-react';
import { updateUserSaved } from '../../store/slices/authSlice';
import { toast } from 'react-hot-toast';
import api from '../../utils/api';

export default function ExamCard({ exam, loading }) {
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector(state => state.auth);

  const isCurrentlyReminded = user?.examReminders?.some(id => 
    typeof id === 'object' ? id._id === exam?._id : id === exam?._id
  );

  const isReminded = isCurrentlyReminded || false;

  const handleReminder = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) {
      toast.error('Please log in to set exam reminders');
      return;
    }
    try {
      const { data } = await api.post(`/users/exam-reminder/${exam._id}`);
      dispatch(updateUserSaved({ examReminders: data.examReminders }));
      toast.success(data.reminded ? 'Reminder set successfully' : 'Reminder removed');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update exam reminder');
    }
  };

  if (loading) {
    return (
      <div className="card animate-pulse p-6">
        <div className="h-6 bg-slate-200 rounded w-1/3 mb-4" />
        <div className="h-4 bg-slate-200 rounded w-full mb-2" />
        <div className="h-4 bg-slate-200 rounded w-2/3" />
      </div>
    );
  }

  const rawDate = exam.examDates?.examDate || exam.examDate;
  const examDate = rawDate
    ? new Date(rawDate).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      })
    : 'To be announced';

  return (
    <div className="card p-6 group relative">
      <div className="flex items-start justify-between mb-4">
        <div>
          <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest block mb-1.5">
            {exam.type || 'Entrance Exam'}
          </span>
          <h3 className="text-xl font-display font-extrabold text-slate-900 dark:text-white group-hover:text-primary-750 dark:group-hover:text-primary-400 transition-colors">
            {exam.shortName || exam.name}
          </h3>
        </div>
        
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleReminder}
            aria-label={isReminded ? 'Remove reminder' : 'Set reminder'}
            className="w-8 h-8 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200/50 dark:border-slate-700 rounded-lg flex items-center justify-center shadow-xs transition-all cursor-pointer relative z-10"
          >
            <Bell
              size={14}
              className={`transition-colors ${isReminded ? 'fill-amber-500 text-amber-500' : 'text-slate-400'}`}
            />
          </button>
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary-50 dark:from-primary-950/40 to-primary-100 dark:to-primary-900/40 flex items-center justify-center text-primary-600 dark:text-primary-400 ring-1 ring-primary-200/50 dark:ring-primary-900 shrink-0 group-hover:scale-110 group-hover:from-primary-500 group-hover:to-primary-600 group-hover:text-white transition-all duration-300 overflow-hidden">
            {exam.image?.url ? (
              <img src={exam.image.url} alt={exam.name} className="w-full h-full object-contain p-1.5" />
            ) : (
              <Award className="w-6 h-6" />
            )}
          </div>
        </div>
      </div>

      <p className="text-sm text-slate-500 dark:text-slate-400 mb-5 line-clamp-2 leading-relaxed">
        {exam.name}: Comprehensive guide for eligibility, syllabus, and exam pattern.
      </p>

      <div className="flex items-center gap-3 py-3.5 border-y border-slate-100 dark:border-slate-800 mb-5">
        <Calendar className="w-4 h-4 text-primary-500 shrink-0" />
        <div className="text-xs">
          <p className="text-slate-400 dark:text-slate-500 font-medium">Exam Date</p>
          <p className="text-slate-800 dark:text-slate-200 font-bold">{examDate}</p>
        </div>
      </div>

      <Link
        to={`/exams/${exam.slug}`}
        className="inline-flex items-center gap-2 text-sm font-bold text-primary-700 dark:text-primary-400 hover:text-primary-600 dark:hover:text-primary-300 transition-all group/link"
      >
        View Syllabus
        <ChevronRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
      </Link>
    </div>
  );
}

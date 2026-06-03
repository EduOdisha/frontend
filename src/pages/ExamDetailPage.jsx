import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useDispatch, useSelector } from 'react-redux';
import { 
  Calendar, Link as LinkIcon, BookOpen, 
  Lightbulb, ChevronRight, Download,
  ExternalLink, Info, CheckCircle2,
  AlertCircle, Clock, FileText, Bell
} from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../utils/api';
import LeadForm from '../components/common/LeadForm';
import { updateUserSaved } from '../store/slices/authSlice';
import { toast } from 'react-hot-toast';

export default function ExamDetailPage() {
  const { slug } = useParams();
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector(state => state.auth);

  const { data: exam, isLoading, error } = useQuery({
    queryKey: ['exam', slug],
    queryFn: async () => {
      const { data } = await api.get(`/exams/${slug}`);
      return data.data;
    },
  });

  const isCurrentlyReminded = user?.examReminders?.some(id => 
    typeof id === 'object' ? id._id === exam?._id : id === exam?._id
  );

  const [isReminded, setIsReminded] = useState(isCurrentlyReminded || false);

  useEffect(() => {
    setIsReminded(isCurrentlyReminded || false);
  }, [isCurrentlyReminded, exam]);

  const handleReminder = async () => {
    if (!isAuthenticated) {
      toast.error('Please log in to set exam reminders');
      return;
    }
    try {
      const { data } = await api.post(`/users/exam-reminder/${exam._id}`);
      setIsReminded(data.reminded);
      dispatch(updateUserSaved({ examReminders: data.examReminders }));
      toast.success(data.reminded ? 'Reminder set successfully' : 'Reminder removed');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update exam reminder');
    }
  };

  if (isLoading) return <div className="min-h-screen pt-24 bg-slate-50 dark:bg-slate-950"></div>;
  if (error) return <div className="min-h-screen pt-24 flex items-center justify-center">Exam not found</div>;

  const examDates = [
    { label: 'Notification', date: exam.examDates?.notification },
    { label: 'Application Start', date: exam.examDates?.applicationStart || exam.applicationStartDate },
    { label: 'Application End', date: exam.examDates?.applicationEnd || exam.applicationEndDate },
    { label: 'Exam Date', date: exam.examDates?.examDate || exam.examDate },
    { label: 'Result Date', date: exam.examDates?.result },
  ].filter(d => d.date);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-12">
      {/* Hero Header */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 pt-8 pb-12">
        <div className="container-xl">
          <nav className="flex items-center gap-2 text-sm text-slate-500 mb-6">
            <Link to="/" className="hover:text-primary-600 transition-colors">Home</Link>
            <ChevronRight className="w-4 h-4" />
            <Link to="/exams" className="hover:text-primary-600 transition-colors">Exams</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-slate-900 dark:text-slate-300 font-medium">{exam.name}</span>
          </nav>

          <div className="flex flex-col lg:flex-row gap-8 items-start">
            <div className="w-20 h-20 lg:w-24 lg:h-24 rounded-2xl bg-white shadow-md border border-slate-100 dark:border-slate-700 p-3 shrink-0 flex items-center justify-center">
              <img src={exam.image?.url || '/exam-placeholder.png'} alt={exam.name} className="w-full h-full object-contain" />
            </div>
            <div className="flex-grow">
              <div className="flex flex-wrap items-center gap-3 mb-3">
                <span className="badge badge-blue">{exam.type} Exam</span>
                <span className="badge badge-purple">{exam.level} Level</span>
                {exam.isFeatured && <span className="badge badge-orange">Important</span>}
              </div>
              <h1 className="text-3xl lg:text-4xl font-display font-bold text-slate-900 dark:text-white mb-2">
                {exam.name} ({exam.shortName || exam.fullName})
              </h1>
              <p className="text-slate-600 dark:text-slate-400 font-medium flex items-center gap-2">
                Conducted by: <span className="text-slate-900 dark:text-slate-200">{exam.conductedBy || exam.conductingBody}</span>
              </p>
            </div>
            <div className="flex flex-col gap-3 w-full lg:w-auto">
              <button
                onClick={handleReminder}
                className="flex items-center justify-center gap-2 px-4 py-2.5 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold shadow-xs hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-all cursor-pointer w-full lg:w-auto"
              >
                <Bell
                  size={16}
                  className={`transition-colors ${isReminded ? 'fill-amber-500 text-amber-500' : 'text-slate-400'}`}
                />
                {isReminded ? 'Reminder Set' : 'Set Reminder'}
              </button>
              {exam.applicationLink && (
                <a href={exam.applicationLink} target="_blank" rel="noreferrer" className="btn-primary flex items-center justify-center gap-2">
                  Apply Now <ExternalLink className="w-4 h-4" />
                </a>
              )}
              {exam.syllabusLink && (
                <a href={exam.syllabusLink} target="_blank" rel="noreferrer" className="btn-secondary flex items-center justify-center gap-2">
                  Download Syllabus <Download className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="container-xl mt-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-12">
            {/* Exam Dates Section */}
            <section className="card p-8">
              <h2 className="text-2xl font-display font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                <Calendar className="w-6 h-6 text-primary-500" />
                Important Exam Dates
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {examDates.map((d, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                    <p className="text-xs font-bold text-slate-400 uppercase mb-1">{d.label}</p>
                    <p className="text-lg font-bold text-slate-900 dark:text-white">
                      {new Date(d.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            {/* Overview Section */}
            <section className="card p-8">
              <h2 className="text-2xl font-display font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                <Info className="w-6 h-6 text-primary-500" />
                About the Exam
              </h2>
              <div className="prose prose-slate dark:prose-invert max-w-none">
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed whitespace-pre-line">
                  {exam.overview || exam.description}
                </p>
              </div>
            </section>

            {/* Eligibility Section */}
            <section className="card p-8">
              <h2 className="text-2xl font-display font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                Eligibility Criteria
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-bold text-slate-400 uppercase mb-1">Qualification</h4>
                    <p className="text-slate-700 dark:text-slate-300 font-medium">{exam.eligibility?.qualification || 'Not Specified'}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-400 uppercase mb-1">Age Limit</h4>
                    <p className="text-slate-700 dark:text-slate-300 font-medium">{exam.eligibility?.age || 'Not Specified'}</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-bold text-slate-400 uppercase mb-1">Minimum Percentage</h4>
                    <p className="text-slate-700 dark:text-slate-300 font-medium">{exam.eligibility?.percentage || 'Not Specified'}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-400 uppercase mb-1">Domicile</h4>
                    <p className="text-slate-700 dark:text-slate-300 font-medium">{exam.eligibility?.domicile || 'Odisha'}</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Syllabus Section */}
            {exam.syllabus?.length > 0 && (
              <section className="card p-8">
                <h2 className="text-2xl font-display font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                  <BookOpen className="w-6 h-6 text-purple-500" />
                  Exam Syllabus & Pattern
                </h2>
                <div className="space-y-6">
                  {exam.syllabus.map((subject, idx) => (
                    <div key={idx} className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="text-lg font-bold text-slate-800 dark:text-white">{subject.subject}</h4>
                        <span className="badge badge-blue">{subject.marks} Marks</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {subject.topics.map((topic, tIdx) => (
                          <span key={tIdx} className="px-3 py-1.5 bg-slate-50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-400 text-sm rounded-lg border border-slate-100 dark:border-slate-800">
                            {topic}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Preparation Tips */}
            {exam.preparationTips?.length > 0 && (
              <section className="card p-8">
                <h2 className="text-2xl font-display font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                  <Lightbulb className="w-6 h-6 text-amber-500" />
                  Preparation Tips
                </h2>
                <ul className="space-y-4">
                  {exam.preparationTips.map((tip, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-slate-600 dark:text-slate-400">
                      <div className="w-6 h-6 rounded-full bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center text-amber-600 shrink-0 font-bold text-xs mt-0.5">
                        {idx + 1}
                      </div>
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            <div className="card p-6">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-primary-500" />
                Application Fee
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-slate-600 dark:text-slate-400">General/OBC</span>
                  <span className="font-bold text-slate-900 dark:text-white">₹{exam.applicationFee?.general || 0}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-600 dark:text-slate-400">SC/ST/PWD</span>
                  <span className="font-bold text-slate-900 dark:text-white">₹{exam.applicationFee?.sc_st || 0}</span>
                </div>
              </div>
            </div>

            {exam.faqs?.length > 0 && (
              <div className="card p-6">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">FAQs</h3>
                <div className="space-y-4">
                  {exam.faqs.slice(0, 3).map((faq, idx) => (
                    <div key={idx}>
                      <h4 className="text-sm font-bold text-slate-800 dark:text-white mb-1">{faq.question}</h4>
                      <p className="text-xs text-slate-500 line-clamp-2">{faq.answer}</p>
                    </div>
                  ))}
                </div>
                <button className="text-primary-600 font-bold text-sm mt-4 hover:underline">View all FAQs</button>
              </div>
            )}

            <div className="card p-6 sticky top-28 shadow-sm">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1">Get Exam Alerts</h3>
              <p className="text-sm text-slate-500 mb-6">Never miss an update for {exam.shortName}. Sign up for free alerts.</p>
              <LeadForm source="Exam Page" compact />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

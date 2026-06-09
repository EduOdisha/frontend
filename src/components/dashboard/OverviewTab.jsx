import { Link } from 'react-router-dom';
import {
  GraduationCap, BookOpen, Bell, ChevronRight,
  School, TrendingUp, Calendar, Clock, ArrowRight
} from 'lucide-react';

export default function OverviewTab({ data, isLoading, setActive }) {
  const cards = [
    { label: 'Saved Colleges', value: data?.savedColleges?.length || 0, icon: GraduationCap, bg: 'bg-primary-50 text-primary-600', hoverBg: 'group-hover:bg-primary-600 group-hover:text-white', href: () => setActive('saved') },
    { label: 'Applied Courses', value: data?.applications?.length || 0, icon: BookOpen, bg: 'bg-emerald-50 text-emerald-600', hoverBg: 'group-hover:bg-emerald-600 group-hover:text-white', href: () => setActive('courses') },
    { label: 'Exam Reminders', value: data?.examReminders?.length || 0, icon: Bell, bg: 'bg-amber-50 text-amber-600', hoverBg: 'group-hover:bg-amber-600 group-hover:text-white', href: () => setActive('exams') },
  ];

  return (
    <div className="space-y-6">
      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {cards.map((card, i) => (
          <button
            key={i}
            onClick={card.href}
            className="bg-white border border-slate-200/70 rounded-2xl p-5 text-left transition-all duration-300 group flex flex-col justify-between h-36 hover:border-primary-200 hover:shadow-md hover:-translate-y-0.5 cursor-pointer shadow-xs"
          >
            {/* Top Row: Icon badge + navigation arrow */}
            <div className="flex items-center justify-between w-full">
              <div className={`w-10 h-10 rounded-xl ${card.bg} ${card.hoverBg} flex items-center justify-center transition-all duration-300 shrink-0`}>
                <card.icon size={18} className="stroke-[2.5]" />
              </div>
              <ChevronRight size={16} className="text-slate-300 group-hover:text-primary-500 group-hover:translate-x-0.5 transition-all" />
            </div>
            
            {/* Value + Label */}
            <div className="mt-3">
              <p className="text-3xl font-extrabold text-slate-900 tracking-tight leading-none">
                {isLoading ? (
                  <span className="inline-block w-8 h-8 bg-slate-100 rounded-lg animate-pulse" />
                ) : (
                  card.value
                )}
              </p>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2">{card.label}</p>
            </div>
          </button>
        ))}
      </div>

      {/* Quick Actions Panel */}
      <div className="bg-white border border-slate-200/60 rounded-2xl p-6 shadow-xs">
        <div className="flex items-center gap-2 mb-4">
          <span className="w-1.5 h-3 rounded-full bg-primary-500" />
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Quick Actions</h3>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: 'Browse Colleges', href: '/colleges', icon: School, bg: 'text-primary-600 bg-primary-50 border-primary-100/50' },
            { label: 'Find Scholarships', href: '/scholarships', icon: TrendingUp, bg: 'text-emerald-600 bg-emerald-50 border-emerald-100/50' },
            { label: 'Upcoming Exams', href: '/exams', icon: Calendar, bg: 'text-amber-600 bg-amber-50 border-amber-100/50' },
            { label: 'Career Guidance', href: '/career-guidance', icon: BookOpen, bg: 'text-teal-600 bg-teal-50 border-teal-100/50' },
          ].map((a, i) => (
            <Link
              key={i}
              to={a.href}
              className="flex flex-col items-center gap-3.5 p-5 rounded-2xl border border-slate-100/80 hover:-translate-y-1 transition-all duration-300 text-center group bg-slate-50/50 hover:bg-white hover:border-primary-100 hover:shadow-md"
            >
              <div className={`w-11 h-11 rounded-xl ${a.bg} border flex items-center justify-center group-hover:scale-110 transition-transform shadow-xs`}>
                <a.icon size={18} className="stroke-[2]" />
              </div>
              <span className="text-xs font-bold text-slate-700 group-hover:text-slate-900 transition-colors">{a.label}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white border border-slate-200/60 rounded-2xl overflow-hidden shadow-xs">
        <div className="px-6 py-4 border-b border-slate-100/80 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock size={16} className="text-slate-400" />
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Recent Activity</h3>
          </div>
          {data?.activities?.length > 0 && (
            <span className="text-[10px] bg-slate-100 text-slate-500 font-bold px-2 py-0.5 rounded-full">
              {data.activities.length} Events
            </span>
          )}
        </div>
        
        {data?.activities?.length > 0 ? (
          <div className="divide-y divide-slate-50">
            {data.activities.map((a, i) => (
              <div key={i} className="px-6 py-4 flex items-center gap-4 hover:bg-slate-50/30 transition-colors">
                <div className="w-2.5 h-2.5 rounded-full bg-primary-500 border-2 border-white ring-2 ring-primary-100 shrink-0" />
                <p className="text-sm text-slate-700 flex-1 font-medium">{a.text}</p>
                <span className="text-xs text-slate-400 font-semibold">{a.time}</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="px-6 py-14 text-center">
            <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-100">
              <Clock size={20} className="text-slate-400" />
            </div>
            <p className="text-sm text-slate-500 font-semibold">No activity yet. Start exploring colleges!</p>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">Shortlist colleges, apply to courses or set reminders to track your journey here.</p>
            <Link to="/colleges" className="inline-flex items-center gap-1.5 mt-5 text-xs font-bold text-primary-600 hover:text-primary-700 transition-all hover:translate-x-0.5 bg-primary-50/50 hover:bg-primary-50 px-4 py-2 rounded-xl border border-primary-100/40">
              Explore Colleges <ArrowRight size={13} />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

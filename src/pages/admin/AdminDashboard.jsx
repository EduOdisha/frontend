import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import api from '../../utils/api';
import {
  Users, School, BookOpen, MessageSquare,
  TrendingUp, TrendingDown, ArrowRight,
  Activity, Plus, GraduationCap, FileText, FileEdit, AlertCircle
} from 'lucide-react';

function StatCard({ name, value, icon: Icon, trend, color }) {
  const positive = trend >= 0;
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5">
      <div className="flex items-center justify-between mb-4">
        <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${color}`}>
          <Icon size={17} />
        </div>
        <div className={`flex items-center gap-1 text-xs font-semibold ${positive ? 'text-emerald-600' : 'text-red-500'}`}>
          {positive ? <TrendingUp size={13} /> : <TrendingDown size={13} />}
          {Math.abs(trend)}%
        </div>
      </div>
      <p className="text-2xl font-extrabold text-slate-900 mb-0.5">{value.toLocaleString()}</p>
      <p className="text-xs text-slate-500 font-medium">{name}</p>
    </div>
  );
}

const STATUS_COLOR = {
  New: 'bg-blue-100 text-blue-700',
  Contacted: 'bg-amber-100 text-amber-700',
  'In Progress': 'bg-emerald-100 text-emerald-700',
  Converted: 'bg-emerald-100 text-emerald-700',
  Closed: 'bg-slate-100 text-slate-600',
};

export default function AdminDashboard() {
  const { data: analytics, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['admin-analytics'],
    queryFn: async () => {
      const { data } = await api.get('/admin/analytics');
      return data;
    },
  });

  const stats = [
    { name: 'Total Colleges', value: analytics?.data?.stats?.totalColleges || 0, icon: School, trend: 12, color: 'bg-primary-50 text-primary-600' },
    { name: 'Total Courses', value: analytics?.data?.stats?.totalCourses || 0, icon: BookOpen, trend: 8, color: 'bg-primary-50 text-primary-600' },
    { name: 'Active Leads', value: analytics?.data?.stats?.totalLeads || 0, icon: MessageSquare, trend: 24, color: 'bg-emerald-50 text-emerald-600' },
    { name: 'Total Users', value: analytics?.data?.stats?.totalUsers || 0, icon: Users, trend: -3, color: 'bg-amber-50 text-amber-600' },
  ];

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {[1, 2, 3, 4].map(i => <div key={i} className="skeleton h-28 rounded-xl" />)}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <div className="skeleton h-80 rounded-xl" />
          <div className="skeleton h-80 rounded-xl" />
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center max-w-xl mx-auto my-12 shadow-sm">
        <AlertCircle size={40} className="mx-auto text-red-500 mb-3" />
        <h3 className="text-base font-bold text-red-800 mb-1">Failed to load Dashboard data</h3>
        <p className="text-xs text-red-600 mb-4">
          {error.response?.data?.message || error.message || 'Please check your connection or log in again.'}
        </p>
        <button onClick={() => refetch()} className="btn-primary py-2 px-4 text-xs font-bold bg-primary-600 hover:bg-primary-700 active:bg-primary-800 text-white rounded-lg transition-all shadow-sm cursor-pointer">
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-display font-bold text-slate-900">Dashboard Overview</h1>
          <p className="text-sm text-slate-500 mt-0.5">EduOdisha Administration Panel</p>
        </div>
        <div className="text-xs text-slate-400 font-medium">
          {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map(s => <StatCard key={s.name} {...s} />)}
      </div>

      {/* Quick Actions */}
      <div className="bg-white border border-slate-200 rounded-xl p-5">
        <h2 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
          <Plus size={15} className="text-primary-600" />
          Quick Actions
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          <Link to="/admin/colleges?add=true" className="flex flex-col items-center justify-center p-4 rounded-xl border border-slate-200 hover:border-primary-300 hover:bg-slate-50 transition-all text-center group">
            <div className="w-10 h-10 rounded-lg bg-primary-50 text-primary-600 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
              <School size={20} />
            </div>
            <span className="text-xs font-semibold text-slate-700">Add College</span>
          </Link>
          
          <Link to="/admin/courses?add=true" className="flex flex-col items-center justify-center p-4 rounded-xl border border-slate-200 hover:border-primary-300 hover:bg-slate-50 transition-all text-center group">
            <div className="w-10 h-10 rounded-lg bg-primary-50 text-primary-600 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
              <BookOpen size={20} />
            </div>
            <span className="text-xs font-semibold text-slate-700">Add Course</span>
          </Link>

          <Link to="/admin/exams?add=true" className="flex flex-col items-center justify-center p-4 rounded-xl border border-slate-200 hover:border-primary-300 hover:bg-slate-50 transition-all text-center group">
            <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
              <FileText size={20} />
            </div>
            <span className="text-xs font-semibold text-slate-700">Add Exam</span>
          </Link>

          <Link to="/admin/scholarships?add=true" className="flex flex-col items-center justify-center p-4 rounded-xl border border-slate-200 hover:border-primary-300 hover:bg-slate-50 transition-all text-center group">
            <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
              <GraduationCap size={20} />
            </div>
            <span className="text-xs font-semibold text-slate-700">Add Scholarship</span>
          </Link>

          <Link to="/admin/blogs?add=true" className="flex flex-col items-center justify-center p-4 rounded-xl border border-slate-200 hover:border-primary-300 hover:bg-slate-50 transition-all text-center group">
            <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
              <FileEdit size={20} />
            </div>
            <span className="text-xs font-semibold text-slate-700">Create Blog</span>
          </Link>
        </div>
      </div>

      {/* Tables Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Recent Leads */}
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Activity size={15} className="text-primary-600" />
              <h2 className="text-sm font-bold text-slate-800">Recent Leads</h2>
            </div>
            <Link to="/admin/leads" className="text-xs font-semibold text-primary-600 hover:text-primary-700 flex items-center gap-1">
              View All <ArrowRight size={12} />
            </Link>
          </div>
          <div className="divide-y divide-slate-100">
            {analytics?.data?.recentLeads?.length > 0 ? (
              analytics.data.recentLeads.map(lead => (
                <div key={lead._id} className="px-5 py-3.5 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold text-xs shrink-0">
                    {lead.name?.[0]?.toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-800 truncate">{lead.name}</p>
                    <p className="text-xs text-slate-400 truncate">{lead.college?.name || 'General Inquiry'}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${STATUS_COLOR[lead.status] || 'bg-slate-100 text-slate-600'}`}>
                      {lead.status}
                    </span>
                    <p className="text-[10px] text-slate-400 mt-1">
                      {new Date(lead.createdAt).toLocaleDateString('en-IN')}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="px-5 py-12 text-center">
                <MessageSquare size={28} className="mx-auto text-slate-200 mb-2" />
                <p className="text-sm text-slate-400">No leads yet</p>
              </div>
            )}
          </div>
        </div>

        {/* Top Colleges */}
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <School size={15} className="text-primary-600" />
              <h2 className="text-sm font-bold text-slate-800">Top Colleges by Views</h2>
            </div>
            <Link to="/admin/colleges" className="text-xs font-semibold text-primary-600 hover:text-primary-700 flex items-center gap-1">
              Manage <ArrowRight size={12} />
            </Link>
          </div>
          <div className="p-5 space-y-4">
            {analytics?.data?.topColleges?.length > 0 ? (
              analytics.data.topColleges.map((college, idx) => (
                <div key={college._id} className="flex items-center gap-3">
                  <span className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-500 shrink-0">
                    {idx + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-800 truncate">{college.name}</p>
                    <div className="mt-1.5 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary-500 rounded-full"
                        style={{ width: `${Math.max(15, 100 - idx * 18)}%` }}
                      />
                    </div>
                  </div>
                  <span className="text-xs font-semibold text-slate-500 shrink-0">{college.views || 0}v</span>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <School size={28} className="mx-auto text-slate-200 mb-2" />
                <p className="text-sm text-slate-400">No data available</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
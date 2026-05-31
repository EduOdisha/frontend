import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useQuery } from '@tanstack/react-query';
import api from '../../utils/api';
import { 
  User, 
  BookOpen, 
  GraduationCap, 
  Bell, 
  LayoutDashboard,
  LogOut,
  Settings,
  ChevronRight,
  Bookmark
} from 'lucide-react';
import toast from 'react-hot-toast';

const DashboardPage = () => {
  const { user } = useSelector((state) => state.auth);
  const [activeTab, setActiveTab] = useState('Overview');

  const { data: dashboardData, isLoading, isError } = useQuery({
    queryKey: ['userDashboard'],
    queryFn: async () => {
      const { data } = await api.get('/users/dashboard');
      return data;
    }
  });

  const tabs = [
    { name: 'Overview', icon: LayoutDashboard },
    { name: 'Saved Colleges', icon: GraduationCap },
    { name: 'Saved Courses', icon: BookOpen },
    { name: 'Exam Reminders', icon: Bell },
    { name: 'Profile', icon: User },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-8 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row gap-8">
          
          {/* Sidebar */}
          <div className="w-full md:w-64 flex-shrink-0">
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
              <div className="p-6 text-center border-b border-slate-200 dark:border-slate-800">
                <div className="w-20 h-20 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <User size={40} className="text-primary-600 dark:text-primary-400" />
                </div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white truncate">
                  {user?.name || 'Student'}
                </h2>
                <p className="text-sm text-slate-500 dark:text-slate-400 truncate">
                  {user?.email}
                </p>
              </div>
              
              <nav className="p-4 space-y-1">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.name}
                      onClick={() => setActiveTab(tab.name)}
                      className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-all ${
                        activeTab === tab.name
                          ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400'
                          : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                      }`}
                    >
                      <Icon size={20} />
                      {tab.name}
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-grow">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                Welcome back, {user?.name?.split(' ')[0]}!
              </h1>
              <p className="text-slate-600 dark:text-slate-400 mt-1">
                Here's what's happening with your education journey.
              </p>
            </div>

            {/* Tab Content */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-6 min-h-[400px]">
              {activeTab === 'Overview' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="p-6 bg-blue-50 dark:bg-blue-900/10 rounded-2xl border border-blue-100 dark:border-blue-900/20">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 bg-blue-500 rounded-xl text-white">
                          <GraduationCap size={24} />
                        </div>
                        <div>
                          <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Saved Colleges</p>
                          <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                            {dashboardData?.savedColleges?.length || 0}
                          </h3>
                        </div>
                      </div>
                    </div>
                    <div className="p-6 bg-purple-50 dark:bg-purple-900/10 rounded-2xl border border-purple-100 dark:border-purple-900/20">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 bg-purple-500 rounded-xl text-white">
                          <BookOpen size={24} />
                        </div>
                        <div>
                          <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Applied Courses</p>
                          <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                            {dashboardData?.applications?.length || 0}
                          </h3>
                        </div>
                      </div>
                    </div>
                    <div className="p-6 bg-amber-50 dark:bg-amber-900/10 rounded-2xl border border-amber-100 dark:border-amber-900/20">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 bg-amber-500 rounded-xl text-white">
                          <Bell size={24} />
                        </div>
                        <div>
                          <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Exam Reminders</p>
                          <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                            {dashboardData?.reminders?.length || 0}
                          </h3>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Recent Activities</h3>
                    {dashboardData?.activities?.length > 0 ? (
                      <div className="space-y-4">
                        {dashboardData.activities.map((activity, idx) => (
                          <div key={idx} className="flex items-center gap-4 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
                            <div className="w-2 h-2 rounded-full bg-primary-500"></div>
                            <p className="text-slate-700 dark:text-slate-300 flex-grow">{activity.text}</p>
                            <span className="text-xs text-slate-500 dark:text-slate-500">{activity.time}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
                        <p className="text-slate-500 dark:text-slate-400">No recent activities yet.</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {activeTab === 'Saved Colleges' && (
                <div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Your Shortlisted Colleges</h3>
                  {dashboardData?.savedColleges?.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {dashboardData.savedColleges.map((college) => (
                        <div key={college._id} className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center gap-4">
                          <img src={college.logo || '/favicon.svg'} alt={college.name} className="w-12 h-12 rounded-lg object-cover" />
                          <div className="flex-grow">
                            <h4 className="font-bold text-slate-900 dark:text-white">{college.name}</h4>
                            <p className="text-sm text-slate-500">{college.location}</p>
                          </div>
                          <ChevronRight className="text-slate-400" />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-20">
                      <Bookmark size={48} className="mx-auto text-slate-300 dark:text-slate-700 mb-4" />
                      <p className="text-slate-500 dark:text-slate-400 mb-6">You haven't saved any colleges yet.</p>
                      <a href="/colleges" className="btn-primary inline-flex">Browse Colleges</a>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'Saved Courses' && (
                <div className="text-center py-20">
                   <BookOpen size={48} className="mx-auto text-slate-300 dark:text-slate-700 mb-4" />
                   <p className="text-slate-500 dark:text-slate-400">Your saved courses will appear here.</p>
                </div>
              )}

              {activeTab === 'Exam Reminders' && (
                <div className="text-center py-20">
                   <Bell size={48} className="mx-auto text-slate-300 dark:text-slate-700 mb-4" />
                   <p className="text-slate-500 dark:text-slate-400">Set reminders for upcoming exams.</p>
                </div>
              )}

              {activeTab === 'Profile' && (
                <div className="max-w-2xl">
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Profile Settings</h3>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-400 mb-1">Full Name</label>
                        <input type="text" defaultValue={user?.name} className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-400 mb-1">Email</label>
                        <input type="email" defaultValue={user?.email} disabled className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-500 cursor-not-allowed" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-400 mb-1">Phone Number</label>
                      <input type="tel" defaultValue={user?.phone} className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white" />
                    </div>
                    <button className="btn-primary mt-4">Save Changes</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { 
  Clock, Award, BookOpen, GraduationCap, 
  IndianRupee, Briefcase, ChevronRight,
  CheckCircle2, Star, TrendingUp, Users,
  Building2, ArrowRight
} from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../utils/api';
import LeadForm from '../components/common/LeadForm';

export default function CourseDetailPage() {
  const { slug } = useParams();

  const { data: course, isLoading, error } = useQuery({
    queryKey: ['course', slug],
    queryFn: async () => {
      const { data } = await api.get(`/courses/${slug}`);
      return data;
    },
  });

  const { data: similarCourses } = useQuery({
    queryKey: ['similar-courses', course?.stream],
    queryFn: async () => {
      const { data } = await api.get(`/courses?stream=${course?.stream}&limit=4`);
      return data.courses.filter(c => c._id !== course?._id);
    },
    enabled: !!course,
  });

  if (isLoading) return <div className="min-h-screen pt-24 bg-slate-50 dark:bg-slate-950"></div>;
  if (error) return <div className="min-h-screen pt-24 flex items-center justify-center">Course not found</div>;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-12">
      {/* Hero Header */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 pt-8 pb-12">
        <div className="container-xl">
          <nav className="flex items-center gap-2 text-sm text-slate-500 mb-6">
            <Link to="/" className="hover:text-primary-600 transition-colors">Home</Link>
            <ChevronRight className="w-4 h-4" />
            <Link to="/courses" className="hover:text-primary-600 transition-colors">Courses</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-slate-900 dark:text-slate-300 font-medium">{course.name}</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-center">
            <div className="lg:col-span-2">
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <span className="badge badge-blue">{course.level}</span>
                <span className="badge badge-purple">{course.stream}</span>
                {course.isFeatured && <span className="badge badge-orange">Trending</span>}
              </div>
              <h1 className="text-4xl lg:text-5xl font-display font-bold text-slate-900 dark:text-white mb-6">
                {course.name} ({course.shortName})
              </h1>
              <p className="text-lg text-slate-600 dark:text-slate-400 mb-8 max-w-2xl leading-relaxed">
                {course.description}
              </p>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Duration</span>
                  <div className="flex items-center gap-2 text-slate-900 dark:text-white font-bold">
                    <Clock className="w-4 h-4 text-primary-500" />
                    {course.duration}
                  </div>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Avg. Fees</span>
                  <div className="flex items-center gap-2 text-slate-900 dark:text-white font-bold">
                    <IndianRupee className="w-4 h-4 text-primary-500" />
                    ₹{course.fees?.min?.toLocaleString()} - {course.fees?.max?.toLocaleString()}
                  </div>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Avg. Salary</span>
                  <div className="flex items-center gap-2 text-slate-900 dark:text-white font-bold">
                    <TrendingUp className="w-4 h-4 text-emerald-500" />
                    ₹{course.averageSalary?.entry?.toLocaleString()} - {course.averageSalary?.mid?.toLocaleString()}
                  </div>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Level</span>
                  <div className="flex items-center gap-2 text-slate-900 dark:text-white font-bold">
                    <GraduationCap className="w-4 h-4 text-primary-500" />
                    {course.level}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="hidden lg:block relative">
              <div className="w-full aspect-square rounded-3xl overflow-hidden bg-primary-100 relative">
                <img 
                  src={course.image?.url || 'https://images.unsplash.com/photo-1523050335392-93851179ae2c?auto=format&fit=crop&q=80&w=600'} 
                  alt={course.name}
                  className="w-full h-full object-cover mix-blend-multiply opacity-80"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary-900/60 to-transparent"></div>
                <div className="absolute bottom-6 left-6 right-6 text-white">
                  <p className="text-sm font-bold uppercase tracking-widest mb-1 opacity-80">Career Path</p>
                  <p className="text-2xl font-display font-bold">{course.jobRoles?.[0] || 'Professional'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container-xl mt-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-12">
            {/* Overview Section */}
            <section className="card p-8">
              <h2 className="text-2xl font-display font-bold text-slate-900 dark:text-white mb-6">Course Overview</h2>
              <div className="prose prose-slate dark:prose-invert max-w-none">
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed whitespace-pre-line">
                  {course.overview}
                </p>
              </div>
            </section>

            {/* Eligibility & Admission */}
            <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="card p-8">
                <div className="w-12 h-12 bg-primary-50 dark:bg-primary-900/20 rounded-2xl flex items-center justify-center text-primary-600 mb-6">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Eligibility Criteria</h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                  {course.eligibility}
                </p>
              </div>
              <div className="card p-8">
                <div className="w-12 h-12 bg-amber-50 dark:bg-amber-900/20 rounded-2xl flex items-center justify-center text-amber-600 mb-6">
                  <BookOpen className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Admission Process</h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                  {course.admissionProcess}
                </p>
                {course.entranceExams?.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {course.entranceExams.map(exam => (
                      <span key={exam} className="px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-lg text-xs font-bold text-slate-600 dark:text-slate-400">
                        {exam}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </section>

            {/* Syllabus Section */}
            {course.syllabus?.length > 0 && (
              <section className="card p-8">
                <h2 className="text-2xl font-display font-bold text-slate-900 dark:text-white mb-6">Syllabus Overview</h2>
                <div className="space-y-4">
                  {course.syllabus.map((sem, idx) => (
                    <div key={idx} className="p-4 rounded-xl border border-slate-100 dark:border-slate-800">
                      <h4 className="font-bold text-slate-900 dark:text-white mb-3">Semester {sem.semester}</h4>
                      <div className="flex flex-wrap gap-2">
                        {sem.subjects.map((sub, sIdx) => (
                          <span key={sIdx} className="px-3 py-1.5 bg-slate-50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-400 text-sm rounded-lg">
                            {sub}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Top Colleges Section */}
            <section>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-display font-bold text-slate-900 dark:text-white">Top Colleges in Odisha</h2>
                <Link to="/colleges" className="text-primary-600 font-bold text-sm hover:underline">View All Colleges</Link>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {course.topColleges?.map((college) => (
                  <Link key={college._id} to={`/colleges/${college.slug}`} className="card p-4 group flex items-center gap-4">
                    <div className="w-16 h-16 rounded-xl border border-slate-100 dark:border-slate-800 p-2 shrink-0 overflow-hidden">
                      <img src={college.logo?.url} alt={college.name} className="w-full h-full object-contain" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 dark:text-white group-hover:text-primary-600 transition-colors line-clamp-1">{college.name}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <Star className="w-3 h-3 text-amber-400 fill-current" />
                        <span className="text-xs font-bold text-slate-500">{college.rating?.average || 0} ({college.rating?.count || 0} reviews)</span>
                      </div>
                      <p className="text-xs text-slate-400 mt-1">{college.location?.city}, Odisha</p>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            <div className="card p-6 sticky top-28">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1">Expert Career Guidance</h3>
              <p className="text-sm text-slate-500 mb-6">Want to know if {course.shortName} is right for you? Talk to our experts.</p>
              <LeadForm source="Course Page" />
            </div>

            <div className="card p-6">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Career Scope</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-6">
                {course.careerScope}
              </p>
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Key Job Roles</h4>
              <div className="flex flex-wrap gap-2">
                {course.jobRoles?.map(role => (
                  <span key={role} className="px-3 py-1 bg-primary-50 dark:bg-primary-900/20 text-primary-600 text-xs font-bold rounded-full">
                    {role}
                  </span>
                ))}
              </div>
            </div>

            {similarCourses?.length > 0 && (
              <div className="card p-6">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Other {course.stream} Courses</h3>
                <div className="space-y-4">
                  {similarCourses.map(c => (
                    <Link key={c._id} to={`/courses/${c.slug}`} className="flex items-center justify-between group">
                      <span className="text-sm font-medium text-slate-600 dark:text-slate-400 group-hover:text-primary-600 transition-colors">{c.name}</span>
                      <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-primary-600 transition-colors" />
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

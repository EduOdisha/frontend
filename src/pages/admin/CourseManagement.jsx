import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import api from '../../utils/api';
import {
  Plus, Search, Edit2, Trash2, Eye,
  CheckCircle, XCircle, AlertCircle,
  GraduationCap, BookOpen, TrendingUp,
  Star, Filter, X,
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import CourseForm from '../../components/admin/CourseForm';

// ─── Badge helpers ──────────────────────────────────────────────────────────
const LEVEL_COLORS = {
  UG:          'bg-blue-50 text-blue-700 border-blue-200',
  PG:          'bg-purple-50 text-purple-700 border-purple-200',
  '12th':      'bg-amber-50 text-amber-700 border-amber-200',
  '10th':      'bg-orange-50 text-orange-700 border-orange-200',
  Diploma:     'bg-teal-50 text-teal-700 border-teal-200',
  Certificate: 'bg-rose-50 text-rose-700 border-rose-200',
  Other:       'bg-slate-50 text-slate-600 border-slate-200',
};

const STREAM_COLORS = {
  Technology: 'bg-indigo-50 text-indigo-600',
  Medical:    'bg-emerald-50 text-emerald-600',
  Commerce:   'bg-amber-50 text-amber-600',
  Arts:       'bg-pink-50 text-pink-600',
  Science:    'bg-cyan-50 text-cyan-600',
  Law:        'bg-violet-50 text-violet-600',
  Design:     'bg-rose-50 text-rose-600',
  Vocational: 'bg-orange-50 text-orange-600',
  Other:      'bg-slate-50 text-slate-500',
};

// ─── Main Component ─────────────────────────────────────────────────────────
const CourseManagement = () => {
  const [searchTerm, setSearchTerm]         = useState('');
  const [filterLevel, setFilterLevel]       = useState('');
  const [filterStream, setFilterStream]     = useState('');
  const [showModal, setShowModal]           = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [searchParams, setSearchParams]     = useSearchParams();
  const queryClient = useQueryClient();

  // Auto-open modal if ?add=true
  useEffect(() => {
    if (searchParams.get('add') === 'true') {
      setSelectedCourse(null);
      setShowModal(true);
      setSearchParams({}, { replace: true });
    }
  }, [searchParams]);

  // ── Queries ────────────────────────────────────────────────────────────────
  const { data, isLoading } = useQuery({
    queryKey: ['admin-courses', searchTerm, filterLevel, filterStream],
    queryFn: async () => {
      const params = new URLSearchParams({ limit: 200 });
      if (searchTerm)   params.append('search', searchTerm);
      if (filterLevel)  params.append('level',  filterLevel);
      if (filterStream) params.append('stream', filterStream);
      const { data } = await api.get(`/courses?${params}`);
      return data;
    },
  });

  // ── Mutations ──────────────────────────────────────────────────────────────
  const createMutation = useMutation({
    mutationFn: (payload) => api.post('/courses', payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-courses'] });
      toast.success('Course created successfully!');
      handleCloseModal();
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to create course'),
  });

  const updateMutation = useMutation({
    mutationFn: ({ _id, ...payload }) => api.put(`/courses/${_id}`, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-courses'] });
      toast.success('Course updated successfully!');
      handleCloseModal();
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to update course'),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => api.delete(`/courses/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-courses'] });
      toast.success('Course deleted');
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to delete course'),
  });

  // ── Handlers ───────────────────────────────────────────────────────────────
  const handleCloseModal = () => { setShowModal(false); setSelectedCourse(null); };

  const handleSubmit = (formData) => {
    if (selectedCourse) {
      updateMutation.mutate({ ...formData, _id: selectedCourse._id });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this course?')) {
      deleteMutation.mutate(id);
    }
  };

  const courses = data?.data || [];
  const isMutating = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="space-y-6">

      {/* ─── Header ─────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Course Management</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            {data?.total ?? courses.length} courses found
          </p>
        </div>
        <button
          onClick={() => { setSelectedCourse(null); setShowModal(true); }}
          className="flex items-center gap-2 text-sm font-bold text-white bg-primary-600 hover:bg-primary-700
            px-5 py-2.5 rounded-xl transition-all shadow-md shadow-primary-600/20"
        >
          <Plus size={16} /> Add Course
        </button>
      </div>

      {/* ─── Filters ────────────────────────────────────── */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-wrap gap-3 items-center">
        {/* Search */}
        <div className="relative flex-1 min-w-[200px]">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name, stream..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-9 py-2.5 text-sm border border-slate-200 rounded-xl bg-slate-50
              focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400 transition-all"
          />
          {searchTerm && (
            <button onClick={() => setSearchTerm('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
              <X size={14} />
            </button>
          )}
        </div>

        {/* Level filter */}
        <select
          value={filterLevel} onChange={e => setFilterLevel(e.target.value)}
          className="px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl bg-white
            focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400 transition-all appearance-none"
        >
          <option value="">All Levels</option>
          {['10th', '12th', 'UG', 'PG', 'Diploma', 'Certificate', 'Other'].map(l => (
            <option key={l} value={l}>{l}</option>
          ))}
        </select>

        {/* Stream filter */}
        <select
          value={filterStream} onChange={e => setFilterStream(e.target.value)}
          className="px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl bg-white
            focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400 transition-all appearance-none"
        >
          <option value="">All Streams</option>
          {['Science', 'Commerce', 'Arts', 'Technology', 'Medical', 'Law', 'Design', 'Vocational', 'Other'].map(s => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>

        {(filterLevel || filterStream) && (
          <button
            onClick={() => { setFilterLevel(''); setFilterStream(''); }}
            className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-red-600 px-3 py-2 rounded-lg border border-slate-200 hover:border-red-200 hover:bg-red-50 transition-all"
          >
            <X size={12} /> Clear Filters
          </button>
        )}
      </div>

      {/* ─── Table ──────────────────────────────────────── */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="px-5 py-3.5 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Course</th>
                <th className="px-5 py-3.5 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Level & Stream</th>
                <th className="px-5 py-3.5 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Duration</th>
                <th className="px-5 py-3.5 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Fees (₹/yr)</th>
                <th className="px-5 py-3.5 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Avg Salary</th>
                <th className="px-5 py-3.5 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="px-5 py-3.5 text-[11px] font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                [1, 2, 3, 4].map(i => (
                  <tr key={i} className="animate-pulse">
                    {[1, 2, 3, 4, 5, 6, 7].map(j => (
                      <td key={j} className="px-5 py-4">
                        <div className="h-4 bg-slate-100 rounded-lg w-full" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : courses.length > 0 ? (
                courses.map(course => (
                  <tr key={course._id} className="hover:bg-slate-50/60 transition-colors group">

                    {/* Course name + image */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl border border-slate-100 bg-slate-50 flex items-center justify-center overflow-hidden shrink-0">
                          {course.image?.url ? (
                            <img src={course.image.url} alt={course.name} className="w-full h-full object-cover" />
                          ) : (
                            <BookOpen size={18} className="text-slate-300" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-bold text-slate-800 truncate max-w-[200px]">{course.name}</p>
                          {course.shortName && (
                            <p className="text-[11px] text-slate-400 font-semibold">{course.shortName}</p>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Level + Stream */}
                    <td className="px-5 py-4">
                      <div className="flex flex-col gap-1">
                        <span className={`inline-flex w-fit text-[10px] font-bold px-2 py-0.5 rounded-full border ${LEVEL_COLORS[course.level] || LEVEL_COLORS.Other}`}>
                          {course.level}
                        </span>
                        <span className={`inline-flex w-fit text-[10px] font-semibold px-2 py-0.5 rounded-full ${STREAM_COLORS[course.stream] || STREAM_COLORS.Other}`}>
                          {course.stream}
                        </span>
                      </div>
                    </td>

                    {/* Duration */}
                    <td className="px-5 py-4">
                      <p className="text-sm text-slate-600 font-medium">{course.duration || '—'}</p>
                    </td>

                    {/* Fees */}
                    <td className="px-5 py-4">
                      {course.fees?.min || course.fees?.max ? (
                        <div className="text-sm font-semibold text-slate-700">
                          {course.fees?.min ? `₹${(course.fees.min / 1000).toFixed(0)}K` : '—'}
                          {course.fees?.max ? ` – ₹${(course.fees.max / 1000).toFixed(0)}K` : ''}
                        </div>
                      ) : (
                        <span className="text-slate-300 text-sm">—</span>
                      )}
                    </td>

                    {/* Avg Salary */}
                    <td className="px-5 py-4">
                      {course.averageSalary?.entry ? (
                        <div className="flex items-center gap-1 text-sm font-bold text-emerald-600">
                          <TrendingUp size={12} />
                          {course.averageSalary.entry} LPA+
                        </div>
                      ) : (
                        <span className="text-slate-300 text-sm">—</span>
                      )}
                    </td>

                    {/* Status */}
                    <td className="px-5 py-4">
                      <div className="flex flex-col gap-1">
                        {course.isActive ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full w-fit">
                            <CheckCircle size={10} /> Active
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-slate-400 bg-slate-50 border border-slate-200 px-2 py-0.5 rounded-full w-fit">
                            <XCircle size={10} /> Inactive
                          </span>
                        )}
                        {course.isFeatured && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-600 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full w-fit">
                            <Star size={9} className="fill-amber-400 text-amber-400" /> Featured
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1.5 justify-end">
                        <a
                          href={`/courses/${course.slug}`}
                          target="_blank" rel="noreferrer"
                          className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all"
                          title="View on site"
                        >
                          <Eye size={15} />
                        </a>
                        <button
                          onClick={() => { setSelectedCourse(course); setShowModal(true); }}
                          className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                          title="Edit"
                        >
                          <Edit2 size={15} />
                        </button>
                        <button
                          onClick={() => handleDelete(course._id)}
                          disabled={deleteMutation.isPending}
                          className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all disabled:opacity-40"
                          title="Delete"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-14 h-14 bg-slate-100 rounded-full flex items-center justify-center">
                        <GraduationCap size={28} className="text-slate-300" />
                      </div>
                      <p className="text-sm font-bold text-slate-500">No courses found</p>
                      <p className="text-xs text-slate-400">
                        {searchTerm || filterLevel || filterStream
                          ? 'Try adjusting your filters'
                          : 'Click "Add Course" to create the first one'}
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ─── Add / Edit Modal ────────────────────────────── */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={handleCloseModal} />
          <div className="relative w-full max-w-3xl h-[88vh]">
            <CourseForm
              course={selectedCourse}
              onSubmit={handleSubmit}
              onClose={handleCloseModal}
              loading={isMutating}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseManagement;
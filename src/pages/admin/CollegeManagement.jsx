import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import api from '../../utils/api';
import { 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  Eye, 
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import CollegeForm from '../../components/admin/CollegeForm';

const CollegeManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedCollege, setSelectedCollege] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (searchParams.get('add') === 'true') {
      handleAddCollege();
      setSearchParams({}, { replace: true });
    }
  }, [searchParams]);

  const { data, isLoading } = useQuery({
    queryKey: ['admin-colleges', searchTerm],
    queryFn: async () => {
      const { data } = await api.get(`/colleges?search=${searchTerm}&limit=100&admin=true`);
      return data;
    }
  });

  const createMutation = useMutation({
    mutationFn: (newCollege) => api.post('/colleges', newCollege),
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-colleges']);
      queryClient.invalidateQueries(['colleges']);
      queryClient.invalidateQueries(['college']);
      toast.success('College created successfully');
      handleCloseModal();
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Failed to create college');
    }
  });

  const updateMutation = useMutation({
    mutationFn: (updatedCollege) => api.put(`/colleges/${updatedCollege._id}`, updatedCollege),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries(['admin-colleges']);
      queryClient.invalidateQueries(['colleges']);
      queryClient.invalidateQueries(['college']);
      queryClient.invalidateQueries(['college', variables.slug]);
      toast.success('College updated successfully');
      handleCloseModal();
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Failed to update college');
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => api.delete(`/colleges/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-colleges']);
      queryClient.invalidateQueries(['colleges']);
      toast.success('College deleted successfully');
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Failed to delete college');
    }
  });

  const handleAddCollege = () => {
    setSelectedCollege(null);
    setShowModal(true);
  };

  const handleEditCollege = (college) => {
    setSelectedCollege(college);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedCollege(null);
  };

  const handleSubmit = (formData) => {
    if (selectedCollege) {
      updateMutation.mutate({ ...formData, _id: selectedCollege._id });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this college? This will deactivate it.')) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">College Management</h1>
          <p className="text-slate-500 text-sm">Manage, edit and add new colleges to the platform.</p>
        </div>
        <button 
          onClick={handleAddCollege}
          className="btn-primary flex items-center gap-2"
        >
          <Plus size={20} />
          Add College
        </button>
      </div>

      {/* Filters & Search */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Search colleges by name, city or state..." 
            className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg outline-none focus:ring-2 ring-primary-500/20 transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">College Info</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Location</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {isLoading ? (
                [1, 2, 3, 4, 5].map((i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="px-6 py-4"><div className="h-10 bg-slate-100 dark:bg-slate-800 rounded w-48"></div></td>
                    <td className="px-6 py-4"><div className="h-4 bg-slate-100 dark:bg-slate-800 rounded w-24"></div></td>
                    <td className="px-6 py-4"><div className="h-4 bg-slate-100 dark:bg-slate-800 rounded w-20"></div></td>
                    <td className="px-6 py-4"><div className="h-6 bg-slate-100 dark:bg-slate-800 rounded-full w-16"></div></td>
                    <td className="px-6 py-4"><div className="h-8 bg-slate-100 dark:bg-slate-800 rounded w-24"></div></td>
                  </tr>
                ))
              ) : data?.data?.length > 0 ? (
                data.data.map((college) => (
                  <tr key={college._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-primary-600 font-bold">
                          {college.logo?.url ? (
                            <img src={college.logo.url} alt="" className="w-full h-full rounded-lg object-contain" />
                          ) : college.name?.[0]}
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-sm truncate max-w-[200px]">{college.name}</p>
                          <p className="text-xs text-slate-500 truncate">{college.category}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm">{college.location?.city}, Odisha</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded text-slate-600 dark:text-slate-400 capitalize">
                        {college.type}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {college.isActive !== false ? (
                        <span className="flex items-center gap-1.5 text-xs font-bold text-green-600 bg-green-50 dark:bg-green-900/20 px-2.5 py-1 rounded-full w-fit">
                          <CheckCircle size={12} />
                          Active
                        </span>
                      ) : (
                        <span className="flex items-center gap-1.5 text-xs font-bold text-slate-400 bg-slate-50 dark:bg-slate-800 px-2.5 py-1 rounded-full w-fit">
                          <XCircle size={12} />
                          Inactive
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <a href={`/colleges/${college.slug}`} target="_blank" rel="noreferrer" className="p-2 text-slate-400 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-colors" title="View">
                          <Eye size={18} />
                        </a>
                        <button 
                          onClick={() => handleEditCollege(college)}
                          className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors" title="Edit"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button 
                          onClick={() => handleDelete(college._id)}
                          className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors" 
                          title="Delete"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-slate-500 italic">
                    <div className="flex flex-col items-center gap-2">
                      <AlertCircle size={40} className="text-slate-300" />
                      <p>No colleges found matching your criteria.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={handleCloseModal} />
          <div className="relative w-full max-w-4xl h-[90vh] animate-in zoom-in duration-200">
            <CollegeForm 
              college={selectedCollege} 
              onSubmit={handleSubmit} 
              onClose={handleCloseModal}
              loading={createMutation.isPending || updateMutation.isPending}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default CollegeManagement;
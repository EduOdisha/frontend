import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../utils/api';
import { 
  Search, 
  MessageSquare, 
  User, 
  Phone, 
  Mail, 
  Calendar,
  Filter,
  MoreHorizontal,
  CheckCircle2,
  Clock,
  XCircle,
  ChevronDown
} from 'lucide-react';
import { toast } from 'react-hot-toast';

const LeadManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['admin-leads', searchTerm],
    queryFn: async () => {
      const { data } = await api.get(`/admin/leads?search=${searchTerm}`);
      return data;
    }
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }) => api.patch(`/admin/leads/${id}/status`, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-leads']);
      toast.success('Lead status updated');
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Failed to update status');
    }
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
      case 'contacted': return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400';
      case 'qualified': return 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400';
      case 'converted': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
      case 'rejected': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
      default: return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400';
    }
  };

  const statusOptions = ['new', 'contacted', 'qualified', 'converted', 'rejected'];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Lead Management</h1>
        <p className="text-slate-500 text-sm">Track and manage student inquiries and leads.</p>
      </div>

      {/* Filters & Search */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Search leads by name, email or college..." 
            className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg outline-none focus:ring-2 ring-primary-500/20 transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <select className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 outline-none text-sm">
            <option value="">All Status</option>
            {statusOptions.map(opt => <option key={opt} value={opt} className="capitalize">{opt}</option>)}
          </select>
          <button className="flex items-center gap-2 px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
            <Filter size={18} />
          </button>
        </div>
      </div>

      {/* Leads List */}
      <div className="grid grid-cols-1 gap-4">
        {isLoading ? (
          [1, 2, 3].map(i => (
            <div key={i} className="h-32 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 animate-pulse"></div>
          ))
        ) : data?.leads?.length > 0 ? (
          data.leads.map((lead) => (
            <div key={lead._id} className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden hover:border-primary-500/50 transition-all group">
              <div className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-primary-600">
                    <User size={24} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold">{lead.name}</h3>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full uppercase font-bold ${getStatusColor(lead.status)}`}>
                        {lead.status}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500">
                      <span className="flex items-center gap-1"><Mail size={12} /> {lead.email}</span>
                      <span className="flex items-center gap-1"><Phone size={12} /> {lead.phone}</span>
                      <span className="flex items-center gap-1 font-medium text-slate-700 dark:text-slate-300">
                        Interested in: {lead.college?.name || 'General Inquiry'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-4">
                  <div className="text-right hidden md:block">
                    <p className="text-xs text-slate-400 flex items-center justify-end gap-1">
                      <Calendar size={12} /> {new Date(lead.createdAt).toLocaleDateString()}
                    </p>
                    <p className="text-xs text-slate-500 mt-1">Ref: {lead._id.slice(-8).toUpperCase()}</p>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <div className="relative group/select">
                      <select 
                        value={lead.status}
                        onChange={(e) => updateStatusMutation.mutate({ id: lead._id, status: e.target.value })}
                        className="appearance-none bg-slate-100 dark:bg-slate-800 border-none rounded-lg px-4 py-2 pr-10 text-xs font-bold cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors outline-none"
                      >
                        {statusOptions.map(opt => (
                          <option key={opt} value={opt} className="capitalize">{opt}</option>
                        ))}
                      </select>
                      <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400" />
                    </div>
                    <button className="p-2 text-slate-400 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-colors">
                      <MessageSquare size={18} />
                    </button>
                    <button className="p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
                      <MoreHorizontal size={18} />
                    </button>
                  </div>
                </div>
              </div>
              {lead.message && (
                <div className="px-5 pb-4 ml-16">
                  <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-lg border border-slate-100 dark:border-slate-800/50">
                    <p className="text-xs text-slate-600 dark:text-slate-400 italic">"{lead.message}"</p>
                  </div>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="bg-white dark:bg-slate-900 p-12 text-center rounded-xl border border-slate-200 dark:border-slate-800">
            <Clock size={48} className="mx-auto text-slate-200 mb-4" />
            <h3 className="font-bold text-lg">No leads found</h3>
            <p className="text-slate-500">New inquiries will appear here as they come in.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LeadManagement;
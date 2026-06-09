import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import api from '../../utils/api';
import { Search, Users, Mail, Phone, Trash2, AlertCircle } from 'lucide-react';
import { toast } from 'react-hot-toast';

const ROLE_COLORS = {
  admin: 'bg-red-100 text-red-700',
  user: 'bg-blue-100 text-blue-700',
  counsellor: 'bg-emerald-100 text-emerald-700',
};

export default function UserManagement() {
  const [search, setSearch] = useState('');
  const qc = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['admin-users', search],
    queryFn: () => api.get(`/admin/users?search=${search}&limit=100`).then(r => r.data),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => api.delete(`/admin/users/${id}`),
    onSuccess: () => { qc.invalidateQueries(['admin-users']); toast.success('User removed'); },
    onError: (e) => toast.error(e.response?.data?.message || 'Failed'),
  });

  const changeRoleMutation = useMutation({
    mutationFn: ({ id, role }) => api.patch(`/admin/users/${id}/role`, { role }),
    onSuccess: () => { qc.invalidateQueries(['admin-users']); toast.success('Role updated'); },
    onError: (e) => toast.error(e.response?.data?.message || 'Failed'),
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">User Management</h1>
          <p className="text-slate-500 text-sm mt-0.5">View and manage registered users on the platform.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-white border border-slate-200 rounded-xl px-4 py-3 flex items-center gap-3">
            <Users size={16} className="text-primary-600" />
            <span className="text-sm font-bold text-slate-900">{data?.total || 0}</span>
            <span className="text-xs text-slate-500">Total Users</span>
          </div>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input type="text" placeholder="Search by name or email…" value={search} onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 text-sm border border-slate-200 rounded-lg outline-none focus:border-primary-400 bg-white" />
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="table-base">
            <thead>
              <tr>
                <th>User</th>
                <th>Phone</th>
                <th>Role</th>
                <th>Joined</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? [1,2,3,4].map(i => (
                <tr key={i} className="animate-pulse">
                  {[...Array(5)].map((_, j) => <td key={j}><div className="skeleton h-4 w-24 rounded" /></td>)}
                </tr>
              )) : data?.data?.length > 0 ? data.data.map(u => (
                <tr key={u._id}>
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold text-sm shrink-0">
                        {u.name?.[0]?.toUpperCase() || 'U'}
                      </div>
                      <div>
                        <p className="font-bold text-sm text-slate-900">{u.name}</p>
                        <div className="flex items-center gap-1 text-xs text-slate-400">
                          <Mail size={10} />
                          {u.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="flex items-center gap-1.5 text-sm text-slate-600">
                      <Phone size={12} className="text-slate-400" />
                      {u.phone || '—'}
                    </div>
                  </td>
                  <td>
                    <select
                      value={u.role}
                      onChange={e => changeRoleMutation.mutate({ id: u._id, role: e.target.value })}
                      className={`text-xs font-bold px-2.5 py-1 rounded-full border-none outline-none cursor-pointer ${ROLE_COLORS[u.role] || 'bg-slate-100 text-slate-600'}`}
                    >
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                      <option value="counsellor">Counsellor</option>
                    </select>
                  </td>
                  <td className="text-sm text-slate-500">{new Date(u.createdAt).toLocaleDateString('en-IN')}</td>
                  <td>
                    <button
                      onClick={() => { if (window.confirm(`Remove ${u.name}?`)) deleteMutation.mutate(u._id); }}
                      className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Remove User"
                    >
                      <Trash2 size={15} />
                    </button>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={5} className="py-12 text-center">
                    <AlertCircle size={36} className="mx-auto text-slate-200 mb-2" />
                    <p className="text-slate-400 text-sm">No users found.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

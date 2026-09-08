import { useState, useEffect } from 'react';
import { Users as UsersIcon, Loader2, AlertCircle, ShieldAlert } from 'lucide-react';
import axiosClient from '../../services/axiosClient';

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosClient.get('/auth/users'); // Custom route to fetch users list
      setUsers(response.data || []);
    } catch (err) {
      // Fallback in case auth/users is not exposed or fails: fetch from standard database endpoint
      try {
        const fallbackRes = await axiosClient.get('/users');
        setUsers(fallbackRes.data || []);
      } catch (fallbackErr) {
        setError(err.response?.data?.message || err.message || 'Failed to fetch users list');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleToggleAdmin = async (targetUser) => {
    const newRole = targetUser.role === 'admin' ? 'user' : 'admin';
    if (!window.confirm(`Change ${targetUser.name}'s role to ${newRole}?`)) return;

    setLoading(true);
    try {
      await axiosClient.put(`/auth/users/${targetUser._id}/role`, { role: newRole });
      alert('Role updated successfully!');
      fetchUsers();
    } catch (err) {
      alert(err.response?.data?.message || err.message || 'Role modification failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <header className="mb-8 text-left">
        <h1 className="text-2xl font-bold font-sans tracking-tight text-zinc-900">User Directory</h1>
        <p className="text-zinc-500 mt-1 text-sm">Monitor user accounts, roles, and privileges.</p>
      </header>

      {error && (
        <div className="bg-rose-50 border border-rose-200 text-rose-800 p-4 rounded-2xl mb-6 flex items-start gap-3 text-sm text-left">
          <AlertCircle className="h-5 w-5 text-rose-500 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold">Fetch Error</p>
            <p className="text-rose-600 mt-0.5">{error}</p>
          </div>
        </div>
      )}

      <div className="bg-white rounded-3xl border border-zinc-150 shadow-sm overflow-hidden text-left">
        {loading ? (
          <div className="p-12 flex flex-col items-center justify-center text-zinc-400">
            <Loader2 className="h-8 w-8 animate-spin text-[#0071e3] mb-3" />
            <span className="text-sm">Fetching user directories...</span>
          </div>
        ) : users.length === 0 ? (
          <div className="p-12 text-center text-zinc-400">
            <UsersIcon className="h-10 w-10 mx-auto text-zinc-300 mb-3" />
            <span className="text-sm">No registered user accounts found in the database.</span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="bg-zinc-50 text-zinc-500 uppercase text-[10px] tracking-widest font-extrabold border-b border-zinc-100">
                  <th className="py-4 px-6">User</th>
                  <th className="py-4 px-6">Role</th>
                  <th className="py-4 px-6 font-mono text-xs">Joined Date</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {users.map((item) => (
                  <tr key={item._id} className="hover:bg-zinc-50/50 transition-colors">
                    <td className="py-4 px-6 flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-zinc-100 flex items-center justify-center font-bold text-zinc-600 border border-zinc-200">
                        {item.name ? item.name.charAt(0).toUpperCase() : 'U'}
                      </div>
                      <div>
                        <span className="font-semibold text-zinc-900 block">{item.name}</span>
                        <span className="text-xs text-zinc-400 font-medium">{item.email}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                        item.role === 'admin' 
                          ? 'bg-amber-50 text-amber-600 border-amber-100' 
                          : 'bg-zinc-50 text-zinc-500 border-zinc-200'
                      }`}>
                        {item.role === 'admin' ? 'ADMINISTRATOR' : 'USER'}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-zinc-450 text-xs">
                      {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="py-4 px-6 text-right">
                      <button
                        onClick={() => handleToggleAdmin(item)}
                        className={`text-xs font-bold px-3 py-1.5 rounded-xl border transition-all cursor-pointer bg-transparent ${
                          item.role === 'admin'
                            ? 'text-rose-500 border-rose-100 hover:bg-rose-50'
                            : 'text-[#0071e3] border-zinc-150 hover:bg-zinc-50'
                        }`}
                      >
                        {item.role === 'admin' ? 'Revoke Admin' : 'Make Admin'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

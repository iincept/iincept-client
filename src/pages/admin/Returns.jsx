import { useState, useEffect } from 'react';
import { RefreshCw, Check, X, ShieldAlert, Loader2, Info } from 'lucide-react';
import axiosClient from '../../services/axiosClient';

export default function Returns() {
  const [returns, setReturns] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    fetchReturns();
  }, []);

  const fetchReturns = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosClient.get('/orders/admin/returns');
      setReturns(response.data || []);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to fetch return requests.');
    } finally {
      setLoading(false);
    }
  };

  const showSuccessMessage = (msg) => {
    setSuccess(msg);
    setTimeout(() => setSuccess(null), 3000);
  };

  const handleUpdateReturnStatus = async (id, newStatus) => {
    setUpdatingId(id);
    try {
      await axiosClient.put(`/orders/admin/returns/${id}/status`, { status: newStatus });
      showSuccessMessage(`Return request status set to ${newStatus}!`);
      fetchReturns();
    } catch (err) {
      alert(err.response?.data?.message || err.message || 'Failed to update status.');
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="space-y-6 text-left">
      {success && (
        <div className="fixed bottom-6 right-6 bg-zinc-900 text-white py-3.5 px-5 rounded-2xl shadow-xl flex items-center gap-3 border border-zinc-800 animate-in fade-in slide-in-from-bottom-5 duration-300 z-50">
          <Check className="h-5 w-5 text-emerald-400" />
          <span className="text-sm font-medium">{success}</span>
        </div>
      )}

      <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold font-sans tracking-tight text-zinc-900">Return & Refund Requests</h1>
          <p className="text-zinc-500 mt-1 text-sm">Review, reject, approve product returns or issue refunds.</p>
        </div>
        <button
          onClick={fetchReturns}
          className="flex items-center gap-2 bg-zinc-900 hover:bg-zinc-850 text-white px-4 py-2.5 rounded-2xl text-xs font-semibold shadow-sm transition-all cursor-pointer border-0"
        >
          <RefreshCw className="h-4 w-4" />
          Refresh
        </button>
      </header>

      {error && (
        <div className="bg-rose-50 border border-rose-200 text-rose-800 p-4 rounded-2xl mb-6 flex items-start gap-3 text-sm">
          <ShieldAlert className="h-5 w-5 text-rose-500 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold">Error Fetching Returns</p>
            <p className="text-rose-600 mt-0.5">{error}</p>
          </div>
        </div>
      )}

      <div className="bg-white rounded-3xl border border-zinc-150 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 flex flex-col items-center justify-center text-zinc-400">
            <Loader2 className="h-8 w-8 animate-spin text-zinc-900 mb-3" />
            <span className="text-sm">Fetching return files...</span>
          </div>
        ) : returns.length === 0 ? (
          <div className="p-12 text-center text-zinc-400 space-y-2">
            <Info className="h-8 w-8 mx-auto text-zinc-300" />
            <p className="text-sm">No return requests submitted yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="bg-zinc-50 text-zinc-500 uppercase text-[10px] tracking-widest font-extrabold border-b border-zinc-100">
                  <th className="py-4 px-6">Customer</th>
                  <th className="py-4 px-6">Order Details</th>
                  <th className="py-4 px-6">Reason & Comment</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {returns.map((req) => {
                  const order = req.order || {};
                  return (
                    <tr key={req._id} className="hover:bg-zinc-50/50 transition-colors">
                      <td className="py-4 px-6">
                        <span className="font-bold text-zinc-900 block">{req.user?.name || 'Unknown User'}</span>
                        <span className="text-xs text-zinc-400 font-medium">{req.user?.email || 'N/A'}</span>
                      </td>
                      <td className="py-4 px-6">
                        <span className="font-mono text-xs font-bold text-zinc-500 block">#{order._id?.substring(0, 10).toUpperCase()}...</span>
                        <span className="text-xs font-semibold text-zinc-800 block mt-0.5">₹{order.totalAmount?.toLocaleString()}</span>
                      </td>
                      <td className="py-4 px-6 max-w-xs">
                        <span className="inline-block bg-zinc-100 text-zinc-700 font-bold px-2 py-0.5 rounded text-[10px] mb-1">
                          {req.reason}
                        </span>
                        <p className="text-zinc-500 text-xs italic">{req.comments || 'No comment provided.'}</p>
                      </td>
                      <td className="py-4 px-6">
                        <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                          req.status === 'Approved'
                            ? 'bg-emerald-50 text-emerald-600 border-emerald-100'
                            : req.status === 'Rejected'
                            ? 'bg-rose-50 text-rose-600 border-rose-100'
                            : req.status === 'Refunded'
                            ? 'bg-purple-50 text-purple-600 border-purple-100'
                            : 'bg-amber-50 text-amber-600 border-amber-100'
                        }`}>
                          {req.status?.toUpperCase()}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right">
                        {req.status === 'Pending' ? (
                          <div className="flex justify-end gap-1.5">
                            <button
                              onClick={() => handleUpdateReturnStatus(req._id, 'Approved')}
                              disabled={updatingId === req._id}
                              className="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[10px] rounded-lg border-0 cursor-pointer transition-colors"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => handleUpdateReturnStatus(req._id, 'Refunded')}
                              disabled={updatingId === req._id}
                              className="px-2.5 py-1.5 bg-purple-650 hover:bg-purple-500 text-white font-bold text-[10px] rounded-lg border-0 cursor-pointer transition-colors"
                            >
                              Refund
                            </button>
                            <button
                              onClick={() => handleUpdateReturnStatus(req._id, 'Rejected')}
                              disabled={updatingId === req._id}
                              className="px-2.5 py-1.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 font-bold text-[10px] rounded-lg border-0 cursor-pointer transition-colors"
                            >
                              Reject
                            </button>
                          </div>
                        ) : (
                          <span className="text-xs text-zinc-400 italic">Resolved</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

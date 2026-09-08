import { useState, useEffect } from 'react';
import { RefreshCw, CheckCircle, Trash2, Mail, Phone, Building, Info, ShieldAlert, Loader2 } from 'lucide-react';
import axiosClient from '../../services/axiosClient';

export default function Enquiries() {
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    fetchEnquiries();
  }, []);

  const fetchEnquiries = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosClient.get('/enquiries/admin');
      setEnquiries(response.data || []);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to fetch bulk enquiries.');
    } finally {
      setLoading(false);
    }
  };

  const showSuccessMessage = (msg) => {
    setSuccess(msg);
    setTimeout(() => setSuccess(null), 3000);
  };

  const handleUpdateStatus = async (id, newStatus) => {
    setUpdatingId(id);
    try {
      await axiosClient.put(`/enquiries/admin/${id}/status`, { status: newStatus });
      showSuccessMessage(`Inquiry status set to ${newStatus}!`);
      fetchEnquiries();
    } catch (err) {
      alert(err.response?.data?.message || err.message || 'Failed to update status.');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDeleteEnquiry = async (id) => {
    if (!window.confirm('Are you sure you want to dismiss this enquiry?')) return;
    try {
      await axiosClient.delete(`/enquiries/admin/${id}`);
      showSuccessMessage('Enquiry deleted successfully.');
      fetchEnquiries();
    } catch (err) {
      alert(err.response?.data?.message || err.message || 'Failed to delete enquiry.');
    }
  };

  return (
    <div className="space-y-6 text-left">
      {success && (
        <div className="fixed bottom-6 right-6 bg-zinc-900 text-white py-3.5 px-5 rounded-2xl shadow-xl flex items-center gap-3 border border-zinc-800 animate-in fade-in slide-in-from-bottom-5 duration-300 z-50">
          <CheckCircle className="h-5 w-5 text-emerald-400" />
          <span className="text-sm font-medium">{success}</span>
        </div>
      )}

      <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold font-sans tracking-tight text-zinc-900">Bulk & Business Enquiries</h1>
          <p className="text-zinc-500 mt-1 text-sm">Review GST registration files, pricing requests, and bulk procurement inquiries.</p>
        </div>
        <button
          onClick={fetchEnquiries}
          className="flex items-center gap-2 bg-zinc-900 hover:bg-zinc-850 text-white px-4 py-2.5 rounded-2xl text-xs font-semibold shadow-sm transition-all cursor-pointer border-0"
        >
          <RefreshCw className="h-4 w-4" />
          Refresh List
        </button>
      </header>

      {error && (
        <div className="bg-rose-50 border border-rose-200 text-rose-800 p-4 rounded-2xl mb-6 flex items-start gap-3 text-sm">
          <ShieldAlert className="h-5 w-5 text-rose-500 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold">Error Loading Enquiries</p>
            <p className="text-rose-600 mt-0.5">{error}</p>
          </div>
        </div>
      )}

      <div className="bg-white rounded-3xl border border-zinc-150 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 flex flex-col items-center justify-center text-zinc-400">
            <Loader2 className="h-8 w-8 animate-spin text-zinc-900 mb-3" />
            <span className="text-sm">Fetching enquiries from database...</span>
          </div>
        ) : enquiries.length === 0 ? (
          <div className="p-12 text-center text-zinc-400 space-y-2">
            <Info className="h-8 w-8 mx-auto text-zinc-300" />
            <p className="text-sm">No business enquiries logged yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="bg-zinc-50 text-zinc-500 uppercase text-[10px] tracking-widest font-extrabold border-b border-zinc-100">
                  <th className="py-4 px-6">Company & Client</th>
                  <th className="py-4 px-6">Contact Info</th>
                  <th className="py-4 px-6">Enquiry Request</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {enquiries.map((enq) => (
                  <tr key={enq._id} className="hover:bg-zinc-50/50 transition-colors">
                    <td className="py-4 px-6">
                      <span className="font-extrabold text-zinc-900 flex items-center gap-1.5">
                        <Building className="h-4 w-4 text-zinc-400" />
                        {enq.companyName}
                      </span>
                      {enq.gstin && (
                        <span className="inline-block mt-1 bg-zinc-100 text-zinc-650 font-mono text-[9px] font-bold px-2 py-0.5 rounded uppercase">
                          GST: {enq.gstin}
                        </span>
                      )}
                      <span className="text-zinc-500 text-xs block mt-1.5 font-medium">Contact: {enq.fullName}</span>
                    </td>
                    <td className="py-4 px-6 space-y-1">
                      <div className="flex items-center gap-1.5 text-xs text-zinc-500">
                        <Mail className="h-3.5 w-3.5 text-zinc-400" />
                        <a href={`mailto:${enq.email}`} className="hover:underline">{enq.email}</a>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-zinc-500">
                        <Phone className="h-3.5 w-3.5 text-zinc-400" />
                        <a href={`tel:${enq.phone}`} className="hover:underline">{enq.phone}</a>
                      </div>
                    </td>
                    <td className="py-4 px-6 max-w-xs">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-zinc-900">{enq.productInterest}</span>
                        <span className="bg-zinc-100 text-zinc-700 font-bold px-1.5 py-0.5 rounded text-[10px]">
                          QTY: {enq.quantity}
                        </span>
                      </div>
                      {enq.targetPrice && (
                        <span className="text-[10px] text-[#0071e3] font-bold block mt-1">
                          Target Price: ₹{enq.targetPrice.toLocaleString()}/unit
                        </span>
                      )}
                      <p className="text-zinc-550 text-xs mt-1.5 italic font-medium">{enq.message || 'No additional specifications provided.'}</p>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                        enq.status === 'Completed'
                          ? 'bg-emerald-50 text-emerald-600 border-emerald-100'
                          : enq.status === 'Contacted'
                          ? 'bg-blue-50 text-blue-600 border-blue-100'
                          : 'bg-amber-50 text-amber-600 border-amber-100'
                      }`}>
                        {enq.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex justify-end gap-1.5">
                        {enq.status !== 'Completed' && (
                          <button
                            onClick={() => handleUpdateStatus(enq._id, enq.status === 'Pending' ? 'Contacted' : 'Completed')}
                            disabled={updatingId === enq._id}
                            className="px-2.5 py-1.5 bg-black hover:bg-zinc-800 text-white font-bold text-[10px] rounded-lg border-0 cursor-pointer transition-colors"
                          >
                            {enq.status === 'Pending' ? 'Mark Contacted' : 'Mark Completed'}
                          </button>
                        )}
                        <button
                          onClick={() => handleDeleteEnquiry(enq._id)}
                          className="p-1.5 bg-rose-50 text-rose-600 hover:bg-rose-100 rounded-lg border-0 cursor-pointer transition-colors"
                          title="Delete enquiry"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
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

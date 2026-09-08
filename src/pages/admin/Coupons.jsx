import { useState, useEffect } from 'react';
import { Gift, Plus, Trash2, X, Check, Loader2, AlertCircle } from 'lucide-react';
import axiosClient from '../../services/axiosClient';

export default function Coupons() {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const [showForm, setShowForm] = useState(false);
  const [couponForm, setCouponForm] = useState({
    code: '',
    discount: '',
    minimumAmount: '',
    expiryDate: ''
  });

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosClient.get('/coupons');
      setCoupons(response.data || []);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to fetch coupons');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCoupon = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await axiosClient.post('/coupons', {
        code: couponForm.code.toUpperCase().trim(),
        discount: Number(couponForm.discount),
        minimumAmount: Number(couponForm.minimumAmount || 0),
        expiryDate: couponForm.expiryDate
      });
      showSuccessMessage('Coupon created successfully!');
      setCouponForm({ code: '', discount: '', minimumAmount: '', expiryDate: '' });
      setShowForm(false);
      fetchCoupons();
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to create coupon');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCoupon = async (id) => {
    if (!window.confirm('Delete this coupon code?')) return;
    setLoading(true);
    try {
      await axiosClient.delete(`/coupons/${id}`);
      showSuccessMessage('Coupon deleted successfully!');
      fetchCoupons();
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to delete coupon');
    } finally {
      setLoading(false);
    }
  };

  const showSuccessMessage = (msg) => {
    setSuccess(msg);
    setTimeout(() => setSuccess(null), 3000);
  };

  return (
    <div>
      {success && (
        <div className="fixed bottom-6 right-6 bg-zinc-900 text-white py-3.5 px-5 rounded-2xl shadow-xl flex items-center gap-3 border border-zinc-805 animate-in fade-in slide-in-from-bottom-5 duration-300 z-50">
          <Check className="h-5 w-5 text-emerald-400" />
          <span className="text-sm font-medium">{success}</span>
        </div>
      )}

      {error && (
        <div className="bg-rose-50 border border-rose-200 text-rose-800 p-4 rounded-2xl mb-6 flex items-start gap-3 text-sm text-left">
          <AlertCircle className="h-5 w-5 text-rose-500 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold">Coupon Error</p>
            <p className="text-rose-600 mt-0.5">{error}</p>
          </div>
          <button onClick={() => setError(null)} className="ml-auto text-rose-400 hover:text-rose-600 cursor-pointer border-0 bg-transparent">
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {!showForm ? (
        <div>
          <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 text-left">
            <div>
              <h1 className="text-2xl font-bold font-sans tracking-tight text-zinc-900">Manage Coupons</h1>
              <p className="text-zinc-500 mt-1 text-sm">Add and configure promo coupon codes for discounts.</p>
            </div>
            <button
              onClick={() => setShowForm(true)}
              className="flex items-center gap-2 bg-[#0071e3] hover:bg-[#0077ed] text-white px-5 py-3 rounded-2xl text-sm font-medium tracking-wide shadow-sm hover:shadow-md transition-all cursor-pointer border-0"
            >
              <Plus className="h-4.5 w-4.5" />
              Add Coupon
            </button>
          </header>

          {/* Coupons list */}
          <div className="bg-white rounded-3xl border border-zinc-150 shadow-sm overflow-hidden text-left">
            {loading ? (
              <div className="p-12 flex flex-col items-center justify-center text-zinc-400">
                <Loader2 className="h-8 w-8 animate-spin text-[#0071e3] mb-3" />
                <span className="text-sm">Fetching coupons...</span>
              </div>
            ) : coupons.length === 0 ? (
              <div className="p-12 text-center text-zinc-400">
                <Gift className="h-10 w-10 mx-auto text-zinc-300 mb-3" />
                <span className="text-sm">No promotional coupon codes registered yet.</span>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm border-collapse">
                  <thead>
                    <tr className="bg-zinc-50 text-zinc-500 uppercase text-[10px] tracking-widest font-extrabold border-b border-zinc-100">
                      <th className="py-4 px-6">Coupon Code</th>
                      <th className="py-4 px-6">Discount %</th>
                      <th className="py-4 px-6">Min Purchase</th>
                      <th className="py-4 px-6 font-mono text-xs">Expires</th>
                      <th className="py-4 px-6 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100">
                    {coupons.map((item) => (
                      <tr key={item._id} className="hover:bg-zinc-50/50 transition-colors">
                        <td className="py-4 px-6 font-mono text-sm font-extrabold text-zinc-800 uppercase">
                          {item.code}
                        </td>
                        <td className="py-4 px-6 font-semibold text-zinc-700">
                          {item.discount}% Off
                        </td>
                        <td className="py-4 px-6 text-zinc-600 font-semibold">
                          ₹{item.minimumAmount ? item.minimumAmount.toLocaleString('en-IN') : '0'}
                        </td>
                        <td className="py-4 px-6 text-zinc-450 text-xs">
                          {item.expiryDate ? new Date(item.expiryDate).toLocaleDateString() : 'No Limit'}
                        </td>
                        <td className="py-4 px-6 text-right">
                          <button
                            onClick={() => handleDeleteCoupon(item._id)}
                            className="p-2 rounded-xl hover:bg-rose-50 text-zinc-500 hover:text-rose-600 transition-all cursor-pointer inline-block border-0 bg-transparent"
                            title="Delete coupon"
                          >
                            <Trash2 className="h-4 w-4" />
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
      ) : (
        // Add Coupon Form
        <div className="bg-white rounded-3xl border border-zinc-150 shadow-sm p-8 text-left max-w-lg mx-auto animate-in fade-in duration-200">
          <header className="flex items-center justify-between border-b border-zinc-100 pb-5 mb-6">
            <div>
              <h2 className="text-xl font-bold font-sans text-zinc-900">Add New Coupon</h2>
              <p className="text-zinc-500 text-xs mt-0.5">Specify discount rates and expiry limits.</p>
            </div>
            <button 
              onClick={() => setShowForm(false)}
              className="p-2 rounded-full hover:bg-zinc-100 text-zinc-400 hover:text-zinc-700 cursor-pointer border-0 bg-transparent"
            >
              <X className="h-5 w-5" />
            </button>
          </header>

          <form onSubmit={handleCreateCoupon} className="space-y-6">
            <div>
              <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">Coupon Code</label>
              <input
                type="text"
                required
                placeholder="e.g. APPLE10"
                value={couponForm.code}
                onChange={(e) => setCouponForm({...couponForm, code: e.target.value})}
                className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:border-[#0071e3] focus:ring-1 focus:ring-[#0071e3] outline-none text-sm transition-all uppercase"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">Discount Percentage</label>
              <input
                type="number"
                required
                min="1"
                max="100"
                placeholder="e.g. 10"
                value={couponForm.discount}
                onChange={(e) => setCouponForm({...couponForm, discount: e.target.value})}
                className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:border-[#0071e3] focus:ring-1 focus:ring-[#0071e3] outline-none text-sm transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">Minimum Purchase Amount (₹)</label>
              <input
                type="number"
                min="0"
                placeholder="e.g. 1000"
                value={couponForm.minimumAmount}
                onChange={(e) => setCouponForm({...couponForm, minimumAmount: e.target.value})}
                className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:border-[#0071e3] focus:ring-1 focus:ring-[#0071e3] outline-none text-sm transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">Expiry Date</label>
              <input
                type="date"
                required
                value={couponForm.expiryDate}
                onChange={(e) => setCouponForm({...couponForm, expiryDate: e.target.value})}
                className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:border-[#0071e3] focus:ring-1 focus:ring-[#0071e3] outline-none text-sm transition-all"
              />
            </div>

            <div className="flex justify-end gap-3 border-t border-zinc-100 pt-5 mt-8">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-5 py-3 rounded-xl text-sm font-semibold border border-zinc-200 text-zinc-600 hover:bg-zinc-50 cursor-pointer bg-transparent"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex items-center gap-2 bg-[#0071e3] hover:bg-[#0077ed] disabled:bg-[#0071e3]/60 text-white px-6 py-3 rounded-xl text-sm font-semibold tracking-wide shadow-sm hover:shadow-md transition-all cursor-pointer border-0"
              >
                {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                Create Coupon
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

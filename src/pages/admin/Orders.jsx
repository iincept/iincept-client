import { useState, useEffect } from 'react';
import { ShoppingBag, Loader2, AlertCircle, Eye, ShieldAlert, Check, X } from 'lucide-react';
import axiosClient from '../../services/axiosClient';

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosClient.get('/orders/admin/all');
      // On backend, it could return order records list
      setOrders(response.data || []);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  const showSuccessMessage = (msg) => {
    setSuccess(msg);
    setTimeout(() => setSuccess(null), 3000);
  };

  const handleStatusChange = async (orderId, newStatus) => {
    setUpdatingId(orderId);
    try {
      await axiosClient.put(`/orders/${orderId}/status`, { orderStatus: newStatus });
      showSuccessMessage('Order status updated successfully!');
      if (selectedOrder && (selectedOrder._id || selectedOrder.id) === orderId) {
        setSelectedOrder(prev => prev ? { ...prev, orderStatus: newStatus } : null);
      }
      fetchOrders();
    } catch (err) {
      alert(err.response?.data?.message || err.message || 'Status update failed');
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div>
      {success && (
        <div className="fixed bottom-6 right-6 bg-zinc-900 text-white py-3.5 px-5 rounded-2xl shadow-xl flex items-center gap-3 border border-zinc-800 animate-in fade-in slide-in-from-bottom-5 duration-300 z-50">
          <Check className="h-5 w-5 text-emerald-400" />
          <span className="text-sm font-medium">{success}</span>
        </div>
      )}

      <header className="mb-8 text-left">
        <h1 className="text-2xl font-bold font-sans tracking-tight text-zinc-900">Manage Orders</h1>
        <p className="text-zinc-500 mt-1 text-sm">Review, track, and update checkout transaction orders.</p>
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
            <span className="text-sm">Fetching orders...</span>
          </div>
        ) : orders.length === 0 ? (
          <div className="p-12 text-center text-zinc-400">
            <ShoppingBag className="h-10 w-10 mx-auto text-zinc-300 mb-3" />
            <span className="text-sm">No customer orders recorded in the database yet.</span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="bg-zinc-50 text-zinc-500 uppercase text-[10px] tracking-widest font-extrabold border-b border-zinc-100">
                  <th className="py-4 px-6">Order ID</th>
                  <th className="py-4 px-6">Customer</th>
                  <th className="py-4 px-6">Amount</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {orders.map((order) => (
                  <tr key={order._id} className="hover:bg-zinc-50/50 transition-colors">
                    <td className="py-4 px-6 font-mono text-xs font-bold text-zinc-600">
                      #{order._id.substring(0, 10).toUpperCase()}...
                    </td>
                    <td className="py-4 px-6">
                      <span className="font-semibold text-zinc-900 block">{order.user?.name || 'Guest User'}</span>
                      <span className="text-xs text-zinc-400 font-medium">{order.user?.email || 'N/A'}</span>
                    </td>
                    <td className="py-4 px-6 font-semibold text-zinc-800">
                      ₹{(order.totalAmount || order.totalPrice || 0).toLocaleString()}
                    </td>
                    <td className="py-4 px-6 space-y-1.5">
                      <div className="flex items-center gap-2">
                        <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                          order.paymentStatus === 'Paid' || order.isPaid
                            ? 'bg-emerald-50 text-emerald-600 border-emerald-100'
                            : order.paymentStatus === 'Failed'
                            ? 'bg-rose-50 text-rose-600 border-rose-100'
                            : 'bg-amber-50 text-amber-600 border-amber-100'
                        }`}>
                          {order.paymentStatus === 'Paid' || order.isPaid ? 'PAID' : order.paymentStatus === 'Failed' ? 'FAILED' : 'PENDING'}
                        </span>
                      </div>
                      <div>
                        <select
                          value={order.orderStatus || 'Pending'}
                          onChange={(e) => handleStatusChange(order._id, e.target.value)}
                          disabled={updatingId === order._id || order.orderStatus === 'Cancelled'}
                          className={`text-xs font-bold px-2 py-1 rounded-xl border bg-white focus:outline-none transition-all cursor-pointer ${
                            order.orderStatus === 'Delivered'
                              ? 'text-emerald-600 border-emerald-250 bg-emerald-50/10'
                              : order.orderStatus === 'Cancelled'
                              ? 'text-rose-500 border-rose-250 bg-rose-50/10'
                              : order.orderStatus === 'Shipped'
                              ? 'text-blue-500 border-blue-250 bg-blue-50/10'
                              : order.orderStatus === 'Processing'
                              ? 'text-amber-500 border-amber-250 bg-amber-50/10'
                              : 'text-zinc-500 border-zinc-250 bg-zinc-50/10'
                          }`}
                        >
                          <option value="Pending">Pending</option>
                          <option value="Processing">Processing</option>
                          <option value="Shipped">Shipped</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Cancelled">Cancelled</option>
                          <option value="Return Requested">Return Requested</option>
                          <option value="Returned">Returned</option>
                          <option value="Refunded">Refunded</option>
                        </select>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="p-2 rounded-xl hover:bg-zinc-100 text-zinc-500 hover:text-[#0071e3] transition-all cursor-pointer inline-block border-0 bg-transparent"
                        title="View order"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Order Details & Return Management Modal Overlay */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="bg-white rounded-[2rem] border border-zinc-200 max-w-2xl w-full max-h-[85vh] overflow-y-auto shadow-2xl p-6 sm:p-8 space-y-6 animate-in zoom-in-95 duration-250">
            <header className="flex justify-between items-center border-b border-zinc-150 pb-4">
              <div>
                <span className="text-[10px] text-zinc-400 font-extrabold uppercase tracking-wider">Order Details</span>
                <h2 className="text-xl font-bold font-sans text-zinc-950 font-mono">#{selectedOrder._id || selectedOrder.id}</h2>
              </div>
              <button 
                onClick={() => setSelectedOrder(null)}
                className="p-1.5 rounded-full hover:bg-zinc-100 text-zinc-400 hover:text-zinc-700 cursor-pointer border-0 bg-transparent"
              >
                <X className="h-5.5 w-5.5" />
              </button>
            </header>

            {/* Customer & Payment Summary */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="bg-zinc-50 border border-zinc-200 rounded-2xl p-4 space-y-2">
                <h3 className="font-extrabold text-zinc-900 uppercase tracking-wider text-[10px]">Customer Bio</h3>
                <p><span className="text-zinc-400">Name:</span> <strong className="text-zinc-800">{selectedOrder.user?.name || 'Guest User'}</strong></p>
                <p><span className="text-zinc-400">Email:</span> <strong className="text-zinc-800">{selectedOrder.user?.email || 'N/A'}</strong></p>
                <p><span className="text-zinc-400">Placed On:</span> <strong className="text-zinc-800">{new Date(selectedOrder.createdAt).toLocaleString()}</strong></p>
              </div>

              <div className="bg-zinc-50 border border-zinc-200 rounded-2xl p-4 space-y-2">
                <h3 className="font-extrabold text-zinc-900 uppercase tracking-wider text-[10px]">Payment Summary</h3>
                <p><span className="text-zinc-400">Method:</span> <strong className="text-zinc-850 uppercase">{selectedOrder.paymentMethod || 'COD'}</strong></p>
                <p>
                  <span className="text-zinc-400">Status:</span>{' '}
                  <strong className={`uppercase ${selectedOrder.paymentStatus === 'Paid' ? 'text-emerald-600' : 'text-amber-600'}`}>
                    {selectedOrder.paymentStatus}
                  </strong>
                </p>
                <p><span className="text-zinc-400">Grand Total:</span> <strong className="text-zinc-850">₹{selectedOrder.totalAmount?.toLocaleString()}</strong></p>
              </div>
            </div>

            {/* Shipping Destination */}
            <div className="space-y-2 text-xs">
              <h3 className="font-extrabold text-zinc-400 uppercase tracking-wider text-[10px]">Shipping Destination</h3>
              {selectedOrder.shippingAddress ? (
                <div className="p-4 bg-zinc-50 border border-zinc-200 rounded-2xl text-left space-y-1">
                  <p className="font-extrabold text-zinc-900">{selectedOrder.shippingAddress.fullName || selectedOrder.shippingAddress.name}</p>
                  <p className="text-zinc-600">{selectedOrder.shippingAddress.address || selectedOrder.shippingAddress.street}</p>
                  <p className="text-zinc-600">{selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state} - {selectedOrder.shippingAddress.pincode || selectedOrder.shippingAddress.postalCode}</p>
                  <p className="pt-2 text-zinc-500 font-semibold">Contact: {selectedOrder.shippingAddress.phone}</p>
                </div>
              ) : (
                <p className="text-zinc-450 italic">No delivery address attached.</p>
              )}
            </div>

            {/* Ordered Items List */}
            <div className="space-y-2 text-xs">
              <h3 className="font-extrabold text-zinc-400 uppercase tracking-wider text-[10px]">Items Summary</h3>
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {selectedOrder.orderItems?.map((item, idx) => {
                  const product = item.product || {};
                  return (
                    <div key={idx} className="flex justify-between items-center p-3 bg-white border border-zinc-150 rounded-xl">
                      <div className="text-left">
                        <strong className="text-zinc-800 text-sm block">{product.title || product.name || 'Premium Apple Item'}</strong>
                        <span className="text-zinc-450">Quantity: x{item.quantity}</span>
                      </div>
                      <span className="font-extrabold text-zinc-900">₹{(item.price * item.quantity).toLocaleString()}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Status & Return Actions Management */}
            <div className="bg-zinc-50 border border-zinc-200 rounded-2xl p-4 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h3 className="font-extrabold text-zinc-900 uppercase tracking-wider text-[10px]">Order Status Control</h3>
                  <p className="text-zinc-500 text-xs mt-0.5">Directly update execution status of this checkout.</p>
                </div>
                <select
                  value={selectedOrder.orderStatus || 'Pending'}
                  onChange={(e) => handleStatusChange(selectedOrder._id || selectedOrder.id, e.target.value)}
                  disabled={updatingId === (selectedOrder._id || selectedOrder.id)}
                  className="text-xs font-bold px-3 py-2 rounded-xl border border-zinc-250 bg-white focus:outline-none focus:ring-1 focus:ring-[#0071e3]"
                >
                  <option value="Pending">Pending</option>
                  <option value="Processing">Processing</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Cancelled">Cancelled</option>
                  <option value="Return Requested">Return Requested</option>
                  <option value="Returned">Returned</option>
                  <option value="Refunded">Refunded</option>
                </select>
              </div>

              {/* Special Return Actions */}
              {selectedOrder.orderStatus === 'Return Requested' && (
                <div className="pt-3 border-t border-zinc-200/80 flex flex-wrap gap-2 justify-end">
                  <button
                    onClick={() => handleStatusChange(selectedOrder._id || selectedOrder.id, 'Returned')}
                    className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-4 py-2.5 rounded-xl cursor-pointer transition-colors border-0"
                  >
                    Approve Return (Restores Stock)
                  </button>
                  <button
                    onClick={() => handleStatusChange(selectedOrder._id || selectedOrder.id, 'Refunded')}
                    className="bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs px-4 py-2.5 rounded-xl cursor-pointer transition-colors border-0"
                  >
                    Issue Refund
                  </button>
                  <button
                    onClick={() => handleStatusChange(selectedOrder._id || selectedOrder.id, 'Delivered')}
                    className="bg-zinc-200 hover:bg-zinc-350 text-zinc-800 font-bold text-xs px-4 py-2.5 rounded-xl cursor-pointer transition-colors border-0"
                  >
                    Reject Return
                  </button>
                </div>
              )}
            </div>

            <footer className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedOrder(null)}
                className="bg-zinc-900 hover:bg-zinc-850 text-white text-xs font-bold px-5 py-3 rounded-xl cursor-pointer transition-all shadow-sm border-0"
              >
                Done
              </button>
            </footer>
          </div>
        </div>
      )}
    </div>
  );
}

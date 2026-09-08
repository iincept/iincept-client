import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Package, Clock, Eye, AlertTriangle, Loader2, X } from 'lucide-react';
import { cancelOrder, fetchOrders } from '../redux/orderSlice';

const STATUS_THEMES = {
  Pending: 'bg-amber-50 text-amber-700 border border-amber-200',
  Processing: 'bg-blue-50 text-blue-700 border border-blue-200',
  Shipped: 'bg-indigo-50 text-indigo-700 border border-indigo-200',
  Delivered: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
  Cancelled: 'bg-rose-50 text-rose-700 border border-rose-200',
  'Return Requested': 'bg-violet-50 text-violet-700 border border-violet-200',
  Returned: 'bg-zinc-150 text-zinc-700 border border-zinc-300',
  Refunded: 'bg-zinc-200 text-zinc-800 border border-zinc-400'
};

export default function Orders() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { orders, loading } = useSelector((state) => state.orders);
  const [activeOrderDetails, setActiveOrderDetails] = useState(null);
  const [filterStatus, setFilterStatus] = useState('All');

  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);

  if (loading && orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-20 text-zinc-400">
        <Loader2 className="h-10 w-10 animate-spin text-zinc-900 mb-3" />
        <span className="text-sm font-semibold">Loading orders...</span>
      </div>
    );
  }

  const handleCancelOrder = (id) => {
    if (window.confirm('Are you sure you want to cancel this order? This will restore stock availability.')) {
      dispatch(cancelOrder(id));
      alert(`Order ${id} cancelled successfully.`);
      if (activeOrderDetails?.id === id) {
        setActiveOrderDetails(prev => prev ? { ...prev, orderStatus: 'Cancelled' } : null);
      }
    }
  };

  const statuses = ['All', 'Pending', 'Shipped', 'Delivered', 'Cancelled'];

  const filteredOrders = orders.filter(order => {
    if (filterStatus === 'All') return true;
    return order.orderStatus === filterStatus;
  });

  return (
    <div className="space-y-6 py-2 text-left animate-in fade-in duration-300">
      
      <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900 font-sans">My Orders</h1>

      {/* Interactive Status Filters */}
      <div className="flex flex-wrap gap-2 pb-2">
        {statuses.map(status => {
          const count = status === 'All' 
            ? orders.length 
            : orders.filter(o => o.orderStatus === status).length;
            
          return (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-4 py-2 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                filterStatus === status
                  ? 'bg-black text-white border-black shadow-sm'
                  : 'bg-white text-zinc-500 border-zinc-200 hover:text-zinc-900 hover:border-zinc-300 shadow-sm'
              }`}
            >
              {status} ({count})
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Left column: Orders list */}
        <div className="lg:col-span-2 space-y-4">
          {filteredOrders.length === 0 ? (
            <div className="border border-dashed border-zinc-200 bg-zinc-50 rounded-2xl p-12 text-center text-zinc-500 space-y-4 shadow-sm">
              <Package className="h-10 w-10 mx-auto text-zinc-300" />
              <div className="space-y-1">
                <p className="text-sm font-bold text-zinc-700">No {filterStatus !== 'All' ? filterStatus : ''} Orders Found</p>
                <p className="text-xs text-zinc-450">You have no orders matching the selected status filter.</p>
              </div>
            </div>
          ) : (
            filteredOrders.map((order) => (
              <div 
                key={order.id}
                className="p-5 bg-white border border-zinc-200 rounded-2xl space-y-4 hover:border-zinc-300 transition-colors shadow-sm animate-in fade-in duration-300"
              >
                {/* Order Meta Header */}
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-100 pb-3">
                  <div className="space-y-0.5">
                    <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">Order ID</span>
                    <p className="font-extrabold text-sm text-zinc-800 font-mono">#{order.id}</p>
                  </div>
                  
                  <div className="space-y-0.5 text-right sm:text-left">
                    <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">Date Placed</span>
                    <p className="text-xs text-zinc-600 font-semibold">{order.createdAt}</p>
                  </div>

                  {/* Status badge */}
                  <span className={`px-2.5 py-0.5 text-[10px] font-bold rounded-full border ${STATUS_THEMES[order.orderStatus] || 'bg-zinc-100 text-zinc-550 border-zinc-200'}`}>
                    {order.orderStatus}
                  </span>
                </div>

                {/* Order Items quick summary */}
                <div className="text-xs space-y-1.5">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between text-zinc-650">
                      <span className="font-medium text-zinc-800">{item.name} <strong className="text-zinc-400 font-semibold ml-1">x{item.quantity}</strong></span>
                      <span className="font-extrabold text-zinc-900">₹{(item.price * item.quantity).toLocaleString('en-IN')}</span>
                    </div>
                  ))}
                </div>

                {/* Order pricing footer */}
                <div className="flex flex-wrap items-center justify-between pt-3 border-t border-zinc-100 gap-4">
                  <div className="flex gap-4 text-[10px] text-zinc-400 font-semibold uppercase">
                    <span>Method: <strong className="text-zinc-700">{order.paymentMethod ? order.paymentMethod.toUpperCase() : 'COD'}</strong></span>
                    <span>Payment: <strong className="text-zinc-700">{order.paymentStatus || 'Pending'}</strong></span>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <span className="font-extrabold text-base text-zinc-900">₹{Number(order.totalAmount).toLocaleString('en-IN')}</span>
                    
                    <div className="flex gap-2">
                      <button 
                        onClick={() => navigate(`/orders/${order._id || order.id}`)}
                        className="p-2 bg-zinc-50 border border-zinc-200 hover:border-zinc-350 text-zinc-700 rounded-xl hover:bg-zinc-100 transition-all cursor-pointer"
                        aria-label="View Details"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      {(order.orderStatus === 'Pending' || order.orderStatus === 'Processing') && (
                        <button 
                          onClick={() => handleCancelOrder(order.id)}
                          className="px-3 py-1.5 bg-rose-50 text-rose-600 hover:bg-rose-100 hover:text-rose-700 text-xs font-bold rounded-xl border border-rose-200 transition-colors cursor-pointer"
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Right column: Sticky Active Order Detail View */}
        <aside className="space-y-6">
          {activeOrderDetails ? (
            <div className="bg-white border border-zinc-200 rounded-2xl p-6 space-y-6 animate-in slide-in-from-bottom duration-200 shadow-sm text-left">
              <div className="flex justify-between items-center border-b border-zinc-150 pb-3">
                <h2 className="font-bold text-lg text-zinc-900">Order Details</h2>
                <button 
                  onClick={() => setActiveOrderDetails(null)}
                  className="text-xs text-zinc-400 hover:text-zinc-700 cursor-pointer bg-transparent border-0 font-semibold"
                >
                  Dismiss
                </button>
              </div>

              {/* Status Timeline mockup */}
              <div className="space-y-4 text-xs text-left">
                <div className="space-y-1">
                  <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">Tracking Information</span>
                  <div className="relative pl-6 border-l border-zinc-200 space-y-4 mt-2">
                    <div className="relative">
                      <div className="absolute -left-[30px] top-0.5 h-4.5 w-4.5 rounded-full bg-zinc-900 border border-white flex items-center justify-center">
                        <Clock className="h-2.5 w-2.5 text-white" />
                      </div>
                      <p className="font-bold text-zinc-800">Payment Verified</p>
                      <span className="text-[10px] text-zinc-400">{activeOrderDetails.createdAt}</span>
                    </div>
                    {activeOrderDetails.orderStatus !== 'Cancelled' ? (
                      <>
                        <div className="relative">
                          <div className={`absolute -left-[30px] top-0.5 h-4.5 w-4.5 rounded-full border border-white flex items-center justify-center ${
                            ['Processing', 'Shipped', 'Delivered'].includes(activeOrderDetails.orderStatus) ? 'bg-zinc-900 text-white border-zinc-900' : 'bg-zinc-100 border-zinc-200'
                          }`} />
                          <p className={`font-bold ${['Processing', 'Shipped', 'Delivered'].includes(activeOrderDetails.orderStatus) ? 'text-zinc-800' : 'text-zinc-400'}`}>
                            Order Packaged
                          </p>
                          <span className="text-[10px] text-zinc-400">Awaiting carrier dispatch</span>
                        </div>
                        <div className="relative">
                          <div className={`absolute -left-[30px] top-0.5 h-4.5 w-4.5 rounded-full border border-white flex items-center justify-center ${
                            ['Shipped', 'Delivered'].includes(activeOrderDetails.orderStatus) ? 'bg-zinc-900 text-white border-zinc-900' : 'bg-zinc-100 border-zinc-200'
                          }`} />
                          <p className={`font-bold ${['Shipped', 'Delivered'].includes(activeOrderDetails.orderStatus) ? 'text-zinc-800' : 'text-zinc-400'}`}>
                            In Transit
                          </p>
                          <span className="text-[10px] text-zinc-400">Carrier transit details pending</span>
                        </div>
                      </>
                    ) : (
                      <div className="relative">
                        <div className="absolute -left-[30px] top-0.5 h-4.5 w-4.5 rounded-full bg-rose-600 border border-white flex items-center justify-center">
                          <X className="h-2.5 w-2.5 text-white" />
                        </div>
                        <p className="font-bold text-rose-600">Cancelled</p>
                        <span className="text-[10px] text-zinc-450">Order cancelled successfully.</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="border-t border-zinc-150 pt-4 space-y-2">
                  <div className="flex justify-between text-zinc-500">
                    <span>Items Total</span>
                    <span className="font-bold text-zinc-800">₹{Number(activeOrderDetails.totalAmount).toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-zinc-500">
                    <span>Shipping Method</span>
                    <span className="font-bold text-zinc-800">Express Delivery</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="border border-dashed border-zinc-200 bg-zinc-50 rounded-2xl p-12 text-center text-zinc-500 space-y-4 shadow-sm">
              <Clock className="h-8 w-8 mx-auto text-zinc-300 animate-pulse" />
              <p className="text-xs">Select an order eye icon to view tracking timeline details.</p>
            </div>
          )}
        </aside>

      </div>
    </div>
  );
}

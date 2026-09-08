import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { ArrowLeft, Clock, MapPin, CreditCard, Clipboard, Loader2, RefreshCw, X, FileText } from 'lucide-react';
import axiosClient from '../services/axiosClient';

const TIMELINE_STEPS = ['Pending', 'Processing', 'Shipped', 'Delivered'];

export default function OrderDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [requestingReturn, setRequestingReturn] = useState(false);
  const [showReturnModal, setShowReturnModal] = useState(false);
  const [returnReason, setReturnReason] = useState('Defective Item');
  const [returnComments, setReturnComments] = useState('');

  useEffect(() => {
    fetchOrderDetails();
  }, [id]);

  const fetchOrderDetails = async () => {
    setLoading(true);
    setError('');
    try {
      // Fetch details from backend GET /orders/:id
      const response = await axiosClient.get(`/orders/${id}`);
      setOrder(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load order details.');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadInvoice = async () => {
    if (!order) return;
    try {
      const { jsPDF } = await import('jspdf');
      const doc = new jsPDF();
      const orderIdShort = order._id.toString().substring(0, 10).toUpperCase();

      // Heading banner
      doc.setFont("helvetica", "bold");
      doc.setFontSize(22);
      doc.text("iiNCEPT Business Store", 14, 20);
      
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.text("Apple Authorised Reseller & Enterprise Partner", 14, 25);
      doc.text("GSTIN: 29AAFCI8329F1Z9", 14, 30);
      doc.text("Email: accounts@iincept.com | Web: www.iincept.com", 14, 35);

      doc.setDrawColor(200, 200, 200);
      doc.line(14, 40, 196, 40);

      // Invoice info row
      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);
      doc.text("TAX INVOICE / RECEIPT", 14, 48);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.text(`Invoice No: INC-${orderIdShort}`, 14, 55);
      doc.text(`Order Date: ${new Date(order.createdAt).toLocaleDateString('en-IN')}`, 14, 60);
      doc.text(`Payment Method: ${order.paymentMethod}`, 14, 65);
      doc.text(`Payment Status: ${order.paymentStatus}`, 14, 70);

      // Shipping Address details
      doc.setFont("helvetica", "bold");
      doc.text("Billed & Shipped To:", 120, 48);
      doc.setFont("helvetica", "normal");
      const addr = order.shippingAddress || {};
      doc.text(addr.name || 'Customer', 120, 55);
      doc.text(addr.addressLine1 || '', 120, 60);
      if (addr.addressLine2) doc.text(addr.addressLine2, 120, 65);
      doc.text(`${addr.city || ''}, ${addr.state || ''} - ${addr.pincode || ''}`, 120, 70);
      doc.text(`Phone: ${addr.phone || ''}`, 120, 75);

      doc.line(14, 80, 196, 80);

      // Product Table headers
      doc.setFont("helvetica", "bold");
      doc.text("S.No", 14, 88);
      doc.text("Item Details", 30, 88);
      doc.text("Brand", 100, 88);
      doc.text("Qty", 130, 88);
      doc.text("Unit Price (INR)", 150, 88);
      doc.text("Total (INR)", 175, 88);

      doc.line(14, 92, 196, 92);
      doc.setFont("helvetica", "normal");

      let currentY = 100;
      let serialNo = 1;

      (order.orderItems || []).forEach((item) => {
        const prod = item.product || {};
        doc.text(serialNo.toString(), 14, currentY);
        doc.text(prod.title || 'Apple Device', 30, currentY);
        doc.text(prod.brand || 'Apple', 100, currentY);
        doc.text(item.quantity.toString(), 130, currentY);
        doc.text(`Rs. ${item.price?.toLocaleString('en-IN')}`, 150, currentY);
        doc.text(`Rs. ${(item.price * item.quantity)?.toLocaleString('en-IN')}`, 175, currentY);
        currentY += 10;
        serialNo++;
      });

      doc.line(14, currentY, 196, currentY);
      currentY += 8;

      // Price break down calculations
      const rawSubtotal = (order.orderItems || []).reduce((acc, curr) => acc + curr.price * curr.quantity, 0);
      const taxAmount = Number((rawSubtotal * 0.18).toFixed(2));
      const subtotalWithTaxes = rawSubtotal + taxAmount;
      const discount = order.discountAmount || 0;

      doc.setFont("helvetica", "normal");
      doc.text("Items Subtotal (excl. Tax):", 120, currentY);
      doc.text(`Rs. ${rawSubtotal.toLocaleString('en-IN')}`, 175, currentY);
      currentY += 6;

      doc.text("GST (18% integrated tax):", 120, currentY);
      doc.text(`Rs. ${taxAmount.toLocaleString('en-IN')}`, 175, currentY);
      currentY += 6;

      if (discount > 0) {
        doc.text(`Discount Applied (${order.couponCode}):`, 120, currentY);
        doc.text(`- Rs. ${discount.toLocaleString('en-IN')}`, 175, currentY);
        currentY += 6;
      }

      doc.setFont("helvetica", "bold");
      doc.text("Grand Total (Paid):", 120, currentY);
      doc.text(`Rs. ${order.totalAmount?.toLocaleString('en-IN')}`, 175, currentY);
      
      // Footer Note
      currentY += 25;
      doc.setFont("helvetica", "italic");
      doc.setFontSize(8);
      doc.text("This is an electronically generated tax invoice document and requires no signature validation.", 14, currentY);
      doc.text("For help or support enquiries regarding your warranty, write to enterprise@iincept.com", 14, currentY + 4);

      // Save PDF file
      doc.save(`invoice_INC_${orderIdShort}.pdf`);
    } catch (err) {
      console.error(err);
      alert("Failed to compile and download PDF invoice.");
    }
  };

  const handleRequestReturn = async (e) => {
    e.preventDefault();
    if (!returnReason) {
      alert('Please select a reason for return.');
      return;
    }

    setRequestingReturn(true);
    try {
      const response = await axiosClient.put(`/orders/${id}/return`, {
        reason: returnReason,
        comments: returnComments
      });
      setOrder(response.data);
      setShowReturnModal(false);
      alert('Return request submitted successfully!');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to process return request.');
    } finally {
      setRequestingReturn(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-20 text-zinc-400">
        <Loader2 className="h-10 w-10 animate-spin text-zinc-900 mb-3" />
        <span className="text-sm font-semibold">Loading order details...</span>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="border border-zinc-200 bg-white rounded-3xl p-16 text-center space-y-6 max-w-xl mx-auto my-8 shadow-sm">
        <h2 className="text-2xl font-bold text-zinc-900">Unable to Load Order</h2>
        <p className="text-sm text-zinc-500">{error || 'Order does not exist or you are not authorized to view it.'}</p>
        <button 
          onClick={() => navigate('/orders')}
          className="inline-flex items-center gap-2 bg-black hover:bg-zinc-900 text-white font-bold px-6 py-3 rounded-xl transition-all cursor-pointer text-xs shadow-sm"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Orders
        </button>
      </div>
    );
  }

  // Get index of current step for tracking timeline
  const currentStatusIndex = TIMELINE_STEPS.indexOf(order.orderStatus);

  return (
    <div className="space-y-8 py-4 text-left animate-in fade-in duration-300">
      
      {/* Top action bar */}
      <div className="flex items-center justify-between gap-4">
        <button 
          onClick={() => navigate('/orders')}
          className="inline-flex items-center gap-2 text-zinc-500 hover:text-black font-semibold text-xs transition-colors bg-transparent border-0 cursor-pointer p-0"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to My Orders
        </button>
        <div className="flex items-center gap-4">
          <button 
            onClick={handleDownloadInvoice}
            className="inline-flex items-center gap-1.5 text-[#0071e3] hover:text-blue-800 text-xs transition-colors bg-transparent border-0 cursor-pointer p-0 font-semibold"
          >
            <FileText className="h-3.5 w-3.5" />
            Download Invoice PDF
          </button>
          <span className="text-zinc-200">|</span>
          <button 
            onClick={fetchOrderDetails}
            className="inline-flex items-center gap-1.5 text-zinc-400 hover:text-zinc-700 text-xs transition-colors bg-transparent border-0 cursor-pointer p-0 font-medium"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Refresh Status
          </button>
        </div>
      </div>

      {/* Main Order Details Card */}
      <div className="bg-white border border-zinc-200 rounded-3xl p-6 sm:p-8 space-y-8 shadow-sm">
        
        {/* Heading */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-zinc-100 pb-5">
          <div className="space-y-1">
            <span className="text-[10px] text-zinc-400 font-extrabold uppercase tracking-wider">Order Reference</span>
            <h1 className="text-xl sm:text-2xl font-extrabold text-zinc-900 font-mono">#{order._id || order.id}</h1>
          </div>
          <div className="text-right sm:text-left space-y-1">
            <span className="text-[10px] text-zinc-400 font-extrabold uppercase tracking-wider">Placed On</span>
            <p className="text-sm font-semibold text-zinc-800">{new Date(order.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
          </div>
        </div>

        {/* Tracking Timeline */}
        <div className="space-y-4">
          <h3 className="text-xs uppercase font-extrabold text-zinc-400 tracking-wider flex items-center gap-2">
            <Clock className="h-4 w-4 text-zinc-500" />
            Order Tracking Timeline
          </h3>

          {order.orderStatus === 'Cancelled' ? (
            <div className="p-4 bg-rose-50 border border-rose-100 text-rose-700 rounded-2xl text-xs font-semibold">
              This order has been cancelled. If any payment was deducted, it will be refunded to your source method.
            </div>
          ) : order.orderStatus === 'Return Requested' || order.orderStatus === 'Returned' || order.orderStatus === 'Refunded' ? (
            <div className="p-4 bg-violet-50 border border-violet-100 text-violet-700 rounded-2xl text-xs font-semibold">
              Current Return/Refund Status: <span className="underline font-bold uppercase tracking-wider">{order.orderStatus}</span>
            </div>
          ) : (
            <div className="pt-6 pb-2">
              {/* Horizontal line for desktop, vertical stack for mobile */}
              <div className="relative flex flex-col md:flex-row justify-between items-start md:items-center gap-8 md:gap-0">
                {/* Connecting bar */}
                <div className="absolute left-[9px] md:left-0 md:top-2.5 top-0 bottom-0 md:bottom-auto md:h-1 w-1 md:w-full bg-zinc-100 -z-10" />
                {TIMELINE_STEPS.map((step, idx) => {
                  const isCompleted = idx <= currentStatusIndex;
                  const isActive = idx === currentStatusIndex;
                  return (
                    <div key={step} className="flex md:flex-col items-center gap-4 md:gap-2 text-left md:text-center md:flex-1 relative z-10">
                      <div className={`h-5 w-5 rounded-full border-4 border-white flex items-center justify-center shadow-sm ${
                        isCompleted ? 'bg-black text-white ring-2 ring-black/10' : 'bg-zinc-150 border-zinc-200'
                      }`}>
                        {isCompleted && <div className="h-1.5 w-1.5 bg-white rounded-full" />}
                      </div>
                      <div className="space-y-0.5">
                        <p className={`text-xs font-bold ${isCompleted ? 'text-zinc-900' : 'text-zinc-400'}`}>
                          {step}
                        </p>
                        <span className="text-[10px] text-zinc-400 block max-w-[120px] md:mx-auto">
                          {step === 'Pending' && 'Order registered'}
                          {step === 'Processing' && 'Ready for shipping'}
                          {step === 'Shipped' && 'Carrier dispatched'}
                          {step === 'Delivered' && 'Order received'}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Two-Column details: Shipping vs Order summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4 border-t border-zinc-100">
          {/* Shipping Address */}
          <div className="space-y-3">
            <h3 className="text-xs uppercase font-extrabold text-zinc-400 tracking-wider flex items-center gap-2">
              <MapPin className="h-4 w-4 text-zinc-500" />
              Delivery Address
            </h3>
            {order.shippingAddress ? (
              <div className="p-4 bg-zinc-50 border border-zinc-200 rounded-2xl text-xs text-zinc-700 space-y-1 text-left">
                <p className="font-bold text-sm text-zinc-900">{order.shippingAddress.fullName}</p>
                <p>{order.shippingAddress.address}</p>
                <p>{order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}</p>
                <p className="pt-2 text-zinc-500">Contact: {order.shippingAddress.phone}</p>
              </div>
            ) : (
              <p className="text-xs text-zinc-400 italic">No address details available.</p>
            )}
          </div>

          {/* Payment info & Actions */}
          <div className="space-y-4">
            <h3 className="text-xs uppercase font-extrabold text-zinc-400 tracking-wider flex items-center gap-2">
              <CreditCard className="h-4 w-4 text-zinc-500" />
              Payment Status
            </h3>
            <div className="p-4 bg-zinc-50 border border-zinc-200 rounded-2xl text-xs text-zinc-700 space-y-2 text-left">
              <div className="flex justify-between">
                <span className="text-zinc-500">Payment Method:</span>
                <span className="font-bold text-zinc-800 uppercase">{order.paymentMethod}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">Payment Status:</span>
                <span className={`font-bold uppercase ${order.paymentStatus === 'Paid' ? 'text-emerald-600' : 'text-amber-600'}`}>
                  {order.paymentStatus}
                </span>
              </div>
            </div>

            {/* Conditionally show Return request button */}
            {order.orderStatus === 'Delivered' && (
              <button
                onClick={() => setShowReturnModal(true)}
                className="w-full inline-flex items-center justify-center gap-2 bg-black hover:bg-zinc-900 text-white font-bold py-3 rounded-xl transition-all cursor-pointer text-xs shadow-sm"
              >
                <RefreshCw className="h-4 w-4" />
                Request Return / Refund
              </button>
            )}
          </div>
        </div>

        {/* Ordered items details list */}
        <div className="space-y-4 pt-4 border-t border-zinc-100">
          <h3 className="text-xs uppercase font-extrabold text-zinc-400 tracking-wider flex items-center gap-2">
            <Clipboard className="h-4 w-4 text-zinc-500" />
            Items Ordered
          </h3>

          <div className="space-y-3">
            {order.orderItems?.map((item, idx) => {
              const product = item.product || {};
              const title = product.title || product.name || 'Electronic Item';
              const image = (product.images && product.images[0]) || '/avatar.png';
              const brand = product.brand || 'Premium';
              return (
                <div 
                  key={idx} 
                  className="flex items-center justify-between p-4 bg-white border border-zinc-200 rounded-2xl gap-4 hover:border-zinc-300 transition-colors shadow-sm"
                >
                  <div className="flex items-center gap-4">
                    <div className="h-16 w-16 bg-zinc-50 border border-zinc-200 rounded-xl overflow-hidden flex items-center justify-center p-1 shrink-0">
                      <img src={image} alt={title} className="w-full h-full object-contain" />
                    </div>
                    <div className="text-left space-y-0.5">
                      <span className="text-[9px] uppercase font-bold text-zinc-400 tracking-wider">{brand}</span>
                      <h4 className="font-bold text-zinc-800 text-sm line-clamp-1">{title}</h4>
                      <p className="text-xs text-zinc-500 font-semibold">Quantity: x{item.quantity}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-extrabold text-sm text-zinc-900">₹{(item.price * item.quantity).toLocaleString('en-IN')}</p>
                    <p className="text-[10px] text-zinc-400 font-semibold">₹{item.price.toLocaleString('en-IN')} each</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Grand Total */}
          <div className="flex justify-between items-center p-4 bg-zinc-50 border border-zinc-200 rounded-2xl">
            <span className="text-xs font-bold text-zinc-800 uppercase tracking-wide">Grand Total</span>
            <span className="text-xl font-extrabold text-zinc-900">₹{order.totalAmount?.toLocaleString('en-IN')}</span>
          </div>
        </div>

      </div>

      {/* Customer Return Enquiry Modal Dialog */}
      {showReturnModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-white border border-zinc-200 rounded-3xl p-6 shadow-2xl space-y-6 relative overflow-hidden animate-in zoom-in-95 duration-250">
            <header className="flex justify-between items-center border-b border-zinc-150 pb-3">
              <div>
                <span className="text-[10px] text-zinc-400 font-extrabold uppercase tracking-wider">Return Request</span>
                <h3 className="font-bold text-zinc-900 text-lg">Select Return Reason</h3>
              </div>
              <button 
                onClick={() => setShowReturnModal(false)}
                className="p-1 rounded-full hover:bg-zinc-100 text-zinc-400 hover:text-zinc-950 transition-colors border-0 bg-transparent cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </header>

            <form onSubmit={handleRequestReturn} className="space-y-4 text-xs text-left">
              <div className="space-y-1.5">
                <label className="block text-[10px] uppercase font-bold text-zinc-500 tracking-wider">Reason for Return</label>
                <select
                  value={returnReason}
                  onChange={(e) => setReturnReason(e.target.value)}
                  className="w-full bg-white border border-zinc-250 text-xs rounded-xl px-3.5 py-2.5 text-zinc-800 focus:outline-none focus:border-black cursor-pointer"
                >
                  <option value="Defective Device">Defective Device / Malfunctioning</option>
                  <option value="Incorrect Model">Incorrect Model / Color Received</option>
                  <option value="Quality Mismatch">Quality Mismatch / Unsatisfied</option>
                  <option value="Ordered By Mistake">Ordered By Mistake</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="block text-[10px] uppercase font-bold text-zinc-500 tracking-wider">Comments / Describe Issue</label>
                <textarea
                  value={returnComments}
                  onChange={(e) => setReturnComments(e.target.value)}
                  placeholder="Tell us what went wrong with the device..."
                  rows="4"
                  className="w-full bg-white border border-zinc-250 text-xs rounded-xl px-3.5 py-2.5 text-zinc-800 focus:outline-none focus:border-black resize-none"
                />
              </div>

              <div className="flex flex-col gap-2 pt-2">
                <button
                  type="submit"
                  disabled={requestingReturn}
                  className="w-full bg-black hover:bg-zinc-900 text-white font-bold py-3 rounded-xl text-xs transition-colors cursor-pointer border-0"
                >
                  {requestingReturn ? 'Submitting request...' : 'Confirm Return Request'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowReturnModal(false)}
                  className="w-full bg-zinc-100 hover:bg-zinc-200 text-zinc-700 py-3 rounded-xl text-xs transition-colors cursor-pointer border-0"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

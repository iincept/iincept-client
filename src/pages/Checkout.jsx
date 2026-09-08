import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Truck, CreditCard, Tag, ArrowRight, ShieldCheck, CheckCircle2, X } from 'lucide-react';
import { placeNewOrder } from '../redux/orderSlice';
import { clearCart } from '../redux/cartSlice';
import axiosClient from '../services/axiosClient';
import Loader from '../components/Loader';

export default function Checkout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Load cart items and auth details from Redux
  const { cartItems } = useSelector((state) => state.cart);
  const { loading } = useSelector((state) => state.orders);
  const { user } = useSelector((state) => state.auth);

  const [shippingAddress, setShippingAddress] = useState({
    fullName: user?.name || user?.fullName || '',
    email: user?.email || '',
    phone: user?.phone || user?.phoneNumber || '',
    address: '',
    city: '',
    state: '',
    pincode: ''
  });

  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [couponCode, setCouponCode] = useState('');
  const [discountAmount, setDiscountAmount] = useState(0);
  const [couponError, setCouponError] = useState('');
  
  // Razorpay Gateway Simulation Modal
  const [showRazorpayModal, setShowRazorpayModal] = useState(false);
  const [mockOrderData, setMockOrderData] = useState(null);
  const [localLoading, setLocalLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setShippingAddress(prev => ({
        ...prev,
        fullName: prev.fullName || user.name || user.fullName || '',
        email: prev.email || user.email || '',
        phone: prev.phone || user.phone || user.phoneNumber || ''
      }));
    }
  }, [user]);

  const handleInputChange = (e) => {
    setShippingAddress({
      ...shippingAddress,
      [e.target.name]: e.target.value
    });
  };

  const handleApplyCoupon = async (e) => {
    e.preventDefault();
    setCouponError('');
    if (!couponCode) {
      setCouponError('Please enter a coupon code.');
      return;
    }

    try {
      const response = await axiosClient.post('/coupons/apply', { code: couponCode });
      const { discountAmount, discount } = response.data;
      setDiscountAmount(discountAmount);
      alert(`Coupon "${couponCode.toUpperCase()}" Applied! ₹${discountAmount.toLocaleString('en-IN')} (${discount}% off) deducted from total.`);
    } catch (err) {
      setDiscountAmount(0);
      setCouponError(err.response?.data?.message || err.message || 'Failed to apply coupon');
    }
  };

  // Pricing calculations
  const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const shippingFee = subtotal > 500 ? 0 : 15.00;
  const totalAmount = subtotal + shippingFee - discountAmount;

  const sendWhatsAppOrderNotification = (order, items, addressObj, pMethod, finalTotal) => {
    try {
      const orderIdStr = order?.id || order?._id || 'ORD-' + Math.floor(100000 + Math.random() * 900000);
      const custName = addressObj?.fullName || addressObj?.name || user?.name || 'Customer';
      const custEmail = addressObj?.email || user?.email || '';
      const custPhone = addressObj?.phone || addressObj?.phoneNumber || '';
      const street = addressObj?.address || addressObj?.street || addressObj?.addressLine1 || '';
      const city = addressObj?.city || '';
      const state = addressObj?.state || '';
      const pincode = addressObj?.pincode || addressObj?.postalCode || '';

      let message = `🛒 *NEW ORDER PLACED - iiNCEPT Electronics* 🛒\n\n`;
      message += `🆔 *Order ID:* #${orderIdStr}\n`;
      message += `👤 *Customer Name:* ${custName}\n`;
      if (custEmail) message += `📧 *Email:* ${custEmail}\n`;
      if (custPhone) message += `📞 *Phone Number:* ${custPhone}\n`;
      message += `📍 *Delivery Address:* ${street}, ${city}, ${state} - ${pincode}\n`;
      message += `💳 *Payment Method:* ${pMethod}\n\n`;
      message += `📦 *Ordered Products:*\n`;

      (items || []).forEach((item, idx) => {
        const itemTitle = item.name || item.title || 'Product';
        const skuText = (item.sku && !itemTitle.includes('SKU:')) ? ` (SKU: ${item.sku})` : '';
        const itemQty = item.quantity || 1;
        const itemPrice = (item.price || 0) * itemQty;
        message += `${idx + 1}. *${itemTitle}${skuText}*\n   Qty: ${itemQty} | Amount: ₹${itemPrice.toLocaleString('en-IN')}\n`;
      });

      message += `\n💰 *Total Amount:* ₹${Number(finalTotal).toLocaleString('en-IN')}\n\n`;
      message += `Thank you for shopping with iiNCEPT! Hum aapka order jald hi process kar denge.`;

      const encodedMessage = encodeURIComponent(message);
      const whatsappUrl = `https://wa.me/918607222417?text=${encodedMessage}`;
      window.open(whatsappUrl, '_blank');
    } catch (err) {
      console.error('Failed to launch WhatsApp order notification:', err);
    }
  };

  const executeOrderPlacement = () => {
    const activeAddress = shippingAddress;
    const pMethod = 'COD';
    const finalTotal = Math.max(0, totalAmount);
    const snapshotItems = [...cartItems];

    dispatch(placeNewOrder({
      shippingAddressData: shippingAddress,
      paymentMethod: pMethod,
      couponCode: discountAmount > 0 ? couponCode : undefined,
      cartItems,
      totalAmount: finalTotal
    }))
      .unwrap()
      .then((order) => {
        dispatch(clearCart()); // Empty the cart on successful checkout
        sendWhatsAppOrderNotification(order, snapshotItems, activeAddress, pMethod, finalTotal);
        navigate('/orders');
      })
      .catch((err) => {
        alert(err || 'Failed to place order. Please try again.');
      });
  };

  const handleRazorpayCheckout = async () => {
    setLocalLoading(true);
    try {
      let addressId = selectedAddressId;
      if (isAddingNewAddress) {
        const addressResponse = await axiosClient.post('/address', shippingAddress);
        addressId = addressResponse.data._id;
      }

      // Create Order document on backend
      const orderRes = await axiosClient.post('/orders', {
        shippingAddress: addressId,
        paymentMethod: 'Razorpay',
        couponCode: discountAmount > 0 ? couponCode : undefined
      });
      const orderData = orderRes.data;

      // Fetch Razorpay key
      const keyRes = await axiosClient.get('/orders/razorpay-key');
      const razorpayKey = keyRes.data.key;

      const isMock = !razorpayKey || razorpayKey === 'rzp_test_placeholder';

      if (isMock) {
        setMockOrderData(orderData);
        setShowRazorpayModal(true);
      } else {
        if (!window.Razorpay) {
          alert('Razorpay SDK failed to load. Please check your internet connection.');
          return;
        }

        const options = {
          key: razorpayKey,
          amount: orderData.razorpayOrder.amount,
          currency: orderData.razorpayOrder.currency,
          name: "iiNCEPT Electronics",
          description: "Order Checkout Payment",
          order_id: orderData.razorpayOrder.id,
          handler: async function (response) {
            try {
              setLocalLoading(true);
              const verifyRes = await axiosClient.post('/orders/verify', {
                orderId: orderData._id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature
              });
              if (verifyRes.data.success) {
                dispatch(clearCart());
                alert('Payment successful and verified!');
                navigate('/orders');
              } else {
                alert('Signature verification failed.');
              }
            } catch (err) {
              alert(err.response?.data?.message || err.message || 'Signature verification failed.');
            } finally {
              setLocalLoading(false);
            }
          },
          prefill: {
            name: (isAddingNewAddress ? shippingAddress.fullName : savedAddresses.find(a => (a._id || a.id) === selectedAddressId)?.fullName) || '',
            contact: (isAddingNewAddress ? shippingAddress.phone : savedAddresses.find(a => (a._id || a.id) === selectedAddressId)?.phone) || ''
          },
          theme: {
            color: "#000000"
          },
          modal: {
            ondismiss: async function () {
              try {
                await axiosClient.put(`/orders/${orderData._id}/cancel`);
              } catch (err) {
                console.error('Failed to cancel order:', err);
              }
              alert('Payment cancelled by customer.');
            }
          }
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
      }
    } catch (err) {
      alert(err.response?.data?.message || err.message || 'Failed to initialize payment.');
    } finally {
      setLocalLoading(false);
    }
  };

  const handleSimulateSuccessfulMockPayment = async () => {
    if (!mockOrderData) return;
    setLocalLoading(true);
    setShowRazorpayModal(false);
    try {
      const verifyRes = await axiosClient.post('/orders/verify', {
        orderId: mockOrderData._id,
        razorpay_order_id: mockOrderData.razorpayOrder.id,
        razorpay_payment_id: 'mock_pay_' + Math.floor(Math.random() * 1000000),
        razorpay_signature: 'mock_sig_' + Math.floor(Math.random() * 1000000)
      });
      if (verifyRes.data.success) {
        const activeAddress = isAddingNewAddress 
          ? shippingAddress 
          : (savedAddresses.find(a => (a._id || a.id) === selectedAddressId) || shippingAddress);
        dispatch(clearCart());
        sendWhatsAppOrderNotification(mockOrderData, cartItems, activeAddress, 'Razorpay', totalAmount);
        alert('Payment successful (Mock Sandbox)!');
        navigate('/orders');
      } else {
        alert('Mock signature verification failed.');
      }
    } catch (err) {
      alert(err.response?.data?.message || err.message || 'Mock signature verification failed.');
    } finally {
      setLocalLoading(false);
    }
  };

  const handleAbortMockPayment = async () => {
    if (!mockOrderData) return;
    setLocalLoading(true);
    setShowRazorpayModal(false);
    try {
      await axiosClient.put(`/orders/${mockOrderData._id}/cancel`);
      alert('Mock payment cancelled. Order has been cancelled.');
    } catch (err) {
      console.error(err);
    } finally {
      setLocalLoading(false);
    }
  };

  const handleSubmitOrder = (e) => {
    e.preventDefault();
    
    // Validation
    if (!shippingAddress.fullName || !shippingAddress.email || !shippingAddress.phone || !shippingAddress.address || !shippingAddress.city || !shippingAddress.state || !shippingAddress.pincode) {
      alert('Please fill out all the shipping address fields (Name, Email, Phone Number, Address, City, State, Pincode).');
      return;
    }

    executeOrderPlacement(); // Direct order placement & WhatsApp redirect
  };

  if (cartItems.length === 0) {
    return (
      <div className="border border-zinc-200 bg-white rounded-3xl p-16 text-center space-y-6 max-w-xl mx-auto my-8 animate-in fade-in duration-300 shadow-sm">
        <div className="h-16 w-16 bg-zinc-50 border border-zinc-200 rounded-full flex items-center justify-center text-zinc-650 mx-auto">
          <ShieldCheck className="h-8 w-8 text-black" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-zinc-900">No Items for Checkout</h2>
          <p className="text-sm text-zinc-500 max-w-xs mx-auto">Your shopping cart is currently empty. Explore the catalog to select electronic gears.</p>
        </div>
        <Link 
          to="/?scroll=categories" 
          className="inline-flex items-center gap-2 bg-black hover:bg-zinc-900 text-white font-bold px-6 py-3 rounded-xl transition-all cursor-pointer text-xs"
        >
          Explore Shop
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 py-2 text-left animate-in fade-in duration-300">
      
      {(loading || localLoading) && <Loader message="Securing transactions..." />}

      <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Left Side: Address form, Coupon and Payment */}
        <form onSubmit={handleSubmitOrder} className="lg:col-span-2 space-y-6">
          
          {/* Shipping Address Section */}
          <div className="bg-white border border-zinc-200 rounded-2xl p-6 space-y-4 shadow-sm">
            <div className="border-b border-zinc-150 pb-3">
              <h2 className="font-bold text-lg flex items-center gap-2 text-zinc-900">
                <Truck className="h-5 w-5 text-black" />
                Shipping Address
              </h2>
            </div>

            {/* Direct Address Form */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">Full Name</label>
                <input 
                  type="text" 
                  name="fullName"
                  value={shippingAddress.fullName}
                  onChange={handleInputChange}
                  placeholder="John Doe" 
                  className="w-full bg-white border border-zinc-200 text-xs rounded-xl py-2.5 px-3.5 text-zinc-900 focus:outline-none focus:border-violet-500 transition-colors"
                  required
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">Email Address</label>
                <input 
                  type="email" 
                  name="email"
                  value={shippingAddress.email || ''}
                  onChange={handleInputChange}
                  placeholder="john@example.com" 
                  className="w-full bg-white border border-zinc-200 text-xs rounded-xl py-2.5 px-3.5 text-zinc-900 focus:outline-none focus:border-violet-500 transition-colors"
                  required
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">Phone Number</label>
                <input 
                  type="tel" 
                  name="phone"
                  value={shippingAddress.phone}
                  onChange={handleInputChange}
                  placeholder="9876543210" 
                  className="w-full bg-white border border-zinc-200 text-xs rounded-xl py-2.5 px-3.5 text-zinc-900 focus:outline-none focus:border-violet-500 transition-colors"
                  required
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">Pincode</label>
                <input 
                  type="text" 
                  name="pincode"
                  value={shippingAddress.pincode}
                  onChange={handleInputChange}
                  placeholder="400001" 
                  className="w-full bg-white border border-zinc-200 text-xs rounded-xl py-2.5 px-3.5 text-zinc-900 focus:outline-none focus:border-violet-500 transition-colors"
                  required
                />
              </div>
              <div className="space-y-1 sm:col-span-2">
                <label className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">Address Details</label>
                <input 
                  type="text" 
                  name="address"
                  value={shippingAddress.address}
                  onChange={handleInputChange}
                  placeholder="123 Street Name, Area" 
                  className="w-full bg-white border border-zinc-200 text-xs rounded-xl py-2.5 px-3.5 text-zinc-900 focus:outline-none focus:border-violet-500 transition-colors"
                  required
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">City</label>
                <input 
                  type="text" 
                  name="city"
                  value={shippingAddress.city}
                  onChange={handleInputChange}
                  placeholder="City" 
                  className="w-full bg-white border border-zinc-200 text-xs rounded-xl py-2.5 px-3.5 text-zinc-900 focus:outline-none focus:border-violet-500 transition-colors"
                  required
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">State</label>
                <input 
                  type="text" 
                  name="state"
                  value={shippingAddress.state}
                  onChange={handleInputChange}
                  placeholder="State" 
                  className="w-full bg-white border border-zinc-200 text-xs rounded-xl py-2.5 px-3.5 text-zinc-900 focus:outline-none focus:border-violet-500 transition-colors"
                  required
                />
              </div>
            </div>
          </div>

          {/* Place Order submit block */}
          <button 
            type="submit"
            className="w-full bg-black hover:bg-zinc-900 text-white font-bold py-3.5 px-6 rounded-xl flex items-center justify-center gap-2 transition-all duration-300 shadow-sm cursor-pointer"
          >
            <ShieldCheck className="h-5 w-5" />
            Place Order - ₹{Math.max(0, totalAmount).toLocaleString('en-IN')}
          </button>
        </form>

        {/* Right Side: Order Review & Pricing Math */}
        <aside className="space-y-6">
          <div className="bg-white border border-zinc-200 rounded-2xl p-6 space-y-6 shadow-sm">
            <h2 className="font-bold text-lg border-b border-zinc-150 pb-3 text-zinc-900">Review Items</h2>

            {/* Cart Items List */}
            <div className="divide-y divide-zinc-100 max-h-56 overflow-y-auto pr-1">
              {cartItems.map((item) => (
                <div key={item.id} className="py-3 flex items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2.5 text-left">
                    <div className="h-10 w-10 rounded bg-zinc-50 border border-zinc-200 overflow-hidden shrink-0">
                      <img src={item.image} alt="" className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <h4 className="font-bold text-zinc-800 line-clamp-1">{item.name}</h4>
                      <p className="text-[9px] text-zinc-550 font-semibold">Qty: {item.quantity} {item.size && `· ${item.size}`}</p>
                    </div>
                  </div>
                  <span className="font-bold text-zinc-700 shrink-0">₹{(item.price * item.quantity).toLocaleString('en-IN')}</span>
                </div>
              ))}
            </div>

            {/* Pricing Math */}
            <div className="space-y-3 text-xs border-t border-zinc-150 pt-4">
              <div className="flex justify-between text-zinc-500">
                <span>Subtotal</span>
                <span className="font-bold text-zinc-800">₹{subtotal.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-zinc-500">
                <span>Shipping Fee</span>
                <span className="font-bold text-zinc-800">{shippingFee === 0 ? 'Free' : `₹${shippingFee.toLocaleString('en-IN')}`}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-600 font-bold">
                  <span>Applied Coupon</span>
                  <span>-₹{discountAmount.toLocaleString('en-IN')}</span>
                </div>
              )}
              <hr className="border-zinc-150" />
              <div className="flex justify-between text-sm font-extrabold text-zinc-900">
                <span>Grand Total</span>
                <span>₹{Math.max(0, totalAmount).toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* Coupon input */}
            <form onSubmit={handleApplyCoupon} className="space-y-2 pt-2 border-t border-zinc-150">
              <label className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider">Coupon Code</label>
              <div className="flex gap-2">
                <input 
                  type="text" 
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  placeholder="Enter Coupon Code" 
                  className="bg-white border border-zinc-200 text-xs rounded-xl px-3 py-2 flex-grow text-zinc-800 focus:outline-none focus:border-zinc-350"
                />
                <button type="submit" className="bg-zinc-900 hover:bg-zinc-850 border border-zinc-900 text-xs font-semibold px-3.5 py-2 rounded-xl text-white cursor-pointer transition-colors">
                  Apply
                </button>
              </div>
              {couponError && <p className="text-[10px] text-rose-600 font-bold text-left">{couponError}</p>}
            </form>
          </div>
        </aside>

      </div>

      {/* Simulated Razorpay Gateway Modal Dialog */}
      {showRazorpayModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-white border border-zinc-200 rounded-3xl p-6 shadow-2xl text-center space-y-6 relative overflow-hidden animate-in zoom-in duration-300">
            <div className="absolute top-0 right-0 w-24 h-24 bg-violet-500/5 rounded-full blur-2xl" />
            
            <div className="flex justify-between items-center border-b border-zinc-100 pb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">Razorpay Checkout Sandbox</span>
              <button 
                onClick={handleAbortMockPayment}
                className="p-1 rounded-lg hover:bg-zinc-150 text-zinc-400 hover:text-zinc-950 transition-colors"
              >
                <X className="h-4.5 w-4.5" />
              </button>
            </div>

            <div className="space-y-2">
              <div className="h-10 w-10 bg-indigo-50 text-indigo-650 border border-indigo-200 rounded-xl flex items-center justify-center mx-auto">
                <CreditCard className="h-5 w-5" />
              </div>
              <h3 className="font-extrabold text-zinc-900 text-base">Secure Gateway Payment</h3>
              <p className="text-xs text-zinc-500">Merchant: <strong className="text-zinc-800">iiNCEPT Electronics</strong></p>
              <span className="inline-block text-xl font-black text-black mt-2">₹{Math.max(0, totalAmount).toLocaleString('en-IN')}</span>
            </div>

            <div className="bg-zinc-50 border border-zinc-150 rounded-2xl p-4 text-[10px] text-left text-zinc-655 text-zinc-600 leading-relaxed space-y-1.5">
              <p className="font-bold text-zinc-700">Cardholder details:</p>
              <p>Name: {shippingAddress.fullName || 'Registered User'}</p>
              <p>Phone: {shippingAddress.phone || 'N/A'}</p>
              <p className="text-zinc-400 border-t border-zinc-150 pt-1.5 mt-1">This is a simulated verification popup. Aborting returns a failed payment order response.</p>
            </div>

            <div className="flex flex-col gap-2 pt-2">
              <button
                onClick={handleSimulateSuccessfulMockPayment}
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2.5 rounded-xl text-xs transition-colors cursor-pointer"
              >
                Simulate Successful Payment
              </button>
              <button
                onClick={handleAbortMockPayment}
                className="w-full bg-zinc-100 hover:bg-zinc-200 text-zinc-700 py-2.5 rounded-xl text-xs transition-colors cursor-pointer"
              >
                Abort Payment
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { X, Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';
import { closeCart, removeFromCart, updateQuantity, addToCart } from '../redux/cartSlice';

export default function CartDrawer() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const drawerRef = useRef(null);
  
  const { cartItems, isCartOpen } = useSelector((state) => state.cart);
  const { products } = useSelector((state) => state.products || { products: [] });

  // Close modal on ESC key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isCartOpen) {
        dispatch(closeCart());
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isCartOpen, dispatch]);

  // Lock body scroll when cart is open
  useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isCartOpen]);

  if (!isCartOpen) return null;

  // Calculate total price
  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  // Recommendations: products that are NOT already in the cart
  const recommendations = products
    .filter(p => !cartItems.some(item => item.id === (p._id || p.id)))
    .slice(0, 4)
    .map(p => ({
      id: p._id || p.id,
      name: p.title || p.name,
      price: p.price,
      priceStr: `₹${p.price.toLocaleString('en-IN')}`,
      image: (p.images && p.images[0]) || p.image || '/iphone_nav/iphone_17.png'
    }));

  const fallbackRecs = [
    { id: 'apmaxusbc', name: 'AirPods Max (USB-C)', price: 59900, priceStr: '₹59,900.00', image: '/airpods_pro_3.jpg' },
    { id: 'awultra2', name: 'Apple Watch Ultra 2', price: 89900, priceStr: '₹89,900.00', image: '/watch_category.jpg' },
    { id: 'belkin3in1', name: 'Belkin UltraCharge Pro 3-in-1', price: 12500, priceStr: '₹12,500.00', image: '/college_essential_1.png' },
    { id: 'mbneo', name: 'MacBook Neo 14-inch', price: 159900, priceStr: '₹159,900.00', image: '/macbook_category_v3.jpg' }
  ].filter(p => !cartItems.some(item => item.id === p.id)).slice(0, 4);

  const displayRecs = recommendations.length > 0 ? recommendations : fallbackRecs;

  const handleRecommendationAdd = (rec) => {
    dispatch(addToCart({
      id: rec.id,
      name: rec.name,
      price: rec.price,
      image: rec.image,
      quantity: 1
    }));
  };

  const handleCheckoutClick = () => {
    dispatch(closeCart());
    navigate('/checkout');
  };

  const handleViewCartClick = () => {
    dispatch(closeCart());
    navigate('/cart');
  };

  const handleWhatsAppOrder = () => {
    if (cartItems.length === 0) return;

    let message = `🛒 *NEW ORDER REQUEST - iiNCEPT Electronics* 🛒\n\n`;
    message += `Hello iiNCEPT! 👋\n`;
    message += `I would like to place an order for the following items in my cart:\n\n`;

    cartItems.forEach((item, idx) => {
      const itemTitle = item.name || item.title || 'Product';
      const skuText = (item.sku && !itemTitle.includes('SKU:')) ? ` (SKU: ${item.sku})` : '';
      const itemQty = item.quantity || 1;
      const itemPrice = (item.price || 0) * itemQty;
      message += `${idx + 1}. *${itemTitle}${skuText}*\n   Qty: ${itemQty} | Price: ₹${itemPrice.toLocaleString('en-IN')}\n`;
    });

    message += `\n💰 *Total Amount:* ₹${subtotal.toLocaleString('en-IN')}\n\n`;
    message += `Please confirm my order and share payment & delivery details. Thank you!`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/918607222417?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center font-sans p-2 sm:p-4 md:p-6 lg:p-8 animate-in fade-in duration-200">
      {/* Dark Blur Backdrop Overlay */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-md transition-opacity duration-300"
        onClick={() => dispatch(closeCart())}
        aria-hidden="true"
      />

      {/* Spacious Full Viewport Modal Container */}
      <div 
        ref={drawerRef}
        className="relative w-full max-w-6xl h-[92vh] max-h-[900px] bg-white rounded-3xl sm:rounded-[32px] shadow-2xl border border-zinc-200 flex flex-col overflow-hidden z-10 select-none animate-in zoom-in-95 duration-200"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 sm:px-8 py-5 border-b border-zinc-100 shrink-0 bg-white">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-900">
              <ShoppingBag className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-zinc-900 tracking-tight leading-none">YOUR BAG</h2>
              <p className="text-xs text-zinc-500 font-medium mt-1">
                {cartItems.reduce((a, b) => a + b.quantity, 0)} {cartItems.reduce((a, b) => a + b.quantity, 0) === 1 ? 'item' : 'items'} in your shopping bag
              </p>
            </div>
          </div>
          <button 
            onClick={() => dispatch(closeCart())}
            className="p-2 rounded-full text-zinc-500 hover:text-zinc-950 transition-colors bg-zinc-100 hover:bg-zinc-200 cursor-pointer focus:outline-none"
            aria-label="Close cart"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-8">
          {cartItems.length === 0 ? (
            <div className="h-full min-h-[350px] flex flex-col items-center justify-center text-center space-y-6">
              <div className="w-24 h-24 rounded-full bg-zinc-50 border border-zinc-100 flex items-center justify-center text-zinc-400 shadow-xs">
                <ShoppingBag className="h-10 w-10 stroke-[1.5]" />
              </div>
              <div className="space-y-1">
                <h3 className="text-xl font-extrabold text-zinc-800">Your bag is empty</h3>
                <p className="text-sm text-zinc-500 max-w-xs mx-auto leading-relaxed">Explore our Apple collection to add items to your shopping bag.</p>
              </div>
              <button 
                onClick={() => {
                  dispatch(closeCart());
                  navigate('/');
                }}
                className="bg-zinc-950 hover:bg-zinc-850 text-white px-8 py-3.5 rounded-2xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer shadow-md"
              >
                Start Shopping
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Left Column: Product Items Table List */}
              <div className="lg:col-span-8 space-y-4">
                <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest px-1">Items in your order</h3>

                <div className="divide-y divide-zinc-100 border border-zinc-200/80 rounded-2xl bg-white overflow-hidden shadow-2xs">
                  {cartItems.map((item) => {
                    const itemTotalPrice = item.price * item.quantity;
                    return (
                      <div 
                        key={item.id}
                        className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-zinc-50/50 transition-colors text-left"
                      >
                        {/* Image & Details */}
                        <div className="flex items-center gap-4 min-w-0 flex-1">
                          <div className="h-20 w-20 sm:h-24 sm:w-24 rounded-xl overflow-hidden bg-zinc-50 p-2 border border-zinc-200/80 shrink-0 flex items-center justify-center">
                            <img 
                              src={item.image} 
                              alt={item.name} 
                              className="max-h-full max-w-full object-contain mix-blend-multiply" 
                            />
                          </div>
                          <div className="min-w-0 space-y-1 pr-2">
                            <h4 className="text-sm sm:text-base font-bold text-zinc-900 leading-snug tracking-tight">
                              {item.name}
                            </h4>
                            <div className="text-xs text-zinc-500 font-medium space-y-0.5">
                              {item.sku && <p>SKU: <span className="font-mono text-zinc-700">{item.sku}</span></p>}
                              {item.color && <p>Color: <span className="text-zinc-700 font-semibold">{item.color}</span></p>}
                              {item.size && <p>Config: <span className="text-zinc-700 font-semibold">{item.size}</span></p>}
                            </div>
                            <p className="text-xs font-semibold text-zinc-500 sm:hidden pt-1">
                              Unit: ₹{item.price.toLocaleString('en-IN')}
                            </p>
                          </div>
                        </div>

                        {/* Controls & Pricing */}
                        <div className="flex items-center justify-between sm:justify-end gap-6 shrink-0 border-t sm:border-0 border-zinc-100 pt-3 sm:pt-0">
                          
                          {/* Quantity Counter */}
                          <div className="flex items-center border border-zinc-200 rounded-xl bg-zinc-50/80 overflow-hidden h-9">
                            <button 
                              onClick={() => dispatch(updateQuantity({ id: item.id, quantity: item.quantity - 1 }))}
                              className="px-3 hover:bg-zinc-200 text-zinc-700 transition-colors cursor-pointer h-full flex items-center justify-center"
                              aria-label="Decrease quantity"
                            >
                              <Minus className="h-3.5 w-3.5" />
                            </button>
                            <span className="px-3 text-xs font-bold text-zinc-900 min-w-[28px] text-center">{item.quantity}</span>
                            <button 
                              onClick={() => dispatch(updateQuantity({ id: item.id, quantity: item.quantity + 1 }))}
                              className="px-3 hover:bg-zinc-200 text-zinc-700 transition-colors cursor-pointer h-full flex items-center justify-center"
                              aria-label="Increase quantity"
                            >
                              <Plus className="h-3.5 w-3.5" />
                            </button>
                          </div>

                          {/* Price */}
                          <div className="text-right min-w-[100px]">
                            <p className="text-sm sm:text-base font-extrabold text-zinc-950 tracking-tight">
                              ₹{itemTotalPrice.toLocaleString('en-IN')}
                            </p>
                            {item.quantity > 1 && (
                              <p className="text-[10px] text-zinc-400 font-medium">
                                ₹{item.price.toLocaleString('en-IN')} each
                              </p>
                            )}
                          </div>

                          {/* Delete Trash Button */}
                          <button 
                            onClick={() => dispatch(removeFromCart(item.id))}
                            className="p-2 text-zinc-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
                            aria-label="Remove item"
                          >
                            <Trash2 className="h-4.5 w-4.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Recommendations Bar below Items */}
                {displayRecs.length > 0 && (
                  <div className="pt-4 space-y-3 text-left">
                    <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-widest px-1">Recommended Accessories</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {displayRecs.map((rec) => (
                        <div 
                          key={rec.id}
                          className="bg-white border border-zinc-200/80 p-3 rounded-2xl flex items-center gap-3 hover:border-zinc-300 transition-all shadow-2xs"
                        >
                          <img 
                            src={rec.image} 
                            alt={rec.name} 
                            className="w-12 h-12 object-contain rounded-xl bg-zinc-50 p-1 border border-zinc-100 shrink-0 mix-blend-multiply" 
                          />
                          <div className="min-w-0 flex-1 text-left space-y-0.5">
                            <h5 className="text-xs font-bold text-zinc-900 truncate leading-snug">{rec.name}</h5>
                            <p className="text-xs font-extrabold text-zinc-700">{rec.priceStr}</p>
                          </div>
                          <button 
                            onClick={() => handleRecommendationAdd(rec)}
                            className="text-[10px] font-bold uppercase tracking-wider text-zinc-900 hover:bg-zinc-950 hover:text-white border border-zinc-300 rounded-xl px-3 py-1.5 transition-colors cursor-pointer shrink-0"
                          >
                            Add
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Right Column: Order Summary & Checkout Card */}
              <div className="lg:col-span-4 bg-zinc-50/80 border border-zinc-200/90 rounded-2xl sm:rounded-3xl p-6 space-y-5 text-left sticky top-0 shadow-2xs">
                <h3 className="text-base font-extrabold text-zinc-900 border-b border-zinc-200/80 pb-3">Order Summary</h3>

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between text-zinc-600 font-medium">
                    <span>Bag Subtotal</span>
                    <span className="font-bold text-zinc-900">₹{subtotal.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-zinc-600 font-medium">
                    <span>GST (Inclusive)</span>
                    <span className="text-emerald-600 font-bold">Included</span>
                  </div>
                  <div className="flex justify-between text-zinc-600 font-medium">
                    <span>Standard Shipping</span>
                    <span className="text-emerald-600 font-bold">FREE (Pan-India)</span>
                  </div>

                  <hr className="border-zinc-200 my-2" />

                  <div className="flex justify-between text-base sm:text-lg font-black text-zinc-950 pt-1">
                    <span>Total Amount</span>
                    <span className="text-xl sm:text-2xl font-black text-zinc-950">₹{subtotal.toLocaleString('en-IN')}</span>
                  </div>
                </div>

                {/* Checkout CTA Buttons */}
                <div className="space-y-3 pt-2">
                  <button 
                    onClick={handleCheckoutClick}
                    className="w-full bg-[#0071e3] hover:bg-[#0077ed] text-white py-3.5 rounded-2xl font-bold uppercase tracking-wider text-xs shadow-md hover:shadow-lg transition-all cursor-pointer text-center block"
                  >
                    PROCEED TO CHECKOUT →
                  </button>

                  <button 
                    onClick={handleWhatsAppOrder}
                    className="w-full bg-emerald-600 hover:bg-emerald-500 text-white py-3.5 rounded-2xl font-bold uppercase tracking-wider text-xs shadow-sm transition-all cursor-pointer text-center flex items-center justify-center gap-2"
                  >
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                      <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                    </svg>
                    <span>ORDER ON WHATSAPP</span>
                  </button>

                  <button 
                    onClick={handleViewCartClick}
                    className="w-full bg-white hover:bg-zinc-100 text-zinc-900 border border-zinc-200 py-3 rounded-2xl font-bold uppercase tracking-wider text-xs transition-colors cursor-pointer text-center block"
                  >
                    VIEW FULL BAG PAGE
                  </button>
                </div>

                <div className="pt-2 text-center">
                  <p className="text-[11px] text-zinc-400 font-medium flex items-center justify-center gap-1.5">
                    <span>🔒 Safe & Secure Checkout</span>
                    <span>•</span>
                    <span>Apple Official Warranty</span>
                  </p>
                </div>
              </div>

            </div>
          )}
        </div>
      </div>
    </div>
  );
}

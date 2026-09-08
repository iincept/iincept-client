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

  // Close drawer if clicked outside
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (isCartOpen && drawerRef.current && !drawerRef.current.contains(e.target)) {
        dispatch(closeCart());
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [isCartOpen, dispatch]);

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isCartOpen]);

  if (!isCartOpen) return null;

  // Calculate totals
  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  // Recommendations: products that are NOT already in the cart
  const recommendations = products
    .filter(p => !cartItems.some(item => item.id === (p._id || p.id)))
    .slice(0, 5)
    .map(p => ({
      id: p._id || p.id,
      name: p.title || p.name,
      price: p.price,
      priceStr: `₹${p.price.toLocaleString()}`,
      image: (p.images && p.images[0]) || p.image || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=150&q=80'
    }));

  // Fallback recommendations if database is empty
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
    <div className="fixed inset-0 z-[1000] overflow-hidden font-sans">
      {/* Dark Blur Overlay Backdrop */}
      <div 
        className="absolute inset-0 bg-black/45 backdrop-blur-[4px] transition-opacity duration-300 animate-in fade-in"
        onClick={() => dispatch(closeCart())}
      />

      {/* Main Drawer Panel Slide-in Container */}
      <div 
        ref={drawerRef}
        className="absolute inset-y-0 right-0 max-w-full flex pl-10 sm:pl-16 outline-none animate-in slide-in-from-right duration-300"
      >
        {/* Dual-Pane Drawer wrapper */}
        <div className="flex h-full items-stretch">
          
          {/* LATEST RECOMMENDATIONS LEFT PANE (Visible on tablet & desktop screen sizes) */}
          <div className="hidden md:flex w-80 flex-col bg-[#fcfcfc] border-l border-zinc-150 p-6 overflow-y-auto text-left shadow-lg">
            <h3 className="text-xs font-bold text-zinc-900 uppercase tracking-widest border-b pb-4 mb-4">
              YOU MAY ALSO LIKE
            </h3>
            <div className="flex flex-col gap-4">
              {displayRecs.map((rec) => (
                <div 
                  key={rec.id}
                  className="bg-white border border-zinc-150 p-3 rounded-2xl flex items-center gap-3 hover:shadow-sm transition-all"
                >
                  <img 
                    src={rec.image} 
                    alt={rec.name} 
                    className="w-14 h-14 object-contain rounded-lg bg-zinc-50 p-1 border border-zinc-100 shrink-0" 
                  />
                  <div className="space-y-1 text-left min-w-0 flex-grow">
                    <h4 className="text-[11px] font-bold text-zinc-800 truncate leading-snug tracking-tight">
                      {rec.name}
                    </h4>
                    <p className="text-[11px] font-extrabold text-[#b82a39]">{rec.priceStr}</p>
                    <button 
                      onClick={() => handleRecommendationAdd(rec)}
                      className="text-[9px] font-bold uppercase tracking-wider text-zinc-600 hover:text-black border border-zinc-300 hover:border-black rounded-lg px-2.5 py-1 transition-all bg-transparent cursor-pointer"
                    >
                      ADD TO CART
                    </button>
                  </div>
                </div>
              ))}
              {displayRecs.length === 0 && (
                <p className="text-xs text-zinc-400 italic">No recommended items left</p>
              )}
            </div>
          </div>

          {/* MAIN CART LIST RIGHT PANE (Slideout drawer) */}
          <div className="w-screen max-w-md flex flex-col bg-white shadow-2xl p-6 text-left relative z-10 border-l border-zinc-150">
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-zinc-100">
              <h2 className="text-lg font-black text-zinc-900 tracking-wider">CART</h2>
              <button 
                onClick={() => dispatch(closeCart())}
                className="p-1 rounded-full text-zinc-400 hover:text-black transition-colors bg-zinc-50 hover:bg-zinc-100 cursor-pointer"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Cart content list */}
            <div className="flex-grow overflow-y-auto py-4 select-none">
              {cartItems.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-5 py-20">
                  <div className="w-20 h-20 rounded-full bg-zinc-50 border border-zinc-100 flex items-center justify-center text-zinc-400">
                    <ShoppingBag className="h-8 w-8 stroke-[1.5]" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-zinc-800">Your cart is empty</h3>
                    <p className="text-xs text-zinc-400 max-w-[200px] mt-1 mx-auto leading-relaxed">Add premium gear to your shopping cart to get started.</p>
                  </div>
                  <button 
                    onClick={() => {
                      dispatch(closeCart());
                      if (location.pathname === '/') {
                        const section = document.getElementById('apple-categories');
                        if (section) {
                          section.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        }
                      } else {
                        navigate('/?scroll=categories');
                      }
                    }}
                    className="bg-zinc-950 text-white hover:bg-zinc-900 px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
                  >
                    RETURN TO SHOP
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {cartItems.map((item) => (
                    <div 
                      key={item.id} 
                      className="flex items-center gap-4 pb-4 border-b border-zinc-100/60"
                    >
                      <img 
                        src={item.image} 
                        alt={item.name} 
                        className="w-16 h-16 object-contain rounded-xl bg-zinc-50 p-1 border border-zinc-100 shrink-0" 
                      />
                      <div className="flex-grow min-w-0 space-y-1">
                        <h4 className="text-xs font-bold text-zinc-900 truncate pr-4">
                          {item.name}
                        </h4>
                        <p className="text-xs font-extrabold text-zinc-500">
                          ₹{item.price.toLocaleString()}
                        </p>
                        
                        {/* Quantity Counter */}
                        <div className="flex items-center justify-between pt-1">
                          <div className="flex items-center border border-zinc-200 rounded-lg overflow-hidden h-7 bg-zinc-50/50">
                            <button 
                              onClick={() => dispatch(updateQuantity({ id: item.id, quantity: item.quantity - 1 }))}
                              className="px-2 py-0.5 hover:bg-zinc-100 text-zinc-600 transition-colors cursor-pointer h-full"
                            >
                              <Minus className="h-3 w-3" />
                            </button>
                            <span className="px-2.5 text-xs font-bold text-zinc-800">{item.quantity}</span>
                            <button 
                              onClick={() => dispatch(updateQuantity({ id: item.id, quantity: item.quantity + 1 }))}
                              className="px-2 py-0.5 hover:bg-zinc-100 text-zinc-600 transition-colors cursor-pointer h-full"
                            >
                              <Plus className="h-3 w-3" />
                            </button>
                          </div>
                          
                          <button 
                            onClick={() => dispatch(removeFromCart(item.id))}
                            className="text-zinc-400 hover:text-red-500 p-1 transition-colors bg-transparent border-0 cursor-pointer"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Cart Footer */}
            {cartItems.length > 0 && (
              <div className="pt-4 border-t border-zinc-100 space-y-4">
                <div className="flex items-center justify-between text-zinc-800">
                  <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Subtotal</span>
                  <span className="text-lg font-black text-zinc-900">₹{subtotal.toLocaleString()}</span>
                </div>
                
                <div className="flex flex-col gap-2.5">
                  <button 
                    onClick={handleCheckoutClick}
                    className="w-full bg-violet-600 hover:bg-violet-500 text-white py-3.5 rounded-2xl font-bold uppercase tracking-wider text-xs shadow-md transition-colors cursor-pointer text-center"
                  >
                    PROCEED TO CHECKOUT
                  </button>
                  <button 
                    onClick={handleWhatsAppOrder}
                    className="w-full bg-emerald-600 hover:bg-emerald-500 text-white py-3.5 rounded-2xl font-bold uppercase tracking-wider text-xs shadow-md transition-colors cursor-pointer text-center flex items-center justify-center gap-2"
                  >
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                      <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                    </svg>
                    ORDER ON WHATSAPP
                  </button>
                  <button 
                    onClick={handleViewCartClick}
                    className="w-full border border-zinc-200 hover:bg-zinc-50 text-zinc-800 py-3 rounded-2xl font-bold uppercase tracking-wider text-xs transition-colors cursor-pointer text-center"
                  >
                    VIEW SHOPPING BAG
                  </button>
                </div>
              </div>
            )}

          </div>

        </div>
      </div>
    </div>
  );
}

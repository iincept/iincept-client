import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Star, ShoppingBag, Heart, CheckCircle2, ArrowRight } from 'lucide-react';
import { fetchProducts } from '../redux/productSlice';
import { addToCart } from '../redux/cartSlice';
import { addToWishlist } from '../redux/wishlistSlice';

// Categories data matching the example categories requested
const CATEGORY_CARDS = [
  { id: 'electronics', name: 'Electronics & Gadgets', image: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&w=400&q=80', description: 'Innovative smart tech, setups, and workspace configurations.' },
  { id: 'laptops', name: 'Laptops & Workstations', image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=400&q=80', description: 'High-performance computers, mechanical keys, and PCs.' },
  { id: 'audio', name: 'Premium Audio', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=400&q=80', description: 'Noise isolation headphones, studio monitor speakers, and drivers.' },
  { id: 'wearables', name: 'Wearable Gear', image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=400&q=80', description: 'Smart chronos, activity monitors, and fitness trackers.' },
  { id: 'men', name: "Men's Apparel", image: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=400&q=80', description: 'Premium tailor fits, shirts, active wear, and style accessories.' },
  { id: 'women', name: "Women's Fashion", image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=400&q=80', description: 'Designer dresses, modern streetwear, and couture collections.' },
  { id: 'beauty', name: 'Beauty & Wellness', image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=400&q=80', description: 'Organic skincare treatments, hair styling, and wellness kits.' }
];

export default function Categories() {
  const dispatch = useDispatch();
  const { products } = useSelector((state) => state.products);
  const [selectedCat, setSelectedCat] = useState('electronics');

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const activeProducts = products;

  // Filter products by selected category card
  const filteredProducts = activeProducts.filter((p) => {
    const catName = p.category?.name || p.category || '';
    const catSlug = p.category?.slug || '';
    return catName.toLowerCase() === selectedCat.toLowerCase() ||
           catSlug.toLowerCase() === selectedCat.toLowerCase();
  });

  const handleAddToCart = (product) => {
    dispatch(addToCart({
      id: product.id || product._id,
      name: product.name || product.title,
      price: product.price,
      image: product.image || (product.images && product.images[0]) || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=150&q=80',
      quantity: 1
    }));
  };

  const handleAddToWishlist = (product) => {
    dispatch(addToWishlist({
      id: product.id || product._id,
      name: product.name || product.title,
      price: product.price,
      image: product.image || (product.images && product.images[0]) || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=150&q=80',
      rating: product.rating
    }));
  };

  const activeCategoryDetails = CATEGORY_CARDS.find(c => c.id === selectedCat);

  return (
    <div className="space-y-12 py-2 text-left animate-in fade-in duration-300">
      
      {/* Header Banner */}
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight">Explore Categories</h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">Select a category card to browse and filter items</p>
      </div>

      {/* Category Cards Grid */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {CATEGORY_CARDS.map((cat) => {
          const isSelected = selectedCat === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCat(cat.id)}
              className={`group rounded-2xl overflow-hidden border text-left flex flex-col justify-between transition-all duration-300 relative h-36 ${isSelected ? 'border-violet-500 ring-2 ring-violet-500/20' : 'border-slate-850 bg-slate-900/40 hover:border-slate-800'}`}
            >
              {/* Cover Image background */}
              <div className="absolute inset-0 bg-slate-950">
                <img 
                  src={cat.image} 
                  alt="" 
                  className="w-full h-full object-cover opacity-30 group-hover:scale-102 transition-transform duration-500" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />
              </div>

              {/* Text Context */}
              <div className="relative z-10 p-5 flex flex-col justify-end h-full space-y-1">
                <h3 className="font-extrabold text-sm text-white flex items-center gap-1.5 capitalize">
                  {cat.name}
                  {isSelected && <CheckCircle2 className="h-3.5 w-3.5 text-violet-400" />}
                </h3>
                <p className="text-[10px] text-slate-400 line-clamp-2 leading-relaxed">{cat.description}</p>
              </div>
            </button>
          );
        })}
      </section>

      {/* Selected Category Products Filter Display */}
      <section className="border-t border-slate-850 pt-8 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-900 pb-4">
          <div className="text-left space-y-1">
            <h2 className="text-xl font-extrabold text-slate-100 flex items-center gap-2 capitalize">
              <span>{activeCategoryDetails?.name || selectedCat} Collection</span>
            </h2>
            <p className="text-xs text-slate-500">Showing {filteredProducts.length} items</p>
          </div>
          <Link 
            to={`/shop?category=${selectedCat}`}
            className="text-xs font-semibold text-violet-400 hover:text-violet-300 flex items-center gap-1"
          >
            View in Catalog
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="border border-dashed border-slate-800 bg-slate-900/10 rounded-2xl p-16 text-center text-slate-500 space-y-2">
            <h3 className="font-bold text-base">No items available</h3>
            <p className="text-xs">No products are seeded in this category yet. Click 'View in Catalog' to explore general listings.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredProducts.map((prod) => (
              <div 
                key={prod.id || prod._id}
                className="group rounded-2xl border border-slate-850 bg-slate-900/40 hover:bg-slate-900 hover:border-slate-800 transition-all duration-300 overflow-hidden flex flex-col justify-between"
              >
                {/* Thumbnail */}
                <div className="relative h-48 bg-slate-955 flex items-center justify-center overflow-hidden">
                  <button 
                    onClick={() => handleAddToWishlist(prod)}
                    className="absolute top-3 right-3 p-2 bg-slate-900/80 backdrop-blur-sm border border-slate-800 text-slate-400 hover:text-rose-500 rounded-full z-10 transition-colors"
                  >
                    <Heart className="h-4 w-4" />
                  </button>
                  <img 
                    src={prod.image || (prod.images && prod.images[0]) || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=500&q=80'} 
                    alt={prod.name || prod.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>

                {/* Info */}
                <div className="p-5 flex-grow flex flex-col justify-between space-y-4">
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider capitalize">{prod.category?.name || prod.category}</span>
                    <h3 className="font-bold text-slate-200 line-clamp-1 group-hover:text-white transition-colors">
                      <Link to={`/product/${prod.id || prod._id}`}>{prod.name || prod.title}</Link>
                    </h3>
                    <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">{prod.description}</p>
                    <div className="flex items-center gap-1 pt-1">
                      <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
                      <span className="text-xs font-semibold text-slate-350">{prod.rating}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-850/60">
                    <span className="font-bold text-lg text-slate-100">${prod.price}</span>
                    <button 
                      onClick={() => handleAddToCart(prod)}
                      className="p-2 bg-slate-900 border border-slate-800 hover:border-violet-500/40 text-violet-400 hover:bg-violet-950/20 rounded-xl transition-all duration-200 cursor-pointer"
                    >
                      <ShoppingBag className="h-4.5 w-4.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

    </div>
  );
}

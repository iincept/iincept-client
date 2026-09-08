import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Star, ShoppingBag, Heart, Search as SearchIcon, ArrowRight, Loader2 } from 'lucide-react';
import { fetchProducts } from '../redux/productSlice';
import { addToCart } from '../redux/cartSlice';
import { addToWishlist } from '../redux/wishlistSlice';
import { matchesProductSearch, getMatchingSku } from '../utils/searchUtils';

export default function Search() {
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';

  const { products, loading } = useSelector((state) => state.products);

  useEffect(() => {
    // Fetch products if list is empty
    if (!products || products.length === 0) {
      dispatch(fetchProducts());
    }
  }, [dispatch, products]);

  // Client-side filtering matching query
  const filteredProducts = products.filter((prod) => {
    if (!query.trim()) return false;
    return matchesProductSearch(prod, query);
  });

  const handleAddToCart = (product) => {
    dispatch(addToCart({
      id: product.id || product._id,
      name: product.name || product.title,
      price: product.price,
      image: product.image || (product.images && product.images[0]) || '/avatar.png',
      quantity: 1
    }));
  };

  const handleAddToWishlist = (product) => {
    dispatch(addToWishlist({
      id: product.id || product._id,
      name: product.name || product.title,
      price: product.price,
      image: product.image || (product.images && product.images[0]) || '/avatar.png',
      rating: product.rating
    }));
  };

  if (loading && products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-20 text-zinc-400">
        <Loader2 className="h-10 w-10 animate-spin text-zinc-900 mb-3" />
        <span className="text-sm font-semibold">Searching catalog...</span>
      </div>
    );
  }

  return (
    <div className="space-y-8 py-4 text-left animate-in fade-in duration-300">
      
      {/* Header Info */}
      <div className="space-y-1">
        <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900">Search Results</h1>
        <p className="text-sm text-zinc-500 font-medium">
          {filteredProducts.length} {filteredProducts.length === 1 ? 'item' : 'items'} found matching "{query}"
        </p>
      </div>

      {filteredProducts.length === 0 ? (
        <div className="border border-dashed border-zinc-200 bg-zinc-50 rounded-3xl p-16 text-center space-y-6 max-w-xl mx-auto my-8 shadow-sm">
          <div className="h-16 w-16 bg-white border border-zinc-200 rounded-full flex items-center justify-center text-zinc-500 mx-auto shadow-sm">
            <SearchIcon className="h-6 w-6 text-zinc-400" />
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-bold text-zinc-900">No Matches Found</h2>
            <p className="text-sm text-zinc-550 max-w-xs mx-auto">
              We couldn't find any items matching your request. Try modifying terms or category filters.
            </p>
          </div>
          <div className="flex justify-center gap-2 pt-2">
            <Link 
              to="/shop" 
              className="inline-flex items-center gap-2 bg-black hover:bg-zinc-900 text-white font-bold px-5 py-2.5 rounded-xl transition-all cursor-pointer text-xs shadow-sm"
            >
              Browse Catalog
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((prod) => {
            const productImg = prod.image || (prod.images && prod.images[0]) || '/avatar.png';
            const matchedSku = getMatchingSku(prod, query);
            return (
              <div 
                key={prod._id || prod.id}
                className="group bg-white border border-zinc-200 rounded-2xl overflow-hidden hover:border-zinc-300 transition-all duration-300 flex flex-col justify-between shadow-sm hover:shadow-md animate-in fade-in duration-300"
              >
                {/* Image panel */}
                <div className="relative h-48 bg-zinc-50 overflow-hidden flex items-center justify-center border-b border-zinc-100">
                  <img 
                    src={productImg} 
                    alt={prod.title || prod.name}
                    className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
                  />
                  <button 
                    onClick={() => handleAddToWishlist(prod)}
                    className="absolute top-3 right-3 p-2 bg-white/80 hover:bg-white backdrop-blur-sm border border-zinc-150 text-zinc-500 hover:text-rose-500 rounded-full z-10 transition-colors cursor-pointer shadow-sm"
                    aria-label="Add to wishlist"
                  >
                    <Heart className="h-4 w-4" />
                  </button>
                </div>

                {/* Meta details */}
                <div className="p-4 space-y-3 flex-grow flex flex-col justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] uppercase font-bold text-zinc-400 tracking-wider">
                        {prod.brand || 'Premium'}
                      </span>
                      {matchedSku && (
                        <span className="font-mono text-[9px] font-bold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                          SKU: {matchedSku}
                        </span>
                      )}
                    </div>
                    <h3 className="font-bold text-zinc-800 text-sm line-clamp-1 group-hover:text-black transition-colors">
                      <Link to={`/product/${prod._id || prod.id}`}>{prod.title || prod.name}</Link>
                    </h3>
                    <div className="flex items-center gap-1 pt-0.5">
                      <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
                      <span className="text-xs font-semibold text-zinc-700">{prod.rating || 5.0}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-zinc-100">
                    <span className="font-extrabold text-sm text-zinc-900">₹{prod.price.toLocaleString('en-IN')}</span>
                    <button 
                      onClick={() => handleAddToCart(prod)}
                      className="px-3 py-2 bg-black hover:bg-zinc-900 text-[10px] font-bold text-white rounded-xl flex items-center gap-1 transition-colors cursor-pointer shadow-sm"
                    >
                      <ShoppingBag className="h-3 w-3" />
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

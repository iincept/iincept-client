import { useEffect, useState, useRef } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Filter, Star, ShoppingBag, Heart, Search, ArrowUpDown, SlidersHorizontal, ChevronRight, X } from 'lucide-react';
import { fetchProducts, fetchCategories } from '../redux/productSlice';
import { addToCart } from '../redux/cartSlice';
import { addToWishlist } from '../redux/wishlistSlice';
import Loader from '../components/Loader';
import { matchesProductSearch } from '../utils/searchUtils';

// Fallback definitions removed in favor of real database records

const BRANDS = ['Apple', 'Aero', 'Sonic', 'Titan', 'Vortex', 'Samsung', 'Sony', 'Zara', 'Loreal', 'Chanel'];

export default function Shop() {
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  
  const { products, categories, loading } = useSelector((state) => state.products);

  // States initialized from URL params or defaults
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'all');
  const [maxPrice, setMaxPrice] = useState(500000);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [minRating, setMinRating] = useState(0);
  const [sortOption, setSortOption] = useState('rating');
  const [visibleCount, setVisibleCount] = useState(6);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const isLoadingMore = useRef(false);

  // Synchronize category and search query if URL parameters update
  useEffect(() => {
    const urlCat = searchParams.get('category');
    if (urlCat) {
      setSelectedCategory(urlCat);
    }
    const urlSearch = searchParams.get('search');
    if (urlSearch !== null) {
      setSearch(urlSearch);
    } else {
      setSearch('');
    }
  }, [searchParams]);

  useEffect(() => {
    // Fetch products and categories from backend database
    dispatch(fetchProducts());
    dispatch(fetchCategories());
  }, [dispatch]);

  const activeProducts = products;

  // Filter and Sort Logic
  const filteredProducts = activeProducts.filter((prod) => {
    const matchesSearch = matchesProductSearch(prod, search);
    
    // Category match supporting names, slugs, and aliases
    const catName = (prod.category?.name || (typeof prod.category === 'string' ? prod.category : '')).toLowerCase();
    const catSlug = (prod.category?.slug || '').toLowerCase();
    const selCat = selectedCategory.toLowerCase();

    let matchesCategory = selCat === 'all';
    if (!matchesCategory) {
      if (selCat === 'iphone' || selCat === 'iphones' || selCat === 'smartphones') {
        matchesCategory = catName.includes('iphone') || catName.includes('smartphone') || catName.includes('phone') || catSlug.includes('iphone') || catSlug.includes('smartphone');
      } else if (selCat === 'mac' || selCat === 'macbook' || selCat === 'laptops & pcs' || selCat === 'laptops-pcs') {
        matchesCategory = catName.includes('mac') || catName.includes('laptop') || catSlug.includes('mac') || catSlug.includes('laptop');
      } else if (selCat === 'ipad' || selCat === 'ipads' || selCat === 'tablets') {
        matchesCategory = catName.includes('ipad') || catName.includes('tablet') || catSlug.includes('ipad') || catSlug.includes('tablet');
      } else if (selCat === 'watch' || selCat === 'watches' || selCat === 'wearables') {
        matchesCategory = catName.includes('watch') || catName.includes('wearable') || catSlug.includes('watch');
      } else if (selCat === 'airpods' || selCat === 'audio') {
        matchesCategory = catName.includes('airpod') || catName.includes('audio') || catSlug.includes('airpod');
      } else if (selCat === 'accessories') {
        matchesCategory = catName.includes('accessori') || catSlug.includes('accessori');
      } else {
        matchesCategory = catName === selCat || catSlug === selCat || (typeof prod.category === 'string' && prod.category.toLowerCase() === selCat);
      }
    }
    
    // Price match
    const matchesPrice = prod.price <= maxPrice;

    // Brand match
    const matchesBrand = selectedBrands.length === 0 || 
                         selectedBrands.includes(prod.brand);

    // Rating match
    const matchesRating = prod.rating >= minRating;

    return matchesSearch && matchesCategory && matchesPrice && matchesBrand && matchesRating;
  }).sort((a, b) => {
    if (sortOption === 'price-asc') return a.price - b.price;
    if (sortOption === 'price-desc') return b.price - a.price;
    if (sortOption === 'rating') return b.rating - a.rating;
    if (sortOption === 'newest') return (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0);
    return 0; // Default
  });

  // Infinite Scroll logic: load 6 more products on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (isLoadingMore.current) return;
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight;
      const clientHeight = window.innerHeight;

      if (scrollTop > 150 && (clientHeight + scrollTop >= scrollHeight - 120)) {
        isLoadingMore.current = true;
        setVisibleCount(prev => prev + 6);
        setTimeout(() => {
          isLoadingMore.current = false;
        }, 600);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Reset visible count if filters change
  useEffect(() => {
    setVisibleCount(6);
  }, [search, selectedCategory, maxPrice, selectedBrands, minRating, sortOption]);

  const paginatedProducts = filteredProducts.slice(0, visibleCount);

  const handleBrandChange = (brand) => {
    if (selectedBrands.includes(brand)) {
      setSelectedBrands(selectedBrands.filter(b => b !== brand));
    } else {
      setSelectedBrands([...selectedBrands, brand]);
    }
  };

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

  return (
    <div className="space-y-6 py-2 text-left animate-in fade-in duration-300">
      
      {loading && <Loader message="Searching products catalog..." />}

      {/* Title Header */}
      <div className="w-full pb-6 select-none font-sans border-b border-zinc-100 mb-6">
        <div className="max-w-7xl mx-auto pt-2">
          <h1 className="text-5xl sm:text-6xl font-black tracking-tight text-zinc-950 text-left">Accessories</h1>
        </div>
      </div>
        
        {/* Controls */}
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setShowMobileFilters(true)}
            className="lg:hidden flex items-center gap-1.5 px-4 py-2 border border-slate-800 bg-slate-900 rounded-xl text-sm font-semibold hover:border-slate-700 cursor-pointer"
          >
            <SlidersHorizontal className="h-4 w-4 text-violet-400" />
            Filters
          </button>
          
          <div className="flex items-center bg-slate-900 border border-slate-850 rounded-xl px-3 py-2 text-sm gap-2">
            <ArrowUpDown className="h-4 w-4 text-slate-500" />
            <select 
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className="bg-transparent text-slate-200 border-none outline-none focus:ring-0 text-xs font-semibold cursor-pointer"
            >
              <option value="rating">Top Rated</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="newest">Newest Gear</option>
            </select>
          </div>
        </div>

      <div className="flex gap-8 items-start relative">
        {/* 1. Sidebar Filters (Desktop) */}
        <aside className="w-64 bg-slate-900 border border-slate-850 rounded-2xl p-6 hidden lg:block shrink-0 sticky top-24 space-y-6">
          
          {/* Search */}
          <div className="space-y-2">
            <h3 className="text-xs uppercase font-bold text-slate-400 tracking-wider">Search Keywords</h3>
            <div className="relative">
              <input 
                type="text" 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Type to search..." 
                className="w-full bg-slate-950 border border-slate-800 text-xs rounded-xl py-2.5 pl-3 pr-8 text-slate-200 focus:outline-none focus:border-violet-500 transition-colors"
              />
              <Search className="absolute right-2.5 top-3.5 h-3.5 w-3.5 text-slate-550 text-slate-500" />
            </div>
          </div>

          {/* Categories */}
          <div className="space-y-2">
            <h3 className="text-xs uppercase font-bold text-slate-400 tracking-wider">Categories</h3>
            <div className="flex flex-col gap-1 text-xs">
              {['all', ...(categories || []).map(c => c.name)].map((cat) => (
                <button 
                  key={cat}
                  onClick={() => { setSelectedCategory(cat); setSearchParams({ category: cat }); }}
                  className={`text-left py-1.5 px-2 rounded-lg capitalize font-semibold transition-colors ${selectedCategory.toLowerCase() === cat.toLowerCase() ? 'bg-violet-950/40 text-violet-400' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-850/50'}`}
                >
                  {cat === 'all' ? 'All categories' : cat}
                </button>
              ))}
            </div>
          </div>

          {/* Price limits */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <h3 className="text-xs uppercase font-bold text-slate-400 tracking-wider">Max Price</h3>
              <span className="font-bold text-violet-400">₹{maxPrice?.toLocaleString('en-IN')}</span>
            </div>
            <input 
              type="range" 
              min="100" 
              max="500000" 
              step="500"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-violet-500"
            />
            <div className="flex justify-between text-[9px] text-slate-500 font-bold">
              <span>₹100</span>
              <span>₹500,000</span>
            </div>
          </div>

          {/* Brands */}
          <div className="space-y-2">
            <h3 className="text-xs uppercase font-bold text-slate-400 tracking-wider">Brands</h3>
            <div className="max-h-36 overflow-y-auto space-y-1.5 pr-1.5 text-xs text-slate-400">
              {BRANDS.map((brand) => (
                <label key={brand} className="flex items-center gap-2 cursor-pointer hover:text-slate-200 transition-colors select-none">
                  <input 
                    type="checkbox" 
                    checked={selectedBrands.includes(brand)}
                    onChange={() => handleBrandChange(brand)}
                    className="accent-violet-505 accent-violet-500 rounded border-slate-800 bg-slate-950 h-3.5 w-3.5"
                  />
                  <span>{brand}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Ratings */}
          <div className="space-y-2">
            <h3 className="text-xs uppercase font-bold text-slate-400 tracking-wider">Ratings</h3>
            <div className="flex flex-col gap-1.5 text-xs text-slate-405 text-slate-400">
              {[4, 3, 2].map((stars) => (
                <button
                  key={stars}
                  onClick={() => setMinRating(minRating === stars ? 0 : stars)}
                  className={`flex items-center gap-1.5 py-1 px-2 rounded-lg text-left transition-colors ${minRating === stars ? 'bg-violet-950/40 text-violet-400 font-semibold' : 'hover:bg-slate-850/50'}`}
                >
                  <div className="flex text-amber-500">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`h-3 w-3 ${i < stars ? 'fill-amber-500 text-amber-500' : 'text-slate-800'}`} />
                    ))}
                  </div>
                  <span>& Up</span>
                </button>
              ))}
            </div>
          </div>

        </aside>

        {/* Mobile Filters Modal */}
        {showMobileFilters && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex justify-end lg:hidden text-xs">
            <div className="w-80 max-w-xs h-full bg-slate-900 border-l border-slate-850 p-6 flex flex-col justify-between overflow-y-auto animate-in slide-in-from-right duration-300">
              <div className="space-y-6">
                <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                  <h2 className="text-lg font-extrabold text-white">Filter Options</h2>
                  <button 
                    onClick={() => setShowMobileFilters(false)}
                    className="p-1 rounded-lg hover:bg-slate-850 text-slate-500 hover:text-white"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
                
                {/* Search */}
                <div className="space-y-2">
                  <h3 className="text-xs uppercase font-bold text-slate-400 tracking-wider">Search Keywords</h3>
                  <input 
                    type="text" 
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Type to search..." 
                    className="w-full bg-slate-950 border border-slate-800 text-xs py-2 px-3 text-slate-200 rounded-xl"
                  />
                </div>

                {/* Categories */}
                <div className="space-y-2">
                  <h3 className="text-xs uppercase font-bold text-slate-400 tracking-wider">Categories</h3>
                  <div className="grid grid-cols-2 gap-1">
                    {['all', ...(categories || []).map(c => c.name)].map((cat) => (
                      <button 
                        key={cat}
                        onClick={() => { setSelectedCategory(cat); setSearchParams({ category: cat }); }}
                        className={`text-center py-2 px-1 rounded-lg border capitalize font-semibold ${selectedCategory.toLowerCase() === cat.toLowerCase() ? 'bg-violet-950/40 border-violet-500 text-violet-400' : 'bg-slate-950 border-slate-800 text-slate-400'}`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Price */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <h3 className="text-xs uppercase font-bold text-slate-400 tracking-wider">Max Price</h3>
                    <span className="font-bold text-violet-400">₹{maxPrice?.toLocaleString('en-IN')}</span>
                  </div>
                  <input 
                    type="range" 
                    min="100" 
                    max="500000" 
                    step="500"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(Number(e.target.value))}
                    className="w-full accent-violet-500 cursor-pointer"
                  />
                </div>

                {/* Brands */}
                <div className="space-y-2">
                  <h3 className="text-xs uppercase font-bold text-slate-400 tracking-wider">Brands</h3>
                  <div className="grid grid-cols-2 gap-2 text-slate-400">
                    {BRANDS.map((brand) => (
                      <label key={brand} className="flex items-center gap-1.5 select-none cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={selectedBrands.includes(brand)}
                          onChange={() => handleBrandChange(brand)}
                          className="accent-violet-500 rounded bg-slate-950 border-slate-800"
                        />
                        <span>{brand}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
              
              <button 
                onClick={() => setShowMobileFilters(false)}
                className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 py-3 text-white rounded-xl font-bold mt-8 transition-all"
              >
                Apply Filters
              </button>
            </div>
          </div>
        )}

        {/* 2. Product Catalog Display */}
        <div className="flex-grow space-y-8">
          {paginatedProducts.length === 0 ? (
            <div className="border border-slate-850 bg-slate-900/30 rounded-3xl p-16 text-center space-y-4">
              <SlidersHorizontal className="h-10 w-10 text-slate-700 mx-auto" />
              <h3 className="font-bold text-lg text-slate-205 text-slate-200">No products found</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">We couldn't find any products matching your specific filters. Try adjusting slider boundaries or clear checklists.</p>
              <button 
                onClick={() => { setSearch(''); setSelectedCategory('all'); setMaxPrice(500000); setSelectedBrands([]); setMinRating(0); setSearchParams({}); }}
                className="px-5 py-2.5 border border-slate-800 bg-slate-900 rounded-xl hover:border-slate-700 text-xs font-bold transition-all cursor-pointer"
              >
                Reset Search Filters
              </button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {paginatedProducts.map((prod) => (
                  <div 
                    key={prod.id || prod._id}
                    className="group rounded-2xl border border-slate-850 bg-slate-900/40 hover:bg-slate-900 hover:border-slate-800 transition-all duration-300 overflow-hidden flex flex-col justify-between"
                  >
                    {/* Thumbnail */}
                    <div className="relative h-48 bg-slate-955 overflow-hidden flex items-center justify-center">
                      <button 
                        onClick={() => handleAddToWishlist(prod)}
                        className="absolute top-3 right-3 p-2 bg-slate-900/80 backdrop-blur-sm border border-slate-800 text-slate-400 hover:text-rose-505 hover:text-rose-400 rounded-full z-10 transition-colors"
                      >
                        <Heart className="h-4 w-4" />
                      </button>
                      <img 
                        src={prod.image || (prod.images && prod.images[0]) || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=500&q=80'} 
                        alt={prod.name || prod.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>

                    {/* Description */}
                    <div className="p-5 space-y-4 flex-grow flex flex-col justify-between">
                      <div className="space-y-1">
                        <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider capitalize">{prod.category?.name || prod.category}</span>
                        <h3 className="font-bold text-slate-200 line-clamp-1 group-hover:text-white transition-colors">
                          <Link to={`/product/${prod.id || prod._id}`}>{prod.name || prod.title}</Link>
                        </h3>
                        <p className="text-[11px] text-slate-550 text-slate-500 line-clamp-2 leading-relaxed">{prod.description}</p>
                        <div className="flex items-center gap-1.5 pt-1">
                          <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
                          <span className="text-xs font-semibold text-slate-350">{prod.rating}</span>
                          <span className="text-[9px] text-slate-550 text-slate-500 font-bold uppercase tracking-wide">· {prod.brand}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-3 border-t border-slate-850/60">
                        <span className="font-extrabold text-lg text-slate-100">₹{prod.price?.toLocaleString('en-IN')}</span>
                        <button 
                          onClick={() => handleAddToCart(prod)}
                          className="px-3.5 py-2 bg-violet-600 text-white hover:bg-violet-500 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
                        >
                          <ShoppingBag className="h-3.5 w-3.5" />
                          Add
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Infinite scroll status */}
              {visibleCount < filteredProducts.length && (
                <div className="text-center py-6 text-xs text-slate-500 font-semibold animate-pulse">
                  Scroll down to view more products ({filteredProducts.length - visibleCount} more available)
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

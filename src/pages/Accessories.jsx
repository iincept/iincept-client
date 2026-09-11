import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useSearchParams } from 'react-router-dom';
import { Heart, ShoppingBag, Loader2, ChevronDown, Search, Laptop, Tablet, Smartphone, Watch, Headphones, Tv, Sparkles, Plug, CircleDot, Keyboard, Accessibility, Gamepad, Camera, PenTool, Activity, Home } from 'lucide-react';
import { addToCart } from '../redux/cartSlice';
import { addToWishlist } from '../redux/wishlistSlice';
import { fetchProducts } from '../redux/productSlice';
import { matchesProductSearch } from '../utils/searchUtils';
import CleanProductImage from '../components/CleanProductImage';

// Products are loaded dynamically from e-commerce database API

const ACCESSORIES_CHAPTER_NAV_ITEMS = [
  {
    id: 'all',
    name: 'All Accessories',
    query: '',
    icon: (
      <svg className="w-9 h-9 text-zinc-900 stroke-[1.6]" viewBox="0 0 36 36" fill="none" stroke="currentColor">
        <rect x="5" y="5" width="11" height="11" rx="2.5" />
        <rect x="20" y="5" width="11" height="11" rx="2.5" />
        <rect x="5" y="20" width="11" height="11" rx="2.5" />
        <rect x="20" y="20" width="11" height="11" rx="2.5" />
      </svg>
    )
  },
  {
    id: 'mac',
    name: 'Mac',
    query: 'mac',
    icon: (
      <svg className="w-10 h-10 text-zinc-900 stroke-[1.6]" viewBox="0 0 40 40" fill="none" stroke="currentColor">
        <rect x="6" y="8" width="28" height="18" rx="2" />
        <path d="M4 30H36V32H4V30Z" fill="currentColor" stroke="none" />
      </svg>
    )
  },
  {
    id: 'ipad',
    name: 'iPad',
    query: 'ipad',
    icon: (
      <svg className="w-8 h-10 text-zinc-900 stroke-[1.6]" viewBox="0 0 32 40" fill="none" stroke="currentColor">
        <rect x="4" y="4" width="24" height="32" rx="4" />
        <circle cx="16" cy="32" r="1" fill="currentColor" />
      </svg>
    )
  },
  {
    id: 'iphone',
    name: 'iPhone',
    query: 'iphone',
    icon: (
      <svg className="w-7 h-10 text-zinc-900 stroke-[1.6]" viewBox="0 0 28 40" fill="none" stroke="currentColor">
        <rect x="4" y="4" width="20" height="32" rx="4" />
        <path d="M11 7H17" strokeLinecap="round" />
      </svg>
    )
  },
  {
    id: 'watch',
    name: 'Watch',
    query: 'watch',
    icon: (
      <svg className="w-7 h-10 text-zinc-900 stroke-[1.6]" viewBox="0 0 28 40" fill="none" stroke="currentColor">
        <path d="M9 8V2C9 1.4 9.4 1 10 1H18C18.6 1 19 1.4 19 2V8" strokeLinecap="round" />
        <rect x="5" y="8" width="18" height="24" rx="6" />
        <path d="M9 32V38C9 38.6 9.4 39 10 39H18C18.6 39 19 38.6 19 38V32" strokeLinecap="round" />
      </svg>
    )
  },
  {
    id: 'airpods',
    name: 'AirPods',
    query: 'airpods',
    icon: (
      <svg className="w-9 h-9 text-zinc-900" viewBox="0 0 36 36" fill="currentColor">
        <path d="M13 9c-2 0-3.5 1.5-3.5 3.5 0 1.8 1.2 3.2 2.8 3.5V25c0 .8.7 1.5 1.5 1.5s1.5-.7 1.5-1.5V16c1.6-.3 2.8-1.7 2.8-3.5C18.1 10.5 16.6 9 14.6 9z" />
        <path d="M23 9c-2 0-3.5 1.5-3.5 3.5 0 1.8 1.2 3.2 2.8 3.5V25c0 .8.7 1.5 1.5 1.5s1.5-.7 1.5-1.5V16c1.6-.3 2.8-1.7 2.8-3.5C28.1 10.5 26.6 9 24.6 9z" />
      </svg>
    )
  },
  {
    id: 'tv-home',
    name: 'TV & Home',
    query: 'tv-home',
    icon: (
      <svg className="w-9 h-9 text-zinc-900 stroke-[1.6]" viewBox="0 0 36 36" fill="none" stroke="currentColor">
        <rect x="4" y="8" width="28" height="18" rx="3" />
        <path d="M12 30L18 26L24 30" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    )
  }
];

export default function Accessories() {
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const { products, loading } = useSelector((state) => state.products);
  const [selectedColors, setSelectedColors] = useState({});
  const [activeTab, setActiveTab] = useState('all');
  const [localWishlist, setLocalWishlist] = useState({});
  const [showBrowseMenu, setShowBrowseMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProductFilter, setSelectedProductFilter] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('');
  const [visibleCount, setVisibleCount] = useState(6);
  const isLoadingMore = useRef(false);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  useEffect(() => {
    setVisibleCount(6);
  }, [activeTab, searchQuery, selectedProductFilter, selectedCategoryFilter, searchParams]);

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

  useEffect(() => {
    const urlSearch = searchParams.get('search');
    if (urlSearch !== null) {
      setSearchQuery(urlSearch);
    }
    const urlProduct = searchParams.get('product');
    if (urlProduct !== null) {
      setSelectedProductFilter(urlProduct);
    }
    const urlCategory = searchParams.get('category');
    if (urlCategory !== null) {
      setSelectedCategoryFilter(urlCategory);
    }
  }, [searchParams]);

  const resolveColorValue = (cVal) => {
    if (!cVal) return '#cbd5e1';
    const cValStr = cVal.toString().trim();
    if (cValStr.startsWith('#') || cValStr.startsWith('rgb') || cValStr.startsWith('hsl')) {
      return cValStr;
    }
    const COLOR_MAP = {
      "space black": "#1c1c1c",
      "space gray": "#555555",
      "starlight": "#f5f5f4",
      "silver": "#cbd5e1",
      "desert titanium": "#e6c2b9",
      "dark blue": "#2a4b7c",
      "deep blue": "#1d3557",
      "titanium": "#cbd5e1",
      "white": "#ffffff",
      "gold": "#e5c158",
      "pink": "#ec4899",
      "black": "#111111",
      "orange": "#ff9f68",
      "orenge": "#ff9f68",
      "cosmic orange": "#d9a07a",
      "blue": "#0071E3",
      "red": "#e0115f",
      "midnight": "#1e293b",
      "light blue": "#bfdbfe",
      "sky blue": "#bae6fd",
      "lavender": "#e9d5ff",
      "green": "#bbf7d0",
      "dark gray": "#3f3f46",
      "natural titanium": "#a39e99",
      "natural": "#a39e99",
      "black titanium": "#232426",
      "white titanium": "#f2f1ed",
      "deep purple": "#3b224c",
      "purple": "#a855f7",
      "yellow": "#eab308"
    };
    const lowerVal = cValStr.toLowerCase().replace(/\s+/g, ' ').trim();
    return COLOR_MAP[lowerVal] || '#cbd5e1';
  };

  const handleColorChange = (productId, colorVal) => {
    setSelectedColors((prev) => ({ ...prev, [productId]: colorVal }));
  };

  const getProductImage = (prod) => {
    const selectedColorName = selectedColors[prod.id];
    if (selectedColorName) {
      const foundColor = prod.colors.find((c) => c.name === selectedColorName);
      if (foundColor && foundColor.image) {
        return foundColor.image;
      }
      const colorIdx = prod.colors.findIndex((c) => (c.name || c) === selectedColorName);
      if (colorIdx !== -1 && prod.images && prod.images[colorIdx]) {
        return prod.images[colorIdx];
      }
    }
    return prod.image;
  };

  const handleAddToCart = (prod) => {
    const selectedColor = selectedColors[prod.id] || prod.colors[0]?.name || 'Standard';
    dispatch(addToCart({
      id: prod.id,
      name: `${prod.name} (${selectedColor})`,
      price: prod.price,
      image: getProductImage(prod),
      quantity: 1
    }));
  };

  const handleAddToWishlist = (prod) => {
    setLocalWishlist((prev) => ({ ...prev, [prod.id]: !prev[prod.id] }));
    dispatch(addToWishlist({
      id: prod.id,
      name: prod.name,
      price: prod.price,
      image: getProductImage(prod),
      rating: prod.rating
    }));
  };

  const dbAccessories = products.filter(p => {
    const catName = (p.category?.name || p.category?.toString() || '').toLowerCase();
    const catSlug = (p.category?.slug || '').toLowerCase();
    const titleLower = (p.title || p.name || '').toLowerCase();

    const isAccessoriesCat = catName === 'accessories' || catSlug === 'accessories' || catName.includes('accessori');
    const isAccessoryKeyword = titleLower.includes('case') || 
                               titleLower.includes('charger') || 
                               titleLower.includes('adapter') || 
                               titleLower.includes('cable') || 
                               titleLower.includes('magsafe') || 
                               titleLower.includes('pencil') || 
                               titleLower.includes('keyboard') || 
                               titleLower.includes('mouse') || 
                               titleLower.includes('strap') || 
                               titleLower.includes('band') || 
                               titleLower.includes('loop') ||
                               titleLower.includes('power') ||
                               titleLower.includes('stand') ||
                               titleLower.includes('dock') ||
                               titleLower.includes('mount');

    let isMainDevice = false;

    if (titleLower.includes('iphone') && 
        !titleLower.includes('case') && 
        !titleLower.includes('wallet') && 
        !titleLower.includes('cover') && 
        !titleLower.includes('protector') && 
        !titleLower.includes('mount') && 
        !titleLower.includes('charger')) {
      isMainDevice = true;
    }

    if (titleLower.includes('ipad') && 
        !titleLower.includes('pencil') && 
        !titleLower.includes('case') && 
        !titleLower.includes('cover') && 
        !titleLower.includes('keyboard') && 
        !titleLower.includes('folio')) {
      isMainDevice = true;
    }

    if ((titleLower.includes('macbook') || titleLower.includes('laptop') || titleLower.includes('pc ')) &&
        !titleLower.includes('adapter') &&
        !titleLower.includes('charger') &&
        !titleLower.includes('power') &&
        !titleLower.includes('magsafe') &&
        !titleLower.includes('cable') &&
        !titleLower.includes('sleeve') &&
        !titleLower.includes('case') &&
        !titleLower.includes('cover') &&
        !titleLower.includes('dock') &&
        !titleLower.includes('stand')) {
      isMainDevice = true;
    }

    if (titleLower.includes('watch') && 
        !titleLower.includes('band') && 
        !titleLower.includes('loop') && 
        !titleLower.includes('strap') && 
        !titleLower.includes('case') && 
        !titleLower.includes('charger')) {
      isMainDevice = true;
    }

    if ((titleLower.includes('airpods') || titleLower.includes('air pods') || titleLower.includes('headphone') || titleLower.includes('headphones')) && 
        !titleLower.includes('earpods') &&
        !titleLower.includes('plug') &&
        !titleLower.includes('adapter') &&
        !titleLower.includes('cable') &&
        !titleLower.includes('case') && 
        !titleLower.includes('charm') && 
        !titleLower.includes('strap') && 
        !titleLower.includes('stand')) {
      isMainDevice = true;
    }

    if (titleLower.includes('tv') && 
        !titleLower.includes('mount') && 
        !titleLower.includes('cable') && 
        !titleLower.includes('holder') &&
        !titleLower.includes('accessories') &&
        catName !== 'accessories') {
      isMainDevice = true;
    }

    if (titleLower.includes('homepod') && !titleLower.includes('mount') && !titleLower.includes('stand')) {
      isMainDevice = true;
    }

    return (isAccessoriesCat || isAccessoryKeyword) && !isMainDevice;
  }).map(p => {
    const firstImg = p.image || (p.images && p.images[0]);
    const isValidImg = firstImg && !firstImg.includes('mock-cloud');
    return {
      id: p._id || p.id,
      name: p.title || p.name,
      price: p.price,
      priceStr: `₹${p.price.toLocaleString()}`,
      image: isValidImg ? firstImg : '/iphone17e_cases.jpg',
      images: p.images || [],
      colors: Array.isArray(p.colors) ? p.colors.map(c => {
        const name = typeof c === 'string' ? c : (c.name || '');
        const val = typeof c === 'string' ? c : (c.value || c.name || '');
        return { name, value: resolveColorValue(val) };
      }) : [],
      rating: p.rating || 5.0,
      isSoldOut: p.stock <= 0
    };
  });

  const combinedProducts = dbAccessories;

  const filteredProducts = combinedProducts.filter((prod) => {
    const nameLower = (prod.name || '').toLowerCase();

    if (activeTab === 'available' && prod.isSoldOut) return false;
    if (activeTab === 'soldout' && !prod.isSoldOut) return false;

    if (searchQuery && !matchesProductSearch(prod, searchQuery)) return false;

    if (selectedProductFilter) {
      if (selectedProductFilter === 'mac' && !nameLower.includes('mac') && !nameLower.includes('pencil')) return false;
      if (selectedProductFilter === 'ipad' && !nameLower.includes('ipad') && !nameLower.includes('pencil')) return false;
      if (selectedProductFilter === 'iphone' && !nameLower.includes('iphone') && !nameLower.includes('case')) return false;
      if (selectedProductFilter === 'watch' && !nameLower.includes('watch') && !nameLower.includes('band') && !nameLower.includes('loop') && !nameLower.includes('strap')) return false;
      if (selectedProductFilter === 'airpods' && !nameLower.includes('airpod') && !nameLower.includes('max') && !nameLower.includes('pro')) return false;
      if (selectedProductFilter === 'tv-home' && !nameLower.includes('tv') && !nameLower.includes('home') && !nameLower.includes('pod')) return false;
    }

    return true;
  });

  return (
    <div className="min-h-screen bg-[#fcfcfc] text-[#1d1d1f] py-4 select-none animate-in fade-in duration-300 relative font-sans">

      {/* Accessories Title Header matching Mac, iPad, Watch, iPhone, AirPods */}
      <div className="w-full bg-[#fcfcfc] pt-2 pb-6 select-none font-sans border-b border-zinc-150 mb-8 px-4 sm:px-8 md:px-12 lg:px-16">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-5xl sm:text-6xl font-black tracking-tight text-zinc-950 text-left">Accessories</h1>
        </div>
      </div>

      <div className="px-4 sm:px-8 md:px-12 lg:px-16 py-8">


        {/* Category Products Grid List */}
        {loading ? (
          <div className="p-16 flex flex-col items-center justify-center text-zinc-400">
            <Loader2 className="h-8 w-8 animate-spin text-[#0071e3] mb-3" />
            <span className="text-sm">Loading premium accessories catalog...</span>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="p-16 text-center text-zinc-400">
            <span className="text-sm">No accessories found in this criteria.</span>
          </div>
        ) : (
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {filteredProducts.slice(0, visibleCount).map((prod) => (
              <div
                key={prod.id}
                className="group bg-white rounded-2xl overflow-hidden flex flex-col justify-between p-6 shadow-sm border border-zinc-100/50 hover:shadow-md hover:border-zinc-200/55 transition-all duration-300 relative text-left"
              >
                {/* Top Row Favorite Heart */}
                <div className="flex items-center justify-between absolute top-4 left-4 right-4 z-10">
                  {prod.isSoldOut ? (
                    <span className="bg-[#f5f5f7] text-[#1d1d1f] font-bold text-[9px] tracking-widest uppercase px-2.5 py-1 rounded">
                      SOLD OUT
                    </span>
                  ) : (
                    <div />
                  )}

                  <button
                    onClick={() => handleAddToWishlist(prod)}
                    className={`p-2 rounded-full shadow-sm border border-zinc-100/80 bg-white/90 hover:scale-110 transition-all cursor-pointer ${localWishlist[prod.id] ? 'text-red-500' : 'text-zinc-400 hover:text-zinc-600'
                      }`}
                  >
                    <Heart className={`h-4 w-4 ${localWishlist[prod.id] ? 'fill-current' : ''}`} />
                  </button>
                </div>

                {/* Clickable Area: Image and Title */}
                <Link to={`/product/${prod.id}`} className="block cursor-pointer">
                  {/* Product Visual - Apple Showcase Background (#f5f5f7) */}
                  <CleanProductImage
                    src={getProductImage(prod)}
                    alt={prod.name}
                  />

                  {/* Title with Dynamic Color Part Number */}
                  <h3 className="font-semibold text-[16px] leading-snug tracking-tight text-zinc-900 group-hover:text-zinc-900 transition-colors min-h-[48px]">
                    {prod.name}
                  </h3>
                </Link>

                {/* Non-clickable configurations / actions */}
                <div className="space-y-4 pt-2">
                  {/* Color Dot Options Row */}
                  {prod.colors && prod.colors.length > 0 && (
                    <div className="flex items-center justify-between gap-2 border-t border-zinc-100/60 pt-3">
                      <span className="text-[10px] text-zinc-400 uppercase tracking-widest font-bold">Colors</span>
                      <div className="flex items-center gap-3 shrink-0 py-1">
                        {prod.colors.map((color) => {
                          const isSelected = selectedColors[prod.id] === color.name || (!selectedColors[prod.id] && prod.colors[0]?.name === color.name);
                          return (
                            <button
                              key={color.name}
                              onClick={() => handleColorChange(prod.id, color.name)}
                              style={{ backgroundColor: color.value }}
                              className={`w-4 h-4 rounded-full cursor-pointer transition-all ${isSelected ? 'scale-110 ring-2 ring-offset-2 ring-zinc-800 shadow-sm z-10' : 'border border-zinc-300 hover:scale-105'
                                }`}
                              title={color.name}
                            />
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Price and Cart Row */}
                  <div className="flex items-center justify-between pt-1 border-t border-zinc-100/60">
                    <div className="flex flex-col">
                      <span className="text-[10px] text-zinc-400 uppercase tracking-widest font-bold">Price</span>
                      <span className="font-semibold text-zinc-900 text-sm">{prod.priceStr}</span>
                    </div>

                    {!prod.isSoldOut && (
                      <button
                        onClick={() => handleAddToCart(prod)}
                        className="flex items-center justify-center p-2 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-700 hover:text-zinc-900 transition-all cursor-pointer"
                        title="Add to Cart"
                      >
                        <ShoppingBag className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Infinite Scroll Indicator */}
        {visibleCount < filteredProducts.length && (
          <div className="text-center py-10">
            <button
              onClick={() => setVisibleCount(prev => prev + 6)}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-zinc-900 text-white text-xs font-bold tracking-wide hover:bg-zinc-800 transition-all cursor-pointer shadow-sm"
            >
              <span>Scroll for More Products ({Math.min(visibleCount, filteredProducts.length)} of {filteredProducts.length})</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

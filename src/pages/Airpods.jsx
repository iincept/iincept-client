import { useEffect, useState, useRef } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Heart, SlidersHorizontal, ArrowUpDown, X, ShoppingBag, ShieldCheck, Wrench, Headphones, Check } from 'lucide-react';
import { addToCart } from '../redux/cartSlice';
import { addToWishlist } from '../redux/wishlistSlice';
import { fetchProducts } from '../redux/productSlice';
import { matchesProductSearch } from '../utils/searchUtils';
import axiosClient from '../services/axiosClient';
import { subscribeToLiveSync } from '../services/liveSyncService';
import AppleCareFeaturesGrid from '../components/AppleCareFeaturesGrid';
import CleanProductImage from '../components/CleanProductImage';

// Default AirPods AppleCare rows fallback
const DEFAULT_AIRPODS_APPLECARE_ROWS = [
  { 
    model: 'AirPods Pro 2', 
    title: 'AppleCare+ for AirPods Pro 2', 
    description: '2 Years Apple-certified coverage for AirPods Pro 2 with accidental damage protection.', 
    sku: 'AC-AIRPODS-PRO2', 
    mrp: '₹3,900.00', 
    discount: '10% OFF', 
    salePrice: '₹3,500.00', 
    monthly: '₹175.00', 
    yearly: '₹3,500.00', 
    image: '/airpods_nav/airpods_pro_2.png', 
    isActive: true 
  },
  { 
    model: 'AirPods 4 / AirPods 4 with ANC', 
    title: 'AppleCare+ for AirPods 4', 
    description: '2 Years Apple-certified coverage for AirPods 4 with accidental damage protection.', 
    sku: 'AC-AIRPODS-4', 
    mrp: '₹3,500.00', 
    discount: '10% OFF', 
    salePrice: '₹3,100.00', 
    monthly: '₹155.00', 
    yearly: '₹3,100.00', 
    image: '/airpods_nav/airpods_4.png', 
    isActive: true 
  },
  { 
    model: 'AirPods Max', 
    title: 'AppleCare+ for AirPods Max', 
    description: '2 Years Apple-certified coverage for AirPods Max with accidental damage protection.', 
    sku: 'AC-AIRPODS-MAX', 
    mrp: '₹6,900.00', 
    discount: '10% OFF', 
    salePrice: '₹6,200.00', 
    monthly: '₹310.00', 
    yearly: '₹6,200.00', 
    image: '/airpods_nav/airpods_max.png', 
    isActive: true 
  }
];

const DEFAULT_AIRPODS_PRODUCTS = [
  {
    id: 'default-airpods-pro-2',
    name: 'AirPods Pro 2',
    price: 24900,
    priceStr: '₹24,900',
    image: 'https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/airpods-pro-2-hero-select-202409?wid=800&hei=1000&fmt=webp&qlt=90',
    images: ['https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/airpods-pro-2-hero-select-202409?wid=800&hei=1000&fmt=webp&qlt=90'],
    colors: [{ name: 'White', value: '#ffffff' }],
    rating: 5.0,
    isSoldOut: false
  },
  {
    id: 'default-airpods-4',
    name: 'AirPods 4',
    price: 12900,
    priceStr: '₹12,900',
    image: 'https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/airpods-4-hero-select-202409?wid=800&hei=1000&fmt=webp&qlt=90',
    images: ['https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/airpods-4-hero-select-202409?wid=800&hei=1000&fmt=webp&qlt=90'],
    colors: [{ name: 'White', value: '#ffffff' }],
    rating: 4.9,
    isSoldOut: false
  },
  {
    id: 'default-airpods-4-anc',
    name: 'AirPods 4 with ANC',
    price: 17900,
    priceStr: '₹17,900',
    image: 'https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/airpods-4-anc-hero-select-202409?wid=800&hei=1000&fmt=webp&qlt=90',
    images: ['https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/airpods-4-anc-hero-select-202409?wid=800&hei=1000&fmt=webp&qlt=90'],
    colors: [{ name: 'White', value: '#ffffff' }],
    rating: 4.9,
    isSoldOut: false
  },
  {
    id: 'default-airpods-max',
    name: 'AirPods Max',
    price: 59900,
    priceStr: '₹59,900',
    image: 'https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/airpods-max-hero-select-202409?wid=800&hei=1000&fmt=webp&qlt=90',
    images: ['https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/airpods-max-hero-select-202409?wid=800&hei=1000&fmt=webp&qlt=90'],
    colors: [
      { name: 'Midnight', value: '#1e293b' },
      { name: 'Starlight', value: '#f5f5f4' },
      { name: 'Blue', value: '#1d3557' },
      { name: 'Purple', value: '#a855f7' },
      { name: 'Orange', value: '#e07a5f' }
    ],
    rating: 5.0,
    isSoldOut: false
  }
];

const AIRPODS_SUB_NAV_ITEMS = [
  { name: 'AirPods', isNew: true, query: 'AirPods', image: 'https://www.apple.com/v/airpods/shared/icon_airpods_4__b83p14jxgzkm_large.svg', scale: 'scale-100' },
  { name: 'AirPods Pro', query: 'Pro 2', image: 'https://www.apple.com/v/airpods/shared/icon_airpods_pro__c4g86280j6eu_large.svg', scale: 'scale-100' },
  { name: 'AirPods Max', query: 'AirPods Max', image: 'https://www.apple.com/v/airpods/shared/icon_airpods_max__c1i39v5a1pqu_large.svg', scale: 'scale-100' },
  { name: 'Compare', path: '/compare', image: 'https://www.apple.com/v/airpods/shared/icon_compare__e3a7h9h7ywa6_large.svg', scale: 'scale-100' },
  { name: 'Accessories', path: '/shop?category=Accessories', image: 'https://www.apple.com/v/airpods/shared/icon_accessories__f29e160a0z6q_large.svg', scale: 'scale-100' },
  { name: 'AppleCare+', path: '/airpods?tab=applecare', image: '/applecare_official_hero.png', scale: 'scale-100' }
];

const resolveSubItemPath = (item) => {
  const lowerName = (item.name || item.label || item.query || '').toLowerCase();
  if (lowerName.includes('care') || lowerName.includes('applecare')) {
    return '/airpods?tab=applecare';
  }
  if (lowerName.includes('shop airpods') || lowerName === 'all' || lowerName === 'all airpods') {
    return '/airpods';
  }
  if (
    item.path &&
    item.path !== '/airpods' &&
    !item.path.startsWith('/airpods?search=') &&
    !item.path.startsWith('/product/')
  ) {
    return item.path;
  }
  const queryVal = item.query || item.name || item.label || '';
  return `/airpods?search=${encodeURIComponent(queryVal)}`;
};

const ensureAppleCareInSubItems = (items = []) => {
  if (!items || items.length === 0) return AIRPODS_SUB_NAV_ITEMS;

  let careItem = items.find(item => (item.name || item.label || '').toLowerCase().includes('care'));
  if (!careItem) {
    careItem = {
      name: 'AppleCare+',
      path: '/airpods?tab=applecare',
      image: '/applecare_official_hero.png',
      scale: 'scale-100'
    };
  }

  let compareItem = items.find(item => (item.name || item.label || '').toLowerCase().includes('compare'));
  const regularItems = items.filter(item => {
    const lbl = (item.name || item.label || '').toLowerCase();
    return !lbl.includes('care') && !lbl.includes('compare');
  });

  const result = [...regularItems];
  if (compareItem) result.push(compareItem);
  result.push(careItem);

  return result;
};

const getInitialSubItems = (categoryKey, defaultItems) => {
  try {
    const cached = localStorage.getItem(`iincept_sub_items_v2_${categoryKey}`);
    if (cached) {
      const parsed = JSON.parse(cached);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return ensureAppleCareInSubItems(parsed);
      }
    }
  } catch (e) {}
  return ensureAppleCareInSubItems(defaultItems);
};

const resolveIconImage = (img, label) => {
  if (img && typeof img === 'string' && img.trim()) {
    let clean = img.trim();
    if (!clean.includes('airpods_nav') && clean !== 'null' && clean !== 'undefined') {
      if (!clean.startsWith('http://') && !clean.startsWith('https://') && !clean.startsWith('data:') && !clean.startsWith('blob:') && !clean.startsWith('/')) {
        clean = '/' + clean;
      }
      return clean;
    }
  }

  const lblLower = (label || '').toLowerCase().trim();
  if (lblLower.includes('care') || lblLower.includes('applecare')) return '/applecare_official_hero.png';
  if (lblLower.includes('compare')) return 'https://www.apple.com/v/airpods/shared/icon_compare__e3a7h9h7ywa6_large.svg';
  if (lblLower.includes('accessory') || lblLower.includes('accessories')) return 'https://www.apple.com/v/airpods/shared/icon_accessories__f29e160a0z6q_large.svg';
  if (lblLower.includes('max')) return 'https://www.apple.com/v/airpods/shared/icon_airpods_max__c1i39v5a1pqu_large.svg';
  if (lblLower.includes('pro')) return 'https://www.apple.com/v/airpods/shared/icon_airpods_pro__c4g86280j6eu_large.svg';
  if (lblLower.includes('airpods') || lblLower.includes('4') || lblLower.includes('5')) return 'https://www.apple.com/v/airpods/shared/icon_airpods_4__b83p14jxgzkm_large.svg';

  return 'https://www.apple.com/v/airpods/shared/icon_airpods_4__b83p14jxgzkm_large.svg';
};

const getModelImageByName = (modelName = '') => {
  const m = modelName.toLowerCase();
  if (m.includes('max')) return '/airpods_nav/airpods_max.png';
  if (m.includes('4')) return '/airpods_nav/airpods_4.png';
  return '/airpods_nav/airpods_pro_2.png';
};

export default function Airpods() {
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const { products } = useSelector((state) => state.products);
  const [viewCols, setViewCols] = useState(4);
  const [showLimit, setShowLimit] = useState(16);
  const [sortBy, setSortBy] = useState('latest');
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedColors, setSelectedColors] = useState({});
  const [activeTab, setActiveTab] = useState('all');
  const [subItems, setSubItems] = useState(() => getInitialSubItems('airpods', AIRPODS_SUB_NAV_ITEMS));
  const [localWishlist, setLocalWishlist] = useState({});
  const [visibleCount, setVisibleCount] = useState(6);
  const isLoadingMore = useRef(false);

  // AirPods AppleCare Dynamic Data
  const [dbAppleCareRows, setDbAppleCareRows] = useState(DEFAULT_AIRPODS_APPLECARE_ROWS);
  const [selectedAppleCareModel, setSelectedAppleCareModel] = useState(DEFAULT_AIRPODS_APPLECARE_ROWS[0]);
  const [selectedAppleCareMap, setSelectedAppleCareMap] = useState({});
  const [dbHeaderTitle, setDbHeaderTitle] = useState('AppleCare+');
  const [dbDurationLabel, setDbDurationLabel] = useState('2 Years');

  useEffect(() => {
    dispatch(fetchProducts());
    fetchNavSettings();
    const unsubscribe = subscribeToLiveSync(() => {
      dispatch(fetchProducts());
      fetchNavSettings();
    });
    return () => unsubscribe();
  }, [dispatch]);

  useEffect(() => {
    setSelectedColors({});
  }, [products]);

  useEffect(() => {
    setVisibleCount(6);
  }, [activeTab, sortBy, searchParams]);

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

  const fetchNavSettings = async () => {
    try {
      const response = await axiosClient.get('/settings');
      if (response.data) {
        // Load AirPods AppleCare Pricing Table
        if (response.data.appleCarePricingTables && response.data.appleCarePricingTables.length > 0) {
          const airpodsTable = response.data.appleCarePricingTables.find(t => t.categoryKey === 'airpods');
          if (airpodsTable) {
            setDbHeaderTitle(airpodsTable.headerTitle || 'AppleCare+');
            setDbDurationLabel(airpodsTable.durationLabel || '2 Years');
            if (airpodsTable.rows && airpodsTable.rows.length > 0) {
              const activeRows = airpodsTable.rows.filter(r => r.isActive !== false);
              if (activeRows.length > 0) {
                const mappedRows = activeRows.map(r => ({
                  model: r.model || '',
                  title: r.title || `AppleCare+ for ${r.model}`,
                  description: r.description || `2 Years Apple-certified coverage for ${r.model}`,
                  sku: r.sku || '',
                  mrp: r.mrp || '',
                  discount: r.discount || '',
                  salePrice: r.salePrice || r.yearly || '',
                  monthly: r.monthly || '',
                  yearly: r.yearly || r.salePrice || '',
                  image: r.image || getModelImageByName(r.model),
                  isActive: r.isActive !== false
                }));
                setDbAppleCareRows(prev => (JSON.stringify(prev) !== JSON.stringify(mappedRows) ? mappedRows : prev));
                setSelectedAppleCareModel(activeRows[0]);
              }
            }
          }
        }

        // Sub Nav items
        if (response.data.categoryIconGroups && response.data.categoryIconGroups.length > 0) {
          const airpodsGrp = response.data.categoryIconGroups.find(g => g.categoryKey === 'airpods');
          if (airpodsGrp && airpodsGrp.icons && airpodsGrp.icons.length > 0) {
            const activeSub = airpodsGrp.icons.filter(d => d.isActive !== false);
            if (activeSub.length > 0) {
              const mapped = activeSub.map(d => {
                const fallback = AIRPODS_SUB_NAV_ITEMS.find(m => m.name.toLowerCase() === (d.label || '').toLowerCase());
                return {
                  name: d.label,
                  query: d.query || d.label,
                  path: resolveSubItemPath(d),
                  image: resolveIconImage(d.image, d.label),
                  scale: fallback?.scale || 'scale-100'
                };
              });
              const withCare = ensureAppleCareInSubItems(mapped);
              try {
                localStorage.setItem('iincept_sub_items_v2_airpods', JSON.stringify(withCare));
              } catch (e) {}
              setSubItems(prev => (JSON.stringify(prev) !== JSON.stringify(withCare) ? withCare : prev));
              return;
            }
          }
        }
        if (response.data.navbarMenuItems) {
          const airpodsItem = response.data.navbarMenuItems.find(i => (i.name || '').toLowerCase().includes('airpods'));
          if (airpodsItem && airpodsItem.dropdownItems && airpodsItem.dropdownItems.length > 0) {
            const activeSub = airpodsItem.dropdownItems.filter(d => d.isActive !== false);
            if (activeSub.length > 0) {
              const mapped = activeSub.map(d => {
                const fallback = AIRPODS_SUB_NAV_ITEMS.find(m => m.name.toLowerCase() === (d.label || '').toLowerCase());
                return {
                  name: d.label,
                  query: d.query || d.label,
                  path: resolveSubItemPath(d),
                  image: resolveIconImage(d.image, d.label),
                  scale: fallback?.scale || 'scale-100'
                };
              });
              const withCare = ensureAppleCareInSubItems(mapped);
              try {
                localStorage.setItem('iincept_sub_items_v2_airpods', JSON.stringify(withCare));
              } catch (e) {}
              setSubItems(prev => (JSON.stringify(prev) !== JSON.stringify(withCare) ? withCare : prev));
            }
          }
        }
      }
    } catch (err) {
      console.error('Failed to load airpods sub nav settings:', err);
    }
  };

  const handleBuyAppleCareWhatsApp = (modelObj = {}) => {
    const modelName = modelObj.title || modelObj.model || 'AirPods';
    const salePrice = modelObj.salePrice || modelObj.yearly || '₹3,500.00';
    const mrp = modelObj.mrp ? ` (MRP: ${modelObj.mrp})` : '';
    const discount = modelObj.discount ? ` [${modelObj.discount}]` : '';
    const sku = modelObj.sku ? `\n• *SKU Number:* ${modelObj.sku}` : '';
    const desc = modelObj.description ? `\n• *Details:* ${modelObj.description}` : '';
    const header = dbHeaderTitle ? `${dbHeaderTitle} ` : '';
    const duration = dbDurationLabel ? `\n• *Duration:* ${dbDurationLabel}` : '';

    const message = `Hello iiNCEPT Team! 👋\n\nI want to buy *${header}AppleCare+ Coverage*:\n• *Product:* ${modelName}${sku}${duration}${desc}\n• *Sale Price:* ${salePrice}${mrp}${discount}\n\nPlease share the payment link & activation process. Thank you!`;
    const whatsappUrl = `https://wa.me/918607222417?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const toggleAppleCareSelection = (rowObj) => {
    const key = rowObj.model || rowObj.title;
    setSelectedAppleCareMap((prev) => {
      const next = { ...prev };
      if (next[key]) {
        delete next[key];
      } else {
        next[key] = rowObj;
      }
      return next;
    });
  };

  const handleBuyMultipleAppleCareWhatsApp = (selectedMap = {}) => {
    const selectedList = Object.values(selectedMap);
    if (selectedList.length === 0) return;

    if (selectedList.length === 1) {
      handleBuyAppleCareWhatsApp(selectedList[0]);
      return;
    }

    const header = dbHeaderTitle ? `${dbHeaderTitle} ` : '';
    let totalCost = 0;
    let itemsText = '';

    selectedList.forEach((item, index) => {
      const title = item.title || item.model || 'AppleCare+ Plan';
      const sku = item.sku ? ` (SKU: ${item.sku})` : '';
      const priceStr = item.salePrice || item.yearly || '₹0';
      const numericPrice = parseFloat(priceStr.replace(/[^0-9.]/g, '')) || 0;
      totalCost += numericPrice;
      const mrp = item.mrp ? ` [MRP: ${item.mrp}]` : '';
      const discount = item.discount ? ` (${item.discount})` : '';

      itemsText += `${index + 1}. *${title}*${sku}\n   • Price: ${priceStr}${mrp}${discount}\n`;
    });

    const formattedTotal = `₹${totalCost.toLocaleString('en-IN')}.00`;
    const message = `Hello iiNCEPT Team! 👋\n\nI want to buy *${selectedList.length} ${header}AppleCare+ Coverage Plans*:\n\n${itemsText}\n• *Total Combined Price:* ${formattedTotal}\n\nPlease share the combined payment link & activation steps. Thank you!`;

    const whatsappUrl = `https://wa.me/918607222417?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleAddAppleCareToCart = (rowObj, i) => {
    const planTitle = rowObj.title || `Apple Care+ ${rowObj.model}`;
    const sku = rowObj.sku || '';
    const nameWithSku = sku ? `${planTitle} (SKU: ${sku})` : planTitle;
    const priceStr = rowObj.salePrice || rowObj.yearly || '0';
    const numericPrice = parseFloat(priceStr.replace(/[^0-9.]/g, '')) || 3500;
    const image = rowObj.image || getModelImageByName(rowObj.model);
    const itemId = `ac-airpods-${sku || i}`;

    dispatch(
      addToCart({
        id: itemId,
        name: nameWithSku,
        title: nameWithSku,
        price: numericPrice,
        image: image,
        quantity: 1,
        isAppleCare: true,
        sku: sku
      })
    );
  };

  const handleAddAppleCareToWishlist = (rowObj, i) => {
    const planTitle = rowObj.title || `Apple Care+ ${rowObj.model}`;
    const sku = rowObj.sku || '';
    const nameWithSku = sku ? `${planTitle} (SKU: ${sku})` : planTitle;
    const priceStr = rowObj.salePrice || rowObj.yearly || '0';
    const numericPrice = parseFloat(priceStr.replace(/[^0-9.]/g, '')) || 3500;
    const image = rowObj.image || getModelImageByName(rowObj.model);
    const itemId = `ac-airpods-${sku || i}`;

    setLocalWishlist((prev) => ({ ...prev, [itemId]: !prev[itemId] }));

    dispatch(
      addToWishlist({
        id: itemId,
        name: nameWithSku,
        title: nameWithSku,
        price: numericPrice,
        image: image,
        rating: 5.0,
        isAppleCare: true,
        sku: sku
      })
    );
  };

  const handleColorChange = (productId, colorVal) => {
    setSelectedColors((prev) => ({ ...prev, [productId]: colorVal }));
  };

  const getProductImage = (prod) => {
    const selectedColorName = selectedColors[prod.id] || (prod.colors && prod.colors[0] ? (prod.colors[0].name || (typeof prod.colors[0] === 'string' ? prod.colors[0] : '')) : null);
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
      "blue": "#0071E3",
      "red": "#e0115f",
      "midnight": "#1e293b",
      "purple": "#a855f7",
      "yellow": "#eab308"
    };
    const lowerVal = cValStr.toLowerCase().replace(/\s+/g, ' ').trim();
    return COLOR_MAP[lowerVal] || '#cbd5e1';
  };

  const dbAirpods = products.filter(p => {
    const catName = p.category?.name || p.category?.toString() || '';
    const catSlug = p.category?.slug || '';
    return catName.toLowerCase() === 'airpods' || 
           catName.toLowerCase() === 'premium audio' || 
           catSlug.toLowerCase() === 'airpods' || 
           catSlug.toLowerCase() === 'premium-audio' || 
           catName.toLowerCase().includes('airpod') || 
           catName.toLowerCase().includes('audio');
  }).map(p => {
    const firstImg = p.image || (p.images && p.images[0]);
    const isValidImg = firstImg && !firstImg.includes('mock-cloud');
    return {
      id: p._id || p.id,
      name: p.title || p.name,
      price: p.price,
      priceStr: `₹${p.price.toLocaleString()}`,
      image: isValidImg ? firstImg : '/airpods_pro_3.jpg',
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

  const combinedProducts = (() => {
    let list = dbAirpods.length > 0 ? [...dbAirpods] : [];
    DEFAULT_AIRPODS_PRODUCTS.forEach(defProd => {
      const cleanDef = defProd.name.toLowerCase().replace(/[^a-z0-9]/g, '');
      const idx = list.findIndex(p => {
        const cleanP = (p.name || '').toLowerCase().replace(/[^a-z0-9]/g, '');
        return cleanP === cleanDef || cleanP.includes(cleanDef) || cleanDef.includes(cleanP);
      });
      if (idx === -1) {
        list.push(defProd);
      } else {
        list[idx] = {
          ...defProd,
          ...list[idx],
          image: (list[idx].image && !list[idx].image.includes('airpods_pro_3')) ? list[idx].image : defProd.image
        };
      }
    });
    return list;
  })();

  const sortedProducts = [...combinedProducts].sort((a, b) => {
    if (sortBy === 'price-asc') return a.price - b.price;
    if (sortBy === 'price-desc') return b.price - a.price;
    if (sortBy === 'rating') return b.rating - a.rating;
    return 0;
  });

  const filteredProducts = sortedProducts.filter((prod) => {
    const search = searchParams.get('search') || '';
    if (search && !matchesProductSearch(prod, search)) {
      return false;
    }

    if (activeTab === 'available') return !prod.isSoldOut;
    if (activeTab === 'soldout') return prod.isSoldOut;
    return true;
  });

  return (
    <div className="min-h-screen bg-[#fcfcfc] text-[#1d1d1f] py-8 px-4 sm:px-8 md:px-12 lg:px-16 select-none animate-in fade-in duration-300 relative">
      
      {/* Title & Category Sub-Nav Header */}
      <div className="w-full bg-[#fcfcfc] pt-2 pb-4 select-none font-sans mb-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-5xl sm:text-6xl font-extrabold tracking-tight text-zinc-950 text-left mb-6">
            AirPods
          </h1>

          {/* Horizontal AirPods Model Selector Row */}
          <div className="flex items-end gap-7 sm:gap-9 md:gap-11 lg:gap-12 overflow-x-auto no-scrollbar py-3 px-1">
            {subItems.map((item, idx) => {
              const currentTab = searchParams.get('tab') || '';
              const currentSearch = searchParams.get('search') || '';
              const itemLowerName = (item.name || item.label || '').toLowerCase();
              const isAppleCareItem = itemLowerName.includes('care');
              const isAppleCareActive = currentTab.toLowerCase() === 'applecare' || currentSearch.toLowerCase().includes('care');

              let isActive = false;
              if (isAppleCareActive) {
                isActive = isAppleCareItem;
              } else if (currentSearch) {
                const normSearch = currentSearch.toLowerCase().replace(/[^a-z0-9]/g, '');
                const normQuery = (item.query || item.name || item.label || '').toLowerCase().replace(/[^a-z0-9]/g, '');
                isActive = normSearch === normQuery || normSearch.includes(normQuery) || normQuery.includes(normSearch);
              }

              return (
                <Link
                  key={item.name || item.query || idx}
                  to={resolveSubItemPath(item)}
                  className={`flex flex-col items-center gap-2 shrink-0 group cursor-pointer opacity-100 ${
                    isActive ? 'font-bold' : ''
                  }`}
                >
                  <div className="h-16 w-20 flex items-center justify-center p-1 overflow-visible">
                    <img
                      src={resolveIconImage(item.image, item.name)}
                      alt={item.name}
                      onError={(e) => {
                        const lower = (item.name || '').toLowerCase();
                        if (lower.includes('care')) {
                          e.currentTarget.src = '/applecare_official_hero.png';
                        } else {
                          e.currentTarget.src = '/airpods_category_uploaded.png';
                        }
                      }}
                      className="max-h-full max-w-full object-contain filter drop-shadow-sm transition-all duration-300 ease-out group-hover:scale-112 group-hover:-translate-y-1"
                    />
                  </div>
                  <span className={`text-xs tracking-tight transition-colors duration-200 flex flex-col items-center gap-0.5 ${isActive ? 'font-bold text-zinc-950' : 'font-semibold text-zinc-700 group-hover:text-zinc-950'}`}>
                    <span>{item.name}</span>
                    {(item.isNew || item.name.toLowerCase() === 'airpods') && (
                      <span className="text-[10px] font-normal text-[#f56300] leading-none mt-0.5">New</span>
                    )}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* Conditionally Render AirPods AppleCare Grid OR Product Grid */}
      {(() => {
        const currentTab = searchParams.get('tab') || '';
        const currentSearch = searchParams.get('search') || '';
        const isAppleCareActive = currentTab.toLowerCase() === 'applecare' || currentSearch.toLowerCase().includes('care');

        if (isAppleCareActive) {
          return (
            <div className="max-w-7xl mx-auto my-6 animate-in fade-in duration-300">
              <div className="bg-white rounded-[24px] sm:rounded-[28px] border border-zinc-200/60 overflow-hidden shadow-xs p-6 sm:p-10 text-left">
                {/* Header section */}
                <div className="border-b border-zinc-100 pb-4 mb-4 text-center">
                  <div className="text-2xl sm:text-4xl md:text-5xl font-black text-[#FF2D55] tracking-tight py-1">
                    {dbHeaderTitle || 'AppleCare+'}
                  </div>
                </div>

                {/* Product Box Grid matching reference design */}
                {(() => {
                  const rows = dbAppleCareRows.length > 0 ? dbAppleCareRows : DEFAULT_AIRPODS_APPLECARE_ROWS;
                  return (
                    <>
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-6 items-stretch">
                        {rows.map((row, i) => {
                          const itemKey = row.model || row.title;
                          const isSelected = !!selectedAppleCareMap[itemKey];

                          return (
                            <div 
                              key={i} 
                              onClick={() => {
                                toggleAppleCareSelection(row);
                              }}
                              className={`group bg-white rounded-[24px] sm:rounded-[28px] border transition-all duration-300 relative text-left cursor-pointer p-5 sm:p-6 shadow-xs hover:shadow-md flex flex-col justify-between h-full ${
                                isSelected 
                                  ? 'border-2 border-black bg-zinc-50/20 ring-1 ring-black/10' 
                                  : 'border-zinc-200/80 hover:border-zinc-300'
                              }`}
                            >
                              {/* Top & Middle Content Container */}
                              <div className="flex-1 flex flex-col justify-between">
                                {/* Top Section: Media Left, Info Right */}
                                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
                                  
                                  {/* LEFT COLUMN: Media Container Box */}
                                  <div className="md:col-span-5 bg-white group-hover:bg-[#f0f0f2] transition-colors duration-300 rounded-2xl p-4 sm:p-5 relative flex flex-col items-center justify-between min-h-[260px] sm:min-h-[280px] h-full border border-zinc-100/80">
                                    
                                    {/* Top Left Badge */}
                                    <div className="w-full flex items-center justify-start z-10 mb-1">
                                      <span className="bg-[#FF2D55] text-white text-[11px] font-bold px-3 py-1 rounded-full tracking-wide">
                                        Apple Care+
                                      </span>
                                    </div>
                                    {/* Main Product Image */}
                                    <div className="w-full h-28 sm:h-32 flex items-center justify-center my-1 overflow-hidden">
                                      <img
                                        src={row.image || getModelImageByName(row.model)}
                                        alt={row.title || row.model}
                                        className="max-h-full max-w-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-500"
                                      />
                                    </div>

                                    {/* Carousel Dots */}
                                    <div className="flex items-center justify-center gap-1.5 my-1">
                                      <span className="w-2 h-2 rounded-full bg-black"></span>
                                      <span className="w-1.5 h-1.5 rounded-full bg-zinc-300"></span>
                                      <span className="w-1.5 h-1.5 rounded-full bg-zinc-300"></span>
                                      <span className="w-1.5 h-1.5 rounded-full bg-zinc-300"></span>
                                    </div>

                                    {/* Bottom Product Logo & Subtitle */}
                                    <div className="text-center min-h-[42px] flex flex-col justify-center items-center">
                                      <div className="flex items-center justify-center gap-1 font-extrabold text-[#1D1D1F] text-sm sm:text-base tracking-tight">
                                        <span></span>
                                        <span>{row.model || row.title}</span>
                                      </div>
                                      {row.sku ? (
                                        <p className="text-[11px] text-zinc-500 font-mono font-semibold mt-0.5">
                                          SKU: {row.sku}
                                        </p>
                                      ) : (
                                        <p className="text-[11px] text-transparent font-mono font-semibold mt-0.5 select-none">
                                          SKU: N/A
                                        </p>
                                      )}
                                    </div>
                                  </div>

                                  {/* RIGHT COLUMN: Info & Pricing Block */}
                                  <div className="md:col-span-7 space-y-3 flex flex-col justify-between h-full">
                                    <div>
                                      <div className="text-[10px] sm:text-[11px] font-bold tracking-widest uppercase text-[#FF2D55] mb-1">
                                        APPLE CARE+
                                      </div>
                                      <h3 className="font-extrabold text-[#1D1D1F] text-lg sm:text-xl leading-snug tracking-tight min-h-[52px] flex items-center">
                                        {row.title || `Apple Care+ ${row.model}`}
                                      </h3>
                                      <p className="text-xs text-zinc-500 font-medium mt-1 leading-relaxed min-h-[36px] flex items-center">
                                        {row.description || `Extended coverage for your ${row.model}. Peace of mind for what's next.`}
                                      </p>
                                    </div>

                                    {/* Pricing Details Block */}
                                    <div className="space-y-1.5 pt-2.5 border-t border-zinc-100">
                                      {/* MRP & Discount Pill Row */}
                                      <div className="flex items-center justify-between text-xs text-zinc-500">
                                        <span className="font-semibold text-zinc-500">MRP</span>
                                        <div className="flex items-center gap-2">
                                          {row.mrp && <span className="line-through text-zinc-400 font-medium">{row.mrp}</span>}
                                          {row.discount && (
                                            <span className="bg-[#FF2D55] text-white font-extrabold text-[10px] px-2 py-0.5 rounded-md shadow-2xs">
                                              {row.discount.includes('%') ? row.discount : `${row.discount} OFF`}
                                            </span>
                                          )}
                                        </div>
                                      </div>

                                      {/* Discount Row */}
                                      {row.discount ? (
                                        <div className="flex items-center justify-between text-xs">
                                          <span className="font-semibold text-zinc-500">Discount</span>
                                          <span className="font-bold text-[#FF2D55]">-{row.discount.replace(/OFF/i, '').trim()}</span>
                                        </div>
                                      ) : (
                                        <div className="h-4"></div>
                                      )}

                                      <div className="border-b border-zinc-100 my-1"></div>

                                      {/* Final Price Row */}
                                      <div className="flex items-baseline justify-between">
                                        <span className="font-extrabold text-[#1D1D1F] text-sm sm:text-base">Final Price</span>
                                        <div className="text-xl sm:text-2xl font-extrabold text-[#00875A] tabular-nums tracking-tight">
                                          {row.salePrice || row.yearly}
                                        </div>
                                      </div>

                                      <div className="flex items-center justify-end gap-1 text-[11px] text-zinc-400 font-medium">
                                        <span>GST Paid</span>
                                        <span className="text-xs">ⓘ</span>
                                      </div>
                                    </div>
                                  </div>
                                </div>

                                {/* MIDDLE SECTION: 4 Feature Highlights Grid */}
                                <AppleCareFeaturesGrid years="2" />
                              </div>

                              {/* BOTTOM ACTION BUTTONS */}
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 mt-auto">
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleAddAppleCareToWishlist(row, i);
                                  }}
                                  className={`w-full border font-bold py-3 px-4 rounded-xl text-xs transition-all shadow-2xs flex items-center justify-center gap-2 cursor-pointer ${
                                    localWishlist[`ac-airpods-${row.sku || i}`]
                                      ? 'bg-rose-50 border-rose-200 text-rose-600'
                                      : 'bg-[#1D1D1F] text-white border-zinc-900 hover:bg-zinc-800'
                                  }`}
                                >
                                  <Heart className={`w-4 h-4 ${localWishlist[`ac-airpods-${row.sku || i}`] ? 'fill-current text-rose-500' : 'text-white'}`} />
                                  <span>{localWishlist[`ac-airpods-${row.sku || i}`] ? 'Wishlisted' : 'Add to Wishlist'}</span>
                                </button>

                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleAddAppleCareToCart(row, i);
                                  }}
                                  className="w-full bg-black hover:bg-zinc-900 active:scale-[0.98] text-white font-bold py-3 px-4 rounded-xl text-xs transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                                >
                                  <ShoppingBag className="w-4 h-4 text-white" />
                                  <span>Add to Cart</span>
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      <div className="mt-6 pt-4 border-t border-zinc-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#6E6E73]">
                        <p>Prices include applicable taxes. Service fees may apply for repairs.</p>
                      </div>

                      {/* Floating Multi-Selection Action Bar */}
                      {Object.keys(selectedAppleCareMap).length > 0 && (
                        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-[#1D1D1F] text-white px-5 py-3.5 rounded-2xl shadow-2xl border border-zinc-700/80 flex items-center justify-between gap-6 max-w-xl w-[92%] animate-in slide-in-from-bottom-5 duration-300">
                          <div className="flex items-center gap-3">
                            <span className="bg-[#FF2D55] text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center shrink-0">
                              {Object.keys(selectedAppleCareMap).length}
                            </span>
                            <div>
                              <div className="text-xs font-bold text-white">
                                {Object.keys(selectedAppleCareMap).length} AirPods AppleCare Plans Selected
                              </div>
                              <div className="text-[11px] text-zinc-400 font-medium">
                                Total: ₹{Object.values(selectedAppleCareMap).reduce((acc, curr) => {
                                  const p = parseFloat((curr.salePrice || curr.yearly || '0').replace(/[^0-9.]/g, '')) || 0;
                                  return acc + p;
                                }, 0).toLocaleString('en-IN')}.00
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => setSelectedAppleCareMap({})}
                              className="text-xs text-zinc-400 hover:text-white px-3 py-2 rounded-xl transition-colors cursor-pointer"
                            >
                              Clear
                            </button>
                            <button
                              onClick={() => handleBuyMultipleAppleCareWhatsApp(selectedAppleCareMap)}
                              className="bg-[#0071E3] hover:bg-[#0077ED] text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-md flex items-center gap-2 transition-all cursor-pointer"
                            >
                              <span>Buy on WhatsApp</span>
                            </button>
                          </div>
                        </div>
                      )}
                    </>
                  );
                })()}
              </div>
            </div>
          );
        }

        return (
          <>
            {/* Controller Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-zinc-150 pb-6 mb-8 text-sm font-sans uppercase font-bold text-zinc-500 tracking-wider">
              <div className="text-zinc-800 text-xs tracking-widest">
                SHOWING ALL {filteredProducts.length} RESULTS
              </div>
            </div>

            {/* Filter Drawer */}
            {filterOpen && (
              <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 transition-all duration-300 flex justify-end">
                <div className="w-80 bg-white h-full p-8 shadow-2xl animate-in slide-in-from-right duration-350 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between border-b pb-4 mb-6">
                      <h3 className="font-bold text-lg tracking-tight">Filter Options</h3>
                      <button
                        onClick={() => setFilterOpen(false)}
                        className="p-1 rounded-full hover:bg-zinc-100 text-zinc-500 cursor-pointer"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    </div>

                    <div className="space-y-6">
                      <div className="space-y-3">
                        <h4 className="text-xs uppercase font-bold text-zinc-400 tracking-wider">Availability</h4>
                        <div className="flex flex-col gap-2">
                          <button
                            onClick={() => setActiveTab('all')}
                            className={`text-left text-sm py-1.5 px-3 rounded-lg ${activeTab === 'all' ? 'bg-zinc-100 font-semibold' : 'text-zinc-600 hover:bg-zinc-50'}`}
                          >
                            All Models
                          </button>
                          <button
                            onClick={() => setActiveTab('available')}
                            className={`text-left text-sm py-1.5 px-3 rounded-lg ${activeTab === 'available' ? 'bg-zinc-100 font-semibold' : 'text-zinc-600 hover:bg-zinc-50'}`}
                          >
                            In Stock
                          </button>
                          <button
                            onClick={() => setActiveTab('soldout')}
                            className={`text-left text-sm py-1.5 px-3 rounded-lg ${activeTab === 'soldout' ? 'bg-zinc-100 font-semibold' : 'text-zinc-600 hover:bg-zinc-50'}`}
                          >
                            Sold Out
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => setFilterOpen(false)}
                    className="w-full bg-[#0071e3] hover:bg-[#0077ed] text-white py-3 rounded-xl font-medium tracking-wide shadow-sm hover:shadow-md transition-all cursor-pointer text-center"
                  >
                    Apply Filters
                  </button>
                </div>
              </div>
            )}

            {/* Grid */}
            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {filteredProducts.slice(0, visibleCount).map((prod) => (
                <div
                  key={prod.id}
                  className="group bg-white rounded-2xl overflow-hidden flex flex-col justify-between p-6 shadow-sm border border-zinc-100/50 hover:shadow-md hover:border-zinc-200/55 transition-all duration-300 relative text-left"
                >
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
                      className={`p-2 rounded-full shadow-sm border border-zinc-100/80 bg-white/90 hover:scale-110 transition-all cursor-pointer ${
                        localWishlist[prod.id] ? 'text-red-500' : 'text-zinc-400 hover:text-zinc-600'
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
                      className="max-h-[92%] max-w-[92%] object-contain group-hover:scale-110 transition-transform duration-500 select-none transform scale-115 sm:scale-125"
                      containerClassName="w-full h-72 sm:h-80 bg-white rounded-2xl flex items-center justify-center p-2 overflow-hidden relative mb-5 transition-colors duration-300 group-hover:bg-[#f0f0f2]"
                    />

                    {/* Title */}
                    <h3 className="font-semibold text-[16px] leading-snug tracking-tight text-zinc-900 group-hover:text-zinc-900 transition-colors min-h-[48px]">
                      {(() => {
                        const cleanProductTitle = (rawTitle) => {
                          if (!rawTitle) return '';
                          return rawTitle.replace(/\s*[A-Z0-9]{5,9}\/[A-Z]$/i, '').trim();
                        };
                        return (
                          <span>{cleanProductTitle(prod.name || prod.title)}</span>
                        );
                      })()}
                    </h3>
                  </Link>

                  {/* Non-clickable configurations / actions */}
                  <div className="space-y-4 pt-2">
                    {/* Color Dot Options Row */}
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
                              className={`w-4 h-4 rounded-full cursor-pointer transition-all ${
                                isSelected ? 'scale-110 ring-2 ring-offset-2 ring-zinc-800 shadow-sm z-10' : 'border border-zinc-300 hover:scale-105'
                              }`}
                              title={color.name}
                            />
                          );
                        })}
                      </div>
                    </div>

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
          </>
        );
      })()}
    </div>
  );
}

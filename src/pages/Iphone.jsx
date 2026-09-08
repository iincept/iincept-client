import { useEffect, useState, useRef } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Heart, SlidersHorizontal, ArrowUpDown, X, ShoppingBag, ShieldCheck, Wrench, Headphones, Check } from 'lucide-react';
import { addToCart } from '../redux/cartSlice';
import { addToWishlist } from '../redux/wishlistSlice';
import { fetchProducts } from '../redux/productSlice';
import { matchesProductSearch } from '../utils/searchUtils';
import axiosClient from '../services/axiosClient';
import AppleCareFeaturesGrid from '../components/AppleCareFeaturesGrid';
import CleanProductImage from '../components/CleanProductImage';

// Fallback iPhone products in case DB returns 0 items
const DEFAULT_IPHONE_PRODUCTS = [
  {
    id: 'default-iphone-16-pro',
    name: 'iPhone 16 Pro',
    price: 119900,
    priceStr: '₹1,19,900',
    image: '/iphone_nav/iphone_16_pro.png',
    images: ['/iphone_nav/iphone_16_pro.png'],
    colors: [
      { name: 'Desert Titanium', value: '#e6c2b9' },
      { name: 'Natural Titanium', value: '#a39e99' },
      { name: 'Black Titanium', value: '#232426' },
      { name: 'White Titanium', value: '#f2f1ed' }
    ],
    rating: 5.0,
    isSoldOut: false
  },
  {
    id: 'default-iphone-16',
    name: 'iPhone 16',
    price: 79900,
    priceStr: '₹79,900',
    image: '/iphone_nav/iphone_16.png',
    images: ['/iphone_nav/iphone_16.png'],
    colors: [
      { name: 'Ultramarine', value: '#2a4b7c' },
      { name: 'Teal', value: '#1d3557' },
      { name: 'Pink', value: '#ec4899' },
      { name: 'White', value: '#ffffff' },
      { name: 'Black', value: '#111111' }
    ],
    rating: 4.9,
    isSoldOut: false
  },
  {
    id: 'default-iphone-15',
    name: 'iPhone 15',
    price: 69900,
    priceStr: '₹69,900',
    image: '/iphone_nav/iphone_15.png',
    images: ['/iphone_nav/iphone_15.png'],
    colors: [
      { name: 'Black', value: '#111111' },
      { name: 'Blue', value: '#bae6fd' },
      { name: 'Green', value: '#bbf7d0' },
      { name: 'Yellow', value: '#eab308' },
      { name: 'Pink', value: '#ec4899' }
    ],
    rating: 4.8,
    isSoldOut: false
  },
  {
    id: 'default-iphone-se',
    name: 'iPhone SE',
    price: 49900,
    priceStr: '₹49,900',
    image: '/iphone_nav/iphone_se.png',
    images: ['/iphone_nav/iphone_se.png'],
    colors: [
      { name: 'Midnight', value: '#1e293b' },
      { name: 'Starlight', value: '#f5f5f4' },
      { name: 'RED', value: '#e0115f' }
    ],
    rating: 4.7,
    isSoldOut: false
  }
];

// Default iPhone AppleCare rows fallback
const DEFAULT_IPHONE_APPLECARE_ROWS = [
  { 
    model: 'iPhone 15 / iPhone 16', 
    title: 'AppleCare+ for iPhone 15 / 16', 
    description: '2 Years Apple-certified coverage for iPhone 15 & 16 with accidental damage protection.', 
    description1yr: '1 Year Apple-certified coverage for iPhone 15 & 16 with accidental damage protection.', 
    sku: 'AC-IPHONE-15-16', 
    sku1yr: 'AC-IPHONE-15-16-1YR',
    mrp: '₹16,900.00', 
    mrp1yr: '₹9,800.00',
    discount: '12% OFF', 
    discount1yr: '15% OFF',
    salePrice: '₹14,900.00', 
    salePrice1yr: '₹8,330.00',
    monthly: '₹749.00', 
    yearly: '₹14,900.00', 
    image: '/iphone_nav/iphone_16.png', 
    isActive: true 
  },
  { 
    model: 'iPhone 16 Plus / 17', 
    title: 'AppleCare+ for iPhone 16 Plus / 17', 
    description: '2 Years Apple-certified coverage for iPhone 16 Plus & 17 with accidental damage protection.', 
    description1yr: '1 Year Apple-certified coverage for iPhone 16 Plus & 17 with accidental damage protection.', 
    sku: 'AC-IPHONE-16P-17', 
    sku1yr: 'AC-IPHONE-16P-17-1YR',
    mrp: '₹19,900.00', 
    mrp1yr: '₹11,500.00',
    discount: '10% OFF', 
    discount1yr: '13% OFF',
    salePrice: '₹17,900.00', 
    salePrice1yr: '₹9,990.00',
    monthly: '₹899.00', 
    yearly: '₹17,900.00', 
    image: '/iphone_nav/iphone_17.png', 
    isActive: true 
  },
  { 
    model: 'iPhone 16 Pro / 16 Pro Max', 
    title: 'AppleCare+ for iPhone 16 Pro / Pro Max', 
    description: '2 Years Apple-certified coverage for iPhone 16 Pro & Pro Max with accidental damage protection.', 
    description1yr: '1 Year Apple-certified coverage for iPhone 16 Pro & Pro Max with accidental damage protection.', 
    sku: 'AC-IPHONE-16PRO', 
    sku1yr: 'AC-IPHONE-16PRO-1YR',
    mrp: '₹22,900.00', 
    mrp1yr: '₹13,200.00',
    discount: '10% OFF', 
    discount1yr: '12% OFF',
    salePrice: '₹20,900.00', 
    salePrice1yr: '₹11,600.00',
    monthly: '₹1,049.00', 
    yearly: '₹20,900.00', 
    image: '/iphone_nav/iphone_16_pro.png', 
    isActive: true 
  },
  { 
    model: 'iPhone 17 Pro / 17 Pro Max', 
    title: 'AppleCare+ for iPhone 17 Pro / Pro Max', 
    description: '2 Years Apple-certified coverage for iPhone 17 Pro & Pro Max with accidental damage protection.', 
    description1yr: '1 Year Apple-certified coverage for iPhone 17 Pro & Pro Max with accidental damage protection.', 
    sku: 'AC-IPHONE-17PRO', 
    sku1yr: 'AC-IPHONE-17PRO-1YR',
    mrp: '₹23,900.00', 
    mrp1yr: '₹13,800.00',
    discount: '9% OFF', 
    discount1yr: '11% OFF',
    salePrice: '₹21,900.00', 
    salePrice1yr: '₹12,200.00',
    monthly: '₹1,099.00', 
    yearly: '₹21,900.00', 
    image: '/iphone_nav/iphone_17_pro.png', 
    isActive: true 
  },
  { 
    model: 'iPhone SE', 
    title: 'AppleCare+ for iPhone SE', 
    description: '2 Years Apple-certified coverage for iPhone SE with accidental damage protection.', 
    description1yr: '1 Year Apple-certified coverage for iPhone SE with accidental damage protection.', 
    sku: 'AC-IPHONE-SE', 
    sku1yr: 'AC-IPHONE-SE-1YR',
    mrp: '₹9,900.00', 
    mrp1yr: '₹5,800.00',
    discount: '10% OFF', 
    discount1yr: '14% OFF',
    salePrice: '₹8,900.00', 
    salePrice1yr: '₹4,990.00',
    monthly: '₹449.00', 
    yearly: '₹8,900.00', 
    image: '/iphone_nav/iphone_se.png', 
    isActive: true 
  }
];

const IPHONE_SUB_NAV_ITEMS = [
  { name: 'iPhone 17 Pro', query: 'iPhone 17 Pro', image: '/iphone_nav/iphone_17_pro.png', scale: 'scale-100' },
  { name: 'iPhone 17', query: 'iPhone 17', image: '/iphone_nav/iphone_17.png', scale: 'scale-100' },
  { name: 'iPhone 16 Pro', query: 'iPhone 16 Pro', image: '/iphone_nav/iphone_16_pro.png', scale: 'scale-100' },
  { name: 'iPhone 16', query: 'iPhone 16', image: '/iphone_nav/iphone_16.png', scale: 'scale-100' },
  { name: 'iPhone 15', query: 'iPhone 15', image: '/iphone_nav/iphone_15.png', scale: 'scale-100' },
  { name: 'iPhone SE', query: 'iPhone SE', image: '/iphone_nav/iphone_se.png', scale: 'scale-95' },
  { name: 'AppleCare+', path: '/iphone?tab=applecare', image: '/applecare_official_hero.png', scale: 'scale-100' },
  { name: 'Compare', path: '/compare', image: '/iphone_nav/iphone_compare.png', scale: 'scale-100' },
  { name: 'AirPods', path: '/airpods', image: '/iphone_nav/airpods.png', scale: 'scale-95' },
  { name: 'AirTag', query: 'AirTag', image: '/iphone_nav/airtag.png', scale: 'scale-90' }
];

const resolveSubItemPath = (item) => {
  const lowerName = (item.name || item.label || '').toLowerCase();
  if (lowerName.includes('care')) {
    return '/iphone?tab=applecare';
  }
  if (item.path && item.path !== '/iphone') return item.path;
  if (item.query) {
    return `/iphone?search=${encodeURIComponent(item.query)}`;
  }
  return '/iphone';
};

const ensureAppleCareInSubItems = (items = []) => {
  if (!items || items.length === 0) return IPHONE_SUB_NAV_ITEMS;

  let careItem = items.find(item => (item.name || item.label || '').toLowerCase().includes('care'));
  if (!careItem) {
    careItem = {
      name: 'AppleCare+',
      path: '/iphone?tab=applecare',
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
    if (!clean.startsWith('http://') && !clean.startsWith('https://') && !clean.startsWith('data:') && !clean.startsWith('blob:') && !clean.startsWith('/')) {
      clean = '/' + clean;
    }
    return clean;
  }
  const lblLower = (label || '').toLowerCase().trim();
  if (lblLower.includes('care')) return '/applecare_official_hero.png';
  const matched = IPHONE_SUB_NAV_ITEMS.find(m => m.name.toLowerCase().trim() === lblLower);
  return matched?.image || '/iphone_nav/iphone_17.png';
};

const getModelImageByName = (modelName = '') => {
  const m = modelName.toLowerCase();
  if (m.includes('17 pro') || m.includes('16 pro') || m.includes('pro')) return '/iphone_nav/iphone_17_pro.png';
  if (m.includes('17')) return '/iphone_nav/iphone_17.png';
  if (m.includes('16')) return '/iphone_nav/iphone_16.png';
  if (m.includes('se')) return '/iphone_nav/iphone_se.png';
  return '/iphone_nav/iphone_16.png';
};

export default function Iphone() {
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const { products } = useSelector((state) => state.products);
  const [viewCols, setViewCols] = useState(4);
  const [showLimit, setShowLimit] = useState(16);
  const [sortBy, setSortBy] = useState('latest');
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedColors, setSelectedColors] = useState({});
  const [activeTab, setActiveTab] = useState('all');
  const [subItems, setSubItems] = useState(() => getInitialSubItems('iphone', IPHONE_SUB_NAV_ITEMS));
  const [localWishlist, setLocalWishlist] = useState({});
  const [visibleCount, setVisibleCount] = useState(6);
  const isLoadingMore = useRef(false);

  // iPhone AppleCare Dynamic Data with LocalStorage Caching
  const [dbAppleCareRows, setDbAppleCareRows] = useState(() => {
    try {
      const cached = localStorage.getItem('iincept_iphone_applecare_rows_v2');
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    return DEFAULT_IPHONE_APPLECARE_ROWS;
  });
  const [selectedAppleCareModel, setSelectedAppleCareModel] = useState(() => dbAppleCareRows[0] || DEFAULT_IPHONE_APPLECARE_ROWS[0]);
  const [selectedAppleCareMap, setSelectedAppleCareMap] = useState({});
  const [dbHeaderTitle, setDbHeaderTitle] = useState(() => {
    try {
      return localStorage.getItem('iincept_iphone_applecare_title_v2') || 'AppleCare+';
    } catch (e) { return 'AppleCare+'; }
  });
  const [dbDurationLabel, setDbDurationLabel] = useState(() => {
    try {
      return localStorage.getItem('iincept_iphone_applecare_duration_v2') || '2 Years';
    } catch (e) { return '2 Years'; }
  });
  const [appleCareDuration, setAppleCareDuration] = useState('2');

  useEffect(() => {
    dispatch(fetchProducts());
    fetchNavSettings();
  }, [dispatch]);

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
        // Load iPhone AppleCare Pricing Table
        if (response.data.appleCarePricingTables && response.data.appleCarePricingTables.length > 0) {
          const iphoneTable = response.data.appleCarePricingTables.find(t => t.categoryKey === 'iphone');
          if (iphoneTable) {
            const hTitle = iphoneTable.headerTitle || 'AppleCare+';
            const dLabel = iphoneTable.durationLabel || '2 Years';
            setDbHeaderTitle(hTitle);
            setDbDurationLabel(dLabel);
            try {
              localStorage.setItem('iincept_iphone_applecare_title_v2', hTitle);
              localStorage.setItem('iincept_iphone_applecare_duration_v2', dLabel);
            } catch (e) {}

            if (iphoneTable.rows && iphoneTable.rows.length > 0) {
              const activeRows = iphoneTable.rows.filter(r => r.isActive !== false);
              if (activeRows.length > 0) {
                try {
                  localStorage.setItem('iincept_iphone_applecare_rows_v2', JSON.stringify(activeRows));
                } catch (e) {}
                setDbAppleCareRows(prev => (JSON.stringify(prev) !== JSON.stringify(activeRows) ? activeRows : prev));
                setSelectedAppleCareModel(activeRows[0]);
              }
            }
          }
        }

        // Sub Nav items
        if (response.data.categoryIconGroups && response.data.categoryIconGroups.length > 0) {
          const iphoneGrp = response.data.categoryIconGroups.find(g => g.categoryKey === 'iphone');
          if (iphoneGrp && iphoneGrp.icons && iphoneGrp.icons.length > 0) {
            const activeSub = iphoneGrp.icons.filter(d => d.isActive !== false);
            if (activeSub.length > 0) {
              const mapped = activeSub.map(d => {
                const fallback = IPHONE_SUB_NAV_ITEMS.find(m => m.name.toLowerCase() === (d.label || '').toLowerCase());
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
                localStorage.setItem('iincept_sub_items_v2_iphone', JSON.stringify(withCare));
              } catch (e) {}
              setSubItems(prev => (JSON.stringify(prev) !== JSON.stringify(withCare) ? withCare : prev));
              return;
            }
          }
        }
        if (response.data.navbarMenuItems) {
          const iphoneItem = response.data.navbarMenuItems.find(i => (i.name || '').toLowerCase().includes('iphone'));
          if (iphoneItem && iphoneItem.dropdownItems && iphoneItem.dropdownItems.length > 0) {
            const activeSub = iphoneItem.dropdownItems.filter(d => d.isActive !== false);
            if (activeSub.length > 0) {
              const mapped = activeSub.map(d => {
                const fallback = IPHONE_SUB_NAV_ITEMS.find(m => m.name.toLowerCase() === (d.label || '').toLowerCase());
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
                localStorage.setItem('iincept_sub_items_v2_iphone', JSON.stringify(withCare));
              } catch (e) {}
              setSubItems(prev => (JSON.stringify(prev) !== JSON.stringify(withCare) ? withCare : prev));
            }
          }
        }
      }
    } catch (err) {
      console.error('Failed to load iphone sub nav settings:', err);
    }
  };

  const handleBuyAppleCareWhatsApp = (modelObj = {}) => {
    const modelName = modelObj.title || modelObj.model || 'iPhone';
    const salePrice = modelObj.salePrice || modelObj.yearly || '₹14,900.00';
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
    const numericPrice = parseFloat(priceStr.replace(/[^0-9.]/g, '')) || 14900;
    const image = rowObj.image || getModelImageByName(rowObj.model);
    const itemId = `ac-iphone-${sku || i}`;

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
    const numericPrice = parseFloat(priceStr.replace(/[^0-9.]/g, '')) || 14900;
    const image = rowObj.image || getModelImageByName(rowObj.model);
    const itemId = `ac-iphone-${sku || i}`;

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
    const selectedColorName = selectedColors[prod.id];
    if (selectedColorName) {
      const targetNorm = selectedColorName.replace(/\s+/g, ' ').trim().toLowerCase();

      const foundColor = prod.colors.find((c) => {
        const cNorm = (c.name || c.rawName || c).replace(/\s+/g, ' ').trim().toLowerCase();
        return cNorm === targetNorm;
      });
      if (foundColor && foundColor.image) {
        return foundColor.image;
      }

      if (prod.variants && Array.isArray(prod.variants)) {
        const foundVariant = prod.variants.find(v => {
          if (!v.color) return false;
          return v.color.replace(/\s+/g, ' ').trim().toLowerCase() === targetNorm;
        });
        if (foundVariant && foundVariant.images && foundVariant.images[0]) {
          return foundVariant.images[0];
        }
      }

      const colorIdx = prod.colors.findIndex((c) => {
        const cNorm = (c.name || c.rawName || c).replace(/\s+/g, ' ').trim().toLowerCase();
        return cNorm === targetNorm;
      });
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

  // Broadened category matching to catch any iPhone product in MongoDB
  const dbIphones = products.filter(p => {
    const catName = p.category?.name || p.category?.toString() || '';
    const catSlug = p.category?.slug || '';
    const pTitle = (p.title || p.name || '').toLowerCase();
    const pDesc = (p.description || '').toLowerCase();

    return (
      catName.toLowerCase() === 'iphones' ||
      catName.toLowerCase() === 'iphone' ||
      catSlug.toLowerCase() === 'iphones' ||
      catSlug.toLowerCase() === 'iphone' ||
      catSlug.toLowerCase() === 'smartphones' ||
      catName.toLowerCase().includes('iphone') ||
      catName.toLowerCase().includes('phone') ||
      catName.toLowerCase().includes('mobile') ||
      pTitle.includes('iphone') ||
      pTitle.includes('apple phone')
    );
  }).map(p => {
    const firstImg = p.image || (p.images && p.images[0]);
    const isValidImg = firstImg && !firstImg.includes('mock-cloud');
    return {
      id: p._id || p.id,
      name: p.title || p.name,
      price: p.price,
      priceStr: `₹${p.price.toLocaleString('en-IN')}`,
      image: isValidImg ? firstImg : '/iphone_category_v2.jpg',
      images: p.images || [],
      variants: p.variants || [],
      colors: Array.isArray(p.colors) ? p.colors.map(c => {
        const rawName = typeof c === 'string' ? c : (c.name || '');
        const normName = rawName.replace(/\s+/g, ' ').trim();
        const val = typeof c === 'string' ? c : (c.value || c.name || '');

        let variantImage = typeof c === 'object' && c.image ? c.image : null;
        if (!variantImage && p.variants && Array.isArray(p.variants)) {
          const matchedVariant = p.variants.find(v => {
            if (!v.color) return false;
            const vColor = v.color.replace(/\s+/g, ' ').trim().toLowerCase();
            return vColor === normName.toLowerCase();
          });
          if (matchedVariant && matchedVariant.images && matchedVariant.images[0]) {
            variantImage = matchedVariant.images[0];
          }
        }

        return {
          name: normName,
          rawName: rawName,
          value: resolveColorValue(val),
          image: variantImage
        };
      }) : [],
      rating: p.rating || 5.0,
      isSoldOut: p.stock <= 0
    };
  });

  // Use DB iPhones if found, otherwise use fallback realistic iPhone data
  const combinedProducts = dbIphones.length > 0 ? dbIphones : DEFAULT_IPHONE_PRODUCTS;

  const getIphoneSequenceRank = (productName) => {
    const name = (productName || '').toLowerCase();
    if (name.includes('17 pro max') || name.includes('17 pro')) return 1;
    if (name.includes('17')) return 2;
    if (name.includes('16 pro max') || name.includes('16 pro')) return 3;
    if (name.includes('16 plus')) return 4;
    if (name.includes('16')) return 5;
    if (name.includes('15')) return 6;
    if (name.includes('se')) return 7;
    return 8;
  };

  const sortedProducts = [...combinedProducts].sort((a, b) => {
    if (sortBy === 'price-asc') return a.price - b.price;
    if (sortBy === 'price-desc') return b.price - a.price;
    if (sortBy === 'rating') return b.rating - a.rating;

    const rankA = getIphoneSequenceRank(a.name || a.title);
    const rankB = getIphoneSequenceRank(b.name || b.title);
    if (rankA !== rankB) return rankA - rankB;

    return 0;
  });

  const searchQuery = searchParams.get('search') || '';

  let filteredProducts = sortedProducts.filter((prod) => {
    if (searchQuery && !matchesProductSearch(prod, searchQuery)) {
      return false;
    }

    if (activeTab === 'available') return !prod.isSoldOut;
    if (activeTab === 'soldout') return prod.isSoldOut;
    return true;
  });

  // Fallback: If search query produced 0 items, show all sorted products so page never stays empty
  const isSearchEmptyFallback = searchQuery && filteredProducts.length === 0;
  if (isSearchEmptyFallback) {
    filteredProducts = sortedProducts.filter((prod) => {
      if (activeTab === 'available') return !prod.isSoldOut;
      if (activeTab === 'soldout') return prod.isSoldOut;
      return true;
    });
  }

  return (
    <div className="min-h-screen bg-[#fcfcfc] text-[#1d1d1f] py-8 px-4 sm:px-8 md:px-12 lg:px-16 select-none animate-in fade-in duration-300 relative">

      {/* Title & Category Sub-Nav Header */}
      <div className="w-full bg-[#fcfcfc] pt-2 pb-4 select-none font-sans mb-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-5xl sm:text-6xl font-extrabold tracking-tight text-zinc-950 text-left mb-6">
            iPhone
          </h1>

          {/* Horizontal iPhone Model Selector Row */}
          <div className="flex items-end gap-7 sm:gap-9 md:gap-11 lg:gap-12 overflow-x-auto no-scrollbar py-3 px-1">
            {subItems.map((item, idx) => {
              const currentTab = searchParams.get('tab') || '';
              const currentSearch = searchParams.get('search') || '';
              const isAppleCareItem = (item.name || item.label || '').toLowerCase().includes('care');
              const isAppleCareActive = currentTab.toLowerCase() === 'applecare' || currentSearch.toLowerCase().includes('care');
              const isActive = isAppleCareActive
                ? isAppleCareItem
                : (currentSearch && currentSearch.toLowerCase() === (item.query || '').toLowerCase());

              return (
                <Link
                  key={item.name || item.query || idx}
                  to={resolveSubItemPath(item)}
                  className={`flex flex-col items-center gap-2 shrink-0 group cursor-pointer transition-transform transition-opacity duration-200 ${
                    isActive ? 'scale-105 opacity-100 font-bold' : 'hover:scale-105 opacity-75 hover:opacity-100'
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
                          e.currentTarget.src = '/iphone_nav/iphone_17.png';
                        }
                      }}
                      className={`max-h-full max-w-full object-contain filter drop-shadow-sm transition-transform duration-300 group-hover:scale-110 ${item.scale || 'scale-100'}`}
                    />
                  </div>
                  <span className={`text-xs tracking-tight text-zinc-950 transition-colors ${isActive ? 'font-bold text-zinc-950' : 'font-semibold'}`}>
                    {item.name}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* Conditionally Render iPhone AppleCare Grid OR Product Grid */}
      {(() => {
        const currentTab = searchParams.get('tab') || '';
        const currentSearch = searchParams.get('search') || '';
        const isAppleCareActive = currentTab.toLowerCase() === 'applecare' || currentSearch.toLowerCase().includes('care');

        if (isAppleCareActive) {
          return (
            <div className="max-w-7xl mx-auto my-6 animate-in fade-in duration-300">
              <div className="bg-white rounded-[24px] sm:rounded-[28px] border border-zinc-200/60 overflow-hidden shadow-xs p-6 sm:p-10 text-left">
                {/* Header section */}
                <div className="border-b border-zinc-100 pb-5 mb-6">
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="text-center sm:text-left">
                      <div className="text-2xl sm:text-4xl md:text-5xl font-black text-[#FF2D55] tracking-tight py-1">
                        {dbHeaderTitle || 'AppleCare+'}
                      </div>
                      <p className="text-xs sm:text-sm text-zinc-500 font-medium mt-1">
                        Official Apple-certified protection for your iPhone
                      </p>
                    </div>

                    {/* Plan Duration Selector Pills (1 Year vs 2 Years) */}
                    <div className="bg-zinc-100/90 p-1.5 rounded-2xl flex items-center gap-1 border border-zinc-200/80 shadow-2xs">
                      <button
                        type="button"
                        onClick={() => setAppleCareDuration('1')}
                        className={`px-5 py-2 rounded-xl text-xs sm:text-sm font-extrabold transition-all cursor-pointer border-0 ${
                          appleCareDuration === '1'
                            ? 'bg-[#FF2D55] text-white shadow-xs'
                            : 'text-zinc-600 hover:text-zinc-900 bg-transparent'
                        }`}
                      >
                        1 Year Coverage
                      </button>
                      <button
                        type="button"
                        onClick={() => setAppleCareDuration('2')}
                        className={`px-5 py-2 rounded-xl text-xs sm:text-sm font-extrabold transition-all cursor-pointer border-0 ${
                          appleCareDuration === '2'
                            ? 'bg-[#FF2D55] text-white shadow-xs'
                            : 'text-zinc-600 hover:text-zinc-900 bg-transparent'
                        }`}
                      >
                        2 Years Coverage
                      </button>
                    </div>
                  </div>
                </div>

                {/* Product Box Grid matching reference design */}
                {(() => {
                  const rows = dbAppleCareRows.length > 0 ? dbAppleCareRows : DEFAULT_IPHONE_APPLECARE_ROWS;
                  const is1Yr = appleCareDuration === '1';

                  return (
                    <>
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-6 items-stretch">
                        {rows.map((row, i) => {
                          const itemKey = row.model || row.title;
                          const isSelected = !!selectedAppleCareMap[itemKey];

                          const activeMrp = is1Yr
                            ? (row.mrp1yr || (row.mrp ? '₹' + Math.round(parseInt(row.mrp.replace(/[^\d]/g, '') || '16000') * 0.58).toLocaleString('en-IN') + '.00' : ''))
                            : (row.mrp2yr || row.mrp);

                          const activeSalePrice = is1Yr
                            ? (row.salePrice1yr || (row.salePrice || row.yearly ? '₹' + Math.round(parseInt((row.salePrice || row.yearly).replace(/[^\d]/g, '') || '14000') * 0.58).toLocaleString('en-IN') + '.00' : ''))
                            : (row.salePrice2yr || row.salePrice || row.yearly);

                          const activeDiscount = is1Yr
                            ? (row.discount1yr || row.discount || '15% OFF')
                            : (row.discount2yr || row.discount);

                          const activeSku = is1Yr
                            ? (row.sku1yr || (row.sku ? `${row.sku}-1YR` : ''))
                            : (row.sku2yr || row.sku);

                          const activeDescription = is1Yr
                            ? (row.description1yr || (row.description ? row.description.replace(/2 Years/gi, '1 Year') : '1 Year Apple-certified coverage.'))
                            : (row.description2yr || row.description);

                          return (
                            <div 
                              key={i} 
                              onClick={() => {
                                toggleAppleCareSelection({ ...row, salePrice: activeSalePrice, mrp: activeMrp, sku: activeSku, duration: is1Yr ? '1 Year' : '2 Years' });
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
                                  <div className="md:col-span-5 bg-[#F7F7F9] rounded-2xl p-4 sm:p-5 relative flex flex-col items-center justify-between min-h-[260px] sm:min-h-[280px] h-full border border-zinc-100/80">
                                    
                                    {/* Top Left Badge */}
                                    <div className="w-full flex items-center justify-start z-10 mb-1">
                                      <span className="bg-[#FF2D55] text-white text-[11px] font-bold px-3 py-1 rounded-full tracking-wide">
                                        Apple Care+ ({is1Yr ? '1 Year' : '2 Years'})
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
                                      {activeSku ? (
                                        <p className="text-[11px] text-zinc-500 font-mono font-semibold mt-0.5">
                                          SKU: {activeSku}
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
                                        APPLE CARE+ • {is1Yr ? '1 YEAR PLAN' : '2 YEAR PLAN'}
                                      </div>
                                      <h3 className="font-extrabold text-[#1D1D1F] text-lg sm:text-xl leading-snug tracking-tight min-h-[52px] flex items-center">
                                        {row.title || `Apple Care+ ${row.model}`}
                                      </h3>
                                      <p className="text-xs text-zinc-500 font-medium mt-1 leading-relaxed min-h-[36px] flex items-center">
                                        {activeDescription || `Extended coverage for your ${row.model}. Peace of mind for what's next.`}
                                      </p>
                                    </div>

                                    {/* Pricing Details Block */}
                                    <div className="space-y-1.5 pt-2.5 border-t border-zinc-100">
                                      {/* MRP & Discount Pill Row */}
                                      <div className="flex items-center justify-between text-xs text-zinc-500">
                                        <span className="font-semibold text-zinc-500">MRP</span>
                                        <div className="flex items-center gap-2">
                                          {activeMrp && <span className="line-through text-zinc-400 font-medium">{activeMrp}</span>}
                                          {activeDiscount && (
                                            <span className="bg-[#FF2D55] text-white font-extrabold text-[10px] px-2 py-0.5 rounded-md shadow-2xs">
                                              {activeDiscount.includes('%') ? activeDiscount : `${activeDiscount} OFF`}
                                            </span>
                                          )}
                                        </div>
                                      </div>

                                      {/* Discount Row */}
                                      {activeDiscount ? (
                                        <div className="flex items-center justify-between text-xs">
                                          <span className="font-semibold text-zinc-500">Discount</span>
                                          <span className="font-bold text-[#FF2D55]">-{activeDiscount.replace(/OFF/i, '').trim()}</span>
                                        </div>
                                      ) : (
                                        <div className="h-4"></div>
                                      )}

                                      <div className="border-b border-zinc-100 my-1"></div>

                                      {/* Final Price Row */}
                                      <div className="flex items-baseline justify-between">
                                        <span className="font-extrabold text-[#1D1D1F] text-sm sm:text-base">Final Price</span>
                                        <div className="text-xl sm:text-2xl font-extrabold text-[#00875A] tabular-nums tracking-tight">
                                          {activeSalePrice}
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
                                <AppleCareFeaturesGrid years={is1Yr ? '1' : '2'} />
                              </div>

                              {/* BOTTOM ACTION BUTTONS */}
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 mt-auto">
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleAddAppleCareToWishlist({ ...row, salePrice: activeSalePrice, sku: activeSku }, i);
                                  }}
                                  className={`w-full border font-bold py-3 px-4 rounded-xl text-xs transition-all shadow-2xs flex items-center justify-center gap-2 cursor-pointer ${
                                    localWishlist[`ac-iphone-${activeSku || i}`]
                                      ? 'bg-rose-50 border-rose-200 text-rose-600'
                                      : 'bg-[#1D1D1F] text-white border-zinc-900 hover:bg-zinc-800'
                                  }`}
                                >
                                  <Heart className={`w-4 h-4 ${localWishlist[`ac-iphone-${activeSku || i}`] ? 'fill-current text-rose-500' : 'text-white'}`} />
                                  <span>{localWishlist[`ac-iphone-${activeSku || i}`] ? 'Wishlisted' : 'Add to Wishlist'}</span>
                                </button>

                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleAddAppleCareToCart({ ...row, salePrice: activeSalePrice, sku: activeSku }, i);
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
                                {Object.keys(selectedAppleCareMap).length} iPhone AppleCare Plans Selected
                              </div>
                              <div className="text-[11px] text-zinc-400 font-medium">
                                Total: ₹{Object.values(selectedAppleCareMap).reduce((acc, curr) => {
                                  const p = parseFloat((curr.salePrice || curr.yearly || '0').replace(/[^0-9.]/g, '')) || 0;
                                  return acc + p;
                                }, 0).toLocaleString('en-IN')}.00
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2.5">
                            <button
                              type="button"
                              onClick={() => setSelectedAppleCareMap({})}
                              className="text-xs text-zinc-400 hover:text-white px-2 py-1 font-semibold cursor-pointer"
                            >
                              Clear
                            </button>
                            <button
                              type="button"
                              onClick={() => handleBuyMultipleAppleCareWhatsApp(selectedAppleCareMap)}
                              className="bg-[#0071E3] hover:bg-[#0077ED] active:scale-95 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
                            >
                              <ShoppingBag className="w-4 h-4" />
                              <span>Buy {Object.keys(selectedAppleCareMap).length} Plans</span>
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
            {/* Top Filter and View Controller Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-zinc-150 pb-6 mb-8 text-sm font-sans uppercase font-bold text-zinc-500 tracking-wider">
              <div className="text-zinc-800 text-xs tracking-widest flex items-center gap-2">
                <span>SHOWING ALL {filteredProducts.length} RESULTS</span>
                {isSearchEmptyFallback && (
                  <span className="text-amber-600 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 text-[10px]">
                    Showing all models for "{searchQuery}"
                  </span>
                )}
              </div>

              {searchQuery && (
                <button
                  onClick={() => setSearchParams({})}
                  className="text-xs font-semibold text-[#0071e3] hover:underline cursor-pointer flex items-center gap-1"
                >
                  <X className="w-3.5 h-3.5" />
                  Clear Search Filter ("{searchQuery}")
                </button>
              )}
            </div>

            {/* Slide-out Filter Drawer */}
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

            {/* Grid of iPhone models */}
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

                    {/* Title (Clean Product Name) */}
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
                    {/* Color Dot Options */}
                    <div className="flex items-center justify-between gap-1.5 border-t border-zinc-100/60 pt-3">
                      <span className="text-[10px] text-zinc-400 uppercase tracking-widest font-bold">Colors</span>
                      <div className="flex items-center gap-1.5 shrink-0">
                        {prod.colors.map((color) => {
                          const isSelected = selectedColors[prod.id] === color.name || (!selectedColors[prod.id] && prod.colors[0]?.name === color.name);
                          return (
                            <button
                              key={color.name}
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                handleColorChange(prod.id, color.name);
                              }}
                              style={{ backgroundColor: color.value }}
                              className={`w-3.5 h-3.5 rounded-full cursor-pointer transition-all border ${isSelected ? 'scale-125 border-zinc-800 ring-1 ring-zinc-400' : 'border-zinc-300 hover:scale-110'
                                }`}
                              title={color.name}
                            />
                          );
                        })}
                      </div>
                    </div>

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

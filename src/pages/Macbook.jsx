import { useEffect, useState, useRef } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Heart, SlidersHorizontal, ArrowUpDown, X, ShoppingBag, Check, ShieldCheck, Wrench, Headphones } from 'lucide-react';
import { addToCart } from '../redux/cartSlice';
import { addToWishlist } from '../redux/wishlistSlice';
import { fetchProducts } from '../redux/productSlice';
import { matchesProductSearch } from '../utils/searchUtils';
import axiosClient from '../services/axiosClient';
import AppleCareFeaturesGrid from '../components/AppleCareFeaturesGrid';
import CleanProductImage from '../components/CleanProductImage';

const MAC_SUB_NAV_ITEMS = [
  { name: 'MacBook Neo', query: 'MacBook Neo', image: '/mac_nav/macbook_neo.png', scale: 'scale-100' },
  { name: 'MacBook Air', query: 'MacBook Air', image: '/mac_nav/macbook_air.png', scale: 'scale-100' },
  { name: 'MacBook Pro', query: 'MacBook Pro', image: '/mac_nav/macbook_pro.png', scale: 'scale-100' },
  { name: 'iMac', query: 'iMac', image: '/imac_studio_lifestyle.jpg', scale: 'scale-95' },
  { name: 'Mac mini', query: 'Mac mini', image: 'https://www.apple.com/assets-www/en_WW/mac/04_chapternav/small/nav_mac_mini_f628f615d_2x.png', scale: 'scale-100' },
  { name: 'Mac Studio', query: 'Mac Studio', image: '/mac_nav/mac_studio.png', scale: 'scale-105' },
  { name: 'Compare', path: '/compare?category=mac', image: '/mac_nav/mac_compare.png', scale: 'scale-100' },
  { name: 'Displays', query: 'Studio Display', image: '/mac_nav/mac_displays.png', scale: 'scale-95' },
  { name: 'AppleCare+', path: '/macbook?tab=applecare', image: '/applecare_official_hero.png', scale: 'scale-100' }
];

const ensureAppleCareInSubItems = (items = []) => {
  if (!items || items.length === 0) return MAC_SUB_NAV_ITEMS;

  let careItem = items.find(item => (item.name || item.label || '').toLowerCase().includes('care'));
  if (!careItem) {
    careItem = {
      name: 'AppleCare+',
      path: '/macbook?tab=applecare',
      image: '/applecare_official_hero.png',
      scale: 'scale-100'
    };
  }

  let compareItem = items.find(item => (item.name || item.label || '').toLowerCase().includes('compare'));
  let displaysItem = items.find(item => (item.name || item.label || '').toLowerCase().includes('display'));

  const regularItems = items.filter(item => {
    const lbl = (item.name || item.label || '').toLowerCase();
    return !lbl.includes('care') && !lbl.includes('compare') && !lbl.includes('display');
  });

  const result = [...regularItems];
  if (compareItem) result.push(compareItem);
  if (displaysItem) result.push(displaysItem);
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
  } catch (e) {
    // Ignore storage errors
  }
  return ensureAppleCareInSubItems(defaultItems);
};

const MAC_APPLECARE_ROWS = [
  { model: 'Mac mini', monthly: '₹429.00', yearly: '₹12,900.00', image: 'https://www.apple.com/assets-www/en_WW/mac/04_chapternav/small/nav_mac_mini_f628f615d_2x.png' },
  { model: 'Mac Studio', monthly: '₹679.00', yearly: '₹19,900.00', image: '/mac_nav/mac_studio.png' },
  { model: 'iMac', monthly: '₹679.00', yearly: '₹19,900.00', image: '/mac_nav/imac.png' },
  { model: 'Macbook Neo', monthly: '₹579.00', yearly: '₹16,900.00', image: '/mac_nav/macbook_neo.png' },
  { model: 'MacBook Air 13″', monthly: '₹779.00', yearly: '₹22,900.00', image: '/mac_nav/macbook_air.png' },
  { model: 'MacBook Air 15″', monthly: '₹849.00', yearly: '₹24,900.00', image: '/mac_nav/macbook_air.png' },
  { model: 'MacBook Pro 14″', monthly: '₹999.00', yearly: '₹29,900.00', image: '/mac_nav/macbook_pro.png' },
  { model: 'MacBook Pro 16″', monthly: '₹1,379.00', yearly: '₹40,900.00', image: '/mac_nav/macbook_pro.png' },
  { model: 'Mac Pro', monthly: '₹1,699.00', yearly: '₹49,900.00', image: '/mac_nav/mac_studio.png' }
];

const resolveIconImage = (img, label) => {
  // If image was set/uploaded in Admin panel, use the admin image directly
  if (img && typeof img === 'string' && img.trim() && img.trim() !== '/mac_nav/mac_mini.png') {
    let clean = img.trim();
    if (!clean.startsWith('http://') && !clean.startsWith('https://') && !clean.startsWith('data:') && !clean.startsWith('blob:') && !clean.startsWith('/')) {
      clean = '/' + clean;
    }
    return clean;
  }

  // Fallback to default crisp sub nav icons if no image is set in Admin panel
  const lblLower = (label || '').toLowerCase().trim();
  if (lblLower.includes('care')) return '/applecare_official_hero.png';
  if (lblLower === 'imac' || lblLower.includes('imac')) return '/mac_nav/imac.png';
  if (lblLower.includes('neo')) return '/mac_nav/macbook_neo.png';
  if (lblLower.includes('studio')) return '/mac_nav/mac_studio.png';
  if (lblLower.includes('mini')) return 'https://www.apple.com/assets-www/en_WW/mac/04_chapternav/small/nav_mac_mini_f628f615d_2x.png';
  if (lblLower.includes('compare')) return '/mac_nav/mac_compare.png';
  if (lblLower.includes('display')) return '/mac_nav/mac_displays.png';
  if (lblLower.includes('air')) return '/mac_nav/macbook_air.png';
  if (lblLower.includes('pro')) return '/mac_nav/macbook_pro.png';

  const matched = MAC_SUB_NAV_ITEMS.find(m => {
    const mLower = m.name.toLowerCase().trim();
    return mLower === lblLower || lblLower.includes(mLower) || mLower.includes(lblLower);
  });
  if (matched?.image) return matched.image;
  return '/mac_nav/macbook_air.png';
};

const resolveSubItemPath = (item) => {
  const nameLower = (item?.name || item?.label || '').toLowerCase();
  const queryLower = (item?.query || '').toLowerCase();
  const pathLower = (item?.path || '').toLowerCase();

  if (nameLower.includes('care') || queryLower.includes('care') || pathLower.includes('care')) {
    return '/macbook?tab=applecare';
  }
  if (nameLower.includes('compare') || queryLower.includes('compare') || pathLower.includes('compare')) {
    return '/compare?category=mac';
  }
  if (item?.path && item.path !== '/macbook' && item.path.trim() && !item.path.includes('search=AppleCare')) {
    return item.path;
  }
  if (item?.query && item.query.trim()) {
    return `/macbook?search=${encodeURIComponent(item.query.trim())}`;
  }
  return '/macbook';
};

const getModelImageByName = (modelName) => {
  if (!modelName) return '/mac_nav/macbook_air.png';
  const name = modelName.toLowerCase();
  if (name.includes('mini')) return 'https://www.apple.com/assets-www/en_WW/mac/04_chapternav/small/nav_mac_mini_f628f615d_2x.png';
  if (name.includes('studio')) return '/mac_nav/mac_studio.png';
  if (name.includes('imac')) return '/mac_nav/imac.png';
  if (name.includes('neo')) return '/mac_nav/macbook_neo.png';
  if (name.includes('air')) return '/mac_nav/macbook_air.png';
  if (name.includes('pro')) return '/mac_nav/macbook_pro.png';
  return '/mac_nav/mac_studio.png';
};

export default function Macbook() {
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const { products } = useSelector((state) => state.products);
  const [viewCols, setViewCols] = useState(4); // 2, 3, or 4 columns
  const [showLimit, setShowLimit] = useState(16); // 16, 32, 64
  const [sortBy, setSortBy] = useState('latest');
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedColors, setSelectedColors] = useState({});
  const [activeTab, setActiveTab] = useState('all');
  const [subItems, setSubItems] = useState(() => getInitialSubItems('mac', MAC_SUB_NAV_ITEMS));
  const [dbAppleCareRows, setDbAppleCareRows] = useState(MAC_APPLECARE_ROWS);
  const [selectedAppleCareModel, setSelectedAppleCareModel] = useState(null);
  const [selectedAppleCareMap, setSelectedAppleCareMap] = useState({});
  const [dbHeaderTitle, setDbHeaderTitle] = useState('');
  const [dbDurationLabel, setDbDurationLabel] = useState('');
  const [visibleCount, setVisibleCount] = useState(6);
  const isLoadingMore = useRef(false);

  // Local state for wishlisted items
  const [localWishlist, setLocalWishlist] = useState({});

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
        if (response.data.appleCarePricingTables && response.data.appleCarePricingTables.length > 0) {
          const macTbl = response.data.appleCarePricingTables.find(t => t.categoryKey === 'mac');
          if (macTbl) {
            setDbHeaderTitle(macTbl.headerTitle || '');
            setDbDurationLabel(macTbl.durationLabel || '');
            if (macTbl.rows && macTbl.rows.length > 0) {
              const activeRows = macTbl.rows.filter(r => r.isActive !== false);
              if (activeRows.length > 0) {
                const mapped = activeRows.map(r => ({
                  model: r.model || r.title || '',
                  title: r.title || r.model || '',
                  description: r.description || '',
                  sku: r.sku || '',
                  mrp: r.mrp || '',
                  discount: r.discount || '',
                  salePrice: r.salePrice || r.yearly || '',
                  monthly: r.monthly || '',
                  yearly: r.yearly || r.salePrice || '',
                  image: r.image || getModelImageByName(r.model),
                  isActive: r.isActive !== false
                }));
                setDbAppleCareRows(prev => (JSON.stringify(prev) !== JSON.stringify(mapped) ? mapped : prev));
              }
            }
          }
        }
        if (response.data.categoryIconGroups && response.data.categoryIconGroups.length > 0) {
          const macGrp = response.data.categoryIconGroups.find(g => g.categoryKey === 'mac');
          if (macGrp && macGrp.icons && macGrp.icons.length > 0) {
            const activeSub = macGrp.icons.filter(d => d.isActive !== false && !(d.label || '').toLowerCase().startsWith('explore'));
            if (activeSub.length > 0) {
              const mapped = activeSub.map(d => {
                const fallback = MAC_SUB_NAV_ITEMS.find(m => m.name.toLowerCase() === (d.label || '').toLowerCase());
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
                localStorage.setItem('iincept_sub_items_v2_mac', JSON.stringify(withCare));
              } catch (e) {}
              setSubItems(prev => (JSON.stringify(prev) !== JSON.stringify(withCare) ? withCare : prev));
              return;
            }
          }
        }
        if (response.data.navbarMenuItems) {
          const macItem = response.data.navbarMenuItems.find(i => (i.name || '').toLowerCase().includes('mac'));
          if (macItem && macItem.dropdownItems && macItem.dropdownItems.length > 0) {
            const activeSub = macItem.dropdownItems.filter(d => d.isActive !== false && !(d.label || '').toLowerCase().startsWith('explore'));
            if (activeSub.length > 0) {
              const mapped = activeSub.map(d => {
                const fallback = MAC_SUB_NAV_ITEMS.find(m => m.name.toLowerCase() === (d.label || '').toLowerCase());
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
                localStorage.setItem('iincept_sub_items_v2_mac', JSON.stringify(withCare));
              } catch (e) {}
              setSubItems(prev => (JSON.stringify(prev) !== JSON.stringify(withCare) ? withCare : prev));
            }
          }
        }
      }
    } catch (err) {
      console.error('Failed to load mac sub nav settings:', err);
    }
  };

  const handleBuyAppleCareWhatsApp = (modelObj = {}) => {
    const modelName = modelObj.title || modelObj.model || 'MacBook';
    const salePrice = modelObj.salePrice || modelObj.yearly || '₹12,900.00';
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
    const numericPrice = parseFloat(priceStr.replace(/[^0-9.]/g, '')) || 12900;
    const image = rowObj.image || getModelImageByName(rowObj.model);
    const itemId = `ac-${sku || i}`;

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
    const numericPrice = parseFloat(priceStr.replace(/[^0-9.]/g, '')) || 12900;
    const image = rowObj.image || getModelImageByName(rowObj.model);
    const itemId = `ac-${sku || i}`;

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

      // 1. Match in prod.colors by name or rawName
      const foundColor = prod.colors?.find((c) => {
        const cNorm = (c.name || c.rawName || c).replace(/\s+/g, ' ').trim().toLowerCase();
        return cNorm === targetNorm;
      });
      if (foundColor) {
        const colImg = Array.isArray(foundColor.images) && foundColor.images.length > 0 ? foundColor.images[0] : (foundColor.image || foundColor.url);
        if (colImg) return colImg;
      }

      // 2. Match in prod.variants directly!
      if (prod.variants && Array.isArray(prod.variants)) {
        const foundVariant = prod.variants.find(v => {
          if (!v.color) return false;
          return v.color.replace(/\s+/g, ' ').trim().toLowerCase() === targetNorm;
        });
        if (foundVariant && foundVariant.images && foundVariant.images[0]) {
          return foundVariant.images[0];
        }
      }

      // 3. Match index of color in prod.colors with index in prod.images
      if (prod.colors && Array.isArray(prod.colors)) {
        const colorIdx = prod.colors.findIndex((c) => {
          const cNorm = (c.name || c.rawName || c).replace(/\s+/g, ' ').trim().toLowerCase();
          return cNorm === targetNorm;
        });
        if (colorIdx !== -1 && prod.images && prod.images[colorIdx]) {
          return prod.images[colorIdx];
        }
      }
    }

    const firstImg = prod.image || (prod.images && prod.images[0]);
    if (firstImg && !firstImg.includes('mock-cloud') && !firstImg.includes('macbook_category_v3')) {
      return firstImg;
    }

    // High-resolution clean PNG fallback matching model title
    const title = (prod.name || prod.title || '').toLowerCase();
    if (title.includes('neo')) return '/mac_nav/macbook_neo.png';
    if (title.includes('air')) return '/mac_nav/macbook_air.png';
    if (title.includes('pro')) return '/macbook_user_pro.png';
    if (title.includes('imac')) return '/imac_studio_lifestyle.jpg';
    if (title.includes('mini')) return '/mac_nav/mac_mini.png';
    if (title.includes('studio') && !title.includes('display')) return '/mac_nav/mac_studio.png';
    if (title.includes('display')) return '/mac_nav/mac_displays.png';

    return '/mac_nav/macbook_air.png';
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

  // Resolve color values to hex code
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
      "pink": "#f4a2b2",
      "black": "#111111",
      "orange": "#f4aa7a",
      "orenge": "#f4aa7a",
      "cosmic orange": "#d9a07a",
      "blue": "#6ea3d9",
      "red": "#e0115f",
      "midnight": "#1e293b",
      "light blue": "#bfdbfe",
      "sky blue": "#bae6fd",
      "lavender": "#c5b8e8",
      "green": "#78c59b",
      "dark gray": "#3f3f46",
      "natural titanium": "#a39e99",
      "natural": "#a39e99",
      "black titanium": "#232426",
      "white titanium": "#f2f1ed",
      "deep purple": "#3b224c",
      "purple": "#a98ed4",
      "yellow": "#f0d17b",
      // iMac M4 specific color names
      "imac blue": "#6ea3d9",
      "imac green": "#78c59b",
      "imac pink": "#f4a2b2",
      "imac purple": "#a98ed4",
      "imac yellow": "#f0d17b",
      "imac orange": "#f4aa7a",
      "imac silver": "#e0e0e2"
    };
    const lowerVal = cValStr.toLowerCase().replace(/\s+/g, ' ').trim();
    return COLOR_MAP[lowerVal] || '#cbd5e1';
  };

  // Merge database products with fallback mock data
  const dbMacbooks = products.filter(p => {
    const catName = p.category?.name || p.category?.toString() || '';
    const catSlug = p.category?.slug || '';
    return catName.toLowerCase() === 'laptops & pcs' ||
      catSlug.toLowerCase() === 'laptops-pcs' ||
      catName.toLowerCase().includes('macbook') ||
      catName.toLowerCase().includes('mac');
  }).map(p => {
    const firstImg = p.image || (p.images && p.images[0]);
    const isValidImg = firstImg && !firstImg.includes('mock-cloud');
    const varPrices = (p.variants && Array.isArray(p.variants)) ? p.variants.map(v => v.price).filter(pr => typeof pr === 'number' && pr > 0) : [];
    const effectivePrice = varPrices.length > 0 ? Math.min(...varPrices) : (p.price || 0);

    return {
      id: p._id || p.id,
      name: p.title || p.name,
      price: effectivePrice,
      priceStr: `₹${effectivePrice.toLocaleString('en-IN')}`,
      image: isValidImg ? firstImg : '/macbook_category_v3.jpg',
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

  const combinedProducts = dbMacbooks;

  const getMacSequenceRank = (productName) => {
    const name = (productName || '').toLowerCase();

    let sizeNum = 99; // Default if no size found

    if (name.includes('13-inch') || name.includes('13 inch') || name.includes('13"') || name.includes('13.3')) {
      sizeNum = 13;
    } else if (name.includes('14-inch') || name.includes('14 inch') || name.includes('14"') || name.includes('14.2')) {
      sizeNum = 14;
    } else if (name.includes('15-inch') || name.includes('15 inch') || name.includes('15"') || name.includes('15.3')) {
      sizeNum = 15;
    } else if (name.includes('16-inch') || name.includes('16 inch') || name.includes('16"') || name.includes('16.2')) {
      sizeNum = 16;
    } else if (name.includes('24-inch') || name.includes('24 inch') || name.includes('24"')) {
      sizeNum = 24;
    } else if (name.includes('27-inch') || name.includes('27 inch') || name.includes('27"')) {
      sizeNum = 27;
    } else if (name.includes('32-inch') || name.includes('32 inch') || name.includes('32"')) {
      sizeNum = 32;
    } else {
      const match = name.match(/(\d{2})\s*(?:-|\s)?(?:inch|in|\")/);
      if (match) {
        sizeNum = parseInt(match[1], 10);
      }
    }

    let subWeight = 5;
    if (name.includes('neo')) subWeight = 1;
    else if (name.includes('air')) subWeight = 2;
    else if (name.includes('pro')) subWeight = 3;

    return sizeNum * 10 + subWeight;
  };

  // Sorting logic
  const sortedProducts = [...combinedProducts].sort((a, b) => {
    if (sortBy === 'price-asc') return a.price - b.price;
    if (sortBy === 'price-desc') return b.price - a.price;
    if (sortBy === 'rating') return b.rating - a.rating;

    // Default sequence: 13-inch -> 14-inch -> 15-inch -> 16-inch -> others
    const rankA = getMacSequenceRank(a.name || a.title);
    const rankB = getMacSequenceRank(b.name || b.title);
    if (rankA !== rankB) return rankA - rankB;

    return 0;
  });

  // Tab filtering logic (e.g. Filter Drawer Options) + Search Parameter filter
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
            Mac
          </h1>

          {/* Horizontal Apple Model Selector Row */}
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
                          e.currentTarget.src = '/mac_nav/macbook_air.png';
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

      {/* Conditionally Render AppleCare Table (Image 1) OR Product Grid */}
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

                {/* Product Box Grid with sleek black theme & light border lines */}
                {(() => {
                  const rows = dbAppleCareRows.length > 0 ? dbAppleCareRows : MAC_APPLECARE_ROWS;
                  const activeModel = selectedAppleCareModel || rows[0];
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
                                  <div className="md:col-span-5 bg-[#F7F7F9] rounded-2xl p-4 sm:p-5 relative flex flex-col items-center justify-between min-h-[260px] sm:min-h-[280px] h-full border border-zinc-100/80">
                                    
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
                                <AppleCareFeaturesGrid years="3" />
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
                                    localWishlist[`ac-${row.sku || i}`]
                                      ? 'bg-rose-50 border-rose-200 text-rose-600'
                                      : 'bg-white hover:bg-zinc-50 text-[#1D1D1F] border-zinc-300'
                                  }`}
                                >
                                  <Heart className={`w-4 h-4 ${localWishlist[`ac-${row.sku || i}`] ? 'fill-current text-rose-500' : 'text-zinc-600'}`} />
                                  <span>{localWishlist[`ac-${row.sku || i}`] ? 'Wishlisted' : 'Add to Wishlist'}</span>
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
                                {Object.keys(selectedAppleCareMap).length} AppleCare Plans Selected
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
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-4 mb-6 text-sm font-sans uppercase font-bold text-zinc-500 tracking-wider">
        <div className="text-zinc-800 text-xs tracking-widest">
          SHOWING ALL {filteredProducts.length} RESULTS
        </div>
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
                {/* Availability */}
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

      {/* Grid of MacBook models */}
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {filteredProducts.slice(0, visibleCount).map((prod) => (
          <div
            key={prod.id}
            className="group bg-white rounded-2xl overflow-hidden flex flex-col justify-between p-6 shadow-sm border border-zinc-100/50 hover:shadow-md hover:border-zinc-200/55 transition-all duration-300 relative text-left"
          >
            {/* Top Row: Sold Out Badges & Favorite Heart */}
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
              {/* Color Dot Options Row */}
              <div className="flex items-center justify-between gap-1.5 border-t border-zinc-100/60 pt-3">
                <span className="text-[10px] text-zinc-400 uppercase tracking-widest font-bold">Colors</span>
                <div className="flex items-center gap-1.5 shrink-0">
                  {prod.colors.map((color) => {
                    const isSelected = selectedColors[prod.id] === color.name || (!selectedColors[prod.id] && prod.colors[0]?.name === color.name);
                    // iMac two-tone split circle: top-left = main color, bottom-right = lighter shade
                    const isImac = prod.name && prod.name.toLowerCase().includes('imac');
                    const lighterShade = color.value ? color.value + 'bb' : '#e0e0e2';
                    const swatchStyle = isImac
                      ? { background: `linear-gradient(135deg, ${color.value} 50%, ${color.value}88 50%)`, border: 'none' }
                      : { backgroundColor: color.value };
                    return (
                      <button
                        key={color.name}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleColorChange(prod.id, color.name);
                        }}
                        style={swatchStyle}
                        className={`w-4 h-4 rounded-full cursor-pointer transition-all ${
                          isSelected
                            ? 'scale-125 ring-2 ring-offset-1 ring-zinc-500 shadow-md'
                            : 'border border-zinc-200 hover:scale-110 hover:shadow-sm'
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

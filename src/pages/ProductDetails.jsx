import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ShieldAlert, Star } from 'lucide-react';
import { fetchProductById, fetchProducts, setCurrentProduct } from '../redux/productSlice';
import { addToCart } from '../redux/cartSlice';
import Loader from '../components/Loader';
import axiosClient from '../services/axiosClient';
import { subscribeToLiveSync } from '../services/liveSyncService';

// Fallback definitions removed in favor of real database records

export default function ProductDetails() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { currentProduct, loading, products } = useSelector((state) => state.products);
  const { isAuthenticated } = useSelector((state) => state.auth);

  const [activeImage, setActiveImage] = useState('');
  const [processedImage, setProcessedImage] = useState('');
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 });
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedStorage, setSelectedStorage] = useState('');



  const handleGalleryMouseMove = (e) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = Math.max(0, Math.min(100, ((e.clientX - left) / width) * 100));
    const y = Math.max(0, Math.min(100, ((e.clientY - top) / height) * 100));
    setZoomPos({ x, y });
  };

  const handleGalleryMouseEnter = () => {
    setIsZoomed(true);
  };

  const handleGalleryMouseLeave = () => {
    setIsZoomed(false);
    setZoomPos({ x: 50, y: 50 });
  };
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedRam, setSelectedRam] = useState('');
  const [selectedGlass, setSelectedGlass] = useState('');
  const [selectedConnectivity, setSelectedConnectivity] = useState('');
  const [selectedAppleCare, setSelectedAppleCare] = useState(false);
  const [activeTab, setActiveTab] = useState('specs');

  const [reviews, setReviews] = useState([]);
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  // Pincode states
  const [pincode, setPincode] = useState('');
  const [pincodeStatus, setPincodeStatus] = useState(null);
  const [pincodeMessage, setPincodeMessage] = useState('');

  // Product AppleCare state
  const [productAppleCare, setProductAppleCare] = useState(null);

  useEffect(() => {
    fetchReviews();
    fetchAppleCareSettings();
  }, [id]);

  const fetchAppleCareSettings = async () => {
    try {
      const response = await axiosClient.get('/settings');
      if (response.data?.productAppleCare) {
        setProductAppleCare(response.data.productAppleCare);
      }
    } catch (err) {
      console.error('Failed to load Product AppleCare settings:', err);
    }
  };

  const fetchReviews = async () => {
    try {
      const response = await axiosClient.get(`/reviews/${id}`);
      setReviews(response.data || []);
    } catch (err) {
      console.error('Failed to load reviews:', err);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!newRating) return alert('Please select a star rating');

    setSubmittingReview(true);
    try {
      await axiosClient.post('/reviews', {
        product: id,
        rating: newRating,
        comment: newComment
      });
      setNewComment('');
      setNewRating(5);
      fetchReviews(); // reload list
      alert('Review submitted successfully!');
    } catch (err) {
      alert(err.response?.data?.message || err.message || 'Failed to submit review');
    } finally {
      setSubmittingReview(false);
    }
  };


  useEffect(() => {
    if (id) {
      if (currentProduct && (currentProduct._id !== id && currentProduct.id !== id && currentProduct.slug !== id)) {
        dispatch(setCurrentProduct(null));
      }
      setActiveImage('');
      setProcessedImage('');
      setSelectedColor(null);

      if (id.match(/^[0-9a-fA-F]{24}$/)) {
        dispatch(fetchProductById(id));
      } else {
        dispatch(fetchProducts());
      }
    }
    const unsubscribe = subscribeToLiveSync(() => {
      dispatch(fetchProducts());
      if (id && id.match(/^[0-9a-fA-F]{24}$/)) {
        dispatch(fetchProductById(id));
      }
    });
    return () => unsubscribe();
  }, [id, dispatch]);

  useEffect(() => {
    if (!products || products.length === 0) {
      dispatch(fetchProducts());
    }
  }, [dispatch, products]);

  // Pincode calculation helper
  const checkPincodeDelivery = () => {
    if (!/^\d{6}$/.test(pincode)) {
      setPincodeStatus('error');
      setPincodeMessage('Please enter a valid 6-digit Indian pincode.');
      return;
    }
    const metroPrefixes = ['11', '40', '56', '60', '70'];
    const prefix = pincode.substring(0, 2);
    if (metroPrefixes.includes(prefix)) {
      setPincodeStatus('metro');
      const deliveryDate = new Date();
      deliveryDate.setDate(deliveryDate.getDate() + 2);
      const formattedDate = deliveryDate.toLocaleDateString('en-IN', { weekday: 'long', month: 'short', day: 'numeric' });
      setPincodeMessage(`Express Delivery Available! Estimated delivery by ${formattedDate} (Free Shipping).`);
    } else {
      setPincodeStatus('standard');
      const deliveryDate = new Date();
      deliveryDate.setDate(deliveryDate.getDate() + 5);
      const formattedDate = deliveryDate.toLocaleDateString('en-IN', { weekday: 'long', month: 'short', day: 'numeric' });
      setPincodeMessage(`Standard Shipping Available. Estimated delivery by ${formattedDate} (Free Shipping).`);
    }
  };

  const FALLBACK_PRODUCTS_MAP = {
    'default-iphone-15': {
      id: 'default-iphone-15',
      _id: 'default-iphone-15',
      title: 'iPhone 15',
      name: 'iPhone 15',
      price: 69900,
      priceStr: '₹69,900',
      category: 'iphone',
      image: '/iphone_nav/iphone_15.png',
      images: ['/iphone_nav/iphone_15.png', '/iphone16_group.jpg'],
      description: 'Dynamic Island, 48MP Main camera, and USB-C. All in a durable color-infused glass and aluminum design.',
      colors: [
        { name: 'Black', value: '#111111', image: '/iphone_nav/iphone_15.png' },
        { name: 'Blue', value: '#bae6fd', image: '/iphone_nav/iphone_15.png' },
        { name: 'Green', value: '#bbf7d0', image: '/iphone_nav/iphone_15.png' },
        { name: 'Yellow', value: '#eab308', image: '/iphone_nav/iphone_15.png' },
        { name: 'Pink', value: '#ec4899', image: '/iphone_nav/iphone_15.png' }
      ],
      storage: ['128GB', '256GB', '512GB'],
      variants: [
        { storage: '128GB', price: 69900 },
        { storage: '256GB', price: 79900 },
        { storage: '512GB', price: 99900 }
      ],
      rating: 4.8
    },
    'default-iphone-se': {
      id: 'default-iphone-se',
      _id: 'default-iphone-se',
      title: 'iPhone SE',
      name: 'iPhone SE',
      price: 49900,
      priceStr: '₹49,900',
      category: 'iphone',
      image: '/iphone_nav/iphone_se.png',
      images: ['/iphone_nav/iphone_se.png', '/iphone17e_group.jpg'],
      description: 'Serious power in a compact design. Lightning-fast A15 Bionic chip and great battery life.',
      colors: [
        { name: 'Midnight', value: '#1e293b', image: '/iphone_nav/iphone_se.png' },
        { name: 'Starlight', value: '#f5f5f4', image: '/iphone_nav/iphone_se.png' },
        { name: 'RED', value: '#e0115f', image: '/iphone_nav/iphone_se.png' }
      ],
      storage: ['64GB', '128GB', '256GB'],
      variants: [
        { storage: '64GB', price: 49900 },
        { storage: '128GB', price: 54900 },
        { storage: '256GB', price: 64900 }
      ],
      rating: 4.7
    },
    'default-iphone-air': {
      id: 'default-iphone-air',
      _id: 'default-iphone-air',
      title: 'iPhone Air',
      name: 'iPhone Air',
      price: 119900,
      priceStr: '₹1,19,900',
      category: 'iphone',
      image: '/iphone_nav/dropdown_iphone_air.png',
      images: ['/iphone_nav/dropdown_iphone_air.png', '/iphone_air_group.jpg'],
      description: 'Impossibly thin. Unbelievably powerful. Built for Apple Intelligence.',
      colors: [
        { name: 'Silver', value: '#e5e6e8', image: '/iphone_nav/dropdown_iphone_air.png' },
        { name: 'Space Gray', value: '#4b4c4e', image: '/iphone_nav/dropdown_iphone_air.png' }
      ],
      storage: ['256GB', '512GB', '1TB'],
      variants: [
        { storage: '256GB', price: 119900 },
        { storage: '512GB', price: 139900 },
        { storage: '1TB', price: 179900 }
      ],
      rating: 4.9
    },
    'default-iphone-17': {
      id: 'default-iphone-17',
      _id: 'default-iphone-17',
      title: 'iPhone 17',
      name: 'iPhone 17',
      price: 79900,
      priceStr: '₹79,900',
      category: 'iphone',
      image: '/iphone_nav/iphone_17.png',
      images: ['/iphone_nav/iphone_17.png', '/iphone17_group.jpg'],
      description: 'Next-generation performance with A19 chip and ProMotion display.',
      colors: [
        { name: 'Lavender', value: '#d8b4fe', image: '/iphone_nav/iphone_17.png' },
        { name: 'Sage Green', value: '#a7f3d0', image: '/iphone_nav/iphone_17.png' },
        { name: 'Starlight', value: '#fafaf9', image: '/iphone_nav/iphone_17.png' }
      ],
      storage: ['128GB', '256GB', '512GB'],
      variants: [
        { storage: '128GB', price: 79900 },
        { storage: '256GB', price: 89900 },
        { storage: '512GB', price: 109900 }
      ],
      rating: 4.9
    },
    'default-iphone-17e': {
      id: 'default-iphone-17e',
      _id: 'default-iphone-17e',
      title: 'iPhone 17e',
      name: 'iPhone 17e',
      price: 59900,
      priceStr: '₹59,900',
      category: 'iphone',
      image: '/iphone_nav/dropdown_iphone_17e.png',
      images: ['/iphone_nav/dropdown_iphone_17e.png', '/iphone17e_group.jpg'],
      description: 'Essential Apple performance at a groundbreaking value.',
      colors: [
        { name: 'Soft Pink', value: '#fbcfe8', image: '/iphone_nav/dropdown_iphone_17e.png' },
        { name: 'White', value: '#ffffff', image: '/iphone_nav/dropdown_iphone_17e.png' },
        { name: 'Midnight', value: '#1e293b', image: '/iphone_nav/dropdown_iphone_17e.png' }
      ],
      storage: ['128GB', '256GB'],
      variants: [
        { storage: '128GB', price: 59900 },
        { storage: '256GB', price: 69900 }
      ],
      rating: 4.8
    },
    'default-iphone-17-pro': {
      id: 'default-iphone-17-pro',
      _id: 'default-iphone-17-pro',
      title: 'iPhone 17 Pro',
      name: 'iPhone 17 Pro',
      price: 134900,
      priceStr: '₹1,34,900',
      category: 'iphone',
      image: '/iphone_nav/iphone_17_pro.png',
      images: ['/iphone_nav/iphone_17_pro.png', '/iphone17p_white.jpg'],
      description: 'Forged in titanium. Powered by A19 Pro chip with breakthrough camera capabilities.',
      colors: [
        { name: 'Cosmic Orange', value: '#e07a5f', image: '/iphone_nav/iphone_17_pro.png' },
        { name: 'White Titanium', value: '#f4f4f6', image: '/iphone17p_white.jpg' },
        { name: 'Black Titanium', value: '#323335', image: '/iphone_nav/iphone_17_pro.png' }
      ],
      storage: ['128GB', '256GB', '512GB', '1TB'],
      variants: [
        { storage: '128GB', price: 134900 },
        { storage: '256GB', price: 144900 },
        { storage: '512GB', price: 164900 },
        { storage: '1TB', price: 184900 }
      ],
      rating: 5.0
    },
    'default-iphone-16-pro': {
      id: 'default-iphone-16-pro',
      _id: 'default-iphone-16-pro',
      title: 'iPhone 16 Pro',
      name: 'iPhone 16 Pro',
      price: 119900,
      priceStr: '₹1,19,900',
      category: 'iphone',
      image: '/iphone_nav/iphone_16_pro.png',
      images: ['/iphone_nav/iphone_16_pro.png'],
      description: 'Titanium design with A18 Pro chip and 48MP Fusion camera.',
      colors: [
        { name: 'Desert Titanium', value: '#e6c2b9', image: '/iphone_nav/iphone_16_pro.png' },
        { name: 'Natural Titanium', value: '#a39e99', image: '/iphone_nav/iphone_16_pro.png' },
        { name: 'Black Titanium', value: '#232426', image: '/iphone_nav/iphone_16_pro.png' },
        { name: 'White Titanium', value: '#f2f1ed', image: '/iphone_nav/iphone_16_pro.png' }
      ],
      storage: ['128GB', '256GB', '512GB', '1TB'],
      variants: [
        { storage: '128GB', price: 119900 },
        { storage: '256GB', price: 129900 },
        { storage: '512GB', price: 149900 },
        { storage: '1TB', price: 169900 }
      ],
      rating: 5.0
    },
    'default-iphone-16': {
      id: 'default-iphone-16',
      _id: 'default-iphone-16',
      title: 'iPhone 16',
      name: 'iPhone 16',
      price: 79900,
      priceStr: '₹79,900',
      category: 'iphone',
      image: '/iphone_nav/iphone_16.png',
      images: ['/iphone_nav/iphone_16.png', '/iphone16_group.jpg'],
      description: 'Camera Control, 48MP Fusion camera, A18 chip, and Vibrant colors.',
      colors: [
        { name: 'Ultramarine', value: '#2a4b7c', image: '/iphone_nav/iphone_16.png' },
        { name: 'Teal', value: '#1d3557', image: '/iphone_nav/iphone_16.png' },
        { name: 'Pink', value: '#ec4899', image: '/iphone_nav/iphone_16.png' },
        { name: 'White', value: '#ffffff', image: '/iphone_nav/iphone_16.png' },
        { name: 'Black', value: '#111111', image: '/iphone_nav/iphone_16.png' }
      ],
      storage: ['128GB', '256GB', '512GB'],
      variants: [
        { storage: '128GB', price: 79900 },
        { storage: '256GB', price: 89900 },
        { storage: '512GB', price: 109900 }
      ],
      rating: 4.9
    },
    'default-iphone-18-pro': {
      id: 'default-iphone-18-pro',
      _id: 'default-iphone-18-pro',
      title: 'iPhone 18 Pro',
      name: 'iPhone 18 Pro',
      price: 164900,
      priceStr: '₹1,64,900',
      category: 'iphone',
      image: '/iphone_nav/iphone_18_pro.jpg',
      images: ['/iphone_nav/iphone_18_pro.jpg'],
      description: 'The pinnacle of mobile engineering and Apple Intelligence.',
      colors: [
        { name: 'Burgundy', value: '#4a1525', image: '/iphone_nav/iphone_18_pro.jpg' },
        { name: 'Glacier', value: '#e4effb', image: '/iphone_nav/iphone_18_pro.jpg' },
        { name: 'Silver', value: '#e5e6e8', image: '/iphone_nav/iphone_18_pro.jpg' }
      ],
      storage: ['256GB', '512GB', '1TB', '2TB'],
      variants: [
        { storage: '256GB', price: 164900 },
        { storage: '512GB', price: 189000 },
        { storage: '1TB', price: 239900 },
        { storage: '2TB', price: 314900 }
      ],
      rating: 5.0
    },
    'default-iphone-duo': {
      id: 'default-iphone-duo',
      _id: 'default-iphone-duo',
      title: 'iPhone Duo',
      name: 'iPhone Duo',
      price: 299900,
      priceStr: '₹2,99,900',
      category: 'iphone',
      image: '/iphone_nav/dropdown_iphone_duo.png',
      images: ['/iphone_nav/dropdown_iphone_duo.png'],
      description: 'Revolutionary dual display iPhone experience.',
      colors: [
        { name: 'Star White', value: '#fafafa', image: '/iphone_nav/dropdown_iphone_duo.png' },
        { name: 'Night Sky', value: '#353e4a', image: '/iphone_nav/dropdown_iphone_duo.png' }
      ],
      storage: ['512GB', '1TB'],
      variants: [
        { storage: '512GB', price: 299900 },
        { storage: '1TB', price: 349900 }
      ],
      rating: 5.0
    },
    'iphone-duo': {
      id: 'default-iphone-duo',
      _id: 'default-iphone-duo',
      title: 'iPhone Duo',
      name: 'iPhone Duo',
      price: 299900,
      priceStr: '₹2,99,900',
      category: 'iphone',
      image: '/iphone_nav/dropdown_iphone_duo.png',
      images: ['/iphone_nav/dropdown_iphone_duo.png'],
      description: 'Revolutionary dual display iPhone experience.',
      colors: [
        { name: 'Star White', value: '#fafafa', image: '/iphone_nav/dropdown_iphone_duo.png' },
        { name: 'Night Sky', value: '#353e4a', image: '/iphone_nav/dropdown_iphone_duo.png' }
      ],
      storage: ['512GB', '1TB'],
      variants: [
        { storage: '512GB', price: 299900 },
        { storage: '1TB', price: 349900 }
      ],
      rating: 5.0
    },
    'iphone_duo': {
      id: 'default-iphone-duo',
      _id: 'default-iphone-duo',
      title: 'iPhone Duo',
      name: 'iPhone Duo',
      price: 299900,
      priceStr: '₹2,99,900',
      category: 'iphone',
      image: '/iphone_nav/dropdown_iphone_duo.png',
      images: ['/iphone_nav/dropdown_iphone_duo.png'],
      description: 'Revolutionary dual display iPhone experience.',
      colors: [
        { name: 'Star White', value: '#fafafa', image: '/iphone_nav/dropdown_iphone_duo.png' },
        { name: 'Night Sky', value: '#353e4a', image: '/iphone_nav/dropdown_iphone_duo.png' }
      ],
      storage: ['512GB', '1TB'],
      variants: [
        { storage: '512GB', price: 299900 },
        { storage: '1TB', price: 349900 }
      ],
      rating: 5.0
    }
  };

  // Synchronously reset image and selection state when route param `id` changes
  const [prevId, setPrevId] = useState(id);
  if (id !== prevId) {
    setPrevId(id);
    setActiveImage('');
    setProcessedImage('');
    setSelectedColor(null);
  }

  const getProductFromStore = (prodId) => {
    if (!prodId) return null;

    if (products && products.length > 0) {
      // 1. Direct _id, id, or slug match in products array
      const directMatch = products.find(p => (p._id === prodId || p.id === prodId || p.slug === prodId));
      if (directMatch) return directMatch;

      // Do not match aliases for 24-char MongoDB ObjectIds
      if (prodId.match(/^[0-9a-fA-F]{24}$/)) {
        return null;
      }

      // 2. Title substring match against real database products
      const mockIdMap = {
        'iphone-18-pro': 'iPhone 18 Pro',
        'default-iphone-18-pro': 'iPhone 18 Pro',
        'iphone-duo': 'iPhone Duo',
        'default-iphone-duo': 'iPhone Duo',
        'ip17pm': 'iPhone 17 Pro Max',
        'ip17p': 'iPhone 17 Pro',
        'iphone-17-pro': 'iPhone 17 Pro',
        'ipair': 'iPhone Air',
        'iphone-air': 'iPhone Air',
        'ip17': 'iPhone 17',
        'iphone-17': 'iPhone 17',
        'ip17e': 'iPhone 17e',
        'iphone-17e': 'iPhone 17e',
        'ip16pm': 'iPhone 16 Pro Max',
        'ip16p': 'iPhone 16 Pro',
        'iphone-16-pro': 'iPhone 16 Pro',
        'ip16': 'iPhone 16',
        'iphone-16': 'iPhone 16',
        'ip15': 'iPhone 15',
        'iphone-15': 'iPhone 15',
        'ipse': 'iPhone SE',
        'iphone-se': 'iPhone SE'
      };

      const targetTitle = mockIdMap[prodId] || prodId.replace(/^default-/, '').replace(/-/g, ' ');
      const matchedProduct = products.find(p => {
        const pTitle = (p.title || p.name || '').toLowerCase();
        const tLower = targetTitle.toLowerCase();
        return pTitle === tLower || pTitle.includes(tLower) || tLower.includes(pTitle);
      });
      if (matchedProduct) return matchedProduct;
    }

    return null;
  };

  const getCategoryGroup = (prod) => {
    if (!prod) return 'other';
    const catObj = prod.category;
    const catId = (catObj && typeof catObj === 'object') ? (catObj._id || catObj.id || '') : (typeof catObj === 'string' ? catObj : '');
    const catName = (catObj && typeof catObj === 'object') ? (catObj.name || catObj.title || '') : (typeof catObj === 'string' ? catObj : '');
    const catSlug = (catObj && typeof catObj === 'object') ? (catObj.slug || '') : '';

    const directTitle = prod.title || prod.name || '';
    const variantTitles = (prod.variants || []).map(v => `${v.title || ''} ${v.displayTitle || ''} ${v.name || ''}`).join(' ');
    const desc = prod.description || '';
    const brand = prod.brand || '';

    const fullText = `${catId} ${catName} ${catSlug} ${directTitle} ${variantTitles} ${desc} ${brand}`.toLowerCase();

    // 1. Check for accessories FIRST (keyboards, power adapters, chargers, cables, cases, sleeve, magsafe, etc.)
    const accessoryKeywords = [
      'keyboard', 'keypad', 'mouse', 'trackpad', 'adapter', 'charger', 'charging', 
      'cable', 'cord', 'connector', 'case', 'sleeve', 'cover', 'bag', 'backpack', 
      'folio', 'display', 'monitor', 'screen protector', 'guard', 'protector', 
      'film', 'skin', 'stand', 'mount', 'hub', 'dock', 'dongle', 'converter', 
      'pencil', 'stylus', 'strap', 'band', 'loop', 'magsafe', 'power', 'accessories', 
      'audio', 'headphone', 'earphone', 'earbuds', 'speaker'
    ];

    const isAccessory = accessoryKeywords.some(kw => fullText.includes(kw)) ||
                        catName.toLowerCase().includes('accessories') ||
                        catSlug.toLowerCase().includes('accessories');

    if (isAccessory) {
      return 'accessories';
    }

    // 2. Pure Mac Laptops & Computers
    if (
      fullText.includes('macbook') ||
      fullText.includes('mac mini') ||
      fullText.includes('imac') ||
      fullText.includes('mac studio') ||
      fullText.includes('mac pro') ||
      fullText.includes('laptops & pcs') ||
      fullText.includes('laptops-pcs') ||
      fullText.includes('macbook air') ||
      fullText.includes('macbook pro') ||
      fullText.includes('macbook neo')
    ) {
      return 'mac';
    }

    if (fullText.includes('iphone') || fullText.includes('smartphones')) {
      return 'iphone';
    }
    if (fullText.includes('ipad') || fullText.includes('tablets')) {
      return 'ipad';
    }
    if (fullText.includes('watch') || fullText.includes('wearable')) {
      return 'watch';
    }
    if (fullText.includes('airpod') || fullText.includes('premium audio')) {
      return 'airpods';
    }
    if (fullText.includes('tv') || fullText.includes('homepod')) {
      return 'tv-home';
    }
    return catId || catName || 'other';
  };

  const isValidCurrentProduct = currentProduct && 
    (currentProduct._id === id || currentProduct.id === id || currentProduct.slug === id);

  const localProduct = getProductFromStore(id);
  const product = isValidCurrentProduct ? currentProduct : localProduct;

  useEffect(() => {
    const rawTarget = activeImage || (product ? (colors[0]?.image || product.images?.[0] || product.image) : '');
    if (!rawTarget) return;

    let isMounted = true;
    let targetSrc = rawTarget.trim();
    if (targetSrc.startsWith('uploads/')) targetSrc = `/${targetSrc}`;

    setProcessedImage(targetSrc);

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = targetSrc;

    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const w = img.naturalWidth || img.width;
        const h = img.naturalHeight || img.height;
        if (w === 0 || h === 0) return;

        canvas.width = w;
        canvas.height = h;
        ctx.drawImage(img, 0, 0);

        const imgData = ctx.getImageData(0, 0, w, h);
        const data = imgData.data;

        const samplePoints = [
          [0, 0], [w - 1, 0], [0, h - 1], [w - 1, h - 1],
          [Math.floor(w / 2), 0], [0, Math.floor(h / 2)],
          [w - 1, Math.floor(h / 2)], [Math.floor(w / 2), h - 1]
        ];

        let bgR = 0, bgG = 0, bgB = 0, validSamples = 0;
        samplePoints.forEach(([x, y]) => {
          const idx = (y * w + x) * 4;
          if (data[idx + 3] > 200) {
            bgR += data[idx];
            bgG += data[idx + 1];
            bgB += data[idx + 2];
            validSamples++;
          }
        });

        if (validSamples > 0) {
          bgR = Math.round(bgR / validSamples);
          bgG = Math.round(bgG / validSamples);
          bgB = Math.round(bgB / validSamples);

          // Clean off-white/light-grey background colors (> 180, e.g. #f5f5f7 or #f0f0f2)
          if (bgR > 180 && bgG > 180 && bgB > 180) {
            const tolerance = 45;
            let modified = false;

            for (let i = 0; i < data.length; i += 4) {
              const r = data[i];
              const g = data[i + 1];
              const b = data[i + 2];
              const a = data[i + 3];

              if (a > 0) {
                const diff = Math.abs(r - bgR) + Math.abs(g - bgG) + Math.abs(b - bgB);
                if (diff <= tolerance) {
                  data[i + 3] = 0;
                  modified = true;
                } else if (diff <= tolerance + 25) {
                  const factor = (diff - tolerance) / 25;
                  data[i + 3] = Math.round(a * factor);
                  modified = true;
                }
              }
            }

            if (modified && isMounted) {
              ctx.putImageData(imgData, 0, 0);
              setProcessedImage(canvas.toDataURL('image/png'));
              return;
            }
          }
        }
      } catch (e) {
        // Fallback for CORS or canvas errors
      }
      if (isMounted) setProcessedImage(targetSrc);
    };

    img.onerror = () => {
      if (isMounted) setProcessedImage(targetSrc);
    };

    return () => { isMounted = false; };
  }, [activeImage, product]);

  const resolveColorValue = (cVal) => {
    if (!cVal) return '#cbd5e1';
    const cValStr = cVal.toString().trim();
    if (cValStr.startsWith('#') || cValStr.startsWith('rgb') || cValStr.startsWith('hsl')) {
      return cValStr;
    }
    const PDP_COLOR_MAP = {
      "night sky": "#353e4a",
      "star white": "#fafafa",
      "burgundy": "#4a1525",
      "glacier": "#e4effb",
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
      // iMac M4 specific
      "imac blue": "#6ea3d9",
      "imac green": "#78c59b",
      "imac pink": "#f4a2b2",
      "imac purple": "#a98ed4",
      "imac yellow": "#f0d17b",
      "imac orange": "#f4aa7a",
      "imac silver": "#e0e0e2"
    };
    const lowerVal = cValStr.toLowerCase().replace(/\s+/g, ' ').trim();
    return PDP_COLOR_MAP[lowerVal] || '#cbd5e1';
  };

  // Helper to extract color-specific images
  const getColorImages = (colorName) => {
    if (!product) return [];
    if (!colorName) return product.images || [];

    const normColor = colorName.toString().trim().toLowerCase();

    // 1. Check variants for matching color (Admin Panel uploaded images)
    if (product.variants && Array.isArray(product.variants)) {
      const colorVariant = product.variants.find(v => 
        v.color?.toString().trim().toLowerCase() === normColor &&
        Array.isArray(v.images) && v.images.length > 0
      );
      if (colorVariant && colorVariant.images && colorVariant.images.length > 0) {
        return colorVariant.images;
      }
    }

    // 2. Check product.colors array object
    const colorIdx = (product.colors || []).findIndex(c => {
      const name = typeof c === 'object' ? c.name : c;
      return name?.toString().trim().toLowerCase() === normColor;
    });

    if (colorIdx !== -1) {
      const colorObj = product.colors[colorIdx];
      if (colorObj && typeof colorObj === 'object') {
        if (Array.isArray(colorObj.images) && colorObj.images.length > 0) {
          return colorObj.images;
        }
        if (colorObj.image) {
          return [colorObj.image];
        }
      } else {
        // Fallback for flat string color arrays
        if (product.images && product.images[colorIdx]) {
          return [product.images[colorIdx]];
        }
      }
    }

    if (normColor.includes('silver') && (product?.name || product?.title || '').toLowerCase().includes('air')) {
      return ['/macbook_category_v3.jpg'];
    }

    return product.images && product.images.length > 0 ? product.images : [];
  };

  // Variant setups
  let rawColors = product?.colors || [];
  if (rawColors.length === 0 && product?.variants && product.variants.length > 0) {
    const uniqueColors = [];
    product.variants.forEach(v => {
      if (v.color && !uniqueColors.includes(v.color)) {
        uniqueColors.push(v.color);
      }
    });
    rawColors = uniqueColors;
  }

  if (rawColors.length === 0 && ((product?.title || product?.name || id || '').toLowerCase().includes('neo'))) {
    rawColors = ['Silver', 'Blush', 'Citrus', 'Indigo'];
  }

  const colors = rawColors.map(c => {
    const cName = typeof c === 'object' ? c.name : c;
    const cVal = typeof c === 'object' ? resolveColorValue(c.value || c.name) : resolveColorValue(c);
    const variantImgs = getColorImages(cName);
    const cImg = typeof c === 'object' ? (c.image || c.images?.[0]) : (variantImgs?.[0] || '');
    return {
      name: cName || 'Default Color',
      value: cVal || '#cbd5e1',
      image: cImg,
      images: typeof c === 'object' ? (c.images || (c.image ? [c.image] : [])) : variantImgs
    };
  });

  let sizes = product?.sizes || [];
  if (sizes.length === 0 && product?.variants && product.variants.length > 0) {
    const uniqueSizes = [];
    product.variants.forEach(v => {
      if (v.size && !uniqueSizes.includes(v.size)) {
        uniqueSizes.push(v.size);
      }
    });
    sizes = uniqueSizes;
  }

  let storages = [];
  const rawStorages = Array.isArray(product?.storage) ? [...product.storage] : [];
  if (product?.variants && product.variants.length > 0) {
    product.variants.forEach(v => {
      if (v.storage) rawStorages.push(v.storage);
    });
  }
  rawStorages.forEach(st => {
    const trimmed = (st || '').toString().trim();
    if (trimmed && !storages.some(s => s.toLowerCase() === trimmed.toLowerCase())) {
      storages.push(trimmed);
    }
  });

  if (storages.length === 0 && ((product?.title || product?.name || '').toLowerCase().includes('18 pro'))) {
    storages = ['256GB', '512GB', '1TB', '2TB'];
  }

  let rams = [];
  const rawRams = Array.isArray(product?.ram) ? [...product.ram] : (Array.isArray(product?.rams) ? [...product.rams] : []);
  if (product?.variants && product.variants.length > 0) {
    product.variants.forEach(v => {
      if (v.ram) rawRams.push(v.ram);
    });
  }
  rawRams.forEach(r => {
    const trimmed = (r || '').toString().trim();
    if (trimmed && !rams.some(rm => rm.toLowerCase() === trimmed.toLowerCase())) {
      rams.push(trimmed);
    }
  });

  let glasses = Array.isArray(product?.glasses) ? [...product.glasses] : [];
  if (product?.variants && product.variants.length > 0) {
    product.variants.forEach(v => {
      if (v.glass) {
        const trimmedGl = v.glass.toString().trim();
        if (trimmedGl && !glasses.some(g => g.toLowerCase() === trimmedGl.toLowerCase())) {
          glasses.push(trimmedGl);
        }
      }
    });
  }

  let connectivities = Array.isArray(product?.connectivities) ? [...product.connectivities] : [];
  if (product?.variants && product.variants.length > 0) {
    product.variants.forEach(v => {
      if (v.connectivity) {
        const trimmedConn = v.connectivity.toString().trim();
        if (trimmedConn && !connectivities.some(c => c.toLowerCase() === trimmedConn.toLowerCase())) {
          connectivities.push(trimmedConn);
        }
      }
    });
  }

  const activeColorName = selectedColor?.name || (colors[0]?.name || '');
  const galleryImages = getColorImages(activeColorName);

  const getCategoryLink = () => {
    const category = (product?.category?.name || product?.category || '').toString().toLowerCase();
    if (category.includes('iphone') || category.includes('smartphone')) return '/iphone';
    if (category.includes('mac') || category.includes('laptop')) return '/macbook';
    if (category.includes('ipad')) return '/ipad';
    if (category.includes('watch')) return '/watch';
    if (category.includes('airpod')) return '/airpods';
    if (category.includes('tv') || category.includes('home')) return '/tv-home';
    if (category.includes('accessory') || category.includes('accessories')) return '/accessories';
    return '/shop';
  };

  const getCategoryName = () => {
    return product?.category?.name || product?.category || 'iPhone';
  };

  // Determine active configurations
  useEffect(() => {
    if (product) {
      if (colors.length > 0) {
        setSelectedColor(colors[0]);
      } else {
        setSelectedColor(null);
      }

      if (sizes.length > 0) {
        setSelectedSize(sizes[0]);
      } else {
        setSelectedSize('');
      }

      if (storages.length > 0) {
        setSelectedStorage(storages[0]);
      } else {
        setSelectedStorage('');
      }

      if (rams.length > 0) {
        setSelectedRam(rams[0]);
      } else {
        setSelectedRam('');
      }

      if (glasses.length > 0) {
        setSelectedGlass(glasses[0]);
      } else {
        setSelectedGlass('');
      }

      if (connectivities.length > 0) {
        setSelectedConnectivity(connectivities[0]);
      } else {
        setSelectedConnectivity('');
      }
    }
  }, [product, colors.length, sizes.length, storages.length, rams.length, glasses.length, connectivities.length]);

  // Set active image whenever selectedColor changes
  useEffect(() => {
    if (product) {
      const activeColorName = selectedColor?.name || (colors[0]?.name || '');
      const imgs = getColorImages(activeColorName);
      if (imgs && imgs.length > 0) {
        setActiveImage(imgs[0]);
      } else if (product.images && product.images.length > 0) {
        setActiveImage(product.images[0]);
      } else if (product.image) {
        setActiveImage(product.image);
      } else {
        setActiveImage('');
      }
    }
  }, [selectedColor, product]);

  const handleColorSelect = (colorObj) => {
    setSelectedColor(colorObj);
  };

  const handleRamSelect = (ramVal) => {
    setSelectedRam(ramVal);
    // Find compatible storage for this RAM & active color
    if (product && product.variants && product.variants.length > 0) {
      const activeColorStr = (selectedColor?.name || colors[0]?.name || '').toString().toLowerCase();
      const normRam = ramVal.toString().toLowerCase();

      // Check if current selectedStorage works with this RAM
      const currentCompatible = product.variants.find(v => 
        (v.color || '').toString().toLowerCase() === activeColorStr &&
        (v.ram || '').toString().toLowerCase() === normRam &&
        (v.storage || '').toString().toLowerCase() === (selectedStorage || '').toString().toLowerCase()
      );

      if (!currentCompatible) {
        // Find any storage that works with this RAM
        const match = product.variants.find(v => 
          (v.ram || '').toString().toLowerCase() === normRam && v.storage
        );
        if (match && match.storage) {
          setSelectedStorage(match.storage);
        }
      }
    }
  };

  const handleGlassSelect = (glassVal) => {
    setSelectedGlass(glassVal);
    setSelectedConnectivity(glassVal);
    // Find compatible storage for this Glass & active color
    if (product && product.variants && product.variants.length > 0) {
      const activeColorStr = (selectedColor?.name || colors[0]?.name || '').toString().toLowerCase();
      const normGlass = glassVal.toString().toLowerCase();

      // Check if current selectedStorage works with this Glass/Connectivity
      const currentCompatible = product.variants.find(v => 
        (v.color || '').toString().toLowerCase() === activeColorStr &&
        ((v.glass || '').toString().toLowerCase() === normGlass || (v.connectivity || '').toString().toLowerCase() === normGlass) &&
        (v.storage || '').toString().toLowerCase() === (selectedStorage || '').toString().toLowerCase()
      );

      if (!currentCompatible) {
        // Find first storage that works with this glass finish
        const match = product.variants.find(v => 
          ((v.glass || '').toString().toLowerCase() === normGlass || (v.connectivity || '').toString().toLowerCase() === normGlass) && v.storage
        );
        if (match && match.storage) {
          setSelectedStorage(match.storage);
        }
      }
    }
  };

  const handleStorageSelect = (storageVal) => {
    setSelectedStorage(storageVal);
    // Find compatible RAM & Glass for this storage & active color
    if (product && product.variants && product.variants.length > 0) {
      const activeColorStr = (selectedColor?.name || colors[0]?.name || '').toString().toLowerCase();
      const normStorage = storageVal.toString().toLowerCase();

      // Check if current selectedGlass works with this storage
      const currentCompatibleGlass = product.variants.find(v => 
        (v.color || '').toString().toLowerCase() === activeColorStr &&
        (v.storage || '').toString().toLowerCase() === normStorage &&
        ((v.glass || '').toString().toLowerCase() === (selectedGlass || '').toString().toLowerCase() ||
         (v.connectivity || '').toString().toLowerCase() === (selectedGlass || '').toString().toLowerCase())
      );

      if (!currentCompatibleGlass) {
        const matchGlass = product.variants.find(v => 
          (v.storage || '').toString().toLowerCase() === normStorage && (v.glass || v.connectivity)
        );
        if (matchGlass) {
          const matchedVal = matchGlass.glass || matchGlass.connectivity;
          setSelectedGlass(matchedVal);
          setSelectedConnectivity(matchedVal);
        }
      }

      // Check if current selectedRam works with this storage
      const currentCompatibleRam = product.variants.find(v => 
        (v.color || '').toString().toLowerCase() === activeColorStr &&
        (v.storage || '').toString().toLowerCase() === normStorage &&
        (v.ram || '').toString().toLowerCase() === (selectedRam || '').toString().toLowerCase()
      );

      if (!currentCompatibleRam) {
        const matchRam = product.variants.find(v => 
          (v.storage || '').toString().toLowerCase() === normStorage && v.ram
        );
        if (matchRam && matchRam.ram) {
          setSelectedRam(matchRam.ram);
        }
      }
    }
  };

  const cleanProductTitle = (rawTitle) => {
    if (!rawTitle) return '';
    return rawTitle.replace(/\s*[A-Z0-9]{5,9}\/[A-Z]$/i, '').trim();
  };

  const getProcessorSpec = () => {
    // 1. Admin panel active variant level processor field
    const activeVar = getActiveVariant();
    if (activeVar && (activeVar.processor || activeVar.chip)) {
      return activeVar.processor || activeVar.chip;
    }

    // 2. Admin panel top-level product.processors array
    if (product && product.processors && Array.isArray(product.processors) && product.processors.length > 0) {
      const normRam = (selectedRam || '').toString().toLowerCase();
      const normStorage = (selectedStorage || '').toString().toLowerCase();

      const matched = product.processors.find(p => {
        const pNorm = p.toLowerCase();
        return (normRam && pNorm.includes(normRam)) || (normStorage && pNorm.includes(normStorage));
      });

      if (matched) return matched;
      return product.processors[0];
    }

    // 3. Dynamic default fallback
    const pTitle = (product?.name || product?.title || '').toLowerCase();
    const rStr = (selectedRam || '').toString().toLowerCase();
    const sStr = (selectedStorage || '').toString().toLowerCase();

    const is16 = rStr.includes('16');
    const is24 = rStr.includes('24');
    const is512 = sStr.includes('512');
    const is1TB = sStr.includes('1tb') || sStr.includes('1024') || sStr.includes('1 tb');

    if (pTitle.includes('imac') || pTitle.includes('24-inch')) {
      if (is24 || is1TB || (is16 && is512)) {
        return 'Apple M4 chip with 10‑core CPU and 10‑core GPU';
      }
      return 'Apple M4 chip with 8‑core CPU and 8‑core GPU';
    }

    if (is24 && is1TB) {
      return 'Apple M4 chip with 10‑core CPU and 10‑core GPU';
    }

    if (is16 && is1TB) {
      return 'Apple M4 chip with 10‑core CPU and 10‑core GPU';
    }

    if (is16 && is512) {
      return 'Apple M4 chip with 10‑core CPU and 10‑core GPU';
    }

    if (is24 || is16 || is1TB || sStr.includes('2tb')) {
      return 'Apple M4 chip with 10‑core CPU and 10‑core GPU';
    }

    return 'Apple M4 chip with 8‑core CPU and 8‑core GPU';
  };

  // Helper to extract active variant based on current selectors
  const getActiveVariant = (oColor, oStorage, oRam, oSize, oGlass, oConnectivity) => {
    if (!product || !product.variants || product.variants.length === 0) return null;

    const targetColorStr = oColor ? (oColor.name || oColor) : (selectedColor?.name || colors[0]?.name || '');
    const targetStorageStr = oStorage !== undefined ? oStorage : selectedStorage;
    const targetRamStr = oRam !== undefined ? oRam : selectedRam;
    const targetSizeStr = oSize !== undefined ? oSize : selectedSize;
    const targetGlassStr = oGlass !== undefined ? oGlass : selectedGlass;
    const targetConnStr = oConnectivity !== undefined ? oConnectivity : selectedConnectivity;

    const norm = (s) => (s || '').toString().trim().toLowerCase().replace(/ssd|ssd storage|storage|\s+/g, '');

    const normColor = norm(targetColorStr);
    const normStorage = norm(targetStorageStr);
    const normRam = norm(targetRamStr);
    const normSize = norm(targetSizeStr);
    const normGlass = norm(targetGlassStr);
    const normConn = norm(targetConnStr);

    let bestMatch = null;
    let maxScore = -10000;

    for (const v of product.variants) {
      const vColor = norm(v.color);
      const vStorage = norm(v.storage);
      const vRam = norm(v.ram);
      const vSize = norm(v.size);
      const vGlass = norm(v.glass);
      const vConn = norm(v.connectivity);

      let score = 0;

      // Color matching
      if (normColor) {
        if (vColor === normColor) score += 100;
        else if (vColor && vColor !== normColor) score -= 500;
      }

      // Storage matching
      if (normStorage) {
        if (vStorage === normStorage) score += 100;
        else if (vStorage && (vStorage.includes(normStorage) || normStorage.includes(vStorage))) score += 50;
        else if (vStorage && vStorage !== normStorage) score -= 500;
      }

      // Glass & Connectivity matching
      if (normGlass) {
        if (vGlass === normGlass || vConn === normGlass) score += 200;
        else if ((vGlass && vGlass !== normGlass) && (!vConn || vConn !== normGlass)) score -= 500;
      }

      if (normConn) {
        if (vConn === normConn || vGlass === normConn) score += 200;
        else if ((vConn && vConn !== normConn) && (!vGlass || vGlass !== normConn)) score -= 500;
      }

      // RAM matching
      if (normRam) {
        if (vRam === normRam) score += 100;
        else if (vRam && (vRam.includes(normRam) || normRam.includes(vRam))) score += 50;
        else if (vRam && vRam !== normRam) score -= 500;
      }

      // Size matching
      if (normSize) {
        if (vSize === normSize) score += 100;
        else if (vSize && vSize !== normSize) score -= 500;
      }

      // Part number presence bonus
      if (v.partNumber && v.partNumber.trim()) {
        score += 20;
      }

      if (score > maxScore) {
        maxScore = score;
        bestMatch = v;
      }
    }

    return bestMatch || product.variants[0];
  };

  // Helper to dynamically match variant price based on current selectors
  const getVariantPrice = (oColor, oSize, oStorage, oRam, oGlass, oConnectivity) => {
    if (!product) return 0;
    const defaultPrice = product.price || 0;

    const currentStorage = (oStorage || selectedStorage || storages[0] || '').toString().toLowerCase().trim();
    const is18Pro = (product.name || product.title || '').toLowerCase().includes('18 pro');

    if (is18Pro && currentStorage) {
      if (currentStorage.includes('256')) return 164900;
      if (currentStorage.includes('512')) return 189000;
      if (currentStorage.includes('1tb') || currentStorage.includes('1 tb')) return 239900;
      if (currentStorage.includes('2tb') || currentStorage.includes('2 tb')) return 314900;
    }

    if (!product.variants || product.variants.length === 0) return defaultPrice;

    const matchedVar = getActiveVariant(oColor, oStorage, oRam, oSize, oGlass, oConnectivity);
    if (matchedVar && matchedVar.price > 0) {
      return Number(matchedVar.price);
    }
    return defaultPrice;
  };

  const unitPrice = getVariantPrice();
  const appleCareCost = selectedAppleCare ? 2900 : 0;
  const finalUnitPrice = unitPrice + appleCareCost;
  const totalPrice = finalUnitPrice * quantity;

  if (!product) {
    return (
      <div className="page-smooth-enter min-h-[60vh] flex items-center justify-center">
        <Loader message="Loading product details..." />
      </div>
    );
  }

  const handleAddToCart = () => {
    if (!product) return;
    const colorName = selectedColor?.name || (colors[0]?.name || 'Standard');
    const activeVar = getActiveVariant();
    const partNum = activeVar?.partNumber || product.partNumber || product.modelNumber || '';
    const glassVal = selectedGlass || selectedConnectivity || activeVar?.glass || activeVar?.connectivity || '';
    const processorVal = activeVar?.processor || activeVar?.chip || getProcessorSpec();

    const detailsArr = [];
    if (selectedSize) detailsArr.push(selectedSize);
    if (colorName) detailsArr.push(colorName);
    if (selectedStorage) detailsArr.push(selectedStorage);
    if (glassVal) detailsArr.push(glassVal);
    if (selectedRam) detailsArr.push(selectedRam);
    if (processorVal && ((product.title || product.name || '').toLowerCase().includes('mac') || (product.title || product.name || '').toLowerCase().includes('ipad'))) {
      detailsArr.push(processorVal);
    }
    if (selectedAppleCare) detailsArr.push('AppleCare+ Included (₹2,900)');
    if (partNum) detailsArr.push(`MPN: ${partNum}`);

    const nameDetails = detailsArr.join(' / ');

    dispatch(addToCart({
      id: `${id}-${selectedSize || 'std'}-${selectedStorage || 'std'}-${selectedRam || 'std'}-${glassVal || 'std'}-${selectedAppleCare ? 'ac' : 'noac'}-${colorName}`,
      name: `${cleanProductTitle(product.name || product.title)} (${nameDetails})`,
      price: finalUnitPrice,
      image: activeImage || processedImage || colors[0]?.image || product.images?.[0] || product.image,
      quantity,
      size: selectedSize,
      storage: selectedStorage,
      glass: glassVal,
      processor: processorVal,
      partNumber: partNum,
      ram: selectedRam,
      color: colorName,
      appleCare: selectedAppleCare,
      stock: product.stock || 10
    }));
  };

  const handleRequestBulkQuote = () => {
    if (!product) return;

    const prodTitle = cleanProductTitle(product.title || product.name || 'Apple Product');
    const activeVar = getActiveVariant();
    const activeColorStr = selectedColor?.name || (colors[0]?.name || '');
    const partNum = activeVar?.partNumber || product.partNumber || product.modelNumber || '';
    const glassVal = selectedGlass || selectedConnectivity || activeVar?.glass || activeVar?.connectivity || '';
    const processorVal = activeVar?.processor || activeVar?.chip || getProcessorSpec();

    let message = `Hello iiNCEPT B2B Desk! 👋\nI would like to request a quote/inquiry for the following Apple Product:\n\n`;
    message += `📦 *Product:* ${prodTitle}\n`;
    if (partNum) message += `🔢 *SKU/Part Number:* ${partNum}\n`;
    if (selectedSize) message += `📏 *Size/Model:* ${selectedSize}\n`;
    if (activeColorStr) message += `🎨 *Color:* ${activeColorStr}\n`;
    if (selectedStorage) message += `💾 *Storage:* ${selectedStorage}\n`;
    if (glassVal) message += `✨ *Glass Finish / Option:* ${glassVal}\n`;
    if (selectedRam) message += `⚡ *RAM:* ${selectedRam}\n`;
    if (processorVal && ((product.title || product.name || '').toLowerCase().includes('mac') || (product.title || product.name || '').toLowerCase().includes('ipad'))) {
      message += `💻 *Chip & Processor:* ${processorVal}\n`;
    }
    if (selectedAppleCare) message += `🛡️ *Protection:* AppleCare+ Included (₹2,900.00)\n`;
    message += `📊 *Quantity Required:* ${quantity} unit(s)\n`;
    message += `💰 *Total Estimated Price:* ₹${totalPrice.toLocaleString('en-IN')}\n\n`;
    message += `Please provide availability and best B2B pricing. Thank you!`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/918607222417?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
  };

  const colorName = selectedColor?.name || (colors[0]?.name || 'Standard');

  const getIpadModelName = () => {
    const titleStr = (product?.title || product?.name || id || '').toLowerCase();
    if (titleStr.includes('ipad pro') || (titleStr.includes('ipad') && titleStr.includes('pro'))) return 'iPad Pro';
    if (titleStr.includes('ipad air') || (titleStr.includes('ipad') && titleStr.includes('air'))) return 'iPad Air';
    if (titleStr.includes('ipad mini') || (titleStr.includes('ipad') && titleStr.includes('mini'))) return 'iPad mini';
    return 'iPad Air';
  };

  const getAllDisplayFeatures = () => {
    const rawFeats = product?.features && Array.isArray(product.features) && product.features.length > 0
      ? [...product.features]
      : [];

    const isMacProduct = (product?.name || product?.title || '').toLowerCase().includes('mac') ||
                         (product?.category?.name || product?.category || '').toString().toLowerCase().includes('mac') ||
                         (product?.category?.name || product?.category || '').toString().toLowerCase().includes('laptop') ||
                         (product?.category?.name || product?.category || '').toString().toLowerCase().includes('pc');

    const result = [];

    // 1. Chip & Processor for Mac/PC or custom processor saved in Admin Panel
    if (isMacProduct || (product?.processors && product.processors.length > 0) || getActiveVariant()?.processor) {
      const hasChipInFeats = rawFeats.some(f => {
        const fLower = (f || '').toLowerCase();
        return fLower.includes('chip') || fLower.includes('processor') || fLower.includes('cpu');
      });
      if (!hasChipInFeats) {
        result.push(`Chip & Processor: ${getProcessorSpec()}`);
      }
    }

    // 2. Memory / RAM
    if (!rawFeats.some(f => (f || '').toLowerCase().includes('memory:'))) {
      if (selectedRam || (product?.ram && product.ram.length > 0)) {
        result.push(`Memory: ${selectedRam || product.ram[0]} unified memory`);
      }
    }

    // 3. Storage
    if (!rawFeats.some(f => (f || '').toLowerCase().includes('storage:'))) {
      if (selectedStorage || (product?.storage && product.storage.length > 0)) {
        result.push(`Storage: ${selectedStorage || product.storage[0]} storage`);
      }
    }

    // Add all existing features
    rawFeats.forEach(f => {
      let displayF = f;
      if (f.toLowerCase().includes('memory:') && selectedRam) {
        displayF = `Memory: ${selectedRam} unified memory`;
      } else if (f.toLowerCase().includes('storage:') && selectedStorage) {
        displayF = `Storage: ${selectedStorage} storage`;
      } else if ((f.toLowerCase().includes('chip') || f.toLowerCase().includes('processor') || f.toLowerCase().includes('cpu')) && (isMacProduct || product?.processors?.length > 0)) {
        displayF = `Chip & Processor: ${getProcessorSpec()}`;
      }
      result.push(displayF);
    });

    return result;
  };

  return (
    <div className="min-h-screen bg-white text-[#1D1D1F] font-sans pb-12 page-smooth-enter">

      {/* Dynamic Style Sheet block to inject template layout styles */}
      <style dangerouslySetInnerHTML={{
        __html: `
        :root {
          --ink: #FFFFFF; --ink-2: #F5F5F7; --ink-3: #101012; --paper: #1D1D1F;
          --blue: #0071E3; --line: rgba(0,0,0,0.10); --muted: rgba(29,29,31,0.62);
        }
        .wrap { max-width: 1240px; margin: 0 auto; padding: 0 28px; }
        .breadcrumb { padding: 18px 0; font-size: 13px; color: var(--muted); text-align: left; }
        .breadcrumb a:hover { color: var(--paper); }
        .breadcrumb span { margin: 0 6px; }

        .pdp { display: grid; grid-template-columns: 1.1fr 0.9fr; gap: 60px; padding: 20px 0 70px; }
        @media(max-width:920px) { .pdp { grid-template-columns: 1fr; } }

        .gallery { position: sticky; top: 90px; align-self: start; }
        .gallery-main {
          width: 100%; height: 520px; aspect-ratio: 1/1; border-radius: 20px; background: #ffffff;
          display: flex; align-items: center; justify-content: center;
          border: 1px solid var(--line); overflow: hidden; padding: 10px;
          transition: background .3s ease, border-color .3s ease;
        }
        .gallery-main img {
          max-width: 98%; max-height: 98%; width: 95%; height: 95%; object-fit: contain; display: block; margin: 0 auto;
          transition: opacity 0.35s ease-out, transform 0.35s ease-out;
        }
        .gallery-thumbs { display: flex; gap: 10px; margin-top: 14px; overflow-x: auto; padding-bottom: 4px; }
        .gthumb { width: 64px; height: 64px; shrink: 0; border-radius: 8px; border: 1px solid var(--line); background: #ffffff; cursor: pointer; display: flex; align-items: center; justify-content: center; padding: 4px; flex-shrink: 0; }
        .gthumb img { object-fit: contain; width: 100%; height: 100%; }
        .gthumb.active { border-color: var(--paper); border-width: 2px; }

        .pinfo .eyebrow { font-size: 12px; letter-spacing: .12em; text-transform: uppercase; color: var(--blue); font-weight: 700; margin-bottom: 10px; }
        .pinfo h1 { font-size: clamp(28px, 3.6vw, 38px); margin-bottom: 10px; font-family: 'Fraunces', serif; font-weight: 600; }
        .pinfo .price { font-size: 22px; font-weight: 700; margin-bottom: 4px; }
        .pinfo .gst { font-size: 13px; color: var(--muted); margin-bottom: 28px; }

        .optgroup { margin-bottom: 28px; }
        .optgroup label { display: block; font-size: 12px; text-transform: uppercase; letter-spacing: .08em; color: var(--muted); font-weight: 700; margin-bottom: 12px; }
        .swatches { display: flex; gap: 12px; }
        .swatch { width: 38px; height: 38px; border-radius: 50%; border: 2px solid transparent; cursor: pointer; position: relative; transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1); }
        .swatch:hover { transform: scale(1.15); box-shadow: 0 0 0 2px rgba(0,0,0,0.3), 0 0 0 4px #ffffff !important; }
        .swatch.active { border-color: transparent; }
        .swatch.active:hover { box-shadow: 0 0 0 2px #0071E3, 0 0 0 4px #ffffff !important; }

        .optrow { display: flex; gap: 10px; flex-wrap: wrap; align-items: center; }
        .opt {
          border: 1.5px solid rgba(0, 0, 0, 0.14);
          padding: 12px 18px;
          border-radius: 12px;
          font-size: 13.5px;
          font-weight: 600;
          cursor: pointer;
          transition: background-color 0.15s ease, border-color 0.15s ease, box-shadow 0.15s ease;
          background: #ffffff;
          color: #1d1d1f;
          text-align: center;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          box-sizing: border-box;
          user-select: none;
          min-height: 48px;
        }
        .opt:hover {
          border-color: #1d1d1f;
          background: #f5f5f7;
        }
        .opt.active {
          border-color: #1d1d1f;
          background: #f5f5f7;
          color: #1d1d1f;
          font-weight: 700;
          box-shadow: 0 0 0 1px #1d1d1f;
        }
        .opt .sub { display: block; font-size: 11px; color: var(--muted); margin-top: 2px; }

        .acplans { display: flex; flex-direction: column; gap: 10px; }
        .acplan { border: 1px solid var(--line); border-radius: 8px; padding: 14px 16px; display: flex; justify-content: space-between; align-items: center; cursor: pointer; transition: all .15s ease; text-align: left; }
        .acplan.active { border-color: var(--blue); background: #F0F7FF; }
        .acplan .t { font-size: 14px; font-weight: 600; } .acplan .s { font-size: 12px; color: var(--muted); }
        .acplan .p { font-size: 13px; font-weight: 600; }

        .qty { display: flex; align-items: center; gap: 14px; margin-bottom: 24px; }
        .qty button { width: 36px; height: 36px; border-radius: 50%; border: 1px solid var(--line); background: #fff; font-size: 16px; cursor: pointer; display: flex; align-items: center; justify-content: center; }
        .qty input { width: 60px; text-align: center; border: none; font-size: 15px; font-weight: 600; background: transparent; }

        .btnrow { display: flex; gap: 12px; margin-bottom: 30px; }
        .btn { padding: 15px 24px; border-radius: 8px; font-size: 14px; font-weight: 600; flex: 1; text-align: center; transition: transform .15s ease; cursor: pointer; }
        .btn:hover { transform: translateY(-1px); }
        .btn-dark { background: var(--paper); color: #fff; border: none; }
        .btn-line { border: 1px solid var(--line); color: var(--paper); background: transparent; }

        .pdp-note { display: flex; gap: 10px; font-size: 13px; color: var(--muted); align-items: flex-start; margin-bottom: 10px; text-align: left; }
        .pdp-note .dot { width: 5px; height: 5px; border-radius: 50%; background: var(--blue); margin-top: 6px; flex-shrink: 0; }

        /* DIVIDER */
        .divider { position: relative; height: 90px; overflow: hidden; background: var(--ink-3); margin-top: 30px; }
        .divider svg { position: absolute; top: 0; left: 0; width: 100%; height: 100%; }
        .divider-label { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; color: rgba(255,255,255,0.55); font-size: 11px; letter-spacing: .18em; text-transform: uppercase; font-weight: 700; }

        /* BULK PRICING */
        .section { padding: 60px 0; text-align: left; }
        .section-head { max-width: 560px; margin-bottom: 34px; }
        .section-head h2 { font-size: clamp(24px, 3.2vw, 32px); font-family: 'Fraunces', serif; font-weight: 600; }
        .section-head p { color: var(--muted); margin-top: 10px; font-size: 15px; line-height: 1.6; }

        table.pricing { width: 100%; border-collapse: collapse; border: 1px solid var(--line); border-radius: 12px; overflow: hidden; }
        table.pricing th, table.pricing td { padding: 16px 20px; text-align: left; font-size: 14px; border-bottom: 1px solid var(--line); }
        table.pricing th { background: var(--ink-2); font-size: 12px; text-transform: uppercase; letter-spacing: .06em; color: var(--muted); font-weight: 700; }
        table.pricing tr:last-child td { border-bottom: none; }
        table.pricing td.qty-tier { font-weight: 700; }
        table.pricing td.save { color: #1E8E5A; font-weight: 600; }

        /* SPEC TABS */
        .tabs { display: flex; gap: 0; border-bottom: 1px solid var(--line); margin-bottom: 24px; }
        .tab { padding: 14px 22px; font-size: 14px; font-weight: 600; color: var(--muted); cursor: pointer; border-bottom: 2px solid transparent; }
        .tab.active { color: var(--paper); border-color: var(--paper); }
        .spectable { display: grid; grid-template-columns: 200px 1fr; gap: 0; border: 1px solid var(--line); border-radius: 10px; overflow: hidden; }
        .spectable .k, .spectable .v { padding: 14px 18px; font-size: 13.5px; border-bottom: 1px solid var(--line); }
        .spectable .k { background: var(--ink-2); color: var(--muted); font-weight: 600; }
        .spectable .row { display: contents; }
        .spectable .row:last-child .k, .spectable .row:last-child .v { border-bottom: none; }
      `}} />

      <div className="wrap">
        <div className="breadcrumb">
          <Link to="/">Home</Link><span>/</span><Link to={getCategoryLink()}>{getCategoryName()}</Link><span>/</span>{product.name}
        </div>

        <div className="pdp">
          {/* Gallery Column */}
          <div className="gallery">
            <div
              className="gallery-main relative cursor-zoom-in overflow-hidden select-none"
              onMouseMove={handleGalleryMouseMove}
              onMouseEnter={handleGalleryMouseEnter}
              onMouseLeave={handleGalleryMouseLeave}
            >
              <img
                src={processedImage || activeImage || colors[0]?.image || product.images?.[0] || product.image || ''}
                alt={product.name || product.title || ''}
                className="mix-blend-multiply transition-transform duration-150 ease-out pointer-events-none"
                style={{
                  transform: isZoomed ? 'scale(2.4)' : 'scale(1.22)',
                  transformOrigin: `${zoomPos.x}% ${zoomPos.y}%`
                }}
                onError={(e) => {
                  e.currentTarget.style.opacity = '0.5';
                }}
              />
              {isZoomed && (
                <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider pointer-events-none z-10 animate-in fade-in duration-200">
                  🔍 Hover Zoom Active
                </div>
              )}
            </div>
            <div className="gallery-thumbs">
              {galleryImages.map((imgUrl, idx) => (
                <div
                  key={idx}
                  onClick={() => setActiveImage(imgUrl)}
                  className={`gthumb ${activeImage === imgUrl ? 'active' : ''}`}
                >
                  <img 
                    src={imgUrl} 
                    alt={`Thumbnail ${idx}`} 
                    onError={(e) => {
                      e.currentTarget.parentElement.style.display = 'none';
                    }}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Product Info Column */}
          <div className="pinfo">


            {/* Title (Clean Product Name) */}
            {(() => {
              const activeVar = getActiveVariant();
              const partNum = activeVar?.partNumber || product.partNumber || null;
              const modelNum = activeVar?.modelNumber || product.modelNumber || null;
              const rawTitle = activeVar?.displayTitle || activeVar?.title || (product.name || product.title);
              const displayTitle = cleanProductTitle(rawTitle);

              return (
                <>
                  <h1 className="text-2xl md:text-3xl font-extrabold text-zinc-900 tracking-tight text-left leading-snug">
                    {displayTitle}
                  </h1>

                  {modelNum && (
                    <div className="mb-3 mt-1.5 text-left">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-zinc-100 rounded-md text-[11px] font-mono text-zinc-700 border border-zinc-200 font-medium">
                        <span className="font-bold text-zinc-900 uppercase tracking-wide">Model:</span> {modelNum}
                      </span>
                    </div>
                  )}

                  <div className="price text-3xl font-black text-zinc-950 mt-4 mb-6 text-left tracking-tight">
                    ₹{totalPrice.toLocaleString('en-IN')}
                  </div>
                </>
              );
            })()}
            {(product.description && product.description.trim() !== '.' && product.description.trim() !== '') && (
              <div className="my-6 text-sm text-zinc-600 leading-relaxed text-left font-sans" style={{ whiteSpace: 'pre-line' }}>
                {product.description}
              </div>
            )}

            {/* Color swatches */}
            <div className="optgroup mb-8">
              <label className="block text-base font-semibold text-zinc-900 mb-3 text-left">
                Colour – <span className="text-zinc-700 font-normal">{colorName}</span>
              </label>
              <div className="swatches flex items-center gap-2">
                {colors.map((cObj) => {
                  const isSelected = (selectedColor?.name || '').toString().trim().toLowerCase() === (cObj.name || '').toString().trim().toLowerCase();
                  let bgVal = cObj.value;
                  const cNameLower = (cObj.name || '').toLowerCase();
                  const isSpaceBlack = cNameLower.includes('space black');
                  const isPinkBlush = cNameLower.includes('pink') || cNameLower.includes('blush') || cNameLower.includes('rose');
                  const isYellowCitrus = cNameLower.includes('yellow') || cNameLower.includes('citrus') || cNameLower.includes('lime') || cNameLower.includes('gold') || cNameLower.includes('light gold');
                  const isBlueSlate = cNameLower.includes('sky blue') || cNameLower.includes('blue') || cNameLower.includes('slate') || cNameLower.includes('indigo');
                  const isCloudWhite = cNameLower.includes('cloud white') || cNameLower.includes('silver') || (cNameLower.includes('white') && !cNameLower.includes('titanium'));

                  if (!bgVal || !bgVal.startsWith('#')) {
                    if (cNameLower.includes('space black')) bgVal = '#1F2022';
                    else if (cNameLower.includes('cloud white') || cNameLower.includes('white') || cNameLower.includes('silver')) bgVal = '#E5E6E8';
                    else if (cNameLower.includes('blush') || cNameLower.includes('pink')) bgVal = '#E8D4D4';
                    else if (cNameLower.includes('citrus') || cNameLower.includes('yellow')) bgVal = '#E1E49C';
                    else if (cNameLower.includes('indigo') || cNameLower.includes('blue')) bgVal = '#5E6B82';
                    else if (cNameLower.includes('starlight')) bgVal = '#F2E7D5';
                    else if (cNameLower.includes('midnight')) bgVal = '#2E3641';
                    else if (cNameLower.includes('space grey') || cNameLower.includes('space gray')) bgVal = '#7D7E80';
                    else bgVal = cObj.name || '#1D1D1F';
                  }

                  // Detect if this is an iMac product for two-tone Apple swatch chips
                  const isImacProduct = (product?.title || product?.name || '').toLowerCase().includes('imac');

                  let swatchBgImage = 'none';
                  if (cObj.swatchImage || cObj.swatch) {
                    swatchBgImage = `url(${cObj.swatchImage || cObj.swatch})`;
                  } else if (isImacProduct) {
                    // iMac M4 two-tone swatch SVGs
                    if (cNameLower.includes('blue')) swatchBgImage = 'url(/imac_blue_swatch.svg)';
                    else if (cNameLower.includes('pink')) swatchBgImage = 'url(/imac_pink_swatch.svg)';
                    else if (cNameLower.includes('purple') || cNameLower.includes('lavender')) swatchBgImage = 'url(/imac_purple_swatch.svg)';
                    else if (cNameLower.includes('green')) swatchBgImage = 'url(/imac_green_swatch.svg)';
                    else if (cNameLower.includes('yellow') || cNameLower.includes('citrus')) swatchBgImage = 'url(/imac_yellow_swatch.svg)';
                    else if (cNameLower.includes('orange')) swatchBgImage = 'url(/imac_orange_swatch.svg)';
                    else if (cNameLower.includes('silver') || cNameLower.includes('white')) swatchBgImage = 'url(/imac_silver_swatch.svg)';
                  } else if (isSpaceBlack) {
                    swatchBgImage = 'url(/space_black_swatch.png)';
                  } else if (isPinkBlush) {
                    swatchBgImage = 'url(/neo_pink.png)';
                  } else if (isYellowCitrus) {
                    swatchBgImage = 'url(/neo_yellow.png)';
                  } else if (isBlueSlate) {
                    swatchBgImage = 'url(/neo_blue.png)';
                  } else if (isCloudWhite) {
                    swatchBgImage = 'url(/neo_silver.png)';
                  }

                  return (
                    <button
                      key={cObj.name}
                      type="button"
                      onClick={() => handleColorSelect(cObj)}
                      className="relative w-11 h-11 flex items-center justify-center cursor-pointer group focus:outline-hidden border-0 bg-transparent p-0 transition-transform duration-200"
                      title={cObj.name}
                    >
                      {/* Outer Double Blue Concentric Ring when Selected */}
                      {isSelected ? (
                        <>
                          <span
                            className="absolute rounded-full pointer-events-none transition-all duration-200"
                            style={{
                              inset: '0px',
                              border: '2px solid #0071e3'
                            }}
                          />
                          <span
                            className="absolute rounded-full pointer-events-none transition-all duration-200"
                            style={{
                              inset: '2.5px',
                              border: '2px solid #ffffff'
                            }}
                          />
                          <span
                            className="absolute rounded-full pointer-events-none transition-all duration-200"
                            style={{
                              inset: '4.5px',
                              border: '2px solid #0071e3'
                            }}
                          />
                        </>
                      ) : (
                        /* Subtle Outer Ring on Hover when Unselected */
                        <span className="absolute inset-1 rounded-full border border-transparent group-hover:border-zinc-300 transition-all duration-200 pointer-events-none" />
                      )}

                      {/* Inner Swatch Circle */}
                      <span
                        className="w-7 h-7 rounded-full shadow-2xs transition-transform duration-200 group-hover:scale-105"
                        style={{
                          backgroundColor: bgVal,
                          backgroundImage: swatchBgImage,
                          backgroundSize: 'cover',
                          backgroundPosition: 'center',
                          backgroundRepeat: 'no-repeat'
                        }}
                      />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* SKU / Part Number option group (placed right below Colour) */}
            {(() => {
              const activeVar = getActiveVariant();
              const partNum = activeVar?.partNumber || product.partNumber || null;
              if (!partNum) return null;
              return (
                <div className="optgroup mb-8 text-left">
                  <label className="block text-[11px] font-extrabold text-zinc-400 uppercase tracking-widest mb-3">SKU / Part Number</label>
                  <div className="optrow flex flex-wrap gap-3">
                    <div className="opt active font-mono">
                      {partNum}
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* Size / Model options */}
            {sizes && sizes.length > 0 && (
              <div className="optgroup mb-8">
                <label className="block text-[11px] font-extrabold text-zinc-400 uppercase tracking-widest mb-3">Size / Model</label>
                <div className="optrow flex flex-wrap gap-3">
                  {sizes.map((sz) => (
                    <div
                      key={sz}
                      onClick={() => setSelectedSize(sz)}
                      className={`opt ${selectedSize === sz ? 'active' : ''}`}
                    >
                      {sz}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* RAM options */}
            {rams && rams.length > 0 && (
              <div className="optgroup mb-8">
                <label className="block text-[11px] font-extrabold text-zinc-400 uppercase tracking-widest mb-3">RAM (Memory)</label>
                <div className="optrow flex flex-wrap gap-3">
                  {rams.map((r) => (
                    <div
                      key={r}
                      onClick={() => handleRamSelect(r)}
                      className={`opt ${selectedRam === r ? 'active' : ''}`}
                    >
                      {r}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Storage options */}
            {storages && storages.length > 0 && (
              <div className="optgroup mb-8">
                <label className="block text-[11px] font-extrabold text-zinc-400 uppercase tracking-widest mb-3">Storage</label>
                <div className="optrow flex flex-wrap gap-3">
                  {storages.map((st) => (
                    <div
                      key={st}
                      onClick={() => handleStorageSelect(st)}
                      className={`opt ${selectedStorage === st ? 'active' : ''}`}
                    >
                      {st}
                    </div>
                  ))}
                </div>
              </div>
            )}



            {/* Finish / Connectivity Options */}
            {glasses && glasses.length > 0 && (
              <div className="optgroup mb-8">
                <label className="block text-[11px] font-extrabold text-zinc-400 uppercase tracking-widest mb-3">Connectivity / Glass Finish</label>
                <div className="optrow flex flex-wrap gap-3">
                  {glasses.map((gl) => (
                    <div
                      key={gl}
                      onClick={() => handleGlassSelect(gl)}
                      className={`opt ${selectedGlass === gl ? 'active' : ''}`}
                    >
                      {gl}
                    </div>
                  ))}
                </div>
              </div>
            )}



            {/* Quantity */}
            <div className="optgroup">
              <label>Quantity</label>
              <div className="qty">
                <button type="button" onClick={() => setQuantity(Math.max(1, quantity - 1))}>−</button>
                <input type="text" value={quantity} readOnly />
                <button type="button" onClick={() => setQuantity(quantity + 1)}>+</button>
              </div>
            </div>

            {/* Add AppleCare+ Official Card Widget */}
            {productAppleCare?.isEnabled !== false && (() => {
              const catName = product?.category?.name || 'Mac';
              const hasSettings = productAppleCare !== null;

              const title = hasSettings 
                ? (productAppleCare.title ?? 'Add AppleCare+') 
                : 'Add AppleCare+';

              const override = productAppleCare?.categoryPrices?.find(
                c => c.categoryName && c.categoryName.toLowerCase() === catName.toLowerCase()
              );

              const monthlyText = (override && override.monthlyPrice !== '')
                ? override.monthlyPrice
                : (hasSettings ? (productAppleCare.monthlyPriceText ?? '') : 'From ₹2817.00/mo.◊');

              const mrpText = (override && override.mrpPrice !== '')
                ? override.mrpPrice
                : (hasSettings ? (productAppleCare.mrpText ?? '') : 'or MRP ₹16900.00 (inclusive of all taxes)');

              const features = hasSettings && Array.isArray(productAppleCare.features)
                ? productAppleCare.features
                : [
                    'Unlimited repairs for accidental damage protection‡',
                    'Apple-certified repairs using genuine Apple parts',
                    '{category}, battery and included accessories covered',
                    'Priority access to Apple experts'
                  ];

              if (hasSettings && !title && !monthlyText && !mrpText && features.length === 0) {
                return null;
              }

              return (
                <div className="bg-white border border-zinc-200 rounded-3xl p-5 sm:p-6 my-5 shadow-xs text-left select-none relative">
                  {title && (
                    <div className="flex items-center gap-2 mb-1">
                      <svg className="w-5 h-5 fill-[#E30000] shrink-0" viewBox="0 0 170 170">
                        <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.34.13-9.04-1.9-14.1-6.1-3.37-2.73-7.29-7.38-11.77-13.97-6.53-9.59-11.75-20.47-15.66-32.65-3.92-12.18-5.88-23.75-5.88-34.7 0-14.4 3.73-26.17 11.19-35.31 7.46-9.14 16.82-13.82 28.08-14.04 4.58 0 9.77 1.19 15.58 3.58 5.81 2.39 9.87 3.58 12.18 3.58 2.12 0 6.28-1.25 12.48-3.75 6.2-2.5 11.21-3.64 15.03-3.41 12.18.54 21.84 5.35 28.98 14.42-10.77 6.53-16.03 15.45-15.78 26.77.25 8.92 3.82 16.5 10.72 22.74 6.9 6.24 15.08 9.71 24.54 10.42-2.39 7.07-5.55 14.1-9.48 21.09zM119.22 31.62c0-7.39 2.65-14.46 7.95-21.21 5.3-6.75 11.95-10.41 19.95-10.98.22.98.33 1.96.33 2.94 0 7.29-2.72 14.37-8.17 21.24-5.45 6.87-12.14 10.59-20.06 11.16-.07-1.04-.1-2.09-.1-3.15z" />
                      </svg>
                      <h3 className="text-xl sm:text-2xl font-bold text-zinc-900 leading-tight tracking-tight">
                        {title}
                      </h3>
                    </div>
                  )}

                  {(monthlyText || mrpText) && (
                    <div className="mt-1.5 space-y-0.5">
                      {monthlyText && <p className="text-sm sm:text-base font-bold text-zinc-900">{monthlyText}</p>}
                      {mrpText && <p className="text-xs sm:text-sm text-zinc-600 font-medium">{mrpText}</p>}
                    </div>
                  )}

                  {features.length > 0 && (
                    <>
                      <hr className="my-4 border-zinc-200" />

                      <ul className="space-y-2.5 text-xs sm:text-sm text-zinc-800 font-medium">
                        {features.map((ft, idx) => (
                          <li key={idx} className="flex items-start gap-2.5">
                            <span className="text-zinc-900 font-bold">•</span>
                            <span>{ft.replace('{category}', catName)}</span>
                          </li>
                        ))}
                      </ul>
                    </>
                  )}
                </div>
              );
            })()}

            {/* Action Buttons */}
            <div className="btnrow">
              <button onClick={handleAddToCart} className="btn btn-dark">Add to Order →</button>
              <button onClick={handleRequestBulkQuote} className="btn btn-line flex items-center justify-center gap-2">
                Request to WhatsApp
              </button>
            </div>
          </div>
        </div>

        {/* Specs & Reviews Tabs Section */}
        <div className="border-t border-zinc-200 pt-10 mt-8">
          <div className="tabs flex gap-2 border-b border-zinc-200 mb-6">
            <button
              onClick={() => setActiveTab('specs')}
              className={`pb-3.5 px-4 font-bold text-sm border-b-2 transition-all cursor-pointer ${activeTab === 'specs' ? 'border-black text-black' : 'border-transparent text-zinc-400 hover:text-zinc-700'
                }`}
            >
              Specifications
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              className={`pb-3.5 px-4 font-bold text-sm border-b-2 transition-all cursor-pointer ${activeTab === 'reviews' ? 'border-black text-black' : 'border-transparent text-zinc-400 hover:text-zinc-700'
                }`}
            >
              Reviews ({reviews.length})
            </button>
          </div>

          {activeTab === 'specs' ? (
            <div className="border border-zinc-200 rounded-2xl overflow-hidden p-6 bg-zinc-50/50 space-y-6">
              {/* Single Unified Technical & Hardware Specifications Box */}
              {(() => {
                const featsList = getAllDisplayFeatures();
                const isIpadProduct = (product?.title || product?.name || '').toLowerCase().includes('ipad') ||
                                      (product?.category?.name || product?.category || '').toString().toLowerCase().includes('ipad') ||
                                      (id || '').toLowerCase().includes('ipad');

                if (featsList.length === 0 && !isIpadProduct) return null;

                return (
                  <div className="text-left">
                    <h3 className="text-xs font-extrabold text-zinc-900 uppercase tracking-widest mb-4">Technical & Hardware Specifications</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {/* Specifications items */}
                      {featsList.map((displayFeat, fIdx) => {
                        const parts = displayFeat.includes(':') ? displayFeat.split(':') : [null, displayFeat];
                        return (
                          <div key={fIdx} className="flex items-start gap-2.5 p-3.5 rounded-xl bg-white border border-zinc-200/80 shadow-2xs">
                            <div className="h-2 w-2 rounded-full bg-[#0071e3] mt-1.5 shrink-0" />
                            <div className="text-xs text-left">
                              {parts[0] ? (
                                <>
                                  <span className="font-bold text-zinc-900 mr-1.5">{parts[0].trim()}:</span>
                                  <span className="text-zinc-700 font-medium">{parts.slice(1).join(':').trim()}</span>
                                </>
                              ) : (
                                <span className="font-semibold text-zinc-800">{displayFeat}</span>
                              )}
                            </div>
                          </div>
                        );
                      })}

                      {/* AppleCare+ Dedicated Protection Specs for iPad Pro / iPad Air / iPad (Inside same box grid) */}
                      {isIpadProduct && (() => {
                        const ipadModel = getIpadModelName();
                        return (
                          <div className="col-span-1 md:col-span-2 p-4 rounded-xl bg-white border border-blue-200/90 shadow-2xs text-left space-y-3">
                            <div className="flex items-center justify-between border-b border-zinc-100 pb-2.5">
                              <div className="flex items-center gap-2">
                                <div className="h-2 w-2 rounded-full bg-[#0071e3] shrink-0" />
                                <span className="font-bold text-xs text-zinc-900 uppercase tracking-wider">
                                  AppleCare+ for {ipadModel} Coverage
                                </span>
                              </div>
                              <span className="font-extrabold text-[10px] text-[#0071e3] bg-blue-50 border border-blue-200 px-2.5 py-0.5 rounded-full uppercase tracking-wider">Apple Official Warranty</span>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-zinc-700 font-medium pt-0.5">
                              <p className="flex items-center gap-2">
                                <span className="text-[#0071e3] font-extrabold text-sm shrink-0">✓</span>
                                <span>Unlimited repairs for accidental damage protection</span>
                              </p>
                              <p className="flex items-center gap-2">
                                <span className="text-[#0071e3] font-extrabold text-sm shrink-0">✓</span>
                                <span>Apple-certified service and support</span>
                              </p>
                              <p className="flex items-center gap-2">
                                <span className="text-[#0071e3] font-extrabold text-sm shrink-0">✓</span>
                                <span>Pickup and delivery service</span>
                              </p>
                              <p className="flex items-center gap-2">
                                <span className="text-[#0071e3] font-extrabold text-sm shrink-0">✓</span>
                                <span>Priority access to Apple experts</span>
                              </p>
                              <p className="flex items-center gap-2 md:col-span-2">
                                <span className="text-[#0071e3] font-extrabold text-sm shrink-0">✓</span>
                                <span>Coverage for your {ipadModel}, Apple Pencil, and Apple keyboard, all for a single price</span>
                              </p>
                            </div>
                          </div>
                        );
                      })()}
                    </div>
                  </div>
                );
              })()}

              {/* 3. AppleCare+ Dedicated Plan Banner for Apple TV */}
              {(product.title?.toLowerCase().includes('apple tv') || product.name?.toLowerCase().includes('apple tv') || product.title?.toLowerCase().includes('tv 4k')) && (
                <div className="p-5 rounded-2xl bg-white border border-blue-200/90 shadow-2xs text-left space-y-3 mt-6">
                  <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#0071e3]" />
                      <span className="font-extrabold text-sm text-zinc-900">Add AppleCare+ for Apple TV for ₹2,900.00</span>
                    </div>
                    <span className="font-extrabold text-sm text-[#0071e3]">₹2,900.00</span>
                  </div>
                  <div className="space-y-2 text-xs text-zinc-700 font-medium pt-1">
                    <p className="flex items-center gap-2">
                      <span className="text-[#0071e3] font-bold text-sm">✓</span>
                      Unlimited repairs for accidental damage protection<sup className="text-[9px]">◊</sup>
                    </p>
                    <p className="flex items-center gap-2">
                      <span className="text-[#0071e3] font-bold text-sm">✓</span>
                      Apple-certified repairs using genuine Apple parts
                    </p>
                    <p className="flex items-center gap-2">
                      <span className="text-[#0071e3] font-bold text-sm">✓</span>
                      Priority access to Apple experts
                    </p>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-8 animate-in fade-in duration-300">

              {/* Reviews Summary Rating Breakdown */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center p-6 bg-zinc-50/50 border border-zinc-200 rounded-2xl">
                <div className="text-center space-y-1">
                  <span className="text-4xl font-extrabold text-zinc-900">{product.rating || 5.0}</span>
                  <div className="flex justify-center gap-1 text-amber-500 mt-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`h-4 w-4 ${i < Math.round(product.rating || 5.0) ? 'fill-amber-500 text-amber-500' : 'text-zinc-300'}`} />
                    ))}
                  </div>
                  <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider mt-1.5">{reviews.length} Customer Reviews</p>
                </div>

                <div className="md:col-span-2 space-y-2 text-xs">
                  {[5, 4, 3, 2, 1].map((stars) => {
                    const count = reviews.filter(r => r.rating === stars).length;
                    const pct = reviews.length > 0 ? (count / reviews.length) * 100 : (stars === 5 ? 100 : 0);
                    return (
                      <div key={stars} className="flex items-center gap-3">
                        <span className="w-12 text-zinc-500 font-bold">{stars} Stars</span>
                        <div className="flex-grow h-2 bg-zinc-200 rounded-full overflow-hidden">
                          <div className="h-full bg-zinc-900" style={{ width: `${pct}%` }} />
                        </div>
                        <span className="w-8 text-zinc-400 font-semibold text-right">{count}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* List of customer reviews */}
              <div className="space-y-4">
                {reviews.length === 0 ? (
                  <p className="text-sm text-zinc-500 italic p-4 text-center">Be the first to review this product.</p>
                ) : (
                  reviews.map((rev) => (
                    <div key={rev._id} className="p-5 border border-zinc-200 rounded-2xl bg-white space-y-3 shadow-sm text-left">
                      <div className="flex justify-between items-start gap-4">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-zinc-900 text-sm">{rev.user?.name || 'Anonymous User'}</span>
                            {rev.isVerified && (
                              <span className="text-[8px] bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wider">
                                Verified Buyer
                              </span>
                            )}
                          </div>
                          <div className="flex gap-0.5 text-amber-500 mt-1">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} className={`h-3 w-3 ${i < rev.rating ? 'fill-amber-500 text-amber-500' : 'text-zinc-200'}`} />
                            ))}
                          </div>
                        </div>
                        <span className="text-[10px] text-zinc-400 font-semibold">
                          {new Date(rev.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                      </div>
                      {rev.comment && <p className="text-xs text-zinc-650 leading-relaxed text-left">{rev.comment}</p>}
                    </div>
                  ))
                )}
              </div>

              {/* Write a review form */}
              <form onSubmit={handleReviewSubmit} className="p-6 border border-zinc-200 rounded-2xl bg-zinc-50/50 space-y-4 text-left">
                <h3 className="font-bold text-sm text-zinc-900 uppercase tracking-wide">Write a Customer Review</h3>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider block">Select Star Rating</label>
                  <div className="flex gap-1.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setNewRating(star)}
                        className="text-zinc-300 hover:text-amber-500 cursor-pointer p-0 bg-transparent border-none"
                      >
                        <Star className={`h-6 w-6 ${star <= newRating ? 'fill-amber-500 text-amber-500' : 'text-zinc-300'}`} />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider block">Write your Comment</label>
                  <textarea
                    rows="3"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Tell us what you like or dislike about this product..."
                    className="w-full bg-white border border-zinc-200 text-xs rounded-xl p-3 text-zinc-900 focus:outline-none focus:border-zinc-500 transition-colors"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submittingReview}
                  className="bg-black hover:bg-zinc-900 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition-all cursor-pointer disabled:opacity-50"
                >
                  {submittingReview ? 'Submitting...' : 'Submit Review'}
                </button>
              </form>

            </div>
          )}
        </div>
      </div>

      {/* Recommended Related Products */}
      {(() => {
        const targetProd = currentProduct || localProduct;
        if (!targetProd || !products || products.length === 0) return null;

        const currentGroup = getCategoryGroup(targetProd);
        const currentProdId = targetProd._id || targetProd.id;

        const relatedList = products.filter(p => {
          const pId = p._id || p.id;
          if (pId === currentProdId) return false;
          return getCategoryGroup(p) === currentGroup;
        }).slice(0, 4);

        if (relatedList.length === 0) return null;

        const categoryTitles = {
          'mac': 'Recommended Mac Lineup',
          'iphone': 'Recommended iPhone Lineup',
          'ipad': 'Recommended iPad Lineup',
          'watch': 'Recommended Apple Watch Models',
          'airpods': 'Recommended AirPods & Audio',
          'tv-home': 'Recommended TV & Home Gear',
          'accessories': 'Recommended Accessories'
        };

        return (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 border-t border-zinc-100 pt-12 text-left">
            <span className="text-[10px] text-zinc-400 font-extrabold uppercase tracking-widest block">Explore Similar Gear</span>
            <h2 className="text-xl font-black text-zinc-900 tracking-tight mt-2 mb-6">
              You may also like
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {relatedList.map((p) => {
                const prodImg = (p.images && p.images[0]) || p.image || '/macbook_category_v3.jpg';
                return (
                  <Link key={p._id || p.id} to={`/product/${p._id || p.id}`} className="group space-y-3 block">
                    <div className="aspect-[4/3] w-full rounded-2xl bg-zinc-50 border border-zinc-100 p-3 flex items-center justify-center overflow-hidden">
                      <img src={prodImg} alt="" className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-350" />
                    </div>
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{p.brand || 'Apple'}</span>
                      <h4 className="font-bold text-xs text-zinc-900 leading-snug line-clamp-2 group-hover:text-zinc-650 transition-colors">{p.title || p.name}</h4>
                      <p className="font-extrabold text-xs text-zinc-900 font-sans">
                        ₹{(p.price || p.variants?.[0]?.price || 0).toLocaleString('en-IN')}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        );
      })()}


      {/* Floating WhatsApp Widget */}
      <a
        href="https://wa.me/918607222417"
        target="_blank"
        rel="noopener noreferrer"
        style={{
          position: 'fixed',
          bottom: '30px',
          right: '30px',
          backgroundColor: '#25d366',
          color: '#fff',
          borderRadius: '50%',
          width: '60px',
          height: '60px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
          zIndex: 1000,
          transition: 'transform 0.2s ease'
        }}
        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.08)'}
        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
      >
        <svg className="w-8 h-8 fill-current" viewBox="0 0 24 24" style={{ width: '32px', height: '32px' }}>
          <path d="M12.012 2c-5.508 0-9.985 4.478-9.985 9.985 0 1.758.459 3.412 1.258 4.86L2 22l5.312-1.392c1.4.762 2.99 1.196 4.7 1.196 5.508 0 9.985-4.478 9.985-9.985 0-5.507-4.477-9.985-9.985-9.985zm0 17.986c-1.547 0-3.057-.417-4.375-1.206l-.313-.186-3.255.854.87-3.173-.205-.326c-.868-1.383-1.326-2.986-1.326-4.636 0-4.385 3.567-7.952 7.952-7.952 4.384 0 7.951 3.567 7.951 7.952 0 4.384-3.567 7.952-7.951 7.952zm4.359-5.966c-.239-.12-1.414-.698-1.634-.778-.22-.08-.38-.12-.54.12-.16.24-.62.778-.76.938-.14.16-.28.18-.519.06-.24-.12-1.012-.372-1.927-1.188-.713-.636-1.195-1.423-1.335-1.663-.14-.24-.015-.369.105-.489.108-.108.24-.28.36-.42.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42-.06-.12-.54-1.3-.74-1.78-.195-.47-.393-.406-.54-.414-.14-.007-.3-.007-.46-.007s-.42.06-.64.3c-.22.24-.84.82-.84 2.002 0 1.182.86 2.324.98 2.484.12.16 1.69 2.58 4.096 3.618.572.247 1.02.394 1.368.504.576.183 1.1.157 1.514.095.462-.069 1.414-.578 1.614-1.138.2-.56.2-1.04.14-1.138-.06-.098-.22-.178-.459-.298z" />
        </svg>
      </a>
    </div>
  );
}

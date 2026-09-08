import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { fetchProducts } from '../redux/productSlice';
import axiosClient from '../services/axiosClient';

// Default Category Icons for the store strip
const DEFAULT_CATEGORY_STRIP = [
  { name: 'Mac', label: 'Mac', icon: '💻', image: 'https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/store-card-13-mac-nav-202410?wid=200&hei=130&fmt=png-alpha&.v=1728342368663', path: '/macbook', isActive: true },
  { name: 'iPhone', label: 'iPhone', icon: '📱', image: 'https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/store-card-13-iphone-nav-202409?wid=200&hei=130&fmt=png-alpha&.v=1724258295052', path: '/iphone', isActive: true },
  { name: 'iPad', label: 'iPad', icon: '📱', image: '/ipad_nav/ipad_pro.png', path: '/ipad', isActive: true },
  { name: 'Watch', label: 'Watch', icon: '⌚', image: '/watch_category_uploaded.png', path: '/watch', isActive: true },
  { name: 'AirPods', label: 'AirPods', icon: '🎧', image: '/airpods_category_uploaded.png', path: '/airpods', isActive: true },
  { name: 'AirTag', label: 'AirTag', icon: '📍', image: '/iphone_nav/airtag.png', path: '/iphone?search=AirTag', isActive: true },
  { name: 'Apple TV 4K', label: 'Apple TV 4K', icon: '📺', image: '/tvhome_category_uploaded.png', path: '/tv-home', isActive: true },
  { name: 'HomePod', label: 'HomePod', icon: '🔊', image: '/tvhome_nav/homepod.png', path: '/tv-home?search=HomePod', isActive: true },
  { name: 'Accessories', label: 'Accessories', icon: '🔌', image: '/accessories_category_uploaded.png', path: '/accessories', isActive: true },
  { name: 'Gift Card', label: 'Gift Card', icon: '🎁', image: '/gift_card_icon.png', path: '/shop', isActive: true },
];

export default function Home() {
  const location = useLocation();
  const dispatch = useDispatch();
  const { products } = useSelector((state) => state.products || { products: [] });

  const testimonialSliderRef = useRef(null);

  const scrollTestimonials = (direction) => {
    if (testimonialSliderRef.current) {
      const scrollAmount = direction === 'left' ? -380 : 380;
      testimonialSliderRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  // B2B Form State
  const [b2bForm, setB2bForm] = useState({
    fullName: '',
    company: '',
    email: '',
    phone: '',
    productInterest: 'Select category',
    message: ''
  });
  const [b2bSubmitting, setB2bSubmitting] = useState(false);
  const [b2bSuccess, setB2bSuccess] = useState('');

  // Hero Section Settings with LocalStorage Cache
  const [heroData, setHeroData] = useState(() => {
    try {
      const cached = localStorage.getItem('iincept_home_hero_v2');
      if (cached) return JSON.parse(cached);
    } catch (e) {}
    return {
      homeHeroBadge: 'Apple Authorised Resellers across India',
      homeHeroTitle: 'The latest.\nThe best. Authorised.',
      homeHeroSubtitle: 'Genuine Apple products from India’s trusted mono-brand premium resellers. Exclusive offers, EMI & expert support.',
      homeHeroPrimaryBtnText: 'Shop Now',
      homeHeroPrimaryBtnLink: '/iphone',
      homeHeroSecondaryBtnText: 'Find Nearest Store',
      homeHeroSecondaryBtnLink: '#b2b-section',
      homeHeroImage: ''
    };
  });

  // Deal of the Week State
  const [dealData, setDealData] = useState({
    dealEyebrow: 'Deal of the Week',
    dealTitle: 'MacBook Neo – Stock Clearance',
    dealDesc: 'Amazing Mac at a surprising price. Limited stock this week. Exclusive bank offers + free AppleCare+ for first 50 buyers.',
    dealPrice: '₹72,900',
    dealOldPrice: '₹79,900',
    dealButtonText: 'Grab the Deal',
    dealButtonLink: '/macbook',
    dealImage: '/mac_nav/macbook_neo.png'
  });

  // Category Strip Icons
  const [categoryStrip, setCategoryStrip] = useState(() => {
    try {
      const cached = localStorage.getItem('iincept_home_category_icons_v2');
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map(item => {
            if ((item.name === 'Mac' || item.label === 'Mac') && (item.image === '/mac_nav/macbook_pro.png' || !item.image)) {
              return { ...item, image: 'https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/store-card-13-mac-nav-202410?wid=200&hei=130&fmt=png-alpha&.v=1728342368663' };
            }
            if ((item.name === 'iPhone' || item.label === 'iPhone') && (item.image === '/iphone_nav/iphone_17_pro.png' || !item.image)) {
              return { ...item, image: 'https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/store-card-13-iphone-nav-202409?wid=200&hei=130&fmt=png-alpha&.v=1724258295052' };
            }
            return item;
          });
        }
      }
    } catch (e) {}
    return DEFAULT_CATEGORY_STRIP;
  });

  // Dynamic Categories from Settings
  const [appleCategories, setAppleCategories] = useState([
    { name: 'Mac', count: 'MacBook, iMac, Mac mini', icon: '💻', link: '/macbook' },
    { name: 'iPad', count: 'iPad Pro, Air, mini', icon: '📱', link: '/ipad' },
    { name: 'iPhone', count: 'iPhone 17, 16 & more', icon: '📱', link: '/iphone' },
    { name: 'Watch', count: 'Series 11, Ultra, SE', icon: '⌚', link: '/watch' },
    { name: 'AirPods', count: 'Pro, Max, 4', icon: '🎧', link: '/airpods' },
    { name: 'TV & Home', count: 'Apple TV, HomePod', icon: '📺', link: '/tv-home' },
    { name: 'Entertainment', count: 'Apple Music, TV+', icon: '🎬', link: '/tv-home' },
    { name: 'Accessories', count: 'Cases, Chargers & more', icon: '🔌', link: '/accessories' },
  ]);

  // Testimonials State
  const [testimonials, setTestimonials] = useState([
    {
      stars: 5,
      text: '“Purchased MacBook Air M4 from the authorised store. Staff was extremely knowledgeable and helped with EMI options. Delivery was next day. Highly recommended.”',
      author: 'Anjali Sharma',
      sub: 'MacBook Air · Bengaluru'
    },
    {
      stars: 5,
      text: '“Best experience buying iPhone 17 Pro. Got bank offer + trade-in value explained clearly. Genuine product with full warranty. Will buy again.”',
      author: 'Rahul Kapoor',
      sub: 'iPhone 17 Pro · Mumbai'
    },
    {
      stars: 5,
      text: '“Corporate order for 25 iPads was handled smoothly. Dedicated manager, proper invoicing and on-time delivery. Excellent B2B support.”',
      author: 'Priya Singh',
      sub: 'B2B Order · Delhi NCR'
    }
  ]);

  useEffect(() => {
    dispatch(fetchProducts());
    fetchSiteSettings();
  }, [dispatch]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const scrollTarget = params.get('scroll');
    if (scrollTarget === 'procurement' || scrollTarget === 'b2b') {
      setTimeout(() => {
        const section = document.getElementById('b2b-section');
        if (section) {
          section.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 300);
    }
  }, [location]);

  const fetchSiteSettings = async () => {
    try {
      const response = await axiosClient.get('/settings');
      if (response.data) {
        const updatedHero = {
          homeHeroBadge: response.data.homeHeroBadge || 'Apple Authorised Resellers across India',
          homeHeroTitle: response.data.homeHeroTitle || 'The latest.\nThe best. Authorised.',
          homeHeroSubtitle: response.data.homeHeroSubtitle || 'Genuine Apple products from India’s trusted mono-brand premium resellers. Exclusive offers, EMI & expert support.',
          homeHeroPrimaryBtnText: response.data.homeHeroPrimaryBtnText || 'Shop Now',
          homeHeroPrimaryBtnLink: response.data.homeHeroPrimaryBtnLink || '/iphone',
          homeHeroSecondaryBtnText: response.data.homeHeroSecondaryBtnText || 'Find Nearest Store',
          homeHeroSecondaryBtnLink: response.data.homeHeroSecondaryBtnLink || '#b2b-section',
          homeHeroImage: response.data.homeHeroImage || ''
        };

        setHeroData(prev => {
          if (JSON.stringify(prev) !== JSON.stringify(updatedHero)) {
            try {
              localStorage.setItem('iincept_home_hero_v2', JSON.stringify(updatedHero));
            } catch (e) {}
            return updatedHero;
          }
          return prev;
        });

        if (response.data.dealTitle || response.data.dealPrice) {
          setDealData({
            dealEyebrow: response.data.dealEyebrow || 'Deal of the Week',
            dealTitle: response.data.dealTitle || 'MacBook Neo – Stock Clearance',
            dealDesc: response.data.dealDesc || 'Amazing Mac at a surprising price. Limited stock this week. Exclusive bank offers + free AppleCare+ for first 50 buyers.',
            dealPrice: response.data.dealPrice || '₹72,900',
            dealOldPrice: response.data.dealOldPrice || '₹79,900',
            dealButtonText: response.data.dealButtonText || 'Grab the Deal',
            dealButtonLink: response.data.dealButtonLink || '/macbook',
            dealImage: response.data.dealImage || '/mac_nav/macbook_neo.png'
          });
        }

        if (response.data.homeCategoryIcons && response.data.homeCategoryIcons.length > 0) {
          const activeIcons = response.data.homeCategoryIcons
            .filter(i => i.isActive !== false)
            .map(i => {
              if ((i.name === 'Mac' || i.label === 'Mac') && (i.image === '/mac_nav/macbook_pro.png' || !i.image)) {
                return { ...i, image: 'https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/store-card-13-mac-nav-202410?wid=200&hei=130&fmt=png-alpha&.v=1728342368663' };
              }
              if ((i.name === 'iPhone' || i.label === 'iPhone') && (i.image === '/iphone_nav/iphone_17_pro.png' || !i.image)) {
                return { ...i, image: 'https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/store-card-13-iphone-nav-202409?wid=200&hei=130&fmt=png-alpha&.v=1724258295052' };
              }
              return i;
            });
          if (activeIcons.length > 0) {
            setCategoryStrip(prev => {
              if (JSON.stringify(prev) !== JSON.stringify(activeIcons)) {
                try {
                  localStorage.setItem('iincept_home_category_icons_v2', JSON.stringify(activeIcons));
                } catch (e) {}
                return activeIcons;
              }
              return prev;
            });
          }
        }

        if (response.data.testimonials && response.data.testimonials.length > 0) {
          setTestimonials(response.data.testimonials.map(t => ({
            stars: t.stars || 5,
            text: t.text || '',
            author: t.author || 'Verified Customer',
            sub: t.sub || t.company || 'Apple Authorised Reseller'
          })));
        }
      }
    } catch (err) {
      console.error('Failed to load homepage settings:', err);
    }
  };

  const handleB2bSubmit = async (e) => {
    e.preventDefault();
    if (!b2bForm.fullName.trim() || !b2bForm.email.trim()) {
      alert('Full Name and Email are mandatory.');
      return;
    }

    setB2bSubmitting(true);
    const waMessage = `Hello iiNCEPT Team! 👋\n\nI want to request a corporate / retail quotation:\n\n👤 *Name:* ${b2bForm.fullName}\n🏢 *Company:* ${b2bForm.company || 'N/A'}\n📧 *Email:* ${b2bForm.email}\n📞 *Phone:* ${b2bForm.phone || 'N/A'}\n📦 *Product Interest:* ${b2bForm.productInterest}\n💬 *Message:* ${b2bForm.message || 'N/A'}`;
    const waUrl = `https://wa.me/918607222417?text=${encodeURIComponent(waMessage)}`;

    try {
      await axiosClient.post('/enquiries', {
        companyName: b2bForm.company || 'N/A',
        fullName: b2bForm.fullName,
        email: b2bForm.email,
        phone: b2bForm.phone,
        productInterest: b2bForm.productInterest,
        quantity: 1,
        message: b2bForm.message
      });
    } catch (err) {
      console.error('Enquiry submission note:', err);
    } finally {
      window.open(waUrl, '_blank');
      setB2bSuccess('Request submitted successfully! Opening WhatsApp chat...');
      setB2bForm({
        fullName: '',
        company: '',
        email: '',
        phone: '',
        productInterest: 'Select category',
        message: ''
      });
      setB2bSubmitting(false);
      setTimeout(() => setB2bSuccess(''), 5000);
    }
  };

  // Products from Database for New Arrivals & Trending
  const newArrivalsList = products.length > 0
    ? products.slice(0, 3).map(p => ({
        id: p._id || p.id,
        name: p.title || p.name,
        tagline: p.subtitle || p.description?.slice(0, 30) || 'Genuine Apple Product',
        price: `From ₹${(p.price || 79900).toLocaleString('en-IN')}`,
        monthlyPrice: `or ₹${Math.round((p.price || 79900) / 24).toLocaleString('en-IN')}/mo.*`,
        image: p.image || p.images?.[0] || '/iphone_nav/iphone_17_pro.png',
        path: `/product/${p._id || p.id}`
      }))
    : [
        { id: '1', name: 'iPhone 17 Pro', tagline: 'All out Pro.', price: 'From ₹1,34,900', monthlyPrice: 'or ₹5,621/mo.*', image: '/iphone_nav/iphone_17_pro.png', path: '/iphone' },
        { id: '2', name: 'MacBook Neo', tagline: 'Amazing Mac. Surprising price.', price: 'From ₹79,900', monthlyPrice: 'or ₹3,329/mo.*', image: '/mac_nav/macbook_neo.png', path: '/macbook' },
        { id: '3', name: 'Apple Watch Series 11', tagline: 'Smarter. Fitter. Brighter.', price: 'From ₹46,900', monthlyPrice: 'or ₹1,954/mo.*', image: '/watch_category_uploaded.png', path: '/watch' }
      ];

  const trendingList = products.length > 3
    ? products.slice(3, 7).map(p => ({
        id: p._id || p.id,
        name: p.title || p.name,
        price: `From ₹${(p.price || 59900).toLocaleString('en-IN')}`,
        image: p.image || p.images?.[0] || '/iphone_nav/iphone_17.png',
        path: `/product/${p._id || p.id}`
      }))
    : [
        { id: 't1', name: 'iPhone 17', price: 'From ₹82,900', image: '/iphone_nav/iphone_17.png', path: '/iphone' },
        { id: 't2', name: 'MacBook Air M5', price: 'From ₹1,09,900', image: '/mac_nav/macbook_air.png', path: '/macbook' },
        { id: 't3', name: 'AirPods Pro 3', price: 'From ₹24,900', image: '/airpods_category_uploaded.png', path: '/airpods' },
        { id: 't4', name: 'iPad Air M4', price: 'From ₹59,900', image: '/ipad_nav/ipad_air.png', path: '/ipad' }
      ];

  return (
    <div className="indiaistore-theme">
      <style>{`
        .indiaistore-theme {
          --apple-black: #1d1d1f;
          --apple-gray: #86868b;
          --apple-light: #f5f5f7;
          --apple-blue: #0071e3;
          --apple-blue-hover: #0077ed;
          --white: #ffffff;
          --border: #d2d2d7;
          --shadow: 0 4px 24px rgba(0,0,0,0.06);
          --shadow-hover: 0 12px 40px rgba(0,0,0,0.12);

          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', sans-serif;
          color: var(--apple-black);
          background: var(--white);
          line-height: 1.5;
          -webkit-font-smoothing: antialiased;
          user-select: none;
        }

        .indiaistore-theme a { text-decoration: none; color: inherit; }
        .indiaistore-theme img { max-width: 100%; display: block; }

        /* ========== HERO BANNER (Apple style full-width) ========== */
        .indiaistore-theme .hero-banner {
          position: relative;
          width: 100%;
          height: 580px;
          background: linear-gradient(180deg, #000000 0%, #1a1a1a 100%);
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          text-align: center;
        }

        .indiaistore-theme .hero-banner::before {
          content: '';
          position: absolute;
          inset: 0;
          background: radial-gradient(ellipse at center, rgba(0,113,227,0.15) 0%, transparent 70%);
          pointer-events: none;
        }

        .indiaistore-theme .hero-content {
          position: relative;
          z-index: 2;
          max-width: 800px;
          padding: 0 24px;
        }

        .indiaistore-theme .hero-eyebrow {
          font-size: 17px;
          font-weight: 600;
          color: #2997ff;
          margin-bottom: 12px;
          letter-spacing: -0.2px;
        }

        .indiaistore-theme .hero-banner h1 {
          font-size: clamp(42px, 7vw, 72px);
          font-weight: 700;
          letter-spacing: -2px;
          line-height: 1.05;
          margin-bottom: 16px;
        }

        .indiaistore-theme .hero-sub {
          font-size: 21px;
          color: rgba(255,255,255,0.85);
          max-width: 560px;
          margin: 0 auto 32px;
          font-weight: 400;
        }

        .indiaistore-theme .hero-ctas {
          display: flex;
          gap: 16px;
          justify-content: center;
          flex-wrap: wrap;
        }

        .indiaistore-theme .btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 12px 28px;
          border-radius: 980px;
          font-size: 17px;
          font-weight: 500;
          transition: all 0.25s ease;
          cursor: pointer;
          border: none;
          text-decoration: none;
        }

        .indiaistore-theme .btn-primary {
          background: var(--apple-blue);
          color: white !important;
        }
        .indiaistore-theme .btn-primary:hover {
          background: var(--apple-blue-hover);
          transform: scale(1.03);
        }

        .indiaistore-theme .btn-secondary {
          background: transparent;
          color: #2997ff !important;
          border: 1px solid rgba(41,151,255,0.6);
        }
        .indiaistore-theme .btn-secondary:hover {
          background: rgba(41,151,255,0.12);
        }

        .indiaistore-theme .hero-visual-hint {
          position: absolute;
          bottom: 40px;
          left: 50%;
          transform: translateX(-50%);
          font-size: 13px;
          color: rgba(255,255,255,0.4);
          letter-spacing: 0.5px;
        }

        .indiaistore-theme .hero-image-wrap {
          margin-top: 36px;
          width: 100%;
          max-width: 820px;
          margin-left: auto;
          margin-right: auto;
          border-radius: 24px;
          overflow: hidden;
          box-shadow: 0 20px 50px rgba(0,0,0,0.5);
          border: 1px solid rgba(255,255,255,0.12);
        }

        /* ========== CATEGORY STRIP (Apple Store style) ========== */
        .indiaistore-theme .category-strip {
          background: var(--white);
          border-bottom: 1px solid var(--border);
          padding: 28px 0 24px;
          overflow-x: auto;
          -webkit-overflow-scrolling: touch;
        }

        .indiaistore-theme .category-strip-inner {
          max-width: 1200px;
          margin: 0 auto;
          display: flex;
          justify-content: center;
          gap: 8px;
          padding: 0 22px;
          min-width: max-content;
        }

        .indiaistore-theme .strip-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
          padding: 8px 18px;
          min-width: 90px;
          cursor: pointer;
          transition: all 0.2s ease;
          border-radius: 12px;
          text-decoration: none;
        }

        .indiaistore-theme .strip-item:hover {
          background: var(--apple-light);
        }

        .indiaistore-theme .strip-icon {
          width: 56px;
          height: 56px;
          background: var(--apple-light);
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 26px;
          transition: transform 0.2s;
        }

        .indiaistore-theme .strip-item:hover .strip-icon {
          transform: scale(1.08);
        }

        .indiaistore-theme .strip-name {
          font-size: 12px;
          font-weight: 500;
          color: var(--apple-black);
          text-align: center;
          white-space: nowrap;
        }

        /* ========== SECTION COMMON ========== */
        .indiaistore-theme .section {
          padding: 64px 22px;
          max-width: 1400px;
          margin: 0 auto;
          background: #ffffff;
        }

        .indiaistore-theme .section-header {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          margin-bottom: 32px;
        }

        .indiaistore-theme .section-title {
          font-size: 28px;
          font-weight: 700;
          letter-spacing: -0.6px;
        }

        .indiaistore-theme .section-link {
          font-size: 17px;
          color: var(--apple-blue);
          font-weight: 500;
          text-decoration: none;
        }
        .indiaistore-theme .section-link:hover { text-decoration: underline; }

        /* ========== NEW ARRIVALS SLIDER ========== */
        .indiaistore-theme .new-arrivals-slider-wrap {
          position: relative;
          width: 100%;
          overflow: hidden;
        }

        .indiaistore-theme .new-arrivals-slider {
          display: flex;
          gap: 20px;
          overflow-x: auto;
          scroll-behavior: smooth;
          -webkit-overflow-scrolling: touch;
          padding: 8px 4px 20px;
          scrollbar-width: none;
        }
        .indiaistore-theme .new-arrivals-slider::-webkit-scrollbar { display: none; }

        .indiaistore-theme .product-card {
          background: #ffffff;
          border: 1px solid var(--border);
          border-radius: 20px;
          padding: 24px 20px 28px;
          text-align: center;
          transition: all 0.3s ease;
          cursor: pointer;
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: space-between;
          text-decoration: none;
          overflow: hidden;
          flex: 1 1 0px;
          min-width: 260px;
          box-sizing: border-box;
        }

        .indiaistore-theme .product-card:hover {
          transform: translateY(-6px);
          box-shadow: var(--shadow-hover);
        }

        .indiaistore-theme .product-card .badge {
          position: absolute;
          top: 16px;
          left: 16px;
          background: var(--apple-blue);
          color: white;
          font-size: 11px;
          font-weight: 600;
          padding: 4px 10px;
          border-radius: 980px;
          z-index: 2;
        }

        .indiaistore-theme .product-img {
          width: 100%;
          height: 180px;
          max-height: 180px;
          background: linear-gradient(135deg, #e8e8ed, #d2d2d7);
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 18px;
          overflow: hidden;
          position: relative;
          padding: 12px;
          box-sizing: border-box;
        }

        .indiaistore-theme .product-img img {
          max-height: 156px;
          max-width: 100%;
          width: auto;
          height: auto;
          object-fit: contain;
          mix-blend-mode: multiply;
          transition: transform 0.3s ease;
          display: block;
          margin: 0 auto;
        }

        .indiaistore-theme .product-card:hover .product-img img {
          transform: scale(1.05);
        }

        .indiaistore-theme .product-img .placeholder {
          width: 100%;
          height: 100%;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--apple-gray);
          font-size: 14px;
          font-weight: 500;
          text-align: center;
        }

        .indiaistore-theme .product-name {
          font-size: 20px;
          font-weight: 600;
          margin-bottom: 4px;
          letter-spacing: -0.3px;
          color: var(--apple-black);
          word-break: break-word;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .indiaistore-theme .product-tagline {
          font-size: 14px;
          color: var(--apple-gray);
          margin-bottom: 10px;
        }

        .indiaistore-theme .product-price {
          font-size: 16px;
          font-weight: 500;
          margin-bottom: 16px;
          color: var(--apple-black);
        }

        .indiaistore-theme .product-price span {
          color: var(--apple-gray);
          font-weight: 400;
          font-size: 13px;
        }

        .indiaistore-theme .shop-btn {
          display: inline-block;
          background: var(--apple-blue);
          color: white;
          font-size: 14px;
          font-weight: 500;
          padding: 8px 24px;
          border-radius: 980px;
          transition: background 0.2s;
        }
        .indiaistore-theme .product-card:hover .shop-btn {
          background: var(--apple-blue-hover);
        }

        /* ========== SHOP BY CATEGORY ========== */
        .indiaistore-theme .categories {
          background: var(--apple-light);
          padding: 64px 22px;
        }

        .indiaistore-theme .categories-inner { max-width: 1400px; margin: 0 auto; }

        .indiaistore-theme .category-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 18px;
        }

        .indiaistore-theme .category-card {
          background: white;
          border-radius: 18px;
          padding: 28px 18px 24px;
          text-align: center;
          transition: all 0.3s ease;
          cursor: pointer;
          box-shadow: var(--shadow);
          text-decoration: none;
        }

        .indiaistore-theme .category-card:hover {
          transform: translateY(-4px);
          box-shadow: var(--shadow-hover);
        }

        .indiaistore-theme .category-icon {
          width: 64px;
          height: 64px;
          margin: 0 auto 14px;
          background: var(--apple-light);
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 28px;
        }

        .indiaistore-theme .category-name {
          font-size: 17px;
          font-weight: 600;
          letter-spacing: -0.2px;
          color: var(--apple-black);
        }

        .indiaistore-theme .category-count {
          font-size: 12px;
          color: var(--apple-gray);
          margin-top: 3px;
        }

        /* ========== TRENDING SLIDER ========== */
        .indiaistore-theme .trending-slider-wrap {
          position: relative;
          width: 100%;
          overflow: hidden;
        }

        .indiaistore-theme .trending-slider {
          display: flex;
          gap: 20px;
          overflow-x: auto;
          scroll-behavior: smooth;
          -webkit-overflow-scrolling: touch;
          padding: 8px 4px 20px;
          scrollbar-width: none;
        }
        .indiaistore-theme .trending-slider::-webkit-scrollbar { display: none; }

        .indiaistore-theme .trending-card {
          background: #ffffff;
          border: 1px solid var(--border);
          border-radius: 20px;
          padding: 20px;
          transition: all 0.3s ease;
          cursor: pointer;
          text-decoration: none;
          overflow: hidden;
          box-sizing: border-box;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          flex: 1 1 0px;
          min-width: 220px;
        }

        .indiaistore-theme .trending-card:hover {
          border-color: #d2d2d7;
          box-shadow: var(--shadow-hover);
          transform: translateY(-4px);
        }

        .indiaistore-theme .trending-img {
          width: 100%;
          height: 160px;
          max-height: 160px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 14px;
          background: linear-gradient(135deg, #e3e3e8, #d8d8de);
          border-radius: 14px;
          overflow: hidden;
          padding: 12px;
          box-sizing: border-box;
          position: relative;
          color: #86868b;
          font-size: 14px;
          font-weight: 500;
          text-align: center;
        }

        .indiaistore-theme .trending-img img {
          max-height: 136px;
          max-width: 100%;
          width: auto;
          height: auto;
          object-fit: contain;
          mix-blend-mode: multiply;
          transition: transform 0.3s ease;
          display: block;
          margin: 0 auto;
        }

        .indiaistore-theme .trending-card:hover .trending-img img {
          transform: scale(1.05);
        }

        .indiaistore-theme .trending-name {
          font-size: 17px;
          font-weight: 600;
          margin-bottom: 4px;
          color: var(--apple-black);
          word-break: break-word;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          letter-spacing: -0.2px;
        }
        .indiaistore-theme .trending-price { font-size: 14px; color: var(--apple-gray); font-weight: 400; }

        /* ========== DEAL OF THE WEEK ========== */
        .indiaistore-theme .deal-banner {
          margin: 0 22px 64px;
          max-width: 1400px;
          margin-left: auto;
          margin-right: auto;
          background: linear-gradient(135deg, #1d1d1f 0%, #2c2c2e 100%);
          border-radius: 24px;
          padding: 48px;
          color: white;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 40px;
        }

        .indiaistore-theme .deal-content { flex: 1; max-width: 520px; }

        .indiaistore-theme .deal-eyebrow {
          font-size: 13px;
          font-weight: 600;
          color: #f5a623;
          letter-spacing: 1.2px;
          text-transform: uppercase;
          margin-bottom: 10px;
        }

        .indiaistore-theme .deal-title {
          font-size: 32px;
          font-weight: 700;
          letter-spacing: -0.7px;
          margin-bottom: 12px;
          line-height: 1.15;
        }

        .indiaistore-theme .deal-desc {
          font-size: 16px;
          opacity: 0.85;
          margin-bottom: 24px;
          line-height: 1.5;
        }

        .indiaistore-theme .deal-price {
          font-size: 26px;
          font-weight: 600;
          margin-bottom: 6px;
        }

        .indiaistore-theme .deal-price span {
          font-size: 15px;
          opacity: 0.65;
          text-decoration: line-through;
          margin-left: 10px;
        }

        .indiaistore-theme .deal-visual {
          flex-shrink: 0;
          width: 280px;
          height: 220px;
          background: rgba(255,255,255,0.06);
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: rgba(255,255,255,0.4);
          font-size: 14px;
        }

        /* ========== B2B ========== */
        .indiaistore-theme .b2b {
          background: var(--apple-light);
          padding: 64px 22px;
        }

        .indiaistore-theme .b2b-inner {
          max-width: 1100px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 48px;
          align-items: center;
        }

        .indiaistore-theme .b2b-text h2 {
          font-size: 28px;
          font-weight: 700;
          letter-spacing: -0.6px;
          margin-bottom: 14px;
        }

        .indiaistore-theme .b2b-text p {
          font-size: 16px;
          color: var(--apple-gray);
          margin-bottom: 20px;
          line-height: 1.6;
        }

        .indiaistore-theme .b2b-features {
          list-style: none;
          margin-bottom: 24px;
        }

        .indiaistore-theme .b2b-features li {
          font-size: 15px;
          margin-bottom: 9px;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .indiaistore-theme .b2b-features li::before {
          content: "✓";
          color: var(--apple-blue);
          font-weight: 700;
        }

        .indiaistore-theme .b2b-form {
          background: white;
          border-radius: 20px;
          padding: 28px;
          box-shadow: var(--shadow);
        }

        .indiaistore-theme .b2b-form h3 {
          font-size: 18px;
          font-weight: 600;
          margin-bottom: 18px;
        }

        .indiaistore-theme .form-group { margin-bottom: 14px; }

        .indiaistore-theme .form-group label {
          display: block;
          font-size: 12px;
          font-weight: 500;
          margin-bottom: 5px;
          color: var(--apple-gray);
        }

        .indiaistore-theme .form-group input,
        .indiaistore-theme .form-group select,
        .indiaistore-theme .form-group textarea {
          width: 100%;
          padding: 11px 13px;
          border: 1px solid var(--border);
          border-radius: 10px;
          font-size: 14px;
          font-family: inherit;
          transition: border-color 0.2s;
        }

        .indiaistore-theme .form-group input:focus,
        .indiaistore-theme .form-group select:focus,
        .indiaistore-theme .form-group textarea:focus {
          outline: none;
          border-color: var(--apple-blue);
        }

        .indiaistore-theme .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }

        /* ========== TESTIMONIALS SLIDER ========== */
        .indiaistore-theme .testimonials-section {
          background: #ffffff;
          width: 100%;
        }

        .indiaistore-theme .testimonials-slider-wrap {
          position: relative;
          width: 100%;
        }

        .indiaistore-theme .testimonials-slider {
          display: flex;
          gap: 20px;
          overflow-x: auto;
          scroll-behavior: smooth;
          -webkit-overflow-scrolling: touch;
          padding: 8px 4px 20px;
          scrollbar-width: none;
        }
        .indiaistore-theme .testimonials-slider::-webkit-scrollbar {
          display: none;
        }

        .indiaistore-theme .testimonial-card {
          flex: 0 0 380px;
          min-width: 320px;
          max-width: 400px;
          background: white;
          border: 1px solid var(--border);
          border-radius: 18px;
          padding: 24px;
          transition: all 0.25s ease;
          box-sizing: border-box;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }

        .indiaistore-theme .testimonial-card:hover {
          box-shadow: var(--shadow);
          transform: translateY(-2px);
        }

        .indiaistore-theme .slider-btn {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: var(--apple-light);
          border: 1px solid var(--border);
          color: var(--apple-black);
          display: inline-flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s ease;
          font-size: 16px;
          font-weight: bold;
          line-height: 1;
        }
        .indiaistore-theme .slider-btn:hover {
          background: var(--apple-blue);
          color: white;
          border-color: var(--apple-blue);
        }

        .indiaistore-theme .stars {
          color: #f5a623;
          font-size: 13px;
          margin-bottom: 12px;
          letter-spacing: 1.5px;
        }

        .indiaistore-theme .testimonial-text {
          font-size: 14px;
          line-height: 1.55;
          margin-bottom: 18px;
          color: #333;
        }

        .indiaistore-theme .testimonial-author {
          display: flex;
          align-items: center;
          gap: 11px;
        }

        .indiaistore-theme .author-avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: var(--apple-light);
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
          font-size: 14px;
          color: var(--apple-blue);
        }

        .indiaistore-theme .author-info strong {
          display: block;
          font-size: 13px;
          font-weight: 600;
        }

        .indiaistore-theme .author-info span {
          font-size: 12px;
          color: var(--apple-gray);
        }

        /* ========== RESPONSIVE ========== */
        @media (max-width: 1100px) {
          .indiaistore-theme .category-grid { grid-template-columns: repeat(4, 1fr); }
          .indiaistore-theme .deal-banner { flex-direction: column; text-align: center; padding: 36px 24px; }
          .indiaistore-theme .deal-visual { width: 100%; max-width: 280px; }
          .indiaistore-theme .b2b-inner { grid-template-columns: 1fr; }
        }

        @media (max-width: 768px) {
          .indiaistore-theme .hero-banner { height: 480px; }
          .indiaistore-theme .hero-banner h1 { font-size: 36px; }
          .indiaistore-theme .section { padding: 48px 16px; }
          .indiaistore-theme .category-grid { grid-template-columns: repeat(2, 1fr); gap: 12px; }
          .indiaistore-theme .testimonials-grid { grid-template-columns: 1fr; }
          .indiaistore-theme .form-row { grid-template-columns: 1fr; }
          .indiaistore-theme .category-strip-inner { justify-content: flex-start; }
          .indiaistore-theme .product-card { flex: 0 0 260px; min-width: 240px; }
          .indiaistore-theme .trending-card { flex: 0 0 200px; min-width: 180px; }
        }
      `}</style>

      {/* 1. HERO BANNER (Full-width Apple Style) */}
      <section className="hero-banner">
        <div className="hero-content">
          <div className="hero-eyebrow">
            {heroData.homeHeroBadge || 'Apple Authorised Resellers across India'}
          </div>
          <h1>{heroData.homeHeroTitle || 'The latest.\nThe best. Authorised.'}</h1>
          <p className="hero-sub">
            {heroData.homeHeroSubtitle || 'Genuine Apple products from India’s trusted mono-brand premium resellers. Exclusive offers, EMI & expert support.'}
          </p>
          <div className="hero-ctas">
            <Link to={heroData.homeHeroPrimaryBtnLink || '/iphone'} className="btn btn-primary">
              {heroData.homeHeroPrimaryBtnText || 'Shop Now'}
            </Link>
            {heroData.homeHeroSecondaryBtnLink?.startsWith('#') ? (
              <a
                href={heroData.homeHeroSecondaryBtnLink}
                onClick={(e) => {
                  e.preventDefault();
                  const targetId = heroData.homeHeroSecondaryBtnLink.replace('#', '');
                  const section = document.getElementById(targetId);
                  if (section) {
                    section.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }
                }}
                className="btn btn-secondary"
              >
                {heroData.homeHeroSecondaryBtnText || 'Find Nearest Store'}
              </a>
            ) : (
              <Link to={heroData.homeHeroSecondaryBtnLink || '/stores'} className="btn btn-secondary">
                {heroData.homeHeroSecondaryBtnText || 'Find Nearest Store'}
              </Link>
            )}
          </div>

          {heroData.homeHeroImage && (
            <div className="hero-image-wrap">
              <img
                src={heroData.homeHeroImage}
                alt="Apple Reseller Showcase"
                className="w-full h-auto max-h-[420px] object-cover"
              />
            </div>
          )}
        </div>
      </section>

      {/* 2. CATEGORY STRIP (Apple.com/store Style) */}
      <div className="category-strip">
        <div className="category-strip-inner">
          {categoryStrip.map((item, idx) => {
            const hasImg = Boolean(item.image && item.image.trim());
            return (
              <Link key={idx} to={item.path || '/shop'} className="strip-item">
                <div className="strip-icon">
                  {hasImg ? (
                    <img
                      src={item.image.startsWith('/') || item.image.startsWith('http') ? item.image : '/' + item.image}
                      alt={item.label || item.name}
                      className="w-full h-full object-contain p-1"
                      onError={(e) => { e.currentTarget.style.display = 'none'; }}
                    />
                  ) : (
                    <span>{item.icon || '📱'}</span>
                  )}
                </div>
                <div className="strip-name">{item.label || item.name}</div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* 3. NEW ARRIVALS SLIDER */}
      <section className="section">
        <div className="section-header">
          <h2 className="section-title">New Arrivals</h2>
          <Link to="/shop?sort=newest" className="section-link">View all →</Link>
        </div>
        <div className="new-arrivals-slider-wrap">
          <div className="new-arrivals-slider">
            {newArrivalsList.map((item) => (
              <Link key={item.id} to={item.path} className="product-card">
                <span className="badge">New</span>
                <div className="product-img">
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.name}
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        if (e.currentTarget.parentElement) {
                          e.currentTarget.parentElement.innerText = item.name;
                        }
                      }}
                    />
                  ) : (
                    <span>{item.name}</span>
                  )}
                </div>
                <div style={{ width: '100%' }}>
                  <div className="product-name">{item.name}</div>
                  <div className="product-tagline">{item.tagline}</div>
                  <div className="product-price">
                    {item.price} <span>{item.monthlyPrice}</span>
                  </div>
                </div>
                <div className="shop-btn">Shop</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 4. SHOP BY CATEGORY */}
      <section className="categories">
        <div className="categories-inner">
          <div className="section-header" style={{ marginBottom: '28px' }}>
            <h2 className="section-title">Shop by Category</h2>
          </div>
          <div className="category-grid">
            {appleCategories.map((cat, idx) => (
              <Link key={idx} to={cat.link || '/shop'} className="category-card">
                <div className="category-icon">{cat.icon || '📱'}</div>
                <div className="category-name">{cat.name}</div>
                <div className="category-count">{cat.count || 'Explore Collection'}</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 5. TRENDING NOW SLIDER */}
      <section className="section">
        <div className="section-header">
          <h2 className="section-title">Trending Now</h2>
          <Link to="/shop" className="section-link">View all →</Link>
        </div>
        <div className="trending-slider-wrap">
          <div className="trending-slider">
            {trendingList.map((item) => (
              <Link key={item.id} to={item.path} className="trending-card">
                <div className="trending-img">
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.name}
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        if (e.currentTarget.parentElement) {
                          e.currentTarget.parentElement.innerText = item.name;
                        }
                      }}
                    />
                  ) : (
                    <span>{item.name}</span>
                  )}
                </div>
                <div>
                  <div className="trending-name">{item.name}</div>
                  <div className="trending-price">{item.price}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 6. DEAL OF THE WEEK */}
      <div className="deal-banner">
        <div className="deal-content">
          <div className="deal-eyebrow">{dealData.dealEyebrow || 'Deal of the Week'}</div>
          <h2 className="deal-title">{dealData.dealTitle || 'MacBook Neo – Stock Clearance'}</h2>
          <p className="deal-desc">
            {dealData.dealDesc || 'Amazing Mac at a surprising price. Limited stock this week. Exclusive bank offers + free AppleCare+ for first 50 buyers.'}
          </p>
          <div className="deal-price">
            {dealData.dealPrice || '₹72,900'} <span>{dealData.dealOldPrice || '₹79,900'}</span>
          </div>
          <Link to={dealData.dealButtonLink || '/macbook'} className="btn btn-primary" style={{ marginTop: '18px' }}>
            {dealData.dealButtonText || 'Grab the Deal'}
          </Link>
        </div>
        <div className="deal-visual">
          <img src={dealData.dealImage || '/mac_nav/macbook_neo.png'} alt="MacBook Deal" className="max-h-full max-w-full object-contain filter drop-shadow-lg" />
        </div>
      </div>

      {/* 7. B2B / CORPORATE ORDERS */}
      <section id="b2b-section" className="b2b">
        <div className="b2b-inner">
          <div className="b2b-text">
            <h2>Corporate & B2B Orders</h2>
            <p>Looking for volume purchases, education pricing or enterprise solutions? Our dedicated team helps businesses get the right Apple setup with preferential pricing and support.</p>
            <ul className="b2b-features">
              <li>Volume & bulk pricing</li>
              <li>Dedicated account manager</li>
              <li>AppleCare for Enterprise</li>
              <li>Education & institutional discounts</li>
              <li>Fast delivery across India</li>
            </ul>
            <a
              href="https://wa.me/918607222417?text=Hello%20iiNCEPT%20B2B%20Desk!%20I%20want%20to%20talk%20to%20sales."
              target="_blank"
              rel="noreferrer"
              className="btn btn-primary"
            >
              Talk to Sales
            </a>
          </div>

          <div className="b2b-form">
            <h3>Request a Quote</h3>
            {b2bSuccess && (
              <div style={{ background: '#ecfdf5', border: '1px solid #a7f3d0', color: '#065f46', fontSize: '12px', fontWeight: 'bold', padding: '10px', borderRadius: '8px', marginBottom: '14px' }}>
                {b2bSuccess}
              </div>
            )}
            <form onSubmit={handleB2bSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label>Full Name *</label>
                  <input
                    type="text"
                    placeholder="Your name"
                    value={b2bForm.fullName}
                    onChange={(e) => setB2bForm({ ...b2bForm, fullName: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Company</label>
                  <input
                    type="text"
                    placeholder="Company name"
                    value={b2bForm.company}
                    onChange={(e) => setB2bForm({ ...b2bForm, company: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Email *</label>
                  <input
                    type="email"
                    placeholder="work@email.com"
                    value={b2bForm.email}
                    onChange={(e) => setB2bForm({ ...b2bForm, email: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Phone</label>
                  <input
                    type="tel"
                    placeholder="+91 98765 43210"
                    value={b2bForm.phone}
                    onChange={(e) => setB2bForm({ ...b2bForm, phone: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Product Interest</label>
                <select
                  value={b2bForm.productInterest}
                  onChange={(e) => setB2bForm({ ...b2bForm, productInterest: e.target.value })}
                >
                  <option disabled>Select category</option>
                  <option value="Mac">Mac</option>
                  <option value="iPhone">iPhone</option>
                  <option value="iPad">iPad</option>
                  <option value="Watch & Accessories">Watch & Accessories</option>
                  <option value="Mixed / Multiple">Mixed / Multiple</option>
                </select>
              </div>

              <div className="form-group">
                <label>Message (optional)</label>
                <textarea
                  rows={3}
                  placeholder="Quantity, timeline, any specific requirements..."
                  value={b2bForm.message}
                  onChange={(e) => setB2bForm({ ...b2bForm, message: e.target.value })}
                />
              </div>

              <button
                type="submit"
                disabled={b2bSubmitting}
                className="btn btn-primary"
                style={{ width: '100%', marginTop: '6px' }}
              >
                {b2bSubmitting ? 'Submitting...' : 'Submit Request'}
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* 8. TESTIMONIALS SLIDER */}
      <section className="section testimonials-section">
        <div className="section-header">
          <h2 className="section-title">What Our Customers Say</h2>
          <div className="flex items-center gap-2">
            <button
              onClick={() => scrollTestimonials('left')}
              className="slider-btn"
              title="Previous"
              aria-label="Previous Testimonials"
            >
              ←
            </button>
            <button
              onClick={() => scrollTestimonials('right')}
              className="slider-btn"
              title="Next"
              aria-label="Next Testimonials"
            >
              →
            </button>
          </div>
        </div>
        <div className="testimonials-slider-wrap">
          <div ref={testimonialSliderRef} className="testimonials-slider">
            {testimonials.map((item, idx) => (
              <div key={idx} className="testimonial-card">
                <div>
                  <div className="stars">
                    {'★'.repeat(item.stars || 5)}
                  </div>
                  <p className="testimonial-text">{item.text}</p>
                </div>
                <div className="testimonial-author">
                  <div className="author-avatar">
                    {item.author ? item.author.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() : 'AS'}
                  </div>
                  <div className="author-info">
                    <strong>{item.author}</strong>
                    <span>{item.sub}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}

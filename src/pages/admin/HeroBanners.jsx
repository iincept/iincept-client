import { useState, useEffect } from 'react';
import { 
  Check, 
  Loader2, 
  Plus, 
  Trash2, 
  Upload, 
  X, 
  ArrowUp, 
  ArrowDown, 
  Image as ImageIcon,
  Eye,
  EyeOff,
  Star,
  Home
} from 'lucide-react';
import axiosClient from '../../services/axiosClient';

export default function HeroBanners() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);
  const [uploadingIndex, setUploadingIndex] = useState(null);

  const [siteForm, setSiteForm] = useState({
    homeHeroBadge: 'Apple Authorised Resellers across India',
    homeHeroTitle: 'The latest.\nThe best. Authorised.',
    homeHeroSubtitle: 'Genuine Apple products from India’s trusted mono-brand premium resellers. Exclusive offers, EMI & expert support.',
    homeHeroPrimaryBtnText: 'Shop Now',
    homeHeroPrimaryBtnLink: '/iphone',
    homeHeroSecondaryBtnText: 'Find Nearest Store',
    homeHeroSecondaryBtnLink: '#store-locator',
    homeHeroImage: '',
    dealEyebrow: 'Deal of the Week',
    dealTitle: 'MacBook Neo – Stock Clearance',
    dealDesc: 'Amazing Mac at a surprising price. Limited stock this week. Exclusive bank offers + free AppleCare+ for first 50 buyers.',
    dealPrice: '₹72,900',
    dealOldPrice: '₹79,900',
    dealButtonText: 'Grab the Deal',
    dealButtonLink: '/macbook',
    dealImage: '/mac_nav/macbook_neo.png',
    announcement: '',
    announcementBold: '',
    announcementNormal: '',
    heroSlides: [],
    testimonials: [],
    homeCategoryIcons: []
  });

  useEffect(() => {
    fetchSiteSettings();
  }, []);

  const fetchSiteSettings = async () => {
    try {
      const response = await axiosClient.get('/settings');
      if (response.data) {
        setSiteForm({
          homeHeroBadge: response.data.homeHeroBadge || 'Apple Authorised Resellers across India',
          homeHeroTitle: response.data.homeHeroTitle || 'The latest.\nThe best. Authorised.',
          homeHeroSubtitle: response.data.homeHeroSubtitle || 'Genuine Apple products from India’s trusted mono-brand premium resellers. Exclusive offers, EMI & expert support.',
          homeHeroPrimaryBtnText: response.data.homeHeroPrimaryBtnText || 'Shop Now',
          homeHeroPrimaryBtnLink: response.data.homeHeroPrimaryBtnLink || '/iphone',
          homeHeroSecondaryBtnText: response.data.homeHeroSecondaryBtnText || 'Find Nearest Store',
          homeHeroSecondaryBtnLink: response.data.homeHeroSecondaryBtnLink || '#store-locator',
          homeHeroImage: response.data.homeHeroImage || '',
          dealEyebrow: response.data.dealEyebrow || 'Deal of the Week',
          dealTitle: response.data.dealTitle || 'MacBook Neo – Stock Clearance',
          dealDesc: response.data.dealDesc || 'Amazing Mac at a surprising price. Limited stock this week. Exclusive bank offers + free AppleCare+ for first 50 buyers.',
          dealPrice: response.data.dealPrice || '₹72,900',
          dealOldPrice: response.data.dealOldPrice || '₹79,900',
          dealButtonText: response.data.dealButtonText || 'Grab the Deal',
          dealButtonLink: response.data.dealButtonLink || '/macbook',
          dealImage: response.data.dealImage || '/mac_nav/macbook_neo.png',
          homeCategoryIcons: response.data.homeCategoryIcons || [],
          announcement: response.data.announcement || '',
          announcementBold: response.data.announcementBold || '🔥 FREE SHIPPING',
          announcementNormal: response.data.announcementNormal || 'ON ORDERS ABOVE INR 1,499',
          testimonials: response.data.testimonials && response.data.testimonials.length > 0
            ? response.data.testimonials.map(t => ({ ...t, isActive: t.isActive !== false }))
            : [
                { stars: 5, text: '"Procured 40 MacBooks for our new office in 3 days, GST invoice sorted same week."', author: '— IT Head, Fintech firm, Bengaluru', isActive: true },
                { stars: 5, text: '"Our gifting desk orders AirPods every quarter — consolidated billing makes finance happy."', author: '— Procurement Lead, D2C brand, Mumbai', isActive: true },
                { stars: 5, text: '"Quote turnaround was faster than two other resellers we checked."', author: '— Ops Manager, Consulting firm, Delhi NCR', isActive: true },
                { stars: 5, text: '"Reliable for repeat bulk orders, delivered to three city offices without issue."', author: '— Admin Head, BPO, Pune', isActive: true }
              ],
          heroSlides: response.data.heroSlides && response.data.heroSlides.length > 0 
            ? response.data.heroSlides.map(s => ({ 
                ...s, 
                isActive: s.isActive !== false,
                titleBold: s.titleBold || '',
                titleNormal: s.titleNormal || '',
                stat1Bold: s.stat1Bold || 'GST invoicing',
                stat1Normal: s.stat1Normal || 'on every order',
                stat2Bold: s.stat2Bold || 'Volume pricing',
                stat2Normal: s.stat2Normal || 'on bulk orders',
                stat3Bold: s.stat3Bold || 'Pan-India',
                stat3Normal: s.stat3Normal || 'delivery & tracking',
              }))
            : [
                {
                  title: response.data.heroTitle1 || "Apple devices for your business, sourced right, delivered anywhere in India.",
                  titleBold: "Apple devices for your business,",
                  titleNormal: "sourced right, delivered anywhere in India.",
                  subtitle: response.data.heroSubtitle1 || "Bulk pricing, GST invoicing, dedicated account support and consolidated billing.",
                  buttonText: response.data.heroButtonText1 || "Request Bulk Quote →",
                  buttonLink: "#procurement-section",
                  image: "",
                  bgStyle: "slide-dark",
                  isActive: true,
                  stat1Bold: "GST invoicing",
                  stat1Normal: "on every order",
                  stat2Bold: "Volume pricing",
                  stat2Normal: "on bulk orders",
                  stat3Bold: "Pan-India",
                  stat3Normal: "delivery & tracking",
                },
                {
                  title: response.data.heroTitle2 || "The latest Apple lineup, in stock and ready to ship today.",
                  titleBold: "The latest Apple lineup,",
                  titleNormal: "in stock and ready to ship today.",
                  subtitle: response.data.heroSubtitle2 || "From the newest iPhone 17 series to our best-selling MacBooks and AirPods.",
                  buttonText: response.data.heroButtonText2 || "Browse Catalogue →",
                  buttonLink: "#apple-categories",
                  image: "",
                  bgStyle: "slide-light",
                  isActive: true,
                  stat1Bold: "New launches",
                  stat1Normal: "every month",
                  stat2Bold: "Curated",
                  stat2Normal: "best-sellers",
                  stat3Bold: "Fast dispatch,",
                  stat3Normal: "2–4 days",
                }
              ],
        });
      }
    } catch (err) {
      console.error('Failed to load hero banner settings:', err);
    }
  };

  const handleSiteSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axiosClient.put('/settings', siteForm);
      showSuccessMessage('Homepage & Hero Banners updated successfully!');
    } catch (err) {
      alert(err.response?.data?.message || err.message || 'Failed to update settings');
    } finally {
      setLoading(false);
    }
  };

  const handleAddSlide = () => {
    setSiteForm((prev) => ({
      ...prev,
      heroSlides: [
        ...prev.heroSlides,
        {
          title: "New Promotional Banner Title",
          subtitle: "Add your banner description or promotional offer text here.",
          buttonText: "Explore Now →",
          buttonLink: "/shop",
          image: "",
          bgStyle: "slide-dark",
          isActive: true
        }
      ]
    }));
  };

  const handleRemoveSlide = (index) => {
    if (siteForm.heroSlides.length <= 1) {
      alert("At least 1 hero banner is required.");
      return;
    }
    setSiteForm((prev) => ({
      ...prev,
      heroSlides: prev.heroSlides.filter((_, i) => i !== index)
    }));
  };

  const handleSlideChange = (index, field, value) => {
    setSiteForm((prev) => {
      const updatedSlides = [...prev.heroSlides];
      updatedSlides[index] = {
        ...updatedSlides[index],
        [field]: value
      };
      return { ...prev, heroSlides: updatedSlides };
    });
  };

  const handleToggleActive = (index) => {
    setSiteForm((prev) => {
      const updatedSlides = [...prev.heroSlides];
      const currentActive = updatedSlides[index].isActive !== false;
      updatedSlides[index] = {
        ...updatedSlides[index],
        isActive: !currentActive
      };
      return { ...prev, heroSlides: updatedSlides };
    });
  };

  const handleMoveToFirst = (index) => {
    if (index === 0) return;
    setSiteForm((prev) => {
      const updatedSlides = [...prev.heroSlides];
      const [targetSlide] = updatedSlides.splice(index, 1);
      updatedSlides.unshift(targetSlide);
      return { ...prev, heroSlides: updatedSlides };
    });
  };

  const handleMoveSlide = (index, direction) => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= siteForm.heroSlides.length) return;

    setSiteForm((prev) => {
      const updatedSlides = [...prev.heroSlides];
      const temp = updatedSlides[index];
      updatedSlides[index] = updatedSlides[targetIndex];
      updatedSlides[targetIndex] = temp;
      return { ...prev, heroSlides: updatedSlides };
    });
  };

  const handleAddTestimonial = () => {
    setSiteForm((prev) => ({
      ...prev,
      testimonials: [
        ...prev.testimonials,
        {
          stars: 5,
          text: '"Enter customer review or quote here..."',
          author: '— Customer Name, Role, City',
          isActive: true
        }
      ]
    }));
  };

  const handleRemoveTestimonial = (index) => {
    setSiteForm((prev) => ({
      ...prev,
      testimonials: prev.testimonials.filter((_, i) => i !== index)
    }));
  };

  const handleTestimonialChange = (index, field, value) => {
    setSiteForm((prev) => {
      const updated = [...prev.testimonials];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, testimonials: updated };
    });
  };

  const handleToggleTestimonialActive = (index) => {
    setSiteForm((prev) => {
      const updated = [...prev.testimonials];
      const currentActive = updated[index].isActive !== false;
      updated[index] = { ...updated[index], isActive: !currentActive };
      return { ...prev, testimonials: updated };
    });
  };

  const handleMoveTestimonial = (index, direction) => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= siteForm.testimonials.length) return;

    setSiteForm((prev) => {
      const updated = [...prev.testimonials];
      const temp = updated[index];
      updated[index] = updated[targetIndex];
      updated[targetIndex] = temp;
      return { ...prev, testimonials: updated };
    });
  };

  const handleBannerImageUpload = async (index, e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingIndex(index);
    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await axiosClient.post('/upload/single', formData);
      if (response.data && response.data.url) {
        handleSlideChange(index, 'image', response.data.url);
        showSuccessMessage('Banner image uploaded successfully!');
      }
    } catch (err) {
      console.warn('Server upload fallback triggered:', err);
      const reader = new FileReader();
      reader.onloadend = () => {
        handleSlideChange(index, 'image', reader.result);
        showSuccessMessage('Banner image loaded!');
      };
      reader.readAsDataURL(file);
    } finally {
      setUploadingIndex(null);
    }
  };

  const showSuccessMessage = (msg) => {
    setSuccess(msg);
    setTimeout(() => setSuccess(null), 3000);
  };

  return (
    <div className="text-left space-y-6">
      {success && (
        <div className="fixed bottom-6 right-6 bg-zinc-900 text-white py-3.5 px-5 rounded-2xl shadow-xl flex items-center gap-3 border border-zinc-800 animate-in fade-in slide-in-from-bottom-5 duration-300 z-50">
          <Check className="h-5 w-5 text-emerald-400" />
          <span className="text-sm font-medium">{success}</span>
        </div>
      )}

      <header className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 font-sans flex items-center gap-2.5">
            <Home className="h-6 w-6 text-[#0071e3]" />
            Hero Banners & Slider Manager
          </h1>
          <p className="text-zinc-500 mt-1 text-sm">Add custom banner images, title text, CTA buttons, and control visibility for homepage slides.</p>
        </div>

        <button
          type="button"
          onClick={handleAddSlide}
          className="flex items-center gap-2 bg-[#0071e3] hover:bg-[#005bb5] text-white px-5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer border-0 shadow-sm"
        >
          <Plus className="h-4 w-4" />
          Add Hero Slide
        </button>
      </header>

      <div className="bg-white rounded-3xl border border-zinc-150 shadow-sm p-8 max-w-4xl mx-auto">
        <form onSubmit={handleSiteSubmit} className="space-y-8">
          {/* Main IndiaStore Style Homepage Hero Section Form */}
          <div className="bg-zinc-900 text-white rounded-2xl p-6 space-y-4 shadow-md border border-zinc-800">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div>
                <span className="text-[10px] text-[#0071e3] uppercase font-extrabold tracking-widest block">MAIN HOMEPAGE HERO BANNER</span>
                <h3 className="text-lg font-bold text-white">IndiaStore Style Dark Hero Section</h3>
              </div>
              <span className="bg-[#0071e3]/20 text-[#0071e3] text-[11px] font-bold px-3 py-1 rounded-full border border-[#0071e3]/40">
                Live Active Hero
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-1">Top Blue Badge Text</label>
                <input
                  type="text"
                  value={siteForm.homeHeroBadge || ''}
                  onChange={(e) => setSiteForm({ ...siteForm, homeHeroBadge: e.target.value })}
                  placeholder="e.g. Apple Authorised Resellers across India"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-700 bg-zinc-800 text-white focus:border-[#0071e3] outline-none text-sm font-semibold"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-1">Main Large Headline (Use Enter/Line Breaks for stacked lines)</label>
                <textarea
                  rows={2}
                  value={siteForm.homeHeroTitle || ''}
                  onChange={(e) => setSiteForm({ ...siteForm, homeHeroTitle: e.target.value })}
                  placeholder="The latest.&#10;The best. Authorised."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-700 bg-zinc-800 text-white focus:border-[#0071e3] outline-none text-base font-extrabold tracking-tight font-mono"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-1">Subtitle Description</label>
                <textarea
                  rows={2}
                  value={siteForm.homeHeroSubtitle || ''}
                  onChange={(e) => setSiteForm({ ...siteForm, homeHeroSubtitle: e.target.value })}
                  placeholder="Genuine Apple products from India’s trusted mono-brand premium resellers. Exclusive offers, EMI & expert support."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-700 bg-zinc-800 text-white focus:border-[#0071e3] outline-none text-xs leading-relaxed"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-1">Primary Button Label</label>
                <input
                  type="text"
                  value={siteForm.homeHeroPrimaryBtnText || ''}
                  onChange={(e) => setSiteForm({ ...siteForm, homeHeroPrimaryBtnText: e.target.value })}
                  placeholder="e.g. Shop Now"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-700 bg-zinc-800 text-white focus:border-[#0071e3] outline-none text-sm font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-1">Primary Button Link</label>
                <input
                  type="text"
                  value={siteForm.homeHeroPrimaryBtnLink || ''}
                  onChange={(e) => setSiteForm({ ...siteForm, homeHeroPrimaryBtnLink: e.target.value })}
                  placeholder="e.g. /iphone or /shop"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-700 bg-zinc-800 text-white focus:border-[#0071e3] outline-none text-xs font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-1">Secondary Button Label</label>
                <input
                  type="text"
                  value={siteForm.homeHeroSecondaryBtnText || ''}
                  onChange={(e) => setSiteForm({ ...siteForm, homeHeroSecondaryBtnText: e.target.value })}
                  placeholder="e.g. Find Nearest Store"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-700 bg-zinc-800 text-white focus:border-[#0071e3] outline-none text-sm font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-1">Secondary Button Link</label>
                <input
                  type="text"
                  value={siteForm.homeHeroSecondaryBtnLink || ''}
                  onChange={(e) => setSiteForm({ ...siteForm, homeHeroSecondaryBtnLink: e.target.value })}
                  placeholder="e.g. #store-locator or /stores"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-700 bg-zinc-800 text-white focus:border-[#0071e3] outline-none text-xs font-mono"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-1">Hero Image (Optional Upload or Custom Image URL)</label>
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={siteForm.homeHeroImage || ''}
                    onChange={(e) => setSiteForm({ ...siteForm, homeHeroImage: e.target.value })}
                    placeholder="e.g. /iphone_category_uploaded.jpg or https://..."
                    className="flex-1 px-3.5 py-2.5 rounded-xl border border-zinc-700 bg-zinc-800 text-white focus:border-[#0071e3] outline-none text-xs font-mono"
                  />
                  <label className="bg-[#0071e3] hover:bg-[#005bb5] text-white px-4 py-2.5 rounded-xl text-xs font-bold cursor-pointer flex items-center gap-1.5 shrink-0">
                    <Upload className="h-4 w-4" />
                    <span>Upload Image</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        const formData = new FormData();
                        formData.append('image', file);
                        try {
                          const res = await axiosClient.post('/upload/single', formData);
                          if (res.data?.url) {
                            setSiteForm(prev => ({ ...prev, homeHeroImage: res.data.url }));
                          }
                        } catch (err) {
                          const reader = new FileReader();
                          reader.onloadend = () => setSiteForm(prev => ({ ...prev, homeHeroImage: reader.result }));
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                  </label>
                </div>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="bg-[#0071e3] hover:bg-[#005bb5] text-white px-6 py-2.5 rounded-xl text-xs font-extrabold flex items-center gap-2 cursor-pointer transition-all shadow-md"
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                <span>Save Homepage Hero Settings</span>
              </button>
            </div>
          </div>

          <div className="space-y-3">
            <span className="text-[10px] text-zinc-400 uppercase font-extrabold tracking-widest block">PROMOTIONAL ANNOUNCEMENT BANNER</span>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1">Bold Highlight Portion</label>
                <input
                  type="text"
                  value={siteForm.announcementBold || ''}
                  onChange={(e) => {
                    const boldVal = e.target.value;
                    setSiteForm(prev => ({
                      ...prev,
                      announcementBold: boldVal,
                      announcement: `${boldVal} ${prev.announcementNormal || ''}`.trim()
                    }));
                  }}
                  placeholder="e.g. 🔥 FREE SHIPPING"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 focus:border-[#0071e3] outline-none text-sm font-bold text-zinc-900 bg-zinc-50"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1">Normal Text Portion</label>
                <input
                  type="text"
                  value={siteForm.announcementNormal || ''}
                  onChange={(e) => {
                    const normVal = e.target.value;
                    setSiteForm(prev => ({
                      ...prev,
                      announcementNormal: normVal,
                      announcement: `${prev.announcementBold || ''} ${normVal}`.trim()
                    }));
                  }}
                  placeholder="e.g. ON ORDERS ABOVE INR 1,499"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 focus:border-[#0071e3] outline-none text-sm font-normal text-zinc-800 bg-white"
                />
              </div>
            </div>
            <div>
              <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1">Full Combined Announcement Notice</label>
              <input
                type="text"
                value={siteForm.announcement}
                onChange={(e) => setSiteForm({...siteForm, announcement: e.target.value})}
                placeholder="e.g. 🔥 FREE SHIPPING ON ORDERS ABOVE INR 1,499"
                className="w-full px-3.5 py-2 rounded-xl border border-zinc-200 text-xs focus:border-[#0071e3] outline-none text-zinc-600"
              />
            </div>
          </div>

          <hr className="border-zinc-100" />

          {/* Deal of the Week Banner Settings */}
          <div className="space-y-4">
            <div>
              <span className="text-[10px] text-amber-600 uppercase font-extrabold tracking-widest block">DEAL OF THE WEEK BANNER</span>
              <h3 className="text-base font-bold text-zinc-900 mt-0.5">Customize Homepage Featured Deal</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1">Eyebrow Tag</label>
                <input
                  type="text"
                  value={siteForm.dealEyebrow || ''}
                  onChange={(e) => setSiteForm({ ...siteForm, dealEyebrow: e.target.value })}
                  placeholder="e.g. Deal of the Week"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 focus:border-[#0071e3] outline-none text-sm font-semibold text-zinc-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1">Deal Title</label>
                <input
                  type="text"
                  value={siteForm.dealTitle || ''}
                  onChange={(e) => setSiteForm({ ...siteForm, dealTitle: e.target.value })}
                  placeholder="e.g. MacBook Neo – Stock Clearance"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 focus:border-[#0071e3] outline-none text-sm font-semibold text-zinc-900"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1">Deal Description</label>
                <textarea
                  rows={2}
                  value={siteForm.dealDesc || ''}
                  onChange={(e) => setSiteForm({ ...siteForm, dealDesc: e.target.value })}
                  placeholder="Deal details, offers, warranty..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 focus:border-[#0071e3] outline-none text-xs text-zinc-800"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1">Deal Special Price</label>
                <input
                  type="text"
                  value={siteForm.dealPrice || ''}
                  onChange={(e) => setSiteForm({ ...siteForm, dealPrice: e.target.value })}
                  placeholder="e.g. ₹72,900"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 focus:border-[#0071e3] outline-none text-sm font-bold text-emerald-700"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1">Original Price (Crossed)</label>
                <input
                  type="text"
                  value={siteForm.dealOldPrice || ''}
                  onChange={(e) => setSiteForm({ ...siteForm, dealOldPrice: e.target.value })}
                  placeholder="e.g. ₹79,900"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 focus:border-[#0071e3] outline-none text-sm font-normal text-zinc-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1">Button Text</label>
                <input
                  type="text"
                  value={siteForm.dealButtonText || ''}
                  onChange={(e) => setSiteForm({ ...siteForm, dealButtonText: e.target.value })}
                  placeholder="e.g. Grab the Deal"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 focus:border-[#0071e3] outline-none text-xs text-zinc-800"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1">Button Target Link</label>
                <input
                  type="text"
                  value={siteForm.dealButtonLink || ''}
                  onChange={(e) => setSiteForm({ ...siteForm, dealButtonLink: e.target.value })}
                  placeholder="e.g. /macbook"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 focus:border-[#0071e3] outline-none text-xs text-zinc-800"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1">Deal Image URL or Upload</label>
                <div className="flex gap-3 items-center">
                  <input
                    type="text"
                    value={siteForm.dealImage || ''}
                    onChange={(e) => setSiteForm({ ...siteForm, dealImage: e.target.value })}
                    placeholder="e.g. /mac_nav/macbook_neo.png or image URL"
                    className="flex-1 px-3.5 py-2.5 rounded-xl border border-zinc-200 focus:border-[#0071e3] outline-none text-xs text-zinc-800"
                  />
                  <label className="bg-zinc-100 hover:bg-zinc-200 text-zinc-800 text-xs font-bold px-4 py-2.5 rounded-xl cursor-pointer flex items-center gap-1.5 transition-all">
                    <Upload className="h-3.5 w-3.5" />
                    <span>Upload</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const formData = new FormData();
                          formData.append('image', file);
                          try {
                            const res = await axiosClient.post('/upload', formData, {
                              headers: { 'Content-Type': 'multipart/form-data' }
                            });
                            if (res.data.imageUrl) {
                              setSiteForm(prev => ({ ...prev, dealImage: res.data.imageUrl }));
                            }
                          } catch (err) {
                            alert('Image upload failed');
                          }
                        }
                      }}
                    />
                  </label>
                </div>
              </div>
            </div>
          </div>

          <hr className="border-zinc-100" />

          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] text-zinc-400 uppercase font-extrabold tracking-widest block">HOMEPAGE HERO SLIDES ({siteForm.heroSlides.length})</span>
                <h3 className="text-base font-bold text-zinc-900 mt-0.5">Manage All Active & Hidden Slides</h3>
              </div>
            </div>

            <div className="space-y-4">
              {siteForm.heroSlides.map((slide, index) => (
                <div 
                  key={index}
                  className={`p-5 border rounded-2xl space-y-4 relative transition-all ${
                    slide.isActive !== false 
                      ? 'bg-zinc-50 border-zinc-200 hover:border-zinc-300' 
                      : 'bg-zinc-100/70 border-zinc-250 opacity-75'
                  }`}
                >
                  <div className="flex flex-wrap items-center justify-between border-b border-zinc-200 pb-3 gap-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="bg-zinc-900 text-white text-[11px] font-bold px-2.5 py-1 rounded-lg">
                        Slide #{index + 1} {index === 0 && ' (Shown 1st)'}
                      </span>
                      
                      {slide.isActive !== false ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-100 border border-emerald-300 px-2 py-0.5 rounded-md">
                          <Eye className="h-3 w-3 text-emerald-600" /> Visible Live
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-zinc-600 bg-zinc-200 border border-zinc-300 px-2 py-0.5 rounded-md">
                          <EyeOff className="h-3 w-3 text-zinc-500" /> Hidden
                        </span>
                      )}

                      {slide.image && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-md">
                          <ImageIcon className="h-3 w-3" /> Image Banner
                        </span>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {index > 0 && (
                        <button
                          type="button"
                          onClick={() => handleMoveToFirst(index)}
                          className="flex items-center gap-1 text-[11px] font-semibold text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200 px-2 py-1 rounded-lg transition-all cursor-pointer"
                          title="Show as 1st slide on homepage"
                        >
                          <Star className="h-3 w-3 text-amber-500 fill-amber-500" />
                          Show 1st
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => handleToggleActive(index)}
                        className={`flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-lg border transition-all cursor-pointer ${
                          slide.isActive !== false 
                            ? 'text-zinc-700 bg-white hover:bg-zinc-100 border-zinc-250' 
                            : 'text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border-emerald-300'
                        }`}
                      >
                        {slide.isActive !== false ? (
                          <>
                            <EyeOff className="h-3.5 w-3.5 text-zinc-500" />
                            Hide
                          </>
                        ) : (
                          <>
                            <Eye className="h-3.5 w-3.5 text-emerald-600" />
                            Unhide
                          </>
                        )}
                      </button>

                      <button
                        type="button"
                        disabled={index === 0}
                        onClick={() => handleMoveSlide(index, 'up')}
                        className="p-1 rounded-lg border border-zinc-200 bg-white hover:bg-zinc-100 disabled:opacity-40 cursor-pointer border-0 text-zinc-600"
                        title="Move Up"
                      >
                        <ArrowUp className="h-3.5 w-3.5" />
                      </button>
                      <button
                        type="button"
                        disabled={index === siteForm.heroSlides.length - 1}
                        onClick={() => handleMoveSlide(index, 'down')}
                        className="p-1 rounded-lg border border-zinc-200 bg-white hover:bg-zinc-100 disabled:opacity-40 cursor-pointer border-0 text-zinc-600"
                        title="Move Down"
                      >
                        <ArrowDown className="h-3.5 w-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRemoveSlide(index)}
                        className="flex items-center gap-1 text-xs font-semibold text-rose-600 hover:text-rose-700 bg-rose-50 border border-rose-200 hover:bg-rose-100 px-2 py-1 rounded-lg transition-all cursor-pointer"
                        title="Delete Slide"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Separate Bold Title vs Normal Title Fields */}
                    <div className="space-y-1">
                      <label className="block text-[10px] font-bold text-zinc-700 uppercase tracking-wider">Heading Bold Portion</label>
                      <input
                        type="text"
                        value={slide.titleBold || ''}
                        onChange={(e) => {
                          const boldVal = e.target.value;
                          handleSlideChange(index, 'titleBold', boldVal);
                          if (boldVal || slide.titleNormal) {
                            handleSlideChange(index, 'title', `${boldVal} ${slide.titleNormal || ''}`.trim());
                          }
                        }}
                        placeholder="e.g. The latest Apple lineup,"
                        className="w-full px-3 py-2 bg-white rounded-lg border border-zinc-200 text-xs font-bold focus:border-[#0071e3] outline-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="block text-[10px] font-bold text-zinc-700 uppercase tracking-wider">Heading Normal Text Portion</label>
                      <input
                        type="text"
                        value={slide.titleNormal || ''}
                        onChange={(e) => {
                          const normVal = e.target.value;
                          handleSlideChange(index, 'titleNormal', normVal);
                          if (slide.titleBold || normVal) {
                            handleSlideChange(index, 'title', `${slide.titleBold || ''} ${normVal}`.trim());
                          }
                        }}
                        placeholder="e.g. in stock and ready to ship today."
                        className="w-full px-3 py-2 bg-white rounded-lg border border-zinc-200 text-xs font-normal focus:border-[#0071e3] outline-none"
                      />
                    </div>

                    <div className="space-y-1 md:col-span-2">
                      <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Full Heading Message</label>
                      <input
                        type="text"
                        required
                        value={slide.title}
                        onChange={(e) => handleSlideChange(index, 'title', e.target.value)}
                        placeholder="e.g. The latest Apple lineup, in stock today."
                        className="w-full px-3.5 py-2.5 bg-white rounded-xl border border-zinc-200 text-sm font-semibold focus:border-[#0071e3] outline-none"
                      />
                    </div>

                    <div className="space-y-1 md:col-span-2">
                      <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Subtitle / Supporting Text</label>
                      <textarea
                        rows={2}
                        value={slide.subtitle}
                        onChange={(e) => handleSlideChange(index, 'subtitle', e.target.value)}
                        placeholder="Brief description of the banner slide..."
                        className="w-full px-3.5 py-2 bg-white rounded-xl border border-zinc-200 text-xs focus:border-[#0071e3] outline-none resize-none"
                      />
                    </div>

                    {/* Stat Badges Highlights (Separated Bold & Normal) */}
                    <div className="md:col-span-2 bg-white p-3.5 rounded-xl border border-zinc-200 space-y-3">
                      <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block">Slide Highlights / Bullet Badges (Bold + Normal Text)</span>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div className="space-y-1">
                          <label className="block text-[9px] font-extrabold text-zinc-600 uppercase">Badge 1: Bold Text</label>
                          <input
                            type="text"
                            value={slide.stat1Bold || ''}
                            onChange={(e) => handleSlideChange(index, 'stat1Bold', e.target.value)}
                            placeholder="e.g. GST invoicing"
                            className="w-full px-2.5 py-1.5 rounded-lg border border-zinc-200 text-xs font-bold"
                          />
                          <label className="block text-[9px] font-semibold text-zinc-500 uppercase mt-1">Badge 1: Normal Text</label>
                          <input
                            type="text"
                            value={slide.stat1Normal || ''}
                            onChange={(e) => handleSlideChange(index, 'stat1Normal', e.target.value)}
                            placeholder="e.g. on every order"
                            className="w-full px-2.5 py-1.5 rounded-lg border border-zinc-200 text-xs font-normal"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="block text-[9px] font-extrabold text-zinc-600 uppercase">Badge 2: Bold Text</label>
                          <input
                            type="text"
                            value={slide.stat2Bold || ''}
                            onChange={(e) => handleSlideChange(index, 'stat2Bold', e.target.value)}
                            placeholder="e.g. Volume pricing"
                            className="w-full px-2.5 py-1.5 rounded-lg border border-zinc-200 text-xs font-bold"
                          />
                          <label className="block text-[9px] font-semibold text-zinc-500 uppercase mt-1">Badge 2: Normal Text</label>
                          <input
                            type="text"
                            value={slide.stat2Normal || ''}
                            onChange={(e) => handleSlideChange(index, 'stat2Normal', e.target.value)}
                            placeholder="e.g. on bulk orders"
                            className="w-full px-2.5 py-1.5 rounded-lg border border-zinc-200 text-xs font-normal"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="block text-[9px] font-extrabold text-zinc-600 uppercase">Badge 3: Bold Text</label>
                          <input
                            type="text"
                            value={slide.stat3Bold || ''}
                            onChange={(e) => handleSlideChange(index, 'stat3Bold', e.target.value)}
                            placeholder="e.g. Pan-India"
                            className="w-full px-2.5 py-1.5 rounded-lg border border-zinc-200 text-xs font-bold"
                          />
                          <label className="block text-[9px] font-semibold text-zinc-500 uppercase mt-1">Badge 3: Normal Text</label>
                          <input
                            type="text"
                            value={slide.stat3Normal || ''}
                            onChange={(e) => handleSlideChange(index, 'stat3Normal', e.target.value)}
                            placeholder="e.g. delivery & tracking"
                            className="w-full px-2.5 py-1.5 rounded-lg border border-zinc-200 text-xs font-normal"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Button Text (CTA)</label>
                      <input
                        type="text"
                        value={slide.buttonText}
                        onChange={(e) => handleSlideChange(index, 'buttonText', e.target.value)}
                        placeholder="e.g. Browse Catalogue →"
                        className="w-full px-3 py-2 bg-white rounded-lg border border-zinc-200 text-xs focus:border-[#0071e3] outline-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Button Link (URL / Anchor)</label>
                      <input
                        type="text"
                        value={slide.buttonLink}
                        onChange={(e) => handleSlideChange(index, 'buttonLink', e.target.value)}
                        placeholder="e.g. /shop or #apple-categories"
                        className="w-full px-3 py-2 bg-white rounded-lg border border-zinc-200 text-xs focus:border-[#0071e3] outline-none font-mono"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Background Theme Style</label>
                      <select
                        value={slide.bgStyle || 'slide-dark'}
                        onChange={(e) => handleSlideChange(index, 'bgStyle', e.target.value)}
                        className="w-full px-3 py-2 bg-white rounded-lg border border-zinc-200 text-xs focus:border-[#0071e3] outline-none"
                      >
                        <option value="slide-dark">Dark Minimalist Gradient</option>
                        <option value="slide-light">Light Apple Clean</option>
                        <option value="slide-dark-blue">Dark Sapphire Blue</option>
                        <option value="slide-warm">Warm Charcoal / Amber</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Banner Background Image (Optional)</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={slide.image || ''}
                          onChange={(e) => handleSlideChange(index, 'image', e.target.value)}
                          placeholder="Image URL or upload file..."
                          className="flex-1 px-3 py-2 bg-white rounded-lg border border-zinc-200 text-xs focus:border-[#0071e3] outline-none"
                        />
                        <label className="flex items-center gap-1 bg-zinc-200 hover:bg-zinc-300 text-zinc-800 px-3 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer">
                          {uploadingIndex === index ? (
                            <Loader2 className="h-3.5 w-3.5 animate-spin text-zinc-700" />
                          ) : (
                            <Upload className="h-3.5 w-3.5" />
                          )}
                          Upload
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => handleBannerImageUpload(index, e)}
                          />
                        </label>
                        {slide.image && (
                          <button
                            type="button"
                            onClick={() => handleSlideChange(index, 'image', '')}
                            className="p-2 text-rose-500 hover:text-rose-700 bg-rose-50 rounded-lg"
                            title="Remove Image"
                          >
                            <X className="h-3.5 w-3.5" />
                          </button>
                        )}
                      </div>
                    </div>

                    {slide.image && (
                      <div className="md:col-span-2 pt-2">
                        <div className="relative w-full h-24 rounded-xl overflow-hidden border border-zinc-200 bg-zinc-100">
                          <img 
                            src={slide.image} 
                            alt="Banner Preview" 
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                            <span className="text-white text-xs font-bold drop-shadow">
                              Live Image Preview: {slide.title}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={handleAddSlide}
              className="w-full py-4 border-2 border-dashed border-zinc-250 hover:border-[#0071e3] bg-zinc-50/80 hover:bg-blue-50/50 text-zinc-700 hover:text-[#0071e3] rounded-2xl flex items-center justify-center gap-2 text-xs font-bold transition-all cursor-pointer shadow-2xs"
            >
              <Plus className="h-4.5 w-4.5" />
              + Add Another Hero Slide
            </button>
          </div>

          <div className="flex justify-end pt-4 border-t border-zinc-100">
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 bg-[#0071e3] hover:bg-[#005bb5] disabled:bg-zinc-400 text-white px-7 py-3 rounded-xl text-xs font-bold tracking-wider uppercase shadow-md transition-all cursor-pointer border-0"
            >
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              Publish Live Settings
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Save, 
  Plus, 
  Trash2, 
  RefreshCw, 
  CheckCircle2, 
  AlertCircle,
  Eye,
  Sliders,
  Layers,
  Sparkles
} from 'lucide-react';
import axiosClient from '../../services/axiosClient';

export default function ProductAppleCareManager() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const [productAppleCare, setProductAppleCare] = useState({
    isEnabled: true,
    title: 'Add AppleCare+',
    monthlyPriceText: 'From ₹2,817.00/mo.◊',
    mrpText: 'or MRP ₹16,900.00 (inclusive of all taxes)',
    features: [
      'Unlimited repairs for accidental damage protection‡',
      'Apple-certified repairs using genuine Apple parts',
      '{category}, battery and included accessories covered',
      'Priority access to Apple experts'
    ],
    categoryPrices: [
      { categoryName: 'Mac', monthlyPrice: 'From ₹2,817.00/mo.◊', mrpPrice: 'or MRP ₹16,900.00 (inclusive of all taxes)' },
      { categoryName: 'iPhone', monthlyPrice: 'From ₹1,483.00/mo.◊', mrpPrice: 'or MRP ₹8,900.00 (inclusive of all taxes)' },
      { categoryName: 'iPad', monthlyPrice: 'From ₹1,150.00/mo.◊', mrpPrice: 'or MRP ₹6,900.00 (inclusive of all taxes)' },
      { categoryName: 'Watch', monthlyPrice: 'From ₹750.00/mo.◊', mrpPrice: 'or MRP ₹4,500.00 (inclusive of all taxes)' },
      { categoryName: 'AirPods', monthlyPrice: 'From ₹483.00/mo.◊', mrpPrice: 'or MRP ₹2,900.00 (inclusive of all taxes)' }
    ]
  });

  const [newFeatureText, setNewFeatureText] = useState('');
  const [newCategory, setNewCategory] = useState({ categoryName: '', monthlyPrice: '', mrpPrice: '' });
  const [previewCategory, setPreviewCategory] = useState('Mac');

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const res = await axiosClient.get('/settings');
      if (res?.data?.productAppleCare) {
        setProductAppleCare(res.data.productAppleCare);
        showMessage('success', 'Settings reloaded from database!');
      }
    } catch (err) {
      console.error('Failed to load Product AppleCare settings:', err);
      showMessage('error', 'Failed to load settings from server.');
    } finally {
      setLoading(false);
    }
  };

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 4000);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await axiosClient.put('/settings', { productAppleCare });
      if (res?.data?.productAppleCare) {
        setProductAppleCare(res.data.productAppleCare);
      }
      showMessage('success', 'Product AppleCare settings saved successfully!');
    } catch (err) {
      console.error('Failed to save Product AppleCare settings:', err);
      showMessage('error', err.response?.data?.message || 'Failed to save settings.');
    } finally {
      setSaving(false);
    }
  };

  // Feature Handlers
  const handleAddFeature = () => {
    if (!newFeatureText.trim()) return;
    setProductAppleCare(prev => ({
      ...prev,
      features: [...(prev.features || []), newFeatureText.trim()]
    }));
    setNewFeatureText('');
  };

  const handleFeatureChange = (index, value) => {
    const updated = [...productAppleCare.features];
    updated[index] = value;
    setProductAppleCare(prev => ({ ...prev, features: updated }));
  };

  const handleRemoveFeature = (index) => {
    setProductAppleCare(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index)
    }));
  };

  // Category Override Handlers
  const handleAddCategoryOverride = () => {
    if (!newCategory.categoryName.trim()) return;
    setProductAppleCare(prev => ({
      ...prev,
      categoryPrices: [...(prev.categoryPrices || []), { ...newCategory }]
    }));
    setNewCategory({ categoryName: '', monthlyPrice: '', mrpPrice: '' });
  };

  const handleCategoryChange = (index, field, value) => {
    const updated = [...productAppleCare.categoryPrices];
    updated[index][field] = value;
    setProductAppleCare(prev => ({ ...prev, categoryPrices: updated }));
  };

  const handleRemoveCategoryOverride = (index) => {
    setProductAppleCare(prev => ({
      ...prev,
      categoryPrices: prev.categoryPrices.filter((_, i) => i !== index)
    }));
  };

  // Compute Active Preview Price
  const getActivePreviewPrice = () => {
    const override = productAppleCare.categoryPrices?.find(
      c => c.categoryName && c.categoryName.toLowerCase() === previewCategory.toLowerCase()
    );
    const monthly = (override && override.monthlyPrice !== '')
      ? override.monthlyPrice
      : (productAppleCare.monthlyPriceText ?? '');
    const mrp = (override && override.mrpPrice !== '')
      ? override.mrpPrice
      : (productAppleCare.mrpText ?? '');

    return { monthly, mrp };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 min-h-[50vh]">
        <div className="flex flex-col items-center gap-3 text-zinc-500">
          <RefreshCw className="w-8 h-8 text-[#0071e3] animate-spin" />
          <p className="text-sm font-semibold">Loading Product Apple Care Settings...</p>
        </div>
      </div>
    );
  }

  const activePricing = getActivePreviewPrice();

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6 font-sans text-zinc-900 pb-16 select-none">
      
      {/* 1. Top Header Banner */}
      <div className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-6 border border-zinc-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 w-full">
        <div className="flex items-center gap-4 flex-1 min-w-0">
          <div className="p-3 bg-blue-50 text-[#0071e3] rounded-2xl border border-blue-100 shrink-0">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <div className="min-w-0 flex-1">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-900 leading-tight">
              Product Apple Care Manager
            </h1>
            <p className="text-xs sm:text-sm text-zinc-500 mt-0.5 truncate sm:whitespace-normal">
              Manage title, pricing, bullet feature points & category overrides for PDP widget.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 shrink-0 self-end md:self-center">
          <button
            type="button"
            onClick={fetchSettings}
            disabled={saving || loading}
            className="px-4 py-2.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-800 text-xs font-semibold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 border-0 shadow-xs disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            Reload
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="px-5 py-2.5 bg-[#0071e3] hover:bg-[#0077ed] text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer border-0 disabled:opacity-50"
          >
            {saving ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>

      {/* Message Toast */}
      {message.text && (
        <div className={`p-4 rounded-2xl border flex items-center gap-3 text-xs sm:text-sm font-semibold transition-all ${
          message.type === 'success' 
            ? 'bg-emerald-50 border-emerald-200 text-emerald-800' 
            : 'bg-rose-50 border-rose-200 text-rose-800'
        }`}>
          {message.type === 'success' ? <CheckCircle2 className="w-5 h-5 shrink-0" /> : <AlertCircle className="w-5 h-5 shrink-0" />}
          <span>{message.text}</span>
        </div>
      )}

      {/* 2. General & Default Settings Card */}
      <div className="bg-white border border-zinc-200 rounded-2xl sm:rounded-3xl shadow-sm p-6 sm:p-8 space-y-6 w-full">
        <div className="flex items-center justify-between border-b border-zinc-100 pb-4">
          <div className="flex items-center gap-2.5">
            <Sliders className="w-5 h-5 text-[#0071e3]" />
            <h2 className="text-lg font-bold text-zinc-900">General Settings</h2>
          </div>

          <div className="flex items-center gap-3">
            <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${
              productAppleCare.isEnabled 
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                : 'bg-zinc-100 text-zinc-500 border-zinc-200'
            }`}>
              {productAppleCare.isEnabled ? 'Widget Enabled' : 'Widget Hidden'}
            </span>

            {/* Apple-style Toggle Switch */}
            <button
              type="button"
              onClick={() => setProductAppleCare(prev => ({ ...prev, isEnabled: !prev.isEnabled }))}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                productAppleCare.isEnabled ? 'bg-[#0071e3]' : 'bg-zinc-200'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                  productAppleCare.isEnabled ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-zinc-700 mb-1.5">Card Heading Title</label>
            <input
              type="text"
              value={productAppleCare.title}
              onChange={(e) => setProductAppleCare(prev => ({ ...prev, title: e.target.value }))}
              placeholder="e.g. Add AppleCare+"
              className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-2.5 text-sm text-zinc-900 focus:outline-none focus:border-[#0071e3] font-medium"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-700 mb-1.5">Default Monthly Price Text</label>
              <input
                type="text"
                value={productAppleCare.monthlyPriceText}
                onChange={(e) => setProductAppleCare(prev => ({ ...prev, monthlyPriceText: e.target.value }))}
                placeholder="e.g. From ₹2,817.00/mo.◊"
                className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-2.5 text-sm text-zinc-900 focus:outline-none focus:border-[#0071e3] font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-700 mb-1.5">Default Total MRP Text</label>
              <input
                type="text"
                value={productAppleCare.mrpText}
                onChange={(e) => setProductAppleCare(prev => ({ ...prev, mrpText: e.target.value }))}
                placeholder="e.g. or MRP ₹16,900.00"
                className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-2.5 text-sm text-zinc-900 focus:outline-none focus:border-[#0071e3] font-medium"
              />
            </div>
          </div>
        </div>
      </div>

      {/* 3. Bullet Points / Features Card */}
      <div className="bg-white border border-zinc-200 rounded-2xl sm:rounded-3xl shadow-sm p-6 sm:p-8 space-y-6 w-full">
        <div className="flex items-center justify-between border-b border-zinc-100 pb-4">
          <div className="flex items-center gap-2.5">
            <Sparkles className="w-5 h-5 text-[#0071e3]" />
            <div>
              <h2 className="text-lg font-bold text-zinc-900">Bullet Features List</h2>
              <p className="text-xs text-zinc-500">
                Use <code className="text-[#0071e3] bg-blue-50 px-1.5 py-0.5 rounded font-mono font-bold">{'{category}'}</code> to dynamically replace product category name.
              </p>
            </div>
          </div>
        </div>

        {/* Existing Feature Points */}
        <div className="space-y-3">
          {productAppleCare.features?.map((feature, idx) => (
            <div key={idx} className="flex items-center gap-3">
              <span className="text-xs font-bold text-zinc-400 w-5 text-center shrink-0">{idx + 1}.</span>
              <input
                type="text"
                value={feature}
                onChange={(e) => handleFeatureChange(idx, e.target.value)}
                className="flex-1 bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-2 text-xs font-medium text-zinc-900 focus:outline-none focus:border-[#0071e3]"
              />
              <button
                type="button"
                onClick={() => handleRemoveFeature(idx)}
                className="p-2 rounded-xl border border-zinc-200 hover:bg-rose-50 hover:border-rose-200 text-zinc-400 hover:text-rose-600 transition-all cursor-pointer shrink-0 border-0"
                title="Delete bullet"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>

        {/* Add Feature Row */}
        <div className="pt-2 flex items-center gap-2">
          <input
            type="text"
            value={newFeatureText}
            onChange={(e) => setNewFeatureText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddFeature())}
            placeholder="Add new feature bullet..."
            className="flex-1 bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-2.5 text-xs text-zinc-900 focus:outline-none focus:border-[#0071e3]"
          />
          <button
            type="button"
            onClick={handleAddFeature}
            className="px-4 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer shrink-0 border-0"
          >
            <Plus className="w-4 h-4" /> Add Bullet Point
          </button>
        </div>
      </div>

      {/* 4. Category Price Overrides Card */}
      <div className="bg-white border border-zinc-200 rounded-2xl sm:rounded-3xl shadow-sm p-6 sm:p-8 space-y-6 w-full">
        <div className="flex items-center gap-2.5 border-b border-zinc-100 pb-4">
          <Layers className="w-5 h-5 text-[#0071e3]" />
          <div>
            <h2 className="text-lg font-bold text-zinc-900">Category Pricing Overrides</h2>
            <p className="text-xs text-zinc-500">Specify custom AppleCare monthly & MRP prices per product category.</p>
          </div>
        </div>

        {/* Categories List */}
        <div className="space-y-3">
          {productAppleCare.categoryPrices?.map((cat, idx) => (
            <div key={idx} className="p-4 bg-zinc-50 border border-zinc-200 rounded-2xl space-y-3">
              <div className="flex items-center justify-between">
                <input
                  type="text"
                  value={cat.categoryName}
                  onChange={(e) => handleCategoryChange(idx, 'categoryName', e.target.value)}
                  placeholder="Category (e.g. Mac)"
                  className="bg-white border border-zinc-200 rounded-xl px-3 py-1.5 text-xs font-bold text-[#0071e3] focus:outline-none focus:border-[#0071e3] w-40"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveCategoryOverride(idx)}
                  className="p-1.5 rounded-lg hover:bg-rose-100 text-zinc-400 hover:text-rose-600 transition-all cursor-pointer border-0"
                  title="Remove Category"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-zinc-500 mb-1">Monthly Price Text</label>
                  <input
                    type="text"
                    value={cat.monthlyPrice}
                    onChange={(e) => handleCategoryChange(idx, 'monthlyPrice', e.target.value)}
                    placeholder="e.g. From ₹2,817.00/mo.◊"
                    className="w-full bg-white border border-zinc-200 rounded-xl px-3 py-2 text-xs text-zinc-900 focus:outline-none focus:border-[#0071e3]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-zinc-500 mb-1">Total MRP Text</label>
                  <input
                    type="text"
                    value={cat.mrpPrice}
                    onChange={(e) => handleCategoryChange(idx, 'mrpPrice', e.target.value)}
                    placeholder="e.g. or MRP ₹16,900.00"
                    className="w-full bg-white border border-zinc-200 rounded-xl px-3 py-2 text-xs text-zinc-900 focus:outline-none focus:border-[#0071e3]"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Add New Category Row */}
        <div className="p-4 bg-blue-50/50 border border-dashed border-blue-200 rounded-2xl space-y-3">
          <span className="text-xs font-bold text-zinc-800 block">Add New Category Price Override:</span>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            <input
              type="text"
              value={newCategory.categoryName}
              onChange={(e) => setNewCategory(prev => ({ ...prev, categoryName: e.target.value }))}
              placeholder="Category (e.g. Vision)"
              className="bg-white border border-zinc-200 rounded-xl px-3 py-2 text-xs text-zinc-900 focus:outline-none focus:border-[#0071e3]"
            />
            <input
              type="text"
              value={newCategory.monthlyPrice}
              onChange={(e) => setNewCategory(prev => ({ ...prev, monthlyPrice: e.target.value }))}
              placeholder="Monthly Price Text"
              className="bg-white border border-zinc-200 rounded-xl px-3 py-2 text-xs text-zinc-900 focus:outline-none focus:border-[#0071e3]"
            />
            <input
              type="text"
              value={newCategory.mrpPrice}
              onChange={(e) => setNewCategory(prev => ({ ...prev, mrpPrice: e.target.value }))}
              placeholder="MRP Price Text"
              className="bg-white border border-zinc-200 rounded-xl px-3 py-2 text-xs text-zinc-900 focus:outline-none focus:border-[#0071e3]"
            />
          </div>
          <button
            type="button"
            onClick={handleAddCategoryOverride}
            className="w-full py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer border-0"
          >
            <Plus className="w-4 h-4" /> Save Category Override
          </button>
        </div>
      </div>

      {/* 5. Live Storefront Card Preview Box */}
      <div className="bg-white border border-zinc-200 rounded-2xl sm:rounded-3xl shadow-sm p-6 sm:p-8 space-y-6 w-full">
        <div className="flex items-center justify-between border-b border-zinc-100 pb-4">
          <div className="flex items-center gap-2">
            <Eye className="w-5 h-5 text-[#0071e3]" />
            <h2 className="text-lg font-bold text-zinc-900">Live Card Preview</h2>
          </div>
          <span className="text-[10px] font-extrabold tracking-wider px-3 py-1 bg-blue-50 text-[#0071e3] border border-blue-200 rounded-full uppercase">
            Storefront Product Page
          </span>
        </div>

        {/* Category Preview Tabs */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-zinc-500">Preview Category:</label>
          <div className="flex flex-wrap gap-2">
            {['Mac', 'iPhone', 'iPad', 'Watch', 'AirPods'].map(cat => (
              <button
                type="button"
                key={cat}
                onClick={() => setPreviewCategory(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border-0 ${
                  previewCategory.toLowerCase() === cat.toLowerCase()
                    ? 'bg-[#0071e3] text-white shadow-xs'
                    : 'bg-zinc-100 text-zinc-600 hover:text-zinc-900 hover:bg-zinc-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Rendered Preview Card Widget */}
        {!productAppleCare.isEnabled ? (
          <div className="p-8 text-center bg-zinc-50 border border-dashed border-zinc-200 rounded-3xl text-zinc-500 text-xs">
            Widget is currently disabled. Toggle &quot;Widget Enabled&quot; above to view storefront preview.
          </div>
        ) : (
          <div className="bg-white border border-zinc-200 rounded-3xl p-5 sm:p-6 shadow-xs text-left select-none relative max-w-lg mx-auto">
            {productAppleCare.title && (
              <div className="flex items-center gap-2 mb-1">
                <svg className="w-5 h-5 fill-[#E30000] shrink-0" viewBox="0 0 170 170">
                  <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.34.13-9.04-1.9-14.1-6.1-3.37-2.73-7.29-7.38-11.77-13.97-6.53-9.59-11.75-20.47-15.66-32.65-3.92-12.18-5.88-23.75-5.88-34.7 0-14.4 3.73-26.17 11.19-35.31 7.46-9.14 16.82-13.82 28.08-14.04 4.58 0 9.77 1.19 15.58 3.58 5.81 2.39 9.87 3.58 12.18 3.58 2.12 0 6.28-1.25 12.48-3.75 6.2-2.5 11.21-3.64 15.03-3.41 12.18.54 21.84 5.35 28.98 14.42-10.77 6.53-16.03 15.45-15.78 26.77.25 8.92 3.82 16.5 10.72 22.74 6.9 6.24 15.08 9.71 24.54 10.42-2.39 7.07-5.55 14.1-9.48 21.09zM119.22 31.62c0-7.39 2.65-14.46 7.95-21.21 5.3-6.75 11.95-10.41 19.95-10.98.22.98.33 1.96.33 2.94 0 7.29-2.72 14.37-8.17 21.24-5.45 6.87-12.14 10.59-20.06 11.16-.07-1.04-.1-2.09-.1-3.15z" />
                </svg>
                <h3 className="text-xl sm:text-2xl font-bold text-zinc-900 leading-tight tracking-tight">
                  {productAppleCare.title}
                </h3>
              </div>
            )}

            {(activePricing.monthly || activePricing.mrp) && (
              <div className="mt-1.5 space-y-0.5">
                {activePricing.monthly && <p className="text-sm sm:text-base font-bold text-zinc-900">{activePricing.monthly}</p>}
                {activePricing.mrp && <p className="text-xs sm:text-sm text-zinc-600 font-medium">{activePricing.mrp}</p>}
              </div>
            )}

            {productAppleCare.features?.length > 0 && (
              <>
                <hr className="my-4 border-zinc-200" />

                <ul className="space-y-2.5 text-xs sm:text-sm text-zinc-800 font-medium">
                  {productAppleCare.features.map((ft, i) => (
                    <li key={i} className="flex items-start gap-2.5">
                      <span className="text-zinc-900 font-bold">•</span>
                      <span>{ft.replace('{category}', previewCategory)}</span>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>
        )}
      </div>

      {/* Bottom Action Bar */}
      <div className="bg-white border border-zinc-200 rounded-2xl sm:rounded-3xl p-5 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <span className="text-xs font-medium text-zinc-500 text-center sm:text-left">
          Save your changes to update the AppleCare+ card widget on product detail pages.
        </span>
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={fetchSettings}
            disabled={saving || loading}
            className="px-4 py-2.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-800 text-xs font-semibold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 border-0 shadow-xs disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            Reload
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="px-6 py-2.5 bg-[#0071e3] hover:bg-[#0077ed] text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer border-0 disabled:opacity-50"
          >
            {saving ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>

    </div>
  );
}

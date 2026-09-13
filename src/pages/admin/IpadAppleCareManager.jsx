import { useState, useEffect } from 'react';
import axiosClient from '../../services/axiosClient';
import {
  ShieldCheck,
  Plus,
  Trash2,
  Loader2,
  Save,
  Upload,
  CheckCircle2,
  AlertCircle,
  ArrowUp,
  ArrowDown,
  ArrowUpToLine,
  ArrowDownToLine,
  Tablet,
  Tag,
  FileText,
  Barcode,
  Percent,
  DollarSign,
  Eye
} from 'lucide-react';

const DEFAULT_IPAD_ROWS = [

  {
    model: 'iPad Air 11″',
    title: 'AppleCare+ for iPad Air 11″',
    description: '2 Years Apple-certified coverage for iPad Air 11″. Peace of mind for what\'s next.',
    description1yr: '1 Year Apple-certified coverage for iPad Air 11″.',
    description2yr: '2 Years Apple-certified coverage for iPad Air 11″.',
    sku: 'AC-IPAD-AIR-11',
    sku1yr: 'DGVA2HN/A',
    sku2yr: 'SCV93HN/A',
    mrp: '₹10,900.00',
    mrp1yr: '₹3,999.00',
    mrp2yr: '₹7,900.00',
    discount: '18% OFF',
    discount1yr: '18% OFF',
    discount2yr: '18% OFF',
    image: '/ipad_nav/ipad_air.png',
    isActive: true
  },
  {
    model: 'iPad Air 13″',
    title: 'AppleCare+ for iPad Air 13″',
    description: '2 Years Apple-certified coverage for iPad Air 13″. Peace of mind for what\'s next.',
    description1yr: '1 Year Apple-certified coverage for iPad Air 13″.',
    description2yr: '2 Years Apple-certified coverage for iPad Air 13″.',
    sku: 'AC-IPAD-AIR-13',
    sku1yr: 'AC-IPAD-AIR13-1YR',
    sku2yr: 'AC-IPAD-AIR13-2YR',
    mrp: '₹12,900.00',
    mrp1yr: '₹7,900.00',
    mrp2yr: '₹12,900.00',
    discount: '8% OFF',
    discount1yr: '12% OFF',
    discount2yr: '8% OFF',
    salePrice: '₹11,900.00',
    salePrice1yr: '₹6,900.00',
    salePrice2yr: '₹11,900.00',
    monthly: '₹599.00',
    yearly: '₹11,900.00',
    image: '/ipad_nav/ipad_air.png',
    isActive: true
  },
  {
    model: 'iPad Pro 11″',
    title: 'AppleCare+ for iPad Pro 11″',
    description: '2 Years Apple-certified coverage for iPad Pro 11″. Peace of mind for what\'s next.',
    description1yr: '1 Year Apple-certified coverage for iPad Pro 11″.',
    description2yr: '2 Years Apple-certified coverage for iPad Pro 11″.',
    sku: 'AC-IPAD-PRO-11',
    sku1yr: 'AC-IPAD-PRO11-1YR',
    sku2yr: 'AC-IPAD-PRO11-2YR',
    mrp: '₹19,900.00',
    mrp1yr: '₹11,900.00',
    mrp2yr: '₹19,900.00',
    discount: '10% OFF',
    discount1yr: '8% OFF',
    discount2yr: '10% OFF',
    salePrice: '₹17,900.00',
    salePrice1yr: '₹10,900.00',
    salePrice2yr: '₹17,900.00',
    monthly: '₹899.00',
    yearly: '₹17,900.00',
    image: '/ipad_nav/ipad_pro.png',
    isActive: true
  },
  {
    model: 'iPad Pro 13″',
    title: 'AppleCare+ for iPad Pro 13″',
    description: '2 Years Apple-certified coverage for iPad Pro 13″. Peace of mind for what\'s next.',
    description1yr: '1 Year Apple-certified coverage for iPad Pro 13″.',
    description2yr: '2 Years Apple-certified coverage for iPad Pro 13″.',
    sku: 'AC-IPAD-PRO-13',
    sku1yr: 'AC-IPAD-PRO13-1YR',
    sku2yr: 'AC-IPAD-PRO13-2YR',
    mrp: '₹21,900.00',
    mrp1yr: '₹13,900.00',
    mrp2yr: '₹21,900.00',
    discount: '10% OFF',
    discount1yr: '7% OFF',
    discount2yr: '10% OFF',
    salePrice: '₹19,900.00',
    salePrice1yr: '₹12,900.00',
    salePrice2yr: '₹19,900.00',
    monthly: '₹999.00',
    yearly: '₹19,900.00',
    image: '/ipad_nav/ipad_pro.png',
    isActive: true
  }
];

export default function IpadAppleCareManager() {
  const [pricingTables, setPricingTables] = useState([]);
  const [ipadRows, setIpadRows] = useState(() => {
    try {
      const cached = localStorage.getItem('iincept_admin_ipad_applecare_rows_v2');
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) { }
    return DEFAULT_IPAD_ROWS;
  });
  const [headerTitle, setHeaderTitle] = useState(() => {
    try {
      return localStorage.getItem('iincept_ipad_applecare_title_v2') || 'AppleCare+';
    } catch (e) { return 'AppleCare+'; }
  });
  const [durationLabel, setDurationLabel] = useState(() => {
    try {
      return localStorage.getItem('iincept_ipad_applecare_duration_v2') || '2 Years';
    } catch (e) { return '2 Years'; }
  });
  const [loading, setLoading] = useState(() => {
    try {
      return !localStorage.getItem('iincept_admin_ipad_applecare_rows_v2');
    } catch (e) { return true; }
  });
  const [saving, setSaving] = useState(false);
  const [uploadingRowIndex, setUploadingRowIndex] = useState(null);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await axiosClient.get('/settings');
      if (res.data?.appleCarePricingTables && res.data.appleCarePricingTables.length > 0) {
        setPricingTables(res.data.appleCarePricingTables);
        const ipadTable = res.data.appleCarePricingTables.find(t => t.categoryKey === 'ipad');
        if (ipadTable) {
          const hTitle = ipadTable.headerTitle ?? 'AppleCare+';
          const dLabel = ipadTable.durationLabel ?? '2 Years';
          setHeaderTitle(hTitle);
          setDurationLabel(dLabel);
          try {
            localStorage.setItem('iincept_ipad_applecare_title_v2', hTitle);
            localStorage.setItem('iincept_ipad_applecare_duration_v2', dLabel);
          } catch (e) { }

          if (ipadTable.rows && ipadTable.rows.length > 0) {
            const mapped = ipadTable.rows.map(r => ({
              model: r.model || '',
              title: r.title || '',
              description: r.description || '',
              description1yr: r.description1yr || '',
              description2yr: r.description2yr || r.description || '',
              sku: r.sku || '',
              sku1yr: r.sku1yr || '',
              sku2yr: r.sku2yr || r.sku || '',
              mrp: r.mrp || '',
              mrp1yr: r.mrp1yr || '',
              mrp2yr: r.mrp2yr || r.mrp || '',
              discount: r.discount || '',
              discount1yr: r.discount1yr || '',
              discount2yr: r.discount2yr || r.discount || '',
              salePrice: r.salePrice || r.yearly || '',
              salePrice1yr: r.salePrice1yr || '',
              salePrice2yr: r.salePrice2yr || r.salePrice || r.yearly || '',
              monthly: r.monthly || '',
              yearly: r.yearly || r.salePrice || '',
              image: r.image ?? '',
              isActive: r.isActive !== false
            }));
            try {
              localStorage.setItem('iincept_admin_ipad_applecare_rows_v2', JSON.stringify(mapped));
              localStorage.setItem('iincept_ipad_applecare_rows_v2', JSON.stringify(mapped.filter(r => r.isActive !== false)));
            } catch (e) { }
            setIpadRows(mapped);
          }
        }
      }
    } catch (err) {
      console.error('Failed to load settings:', err);
      showMessage('error', 'Failed to load iPad AppleCare settings');
    } finally {
      setLoading(false);
    }
  };

  const getFallbackImage = (modelName = '') => {
    const m = modelName.toLowerCase();
    if (m.includes('pro')) return '/ipad_nav/ipad_pro.png';
    if (m.includes('air')) return '/ipad_nav/ipad_air.png';
    if (m.includes('mini')) return '/ipad_nav/ipad_mini.png';
    return '/ipad_nav/ipad.png';
  };

  const handleRemoveImage = (index) => {
    handleUpdateRow(index, 'image', '');
    showMessage('success', 'Image removed! Click "Save Changes" to apply.');
  };

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 4000);
  };

  const handleUpdateRow = (index, fieldOrObject, value) => {
    setIpadRows(prev => {
      const updated = [...prev];
      if (typeof fieldOrObject === 'object' && fieldOrObject !== null) {
        updated[index] = { ...updated[index], ...fieldOrObject };
      } else {
        updated[index] = { ...updated[index], [fieldOrObject]: value };
        if (fieldOrObject === 'salePrice') updated[index].yearly = value;
        if (fieldOrObject === 'yearly' && !updated[index].salePrice) updated[index].salePrice = value;
      }
      return updated;
    });
  };

  const handleAddRow = () => {
    setIpadRows(prev => [
      ...prev,
      {
        model: 'New iPad Model',
        title: 'AppleCare+ for New iPad Model',
        description: '2 Years Apple-certified coverage',
        sku: 'AC-IPAD-NEW',
        mrp: '₹14,900.00',
        discount: '10% OFF',
        salePrice: '₹12,900.00',
        monthly: '₹599.00',
        yearly: '₹12,900.00',
        image: '/ipad_nav/ipad.png',
        isActive: true
      }
    ]);
  };

  const handleDeleteRow = async (index) => {
    if (!window.confirm('Are you sure you want to remove this iPad AppleCare product?')) return;

    const updatedRows = ipadRows.filter((_, i) => i !== index);
    setIpadRows(updatedRows);

    try {
      let updatedTables = [...pricingTables];
      const ipadTableIndex = updatedTables.findIndex(t => t.categoryKey === 'ipad');
      const newIpadTable = {
        categoryKey: 'ipad',
        image: '/ipad_category_v2.jpg',
        headline: 'Cover your iPad.',
        headerTitle: headerTitle ?? 'AppleCare+',
        subheadline: 'AppleCare+ for iPad covers your iPad, Apple Pencil, and Apple-branded keyboards.',
        durationLabel: durationLabel ?? '2 Years',
        isActive: true,
        rows: updatedRows.map(r => ({
          model: r.model || '',
          title: r.title || '',
          description: r.description || '',
          description1yr: r.description1yr || '',
          description2yr: r.description2yr || '',
          sku: r.sku || '',
          sku1yr: r.sku1yr || '',
          sku2yr: r.sku2yr || '',
          mrp: r.mrp || '',
          mrp1yr: r.mrp1yr || '',
          mrp2yr: r.mrp2yr || '',
          discount: r.discount || '',
          discount1yr: r.discount1yr || '',
          discount2yr: r.discount2yr || '',
          salePrice: r.salePrice || r.yearly || '',
          salePrice1yr: r.salePrice1yr || '',
          salePrice2yr: r.salePrice2yr || '',
          monthly: r.monthly || '',
          yearly: r.yearly || r.salePrice || '',
          image: r.image ?? '',
          isActive: r.isActive !== false
        }))
      };

      if (ipadTableIndex !== -1) {
        updatedTables[ipadTableIndex] = newIpadTable;
      } else {
        updatedTables.push(newIpadTable);
      }

      await axiosClient.put('/settings', { appleCarePricingTables: updatedTables });

      try {
        localStorage.setItem('iincept_admin_ipad_applecare_rows_v2', JSON.stringify(newIpadTable.rows));
        localStorage.setItem('iincept_ipad_applecare_rows_v2', JSON.stringify(newIpadTable.rows.filter(r => r.isActive !== false)));
      } catch (e) { }

      showMessage('success', 'iPad product deleted permanently!');
    } catch (err) {
      console.error('Failed to save deletion:', err);
      showMessage('error', 'Product removed from list. Click "Save Changes" to sync database.');
    }
  };

  const handleMoveRow = (index, direction) => {
    if (direction === 'first') {
      setIpadRows(prev => {
        const updated = [...prev];
        const [item] = updated.splice(index, 1);
        return [item, ...updated];
      });
      return;
    }
    if (direction === 'last') {
      setIpadRows(prev => {
        const updated = [...prev];
        const [item] = updated.splice(index, 1);
        return [...updated, item];
      });
      return;
    }
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= ipadRows.length) return;
    setIpadRows(prev => {
      const updated = [...prev];
      const temp = updated[index];
      updated[index] = updated[targetIdx];
      updated[targetIdx] = temp;
      return updated;
    });
  };

  const handleImageFileUpload = async (index, file) => {
    if (!file) return;
    try {
      setUploadingRowIndex(index);
      const formData = new FormData();
      formData.append('image', file);

      const res = await axiosClient.post('/upload/single', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      const uploadedUrl = res.data.image || res.data.url;
      if (uploadedUrl) {
        handleUpdateRow(index, 'image', uploadedUrl);
        showMessage('success', 'Image uploaded successfully!');
      }
    } catch (err) {
      console.error('Image upload failed:', err);
      showMessage('error', 'Image upload failed. Please try again.');
    } finally {
      setUploadingRowIndex(null);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      let updatedTables = [...pricingTables];

      const ipadTableIndex = updatedTables.findIndex(t => t.categoryKey === 'ipad');
      const newIpadTable = {
        categoryKey: 'ipad',
        image: '/ipad_category_v2.jpg',
        headline: 'Cover your iPad.',
        headerTitle: headerTitle ?? 'AppleCare+',
        subheadline: 'AppleCare+ for iPad covers your iPad, Apple Pencil, and Apple-branded keyboards.',
        durationLabel: durationLabel ?? '2 Years',
        isActive: true,
        rows: ipadRows.map(r => ({
          model: r.model || '',
          title: r.title || '',
          description: r.description || '',
          description1yr: r.description1yr || '',
          description2yr: r.description2yr || '',
          sku: r.sku || '',
          sku1yr: r.sku1yr || '',
          sku2yr: r.sku2yr || '',
          mrp: r.mrp || '',
          mrp1yr: r.mrp1yr || '',
          mrp2yr: r.mrp2yr || '',
          discount: r.discount || '',
          discount1yr: r.discount1yr || '',
          discount2yr: r.discount2yr || '',
          salePrice: r.salePrice || r.yearly || '',
          salePrice1yr: r.salePrice1yr || '',
          salePrice2yr: r.salePrice2yr || '',
          monthly: r.monthly || '',
          yearly: r.yearly || r.salePrice || '',
          image: r.image ?? '',
          isActive: r.isActive !== false
        }))
      };

      if (ipadTableIndex !== -1) {
        updatedTables[ipadTableIndex] = newIpadTable;
      } else {
        updatedTables.push(newIpadTable);
      }

      const res = await axiosClient.put('/settings', {
        appleCarePricingTables: updatedTables
      });

      try {
        localStorage.setItem('iincept_admin_ipad_applecare_rows_v2', JSON.stringify(newIpadTable.rows));
        localStorage.setItem('iincept_ipad_applecare_rows_v2', JSON.stringify(newIpadTable.rows.filter(r => r.isActive !== false)));
        localStorage.setItem('iincept_ipad_applecare_title_v2', headerTitle);
        localStorage.setItem('iincept_ipad_applecare_duration_v2', durationLabel);
      } catch (e) { }

      if (res.data?.appleCarePricingTables) {
        setPricingTables(res.data.appleCarePricingTables);
      }

      showMessage('success', 'iPad AppleCare products saved successfully!');
    } catch (err) {
      console.error('Failed to save settings:', err);
      showMessage('error', 'Failed to save settings. Check connection.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 text-[#0071e3] animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8 font-sans text-zinc-900 select-none">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-6 border border-zinc-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 w-full">
        <div className="flex items-center gap-4 flex-1 min-w-0">
          <div className="p-3 bg-rose-50 text-[#FF2D55] rounded-2xl border border-rose-100 shrink-0">
            <Tablet className="h-7 w-7" />
          </div>
          <div className="min-w-0 flex-1">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-900 leading-tight">
              iPad AppleCare Pricing Manager
            </h1>
            <p className="text-xs sm:text-sm text-zinc-500 mt-0.5 truncate sm:whitespace-normal">
              Manage title, description, SKU, MRP, discount, sale price, and image for every iPad AppleCare product.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 shrink-0 self-end md:self-center">
          <button
            type="button"
            onClick={handleAddRow}
            className="px-4 py-2.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-800 text-xs font-semibold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 border-0 shadow-xs"
          >
            <Plus className="h-4 w-4 text-[#0071e3]" />
            Add iPad Model
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="px-5 py-2.5 bg-[#0071e3] hover:bg-[#0077ed] text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer border-0 disabled:opacity-50"
          >
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>

      {/* Message Toast */}
      {message && (
        <div className={`p-4 rounded-xl flex items-center gap-3 border text-sm font-medium ${message.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-rose-50 border-rose-200 text-rose-800'
          }`}>
          {message.type === 'success' ? <CheckCircle2 className="h-5 w-5 shrink-0" /> : <AlertCircle className="h-5 w-5 shrink-0" />}
          <span>{message.text}</span>
        </div>
      )}

      {/* Global Table Header Settings */}
      <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm p-6 space-y-4">
        <h2 className="font-bold text-zinc-900 text-sm uppercase tracking-wider text-zinc-500">Header Title & Duration Labels</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-zinc-700 mb-1">Header Title (Red Label)</label>
            <input
              type="text"
              value={headerTitle}
              onChange={(e) => setHeaderTitle(e.target.value)}
              placeholder="e.g. AppleCare+"
              className="w-full px-3.5 py-2 border border-zinc-200 rounded-xl text-sm font-semibold text-zinc-900 focus:outline-none focus:border-[#0071e3]"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-zinc-700 mb-1">Duration Label (Column Title)</label>
            <input
              type="text"
              value={durationLabel}
              onChange={(e) => setDurationLabel(e.target.value)}
              placeholder="e.g. 2 years"
              className="w-full px-3.5 py-2 border border-zinc-200 rounded-xl text-sm font-semibold text-zinc-900 focus:outline-none focus:border-[#0071e3]"
            />
          </div>
        </div>
      </div>

      {/* Main iPad Models List */}
      <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden space-y-4">
        <div className="p-5 border-b border-zinc-100 flex items-center justify-between bg-zinc-50/50">
          <div>
            <h2 className="font-bold text-zinc-900 text-lg">iPad AppleCare Products & Pricing List</h2>
            <p className="text-xs text-zinc-500">Edit model title, description, SKU, MRP, discount & sale price for each iPad AppleCare product.</p>
          </div>
          <span className="text-xs font-semibold px-3 py-1 bg-rose-50 text-[#FF2D55] rounded-full border border-rose-100">
            {ipadRows.length} iPad Products
          </span>
        </div>

        <div className="p-4 sm:p-6 space-y-6">
          {ipadRows.map((row, idx) => (
            <div key={idx} className="p-5 bg-white border border-zinc-200/80 rounded-2xl space-y-4 shadow-xs transition-all hover:border-zinc-300 hover:shadow-sm">

              {/* Row Header */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-200/80 pb-4">

                {/* Left: Move & Image & Model Title */}
                <div className="flex items-center gap-3.5 flex-1 min-w-0">
                  <div className="flex items-center gap-1 shrink-0">
                    <span className="text-xs font-bold text-zinc-400 w-5">{idx + 1}.</span>
                    <div className="flex items-center gap-0.5">
                      <button
                        type="button"
                        onClick={() => handleMoveRow(idx, 'first')}
                        disabled={idx === 0}
                        className="p-1 hover:bg-zinc-200 text-zinc-600 rounded disabled:opacity-30 cursor-pointer border-0"
                        title="Move to First (Top)"
                      >
                        <ArrowUpToLine className="h-3.5 w-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleMoveRow(idx, 'up')}
                        disabled={idx === 0}
                        className="p-1 hover:bg-zinc-200 text-zinc-600 rounded disabled:opacity-30 cursor-pointer border-0"
                        title="Move Up"
                      >
                        <ArrowUp className="h-3.5 w-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleMoveRow(idx, 'down')}
                        disabled={idx === ipadRows.length - 1}
                        className="p-1 hover:bg-zinc-200 text-zinc-600 rounded disabled:opacity-30 cursor-pointer border-0"
                        title="Move Down"
                      >
                        <ArrowDown className="h-3.5 w-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleMoveRow(idx, 'last')}
                        disabled={idx === ipadRows.length - 1}
                        className="p-1 hover:bg-zinc-200 text-zinc-600 rounded disabled:opacity-30 cursor-pointer border-0"
                        title="Move to Last (Bottom)"
                      >
                        <ArrowDownToLine className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Thumbnail Image */}
                  <div
                    className="bg-white rounded-xl border border-zinc-200 flex items-center justify-center overflow-hidden p-1 shrink-0 relative"
                    style={{ width: '56px', height: '56px', minWidth: '56px', minHeight: '56px', maxWidth: '56px', maxHeight: '56px' }}
                  >
                    {row.image ? (
                      <img
                        src={row.image}
                        alt={row.model}
                        style={{ width: '100%', height: '100%', maxWidth: '56px', maxHeight: '56px', objectFit: 'contain' }}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = getFallbackImage(row.model);
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center bg-zinc-50 text-zinc-400 p-1">
                        <img
                          src={getFallbackImage(row.model)}
                          alt={row.model}
                          style={{ width: '100%', height: '100%', maxWidth: '56px', maxHeight: '56px', objectFit: 'contain', opacity: 0.35 }}
                        />
                      </div>
                    )}
                    {uploadingRowIndex === idx && (
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                        <Loader2 className="h-4 w-4 text-white animate-spin" />
                      </div>
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <span className="text-base font-bold text-zinc-900 block truncate">
                      {row.model || 'iPad Model'}
                    </span>
                    <span className="text-xs text-zinc-500 font-medium block truncate">
                      {row.sku ? `SKU: ${row.sku}` : 'No SKU'} • {row.salePrice || row.yearly || 'No Price Set'}
                    </span>
                  </div>
                </div>

                {/* Right Actions: Upload Image & Remove Image & Active Switch & Delete */}
                <div className="flex items-center gap-3 shrink-0">
                  <label className="relative inline-flex items-center justify-center gap-1.5 px-3 py-1.5 bg-white hover:bg-zinc-100 text-zinc-700 text-xs font-semibold rounded-xl cursor-pointer border border-zinc-200 transition-colors">
                    <Upload className="h-3.5 w-3.5 text-[#0071e3]" />
                    <span>Upload Image</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        if (e.target.files?.[0]) {
                          handleImageFileUpload(idx, e.target.files[0]);
                        }
                      }}
                    />
                  </label>

                  <button
                    type="button"
                    onClick={() => handleRemoveImage(idx)}
                    disabled={!row.image}
                    className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-semibold rounded-xl border border-rose-200 transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5"
                    title="Remove Image"
                  >
                    <Trash2 className="h-3.5 w-3.5 text-rose-600" />
                    <span>Remove Image</span>
                  </button>

                  {/* Active Toggle Switch */}
                  <button
                    type="button"
                    onClick={() => handleUpdateRow(idx, 'isActive', !row.isActive)}
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${row.isActive !== false ? 'bg-[#0071e3]' : 'bg-zinc-300'
                      }`}
                    title={row.isActive !== false ? 'Model Active' : 'Model Hidden'}
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${row.isActive !== false ? 'translate-x-5' : 'translate-x-0'
                        }`}
                    />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDeleteRow(idx)}
                    className="p-2 hover:bg-rose-100 text-rose-600 rounded-xl border border-transparent hover:border-rose-200 transition-all cursor-pointer"
                    title="Delete iPad Model"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Common Product Info Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 bg-zinc-50 p-4 rounded-xl border border-zinc-200/60 mb-4">
                {/* 1. Model Name */}
                <div>
                  <label className="block text-xs font-bold text-zinc-700 mb-1 flex items-center gap-1">
                    <Tag className="w-3.5 h-3.5 text-[#0071e3]" />
                    Model Name
                  </label>
                  <input
                    type="text"
                    value={row.model}
                    onChange={(e) => handleUpdateRow(idx, 'model', e.target.value)}
                    placeholder="e.g. iPad Air 11″"
                    className="w-full px-3 py-2 bg-white border border-zinc-200 rounded-xl text-xs font-semibold text-zinc-900 focus:outline-none focus:border-[#0071e3]"
                  />
                </div>

                {/* 2. Full Title */}
                <div>
                  <label className="block text-xs font-bold text-zinc-700 mb-1 flex items-center gap-1">
                    <FileText className="w-3.5 h-3.5 text-[#0071e3]" />
                    Full Product Title
                  </label>
                  <input
                    type="text"
                    value={row.title || ''}
                    onChange={(e) => handleUpdateRow(idx, 'title', e.target.value)}
                    placeholder="e.g. AppleCare+ for iPad Air 11″"
                    className="w-full px-3 py-2 bg-white border border-zinc-200 rounded-xl text-xs font-semibold text-zinc-900 focus:outline-none focus:border-[#0071e3]"
                  />
                </div>

                {/* 3. Image URL */}
                <div>
                  <label className="block text-xs font-bold text-zinc-700 mb-1 flex items-center gap-1">
                    <Upload className="w-3.5 h-3.5 text-zinc-500" />
                    Product Image URL
                  </label>
                  <input
                    type="text"
                    value={row.image || ''}
                    onChange={(e) => handleUpdateRow(idx, 'image', e.target.value)}
                    placeholder="e.g. /ipad_nav/ipad_air.png"
                    className="w-full px-3 py-2 bg-white border border-zinc-200 rounded-xl text-xs font-semibold text-zinc-900 focus:outline-none focus:border-[#0071e3]"
                  />
                </div>
              </div>

              {/* 2-YEAR COVERAGE PLAN SPECS */}
              <div className="p-4 bg-[#F7F7F9] border border-zinc-200/80 rounded-2xl space-y-3">
                <div className="flex items-center justify-between border-b border-zinc-200/60 pb-2">
                  <span className="text-xs font-extrabold uppercase text-[#FF2D55] tracking-wider flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#FF2D55]"></span>
                    2-Year Plan Specs (AppleCare+)
                  </span>
                  <span className="text-[10px] font-bold px-2.5 py-0.5 bg-rose-50 text-[#FF2D55] rounded-full border border-rose-100">
                    2-Year Coverage
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-zinc-700 mb-1">SKU Code</label>
                    <input
                      type="text"
                      value={row.sku2yr || row.sku || ''}
                      onChange={(e) => handleUpdateRow(idx, { sku2yr: e.target.value, sku: e.target.value })}
                      placeholder="e.g. SCV93HN/A"
                      className="w-full px-3 py-2 bg-white border border-zinc-200 rounded-xl text-xs font-mono font-semibold text-zinc-900 focus:outline-none focus:border-[#FF2D55]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-zinc-700 mb-1">Final Sale Price</label>
                    <input
                      type="text"
                      value={row.salePrice2yr || row.salePrice || row.yearly || ''}
                      onChange={(e) => handleUpdateRow(idx, { salePrice2yr: e.target.value, salePrice: e.target.value, yearly: e.target.value })}
                      placeholder="e.g. ₹7,900.00"
                      className="w-full px-3 py-2 bg-white border border-zinc-200 rounded-xl text-xs font-bold text-emerald-700 focus:outline-none focus:border-[#FF2D55]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-zinc-700 mb-1">MRP Price</label>
                    <input
                      type="text"
                      value={row.mrp2yr || row.mrp || ''}
                      onChange={(e) => handleUpdateRow(idx, { mrp2yr: e.target.value, mrp: e.target.value })}
                      placeholder="e.g. ₹9,900.00"
                      className="w-full px-3 py-2 bg-white border border-zinc-200 rounded-xl text-xs font-semibold text-zinc-900 focus:outline-none focus:border-[#FF2D55]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-zinc-700 mb-1">Discount</label>
                    <input
                      type="text"
                      value={row.discount2yr || row.discount || ''}
                      onChange={(e) => handleUpdateRow(idx, { discount2yr: e.target.value, discount: e.target.value })}
                      placeholder="e.g. 18% OFF"
                      className="w-full px-3 py-2 bg-white border border-zinc-200 rounded-xl text-xs font-semibold text-zinc-900 focus:outline-none focus:border-[#FF2D55]"
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

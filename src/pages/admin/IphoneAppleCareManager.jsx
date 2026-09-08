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
  Smartphone,
  Tag,
  FileText,
  Barcode,
  Percent,
  DollarSign,
  Eye
} from 'lucide-react';

const DEFAULT_IPHONE_ROWS = [
  { 
    model: 'iPhone 15 / iPhone 16', 
    title: 'AppleCare+ for iPhone 15 / 16', 
    description: '2 Years Apple-certified coverage for iPhone 15 & 16 with accidental damage protection.', 
    sku: 'AC-IPHONE-15-16', 
    mrp: '₹16,900.00', 
    discount: '12% OFF', 
    salePrice: '₹14,900.00', 
    monthly: '₹749.00', 
    yearly: '₹14,900.00', 
    image: '/iphone_nav/iphone_16.png', 
    isActive: true 
  },
  { 
    model: 'iPhone 16 Plus / 17', 
    title: 'AppleCare+ for iPhone 16 Plus / 17', 
    description: '2 Years Apple-certified coverage for iPhone 16 Plus & 17 with accidental damage protection.', 
    sku: 'AC-IPHONE-16P-17', 
    mrp: '₹19,900.00', 
    discount: '10% OFF', 
    salePrice: '₹17,900.00', 
    monthly: '₹899.00', 
    yearly: '₹17,900.00', 
    image: '/iphone_nav/iphone_17.png', 
    isActive: true 
  },
  { 
    model: 'iPhone 16 Pro / 16 Pro Max', 
    title: 'AppleCare+ for iPhone 16 Pro / Pro Max', 
    description: '2 Years Apple-certified coverage for iPhone 16 Pro & Pro Max with accidental damage protection.', 
    sku: 'AC-IPHONE-16PRO', 
    mrp: '₹22,900.00', 
    discount: '10% OFF', 
    salePrice: '₹20,900.00', 
    monthly: '₹1,049.00', 
    yearly: '₹20,900.00', 
    image: '/iphone_nav/iphone_16_pro.png', 
    isActive: true 
  },
  { 
    model: 'iPhone 17 Pro / 17 Pro Max', 
    title: 'AppleCare+ for iPhone 17 Pro / Pro Max', 
    description: '2 Years Apple-certified coverage for iPhone 17 Pro & Pro Max with accidental damage protection.', 
    sku: 'AC-IPHONE-17PRO', 
    mrp: '₹23,900.00', 
    discount: '9% OFF', 
    salePrice: '₹21,900.00', 
    monthly: '₹1,099.00', 
    yearly: '₹21,900.00', 
    image: '/iphone_nav/iphone_17_pro.png', 
    isActive: true 
  },
  { 
    model: 'iPhone SE', 
    title: 'AppleCare+ for iPhone SE', 
    description: '2 Years Apple-certified coverage for iPhone SE with accidental damage protection.', 
    sku: 'AC-IPHONE-SE', 
    mrp: '₹9,900.00', 
    discount: '10% OFF', 
    salePrice: '₹8,900.00', 
    monthly: '₹449.00', 
    yearly: '₹8,900.00', 
    image: '/iphone_nav/iphone_se.png', 
    isActive: true 
  }
];

export default function IphoneAppleCareManager() {
  const [pricingTables, setPricingTables] = useState([]);
  const [iphoneRows, setIphoneRows] = useState(DEFAULT_IPHONE_ROWS);
  const [headerTitle, setHeaderTitle] = useState('AppleCare+');
  const [durationLabel, setDurationLabel] = useState('2 Years');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingRowIndex, setUploadingRowIndex] = useState(null);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const res = await axiosClient.get('/settings');
      if (res.data?.appleCarePricingTables && res.data.appleCarePricingTables.length > 0) {
        setPricingTables(res.data.appleCarePricingTables);
        const iphoneTable = res.data.appleCarePricingTables.find(t => t.categoryKey === 'iphone');
        if (iphoneTable) {
          setHeaderTitle(iphoneTable.headerTitle ?? 'AppleCare+');
          setDurationLabel(iphoneTable.durationLabel ?? '2 Years');
          if (iphoneTable.rows && iphoneTable.rows.length > 0) {
            setIphoneRows(iphoneTable.rows.map(r => ({
              model: r.model || '',
              title: r.title || `AppleCare+ for ${r.model}`,
              description: r.description || `2 Years Apple-certified coverage for ${r.model}`,
              sku: r.sku || '',
              mrp: r.mrp || '',
              discount: r.discount || '',
              salePrice: r.salePrice || r.yearly || '',
              monthly: r.monthly || '',
              yearly: r.yearly || r.salePrice || '',
              image: r.image ?? '',
              isActive: r.isActive !== false
            })));
          }
        }
      }
    } catch (err) {
      console.error('Failed to load settings:', err);
      showMessage('error', 'Failed to load iPhone AppleCare settings');
    } finally {
      setLoading(false);
    }
  };

  const getFallbackImage = (modelName = '') => {
    const m = modelName.toLowerCase();
    if (m.includes('17 pro') || m.includes('16 pro') || m.includes('pro')) return '/iphone_nav/iphone_17_pro.png';
    if (m.includes('17')) return '/iphone_nav/iphone_17.png';
    if (m.includes('16')) return '/iphone_nav/iphone_16.png';
    if (m.includes('se')) return '/iphone_nav/iphone_se.png';
    return '/iphone_nav/iphone_16.png';
  };

  const handleRemoveImage = (index) => {
    handleUpdateRow(index, 'image', '');
    showMessage('success', 'Image removed! Click "Save Changes" to apply.');
  };

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 4000);
  };

  const handleUpdateRow = (index, field, value) => {
    setIphoneRows(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      if (field === 'salePrice') updated[index].yearly = value;
      if (field === 'yearly' && !updated[index].salePrice) updated[index].salePrice = value;
      return updated;
    });
  };

  const handleAddRow = () => {
    setIphoneRows(prev => [
      ...prev,
      {
        model: 'New iPhone Model',
        title: 'AppleCare+ for New iPhone Model',
        description: '2 Years Apple-certified coverage',
        sku: 'AC-IPHONE-NEW',
        mrp: '₹18,900.00',
        discount: '10% OFF',
        salePrice: '₹16,900.00',
        monthly: '₹799.00',
        yearly: '₹16,900.00',
        image: '/iphone_nav/iphone_17.png',
        isActive: true
      }
    ]);
  };

  const handleDeleteRow = async (index) => {
    if (!window.confirm('Are you sure you want to remove this iPhone AppleCare product?')) return;
    
    const updatedRows = iphoneRows.filter((_, i) => i !== index);
    setIphoneRows(updatedRows);
    
    try {
      let updatedTables = [...pricingTables];
      const iphoneTableIndex = updatedTables.findIndex(t => t.categoryKey === 'iphone');
      const newIphoneTable = {
        categoryKey: 'iphone',
        image: '/iphone_category.jpg',
        headline: 'Cover your iPhone.',
        headerTitle: headerTitle ?? 'AppleCare+',
        subheadline: 'Every iPhone comes with 1 year of hardware repair coverage.',
        durationLabel: durationLabel ?? '2 Years',
        isActive: true,
        rows: updatedRows.map(r => ({
          model: r.model || '',
          title: r.title || '',
          description: r.description || '',
          sku: r.sku || '',
          mrp: r.mrp || '',
          discount: r.discount || '',
          salePrice: r.salePrice || r.yearly || '',
          monthly: r.monthly || '',
          yearly: r.yearly || r.salePrice || '',
          image: r.image ?? '',
          isActive: r.isActive !== false
        }))
      };

      if (iphoneTableIndex !== -1) {
        updatedTables[iphoneTableIndex] = newIphoneTable;
      } else {
        updatedTables.push(newIphoneTable);
      }

      await axiosClient.put('/settings', { appleCarePricingTables: updatedTables });

      try {
        localStorage.setItem('iincept_admin_iphone_applecare_rows_v2', JSON.stringify(newIphoneTable.rows));
        localStorage.setItem('iincept_iphone_applecare_rows_v2', JSON.stringify(newIphoneTable.rows.filter(r => r.isActive !== false)));
      } catch (e) {}

      showMessage('success', 'iPhone product deleted permanently!');
    } catch (err) {
      console.error('Failed to save deletion:', err);
      showMessage('error', 'Product removed from list. Click "Save Changes" to sync database.');
    }
  };

  const handleMoveRow = (index, direction) => {
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= iphoneRows.length) return;
    setIphoneRows(prev => {
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

      const iphoneTableIndex = updatedTables.findIndex(t => t.categoryKey === 'iphone');
      const newIphoneTable = {
        categoryKey: 'iphone',
        image: '/iphone_category_v2.jpg',
        headline: 'Cover your iPhone.',
        headerTitle: headerTitle ?? 'AppleCare+',
        subheadline: 'AppleCare+ for iPhone includes unlimited incidents of accidental damage protection.',
        durationLabel: durationLabel ?? '2 Years',
        isActive: true,
        rows: iphoneRows.map(r => ({
          model: r.model || '',
          title: r.title || `AppleCare+ for ${r.model}`,
          description: r.description || `2 Years Apple-certified coverage for ${r.model}`,
          sku: r.sku || '',
          mrp: r.mrp || '',
          discount: r.discount || '',
          salePrice: r.salePrice || r.yearly || '',
          monthly: r.monthly || '',
          yearly: r.yearly || r.salePrice || '',
          image: r.image ?? '',
          isActive: r.isActive !== false
        }))
      };

      if (iphoneTableIndex !== -1) {
        updatedTables[iphoneTableIndex] = newIphoneTable;
      } else {
        updatedTables.push(newIphoneTable);
      }

      const res = await axiosClient.put('/settings', {
        appleCarePricingTables: updatedTables
      });

      if (res.data?.appleCarePricingTables) {
        setPricingTables(res.data.appleCarePricingTables);
      }

      showMessage('success', 'iPhone AppleCare products saved successfully!');
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
            <Smartphone className="h-7 w-7" />
          </div>
          <div className="min-w-0 flex-1">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-900 leading-tight">
              iPhone AppleCare Pricing Manager
            </h1>
            <p className="text-xs sm:text-sm text-zinc-500 mt-0.5 truncate sm:whitespace-normal">
              Manage title, description, SKU, MRP, discount, sale price, and image for every iPhone AppleCare product.
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
            Add iPhone Model
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
        <div className={`p-4 rounded-xl flex items-center gap-3 border text-sm font-medium ${
          message.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-rose-50 border-rose-200 text-rose-800'
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

      {/* Main iPhone Models List */}
      <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden space-y-4">
        <div className="p-5 border-b border-zinc-100 flex items-center justify-between bg-zinc-50/50">
          <div>
            <h2 className="font-bold text-zinc-900 text-lg">iPhone AppleCare Products & Pricing List</h2>
            <p className="text-xs text-zinc-500">Edit model title, description, SKU, MRP, discount & sale price for each iPhone AppleCare product.</p>
          </div>
          <span className="text-xs font-semibold px-3 py-1 bg-rose-50 text-[#FF2D55] rounded-full border border-rose-100">
            {iphoneRows.length} iPhone Products
          </span>
        </div>

        <div className="p-4 sm:p-6 space-y-6">
          {iphoneRows.map((row, idx) => (
            <div key={idx} className="p-5 bg-zinc-50/60 border border-zinc-200 rounded-2xl space-y-4 transition-all hover:border-zinc-300">
              
              {/* Row Header */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-200/80 pb-4">
                
                {/* Left: Move & Image & Model Title */}
                <div className="flex items-center gap-3.5 flex-1 min-w-0">
                  <div className="flex items-center gap-1 shrink-0">
                    <span className="text-xs font-bold text-zinc-400 w-5">{idx + 1}.</span>
                    <div className="flex flex-col gap-0.5">
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
                        disabled={idx === iphoneRows.length - 1}
                        className="p-1 hover:bg-zinc-200 text-zinc-600 rounded disabled:opacity-30 cursor-pointer border-0"
                        title="Move Down"
                      >
                        <ArrowDown className="h-3.5 w-3.5" />
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
                      {row.model || 'iPhone Model'}
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
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                      row.isActive !== false ? 'bg-[#0071e3]' : 'bg-zinc-300'
                    }`}
                    title={row.isActive !== false ? 'Model Active' : 'Model Hidden'}
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                        row.isActive !== false ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDeleteRow(idx)}
                    className="p-2 hover:bg-rose-100 text-rose-600 rounded-xl border border-transparent hover:border-rose-200 transition-all cursor-pointer"
                    title="Delete iPhone Model"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Duration Plan Selector Bar for 1-Year vs 2-Year Plan details */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-zinc-50 border border-zinc-200/80 p-3 rounded-2xl mb-4 gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-zinc-600">Select Plan Duration to Edit:</span>
                  <div className="inline-flex p-1 bg-zinc-200/80 rounded-xl">
                    <button
                      type="button"
                      onClick={() => handleUpdateRow(idx, 'activePlanTab', '1yr')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer border-0 ${
                        row.activePlanTab === '1yr'
                          ? 'bg-[#0071e3] text-white shadow-xs'
                          : 'text-zinc-700 hover:text-zinc-900 bg-transparent'
                      }`}
                    >
                      1-Year Plan Specs
                    </button>
                    <button
                      type="button"
                      onClick={() => handleUpdateRow(idx, 'activePlanTab', '2yr')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer border-0 ${
                        row.activePlanTab !== '1yr'
                          ? 'bg-[#0071e3] text-white shadow-xs'
                          : 'text-zinc-700 hover:text-zinc-900 bg-transparent'
                      }`}
                    >
                      2-Year Plan Specs
                    </button>
                  </div>
                </div>
                <span className="text-xs font-bold px-3 py-1 bg-blue-50 text-[#0071e3] rounded-full border border-blue-100">
                  Editing: {row.activePlanTab === '1yr' ? '1 Year Coverage Plan' : '2 Years Coverage Plan'}
                </span>
              </div>

              {/* Form Input Fields Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                
                {/* 1. Model / Title */}
                <div>
                  <label className="block text-xs font-bold text-zinc-700 mb-1 flex items-center gap-1">
                    <Tag className="w-3.5 h-3.5 text-[#0071e3]" />
                    Model / Title Name
                  </label>
                  <input
                    type="text"
                    value={row.model}
                    onChange={(e) => handleUpdateRow(idx, 'model', e.target.value)}
                    placeholder="e.g. iPhone 17 Pro"
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
                    placeholder="e.g. AppleCare+ for iPhone 17 Pro"
                    className="w-full px-3 py-2 bg-white border border-zinc-200 rounded-xl text-xs font-semibold text-zinc-900 focus:outline-none focus:border-[#0071e3]"
                  />
                </div>

                {/* 3. SKU */}
                <div>
                  <label className="block text-xs font-bold text-zinc-700 mb-1 flex items-center gap-1">
                    <Barcode className="w-3.5 h-3.5 text-[#0071e3]" />
                    SKU Code ({row.activePlanTab === '1yr' ? '1-Yr' : '2-Yr'})
                  </label>
                  <input
                    type="text"
                    value={row.activePlanTab === '1yr' ? (row.sku1yr || '') : (row.sku2yr || row.sku || '')}
                    onChange={(e) => {
                      if (row.activePlanTab === '1yr') handleUpdateRow(idx, 'sku1yr', e.target.value);
                      else {
                        handleUpdateRow(idx, 'sku2yr', e.target.value);
                        handleUpdateRow(idx, 'sku', e.target.value);
                      }
                    }}
                    placeholder={row.activePlanTab === '1yr' ? "e.g. AC-IPHONE-17PRO-1YR" : "e.g. AC-IPHONE-17PRO-2YR"}
                    className="w-full px-3 py-2 bg-white border border-zinc-200 rounded-xl text-xs font-semibold text-zinc-900 focus:outline-none focus:border-[#0071e3]"
                  />
                </div>

                {/* 4. MRP */}
                <div>
                  <label className="block text-xs font-bold text-zinc-700 mb-1 flex items-center gap-1">
                    <DollarSign className="w-3.5 h-3.5 text-zinc-500" />
                    MRP Price ({row.activePlanTab === '1yr' ? '1-Yr' : '2-Yr'})
                  </label>
                  <input
                    type="text"
                    value={row.activePlanTab === '1yr' ? (row.mrp1yr || '') : (row.mrp2yr || row.mrp || '')}
                    onChange={(e) => {
                      if (row.activePlanTab === '1yr') handleUpdateRow(idx, 'mrp1yr', e.target.value);
                      else {
                        handleUpdateRow(idx, 'mrp2yr', e.target.value);
                        handleUpdateRow(idx, 'mrp', e.target.value);
                      }
                    }}
                    placeholder={row.activePlanTab === '1yr' ? "e.g. ₹12,900.00" : "e.g. ₹23,900.00"}
                    className="w-full px-3 py-2 bg-white border border-zinc-200 rounded-xl text-xs font-semibold text-zinc-900 focus:outline-none focus:border-[#0071e3]"
                  />
                </div>

                {/* 5. Discount */}
                <div>
                  <label className="block text-xs font-bold text-zinc-700 mb-1 flex items-center gap-1">
                    <Percent className="w-3.5 h-3.5 text-emerald-600" />
                    Discount ({row.activePlanTab === '1yr' ? '1-Yr' : '2-Yr'})
                  </label>
                  <input
                    type="text"
                    value={row.activePlanTab === '1yr' ? (row.discount1yr || '') : (row.discount2yr || row.discount || '')}
                    onChange={(e) => {
                      if (row.activePlanTab === '1yr') handleUpdateRow(idx, 'discount1yr', e.target.value);
                      else {
                        handleUpdateRow(idx, 'discount2yr', e.target.value);
                        handleUpdateRow(idx, 'discount', e.target.value);
                      }
                    }}
                    placeholder={row.activePlanTab === '1yr' ? "e.g. 15% OFF" : "e.g. 9% OFF"}
                    className="w-full px-3 py-2 bg-white border border-zinc-200 rounded-xl text-xs font-semibold text-zinc-900 focus:outline-none focus:border-[#0071e3]"
                  />
                </div>

                {/* 6. Sale Price */}
                <div>
                  <label className="block text-xs font-bold text-zinc-700 mb-1 flex items-center gap-1">
                    <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
                    Final Sale Price ({row.activePlanTab === '1yr' ? '1-Yr' : '2-Yr'})
                  </label>
                  <input
                    type="text"
                    value={row.activePlanTab === '1yr' ? (row.salePrice1yr || '') : (row.salePrice2yr || row.salePrice || row.yearly || '')}
                    onChange={(e) => {
                      if (row.activePlanTab === '1yr') handleUpdateRow(idx, 'salePrice1yr', e.target.value);
                      else {
                        handleUpdateRow(idx, 'salePrice2yr', e.target.value);
                        handleUpdateRow(idx, 'salePrice', e.target.value);
                        handleUpdateRow(idx, 'yearly', e.target.value);
                      }
                    }}
                    placeholder={row.activePlanTab === '1yr' ? "e.g. ₹10,900.00" : "e.g. ₹21,900.00"}
                    className="w-full px-3 py-2 bg-white border border-zinc-200 rounded-xl text-xs font-bold text-emerald-700 focus:outline-none focus:border-[#0071e3]"
                  />
                </div>

                {/* 7. Image URL */}
                <div className="sm:col-span-2 md:col-span-3">
                  <label className="block text-xs font-bold text-zinc-700 mb-1 flex items-center gap-1">
                    <Upload className="w-3.5 h-3.5 text-zinc-500" />
                    Product Image URL / Uploaded Asset Path
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="text"
                      value={row.image || ''}
                      onChange={(e) => handleUpdateRow(idx, 'image', e.target.value)}
                      placeholder="e.g. /iphone_nav/iphone_17_pro.png"
                      className="w-full px-3 py-2 bg-white border border-zinc-200 rounded-xl text-xs font-mono text-zinc-800 focus:outline-none focus:border-[#0071e3]"
                    />
                    {row.image && (
                      <div className="w-10 h-10 rounded-lg border border-zinc-200 bg-white p-1 shrink-0 flex items-center justify-center overflow-hidden shadow-xs">
                        <img
                          src={row.image}
                          alt="Preview"
                          className="max-h-full max-w-full object-contain"
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* 8. Description */}
                <div className="sm:col-span-2 md:col-span-3">
                  <label className="block text-xs font-bold text-zinc-700 mb-1 flex items-center gap-1">
                    <FileText className="w-3.5 h-3.5 text-zinc-500" />
                    Card Description Paragraph ({row.activePlanTab === '1yr' ? '1-Year Coverage' : '2-Year Coverage'})
                  </label>
                  <textarea
                    rows={2}
                    value={row.activePlanTab === '1yr' ? (row.description1yr || '') : (row.description2yr || row.description || '')}
                    onChange={(e) => {
                      if (row.activePlanTab === '1yr') handleUpdateRow(idx, 'description1yr', e.target.value);
                      else {
                        handleUpdateRow(idx, 'description2yr', e.target.value);
                        handleUpdateRow(idx, 'description', e.target.value);
                      }
                    }}
                    placeholder={row.activePlanTab === '1yr' ? "1 Year Apple-certified coverage for iPhone 17 Pro." : "2 Years Apple-certified coverage for iPhone 17 Pro with accidental damage protection."}
                    className="w-full px-3 py-2 bg-white border border-zinc-200 rounded-xl text-xs font-medium text-zinc-800 focus:outline-none focus:border-[#0071e3]"
                  />
                </div>

              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

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
  Monitor,
  Tag,
  FileText,
  Barcode,
  Percent,
  DollarSign
} from 'lucide-react';

const DEFAULT_DISPLAY_ROWS = [
  { 
    model: 'Studio Display', 
    title: 'AppleCare+ for Studio Display', 
    description: '3 Years Apple-certified coverage for Studio Display.', 
    sku: 'AC-STUDIO-DISPLAY', 
    mrp: '₹14,900.00', 
    discount: '13% OFF', 
    salePrice: '₹12,900.00', 
    monthly: '₹499.00', 
    yearly: '₹12,900.00', 
    image: 'https://www.apple.com/in/applecare/images/overview/plans/display_single__bcorwfyqszaq_large_2x.jpg', 
    isActive: true 
  },
  { 
    model: 'Pro Display XDR', 
    title: 'AppleCare+ for Pro Display XDR', 
    description: '3 Years Apple-certified coverage for Pro Display XDR.', 
    sku: 'AC-PRO-DISPLAY-XDR', 
    mrp: '₹49,900.00', 
    discount: '10% OFF', 
    salePrice: '₹44,900.00', 
    monthly: '₹1,499.00', 
    yearly: '₹44,900.00', 
    image: 'https://www.apple.com/in/applecare/images/overview/plans/display_single__bcorwfyqszaq_large_2x.jpg', 
    isActive: true 
  }
];

export default function DisplayAppleCareManager() {
  const [pricingTables, setPricingTables] = useState([]);
  const [displayRows, setDisplayRows] = useState(DEFAULT_DISPLAY_ROWS);
  const [headerTitle, setHeaderTitle] = useState('AppleCare+');
  const [durationLabel, setDurationLabel] = useState('3 Years');
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
        const displayTable = res.data.appleCarePricingTables.find(t => t.categoryKey === 'display');
        if (displayTable) {
          setHeaderTitle(displayTable.headerTitle ?? 'AppleCare+');
          setDurationLabel(displayTable.durationLabel ?? '3 Years');
          if (displayTable.rows && displayTable.rows.length > 0) {
            setDisplayRows(displayTable.rows.map(r => ({
              model: r.model || '',
              title: r.title || `AppleCare+ for ${r.model}`,
              description: r.description || `3 Years Apple-certified coverage for ${r.model}`,
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
      showMessage('error', 'Failed to load Display AppleCare settings');
    } finally {
      setLoading(false);
    }
  };

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 4000);
  };

  const isCustomImage = (row) => {
    if (!row?.image) return false;
    return row.image !== 'https://www.apple.com/in/applecare/images/overview/plans/display_single__bcorwfyqszaq_large_2x.jpg';
  };

  const handleRemoveImage = (index) => {
    handleUpdateRow(index, 'image', '');
    showMessage('success', 'Image removed! Click "Save Changes" to apply.');
  };

  const handleUpdateRow = (index, field, value) => {
    setDisplayRows(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      if (field === 'salePrice') updated[index].yearly = value;
      if (field === 'yearly' && !updated[index].salePrice) updated[index].salePrice = value;
      return updated;
    });
  };

  const handleAddRow = () => {
    setDisplayRows(prev => [
      ...prev,
      {
        model: 'New Display Model',
        title: 'AppleCare+ for New Display Model',
        description: '3 Years Apple-certified coverage',
        sku: 'AC-DISPLAY-NEW',
        mrp: '₹19,900.00',
        discount: '10% OFF',
        salePrice: '₹17,900.00',
        monthly: '₹599.00',
        yearly: '₹17,900.00',
        image: 'https://www.apple.com/in/applecare/images/overview/plans/display_single__bcorwfyqszaq_large_2x.jpg',
        isActive: true
      }
    ]);
  };

  const handleDeleteRow = async (index) => {
    if (!window.confirm('Are you sure you want to remove this Display AppleCare product?')) return;
    
    const updatedRows = displayRows.filter((_, i) => i !== index);
    setDisplayRows(updatedRows);
    
    try {
      let updatedTables = [...pricingTables];
      const displayTableIndex = updatedTables.findIndex(t => t.categoryKey === 'display');
      const newDisplayTable = {
        categoryKey: 'display',
        image: 'https://www.apple.com/in/applecare/images/overview/plans/display_single__bcorwfyqszaq_large_2x.jpg',
        headline: 'Cover your display.',
        headerTitle: headerTitle ?? 'AppleCare+',
        subheadline: 'AppleCare+ for Display provides up to 3 years of expert support and hardware coverage.',
        durationLabel: durationLabel ?? '3 Years',
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

      if (displayTableIndex !== -1) {
        updatedTables[displayTableIndex] = newDisplayTable;
      } else {
        updatedTables.push(newDisplayTable);
      }

      await axiosClient.put('/settings', { appleCarePricingTables: updatedTables });

      try {
        localStorage.setItem('iincept_admin_display_applecare_rows_v1', JSON.stringify(newDisplayTable.rows));
        localStorage.setItem('iincept_display_applecare_rows_v1', JSON.stringify(newDisplayTable.rows.filter(r => r.isActive !== false)));
      } catch (e) {}

      showMessage('success', 'Display product deleted permanently!');
    } catch (err) {
      console.error('Failed to save deletion:', err);
      showMessage('error', 'Product removed from list. Click "Save Changes" to sync database.');
    }
  };

  const handleMoveRow = (index, direction) => {
    if (direction === 'first') {
      setDisplayRows(prev => {
        const updated = [...prev];
        const [item] = updated.splice(index, 1);
        return [item, ...updated];
      });
    } else if (direction === 'up' && index > 0) {
      setDisplayRows(prev => {
        const updated = [...prev];
        const temp = updated[index];
        updated[index] = updated[index - 1];
        updated[index - 1] = temp;
        return updated;
      });
    } else if (direction === 'down' && index < displayRows.length - 1) {
      setDisplayRows(prev => {
        const updated = [...prev];
        const temp = updated[index];
        updated[index] = updated[index + 1];
        updated[index + 1] = temp;
        return updated;
      });
    } else if (direction === 'last') {
      setDisplayRows(prev => {
        const updated = [...prev];
        const [item] = updated.splice(index, 1);
        return [...updated, item];
      });
    }
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

      const displayTableIndex = updatedTables.findIndex(t => t.categoryKey === 'display');
      const newDisplayTable = {
        categoryKey: 'display',
        image: 'https://www.apple.com/in/applecare/images/overview/plans/display_single__bcorwfyqszaq_large_2x.jpg',
        headline: 'Cover your display.',
        headerTitle: headerTitle ?? 'AppleCare+',
        subheadline: 'AppleCare+ for Display provides up to 3 years of expert support and hardware coverage.',
        durationLabel: durationLabel ?? '3 Years',
        isActive: true,
        rows: displayRows.map(r => ({
          model: r.model || '',
          title: r.title || `AppleCare+ for ${r.model}`,
          description: r.description || `3 Years Apple-certified coverage for ${r.model}`,
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

      if (displayTableIndex !== -1) {
        updatedTables[displayTableIndex] = newDisplayTable;
      } else {
        updatedTables.push(newDisplayTable);
      }

      const res = await axiosClient.put('/settings', {
        appleCarePricingTables: updatedTables
      });

      if (res.data?.appleCarePricingTables) {
        setPricingTables(res.data.appleCarePricingTables);
      }

      showMessage('success', 'Display AppleCare products saved successfully!');
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
          <div className="p-3 bg-blue-50 text-[#0071e3] rounded-2xl border border-blue-100 shrink-0">
            <Monitor className="h-7 w-7" />
          </div>
          <div className="min-w-0 flex-1">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-900 leading-tight">
              Display AppleCare Pricing Manager
            </h1>
            <p className="text-xs sm:text-sm text-zinc-500 mt-0.5 truncate sm:whitespace-normal">
              Manage title, description, SKU, MRP, discount, sale price, and image for Studio Display & Pro Display XDR AppleCare products.
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
            Add Display Model
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
              placeholder="e.g. 3 years"
              className="w-full px-3.5 py-2 border border-zinc-200 rounded-xl text-sm font-semibold text-zinc-900 focus:outline-none focus:border-[#0071e3]"
            />
          </div>
        </div>
      </div>

      {/* Main Display Models List */}
      <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden space-y-4">
        <div className="p-5 border-b border-zinc-100 flex items-center justify-between bg-zinc-50/50">
          <div>
            <h2 className="font-bold text-zinc-900 text-lg">Display AppleCare Products & Pricing List</h2>
            <p className="text-xs text-zinc-500">Edit model title, description, SKU, MRP, discount & sale price for each Display AppleCare product.</p>
          </div>
          <span className="text-xs font-semibold px-3 py-1 bg-blue-50 text-[#0071e3] rounded-full border border-blue-100">
            {displayRows.length} Display Products
          </span>
        </div>

        <div className="p-4 sm:p-6 space-y-6">
          {displayRows.map((row, idx) => (
            <div key={idx} className="p-5 bg-zinc-50/60 border border-zinc-200 rounded-2xl space-y-4 transition-all hover:border-zinc-300">
              
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
                        disabled={idx === displayRows.length - 1}
                        className="p-1 hover:bg-zinc-200 text-zinc-600 rounded disabled:opacity-30 cursor-pointer border-0"
                        title="Move Down"
                      >
                        <ArrowDown className="h-3.5 w-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleMoveRow(idx, 'last')}
                        disabled={idx === displayRows.length - 1}
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
                          e.target.src = 'https://www.apple.com/in/applecare/images/overview/plans/display_single__bcorwfyqszaq_large_2x.jpg';
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center bg-zinc-50 text-zinc-400 p-1">
                        <Monitor className="h-6 w-6 text-zinc-400" />
                      </div>
                    )}
                    {uploadingRowIndex === idx && (
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                        <Loader2 className="h-4 w-4 text-white animate-spin" />
                      </div>
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <h3 className="font-bold text-zinc-900 text-base leading-snug truncate">
                      {row.title || `AppleCare+ for ${row.model}`}
                    </h3>
                    <p className="text-xs text-zinc-500 font-mono">SKU: {row.sku || 'N/A'}</p>
                  </div>
                </div>

                {/* Right: Actions */}
                <div className="flex items-center gap-3 shrink-0">
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-zinc-700 bg-white px-3 py-1.5 rounded-xl border border-zinc-200">
                    <input
                      type="checkbox"
                      checked={row.isActive !== false}
                      onChange={(e) => handleUpdateRow(idx, 'isActive', e.target.checked)}
                      className="rounded text-[#0071e3] focus:ring-0"
                    />
                    <span>Active</span>
                  </label>

                  <button
                    type="button"
                    onClick={() => handleDeleteRow(idx)}
                    className="p-2 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-xl transition-all cursor-pointer border-0"
                    title="Delete product"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Form Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                
                {/* Model Name */}
                <div>
                  <label className="block text-xs font-bold text-zinc-700 mb-1 flex items-center gap-1">
                    <Tag className="h-3.5 w-3.5 text-zinc-400" /> Model Name
                  </label>
                  <input
                    type="text"
                    value={row.model || ''}
                    onChange={(e) => handleUpdateRow(idx, 'model', e.target.value)}
                    placeholder="e.g. Studio Display"
                    className="w-full px-3 py-2 bg-white border border-zinc-200 rounded-xl text-xs font-semibold text-zinc-900 focus:outline-none focus:border-[#0071e3]"
                  />
                </div>

                {/* Card Title */}
                <div>
                  <label className="block text-xs font-bold text-zinc-700 mb-1 flex items-center gap-1">
                    <FileText className="h-3.5 w-3.5 text-zinc-400" /> Title
                  </label>
                  <input
                    type="text"
                    value={row.title || ''}
                    onChange={(e) => handleUpdateRow(idx, 'title', e.target.value)}
                    placeholder="e.g. AppleCare+ for Studio Display"
                    className="w-full px-3 py-2 bg-white border border-zinc-200 rounded-xl text-xs font-semibold text-zinc-900 focus:outline-none focus:border-[#0071e3]"
                  />
                </div>

                {/* SKU */}
                <div>
                  <label className="block text-xs font-bold text-zinc-700 mb-1 flex items-center gap-1">
                    <Barcode className="h-3.5 w-3.5 text-zinc-400" /> SKU
                  </label>
                  <input
                    type="text"
                    value={row.sku || ''}
                    onChange={(e) => handleUpdateRow(idx, 'sku', e.target.value)}
                    placeholder="e.g. AC-STUDIO-DISPLAY"
                    className="w-full px-3 py-2 bg-white border border-zinc-200 rounded-xl text-xs font-mono font-semibold text-zinc-900 focus:outline-none focus:border-[#0071e3]"
                  />
                </div>

                {/* Description */}
                <div className="md:col-span-3">
                  <label className="block text-xs font-bold text-zinc-700 mb-1">Description</label>
                  <input
                    type="text"
                    value={row.description || ''}
                    onChange={(e) => handleUpdateRow(idx, 'description', e.target.value)}
                    placeholder="e.g. 3 Years Apple-certified coverage for Studio Display"
                    className="w-full px-3 py-2 bg-white border border-zinc-200 rounded-xl text-xs font-medium text-zinc-800 focus:outline-none focus:border-[#0071e3]"
                  />
                </div>

                {/* Pricing Fields: MRP, Discount, Sale Price, Monthly */}
                <div>
                  <label className="block text-xs font-bold text-zinc-700 mb-1 flex items-center gap-1">
                    <DollarSign className="h-3.5 w-3.5 text-zinc-400" /> MRP (Original Price)
                  </label>
                  <input
                    type="text"
                    value={row.mrp || ''}
                    onChange={(e) => handleUpdateRow(idx, 'mrp', e.target.value)}
                    placeholder="e.g. ₹14,900.00"
                    className="w-full px-3 py-2 bg-white border border-zinc-200 rounded-xl text-xs font-bold text-zinc-900 focus:outline-none focus:border-[#0071e3]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-700 mb-1 flex items-center gap-1">
                    <Percent className="h-3.5 w-3.5 text-zinc-400" /> Discount Badge
                  </label>
                  <input
                    type="text"
                    value={row.discount || ''}
                    onChange={(e) => handleUpdateRow(idx, 'discount', e.target.value)}
                    placeholder="e.g. 13% OFF or -13%"
                    className="w-full px-3 py-2 bg-white border border-zinc-200 rounded-xl text-xs font-bold text-emerald-600 focus:outline-none focus:border-[#0071e3]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-700 mb-1 flex items-center gap-1">
                    <DollarSign className="h-3.5 w-3.5 text-emerald-600" /> Final Sale Price (Yearly)
                  </label>
                  <input
                    type="text"
                    value={row.salePrice || row.yearly || ''}
                    onChange={(e) => handleUpdateRow(idx, 'salePrice', e.target.value)}
                    placeholder="e.g. 12,900.00 or ₹12,900.00"
                    className="w-full px-3 py-2 bg-white border border-emerald-300 rounded-xl text-xs font-extrabold text-emerald-700 focus:outline-none focus:border-emerald-600"
                  />
                </div>

                {/* Image URL & File Upload */}
                <div className="md:col-span-3 pt-2">
                  <label className="block text-xs font-bold text-zinc-700 mb-1">Product Image (URL or Upload File)</label>
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
                    <input
                      type="text"
                      value={row.image || ''}
                      onChange={(e) => handleUpdateRow(idx, 'image', e.target.value)}
                      placeholder="e.g. https://... or /display_category.jpg"
                      className="flex-1 px-3 py-2 bg-white border border-zinc-200 rounded-xl text-xs font-mono text-zinc-800 focus:outline-none focus:border-[#0071e3]"
                    />
                    
                    <label className="px-3.5 py-2 bg-zinc-100 hover:bg-zinc-200 text-zinc-800 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 border-0 shrink-0">
                      <Upload className="h-3.5 w-3.5 text-zinc-600" />
                      <span>Upload</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageFileUpload(idx, e.target.files[0])}
                        className="hidden"
                      />
                    </label>

                    {isCustomImage(row) && (
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(idx)}
                        className="px-3 py-2 bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-semibold rounded-xl transition-all cursor-pointer border-0 shrink-0"
                      >
                        Reset Image
                      </button>
                    )}
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

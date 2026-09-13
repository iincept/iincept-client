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
  Laptop,
  Tag,
  FileText,
  Barcode,
  Percent,
  DollarSign
} from 'lucide-react';

const DEFAULT_MAC_ROWS = [
  { model: 'Mac mini', title: 'AppleCare+ for Mac mini', description: '3 Years Apple-certified coverage for Mac mini', sku: 'AC-MAC-MINI', mrp: '₹14,900.00', discount: '13% OFF', salePrice: '₹12,900.00', monthly: '₹429.00', yearly: '₹12,900.00', image: '/mac_nav/mac_mini.png', isActive: true },
  { model: 'Mac Studio', title: 'AppleCare+ for Mac Studio', description: '3 Years Apple-certified coverage for Mac Studio', sku: 'AC-MAC-STUDIO', mrp: '₹22,900.00', discount: '13% OFF', salePrice: '₹19,900.00', monthly: '₹679.00', yearly: '₹19,900.00', image: '/mac_nav/mac_studio.png', isActive: true },
  { model: 'iMac', title: 'AppleCare+ for iMac', description: '3 Years Apple-certified coverage for iMac', sku: 'AC-IMAC-24', mrp: '₹22,900.00', discount: '13% OFF', salePrice: '₹19,900.00', monthly: '₹679.00', yearly: '₹19,900.00', image: '/mac_nav/imac.png', isActive: true },
  { model: 'Macbook Neo', title: 'AppleCare+ for Macbook Neo', description: '3 Years Apple-certified coverage for Macbook Neo', sku: 'AC-MACBOOK-NEO', mrp: '₹18,900.00', discount: '11% OFF', salePrice: '₹16,900.00', monthly: '₹579.00', yearly: '₹16,900.00', image: '/mac_nav/macbook_neo.png', isActive: true },
  { model: 'MacBook Air 13″', title: 'AppleCare+ for MacBook Air 13″', description: '3 Years Apple-certified coverage for MacBook Air 13″', sku: 'AC-MBA-13', mrp: '₹25,900.00', discount: '12% OFF', salePrice: '₹22,900.00', monthly: '₹779.00', yearly: '₹22,900.00', image: '/mac_nav/macbook_air.png', isActive: true },
  { model: 'MacBook Air 15″', title: 'AppleCare+ for MacBook Air 15″', description: '3 Years Apple-certified coverage for MacBook Air 15″', sku: 'AC-MBA-15', mrp: '₹27,900.00', discount: '12% OFF', salePrice: '₹24,900.00', monthly: '₹849.00', yearly: '₹24,900.00', image: '/mac_nav/macbook_air.png', isActive: true },
  { model: 'MacBook Pro 14″', title: 'AppleCare+ for MacBook Pro 14″', description: '3 Years Apple-certified coverage for MacBook Pro 14″', sku: 'AC-MBP-14', mrp: '₹33,900.00', discount: '12% OFF', salePrice: '₹29,900.00', monthly: '₹999.00', yearly: '₹29,900.00', image: '/mac_nav/macbook_pro.png', isActive: true },
  { model: 'MacBook Pro 16″', title: 'AppleCare+ for MacBook Pro 16″', description: '3 Years Apple-certified coverage for MacBook Pro 16″', sku: 'AC-MBP-16', mrp: '₹45,900.00', discount: '11% OFF', salePrice: '₹40,900.00', monthly: '₹1,379.00', yearly: '₹40,900.00', image: '/mac_nav/macbook_pro.png', isActive: true },
  { model: 'Mac Pro', title: 'AppleCare+ for Mac Pro', description: '3 Years Apple-certified coverage for Mac Pro', sku: 'AC-MAC-PRO', mrp: '₹55,900.00', discount: '11% OFF', salePrice: '₹49,900.00', monthly: '₹1,699.00', yearly: '₹49,900.00', image: '/mac_nav/mac_studio.png', isActive: true }
];

export default function AppleCareManager() {
  const [pricingTables, setPricingTables] = useState([]);
  const [macRows, setMacRows] = useState(DEFAULT_MAC_ROWS);
  const [headerTitle, setHeaderTitle] = useState('');
  const [durationLabel, setDurationLabel] = useState('');
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
        const macTable = res.data.appleCarePricingTables.find(t => t.categoryKey === 'mac');
        if (macTable) {
          setHeaderTitle(macTable.headerTitle ?? '');
          setDurationLabel(macTable.durationLabel ?? '');
          if (macTable.rows && macTable.rows.length > 0) {
            setMacRows(macTable.rows.map(r => ({
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
            })));
          }
        }
      }
    } catch (err) {
      console.error('Failed to load settings:', err);
      showMessage('error', 'Failed to load AppleCare settings');
    } finally {
      setLoading(false);
    }
  };

  const getFallbackImage = (modelName = '') => {
    const m = modelName.toLowerCase();
    if (m.includes('mini')) return '/mac_nav/mac_mini.png';
    if (m.includes('studio') || m.includes('pro pro')) return '/mac_nav/mac_studio.png';
    if (m.includes('imac')) return '/mac_nav/imac.png';
    if (m.includes('neo')) return '/mac_nav/macbook_neo.png';
    if (m.includes('air')) return '/mac_nav/macbook_air.png';
    if (m.includes('macbook pro') || m.includes('pro')) return '/mac_nav/macbook_pro.png';
    return '/mac_nav/macbook_air.png';
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
    setMacRows(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      // Keep yearly and salePrice synced
      if (field === 'salePrice') updated[index].yearly = value;
      if (field === 'yearly' && !updated[index].salePrice) updated[index].salePrice = value;
      return updated;
    });
  };

  const handleAddRow = () => {
    setMacRows(prev => [
      ...prev,
      {
        model: 'New Mac Model',
        title: 'AppleCare+ for New Mac Model',
        description: '3 Years Apple-certified coverage',
        sku: 'AC-MAC-NEW',
        mrp: '₹19,900.00',
        discount: '10% OFF',
        salePrice: '₹17,900.00',
        monthly: '₹599.00',
        yearly: '₹17,900.00',
        image: '/mac_nav/macbook_air.png',
        isActive: true
      }
    ]);
  };

  const handleDeleteRow = async (index) => {
    if (!window.confirm('Are you sure you want to remove this Mac AppleCare product?')) return;
    
    const updatedRows = macRows.filter((_, i) => i !== index);
    setMacRows(updatedRows);
    
    try {
      let updatedTables = [...pricingTables];
      const macTableIndex = updatedTables.findIndex(t => t.categoryKey === 'mac');
      const newMacTable = {
        categoryKey: 'mac',
        image: '/mac_category.jpg',
        headline: 'Cover your Mac.',
        headerTitle: headerTitle ?? 'AppleCare+',
        subheadline: 'AppleCare+ for Mac provides expert technical support and hardware coverage.',
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

      if (macTableIndex !== -1) {
        updatedTables[macTableIndex] = newMacTable;
      } else {
        updatedTables.push(newMacTable);
      }

      await axiosClient.put('/settings', { appleCarePricingTables: updatedTables });

      try {
        localStorage.setItem('iincept_admin_mac_applecare_rows_v2', JSON.stringify(newMacTable.rows));
        localStorage.setItem('iincept_mac_applecare_rows_v2', JSON.stringify(newMacTable.rows.filter(r => r.isActive !== false)));
      } catch (e) {}

      showMessage('success', 'Mac product deleted permanently!');
    } catch (err) {
      console.error('Failed to save deletion:', err);
      showMessage('error', 'Product removed from list. Click "Save Changes" to sync database.');
    }
  };

  const handleMoveRow = (index, direction) => {
    if (direction === 'first') {
      setMacRows(prev => {
        const updated = [...prev];
        const [item] = updated.splice(index, 1);
        return [item, ...updated];
      });
      return;
    }
    if (direction === 'last') {
      setMacRows(prev => {
        const updated = [...prev];
        const [item] = updated.splice(index, 1);
        return [...updated, item];
      });
      return;
    }
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= macRows.length) return;
    setMacRows(prev => {
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

      const macTableIndex = updatedTables.findIndex(t => t.categoryKey === 'mac');
      const newMacTable = {
        categoryKey: 'mac',
        image: '/macbook_category_v3.jpg',
        headline: 'Cover your Mac.',
        headerTitle: headerTitle ?? '',
        subheadline: 'AppleCare+ for Mac provides up to 3 years of expert support and hardware coverage.',
        durationLabel: durationLabel ?? '',
        isActive: true,
        rows: macRows.map(r => ({
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

      if (macTableIndex !== -1) {
        updatedTables[macTableIndex] = newMacTable;
      } else {
        updatedTables.push(newMacTable);
      }

      const res = await axiosClient.put('/settings', {
        appleCarePricingTables: updatedTables
      });

      if (res.data?.appleCarePricingTables) {
        setPricingTables(res.data.appleCarePricingTables);
      }

      showMessage('success', 'MacBook AppleCare products saved successfully!');
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
            <Laptop className="h-7 w-7" />
          </div>
          <div className="min-w-0 flex-1">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-900 leading-tight">
              MacBook AppleCare Pricing Manager
            </h1>
            <p className="text-xs sm:text-sm text-zinc-500 mt-0.5 truncate sm:whitespace-normal">
              Manage title, description, SKU, MRP, discount, sale price, and image for every MacBook AppleCare product.
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
            Add Mac Model
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

      {/* Main Mac Models List */}
      <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden space-y-4">
        <div className="p-5 border-b border-zinc-100 flex items-center justify-between bg-zinc-50/50">
          <div>
            <h2 className="font-bold text-zinc-900 text-lg">MacCare Products & Pricing List</h2>
            <p className="text-xs text-zinc-500">Edit model title, description, SKU, MRP, discount & sale price for each AppleCare product.</p>
          </div>
          <span className="text-xs font-semibold px-3 py-1 bg-blue-50 text-[#0071e3] rounded-full border border-blue-100">
            {macRows.length} Mac Products
          </span>
        </div>

        <div className="p-4 sm:p-6 space-y-6">
          {macRows.map((row, idx) => (
            <div key={idx} className="p-5 bg-zinc-50/60 border border-zinc-200 rounded-2xl space-y-4 transition-all hover:border-zinc-300">
              
              {/* Row Header: Reorder + Image + Title Preview + Actions */}
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
                        disabled={idx === macRows.length - 1}
                        className="p-1 hover:bg-zinc-200 text-zinc-600 rounded disabled:opacity-30 cursor-pointer border-0"
                        title="Move Down"
                      >
                        <ArrowDown className="h-3.5 w-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleMoveRow(idx, 'last')}
                        disabled={idx === macRows.length - 1}
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
                      {row.model || 'Mac Model'}
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
                    title="Delete Mac Model"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
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
                    placeholder="e.g. Mac mini"
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
                    placeholder="e.g. AppleCare+ for Mac mini"
                    className="w-full px-3 py-2 bg-white border border-zinc-200 rounded-xl text-xs font-semibold text-zinc-900 focus:outline-none focus:border-[#0071e3]"
                  />
                </div>

                {/* 3. SKU */}
                <div>
                  <label className="block text-xs font-bold text-zinc-700 mb-1 flex items-center gap-1">
                    <Barcode className="w-3.5 h-3.5 text-[#0071e3]" />
                    SKU Code
                  </label>
                  <input
                    type="text"
                    value={row.sku || ''}
                    onChange={(e) => handleUpdateRow(idx, 'sku', e.target.value)}
                    placeholder="e.g. AC-MAC-MINI"
                    className="w-full px-3 py-2 bg-white border border-zinc-200 rounded-xl text-xs font-semibold text-zinc-900 focus:outline-none focus:border-[#0071e3]"
                  />
                </div>

                {/* 4. MRP */}
                <div>
                  <label className="block text-xs font-bold text-zinc-700 mb-1 flex items-center gap-1">
                    <DollarSign className="w-3.5 h-3.5 text-zinc-500" />
                    MRP Price
                  </label>
                  <input
                    type="text"
                    value={row.mrp || ''}
                    onChange={(e) => handleUpdateRow(idx, 'mrp', e.target.value)}
                    placeholder="e.g. ₹14,900.00"
                    className="w-full px-3 py-2 bg-white border border-zinc-200 rounded-xl text-xs font-semibold text-zinc-900 focus:outline-none focus:border-[#0071e3]"
                  />
                </div>

                {/* 5. Discount */}
                <div>
                  <label className="block text-xs font-bold text-zinc-700 mb-1 flex items-center gap-1">
                    <Percent className="w-3.5 h-3.5 text-emerald-600" />
                    Discount Label
                  </label>
                  <input
                    type="text"
                    value={row.discount || ''}
                    onChange={(e) => handleUpdateRow(idx, 'discount', e.target.value)}
                    placeholder="e.g. 13% OFF"
                    className="w-full px-3 py-2 bg-white border border-zinc-200 rounded-xl text-xs font-semibold text-zinc-900 focus:outline-none focus:border-[#0071e3]"
                  />
                </div>

                {/* 6. Sale Price / 3-Year Price */}
                <div>
                  <label className="block text-xs font-bold text-zinc-700 mb-1 flex items-center gap-1">
                    <DollarSign className="w-3.5 h-3.5 text-[#0071e3]" />
                    Sale Price / 3-Year Price
                  </label>
                  <input
                    type="text"
                    value={row.salePrice || row.yearly || ''}
                    onChange={(e) => handleUpdateRow(idx, 'salePrice', e.target.value)}
                    placeholder="e.g. ₹12,900.00"
                    className="w-full px-3 py-2 bg-white border border-zinc-200 rounded-xl text-xs font-semibold text-zinc-900 focus:outline-none focus:border-[#0071e3]"
                  />
                </div>

                {/* 7. Image URL field */}
                <div className="sm:col-span-2 md:col-span-2">
                  <label className="block text-xs font-bold text-zinc-700 mb-1">Image URL / Path</label>
                  <div className="flex items-center gap-3">
                    <input
                      type="text"
                      value={row.image || ''}
                      onChange={(e) => handleUpdateRow(idx, 'image', e.target.value)}
                      placeholder="e.g. /mac_nav/mac_mini.png"
                      className="w-full px-3 py-2 bg-white border border-zinc-200 rounded-xl text-xs font-medium text-zinc-700 focus:outline-none focus:border-[#0071e3]"
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
                  <label className="block text-xs font-bold text-zinc-700 mb-1">Product Description</label>
                  <input
                    type="text"
                    value={row.description || ''}
                    onChange={(e) => handleUpdateRow(idx, 'description', e.target.value)}
                    placeholder="e.g. 3 Years Apple-certified hardware & battery protection for Mac mini"
                    className="w-full px-3 py-2 bg-white border border-zinc-200 rounded-xl text-xs font-medium text-zinc-900 focus:outline-none focus:border-[#0071e3]"
                  />
                </div>

              </div>

            </div>
          ))}
        </div>

        {/* Add Model & Save Actions Bar */}
        <div className="p-4 bg-zinc-50 border-t border-zinc-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <button
            type="button"
            onClick={handleAddRow}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2.5 bg-white hover:bg-zinc-100 text-zinc-800 text-xs font-bold rounded-xl border border-zinc-200 transition-all cursor-pointer"
          >
            <Plus className="h-4 w-4 text-[#0071e3]" />
            Add Another Mac Product
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 bg-[#0071e3] hover:bg-[#0077ed] text-white text-xs font-bold rounded-xl shadow-xs transition-all disabled:opacity-50 cursor-pointer border-0"
          >
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            Save Changes
          </button>
        </div>
      </div>

      {/* Live Preview Box */}
      <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-zinc-500">
            <ShieldCheck className="h-4 w-4 text-[#0071e3]" />
            <span>LIVE PREVIEW — STOREFRONT MACBOOK APPLECARE TABLE</span>
          </div>
        </div>

        <div className="border border-zinc-200 rounded-2xl p-6 bg-white shadow-xs">
          <div className="flex items-end justify-between border-b border-zinc-200 pb-3 mb-2">
            <div className="text-lg font-bold text-zinc-900">Models & Protection Plans</div>
            <div className="text-right">
              <div className="text-sm font-bold text-[#FF2D55] leading-tight mb-1">{headerTitle || 'AppleCare+'}</div>
              <div className="flex items-center justify-end text-right">
                <span className="text-sm font-bold text-zinc-900 min-w-[85px] text-right">{durationLabel || '3 years'}</span>
              </div>
            </div>
          </div>

          <div className="divide-y divide-zinc-100">
            {macRows.map((row, idx) => (
              <div key={idx} className={`py-4 flex items-center justify-between px-3 rounded-xl transition-colors ${row.isActive !== false ? 'hover:bg-zinc-50' : 'opacity-40 bg-zinc-50/50'}`}>
                <div className="flex items-center gap-4">
                  <img
                    src={row.image || getFallbackImage(row.model)}
                    alt={row.model}
                    className="w-12 h-12 object-contain shrink-0 drop-shadow-xs"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-zinc-900 text-sm sm:text-base">{row.model || 'Model Name'}</span>
                      {row.sku && <span className="text-[10px] font-mono font-semibold text-zinc-500 bg-zinc-100 px-2 py-0.5 rounded border border-zinc-200">SKU: {row.sku}</span>}
                    </div>
                    {row.description && <p className="text-xs text-zinc-500 mt-0.5 font-medium">{row.description}</p>}
                  </div>
                </div>

                <div className="flex items-center gap-2 text-right justify-end">
                  {row.mrp && <span className="text-xs line-through text-zinc-400 font-medium">{row.mrp}</span>}
                  {row.discount && <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">{row.discount}</span>}
                  <span className="text-sm sm:text-base text-zinc-900 tabular-nums font-extrabold min-w-[85px] text-right">{row.salePrice || row.yearly || '—'}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Action Bar */}
      <div className="bg-white border border-zinc-200 rounded-2xl sm:rounded-3xl p-5 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <span className="text-xs font-medium text-zinc-500 text-center sm:text-left">
          Click &quot;Save Changes&quot; to save all product prices and details to the storefront.
        </span>
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={handleAddRow}
            className="px-4 py-2.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-800 text-xs font-semibold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 border-0 shadow-xs"
          >
            <Plus className="h-4 w-4 text-[#0071e3]" />
            Add Mac Model
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="px-6 py-2.5 bg-[#0071e3] hover:bg-[#0077ed] text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer border-0 disabled:opacity-50"
          >
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>

    </div>
  );
}

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
  Tv,
  Tag,
  FileText,
  Barcode,
  Percent,
  DollarSign
} from 'lucide-react';

const DEFAULT_TV_HOME_ROWS = [
  { model: 'Apple TV 4K', title: 'AppleCare+ for Apple TV 4K', description: '3 Years Apple-certified coverage for Apple TV 4K.', sku: 'AC-TV-4K', mrp: '₹3,490.00', discount: '17% OFF', salePrice: '₹2,900.00', monthly: '₹99.00', yearly: '₹2,900.00', image: '/applecare_official_hero.png', isActive: true },
  { model: 'HomePod mini', title: 'AppleCare+ for HomePod mini', description: '2 Years Apple-certified coverage for HomePod mini.', sku: 'AC-HOMEPOD-MINI', mrp: '₹1,990.00', discount: '20% OFF', salePrice: '₹1,600.00', monthly: '₹79.00', yearly: '₹1,600.00', image: '/applecare_official_hero.png', isActive: true },
  { model: 'HomePod', title: 'AppleCare+ for HomePod', description: '2 Years Apple-certified coverage for HomePod.', sku: 'AC-HOMEPOD-STD', mrp: '₹4,900.00', discount: '20% OFF', salePrice: '₹3,900.00', monthly: '₹199.00', yearly: '₹3,900.00', image: '/applecare_official_hero.png', isActive: true }
];

export default function TvHomeAppleCareManager() {
  const [pricingTables, setPricingTables] = useState([]);
  const [tvHomeRows, setTvHomeRows] = useState(DEFAULT_TV_HOME_ROWS);
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
        const tvHomeTable = res.data.appleCarePricingTables.find(t => t.categoryKey === 'tv-home');
        if (tvHomeTable) {
          setHeaderTitle(tvHomeTable.headerTitle ?? 'AppleCare+');
          setDurationLabel(tvHomeTable.durationLabel ?? '3 Years');
          if (tvHomeTable.rows && tvHomeTable.rows.length > 0) {
            setTvHomeRows(tvHomeTable.rows.map(r => ({
              model: r.model || '',
              title: r.title || `AppleCare+ for ${r.model}`,
              description: r.description || `Apple-certified coverage for ${r.model}`,
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
      showMessage('error', 'Failed to load TV & Home AppleCare settings');
    } finally {
      setLoading(false);
    }
  };

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 4000);
  };

  const handleRemoveImage = (index) => {
    handleUpdateRow(index, 'image', '');
    showMessage('success', 'Image removed! Click "Save Changes" to apply.');
  };

  const handleUpdateRow = (index, field, value) => {
    setTvHomeRows(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      if (field === 'salePrice') updated[index].yearly = value;
      if (field === 'yearly' && !updated[index].salePrice) updated[index].salePrice = value;
      return updated;
    });
  };

  const handleAddRow = () => {
    setTvHomeRows(prev => [
      ...prev,
      {
        model: 'New TV/Home Product',
        title: 'AppleCare+ for New TV/Home Product',
        description: 'Apple-certified coverage',
        sku: 'AC-TVHOME-NEW',
        mrp: '₹3,900.00',
        discount: '15% OFF',
        salePrice: '₹3,200.00',
        monthly: '₹129.00',
        yearly: '₹3,200.00',
        image: '/applecare_official_hero.png',
        isActive: true
      }
    ]);
  };

  const handleDeleteRow = async (index) => {
    if (!window.confirm('Are you sure you want to remove this TV & Home AppleCare product?')) return;
    
    const updatedRows = tvHomeRows.filter((_, i) => i !== index);
    setTvHomeRows(updatedRows);
    
    try {
      let updatedTables = [...pricingTables];
      const tvHomeTableIndex = updatedTables.findIndex(t => t.categoryKey === 'tv-home');
      const newTvHomeTable = {
        categoryKey: 'tv-home',
        image: '/applecare_official_hero.png',
        headline: 'Cover your TV & Home products.',
        headerTitle: headerTitle ?? 'AppleCare+',
        subheadline: 'AppleCare+ for TV & Home provides expert technical support and hardware coverage.',
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

      if (tvHomeTableIndex !== -1) {
        updatedTables[tvHomeTableIndex] = newTvHomeTable;
      } else {
        updatedTables.push(newTvHomeTable);
      }

      await axiosClient.put('/settings', { appleCarePricingTables: updatedTables });

      try {
        localStorage.setItem('iincept_admin_tvhome_applecare_rows_v2', JSON.stringify(newTvHomeTable.rows));
        localStorage.setItem('iincept_tvhome_applecare_rows_v2', JSON.stringify(newTvHomeTable.rows.filter(r => r.isActive !== false)));
      } catch (e) {}

      showMessage('success', 'TV & Home product deleted permanently!');
    } catch (err) {
      console.error('Failed to save deletion:', err);
      showMessage('error', 'Product removed from list. Click "Save Changes" to sync database.');
    }
  };

  const handleMoveRow = (index, direction) => {
    if (direction === 'first') {
      setTvHomeRows(prev => {
        const updated = [...prev];
        const [item] = updated.splice(index, 1);
        return [item, ...updated];
      });
      return;
    }
    if (direction === 'last') {
      setTvHomeRows(prev => {
        const updated = [...prev];
        const [item] = updated.splice(index, 1);
        return [...updated, item];
      });
      return;
    }
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= tvHomeRows.length) return;
    setTvHomeRows(prev => {
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

      const tvHomeTableIndex = updatedTables.findIndex(t => t.categoryKey === 'tv-home');
      const newTvHomeTable = {
        categoryKey: 'tv-home',
        image: '/applecare_official_hero.png',
        headline: 'Cover your Apple TV.',
        headerTitle: headerTitle ?? 'AppleCare+',
        subheadline: 'AppleCare+ for Apple TV and HomePod includes 3 years of hardware support.',
        durationLabel: durationLabel ?? '3 Years',
        isActive: true,
        rows: tvHomeRows.map(r => ({
          model: r.model || '',
          title: r.title || `AppleCare+ for ${r.model}`,
          description: r.description || `Apple-certified coverage for ${r.model}`,
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

      if (tvHomeTableIndex !== -1) {
        updatedTables[tvHomeTableIndex] = newTvHomeTable;
      } else {
        updatedTables.push(newTvHomeTable);
      }

      const res = await axiosClient.put('/settings', {
        appleCarePricingTables: updatedTables
      });

      if (res.data?.appleCarePricingTables) {
        setPricingTables(res.data.appleCarePricingTables);
      }

      showMessage('success', 'TV & Home AppleCare products saved successfully!');
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
          <div className="p-3 bg-[#FF2D55]/10 text-[#FF2D55] rounded-2xl border border-rose-100 shrink-0">
            <Tv className="h-7 w-7" />
          </div>
          <div className="min-w-0 flex-1">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-900 leading-tight">
              TV & Home AppleCare Pricing Manager
            </h1>
            <p className="text-xs sm:text-sm text-zinc-500 mt-0.5 truncate sm:whitespace-normal">
              Manage title, description, SKU, MRP, discount, sale price, and image for every TV & Home AppleCare product.
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
            Add TV/Home Model
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

      {/* Main TV & Home Models List */}
      <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden space-y-4">
        <div className="p-5 border-b border-zinc-100 flex items-center justify-between bg-zinc-50/50">
          <div>
            <h2 className="font-bold text-zinc-900 text-lg">TV & Home AppleCare Products & Pricing List</h2>
            <p className="text-xs text-zinc-500">Edit model title, description, SKU, MRP, discount & sale price for each TV & Home AppleCare product.</p>
          </div>
          <span className="text-xs font-semibold px-3 py-1 bg-rose-50 text-[#FF2D55] rounded-full border border-rose-100">
            {tvHomeRows.length} TV & Home Products
          </span>
        </div>

        <div className="p-4 sm:p-6 space-y-6">
          {tvHomeRows.map((row, idx) => (
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
                        disabled={idx === tvHomeRows.length - 1}
                        className="p-1 hover:bg-zinc-200 text-zinc-600 rounded disabled:opacity-30 cursor-pointer border-0"
                        title="Move Down"
                      >
                        <ArrowDown className="h-3.5 w-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleMoveRow(idx, 'last')}
                        disabled={idx === tvHomeRows.length - 1}
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
                          e.target.src = '/applecare_official_hero.png';
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center bg-zinc-50 text-zinc-400 p-1">
                        <img
                          src="/applecare_official_hero.png"
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
                      {row.model || 'TV/Home Model'}
                    </span>
                    <span className="text-xs text-zinc-500 font-medium block truncate">
                      {row.sku ? `SKU: ${row.sku}` : 'No SKU'} • {row.salePrice || row.yearly || 'No Price Set'}
                    </span>
                  </div>
                </div>

                {/* Right Actions */}
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
                    title="Delete TV/Home Model"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Form Input Fields Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                
                <div>
                  <label className="block text-xs font-bold text-zinc-700 mb-1 flex items-center gap-1">
                    <Tag className="w-3.5 h-3.5 text-[#0071e3]" />
                    Model / Title Name
                  </label>
                  <input
                    type="text"
                    value={row.model}
                    onChange={(e) => handleUpdateRow(idx, 'model', e.target.value)}
                    placeholder="e.g. Apple TV 4K"
                    className="w-full px-3 py-2 bg-white border border-zinc-200 rounded-xl text-xs font-semibold text-zinc-900 focus:outline-none focus:border-[#0071e3]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-700 mb-1 flex items-center gap-1">
                    <FileText className="w-3.5 h-3.5 text-[#0071e3]" />
                    Full Product Title
                  </label>
                  <input
                    type="text"
                    value={row.title || ''}
                    onChange={(e) => handleUpdateRow(idx, 'title', e.target.value)}
                    placeholder="e.g. AppleCare+ for Apple TV 4K"
                    className="w-full px-3 py-2 bg-white border border-zinc-200 rounded-xl text-xs font-semibold text-zinc-900 focus:outline-none focus:border-[#0071e3]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-700 mb-1 flex items-center gap-1">
                    <Barcode className="w-3.5 h-3.5 text-[#0071e3]" />
                    SKU Code
                  </label>
                  <input
                    type="text"
                    value={row.sku || ''}
                    onChange={(e) => handleUpdateRow(idx, 'sku', e.target.value)}
                    placeholder="e.g. AC-TV-4K"
                    className="w-full px-3 py-2 bg-white border border-zinc-200 rounded-xl text-xs font-semibold text-zinc-900 focus:outline-none focus:border-[#0071e3]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-700 mb-1 flex items-center gap-1">
                    <DollarSign className="w-3.5 h-3.5 text-zinc-500" />
                    MRP Price
                  </label>
                  <input
                    type="text"
                    value={row.mrp || ''}
                    onChange={(e) => handleUpdateRow(idx, 'mrp', e.target.value)}
                    placeholder="e.g. ₹3,490.00"
                    className="w-full px-3 py-2 bg-white border border-zinc-200 rounded-xl text-xs font-semibold text-zinc-900 focus:outline-none focus:border-[#0071e3]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-700 mb-1 flex items-center gap-1">
                    <Percent className="w-3.5 h-3.5 text-emerald-600" />
                    Discount Label
                  </label>
                  <input
                    type="text"
                    value={row.discount || ''}
                    onChange={(e) => handleUpdateRow(idx, 'discount', e.target.value)}
                    placeholder="e.g. 17% OFF"
                    className="w-full px-3 py-2 bg-white border border-zinc-200 rounded-xl text-xs font-semibold text-zinc-900 focus:outline-none focus:border-[#0071e3]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-700 mb-1 flex items-center gap-1">
                    <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
                    Final Sale Price
                  </label>
                  <input
                    type="text"
                    value={row.salePrice || row.yearly || ''}
                    onChange={(e) => handleUpdateRow(idx, 'salePrice', e.target.value)}
                    placeholder="e.g. ₹2,900.00"
                    className="w-full px-3 py-2 bg-white border border-zinc-200 rounded-xl text-xs font-bold text-emerald-700 focus:outline-none focus:border-[#0071e3]"
                  />
                </div>

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
                      placeholder="e.g. /applecare_official_hero.png"
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

                <div className="sm:col-span-2 md:col-span-3">
                  <label className="block text-xs font-bold text-zinc-700 mb-1 flex items-center gap-1">
                    <FileText className="w-3.5 h-3.5 text-zinc-500" />
                    Card Description Paragraph
                  </label>
                  <textarea
                    rows={2}
                    value={row.description || ''}
                    onChange={(e) => handleUpdateRow(idx, 'description', e.target.value)}
                    placeholder="e.g. 3 Years Apple-certified coverage for Apple TV 4K."
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

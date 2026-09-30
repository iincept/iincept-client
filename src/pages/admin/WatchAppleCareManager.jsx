import { useState, useEffect } from 'react';
import axiosClient from '../../services/axiosClient';
import { notifyAdminChange } from '../../services/liveSyncService';
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
  Watch,
  Tag,
  FileText,
  Barcode,
  Percent,
  DollarSign
} from 'lucide-react';

const DEFAULT_WATCH_ROWS = [
  { 
    model: 'Apple Watch SE', 
    title: 'AppleCare+ for Apple Watch SE', 
    description: 'Apple-certified coverage for Apple Watch SE with accidental damage protection.', 
    description1yr: '1 Year Apple-certified coverage for Apple Watch SE with accidental damage protection.',
    description2yr: '2 Years Apple-certified coverage for Apple Watch SE with accidental damage protection.',
    sku: 'AC-WATCH-SE', 
    sku1yr: 'AC-WATCH-SE-1YR',
    sku2yr: 'AC-WATCH-SE-2YR',
    mrp: '₹5,900.00', 
    mrp1yr: '₹3,900.00',
    mrp2yr: '₹5,900.00',
    discount: '16% OFF', 
    discount1yr: '10% OFF',
    discount2yr: '16% OFF',
    salePrice: '₹4,900.00', 
    salePrice1yr: '₹3,510.00',
    salePrice2yr: '₹4,900.00',
    monthly: '₹249.00', 
    yearly: '₹4,900.00', 
    image: '/watch_nav/apple_watch_se.png', 
    isActive: true 
  },
  { 
    model: 'Apple Watch SE 3', 
    title: 'AppleCare+ for Apple Watch SE 3 (40mm & 44mm)', 
    description: 'Apple-certified coverage for Apple Watch SE 3 with accidental damage protection.', 
    description1yr: '1 Year Apple-certified coverage for Apple Watch SE 3 with accidental damage protection.',
    description2yr: '2 Years Apple-certified coverage for Apple Watch SE 3 with accidental damage protection.',
    sku: 'AC-WATCH-SE3', 
    sku1yr: 'AC-WATCH-SE3-1YR',
    sku2yr: 'AC-WATCH-SE3-2YR',
    mrp: '₹5,900.00', 
    mrp1yr: '₹3,900.00',
    mrp2yr: '₹5,900.00',
    discount: '16% OFF', 
    discount1yr: '10% OFF',
    discount2yr: '16% OFF',
    salePrice: '₹4,900.00', 
    salePrice1yr: '₹3,510.00',
    salePrice2yr: '₹4,900.00',
    monthly: '₹249.00', 
    yearly: '₹4,900.00', 
    image: '/watch_nav/apple_watch_se.png', 
    isActive: true 
  },
  { 
    model: 'Apple Watch Series 10', 
    title: 'AppleCare+ for Apple Watch Series 10', 
    description: 'Apple-certified coverage for Apple Watch Series 10 with accidental damage protection.', 
    description1yr: '1 Year Apple-certified coverage for Apple Watch Series 10 with accidental damage protection.',
    description2yr: '2 Years Apple-certified coverage for Apple Watch Series 10 with accidental damage protection.',
    sku: 'AC-WATCH-S10', 
    sku1yr: 'AC-WATCH-S10-1YR',
    sku2yr: 'AC-WATCH-S10-2YR',
    mrp: '₹8,900.00', 
    mrp1yr: '₹5,900.00',
    mrp2yr: '₹8,900.00',
    discount: '12% OFF', 
    discount1yr: '10% OFF',
    discount2yr: '12% OFF',
    salePrice: '₹7,900.00', 
    salePrice1yr: '₹5,310.00',
    salePrice2yr: '₹7,900.00',
    monthly: '₹399.00', 
    yearly: '₹7,900.00', 
    image: '/watch_nav/apple_watch_s10.png', 
    isActive: true 
  },
  { 
    model: 'Apple Watch Ultra 2', 
    title: 'AppleCare+ for Apple Watch Ultra 2', 
    description: 'Apple-certified coverage for Apple Watch Ultra 2 with accidental damage protection.', 
    description1yr: '1 Year Apple-certified coverage for Apple Watch Ultra 2 with accidental damage protection.',
    description2yr: '2 Years Apple-certified coverage for Apple Watch Ultra 2 with accidental damage protection.',
    sku: 'AC-WATCH-ULTRA', 
    sku1yr: 'AC-WATCH-ULTRA-1YR',
    sku2yr: 'AC-WATCH-ULTRA-2YR',
    mrp: '₹11,900.00', 
    mrp1yr: '₹7,900.00',
    mrp2yr: '₹11,900.00',
    discount: '16% OFF', 
    discount1yr: '10% OFF',
    discount2yr: '16% OFF',
    salePrice: '₹9,900.00', 
    salePrice1yr: '₹7,110.00',
    salePrice2yr: '₹9,900.00',
    monthly: '₹499.00', 
    yearly: '₹9,900.00', 
    image: '/watch_nav/apple_watch_ultra.png', 
    isActive: true 
  }
];

export default function WatchAppleCareManager() {
  const [pricingTables, setPricingTables] = useState([]);
  const [watchRows, setWatchRows] = useState(DEFAULT_WATCH_ROWS);
  const [headerTitle, setHeaderTitle] = useState('AppleCare+');
  const [durationLabel, setDurationLabel] = useState('1 Year & 2 Years');
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
        const watchTable = res.data.appleCarePricingTables.find(t => t.categoryKey === 'watch');
        if (watchTable) {
          setHeaderTitle(watchTable.headerTitle ?? 'AppleCare+');
          setDurationLabel(watchTable.durationLabel ?? '1 Year & 2 Years');
          if (watchTable.rows && watchTable.rows.length > 0) {
            setWatchRows(watchTable.rows.map(r => ({
              model: r.model || '',
              title: r.title || `AppleCare+ for ${r.model}`,
              description: r.description || r.description2yr || `Apple-certified coverage for ${r.model}`,
              description1yr: r.description1yr || `1 Year Apple-certified coverage for ${r.model}`,
              description2yr: r.description2yr || r.description || `2 Years Apple-certified coverage for ${r.model}`,
              sku: r.sku || r.sku2yr || '',
              sku1yr: r.sku1yr || (r.sku ? `${r.sku}-1YR` : ''),
              sku2yr: r.sku2yr || r.sku || '',
              mrp: r.mrp || r.mrp2yr || '',
              mrp1yr: r.mrp1yr || '',
              mrp2yr: r.mrp2yr || r.mrp || '',
              discount: r.discount || r.discount2yr || '',
              discount1yr: r.discount1yr || '',
              discount2yr: r.discount2yr || r.discount || '',
              salePrice: r.salePrice || r.salePrice2yr || r.yearly || '',
              salePrice1yr: r.salePrice1yr || '',
              salePrice2yr: r.salePrice2yr || r.salePrice || r.yearly || '',
              monthly: r.monthly || '',
              yearly: r.yearly || r.salePrice || r.salePrice2yr || '',
              image: r.image ?? '',
              planType: r.planType || 'APPLE CARE+',
              duration: r.duration || watchTable.durationLabel || '1 Year & 2 Years',
              isActive: r.isActive !== false
            })));
          }
        }
      }
    } catch (err) {
      console.error('Failed to load settings:', err);
      showMessage('error', 'Failed to load Watch AppleCare settings');
    } finally {
      setLoading(false);
    }
  };

  const getFallbackImage = (modelName = '') => {
    const m = modelName.toLowerCase();
    if (m.includes('ultra')) return '/watch_nav/apple_watch_ultra.png';
    if (m.includes('se')) return '/watch_nav/apple_watch_se.png';
    return '/watch_nav/apple_watch_s10.png';
  };

  const handleRemoveImage = (index) => {
    handleUpdateRow(index, 'image', '');
    showMessage('success', 'Image removed! Click "Save Changes" to apply.');
  };

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 4000);
  };

  const parsePriceNumber = (val) => {
    if (val === null || val === undefined) return 0;
    if (typeof val === 'number') return val;
    const cleaned = String(val).replace(/[^0-9.]/g, '');
    return parseFloat(cleaned) || 0;
  };

  const calculateFinalPriceStr = (mrp, discount) => {
    const mrpNum = parsePriceNumber(mrp);
    const discNum = Math.min(100, Math.max(0, parseFloat(discount) || 0));
    const finalNum = Math.max(0, Math.round(mrpNum - (mrpNum * discNum / 100)));
    return `₹${finalNum.toLocaleString('en-IN')}`;
  };

  const handleUpdateRow = (index, fieldOrObject, value) => {
    setWatchRows(prev => {
      const updated = [...prev];
      const current = updated[index];
      let row;
      if (typeof fieldOrObject === 'object' && fieldOrObject !== null) {
        row = { ...current, ...fieldOrObject };
      } else {
        row = { ...current, [fieldOrObject]: value };
      }

      if (fieldOrObject === 'discount' || fieldOrObject === 'discount2yr') {
        const discVal = value ? (String(value).includes('%') ? value : `${value}% OFF`) : '';
        row.discount = discVal;
        row.discount2yr = discVal;
      }
      if (fieldOrObject === 'discount1yr') {
        row.discount1yr = value ? (String(value).includes('%') ? value : `${value}% OFF`) : '';
      }

      if (row.mrp1yr || row.discount1yr !== undefined) {
        const disc1 = Math.min(100, Math.max(0, parseFloat(row.discount1yr) || 0));
        row.salePrice1yr = calculateFinalPriceStr(row.mrp1yr, disc1);
      }

      const mrp2Val = row.mrp2yr || row.mrp;
      const disc2Val = row.discount2yr || row.discount;
      const disc2 = Math.min(100, Math.max(0, parseFloat(disc2Val) || 0));
      const computedFinal = calculateFinalPriceStr(mrp2Val, disc2);
      row.salePrice2yr = computedFinal;
      row.salePrice = computedFinal;
      row.yearly = computedFinal;

      updated[index] = row;
      return updated;
    });
  };

  const handleAddRow = () => {
    setWatchRows(prev => [
      ...prev,
      {
        model: 'New Apple Watch Model',
        title: 'AppleCare+ for New Apple Watch Model',
        description: 'Apple-certified coverage for New Apple Watch Model',
        description1yr: '1 Year Apple-certified coverage',
        description2yr: '2 Years Apple-certified coverage',
        sku: 'AC-WATCH-NEW',
        sku1yr: 'AC-WATCH-NEW-1YR',
        sku2yr: 'AC-WATCH-NEW-2YR',
        mrp: '₹8,900.00',
        mrp1yr: '₹5,900.00',
        mrp2yr: '₹8,900.00',
        discount: '10% OFF',
        discount1yr: '10% OFF',
        discount2yr: '10% OFF',
        salePrice: '₹8,010.00',
        salePrice1yr: '₹5,310.00',
        salePrice2yr: '₹8,010.00',
        monthly: '₹399.00',
        yearly: '₹8,010.00',
        image: '/watch_nav/apple_watch_s10.png',
        isActive: true
      }
    ]);
  };

  const handleDeleteRow = async (index) => {
    if (!window.confirm('Are you sure you want to remove this Watch AppleCare product?')) return;
    
    const updatedRows = watchRows.filter((_, i) => i !== index);
    setWatchRows(updatedRows);
    
    try {
      let updatedTables = [...pricingTables];
      const watchTableIndex = updatedTables.findIndex(t => t.categoryKey === 'watch');
      const newWatchTable = {
        categoryKey: 'watch',
        image: '/watch_category.jpg',
        headline: 'Cover your Apple Watch.',
        headerTitle: headerTitle ?? 'AppleCare+',
        subheadline: 'AppleCare+ for Apple Watch includes coverage options for 1 Year and 2 Years with accidental damage protection.',
        durationLabel: durationLabel ?? '1 Year & 2 Years',
        isActive: true,
        rows: updatedRows.map(r => ({
          model: r.model || '',
          title: r.title || `AppleCare+ for ${r.model}`,
          description: r.description || r.description2yr || `Apple-certified coverage for ${r.model}`,
          description1yr: r.description1yr || `1 Year Apple-certified coverage for ${r.model}`,
          description2yr: r.description2yr || r.description || `2 Years Apple-certified coverage for ${r.model}`,
          sku: r.sku2yr || r.sku || '',
          sku1yr: r.sku1yr || (r.sku ? `${r.sku}-1YR` : ''),
          sku2yr: r.sku2yr || r.sku || '',
          mrp: r.mrp2yr || r.mrp || '',
          mrp1yr: r.mrp1yr || '',
          mrp2yr: r.mrp2yr || r.mrp || '',
          discount: r.discount2yr || r.discount || '',
          discount1yr: r.discount1yr || '',
          discount2yr: r.discount2yr || r.discount || '',
          salePrice: r.salePrice2yr || r.salePrice || r.yearly || '',
          salePrice1yr: r.salePrice1yr || '',
          salePrice2yr: r.salePrice2yr || r.salePrice || r.yearly || '',
          monthly: r.monthly || '',
          yearly: r.yearly || r.salePrice || '',
          image: r.image ?? '',
          planType: r.planType || 'APPLE CARE+',
          duration: r.duration || durationLabel || '1 Year & 2 Years',
          isActive: r.isActive !== false
        }))
      };

      if (watchTableIndex !== -1) {
        updatedTables[watchTableIndex] = newWatchTable;
      } else {
        updatedTables.push(newWatchTable);
      }

      await axiosClient.put('/settings', { appleCarePricingTables: updatedTables });

      try {
        localStorage.setItem('iincept_admin_watch_applecare_rows_v2', JSON.stringify(newWatchTable.rows));
        localStorage.setItem('iincept_watch_applecare_rows_v2', JSON.stringify(newWatchTable.rows.filter(r => r.isActive !== false)));
      } catch (e) {}

      showMessage('success', 'Watch product deleted permanently!');
    } catch (err) {
      console.error('Failed to save deletion:', err);
      showMessage('error', 'Product removed from list. Click "Save Changes" to sync database.');
    }
  };

  const handleMoveRow = (index, direction) => {
    if (direction === 'first') {
      setWatchRows(prev => {
        const updated = [...prev];
        const [item] = updated.splice(index, 1);
        return [item, ...updated];
      });
      return;
    }
    if (direction === 'last') {
      setWatchRows(prev => {
        const updated = [...prev];
        const [item] = updated.splice(index, 1);
        return [...updated, item];
      });
      return;
    }
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= watchRows.length) return;
    setWatchRows(prev => {
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

      const watchTableIndex = updatedTables.findIndex(t => t.categoryKey === 'watch');
      const newWatchTable = {
        categoryKey: 'watch',
        image: '/watch_category.jpg',
        headline: 'Cover your Apple Watch.',
        headerTitle: headerTitle ?? 'AppleCare+',
        subheadline: 'AppleCare+ for Apple Watch includes coverage options for 1 Year and 2 Years with accidental damage protection.',
        durationLabel: durationLabel ?? '1 Year & 2 Years',
        isActive: true,
        rows: watchRows.map(r => {
          const sale1 = r.salePrice1yr || calculateFinalPriceStr(r.mrp1yr, r.discount1yr);
          const sale2 = r.salePrice2yr || r.salePrice || calculateFinalPriceStr(r.mrp2yr || r.mrp, r.discount2yr || r.discount);
          return {
            model: r.model || '',
            title: r.title || `AppleCare+ for ${r.model}`,
            description: r.description || r.description2yr || `Apple-certified coverage for ${r.model}`,
            description1yr: r.description1yr || `1 Year Apple-certified coverage for ${r.model}`,
            description2yr: r.description2yr || r.description || `2 Years Apple-certified coverage for ${r.model}`,
            sku: r.sku2yr || r.sku || '',
            sku1yr: r.sku1yr || (r.sku ? `${r.sku}-1YR` : ''),
            sku2yr: r.sku2yr || r.sku || '',
            mrp: r.mrp2yr || r.mrp || '',
            mrp1yr: r.mrp1yr || '',
            mrp2yr: r.mrp2yr || r.mrp || '',
            discount: r.discount2yr || r.discount || '',
            discount1yr: r.discount1yr || '',
            discount2yr: r.discount2yr || r.discount || '',
            salePrice: sale2,
            salePrice1yr: sale1,
            salePrice2yr: sale2,
            monthly: r.monthly || '',
            yearly: sale2,
            image: r.image ?? '',
            planType: r.planType || 'APPLE CARE+',
            duration: r.duration || durationLabel || '1 Year & 2 Years',
            isActive: r.isActive !== false
          };
        })
      };

      if (watchTableIndex !== -1) {
        updatedTables[watchTableIndex] = newWatchTable;
      } else {
        updatedTables.push(newWatchTable);
      }

      const res = await axiosClient.put('/settings', { appleCarePricingTables: updatedTables });
      if (res.data) {
        setPricingTables(updatedTables);
        try {
          localStorage.setItem('iincept_admin_watch_applecare_rows_v2', JSON.stringify(newWatchTable.rows));
          localStorage.setItem('iincept_watch_applecare_rows_v2', JSON.stringify(newWatchTable.rows.filter(r => r.isActive !== false)));
        } catch (e) {}
        notifyAdminChange('appleCare');
        showMessage('success', 'Watch AppleCare settings saved successfully!');
      }
    } catch (err) {
      console.error('Failed to save settings:', err);
      showMessage('error', 'Failed to save Watch AppleCare settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-[#0071e3]" />
      </div>
    );
  }

  return (
    <div className="space-y-6 text-left max-w-6xl mx-auto pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm">
        <div className="flex items-center gap-3.5">
          <div className="p-3 bg-rose-50 text-[#FF2D55] rounded-xl border border-rose-100">
            <Watch className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-zinc-900 tracking-tight">Watch AppleCare+ Manager</h1>
            <p className="text-xs text-zinc-500 font-medium">Configure individual 1-Year and 2-Year AppleCare+ plans for Apple Watch models.</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleAddRow}
            className="px-4 py-2.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-800 text-xs font-semibold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 border-0 shadow-xs"
          >
            <Plus className="h-4 w-4 text-[#0071e3]" />
            Add Watch Model
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

      {/* Global Header Settings */}
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
            <label className="block text-xs font-bold text-zinc-700 mb-1">Duration Label</label>
            <input
              type="text"
              value={durationLabel}
              onChange={(e) => setDurationLabel(e.target.value)}
              placeholder="e.g. 1 Year & 2 Years"
              className="w-full px-3.5 py-2 border border-zinc-200 rounded-xl text-sm font-semibold text-zinc-900 focus:outline-none focus:border-[#0071e3]"
            />
          </div>
        </div>
      </div>

      {/* Main Watch Models List */}
      <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden space-y-4">
        <div className="p-5 border-b border-zinc-100 flex items-center justify-between bg-zinc-50/50">
          <div>
            <h2 className="font-bold text-zinc-900 text-lg">Watch AppleCare Products & Pricing List</h2>
            <p className="text-xs text-zinc-500">Edit model title, image, and individual 1-Year & 2-Year plan pricing specs.</p>
          </div>
          <span className="text-xs font-semibold px-3 py-1 bg-rose-50 text-[#FF2D55] rounded-full border border-rose-100">
            {watchRows.length} Watch Products
          </span>
        </div>

        <div className="p-4 sm:p-6 space-y-6">
          {watchRows.map((row, idx) => (
            <div key={idx} className="p-5 bg-white border border-zinc-200/80 rounded-2xl space-y-4 shadow-xs transition-all hover:border-zinc-300 hover:shadow-sm">
              
              {/* Row Header */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-200/80 pb-4">
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
                        disabled={idx === watchRows.length - 1}
                        className="p-1 hover:bg-zinc-200 text-zinc-600 rounded disabled:opacity-30 cursor-pointer border-0"
                        title="Move Down"
                      >
                        <ArrowDown className="h-3.5 w-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleMoveRow(idx, 'last')}
                        disabled={idx === watchRows.length - 1}
                        className="p-1 hover:bg-zinc-200 text-zinc-600 rounded disabled:opacity-30 cursor-pointer border-0"
                        title="Move to Last (Bottom)"
                      >
                        <ArrowDownToLine className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>

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
                      {row.model || 'Watch Model'}
                    </span>
                    <span className="text-xs text-zinc-500 font-medium block truncate">
                      1-Yr: {row.salePrice1yr || calculateFinalPriceStr(row.mrp1yr, row.discount1yr)} • 2-Yr: {row.salePrice2yr || row.salePrice || calculateFinalPriceStr(row.mrp2yr || row.mrp, row.discount2yr || row.discount)}
                    </span>
                  </div>
                </div>

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
                    title="Delete Watch Model"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Common Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 bg-zinc-50 p-4 rounded-xl border border-zinc-200/60 mb-4">
                <div>
                  <label className="block text-xs font-bold text-zinc-700 mb-1 flex items-center gap-1">
                    <Tag className="w-3.5 h-3.5 text-[#0071e3]" />
                    Model Name
                  </label>
                  <input
                    type="text"
                    value={row.model}
                    onChange={(e) => handleUpdateRow(idx, 'model', e.target.value)}
                    placeholder="e.g. Apple Watch Series 10"
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
                    placeholder="e.g. AppleCare+ for Apple Watch Series 10"
                    className="w-full px-3 py-2 bg-white border border-zinc-200 rounded-xl text-xs font-semibold text-zinc-900 focus:outline-none focus:border-[#0071e3]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-700 mb-1 flex items-center gap-1">
                    <Upload className="w-3.5 h-3.5 text-zinc-500" />
                    Product Image URL
                  </label>
                  <input
                    type="text"
                    value={row.image || ''}
                    onChange={(e) => handleUpdateRow(idx, 'image', e.target.value)}
                    placeholder="e.g. /watch_nav/apple_watch_s10.png"
                    className="w-full px-3 py-2 bg-white border border-zinc-200 rounded-xl text-xs font-semibold text-zinc-900 focus:outline-none focus:border-[#0071e3]"
                  />
                </div>
              </div>

              {/* 1-YEAR COVERAGE PLAN SPECS */}
              <div className="p-4 bg-sky-50/50 border border-sky-200/80 rounded-2xl space-y-3">
                <div className="flex items-center justify-between border-b border-sky-200/60 pb-2">
                  <span className="text-xs font-extrabold uppercase text-[#0071e3] tracking-wider flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#0071e3]"></span>
                    1-Year Plan Specs (AppleCare+)
                  </span>
                  <span className="text-[10px] font-bold px-2.5 py-0.5 bg-sky-100 text-[#0071e3] rounded-full border border-sky-200">
                    1-Year Coverage
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-zinc-700 mb-1">SKU Code (1-Yr)</label>
                    <input
                      type="text"
                      value={row.sku1yr || ''}
                      onChange={(e) => handleUpdateRow(idx, 'sku1yr', e.target.value)}
                      placeholder="e.g. AC-WATCH-S10-1YR"
                      className="w-full px-3 py-2 bg-white border border-zinc-200 rounded-xl text-xs font-mono font-semibold text-zinc-900 focus:outline-none focus:border-[#0071e3]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-zinc-700 mb-1 flex items-center justify-between">
                      <span>MRP Price (₹)</span>
                      <span className="text-[9px] text-[#0071e3] font-semibold uppercase">EDITABLE</span>
                    </label>
                    <input
                      type="text"
                      value={row.mrp1yr || ''}
                      onChange={(e) => handleUpdateRow(idx, 'mrp1yr', e.target.value)}
                      placeholder="e.g. ₹5,900.00"
                      className="w-full px-3 py-2 bg-white border border-zinc-200 rounded-xl text-xs font-bold text-zinc-900 focus:outline-none focus:border-[#0071e3]"
                    />
                    <span className="text-[9px] text-zinc-400 mt-0.5 block font-medium">Enter 1-Yr MRP</span>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-zinc-700 mb-1">Discount (%)</label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={(row.discount1yr !== undefined && row.discount1yr !== null) ? String(row.discount1yr).replace(/[^0-9.]/g, '') : ''}
                      onChange={(e) => handleUpdateRow(idx, 'discount1yr', e.target.value)}
                      placeholder="0 to 100"
                      className="w-full px-3 py-2 bg-white border border-zinc-200 rounded-xl text-xs font-semibold text-zinc-900 focus:outline-none focus:border-[#0071e3]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-zinc-700 mb-1 flex items-center justify-between">
                      <span>Final Price (₹)</span>
                      <span className="text-[9px] text-emerald-600 font-bold uppercase">AUTO</span>
                    </label>
                    <input
                      type="text"
                      value={calculateFinalPriceStr(row.mrp1yr, row.discount1yr)}
                      readOnly
                      disabled
                      placeholder="e.g. ₹5,310"
                      className="w-full px-3 py-2 bg-emerald-50/60 border border-emerald-200/80 rounded-xl text-xs font-extrabold text-emerald-800 cursor-not-allowed select-none focus:outline-none"
                    />
                    <span className="text-[9px] text-emerald-600 mt-0.5 block font-medium">AUTOMATICALLY CALCULATED</span>
                  </div>
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
                    <label className="block text-[11px] font-bold text-zinc-700 mb-1">SKU Code (2-Yr)</label>
                    <input
                      type="text"
                      value={row.sku2yr || row.sku || ''}
                      onChange={(e) => handleUpdateRow(idx, 'sku2yr', e.target.value)}
                      placeholder="e.g. AC-WATCH-S10"
                      className="w-full px-3 py-2 bg-white border border-zinc-200 rounded-xl text-xs font-mono font-semibold text-zinc-900 focus:outline-none focus:border-[#FF2D55]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-zinc-700 mb-1 flex items-center justify-between">
                      <span>MRP Price (₹)</span>
                      <span className="text-[9px] text-[#FF2D55] font-semibold uppercase">EDITABLE</span>
                    </label>
                    <input
                      type="text"
                      value={row.mrp2yr || row.mrp || ''}
                      onChange={(e) => handleUpdateRow(idx, 'mrp2yr', e.target.value)}
                      placeholder="e.g. ₹8,900.00"
                      className="w-full px-3 py-2 bg-white border border-zinc-200 rounded-xl text-xs font-bold text-zinc-900 focus:outline-none focus:border-[#FF2D55]"
                    />
                    <span className="text-[9px] text-zinc-400 mt-0.5 block font-medium">Enter 2-Yr MRP</span>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-zinc-700 mb-1">Discount (%)</label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={(row.discount2yr !== undefined && row.discount2yr !== null && row.discount2yr !== '') ? String(row.discount2yr).replace(/[^0-9.]/g, '') : ((row.discount !== undefined && row.discount !== null) ? String(row.discount).replace(/[^0-9.]/g, '') : '')}
                      onChange={(e) => handleUpdateRow(idx, 'discount2yr', e.target.value)}
                      placeholder="0 to 100"
                      className="w-full px-3 py-2 bg-white border border-zinc-200 rounded-xl text-xs font-semibold text-zinc-900 focus:outline-none focus:border-[#FF2D55]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-zinc-700 mb-1 flex items-center justify-between">
                      <span>Final Price (₹)</span>
                      <span className="text-[9px] text-emerald-600 font-bold uppercase">AUTO</span>
                    </label>
                    <input
                      type="text"
                      value={calculateFinalPriceStr(row.mrp2yr || row.mrp, row.discount2yr || row.discount)}
                      readOnly
                      disabled
                      placeholder="e.g. ₹7,900"
                      className="w-full px-3 py-2 bg-emerald-50/60 border border-emerald-200/80 rounded-xl text-xs font-extrabold text-emerald-800 cursor-not-allowed select-none focus:outline-none"
                    />
                    <span className="text-[9px] text-emerald-600 mt-0.5 block font-medium">AUTOMATICALLY CALCULATED</span>
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

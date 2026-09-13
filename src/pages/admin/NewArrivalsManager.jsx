import { useState, useEffect } from 'react';
import axiosClient from '../../services/axiosClient';
import { notifyAdminChange } from '../../services/liveSyncService';
import { 
  Sparkles, 
  Plus, 
  Trash2, 
  Upload, 
  X, 
  Check, 
  Loader2, 
  AlertCircle, 
  ArrowUp, 
  ArrowDown, 
  ArrowUpToLine,
  ArrowDownToLine,
  Image as ImageIcon, 
  Package
} from 'lucide-react';

export default function NewArrivalsManager() {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // New Arrivals State
  const [newArrivals, setNewArrivals] = useState([]);
  const [storeProducts, setStoreProducts] = useState([]);
  const [selectedProductId, setSelectedProductId] = useState('');
  const [uploadingIndex, setUploadingIndex] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      // Fetch settings
      const settingsRes = await axiosClient.get('/settings');
      let items = settingsRes.data?.homeNewArrivals || [];

      if (!items || items.length === 0) {
        items = [
          { id: '1', name: 'iPhone 17 Pro', tagline: 'All out Pro.', price: 'From ₹1,34,900', monthlyPrice: 'or ₹5,621/mo.*', image: '/iphone_nav/iphone_17_pro.png', path: '/iphone', isActive: true },
          { id: '2', name: 'MacBook Neo', tagline: 'Amazing Mac. Surprising price.', price: 'From ₹79,900', monthlyPrice: 'or ₹3,329/mo.*', image: '/mac_nav/macbook_neo.png', path: '/macbook', isActive: true },
          { id: '3', name: 'Apple Watch Series 11', tagline: 'Smarter. Fitter. Brighter.', price: 'From ₹46,900', monthlyPrice: 'or ₹1,954/mo.*', image: '/watch_category_uploaded.png', path: '/watch', isActive: true }
        ];
      }

      setNewArrivals(items);

      // Fetch store products for dropdown selector
      try {
        const prodRes = await axiosClient.get('/products');
        const fetchedProds = prodRes.data?.products || (Array.isArray(prodRes.data) ? prodRes.data : []);
        setStoreProducts(fetchedProds);
      } catch (pErr) {
        console.warn("Products fetch warning:", pErr);
      }

    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to fetch settings');
    } finally {
      setLoading(false);
    }
  };

  // Add Product to New Arrivals
  const handleAddProductToNewArrivals = () => {
    let newCard = {
      id: Date.now().toString(),
      productId: '',
      name: 'New Product',
      tagline: 'Latest Release',
      price: 'From ₹79,900',
      monthlyPrice: 'or ₹3,329/mo.*',
      image: '/iphone_nav/iphone_17_pro.png',
      path: '/iphone',
      isActive: true
    };

    if (selectedProductId) {
      const selectedProd = storeProducts.find(p => (p._id || p.id) === selectedProductId);
      if (selectedProd) {
        const prodPrice = selectedProd.price ? `From ₹${Number(selectedProd.price).toLocaleString('en-IN')}` : 'From ₹79,900';
        const calcMonthly = selectedProd.price ? `or ₹${Math.round(selectedProd.price / 24).toLocaleString('en-IN')}/mo.*` : 'or ₹3,329/mo.*';
        const prodImg = selectedProd.image || (selectedProd.images && selectedProd.images[0]) || '/iphone_nav/iphone_17_pro.png';

        newCard = {
          id: Date.now().toString(),
          productId: selectedProd._id || selectedProd.id,
          name: selectedProd.title || selectedProd.name || 'New Product',
          tagline: selectedProd.subtitle || selectedProd.tagline || 'Latest Arrival',
          price: prodPrice,
          monthlyPrice: calcMonthly,
          image: prodImg,
          path: `/product/${selectedProd._id || selectedProd.id}`,
          isActive: true
        };
      }
    }

    setNewArrivals(prev => [...prev, newCard]);
    setSelectedProductId('');
    showSuccessMessage('Product added to New Arrivals list!');
  };

  // Remove Product from New Arrivals
  const handleRemoveProduct = (index) => {
    if (newArrivals.length <= 1) {
      alert("At least 1 product is required in New Arrivals.");
      return;
    }
    if (!window.confirm("Remove this product from New Arrivals?")) return;
    setNewArrivals(prev => prev.filter((_, i) => i !== index));
    showSuccessMessage('Product removed from New Arrivals.');
  };

  const handleFieldChange = (index, field, value) => {
    setNewArrivals(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  // Upload Custom Image
  const handleImageUpload = async (index, file) => {
    if (!file) return;
    setUploadingIndex(index);
    try {
      const formData = new FormData();
      formData.append('image', file);

      let res;
      try {
        res = await axiosClient.post('/upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      } catch (e) {
        res = await axiosClient.post('/upload/single', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      }

      let uploadedUrl = res.data?.url || res.data?.imageUrl || res.data;
      if (uploadedUrl) {
        if (typeof uploadedUrl === 'string' && !uploadedUrl.startsWith('http') && !uploadedUrl.startsWith('/')) {
          uploadedUrl = '/' + uploadedUrl;
        }
        handleFieldChange(index, 'image', uploadedUrl);
        showSuccessMessage('Custom image uploaded successfully!');
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Image upload failed.');
    } finally {
      setUploadingIndex(null);
    }
  };

  // Remove Custom Image / Reset Image
  const handleRemoveImage = (index) => {
    const item = newArrivals[index];
    let fallback = '/iphone_nav/iphone_17_pro.png';
    if (item.productId) {
      const matched = storeProducts.find(p => (p._id || p.id) === item.productId);
      if (matched) {
        fallback = matched.image || (matched.images && matched.images[0]) || fallback;
      }
    }
    handleFieldChange(index, 'image', fallback);
    showSuccessMessage('Image reset to default!');
  };

  // Move to First Product (Position 1)
  const handleMoveToFirst = (index) => {
    if (index === 0) return;
    setNewArrivals(prev => {
      const updated = [...prev];
      const [movedItem] = updated.splice(index, 1);
      updated.unshift(movedItem);
      return updated;
    });
    showSuccessMessage('Set as First Product!');
  };

  // Move to Last Product (Bottom of list)
  const handleMoveToLast = (index) => {
    if (index === newArrivals.length - 1) return;
    setNewArrivals(prev => {
      const updated = [...prev];
      const [movedItem] = updated.splice(index, 1);
      updated.push(movedItem);
      return updated;
    });
    showSuccessMessage('Set as Last Product!');
  };

  // Move Up
  const handleMoveUp = (index) => {
    if (index === 0) return;
    setNewArrivals(prev => {
      const updated = [...prev];
      const temp = updated[index];
      updated[index] = updated[index - 1];
      updated[index - 1] = temp;
      return updated;
    });
  };

  // Move Down
  const handleMoveDown = (index) => {
    if (index === newArrivals.length - 1) return;
    setNewArrivals(prev => {
      const updated = [...prev];
      const temp = updated[index];
      updated[index] = updated[index + 1];
      updated[index + 1] = temp;
      return updated;
    });
  };

  // Save Settings
  const handleSave = async () => {
    setSaving(true);
    setError(null);
    try {
      await axiosClient.put('/settings', {
        homeNewArrivals: newArrivals
      });
      notifyAdminChange('products', { action: 'update_new_arrivals' });
      showSuccessMessage('New Arrivals list saved successfully!');
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to save New Arrivals');
    } finally {
      setSaving(false);
    }
  };

  const showSuccessMessage = (msg) => {
    setSuccess(msg);
    setTimeout(() => setSuccess(null), 3000);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 text-[#0071e3] animate-spin mb-3" />
        <p className="text-sm font-medium text-zinc-500">Loading New Arrivals Manager...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 text-left max-w-5xl mx-auto">
      {/* Toast Notification */}
      {success && (
        <div className="fixed bottom-6 right-6 bg-zinc-900 text-white py-3.5 px-5 rounded-2xl shadow-xl flex items-center gap-3 border border-zinc-800 z-50">
          <Check className="h-5 w-5 text-emerald-400" />
          <span className="text-sm font-medium">{success}</span>
        </div>
      )}

      {/* Error Notification */}
      {error && (
        <div className="bg-rose-50 border border-rose-200 text-rose-800 py-3.5 px-4 rounded-xl flex items-center justify-between text-xs font-semibold">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-rose-600" />
            <span>{error}</span>
          </div>
          <button onClick={() => setError(null)} className="text-rose-500 hover:text-rose-800">
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Header */}
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-zinc-200 shadow-xs">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 font-sans flex items-center gap-2.5">
            <Sparkles className="h-6 w-6 text-[#0071e3]" />
            New Arrivals
          </h1>
          <p className="text-zinc-500 mt-1 text-sm">
            Add products, edit details, upload custom images, remove items, and reorder first/last items for Homepage.
          </p>
        </div>

        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 bg-[#0071e3] hover:bg-[#005bb5] disabled:bg-zinc-400 text-white px-6 py-3 rounded-xl text-xs font-bold transition-all cursor-pointer border-0 shadow-sm shrink-0"
        >
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
          <span>Save New Arrivals</span>
        </button>
      </header>

      {/* Quick Add Product Bar */}
      <div className="bg-white rounded-2xl border border-zinc-200 p-5 shadow-xs flex flex-col md:flex-row items-center gap-4">
        <div className="flex-1 w-full flex flex-col sm:flex-row items-center gap-3">
          <div className="flex items-center gap-2 text-xs font-bold text-zinc-500 uppercase tracking-wider shrink-0">
            <Package className="h-4 w-4 text-[#0071e3]" />
            Add Store Product:
          </div>
          <select
            value={selectedProductId}
            onChange={(e) => setSelectedProductId(e.target.value)}
            className="flex-1 w-full px-4 py-2.5 rounded-xl border border-zinc-200 focus:border-[#0071e3] text-xs font-medium text-zinc-800 outline-none bg-zinc-50"
          >
            <option value="">-- Choose Store Product to Add --</option>
            {storeProducts.map(p => (
              <option key={p._id || p.id} value={p._id || p.id}>
                {p.title || p.name} — ₹{(p.price || 0).toLocaleString('en-IN')}
              </option>
            ))}
          </select>
        </div>

        <button
          type="button"
          onClick={handleAddProductToNewArrivals}
          className="w-full md:w-auto flex items-center justify-center gap-2 bg-zinc-900 hover:bg-black text-white px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer border-0 shrink-0"
        >
          <Plus className="h-4 w-4" />
          <span>Add Product</span>
        </button>
      </div>

      {/* Cards List */}
      <div className="space-y-4">
        {newArrivals.map((item, index) => {
          const isFirst = index === 0;
          const isLast = index === newArrivals.length - 1;

          return (
            <div
              key={item.id || index}
              className="bg-white rounded-2xl border border-zinc-200 p-5 shadow-xs space-y-4"
            >
              {/* Card Top Action Bar */}
              <div className="flex flex-wrap items-center justify-between border-b border-zinc-100 pb-3 gap-3">
                
                {/* Left: Position Rank & Badges */}
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`text-[11px] font-extrabold px-3 py-1 rounded-lg uppercase tracking-wider text-white ${
                    isFirst ? 'bg-blue-600' : isLast ? 'bg-amber-600' : 'bg-zinc-800'
                  }`}>
                    #{index + 1} {isFirst ? '• FIRST PRODUCT' : isLast ? '• LAST PRODUCT' : ''}
                  </span>

                  {item.productId && (
                    <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-md">
                      Linked Store Product
                    </span>
                  )}
                </div>

                {/* Right: Order Action Controls */}
                <div className="flex items-center gap-1.5 flex-wrap">
                  {/* First Product Button */}
                  <button
                    type="button"
                    onClick={() => handleMoveToFirst(index)}
                    disabled={isFirst}
                    title="Move to First Product"
                    className="px-2.5 py-1 text-[11px] font-bold rounded-lg border border-zinc-200 bg-zinc-50 hover:bg-zinc-100 disabled:opacity-30 disabled:cursor-not-allowed text-zinc-700 flex items-center gap-1 cursor-pointer"
                  >
                    <ArrowUpToLine className="h-3.5 w-3.5 text-blue-600" />
                    <span>First Product</span>
                  </button>

                  {/* Last Product Button */}
                  <button
                    type="button"
                    onClick={() => handleMoveToLast(index)}
                    disabled={isLast}
                    title="Move to Last Product"
                    className="px-2.5 py-1 text-[11px] font-bold rounded-lg border border-zinc-200 bg-zinc-50 hover:bg-zinc-100 disabled:opacity-30 disabled:cursor-not-allowed text-zinc-700 flex items-center gap-1 cursor-pointer"
                  >
                    <ArrowDownToLine className="h-3.5 w-3.5 text-amber-600" />
                    <span>Last Product</span>
                  </button>

                  {/* Move Up */}
                  <button
                    type="button"
                    onClick={() => handleMoveUp(index)}
                    disabled={isFirst}
                    title="Move Up"
                    className="p-1.5 rounded-lg border border-zinc-200 bg-white hover:bg-zinc-50 disabled:opacity-30 cursor-pointer"
                  >
                    <ArrowUp className="h-3.5 w-3.5 text-zinc-600" />
                  </button>

                  {/* Move Down */}
                  <button
                    type="button"
                    onClick={() => handleMoveDown(index)}
                    disabled={isLast}
                    title="Move Down"
                    className="p-1.5 rounded-lg border border-zinc-200 bg-white hover:bg-zinc-50 disabled:opacity-30 cursor-pointer"
                  >
                    <ArrowDown className="h-3.5 w-3.5 text-zinc-600" />
                  </button>

                  {/* Remove Product */}
                  <button
                    type="button"
                    onClick={() => handleRemoveProduct(index)}
                    title="Remove Product"
                    className="p-1.5 rounded-lg border border-rose-100 bg-rose-50 hover:bg-rose-100 text-rose-600 cursor-pointer"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              {/* Main Content Layout */}
              <div className="flex flex-col md:flex-row gap-6 items-start">
                
                {/* Left: Image Upload & Preview Box */}
                <div className="w-full md:w-44 shrink-0 flex flex-col items-center gap-3">
                  <div className="w-full h-36 rounded-xl bg-zinc-50 border border-zinc-200 flex items-center justify-center p-2 relative overflow-hidden group">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="max-h-full max-w-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform"
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = '/iphone_nav/iphone_17_pro.png';
                        }}
                      />
                    ) : (
                      <div className="flex flex-col items-center text-zinc-400">
                        <ImageIcon className="h-8 w-8 mb-1" />
                        <span className="text-[10px] font-bold uppercase">No Image</span>
                      </div>
                    )}

                    {uploadingIndex === index && (
                      <div className="absolute inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center text-white text-xs font-bold">
                        <Loader2 className="h-5 w-5 animate-spin mr-1" /> Uploading...
                      </div>
                    )}
                  </div>

                  {/* Image Buttons */}
                  <div className="flex items-center gap-2 w-full">
                    <label className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg border border-zinc-200 bg-white hover:bg-zinc-50 text-[11px] font-bold text-zinc-700 cursor-pointer shadow-2xs">
                      <Upload className="h-3.5 w-3.5 text-[#0071e3]" />
                      <span>{item.image ? 'Add Image' : 'Add Image'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          if (e.target.files?.[0]) {
                            handleImageUpload(index, e.target.files[0]);
                          }
                        }}
                      />
                    </label>

                    {item.image && (
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(index)}
                        title="Remove Custom Image"
                        className="px-2.5 py-1.5 rounded-lg border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-600 text-[11px] font-bold cursor-pointer shrink-0"
                      >
                        Remove Image
                      </button>
                    )}
                  </div>
                </div>

                {/* Right: Form Inputs Grid */}
                <div className="flex-1 w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  
                  {/* Product Title */}
                  <div>
                    <label className="block text-[11px] font-bold text-zinc-500 uppercase tracking-wider mb-1">
                      Product Title
                    </label>
                    <input
                      type="text"
                      value={item.name || ''}
                      onChange={(e) => handleFieldChange(index, 'name', e.target.value)}
                      placeholder="e.g. iPhone 17 Pro"
                      className="w-full px-3 py-2 rounded-lg border border-zinc-200 focus:border-[#0071e3] outline-none text-xs font-semibold text-zinc-900 bg-white"
                    />
                  </div>

                  {/* Tagline / Subtitle */}
                  <div>
                    <label className="block text-[11px] font-bold text-zinc-500 uppercase tracking-wider mb-1">
                      Tagline / Subtitle
                    </label>
                    <input
                      type="text"
                      value={item.tagline || ''}
                      onChange={(e) => handleFieldChange(index, 'tagline', e.target.value)}
                      placeholder="e.g. All out Pro."
                      className="w-full px-3 py-2 rounded-lg border border-zinc-200 focus:border-[#0071e3] outline-none text-xs font-semibold text-zinc-900 bg-white"
                    />
                  </div>

                  {/* Price String */}
                  <div>
                    <label className="block text-[11px] font-bold text-zinc-500 uppercase tracking-wider mb-1">
                      Price Text
                    </label>
                    <input
                      type="text"
                      value={item.price || ''}
                      onChange={(e) => handleFieldChange(index, 'price', e.target.value)}
                      placeholder="e.g. From ₹1,34,900"
                      className="w-full px-3 py-2 rounded-lg border border-zinc-200 focus:border-[#0071e3] outline-none text-xs font-semibold text-zinc-900 bg-white"
                    />
                  </div>

                  {/* Monthly EMI Text */}
                  <div>
                    <label className="block text-[11px] font-bold text-zinc-500 uppercase tracking-wider mb-1">
                      Monthly EMI Text
                    </label>
                    <input
                      type="text"
                      value={item.monthlyPrice || ''}
                      onChange={(e) => handleFieldChange(index, 'monthlyPrice', e.target.value)}
                      placeholder="e.g. or ₹5,621/mo.*"
                      className="w-full px-3 py-2 rounded-lg border border-zinc-200 focus:border-[#0071e3] outline-none text-xs font-semibold text-zinc-900 bg-white"
                    />
                  </div>

                  {/* Link Path */}
                  <div>
                    <label className="block text-[11px] font-bold text-zinc-500 uppercase tracking-wider mb-1">
                      Link Path
                    </label>
                    <input
                      type="text"
                      value={item.path || ''}
                      onChange={(e) => handleFieldChange(index, 'path', e.target.value)}
                      placeholder="e.g. /iphone"
                      className="w-full px-3 py-2 rounded-lg border border-zinc-200 focus:border-[#0071e3] outline-none text-xs font-semibold text-zinc-900 bg-white font-mono"
                    />
                  </div>

                  {/* Custom Image URL */}
                  <div>
                    <label className="block text-[11px] font-bold text-zinc-500 uppercase tracking-wider mb-1">
                      Image URL
                    </label>
                    <input
                      type="text"
                      value={item.image || ''}
                      onChange={(e) => handleFieldChange(index, 'image', e.target.value)}
                      placeholder="Custom URL or image path"
                      className="w-full px-3 py-2 rounded-lg border border-zinc-200 focus:border-[#0071e3] outline-none text-xs text-zinc-800 bg-white font-mono"
                    />
                  </div>

                </div>

              </div>
            </div>
          );
        })}
      </div>

      {/* Footer Save Button */}
      <div className="flex justify-end pt-4">
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 bg-[#0071e3] hover:bg-[#005bb5] disabled:bg-zinc-400 text-white px-8 py-3 rounded-xl text-xs font-bold transition-all cursor-pointer border-0 shadow-md"
        >
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
          <span>Save New Arrivals</span>
        </button>
      </div>
    </div>
  );
}

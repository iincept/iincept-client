import { useState, useEffect } from 'react';
import { 
  Star, 
  Plus, 
  Trash2, 
  Check, 
  Loader2, 
  AlertCircle, 
  X, 
  ArrowUp, 
  ArrowDown, 
  Eye, 
  EyeOff,
  Upload,
  Image as ImageIcon
} from 'lucide-react';
import axiosClient from '../../services/axiosClient';

export default function Testimonials() {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploadingIndex, setUploadingIndex] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const [testimonials, setTestimonials] = useState([]);

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosClient.get('/settings');
      if (response.data && response.data.testimonials && response.data.testimonials.length > 0) {
        setTestimonials(response.data.testimonials.map(t => ({
          ...t,
          isActive: t.isActive !== false
        })));
      } else {
        setTestimonials([
          { stars: 5, text: '"Procured 40 MacBooks for our new office in 3 days, GST invoice sorted same week."', author: '— IT Head, Fintech firm, Bengaluru', isActive: true },
          { stars: 5, text: '"Our gifting desk orders AirPods every quarter — consolidated billing makes finance happy."', author: '— Procurement Lead, D2C brand, Mumbai', isActive: true },
          { stars: 5, text: '"Quote turnaround was faster than two other resellers we checked."', author: '— Ops Manager, Consulting firm, Delhi NCR', isActive: true },
          { stars: 5, text: '"Reliable for repeat bulk orders, delivered to three city offices without issue."', author: '— Admin Head, BPO, Pune', isActive: true }
        ]);
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to fetch testimonials');
    } finally {
      setLoading(false);
    }
  };

  const handleAddTestimonial = () => {
    setTestimonials((prev) => [
      ...prev,
      {
        stars: 5,
        text: '"Enter customer review or quote here..."',
        author: '— Customer Name, Designation, City',
        isActive: true
      }
    ]);
  };

  const handleRemoveTestimonial = (index) => {
    if (testimonials.length <= 1) {
      alert("At least 1 testimonial is required.");
      return;
    }
    setTestimonials((prev) => prev.filter((_, i) => i !== index));
  };

  const handleTestimonialChange = (index, field, value) => {
    setTestimonials((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const handleToggleActive = (index) => {
    setTestimonials((prev) => {
      const updated = [...prev];
      const currentActive = updated[index].isActive !== false;
      updated[index] = { ...updated[index], isActive: !currentActive };
      return updated;
    });
  };

  const handleMoveTestimonial = (index, direction) => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= testimonials.length) return;

    setTestimonials((prev) => {
      const updated = [...prev];
      const temp = updated[index];
      updated[index] = updated[targetIndex];
      updated[targetIndex] = temp;
      return updated;
    });
  };

  const handleImageUpload = async (index, e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingIndex(index);
    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await axiosClient.post('/upload/single', formData);
      if (response.data && response.data.url) {
        handleTestimonialChange(index, 'image', response.data.url);
        showSuccessMessage('Customer photo uploaded successfully!');
      }
    } catch (err) {
      console.warn('Server upload fallback triggered:', err);
      const reader = new FileReader();
      reader.onloadend = () => {
        handleTestimonialChange(index, 'image', reader.result);
        showSuccessMessage('Customer photo loaded!');
      };
      reader.readAsDataURL(file);
    } finally {
      setUploadingIndex(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      await axiosClient.put('/settings', { testimonials });
      showSuccessMessage('Testimonials & Customer Reviews updated successfully!');
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to save testimonials');
    } finally {
      setSaving(false);
    }
  };

  const showSuccessMessage = (msg) => {
    setSuccess(msg);
    setTimeout(() => setSuccess(null), 3000);
  };

  return (
    <div className="space-y-6 text-left max-w-4xl mx-auto">
      {/* Toast Notification */}
      {success && (
        <div className="fixed bottom-6 right-6 bg-zinc-900 text-white py-3.5 px-5 rounded-2xl shadow-xl flex items-center gap-3 border border-zinc-800 animate-in fade-in slide-in-from-bottom-5 duration-300 z-50">
          <Check className="h-5 w-5 text-emerald-400" />
          <span className="text-sm font-medium">{success}</span>
        </div>
      )}

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
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 font-sans flex items-center gap-2.5">
            <Star className="h-6 w-6 text-amber-500 fill-amber-500" />
            Testimonials & Customer Reviews
          </h1>
          <p className="text-zinc-500 mt-1 text-sm">Add, edit, reorder, and toggle customer reviews shown in the homepage marquee track.</p>
        </div>

        <button
          type="button"
          onClick={handleAddTestimonial}
          className="flex items-center gap-2 bg-[#0071e3] hover:bg-[#005bb5] text-white px-4 py-2.5 rounded-xl text-xs font-bold shadow-sm transition-all cursor-pointer border-0"
        >
          <Plus className="h-4 w-4" />
          Add Customer Review
        </button>
      </header>

      {/* Form Container */}
      {loading ? (
        <div className="flex items-center justify-center py-16 text-zinc-400">
          <Loader2 className="h-6 w-6 animate-spin mr-2 text-[#0071e3]" />
          <span>Loading testimonials...</span>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-zinc-200 shadow-sm p-6 sm:p-8 space-y-6">
          <div className="space-y-4">
            {testimonials.map((item, idx) => (
              <div 
                key={idx} 
                className={`p-5 rounded-2xl border transition-all ${
                  item.isActive !== false 
                    ? 'bg-zinc-50/70 border-zinc-250 hover:border-zinc-300' 
                    : 'bg-zinc-100/60 border-zinc-200 opacity-60'
                }`}
              >
                {/* Top Control Bar */}
                <div className="flex items-center justify-between gap-3 mb-5 border-b border-zinc-200/80 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-extrabold text-zinc-500 bg-white border border-zinc-250 px-2.5 py-1 rounded-lg">Review #{idx + 1}</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleToggleActive(idx)}
                      className={`p-1.5 px-3 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer border ${
                        item.isActive !== false 
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-200' 
                          : 'bg-zinc-200 text-zinc-600 border-zinc-300'
                      }`}
                    >
                      {item.isActive !== false ? <Eye className="h-3.5 w-3.5 text-emerald-600" /> : <EyeOff className="h-3.5 w-3.5 text-zinc-500" />}
                      {item.isActive !== false ? 'Active' : 'Hidden'}
                    </button>

                    <button
                      type="button"
                      disabled={idx === 0}
                      onClick={() => handleMoveTestimonial(idx, 'up')}
                      className="p-2 text-zinc-600 hover:text-zinc-900 bg-white border border-zinc-200 rounded-xl disabled:opacity-30 cursor-pointer shadow-2xs"
                      title="Move Up"
                    >
                      <ArrowUp className="h-3.5 w-3.5" />
                    </button>

                    <button
                      type="button"
                      disabled={idx === testimonials.length - 1}
                      onClick={() => handleMoveTestimonial(idx, 'down')}
                      className="p-2 text-zinc-600 hover:text-zinc-900 bg-white border border-zinc-200 rounded-xl disabled:opacity-30 cursor-pointer shadow-2xs"
                      title="Move Down"
                    >
                      <ArrowDown className="h-3.5 w-3.5" />
                    </button>

                    <button
                      type="button"
                      onClick={() => handleRemoveTestimonial(idx)}
                      className="p-2 text-rose-600 hover:text-rose-800 bg-rose-50 border border-rose-200 rounded-xl cursor-pointer ml-1"
                      title="Delete Review"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>

                {/* 1. Customer Image (Top) */}
                <div className="mb-4">
                  <label className="block text-[10px] font-extrabold text-zinc-600 uppercase tracking-wider mb-1.5">1. Customer Photo / Logo (Top Image)</label>
                  <div className="flex items-center gap-3">
                    {item.image ? (
                      <img src={item.image} alt="Customer Avatar" className="h-12 w-12 rounded-full object-cover border-2 border-zinc-300 bg-white shrink-0 shadow-sm" />
                    ) : (
                      <div className="h-12 w-12 rounded-full bg-zinc-200 border border-zinc-300 flex items-center justify-center text-zinc-400 shrink-0">
                        <ImageIcon className="h-5 w-5" />
                      </div>
                    )}

                    <input
                      type="text"
                      value={item.image || ''}
                      onChange={(e) => handleTestimonialChange(idx, 'image', e.target.value)}
                      placeholder="Image URL or upload photo..."
                      className="flex-1 px-3.5 py-2 rounded-xl border border-zinc-200 text-xs font-medium focus:border-[#0071e3] outline-none bg-white"
                    />

                    <input 
                      id={`testimonial-file-${idx}`}
                      type="file" 
                      accept="image/*" 
                      className="hidden" 
                      onChange={(e) => handleImageUpload(idx, e)} 
                    />

                    <button
                      type="button"
                      onClick={() => document.getElementById(`testimonial-file-${idx}`)?.click()}
                      className="flex items-center gap-1.5 bg-[#0071e3] hover:bg-[#005bb5] text-white px-4 py-2 rounded-xl text-xs font-bold cursor-pointer transition-all shrink-0 border-0 shadow-sm"
                    >
                      {uploadingIndex === idx ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Upload className="h-3.5 w-3.5" />}
                      Upload Photo
                    </button>

                    {item.image && (
                      <button
                        type="button"
                        onClick={() => handleTestimonialChange(idx, 'image', '')}
                        className="text-xs text-rose-500 hover:text-rose-700 font-bold shrink-0 cursor-pointer"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                </div>

                {/* 2. Rating Stars (Below Image) */}
                <div className="mb-4">
                  <label className="block text-[10px] font-extrabold text-zinc-600 uppercase tracking-wider mb-1.5">2. Star Rating (Below Image)</label>
                  <select
                    value={item.stars || 5}
                    onChange={(e) => handleTestimonialChange(idx, 'stars', Number(e.target.value))}
                    className="w-full sm:w-64 px-3.5 py-2 rounded-xl border border-zinc-200 text-xs font-bold bg-white focus:border-[#0071e3] outline-none"
                  >
                    <option value={5}>★★★★★ (5 Stars)</option>
                    <option value={4}>★★★★ (4 Stars)</option>
                    <option value={3}>★★★ (3 Stars)</option>
                    <option value={2}>★★ (2 Stars)</option>
                    <option value={1}>★ (1 Star)</option>
                  </select>
                </div>

                {/* 3. Review Quote Text (Below Rating) */}
                <div className="mb-4">
                  <label className="block text-[10px] font-extrabold text-zinc-600 uppercase tracking-wider mb-1.5">3. Customer Review Quote Text (Below Rating)</label>
                  <textarea
                    rows={2}
                    value={item.text || ''}
                    onChange={(e) => handleTestimonialChange(idx, 'text', e.target.value)}
                    placeholder='"Procured 40 MacBooks for our new office..."'
                    className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 text-xs font-medium focus:border-[#0071e3] outline-none bg-white resize-none"
                  />
                </div>

                {/* 4. Author Name / Designation & City (Below Text) */}
                <div>
                  <label className="block text-[10px] font-extrabold text-zinc-600 uppercase tracking-wider mb-1.5">4. Author Name / Designation & City (Below Text)</label>
                  <input
                    type="text"
                    value={item.author || ''}
                    onChange={(e) => handleTestimonialChange(idx, 'author', e.target.value)}
                    placeholder="— IT Head, Fintech firm, Bengaluru"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 text-xs font-medium focus:border-[#0071e3] outline-none bg-white"
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-zinc-100">
            <button
              type="button"
              onClick={handleAddTestimonial}
              className="flex items-center gap-1.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-800 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              Add Another Review
            </button>

            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 bg-[#0071e3] hover:bg-[#005bb5] disabled:bg-zinc-400 text-white px-7 py-3 rounded-xl text-xs font-bold tracking-wider uppercase shadow-md transition-all cursor-pointer border-0"
            >
              {saving && <Loader2 className="h-4 w-4 animate-spin" />}
              Publish Testimonials
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

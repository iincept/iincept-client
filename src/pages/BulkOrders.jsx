import { useState } from 'react';
import { Mail, Phone, Building2, Landmark, ShoppingBag, Send, CheckCircle2 } from 'lucide-react';
import axiosClient from '../services/axiosClient';

export default function BulkOrders() {
  const [formData, setFormData] = useState({
    fullName: '',
    companyName: '',
    email: '',
    phone: '',
    gstin: '',
    productInterest: 'iPhone 15 Pro',
    quantity: '',
    targetPrice: '',
    message: ''
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await axiosClient.post('/enquiries', {
        ...formData,
        quantity: Number(formData.quantity),
        targetPrice: formData.targetPrice ? Number(formData.targetPrice) : undefined
      });
      setSuccess(true);
      setFormData({
        fullName: '',
        companyName: '',
        email: '',
        phone: '',
        gstin: '',
        productInterest: 'iPhone 15 Pro',
        quantity: '',
        targetPrice: '',
        message: ''
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit enquiry form. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 pt-28 pb-16 px-4 font-sans text-left">
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-12 space-y-4">
          <span className="text-[10px] text-[#0071e3] font-extrabold uppercase tracking-widest bg-blue-50 border border-blue-100 px-3.5 py-1.5 rounded-full">
            iiNCEPT Business
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-zinc-900 tracking-tight">
            Corporate & Bulk Order Program
          </h1>
          <p className="text-zinc-500 text-sm max-w-xl mx-auto font-medium">
            Procure Apple products at wholesale scale for your enterprise, company gifts, or authorized redistribution. Save more on larger volumes.
          </p>
        </header>

        {success ? (
          <div className="bg-white border border-zinc-150 rounded-3xl p-8 sm:p-12 text-center shadow-sm space-y-5 animate-in fade-in zoom-in-95 duration-300">
            <CheckCircle2 className="h-14 w-14 text-emerald-500 mx-auto" />
            <div className="space-y-2">
              <h2 className="text-xl font-bold text-zinc-900">Enquiry Logged Successfully!</h2>
              <p className="text-zinc-500 text-sm max-w-md mx-auto">
                Thank you for your bulk enquiry. Our business account specialists will review your GST requirements and contact you via email within 24 hours.
              </p>
            </div>
            <button
              onClick={() => setSuccess(false)}
              className="bg-black hover:bg-zinc-900 text-white font-bold px-6 py-3 rounded-2xl text-xs transition-colors cursor-pointer border-0"
            >
              Submit Another Enquiry
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Information Panel */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-zinc-900 text-white rounded-3xl p-6 sm:p-8 space-y-8 shadow-sm">
                <div>
                  <h3 className="font-extrabold text-lg text-white">Why procure with iiNCEPT?</h3>
                  <p className="text-zinc-400 text-xs mt-2 font-medium">
                    Get access to dedicated account management, bulk price rates, and tax invoice options.
                  </p>
                </div>

                <div className="space-y-6">
                  <div className="flex gap-4">
                    <div className="h-10 w-10 shrink-0 rounded-xl bg-zinc-800 flex items-center justify-center text-[#0071e3]">
                      <Landmark className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm">GST Input Tax Credit</h4>
                      <p className="text-zinc-400 text-xs mt-1">Get authentic tax invoice copies stating your company GSTIN to claim maximum credits.</p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="h-10 w-10 shrink-0 rounded-xl bg-zinc-800 flex items-center justify-center text-[#0071e3]">
                      <ShoppingBag className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm">Tiered Quantity Pricing</h4>
                      <p className="text-zinc-400 text-xs mt-1">Order counts starting from 10+ devices qualify for scaled business discounts.</p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="h-10 w-10 shrink-0 rounded-xl bg-zinc-800 flex items-center justify-center text-[#0071e3]">
                      <Mail className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm">Support Channels</h4>
                      <p className="text-zinc-400 text-xs mt-1">Reach out at corporate@iincept.in for custom request assistance.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Form Panel */}
            <form onSubmit={handleSubmit} className="lg:col-span-7 bg-white border border-zinc-150 rounded-3xl p-6 sm:p-8 shadow-sm space-y-5">
              {error && (
                <div className="bg-rose-50 border border-rose-200 text-rose-800 p-4 rounded-xl text-xs">
                  {error}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5 text-xs">
                  <label className="block text-[10px] uppercase font-bold text-zinc-500 tracking-wider">Contact Name *</label>
                  <input
                    type="text"
                    name="fullName"
                    required
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="Enter your name"
                    className="w-full bg-white border border-zinc-200 rounded-xl px-4 py-3 outline-none focus:border-[#0071e3] transition-colors"
                  />
                </div>

                <div className="space-y-1.5 text-xs">
                  <label className="block text-[10px] uppercase font-bold text-zinc-500 tracking-wider">Company Name *</label>
                  <div className="relative">
                    <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-450" />
                    <input
                      type="text"
                      name="companyName"
                      required
                      value={formData.companyName}
                      onChange={handleChange}
                      placeholder="e.g. Acme Tech Pvt Ltd"
                      className="w-full bg-white border border-zinc-200 rounded-xl pl-11 pr-4 py-3 outline-none focus:border-[#0071e3] transition-colors"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5 text-xs">
                  <label className="block text-[10px] uppercase font-bold text-zinc-500 tracking-wider">Work Email *</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-450" />
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="business@company.com"
                      className="w-full bg-white border border-zinc-200 rounded-xl pl-11 pr-4 py-3 outline-none focus:border-[#0071e3] transition-colors"
                    />
                  </div>
                </div>

                <div className="space-y-1.5 text-xs">
                  <label className="block text-[10px] uppercase font-bold text-zinc-500 tracking-wider">Phone Number *</label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-450" />
                    <input
                      type="tel"
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+91 XXXXX XXXXX"
                      className="w-full bg-white border border-zinc-200 rounded-xl pl-11 pr-4 py-3 outline-none focus:border-[#0071e3] transition-colors"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-1.5 text-xs">
                <label className="block text-[10px] uppercase font-bold text-zinc-500 tracking-wider">GSTIN (Optional)</label>
                <input
                  type="text"
                  name="gstin"
                  value={formData.gstin}
                  onChange={handleChange}
                  placeholder="22AAAAA0000A1Z5"
                  className="w-full bg-white border border-zinc-200 rounded-xl px-4 py-3 outline-none focus:border-[#0071e3] transition-colors"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5 text-xs sm:col-span-1">
                  <label className="block text-[10px] uppercase font-bold text-zinc-500 tracking-wider">Product *</label>
                  <select
                    name="productInterest"
                    value={formData.productInterest}
                    onChange={handleChange}
                    className="w-full bg-white border border-zinc-200 rounded-xl px-4 py-3 outline-none focus:border-[#0071e3] transition-colors cursor-pointer"
                  >
                    <option value="iPhone 15 Pro">iPhone 15 Pro</option>
                    <option value="iPhone 15">iPhone 15</option>
                    <option value="iPad Pro">iPad Pro</option>
                    <option value="MacBook Pro">MacBook Pro</option>
                    <option value="MacBook Air">MacBook Air</option>
                    <option value="Apple Watch Series 9">Apple Watch S9</option>
                    <option value="Multiple Devices">Multiple Devices</option>
                  </select>
                </div>

                <div className="space-y-1.5 text-xs sm:col-span-1">
                  <label className="block text-[10px] uppercase font-bold text-zinc-500 tracking-wider">Quantity *</label>
                  <input
                    type="number"
                    name="quantity"
                    required
                    min="1"
                    value={formData.quantity}
                    onChange={handleChange}
                    placeholder="Min 1"
                    className="w-full bg-white border border-zinc-200 rounded-xl px-4 py-3 outline-none focus:border-[#0071e3] transition-colors"
                  />
                </div>

                <div className="space-y-1.5 text-xs sm:col-span-1">
                  <label className="block text-[10px] uppercase font-bold text-zinc-500 tracking-wider">Target Price (₹)</label>
                  <input
                    type="number"
                    name="targetPrice"
                    value={formData.targetPrice}
                    onChange={handleChange}
                    placeholder="Per unit budget"
                    className="w-full bg-white border border-zinc-200 rounded-xl px-4 py-3 outline-none focus:border-[#0071e3] transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-1.5 text-xs">
                <label className="block text-[10px] uppercase font-bold text-zinc-500 tracking-wider">Requirement Details / Message</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows="3"
                  placeholder="Share delivery targets, packaging needs, or specific model specifications..."
                  className="w-full bg-white border border-zinc-200 rounded-xl px-4 py-3 outline-none focus:border-[#0071e3] transition-colors resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-black hover:bg-zinc-900 text-white font-bold py-3.5 rounded-xl text-xs transition-colors cursor-pointer border-0 flex items-center justify-center gap-2 uppercase tracking-wider"
              >
                {loading ? (
                  'Sending Inquiry...'
                ) : (
                  <>
                    <Send className="h-3.5 w-3.5" />
                    Submit Business Request
                  </>
                )}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Phone, Trash2, Edit3, Check, Loader2, ArrowLeft } from 'lucide-react';
import axiosClient from '../services/axiosClient';

export default function SavedAddresses() {
  const navigate = useNavigate();

  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);

  // Form Fields (Aligned with database keys: fullName, phone, address, city, state, pincode)
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [stateName, setStateName] = useState('');
  const [pincode, setPincode] = useState('');
  const [isDefault, setIsDefault] = useState(false);

  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    setLoading(true);
    try {
      const response = await axiosClient.get('/address');
      setAddresses(response.data || []);
    } catch (err) {
      console.error('Failed to load addresses:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAdd = () => {
    setEditingAddress(null);
    setFullName('');
    setPhone('');
    setAddress('');
    setCity('');
    setStateName('');
    setPincode('');
    setIsDefault(false);
    setShowForm(true);
  };

  const handleOpenEdit = (addr) => {
    setEditingAddress(addr);
    setFullName(addr.fullName || '');
    setPhone(addr.phone || '');
    setAddress(addr.address || '');
    setCity(addr.city || '');
    setStateName(addr.state || '');
    setPincode(addr.pincode || '');
    setIsDefault(addr.isDefault || false);
    setShowForm(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!fullName || !phone || !address || !city || !stateName || !pincode) {
      return alert('Please fill in all address details.');
    }

    const payload = {
      fullName,
      phone,
      address,
      city,
      state: stateName,
      pincode,
      isDefault
    };

    try {
      if (editingAddress) {
        await axiosClient.put(`/address/${editingAddress._id || editingAddress.id}`, payload);
        alert('Address updated successfully!');
      } else {
        await axiosClient.post('/address', payload);
        alert('Address added successfully!');
      }
      setShowForm(false);
      fetchAddresses();
    } catch (err) {
      alert(err.response?.data?.message || err.message || 'Failed to save address.');
    }
  };

  const handleDeleteAddress = async (id) => {
    if (!window.confirm('Are you sure you want to delete this address?')) return;

    try {
      await axiosClient.delete(`/address/${id}`);
      alert('Address deleted successfully!');
      fetchAddresses();
    } catch (err) {
      alert(err.response?.data?.message || err.message || 'Failed to delete address.');
    }
  };

  const handleSetDefault = async (addr) => {
    try {
      await axiosClient.put(`/address/${addr._id || addr.id}`, {
        fullName: addr.fullName,
        phone: addr.phone,
        address: addr.address,
        city: addr.city,
        state: addr.state,
        pincode: addr.pincode,
        isDefault: true
      });
      fetchAddresses();
    } catch (err) {
      alert(err.response?.data?.message || err.message || 'Failed to set default address.');
    }
  };

  if (loading && addresses.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-20 text-zinc-400">
        <Loader2 className="h-10 w-10 animate-spin text-zinc-900 mb-3" />
        <span className="text-sm font-semibold">Loading address book...</span>
      </div>
    );
  }

  return (
    <div className="space-y-8 py-4 text-left animate-in fade-in duration-300">
      
      {/* Header Info */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-1">
          <button 
            onClick={() => navigate('/profile')}
            className="inline-flex items-center gap-2 text-zinc-500 hover:text-black font-semibold text-xs transition-colors bg-transparent border-0 cursor-pointer p-0 mb-1"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Profile
          </button>
          <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900">Address Book</h1>
          <p className="text-sm text-zinc-550">Manage your billing and delivery destinations</p>
        </div>

        {!showForm && (
          <button
            onClick={handleOpenAdd}
            className="bg-black hover:bg-zinc-900 text-white font-bold text-xs px-5 py-3 rounded-xl transition-all cursor-pointer shadow-sm"
          >
            + Add New Address
          </button>
        )}
      </div>

      {showForm && (
        <form onSubmit={handleFormSubmit} className="bg-zinc-50/50 border border-zinc-200 rounded-3xl p-6 space-y-5 animate-in slide-in-from-top duration-300">
          <h2 className="text-lg font-bold text-zinc-900 border-b border-zinc-150 pb-2">
            {editingAddress ? 'Modify Address' : 'Register New Address'}
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">Receiver Name</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Full Name"
                className="w-full bg-white border border-zinc-200 text-xs rounded-xl p-3 text-zinc-900 focus:outline-none focus:border-zinc-500"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">Mobile Number</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="10-digit mobile number"
                className="w-full bg-white border border-zinc-200 text-xs rounded-xl p-3 text-zinc-900 focus:outline-none focus:border-zinc-500"
              />
            </div>
            <div className="sm:col-span-2 space-y-1.5">
              <label className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">Street / Locality</label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Flat / House No. / Building / Street"
                className="w-full bg-white border border-zinc-200 text-xs rounded-xl p-3 text-zinc-900 focus:outline-none focus:border-zinc-500"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">City / District</label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="City"
                className="w-full bg-white border border-zinc-200 text-xs rounded-xl p-3 text-zinc-900 focus:outline-none focus:border-zinc-500"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">State</label>
              <input
                type="text"
                value={stateName}
                onChange={(e) => setStateName(e.target.value)}
                placeholder="State"
                className="w-full bg-white border border-zinc-200 text-xs rounded-xl p-3 text-zinc-900 focus:outline-none focus:border-zinc-500"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">Pin Code</label>
              <input
                type="text"
                value={pincode}
                onChange={(e) => setPincode(e.target.value)}
                placeholder="6-digit PIN code"
                className="w-full bg-white border border-zinc-200 text-xs rounded-xl p-3 text-zinc-900 focus:outline-none focus:border-zinc-500"
              />
            </div>
            <div className="flex items-center gap-2 pt-2">
              <input
                type="checkbox"
                id="isDefault"
                checked={isDefault}
                onChange={(e) => setIsDefault(e.target.checked)}
                className="h-4.5 w-4.5 rounded border-zinc-300 text-black focus:ring-black accent-black cursor-pointer"
              />
              <label htmlFor="isDefault" className="text-xs text-zinc-650 cursor-pointer font-semibold">Set as Default Destination</label>
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <button
              type="submit"
              className="bg-black hover:bg-zinc-900 text-white font-bold text-xs px-5 py-3 rounded-xl transition-all cursor-pointer shadow-sm"
            >
              {editingAddress ? 'Save Changes' : 'Register Address'}
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="bg-white border border-zinc-200 text-zinc-700 hover:bg-zinc-50 font-bold text-xs px-5 py-3 rounded-xl transition-all cursor-pointer shadow-sm"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Address cards list */}
      {addresses.length === 0 ? (
        <div className="border border-dashed border-zinc-200 bg-zinc-50 rounded-3xl p-16 text-center space-y-4 max-w-xl mx-auto shadow-sm">
          <MapPin className="h-10 w-10 mx-auto text-zinc-300" />
          <div className="space-y-1">
            <h2 className="text-lg font-bold text-zinc-900">Address Book Empty</h2>
            <p className="text-xs text-zinc-550 max-w-xs mx-auto">
              You haven't registered any addresses yet. Register your default address to check out faster.
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {addresses.map((addr) => (
            <div 
              key={addr._id || addr.id}
              className={`p-5 bg-white border rounded-2xl space-y-4 shadow-sm hover:border-zinc-300 transition-all text-left flex flex-col justify-between ${
                addr.isDefault ? 'border-zinc-900 ring-1 ring-zinc-900/10' : 'border-zinc-200'
              }`}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-bold text-zinc-900 text-sm">{addr.fullName}</span>
                  {addr.isDefault && (
                    <span className="inline-flex items-center gap-0.5 bg-black text-white text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                      <Check className="h-2.5 w-2.5" />
                      Default
                    </span>
                  )}
                </div>
                
                <p className="text-xs text-zinc-650 leading-relaxed">{addr.address}</p>
                <p className="text-xs text-zinc-650 font-semibold">{addr.city}, {addr.state} - {addr.pincode}</p>
                
                <div className="flex items-center gap-1.5 text-xs text-zinc-500 pt-1">
                  <Phone className="h-3.5 w-3.5" />
                  <span>{addr.phone}</span>
                </div>
              </div>

              {/* Actions row */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-zinc-100">
                {!addr.isDefault ? (
                  <button
                    onClick={() => handleSetDefault(addr)}
                    className="text-zinc-500 hover:text-black font-semibold text-xs bg-transparent border-0 cursor-pointer p-0"
                  >
                    Set Default
                  </button>
                ) : (
                  <span className="text-zinc-400 font-semibold text-xs">Default Address</span>
                )}

                <div className="flex gap-3">
                  <button
                    onClick={() => handleOpenEdit(addr)}
                    className="inline-flex items-center gap-1 text-zinc-650 hover:text-zinc-900 font-semibold text-xs bg-transparent border-0 cursor-pointer p-0"
                  >
                    <Edit3 className="h-3.5 w-3.5" />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteAddress(addr._id || addr.id)}
                    className="inline-flex items-center gap-1 text-red-600 hover:text-red-700 font-semibold text-xs bg-transparent border-0 cursor-pointer p-0"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

import { useState, useEffect } from 'react';
import { Package, Tag, ShoppingBag, ShieldAlert, Plus, FolderPlus, TrendingUp, Clock } from 'lucide-react';
import { getProducts } from '../../services/productApi';
import { getCategories } from '../../services/categoryApi';
import axiosClient from '../../services/axiosClient';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [prodData, catData, ordersData] = await Promise.all([
        getProducts({ limit: 100 }),
        getCategories(),
        axiosClient.get('/orders/admin/all')
      ]);
      setProducts(Array.isArray(prodData) ? prodData : (prodData.products || []));
      setCategories(catData);
      setOrders(ordersData.data || []);
    } catch (err) {
      console.error('Failed to fetch stats:', err);
    } finally {
      setLoading(false);
    }
  };

  // Metrics calculations
  const totalSales = orders
    .filter(order => order.paymentStatus === 'Paid' || order.isPaid)
    .reduce((sum, order) => sum + (order.totalAmount || order.totalPrice || 0), 0);

  const pendingOrdersCount = orders.filter(order => order.orderStatus === 'Pending').length;

  return (
    <div>
      <header className="mb-8 text-left">
        <h1 className="text-2xl font-bold font-sans tracking-tight text-zinc-900">Control Dashboard</h1>
        <p className="text-zinc-500 mt-1 text-sm">Overview metrics and shortcuts to manage your Apple catalog store.</p>
      </header>

      {/* Quick Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8 text-left">
        {/* Total Sales */}
        <div className="bg-white rounded-3xl p-6 border border-zinc-150 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Total Sales (Paid)</span>
            <p className="text-3xl font-bold font-sans text-emerald-600 mt-1.5">
              {loading ? '...' : `₹${totalSales.toLocaleString()}`}
            </p>
          </div>
          <div className="h-12 w-12 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-500">
            <TrendingUp className="h-5 w-5" />
          </div>
        </div>

        {/* Total Orders */}
        <div className="bg-white rounded-3xl p-6 border border-zinc-150 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Total Orders</span>
            <p className="text-3xl font-bold font-sans text-blue-600 mt-1.5">
              {loading ? '...' : orders.length}
            </p>
          </div>
          <div className="h-12 w-12 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-500">
            <ShoppingBag className="h-5 w-5" />
          </div>
        </div>

        {/* Pending Orders */}
        <div className="bg-white rounded-3xl p-6 border border-zinc-150 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Pending Orders</span>
            <p className="text-3xl font-bold font-sans text-amber-600 mt-1.5">
              {loading ? '...' : pendingOrdersCount}
            </p>
          </div>
          <div className="h-12 w-12 rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-500">
            <Clock className="h-5 w-5" />
          </div>
        </div>

        {/* Total Products */}
        <div className="bg-white rounded-3xl p-6 border border-zinc-150 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Total Products</span>
            <p className="text-3xl font-bold font-sans text-zinc-900 mt-1.5">{loading ? '...' : products.length}</p>
          </div>
          <div className="h-12 w-12 rounded-2xl bg-zinc-50 border border-zinc-100 flex items-center justify-center text-zinc-500">
            <Package className="h-5 w-5" />
          </div>
        </div>

        {/* Active Categories */}
        <div className="bg-white rounded-3xl p-6 border border-zinc-150 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Active Categories</span>
            <p className="text-3xl font-bold font-sans text-zinc-900 mt-1.5">{loading ? '...' : categories.length}</p>
          </div>
          <div className="h-12 w-12 rounded-2xl bg-zinc-50 border border-zinc-100 flex items-center justify-center text-zinc-500">
            <Tag className="h-5 w-5" />
          </div>
        </div>

        {/* Out of Stock Items */}
        <div 
          onClick={() => navigate('/admin/products')}
          className="bg-white rounded-3xl p-6 border border-zinc-150 shadow-sm flex items-center justify-between cursor-pointer hover:bg-zinc-50 transition-colors"
        >
          <div>
            <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Out of Stock Items</span>
            <p className="text-3xl font-bold font-sans text-red-600 mt-1.5">
              {loading ? '...' : products.filter(p => p.stock === 0).length}
            </p>
          </div>
          <div className="h-12 w-12 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-500">
            <ShieldAlert className="h-5 w-5" />
          </div>
        </div>

        {/* Low Stock Items */}
        <div 
          onClick={() => navigate('/admin/products')}
          className="bg-white rounded-3xl p-6 border border-zinc-150 shadow-sm flex items-center justify-between cursor-pointer hover:bg-zinc-50 transition-colors"
        >
          <div>
            <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Low Stock Items (1-5)</span>
            <p className="text-3xl font-bold font-sans text-amber-600 mt-1.5">
              {loading ? '...' : products.filter(p => p.stock > 0 && p.stock <= 5).length}
            </p>
          </div>
          <div className="h-12 w-12 rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-500">
            <ShieldAlert className="h-5 w-5" />
          </div>
        </div>
      </div>

      {/* Quick Shortcuts */}
      <div className="bg-white rounded-3xl border border-zinc-150 shadow-sm p-8 text-left">
        <h2 className="text-lg font-bold text-zinc-900 font-sans">Quick Shortcuts</h2>
        <p className="text-zinc-500 text-sm mt-1">Jump directly to add models or categories into your online store database.</p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
          <button
            onClick={() => navigate('/admin/products')}
            className="flex items-center gap-4 p-5 rounded-2xl bg-zinc-50 hover:bg-zinc-100/70 border border-zinc-100 hover:border-zinc-200 transition-all text-left cursor-pointer group"
          >
            <div className="h-11 w-11 rounded-xl bg-[#0071e3]/10 text-[#0071e3] flex items-center justify-center">
              <Plus className="h-5 w-5" />
            </div>
            <div>
              <span className="text-sm font-bold text-zinc-800">Add New Product Model</span>
              <p className="text-xs text-zinc-500 mt-0.5 group-hover:text-zinc-700">Upload new iPhone, Mac, or Watch specs</p>
            </div>
          </button>

          <button
            onClick={() => navigate('/admin/categories')}
            className="flex items-center gap-4 p-5 rounded-2xl bg-zinc-50 hover:bg-zinc-100/70 border border-zinc-100 hover:border-zinc-200 transition-all text-left cursor-pointer group"
          >
            <div className="h-11 w-11 rounded-xl bg-purple-500/10 text-purple-600 flex items-center justify-center">
              <FolderPlus className="h-5 w-5" />
            </div>
            <div>
              <span className="text-sm font-bold text-zinc-800">Add Product Category</span>
              <p className="text-xs text-zinc-500 mt-0.5 group-hover:text-zinc-700">Add iPad, TV & Homes, or AirPods tags</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}

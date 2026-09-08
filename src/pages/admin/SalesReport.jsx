import { useState, useEffect } from 'react';
import { RefreshCw, TrendingUp, ShoppingBag, ShieldAlert, Award, Tag, Calendar, Loader2 } from 'lucide-react';
import axiosClient from '../../services/axiosClient';

export default function SalesReport() {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchReport();
  }, []);

  const fetchReport = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosClient.get('/orders/admin/sales-report');
      setReport(response.data);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to fetch sales analytics.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 text-left">
      <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold font-sans tracking-tight text-zinc-900">Sales & Revenue Reports</h1>
          <p className="text-zinc-500 mt-1 text-sm">Monitor business transactions, top models, and coupon program effectiveness.</p>
        </div>
        <button
          onClick={fetchReport}
          className="flex items-center gap-2 bg-zinc-900 hover:bg-zinc-850 text-white px-4 py-2.5 rounded-2xl text-xs font-semibold shadow-sm transition-all cursor-pointer border-0"
        >
          <RefreshCw className="h-4 w-4" />
          Refresh Report
        </button>
      </header>

      {error && (
        <div className="bg-rose-50 border border-rose-200 text-rose-800 p-4 rounded-2xl mb-6">
          <p className="font-semibold text-sm">Analytics Fetch Error</p>
          <p className="text-xs text-rose-600 mt-0.5">{error}</p>
        </div>
      )}

      {loading || !report ? (
        <div className="p-20 bg-white border border-zinc-150 rounded-3xl flex flex-col items-center justify-center text-zinc-400">
          <Loader2 className="h-8 w-8 animate-spin text-zinc-900 mb-3" />
          <span className="text-sm font-semibold">Compiling database transactions...</span>
        </div>
      ) : (
        <div className="space-y-8 animate-in fade-in duration-300">
          
          {/* KPI Dashboard Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white border border-zinc-150 p-6 rounded-3xl shadow-sm flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Net Revenue</span>
                <p className="text-2xl font-extrabold text-emerald-600 mt-1">₹{report.netSales?.toLocaleString('en-IN')}</p>
              </div>
              <div className="h-10 w-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
                <TrendingUp className="h-5 w-5" />
              </div>
            </div>

            <div className="bg-white border border-zinc-150 p-6 rounded-3xl shadow-sm flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Paid Orders</span>
                <p className="text-2xl font-extrabold text-blue-600 mt-1">{report.ordersCount}</p>
              </div>
              <div className="h-10 w-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                <ShoppingBag className="h-5 w-5" />
              </div>
            </div>

            <div className="bg-white border border-zinc-150 p-6 rounded-3xl shadow-sm flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Average Order Value</span>
                <p className="text-2xl font-extrabold text-purple-600 mt-1">₹{report.aov?.toLocaleString('en-IN')}</p>
              </div>
              <div className="h-10 w-10 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center">
                <Award className="h-5 w-5" />
              </div>
            </div>

            <div className="bg-white border border-zinc-150 p-6 rounded-3xl shadow-sm flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Coupon Savings</span>
                <p className="text-2xl font-extrabold text-[#0071e3] mt-1">₹{report.totalDiscount?.toLocaleString('en-IN')}</p>
              </div>
              <div className="h-10 w-10 bg-blue-50 text-[#0071e3] rounded-xl flex items-center justify-center">
                <Tag className="h-5 w-5" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left: Top Products Section (7 cols) */}
            <div className="lg:col-span-8 bg-white border border-zinc-150 rounded-3xl shadow-sm overflow-hidden flex flex-col justify-between">
              <header className="p-6 border-b border-zinc-100 flex items-center justify-between">
                <h3 className="font-bold text-zinc-950 text-sm">Best Selling Apple Devices</h3>
                <span className="text-[9px] font-extrabold bg-zinc-100 text-zinc-650 px-2 py-0.5 rounded uppercase">Ranked</span>
              </header>
              <div className="overflow-x-auto flex-grow">
                {report.topProducts?.length === 0 ? (
                  <p className="text-zinc-400 text-xs italic text-center py-12">No products sold yet.</p>
                ) : (
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-zinc-50 border-b border-zinc-100 text-zinc-450 uppercase text-[9px] tracking-widest font-extrabold">
                        <th className="py-3.5 px-6">Product Title</th>
                        <th className="py-3.5 px-6">Brand</th>
                        <th className="py-3.5 px-6 text-center">Qty Sold</th>
                        <th className="py-3.5 px-6 text-right">Revenue Generated</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-100 font-medium">
                      {report.topProducts.map((item, idx) => (
                        <tr key={idx} className="hover:bg-zinc-50/50 transition-colors">
                          <td className="py-3.5 px-6 font-bold text-zinc-900">{item.title}</td>
                          <td className="py-3.5 px-6 text-zinc-500">{item.brand}</td>
                          <td className="py-3.5 px-6 text-center text-zinc-900 font-bold font-sans">{item.unitsSold} units</td>
                          <td className="py-3.5 px-6 text-right font-extrabold text-emerald-600 font-sans">₹{item.revenue?.toLocaleString('en-IN')}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>

            {/* Right: Coupon Performance Section (4 cols) */}
            <div className="lg:col-span-4 bg-white border border-zinc-150 rounded-3xl shadow-sm overflow-hidden flex flex-col">
              <header className="p-6 border-b border-zinc-100">
                <h3 className="font-bold text-zinc-950 text-sm">Coupon Usage Analytics</h3>
              </header>
              <div className="overflow-x-auto flex-grow">
                {report.couponUsage?.length === 0 ? (
                  <p className="text-zinc-400 text-xs italic text-center py-12">No coupons applied yet.</p>
                ) : (
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-zinc-50 border-b border-zinc-100 text-zinc-450 uppercase text-[9px] tracking-widest font-extrabold">
                        <th className="py-3.5 px-4">Coupon</th>
                        <th className="py-3.5 px-4 text-center">Uses</th>
                        <th className="py-3.5 px-4 text-right">Total Discount</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-100 font-medium">
                      {report.couponUsage.map((c, idx) => (
                        <tr key={idx} className="hover:bg-zinc-50/50 transition-colors">
                          <td className="py-3.5 px-4 font-mono font-bold text-[#0071e3]">{c.code}</td>
                          <td className="py-3.5 px-4 text-center text-zinc-900 font-bold">{c.usageCount} times</td>
                          <td className="py-3.5 px-4 text-right text-zinc-650 font-bold font-sans">₹{c.totalDiscount?.toLocaleString('en-IN')}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </div>

          {/* Daily Revenue logs history section */}
          <div className="bg-white border border-zinc-150 rounded-3xl shadow-sm p-6">
            <header className="mb-6 flex items-center justify-between">
              <div className="space-y-1">
                <h3 className="font-bold text-zinc-950 text-sm flex items-center gap-2">
                  <Calendar className="h-4.5 w-4.5 text-zinc-500" />
                  Daily Revenue logs
                </h3>
                <p className="text-xs text-zinc-400">Summarized receipts logging the total transactions completed per day.</p>
              </div>
            </header>
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4">
              {report.dailyTrends?.length === 0 ? (
                <p className="text-zinc-400 text-xs italic py-6 col-span-full text-center">No sales logged in the timeline.</p>
              ) : (
                report.dailyTrends.slice(-12).map((trend, idx) => (
                  <div key={idx} className="p-4 bg-zinc-50 border border-zinc-150 rounded-2xl flex flex-col justify-between text-left font-sans">
                    <span className="text-[10px] text-zinc-400 font-extrabold">{new Date(trend.date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}</span>
                    <span className="text-sm font-black text-zinc-950 mt-2">₹{trend.amount?.toLocaleString('en-IN')}</span>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>
      )}
    </div>
  );
}

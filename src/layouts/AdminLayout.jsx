import { Outlet } from 'react-router-dom';
import AdminSidebar from '../components/AdminSidebar';
import AdminHeader from '../components/AdminHeader';

export default function AdminLayout() {
  return (
    <div className="flex h-screen w-full bg-[#f8fafc] text-zinc-800 overflow-hidden font-sans">
      {/* Admin Sidebar Navigation */}
      <AdminSidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <AdminHeader />

        {/* Scrollable Sub-routes rendering container */}
        <main className="flex-1 overflow-y-auto p-6 sm:p-8 md:p-10">
          <div className="max-w-7xl mx-auto w-full">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}

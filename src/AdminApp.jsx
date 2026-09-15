import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import AdminLogin from './pages/admin/AdminLogin';
import AdminLayout from './layouts/AdminLayout';
import AdminProtectedRoute from './components/AdminProtectedRoute';
import Dashboard from './pages/admin/Dashboard';
import Products from './pages/admin/Products';
import AdminCategories from './pages/admin/Categories';
import AdminOrders from './pages/admin/Orders';
import Users from './pages/admin/Users';
import Coupons from './pages/admin/Coupons';
import Settings from './pages/admin/Settings';
import HeroBanners from './pages/admin/HeroBanners';
import AppleCategories from './pages/admin/AppleCategories';
import Testimonials from './pages/admin/Testimonials';
import NavbarManager from './pages/admin/NavbarManager';
import CategoryIconsManager from './pages/admin/CategoryIconsManager';
import AppleCareManager from './pages/admin/AppleCareManager';
import DisplayAppleCareManager from './pages/admin/DisplayAppleCareManager';
import ProductAppleCareManager from './pages/admin/ProductAppleCareManager';
import FooterManager from './pages/admin/FooterManager';
import AdminReturns from './pages/admin/Returns';
import AdminEnquiries from './pages/admin/Enquiries';
import AdminSalesReport from './pages/admin/SalesReport';

const adminRouter = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/login" replace />
  },
  {
    path: '/login',
    element: <AdminLogin />
  },
  {
    path: '/dashboard',
    element: (
      <AdminProtectedRoute>
        <AdminLayout />
      </AdminProtectedRoute>
    ),
    children: [
      { path: '', element: <Navigate to="/dashboard/home" replace /> },
      { path: 'home', element: <Dashboard /> },
      { path: 'products', element: <Products /> },
      { path: 'categories', element: <AdminCategories /> },
      { path: 'orders', element: <AdminOrders /> },
      { path: 'users', element: <Users /> },
      { path: 'coupons', element: <Coupons /> },
      { path: 'hero-banners', element: <HeroBanners /> },
      { path: 'apple-categories', element: <AppleCategories /> },
      { path: 'testimonials', element: <Testimonials /> },
      { path: 'navbar-menu', element: <NavbarManager /> },
      { path: 'category-icons', element: <CategoryIconsManager /> },
      { path: 'applecare', element: <AppleCareManager /> },
      { path: 'display-applecare', element: <DisplayAppleCareManager /> },
      { path: 'product-applecare', element: <ProductAppleCareManager /> },
      { path: 'footer-menu', element: <FooterManager /> },
      { path: 'settings', element: <Settings /> },
      { path: 'returns', element: <AdminReturns /> },
      { path: 'enquiries', element: <AdminEnquiries /> },
      { path: 'sales-report', element: <AdminSalesReport /> },
    ]
  },
  {
    path: '*',
    element: <Navigate to="/login" replace />
  }
]);

export default function AdminApp() {
  return <RouterProvider router={adminRouter} />;
}

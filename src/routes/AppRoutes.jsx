import { createBrowserRouter, Navigate } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import Home from '../pages/Home';
import Shop from '../pages/Shop';
import ProductDetails from '../pages/ProductDetails';
import Cart from '../pages/Cart';
import Checkout from '../pages/Checkout';
import Login from '../pages/Login';
import Signup from '../pages/Signup';
import Profile from '../pages/Profile';
import Orders from '../pages/Orders';
import Wishlist from '../pages/Wishlist';
import Categories from '../pages/Categories';
import Iphone from '../pages/Iphone';
import Macbook from '../pages/Macbook';
import Ipad from '../pages/Ipad';
import Watch from '../pages/Watch';
import Airpods from '../pages/Airpods';
import TvHome from '../pages/TvHome';
import Accessories from '../pages/Accessories';
import AppleCare from '../pages/AppleCare';
import About from '../pages/About';
import ProtectedRoute from '../components/ProtectedRoute';
import AdminProtectedRoute from '../components/AdminProtectedRoute';
import AdminLayout from '../layouts/AdminLayout';
import AdminLogin from '../pages/admin/AdminLogin';
import Dashboard from '../pages/admin/Dashboard';
import Products from '../pages/admin/Products';
import AdminCategories from '../pages/admin/Categories';
import AdminOrders from '../pages/admin/Orders';
import Users from '../pages/admin/Users';
import Coupons from '../pages/admin/Coupons';
import Settings from '../pages/admin/Settings';
import HeroBanners from '../pages/admin/HeroBanners';
import AppleCategories from '../pages/admin/AppleCategories';
import Testimonials from '../pages/admin/Testimonials';
import NavbarManager from '../pages/admin/NavbarManager';
import CategoryIconsManager from '../pages/admin/CategoryIconsManager';
import AppleCareManager from '../pages/admin/AppleCareManager';
import IpadAppleCareManager from '../pages/admin/IpadAppleCareManager';
import IphoneAppleCareManager from '../pages/admin/IphoneAppleCareManager';
import WatchAppleCareManager from '../pages/admin/WatchAppleCareManager';
import AirpodsAppleCareManager from '../pages/admin/AirpodsAppleCareManager';
import TvHomeAppleCareManager from '../pages/admin/TvHomeAppleCareManager';
import ProductAppleCareManager from '../pages/admin/ProductAppleCareManager';
import FooterManager from '../pages/admin/FooterManager';
import AdminReturns from '../pages/admin/Returns';
import AdminEnquiries from '../pages/admin/Enquiries';
import AdminSalesReport from '../pages/admin/SalesReport';

// New enhancements
import NotFound from '../pages/NotFound';
import Search from '../pages/Search';
import OrderDetails from '../pages/OrderDetails';
import SavedAddresses from '../pages/SavedAddresses';
import ForgotPassword from '../pages/ForgotPassword';
import ResetPassword from '../pages/ResetPassword';
import Contact from '../pages/Contact';
import Faq from '../pages/Faq';
import Policies from '../pages/Policies';
import ShippingPolicy from '../pages/ShippingPolicy';
import ReturnsRefundPolicy from '../pages/ReturnsRefundPolicy';
import PrivacyPolicy from '../pages/PrivacyPolicy';
import TermsOfService from '../pages/TermsOfService';
import BulkOrders from '../pages/BulkOrders';
import Compare from '../pages/Compare';

const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        path: '',
        element: <Home />
      },
      {
        path: 'shop',
        element: <Shop />
      },
      {
        path: 'iphone',
        element: <Iphone />
      },
      {
        path: 'macbook',
        element: <Macbook />
      },
      {
        path: 'ipad',
        element: <Ipad />
      },
      {
        path: 'watch',
        element: <Watch />
      },
      {
        path: 'airpods',
        element: <Airpods />
      },
      {
        path: 'tv-home',
        element: <TvHome />
      },
      {
        path: 'accessories',
        element: <Accessories />
      },
      {
        path: 'applecare',
        element: <AppleCare />
      },
      {
        path: 'categories',
        element: <Categories />
      },
      {
        path: 'product/:id',
        element: <ProductDetails />
      },
      {
        path: 'cart',
        element: <Cart />
      },
      {
        path: 'checkout',
        element: <Checkout />
      },
      {
        path: 'profile',
        element: <Navigate to="/" replace />
      },
      {
        path: 'orders',
        element: <Navigate to="/" replace />
      },
      {
        path: 'orders/:id',
        element: <Navigate to="/" replace />
      },
      {
        path: 'addresses',
        element: <Navigate to="/checkout" replace />
      },
      {
        path: 'wishlist',
        element: <ProtectedRoute><Wishlist /></ProtectedRoute>
      },
      {
        path: 'about',
        element: <About />
      },
      {
        path: 'search',
        element: <Search />
      },
      {
        path: 'contact',
        element: <Contact />
      },
      {
        path: 'faq',
        element: <Faq />
      },
      // Dedicated Standalone Policy Pages
      {
        path: 'shipping-policy',
        element: <ShippingPolicy />
      },
      {
        path: 'returns-refund-policy',
        element: <ReturnsRefundPolicy />
      },
      {
        path: 'returns-policy',
        element: <ReturnsRefundPolicy />
      },
      {
        path: 'privacy-policy',
        element: <PrivacyPolicy />
      },
      {
        path: 'privacy',
        element: <PrivacyPolicy />
      },
      {
        path: 'terms-of-service',
        element: <TermsOfService />
      },
      {
        path: 'terms',
        element: <TermsOfService />
      },

      {
        path: 'policies/shipping',
        element: <ShippingPolicy />
      },
      {
        path: 'policies/returns',
        element: <ReturnsRefundPolicy />
      },
      {
        path: 'policies/privacy',
        element: <PrivacyPolicy />
      },
      {
        path: 'policies/terms',
        element: <TermsOfService />
      },
      {
        path: 'policies/:type',
        element: <Policies />
      },
      {
        path: 'policies',
        element: <Navigate to="/shipping-policy" replace />
      },
      {
        path: 'bulk-orders',
        element: <BulkOrders />
      },
      {
        path: 'compare',
        element: <Compare />
      }
    ]
  },
  {
    path: '/admin/login',
    element: <AdminLogin />
  },
  {
    path: '/admin',
    element: <AdminProtectedRoute><AdminLayout /></AdminProtectedRoute>,
    children: [
      { path: '', element: <Navigate to="/admin/dashboard" replace /> },
      { path: 'dashboard', element: <Dashboard /> },
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
      { path: 'ipad-applecare', element: <IpadAppleCareManager /> },
      { path: 'iphone-applecare', element: <IphoneAppleCareManager /> },
      { path: 'watch-applecare', element: <WatchAppleCareManager /> },
      { path: 'airpods-applecare', element: <AirpodsAppleCareManager /> },
      { path: 'tv-home-applecare', element: <TvHomeAppleCareManager /> },
      { path: 'tvhome-applecare', element: <TvHomeAppleCareManager /> },
      { path: 'product-applecare', element: <ProductAppleCareManager /> },
      { path: 'footer-menu', element: <FooterManager /> },
      { path: 'settings', element: <Settings /> },
      { path: 'returns', element: <AdminReturns /> },
      { path: 'enquiries', element: <AdminEnquiries /> },
      { path: 'sales-report', element: <AdminSalesReport /> }
    ]
  },
  {
    path: '/login',
    element: <Navigate to="/" replace />
  },
  {
    path: '/signup',
    element: <Navigate to="/" replace />
  },
  {
    path: '/forgot-password',
    element: <Navigate to="/" replace />
  },
  {
    path: '/reset-password',
    element: <Navigate to="/" replace />
  },
  {
    path: '*',
    element: <NotFound />
  }
]);

export default router;



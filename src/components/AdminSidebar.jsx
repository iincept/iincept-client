import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  Tag, 
  ShoppingBag, 
  Users, 
  Home, 
  Settings, 
  ArrowLeft,
  MessageSquare,
  TrendingUp,
  Navigation,
  Grid,
  LayoutGrid,
  Layers,
  Star,
  ShieldCheck
} from 'lucide-react';

export default function AdminSidebar() {
  const navItems = [
    { label: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'Products', path: '/admin/products', icon: Package },
    { label: 'Hero Banners', path: '/admin/hero-banners', icon: Home },
    { label: 'Apple Categories', path: '/admin/apple-categories', icon: Grid },
    { label: 'Navbar Menu', path: '/admin/navbar-menu', icon: Navigation },
    { label: 'Category Icons', path: '/admin/category-icons', icon: Layers },
    { label: 'MacBook AppleCare', path: '/admin/applecare', icon: ShieldCheck },
    { label: 'iPad AppleCare', path: '/admin/ipad-applecare', icon: ShieldCheck },
    { label: 'iPhone AppleCare', path: '/admin/iphone-applecare', icon: ShieldCheck },
    { label: 'Watch AppleCare', path: '/admin/watch-applecare', icon: ShieldCheck },
    { label: 'AirPods AppleCare', path: '/admin/airpods-applecare', icon: ShieldCheck },
    { label: 'TV & Home AppleCare', path: '/admin/tv-home-applecare', icon: ShieldCheck },
    { label: 'Product Apple Care', path: '/admin/product-applecare', icon: ShieldCheck },
    { label: 'Footer Menu', path: '/admin/footer-menu', icon: LayoutGrid },
    { label: 'Testimonials', path: '/admin/testimonials', icon: Star },
    { label: 'Product Categories', path: '/admin/categories', icon: Tag },
    { label: 'Orders', path: '/admin/orders', icon: ShoppingBag },
    { label: 'Users', path: '/admin/users', icon: Users },
    { label: 'Enquiries', path: '/admin/enquiries', icon: MessageSquare },
    { label: 'Sales Report', path: '/admin/sales-report', icon: TrendingUp },
    { label: 'Settings', path: '/admin/settings', icon: Settings }
  ];

  return (
    <aside className="w-64 bg-zinc-950 text-zinc-300 flex flex-col justify-between shrink-0 border-r border-zinc-850 p-6 select-none">
      <div>
        {/* Brand Logo */}
        <div className="flex items-center gap-3 mb-10">
          <div className="h-8 w-8 rounded-lg bg-[#0071e3] text-white flex items-center justify-center font-bold text-lg shadow-sm">
            ii
          </div>
          <span className="font-sans font-bold text-lg text-white tracking-wide uppercase">iiNCEPT Admin</span>
        </div>

        {/* Sidebar Nav Links */}
        <nav className="space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.label}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold tracking-wide transition-all ${
                    isActive 
                      ? 'bg-[#0071e3] text-white shadow-md shadow-[#0071e3]/10 font-bold' 
                      : 'hover:bg-zinc-900 hover:text-white'
                  }`
                }
              >
                <Icon className="h-4.5 w-4.5" />
                {item.label}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Back to Shop Storefront Link */}
      <div>
        <a
          href="http://localhost:5173"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 border border-zinc-800 hover:border-zinc-700 hover:bg-zinc-900 hover:text-white px-4 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all"
        >
          <ArrowLeft className="h-4 w-4" />
          View Storefront ↗
        </a>
      </div>
    </aside>
  );
}

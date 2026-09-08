import { useParams, useNavigate } from 'react-router-dom';
import { ShieldCheck, Truck, RotateCcw, FileText } from 'lucide-react';

const POLICIES = {
  shipping: {
    title: 'Shipping Policy',
    icon: Truck,
    content: (
      <div className="space-y-4 text-xs sm:text-sm text-zinc-650 text-left">
        <p>We partner with premier courier networks (Blue Dart, Delhivery, DTDC) to deliver your premium electronics pan-India. All packages are insured and fully traceable door-to-door.</p>
        <h3 className="font-bold text-zinc-800 text-sm">Processing & Dispatch</h3>
        <p>Most retail orders are processed and handed over to carriers within 24 hours of payment authorization. You will receive real-time SMS and email tracking links upon dispatch.</p>
        <h3 className="font-bold text-zinc-800 text-sm">Delivery Surcharges</h3>
        <ul className="list-disc pl-5 space-y-1.5">
          <li><strong>Orders above INR 1,499:</strong> Free shipping is provided across all service zones.</li>
          <li><strong>Orders below INR 1,499:</strong> Flat INR 99 delivery fee applies at checkout.</li>
        </ul>
        <h3 className="font-bold text-zinc-800 text-sm">Delivery Conditions</h3>
        <p>A digital OTP or physical signature is mandatory upon delivery. In the event of a damaged outer seal, please refuse carrier acceptance and report details immediately to our Support Desk.</p>
      </div>
    )
  },
  returns: {
    title: 'Returns & Refund Policy',
    icon: RotateCcw,
    content: (
      <div className="space-y-4 text-xs sm:text-sm text-zinc-650 text-left">
        <p>We support a hassle-free 7-day return window on qualified electronic accessories. Verify eligibility details below before creating a return ticket.</p>
        <h3 className="font-bold text-zinc-800 text-sm">Eligibility Criteria</h3>
        <ul className="list-disc pl-5 space-y-1.5">
          <li>Devices must remain unactivated and sealed in original manufacturer packaging.</li>
          <li>Serial numbers on device labels must match original checkout invoices.</li>
          <li>Products with physical scratches, modifications, or water damage do not qualify.</li>
        </ul>
        <h3 className="font-bold text-zinc-800 text-sm">Refund Clearances</h3>
        <p>Upon return parcel arrival at our inspection center, quality control takes 48 hours to inspect package condition. Approved refunds clear to your original source account within 5–7 business days.</p>
      </div>
    )
  },
  privacy: {
    title: 'Privacy Policy',
    icon: ShieldCheck,
    content: (
      <div className="space-y-4 text-xs sm:text-sm text-zinc-650 text-left">
        <p>We values your trust. This Privacy Policy details how we secure and process customer metadata and billing credentials across our platform.</p>
        <h3 className="font-bold text-zinc-800 text-sm">Metadata Collected</h3>
        <p>We store name, email IDs, delivery addresses, and mobile numbers necessary to compile purchases and check out shipments. We do not store raw card credentials locally.</p>
        <h3 className="font-bold text-zinc-800 text-sm">Third-Party Handshakes</h3>
        <p>Billing payloads are passed securely to Razorpay gateway under standard HTTPS protocols. Order tracking data is shared exclusively with integrated logistics partners to fulfill courier deliveries.</p>
      </div>
    )
  },
  terms: {
    title: 'Terms of Service',
    icon: FileText,
    content: (
      <div className="space-y-4 text-xs sm:text-sm text-zinc-650 text-left">
        <p>Please review our platform Terms of Service before placing an order. Accessing the catalog indicates agreement to all terms listed here.</p>
        <h3 className="font-bold text-zinc-800 text-sm">Product Availability & Price Errors</h3>
        <p>We strive for perfect listing accuracy. In the rare event of price mismatches, we reserve the right to cancel pending orders and issue full refunds immediately.</p>
        <h3 className="font-bold text-zinc-800 text-sm">Device Authenticity & Warranty</h3>
        <p>All items shipped are 100% brand-new, authentic, and backed by their respective official manufacturer warranty support. Warranty certificates are included inside product packaging.</p>
      </div>
    )
  }
};

export default function Policies() {
  const { type } = useParams();
  const navigate = useNavigate();

  // Default active key check
  const activeKey = POLICIES[type] ? type : 'shipping';
  const policy = POLICIES[activeKey];
  const Icon = policy.icon;

  const tabs = [
    { key: 'shipping', label: 'Shipping Policy', route: '/shipping-policy', icon: Truck },
    { key: 'returns', label: 'Returns & Refunds', route: '/returns-refund-policy', icon: RotateCcw },
    { key: 'privacy', label: 'Privacy Policy', route: '/privacy-policy', icon: ShieldCheck },
    { key: 'terms', label: 'Terms of Service', route: '/terms-of-service', icon: FileText }
  ];

  return (
    <div className="space-y-8 py-6 text-left max-w-5xl mx-auto animate-in fade-in duration-300">
      
      {/* Title */}
      <div className="space-y-1 border-b border-zinc-100 pb-4">
        <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900">Legal & Policies</h1>
        <p className="text-sm text-zinc-550">Legal guidelines, shipping timelines, returns procedures, and user agreements</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 items-start">
        
        {/* Navigation Sidebar */}
        <nav className="flex flex-col gap-2">
          {tabs.map((tab) => {
            const TabIcon = tab.icon;
            const isActive = activeKey === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => navigate(tab.route)}
                className={`w-full flex items-center gap-3 p-4 rounded-xl border text-xs font-bold transition-all cursor-pointer text-left ${
                  isActive 
                    ? 'bg-black text-white border-black shadow-sm' 
                    : 'bg-white text-zinc-500 border-zinc-200 hover:text-zinc-800 hover:border-zinc-300 shadow-sm'
                }`}
              >
                <TabIcon className="h-4.5 w-4.5 shrink-0" />
                {tab.label}
              </button>
            );
          })}
        </nav>

        {/* Content Panel */}
        <article className="md:col-span-3 bg-white border border-zinc-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
          <div className="flex items-center gap-3 border-b border-zinc-150 pb-3">
            <Icon className="h-6 w-6 text-zinc-800" />
            <h2 className="text-lg font-bold text-zinc-900">{policy.title}</h2>
          </div>
          {policy.content}
        </article>

      </div>

    </div>
  );
}

import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Lock, Eye, Server, ArrowLeft, KeyRound, Database } from 'lucide-react';

export default function PrivacyPolicy() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="bg-white min-h-screen py-10 px-4 sm:px-6 lg:px-8 text-zinc-800">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Navigation Breadcrumb */}
        <div className="flex items-center gap-2 text-xs font-semibold text-zinc-500 uppercase tracking-wider">
          <Link to="/" className="hover:text-blue-600 flex items-center gap-1 transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" /> Home
          </Link>
          <span>/</span>
          <span className="text-zinc-900">Privacy Policy</span>
        </div>

        {/* Hero Header */}
        <div className="border-b border-zinc-200 pb-6 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-xs font-semibold">
            <ShieldCheck className="w-4 h-4" /> Data Security & Protection Guaranteed
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-zinc-900">
            Privacy Policy
          </h1>
          <p className="text-sm sm:text-base text-zinc-600 max-w-2xl leading-relaxed">
            At iincept, we prioritize your privacy and data security. Learn how we collect, safeguard, and manage customer credentials and transactional data.
          </p>
        </div>

        {/* Highlights Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 bg-zinc-50 rounded-2xl border border-zinc-200/80 space-y-1.5">
            <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm">
              <Lock className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-zinc-900 text-sm">256-Bit SSL Encryption</h3>
            <p className="text-xs text-zinc-500">All data transmissions are protected by enterprise-grade SSL certificates.</p>
          </div>

          <div className="p-4 bg-zinc-50 rounded-2xl border border-zinc-200/80 space-y-1.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold text-sm">
              <KeyRound className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-zinc-900 text-sm">Zero Card Data Storage</h3>
            <p className="text-xs text-zinc-500">Payments are processed directly by RBI-authorised payment gateways.</p>
          </div>

          <div className="p-4 bg-zinc-50 rounded-2xl border border-zinc-200/80 space-y-1.5">
            <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center font-bold text-sm">
              <Eye className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-zinc-900 text-sm">No Third-Party Ads</h3>
            <p className="text-xs text-zinc-500">We never sell or rent customer data to external advertising networks.</p>
          </div>
        </div>

        {/* Detailed Sections */}
        <div className="space-y-6 text-sm text-zinc-700 leading-relaxed">
          
          <section className="space-y-2">
            <h2 className="text-lg font-bold text-zinc-900 flex items-center gap-2">
              <Database className="w-5 h-5 text-blue-600" /> 1. Information We Collect
            </h2>
            <p>
              When you browse our portal, register an account, or request a B2B quote, we collect essential operational details:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-zinc-600 text-xs sm:text-sm">
              <li><strong>Personal Credentials:</strong> Full Name, Email Address, Contact Phone Number.</li>
              <li><strong>Business Credentials:</strong> Company Name, GSTIN number (optional for tax invoices), Shipping & Billing Addresses.</li>
              <li><strong>Transaction Data:</strong> Order history, invoice records, and shipping consignment IDs.</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-zinc-900 flex items-center gap-2">
              <Server className="w-5 h-5 text-indigo-600" /> 2. How We Use Your Data
            </h2>
            <p>
              Your data is strictly used for order fulfillment, account authentication, and customer service:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-zinc-600 text-xs sm:text-sm">
              <li>Compiling and processing retail & B2B procurement orders.</li>
              <li>Generating GST-compliant tax invoices and warranty certificates.</li>
              <li>Dispatching real-time shipment updates via SMS, Email, and WhatsApp.</li>
              <li>Providing dedicated technical support for Apple hardware and AppleCare+.</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-zinc-900 flex items-center gap-2">
              <Lock className="w-5 h-5 text-emerald-600" /> 3. Secure Payment Gateway Processing
            </h2>
            <p>
              We do NOT store raw debit card, credit card, netbanking, or UPI PIN credentials on our servers. All financial transactions are securely processed by RBI-licensed payment aggregators (e.g. Razorpay) complying with <strong>PCI-DSS Level 1</strong> compliance standards.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-zinc-900">4. Third-Party Data Sharing Restrictions</h2>
            <p>
              We share customer shipping details exclusively with integrated courier partners (Blue Dart, Delhivery, DTDC) to ensure timely doorstep delivery. We do NOT share customer phone numbers or emails with external telemarketing networks under any circumstances.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-zinc-900">5. Cookies & Session Analytics</h2>
            <p>
              Our website uses essential session cookies to preserve your shopping cart state, maintain active user logins, and analyze site performance. You can manage or disable cookies via your browser settings at any time.
            </p>
          </section>

        </div>

        {/* Contact Desk */}
        <div className="p-6 bg-zinc-900 text-white rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="font-bold text-base">Data Protection Officer</h3>
            <p className="text-xs text-zinc-400">For privacy inquiries or data removal requests, contact our compliance desk.</p>
          </div>
          <a
            href="mailto:support@iincept.in"
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-all shrink-0"
          >
            Email Privacy Desk
          </a>
        </div>

      </div>
    </div>
  );
}

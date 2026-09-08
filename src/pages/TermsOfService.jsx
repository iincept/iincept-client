import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FileText, Scale, CheckCircle2, ShieldCheck, ArrowLeft, Building2, Gavel } from 'lucide-react';

export default function TermsOfService() {
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
          <span className="text-zinc-900">Terms of Service</span>
        </div>

        {/* Hero Header */}
        <div className="border-b border-zinc-200 pb-6 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-purple-50 text-purple-600 rounded-full text-xs font-semibold">
            <FileText className="w-4 h-4" /> Legal User Agreement
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-zinc-900">
            Terms of Service
          </h1>
          <p className="text-sm sm:text-base text-zinc-600 max-w-2xl leading-relaxed">
            Please read these Terms of Service carefully before purchasing Apple products or accessing services on iincept.
          </p>
        </div>

        {/* Highlights Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 bg-zinc-50 rounded-2xl border border-zinc-200/80 space-y-1.5">
            <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-zinc-900 text-sm">100% Genuine Apple</h3>
            <p className="text-xs text-zinc-500">Official Authorised Reseller inventory with official warranty support.</p>
          </div>

          <div className="p-4 bg-zinc-50 rounded-2xl border border-zinc-200/80 space-y-1.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold text-sm">
              <Building2 className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-zinc-900 text-sm">GST Invoicing</h3>
            <p className="text-xs text-zinc-500">Valid tax invoices supplied for corporate input tax credit claims.</p>
          </div>

          <div className="p-4 bg-zinc-50 rounded-2xl border border-zinc-200/80 space-y-1.5">
            <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center font-bold text-sm">
              <Scale className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-zinc-900 text-sm">Clear Commercial Terms</h3>
            <p className="text-xs text-zinc-500">Transparent pricing, order cancellation policies, and support rules.</p>
          </div>
        </div>

        {/* Detailed Guidelines */}
        <div className="space-y-6 text-sm text-zinc-700 leading-relaxed">
          
          <section className="space-y-2">
            <h2 className="text-lg font-bold text-zinc-900 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-blue-600" /> 1. Commercial Terms & Ordering
            </h2>
            <p>
              By placing an order through our online store or B2B quote desk, you confirm that you are legally competent to enter into binding contracts. All retail orders are processed subject to product availability and stock verification.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-zinc-900 flex items-center gap-2">
              <Scale className="w-5 h-5 text-purple-600" /> 2. Pricing, Taxes & Pricing Errors
            </h2>
            <p>
              Prices listed on our portal are in Indian Rupees (INR) and include applicable Goods and Services Tax (GST).
            </p>
            <ul className="list-disc pl-5 space-y-1 text-zinc-600 text-xs sm:text-sm">
              <li>GST tax invoices are generated automatically using the business GSTIN provided during checkout.</li>
              <li>While we ensure strict pricing accuracy, in the event of a system calculation error, we reserve the right to cancel unfulfilled orders and issue 100% full refunds.</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-zinc-900 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-600" /> 3. Apple Hardware Warranty Coverage
            </h2>
            <p>
              All Apple devices (iPhones, MacBooks, iPads, Apple Watches, AirPods, Accessories) sold on iincept are 100% brand-new, factory-sealed, and backed by Apple's 1-Year Limited Warranty. Customers can claim warranty service at any Apple Authorised Service Provider across India.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-zinc-900 flex items-center gap-2">
              <Gavel className="w-5 h-5 text-amber-600" /> 4. Order Cancellations
            </h2>
            <p>
              Customers can request order cancellation prior to courier dispatch by contacting our support desk. Once an order has been handed over to the courier network and a tracking ID generated, cancellation is no longer possible and the standard <Link to="/returns-refund-policy" className="text-blue-600 font-semibold underline">Returns Policy</Link> applies.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-zinc-900">5. Limitation of Liability</h2>
            <p>
              iincept shall not be liable for indirect, incidental, or consequential damages resulting from courier delays, third-party network outages, or unauthorized user modifications to hardware or operating systems.
            </p>
          </section>

        </div>

        {/* Legal Desk Support */}
        <div className="p-6 bg-zinc-900 text-white rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="font-bold text-base">Corporate Legal & Billing Desk</h3>
            <p className="text-xs text-zinc-400">For contract agreements or bulk procurement terms, reach out to our legal desk.</p>
          </div>
          <a
            href="mailto:support@iincept.in"
            className="px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-xl transition-all shrink-0"
          >
            Contact Legal Desk
          </a>
        </div>

      </div>
    </div>
  );
}

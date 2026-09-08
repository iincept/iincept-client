import { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';

const FAQ_DATA = [
  {
    category: 'Shipping & Delivery',
    items: [
      {
        q: 'What are the delivery timelines?',
        a: 'We ship all orders via priority express couriers. Standard delivery timelines are 2–4 business days depending on your delivery address pin code.'
      },
      {
        q: 'Do you offer free shipping?',
        a: 'Yes, we offer free shipping across India for all retail customer orders valued above INR 1499. Orders below this threshold incur flat INR 99 shipping fee.'
      },
      {
        q: 'How do I track my delivery status?',
        a: 'Once shipped, tracking updates are linked to your order reference. You can navigate to your "My Orders" tab and select "View Details" to check real-time courier statuses.'
      }
    ]
  },
  {
    category: 'Payments & Refunds',
    items: [
      {
        q: 'What payment modes are supported?',
        a: 'We support all major payment types including UPI (GPay, PhonePe, Paytm), Credit/Debit Cards, Net Banking, and Cash on Delivery (COD) for qualified pin codes.'
      },
      {
        q: 'How long do refunds take?',
        a: 'Once a return or cancellation request is approved, refund credits are dispatched to your original payment source. Cards and UPI credits clear within 5–7 business days.'
      }
    ]
  },
  {
    category: 'Returns & Cancellations',
    items: [
      {
        q: 'What is the return window policy?',
        a: 'We offer a flexible 7-day return policy on all eligible electronic accessories. Sealed packaging must remain intact. Devices showing physical signs of usage do not qualify.'
      },
      {
        q: 'Can I cancel my order?',
        a: 'Orders can be cancelled directly from the "My Orders" tab while they are in "Pending" or "Processing" status. Shipped orders cannot be cancelled.'
      }
    ]
  },
  {
    category: 'Warranty & Support',
    items: [
      {
        q: 'Are these products covered under warranty?',
        a: 'Yes, all electronic devices sold on our catalog include the official manufacturer warranty (e.g., 1 Year Authorised Apple India Warranty for iPhones/MacBooks) alongside GST invoice receipts.'
      }
    ]
  }
];

export default function Faq() {
  const [openIndex, setOpenIndex] = useState(''); // e.g. "0-1" representing cat-item

  const toggleAccordion = (index) => {
    setOpenIndex(prev => prev === index ? '' : index);
  };

  return (
    <div className="space-y-10 py-6 text-left max-w-4xl mx-auto animate-in fade-in duration-300">
      
      {/* Title */}
      <div className="space-y-2 text-center max-w-xl mx-auto">
        <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900">Frequently Asked Questions</h1>
        <p className="text-sm text-zinc-500">Quick answers to common questions regarding orders, shipping, and device warranties.</p>
      </div>

      <div className="space-y-8">
        {FAQ_DATA.map((cat, catIdx) => (
          <div key={catIdx} className="space-y-4">
            <h2 className="text-sm font-bold text-zinc-900 uppercase tracking-widest border-b border-zinc-100 pb-2">
              {cat.category}
            </h2>

            <div className="space-y-3">
              {cat.items.map((item, itemIdx) => {
                const idx = `${catIdx}-${itemIdx}`;
                const isOpen = openIndex === idx;
                return (
                  <div 
                    key={itemIdx}
                    className="border border-zinc-200 bg-white rounded-2xl overflow-hidden transition-all shadow-sm"
                  >
                    <button
                      onClick={() => toggleAccordion(idx)}
                      className="w-full p-4 text-left flex justify-between items-center gap-4 bg-transparent border-0 cursor-pointer focus:outline-none"
                    >
                      <span className="font-bold text-zinc-800 text-xs sm:text-sm">{item.q}</span>
                      {isOpen ? (
                        <ChevronUp className="h-4 w-4 text-zinc-500 shrink-0" />
                      ) : (
                        <ChevronDown className="h-4 w-4 text-zinc-500 shrink-0" />
                      )}
                    </button>
                    
                    {isOpen && (
                      <div className="px-4 pb-4 pt-1 border-t border-zinc-100 text-xs sm:text-sm text-zinc-550 leading-relaxed animate-in fade-in duration-200">
                        {item.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axiosClient from '../services/axiosClient';

const DEFAULT_FOOTER_DATA = {
  brandTitle: 'IndiaiStore',
  brandTagline: 'Official platform of Apple Authorised Distributors in India. Browse online, buy from trusted mono-brand resellers near you.',
  copyrightText: 'Copyright © 2026 IndiaiStore. All rights reserved. Powered by Ingram Micro & Redington.',
  columns: [
    {
      title: 'Shop',
      links: [
        { label: 'Mac', url: '/macbook' },
        { label: 'iPad', url: '/ipad' },
        { label: 'iPhone', url: '/iphone' },
        { label: 'Watch', url: '/watch' },
        { label: 'AirPods', url: '/airpods' },
        { label: 'Accessories', url: '/accessories' },
      ]
    },
    {
      title: 'Services',
      links: [
        { label: 'AppleCare+', url: '/applecare' },
        { label: 'Trade-in', url: '/iphone' },
        { label: 'Financing / EMI', url: '/iphone' },
        { label: 'Store Locator', url: '/#b2b-section' },
        { label: 'Order Status', url: '/profile' },
      ]
    },
    {
      title: 'Business',
      links: [
        { label: 'B2B / Corporate', url: '/#b2b-section' },
        { label: 'Education', url: '/bulk-orders' },
        { label: 'Enterprise', url: '/bulk-orders' },
        { label: 'Volume Pricing', url: '/bulk-orders' },
      ]
    },
    {
      title: 'About',
      links: [
        { label: 'About Us', url: '/about' },
        { label: 'Why Apple Premium Reseller', url: '/about' },
        { label: 'Partner Stores', url: '/stores' },
        { label: 'Contact', url: '/contact' },
        { label: 'Careers', url: '/contact' },
      ]
    }
  ],
  bottomLinks: [
    { label: 'Privacy Policy', url: '/privacy-policy' },
    { label: 'Terms of Use', url: '/terms-of-service' },
    { label: 'Sales Policy', url: '/shipping-policy' },
    { label: 'Legal', url: '/terms-of-service' }
  ]
};

export default function Footer() {
  const [footerData, setFooterData] = useState(DEFAULT_FOOTER_DATA);

  useEffect(() => {
    fetchFooterSettings();
  }, []);

  const fetchFooterSettings = async () => {
    try {
      const response = await axiosClient.get('/settings');
      if (response.data && response.data.footerSections && response.data.footerSections.length > 0) {
        // Adapt custom sections from settings if present
        const customCols = response.data.footerSections.map(sec => ({
          title: sec.title || 'Links',
          links: (sec.links || []).map(l => ({ label: l.label, url: l.url }))
        }));
        setFooterData(prev => ({
          ...prev,
          columns: customCols
        }));
      }
    } catch (err) {
      console.warn('Using default IndiaiStore footer settings:', err);
    }
  };

  return (
    <footer style={{
      background: '#f5f5f7',
      color: '#1d1d1f',
      borderTop: '1px solid #d2d2d7',
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif",
      width: '100%',
      marginTop: 'auto',
      padding: '48px 0 32px'
    }}>
      <style>{`
        .indiaistore-footer-col-title {
          font-size: 13px;
          font-weight: 600;
          color: #1d1d1f;
          margin-bottom: 14px;
          letter-spacing: -0.1px;
        }

        .indiaistore-footer-link-list {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 9px;
        }

        .indiaistore-footer-link {
          font-size: 13px;
          color: #86868b;
          text-decoration: none;
          transition: color 0.2s ease;
        }

        .indiaistore-footer-link:hover {
          color: #1d1d1f;
        }

        .indiaistore-footer-bottom-link {
          font-size: 12px;
          color: #86868b;
          text-decoration: none;
          transition: color 0.2s ease;
        }

        .indiaistore-footer-bottom-link:hover {
          color: #1d1d1f;
          text-decoration: underline;
        }

        @media (max-width: 900px) {
          .indiaistore-footer-grid {
            grid-template-columns: 1fr 1fr !important;
            gap: 32px !important;
          }
          .indiaistore-footer-brand-col {
            grid-column: span 2;
          }
        }

        @media (max-width: 550px) {
          .indiaistore-footer-grid {
            grid-template-columns: 1fr !important;
          }
          .indiaistore-footer-brand-col {
            grid-column: span 1;
          }
          .indiaistore-footer-bottom {
            flex-direction: column;
            align-items: flex-start !important;
            gap: 12px;
          }
        }
      `}</style>

      <div style={{ maxWidth: '1340px', margin: '0 auto', padding: '0 24px' }}>
        
        {/* Main 5-Column Grid */}
        <div className="indiaistore-footer-grid" style={{
          display: 'grid',
          gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr',
          gap: '40px',
          alignItems: 'start'
        }}>
          
          {/* Column 1: Brand Info */}
          <div className="indiaistore-footer-brand-col">
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '18px',
              fontWeight: 700,
              color: '#1d1d1f',
              letterSpacing: '-0.3px',
              marginBottom: '12px'
            }}>
              <span style={{ fontSize: '20px', lineHeight: 1 }}></span>
              <span>{footerData.brandTitle}</span>
            </div>
            <p style={{
              fontSize: '13px',
              color: '#86868b',
              lineHeight: 1.55,
              maxWidth: '260px',
              margin: 0
            }}>
              {footerData.brandTagline}
            </p>
          </div>

          {/* Columns 2-5: Dynamic Links */}
          {footerData.columns.map((col, idx) => (
            <div key={idx}>
              <div className="indiaistore-footer-col-title">{col.title}</div>
              <ul className="indiaistore-footer-link-list">
                {col.links.map((link, lIdx) => (
                  <li key={lIdx}>
                    {link.url?.startsWith('http') ? (
                      <a
                        href={link.url}
                        target="_blank"
                        rel="noreferrer"
                        className="indiaistore-footer-link"
                      >
                        {link.label}
                      </a>
                    ) : (
                      <Link to={link.url || '/shop'} className="indiaistore-footer-link">
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}

        </div>

        {/* Bottom Bar Divider & Copyright */}
        <div className="indiaistore-footer-bottom" style={{
          borderTop: '1px solid #d2d2d7',
          marginTop: '36px',
          paddingTop: '20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px'
        }}>
          <div style={{ fontSize: '12px', color: '#86868b' }}>
            {footerData.copyrightText}
          </div>

          <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
            {footerData.bottomLinks.map((link, idx) => (
              <Link key={idx} to={link.url} className="indiaistore-footer-bottom-link">
                {link.label}
              </Link>
            ))}
          </div>
        </div>

      </div>

      {/* Floating WhatsApp Contact Button */}
      <a
        href="https://wa.me/918607222417?text=Hi%20there!%20I%20am%20interested%20in%20buying%20Apple%20products%20for%20my%20business."
        target="_blank"
        rel="noopener noreferrer"
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          width: '52px',
          height: '52px',
          backgroundColor: '#25D366',
          color: '#ffffff',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 14px rgba(37,211,102,0.45)',
          zIndex: 99,
          transition: 'transform 0.2s ease, background-color 0.2s ease'
        }}
        title="Chat with us on WhatsApp"
      >
        <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: '28px', height: '28px' }}>
          <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.864-9.799.002-2.63-1.023-5.101-2.885-6.967C16.59 2.012 14.125.99 11.516.99c-5.44 0-9.866 4.372-9.87 9.802 0 1.706.467 3.376 1.349 4.86L2.014 22l6.633-1.745zM15.938 12.67c-.237-.117-1.4-.69-1.617-.768-.218-.078-.376-.117-.534.117-.158.236-.61.768-.748.924-.138.156-.277.175-.515.058-.237-.117-.998-.367-1.9-1.173-.702-.627-1.176-1.401-1.314-1.636-.138-.236-.015-.363.104-.48l.317-.37c.105-.122.138-.208.208-.346.069-.138.034-.26-.017-.378-.052-.117-.534-1.285-.733-1.76-.193-.466-.39-.402-.534-.41-.138-.007-.297-.009-.455-.009-.158 0-.416.059-.633.296-.217.236-.83.811-.83 1.977 0 1.166.85 2.292.969 2.45.118.157 1.673 2.553 4.053 3.58.566.244 1.008.39 1.353.499.569.18 1.087.155 1.496.094.456-.068 1.4-.572 1.6-1.127.198-.555.198-1.03.139-1.127-.059-.098-.218-.156-.456-.274z" />
        </svg>
      </a>
    </footer>
  );
}

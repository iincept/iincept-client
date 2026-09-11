import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axiosClient from '../services/axiosClient';

const DEFAULT_FOOTER_DATA = {
  brandTitle: 'iiNCEPT',
  brandTagline: 'Official platform of Apple Authorised Distributors in India. Browse online, buy from trusted mono-brand resellers near you.',
  copyrightText: 'Copyright © 2026 iiNCEPT Electronics. All rights reserved. Powered by Ingram Micro & Redington.',
  columns: [
    {
      title: 'Shop',
      links: [
        { label: 'Mac', url: '/macbook' },
        { label: 'iPhone', url: '/iphone' },
        { label: 'iPad', url: '/ipad' },
        { label: 'Watch', url: '/watch' },
        { label: 'AirPods', url: '/airpods' },
        { label: 'TV & Home', url: '/tv-home' },
        { label: 'Accessories', url: '/accessories' },
        { label: 'AppleCare+', url: '/applecare' },
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
      console.warn('Using default iiNCEPT footer settings:', err);
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
            <Link to="/" style={{ display: 'inline-block', marginBottom: '18px' }}>
              <img 
                src="/iincept_footer_logo.png" 
                alt="iiNCEPT - The best experience for everything Apple" 
                style={{ height: '115px', width: 'auto', objectFit: 'contain' }} 
              />
            </Link>
            <p style={{
              fontSize: '13px',
              color: '#86868b',
              lineHeight: 1.55,
              maxWidth: '340px',
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
    </footer>
  );
}

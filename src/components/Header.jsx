import { useState, useEffect } from 'react';
import axiosClient from '../services/axiosClient';

export default function Header() {
  const [announcementBold, setAnnouncementBold] = useState('🔥 FREE SHIPPING');
  const [announcementNormal, setAnnouncementNormal] = useState('ON ORDERS ABOVE INR 1,499');
  const [announcement, setAnnouncement] = useState('🔥 FREE SHIPPING ON ORDERS ABOVE INR 1,499');

  useEffect(() => {
    fetchAnnouncement();
  }, []);

  const fetchAnnouncement = async () => {
    try {
      const response = await axiosClient.get('/settings');
      if (response.data) {
        if (response.data.announcementBold !== undefined) setAnnouncementBold(response.data.announcementBold);
        if (response.data.announcementNormal !== undefined) setAnnouncementNormal(response.data.announcementNormal);
        if (response.data.announcement !== undefined) setAnnouncement(response.data.announcement);
      }
    } catch (err) {
      console.error('Failed to load header settings:', err);
    }
  };

  return (
    <div className="bg-zinc-950 text-white text-[10px] sm:text-xs px-4 py-2.5 flex items-center justify-center tracking-widest shrink-0 uppercase border-b border-zinc-900 select-none">
      {announcementBold ? (
        <>
          <span className="font-extrabold text-white mr-1.5">{announcementBold}</span>
          <span className="font-medium text-zinc-300">{announcementNormal}</span>
        </>
      ) : (
        <span className="font-bold">{announcement}</span>
      )}
    </div>
  );
}

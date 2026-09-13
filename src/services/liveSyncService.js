/**
 * liveSyncService.js
 * 
 * Provides selective cache invalidation and cross-tab live synchronization
 * between Admin Panel and Storefront without full page reloads or touching user sessions.
 */

// Keys that MUST NEVER be invalidated by cache sync
const PROTECTED_KEYS = new Set(['token', 'user', 'cartItems', 'wishlistItems']);

/**
 * Selectively removes cached frontend data from localStorage
 * @param {'products' | 'settings' | 'categories' | 'all'} type 
 */
export const invalidateCache = (type = 'all') => {
  try {
    const keysToRemove = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (!key || PROTECTED_KEYS.has(key)) continue;

      if (type === 'products') {
        if (key.includes('sub_items') || key.includes('new_arrivals') || key.includes('product')) {
          keysToRemove.push(key);
        }
      } else if (type === 'categories') {
        if (key.includes('category') || key.includes('apple_categories') || key.includes('sub_items')) {
          keysToRemove.push(key);
        }
      } else {
        // 'settings' or 'all' -> invalidate all site content cache keys starting with 'iincept_'
        if (key.startsWith('iincept_')) {
          keysToRemove.push(key);
        }
      }
    }

    keysToRemove.forEach((k) => localStorage.removeItem(k));
  } catch (err) {
    console.error('[liveSyncService] Cache invalidation error:', err);
  }
};

/**
 * Called ONLY after a successful Admin Save/Update/Delete HTTP response.
 * Broadcasts sync signal to all open tabs and invalidates local tab cache.
 * 
 * @param {'products' | 'settings' | 'categories'} type 
 * @param {Object} details 
 */
export const notifyAdminChange = (type = 'settings', details = {}) => {
  // 1. Invalidate cache in current tab
  invalidateCache(type);

  const payload = {
    type,
    details,
    timestamp: Date.now()
  };

  // 2. Broadcast to other open browser tabs via BroadcastChannel API
  try {
    const channel = new BroadcastChannel('iincept_live_sync');
    channel.postMessage(payload);
    channel.close();
  } catch (err) {
    // Fallback for older browsers
    try {
      localStorage.setItem('iincept_sync_trigger', JSON.stringify(payload));
    } catch (e) {}
  }

  // 3. Dispatch CustomEvent for same-tab listeners
  window.dispatchEvent(new CustomEvent('iincept_data_sync', { detail: payload }));
};

/**
 * React hook / listener helper for storefront pages to subscribe to live sync events
 * 
 * @param {Function} callback Function called with payload when admin changes occur
 * @returns {Function} Unsubscribe function
 */
export const subscribeToLiveSync = (callback) => {
  const handlePayload = (payload) => {
    if (!payload || !payload.type) return;
    invalidateCache(payload.type);
    callback(payload);
  };

  let channel = null;
  try {
    channel = new BroadcastChannel('iincept_live_sync');
    channel.onmessage = (event) => handlePayload(event.data);
  } catch (err) {}

  const customEventListener = (e) => handlePayload(e.detail);
  window.addEventListener('iincept_data_sync', customEventListener);

  const storageListener = (e) => {
    if (e.key === 'iincept_sync_trigger' && e.newValue) {
      try {
        const payload = JSON.parse(e.newValue);
        handlePayload(payload);
      } catch (err) {}
    }
  };
  window.addEventListener('storage', storageListener);

  return () => {
    if (channel) channel.close();
    window.removeEventListener('iincept_data_sync', customEventListener);
    window.removeEventListener('storage', storageListener);
  };
};

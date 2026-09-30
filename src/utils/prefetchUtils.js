import { fetchProductById } from '../redux/productSlice';

const prefetchedSet = new Set();

/**
 * Prefetches product data on link hover to make navigation 0ms instant
 * @param {string} id - Product ID or Mongo ObjectId
 * @param {function} dispatch - Redux dispatch function
 */
export const prefetchProduct = (id, dispatch) => {
  if (!id || typeof id !== 'string') return;
  
  // Clean id if prefixed
  const cleanId = id.trim();
  if (!cleanId || prefetchedSet.has(cleanId)) return;

  prefetchedSet.add(cleanId);

  // If it's a valid 24-character Mongo ObjectId
  if (/^[0-9a-fA-F]{24}$/.test(cleanId)) {
    try {
      dispatch(fetchProductById(cleanId));
    } catch (e) {
      // Ignore prefetch errors silently
    }
  }
};

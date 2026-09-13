import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as wishlistApi from '../services/wishlistApi';

const transformWishlistItem = (p) => {
  return {
    id: p._id || p.id,
    name: p.title || p.name,
    price: p.price,
    image: (p.images && p.images[0]) || p.image || '/avatar.png',
    category: p.brand || '',
    rating: p.rating || 0
  };
};

const isAuthenticated = () => !!localStorage.getItem('token');

export const fetchWishlist = createAsyncThunk(
  'wishlist/fetchWishlist',
  async (_, thunkAPI) => {
    const localItems = localStorage.getItem('wishlistItems')
      ? JSON.parse(localStorage.getItem('wishlistItems'))
      : [];

    if (!isAuthenticated()) {
      return localItems;
    }

    try {
      const data = await wishlistApi.getWishlist();
      const transformed = (data.products || []).map(transformWishlistItem);

      const customItems = localItems.filter(x => x.isAppleCare || (x.id && String(x.id).startsWith('ac-')));
      const combined = [...transformed];
      for (const item of customItems) {
        if (!combined.some(c => (c.id || c._id) === (item.id || item._id))) {
          combined.push(item);
        }
      }

      localStorage.setItem('wishlistItems', JSON.stringify(combined));
      return combined;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const addToWishlist = createAsyncThunk(
  'wishlist/addToWishlist',
  async (item, thunkAPI) => {
    const state = thunkAPI.getState().wishlist;
    const currentItems = [...state.wishlistItems];

    const targetObj = typeof item === 'object' ? item : { id: item };
    const productId = targetObj.id || targetObj._id || targetObj.productId;

    if (!productId) {
      return thunkAPI.rejectWithValue("Product ID is required to add to wishlist.");
    }

    const isCustomItem = targetObj.isAppleCare || (productId && String(productId).startsWith('ac-')) || !/^[0-9a-fA-F]{24}$/.test(String(productId).split('-')[0]);

    if (!isAuthenticated() || isCustomItem) {
      const existIndex = currentItems.findIndex(x => (x.id || x._id) === productId);
      let updated;
      if (existIndex > -1) {
        updated = currentItems.filter(x => (x.id || x._id) !== productId);
      } else {
        const newItem = {
          id: productId,
          name: targetObj.name || targetObj.title || 'AppleCare+ Plan',
          title: targetObj.title || targetObj.name || 'AppleCare+ Plan',
          price: targetObj.price || 0,
          image: targetObj.image || '/applecare_official_hero.png',
          category: 'AppleCare',
          rating: 5.0,
          isAppleCare: true,
          sku: targetObj.sku || ''
        };
        updated = [...currentItems, newItem];
      }
      localStorage.setItem('wishlistItems', JSON.stringify(updated));
      return updated;
    }

    try {
      await wishlistApi.addToWishlist(productId);
      const data = await wishlistApi.getWishlist();
      const transformed = (data.products || []).map(transformWishlistItem);

      const customItems = currentItems.filter(x => x.isAppleCare || (x.id && String(x.id).startsWith('ac-')));
      const combined = [...transformed];
      for (const custom of customItems) {
        if (!combined.some(c => (c.id || c._id) === (custom.id || custom._id))) {
          combined.push(custom);
        }
      }

      localStorage.setItem('wishlistItems', JSON.stringify(combined));
      return combined;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const removeFromWishlist = createAsyncThunk(
  'wishlist/removeFromWishlist',
  async (id, thunkAPI) => {
    const state = thunkAPI.getState().wishlist;
    const isCustomItem = String(id).startsWith('ac-') || !/^[0-9a-fA-F]{24}$/.test(String(id).split('-')[0]);

    if (!isAuthenticated() || isCustomItem) {
      const updated = state.wishlistItems.filter(x => (x.id || x._id) !== id);
      localStorage.setItem('wishlistItems', JSON.stringify(updated));
      return updated;
    }

    try {
      await wishlistApi.removeFromWishlist(id);
      const data = await wishlistApi.getWishlist();
      const transformed = (data.products || []).map(transformWishlistItem);

      const customItems = state.wishlistItems.filter(x => x.isAppleCare || (x.id && String(x.id).startsWith('ac-')));
      const combined = [...transformed];
      for (const custom of customItems) {
        if (custom.id !== id && !combined.some(c => (c.id || c._id) === (custom.id || custom._id))) {
          combined.push(custom);
        }
      }

      localStorage.setItem('wishlistItems', JSON.stringify(combined));
      return combined;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

const initialWishlistItems = localStorage.getItem('wishlistItems')
  ? JSON.parse(localStorage.getItem('wishlistItems'))
  : [];

const initialState = {
  wishlistItems: initialWishlistItems,
  loading: false,
  error: null
};

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // fetchWishlist
      .addCase(fetchWishlist.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWishlist.fulfilled, (state, action) => {
        state.loading = false;
        state.wishlistItems = action.payload;
      })
      .addCase(fetchWishlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // addToWishlist
      .addCase(addToWishlist.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addToWishlist.fulfilled, (state, action) => {
        state.loading = false;
        state.wishlistItems = action.payload;
      })
      .addCase(addToWishlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // removeFromWishlist
      .addCase(removeFromWishlist.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeFromWishlist.fulfilled, (state, action) => {
        state.loading = false;
        state.wishlistItems = action.payload;
      })
      .addCase(removeFromWishlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export default wishlistSlice.reducer;

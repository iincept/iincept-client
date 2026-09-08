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

export const fetchWishlist = createAsyncThunk(
  'wishlist/fetchWishlist',
  async (_, thunkAPI) => {
    try {
      const data = await wishlistApi.getWishlist();
      const transformed = (data.products || []).map(transformWishlistItem);
      localStorage.setItem('wishlistItems', JSON.stringify(transformed));
      return transformed;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const addToWishlist = createAsyncThunk(
  'wishlist/addToWishlist',
  async (item, thunkAPI) => {
    try {
      const productId = item.id || item._id || item.productId;
      if (!productId) {
        throw new Error("Product ID is required to add to wishlist.");
      }
      await wishlistApi.addToWishlist(productId);
      const data = await wishlistApi.getWishlist();
      const transformed = (data.products || []).map(transformWishlistItem);
      localStorage.setItem('wishlistItems', JSON.stringify(transformed));
      return transformed;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const removeFromWishlist = createAsyncThunk(
  'wishlist/removeFromWishlist',
  async (id, thunkAPI) => {
    try {
      await wishlistApi.removeFromWishlist(id);
      const data = await wishlistApi.getWishlist();
      const transformed = (data.products || []).map(transformWishlistItem);
      localStorage.setItem('wishlistItems', JSON.stringify(transformed));
      return transformed;
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

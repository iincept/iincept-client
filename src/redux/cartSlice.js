import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as cartApi from '../services/cartApi';

// Helper to check authentication status
const isAuthenticated = () => !!localStorage.getItem('token');

// Helper to format backend database cart items for client consumption
const transformCartItem = (dbItem) => {
  const p = dbItem.product || {};
  return {
    id: p._id || dbItem._id, // Map product ID to UI item.id
    name: p.title || p.name,
    price: p.price,
    image: (p.images && p.images[0]) || p.image || '/avatar.png',
    quantity: dbItem.quantity,
    stock: p.stock || 10,
    color: dbItem.color || '',
    size: dbItem.size || '',
  };
};

export const fetchCart = createAsyncThunk(
  'cart/fetchCart',
  async (_, thunkAPI) => {
    if (!isAuthenticated()) {
      const guestItems = localStorage.getItem('cartItems')
        ? JSON.parse(localStorage.getItem('cartItems'))
        : [];
      return guestItems;
    }
    try {
      const serverItems = await cartApi.getCart();
      const transformed = serverItems.map(transformCartItem);
      localStorage.setItem('cartItems', JSON.stringify(transformed));
      return transformed;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const addToCart = createAsyncThunk(
  'cart/addToCart',
  async (item, thunkAPI) => {
    const state = thunkAPI.getState().cart;

    if (!isAuthenticated()) {
      const updatedItems = [...state.cartItems];
      const existItem = updatedItems.find(x => x.id === item.id);
      if (existItem) {
        updatedItems.push({ ...item, quantity: item.quantity || 1 });
        // Since Redux state shouldn't be directly updated in thunk, we map:
        const mapped = updatedItems.map(x =>
          x.id === existItem.id
            ? { ...x, quantity: x.quantity + (item.quantity || 1) }
            : x
        );
        localStorage.setItem('cartItems', JSON.stringify(mapped));
        return { cartItems: mapped, openCart: true };
      } else {
        updatedItems.push({ ...item, quantity: item.quantity || 1 });
        localStorage.setItem('cartItems', JSON.stringify(updatedItems));
        return { cartItems: updatedItems, openCart: true };
      }
    }

    try {
      const productId = item.productId || (item.id && item.id.split('-')[0]) || item.id;
      const quantity = item.quantity || 1;

      await cartApi.addToCart(productId, quantity);
      const serverItems = await cartApi.getCart();
      const transformed = serverItems.map(transformCartItem);
      localStorage.setItem('cartItems', JSON.stringify(transformed));
      return { cartItems: transformed, openCart: true };
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const removeFromCart = createAsyncThunk(
  'cart/removeFromCart',
  async (id, thunkAPI) => {
    const state = thunkAPI.getState().cart;

    if (!isAuthenticated()) {
      const updatedItems = state.cartItems.filter(x => x.id !== id);
      localStorage.setItem('cartItems', JSON.stringify(updatedItems));
      return updatedItems;
    }

    try {
      const productId = id.split('-')[0];
      await cartApi.removeFromCart(productId);
      const serverItems = await cartApi.getCart();
      const transformed = serverItems.map(transformCartItem);
      localStorage.setItem('cartItems', JSON.stringify(transformed));
      return transformed;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const updateQuantity = createAsyncThunk(
  'cart/updateQuantity',
  async ({ id, quantity }, thunkAPI) => {
    const state = thunkAPI.getState().cart;
    const targetQty = Math.max(1, quantity);

    if (!isAuthenticated()) {
      const updatedItems = state.cartItems.map(x =>
        x.id === id ? { ...x, quantity: targetQty } : x
      );
      localStorage.setItem('cartItems', JSON.stringify(updatedItems));
      return updatedItems;
    }

    try {
      const productId = id.split('-')[0];
      await cartApi.updateCartQuantity(productId, targetQty);
      const serverItems = await cartApi.getCart();
      const transformed = serverItems.map(transformCartItem);
      localStorage.setItem('cartItems', JSON.stringify(transformed));
      return transformed;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const clearCart = createAsyncThunk(
  'cart/clearCart',
  async (_, thunkAPI) => {
    if (!isAuthenticated()) {
      localStorage.removeItem('cartItems');
      return [];
    }

    try {
      await cartApi.clearCart();
      localStorage.removeItem('cartItems');
      return [];
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const mergeGuestCart = createAsyncThunk(
  'cart/mergeGuestCart',
  async (guestItems, thunkAPI) => {
    try {
      const serverItems = await cartApi.mergeCart(guestItems);
      const transformed = serverItems.map(transformCartItem);
      localStorage.setItem('cartItems', JSON.stringify(transformed));
      return transformed;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

const initialCartItems = localStorage.getItem('cartItems')
  ? JSON.parse(localStorage.getItem('cartItems'))
  : [];

const initialState = {
  cartItems: initialCartItems,
  isCartOpen: false,
  loading: false,
  error: null
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    openCart: (state) => {
      state.isCartOpen = true;
    },
    closeCart: (state) => {
      state.isCartOpen = false;
    }
  },
  extraReducers: (builder) => {
    builder
      // fetchCart
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false;
        state.cartItems = action.payload;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // addToCart
      .addCase(addToCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.loading = false;
        state.cartItems = action.payload.cartItems;
        if (action.payload.openCart) {
          state.isCartOpen = true;
        }
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // removeFromCart
      .addCase(removeFromCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.loading = false;
        state.cartItems = action.payload;
      })
      .addCase(removeFromCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // updateQuantity
      .addCase(updateQuantity.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateQuantity.fulfilled, (state, action) => {
        state.loading = false;
        state.cartItems = action.payload;
      })
      .addCase(updateQuantity.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // clearCart
      .addCase(clearCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(clearCart.fulfilled, (state, action) => {
        state.loading = false;
        state.cartItems = action.payload;
      })
      .addCase(clearCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // mergeGuestCart
      .addCase(mergeGuestCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(mergeGuestCart.fulfilled, (state, action) => {
        state.loading = false;
        state.cartItems = action.payload;
      })
      .addCase(mergeGuestCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { openCart, closeCart } = cartSlice.actions;
export default cartSlice.reducer;

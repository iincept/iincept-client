import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosClient from '../services/axiosClient';
import * as orderApi from '../services/orderApi';

const transformOrder = (dbOrder) => {
  return {
    id: dbOrder._id,
    createdAt: new Date(dbOrder.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
    totalAmount: dbOrder.totalAmount,
    paymentMethod: dbOrder.paymentMethod,
    paymentStatus: dbOrder.paymentStatus,
    orderStatus: dbOrder.orderStatus,
    items: (dbOrder.orderItems || []).map(item => {
      const p = item.product || {};
      return {
        name: p.title || p.name || 'Product',
        price: item.price || p.price || 0,
        quantity: item.quantity
      };
    })
  };
};

// Async thunk to fetch user's real orders
export const fetchOrders = createAsyncThunk(
  'orders/fetchOrders',
  async (_, thunkAPI) => {
    try {
      const serverOrders = await orderApi.getOrders();
      const transformed = serverOrders.map(transformOrder);
      localStorage.setItem('orders', JSON.stringify(transformed));
      return transformed;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || err.message || 'Failed to fetch orders');
    }
  }
);

// Async thunk to create address and place order in the backend database
export const placeNewOrder = createAsyncThunk(
  'orders/placeNewOrder',
  async ({ shippingAddressId, shippingAddressData, paymentMethod, couponCode, cartItems, totalAmount }, thunkAPI) => {
    try {
      const state = thunkAPI.getState();
      const token = state.auth.token;

      if (!token) {
        throw new Error('Not authenticated');
      }

      let addressId = shippingAddressId;

      // 1. Create shipping address record in database if not using existing address ID
      if (!addressId) {
        const addressResponse = await axiosClient.post('/address', shippingAddressData);
        const addressData = addressResponse.data;
        addressId = addressData._id;
      }

      // 2. Place order passing the address ID
      const orderData = await orderApi.createOrder({
        shippingAddress: addressId,
        paymentMethod,
        couponCode
      });

      return transformOrder(orderData);
    } catch (err) {
      const message = err.response?.data?.message || err.message || 'Failed to place order';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Async thunk to cancel order in backend with local fallback
export const cancelOrder = createAsyncThunk(
  'orders/cancelOrder',
  async (orderId, thunkAPI) => {
    try {
      const state = thunkAPI.getState();
      const token = state.auth.token;
      // Check if it's a 24-character hexadecimal MongoDB ID
      const isMongoId = /^[0-9a-fA-F]{24}$/.test(orderId);
      if (token && isMongoId) {
        await orderApi.cancelOrder(orderId);
      }
      return orderId;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || err.message || 'Failed to cancel order');
    }
  }
);

const initialOrders = localStorage.getItem('orders')
  ? JSON.parse(localStorage.getItem('orders'))
  : [];

const initialState = {
  orders: initialOrders,
  activeOrder: null,
  loading: false,
  error: null
};

const orderSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    setOrders: (state, action) => {
      state.orders = action.payload;
      localStorage.setItem('orders', JSON.stringify(state.orders));
    },
    setActiveOrder: (state, action) => {
      state.activeOrder = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      // fetchOrders
      .addCase(fetchOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // placeNewOrder
      .addCase(placeNewOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(placeNewOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.orders.unshift(action.payload);
        state.activeOrder = action.payload;
        localStorage.setItem('orders', JSON.stringify(state.orders));
      })
      .addCase(placeNewOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // cancelOrder
      .addCase(cancelOrder.fulfilled, (state, action) => {
        const orderId = action.payload;
        state.orders = state.orders.map(order =>
          order.id === orderId ? { ...order, orderStatus: 'Cancelled' } : order
        );
        localStorage.setItem('orders', JSON.stringify(state.orders));
      });
  }
});

export const { setOrders, setActiveOrder } = orderSlice.actions;
export default orderSlice.reducer;

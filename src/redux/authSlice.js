import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as authApi from '../services/authApi';

// Async Thunk to handle Login POST request
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async ({ email, password }, thunkAPI) => {
    try {
      const data = await authApi.login(email, password);
      return data; // returns user object with token
    } catch (err) {
      const message = err.response?.data?.message || err.message || 'Login failed';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Async Thunk to handle Register POST request
export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async ({ name, email, password, gender, dateOfBirth, isStudentOrTeacher }, thunkAPI) => {
    try {
      const data = await authApi.register(name, email, password, gender, dateOfBirth, isStudentOrTeacher);
      return data; // returns user object with token
    } catch (err) {
      const message = err.response?.data?.message || err.message || 'Registration failed';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Retrieve initial session from local storage
const initialUser = localStorage.getItem('user') 
  ? JSON.parse(localStorage.getItem('user')) 
  : null;
const initialToken = localStorage.getItem('token') || null;

const initialState = {
  user: initialUser,
  token: initialToken,
  isAuthenticated: !!initialToken,
  loading: false,
  error: null
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.error = null;
      
      // Clear browser storage
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    },
    clearAuthError: (state) => {
      state.error = null;
    },
    updateUser: (state, action) => {
      state.user = {
        ...state.user,
        ...action.payload
      };
      localStorage.setItem('user', JSON.stringify(state.user));
    }
  },
  extraReducers: (builder) => {
    builder
      // Login flow
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = {
          _id: action.payload._id,
          name: action.payload.name,
          email: action.payload.email,
          role: action.payload.role
        };
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.error = null;
        
        // Sync to browser storage
        localStorage.setItem('token', action.payload.token);
        localStorage.setItem('user', JSON.stringify(state.user));
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        
        // Clear browser storage
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      })
      
      // Register flow
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = {
          _id: action.payload._id,
          name: action.payload.name,
          email: action.payload.email,
          role: action.payload.role,
          gender: action.payload.gender,
          dateOfBirth: action.payload.dateOfBirth,
          isStudentOrTeacher: action.payload.isStudentOrTeacher
        };
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.error = null;
        
        // Sync to browser storage
        localStorage.setItem('token', action.payload.token);
        localStorage.setItem('user', JSON.stringify(state.user));
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        
        // Clear browser storage
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      });
  }
});

export const { logout, clearAuthError, updateUser } = authSlice.actions;
export default authSlice.reducer;

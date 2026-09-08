import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ShieldAlert } from 'lucide-react';
import { loginUser, clearAuthError } from '../redux/authSlice';
import { mergeGuestCart } from '../redux/cartSlice';
import { fetchWishlist } from '../redux/wishlistSlice';
import Loader from '../components/Loader';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [localError, setLocalError] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { loading, error } = useSelector((state) => state.auth);

  // Default redirect path or home
  const from = location.state?.from?.pathname || '/';

  // Clear previous errors when the login page mounts or unmounts
  useEffect(() => {
    dispatch(clearAuthError());
    return () => {
      dispatch(clearAuthError());
    };
  }, [dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLocalError('');

    if (!email || !password) {
      setLocalError('Please fill in all details.');
      return;
    }

    dispatch(loginUser({ email, password }))
      .unwrap()
      .then((user) => {
        // Merge guest cart if items exist in localStorage
        const guestCartData = localStorage.getItem('cartItems');
        const guestItems = guestCartData ? JSON.parse(guestCartData) : [];
        if (guestItems.length > 0) {
          dispatch(mergeGuestCart(guestItems));
        }
        // Fetch server wishlist to sync count
        dispatch(fetchWishlist());

        alert(`Welcome back, ${user.name}!`);
        navigate(from, { replace: true });
      })
      .catch(() => {
        // Redux slice updates the state error automatically
      });
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center py-10 px-4 animate-in fade-in duration-300 font-sans">

      {/* Show full screen loader during active request */}
      {loading && <Loader message="Authenticating..." />}

      <div className="w-full max-w-[460px] bg-white border border-zinc-200 rounded-[2.5rem] p-8 sm:p-10 shadow-2xl relative flex flex-col items-center">

        {/* Close Button */}
        <button
          onClick={() => navigate('/')}
          className="absolute top-5 right-5 text-zinc-300 hover:text-zinc-500 transition-colors bg-transparent border-0 cursor-pointer p-1 rounded-full focus:outline-none"
          aria-label="Close"
        >
          <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </button>

        {/* Heading */}
        <div className="text-center mt-2 space-y-1">
          <h2 className="text-3xl font-extrabold text-zinc-900 tracking-tight">Customer Sign Up</h2>
          <p className="text-xs sm:text-sm text-zinc-500 font-medium">Sign in to your iincept account to view pricing, reorder, and track deliveries</p>
        </div>

        {/* Avatar */}
        <div className="my-6">
          <img
            src="/avatar.png"
            alt="Customer Avatar"
            className="w-28 h-28 rounded-full object-cover shadow-sm border border-zinc-100"
          />
        </div>

        {/* Error notification banner */}
        {(localError || error) && (
          <div className="w-full mb-4 p-3 bg-red-50 border border-red-100 text-red-700 rounded-2xl flex items-center gap-2 text-xs text-left animate-in shake duration-300">
            <ShieldAlert className="h-4.5 w-4.5 shrink-0 text-red-500" />
            <span className="font-semibold">{localError || error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="w-full space-y-5 text-left">
          {/* Email input */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-extrabold text-zinc-955 text-zinc-900 tracking-wider uppercase block">Email ID</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Please enter your Email"
              className="w-full bg-zinc-50 border border-transparent text-sm rounded-2xl py-3.5 px-4 text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:bg-zinc-50 focus:border-zinc-200 transition-all font-medium"
              required
            />
          </div>

          {/* Password input */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-extrabold text-zinc-955 text-zinc-900 tracking-wider uppercase block">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Please enter your password"
              className="w-full bg-zinc-50 border border-transparent text-sm rounded-2xl py-3.5 px-4 text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:bg-zinc-50 focus:border-zinc-200 transition-all font-medium"
              required
            />
          </div>

          {/* Remember Me & Forgot Password */}
          <div className="flex justify-between items-center pt-1 text-xs sm:text-sm">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                id="remember"
                className="h-4.5 w-4.5 rounded border-zinc-300 text-zinc-900 focus:ring-zinc-900 accent-zinc-900 cursor-pointer"
              />
              <span className="text-xs sm:text-sm text-zinc-500 font-semibold">Remember me</span>
            </label>
            <button
              type="button"
              onClick={() => navigate('/forgot-password')}
              className="text-[11px] text-zinc-500 font-bold hover:text-zinc-800 tracking-wider transition-colors cursor-pointer bg-transparent border-0 uppercase"
            >
              Forgot Password?
            </button>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-zinc-900 hover:bg-zinc-850 text-white font-bold py-3.5 px-6 rounded-2xl flex items-center justify-center gap-2 transition-all duration-250 cursor-pointer disabled:opacity-50 shadow-lg shadow-zinc-900/10"
          >
            <span className="text-sm font-semibold">Login</span>
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 9l3 3m0 0l-3 3m3-3H8m13 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </button>
        </form>

        {/* Create New Account */}
        <Link
          to="/signup"
          className="w-full flex items-center justify-center gap-1.5 transition-colors cursor-pointer mt-5 text-[15px]"
        >
          <span className="text-zinc-500 font-medium">New to iincept?</span>
          <span className="text-zinc-900 font-bold">Create an account</span>
          <svg className="w-5 h-5 text-zinc-900" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 9l3 3m0 0l-3 3m3-3H8m13 0a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </Link>



      </div>
    </div>
  );
}

import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { KeyRound, ArrowRight, ShieldAlert, CheckCircle, Ticket } from 'lucide-react';
import axiosClient from '../services/axiosClient';

export default function ResetPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const tokenQuery = searchParams.get('token') || '';

  const [token, setToken] = useState(tokenQuery);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Sync token from URL query params
  useEffect(() => {
    if (tokenQuery) {
      setToken(tokenQuery);
    }
  }, [tokenQuery]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!token || !password || !confirmPassword) {
      setError('Please fill in all inputs.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      await axiosClient.post('/auth/reset-password', {
        token: token.trim(),
        password
      });
      setSuccess(true);
      alert('Password reset successful! Redirecting to login page...');
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reset password. Token might be invalid or expired.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[60vh] bg-white flex items-center justify-center py-10 px-4 animate-in fade-in duration-300 font-sans">
      <div className="w-full max-w-[460px] bg-white border border-zinc-200 rounded-[2.5rem] p-8 sm:p-10 shadow-2xl relative flex flex-col items-center">
        
        {/* Heading */}
        <div className="text-center mt-2 space-y-1">
          <h2 className="text-3xl font-extrabold text-zinc-900 tracking-tight">Set New Password</h2>
          <p className="text-xs sm:text-sm text-zinc-500 font-medium">Define your new password credentials below</p>
        </div>

        {/* Notifications */}
        {error && (
          <div className="w-full mt-6 p-3.5 bg-red-50 border border-red-100 text-red-700 rounded-2xl flex items-center gap-2 text-xs text-left animate-in shake duration-300">
            <ShieldAlert className="h-4.5 w-4.5 shrink-0 text-red-500" />
            <span className="font-semibold">{error}</span>
          </div>
        )}

        {success && (
          <div className="w-full mt-6 p-4 bg-emerald-50 border border-emerald-100 text-emerald-850 rounded-2xl flex items-center gap-2 text-xs text-left animate-in slide-in-from-top duration-300">
            <CheckCircle className="h-4.5 w-4.5 shrink-0 text-emerald-600" />
            <span className="font-semibold">Password reset successfully! Redirecting to sign in screen...</span>
          </div>
        )}

        {/* Reset Form */}
        {!success && (
          <form onSubmit={handleSubmit} className="w-full space-y-5 text-left mt-6">
            
            {/* Reset Token Input */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-extrabold text-zinc-900 tracking-wider uppercase block">Reset Token</label>
              <div className="relative">
                <input
                  type="text"
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  placeholder="Paste your reset token here"
                  className="w-full bg-zinc-50 border border-zinc-200 text-sm rounded-2xl pl-10 pr-4 py-3.5 text-zinc-900 focus:outline-none focus:border-zinc-500 focus:bg-white transition-all font-mono"
                  disabled={loading}
                />
                <Ticket className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-zinc-400" />
              </div>
            </div>

            {/* New Password */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-extrabold text-zinc-900 tracking-wider uppercase block">New Password</label>
              <div className="relative">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min 6 characters"
                  className="w-full bg-zinc-50 border border-zinc-200 text-sm rounded-2xl pl-10 pr-4 py-3.5 text-zinc-900 focus:outline-none focus:border-zinc-500 focus:bg-white transition-all font-semibold"
                  disabled={loading}
                />
                <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-zinc-400" />
              </div>
            </div>

            {/* Confirm Password */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-extrabold text-zinc-900 tracking-wider uppercase block">Confirm Password</label>
              <div className="relative">
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter password"
                  className="w-full bg-zinc-50 border border-zinc-200 text-sm rounded-2xl pl-10 pr-4 py-3.5 text-zinc-900 focus:outline-none focus:border-zinc-500 focus:bg-white transition-all font-semibold"
                  disabled={loading}
                />
                <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-zinc-400" />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-black hover:bg-zinc-900 text-white font-bold py-3.5 rounded-2xl flex items-center justify-center gap-2 transition-all cursor-pointer text-xs shadow-md mt-6 disabled:opacity-50"
            >
              {loading ? 'Processing...' : 'Reset Password'}
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>
        )}

        <div className="mt-8 text-center">
          <p className="text-xs text-zinc-500">
            Back to{' '}
            <Link to="/login" className="text-zinc-955 font-bold hover:underline">
              Sign In
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
}

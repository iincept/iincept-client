import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, ArrowRight, ShieldAlert, CheckCircle } from 'lucide-react';
import axiosClient from '../services/axiosClient';

export default function ForgotPassword() {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [testToken, setTestToken] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    setTestToken('');

    if (!email) {
      setError('Please input your email address.');
      return;
    }

    setLoading(true);
    try {
      const response = await axiosClient.post('/auth/forgot-password', { email });
      setSuccessMsg(response.data.message || 'Reset link generated successfully!');
      // Grab token from response if available (local simulation mode)
      if (response.data.token) {
        setTestToken(response.data.token);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to request reset link.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[60vh] bg-white flex items-center justify-center py-10 px-4 animate-in fade-in duration-300 font-sans">
      <div className="w-full max-w-[460px] bg-white border border-zinc-200 rounded-[2.5rem] p-8 sm:p-10 shadow-2xl relative flex flex-col items-center">
        
        {/* Close Button */}
        <button
          onClick={() => navigate('/login')}
          className="absolute top-5 right-5 text-zinc-300 hover:text-zinc-500 transition-colors bg-transparent border-0 cursor-pointer p-1 rounded-full focus:outline-none"
          aria-label="Back to login"
        >
          <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </button>

        {/* Heading */}
        <div className="text-center mt-2 space-y-1">
          <h2 className="text-3xl font-extrabold text-zinc-900 tracking-tight">Reset Password</h2>
          <p className="text-xs sm:text-sm text-zinc-500 font-medium">Input your registered email ID to request a password reset token</p>
        </div>

        {/* Notifications */}
        {error && (
          <div className="w-full mt-6 p-3.5 bg-red-50 border border-red-100 text-red-700 rounded-2xl flex items-center gap-2 text-xs text-left animate-in shake duration-300">
            <ShieldAlert className="h-4.5 w-4.5 shrink-0 text-red-500" />
            <span className="font-semibold">{error}</span>
          </div>
        )}

        {successMsg && (
          <div className="w-full mt-6 p-4 bg-emerald-50 border border-emerald-100 text-emerald-800 rounded-2xl flex flex-col gap-2 text-xs text-left animate-in slide-in-from-top duration-300">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4.5 w-4.5 shrink-0 text-emerald-600" />
              <span className="font-bold">{successMsg}</span>
            </div>
            {testToken && (
              <div className="mt-2 p-3 bg-white border border-emerald-200 rounded-xl space-y-2">
                <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider">Simulated Reset Token</p>
                <code className="text-sm font-mono font-bold select-all bg-zinc-50 px-2 py-1 rounded border border-zinc-150 block text-center break-all">{testToken}</code>
                <p className="text-[9px] text-zinc-400">Copy this token and use it on the Reset Password page.</p>
                <Link
                  to={`/reset-password?token=${testToken}`}
                  className="mt-2 w-full inline-flex items-center justify-center gap-1.5 bg-zinc-900 text-white hover:bg-black font-bold py-2 rounded-xl text-[10px] transition-colors"
                >
                  Proceed to Reset Form
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            )}
          </div>
        )}

        {/* Request Form */}
        {!testToken && (
          <form onSubmit={handleSubmit} className="w-full space-y-5 text-left mt-6">
            <div className="space-y-1.5">
              <label className="text-[11px] font-extrabold text-zinc-900 tracking-wider uppercase block">Email ID</label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full bg-zinc-50 border border-zinc-200 text-sm rounded-2xl pl-10 pr-4 py-3.5 text-zinc-900 focus:outline-none focus:border-zinc-500 focus:bg-white transition-all font-semibold"
                  disabled={loading}
                />
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-zinc-400" />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-black hover:bg-zinc-900 text-white font-bold py-3.5 rounded-2xl flex items-center justify-center gap-2 transition-all cursor-pointer text-xs shadow-md mt-6 disabled:opacity-50"
            >
              {loading ? 'Requesting...' : 'Generate Reset Token'}
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>
        )}

        <div className="mt-8 text-center">
          <p className="text-xs text-zinc-500">
            Remembered your credentials?{' '}
            <Link to="/login" className="text-zinc-950 font-bold hover:underline">
              Sign In
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
}

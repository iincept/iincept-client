import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ShieldAlert } from 'lucide-react';
import { registerUser, clearAuthError } from '../redux/authSlice';
import Loader from '../components/Loader';

export default function Signup() {
  const [signUpType, setSignUpType] = useState('b2b'); // 'b2b' or 'individual'
  const [name, setName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [gstin, setGstin] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [localError, setLocalError] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, error } = useSelector((state) => state.auth);

  // Clear previous errors when the register page mounts or unmounts
  useEffect(() => {
    dispatch(clearAuthError());
    return () => {
      dispatch(clearAuthError());
    };
  }, [dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLocalError('');

    if (signUpType === 'b2b') {
      if (!name || !email || !password || !companyName || !phone) {
        setLocalError('Please fill in all details.');
        return;
      }
    } else {
      if (!name || !email || !password || !phone) {
        setLocalError('Please fill in all details.');
        return;
      }
    }

    if (password.length < 8) {
      setLocalError('Password must be at least 8 characters long.');
      return;
    }

    dispatch(registerUser({
      name,
      email,
      password,
      gender: 'not_specified',
      dateOfBirth: 'not_specified',
      isStudentOrTeacher: false,
      companyName: signUpType === 'b2b' ? companyName : '',
      gstin: signUpType === 'b2b' ? gstin : '',
      phone
    }))
      .unwrap()
      .then((user) => {
        alert(`Account created successfully! Welcome, ${user.name}!`);
        navigate('/'); // Redirect to homepage
      })
      .catch(() => {
        // Redux slice updates the state error automatically
      });
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center py-10 px-4 animate-in fade-in duration-300 font-sans">

      {/* Show full screen loader during active request */}
      {loading && <Loader message="Creating your profile..." />}

      <div className="w-full max-w-[460px] bg-white border border-zinc-200 rounded-[2.5rem] p-8 sm:p-10 shadow-2xl relative flex flex-col items-center">

        {/* Back Button */}
        <button
          onClick={() => navigate('/login')}
          className="absolute top-5 left-5 text-zinc-350 hover:text-zinc-500 transition-colors bg-transparent border-0 cursor-pointer p-1 rounded-full focus:outline-none"
          aria-label="Back"
        >
          <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M11 15l-3-3m0 0l3-3m-3 3h8M3 12a9 9 0 11-18 0 9 9 0 01-18 0z" />
          </svg>
        </button>

        {/* Close Button */}
        <button
          onClick={() => navigate('/')}
          className="absolute top-5 right-5 text-zinc-350 hover:text-zinc-500 transition-colors bg-transparent border-0 cursor-pointer p-1 rounded-full focus:outline-none"
          aria-label="Close"
        >
          <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </button>

        {/* Heading */}
        <div className="text-center mt-2 space-y-1 mb-6">
          <h2 className="text-3xl font-extrabold text-zinc-900 tracking-tight">Create your account</h2>
          <p className="text-xs sm:text-sm text-zinc-500 font-medium">Business accounts get bulk pricing, GST invoicing and a dedicated account desk by default</p>
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

        {/* Signup Form */}
        <form onSubmit={handleSubmit} className="w-full space-y-5 text-left">

          <span className="acctype-label text-zinc-400 text-xs font-bold uppercase tracking-wider block">I'm signing up as</span>
          <div className="acctype flex gap-3 mb-4" id="acctype">
            <div
              onClick={() => setSignUpType('b2b')}
              className={`acctype-opt flex-1 border-2 rounded-2xl p-4 cursor-pointer transition-all relative ${signUpType === 'b2b' ? 'border-[#0071E3] bg-blue-50/10' : 'border-zinc-200'
                }`}
              data-type="b2b"
            >
              <span className="acctype-badge absolute -top-3 left-4 bg-zinc-900 text-white text-[9px] font-bold py-0.5 px-1.5 rounded uppercase">Most common</span>
              <div className="t font-bold text-zinc-900 text-sm mt-1">🏢 Business / B2B Partner</div>
              <div className="s text-[11px] text-zinc-500 mt-0.5">Bulk orders, GST invoicing, volume pricing</div>
            </div>

            <div
              onClick={() => setSignUpType('individual')}
              className={`acctype-opt flex-1 border-2 rounded-2xl p-4 cursor-pointer transition-all flex flex-col justify-center ${signUpType === 'individual' ? 'border-[#0071E3] bg-blue-50/10' : 'border-zinc-200'
                }`}
              data-type="individual"
            >
              <div className="t font-bold text-zinc-900 text-sm">🙋 Individual</div>
              <div className="s text-[11px] text-zinc-500 mt-0.5">Buying for personal use</div>
            </div>
          </div>

          <div className="field space-y-1.5">
            <label className="text-sm font-semibold text-zinc-900 block" id="nameLabel">
              {signUpType === 'b2b' ? 'Contact person — full name' : 'Full name'}
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Aditi Sharma"
              className="w-full bg-zinc-50 border border-transparent text-sm rounded-2xl py-3.5 px-4 text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:bg-zinc-50 focus:border-zinc-200 transition-all font-medium"
              required
            />
          </div>

          {signUpType === 'b2b' && (
            <div className="b2b-fields space-y-4" id="b2bFields">
              <div className="field space-y-1.5">
                <label className="text-sm font-semibold text-zinc-900 block">Company name</label>
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="e.g. Sharma Textiles Pvt. Ltd."
                  className="w-full bg-zinc-50 border border-transparent text-sm rounded-2xl py-3.5 px-4 text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:bg-zinc-50 focus:border-zinc-200 transition-all font-medium"
                  required
                />
              </div>
              <div className="field space-y-1.5">
                <label className="text-sm font-semibold text-zinc-900 block">
                  GSTIN <span style={{ color: 'var(--muted)', fontWeight: 400 }}>(optional — add later if not on hand)</span>
                </label>
                <input
                  type="text"
                  value={gstin}
                  onChange={(e) => setGstin(e.target.value)}
                  placeholder="22AAAAA0000A1Z5"
                  className="w-full bg-zinc-50 border border-transparent text-sm rounded-2xl py-3.5 px-4 text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:bg-zinc-50 focus:border-zinc-200 transition-all font-medium"
                />
              </div>
            </div>
          )}

          <div className="field-row grid grid-cols-2 gap-4">
            <div className="field space-y-1.5">
              <label className="text-sm font-semibold text-zinc-900 block">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                className="w-full bg-zinc-50 border border-transparent text-sm rounded-2xl py-3.5 px-4 text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:bg-zinc-50 focus:border-zinc-200 transition-all font-medium"
                required
              />
            </div>
            <div className="field space-y-1.5">
              <label className="text-sm font-semibold text-zinc-900 block">Phone number</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98765 43210"
                className="w-full bg-zinc-50 border border-transparent text-sm rounded-2xl py-3.5 px-4 text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:bg-zinc-50 focus:border-zinc-200 transition-all font-medium"
                required
              />
            </div>
          </div>

          <div className="field space-y-1.5">
            <label className="text-sm font-semibold text-zinc-900 block">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 8 characters"
              className="w-full bg-zinc-50 border border-transparent text-sm rounded-2xl py-3.5 px-4 text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:bg-zinc-50 focus:border-zinc-200 transition-all font-medium"
              required
            />
          </div>

          {signUpType === 'b2b' && (
            <div className="b2b-note bg-zinc-50 border border-zinc-100 rounded-xl p-4 flex gap-3 text-[13px] text-zinc-500 leading-relaxed" id="b2bNote">
              <span className="dot w-2 h-2 bg-[#0071E3] rounded-full mt-1.5 shrink-0"></span>
              <span>Business accounts are verified within 24 hours. You can start browsing and requesting quotes immediately — bulk pricing unlocks once verified.</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-zinc-900 hover:bg-zinc-850 text-white font-bold py-3.5 px-6 rounded-2xl flex items-center justify-center gap-2 transition-all duration-250 cursor-pointer disabled:opacity-50 shadow-lg shadow-zinc-900/10"
            id="submitBtn"
          >
            {signUpType === 'b2b' ? 'Create Business Account →' : 'Create Account →'}
          </button>

          <p className="altaction text-center text-sm text-zinc-500 mt-4">
            Already have an account? <Link to="/login" className="text-[#0071E3] font-semibold hover:underline">Sign in</Link>
          </p>
        </form>

      </div>
    </div>
  );
}

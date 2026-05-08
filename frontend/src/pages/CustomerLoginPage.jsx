
// import { useState } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { Phone, Hash, ArrowRight, RotateCcw, Loader2 } from 'lucide-react';
// import toast from 'react-hot-toast';
// import { useAuth } from '../hooks/useAuth';
// import Input from '../components/common/Input';
// import Button from '../components/common/Button';

// const STEPS = { PHONE: 'phone', NAME: 'name', OTP: 'otp' };

// const CustomerLoginPage = () => {
//   const { sendOtp, verifyOtp } = useAuth();
//   const navigate = useNavigate();

//   const [step, setStep] = useState(STEPS.PHONE);
//   const [phone, setPhone] = useState('');
//   const [name, setName] = useState('');
//   const [otp, setOtp] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [resendTimer, setResendTimer] = useState(0);
//   const [error, setError] = useState('');

//   // Countdown timer for resend button
//   const startResendTimer = () => {
//     setResendTimer(60);
//     const interval = setInterval(() => {
//       setResendTimer((t) => {
//         if (t <= 1) { clearInterval(interval); return 0; }
//         return t - 1;
//       });
//     }, 1000);
//   };

//   const handleSendOtp = async (e) => {
//     e?.preventDefault();
//     setError('');

//     if (!/^[6-9]\d{9}$/.test(phone)) {
//       setError('Enter a valid 10-digit mobile number');
//       return;
//     }
//     if (step === STEPS.NAME && !name.trim()) {
//       setError('Please enter your name');
//       return;
//     }

//     setLoading(true);
//     try {
//       await sendOtp(phone, name || undefined);
//       toast.success(`OTP sent to +91 ${phone}`, {
//         icon: '📱',
//         duration: 4000,
//       });
//       setStep(STEPS.OTP);
//       startResendTimer();
//     } catch (err) {
//       const res = err.response?.data;
//       if (res?.isNewUser) {
//         // New user — need name
//         setStep(STEPS.NAME);
//       } else if (err.response?.status === 429) {
//         setError(res?.message || 'Too many requests. Wait a moment.');
//       } else {
//         setError(res?.message || 'Failed to send OTP. Please try again.');
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleVerifyOtp = async (e) => {
//     e.preventDefault();
//     setError('');
//     if (otp.length !== 6) {
//       setError('Enter the 6-digit OTP sent to your phone');
//       return;
//     }
//     setLoading(true);
//     try {
//       await verifyOtp(phone, otp);
//       toast.success('Welcome to CleanPress! 🎉');
//       navigate('/my-orders');
//     } catch (err) {
//       setError(err.response?.data?.message || 'Incorrect OTP. Try again.');
//       setOtp('');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const resetFlow = () => {
//     setStep(STEPS.PHONE);
//     setOtp('');
//     setError('');
//     setName('');
//     setResendTimer(0);
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center px-4">
//       <div className="w-full max-w-md animate-fade-up" style={{ animationFillMode: 'forwards' }}>

//         {/* Header */}
//         <div className="text-center mb-8">
//           <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-xl mx-auto mb-4">
//             <Phone size={24} className="text-white" />
//           </div>
//           <h1 className="font-display font-bold text-3xl text-cream-100">Track Your Order</h1>
//           <p className="text-gray-500 text-sm mt-1">
//             Login with your phone — we'll send you an OTP
//           </p>
//         </div>

//         <div
//           className="glass-card p-8"
//           style={{ border: '1px solid rgba(52,211,153,0.2)', boxShadow: '0 0 30px rgba(16,185,129,0.06)' }}
//         >
//           {/* ── Step 1: Phone number ── */}
//           {step === STEPS.PHONE && (
//             <form onSubmit={handleSendOtp} className="flex flex-col gap-4">
//               <div>
//                 <label className="text-sm font-medium text-gray-300 font-body block mb-1.5">
//                   Mobile Number
//                 </label>
//                 <div className="flex gap-2">
//                   {/* Country code badge */}
//                   <div className="input-dark rounded-xl px-3 flex items-center text-sm text-gray-400 font-mono flex-shrink-0">
//                     🇮🇳 +91
//                   </div>
//                   <input
//                     type="tel"
//                     placeholder="9876543210"
//                     maxLength={10}
//                     value={phone}
//                     onChange={(e) => { setPhone(e.target.value.replace(/\D/g, '')); setError(''); }}
//                     className="flex-1 input-dark rounded-xl px-4 py-2.5 font-body text-sm font-mono tracking-wider"
//                     autoFocus
//                   />
//                 </div>
//               </div>
//               {error && <p className="text-rose-400 text-sm">{error}</p>}
//               <Button type="submit" size="lg" loading={loading} icon={ArrowRight} className="w-full btn-primary">
//                 Send OTP
//               </Button>
//             </form>
//           )}

//           {/* ── Step 1b: Name (new users only) ── */}
//           {step === STEPS.NAME && (
//             <form onSubmit={handleSendOtp} className="flex flex-col gap-4">
//               <div className="bg-emerald-400/8 border border-emerald-400/20 rounded-xl p-3 text-sm text-emerald-300 flex items-center gap-2">
//                 👋 Welcome! You're new here. Tell us your name to get started.
//               </div>
//               <Input
//                 label="Your Name"
//                 placeholder="e.g. Rahul Sharma"
//                 value={name}
//                 onChange={(e) => { setName(e.target.value); setError(''); }}
//                 autoFocus
//               />
//               {error && <p className="text-rose-400 text-sm">{error}</p>}
//               <div className="flex gap-2">
//                 <Button type="button" variant="ghost" size="lg" onClick={resetFlow} className="flex-1">
//                   Back
//                 </Button>
//                 <Button type="submit" size="lg" loading={loading} icon={ArrowRight} className="flex-1 btn-primary">
//                   Send OTP
//                 </Button>
//               </div>
//             </form>
//           )}

//           {/* ── Step 2: OTP entry ── */}
//           {step === STEPS.OTP && (
//             <form onSubmit={handleVerifyOtp} className="flex flex-col gap-4">
//               {/* SMS sent confirmation */}
//               <div className="text-center py-2">
//                 <div className="text-3xl mb-2">📱</div>
//                 <p className="text-sm text-gray-400">
//                   OTP sent to{' '}
//                   <span className="text-emerald-400 font-mono font-semibold">+91 {phone}</span>
//                 </p>
//                 <p className="text-xs text-gray-600 mt-1">
//                   Check your SMS inbox. Valid for 10 minutes.
//                 </p>
//               </div>

//               {/* OTP input — big and clear */}
//               <div>
//                 <label className="text-sm font-medium text-gray-300 font-body block mb-1.5">
//                   Enter 6-digit OTP
//                 </label>
//                 <input
//                   type="text"
//                   inputMode="numeric"
//                   pattern="[0-9]*"
//                   maxLength={6}
//                   placeholder="• • • • • •"
//                   value={otp}
//                   onChange={(e) => { setOtp(e.target.value.replace(/\D/g, '')); setError(''); }}
//                   className="w-full input-dark rounded-xl px-4 py-4 text-center text-2xl font-mono tracking-[0.5em] font-bold"
//                   autoFocus
//                 />
//               </div>

//               {error && (
//                 <p className="text-rose-400 text-sm text-center">{error}</p>
//               )}

//               <Button
//                 type="submit"
//                 size="lg"
//                 loading={loading}
//                 className="w-full btn-primary"
//               >
//                 Verify OTP
//               </Button>

//               {/* Resend + change number */}
//               <div className="flex items-center justify-between text-sm">
//                 <button
//                   type="button"
//                   onClick={resetFlow}
//                   className="flex items-center gap-1.5 text-gray-600 hover:text-gray-400 transition-colors"
//                 >
//                   <RotateCcw size={13} /> Change number
//                 </button>

//                 {resendTimer > 0 ? (
//                   <span className="text-gray-600 font-mono">
//                     Resend in {resendTimer}s
//                   </span>
//                 ) : (
//                   <button
//                     type="button"
//                     onClick={() => handleSendOtp()}
//                     disabled={loading}
//                     className="text-emerald-400 hover:underline disabled:opacity-50"
//                   >
//                     Resend OTP
//                   </button>
//                 )}
//               </div>
//             </form>
//           )}

//           {/* Divider */}
//           <div className="flex items-center gap-3 mt-6 mb-5">
//             <div className="flex-1 h-px bg-white/5" />
//             <span className="text-gray-700 text-xs">store staff?</span>
//             <div className="flex-1 h-px bg-white/5" />
//           </div>

//           <Link
//             to="/login"
//             className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl border border-gold-400/20 text-gold-400 hover:bg-gold-400/8 transition-all text-sm font-medium"
//           >
//             Staff / Admin Login →
//           </Link>
//         </div>

//         {/* Info */}
//         <div className="mt-4 glass-card p-4 text-xs text-gray-600 space-y-1.5">
//           <p>📦 See all your orders and their current status</p>
//           <p>🔔 Know when your clothes are ready for pickup</p>
//           <p>🔒 OTP login — no password to remember</p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CustomerLoginPage;
// frontend/src/pages/CustomerLoginPage.jsx
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Phone, Mail, ArrowRight, RotateCcw } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../hooks/useAuth';
import Input from '../components/common/Input';
import Button from '../components/common/Button';

const STEPS = { PHONE: 'phone', NAME: 'name', OTP: 'otp' };

const CustomerLoginPage = () => {
  const { sendOtp, verifyOtp } = useAuth();
  const navigate = useNavigate();

  const [step, setStep]               = useState(STEPS.PHONE);
  const [phone, setPhone]             = useState('');
  const [email, setEmail]             = useState('');
  const [name, setName]               = useState('');
  const [otp, setOtp]                 = useState('');
  const [loading, setLoading]         = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const [error, setError]             = useState('');

  // ── 60s countdown for resend button ──────────────────
  const startResendTimer = () => {
    setResendTimer(60);
    const interval = setInterval(() => {
      setResendTimer((t) => {
        if (t <= 1) { clearInterval(interval); return 0; }
        return t - 1;
      });
    }, 1000);
  };

  // ── Validate phone + email ────────────────────────────
  const validatePhoneEmail = () => {
    if (!/^[6-9]\d{9}$/.test(phone)) {
      setError('Enter a valid 10-digit mobile number');
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Enter a valid email address');
      return false;
    }
    return true;
  };

  // ── Step 1 & 1b: Send OTP ─────────────────────────────
  const handleSendOtp = async (e) => {
    e?.preventDefault();
    setError('');

    if (!validatePhoneEmail()) return;
    if (step === STEPS.NAME && !name.trim()) {
      setError('Please enter your name');
      return;
    }

    setLoading(true);
    try {
      // sendOtp in useAuth calls → POST /api/auth/customer/send-otp
      // We now pass phone + email + name
      await sendOtp(phone, name || undefined, email);

      toast.success(`OTP sent to ${email}`, { icon: '📧', duration: 4000 });
      setStep(STEPS.OTP);
      startResendTimer();
    } catch (err) {
      const res = err.response?.data;
      if (res?.isNewUser) {
        setStep(STEPS.NAME); // New user → ask for name
      } else if (err.response?.status === 429) {
        setError(res?.message || 'Too many requests. Wait a moment.');
      } else {
        setError(res?.message || 'Failed to send OTP. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  // ── Step 2: Verify OTP ────────────────────────────────
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError('');
    if (otp.length !== 6) {
      setError('Enter the 6-digit OTP sent to your email');
      return;
    }
    setLoading(true);
    try {
      await verifyOtp(phone, otp);
      toast.success('Welcome to CleanPress! 🎉');
      navigate('/my-orders');
    } catch (err) {
      setError(err.response?.data?.message || 'Incorrect OTP. Try again.');
      setOtp('');
    } finally {
      setLoading(false);
    }
  };

  // ── Reset full flow ───────────────────────────────────
  const resetFlow = () => {
    setStep(STEPS.PHONE);
    setOtp('');
    setError('');
    setName('');
    setResendTimer(0);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md animate-fade-up" style={{ animationFillMode: 'forwards' }}>

        {/* ── Header ── */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-xl mx-auto mb-4">
            <Phone size={24} className="text-white" />
          </div>
          <h1 className="font-display font-bold text-3xl text-cream-100">Track Your Order</h1>
          <p className="text-gray-500 text-sm mt-1">
            Enter your phone + email — OTP will be sent to your email
          </p>
        </div>

        <div
          className="glass-card p-8"
          style={{ border: '1px solid rgba(52,211,153,0.2)', boxShadow: '0 0 30px rgba(16,185,129,0.06)' }}
        >

          {/* ══════════════════════════════════════════
              STEP 1 — Phone + Email
          ══════════════════════════════════════════ */}
          {step === STEPS.PHONE && (
            <form onSubmit={handleSendOtp} className="flex flex-col gap-4">

              {/* Phone field */}
              <div>
                <label className="text-sm font-medium text-gray-300 font-body block mb-1.5">
                  Mobile Number
                </label>
                <div className="flex gap-2">
                  <div className="input-dark rounded-xl px-3 flex items-center text-sm text-gray-400 font-mono flex-shrink-0">
                    🇮🇳 +91
                  </div>
                  <input
                    type="tel"
                    placeholder="9876543210"
                    maxLength={10}
                    value={phone}
                    onChange={(e) => { setPhone(e.target.value.replace(/\D/g, '')); setError(''); }}
                    className="flex-1 input-dark rounded-xl px-4 py-2.5 font-body text-sm font-mono tracking-wider"
                    autoFocus
                  />
                </div>
              </div>

              {/* Email field */}
              <div>
                <label className="text-sm font-medium text-gray-300 font-body block mb-1.5">
                  Email Address
                  <span className="text-emerald-400 text-xs ml-2">(OTP will be sent here)</span>
                </label>
                <div className="relative">
                  <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input
                    type="email"
                    placeholder="you@gmail.com"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); setError(''); }}
                    className="w-full input-dark rounded-xl pl-9 pr-4 py-2.5 font-body text-sm"
                  />
                </div>
              </div>

              {error && <p className="text-rose-400 text-sm">{error}</p>}

              <Button type="submit" size="lg" loading={loading} icon={ArrowRight} className="w-full btn-primary">
                Send OTP to Email
              </Button>
            </form>
          )}

          {/* ══════════════════════════════════════════
              STEP 1b — Name (new users only)
          ══════════════════════════════════════════ */}
          {step === STEPS.NAME && (
            <form onSubmit={handleSendOtp} className="flex flex-col gap-4">
              <div className="bg-emerald-400/8 border border-emerald-400/20 rounded-xl p-3 text-sm text-emerald-300 flex items-center gap-2">
                👋 Welcome! You're new here. Tell us your name to get started.
              </div>

              {/* Show entered phone + email as read-only confirmation */}
              <div className="bg-white/3 border border-white/8 rounded-xl px-4 py-3 text-xs text-gray-500 space-y-1">
                <p>📱 +91 {phone}</p>
                <p>📧 {email}</p>
              </div>

              <Input
                label="Your Name"
                placeholder="e.g. Rahul Sharma"
                value={name}
                onChange={(e) => { setName(e.target.value); setError(''); }}
                autoFocus
              />

              {error && <p className="text-rose-400 text-sm">{error}</p>}

              <div className="flex gap-2">
                <Button type="button" variant="ghost" size="lg" onClick={resetFlow} className="flex-1">
                  Back
                </Button>
                <Button type="submit" size="lg" loading={loading} icon={ArrowRight} className="flex-1 btn-primary">
                  Send OTP
                </Button>
              </div>
            </form>
          )}

          {/* ══════════════════════════════════════════
              STEP 2 — Enter OTP
          ══════════════════════════════════════════ */}
          {step === STEPS.OTP && (
            <form onSubmit={handleVerifyOtp} className="flex flex-col gap-4">

              {/* Confirmation */}
              <div className="text-center py-2">
                <div className="text-3xl mb-2">📧</div>
                <p className="text-sm text-gray-400">
                  OTP sent to{' '}
                  <span className="text-emerald-400 font-semibold">{email}</span>
                </p>
                <p className="text-xs text-gray-600 mt-1">
                  Check your inbox (and spam folder). Valid for 10 minutes.
                </p>
              </div>

              {/* OTP input */}
              <div>
                <label className="text-sm font-medium text-gray-300 font-body block mb-1.5">
                  Enter 6-digit OTP
                </label>
                <input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={6}
                  placeholder="• • • • • •"
                  value={otp}
                  onChange={(e) => { setOtp(e.target.value.replace(/\D/g, '')); setError(''); }}
                  className="w-full input-dark rounded-xl px-4 py-4 text-center text-2xl font-mono tracking-[0.5em] font-bold"
                  autoFocus
                />
              </div>

              {error && <p className="text-rose-400 text-sm text-center">{error}</p>}

              <Button type="submit" size="lg" loading={loading} className="w-full btn-primary">
                Verify OTP
              </Button>

              {/* Resend + change */}
              <div className="flex items-center justify-between text-sm">
                <button
                  type="button"
                  onClick={resetFlow}
                  className="flex items-center gap-1.5 text-gray-600 hover:text-gray-400 transition-colors"
                >
                  <RotateCcw size={13} /> Change details
                </button>

                {resendTimer > 0 ? (
                  <span className="text-gray-600 font-mono">Resend in {resendTimer}s</span>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleSendOtp()}
                    disabled={loading}
                    className="text-emerald-400 hover:underline disabled:opacity-50"
                  >
                    Resend OTP
                  </button>
                )}
              </div>
            </form>
          )}

          {/* Divider */}
          <div className="flex items-center gap-3 mt-6 mb-5">
            <div className="flex-1 h-px bg-white/5" />
            <span className="text-gray-700 text-xs">store staff?</span>
            <div className="flex-1 h-px bg-white/5" />
          </div>

          <Link
            to="/login"
            className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl border border-gold-400/20 text-gold-400 hover:bg-gold-400/8 transition-all text-sm font-medium"
          >
            Staff / Admin Login →
          </Link>
        </div>

        {/* Info box */}
        <div className="mt-4 glass-card p-4 text-xs text-gray-600 space-y-1.5">
          <p>📦 See all your orders and their current status</p>
          <p>🔔 Know when your clothes are ready for pickup</p>
          <p>🔒 OTP login — no password to remember</p>
        </div>
      </div>
    </div>
  );
};

export default CustomerLoginPage;
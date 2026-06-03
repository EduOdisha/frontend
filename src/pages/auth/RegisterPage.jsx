import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { registerUser, clearError } from '../../store/slices/authSlice';
import { toast } from 'react-hot-toast';
import { Eye, EyeOff, GraduationCap, CheckCircle, Shield } from 'lucide-react';

const PERKS = [
  'Save & compare up to 4 colleges',
  'Set exam reminders & get alerts',
  'Access free scholarship finder',
  'Free 1-on-1 career counselling',
];

export default function RegisterPage() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirmPassword: '' });
  const [showPass, setShowPass] = useState(false);
  const [agreed, setAgreed] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, isAuthenticated } = useSelector(state => state.auth);

  useEffect(() => {
    if (isAuthenticated) navigate('/dashboard');
    return () => dispatch(clearError());
  }, [isAuthenticated, navigate, dispatch]);

  useEffect(() => { if (error) toast.error(error); }, [error]);

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.phone || !form.password) return toast.error('Please fill in all fields');
    if (form.password !== form.confirmPassword) return toast.error('Passwords do not match');
    if (form.password.length < 8) return toast.error('Password must be at least 8 characters');
    if (!agreed) return toast.error('Please accept the terms to continue');
    dispatch(registerUser({ name: form.name, email: form.email, phone: form.phone, password: form.password }));
  };

  return (
    <div className="min-h-screen flex">
      {/* ─── Left Panel ─── */}
      <div className="hidden lg:flex w-[42%] bg-primary-900 flex-col justify-between p-10 relative overflow-hidden shrink-0">
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.15) 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }} />

        <div className="relative z-10">
          <Link to="/" className="flex items-center gap-2.5 mb-16">
            <div className="w-9 h-9 bg-white/10 rounded-xl flex items-center justify-center border border-white/20">
              <GraduationCap size={20} className="text-white" />
            </div>
            <span className="font-display font-extrabold text-xl text-white">EduOdisha</span>
          </Link>

          <h2 className="text-3xl font-display font-extrabold text-white mb-3 leading-tight">
            Join 1 lakh+
            <br />Odisha students.
          </h2>
          <p className="text-primary-200 text-sm leading-relaxed mb-8">
            Create a free account and unlock personalized college recommendations, scholarship alerts, and expert guidance.
          </p>

          <ul className="space-y-3">
            {PERKS.map(p => (
              <li key={p} className="flex items-start gap-2.5">
                <CheckCircle size={16} className="text-primary-300 mt-0.5 shrink-0" />
                <span className="text-sm text-primary-100 font-medium">{p}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="relative z-10 flex items-center gap-2 text-primary-400 text-xs font-medium">
          <Shield size={14} />
          Your data is safe — we never share it with third parties.
        </div>
      </div>

      {/* ─── Right Panel (Form) ─── */}
      <div className="flex-1 flex items-center justify-center px-6 py-10 bg-white overflow-y-auto">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <Link to="/" className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <GraduationCap size={18} className="text-white" />
            </div>
            <span className="font-display font-extrabold text-lg text-slate-900">EduOdisha</span>
          </Link>

          <h1 className="text-2xl font-display font-extrabold text-slate-900 mb-1.5">Create your account</h1>
          <p className="text-sm text-slate-500 mb-7">
            Already have an account?{' '}
            <Link to="/login" className="text-primary-600 font-semibold hover:underline">Sign in →</Link>
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="reg-name" className="label-base">Full Name</label>
                <input
                  id="reg-name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Subhashree Nayak"
                  required
                  className="input-base"
                />
              </div>
              <div>
                <label htmlFor="reg-phone" className="label-base">Phone Number</label>
                <input
                  id="reg-phone"
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="9876543210"
                  required
                  className="input-base"
                />
              </div>
            </div>

            <div>
              <label htmlFor="reg-email" className="label-base">Email Address</label>
              <input
                id="reg-email"
                name="email"
                type="email"
                autoComplete="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                required
                className="input-base"
              />
            </div>

            <div>
              <label htmlFor="reg-password" className="label-base">Password</label>
              <div className="relative">
                <input
                  id="reg-password"
                  name="password"
                  type={showPass ? 'text' : 'password'}
                  autoComplete="new-password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Min. 8 characters"
                  required
                  className="input-base pr-10"
                />
                <button type="button" onClick={() => setShowPass(s => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="reg-confirm" className="label-base">Confirm Password</label>
              <input
                id="reg-confirm"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                value={form.confirmPassword}
                onChange={handleChange}
                placeholder="Re-enter password"
                required
                className="input-base"
              />
              {form.confirmPassword && form.password !== form.confirmPassword && (
                <p className="text-xs text-red-500 mt-1 font-medium">Passwords don't match</p>
              )}
            </div>

            <label className="flex items-start gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                id="agree"
                checked={agreed}
                onChange={e => setAgreed(e.target.checked)}
                className="w-4 h-4 mt-0.5 rounded border-slate-300 text-primary-600 focus:ring-primary-500"
              />
              <span className="text-sm text-slate-600 font-medium leading-snug">
                I agree to EduOdisha's{' '}
                <Link to="/terms" className="text-primary-600 hover:underline">Terms of Service</Link>
                {' '}and{' '}
                <Link to="/privacy" className="text-primary-600 hover:underline">Privacy Policy</Link>
              </span>
            </label>

            <button
              id="register-submit"
              type="submit"
              disabled={loading}
              className={`w-full btn-cta py-3 text-sm ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {loading ? (
                <span className="flex items-center gap-2 justify-center">
                  <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Creating account…
                </span>
              ) : 'Create Free Account'}
            </button>
          </form>


          <p className="text-center text-xs text-slate-400 mt-5">
            100% free. No credit card required.
          </p>
        </div>
      </div>
    </div>
  );
}
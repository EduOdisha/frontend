import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { loginUser, clearError } from '../../store/slices/authSlice';
import { toast } from 'react-hot-toast';
import { Eye, EyeOff, GraduationCap, CheckCircle } from 'lucide-react';

const HIGHLIGHTS = [
  '500+ verified colleges in Odisha',
  'Free career counselling from experts',
  'Scholarship discovery & alerts',
  'Personalised college recommendations',
];

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { loading, error, isAuthenticated } = useSelector(state => state.auth);
  const from = location.state?.from?.pathname || '/dashboard';

  useEffect(() => {
    if (isAuthenticated) navigate(from, { replace: true });
    return () => dispatch(clearError());
  }, [isAuthenticated, navigate, from, dispatch]);

  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) return toast.error('Please fill in all fields');
    dispatch(loginUser({ email, password }));
  };

  return (
    <div className="min-h-screen flex">
      {/* ─── Left Panel ─── */}
      <div className="hidden lg:flex w-[45%] bg-primary-900 flex-col justify-between p-10 relative overflow-hidden shrink-0">
        {/* Subtle dot grid */}
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.15) 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }} />

        {/* Logo at top */}
        <Link to="/" className="relative z-10 flex items-center gap-2.5">
          <div className="w-9 h-9 bg-white/10 rounded-xl flex items-center justify-center border border-white/20">
            <GraduationCap size={20} className="text-white" />
          </div>
          <span className="font-display font-extrabold text-xl text-white">EduOdisha</span>
        </Link>

        {/* Centered Content */}
        <div className="relative z-10 my-auto">
          <h2 className="text-3xl font-display font-extrabold text-white mb-3 leading-tight">
            Your educational
            <br />journey starts here.
          </h2>
          <p className="text-primary-200 text-sm leading-relaxed mb-8">
            Join 1 lakh+ Odisha students who found their perfect college on EduOdisha.
          </p>

          <ul className="space-y-3">
            {HIGHLIGHTS.map(h => (
              <li key={h} className="flex items-start gap-2.5">
                <CheckCircle size={16} className="text-primary-300 mt-0.5 shrink-0" />
                <span className="text-sm text-primary-100 font-medium">{h}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Footer at bottom */}
        <p className="relative z-10 text-xs text-primary-400 font-medium">
          © {new Date().getFullYear()} EduOdisha · Bhubaneswar, Odisha
        </p>
      </div>

      {/* ─── Right Panel (Form) ─── */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 bg-white">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <Link to="/" className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <GraduationCap size={18} className="text-white" />
            </div>
            <span className="font-display font-extrabold text-lg text-slate-900">EduOdisha</span>
          </Link>

          <h1 className="text-2xl font-display font-extrabold text-slate-900 mb-1.5">Welcome back</h1>
          <p className="text-sm text-slate-500 mb-8">
            Don't have an account?{' '}
            <Link to="/register" className="text-primary-600 font-semibold hover:underline">
              Create one free →
            </Link>
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="login-email" className="label-base">Email address</label>
              <input
                id="login-email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="input-base"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="login-password" className="label-base">Password</label>
                <Link to="/forgot-password" className="text-xs font-semibold text-primary-600 hover:underline">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <input
                  id="login-password"
                  type={showPass ? 'text' : 'password'}
                  autoComplete="current-password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="input-base pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(s => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <label className="flex items-center gap-2.5 cursor-pointer">
              <input type="checkbox" id="remember" className="w-4 h-4 rounded border-slate-300 text-primary-600 focus:ring-primary-500" />
              <span className="text-sm text-slate-600 font-medium">Keep me logged in</span>
            </label>

            <button
              type="submit"
              id="login-submit"
              disabled={loading}
              className={`w-full btn-primary py-3 text-sm ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {loading ? (
                <span className="flex items-center gap-2 justify-center">
                  <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Signing in…
                </span>
              ) : 'Sign in to your account'}
            </button>
          </form>


          <p className="text-center text-xs text-slate-400 mt-6">
            By signing in, you agree to our{' '}
            <Link to="/terms" className="text-primary-600 hover:underline">Terms</Link> and{' '}
            <Link to="/privacy" className="text-primary-600 hover:underline">Privacy Policy</Link>.
          </p>
        </div>
      </div>
    </div>
  );
}
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Brain, Mail, Lock, ArrowRight, Eye, EyeOff } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [localError, setLocalError] = useState('');
  const { login, error, loading, clearError } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');
    clearError();

    if (!email || !password) {
      setLocalError('Please fill in all fields.');
      return;
    }

    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      // Error handled by AuthContext
    }
  };

  return (
    <div className="min-h-screen bg-bg-darker bg-gradient-mesh flex items-center justify-center p-6 relative overflow-hidden">
      {/* Decorative Blur Orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-indigo/10 rounded-full blur-3xl -z-10 animate-pulse-slow"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-brand-pink/5 rounded-full blur-3xl -z-10 animate-float"></div>

      <div className="w-full max-w-md glass-panel p-8 rounded-3xl relative z-10">
        {/* Header Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="bg-gradient-to-tr from-brand-indigo to-brand-violet p-3 rounded-2xl shadow-xl shadow-brand-indigo/20 mb-3 animate-float">
            <Brain className="w-8 h-8 text-white" />
          </div>
          <h2 className="font-display font-bold text-3xl text-white">Welcome Back</h2>
          <p className="text-zinc-400 text-sm mt-1">Ready to unlock another video study session?</p>
        </div>

        {/* Errors */}
        {(localError || error) && (
          <div className="mb-6 p-4 rounded-xl bg-brand-pink/10 border border-brand-pink/20 text-brand-pink text-sm font-medium animate-pulse">
            {localError || error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email input */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-zinc-400 tracking-wide block uppercase">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full bg-zinc-900/50 hover:bg-zinc-900/80 focus:bg-bg-dark/80 text-white pl-12 pr-4 py-3.5 rounded-xl border border-white/5 focus:border-brand-indigo/50 focus:ring-1 focus:ring-brand-indigo/30 outline-none transition-all placeholder-zinc-600 text-sm font-medium"
              />
            </div>
          </div>

          {/* Password input */}
          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <label className="text-xs font-semibold text-zinc-400 tracking-wide block uppercase">
                Password
              </label>
            </div>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-zinc-900/50 hover:bg-zinc-900/80 focus:bg-bg-dark/80 text-white pl-12 pr-12 py-3.5 rounded-xl border border-white/5 focus:border-brand-indigo/50 focus:ring-1 focus:ring-brand-indigo/30 outline-none transition-all placeholder-zinc-600 text-sm font-medium"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors focus:outline-none cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-brand-indigo to-brand-violet hover:from-brand-indigo/90 hover:to-brand-violet/90 text-white font-semibold py-3.5 px-4 rounded-xl shadow-lg shadow-brand-indigo/20 hover:shadow-brand-indigo/30 transition-all flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer mt-2"
          >
            {loading ? (
              <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            ) : (
              <>
                Sign In
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>

        {/* Toggle Footer */}
        <div className="mt-8 text-center text-sm text-zinc-400">
          New to EduMind?{' '}
          <Link
            to="/register"
            onClick={clearError}
            className="text-indigo-400 hover:text-indigo-300 font-semibold underline decoration-indigo-400/30 underline-offset-4 hover:decoration-indigo-300 transition-all"
          >
            Create an account
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;

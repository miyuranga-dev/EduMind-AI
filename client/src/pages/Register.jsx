import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Brain, User, Mail, Lock, ArrowRight, Eye, EyeOff } from "lucide-react";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [localError, setLocalError] = useState("");
  const { register, error, loading, clearError } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError("");
    clearError();

    if (!name || !email || !password || !confirmPassword) {
      setLocalError("Please fill in all fields.");
      return;
    }

    if (password.length < 6) {
      setLocalError("Password must be at least 6 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setLocalError("Passwords do not match.");
      return;
    }

    try {
      await register(name, email, password);
      navigate("/login");
    } catch (err) {
      // Error handled by AuthContext
    }
  };

return (
  <div className="min-h-screen relative overflow-hidden bg-[#070B14] flex items-center justify-center px-6 py-10">
    {/* Gradient Background */}
    <div className="absolute inset-0 bg-gradient-to-br from-brand-indigo/10 via-transparent to-brand-violet/10" />

    {/* Grid Pattern */}
    <div
      className="absolute inset-0 opacity-[0.04]"
      style={{
        backgroundImage: `
          linear-gradient(to right, white 1px, transparent 1px),
          linear-gradient(to bottom, white 1px, transparent 1px)
        `,
        backgroundSize: "40px 40px",
      }}
    />

    {/* Glow Orbs */}
    <div className="absolute top-20 right-20 w-[500px] h-[500px] bg-brand-indigo/20 rounded-full blur-[140px] animate-pulse" />

    <div className="absolute bottom-20 left-20 w-[500px] h-[500px] bg-brand-violet/20 rounded-full blur-[140px] animate-pulse" />

    {/* Floating Cards */}
    <div className="hidden xl:block absolute left-[10%] top-[25%] glass-panel rounded-2xl p-4 animate-float">
      <p className="text-sm text-zinc-300">📖 Smart Notes</p>
    </div>

    <div className="hidden xl:block absolute right-[10%] top-[35%] glass-panel rounded-2xl p-4 animate-float">
      <p className="text-sm text-zinc-300">🧠 AI Learning</p>
    </div>

    <div
      className="hidden xl:block absolute right-[15%] bottom-[20%] glass-panel rounded-2xl p-4 animate-float"
      style={{ animationDelay: "1s" }}
    >
      <p className="text-sm text-zinc-300">🎯 Quiz Generator</p>
    </div>

    {/* Register Card */}
    <div className="w-full max-w-md glass-panel rounded-3xl p-8 relative z-10 shadow-2xl shadow-brand-indigo/10">

      {/* Header */}
      <div className="flex flex-col items-center mb-8">
        <div className="relative mb-5">
          <div className="absolute inset-0 bg-brand-indigo blur-2xl opacity-30 rounded-full" />

          <div className="relative bg-gradient-to-tr from-brand-indigo to-brand-violet p-4 rounded-3xl">
            <Brain className="w-8 h-8 text-white" />
          </div>
        </div>

        <h2 className="font-display font-bold text-4xl text-white">
          Create Account
        </h2>

        <p className="text-zinc-400 mt-2 text-center">
          Start transforming videos into powerful study materials
        </p>
      </div>

      {(localError || error) && (
        <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
          {localError || error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">

        {/* Name */}
        <div>
          <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider block mb-2">
            Full Name
          </label>

          <div className="relative">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />

            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="John Doe"
              className="w-full bg-zinc-900/50 border border-white/10 text-white pl-12 pr-4 py-4 rounded-xl outline-none focus:border-brand-indigo/50 focus:ring-1 focus:ring-brand-indigo/30 transition-all"
            />
          </div>
        </div>

        {/* Email */}
        <div>
          <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider block mb-2">
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
              className="w-full bg-zinc-900/50 border border-white/10 text-white pl-12 pr-4 py-4 rounded-xl outline-none focus:border-brand-indigo/50 focus:ring-1 focus:ring-brand-indigo/30 transition-all"
            />
          </div>
        </div>

        {/* Password */}
        <div>
          <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider block mb-2">
            Password
          </label>

          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />

            <input
              type={showPassword ? "text" : "password"}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Minimum 6 characters"
              className="w-full bg-zinc-900/50 border border-white/10 text-white pl-12 pr-12 py-4 rounded-xl outline-none focus:border-brand-indigo/50 focus:ring-1 focus:ring-brand-indigo/30 transition-all"
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300"
            >
              {showPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Confirm Password */}
        <div>
          <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider block mb-2">
            Confirm Password
          </label>

          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />

            <input
              type={showPassword ? "text" : "password"}
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm password"
              className="w-full bg-zinc-900/50 border border-white/10 text-white pl-12 pr-4 py-4 rounded-xl outline-none focus:border-brand-indigo/50 focus:ring-1 focus:ring-brand-indigo/30 transition-all"
            />
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-brand-indigo to-brand-violet hover:from-brand-indigo/90 hover:to-brand-violet/90 text-white font-semibold py-4 rounded-xl shadow-lg shadow-brand-indigo/20 hover:shadow-brand-indigo/40 hover:scale-[1.02] transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              Create Account
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>

      {/* Footer */}
      <div className="mt-8 text-center text-sm text-zinc-400">
        Already have an account?{" "}
        <Link
          to="/login"
          onClick={clearError}
          className="text-brand-indigo hover:text-brand-violet font-semibold transition-colors"
        >
          Sign In
        </Link>
      </div>
    </div>
  </div>
);
};

export default Register;

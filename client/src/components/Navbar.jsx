import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Brain, LogOut, BookOpen, LayoutDashboard } from "lucide-react";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const brandLink = user ? "/dashboard" : "/";

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  if (!user) {
    return (
      <nav className="sticky top-0 z-50 glass-panel border-b border-white/5 py-4 px-6 md:px-12 flex justify-between items-center">
        <Link to={brandLink} className="flex items-center gap-2 group">
          <div className="bg-gradient-to-tr from-brand-indigo to-brand-violet p-2 rounded-xl shadow-lg shadow-brand-indigo/20 group-hover:scale-105 transition-transform">
            <Brain className="w-5 h-5 text-white" />
          </div>
          <span className="font-display font-bold text-xl tracking-tight bg-gradient-to-r from-white via-indigo-200 to-indigo-400 bg-clip-text text-transparent">
            EduMind<span className="text-brand-pink font-extrabold">AI</span>
          </span>
        </Link>

        <div className="flex items-center gap-3">
          <Link
            to="/login"
            className="px-4 py-2 rounded-xl text-sm font-medium text-zinc-200 hover:text-white hover:bg-white/5 border border-white/10 transition-colors"
          >
            Login
          </Link>
          <Link
            to="/register"
            className="px-4 py-2 rounded-xl text-sm font-medium bg-gradient-to-r from-brand-indigo to-brand-violet text-white shadow-lg shadow-brand-indigo/20 hover:opacity-90 transition-opacity"
          >
            Sign Up
          </Link>
        </div>
      </nav>
    );
  }

  const isActive = (path) => location.pathname === path;

  // Get initials for profile badge
  const getInitials = (name) => {
    if (!name || typeof name !== 'string') return 'U';
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  };

  return (
    <nav className="sticky top-0 z-50 glass-panel border-b border-white/5 py-4 px-6 md:px-12 flex justify-between items-center">
      {/* Brand Logo */}
      <Link to={brandLink} className="flex items-center gap-2 group">
        <div className="bg-gradient-to-tr from-brand-indigo to-brand-violet p-2 rounded-xl shadow-lg shadow-brand-indigo/20 group-hover:scale-105 transition-transform">
          <Brain className="w-5 h-5 text-white" />
        </div>
        <span className="font-display font-bold text-xl tracking-tight bg-gradient-to-r from-white via-indigo-200 to-indigo-400 bg-clip-text text-transparent">
          EduMind<span className="text-brand-pink font-extrabold">AI</span>
        </span>
      </Link>

      {/* Nav Links */}
      <div className="flex items-center gap-1 md:gap-4">
        <Link
          to="/dashboard"
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
            isActive("/dashboard")
              ? "bg-brand-indigo/15 text-indigo-400 border border-brand-indigo/20"
              : "text-zinc-400 hover:text-white hover:bg-white/5 border border-transparent"
          }`}
        >
          <LayoutDashboard className="w-4 h-4" />
          <span className="hidden sm:inline">Dashboard</span>
        </Link>
        <Link
          to="/library"
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
            isActive("/library")
              ? "bg-brand-indigo/15 text-indigo-400 border border-brand-indigo/20"
              : "text-zinc-400 hover:text-white hover:bg-white/5 border border-transparent"
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span className="hidden sm:inline">My Library</span>
        </Link>

        {/* Vertical Divider */}
        <div className="h-6 w-[1px] bg-zinc-800 mx-2"></div>

        {/* User profile / Logout */}
        <div className="flex items-center gap-3">
          <div className="hidden md:flex flex-col text-right">
            <span className="text-sm font-semibold text-zinc-200">
              {user.name || 'User'}
            </span>
            <span className="text-xs text-zinc-500">{user.email || 'N/A'}</span>
          </div>

          {/* Profile Circle */}
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-brand-indigo via-brand-violet to-brand-pink p-[1px] shadow-md shadow-brand-indigo/10">
            <div className="w-full h-full rounded-full bg-bg-dark flex items-center justify-center text-[10px] font-bold text-white tracking-wider">
              {getInitials(user.name)}
            </div>
          </div>

          {/* Logout Trigger */}
          <button
            onClick={handleLogout}
            className="p-2 rounded-xl text-zinc-400 hover:text-brand-pink hover:bg-brand-pink/10 border border-transparent hover:border-brand-pink/20 transition-all cursor-pointer"
            title="Sign Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-bg-darker flex items-center justify-center flex-col gap-4">
        {/* Premium gradient loading spinner */}
        <div className="relative w-16 h-16 animate-spin rounded-full bg-gradient-to-tr from-brand-indigo via-brand-violet to-brand-pink p-[3px]">
          <div className="w-full h-full bg-bg-darker rounded-full"></div>
        </div>
        <p className="text-zinc-400 font-medium animate-pulse">
          Synchronizing learning workspace...
        </p>
      </div>
    );
  }

  return user ? <Outlet /> : <Navigate to="/" replace />;
};

export default ProtectedRoute;

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Library from './pages/Library';
import StudyHub from './pages/StudyHub';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-bg-darker text-zinc-100 flex flex-col selection:bg-brand-indigo/35 selection:text-white">
          {/* Navbar displays only if the user is authenticated */}
          <Navbar />
          
          <div className="flex-1">
            <Routes>
              {/* Public Authentication Routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Private Protected Workspace Routes */}
              <Route element={<ProtectedRoute />}>
                <Route path="/" element={<Dashboard />} />
                <Route path="/library" element={<Library />} />
                <Route path="/video/:id" element={<StudyHub />} />
              </Route>

              {/* Fallback to Dashboard/Login */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;

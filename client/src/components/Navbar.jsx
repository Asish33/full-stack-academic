import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiUpload, FiLogOut, FiLogIn, FiUserPlus, FiBookOpen, FiMenu, FiX } from 'react-icons/fi';
import { useState } from 'react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMenuOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 border-b border-outline-variant/20 bg-background/80 backdrop-blur-md shadow-[0_0_40px_-10px_rgba(0,230,118,0.1)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <span className="material-symbols-outlined text-primary group-hover:rotate-180 transition-transform duration-500" style={{ fontVariationSettings: "'FILL' 1" }}>sync</span>
            <div className="flex items-baseline gap-2">
              <span className="font-headline font-bold text-2xl tracking-tighter text-on-surface leading-none">SyncSpace</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-2">
            <Link
              to="/dashboard"
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                isActive('/dashboard') ? 'text-primary bg-primary/10' : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-highest'
              }`}
            >
              Browse Notes
            </Link>

            {user ? (
              <>
                <Link
                  to="/upload"
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive('/upload') ? 'text-primary bg-primary/10' : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-highest'
                  }`}
                >
                  Upload Notes
                </Link>
                <div className="flex items-center gap-2 ml-2 pl-2 border-l border-outline-variant/30">
                  <div className="w-8 h-8 rounded-full bg-primary-container flex items-center justify-center text-on-primary text-sm font-bold shadow-[0_0_10px_rgba(0,230,118,0.3)]">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-on-surface text-sm font-body font-medium">{user.name.split(' ')[0]}</span>
                  <button
                    onClick={handleLogout}
                    className="ml-1 p-2 rounded-lg text-on-surface-variant hover:text-error hover:bg-error/10 transition-all duration-200"
                    title="Logout"
                  >
                    <FiLogOut />
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2 ml-2">
                <Link to="/login" className="px-4 py-2 rounded-full border border-outline-variant hover:border-primary text-sm text-on-surface-variant hover:text-on-surface transition-colors font-headline">
                  Login
                </Link>
                <Link to="/register" className="px-5 py-2 rounded-full bg-primary text-on-primary text-sm font-bold font-headline shadow-[0_0_15px_rgba(0,230,118,0.2)] hover:scale-105 active:scale-95 transition-all">
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu toggle */}
          <button
            className="md:hidden p-2 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container-highest transition-all"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <FiX size={20} /> : <FiMenu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-outline-variant/20 bg-background/95 backdrop-blur-xl animate-fade-in">
          <div className="px-4 py-4 space-y-2 font-body">
            <Link to="/dashboard" onClick={() => setMenuOpen(false)} className="block px-4 py-2.5 rounded-xl text-on-surface-variant hover:text-on-surface hover:bg-surface-container-highest transition-all">
              Browse Notes
            </Link>
            {user ? (
              <>
                <Link to="/upload" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-on-surface-variant hover:text-on-surface hover:bg-surface-container-highest transition-all">
                  <FiUpload /> Upload Notes
                </Link>
                <div className="px-4 py-2 text-on-surface-variant/60 text-sm">Signed in as <span className="text-on-surface font-bold">{user.name}</span></div>
                <button onClick={handleLogout} className="flex items-center gap-2 w-full px-4 py-2.5 rounded-xl text-error hover:bg-error/10 transition-all">
                  <FiLogOut /> Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setMenuOpen(false)} className="block px-4 py-2.5 rounded-xl text-on-surface-variant hover:text-on-surface hover:bg-surface-container-highest transition-all">Login</Link>
                <Link to="/register" onClick={() => setMenuOpen(false)} className="block px-4 py-2.5 rounded-xl bg-primary text-on-primary text-center font-bold font-headline mt-2 shadow-[0_0_15px_rgba(0,230,118,0.2)]">Sign Up</Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;

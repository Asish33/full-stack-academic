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
    <nav className="sticky top-0 z-50 border-b border-white/10 bg-surface-900/80 backdrop-blur-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-violet-600 flex items-center justify-center shadow-lg shadow-primary-500/30 group-hover:scale-110 transition-transform duration-200">
              <FiBookOpen className="text-white text-lg" />
            </div>
            <div>
              <span className="text-gradient font-bold text-lg leading-tight block">NoteShare</span>
              <span className="text-slate-500 text-[10px] -mt-0.5 block">Exchange Portal</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-2">
            <Link
              to="/"
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                isActive('/') ? 'text-primary-400 bg-primary-500/10' : 'text-slate-400 hover:text-slate-100 hover:bg-white/5'
              }`}
            >
              Browse Notes
            </Link>

            {user ? (
              <>
                <Link
                  to="/upload"
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive('/upload') ? 'text-primary-400 bg-primary-500/10' : 'text-slate-400 hover:text-slate-100 hover:bg-white/5'
                  }`}
                >
                  Upload Notes
                </Link>
                <div className="flex items-center gap-2 ml-2 pl-2 border-l border-white/10">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-violet-600 flex items-center justify-center text-white text-sm font-bold">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-slate-300 text-sm">{user.name.split(' ')[0]}</span>
                  <button
                    onClick={handleLogout}
                    className="ml-1 p-2 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200"
                    title="Logout"
                  >
                    <FiLogOut />
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2 ml-2">
                <Link to="/login" className="btn-outline text-sm py-2 px-4 flex items-center gap-1.5">
                  <FiLogIn className="text-sm" /> Login
                </Link>
                <Link to="/register" className="btn-primary text-sm py-2 px-4 flex items-center gap-1.5">
                  <FiUserPlus className="text-sm" /> Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu toggle */}
          <button
            className="md:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-all"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <FiX size={20} /> : <FiMenu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-white/10 bg-surface-900/95 backdrop-blur-lg animate-fade-in">
          <div className="px-4 py-4 space-y-2">
            <Link to="/" onClick={() => setMenuOpen(false)} className="block px-4 py-2.5 rounded-xl text-slate-300 hover:text-white hover:bg-white/5 transition-all">
              Browse Notes
            </Link>
            {user ? (
              <>
                <Link to="/upload" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-slate-300 hover:text-white hover:bg-white/5 transition-all">
                  <FiUpload /> Upload Notes
                </Link>
                <div className="px-4 py-2 text-slate-500 text-sm">Signed in as <span className="text-slate-300">{user.name}</span></div>
                <button onClick={handleLogout} className="flex items-center gap-2 w-full px-4 py-2.5 rounded-xl text-red-400 hover:bg-red-500/10 transition-all">
                  <FiLogOut /> Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setMenuOpen(false)} className="block px-4 py-2.5 rounded-xl text-slate-300 hover:text-white hover:bg-white/5">Login</Link>
                <Link to="/register" onClick={() => setMenuOpen(false)} className="block px-4 py-2.5 rounded-xl bg-primary-500 text-white text-center font-medium">Sign Up</Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;

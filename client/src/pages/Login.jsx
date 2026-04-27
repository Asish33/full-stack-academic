import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiLogIn, FiMail, FiLock, FiEye, FiEyeOff, FiBookOpen } from 'react-icons/fi';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) { toast.error('Please fill all fields'); return; }
    setLoading(true);
    try {
      await login(form.email, form.password);
      toast.success('Welcome back! 🎉');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="bg-background overflow-hidden min-h-screen flex items-center justify-center px-4 py-12 relative">
      {/* Decorative Ambient Glows */}
      <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-primary/10 blur-[150px] rounded-full pointer-events-none -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-primary-container/10 blur-[150px] rounded-full pointer-events-none translate-x-1/3 translate-y-1/3"></div>

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md relative z-10"
      >
        {/* Header */}
        <div className="text-center mb-10">
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-primary-container shadow-[0_0_25px_rgba(0,230,118,0.4)] mb-6"
          >
            <FiBookOpen className="text-on-primary text-3xl" />
          </motion.div>
          <h1 className="font-headline text-4xl font-bold tracking-tight text-on-surface mb-2">
            Welcome <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary-container">Back</span>
          </h1>
          <p className="text-on-surface-variant font-body">Sign in to access your synchronized space.</p>
        </div>

        {/* Login Form Container */}
        <div className="backdrop-blur-xl bg-surface-container-low/40 border border-outline-variant/20 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
          {/* Subtle inner top glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent"></div>
          
          <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
            {/* Email */}
            <div>
              <label className="block text-xs font-label uppercase font-bold tracking-wider text-on-surface-variant mb-2">Email Address</label>
              <div className="relative">
                <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant/70 text-lg" />
                <input
                  id="login-email"
                  type="email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full bg-surface-container-highest/30 border border-outline-variant/20 rounded-xl pl-12 pr-4 py-3.5 text-on-surface font-body placeholder-on-surface-variant/40 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all duration-200"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-label uppercase font-bold tracking-wider text-on-surface-variant mb-2">Password</label>
              <div className="relative">
                <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant/70 text-lg" />
                <input
                  id="login-password"
                  type={showPass ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="w-full bg-surface-container-highest/30 border border-outline-variant/20 rounded-xl pl-12 pr-12 py-3.5 text-on-surface font-body placeholder-on-surface-variant/40 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all duration-200"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant/70 hover:text-on-surface transition-colors"
                >
                  {showPass ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                </button>
              </div>
            </div>

            <motion.button
              whileHover={!loading ? { scale: 1.02 } : {}}
              whileTap={!loading ? { scale: 0.98 } : {}}
              id="login-submit"
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-xl bg-gradient-to-br from-primary to-primary-container text-on-primary font-headline font-bold text-lg neon-glow shadow-[0_0_20px_rgba(0,230,118,0.3)] flex items-center justify-center gap-2 mt-4 disabled:opacity-70 disabled:cursor-not-allowed transition-all"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-on-primary/30 border-t-on-primary rounded-full animate-spin" />
                  Authenticating...
                </>
              ) : (
                <><FiLogIn /> Initiate Session</>
              )}
            </motion.button>
          </form>

          <p className="text-center text-on-surface-variant/80 font-body text-sm mt-8">
            Don't have an account?{' '}
            <Link to="/register" className="text-primary hover:text-primary-container font-bold transition-colors">
              Request access →
            </Link>
          </p>
        </div>
      </motion.div>
    </main>
  );
};

export default Login;

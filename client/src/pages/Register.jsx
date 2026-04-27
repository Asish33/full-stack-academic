import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiUserPlus, FiMail, FiLock, FiUser, FiEye, FiEyeOff, FiBookOpen } from 'react-icons/fi';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) { toast.error('Please fill all fields'); return; }
    if (form.password.length < 6) { toast.error('Password must be at least 6 characters'); return; }
    if (form.password !== form.confirm) { toast.error('Passwords do not match'); return; }
    setLoading(true);
    try {
      await register(form.name, form.email, form.password);
      toast.success('Account created! Welcome aboard 🚀');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
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
            Create <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary-container">Account</span>
          </h1>
          <p className="text-on-surface-variant font-body">Join thousands of students sharing notes.</p>
        </div>

        {/* Registration Form Container */}
        <div className="backdrop-blur-xl bg-surface-container-low/40 border border-outline-variant/20 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
          {/* Subtle inner top glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent"></div>
          
          <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
            {/* Name */}
            <div>
              <label className="block text-xs font-label uppercase font-bold tracking-wider text-on-surface-variant mb-2">Full Name</label>
              <div className="relative">
                <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant/70 text-lg" />
                <input
                  id="register-name"
                  type="text"
                  placeholder="Rahul Sharma"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full bg-surface-container-highest/30 border border-outline-variant/20 rounded-xl pl-12 pr-4 py-3.5 text-on-surface font-body placeholder-on-surface-variant/40 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all duration-200"
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-label uppercase font-bold tracking-wider text-on-surface-variant mb-2">Email Address</label>
              <div className="relative">
                <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant/70 text-lg" />
                <input
                  id="register-email"
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
                  id="register-password"
                  type={showPass ? 'text' : 'password'}
                  placeholder="Min 6 characters"
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

            {/* Confirm Password */}
            <div>
              <label className="block text-xs font-label uppercase font-bold tracking-wider text-on-surface-variant mb-2">Confirm Password</label>
              <div className="relative">
                <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant/70 text-lg" />
                <input
                  id="register-confirm"
                  type={showPass ? 'text' : 'password'}
                  placeholder="Re-enter password"
                  value={form.confirm}
                  onChange={(e) => setForm({ ...form, confirm: e.target.value })}
                  className="w-full bg-surface-container-highest/30 border border-outline-variant/20 rounded-xl pl-12 pr-4 py-3.5 text-on-surface font-body placeholder-on-surface-variant/40 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all duration-200"
                  required
                />
              </div>
            </div>

            <motion.button
              whileHover={!loading ? { scale: 1.02 } : {}}
              whileTap={!loading ? { scale: 0.98 } : {}}
              id="register-submit"
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-xl bg-gradient-to-br from-primary to-primary-container text-on-primary font-headline font-bold text-lg neon-glow shadow-[0_0_20px_rgba(0,230,118,0.3)] flex items-center justify-center gap-2 mt-6 disabled:opacity-70 disabled:cursor-not-allowed transition-all"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-on-primary/30 border-t-on-primary rounded-full animate-spin" />
                  Creating Account...
                </>
              ) : (
                <><FiUserPlus /> Join SyncSpace</>
              )}
            </motion.button>
          </form>

          <p className="text-center text-on-surface-variant/80 font-body text-sm mt-8">
            Already have an account?{' '}
            <Link to="/login" className="text-primary hover:text-primary-container font-bold transition-colors">
              Sign in →
            </Link>
          </p>
        </div>
      </motion.div>
    </main>
  );
};

export default Register;

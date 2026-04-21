import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <main className="pt-20 bg-background overflow-hidden min-h-screen">
      {/* Hero Section */}
      <section className="relative px-6 py-20">
        {/* Decorative Ambient Glows */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/10 blur-[120px] rounded-full -z-10"></div>
        
        <div className="max-w-4xl mx-auto text-center flex flex-col items-center">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-surface-container-high mb-8 text-primary font-label font-bold uppercase tracking-wider text-[10px]"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            Now in beta: Version 2.0
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-headline text-5xl md:text-8xl font-bold tracking-tighter text-on-surface leading-[0.9] mb-8"
          >
            Take Control of Your <br/> 
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary-container">Academic Journey</span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg md:text-xl text-on-surface-variant max-w-2xl mb-12 font-light leading-relaxed font-body"
          >
            SyncSpace offers a centralized platform for managing your study materials. Instant notes exchange, collaborative study groups, and a premium design.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 items-center"
          >
            <Link to="/register">
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-br from-primary to-primary-container text-on-primary px-10 py-5 rounded-full font-headline font-bold text-lg neon-glow shadow-[0_0_15px_rgba(0,230,118,0.4)]"
              >
                Get started now
              </motion.button>
            </Link>
            <Link to="/dashboard">
              <motion.button 
                whileHover={{ backgroundColor: "rgba(50, 53, 60, 1)" }}
                className="px-8 py-5 rounded-full font-headline font-bold text-lg text-on-surface flex items-center gap-2 transition-colors border border-outline-variant/30"
              >
                View Dashboard <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>play_circle</span>
              </motion.button>
            </Link>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="mt-16 flex flex-col items-center gap-4"
          >
            <p className="font-label uppercase tracking-[0.2em] text-[10px] text-on-surface-variant/60">They trust us</p>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-1 text-primary">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span key={star} className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                ))}
              </div>
              <div className="h-4 w-px bg-outline-variant/30"></div>
              <div className="flex items-center gap-2 text-on-surface/80 font-headline font-bold">
                <img alt="Google" className="w-4 h-4 opacity-70" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDOFr8mSOdkBDscQma5oDBxse88e7x2RmzDtiRJKQt1C6ntgi77p9I0q_g6wUD7afdsdFtJxskj1XecU-cu70IsQ4zKlkwSrvLsTETVN9wPMXn2j1nbDI0IP2j3Bvl9qYBRNOpFFHP-jOCHEAi4mqL_ySh5TN8ZJqDt1ZcTZTG70oKwTziheSPepi__Z0hMicIxn71c80uhU5lxGLmWg0WMJwjsWZ0CYUrRFVU_94RnNrgMPoC-LNzn-7iO1S0UQCLdc_fIAY4fg5A" />
                Google Cloud Partner
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Dashboard Preview */}
      <section className="px-6 py-20 overflow-visible">
        <div className="max-w-6xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative group"
          >
            {/* Ambient Glow behind card */}
            <div className="absolute -inset-10 bg-primary/5 blur-[100px] rounded-full group-hover:bg-primary/10 transition-all duration-700"></div>
            
            <div className="backdrop-blur-xl bg-surface-container-low/40 border border-outline-variant/20 rounded-3xl overflow-hidden shadow-2xl relative">
              <div className="p-8 md:p-12">
                <div className="flex justify-between items-center mb-12">
                  <div>
                    <h2 className="font-headline text-3xl font-bold tracking-tight mb-1">Main Dashboard</h2>
                    <p className="text-sm text-on-surface-variant font-body">System Status: Optimal | Latency: 12ms</p>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-surface-container-highest flex items-center justify-center">
                      <span className="material-symbols-outlined text-on-surface-variant text-xl">notifications</span>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-primary-container flex items-center justify-center">
                      <span className="material-symbols-outlined text-on-primary text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>person</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {/* Recent Notes */}
                  <motion.div whileHover={{ y: -5 }} className="bg-surface-container-lowest/50 p-6 rounded-2xl transition-transform border border-outline-variant/10">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="font-label uppercase tracking-wider text-xs font-bold text-on-surface-variant">Recent Notes</h3>
                      <span className="material-symbols-outlined text-primary text-sm">history</span>
                    </div>
                    <div className="space-y-4">
                      <div className="p-4 bg-surface-container-highest/30 rounded-xl flex items-center gap-4 border border-outline-variant/10">
                        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
                          <span className="material-symbols-outlined">description</span>
                        </div>
                        <div>
                          <p className="text-sm font-bold font-body">Quantum Mech IV</p>
                          <p className="font-label text-[10px] text-on-surface-variant/70 uppercase tracking-tighter">Modified 2m ago</p>
                        </div>
                      </div>
                      <div className="p-4 bg-surface-container-highest/30 rounded-xl flex items-center gap-4 border border-outline-variant/10">
                        <div className="w-10 h-10 bg-secondary/10 rounded-lg flex items-center justify-center text-secondary">
                          <span className="material-symbols-outlined">folder_zip</span>
                        </div>
                        <div>
                          <p className="text-sm font-bold font-body">Neural Nets Lab</p>
                          <p className="font-label text-[10px] text-on-surface-variant/70 uppercase tracking-tighter">Modified 1h ago</p>
                        </div>
                      </div>
                    </div>
                  </motion.div>

                  {/* Upload Stats */}
                  <motion.div whileHover={{ y: -5 }} className="bg-surface-container-lowest/50 p-6 rounded-2xl transition-transform border border-outline-variant/10">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="font-label uppercase tracking-wider text-xs font-bold text-on-surface-variant">Upload Stats</h3>
                      <span className="material-symbols-outlined text-primary text-sm">analytics</span>
                    </div>
                    <div className="h-32 flex items-end justify-between gap-2 px-2">
                      {[12, 24, 16, 28, 20, 8].map((h, i) => (
                        <motion.div 
                          key={i}
                          initial={{ height: 0 }}
                          whileInView={{ height: `${h * 4}px` }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.5, delay: i * 0.1 }}
                          className={`w-full rounded-t-sm ${i === 2 || i === 4 ? 'bg-primary' : i === 3 ? 'bg-primary-container' : 'bg-surface-container-highest'}`}
                        ></motion.div>
                      ))}
                    </div>
                    <p className="mt-4 text-center text-[10px] uppercase tracking-widest text-on-surface-variant font-label">Weekly Sync Activity: +14.2%</p>
                  </motion.div>

                  {/* Quick Search */}
                  <motion.div whileHover={{ y: -5 }} className="bg-surface-container-lowest/50 p-6 rounded-2xl flex flex-col transition-transform border border-outline-variant/10">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="font-label uppercase tracking-wider text-xs font-bold text-on-surface-variant">Quick Search</h3>
                      <span className="material-symbols-outlined text-primary text-sm">bolt</span>
                    </div>
                    <div className="bg-surface-container-highest/50 rounded-lg p-3 flex items-center gap-3 mb-4 border border-outline-variant/20">
                      <span className="material-symbols-outlined text-on-surface-variant text-lg">search</span>
                      <span className="text-sm text-on-surface-variant/50 font-body">Command + K to search...</span>
                    </div>
                    <div className="mt-auto">
                      <div className="flex flex-wrap gap-2">
                        {['Biology', 'AI', 'Ethics'].map(tag => (
                          <span key={tag} className="px-3 py-1 bg-surface-container-highest border border-outline-variant/20 rounded text-[10px] text-on-surface-variant uppercase font-bold tracking-tight font-label">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </motion.div>

                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-6 py-32 bg-surface-container-lowest">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-24"
          >
            <h2 className="font-headline text-4xl md:text-6xl font-bold tracking-tight text-on-surface mb-6">Why Choose SyncSpace?</h2>
            <p className="text-on-surface-variant text-lg max-w-2xl mx-auto font-light font-body">Precision tools for the modern academic. Elevate your learning through our high-performance infrastructure.</p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: 'hub', title: 'Centralized Hub', desc: 'A single, unified environment for every asset, file, and thought in your academic journey.' },
              { icon: 'bolt', title: 'Instant Access', desc: 'Lightning-fast retrieval of any piece of data across your entire cloud ecosystem, anywhere.' },
              { icon: 'groups', title: 'Community Driven', desc: 'Connect with peers worldwide. Share insights and collaborate on projects in real-time.' },
              { icon: 'terminal', title: 'Premium Interface', desc: 'Sophisticated, distraction-free environment tailored for high-intensity cognitive focus.' }
            ].map((feature, i) => (
              <motion.div 
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="group p-8 rounded-2xl bg-surface-container-low transition-colors hover:bg-surface-container-high border border-outline-variant/5 hover:border-outline-variant/20"
              >
                <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center text-primary mb-8 group-hover:scale-110 transition-transform duration-300">
                  <span className="material-symbols-outlined text-3xl">{feature.icon}</span>
                </div>
                <h3 className="font-headline text-xl font-bold mb-4 text-on-surface">{feature.title}</h3>
                <p className="text-on-surface-variant text-sm leading-relaxed font-body">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 py-40">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-5xl mx-auto rounded-3xl bg-gradient-to-br from-surface-container-low to-surface-container-lowest p-12 md:p-24 relative overflow-hidden text-center border border-outline-variant/10 shadow-2xl"
        >
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary/5 blur-[100px] rounded-full"></div>
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-primary-container/5 blur-[100px] rounded-full"></div>
          
          <h2 className="font-headline text-4xl md:text-7xl font-bold tracking-tighter text-on-surface mb-8 relative z-10">
            Ready to take control of your notes?
          </h2>
          <p className="text-on-surface-variant text-xl mb-12 max-w-2xl mx-auto font-light leading-relaxed font-body relative z-10">
            Join 20,000+ researchers and students who have upgraded their workflow to SyncSpace.
          </p>
          <Link to="/register" className="relative z-10 inline-block">
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-primary text-on-primary px-12 py-6 rounded-full font-headline font-bold text-xl neon-glow shadow-[0_0_20px_rgba(0,230,118,0.3)]"
            >
              Get started now
            </motion.button>
          </Link>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="bg-surface-container-lowest w-full pt-24 pb-12 border-t border-outline-variant/10">
        <div className="max-w-7xl mx-auto px-8 grid grid-cols-1 md:grid-cols-3 gap-16">
          <div className="col-span-1">
            <div className="text-3xl font-black tracking-tighter text-on-surface mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">sync</span>
              <span className="font-headline">SyncSpace</span>
            </div>
            <p className="text-on-surface-variant/60 font-body text-sm tracking-wide leading-relaxed mb-8 max-w-xs">
              Engineering the future of academic management. A technical luminary for students, by researchers.
            </p>
          </div>
          
          <div className="grid grid-cols-2 gap-8 md:col-span-2">
            <div>
              <h4 className="font-headline text-sm font-bold uppercase tracking-[0.2em] text-on-surface mb-6">Product</h4>
              <ul className="space-y-4">
                {['Notes', 'How it works', 'Community', 'Dashboard'].map(link => (
                  <li key={link}>
                    <a className="text-on-surface-variant/60 hover:text-primary font-body text-sm tracking-wide transition-colors inline-block" href="#">{link}</a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-headline text-sm font-bold uppercase tracking-[0.2em] text-on-surface mb-6">Connect</h4>
              <ul className="space-y-4">
                {['Twitter', 'LinkedIn', 'GitHub'].map(link => (
                  <li key={link}>
                    <a className="text-on-surface-variant/60 hover:text-primary font-body text-sm tracking-wide transition-colors inline-block" href="#">{link}</a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto px-8 pt-16 mt-16 border-t border-outline-variant/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-on-surface-variant/40 text-xs font-body tracking-wide">
            © 2026 SyncSpace Technical Luminary. All rights reserved.
          </p>
          <div className="flex gap-8">
            <a className="text-on-surface-variant/40 hover:text-primary text-xs transition-colors" href="#">Privacy Policy</a>
            <a className="text-on-surface-variant/40 hover:text-primary text-xs transition-colors" href="#">Terms of Service</a>
          </div>
        </div>
      </footer>
    </main>
  );
};

export default Home;

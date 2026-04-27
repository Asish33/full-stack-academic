import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { FiUpload, FiBookOpen, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';
import NoteCard from '../components/NoteCard';
import NoteFilter from '../components/NoteFilter';
import SearchBar from '../components/SearchBar';
import toast from 'react-hot-toast';

const INIT_FILTERS = { semester: '', branch: '', subject: '' };

const Dashboard = () => {
  const { user } = useAuth();
  const [notes, setNotes]       = useState([]);
  const [loading, setLoading]   = useState(true);
  const [search, setSearch]     = useState('');
  const [filters, setFilters]   = useState(INIT_FILTERS);
  const [page, setPage]         = useState(1);
  const [total, setTotal]       = useState(0);
  const [pages, setPages]       = useState(1);
  const [stats, setStats]       = useState({ total: 0 });

  const fetchNotes = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, limit: 12, ...filters };
      if (search) params.search = search;
      const { data } = await API.get('/notes', { params });
      setNotes(data.notes);
      setTotal(data.total);
      setPages(data.pages);
      setStats({ total: data.total });
    } catch {
      toast.error('Failed to load notes');
    } finally {
      setLoading(false);
    }
  }, [page, filters, search]);

  useEffect(() => {
    const timer = setTimeout(fetchNotes, 300);
    return () => clearTimeout(timer);
  }, [fetchNotes]);

  // Reset to page 1 when filters/search change
  useEffect(() => { setPage(1); }, [filters, search]);

  const handleVoteUpdate = (updatedNote) => {
    setNotes((prev) => prev.map((n) => (n._id === updatedNote._id ? updatedNote : n)));
  };

  return (
    <main className="bg-background overflow-hidden min-h-screen relative pt-20">
      {/* Decorative Ambient Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/5 blur-[120px] rounded-full pointer-events-none"></div>
      <div className="absolute top-1/3 -right-64 w-[600px] h-[600px] bg-primary-container/5 blur-[150px] rounded-full pointer-events-none"></div>

      {/* Browse Section */}
      <section className="px-6 py-12 max-w-7xl mx-auto relative z-10">
        
        {/* Header Area */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-10 text-center md:text-left"
        >
          <h1 className="font-headline text-4xl md:text-5xl font-bold tracking-tight text-on-surface mb-2">
            Resource <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary-container">Dashboard</span>
          </h1>
          <p className="text-on-surface-variant font-body">Browse, filter, and discover academic materials.</p>
        </motion.div>

        {/* Search and Filter Container */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="space-y-4 mb-10 backdrop-blur-md bg-surface-container-low/30 border border-outline-variant/20 rounded-2xl p-4 shadow-xl"
        >
          <SearchBar value={search} onChange={setSearch} />
          <NoteFilter
            filters={filters}
            onChange={setFilters}
            onReset={() => setFilters(INIT_FILTERS)}
          />
        </motion.div>

        {/* Results Container */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="backdrop-blur-xl bg-surface-container-low/40 border border-outline-variant/20 rounded-3xl p-6 md:p-8 shadow-2xl relative"
        >
          {/* Results header */}
          <div className="flex items-center justify-between mb-8 border-b border-outline-variant/10 pb-4">
            <h2 className="font-headline font-bold text-on-surface uppercase tracking-wider text-sm flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
              {loading ? 'Fetching records...' : `${total} Record${total !== 1 ? 's' : ''} retrieved`}
            </h2>
            {user && (
              <Link to="/upload">
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-gradient-to-br from-primary to-primary-container text-on-primary px-5 py-2.5 rounded-full font-headline font-bold text-sm neon-glow shadow-[0_0_15px_rgba(0,230,118,0.3)] flex items-center gap-1.5"
                >
                  <FiUpload size={14} /> Upload Note
                </motion.button>
              </Link>
            )}
          </div>

          {/* Notes grid */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="bg-surface-container-lowest/50 border border-outline-variant/10 p-5 rounded-2xl animate-pulse">
                  <div className="h-4 bg-outline-variant/10 rounded mb-3 w-3/4" />
                  <div className="h-3 bg-outline-variant/10 rounded mb-5 w-1/2" />
                  <div className="flex gap-2 mb-5">
                    <div className="h-6 w-16 bg-outline-variant/10 rounded-full" />
                    <div className="h-6 w-12 bg-outline-variant/10 rounded-full" />
                  </div>
                  <div className="h-px bg-outline-variant/10 mb-4" />
                  <div className="flex justify-between items-center">
                    <div className="h-3 bg-outline-variant/10 rounded w-1/3" />
                    <div className="h-4 w-12 bg-outline-variant/10 rounded-full" />
                  </div>
                </div>
              ))}
            </div>
          ) : notes.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-24 bg-surface-container-lowest/50 border border-outline-variant/10 rounded-3xl relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-surface-container-lowest/20 pointer-events-none"></div>
              <div className="w-20 h-20 rounded-2xl bg-surface-container-highest/50 flex items-center justify-center mx-auto mb-6 text-on-surface-variant relative z-10 shadow-inner">
                <FiBookOpen className="text-3xl opacity-50" />
              </div>
              <h3 className="font-headline text-2xl font-bold text-on-surface mb-2 relative z-10">No records found</h3>
              <p className="text-on-surface-variant text-base font-body max-w-sm mx-auto relative z-10">We couldn't find any notes matching your current criteria. Try adjusting your search filters.</p>
              {user && (
                <Link to="/upload" className="inline-block mt-8 relative z-10">
                   <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-primary text-on-primary px-6 py-3 rounded-full font-headline font-bold text-sm shadow-[0_0_20px_rgba(0,230,118,0.2)] flex items-center gap-2"
                  >
                    <FiUpload size={16} /> Upload the first note
                  </motion.button>
                </Link>
              )}
            </motion.div>
          ) : (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            >
              {notes.map((note) => (
                <NoteCard key={note._id} note={note} onVoteUpdate={handleVoteUpdate} />
              ))}
            </motion.div>
          )}

          {/* Pagination */}
          {pages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-12">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="w-10 h-10 rounded-full flex items-center justify-center border border-outline-variant/30 text-on-surface-variant hover:bg-surface-container-high disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
              >
                <FiChevronLeft />
              </motion.button>
              {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  key={p}
                  onClick={() => setPage(p)}
                  className={`w-10 h-10 rounded-full text-sm font-bold font-headline transition-all ${
                    p === page
                      ? 'bg-primary text-on-primary shadow-[0_0_15px_rgba(0,230,118,0.4)]'
                      : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high border border-transparent hover:border-outline-variant/30'
                  }`}
                >
                  {p}
                </motion.button>
              ))}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setPage((p) => Math.min(pages, p + 1))}
                disabled={page === pages}
                className="w-10 h-10 rounded-full flex items-center justify-center border border-outline-variant/30 text-on-surface-variant hover:bg-surface-container-high disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
              >
                <FiChevronRight />
              </motion.button>
            </div>
          )}
        </motion.div>
      </section>
    </main>
  );
};

export default Dashboard;


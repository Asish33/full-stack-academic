import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { FiUpload, FiBookOpen, FiTrendingUp, FiUsers, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
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
    <div className="min-h-screen">
      {/* Browse Section */}
      <section className="px-6 py-12 max-w-7xl mx-auto">
        <div className="space-y-4 mb-6">
          <SearchBar value={search} onChange={setSearch} />
          <NoteFilter
            filters={filters}
            onChange={setFilters}
            onReset={() => setFilters(INIT_FILTERS)}
          />
        </div>

        {/* Results header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-headline font-bold text-on-surface-variant uppercase tracking-wider text-sm">
            {loading ? 'Loading...' : `${total} note${total !== 1 ? 's' : ''} found`}
          </h2>
          {user && (
            <Link to="/upload" className="bg-primary text-on-primary px-5 py-2 rounded-full font-headline font-bold text-sm hover:scale-105 transition-all shadow-[0_0_15px_rgba(0,230,118,0.2)] flex items-center gap-1.5">
              <FiUpload size={14} /> Upload
            </Link>
          )}
        </div>

        {/* Notes grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="glass p-5 animate-pulse">
                <div className="h-4 bg-white/5 rounded mb-3 w-3/4" />
                <div className="h-3 bg-white/5 rounded mb-4 w-1/2" />
                <div className="flex gap-2 mb-4">
                  <div className="h-5 w-16 bg-white/5 rounded-full" />
                  <div className="h-5 w-12 bg-white/5 rounded-full" />
                </div>
                <div className="h-px bg-white/5 mb-3" />
                <div className="h-3 bg-white/5 rounded w-2/3" />
              </div>
            ))}
          </div>
        ) : notes.length === 0 ? (
          <div className="text-center py-20 bg-surface-container-low border border-outline-variant/10 rounded-2xl">
            <div className="w-16 h-16 rounded-2xl bg-surface-container-highest flex items-center justify-center mx-auto mb-4 text-on-surface-variant">
              <FiBookOpen className="text-2xl" />
            </div>
            <h3 className="font-headline font-bold text-on-surface mb-1">No notes found</h3>
            <p className="text-on-surface-variant text-sm font-body">Try adjusting your search or filters</p>
            {user && (
              <Link to="/upload" className="bg-primary text-on-primary px-5 py-2.5 rounded-full font-headline font-bold text-sm hover:scale-105 transition-all shadow-[0_0_15px_rgba(0,230,118,0.2)] inline-flex items-center gap-2 mt-6">
                <FiUpload size={14} /> Upload the first note
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {notes.map((note) => (
              <NoteCard key={note._id} note={note} onVoteUpdate={handleVoteUpdate} />
            ))}
          </div>
        )}

        {/* Pagination */}
        {pages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-8">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="btn-outline p-2 disabled:opacity-30"
            >
              <FiChevronLeft />
            </button>
            {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`w-9 h-9 rounded-xl text-sm font-bold font-headline transition-all ${
                  p === page
                    ? 'bg-primary text-on-primary shadow-lg shadow-primary/30'
                    : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-highest'
                }`}
              >
                {p}
              </button>
            ))}
            <button
              onClick={() => setPage((p) => Math.min(pages, p + 1))}
              disabled={page === pages}
              className="btn-outline p-2 disabled:opacity-30"
            >
              <FiChevronRight />
            </button>
          </div>
        )}
      </section>
    </div>
  );
};

export default Dashboard;

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

const Home = () => {
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
      {/* Hero Section */}
      <section className="relative overflow-hidden py-16 px-4">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary-500/8 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-violet-500/8 rounded-full blur-3xl" />
        </div>

        <div className="max-w-4xl mx-auto text-center relative">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-500/10 border border-primary-500/20 text-primary-400 text-sm font-medium mb-6 animate-fade-in">
            <FiTrendingUp size={13} />
            {total > 0 ? `${total} notes shared by students` : 'Student Notes Exchange Portal'}
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4 leading-tight animate-slide-up">
            Find & Share{' '}
            <span className="text-gradient">Study Notes</span>
            <br />with Your Peers
          </h1>

          <p className="text-slate-400 text-lg mb-8 max-w-2xl mx-auto animate-slide-up">
            A centralized repository for PDF notes, question papers, and study guides — organized by semester, branch, and subject.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center animate-slide-up">
            {user ? (
              <Link to="/upload" className="btn-primary flex items-center justify-center gap-2 py-3 px-8 text-base">
                <FiUpload /> Upload Your Notes
              </Link>
            ) : (
              <>
                <Link to="/register" className="btn-primary flex items-center justify-center gap-2 py-3 px-8 text-base">
                  <FiUsers /> Join the Community
                </Link>
                <Link to="/login" className="btn-outline flex items-center justify-center gap-2 py-3 px-8 text-base">
                  Sign In
                </Link>
              </>
            )}
          </div>

          {/* Stats bar */}
          <div className="flex justify-center gap-8 mt-10 animate-fade-in">
            {[
              { label: 'Notes Shared', value: total || '0' },
              { label: 'Subjects', value: '50+' },
              { label: 'Branches', value: '7' },
            ].map(({ label, value }) => (
              <div key={label} className="text-center">
                <div className="text-2xl font-bold text-gradient">{value}</div>
                <div className="text-slate-500 text-xs">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Browse Section */}
      <section className="page-wrapper">
        <div className="space-y-4 mb-6">
          <SearchBar value={search} onChange={setSearch} />
          <NoteFilter
            filters={filters}
            onChange={setFilters}
            onReset={() => setFilters(INIT_FILTERS)}
          />
        </div>

        {/* Results header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-slate-300 text-sm">
            {loading ? 'Loading...' : `${total} note${total !== 1 ? 's' : ''} found`}
          </h2>
          {user && (
            <Link to="/upload" className="btn-primary text-sm py-2 flex items-center gap-1.5">
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
          <div className="text-center py-20">
            <div className="w-16 h-16 rounded-2xl bg-surface-800 flex items-center justify-center mx-auto mb-4">
              <FiBookOpen className="text-slate-600 text-2xl" />
            </div>
            <h3 className="text-slate-400 font-medium mb-1">No notes found</h3>
            <p className="text-slate-600 text-sm">Try adjusting your search or filters</p>
            {user && (
              <Link to="/upload" className="btn-primary inline-flex items-center gap-2 mt-4 text-sm">
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
                className={`w-9 h-9 rounded-xl text-sm font-medium transition-all ${
                  p === page
                    ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/30'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
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

export default Home;

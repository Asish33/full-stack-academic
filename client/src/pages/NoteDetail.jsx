import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  FiThumbsUp, FiThumbsDown, FiDownload, FiArrowLeft,
  FiUser, FiClock, FiFileText, FiImage, FiTrash2, FiExternalLink, FiBookOpen
} from 'react-icons/fi';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';
import toast from 'react-hot-toast';

const NoteDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [note, setNote]       = useState(null);
  const [loading, setLoading] = useState(true);
  const [userVote, setUserVote] = useState(null);
  const [voting, setVoting]   = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const fetchNote = async () => {
      try {
        const { data } = await API.get(`/notes/${id}`);
        setNote(data);
      } catch {
        toast.error('Note not found');
        navigate('/dashboard');
      } finally {
        setLoading(false);
      }
    };
    fetchNote();
  }, [id, navigate]);

  useEffect(() => {
    const fetchVote = async () => {
      if (!user || !note) return;
      try {
        const { data } = await API.get(`/votes/${note._id}/my`);
        setUserVote(data.userVote);
      } catch {}
    };
    fetchVote();
  }, [user, note]);

  const handleVote = async (voteType) => {
    if (!user) { toast.error('Please login to vote'); return; }
    if (voting) return;
    setVoting(true);
    try {
      const { data } = await API.post(`/votes/${note._id}`, { voteType });
      setNote(data.note);
      setUserVote(data.userVote);
    } catch {
      toast.error('Failed to register vote');
    } finally {
      setVoting(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this note?')) return;
    setDeleting(true);
    try {
      await API.delete(`/notes/${note._id}`);
      toast.success('Note deleted');
      navigate('/dashboard');
    } catch {
      toast.error('Failed to delete note');
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <main className="bg-background min-h-screen relative pt-20">
        <div className="max-w-4xl mx-auto px-6 py-12">
          <div className="bg-surface-container-lowest/50 border border-outline-variant/10 p-8 rounded-3xl animate-pulse space-y-6">
            <div className="h-8 bg-outline-variant/10 rounded w-3/4 mb-4" />
            <div className="h-5 bg-outline-variant/10 rounded w-1/2" />
            <div className="flex gap-3 pt-4">
              {[1,2,3].map(i => <div key={i} className="h-8 w-20 bg-outline-variant/10 rounded-full" />)}
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (!note) return null;
  const score = note.upvotes - note.downvotes;
  const isOwner = user && note.uploadedBy?._id === user._id;

  return (
    <main className="bg-background overflow-hidden min-h-screen relative pt-20">
      {/* Decorative Ambient Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/5 blur-[120px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-primary-container/5 blur-[150px] rounded-full pointer-events-none translate-y-1/2"></div>

      <section className="px-6 py-12 max-w-4xl mx-auto relative z-10">
        {/* Back button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Link to="/dashboard" className="inline-flex items-center gap-2 text-on-surface-variant hover:text-primary text-sm mb-8 transition-colors group font-label uppercase tracking-widest font-bold">
            <FiArrowLeft className="group-hover:-translate-x-1 transition-transform" /> Return to Dashboard
          </Link>
        </motion.div>

        {/* Main card */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="backdrop-blur-xl bg-surface-container-low/40 border border-outline-variant/20 rounded-3xl p-8 md:p-12 shadow-2xl relative overflow-hidden mb-6"
        >
          {/* Subtle inner top glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent"></div>

          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-8">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold font-label uppercase tracking-wider ${note.fileType === 'pdf' ? 'bg-error/20 text-error border border-error/30' : 'bg-secondary/20 text-secondary border border-secondary/30'}`}>
                  {note.fileType === 'pdf' ? <FiFileText size={12} /> : <FiImage size={12} />}
                  {note.fileType?.toUpperCase()}
                </span>
                {isOwner && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/20 text-primary border border-primary/30 text-xs font-bold font-label uppercase tracking-wider">
                    Your resource
                  </span>
                )}
              </div>
              <h1 className="font-headline text-3xl md:text-4xl font-bold text-on-surface mb-2 tracking-tight">{note.title}</h1>
              <p className="text-on-surface-variant font-body text-lg">{note.subject}</p>
            </div>

            {isOwner && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleDelete}
                disabled={deleting}
                className="self-start md:self-auto bg-error/10 hover:bg-error/20 text-error border border-error/30 px-5 py-2.5 rounded-full flex items-center gap-2 flex-shrink-0 font-bold font-headline transition-colors"
              >
                {deleting ? <div className="w-4 h-4 border-2 border-error border-t-transparent rounded-full animate-spin" /> : <FiTrash2 />}
                Delete
              </motion.button>
            )}
          </div>

          {/* Metadata badges */}
          <div className="flex flex-wrap gap-2 mb-8 p-4 bg-surface-container-highest/30 rounded-2xl border border-outline-variant/10">
            <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-surface-container border border-outline-variant/20 text-on-surface-variant text-xs font-bold font-label uppercase tracking-widest">
              Semester {note.semester}
            </span>
            <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold font-label uppercase tracking-widest">
              {note.branch}
            </span>
            {note.subjectCode && (
              <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-surface-container border border-outline-variant/20 text-on-surface-variant text-xs font-bold font-label uppercase tracking-widest">
                <FiBookOpen size={12} className="opacity-70"/> {note.subjectCode}
              </span>
            )}
          </div>

          {/* Uploader + Date */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-6 py-6 border-t border-b border-outline-variant/10 mb-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary-container flex items-center justify-center text-on-primary text-sm font-bold shadow-[0_0_10px_rgba(0,230,118,0.3)]">
                {note.uploadedBy?.name?.charAt(0)?.toUpperCase() || '?'}
              </div>
              <div>
                <p className="text-xs font-label uppercase tracking-wider text-on-surface-variant/70 mb-0.5">Uploaded By</p>
                <p className="text-on-surface font-bold font-body">{note.uploadedBy?.name || 'Unknown'}</p>
              </div>
            </div>
            <div className="hidden sm:block w-px h-10 bg-outline-variant/20"></div>
            <div>
              <p className="text-xs font-label uppercase tracking-wider text-on-surface-variant/70 mb-0.5 flex items-center gap-1"><FiClock size={10} /> Date</p>
              <p className="text-on-surface font-body font-medium">
                {new Date(note.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
              </p>
            </div>
          </div>

          {/* Action Area: Votes & Buttons */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
            
            {/* Vote section */}
            <div className="flex items-center gap-4 bg-surface-container-highest/20 p-2 rounded-2xl border border-outline-variant/10">
              <span className="text-on-surface-variant/70 text-xs font-label uppercase tracking-widest font-bold px-2">Quality</span>
              <div className="flex items-center gap-1">
                <motion.button
                  whileHover={!voting ? { scale: 1.05 } : {}}
                  whileTap={!voting ? { scale: 0.95 } : {}}
                  onClick={() => handleVote('upvote')}
                  disabled={voting}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-bold font-headline transition-all ${
                    userVote === 'upvote'
                      ? 'border-primary/50 bg-primary/20 text-primary shadow-[0_0_15px_rgba(0,230,118,0.2)]'
                      : 'border-transparent hover:border-outline-variant/30 text-on-surface-variant hover:bg-surface-container-highest'
                  }`}
                >
                  <FiThumbsUp size={16} /> {note.upvotes}
                </motion.button>
                <motion.button
                  whileHover={!voting ? { scale: 1.05 } : {}}
                  whileTap={!voting ? { scale: 0.95 } : {}}
                  onClick={() => handleVote('downvote')}
                  disabled={voting}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-bold font-headline transition-all ${
                    userVote === 'downvote'
                      ? 'border-error/50 bg-error/20 text-error'
                      : 'border-transparent hover:border-outline-variant/30 text-on-surface-variant hover:bg-surface-container-highest'
                  }`}
                >
                  <FiThumbsDown size={16} /> {note.downvotes}
                </motion.button>
                <div className="w-px h-6 bg-outline-variant/30 mx-2"></div>
                <span className={`px-3 font-bold font-headline text-lg ${score > 0 ? 'text-primary drop-shadow-[0_0_5px_rgba(0,230,118,0.5)]' : score < 0 ? 'text-error' : 'text-on-surface-variant/50'}`}>
                  {score > 0 ? `+${score}` : score}
                </span>
              </div>
            </div>

            {/* Download / View buttons */}
            <div className="flex gap-3">
              <a
                href={note.fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1"
              >
                 <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full bg-surface-container-highest hover:bg-surface-container-high border border-outline-variant/30 text-on-surface px-6 py-3 rounded-full font-headline font-bold text-sm flex items-center justify-center gap-2 transition-colors"
                 >
                   <FiExternalLink /> Open
                 </motion.button>
              </a>
              <a
                href={note.fileUrl}
                download={note.originalName || 'note'}
                className="flex-1"
              >
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full bg-gradient-to-br from-primary to-primary-container text-on-primary px-6 py-3 rounded-full font-headline font-bold text-sm neon-glow shadow-[0_0_15px_rgba(0,230,118,0.3)] flex items-center justify-center gap-2"
                >
                  <FiDownload /> Download
                </motion.button>
              </a>
            </div>
          </div>
        </motion.div>

        {/* Not logged in notice */}
        {!user && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="backdrop-blur-md bg-surface-container-lowest/50 border border-outline-variant/10 p-5 rounded-2xl text-center"
          >
            <p className="text-on-surface-variant font-body">
              <Link to="/login" className="text-primary hover:text-primary-container font-bold underline decoration-primary/30 underline-offset-4 transition-colors">Sign in</Link>
              {' '}to vote on this resource
            </p>
          </motion.div>
        )}
      </section>
    </main>
  );
};

export default NoteDetail;

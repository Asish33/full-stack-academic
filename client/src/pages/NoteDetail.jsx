import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  FiThumbsUp, FiThumbsDown, FiDownload, FiArrowLeft,
  FiUser, FiClock, FiFileText, FiImage, FiTrash2, FiExternalLink
} from 'react-icons/fi';
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
        navigate('/');
      } finally {
        setLoading(false);
      }
    };
    fetchNote();
  }, [id]);

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
      navigate('/');
    } catch {
      toast.error('Failed to delete note');
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="page-wrapper max-w-3xl mx-auto">
        <div className="glass p-8 animate-pulse space-y-4">
          <div className="h-6 bg-white/5 rounded w-3/4" />
          <div className="h-4 bg-white/5 rounded w-1/2" />
          <div className="flex gap-2">
            {[1,2,3].map(i => <div key={i} className="h-6 w-16 bg-white/5 rounded-full" />)}
          </div>
        </div>
      </div>
    );
  }

  if (!note) return null;
  const score = note.upvotes - note.downvotes;
  const isOwner = user && note.uploadedBy?._id === user._id;

  return (
    <div className="page-wrapper max-w-3xl mx-auto animate-slide-up">
      {/* Back button */}
      <Link to="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-slate-200 text-sm mb-6 transition-colors group">
        <FiArrowLeft className="group-hover:-translate-x-1 transition-transform" /> Back to notes
      </Link>

      {/* Main card */}
      <div className="glass p-8 mb-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 mb-6">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className={note.fileType === 'pdf' ? 'badge-pdf' : 'badge-image'}>
                {note.fileType === 'pdf' ? <FiFileText size={11} /> : <FiImage size={11} />}
                {note.fileType?.toUpperCase()}
              </span>
              {isOwner && (
                <span className="badge bg-primary-500/20 text-primary-400 border border-primary-500/30 text-xs">
                  Your note
                </span>
              )}
            </div>
            <h1 className="text-2xl font-bold text-slate-100 mb-1">{note.title}</h1>
            <p className="text-slate-400">{note.subject}</p>
          </div>

          {isOwner && (
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="btn-danger flex items-center gap-2 flex-shrink-0"
            >
              {deleting ? <div className="w-4 h-4 border-2 border-red-400 border-t-transparent rounded-full animate-spin" /> : <FiTrash2 />}
              Delete
            </button>
          )}
        </div>

        {/* Metadata badges */}
        <div className="flex flex-wrap gap-2 mb-6">
          <span className="badge-semester">Semester {note.semester}</span>
          <span className="badge-branch">{note.branch}</span>
          {note.subjectCode && (
            <span className="badge bg-slate-700/60 text-slate-300 border border-slate-600/40">
              📋 {note.subjectCode}
            </span>
          )}
        </div>

        {/* Uploader + Date */}
        <div className="flex items-center gap-4 py-4 border-t border-b border-white/5 mb-6">
          <div className="flex items-center gap-2 text-slate-400 text-sm">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-violet-600 flex items-center justify-center text-white text-xs font-bold">
              {note.uploadedBy?.name?.charAt(0)?.toUpperCase() || '?'}
            </div>
            <span>
              Uploaded by <span className="text-slate-200 font-medium">{note.uploadedBy?.name || 'Unknown'}</span>
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-500 text-sm">
            <FiClock size={13} />
            {new Date(note.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
          </div>
        </div>

        {/* Vote section */}
        <div className="flex items-center gap-4 mb-6">
          <span className="text-slate-400 text-sm font-medium">Was this helpful?</span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleVote('upvote')}
              disabled={voting}
              className={`vote-btn-up px-4 py-2 rounded-xl border text-sm font-medium transition-all ${
                userVote === 'upvote'
                  ? 'active border-emerald-500/30 bg-emerald-500/20 text-emerald-400'
                  : 'border-white/10'
              }`}
            >
              <FiThumbsUp size={15} /> {note.upvotes} Upvote{note.upvotes !== 1 && 's'}
            </button>
            <button
              onClick={() => handleVote('downvote')}
              disabled={voting}
              className={`vote-btn-down px-4 py-2 rounded-xl border text-sm font-medium transition-all ${
                userVote === 'downvote'
                  ? 'active border-red-500/30 bg-red-500/20 text-red-400'
                  : 'border-white/10'
              }`}
            >
              <FiThumbsDown size={15} /> {note.downvotes} Downvote{note.downvotes !== 1 && 's'}
            </button>
            <span className={`ml-2 font-bold text-lg ${score > 0 ? 'text-emerald-400' : score < 0 ? 'text-red-400' : 'text-slate-500'}`}>
              {score > 0 ? `+${score}` : score}
            </span>
          </div>
        </div>

        {/* Download / View buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <a
            href={note.fileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary flex items-center justify-center gap-2 py-3 flex-1"
          >
            <FiExternalLink /> View File
          </a>
          <a
            href={note.fileUrl}
            download={note.originalName || 'note'}
            className="btn-outline flex items-center justify-center gap-2 py-3 flex-1"
          >
            <FiDownload /> Download
          </a>
        </div>
      </div>

      {/* Not logged in notice */}
      {!user && (
        <div className="glass p-4 text-center">
          <p className="text-slate-400 text-sm">
            <Link to="/login" className="text-primary-400 hover:text-primary-300 font-medium">Sign in</Link>
            {' '}to vote on this note
          </p>
        </div>
      )}
    </div>
  );
};

export default NoteDetail;

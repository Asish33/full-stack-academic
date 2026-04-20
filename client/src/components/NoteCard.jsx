import { Link } from 'react-router-dom';
import { FiThumbsUp, FiThumbsDown, FiDownload, FiFileText, FiImage, FiUser, FiClock } from 'react-icons/fi';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';
import toast from 'react-hot-toast';

const NoteCard = ({ note, onVoteUpdate }) => {
  const { user } = useAuth();
  const [voting, setVoting] = useState(false);
  const [localNote, setLocalNote] = useState(note);

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const handleVote = async (voteType, e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) { toast.error('Please login to vote'); return; }
    if (voting) return;
    setVoting(true);
    try {
      const { data } = await API.post(`/votes/${localNote._id}`, { voteType });
      setLocalNote(data.note);
      if (onVoteUpdate) onVoteUpdate(data.note);
    } catch {
      toast.error('Failed to register vote');
    } finally {
      setVoting(false);
    }
  };

  const score = localNote.upvotes - localNote.downvotes;

  return (
    <Link to={`/notes/${localNote._id}`} className="note-card block animate-slide-up">
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-slate-100 text-sm leading-snug truncate">{localNote.title}</h3>
          <p className="text-slate-400 text-xs mt-0.5 truncate">{localNote.subject}</p>
        </div>
        <span className={localNote.fileType === 'pdf' ? 'badge-pdf flex-shrink-0' : 'badge-image flex-shrink-0'}>
          {localNote.fileType === 'pdf' ? <FiFileText size={10} /> : <FiImage size={10} />}
          {localNote.fileType?.toUpperCase()}
        </span>
      </div>

      {/* Badges */}
      <div className="flex flex-wrap gap-1.5 mb-4">
        <span className="badge-semester">Sem {localNote.semester}</span>
        <span className="badge-branch">{localNote.branch}</span>
        {localNote.subjectCode && (
          <span className="badge bg-slate-700/60 text-slate-400 border border-slate-600/40">
            {localNote.subjectCode}
          </span>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-3 border-t border-white/5">
        <div className="flex items-center gap-1 text-slate-500 text-xs">
          <FiUser size={11} />
          <span className="truncate max-w-[80px]">{localNote.uploadedBy?.name || 'Unknown'}</span>
          <span className="mx-1">·</span>
          <FiClock size={11} />
          <span>{formatDate(localNote.createdAt)}</span>
        </div>

        {/* Votes */}
        <div className="flex items-center gap-1" onClick={(e) => e.preventDefault()}>
          <button
            onClick={(e) => handleVote('upvote', e)}
            disabled={voting}
            className="vote-btn-up"
          >
            <FiThumbsUp size={13} />
            <span>{localNote.upvotes}</span>
          </button>
          <span className={`text-xs font-bold px-1 ${score > 0 ? 'text-emerald-400' : score < 0 ? 'text-red-400' : 'text-slate-500'}`}>
            {score > 0 ? `+${score}` : score}
          </span>
          <button
            onClick={(e) => handleVote('downvote', e)}
            disabled={voting}
            className="vote-btn-down"
          >
            <FiThumbsDown size={13} />
            <span>{localNote.downvotes}</span>
          </button>
        </div>
      </div>
    </Link>
  );
};

export default NoteCard;

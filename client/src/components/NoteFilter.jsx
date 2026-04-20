import { FiFilter, FiX } from 'react-icons/fi';

const SEMESTERS = ['1', '2', '3', '4', '5', '6', '7', '8'];
const BRANCHES  = ['CSE', 'ECE', 'ME', 'CE', 'IT', 'EEE', 'Other'];

const NoteFilter = ({ filters, onChange, onReset }) => {
  const hasFilters = filters.semester || filters.branch || filters.subject;

  return (
    <div className="glass p-4">
      <div className="flex items-center gap-2 mb-4">
        <FiFilter className="text-primary-400" />
        <span className="text-slate-300 font-semibold text-sm">Filter Notes</span>
        {hasFilters && (
          <button
            onClick={onReset}
            className="ml-auto flex items-center gap-1 text-xs text-slate-500 hover:text-red-400 transition-colors"
          >
            <FiX size={13} /> Clear all
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Semester */}
        <div>
          <label className="block text-xs text-slate-500 mb-1.5 font-medium">Semester</label>
          <select
            value={filters.semester}
            onChange={(e) => onChange({ ...filters, semester: e.target.value })}
            className="select-field text-sm"
          >
            <option value="">All Semesters</option>
            {SEMESTERS.map((s) => (
              <option key={s} value={s}>Semester {s}</option>
            ))}
          </select>
        </div>

        {/* Branch */}
        <div>
          <label className="block text-xs text-slate-500 mb-1.5 font-medium">Branch</label>
          <select
            value={filters.branch}
            onChange={(e) => onChange({ ...filters, branch: e.target.value })}
            className="select-field text-sm"
          >
            <option value="">All Branches</option>
            {BRANCHES.map((b) => (
              <option key={b} value={b}>{b}</option>
            ))}
          </select>
        </div>

        {/* Subject */}
        <div>
          <label className="block text-xs text-slate-500 mb-1.5 font-medium">Subject</label>
          <input
            type="text"
            placeholder="e.g. Data Structures"
            value={filters.subject}
            onChange={(e) => onChange({ ...filters, subject: e.target.value })}
            className="input-field text-sm"
          />
        </div>
      </div>

      {/* Active filter pills */}
      {hasFilters && (
        <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-white/5">
          {filters.semester && (
            <span className="badge-semester flex items-center gap-1">
              Sem {filters.semester}
              <button onClick={() => onChange({ ...filters, semester: '' })} className="ml-1 hover:text-white">
                <FiX size={10} />
              </button>
            </span>
          )}
          {filters.branch && (
            <span className="badge-branch flex items-center gap-1">
              {filters.branch}
              <button onClick={() => onChange({ ...filters, branch: '' })} className="ml-1 hover:text-white">
                <FiX size={10} />
              </button>
            </span>
          )}
          {filters.subject && (
            <span className="badge bg-slate-700/60 text-slate-400 border border-slate-600/40 flex items-center gap-1">
              {filters.subject}
              <button onClick={() => onChange({ ...filters, subject: '' })} className="ml-1 hover:text-white">
                <FiX size={10} />
              </button>
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default NoteFilter;

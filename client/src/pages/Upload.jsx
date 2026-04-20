import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiUpload, FiFile, FiX, FiCheck } from 'react-icons/fi';
import API from '../api/axios';
import toast from 'react-hot-toast';

const SEMESTERS = ['1','2','3','4','5','6','7','8'];
const BRANCHES  = ['CSE','ECE','ME','CE','IT','EEE','Other'];

const Upload = () => {
  const navigate = useNavigate();
  const fileRef  = useRef();
  const [loading, setLoading] = useState(false);
  const [drag, setDrag]       = useState(false);
  const [file, setFile]       = useState(null);
  const [form, setForm]       = useState({
    title: '', subject: '', subjectCode: '', semester: '', branch: '',
  });

  const handleFile = (f) => {
    if (!f) return;
    const allowed = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
    if (!allowed.includes(f.type)) { toast.error('Only PDF and image files allowed'); return; }
    if (f.size > 20 * 1024 * 1024) { toast.error('File must be under 20MB'); return; }
    setFile(f);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDrag(false);
    handleFile(e.dataTransfer.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) { toast.error('Please select a file'); return; }
    if (!form.title || !form.subject || !form.semester || !form.branch) {
      toast.error('Please fill all required fields'); return;
    }

    const formData = new FormData();
    formData.append('file', file);
    Object.entries(form).forEach(([k, v]) => formData.append(k, v));

    setLoading(true);
    try {
      await API.post('/notes', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      toast.success('Note uploaded successfully! 🎉');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Upload failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-wrapper max-w-2xl mx-auto animate-slide-up">
      {/* Header */}
      <div className="mb-8 text-center">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-primary-500 to-violet-600 shadow-lg shadow-primary-500/30 mb-4">
          <FiUpload className="text-white text-xl" />
        </div>
        <h1 className="text-3xl font-bold text-gradient mb-2">Upload Notes</h1>
        <p className="text-slate-400 text-sm">Share your study materials with the community</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* File Drop Zone */}
        <div
          onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
          onDragLeave={() => setDrag(false)}
          onDrop={handleDrop}
          onClick={() => !file && fileRef.current.click()}
          className={`glass rounded-2xl p-8 text-center transition-all duration-300 cursor-pointer ${
            drag
              ? 'border-primary-500/60 bg-primary-500/5 shadow-lg shadow-primary-500/10'
              : file
              ? 'border-emerald-500/40 bg-emerald-500/5'
              : 'hover:border-primary-500/30 hover:bg-white/5'
          }`}
        >
          <input
            ref={fileRef}
            type="file"
            accept=".pdf,image/*"
            className="hidden"
            onChange={(e) => handleFile(e.target.files[0])}
          />

          {file ? (
            <div className="flex items-center justify-between px-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                  <FiFile className="text-emerald-400" />
                </div>
                <div className="text-left">
                  <p className="text-slate-200 text-sm font-medium truncate max-w-[200px]">{file.name}</p>
                  <p className="text-slate-500 text-xs">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="badge bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs">
                  <FiCheck size={10} /> Ready
                </span>
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); setFile(null); }}
                  className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-all"
                >
                  <FiX size={15} />
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="w-12 h-12 rounded-2xl bg-surface-800 flex items-center justify-center mx-auto mb-3">
                <FiUpload className={`text-xl ${drag ? 'text-primary-400' : 'text-slate-500'}`} />
              </div>
              <p className="text-slate-300 font-medium mb-1">
                {drag ? 'Drop it here!' : 'Drag & drop or click to upload'}
              </p>
              <p className="text-slate-500 text-xs">PDF or Image · Max 20MB</p>
            </>
          )}
        </div>

        {/* Form Fields */}
        <div className="glass p-6 space-y-4">
          <h2 className="text-slate-200 font-semibold mb-4">Note Details</h2>

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1.5">
              Title <span className="text-red-400">*</span>
            </label>
            <input
              id="upload-title"
              type="text"
              placeholder="e.g. Data Structures Unit 3 Notes"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="input-field"
              required
            />
          </div>

          {/* Subject + Code */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1.5">
                Subject <span className="text-red-400">*</span>
              </label>
              <input
                id="upload-subject"
                type="text"
                placeholder="Data Structures"
                value={form.subject}
                onChange={(e) => setForm({ ...form, subject: e.target.value })}
                className="input-field"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1.5">Subject Code</label>
              <input
                id="upload-code"
                type="text"
                placeholder="CS301"
                value={form.subjectCode}
                onChange={(e) => setForm({ ...form, subjectCode: e.target.value })}
                className="input-field uppercase"
              />
            </div>
          </div>

          {/* Semester + Branch */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1.5">
                Semester <span className="text-red-400">*</span>
              </label>
              <select
                id="upload-semester"
                value={form.semester}
                onChange={(e) => setForm({ ...form, semester: e.target.value })}
                className="select-field"
                required
              >
                <option value="">Select...</option>
                {SEMESTERS.map((s) => <option key={s} value={s}>Semester {s}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1.5">
                Branch <span className="text-red-400">*</span>
              </label>
              <select
                id="upload-branch"
                value={form.branch}
                onChange={(e) => setForm({ ...form, branch: e.target.value })}
                className="select-field"
                required
              >
                <option value="">Select...</option>
                {BRANCHES.map((b) => <option key={b} value={b}>{b}</option>)}
              </select>
            </div>
          </div>
        </div>

        {/* Submit */}
        <button
          id="upload-submit"
          type="submit"
          disabled={loading}
          className="btn-primary w-full py-3.5 text-base flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Uploading...
            </>
          ) : (
            <><FiUpload /> Upload Note</>
          )}
        </button>
      </form>
    </div>
  );
};

export default Upload;

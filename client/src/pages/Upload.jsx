import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiUpload, FiFile, FiX, FiCheck } from 'react-icons/fi';
import { motion } from 'framer-motion';
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
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Upload failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="bg-background overflow-hidden min-h-screen relative pt-20">
      {/* Decorative Ambient Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-primary/10 blur-[120px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-primary-container/5 blur-[150px] rounded-full pointer-events-none"></div>

      <section className="px-6 py-12 max-w-3xl mx-auto relative z-10">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-10 text-center"
        >
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-primary-container shadow-[0_0_20px_rgba(0,230,118,0.3)] mb-6">
            <FiUpload className="text-on-primary text-2xl" />
          </div>
          <h1 className="font-headline text-4xl md:text-5xl font-bold tracking-tight text-on-surface mb-3">
            Upload <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary-container">Notes</span>
          </h1>
          <p className="text-on-surface-variant font-body text-lg">Contribute to the academic ecosystem.</p>
        </motion.div>

        <motion.form 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          onSubmit={handleSubmit} 
          className="space-y-8"
        >
          {/* File Drop Zone */}
          <div
            onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
            onDragLeave={() => setDrag(false)}
            onDrop={handleDrop}
            onClick={() => !file && fileRef.current.click()}
            className={`backdrop-blur-md rounded-3xl p-10 text-center transition-all duration-300 cursor-pointer border-2 border-dashed ${
              drag
                ? 'border-primary bg-primary/5 shadow-[0_0_30px_rgba(0,230,118,0.15)]'
                : file
                ? 'border-primary/50 bg-surface-container-low/40 shadow-lg'
                : 'border-outline-variant/30 bg-surface-container-lowest/30 hover:border-primary/40 hover:bg-surface-container-lowest/50'
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
              <motion.div 
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="flex items-center justify-between p-4 bg-surface-container-highest/30 rounded-2xl border border-outline-variant/20"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                    <FiFile className="text-primary text-xl" />
                  </div>
                  <div className="text-left">
                    <p className="text-on-surface text-base font-bold font-body truncate max-w-[200px] md:max-w-[300px]">{file.name}</p>
                    <p className="text-on-surface-variant text-xs font-label uppercase tracking-wider mt-1">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="hidden sm:flex items-center gap-1 px-3 py-1 rounded-full bg-primary/20 text-primary border border-primary/30 text-xs font-label uppercase font-bold tracking-tight">
                    <FiCheck size={12} /> Ready
                  </span>
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); setFile(null); }}
                    className="p-2 rounded-full text-on-surface-variant hover:text-error hover:bg-error/10 transition-colors"
                  >
                    <FiX size={18} />
                  </button>
                </div>
              </motion.div>
            ) : (
              <>
                <div className="w-16 h-16 rounded-full bg-surface-container-highest/50 flex items-center justify-center mx-auto mb-4 border border-outline-variant/10">
                  <FiUpload className={`text-2xl ${drag ? 'text-primary' : 'text-on-surface-variant/70'}`} />
                </div>
                <p className="text-on-surface font-headline font-bold text-lg mb-2">
                  {drag ? 'Drop file to initiate upload' : 'Select or drop file here'}
                </p>
                <p className="text-on-surface-variant/60 text-sm font-label uppercase tracking-widest">PDF or Images up to 20MB</p>
              </>
            )}
          </div>

          {/* Form Fields */}
          <div className="backdrop-blur-xl bg-surface-container-low/40 border border-outline-variant/20 rounded-3xl p-8 shadow-xl space-y-6">
            <h2 className="font-headline text-xl font-bold text-on-surface mb-2">Resource Metadata</h2>
            
            {/* Title */}
            <div>
              <label className="block text-xs font-label uppercase font-bold tracking-wider text-on-surface-variant mb-2">
                Title <span className="text-error">*</span>
              </label>
              <input
                id="upload-title"
                type="text"
                placeholder="e.g. Advanced Data Structures Notes"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full bg-surface-container-highest/30 border border-outline-variant/20 rounded-xl px-4 py-3.5 text-on-surface font-body placeholder-on-surface-variant/40 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all duration-200"
                required
              />
            </div>

            {/* Subject + Code */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-label uppercase font-bold tracking-wider text-on-surface-variant mb-2">
                  Subject <span className="text-error">*</span>
                </label>
                <input
                  id="upload-subject"
                  type="text"
                  placeholder="Data Structures"
                  value={form.subject}
                  onChange={(e) => setForm({ ...form, subject: e.target.value })}
                  className="w-full bg-surface-container-highest/30 border border-outline-variant/20 rounded-xl px-4 py-3.5 text-on-surface font-body placeholder-on-surface-variant/40 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all duration-200"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-label uppercase font-bold tracking-wider text-on-surface-variant mb-2">Subject Code</label>
                <input
                  id="upload-code"
                  type="text"
                  placeholder="CS301"
                  value={form.subjectCode}
                  onChange={(e) => setForm({ ...form, subjectCode: e.target.value })}
                  className="w-full bg-surface-container-highest/30 border border-outline-variant/20 rounded-xl px-4 py-3.5 text-on-surface font-body uppercase placeholder-on-surface-variant/40 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all duration-200"
                />
              </div>
            </div>

            {/* Semester + Branch */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-label uppercase font-bold tracking-wider text-on-surface-variant mb-2">
                  Semester <span className="text-error">*</span>
                </label>
                <select
                  id="upload-semester"
                  value={form.semester}
                  onChange={(e) => setForm({ ...form, semester: e.target.value })}
                  className="w-full bg-surface-container-highest/30 border border-outline-variant/20 rounded-xl px-4 py-3.5 text-on-surface font-body focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all duration-200 cursor-pointer appearance-none"
                  required
                >
                  <option value="" className="bg-surface-container">Select Semester</option>
                  {SEMESTERS.map((s) => <option key={s} value={s} className="bg-surface-container">Semester {s}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-label uppercase font-bold tracking-wider text-on-surface-variant mb-2">
                  Branch <span className="text-error">*</span>
                </label>
                <select
                  id="upload-branch"
                  value={form.branch}
                  onChange={(e) => setForm({ ...form, branch: e.target.value })}
                  className="w-full bg-surface-container-highest/30 border border-outline-variant/20 rounded-xl px-4 py-3.5 text-on-surface font-body focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all duration-200 cursor-pointer appearance-none"
                  required
                >
                  <option value="" className="bg-surface-container">Select Branch</option>
                  {BRANCHES.map((b) => <option key={b} value={b} className="bg-surface-container">{b}</option>)}
                </select>
              </div>
            </div>
          </div>

          {/* Submit */}
          <motion.button
            whileHover={!loading ? { scale: 1.02 } : {}}
            whileTap={!loading ? { scale: 0.98 } : {}}
            id="upload-submit"
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-xl bg-gradient-to-br from-primary to-primary-container text-on-primary font-headline font-bold text-lg neon-glow shadow-[0_0_20px_rgba(0,230,118,0.3)] flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed transition-all"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-on-primary/30 border-t-on-primary rounded-full animate-spin" />
                Processing Upload...
              </>
            ) : (
              <><FiUpload /> Complete Upload</>
            )}
          </motion.button>
        </motion.form>
      </section>
    </main>
  );
};

export default Upload;

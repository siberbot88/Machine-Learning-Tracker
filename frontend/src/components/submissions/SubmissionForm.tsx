import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { createSubmission } from '../../api/submissions';
import { Upload, Link2, FileText, X } from 'lucide-react';

interface SubmissionFormProps {
  taskId: string;
  onSuccess: () => void;
  onClose: () => void;
}

interface FormFields {
  title: string;
  submission_type: string;
  url: string;
  reflection: string;
}

export default function SubmissionForm({ taskId, onSuccess, onClose }: SubmissionFormProps) {
  const { register, handleSubmit, watch, formState: { errors } } = useForm<FormFields>();
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const submissionType = watch('submission_type', 'link');

  const onSubmit = async (data: FormFields) => {
    setLoading(true);
    setError('');
    try {
      const formData = new FormData();
      formData.append('title', data.title);
      formData.append('submission_type', data.submission_type);
      if (data.url) formData.append('url', data.url);
      if (data.reflection) formData.append('reflection', data.reflection);
      if (file) formData.append('file', file);

      await createSubmission(taskId, formData);
      onSuccess();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to submit');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <div className="bg-surface rounded-2xl border border-border shadow-xl w-full max-w-lg mx-4 animate-scaleIn">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h3 className="text-lg font-semibold text-text">New Submission</h3>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-surface-alt text-text-muted">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
          {error && (
            <div className="bg-primary-50 text-primary text-sm px-4 py-3 rounded-xl border border-primary-light">{error}</div>
          )}

          <div>
            <label className="block text-sm font-medium text-text mb-1.5">Title *</label>
            <input
              {...register('title', { required: 'Title is required' })}
              className="w-full px-4 py-2.5 rounded-xl border border-border text-sm"
              placeholder="Submission title..."
            />
            {errors.title && <p className="text-xs text-primary mt-1">{errors.title.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-text mb-1.5">Type *</label>
            <select
              {...register('submission_type', { required: true })}
              className="w-full px-4 py-2.5 rounded-xl border border-border text-sm"
            >
              <option value="link">Link</option>
              <option value="pdf">PDF</option>
              <option value="word">Word Document</option>
              <option value="image">Image</option>
              <option value="notebook">Notebook</option>
              <option value="zip">ZIP Archive</option>
              <option value="other">Other</option>
            </select>
          </div>

          {submissionType === 'link' ? (
            <div>
              <label className="block text-sm font-medium text-text mb-1.5">URL</label>
              <div className="relative">
                <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                <input
                  {...register('url')}
                  type="url"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border text-sm"
                  placeholder="https://..."
                />
              </div>
            </div>
          ) : (
            <div>
              <label className="block text-sm font-medium text-text mb-1.5">File Upload</label>
              <div
                className={`border-2 border-dashed rounded-xl p-6 text-center transition-colors cursor-pointer ${
                  file ? 'border-accent bg-accent-50' : 'border-border hover:border-primary'
                }`}
                onClick={() => document.getElementById('file-input')?.click()}
              >
                <input
                  id="file-input"
                  type="file"
                  className="hidden"
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.zip,.txt,.ipynb"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                />
                {file ? (
                  <div className="flex items-center justify-center gap-2">
                    <FileText className="w-5 h-5 text-accent" />
                    <span className="text-sm text-text">{file.name}</span>
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); setFile(null); }}
                      className="p-1 rounded hover:bg-slate-100 text-text-muted"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ) : (
                  <>
                    <Upload className="w-8 h-8 text-text-muted mx-auto mb-2" />
                    <p className="text-sm text-text-muted">Click to upload or drag and drop</p>
                    <p className="text-xs text-text-muted mt-1">PDF, DOC, JPG, PNG, ZIP (Max 10MB)</p>
                  </>
                )}
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-text mb-1.5">Reflection</label>
            <textarea
              {...register('reflection')}
              rows={3}
              className="w-full px-4 py-2.5 rounded-xl border border-border text-sm resize-none"
              placeholder="What did you learn? Any reflections..."
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 rounded-xl border border-border text-sm font-medium text-text-secondary hover:bg-surface-alt transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2.5 rounded-xl bg-primary text-white text-sm font-medium hover:bg-primary-hover disabled:opacity-50 transition-colors"
            >
              {loading ? 'Submitting...' : 'Submit'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

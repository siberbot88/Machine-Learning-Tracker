import { useState } from 'react';
import type { Submission } from '../../types';
import { formatDate, formatFileSize } from '../../lib/utils';
import { ExternalLink, FileText, Trash2, CheckCircle, Bot, Sparkles, Loader2 } from 'lucide-react';
import { deleteSubmission, generateAiReview } from '../../api/submissions';

interface SubmissionListProps {
  submissions: Submission[];
  onUpdate: () => void;
}

export default function SubmissionList({ submissions, onUpdate }: SubmissionListProps) {
  const [reviewingId, setReviewingId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this submission?')) return;
    try {
      await deleteSubmission(id);
      onUpdate();
    } catch (error: any) {
      console.error(error);
      alert('Failed to delete submission: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleReview = async (id: string) => {
    setReviewingId(id);
    try {
      await generateAiReview(id);
      onUpdate();
    } catch (error: any) {
      console.error(error);
      alert('Failed to review submission: ' + (error.response?.data?.message || error.message));
    } finally {
      setReviewingId(null);
    }
  };

  if (submissions.length === 0) {
    return (
      <div className="text-center py-8 text-text-muted text-sm border border-dashed rounded-xl border-border">
        No submissions yet.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {submissions.map((s) => (
        <div key={s.id} className="bg-surface-alt rounded-2xl border border-border p-4 shadow-sm hover:border-primary/30 transition-colors group">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <FileText className="w-5 h-5 text-primary shrink-0" />
                <h4 className="text-sm font-bold text-text truncate">{s.title || 'Submission'}</h4>
                <span className="text-xs px-2 py-0.5 bg-primary-50 dark:bg-primary-900/30 text-primary uppercase font-medium rounded-md border border-primary/20 tracking-wide">{s.submission_type}</span>
                {s.reviewed && (
                  <span className="text-xs px-2 py-0.5 bg-accent-50 dark:bg-accent-900/30 text-accent rounded-md border border-accent/20 flex items-center gap-1 font-medium">
                    <CheckCircle className="w-3.5 h-3.5" /> Reviewed
                  </span>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-2 text-xs text-text-muted">
                <span>Submitted: {formatDate(s.submitted_at)}</span>
                {s.original_file_name && (
                  <span className="truncate max-w-[200px]" title={s.original_file_name}>
                    {s.original_file_name} ({formatFileSize(s.file_size)})
                  </span>
                )}
                {s.score !== null && (
                  <span className="font-bold px-2.5 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
                    Score: {s.score}/100
                  </span>
                )}
              </div>

              {s.reflection && (
                <div className="mt-3 bg-white/50 dark:bg-slate-900/50 p-2.5 rounded-lg text-sm text-text-secondary border border-border">
                  <span className="font-semibold text-text mb-1 block">Reflection:</span>
                  {s.reflection}
                </div>
              )}

              {s.feedback && (
                <div className="mt-3 bg-indigo-50/50 dark:bg-indigo-900/10 p-3 rounded-xl border border-indigo-100 dark:border-indigo-900/30 flex gap-3 items-start">
                  <Bot className="w-5 h-5 text-indigo-500 shrink-0 mt-0.5" />
                  <div>
                    <h5 className="text-xs font-bold text-indigo-700 dark:text-indigo-400 mb-1">AI Feedback</h5>
                    <p className="text-sm text-indigo-900 dark:text-indigo-200">
                      {s.feedback}
                    </p>
                  </div>
                </div>
              )}

              {!s.reviewed && (
                <div className="mt-4">
                  <button
                    onClick={() => handleReview(s.id)}
                    disabled={reviewingId === s.id}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white dark:bg-slate-800 border border-border hover:border-indigo-300 dark:hover:border-indigo-700 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors text-sm font-medium text-text-secondary disabled:opacity-50"
                  >
                    {reviewingId === s.id ? (
                      <Loader2 className="w-4 h-4 animate-spin text-indigo-500" />
                    ) : (
                      <Sparkles className="w-4 h-4" />
                    )}
                    {reviewingId === s.id ? 'Analyzing...' : 'Auto Review with AI'}
                  </button>
                </div>
              )}
            </div>

            <div className="flex items-center gap-1 shrink-0 ml-3">
              {s.url && (
                <a
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 rounded-lg hover:bg-primary-50 text-text-muted hover:text-primary"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}
              {s.file_url && (
                <a
                  href={s.file_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 rounded-lg hover:bg-primary-50 text-text-muted hover:text-primary"
                >
                  <FileText className="w-4 h-4" />
                </a>
              )}
              <button
                onClick={() => handleDelete(s.id)}
                className="p-1.5 rounded-lg hover:bg-slate-100 text-text-muted hover:text-slate-600"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

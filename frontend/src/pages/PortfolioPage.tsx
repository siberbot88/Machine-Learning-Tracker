import { useState, useEffect } from 'react';
import { getPortfolio } from '../api/tasks';
import type { Task } from '../types';
import { Loader2, Briefcase, ExternalLink, FileText, Download, CheckCircle2, AlertCircle } from 'lucide-react';
import { useTranslation } from '../lib/i18n';

export default function PortfolioPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { t } = useTranslation();

  useEffect(() => {
    fetchPortfolio();
  }, []);

  const fetchPortfolio = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getPortfolio();
      setTasks(data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load portfolio');
    } finally {
      setLoading(false);
    }
  };

  // Group tasks by week_number
  const tasksByWeek = tasks.reduce((acc, task) => {
    if (!acc[task.week_number]) {
      acc[task.week_number] = [];
    }
    acc[task.week_number].push(task);
    return acc;
  }, {} as Record<number, Task[]>);

  const sortedWeeks = Object.keys(tasksByWeek).map(Number).sort((a, b) => a - b);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-6 rounded-2xl flex items-center gap-3">
        <AlertCircle className="w-6 h-6 shrink-0" />
        <p>{error}</p>
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="bg-surface rounded-3xl p-12 text-center border border-border shadow-sm">
        <div className="w-16 h-16 bg-primary-50 dark:bg-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Briefcase className="w-8 h-8 text-primary" />
        </div>
        <h2 className="text-xl font-bold text-text mb-2">Portfolio is empty</h2>
        <p className="text-text-muted">You haven't completed any tasks yet. Complete tasks on your roadmap to see them here.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 bg-primary rounded-2xl shadow-lg flex items-center justify-center shadow-primary/30 text-white shrink-0">
          <Briefcase className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-text">My Portfolio</h1>
          <p className="text-sm text-text-muted mt-1">Review your completed tasks and submissions.</p>
        </div>
      </div>

      <div className="space-y-12">
        {sortedWeeks.map((week) => (
          <div key={week} className="relative">
            {/* Week Divider */}
            <div className="flex items-center gap-4 mb-6 sticky top-0 bg-surface-alt/90 backdrop-blur-md py-4 z-10 -mx-4 px-4 sm:mx-0 sm:px-0">
              <h2 className="text-xl font-bold text-text shrink-0 bg-gradient-to-r from-primary to-primary-hover bg-clip-text text-transparent">
                Week {week}
              </h2>
              <div className="h-px bg-border flex-grow mt-1" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {tasksByWeek[week].map((task) => (
                <div key={task.id} className="bg-surface rounded-3xl border border-border overflow-hidden shadow-sm hover:shadow-md transition-shadow group flex flex-col">
                  {/* Task Header info */}
                  <div className="p-6 border-b border-border bg-slate-50/50 dark:bg-slate-900/50 flex-grow">
                    <div className="flex justify-between items-start gap-4 mb-3">
                      <h3 className="font-bold text-text text-lg leading-tight group-hover:text-primary transition-colors">
                        {task.title}
                      </h3>
                      <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                    </div>
                    {task.description && (
                      <p className="text-sm text-text-muted line-clamp-2">{task.description}</p>
                    )}
                  </div>

                  {/* Previews */}
                  {(task.submissions && task.submissions.length > 0) ? (
                    <div className="p-4 bg-surface space-y-3">
                      <p className="text-xs font-semibold text-text-muted uppercase tracking-wider px-2">Submissions ({task.submissions.length})</p>
                      <div className="space-y-2">
                        {task.submissions.map((sub) => (
                          <div key={sub.id} className="flex items-center justify-between p-3 rounded-2xl border border-border bg-surface-alt hover:border-primary/30 transition-colors">
                            <div className="flex items-center gap-3 overflow-hidden">
                              {sub.submission_type === 'image' ? (
                                <div className="w-10 h-10 rounded-xl bg-slate-200 dark:bg-slate-800 overflow-hidden shrink-0 border border-border">
                                  {sub.file_url ? (
                                    <img src={sub.file_url} alt="preview" className="w-full h-full object-cover" />
                                  ) : (
                                    <FileText className="w-5 h-5 text-text-muted m-auto" />
                                  )}
                                </div>
                              ) : (
                                <div className="w-10 h-10 rounded-xl bg-primary-50 dark:bg-slate-800 flex items-center justify-center shrink-0 border border-primary/10">
                                  <FileText className="w-5 h-5 text-primary" />
                                </div>
                              )}
                              <div className="min-w-0">
                                <p className="text-sm font-medium text-text truncate">
                                  {sub.title || sub.original_file_name || 'Submission'}
                                </p>
                                <p className="text-xs text-text-muted">
                                  {sub.submission_type.toUpperCase()}
                                </p>
                              </div>
                            </div>
                            
                            {/* Action Button */}
                            {sub.url ? (
                              <a 
                                href={sub.url} 
                                target="_blank" 
                                rel="noreferrer"
                                className="p-2 rounded-xl text-primary hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors"
                                title="View Link"
                              >
                                <ExternalLink className="w-4 h-4" />
                              </a>
                            ) : sub.file_url ? (
                              <a 
                                href={sub.file_url} 
                                target="_blank" 
                                rel="noreferrer"
                                className="p-2 rounded-xl text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-colors"
                                title="Download / View File"
                                download
                              >
                                <Download className="w-4 h-4" />
                              </a>
                            ) : null}
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                     <div className="p-6 bg-surface flex items-center justify-center text-sm text-text-muted italic border-t border-border">
                        Completed without submission
                     </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

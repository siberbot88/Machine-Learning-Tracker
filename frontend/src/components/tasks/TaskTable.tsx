import { useNavigate } from 'react-router-dom';
import type { Task } from '../../types';
import { TaskStatusBadge, TaskPriorityBadge } from './TaskStatusBadge';
import { formatDate } from '../../lib/utils';
import { toggleTask, updateTask } from '../../api/tasks';
import { ChevronRight, Paperclip } from 'lucide-react';
import { useState } from 'react';
import type { TaskStatus } from '../../types';

interface TaskTableProps {
  tasks: Task[];
  onUpdate: () => void;
}

export default function TaskTable({ tasks, onUpdate }: TaskTableProps) {
  const navigate = useNavigate();
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const handleToggle = async (task: Task) => {
    setLoadingId(task.id);
    try {
      await toggleTask(task.id);
      onUpdate();
    } finally {
      setLoadingId(null);
    }
  };

  const handleStatusChange = async (task: Task, newStatus: TaskStatus) => {
    await updateTask(task.id, { status: newStatus });
    onUpdate();
  };

  if (tasks.length === 0) {
    return (
      <div className="bg-surface rounded-2xl border border-border p-12 text-center">
        <p className="text-text-muted text-sm">No tasks found matching your filters.</p>
      </div>
    );
  }

  // Group by week
  const grouped = tasks.reduce((acc, task) => {
    const week = task.week_number;
    if (!acc[week]) acc[week] = [];
    acc[week].push(task);
    return acc;
  }, {} as Record<number, Task[]>);

  return (
    <div className="space-y-6">
      {Object.entries(grouped).map(([week, weekTasks]) => {
        const done = weekTasks.filter(t => t.checkbox_completed).length;
        const total = weekTasks.length;
        const progress = total > 0 ? Math.round((done / total) * 100) : 0;

        return (
          <div key={week} className="bg-surface rounded-2xl border border-border shadow-sm overflow-hidden animate-fadeIn">
            {/* Week header */}
            <div className="px-5 sm:px-6 py-4 border-b border-border-light bg-surface-alt flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-primary bg-primary-50 px-3 py-1 rounded-lg border border-primary-light">
                  Week {week}
                </span>
                <span className="text-sm font-medium text-text-secondary">{weekTasks[0]?.category}</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex-1 sm:w-24 h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full progress-bar-fill transition-all duration-500"
                    style={{ width: `${progress}%`, backgroundColor: progress === 100 ? '#10B981' : '#2563EB' }}
                  />
                </div>
                <span className="text-xs font-medium text-text-muted shrink-0">{done}/{total}</span>
              </div>
            </div>

            {/* Tasks */}
            <div className="divide-y divide-border-light">
              {weekTasks.map((task) => (
                <div
                  key={task.id}
                  className={`flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 px-4 sm:px-6 py-4 hover:bg-surface-alt transition-colors ${
                    task.checkbox_completed ? 'task-done' : ''
                  }`}
                >
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    {/* Checkbox */}
                    <input
                      type="checkbox"
                      checked={task.checkbox_completed}
                      onChange={() => handleToggle(task)}
                      disabled={loadingId === task.id}
                      className="custom-checkbox mt-0.5 sm:mt-0 shrink-0"
                    />

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-medium task-title ${task.checkbox_completed ? '' : 'text-text'}`}>
                        {task.title}
                      </p>
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 mt-1.5">
                        <span className="text-xs text-text-muted whitespace-nowrap">{task.estimated_hours}h</span>
                        {task.submission_required && (
                          <span className="text-xs text-primary flex items-center gap-0.5 whitespace-nowrap">
                            <Paperclip className="w-3 h-3" /> Required
                          </span>
                        )}
                        <span className="text-xs text-text-muted whitespace-nowrap">Due: {formatDate(task.due_date)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Badges / Actions */}
                  <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 pl-8 sm:pl-0">
                    {/* Status dropdown */}
                    <select
                      value={task.status}
                      onChange={(e) => handleStatusChange(task, e.target.value as TaskStatus)}
                      className="text-xs px-2 py-1.5 rounded-lg border border-border bg-surface shrink-0"
                    >
                      <option value="not_started">Not Started</option>
                      <option value="in_progress">In Progress</option>
                      <option value="done">Done</option>
                      <option value="blocked">Blocked</option>
                    </select>

                    {/* Priority */}
                    <TaskPriorityBadge priority={task.priority} />

                    {/* Status badge */}
                    <TaskStatusBadge status={task.status} />

                    {/* Detail button */}
                    <button
                      onClick={() => navigate(`/tasks/${task.id}`)}
                      className="p-2 -mr-2 sm:mr-0 ml-auto sm:ml-0 rounded-lg hover:bg-surface-alt text-text-muted hover:text-primary transition-colors shrink-0"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

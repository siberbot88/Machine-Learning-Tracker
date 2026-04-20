import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getTask, updateTask, toggleTask } from '../api/tasks';
import { getSubmissions } from '../api/submissions';
import type { Task, Submission } from '../types';
import { TaskStatusBadge, TaskPriorityBadge } from '../components/tasks/TaskStatusBadge';
import SubmissionList from '../components/submissions/SubmissionList';
import SubmissionForm from '../components/submissions/SubmissionForm';
import { formatDate } from '../lib/utils';
import {
  ArrowLeft, Clock, Calendar, Paperclip, Plus, Save, Loader2
} from 'lucide-react';
import type { TaskStatus } from '../types';

export default function TaskDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [task, setTask] = useState<Task | null>(null);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [showSubmitForm, setShowSubmitForm] = useState(false);
  const [answerSummary, setAnswerSummary] = useState('');
  const [notes, setNotes] = useState('');
  const [blockers, setBlockers] = useState('');
  const [saving, setSaving] = useState(false);

  const fetchData = async () => {
    if (!id) return;
    try {
      const [t, s] = await Promise.all([getTask(id), getSubmissions(id)]);
      setTask(t);
      setSubmissions(s);
      setAnswerSummary(t.answer_summary || '');
      setNotes(t.notes || '');
      setBlockers(t.blockers || '');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, [id]);

  const handleSave = async () => {
    if (!task) return;
    setSaving(true);
    try {
      await updateTask(task.id, { answer_summary: answerSummary, notes, blockers });
      await fetchData();
    } finally {
      setSaving(false);
    }
  };

  const handleToggle = async () => {
    if (!task) return;
    await toggleTask(task.id);
    await fetchData();
  };

  const handleStatusChange = async (status: TaskStatus) => {
    if (!task) return;
    await updateTask(task.id, { status });
    await fetchData();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  if (!task) {
    return <div className="text-center py-12 text-text-muted">Task not found.</div>;
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Back button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-sm text-text-muted hover:text-text transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back
      </button>

      {/* Header card */}
      <div className="bg-surface rounded-2xl border border-border p-6 shadow-sm">
        <div className="flex items-start gap-4">
          <input
            type="checkbox"
            checked={task.checkbox_completed}
            onChange={handleToggle}
            className="custom-checkbox mt-1"
          />
          <div className="flex-1">
            <h1 className={`text-xl font-bold ${task.checkbox_completed ? 'line-through text-text-muted' : 'text-text'}`}>
              {task.title}
            </h1>
            <p className="text-sm text-text-secondary mt-2">{task.description}</p>

            <div className="flex flex-wrap items-center gap-3 mt-4">
              <span className="text-xs font-semibold px-3 py-1 bg-primary-50 text-primary rounded-lg border border-primary-light">
                Week {task.week_number}
              </span>
              <span className="text-xs text-text-muted">{task.category}</span>
              <TaskPriorityBadge priority={task.priority} />
              <TaskStatusBadge status={task.status} />
              <select
                value={task.status}
                onChange={(e) => handleStatusChange(e.target.value as TaskStatus)}
                className="text-xs px-2 py-1.5 rounded-lg border border-border bg-surface"
              >
                <option value="not_started">Not Started</option>
                <option value="in_progress">In Progress</option>
                <option value="done">Done</option>
                <option value="blocked">Blocked</option>
              </select>
            </div>

            <div className="flex flex-wrap items-center gap-4 mt-4 text-xs text-text-muted">
              <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {task.estimated_hours}h estimated</span>
              <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> Due: {formatDate(task.due_date)}</span>
              {task.completed_at && <span className="text-accent">Completed: {formatDate(task.completed_at)}</span>}
              {task.submission_required && (
                <span className="flex items-center gap-1 text-primary"><Paperclip className="w-3.5 h-3.5" /> Submission Required</span>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Answer / Summary */}
        <div className="bg-surface rounded-2xl border border-border p-6 shadow-sm">
          <h3 className="text-base font-semibold text-text mb-3">Answer / Deliverable Summary</h3>
          <textarea
            value={answerSummary}
            onChange={(e) => setAnswerSummary(e.target.value)}
            rows={6}
            className="w-full px-4 py-3 rounded-xl border border-border text-sm resize-none"
            placeholder="Write your answer, deliverable summary, or key takeaways..."
          />
        </div>

        {/* Notes */}
        <div className="bg-surface rounded-2xl border border-border p-6 shadow-sm">
          <h3 className="text-base font-semibold text-text mb-3">Notes</h3>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            className="w-full px-4 py-3 rounded-xl border border-border text-sm resize-none mb-3"
            placeholder="Any notes about this task..."
          />
          <h3 className="text-base font-semibold text-text mb-3">Blockers</h3>
          <textarea
            value={blockers}
            onChange={(e) => setBlockers(e.target.value)}
            rows={3}
            className="w-full px-4 py-3 rounded-xl border border-border text-sm resize-none"
            placeholder="What's blocking you? Any difficulties?"
          />
        </div>
      </div>

      {/* Save button */}
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-primary text-white text-sm font-medium hover:bg-primary-hover disabled:opacity-50 transition-colors"
        >
          <Save className="w-4 h-4" /> {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      {/* Submissions */}
      <div className="bg-surface rounded-2xl border border-border p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-semibold text-text">Submissions ({submissions.length})</h3>
          <button
            onClick={() => setShowSubmitForm(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-accent text-white text-sm font-medium hover:bg-accent-hover transition-colors"
          >
            <Plus className="w-4 h-4" /> Add Submission
          </button>
        </div>

        <SubmissionList submissions={submissions} onUpdate={fetchData} />
      </div>

      {/* Submission Modal */}
      {showSubmitForm && (
        <SubmissionForm
          taskId={task.id}
          onSuccess={() => { setShowSubmitForm(false); fetchData(); }}
          onClose={() => setShowSubmitForm(false)}
        />
      )}
    </div>
  );
}

import { format, formatDistanceToNow } from 'date-fns';

export function formatDate(date: string | null): string {
  if (!date) return '-';
  return format(new Date(date), 'dd MMM yyyy');
}

export function formatRelative(date: string | null): string {
  if (!date) return '-';
  return formatDistanceToNow(new Date(date), { addSuffix: true });
}

export function formatFileSize(bytes: number | null): string {
  if (!bytes) return '-';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

// All badges use only the 3-color palette (blue, emerald, slate)
export function getStatusColor(status: string): string {
  switch (status) {
    case 'done': return 'bg-accent-light text-accent';
    case 'in_progress': return 'bg-primary-light text-primary';
    case 'blocked': return 'bg-slate-100 text-slate-500';
    default: return 'bg-slate-100 text-text-muted';
  }
}

export function getStatusLabel(status: string): string {
  switch (status) {
    case 'not_started': return 'Not Started';
    case 'in_progress': return 'In Progress';
    case 'done': return 'Done';
    case 'blocked': return 'Blocked';
    default: return status;
  }
}

export function getPriorityColor(priority: string): string {
  switch (priority) {
    case 'high': return 'bg-primary-light text-primary';
    case 'medium': return 'bg-accent-light text-accent';
    case 'low': return 'bg-slate-100 text-text-muted';
    default: return 'bg-slate-100 text-text-muted';
  }
}

export function getPriorityLabel(p: string): string {
  return p.charAt(0).toUpperCase() + p.slice(1);
}

export const WEEK_CATEGORIES = [
  'Python Fundamentals',
  'Math & Statistics',
  'ML Concepts',
  'Classic Algorithms',
  'Evaluation Metrics',
  'Data Preprocessing',
  'Advanced ML',
  'ML Project',
  'Deep Learning Basics',
  'DL Training',
  'Specialization (CV/NLP)',
  'Final Project',
];

// Chart colors (3-color system)
export const CHART_COLORS = {
  primary: '#2563EB',
  accent: '#10B981',
  neutral: '#94A3B8',
  primaryLight: '#DBEAFE',
  accentLight: '#D1FAE5',
};

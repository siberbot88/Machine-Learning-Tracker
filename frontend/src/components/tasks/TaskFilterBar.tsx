import type { TaskFilters } from '../../types';
import { Search } from 'lucide-react';
import { WEEK_CATEGORIES } from '../../lib/utils';

interface TaskFilterBarProps {
  filters: TaskFilters;
  onChange: (filters: TaskFilters) => void;
}

export default function TaskFilterBar({ filters, onChange }: TaskFilterBarProps) {
  const update = (key: keyof TaskFilters, value: string) => {
    onChange({ ...filters, [key]: value || undefined });
  };

  return (
    <div className="bg-surface rounded-2xl border border-border p-4 shadow-sm">
      <div className="flex flex-wrap items-center gap-3">
        {/* Search */}
        <div className="relative flex-1 min-w-[200px] w-full sm:w-auto">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
          <input
            type="text"
            placeholder="Search tasks..."
            value={filters.search || ''}
            onChange={(e) => update('search', e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border text-sm bg-surface placeholder:text-text-muted"
          />
        </div>

        {/* Week */}
        <select
          value={filters.week || ''}
          onChange={(e) => update('week', e.target.value)}
          className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl border border-border text-sm bg-surface text-text min-w-[120px]"
        >
          <option value="">All Weeks</option>
          {Array.from({ length: 12 }, (_, i) => (
            <option key={i + 1} value={i + 1}>Week {i + 1}</option>
          ))}
        </select>

        {/* Category */}
        <select
          value={filters.category || ''}
          onChange={(e) => update('category', e.target.value)}
          className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl border border-border text-sm bg-surface text-text min-w-[160px]"
        >
          <option value="">All Categories</option>
          {WEEK_CATEGORIES.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>

        {/* Status */}
        <select
          value={filters.status || ''}
          onChange={(e) => update('status', e.target.value)}
          className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl border border-border text-sm bg-surface text-text min-w-[140px]"
        >
          <option value="">All Statuses</option>
          <option value="not_started">Not Started</option>
          <option value="in_progress">In Progress</option>
          <option value="done">Done</option>
          <option value="blocked">Blocked</option>
        </select>

        {/* Priority */}
        <select
          value={filters.priority || ''}
          onChange={(e) => update('priority', e.target.value)}
          className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl border border-border text-sm bg-surface text-text min-w-[130px]"
        >
          <option value="">All Priorities</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
      </div>
    </div>
  );
}

import { getStatusColor, getStatusLabel, getPriorityColor, getPriorityLabel } from '../../lib/utils';
import type { TaskStatus } from '../../types';

export function TaskStatusBadge({ status }: { status: TaskStatus }) {
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium ${getStatusColor(status)}`}>
      {getStatusLabel(status)}
    </span>
  );
}

export function TaskPriorityBadge({ priority }: { priority: string }) {
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium ${getPriorityColor(priority)}`}>
      {getPriorityLabel(priority)}
    </span>
  );
}

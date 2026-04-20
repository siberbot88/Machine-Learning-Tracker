import { useEffect, useState, useCallback } from 'react';
import { getTasks } from '../api/tasks';
import type { Task, TaskFilters } from '../types';
import TaskFilterBar from '../components/tasks/TaskFilterBar';
import TaskTable from '../components/tasks/TaskTable';
import { Loader2 } from 'lucide-react';

export default function RoadmapPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<TaskFilters>({});

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getTasks(filters);
      setTasks(data);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-text">Roadmap</h1>
        <p className="text-sm text-text-muted mt-1">12-week Machine Learning & Deep Learning learning path</p>
      </div>

      <TaskFilterBar filters={filters} onChange={setFilters} />

      {loading ? (
        <div className="flex items-center justify-center h-40">
          <Loader2 className="w-8 h-8 text-secondary animate-spin" />
        </div>
      ) : (
        <TaskTable tasks={tasks} onUpdate={fetchTasks} />
      )}
    </div>
  );
}

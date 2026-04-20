import { useEffect, useState } from 'react';
import { getDashboard } from '../api/dashboard';
import type { DashboardData } from '../types';
import { useNavigate } from 'react-router-dom';
import { WEEK_CATEGORIES } from '../lib/utils';
import { formatDate } from '../lib/utils';
import { TaskStatusBadge, TaskPriorityBadge } from '../components/tasks/TaskStatusBadge';

// Charts
import WeeklyBarChart from '../components/charts/WeeklyBarChart';
import CompletionRing from '../components/charts/CompletionRing';
import StatusDistribution from '../components/charts/StatusDistribution';
import ProgressTrend from '../components/charts/ProgressTrend';
import CategoryProgress from '../components/charts/CategoryProgress';

// Icons only (no emojis)
import {
  CheckCircle2, ListTodo, TrendingUp, CalendarDays,
  FileUp, AlertTriangle, Loader2, Clock, Target,
  BarChart3, ArrowUpRight, ArrowDownRight, Minus,
  Zap, Paperclip, ChevronRight
} from 'lucide-react';

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      const d = await getDashboard();
      setData(d);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  if (!data) return null;

  // KPI calculations
  const completionRate = data.total_tasks > 0 ? data.overall_progress : 0;
  const avgTasksPerWeek = (data.completed_tasks / Math.max(data.current_week, 1)).toFixed(1);
  const estimatedWeeksLeft = data.completed_tasks > 0
    ? Math.ceil((data.total_tasks - data.completed_tasks) / (data.completed_tasks / Math.max(data.current_week, 1)))
    : 12;
  const submissionCompletionRate = data.submission_required_count > 0
    ? Math.round((data.total_submissions / data.submission_required_count) * 100)
    : 0;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text">Dashboard</h1>
          <p className="text-sm text-text-muted mt-1">Performance overview and key metrics</p>
        </div>
        <div className="text-xs text-text-muted flex items-center gap-1.5 bg-surface px-3 py-1.5 rounded-lg border border-border">
          <CalendarDays className="w-3.5 h-3.5" />
          Week {data.current_week} of 12
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KpiCard
          title="Completion Rate"
          value={`${completionRate}%`}
          detail={`${data.completed_tasks} of ${data.total_tasks} tasks`}
          icon={<Target className="w-5 h-5" />}
          trend={completionRate > 0 ? 'up' : 'neutral'}
        />
        <KpiCard
          title="Avg. Tasks / Week"
          value={avgTasksPerWeek}
          detail={`Week ${data.current_week} active`}
          icon={<BarChart3 className="w-5 h-5" />}
          trend={Number(avgTasksPerWeek) >= 3 ? 'up' : Number(avgTasksPerWeek) > 0 ? 'neutral' : 'down'}
        />
        <KpiCard
          title="Est. Weeks Left"
          value={`${estimatedWeeksLeft}`}
          detail={`${data.total_estimated_hours}h total estimated`}
          icon={<Clock className="w-5 h-5" />}
          trend="neutral"
        />
        <KpiCard
          title="Submission Rate"
          value={`${submissionCompletionRate}%`}
          detail={`${data.total_submissions} of ${data.submission_required_count} submitted`}
          icon={<Paperclip className="w-5 h-5" />}
          trend={submissionCompletionRate >= 50 ? 'up' : submissionCompletionRate > 0 ? 'neutral' : 'down'}
        />
      </div>

      {/* Quick Stats Strip */}
      <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
        <MiniStat label="Total" value={data.total_tasks} icon={<ListTodo className="w-4 h-4" />} />
        <MiniStat label="Done" value={data.completed_tasks} icon={<CheckCircle2 className="w-4 h-4" />} accent />
        <MiniStat label="In Progress" value={data.in_progress_tasks} icon={<TrendingUp className="w-4 h-4" />} />
        <MiniStat label="Not Started" value={data.not_started_tasks} icon={<Minus className="w-4 h-4" />} />
        <MiniStat label="Blocked" value={data.blocked_tasks} icon={<AlertTriangle className="w-4 h-4" />} />
        <MiniStat label="High Priority" value={data.high_priority_count} icon={<Zap className="w-4 h-4" />} />
      </div>

      {/* Charts Row 1: Completion Ring + Status Distribution + Progress Trend */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <CompletionRing completed={data.completed_tasks} total={data.total_tasks} />
        <StatusDistribution
          notStarted={data.not_started_tasks}
          inProgress={data.in_progress_tasks}
          done={data.completed_tasks}
          blocked={data.blocked_tasks}
        />
        <div className="bg-surface rounded-2xl border border-border p-6 shadow-sm">
          <h3 className="text-base font-semibold text-text mb-4">Current Week KPIs</h3>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-medium text-text-secondary">Week {data.current_week} Progress</span>
                <span className="text-sm font-bold text-primary">{data.current_week_progress}%</span>
              </div>
              <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full progress-bar-fill"
                  style={{ width: `${data.current_week_progress}%`, backgroundColor: '#2563EB' }}
                />
              </div>
            </div>
            <div className="pt-2 space-y-3">
              <KpiRow icon={<Target className="w-4 h-4" />} label="Overall Completion" value={`${data.overall_progress}%`} />
              <KpiRow icon={<FileUp className="w-4 h-4" />} label="Total Submissions" value={`${data.total_submissions}`} />
              <KpiRow icon={<CheckCircle2 className="w-4 h-4" />} label="Tasks Done" value={`${data.completed_tasks}/${data.total_tasks}`} />
              <KpiRow icon={<Clock className="w-4 h-4" />} label="Hours Estimated" value={`${data.total_estimated_hours}h`} />
            </div>
          </div>
        </div>
      </div>

      {/* Charts Row 2: Weekly Bar Chart + Progress Trend */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <WeeklyBarChart weeks={data.weekly_progress} currentWeek={data.current_week} />
        <ProgressTrend weeks={data.weekly_progress} />
      </div>

      {/* Category Progress */}
      <CategoryProgress weeks={data.weekly_progress} categories={WEEK_CATEGORIES} />

      {/* Bottom: Pending Tasks + Recent Submissions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pending Tasks */}
        <div className="bg-surface rounded-2xl border border-border p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-semibold text-text">Pending Tasks</h3>
            <button
              onClick={() => navigate('/roadmap')}
              className="text-xs text-primary font-medium flex items-center gap-1 hover:underline"
            >
              View All <ChevronRight className="w-3 h-3" />
            </button>
          </div>
          {data.incomplete_tasks.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-text-muted">
              <CheckCircle2 className="w-10 h-10 mb-2 text-accent" />
              <p className="text-sm">All tasks completed!</p>
            </div>
          ) : (
            <div className="space-y-2">
              {data.incomplete_tasks.map((task) => (
                <div
                  key={task.id}
                  onClick={() => navigate(`/tasks/${task.id}`)}
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-surface-alt cursor-pointer transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-text truncate">{task.title}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-text-muted">Week {task.week_number}</span>
                      <span className="text-xs text-text-muted">Due: {formatDate(task.due_date)}</span>
                    </div>
                  </div>
                  <TaskPriorityBadge priority={task.priority} />
                  <TaskStatusBadge status={task.status} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Submissions */}
        <div className="bg-surface rounded-2xl border border-border p-6 shadow-sm">
          <h3 className="text-base font-semibold text-text mb-4">Recent Submissions</h3>
          {data.recent_submissions.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-text-muted">
              <FileUp className="w-10 h-10 mb-2" />
              <p className="text-sm">No submissions yet</p>
            </div>
          ) : (
            <div className="space-y-2">
              {data.recent_submissions.map((s) => (
                <div key={s.id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-surface-alt transition-colors">
                  <div className="w-8 h-8 bg-primary-50 rounded-lg flex items-center justify-center">
                    <FileUp className="w-4 h-4 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-text">{s.title}</p>
                    <p className="text-xs text-text-muted">{s.submission_type}</p>
                  </div>
                  {s.reviewed && (
                    <span className="text-xs px-2 py-1 bg-accent-light text-accent rounded-md">Reviewed</span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ===== Sub-components (no emojis, only icons) =====

function KpiCard({ title, value, detail, icon, trend }: {
  title: string;
  value: string;
  detail: string;
  icon: React.ReactNode;
  trend: 'up' | 'down' | 'neutral';
}) {
  const TrendIcon = trend === 'up' ? ArrowUpRight : trend === 'down' ? ArrowDownRight : Minus;
  const trendColor = trend === 'up' ? 'text-accent' : trend === 'down' ? 'text-slate-400' : 'text-text-muted';

  return (
    <div className="bg-surface rounded-2xl border border-border p-5 shadow-sm animate-fadeIn">
      <div className="flex items-center justify-between mb-3">
        <div className="w-9 h-9 bg-primary-50 rounded-xl flex items-center justify-center text-primary">
          {icon}
        </div>
        <TrendIcon className={`w-4 h-4 ${trendColor}`} />
      </div>
      <p className="text-2xl font-bold text-text">{value}</p>
      <p className="text-xs text-text-muted mt-1">{title}</p>
      <p className="text-xs text-text-muted mt-0.5">{detail}</p>
    </div>
  );
}

function MiniStat({ label, value, icon, accent }: {
  label: string;
  value: number;
  icon: React.ReactNode;
  accent?: boolean;
}) {
  return (
    <div className="bg-surface rounded-xl border border-border px-4 py-3 flex items-center gap-3 shadow-sm">
      <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
        accent ? 'bg-accent-light text-accent' : 'bg-primary-50 text-primary'
      }`}>
        {icon}
      </div>
      <div>
        <p className="text-lg font-bold text-text leading-none">{value}</p>
        <p className="text-xs text-text-muted mt-0.5">{label}</p>
      </div>
    </div>
  );
}

function KpiRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2 text-text-secondary">
        {icon}
        <span className="text-xs">{label}</span>
      </div>
      <span className="text-sm font-semibold text-text">{value}</span>
    </div>
  );
}

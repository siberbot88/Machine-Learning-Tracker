import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell
} from 'recharts';
import type { WeekProgress } from '../../types';
import { CHART_COLORS } from '../../lib/utils';

interface WeeklyBarChartProps {
  weeks: WeekProgress[];
  currentWeek: number;
}

export default function WeeklyBarChart({ weeks, currentWeek }: WeeklyBarChartProps) {
  const data = weeks.map(w => ({
    name: `W${w.week}`,
    completed: w.completed,
    remaining: w.total - w.completed,
    total: w.total,
    progress: w.progress,
    isCurrent: w.week === currentWeek,
  }));

  return (
    <div className="bg-surface rounded-2xl border border-border p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-base font-semibold text-text">Weekly Completion</h3>
          <p className="text-xs text-text-muted mt-0.5">Tasks completed vs remaining per week</p>
        </div>
        <div className="flex items-center gap-4 text-xs">
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm" style={{ backgroundColor: CHART_COLORS.accent }} />
            Completed
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm" style={{ backgroundColor: CHART_COLORS.primaryLight }} />
            Remaining
          </span>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={240}>
        <BarChart data={data} barGap={2}>
          <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
          <XAxis
            dataKey="name"
            tick={{ fontSize: 11, fill: '#94A3B8' }}
            axisLine={{ stroke: '#E2E8F0' }}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 11, fill: '#94A3B8' }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            contentStyle={{ borderRadius: 12, border: '1px solid #E2E8F0', fontSize: 12 }}
            formatter={(value: any, name: any) => [value, name === 'completed' ? 'Completed' : 'Remaining']}
          />
          <Bar dataKey="completed" stackId="a" radius={[0, 0, 0, 0]} fill={CHART_COLORS.accent}>
            {data.map((entry, i) => (
              <Cell key={i} fill={entry.progress === 100 ? CHART_COLORS.accent : CHART_COLORS.accent} />
            ))}
          </Bar>
          <Bar dataKey="remaining" stackId="a" radius={[4, 4, 0, 0]} fill={CHART_COLORS.primaryLight} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

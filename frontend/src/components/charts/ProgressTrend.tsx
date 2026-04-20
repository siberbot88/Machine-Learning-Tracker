import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer
} from 'recharts';
import type { WeekProgress } from '../../types';
import { CHART_COLORS } from '../../lib/utils';

interface ProgressTrendProps {
  weeks: WeekProgress[];
}

export default function ProgressTrend({ weeks }: ProgressTrendProps) {
  let cumCompleted = 0;
  let cumTotal = 0;

  const data = weeks.map(w => {
    cumCompleted += w.completed;
    cumTotal += w.total;
    return {
      name: `W${w.week}`,
      cumulative: cumTotal > 0 ? Math.round((cumCompleted / cumTotal) * 100) : 0,
      weekProgress: w.progress,
    };
  });

  return (
    <div className="bg-surface rounded-2xl border border-border p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-base font-semibold text-text">Progress Trend</h3>
          <p className="text-xs text-text-muted mt-0.5">Cumulative completion rate over weeks</p>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={220}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="gradientArea" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={CHART_COLORS.primary} stopOpacity={0.15} />
              <stop offset="95%" stopColor={CHART_COLORS.primary} stopOpacity={0} />
            </linearGradient>
          </defs>
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
            domain={[0, 100]}
            tickFormatter={(v) => `${v}%`}
          />
          <Tooltip
            contentStyle={{ borderRadius: 12, border: '1px solid #E2E8F0', fontSize: 12 }}
            formatter={(value: any) => [`${value}%`, 'Cumulative Progress']}
          />
          <Area
            type="monotone"
            dataKey="cumulative"
            stroke={CHART_COLORS.primary}
            strokeWidth={2.5}
            fill="url(#gradientArea)"
            dot={{ r: 4, fill: CHART_COLORS.primary, stroke: '#fff', strokeWidth: 2 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

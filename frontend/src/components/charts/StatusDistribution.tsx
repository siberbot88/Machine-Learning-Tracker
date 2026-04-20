import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { CHART_COLORS } from '../../lib/utils';

interface StatusDistributionProps {
  notStarted: number;
  inProgress: number;
  done: number;
  blocked: number;
}

export default function StatusDistribution({ notStarted, inProgress, done, blocked }: StatusDistributionProps) {
  const data = [
    { name: 'Done', value: done },
    { name: 'In Progress', value: inProgress },
    { name: 'Not Started', value: notStarted },
    { name: 'Blocked', value: blocked },
  ].filter(d => d.value > 0);

  const colors = [CHART_COLORS.accent, CHART_COLORS.primary, '#CBD5E1', '#64748B'];

  return (
    <div className="bg-surface rounded-2xl border border-border p-6 shadow-sm">
      <h3 className="text-base font-semibold text-text mb-2">Task Status Distribution</h3>
      <ResponsiveContainer width="100%" height={200}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            outerRadius={70}
            innerRadius={40}
            paddingAngle={3}
            dataKey="value"
            stroke="none"
          >
            {data.map((_, i) => (
              <Cell key={i} fill={colors[i]} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{ borderRadius: 12, border: '1px solid #E2E8F0', fontSize: 12 }}
            formatter={(value: number) => [value, 'Tasks']}
          />
          <Legend
            verticalAlign="bottom"
            iconType="circle"
            iconSize={8}
            wrapperStyle={{ fontSize: 11 }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

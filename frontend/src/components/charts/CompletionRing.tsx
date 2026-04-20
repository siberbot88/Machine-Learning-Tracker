import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { CHART_COLORS } from '../../lib/utils';

interface CompletionRingProps {
  completed: number;
  total: number;
  label?: string;
}

export default function CompletionRing({ completed, total, label = 'Overall' }: CompletionRingProps) {
  const remaining = total - completed;
  const progress = total > 0 ? Math.round((completed / total) * 100) : 0;

  const data = [
    { name: 'Completed', value: completed },
    { name: 'Remaining', value: remaining },
  ];

  const colors = [CHART_COLORS.accent, '#F1F5F9'];

  return (
    <div className="bg-surface rounded-2xl border border-border p-6 shadow-sm">
      <h3 className="text-base font-semibold text-text mb-2">{label} Progress</h3>
      <div className="flex items-center justify-center">
        <div className="relative w-44 h-44">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={72}
                startAngle={90}
                endAngle={-270}
                paddingAngle={2}
                dataKey="value"
                stroke="none"
              >
                {data.map((_, i) => (
                  <Cell key={i} fill={colors[i]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ borderRadius: 12, border: '1px solid #E2E8F0', fontSize: 12 }}
                formatter={(value: number) => [`${value} tasks`]}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl font-bold text-text">{progress}%</span>
            <span className="text-xs text-text-muted">{completed}/{total}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

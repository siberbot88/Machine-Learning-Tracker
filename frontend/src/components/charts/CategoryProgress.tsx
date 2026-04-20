import type { WeekProgress } from '../../types';
import { CHART_COLORS } from '../../lib/utils';

interface CategoryProgressProps {
  weeks: WeekProgress[];
  categories: string[];
}

export default function CategoryProgress({ weeks, categories }: CategoryProgressProps) {
  const data = weeks.map((w, i) => ({
    category: categories[i] || `Week ${w.week}`,
    week: w.week,
    progress: w.progress,
    completed: w.completed,
    total: w.total,
  }));

  return (
    <div className="bg-surface rounded-2xl border border-border p-6 shadow-sm">
      <div className="mb-5">
        <h3 className="text-base font-semibold text-text">Category Breakdown</h3>
        <p className="text-xs text-text-muted mt-0.5">Progress by topic area</p>
      </div>
      <div className="space-y-3">
        {data.map((item) => (
          <div key={item.week} className="flex items-center gap-3">
            <span className="text-xs text-text-muted w-5 shrink-0">
              {item.week}
            </span>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-medium text-text truncate pr-2">{item.category}</span>
                <span className="text-xs text-text-muted shrink-0">{item.completed}/{item.total}</span>
              </div>
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full progress-bar-fill"
                  style={{
                    width: `${item.progress}%`,
                    backgroundColor: item.progress === 100 ? CHART_COLORS.accent : CHART_COLORS.primary,
                  }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

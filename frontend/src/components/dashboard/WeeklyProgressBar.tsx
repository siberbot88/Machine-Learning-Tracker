import type { WeekProgress } from '../../types';

interface WeeklyProgressBarProps {
  weeks: WeekProgress[];
  currentWeek: number;
}

export default function WeeklyProgressBar({ weeks, currentWeek }: WeeklyProgressBarProps) {
  return (
    <div className="bg-surface rounded-2xl border border-border p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-text mb-4">Weekly Progress</h3>
      <div className="space-y-3">
        {weeks.map((week) => (
          <div key={week.week} className="flex items-center gap-4">
            <span className={`text-xs font-semibold w-16 shrink-0 ${
              week.week === currentWeek ? 'text-primary' : 'text-text-muted'
            }`}>
              Week {week.week}
            </span>
            <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full progress-bar-fill"
                style={{
                  width: `${week.progress}%`,
                  backgroundColor: week.progress === 100 ? '#10B981' : '#1E93AB',
                }}
              />
            </div>
            <span className="text-xs font-medium text-text-muted w-16 text-right">
              {week.completed}/{week.total}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

<?php

namespace App\Services;

use App\Models\Task;
use App\Models\Submission;
use Illuminate\Http\Request;

class DashboardService
{
    public function getStats(string $userId): array
    {
        $tasks = Task::where('user_id', $userId)->get();
        $totalTasks = $tasks->count();
        $completedTasks = $tasks->where('checkbox_completed', true)->count();
        $blockedTasks = $tasks->where('status', 'blocked')->count();
        $inProgressTasks = $tasks->where('status', 'in_progress')->count();
        $notStartedTasks = $tasks->where('status', 'not_started')->count();
        $overallProgress = $totalTasks > 0 ? round(($completedTasks / $totalTasks) * 100, 1) : 0;

        // KPI metrics
        $totalEstimatedHours = $tasks->sum('estimated_hours') ?? 0;
        $highPriorityCount = $tasks->where('priority', 'high')->count();
        $submissionRequiredCount = $tasks->where('submission_required', true)->count();

        // Current week progress
        $currentWeek = $this->getCurrentWeek($tasks);
        $currentWeekTasks = $tasks->where('week_number', $currentWeek);
        $currentWeekTotal = $currentWeekTasks->count();
        $currentWeekDone = $currentWeekTasks->where('checkbox_completed', true)->count();
        $currentWeekProgress = $currentWeekTotal > 0 ? round(($currentWeekDone / $currentWeekTotal) * 100, 1) : 0;

        // Submissions stats
        $totalSubmissions = Submission::where('user_id', $userId)->count();
        $submissionsDoneCount = Submission::where('user_id', $userId)->where('reviewed', true)->count();

        // Per-week progress
        $weeklyProgress = [];
        for ($w = 1; $w <= 12; $w++) {
            $weekTasks = $tasks->where('week_number', $w);
            $weekTotal = $weekTasks->count();
            $weekDone = $weekTasks->where('checkbox_completed', true)->count();
            $weeklyProgress[] = [
                'week' => $w,
                'total' => $weekTotal,
                'completed' => $weekDone,
                'progress' => $weekTotal > 0 ? round(($weekDone / $weekTotal) * 100, 1) : 0,
            ];
        }

        // Recent incomplete tasks
        $incompleteTasks = Task::where('user_id', $userId)
            ->where('checkbox_completed', false)
            ->orderBy('week_number')
            ->orderBy('due_date')
            ->limit(5)
            ->get()
            ->map(fn($t) => [
                'id' => (string) $t->_id,
                'title' => $t->title,
                'week_number' => $t->week_number,
                'status' => $t->status,
                'priority' => $t->priority,
                'due_date' => $t->due_date?->toISOString(),
            ]);

        // Recent submissions
        $recentSubmissions = Submission::where('user_id', $userId)
            ->orderBy('created_at', 'desc')
            ->limit(5)
            ->get()
            ->map(fn($s) => [
                'id' => (string) $s->_id,
                'task_id' => (string) $s->task_id,
                'title' => $s->title,
                'submission_type' => $s->submission_type,
                'submitted_at' => $s->submitted_at?->toISOString(),
                'reviewed' => $s->reviewed,
            ]);

        return [
            'total_tasks' => $totalTasks,
            'completed_tasks' => $completedTasks,
            'blocked_tasks' => $blockedTasks,
            'in_progress_tasks' => $inProgressTasks,
            'not_started_tasks' => $notStartedTasks,
            'overall_progress' => $overallProgress,
            'current_week' => $currentWeek,
            'current_week_progress' => $currentWeekProgress,
            'total_submissions' => $totalSubmissions,
            'total_estimated_hours' => $totalEstimatedHours,
            'high_priority_count' => $highPriorityCount,
            'submission_required_count' => $submissionRequiredCount,
            'submissions_done_count' => $submissionsDoneCount,
            'weekly_progress' => $weeklyProgress,
            'incomplete_tasks' => $incompleteTasks,
            'recent_submissions' => $recentSubmissions,
        ];
    }

    private function getCurrentWeek($tasks): int
    {
        $earliest = $tasks->min('start_date');
        if (!$earliest) {
            return 1;
        }

        $startDate = \Carbon\Carbon::parse($earliest)->startOfWeek();
        $now = now();
        $weeksDiff = $startDate->diffInWeeks($now) + 1;

        return min(max((int) $weeksDiff, 1), 12);
    }
}

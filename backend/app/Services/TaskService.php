<?php

namespace App\Services;

use App\Models\Task;

class TaskService
{
    /**
     * Toggle checkbox and auto-update status / completed_at
     */
    public function toggleCheckbox(Task $task): Task
    {
        $newChecked = !$task->checkbox_completed;

        $task->checkbox_completed = $newChecked;

        if ($newChecked) {
            // Checked: mark as done
            if ($task->status !== 'done') {
                $task->status = 'done';
            }
            if (!$task->completed_at) {
                $task->completed_at = now();
            }
        } else {
            // Unchecked: revert status
            $task->status = 'in_progress';
            $task->completed_at = null;
        }

        $task->save();

        return $task;
    }

    /**
     * Build filtered query for tasks
     */
    public function buildFilteredQuery(string $userId, array $filters)
    {
        $query = Task::where('user_id', $userId);

        if (!empty($filters['week'])) {
            $query->where('week_number', (int) $filters['week']);
        }

        if (!empty($filters['category'])) {
            $query->where('category', $filters['category']);
        }

        if (!empty($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        if (!empty($filters['priority'])) {
            $query->where('priority', $filters['priority']);
        }

        if (!empty($filters['search'])) {
            $query->where('title', 'like', '%' . $filters['search'] . '%');
        }

        return $query->orderBy('week_number')->orderBy('created_at');
    }
}

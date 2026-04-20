<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;

class Task extends Model
{
    protected $connection = 'mongodb';
    protected $collection = 'tasks';

    protected $fillable = [
        'user_id',
        'week_number',
        'category',
        'title',
        'description',
        'priority',
        'estimated_hours',
        'checkbox_completed',
        'status',
        'start_date',
        'due_date',
        'completed_at',
        'submission_required',
        'answer_summary',
        'notes',
        'blockers',
    ];

    protected function casts(): array
    {
        return [
            'week_number' => 'integer',
            'estimated_hours' => 'float',
            'checkbox_completed' => 'boolean',
            'submission_required' => 'boolean',
            'start_date' => 'datetime',
            'due_date' => 'datetime',
            'completed_at' => 'datetime',
        ];
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function submissions()
    {
        return $this->hasMany(Submission::class, 'task_id');
    }
}

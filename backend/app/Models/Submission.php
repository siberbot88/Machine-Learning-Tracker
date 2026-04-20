<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;

class Submission extends Model
{
    protected $connection = 'mongodb';
    protected $collection = 'submissions';

    protected $fillable = [
        'task_id',
        'user_id',
        'submission_type',
        'title',
        'url',
        'file_path',
        'original_file_name',
        'mime_type',
        'file_size',
        'submitted_at',
        'reviewed',
        'score',
        'feedback',
        'reflection',
        'next_fix',
    ];

    protected function casts(): array
    {
        return [
            'reviewed' => 'boolean',
            'score' => 'integer',
            'file_size' => 'integer',
            'submitted_at' => 'datetime',
        ];
    }

    public function task()
    {
        return $this->belongsTo(Task::class, 'task_id');
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}

<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;

class WeeklyReview extends Model
{
    protected $connection = 'mongodb';
    protected $collection = 'weekly_reviews';

    protected $fillable = [
        'user_id',
        'week_number',
        'focus_this_week',
        'main_wins',
        'main_difficulties',
        'hours_spent',
        'confidence_level',
        'next_week_plan',
        'ai_feedback',
    ];

    protected function casts(): array
    {
        return [
            'week_number' => 'integer',
            'hours_spent' => 'float',
            'confidence_level' => 'integer',
        ];
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}

<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class WeeklyReviewResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => (string) $this->_id,
            'user_id' => $this->user_id,
            'week_number' => $this->week_number,
            'focus_this_week' => $this->focus_this_week,
            'main_wins' => $this->main_wins,
            'main_difficulties' => $this->main_difficulties,
            'hours_spent' => $this->hours_spent,
            'confidence_level' => $this->confidence_level,
            'next_week_plan' => $this->next_week_plan,
            'ai_feedback' => $this->ai_feedback,
            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),
        ];
    }
}

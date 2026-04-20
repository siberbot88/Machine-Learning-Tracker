<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TaskResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => (string) $this->_id,
            'user_id' => $this->user_id,
            'week_number' => $this->week_number,
            'category' => $this->category,
            'title' => $this->title,
            'description' => $this->description,
            'priority' => $this->priority,
            'estimated_hours' => $this->estimated_hours,
            'checkbox_completed' => (bool) $this->checkbox_completed,
            'status' => $this->status,
            'start_date' => $this->start_date?->toISOString(),
            'due_date' => $this->due_date?->toISOString(),
            'completed_at' => $this->completed_at?->toISOString(),
            'submission_required' => (bool) $this->submission_required,
            'answer_summary' => $this->answer_summary,
            'notes' => $this->notes,
            'blockers' => $this->blockers,
            'submissions' => SubmissionResource::collection($this->whenLoaded('submissions')),
            'submissions_count' => $this->when(
                $this->relationLoaded('submissions'),
                fn() => $this->submissions->count()
            ),
            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),
        ];
    }
}

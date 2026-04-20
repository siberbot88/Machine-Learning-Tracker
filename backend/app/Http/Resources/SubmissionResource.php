<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class SubmissionResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => (string) $this->_id,
            'task_id' => $this->task_id,
            'user_id' => $this->user_id,
            'submission_type' => $this->submission_type,
            'title' => $this->title,
            'url' => $this->url,
            'file_path' => $this->file_path,
            'file_url' => $this->file_path ? url('storage/' . $this->file_path) : null,
            'original_file_name' => $this->original_file_name,
            'mime_type' => $this->mime_type,
            'file_size' => $this->file_size,
            'submitted_at' => $this->submitted_at?->toISOString(),
            'reviewed' => (bool) $this->reviewed,
            'score' => $this->score,
            'feedback' => $this->feedback,
            'reflection' => $this->reflection,
            'next_fix' => $this->next_fix,
            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),
        ];
    }
}

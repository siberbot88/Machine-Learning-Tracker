<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class TaskRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $rules = [
            'week_number' => 'sometimes|integer|min:1|max:12',
            'category' => 'sometimes|string|max:100',
            'title' => 'sometimes|string|max:255',
            'description' => 'nullable|string',
            'priority' => 'sometimes|in:high,medium,low',
            'estimated_hours' => 'nullable|numeric|min:0',
            'checkbox_completed' => 'sometimes|boolean',
            'status' => 'sometimes|in:not_started,in_progress,done,blocked',
            'start_date' => 'nullable|date',
            'due_date' => 'nullable|date',
            'completed_at' => 'nullable|date',
            'submission_required' => 'sometimes|boolean',
            'answer_summary' => 'nullable|string',
            'notes' => 'nullable|string',
            'blockers' => 'nullable|string',
        ];

        if ($this->isMethod('POST')) {
            $rules['week_number'] = 'required|integer|min:1|max:12';
            $rules['title'] = 'required|string|max:255';
            $rules['category'] = 'required|string|max:100';
        }

        return $rules;
    }
}

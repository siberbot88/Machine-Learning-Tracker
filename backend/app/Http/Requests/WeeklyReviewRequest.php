<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class WeeklyReviewRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $rules = [
            'week_number' => 'sometimes|integer|min:1|max:12',
            'focus_this_week' => 'nullable|string',
            'main_wins' => 'nullable|string',
            'main_difficulties' => 'nullable|string',
            'hours_spent' => 'nullable|numeric|min:0',
            'confidence_level' => 'nullable|integer|min:1|max:5',
            'next_week_plan' => 'nullable|string',
        ];

        if ($this->isMethod('POST')) {
            $rules['week_number'] = 'required|integer|min:1|max:12';
        }

        return $rules;
    }
}

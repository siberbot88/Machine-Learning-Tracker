<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class SubmissionRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $rules = [
            'submission_type' => 'sometimes|in:link,pdf,word,image,notebook,zip,other',
            'title' => 'sometimes|string|max:255',
            'url' => 'nullable|url|max:2048',
            'file' => 'nullable|file|max:10240|mimes:pdf,doc,docx,jpg,jpeg,png,zip,txt',
            'reflection' => 'nullable|string',
            'next_fix' => 'nullable|string',
            'reviewed' => 'sometimes|boolean',
            'score' => 'nullable|integer|min:0|max:100',
            'feedback' => 'nullable|string',
        ];

        if ($this->isMethod('POST')) {
            $rules['submission_type'] = 'required|in:link,pdf,word,image,notebook,zip,other';
            $rules['title'] = 'required|string|max:255';
        }

        return $rules;
    }
}

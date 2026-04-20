<?php

namespace App\Http\Controllers;

use App\Http\Requests\SubmissionRequest;
use App\Http\Resources\SubmissionResource;
use App\Models\Submission;
use App\Models\Task;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class SubmissionController extends Controller
{
    public function index(string $taskId): JsonResponse
    {
        $submissions = Submission::where('task_id', $taskId)
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json(SubmissionResource::collection($submissions));
    }

    public function store(SubmissionRequest $request, string $taskId): JsonResponse
    {
        $task = Task::findOrFail($taskId);

        $data = $request->validated();
        $data['task_id'] = (string) $task->_id;
        $data['user_id'] = (string) $request->user()->_id;
        $data['submitted_at'] = now();
        $data['reviewed'] = false;

        // Handle file upload
        if ($request->hasFile('file')) {
            $file = $request->file('file');
            $path = $file->store('submissions', 'public');

            $data['file_path'] = $path;
            $data['original_file_name'] = $file->getClientOriginalName();
            $data['mime_type'] = $file->getClientMimeType();
            $data['file_size'] = $file->getSize();
        }

        $submission = Submission::create($data);

        return response()->json(new SubmissionResource($submission), 201);
    }

    public function show(string $id): JsonResponse
    {
        $submission = Submission::findOrFail($id);

        return response()->json(new SubmissionResource($submission));
    }

    public function update(SubmissionRequest $request, string $id): JsonResponse
    {
        $submission = Submission::findOrFail($id);
        $submission->update($request->validated());

        return response()->json(new SubmissionResource($submission));
    }

    public function destroy(string $id): JsonResponse
    {
        $submission = Submission::findOrFail($id);

        // Delete associated file
        try {
            if ($submission->file_path && Storage::disk('public')->exists($submission->file_path)) {
                Storage::disk('public')->delete($submission->file_path);
            }
        } catch (\Exception $e) {
            // Log or ignore file deletion error to ensure DB record is deleted
            \Illuminate\Support\Facades\Log::warning("Could not delete submission file: " . $e->getMessage());
        }

        $submission->delete();

        return response()->json(['message' => 'Submission deleted successfully']);
    }

    public function aiReview(string $id, \App\Services\DeepSeekService $aiService): JsonResponse
    {
        $submission = Submission::findOrFail($id);
        
        // We need the associated task context
        $task = Task::findOrFail($submission->task_id);

        $result = $aiService->reviewSubmission(
            $task->title, 
            $task->description ?? 'No description provided', 
            $submission->toArray()
        );

        if ($result && isset($result['score'])) {
            $submission->update([
                'score' => $result['score'],
                'feedback' => $result['feedback'],
                'reviewed' => true
            ]);
        }

        return response()->json(new SubmissionResource($submission));
    }
}

<?php

namespace App\Http\Controllers;

use App\Http\Requests\TaskRequest;
use App\Http\Resources\TaskResource;
use App\Models\Task;
use App\Services\TaskService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class TaskController extends Controller
{
    public function __construct(private TaskService $taskService) {}

    public function index(Request $request): JsonResponse
    {
        $user = $request->user();
        $userId = (string) $user->_id;

        // Auto-heal logic: if an existing user has 0 tasks, seed them instantly.
        if ($user->tasks()->count() === 0) {
            $seeder = new \Database\Seeders\RoadmapSeeder();
            $seeder->seedForUser($userId);
        }

        $filters = $request->only(['week', 'category', 'status', 'priority', 'search']);

        $tasks = $this->taskService->buildFilteredQuery($userId, $filters)->get();

        return response()->json(TaskResource::collection($tasks));
    }

    public function store(TaskRequest $request): JsonResponse
    {
        $data = $request->validated();
        $data['user_id'] = (string) $request->user()->_id;
        $data['checkbox_completed'] = $data['checkbox_completed'] ?? false;
        $data['status'] = $data['status'] ?? 'not_started';

        $task = Task::create($data);

        return response()->json(new TaskResource($task), 201);
    }

    public function show(string $id): JsonResponse
    {
        $task = Task::findOrFail($id);
        $task->load('submissions');

        return response()->json(new TaskResource($task));
    }

    public function update(TaskRequest $request, string $id): JsonResponse
    {
        $task = Task::findOrFail($id);
        $task->update($request->validated());

        return response()->json(new TaskResource($task));
    }

    public function toggle(string $id): JsonResponse
    {
        $task = Task::findOrFail($id);
        $task = $this->taskService->toggleCheckbox($task);

        return response()->json(new TaskResource($task));
    }

    public function destroy(string $id): JsonResponse
    {
        $task = Task::findOrFail($id);
        $task->submissions()->delete();
        $task->delete();

        return response()->json(['message' => 'Task deleted successfully']);
    }

    public function portfolio(Request $request): JsonResponse
    {
        $userId = (string) $request->user()->_id;
        
        $tasks = Task::where('user_id', $userId)
            ->where(function($q) {
                $q->where('status', 'done')
                  ->orWhere('status', 'completed')
                  ->orWhere('checkbox_completed', true);
            })
            ->with('submissions')
            ->orderBy('week_number', 'asc')
            ->get();

        return response()->json(TaskResource::collection($tasks));
    }
}

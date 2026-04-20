<?php

namespace App\Http\Controllers;

use App\Http\Requests\WeeklyReviewRequest;
use App\Http\Resources\WeeklyReviewResource;
use App\Models\WeeklyReview;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class WeeklyReviewController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $userId = (string) $request->user()->_id;

        $reviews = WeeklyReview::where('user_id', $userId)
            ->orderBy('week_number')
            ->get();

        return response()->json(WeeklyReviewResource::collection($reviews));
    }

    public function store(WeeklyReviewRequest $request): JsonResponse
    {
        $data = $request->validated();
        $data['user_id'] = (string) $request->user()->_id;

        // Check if review for this week already exists
        $existing = WeeklyReview::where('user_id', $data['user_id'])
            ->where('week_number', $data['week_number'])
            ->first();

        if ($existing) {
            $existing->update($data);
            return response()->json(new WeeklyReviewResource($existing));
        }

        $review = WeeklyReview::create($data);

        return response()->json(new WeeklyReviewResource($review), 201);
    }

    public function update(WeeklyReviewRequest $request, string $id): JsonResponse
    {
        $review = WeeklyReview::findOrFail($id);
        $review->update($request->validated());

        return response()->json(new WeeklyReviewResource($review));
    }

    public function generateFeedback(Request $request, string $id, \App\Services\DeepSeekService $aiService): JsonResponse
    {
        $review = WeeklyReview::where('user_id', (string) $request->user()->_id)->findOrFail($id);

        $feedback = $aiService->generateWeeklyReviewFeedback($review->toArray());

        if ($feedback) {
            $review->update(['ai_feedback' => $feedback]);
        }

        return response()->json(new WeeklyReviewResource($review));
    }
}

<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\TaskController;
use App\Http\Controllers\SubmissionController;
use App\Http\Controllers\WeeklyReviewController;
use App\Http\Controllers\GoogleAuthController;
use Illuminate\Support\Facades\Route;

// Public routes
Route::post('/login', [AuthController::class, 'login']);

// Google Auth
Route::get('/auth/google/redirect', [GoogleAuthController::class, 'redirect']);
Route::get('/auth/google/callback', [GoogleAuthController::class, 'callback']);

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    // Auth
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);
    Route::put('/profile', [\App\Http\Controllers\ProfileController::class, 'update']);

    // Dashboard & Portfolio
    Route::get('/dashboard', [DashboardController::class, 'index']);
    Route::get('/portfolio', [TaskController::class, 'portfolio']);

    // Tasks
    Route::apiResource('tasks', TaskController::class);
    Route::patch('/tasks/{task}/toggle', [TaskController::class, 'toggle']);

    // Submissions
    Route::get('/tasks/{task}/submissions', [SubmissionController::class, 'index']);
    Route::post('/tasks/{task}/submissions', [SubmissionController::class, 'store']);
    Route::get('/submissions/{submission}', [SubmissionController::class, 'show']);
    Route::put('/submissions/{submission}', [SubmissionController::class, 'update']);
    Route::delete('/submissions/{submission}', [SubmissionController::class, 'destroy']);
    Route::post('/submissions/{submission}/ai-review', [SubmissionController::class, 'aiReview']);

    // Weekly Reviews
    Route::get('/weekly-reviews', [WeeklyReviewController::class, 'index']);
    Route::post('/weekly-reviews', [WeeklyReviewController::class, 'store']);
    Route::put('/weekly-reviews/{weeklyReview}', [WeeklyReviewController::class, 'update']);
    Route::post('/weekly-reviews/{weeklyReview}/generate-feedback', [WeeklyReviewController::class, 'generateFeedback']);
});

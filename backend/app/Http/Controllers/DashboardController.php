<?php

namespace App\Http\Controllers;

use App\Services\DashboardService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function __construct(private DashboardService $dashboardService) {}

    public function index(Request $request): JsonResponse
    {
        $user = $request->user();
        $userId = (string) $user->_id;

        // Auto-heal logic: if an existing user logged in before the seeder was fixed,
        // they will have 0 tasks. This ensures they always get seeded.
        if ($user->tasks()->count() === 0) {
            $seeder = new \Database\Seeders\RoadmapSeeder();
            $seeder->seedForUser($userId);
        }

        $stats = $this->dashboardService->getStats($userId);

        return response()->json($stats);
    }
}

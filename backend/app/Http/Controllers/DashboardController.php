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
        $userId = (string) $request->user()->_id;
        $stats = $this->dashboardService->getStats($userId);

        return response()->json($stats);
    }
}

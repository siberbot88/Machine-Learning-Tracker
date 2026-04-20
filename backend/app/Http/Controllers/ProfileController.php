<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class ProfileController extends Controller
{
    public function update(Request $request): JsonResponse
    {
        $user = $request->user();

        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'theme' => ['sometimes', 'string', Rule::in(['light', 'dark', 'dimmed'])],
            'language' => ['sometimes', 'string', Rule::in(['en', 'id'])],
        ]);

        $user->fill($validated);
        $user->save();

        return response()->json([
            'message' => 'Profile updated successfully',
            'user' => [
                'id' => (string) $user->_id,
                'name' => $user->name,
                'email' => $user->email,
                'theme' => $user->theme ?? 'light',
                'language' => $user->language ?? 'en',
            ]
        ]);
    }
}

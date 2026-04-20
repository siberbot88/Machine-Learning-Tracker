<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class DeepSeekService
{
    private string $apiKey;
    private string $baseUrl = 'https://api.groq.com/openai/v1/chat/completions';

    public function __construct()
    {
        // We'll map the old DEEPSEEK_API_KEY to Groq for simplicity
        $this->apiKey = env('DEEPSEEK_API_KEY', '');
    }

    public function generateWeeklyReviewFeedback(array $reviewData): ?string
    {
        if (empty($this->apiKey)) {
            Log::warning('API Key is missing. Returning fallback response.');
            return "Unable to generate AI feedback: API key is missing. Please configure it in the .env file.";
        }

        $systemPrompt = "Anda adalah seorang mentor Machine Learning dan pelatih teknis yang sangat berpengalaman. 
Siswa Anda telah mengirimkan ulasan mingguan tentang kemajuan belajar mereka pada Roadmap ML. 
Analisis fokus mereka, pencapaian, kesulitan, tingkat kepercayaan diri (1-5), dan rencana untuk minggu depan. 
Berikan umpan balik yang sangat profesional, formal, dan konstruktif dalam Bahasa Indonesia. Identifikasi area yang perlu diperbaiki dan sarankan materi spesifik untuk dipelajari. Jaga format tetap rapi, mudah dipahami, gunakan teks biasa (atau markdown sederhana), sapa siswa secara langsung, dan JANGAN menggunakan emoticon atau emoji sama sekali. Jangan berhalusinasi.";

        $userPrompt = "Berikut adalah ulasan mingguan siswa:\n"
            . "- Fokus minggu ini: " . ($reviewData['focus_this_week'] ?? 'Tidak ada') . "\n"
            . "- Pencapaian utama: " . ($reviewData['main_wins'] ?? 'Tidak ada') . "\n"
            . "- Kesulitan utama: " . ($reviewData['main_difficulties'] ?? 'Tidak ada') . "\n"
            . "- Tingkat kepercayaan diri: " . ($reviewData['confidence_level'] ?? 3) . "/5\n"
            . "- Rencana minggu depan: " . ($reviewData['next_week_plan'] ?? 'Tidak ada') . "\n\n"
            . "Tolong berikan umpan balik formal dan rekomendasi belajar Anda.";

        return $this->callAI($systemPrompt, $userPrompt);
    }

    public function reviewSubmission(string $taskTitle, string $taskDescription, array $submissionData): ?array
    {
        if (empty($this->apiKey)) {
            Log::warning('API Key is missing. Returning fallback response.');
            return [
                'score' => 0,
                'feedback' => 'API Key is missing for auto reviewer. Please check configuration.'
            ];
        }

        $systemPrompt = "Anda adalah penilai tugas/kode otomatis untuk bootcamp Machine Learning.
Tugas Anda adalah meninjau hasil pekerjaan siswa berdasarkan persyaratan tugas yang diberikan.
Nilai relevansi tugas, kelengkapan, dan jika memungkinkan, kualitas berdasarkan teks input. Feedback harus dalam Bahasa Indonesia, mudah dipahami, formal, tanpa menggunakan emoticon, dan tepat sasaran.
Kembalikan hasil secara ketat sebagai objek JSON yang valid sesuai skema berikut, tanpa format markdown atau blok kode:
{
    \"score\": <angka bulat dari 0 hingga 100>,
    \"feedback\": \"<string umpan balik konstruktif formal dan singkat Anda dalam Bahasa Indonesia, tanpa emoticon>\"
}";

        $context = "Tipe pengumpulan: " . ($submissionData['submission_type'] ?? 'tidak diketahui') . "\n";
        if (!empty($submissionData['url'])) {
            $context .= "Submitted URL: " . $submissionData['url'] . "\n";
        }
        if (!empty($submissionData['original_file_name'])) {
            $context .= "Submitted file name: " . $submissionData['original_file_name'] . "\n";
        }
        $context .= "Student Reflection/Note: " . ($submissionData['title'] ?? 'N/A') . "\n";

        $userPrompt = "Task: $taskTitle\nTask Description: $taskDescription\n\nSubmission details:\n$context\n\nPlease evaluate this submission and return the JSON.";

        $response = $this->callAI($systemPrompt, $userPrompt, true);
        
        if (!$response) {
            return null;
        }

        // Clean potentially messy JSON
        $response = preg_replace('/```json/i', '', $response);
        $response = preg_replace('/```/', '', $response);
        $response = trim($response);

        $decoded = json_decode($response, true);
        
        if (json_last_error() === JSON_ERROR_NONE && isset($decoded['score'])) {
            return [
                'score' => (int) $decoded['score'],
                'feedback' => $decoded['feedback'] ?? 'Reviewed successfully.'
            ];
        }

        Log::error("AI returned invalid JSON for submission review: " . $response);
        return [
            'score' => 50,
            'feedback' => 'The AI response could not be parsed successfully.'
        ];
    }

    private function callAI(string $systemPrompt, string $userPrompt, bool $jsonResponse = false): ?string
    {
        try {
            $payload = [
                'model' => 'llama-3.1-8b-instant', // Updated free model from Groq
                'messages' => [
                    ['role' => 'system', 'content' => $systemPrompt],
                    ['role' => 'user', 'content' => $userPrompt],
                ],
                'temperature' => 0.7,
            ];

            if ($jsonResponse) {
                $payload['response_format'] = ['type' => 'json_object'];
            }

            $response = Http::withToken($this->apiKey)
                ->timeout(120)
                ->post($this->baseUrl, $payload);

            if ($response->successful()) {
                $data = $response->json();
                return $data['choices'][0]['message']['content'] ?? null;
            }

            Log::error('AI API Error: ' . $response->body());
            return null;
            
        } catch (\Exception $e) {
            Log::error('AI connection failed: ' . $e->getMessage());
            return null;
        }
    }
}

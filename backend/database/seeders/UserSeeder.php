<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        User::updateOrCreate(
            ['email' => 'admin@roadmap.test'],
            [
                'name' => 'ML Learner',
                'email' => 'admin@roadmap.test',
                'password' => Hash::make('password'),
            ]
        );
    }
}

<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Le avisamos a Laravel que ejecute tu seeder de Torq
        $this->call([
            TorqDemoSeeder::class,
        ]);
    }
}
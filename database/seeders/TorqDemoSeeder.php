<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use App\Models\User;
use App\Models\Machine;
use Illuminate\Support\Facades\Hash;

class TorqDemoSeeder extends Seeder
{
    public function run(): void
    {
        // 👥 Administradores
        User::create(['name' => 'Selena Admin', 'email' => 'admin1@torq.com', 'password' => Hash::make('123456'), 'role' => 'admin']);

        // 🛠️ Mecánicos
        $mec1 = User::create(['name' => 'Juan Taller', 'email' => 'mecanico1@torq.com', 'password' => Hash::make('123456'), 'role' => 'mechanic']);
        $mec2 = User::create(['name' => 'Pedro Motores', 'email' => 'mecanico2@torq.com', 'password' => Hash::make('123456'), 'role' => 'mechanic']);

        // 🏢 Clientes
        $cli1 = User::create(['name' => 'Constructora Vial S.A.', 'email' => 'cliente1@torq.com', 'password' => Hash::make('123456'), 'role' => 'client']);
        $cli2 = User::create(['name' => 'Desarrollos Urbanos SRL', 'email' => 'cliente2@torq.com', 'password' => Hash::make('123456'), 'role' => 'client']);

        // 🚜 Máquinas
        $exc = Machine::create([
            'name' => 'Excavadora CAT 320', 'model' => '2024',
            'serial_number' => 'CAT320-991', 'current_hours' => 320,
            'ownership_type' => 'propia', 'status' => 'rented',
            'price_per_hour' => 120, 'hours_for_service' => 250,
        ]);
        $retro = Machine::create([
            'name' => 'Retroexcavadora John Deere 410', 'model' => '2023',
            'serial_number' => 'JD410-442', 'current_hours' => 540,
            'ownership_type' => 'propia', 'status' => 'rented',
            'price_per_hour' => 95, 'hours_for_service' => 250,
        ]);
        $mini = Machine::create([
            'name' => 'Minicargadora Bobcat S450', 'model' => '2025',
            'serial_number' => 'BOB450-112', 'current_hours' => 180,
            'ownership_type' => 'terceros', 'status' => 'available',
            'supplier_name' => 'Equipos del Norte S.R.L.',
            'subrental_cost' => 40, 'price_per_hour' => 75, 'hours_for_service' => 250,
        ]);
        $niv = Machine::create([
            'name' => 'Niveladora Komatsu GD655', 'model' => '2022',
            'serial_number' => 'KOM655-038', 'current_hours' => 88,
            'ownership_type' => 'propia', 'status' => 'available',
            'price_per_hour' => 110, 'hours_for_service' => 500,
        ]);

        // 📋 Alquileres activos con precio real
        DB::table('rentals')->insert([
            [
                'machine_id'   => $exc->id,
                'client_id'    => $cli1->id,
                'start_date'   => '2026-06-01',
                'end_date'     => '2026-07-31',
                'start_hours'  => 200,
                'payment_type' => 'monthly_advance',
                'price'        => 14400.00,   // 120 USD/h × 120h del período
                'price_per_hour' => 120.00,
                'created_at'   => now(),
                'updated_at'   => now(),
            ],
            [
                'machine_id'   => $retro->id,
                'client_id'    => $cli2->id,
                'start_date'   => '2026-05-15',
                'end_date'     => '2026-07-15',
                'start_hours'  => 390,
                'payment_type' => 'monthly_expired',
                'price'        => 14250.00,   // 95 USD/h × 150h del período
                'price_per_hour' => 95.00,
                'created_at'   => now(),
                'updated_at'   => now(),
            ],
        ]);
    }
}

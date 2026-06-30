<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Machine;
use App\Models\User;
use Illuminate\Support\Facades\Mail;
use App\Mail\ServiceAlertMail;

class CheckMachineService extends Command
{
    protected $signature = 'machines:check-service';
    protected $description = 'Revisa qué máquinas están a 50 horas o menos de requerir service y notifica al admin';

    public function handle()
    {
        // Buscamos máquinas donde las horas actuales estén a 50hs o menos del límite configurado
        // O si ya se pasaron del límite
        $machines = Machine::all()->filter(function ($machine) {
            $limite = $machine->hours_for_service ?? 250;
            $horasActuales = $machine->current_hours;
            
            // Calculamos cuántas horas faltan para el próximo múltiplo del límite o para el límite fijo
            $resto = $horasActuales % $limite;
            $horasRestantes = $limite - $resto;

            return $horasRestantes <= 50;
        });

        if ($machines->count() > 0) {
            // Buscamos al usuario Administrador para tener su correo
            $admin = User::where('role', 'admin')->first();
            $emailDestino = $admin ? $admin->email : env('ADMIN_NOTIFICATION_EMAIL', 'admin@torq.com');

            // Enviamos el correo
            Mail::to($emailDestino)->send(new ServiceAlertMail($machines));
            $this->info('Mails de alerta enviados correctamente.');
        } else {
            $this->info('No hay máquinas próximas a service hoy.');
        }
    }
}
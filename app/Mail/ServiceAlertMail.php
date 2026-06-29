<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class ServiceAlertMail extends Mailable
{
    use Queueable, SerializesModels;

    public $upcomingMachines;

    public function __construct($upcomingMachines)
    {
        $this->upcomingMachines = $upcomingMachines;
    }

    public function build()
    {
        return $this->from(env('MAIL_FROM_ADDRESS'), 'Sistema Torq')
                    ->subject('⚠️ ALERTA: Maquinarias próximas a vencer Service')
                    ->view('email.service_alert'); // Crearemos esta vista mañana
    }
}
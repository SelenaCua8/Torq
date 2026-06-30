<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Http\Controllers\ReportController;

class SendMonthlyReport extends Command
{
    protected $signature = 'torq:send-monthly-report';
    protected $description = 'Genera y envía por mail el reporte mensual de Torq al administrador';

    public function handle(ReportController $controller)
    {
        $this->info('Generando reporte mensual...');
        $response = $controller->sendByMail();
        $this->info('Reporte enviado correctamente.');
        return 0;
    }
}

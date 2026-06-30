<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

// Reporte mensual automático — se envía el día 1 de cada mes a las 8:00 AM
Schedule::command('torq:send-monthly-report')
    ->monthlyOn(1, '08:00')
    ->timezone('America/Argentina/Buenos_Aires');

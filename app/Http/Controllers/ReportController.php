<?php

namespace App\Http\Controllers;

use App\Models\Machine;
use App\Models\Rental;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;
use Barryvdh\DomPDF\Facade\Pdf;
use App\Mail\MonthlyReportMail;

class ReportController extends Controller
{
    /**
     * Arma todos los datos del reporte mensual: máquinas, clientes,
     * alquileres activos/finalizados del mes y mantenimientos realizados.
     */
    private function buildReportData()
    {
        $startOfMonth = now()->startOfMonth();
        $endOfMonth   = now()->endOfMonth();

        $machines = Machine::all();

        $rentalsThisMonth = DB::table('rentals')
            ->join('users', 'rentals.client_id', '=', 'users.id')
            ->join('machines', 'rentals.machine_id', '=', 'machines.id')
            ->select('rentals.*', 'users.name as client_name', 'machines.name as machine_name')
            ->where(function ($q) use ($startOfMonth, $endOfMonth) {
                $q->whereBetween('rentals.start_date', [$startOfMonth, $endOfMonth])
                  ->orWhereBetween('rentals.end_date', [$startOfMonth, $endOfMonth])
                  ->orWhereNull('rentals.end_date');
            })
            ->orderByDesc('rentals.start_date')
            ->get();

        $maintenanceThisMonth = DB::table('maintenance_checklists')
            ->join('machines', 'maintenance_checklists.machine_id', '=', 'machines.id')
            ->select('maintenance_checklists.*', 'machines.name as machine_name')
            ->whereBetween('maintenance_checklists.created_at', [$startOfMonth, $endOfMonth])
            ->orderByDesc('maintenance_checklists.created_at')
            ->get();

        $clients = DB::table('users')->where('role', 'client')->get();
        $mechanics = DB::table('users')->where('role', 'mechanic')->get();

        $facturacionTotal = $rentalsThisMonth->sum('price');
        $maquinasAlquiladas = $machines->where('status', 'rented')->count();
        $maquinasDisponibles = $machines->where('status', 'available')->count();

        return [
            'periodo'              => now()->locale('es')->isoFormat('MMMM [de] YYYY'),
            'fecha_generacion'     => now()->format('d/m/Y H:i'),
            'machines'             => $machines,
            'rentals'              => $rentalsThisMonth,
            'maintenance'          => $maintenanceThisMonth,
            'clients'              => $clients,
            'mechanics'            => $mechanics,
            'facturacion_total'    => $facturacionTotal,
            'total_maquinas'       => $machines->count(),
            'maquinas_alquiladas'  => $maquinasAlquiladas,
            'maquinas_disponibles' => $maquinasDisponibles,
            'total_clientes'       => $clients->count(),
            'total_mecanicos'      => $mechanics->count(),
            'total_mantenimientos' => $maintenanceThisMonth->count(),
        ];
    }

    /**
     * Genera el PDF y lo descarga directamente (botón manual del admin).
     */
    public function download()
    {
        $data = $this->buildReportData();
        $pdf = Pdf::loadView('reports.monthly', $data)->setPaper('a4', 'portrait');

        $filename = 'Torq_Reporte_' . now()->format('Y_m') . '.pdf';
        return $pdf->download($filename);
    }

    /**
     * Genera el PDF y lo envía por mail al admin (botón manual o cron mensual).
     */
    public function sendByMail()
    {
        $data = $this->buildReportData();
        $pdf = Pdf::loadView('reports.monthly', $data)->setPaper('a4', 'portrait');

        $filename = 'Torq_Reporte_' . now()->format('Y_m') . '.pdf';
        $adminEmail = env('ADMIN_NOTIFICATION_EMAIL', 'admin@torq.com');

        try {
            Mail::to($adminEmail)->send(new MonthlyReportMail($data, $pdf->output(), $filename));
            return response()->json(['message' => 'Reporte enviado a ' . $adminEmail], 200);
        } catch (\Exception $e) {
            \Log::error('Error enviando reporte mensual: ' . $e->getMessage());
            return response()->json(['message' => 'Error al enviar el reporte por mail.'], 500);
        }
    }
}

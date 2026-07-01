<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Machine;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail; 
use App\Mail\ServiceCompleted;        

class MaintenanceChecklistController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'machine_id' => 'required|exists:machines,id',
            'service_hours' => 'required|integer',
            'type' => 'required|string',
            'inspections' => 'required|array',
            'general_observations' => 'nullable|string'
        ]);

        $userId = auth()->id() ?? 2;

        DB::table('maintenance_checklists')->insert([
            'machine_id' => $validated['machine_id'],
            'user_id' => $userId, 
            'inspections' => json_encode($validated['inspections']), // Ahora esto existe
            'general_observations' => $validated['general_observations'] ?? '',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // Intentar envío de correo
        try {
            $machine = Machine::find($validated['machine_id']);
            $mechanicName = DB::table('users')->where('id', $userId)->value('name') ?? 'Operario Técnico';
            Mail::to(env('ADMIN_NOTIFICATION_EMAIL', 'admin@torq.com'))->send(new ServiceCompleted($machine, $mechanicName));
        } catch (\Exception $e) {
            \Log::error('Fallo al enviar correo: ' . $e->getMessage());
        }

        return response()->json(['message' => 'Planilla guardada con éxito'], 201);
    }

    public function getHistory($machineId)
    {
        $history = DB::table('maintenance_checklists')
            ->join('users', 'maintenance_checklists.user_id', '=', 'users.id')
            ->where('machine_id', $machineId)
            ->select('maintenance_checklists.*', 'users.name as mechanic_name')
            ->orderBy('created_at', 'desc')
            ->get();

        foreach ($history as $log) {
            $log->inspections = json_decode($log->inspections);
        }
        return response()->json($history, 200);
    }

    /**
     * Todos los reportes técnicos para el dashboard del admin.
     */
    public function getAllReports()
    {
        $reports = DB::table('maintenance_checklists')
            ->join('users', 'maintenance_checklists.user_id', '=', 'users.id')
            ->join('machines', 'maintenance_checklists.machine_id', '=', 'machines.id')
            ->select(
                'maintenance_checklists.id',
                'maintenance_checklists.general_observations',
                'maintenance_checklists.inspections',
                'maintenance_checklists.created_at',
                'users.name as mechanic_name',
                'machines.name as machine_name',
                'machines.serial_number',
                'machines.current_hours'
            )
            ->orderByDesc('maintenance_checklists.created_at')
            ->get()
            ->map(function ($r) {
                // Calcular cuántos ítems no están "Apto"
                $inspections = is_string($r->inspections) ? json_decode($r->inspections, true) : (array)$r->inspections;
                $items = array_values($inspections ?: []);
                $noApto = count(array_filter($items, fn($i) => ($i['status'] ?? '') !== 'Apto'));
                $r->no_apto_count = $noApto;
                $r->estado_general = $noApto === 0 ? 'OK' : ($noApto <= 2 ? 'Con observaciones' : 'Requiere atención');
                unset($r->inspections); // No mandamos todos los detalles en el listado
                return $r;
            });

        return response()->json($reports, 200);
    }
}
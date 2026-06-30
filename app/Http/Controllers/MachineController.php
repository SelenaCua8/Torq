<?php

namespace App\Http\Controllers;

use App\Models\Machine;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class MachineController extends Controller
{
    /**
     * Lista todas las máquinas con sus contratos activos y analíticas reales.
     */
    public function index()
    {
        $machines = Machine::all();

        // Traemos todos los alquileres activos (sin end_date o con end_date futuro),
        // cruzados con el nombre del cliente desde la tabla users
        $activeRentals = DB::table('rentals')
            ->join('users', 'rentals.client_id', '=', 'users.id')
            ->select(
                'rentals.*',
                'users.name as client_name'
            )
            ->where(function ($q) {
                $q->whereNull('rentals.end_date')
                  ->orWhere('rentals.end_date', '>=', now()->toDateString());
            })
            ->get();

        $total_facturacion   = 0;
        $total_costo_terceros = 0;

        foreach ($machines as $machine) {
            $rental = $activeRentals->firstWhere('machine_id', $machine->id);

            if ($rental) {
                $machine->status            = 'rented';
                $machine->rental_id          = $rental->id;
                $machine->client_rented_name = $rental->client_name;
                $machine->rented_from        = $rental->start_date;
                $machine->rented_to          = $rental->end_date;
                // Usamos el precio real del contrato; si no tiene, calculamos por horas
                $machine->rental_price       = $rental->price ?? null;

                // Facturación: precio pactado del contrato (si existe) o por hora
                if ($rental->price) {
                    $total_facturacion += $rental->price;
                } elseif ($rental->price_per_hour && $machine->current_hours) {
                    $horas_en_contrato = $machine->current_hours - ($rental->start_hours ?? 0);
                    $total_facturacion += max(0, $horas_en_contrato) * $rental->price_per_hour;
                } elseif ($machine->price_per_hour && $machine->current_hours) {
                    // Fallback: precio por hora cargado en la máquina
                    $horas_en_contrato = $machine->current_hours - ($rental->start_hours ?? 0);
                    $total_facturacion += max(0, $horas_en_contrato) * $machine->price_per_hour;
                }
            } else {
                $machine->client_rented_name = null;
                $machine->rented_from        = null;
                $machine->rented_to          = null;
                $machine->rental_price       = null;
            }

            // Costo de terceros: lo que le pagamos al dueño de la máquina
            if ($machine->ownership_type === 'terceros' && $machine->current_hours > 0) {
                $costo_hora = $machine->subrental_cost ?? 0;
                $total_costo_terceros += $machine->current_hours * $costo_hora;
            }
        }

        $margen_propio = $total_facturacion - $total_costo_terceros;

        // Cantidad de alquileres activos para la analítica de rentabilidad
        $maquinas_alquiladas = $machines->where('status', 'rented')->count();
        $maquinas_disponibles = $machines->where('status', 'available')->count();

        return response()->json([
            'machines' => $machines,
            'analytics' => [
                // Valores mensuales reales (suma de contratos activos)
                'facturacion_mensual'       => round($total_facturacion, 2),
                'facturacion_semanal'       => round($total_facturacion / 4.33, 2),
                'margen_propio_mensual'     => round($margen_propio, 2),
                'margen_propio_semanal'     => round($margen_propio / 4.33, 2),
                'costo_terceros_mensual'    => round($total_costo_terceros, 2),
                'costo_terceros_semanal'    => round($total_costo_terceros / 4.33, 2),
                // Extras útiles para el dashboard
                'total_maquinas'            => $machines->count(),
                'maquinas_alquiladas'       => $maquinas_alquiladas,
                'maquinas_disponibles'      => $maquinas_disponibles,
                'tasa_ocupacion'            => $machines->count() > 0
                    ? round(($maquinas_alquiladas / $machines->count()) * 100, 1)
                    : 0,
            ]
        ], 200);
    }

    /**
     * Crea una nueva máquina.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name'             => 'required|string|max:255',
            'model'            => 'required|string|max:255',
            'serial_number'    => 'required|string|unique:machines,serial_number',
            'current_hours'    => 'required|integer|min:0',
            'ownership_type'   => 'required|in:propia,terceros',
            'supplier_name'    => 'nullable|string|max:255',
            'subrental_cost'   => 'nullable|numeric|min:0',
            'hours_for_service'=> 'nullable|integer|min:1',
            'price_per_hour'   => 'nullable|numeric|min:0',
        ]);

        Machine::create([
            'name'              => $validated['name'],
            'model'             => $validated['model'],
            'serial_number'     => $validated['serial_number'],
            'current_hours'     => $validated['current_hours'],
            'ownership_type'    => $validated['ownership_type'],
            'supplier_name'     => $validated['supplier_name'] ?? null,
            'subrental_cost'    => $validated['subrental_cost'] ?? null,
            'status'            => 'available',
            'hours_for_service' => $validated['hours_for_service'] ?? 250,
            'price_per_hour'    => $validated['price_per_hour'] ?? null,
        ]);

        return redirect()->back();
    }

    /**
     * Elimina una máquina y todo su historial.
     */
    public function destroy($id)
    {
        $machine = Machine::findOrFail($id);
        $machine->delete();

        return response()->json(['message' => 'Máquina eliminada correctamente.'], 200);
    }
}

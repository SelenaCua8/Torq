<?php

namespace App\Http\Controllers;

use App\Models\Rental;
use App\Models\Machine;
use Illuminate\Http\Request;

class RentalController extends Controller
{
    /**
     * Asigna una máquina a un cliente (crea un nuevo contrato de alquiler).
     * Solo se puede asignar si la máquina está disponible.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'machine_id'      => 'required|exists:machines,id',
            'client_id'       => 'required|exists:users,id',
            'start_date'      => 'required|date',
            'end_date'        => 'nullable|date|after_or_equal:start_date',
            'price'           => 'nullable|numeric|min:0',
            'price_per_hour'  => 'nullable|numeric|min:0',
            'payment_type'    => 'required|in:monthly_advance,monthly_expired',
        ]);

        $machine = Machine::findOrFail($validated['machine_id']);

        if ($machine->status === 'rented') {
            return response()->json(['message' => 'Esta máquina ya está alquilada.'], 422);
        }

        $rental = Rental::create([
            'machine_id'      => $machine->id,
            'client_id'       => $validated['client_id'],
            'start_date'      => $validated['start_date'],
            'end_date'        => $validated['end_date'] ?? null,
            'start_hours'     => $machine->current_hours, // horómetro al momento de iniciar el contrato
            'payment_type'    => $validated['payment_type'],
            'price'           => $validated['price'] ?? null,
            'price_per_hour'  => $validated['price_per_hour'] ?? $machine->price_per_hour,
        ]);

        $machine->update(['status' => 'rented']);

        return response()->json([
            'message' => 'Alquiler asignado correctamente.',
            'rental'  => $rental,
        ], 201);
    }

    /**
     * Finaliza un alquiler activo y libera la máquina.
     */
    public function destroy($id)
    {
        $rental = Rental::findOrFail($id);
        $machine = Machine::find($rental->machine_id);

        $rental->update(['end_date' => now()->toDateString()]);

        if ($machine) {
            $machine->update(['status' => 'available']);
        }

        return response()->json(['message' => 'Alquiler finalizado. La máquina vuelve a estar disponible.'], 200);
    }
}
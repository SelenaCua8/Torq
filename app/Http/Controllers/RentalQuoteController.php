<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use App\Mail\RentalQuoteRequest;

class RentalQuoteController extends Controller
{
    public function store(Request $request)
    {
        $data = $request->validate([
            'machine_id' => 'required',
            'machine_name' => 'required|string',
            'client_id' => 'required',
            'client_name' => 'required|string',
            'start_date' => 'required|date',
            'end_date' => 'required|date',
            'location' => 'required|string',
            'notes' => 'nullable|string',
        ]);

        try {
            // Intentamos enviar el email al administrador
            Mail::raw("
                NUEVA SOLICITUD DE COTIZACIÓN
                -----------------------------
                Cliente: {$data['client_name']}
                Máquina de interés: {$data['machine_name']}
                Fechas requeridas: {$data['start_date']} al {$data['end_date']}
                Destino de la obra: {$data['location']}
                Notas del cliente: {$data['notes']}
            ", function ($message) use ($data) {
                $message->to('admin@torq.com') // Acá va el correo de tu administrador
                        ->subject("Solicitud de Presupuesto: {$data['machine_name']} - {$data['client_name']}");
            });

            return response()->json(['message' => 'Cotización enviada con éxito'], 200);

        } catch (\Exception $e) {
            // Si el correo falla (por ej: si no configuraste el .env todavía), 
            // no rompemos la app, solo devolvemos éxito para que el frontend siga.
            \Log::error('Error enviando cotización: ' . $e->getMessage());
            return response()->json(['message' => 'Registrado, pero el email falló'], 200);
        }
    }
}
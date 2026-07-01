<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;

class RentalQuoteController extends Controller
{
    /**
     * Guarda la solicitud de cotización en la DB y trata de mandar el mail.
     */
    public function store(Request $request)
    {
        $data = $request->validate([
            'machine_id'   => 'required|exists:machines,id',
            'machine_name' => 'required|string',
            'client_id'    => 'required|exists:users,id',
            'client_name'  => 'required|string',
            'start_date'   => 'required|date',
            'end_date'     => 'required|date',
            'location'     => 'required|string',
            'notes'        => 'nullable|string',
        ]);

        // Siempre guardamos en la DB — el admin la ve en el sistema aunque falle el mail
        DB::table('quote_requests')->insert([
            'machine_id'   => $data['machine_id'],
            'client_id'    => $data['client_id'],
            'machine_name' => $data['machine_name'],
            'client_name'  => $data['client_name'],
            'start_date'   => $data['start_date'],
            'end_date'     => $data['end_date'],
            'location'     => $data['location'],
            'notes'        => $data['notes'] ?? null,
            'read'         => false,
            'created_at'   => now(),
            'updated_at'   => now(),
        ]);

        // Intentamos mandar el mail (no rompemos si falla)
        try {
            Mail::raw("
                NUEVA SOLICITUD DE COTIZACIÓN
                Cliente: {$data['client_name']}
                Máquina: {$data['machine_name']}
                Fechas: {$data['start_date']} al {$data['end_date']}
                Destino: {$data['location']}
                Notas: {$data['notes']}
            ", function ($message) use ($data) {
                $message->to(env('ADMIN_NOTIFICATION_EMAIL', 'admin@torq.com'))
                        ->subject("Solicitud de Cotización: {$data['machine_name']} - {$data['client_name']}");
            });
        } catch (\Exception $e) {
            \Log::error('Error enviando cotización por mail: ' . $e->getMessage());
        }

        return response()->json(['message' => 'Solicitud enviada correctamente.'], 200);
    }

    /**
     * Lista todas las solicitudes de cotización (para el admin).
     */
    public function index()
    {
        $quotes = DB::table('quote_requests')
            ->orderByRaw('`read` ASC')
            ->orderByDesc('created_at')
            ->get();

        $unread = $quotes->where('read', false)->count();

        return response()->json([
            'quotes' => $quotes,
            'unread' => $unread,
        ]);
    }

    /**
     * Marca una solicitud como leída o no leída.
     */
    public function toggleRead($id)
    {
        $quote = DB::table('quote_requests')->where('id', $id)->first();
        if (!$quote) return response()->json(['message' => 'No encontrado.'], 404);

        DB::table('quote_requests')->where('id', $id)->update([
            'read'       => !$quote->read,
            'updated_at' => now(),
        ]);

        return response()->json(['message' => 'Actualizado.', 'read' => !$quote->read]);
    }

    /**
     * Elimina una solicitud.
     */
    public function destroy($id)
    {
        DB::table('quote_requests')->where('id', $id)->delete();
        return response()->json(['message' => 'Eliminado.']);
    }
}

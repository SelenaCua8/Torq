<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\MachineController;
use 
App\Http\Controllers\UserController;
use App\Http\Controllers\AuthController;
use App\Models\ServiceRequest; // Nos sirve para listar las alertas rápido
use App\Http\Controllers\MaintenanceChecklistController;

// Guardar la nueva planilla
Route::post('/maintenance-checklists', [MaintenanceChecklistController::class, 'store']);

// Asegúrate de que el nombre de la ruta coincida con lo que pongas en el JS
Route::post('/maintenance-logs', [App\Http\Controllers\MaintenanceChecklistController::class, 'store']);

// Buscar el historial de la máquina
Route::get('/maintenance-checklists/machine/{id}', [MaintenanceChecklistController::class, 'getHistory']);

// Ruta para procesar el inicio de sesión
Route::post('/login', [AuthController::class, 'login']);

// 🚜 Rutas de Máquinas
Route::get('/machines', [MachineController::class, 'index']);
Route::post('/machines', [MachineController::class, 'store']);

// 👥 Rutas de Usuarios (Controlados por el Admin)
Route::get('/users', [UserController::class, 'index']);
Route::post('/users', [UserController::class, 'store']);

// ⚠️ Ruta para que el Admin vea las alertas/solicitudes de servicio en tiempo real
Route::get('/admin/service-requests', function() {
    // Trae las solicitudes cargadas por los clientes incluyendo los datos de la máquina
    return response()->json(ServiceRequest::with('machine')->get(), 200);
});
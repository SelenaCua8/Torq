<?php

use App\Http\Controllers\MachineController;
use App\Http\Controllers\MaintenanceChecklistController;
use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\RentalQuoteController;
use App\Http\Controllers\RentalController;
use App\Http\Controllers\ReportController;
use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;
use Inertia\Inertia;

// 1. RAÍZ → LOGIN
Route::get('/', function () {
    return Inertia::render('Login');
});

// 2. LOGIN Y LOGOUT
Route::post('/login', [AuthenticatedSessionController::class, 'store']);
Route::post('/logout', [AuthenticatedSessionController::class, 'destroy'])->name('logout');

// 3. DASHBOARD — REDIRECCIÓN POR ROL
Route::get('/dashboard-redirect', function (Request $request) {
    $user = auth()->user();
    if (!$user) return redirect('/');

    $role = $user->role;
    if ($role === 'admin')    return Inertia::render('Admin/AdminDashboard');
    if ($role === 'mechanic') return Inertia::render('Mechanic/MechanicProfile');
    if ($role === 'client')   return Inertia::render('Client/ClientProfile');

    return redirect('/');
})->middleware(['auth'])->name('dashboard');

// 4. RUTAS PROTEGIDAS
Route::middleware(['auth'])->group(function () {
    // Máquinas
    Route::get('/machines',          [MachineController::class, 'index']);
    Route::post('/machines',         [MachineController::class, 'store']);
    Route::delete('/machines/{id}',  [MachineController::class, 'destroy']);

    // Checklists de mantenimiento
    Route::post('/maintenance-checklists',              [MaintenanceChecklistController::class, 'store']);
    Route::post('/maintenance-logs',                    [MaintenanceChecklistController::class, 'store']);
    Route::get('/maintenance-checklists/machine/{id}',  [MaintenanceChecklistController::class, 'getHistory']);

    // Usuarios
    Route::get('/users',   [UserController::class, 'index']);
    Route::post('/users',  [UserController::class, 'store']);
    Route::delete('/users/{id}', [UserController::class, 'destroy']);

    // Alquileres — el admin asigna máquinas a clientes
    Route::post('/rentals', [RentalController::class, 'store']);
    Route::delete('/rentals/{id}', [RentalController::class, 'destroy']);

    // Reportes mensuales — descarga PDF y envío manual por mail
    Route::get('/reports/monthly/download', [ReportController::class, 'download']);
    Route::post('/reports/monthly/send', [ReportController::class, 'sendByMail']);

    // Cotizaciones (cliente → admin por mail)
    Route::post('/request-quote', [RentalQuoteController::class, 'store']);
});

require __DIR__.'/auth.php';

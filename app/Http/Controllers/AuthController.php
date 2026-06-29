<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $credentials = $request->validate([
            'email' => 'required|email',
            'password' => 'required|string',
        ]);

        if (Auth::attempt($credentials)) {
            $request->session()->regenerate();
            $user = Auth::user();

            // Usamos la redirección nativa de Laravel pasando el rol como variable de sesión temporal
           // En lugar de ir a la raíz, lo mandamos al distribuidor que lee las nuevas carpetas
// Cambiá la redirección para que use la nueva ruta de distribución
return redirect()->to('/dashboard-redirect?view=' . $user->role);
        }

        // Si falla, devolvemos a la vista de login con un error que Inertia sabe leer
        return Inertia::render('Login', [
            'error' => 'Las credenciales no coinciden con nuestros registros.'
        ]);
    }
}
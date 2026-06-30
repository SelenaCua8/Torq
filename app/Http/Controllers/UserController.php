<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    /**
     * Lista todos los usuarios (sin el propio admin).
     */
    public function index()
    {
        $users = User::where('role', '!=', 'admin')
                     ->select('id', 'name', 'username', 'email', 'role', 'created_at')
                     ->orderBy('role')
                     ->orderBy('name')
                     ->get();

        return response()->json($users, 200);
    }

    /**
     * Crea un nuevo usuario (mecánico o cliente) desde el panel del admin.
     * Se loguean con un usuario/apodo, sin necesidad de un mail real.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name'          => 'required|string|max:255',
            'username'      => 'required|string|max:50|alpha_dash|unique:users,username',
            'email'         => 'nullable|string|email|max:255|unique:users,email',
            'password'      => 'required|string|min:6',
            'role'          => 'required|in:mechanic,client',
            'phone'         => 'nullable|string|max:50',
            'cuit'          => 'nullable|string|max:50',
            'business_name' => 'nullable|string|max:255',
        ]);

        $user = User::create([
            'name'     => $validated['name'],
            'username' => $validated['username'],
            'email'    => $validated['email'] ?? null,
            'password' => Hash::make($validated['password']),
            'role'     => $validated['role'],
        ]);

        return response()->json([
            'message' => 'Usuario creado con éxito.',
            'user'    => $user->only('id', 'name', 'username', 'role')
        ], 201);
    }

    /**
     * Elimina un usuario (el admin no puede eliminarse a sí mismo).
     */
    public function destroy($id)
    {
        $user = User::findOrFail($id);

        if ($user->role === 'admin') {
            return response()->json(['message' => 'No podés eliminar una cuenta de administrador.'], 403);
        }

        $user->delete();

        return response()->json(['message' => 'Usuario eliminado correctamente.'], 200);
    }
}
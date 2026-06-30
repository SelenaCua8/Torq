<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            // Usuario/apodo para iniciar sesión, sin necesidad de un mail real
            $table->string('username')->nullable()->unique()->after('name');
            // El email pasa a ser opcional (solo informativo, no se usa para loguearse)
            $table->string('email')->nullable()->change();
        });

        // Generar un username temporal para usuarios existentes basado en su email,
        // para que ningún usuario quede sin username tras la migración.
        $users = \DB::table('users')->whereNull('username')->get();
        foreach ($users as $user) {
            $base = $user->email ? strstr($user->email, '@', true) : 'user' . $user->id;
            $username = $base;
            $i = 1;
            while (\DB::table('users')->where('username', $username)->where('id', '!=', $user->id)->exists()) {
                $username = $base . $i;
                $i++;
            }
            \DB::table('users')->where('id', $user->id)->update(['username' => $username]);
        }
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn('username');
            $table->string('email')->nullable(false)->change();
        });
    }
};

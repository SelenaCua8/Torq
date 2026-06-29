<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
   public function up(): void
    {
        Schema::create('maintenance_checklists', function (Blueprint $table) {
            $table->id();
            $table->foreignId('machine_id')->constrained('machines')->onDelete('cascade');
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade'); // El mecánico que lo hace
            
            // Guardamos las respuestas de los 23 ítems de forma limpia usando una estructura JSON en MySQL
            // Así guardamos el estado (Apto, No Apto, Reparar) y observaciones de cada ítem en un solo campo dinámico.
            $table->json('inspections'); 
            
            $table->text('general_observations')->nullable(); // Comentarios generales del mecánico
            $table->timestamps();
        });
    }
    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('maintenance_checklists');
    }
};

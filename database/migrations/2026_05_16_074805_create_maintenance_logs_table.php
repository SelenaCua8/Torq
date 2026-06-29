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
    Schema::create('maintenance_logs', function (Blueprint $table) {
        $table->id();
        $table->foreignId('machine_id')->constrained('machines')->onDelete('cascade');
        $table->foreignId('user_id')->constrained('users')->onDelete('cascade'); // El mecánico que lo hizo
        $table->integer('service_hours');    // Horómetro que tenía la máquina en ese service
        $table->enum('type', ['preventive', 'corrective']); // Preventivo o Arreglo por rotura
        
        // Guardamos el checklist completo de 23 puntos en formato JSON. 
        // Así podés meter respuestas tipo {'nivel_aceite': 'ok', 'luces': 'falla'} sin romper la tabla.
        $table->json('checklist_data')->nullable(); 
        
        $table->text('notes')->nullable();   // Observaciones generales del mecánico
        $table->timestamps();
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('maintenance_logs');
    }
};

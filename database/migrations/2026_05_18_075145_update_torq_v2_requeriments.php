<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Tabla de solicitudes de asistencia técnica del cliente
        if (!Schema::hasTable('service_requests')) {
            Schema::create('service_requests', function (Blueprint $table) {
                $table->id();
                $table->foreignId('machine_id')->constrained('machines')->onDelete('cascade');
                $table->foreignId('client_id')->constrained('users')->onDelete('cascade'); // FIX: usar users
                $table->text('issue_description');
                $table->string('status')->default('pending'); // pending, assigned, resolved
                $table->timestamps();
            });
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('service_requests');
    }
};

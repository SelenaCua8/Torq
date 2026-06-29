<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('machines', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('model');
            $table->string('serial_number')->unique();
            $table->integer('current_hours')->default(0);
            $table->string('ownership_type')->default('propia'); // 'propia' | 'terceros'
            $table->string('supplier_name')->nullable();          // Propietario si es terceros
            $table->decimal('subrental_cost', 10, 2)->nullable(); // Costo/hora para terceros
            $table->decimal('price_per_hour', 10, 2)->nullable(); // Tarifa de alquiler al cliente
            $table->string('status')->default('available');        // 'available' | 'rented' | 'maintenance'
            $table->integer('hours_for_service')->default(250);    // Umbral de service
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('machines');
    }
};

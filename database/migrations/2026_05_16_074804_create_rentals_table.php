<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('rentals', function (Blueprint $table) {
            $table->id();
            $table->foreignId('machine_id')->constrained('machines')->onDelete('cascade');
            $table->foreignId('client_id')->constrained('users')->onDelete('cascade'); // FIX: era 'clients', tabla correcta es 'users'
            $table->date('start_date');
            $table->date('end_date')->nullable();
            $table->integer('start_hours')->default(0);
            $table->enum('payment_type', ['monthly_advance', 'monthly_expired'])->default('monthly_advance');
            $table->decimal('price', 12, 2)->nullable();           // Precio total del contrato
            $table->decimal('price_per_hour', 10, 2)->nullable();  // Tarifa por hora pactada
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('rentals');
    }
};

<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

// Esta migración ya está integrada en create_machines_table — solo se ejecuta si la columna no existe
return new class extends Migration
{
    public function up(): void
    {
        if (Schema::hasTable('machines') && !Schema::hasColumn('machines', 'price_per_hour')) {
            Schema::table('machines', function (Blueprint $table) {
                $table->decimal('price_per_hour', 10, 2)->nullable()->after('subrental_cost');
            });
        }
    }

    public function down(): void
    {
        if (Schema::hasColumn('machines', 'price_per_hour')) {
            Schema::table('machines', function (Blueprint $table) {
                $table->dropColumn('price_per_hour');
            });
        }
    }
};

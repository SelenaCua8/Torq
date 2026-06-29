<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Machine extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'model',
        'serial_number',
        'status',
        'current_hours',
        'ownership_type',
        'supplier_name',
        'subrental_cost',
        'price_per_hour',
        'hours_for_service',
    ];

    protected $casts = [
        'current_hours'    => 'integer',
        'hours_for_service'=> 'integer',
        'subrental_cost'   => 'float',
        'price_per_hour'   => 'float',
    ];

    // Relación: contratos activos de esta máquina
    public function activeRental()
    {
        return $this->hasOne(Rental::class)
            ->where(function ($q) {
                $q->whereNull('end_date')
                  ->orWhere('end_date', '>=', now()->toDateString());
            });
    }
}

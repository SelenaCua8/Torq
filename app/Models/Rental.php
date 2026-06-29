<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Rental extends Model
{
    protected $fillable = [
        'machine_id', 'client_id', 'start_date', 'end_date',
        'start_hours', 'payment_type', 'price', 'price_per_hour',
    ];

    protected $casts = [
        'start_date'     => 'date',
        'end_date'       => 'date',
        'price'          => 'float',
        'price_per_hour' => 'float',
        'start_hours'    => 'integer',
    ];

    public function machine()  { return $this->belongsTo(Machine::class); }
    public function client()   { return $this->belongsTo(User::class, 'client_id'); }
}

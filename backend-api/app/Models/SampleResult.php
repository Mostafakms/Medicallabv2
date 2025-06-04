<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SampleResult extends Model
{
    use HasFactory;

    protected $fillable = [
        'sample_id',
        'results',
    ];

    protected $casts = [
        'results' => 'array',
    ];
}

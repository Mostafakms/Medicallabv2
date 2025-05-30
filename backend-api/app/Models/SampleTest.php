<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\Pivot;

class SampleTest extends Pivot
{
    protected $fillable = [
        'sample_id',
        'test_id',
        'status',
        'results',
        'notes'
    ];

    protected $casts = [
        'results' => 'array'
    ];
}

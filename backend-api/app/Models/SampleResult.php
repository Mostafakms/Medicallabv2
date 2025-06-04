<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SampleResult extends Model
{
    use HasFactory;

    protected $fillable = [
        'sample_id',
        'test_id',
        'results',
    ];

    protected $casts = [
        'results' => 'array',
    ];

    public function sample()
    {
        return $this->belongsTo(\App\Models\Sample::class, 'sample_id');
    }

    public function test()
    {
        return $this->belongsTo(\App\Models\Test::class, 'test_id');
    }
}

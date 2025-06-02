<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TestParameter extends Model
{
    protected $fillable = [
        'test_id',
        'name',
        'units',
        'normal_range',
        'order',
    ];

    public function test()
    {
        return $this->belongsTo(Test::class);
    }
}

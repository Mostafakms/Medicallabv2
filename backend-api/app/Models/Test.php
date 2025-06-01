<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Test extends Model
{
    protected $fillable = [
        'code',
        'name',
        'sample_types',
        'category',
        'department',
        'price',
        'duration',
        'status',
        'parameters'
    ];

    protected $casts = [
        'sample_types' => 'array',
        'parameters' => 'array',
        'price' => 'decimal:2'
    ];

    /**
     * Get the samples associated with the test
     */
    public function samples(): BelongsToMany
    {
        return $this->belongsToMany(Sample::class, 'sample_tests')
            ->using(\App\Models\SampleTest::class)
            ->withPivot(['status', 'results', 'notes'])
            ->withTimestamps();
    }
}

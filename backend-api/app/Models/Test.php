<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Test extends Model
{
    protected $with = ['parameters'];

    protected $fillable = [
        'code',
        'name',
        'sample_types',
        'category',
        'department',
        'price',
        'duration',
        'status'
    ];

    protected $casts = [
        'sample_types' => 'array',
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

    /**
     * Get the parameters associated with the test
     */
    public function parameters()
    {
        return $this->hasMany(TestParameter::class);
    }
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Sample extends Model
{
    protected $fillable = [
        'accession_number',
        'patient_id',
        'sample_type',
        'collection_date',
        'collection_time',
        'priority',
        'status',
        'location',
        'notes'
    ];

    protected $casts = [
        'collection_date' => 'date',
        'collection_time' => 'datetime:H:i',
    ];

    /**
     * Get the patient that owns the sample
     */
    public function patient(): BelongsTo
    {
        return $this->belongsTo(Patient::class);
    }

    /**
     * Get the tests associated with the sample
     */
    public function tests(): BelongsToMany
    {
        return $this->belongsToMany(Test::class, 'sample_tests')
            ->using(\App\Models\SampleTest::class)
            ->withPivot(['status', 'results', 'notes'])
            ->withTimestamps();
    }
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Patient extends Model
{
    protected $fillable = [
        'name',
        'age',
        'gender',
        'phone',
        'email',
        'address',
        'doctor', // Add doctor to fillable
    ];

    protected $casts = [
        'age' => 'integer'
    ];

    /**
     * Get all samples for the patient
     */
    public function samples(): HasMany
    {
        return $this->hasMany(Sample::class);
    }
}

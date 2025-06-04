<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LabSetting extends Model
{
    protected $fillable = [
        'name', 'address', 'phone', 'email', 'logo'
    ];
}

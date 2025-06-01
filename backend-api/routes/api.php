<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\PatientController;
use App\Http\Controllers\SampleController;
use App\Http\Controllers\TestController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

// Public routes
Route::post('/login', [AuthController::class, 'login'])->name('login');

// Patient routes
Route::get('patients/search', [PatientController::class, 'search']); // Moved patient search route above apiResource
Route::apiResource('patients', PatientController::class);
Route::get('patients/{patient}/samples', [PatientController::class, 'samples']);

// Sample routes
Route::apiResource('samples', SampleController::class);
Route::get('samples/{sample}/tests', [SampleController::class, 'tests']);
Route::post('samples/{sample}/tests', [SampleController::class, 'addTests']);
Route::put('samples/{sample}/tests/{test}', [SampleController::class, 'updateTest']);

// Test routes
Route::apiResource('tests', TestController::class);

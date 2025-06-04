<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\PatientController;
use App\Http\Controllers\SampleController;
use App\Http\Controllers\TestController;
use App\Http\Controllers\SampleResultController;
use App\Http\Controllers\LabSettingController;

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
Route::get('samples/accession/{accession_number}', [SampleController::class, 'showByAccession']);

// Test routes
Route::apiResource('tests', TestController::class);

// SampleResult routes
Route::apiResource('sample-results', SampleResultController::class)->only(['store']);
Route::get('sample-results/{sample_id}', [App\Http\Controllers\SampleResultController::class, 'show']);
Route::put('sample-results/{sample_id}', [App\Http\Controllers\SampleResultController::class, 'update']);
Route::patch('sample-results/{sample_id}', [App\Http\Controllers\SampleResultController::class, 'update']);

// Add a route to fetch all sample results
Route::get('sample-results', [App\Http\Controllers\SampleResultController::class, 'index']);
// Add a route to fetch all results for a given sample_id
Route::get('sample-results-by-sample', [App\Http\Controllers\SampleResultController::class, 'resultsBySample']);

// Lab Settings API
Route::get('/lab-settings', [LabSettingController::class, 'show']);
Route::post('/lab-settings', [LabSettingController::class, 'update']);

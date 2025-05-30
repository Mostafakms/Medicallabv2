<?php

namespace App\Http\Controllers;

use App\Http\Requests\StorePatientRequest;
use App\Http\Requests\UpdatePatientRequest;
use App\Http\Resources\PatientResource;
use App\Http\Resources\SampleResource;
use App\Models\Patient;
use Illuminate\Http\Response;

class PatientController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $patients = Patient::query()
            ->withCount('samples')
            ->paginate();
        
        return PatientResource::collection($patients);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StorePatientRequest $request)
    {
        $patient = Patient::create($request->validated());
        
        return new PatientResource($patient);
    }

    /**
     * Display the specified resource.
     */
    public function show(Patient $patient)
    {
        $patient->load('samples');
        
        return new PatientResource($patient);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Patient $patient)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdatePatientRequest $request, Patient $patient)
    {
        $patient->update($request->validated());
        
        return new PatientResource($patient);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Patient $patient)
    {
        $patient->delete();
        
        return response()->noContent();
    }

    /**
     * Get all samples for the specified patient.
     */
    public function samples(Patient $patient)
    {
        $samples = $patient->samples()
            ->with('tests')
            ->paginate();
        
        return SampleResource::collection($samples);
    }
}

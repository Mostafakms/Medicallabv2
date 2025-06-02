<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreSampleRequest;
use App\Http\Requests\UpdateSampleRequest;
use App\Http\Resources\SampleResource;
use App\Http\Resources\TestResource;
use App\Models\Sample;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Log;

class SampleController extends Controller
{
    /**
     * Display a listing of samples.
     */
    public function index()
    {
        $samples = Sample::with(['patient', 'tests'])
            ->paginate();
        
        return SampleResource::collection($samples);
    }

    /**
     * Store a newly created sample.
     */
    public function store(StoreSampleRequest $request)
    {
        Log::info('StoreSampleRequest received', $request->all());
        $sample = Sample::create($request->validated());
        if ($request->has('tests')) {
            $syncData = [];
            foreach ($request->tests as $testId) {
                $syncData[$testId] = [
                    'status' => 'Pending',
                    'results' => null,
                    'notes' => null,
                ];
            }
            Log::info('Syncing tests with data', $syncData);
            $sample->tests()->sync($syncData);
        }
        $sample->load(['patient', 'tests']);
        Log::info('Sample after sync', $sample->toArray());
        return new SampleResource($sample);
    }

    /**
     * Display the specified sample.
     */
    public function show(Sample $sample)
    {
        $sample->load(['patient', 'tests']);
        return new SampleResource($sample);
    }

    /**
     * Update the specified sample.
     */
    public function update(UpdateSampleRequest $request, Sample $sample)
    {
        Log::info('UpdateSampleRequest received', $request->all());
        $sample->update($request->validated());
        if ($request->has('tests')) {
            $syncData = [];
            foreach ($request->tests as $testId) {
                $syncData[$testId] = [
                    'status' => 'Pending',
                    'results' => null,
                    'notes' => null,
                ];
            }
            Log::info('Syncing tests with data', $syncData);
            $sample->tests()->sync($syncData);
        }
        $sample->load(['patient', 'tests']);
        Log::info('Sample after sync', $sample->toArray());
        
        return new SampleResource($sample);
    }

    /**
     * Remove the specified sample.
     */
    public function destroy(Sample $sample)
    {
        $sample->delete();
        return response()->noContent();
    }

    /**
     * Get all tests for the specified sample.
     */
    public function tests(Sample $sample)
    {
        return TestResource::collection($sample->tests);
    }

    Public function showByAccession($accession_number)
    {
        $sample = Sample::where('accession_number', $accession_number)->firstOrFail();
        $sample->load(['patient', 'tests']);
        return new SampleResource($sample);
    }
    /**
     * Add tests to the specified sample.
     */
    public function addTests(Request $request, Sample $sample)
    {
        $validated = $request->validate([
            'tests' => ['required', 'array'],
            'tests.*' => ['required', 'exists:tests,id']
        ]);

        $sample->tests()->attach($validated['tests']);
        $sample->load('tests');
        
        return TestResource::collection($sample->tests);
    }

    /**
     * Update test results for a specific test in the sample.
     */
    public function updateTest(Request $request, Sample $sample, $testId)
    {
        $validated = $request->validate([
            'status' => ['required', 'string', 'in:Pending,In Progress,Completed,Cancelled'],
            'results' => ['nullable', 'array'],
            'notes' => ['nullable', 'string']
        ]);

        $sample->tests()->updateExistingPivot($testId, $validated);
        $sample->load('tests');
        
        return new TestResource($sample->tests->find($testId));
    }
}

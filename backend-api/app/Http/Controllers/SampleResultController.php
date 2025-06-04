<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\SampleResult;

class SampleResultController extends Controller
{
    /**
     * Display a listing of all sample results with patient data.
     */
    public function index()
    {
        // Eager load sample and patient for each result
        $sampleResults = SampleResult::with(['sample.patient', 'test'])->get();

        if ($sampleResults->isEmpty()) {
            return response()->json(['message' => 'No sample results found.'], 404);
        }
        return response()->json(['data' => $sampleResults], 200);
    }

    /**
     * Display the specified resource (by sample_id).
     */
    public function show($sample_id, $test_id)
    {
        $sampleResult = SampleResult::with(['sample.patient', 'test'])
            ->where('sample_id', $sample_id)
            ->where('test_id', $test_id)
            ->first();
        if (!$sampleResult) {
            return response()->json(['message' => 'No results found for this sample and test.'], 404);
        }
        return response()->json(['data' => $sampleResult]);
    }

    /**
     * Store or update results for a sample (upsert).
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'sample_id' => 'required|exists:samples,id',
            'test_id' => 'required|exists:tests,id',
            'results' => 'required|array',
        ]);

        // Upsert: update if exists, else create
        $sampleResult = SampleResult::updateOrCreate(
            [
                'sample_id' => $validated['sample_id'],
                'test_id' => $validated['test_id'],
            ],
            ['results' => $validated['results']]
        );

        return response()->json(['message' => 'Sample results saved successfully.', 'data' => $sampleResult], 201);
    }

    /**
     * Update the specified resource in storage (PUT/PATCH).
     */
    public function update(Request $request, $sample_id)
    {
        $validated = $request->validate([
            'results' => 'required|array',
            'test_id' => 'required|exists:tests,id',
        ]);
        $sampleResult = SampleResult::where('sample_id', $sample_id)
            ->where('test_id', $validated['test_id'])
            ->first();
        if (!$sampleResult) {
            return response()->json(['message' => 'No results found for this sample and test.'], 404);
        }
        $sampleResult->results = $validated['results'];
        $sampleResult->save();
        return response()->json(['message' => 'Sample results updated successfully.', 'data' => $sampleResult]);
    }

    /**
     * Return all results for a given sample_id (for frontend prefill)
     */
    public function resultsBySample(Request $request)
    {
        $sample_id = $request->query('sample_id');
        if (!$sample_id) {
            return response()->json(['message' => 'sample_id is required'], 400);
        }
        $results = SampleResult::with(['test'])
            ->where('sample_id', $sample_id)
            ->get();
        return response()->json(['data' => $results], 200);
    }
}

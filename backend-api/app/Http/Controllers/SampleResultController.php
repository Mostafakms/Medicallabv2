<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\SampleResult;

class SampleResultController extends Controller
{
    /**
     * Display the specified resource (by sample_id).
     */
    public function show($sample_id)
    {
        $sampleResult = SampleResult::where('sample_id', $sample_id)->first();
        if (!$sampleResult) {
            return response()->json(['message' => 'No results found for this sample.'], 404);
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
            'results' => 'required|array',
        ]);

        // Upsert: update if exists, else create
        $sampleResult = SampleResult::updateOrCreate(
            ['sample_id' => $validated['sample_id']],
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
        ]);
        $sampleResult = SampleResult::where('sample_id', $sample_id)->first();
        if (!$sampleResult) {
            return response()->json(['message' => 'No results found for this sample.'], 404);
        }
        $sampleResult->results = $validated['results'];
        $sampleResult->save();
        return response()->json(['message' => 'Sample results updated successfully.', 'data' => $sampleResult]);
    }
}

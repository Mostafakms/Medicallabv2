<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\SampleResult;

class SampleResultController extends Controller
{
    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'sample_id' => 'required|exists:samples,id',
            'results' => 'required|json',
        ]);

        $sampleResult = SampleResult::create($validated);

        return response()->json(['message' => 'Sample results saved successfully.', 'data' => $sampleResult], 201);
    }
}

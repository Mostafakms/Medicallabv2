<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreTestRequest;
use App\Http\Requests\UpdateTestRequest;
use App\Http\Resources\TestResource;
use App\Models\Test;
use Illuminate\Http\Request;

class TestController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Test::query()->withCount('samples');

        // Filter by sample type if provided
        if ($request->has('sample_type')) {
            $sampleType = $request->sample_type;
            $query->where(function($q) use ($sampleType) {
                $q->whereRaw("JSON_SEARCH(LOWER(sample_types), 'one', LOWER(?)) IS NOT NULL", ["{$sampleType}%"]);
            });
        }

        // Filter by usage if provided
        if ($request->has('usage') && $request->usage === 'active') {
            $query->has('samples');
        }

        // Filter by category if provided
        if ($request->has('category')) {
            $query->where('category', $request->category);
        }

        // Filter by department if provided
        if ($request->has('department')) {
            $query->where('department', $request->department);
        }

        // Filter by status if provided
        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        $tests = $query->get(); // Fetch all tests without pagination
        return TestResource::collection($tests);
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
    public function store(StoreTestRequest $request)
    {
        $validated = $request->validated();
        $parameters = $validated['parameters'] ?? [];
        unset($validated['parameters']);

        $test = Test::create($validated);

        // Create TestParameter records for each parameter object
        foreach ($parameters as $index => $param) {
            $test->parameters()->create([
                'name' => $param['name'],
                'order' => $index + 1,
                'units' => $param['units'] ?? null,
                'normal_range' => $param['normal_range'] ?? null,
            ]);
        }

        return new TestResource($test->fresh());
    }

    /**
     * Display the specified resource.
     */
    public function show(Test $test)
    {
        return new TestResource($test);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Test $test)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateTestRequest $request, Test $test)
    {
        $test->update($request->validated());
        return new TestResource($test);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Test $test)
    {
        $test->delete();
        return response()->noContent();
    }
}

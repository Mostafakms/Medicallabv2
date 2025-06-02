<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TestResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        // Ensure parameters is always a collection (relationship), not an attribute/array/string
        $parameters = $this->parameters;
        if (!($parameters instanceof \Illuminate\Support\Collection)) {
            $parameters = collect([]);
        }
        return [
            'id' => $this->id,
            'code' => $this->code,
            'name' => $this->name,
            'sample_types' => $this->sample_types,
            'category' => $this->category,
            'department' => $this->department,
            'price' => $this->price,
            'duration' => $this->duration,
            'status' => $this->status,
            // Return parameters as array of objects from test_parameters table
            'parameters' => $parameters->map(function ($param) {
                return [
                    'id' => $param->id ?? null,
                    'name' => $param->name ?? null,
                    'units' => $param->units ?? null,
                    'normal_range' => $param->normal_range ?? null,
                    'order' => $param->order ?? null,
                ];
            })->sortBy('order')->values(),
            'samples_count' => $this->whenCounted('samples'),
            // Include pivot data when available
            'pivot' => $this->whenPivotLoaded('sample_tests', function () {
                return [
                    'status' => $this->pivot->status,
                    'results' => $this->pivot->results,
                    'notes' => $this->pivot->notes,
                ];
            }),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}

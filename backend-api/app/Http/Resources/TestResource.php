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
            'parameters' => $this->parameters,
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

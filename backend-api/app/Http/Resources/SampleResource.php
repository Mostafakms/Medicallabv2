<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class SampleResource extends JsonResource
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
            'accession_number' => $this->accession_number,
            'patient_id' => $this->patient_id,
            'patient' => new PatientResource($this->whenLoaded('patient')),
            'sample_type' => $this->sample_type,
            'collection_date' => $this->collection_date,
            'collection_time' => $this->collection_time,
            'priority' => $this->priority,
            'status' => $this->status,
            'location' => $this->location,
            'notes' => $this->notes,
            // Return test IDs for frontend mapping
            'sample_tests' => $this->tests->pluck('id'),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}

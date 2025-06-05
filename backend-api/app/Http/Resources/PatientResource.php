<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PatientResource extends JsonResource
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
            'name' => $this->name,
            'age' => $this->age,
            'gender' => $this->gender,
            'phone' => $this->phone,
            'email' => $this->email,
            'address' => $this->address,
            'doctor' => $this->doctor,
            'samples_count' => $this->whenLoaded('samples', function() {
                return $this->samples->count();
            }),
            'samples' => SampleResource::collection($this->whenLoaded('samples')),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}

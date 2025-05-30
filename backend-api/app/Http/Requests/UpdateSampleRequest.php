<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateSampleRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'patient_id' => ['sometimes', 'required', 'exists:patients,id'],
            'accession_number' => [
                'sometimes',
                'required',
                'string',
                Rule::unique('samples')->ignore($this->route('sample'))
            ],
            'sample_type' => ['sometimes', 'required', 'string', 'in:Blood,Urine,Stool,Sputum,Tissue'],
            'collection_date' => ['sometimes', 'required', 'date'],
            'collection_time' => ['sometimes', 'required', 'date_format:H:i'],
            'priority' => ['sometimes', 'required', 'string', 'in:Normal,Urgent,Stat'],
            'status' => ['sometimes', 'required', 'string', 'in:Pending,Processing,Completed'],
            'location' => ['sometimes', 'nullable', 'string', 'max:255'],
            'notes' => ['sometimes', 'nullable', 'string'],
        ];
    }
}

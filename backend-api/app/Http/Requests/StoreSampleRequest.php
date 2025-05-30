<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreSampleRequest extends FormRequest
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
            'patient_id' => ['required', 'exists:patients,id'],
            'accession_number' => ['required', 'string', 'unique:samples,accession_number'],
            'sample_type' => ['required', 'string', 'in:Blood,Urine,Stool,Sputum,Tissue'],
            'collection_date' => ['required', 'date'],
            'collection_time' => ['required', 'date_format:H:i'],
            'priority' => ['required', 'string', 'in:Normal,Urgent,Stat'],
            'status' => ['required', 'string', 'in:Pending,Processing,Completed'],
            'location' => ['nullable', 'string', 'max:255'],
            'notes' => ['nullable', 'string'],
            'tests' => ['sometimes', 'array'],
            'tests.*' => ['required', 'exists:tests,id'],
        ];
    }
}

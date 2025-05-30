<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreTestRequest extends FormRequest
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
            'code' => ['required', 'string', 'unique:tests,code'],
            'name' => ['required', 'string', 'max:255'],
            'sample_types' => ['required', 'array'],
            'sample_types.*' => ['required', 'string', 'in:Blood,Urine,Stool,Sputum,Tissue'],
            'category' => ['required', 'string', 'max:255'],
            'department' => ['required', 'string', 'max:255'],
            'price' => ['required', 'numeric', 'min:0'],
            'duration' => ['required', 'string', 'max:255'],
            'status' => ['required', 'string', 'in:Active,Inactive'],
            'parameters' => ['required', 'array'],
            'parameters.*' => ['required', 'string', 'max:255'],
        ];
    }
}

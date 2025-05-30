<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateTestRequest extends FormRequest
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
            'code' => [
                'sometimes',
                'required',
                'string',
                Rule::unique('tests')->ignore($this->route('test'))
            ],
            'name' => ['sometimes', 'required', 'string', 'max:255'],
            'sample_types' => ['sometimes', 'required', 'array'],
            'sample_types.*' => ['required', 'string', 'in:Blood,Urine,Stool,Sputum,Tissue'],
            'category' => ['sometimes', 'required', 'string', 'max:255'],
            'department' => ['sometimes', 'required', 'string', 'max:255'],
            'price' => ['sometimes', 'required', 'numeric', 'min:0'],
            'duration' => ['sometimes', 'required', 'string', 'max:255'],
            'status' => ['sometimes', 'required', 'string', 'in:Active,Inactive'],
            'parameters' => ['sometimes', 'required', 'array'],
            'parameters.*' => ['required', 'string', 'max:255'],
        ];
    }
}

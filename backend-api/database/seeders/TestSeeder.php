<?php

namespace Database\Seeders;

use App\Models\Test;
use Illuminate\Database\Seeder;

class TestSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $tests = [
            [
                'code' => 'CBC',
                'name' => 'Complete Blood Count',
                'sample_types' => ['Blood'],
                'category' => 'Hematology',
                'department' => 'Laboratory',
                'price' => 45.00,
                'duration' => '2-4 hours',
                'status' => 'Active',
                'parameters' => ['RBC', 'WBC', 'Platelets', 'Hemoglobin', 'Hematocrit']
            ],
            [
                'code' => 'LIP',
                'name' => 'Lipid Profile',
                'sample_types' => ['Blood'],
                'category' => 'Clinical Chemistry',
                'department' => 'Laboratory',
                'price' => 35.00,
                'duration' => '1-2 hours',
                'status' => 'Active',
                'parameters' => ['Total Cholesterol', 'HDL', 'LDL', 'Triglycerides']
            ],
            [
                'code' => 'UA',
                'name' => 'Urinalysis',
                'sample_types' => ['Urine'],
                'category' => 'Clinical Chemistry',
                'department' => 'Laboratory',
                'price' => 25.00,
                'duration' => '30 minutes',
                'status' => 'Active',
                'parameters' => ['pH', 'Protein', 'Glucose', 'Ketones', 'Blood', 'Leukocytes']
            ],
        ];

        foreach ($tests as $test) {
            Test::create($test);
        }
    }
}

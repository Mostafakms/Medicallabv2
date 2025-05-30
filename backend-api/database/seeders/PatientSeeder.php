<?php

namespace Database\Seeders;

use App\Models\Patient;
use Illuminate\Database\Seeder;

class PatientSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $patients = [
            [
                'name' => 'John Doe',
                'age' => 45,
                'gender' => 'Male',
                'phone' => '123-456-7890',
                'email' => 'john.doe@example.com',
                'address' => '123 Main St, Anytown, ST 12345'
            ],
            [
                'name' => 'Jane Smith',
                'age' => 32,
                'gender' => 'Female',
                'phone' => '234-567-8901',
                'email' => 'jane.smith@example.com',
                'address' => '456 Oak Ave, Somewhere, ST 23456'
            ],
            [
                'name' => 'Bob Johnson',
                'age' => 58,
                'gender' => 'Male',
                'phone' => '345-678-9012',
                'email' => 'bob.johnson@example.com',
                'address' => '789 Pine Rd, Elsewhere, ST 34567'
            ],
        ];

        foreach ($patients as $patient) {
            Patient::create($patient);
        }
    }
}

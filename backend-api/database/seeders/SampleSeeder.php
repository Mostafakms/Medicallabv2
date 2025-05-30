<?php

namespace Database\Seeders;

use App\Models\Sample;
use Illuminate\Database\Seeder;

class SampleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // First sample for patient 1 with CBC test
        $sample1 = Sample::create([
            'accession_number' => 'ACC001',
            'patient_id' => 1,
            'sample_type' => 'Blood',
            'collection_date' => '2025-05-25',
            'collection_time' => '09:00',
            'priority' => 'Normal',
            'status' => 'Pending',
            'location' => 'Lab Station 1'
        ]);
        $sample1->tests()->attach(1, [
            'status' => 'Pending',
            'results' => json_encode(null),
            'notes' => 'Routine checkup'
        ]);

        // Second sample for patient 2 with Lipid Profile
        $sample2 = Sample::create([
            'accession_number' => 'ACC002',
            'patient_id' => 2,
            'sample_type' => 'Blood',
            'collection_date' => '2025-05-25',
            'collection_time' => '10:15',
            'priority' => 'Urgent',
            'status' => 'Processing',
            'location' => 'Lab Station 2'
        ]);
        $sample2->tests()->attach(2, [
            'status' => 'In Progress',
            'results' => json_encode(null),
            'notes' => 'Patient fasting confirmed'
        ]);

        // Third sample for patient 3 with Urinalysis
        $sample3 = Sample::create([
            'accession_number' => 'ACC003',
            'patient_id' => 3,
            'sample_type' => 'Urine',
            'collection_date' => '2025-05-25',
            'collection_time' => '11:30',
            'priority' => 'Stat',
            'status' => 'Completed',
            'location' => 'Storage'
        ]);
        $sample3->tests()->attach(3, [
            'status' => 'Completed',
            'results' => json_encode([
                'pH' => '6.5',
                'Protein' => 'Negative',
                'Glucose' => 'Negative',
                'Ketones' => 'Negative',
                'Blood' => 'Negative',
                'Leukocytes' => 'Negative'
            ]),
            'notes' => 'Results within normal range'
        ]);
    }
}

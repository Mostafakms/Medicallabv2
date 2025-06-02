<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Test;
use App\Models\TestParameter;

class TestParameterSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Common parameter metadata (extend as needed)
        $parameterMeta = [
            // Hematology
            'Hemoglobin' => ['units' => 'g/dL', 'normal_range' => '13.0-17.0 (M), 12.0-15.0 (F)'],
            'WBC' => ['units' => '10^3/uL', 'normal_range' => '4.0-11.0'],
            'RBC' => ['units' => '10^6/uL', 'normal_range' => '4.5-5.9 (M), 4.1-5.1 (F)'],
            'Platelets' => ['units' => '10^3/uL', 'normal_range' => '150-400'],
            'Hematocrit' => ['units' => '%', 'normal_range' => '40-52 (M), 36-48 (F)'],
            'MCV' => ['units' => 'fL', 'normal_range' => '80-100'],
            'MCH' => ['units' => 'pg', 'normal_range' => '27-33'],
            'MCHC' => ['units' => 'g/dL', 'normal_range' => '32-36'],
            'RDW' => ['units' => '%', 'normal_range' => '11.5-14.5'],
            'Differential Count' => ['units' => '%', 'normal_range' => 'Neutrophils 40-70, Lymphocytes 20-45, Monocytes 2-10, Eosinophils 1-6, Basophils 0-1'],
            'ESR Value' => ['units' => 'mm/hr', 'normal_range' => '0-15 (M), 0-20 (F)'],
            'Reticulocyte Percentage' => ['units' => '%', 'normal_range' => '0.5-2.5'],
            'Absolute Reticulocyte Count' => ['units' => '10^3/uL', 'normal_range' => '25-75'],
            'HbA' => ['units' => '%', 'normal_range' => '95-98'],
            'HbA2' => ['units' => '%', 'normal_range' => '2-3.5'],
            'HbF' => ['units' => '%', 'normal_range' => '<2'],
            'HbS' => ['units' => '%', 'normal_range' => '0'],
            'Other Variants' => ['units' => 'N/A', 'normal_range' => 'N/A'],
            // Chemistry
            'Glucose' => ['units' => 'mg/dL', 'normal_range' => '70-99 (Fasting)'],
            'Urea (BUN)' => ['units' => 'mg/dL', 'normal_range' => '7-20'],
            'Creatinine' => ['units' => 'mg/dL', 'normal_range' => '0.7-1.3 (M), 0.6-1.1 (F)'],
            'Sodium (Na+)' => ['units' => 'mmol/L', 'normal_range' => '135-145'],
            'Potassium (K+)' => ['units' => 'mmol/L', 'normal_range' => '3.5-5.1'],
            'Chloride (Cl-)' => ['units' => 'mmol/L', 'normal_range' => '98-107'],
            'Bicarbonate (HCO3- or Total CO2)' => ['units' => 'mmol/L', 'normal_range' => '22-29'],
            'Bicarbonate (CO2)' => ['units' => 'mmol/L', 'normal_range' => '22-29'],
            'Calcium' => ['units' => 'mg/dL', 'normal_range' => '8.5-10.5'],
            'Albumin' => ['units' => 'g/dL', 'normal_range' => '3.5-5.0'],
            'Total Protein' => ['units' => 'g/dL', 'normal_range' => '6.0-8.3'],
            'Globulin' => ['units' => 'g/dL', 'normal_range' => '2.0-3.5'],
            'A/G Ratio' => ['units' => 'ratio', 'normal_range' => '1.2-2.2'],
            'Total Bilirubin' => ['units' => 'mg/dL', 'normal_range' => '0.1-1.2'],
            'Direct Bilirubin' => ['units' => 'mg/dL', 'normal_range' => '0.0-0.3'],
            'Indirect Bilirubin' => ['units' => 'mg/dL', 'normal_range' => '0.1-1.0'],
            'ALT (SGPT)' => ['units' => 'U/L', 'normal_range' => '7-56'],
            'AST (SGOT)' => ['units' => 'U/L', 'normal_range' => '5-40'],
            'ALP (Alkaline Phosphatase)' => ['units' => 'U/L', 'normal_range' => '44-147'],
            'GGT' => ['units' => 'U/L', 'normal_range' => '9-48'],
            'Uric Acid' => ['units' => 'mg/dL', 'normal_range' => '3.5-7.2 (M), 2.6-6.0 (F)'],
            'eGFR (Calculated)' => ['units' => 'mL/min/1.73m2', 'normal_range' => '>60'],
            'HbA1c %' => ['units' => '%', 'normal_range' => '<5.7'],
            'Estimated Average Glucose (eAG)' => ['units' => 'mg/dL', 'normal_range' => '<117'],
            'Total Cholesterol' => ['units' => 'mg/dL', 'normal_range' => '<200'],
            'HDL Cholesterol' => ['units' => 'mg/dL', 'normal_range' => '>40 (M), >50 (F)'],
            'LDL Cholesterol (Calculated)' => ['units' => 'mg/dL', 'normal_range' => '<100'],
            'Triglycerides' => ['units' => 'mg/dL', 'normal_range' => '<150'],
            'VLDL Cholesterol (Calculated)' => ['units' => 'mg/dL', 'normal_range' => '5-40'],
            // Urinalysis
            'Color' => ['units' => 'N/A', 'normal_range' => 'Yellow'],
            'Appearance' => ['units' => 'N/A', 'normal_range' => 'Clear'],
            'Specific Gravity' => ['units' => '', 'normal_range' => '1.005-1.030'],
            'pH' => ['units' => '', 'normal_range' => '4.6-8.0'],
            'Protein' => ['units' => '', 'normal_range' => 'Negative'],
            'Glucose' => ['units' => 'mg/dL', 'normal_range' => 'Negative'],
            'Ketones' => ['units' => '', 'normal_range' => 'Negative'],
            'Bilirubin' => ['units' => '', 'normal_range' => 'Negative'],
            'Urobilinogen' => ['units' => 'EU/dL', 'normal_range' => '0.1-1.0'],
            'Nitrite' => ['units' => '', 'normal_range' => 'Negative'],
            'Leukocyte Esterase' => ['units' => '', 'normal_range' => 'Negative'],
            'Blood/Hemoglobin' => ['units' => '', 'normal_range' => 'Negative'],
            'Microscopic Examination (RBC, WBC, Epithelial cells, Casts, Crystals, Bacteria)' => ['units' => 'N/A', 'normal_range' => 'See report'],
            // Coagulation
            'Prothrombin Time (PT)' => ['units' => 'sec', 'normal_range' => '11-13.5'],
            'INR (International Normalized Ratio)' => ['units' => 'ratio', 'normal_range' => '0.8-1.2'],
            'APTT Value' => ['units' => 'sec', 'normal_range' => '25-35'],
            // Blood Grouping
            'ABO Group' => ['units' => 'N/A', 'normal_range' => 'A, B, AB, O'],
            'Rh (D) Type' => ['units' => 'N/A', 'normal_range' => 'Positive/Negative'],
            // Endocrinology/Thyroid
            'TSH Level' => ['units' => 'uIU/mL', 'normal_range' => '0.4-4.0'],
            'Free T4 Level' => ['units' => 'ng/dL', 'normal_range' => '0.8-1.8'],
            'Free T3 Level' => ['units' => 'pg/mL', 'normal_range' => '2.3-4.2'],
            'Prolactin Level' => ['units' => 'ng/mL', 'normal_range' => '2-18 (M), 2-29 (F)'],
            '25-OH Vitamin D Level' => ['units' => 'ng/mL', 'normal_range' => '30-100'],
            // Serology/Immunology
            'HIV-1 Ab' => ['units' => 'N/A', 'normal_range' => 'Negative'],
            'HIV-2 Ab' => ['units' => 'N/A', 'normal_range' => 'Negative'],
            'HIV p24 Ag' => ['units' => 'N/A', 'normal_range' => 'Negative'],
            'Overall Result' => ['units' => 'N/A', 'normal_range' => 'Negative'],
            'HBsAg Result' => ['units' => 'N/A', 'normal_range' => 'Negative'],
            'Anti-HCV Result' => ['units' => 'N/A', 'normal_range' => 'Negative'],
            'VDRL Reactivity' => ['units' => 'N/A', 'normal_range' => 'Non-reactive'],
            'Titer (if reactive)' => ['units' => 'N/A', 'normal_range' => '<1:8'],
            'CRP Level' => ['units' => 'mg/L', 'normal_range' => '<5'],
            'RF Level' => ['units' => 'IU/mL', 'normal_range' => '<14'],
            'ASO Titre Level' => ['units' => 'IU/mL', 'normal_range' => '<200'],
            // Microbiology
            'Organism(s) Identified' => ['units' => 'N/A', 'normal_range' => 'None detected'],
            'Colony Count' => ['units' => 'CFU/mL', 'normal_range' => '<10^5'],
            'Antibiotic Sensitivity Profile' => ['units' => 'N/A', 'normal_range' => 'Sensitive/Resistant'],
            'Organism(s) Identified (if any)' => ['units' => 'N/A', 'normal_range' => 'None detected'],
            'Time to Positivity' => ['units' => 'hr', 'normal_range' => '<48'],
            'Pathogen(s) Identified (e.g., Salmonella, Shigella, Campylobacter)' => ['units' => 'N/A', 'normal_range' => 'None detected'],
            'Gram Reaction (Positive/Negative)' => ['units' => 'N/A', 'normal_range' => 'Positive/Negative'],
            'Morphology (Cocci/Bacilli)' => ['units' => 'N/A', 'normal_range' => 'Cocci/Bacilli'],
            'Presence of WBCs' => ['units' => '/hpf', 'normal_range' => '0-5'],
            'Presence of Epithelial Cells' => ['units' => '/hpf', 'normal_range' => '0-5'],
            'Presence of AFB' => ['units' => 'N/A', 'normal_range' => 'Negative'],
            'Quantification (if positive)' => ['units' => 'N/A', 'normal_range' => 'See report'],
            // Semen
            'Volume' => ['units' => 'mL', 'normal_range' => '1.5-6.0'],
            'Sperm Concentration' => ['units' => 'million/mL', 'normal_range' => '>15'],
            'Motility' => ['units' => '%', 'normal_range' => '>40'],
            'Morphology' => ['units' => '%', 'normal_range' => '>4'],
            'Vitality' => ['units' => '%', 'normal_range' => '>58'],
            'WBC Count' => ['units' => '10^6/mL', 'normal_range' => '<1'],
            // Coagulation
            'D-Dimer Level' => ['units' => 'ng/mL', 'normal_range' => '<500'],
            // Tumor Markers
            'Ferritin Level' => ['units' => 'ng/mL', 'normal_range' => '30-400 (M), 13-150 (F)'],
            'Serum Iron' => ['units' => 'ug/dL', 'normal_range' => '60-170'],
            'TIBC (Total Iron Binding Capacity)' => ['units' => 'ug/dL', 'normal_range' => '240-450'],
            'Transferrin Saturation %' => ['units' => '%', 'normal_range' => '20-50'],
            'Ferritin (often included)' => ['units' => 'ng/mL', 'normal_range' => '30-400 (M), 13-150 (F)'],
            'Total PSA Level' => ['units' => 'ng/mL', 'normal_range' => '<4'],
            'Beta HCG Level' => ['units' => 'mIU/mL', 'normal_range' => '<5'],
            'Cortisol Level' => ['units' => 'ug/dL', 'normal_range' => '5-25 (AM), 3-16 (PM)'],
            'Troponin I/T Level' => ['units' => 'ng/mL', 'normal_range' => '<0.04'],
            // Urine
            'Collection Volume' => ['units' => 'mL', 'normal_range' => '800-2000'],
            'Collection Duration' => ['units' => 'hr', 'normal_range' => '24'],
            'Microalbumin Level' => ['units' => 'mg/g', 'normal_range' => '<30'],
            'Albumin/Creatinine Ratio' => ['units' => 'mg/g', 'normal_range' => '<30'],
            // Stool
            'Occult Blood Result' => ['units' => 'N/A', 'normal_range' => 'Negative'],
            'Microscopy' => ['units' => 'N/A', 'normal_range' => 'See report'],
            'Ova' => ['units' => 'N/A', 'normal_range' => 'None detected'],
            'Parasites' => ['units' => 'N/A', 'normal_range' => 'None detected'],
            'Cysts' => ['units' => 'N/A', 'normal_range' => 'None detected'],
            // Sputum
            'Organism Identification' => ['units' => 'N/A', 'normal_range' => 'None detected'],
            'Antibiotic Sensitivity' => ['units' => 'N/A', 'normal_range' => 'Sensitive/Resistant'],
            // Cytology
            'Cell Types' => ['units' => 'N/A', 'normal_range' => 'See report'],
            'Abnormal Cells' => ['units' => 'N/A', 'normal_range' => 'None detected'],
            'Malignant Cells' => ['units' => 'N/A', 'normal_range' => 'None detected'],
            // Tissue
            'Tissue Type' => ['units' => 'N/A', 'normal_range' => 'See report'],
            'Microscopic Findings' => ['units' => 'N/A', 'normal_range' => 'See report'],
            'Diagnosis' => ['units' => 'N/A', 'normal_range' => 'See report'],
            'Adequacy' => ['units' => 'N/A', 'normal_range' => 'Adequate'],
            // Malaria
            'Species Identification' => ['units' => 'N/A', 'normal_range' => 'None detected'],
            'Parasite Count' => ['units' => '/uL', 'normal_range' => '<5000'],
            'Rapid Test' => ['units' => 'N/A', 'normal_range' => 'Negative'],
            // Lupus
            'ANA' => ['units' => 'N/A', 'normal_range' => 'Negative'],
            'Anti-dsDNA' => ['units' => 'IU/mL', 'normal_range' => '<30'],
            'Anti-Sm' => ['units' => 'N/A', 'normal_range' => 'Negative'],
            'Anti-RNP' => ['units' => 'N/A', 'normal_range' => 'Negative'],
            'C3' => ['units' => 'mg/dL', 'normal_range' => '90-180'],
            'C4' => ['units' => 'mg/dL', 'normal_range' => '10-40'],
            // Drug Screen
            'Opiates' => ['units' => 'ng/mL', 'normal_range' => '<2000'],
            'Cocaine' => ['units' => 'ng/mL', 'normal_range' => '<300'],
            'Amphetamines' => ['units' => 'ng/mL', 'normal_range' => '<1000'],
            'Cannabinoids' => ['units' => 'ng/mL', 'normal_range' => '<50'],
            'Benzodiazepines' => ['units' => 'ng/mL', 'normal_range' => '<200'],
            'Barbiturates' => ['units' => 'ng/mL', 'normal_range' => '<200'],
            // Stone Analysis
            'Stone Composition' => ['units' => 'N/A', 'normal_range' => 'See report'],
            'Crystal Type' => ['units' => 'N/A', 'normal_range' => 'See report'],
            'Chemical Analysis' => ['units' => 'N/A', 'normal_range' => 'See report'],
            // H. pylori
            'H. pylori Antigen' => ['units' => 'N/A', 'normal_range' => 'Negative'],
            // Fecal Elastase
            'Elastase-1 Level' => ['units' => 'ug/g', 'normal_range' => '>200'],
            // TB PCR
            'M. tuberculosis DNA' => ['units' => 'N/A', 'normal_range' => 'Negative'],
            'Rifampicin Resistance' => ['units' => 'N/A', 'normal_range' => 'Negative'],
            // Fungal Culture
            'Fungal Species' => ['units' => 'N/A', 'normal_range' => 'None detected'],
            'Growth Characteristics' => ['units' => 'N/A', 'normal_range' => 'See report'],
            // Immunohistochemistry
            'Marker Expression' => ['units' => 'N/A', 'normal_range' => 'See report'],
            'Staining Pattern' => ['units' => 'N/A', 'normal_range' => 'See report'],
            'Interpretation' => ['units' => 'N/A', 'normal_range' => 'See report'],
            // Lymphoma Panel
            'Morphology' => ['units' => 'N/A', 'normal_range' => 'See report'],
            'Flow Cytometry' => ['units' => 'N/A', 'normal_range' => 'See report'],
            'IHC Markers' => ['units' => 'N/A', 'normal_range' => 'See report'],
            'Molecular Studies' => ['units' => 'N/A', 'normal_range' => 'See report'],
        ];

        $tests = Test::all();
        foreach ($tests as $test) {
            // Always get the original parameters JSON column and decode it
            $paramList = $test->getOriginal('parameters');
            if (is_string($paramList)) {
                $paramList = json_decode($paramList, true);
            }
            if (is_array($paramList)) {
                foreach ($paramList as $index => $paramName) {
                    $meta = $parameterMeta[$paramName] ?? ['units' => null, 'normal_range' => null];
                    TestParameter::firstOrCreate([
                        'test_id' => $test->id,
                        'name' => $paramName,
                    ], [
                        'units' => $meta['units'],
                        'normal_range' => $meta['normal_range'],
                        'order' => $index + 1,
                    ]);
                }
            }
        }
    }
}

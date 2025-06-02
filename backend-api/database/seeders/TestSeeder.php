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
            // --- Existing Tests ---
            [
                'code' => 'CBC',
                'name' => 'Complete Blood Count',
                'sample_types' => ['Blood (Whole, EDTA)'],
                'category' => 'Hematology',
                'department' => 'Laboratory',
                'price' => 45.00,
                'duration' => '2-4 hours',
                'status' => 'Active',
                'parameters' => ['RBC', 'WBC', 'Platelets', 'Hemoglobin', 'Hematocrit', 'MCV', 'MCH', 'MCHC', 'RDW', 'Differential Count']
            ],
            [
                'code' => 'LIP',
                'name' => 'Lipid Profile',
                'sample_types' => ['Blood (Serum)'],
                'category' => 'Clinical Chemistry',
                'department' => 'Laboratory',
                'price' => 35.00,
                'duration' => '1-2 hours',
                'status' => 'Active',
                'parameters' => ['Total Cholesterol', 'HDL Cholesterol', 'LDL Cholesterol (Calculated)', 'Triglycerides', 'VLDL Cholesterol (Calculated)']
            ],
            [
                'code' => 'UA',
                'name' => 'Urinalysis',
                'sample_types' => ['Urine (Random, Midstream)'],
                'category' => 'Clinical Chemistry',
                'department' => 'Laboratory',
                'price' => 25.00,
                'duration' => '30 minutes - 1 hour',
                'status' => 'Active',
                'parameters' => ['Color', 'Appearance', 'Specific Gravity', 'pH', 'Protein', 'Glucose', 'Ketones', 'Bilirubin', 'Urobilinogen', 'Nitrite', 'Leukocyte Esterase', 'Blood/Hemoglobin', 'Microscopic Examination (RBC, WBC, Epithelial cells, Casts, Crystals, Bacteria)']
            ],

            // --- New Tests ---

            // Clinical Chemistry
            [
                'code' => 'LFT',
                'name' => 'Liver Function Test',
                'sample_types' => ['Blood (Serum)'],
                'category' => 'Clinical Chemistry',
                'department' => 'Laboratory',
                'price' => 60.00,
                'duration' => '2-4 hours',
                'status' => 'Active',
                'parameters' => ['Total Protein', 'Albumin', 'Globulin', 'A/G Ratio', 'Total Bilirubin', 'Direct Bilirubin', 'Indirect Bilirubin', 'ALT (SGPT)', 'AST (SGOT)', 'ALP (Alkaline Phosphatase)', 'GGT']
            ],
            [
                'code' => 'KFT',
                'name' => 'Kidney Function Test (Renal Panel)',
                'sample_types' => ['Blood (Serum)'],
                'category' => 'Clinical Chemistry',
                'department' => 'Laboratory',
                'price' => 55.00,
                'duration' => '2-3 hours',
                'status' => 'Active',
                'parameters' => ['Urea (BUN)', 'Creatinine', 'Uric Acid', 'Sodium', 'Potassium', 'Chloride', 'eGFR (Calculated)']
            ],
            [
                'code' => 'FBS',
                'name' => 'Fasting Blood Sugar',
                'sample_types' => ['Blood (Plasma, Fluoride Oxalate or Serum)'],
                'category' => 'Clinical Chemistry',
                'department' => 'Laboratory',
                'price' => 15.00,
                'duration' => '1-2 hours',
                'status' => 'Active',
                'parameters' => ['Glucose']
            ],
            [
                'code' => 'RBS',
                'name' => 'Random Blood Sugar',
                'sample_types' => ['Blood (Plasma, Fluoride Oxalate or Serum)'],
                'category' => 'Clinical Chemistry',
                'department' => 'Laboratory',
                'price' => 15.00,
                'duration' => '1-2 hours',
                'status' => 'Active',
                'parameters' => ['Glucose']
            ],
            [
                'code' => 'HBA1C',
                'name' => 'Glycated Hemoglobin (HbA1c)',
                'sample_types' => ['Blood (Whole, EDTA)'],
                'category' => 'Clinical Chemistry',
                'department' => 'Laboratory',
                'price' => 40.00,
                'duration' => '4-6 hours',
                'status' => 'Active',
                'parameters' => ['HbA1c %', 'Estimated Average Glucose (eAG)']
            ],
            [
                'code' => 'ELECTRO',
                'name' => 'Electrolyte Panel',
                'sample_types' => ['Blood (Serum)'],
                'category' => 'Clinical Chemistry',
                'department' => 'Laboratory',
                'price' => 30.00,
                'duration' => '1-2 hours',
                'status' => 'Active',
                'parameters' => ['Sodium (Na+)', 'Potassium (K+)', 'Chloride (Cl-)', 'Bicarbonate (HCO3- or Total CO2)']
            ],
            [
                'code' => 'BMP',
                'name' => 'Basic Metabolic Panel',
                'sample_types' => ['Blood (Serum)'],
                'category' => 'Clinical Chemistry',
                'department' => 'Laboratory',
                'price' => 70.00,
                'duration' => '2-4 hours',
                'status' => 'Active',
                'parameters' => ['Glucose', 'Calcium', 'Sodium', 'Potassium', 'Chloride', 'Bicarbonate (CO2)', 'BUN (Urea)', 'Creatinine']
            ],
            [
                'code' => 'CMP',
                'name' => 'Comprehensive Metabolic Panel',
                'sample_types' => ['Blood (Serum)'],
                'category' => 'Clinical Chemistry',
                'department' => 'Laboratory',
                'price' => 95.00,
                'duration' => '2-4 hours',
                'status' => 'Active',
                'parameters' => ['Glucose', 'Calcium', 'Sodium', 'Potassium', 'Chloride', 'Bicarbonate (CO2)', 'BUN (Urea)', 'Creatinine', 'Albumin', 'Total Protein', 'ALP', 'ALT', 'AST', 'Bilirubin (Total)']
            ],
             [
                'code' => 'CA',
                'name' => 'Calcium (Total)',
                'sample_types' => ['Blood (Serum)'],
                'category' => 'Clinical Chemistry',
                'department' => 'Laboratory',
                'price' => 20.00,
                'duration' => '1-2 hours',
                'status' => 'Active',
                'parameters' => ['Calcium']
            ],
            [
                'code' => 'AMY',
                'name' => 'Amylase',
                'sample_types' => ['Blood (Serum)', 'Urine'],
                'category' => 'Clinical Chemistry',
                'department' => 'Laboratory',
                'price' => 30.00,
                'duration' => '2-3 hours',
                'status' => 'Active',
                'parameters' => ['Amylase Level']
            ],
            [
                'code' => 'LIPASE',
                'name' => 'Lipase',
                'sample_types' => ['Blood (Serum)'],
                'category' => 'Clinical Chemistry',
                'department' => 'Laboratory',
                'price' => 35.00,
                'duration' => '2-3 hours',
                'status' => 'Active',
                'parameters' => ['Lipase Level']
            ],

            // Hematology
            [
                'code' => 'ESR',
                'name' => 'Erythrocyte Sedimentation Rate',
                'sample_types' => ['Blood (Whole, EDTA)'],
                'category' => 'Hematology',
                'department' => 'Laboratory',
                'price' => 20.00,
                'duration' => '1-2 hours',
                'status' => 'Active',
                'parameters' => ['ESR Value']
            ],
            [
                'code' => 'PTINR',
                'name' => 'Prothrombin Time & INR',
                'sample_types' => ['Blood (Plasma, Citrate)'],
                'category' => 'Coagulation', // Or Hematology
                'department' => 'Laboratory',
                'price' => 30.00,
                'duration' => '1-3 hours',
                'status' => 'Active',
                'parameters' => ['Prothrombin Time (PT)', 'INR (International Normalized Ratio)']
            ],
            [
                'code' => 'APTT',
                'name' => 'Activated Partial Thromboplastin Time',
                'sample_types' => ['Blood (Plasma, Citrate)'],
                'category' => 'Coagulation', // Or Hematology
                'department' => 'Laboratory',
                'price' => 30.00,
                'duration' => '1-3 hours',
                'status' => 'Active',
                'parameters' => ['APTT Value']
            ],
            [
                'code' => 'BG',
                'name' => 'Blood Grouping & Rh Typing',
                'sample_types' => ['Blood (Whole, EDTA)'],
                'category' => 'Immunohematology', // Or Hematology
                'department' => 'Laboratory',
                'price' => 25.00,
                'duration' => '1-2 hours',
                'status' => 'Active',
                'parameters' => ['ABO Group', 'Rh (D) Type']
            ],
            [
                'code' => 'RETIC',
                'name' => 'Reticulocyte Count',
                'sample_types' => ['Blood (Whole, EDTA)'],
                'category' => 'Hematology',
                'department' => 'Laboratory',
                'price' => 28.00,
                'duration' => '2-4 hours',
                'status' => 'Active',
                'parameters' => ['Reticulocyte Percentage', 'Absolute Reticulocyte Count']
            ],

            // Endocrinology
            [
                'code' => 'TSH',
                'name' => 'Thyroid Stimulating Hormone',
                'sample_types' => ['Blood (Serum)'],
                'category' => 'Endocrinology',
                'department' => 'Laboratory',
                'price' => 40.00,
                'duration' => '4-8 hours',
                'status' => 'Active',
                'parameters' => ['TSH Level']
            ],
            [
                'code' => 'FT4',
                'name' => 'Free Thyroxine (FT4)',
                'sample_types' => ['Blood (Serum)'],
                'category' => 'Endocrinology',
                'department' => 'Laboratory',
                'price' => 45.00,
                'duration' => '4-8 hours',
                'status' => 'Active',
                'parameters' => ['Free T4 Level']
            ],
            [
                'code' => 'FT3',
                'name' => 'Free Triiodothyronine (FT3)',
                'sample_types' => ['Blood (Serum)'],
                'category' => 'Endocrinology',
                'department' => 'Laboratory',
                'price' => 45.00,
                'duration' => '4-8 hours',
                'status' => 'Active',
                'parameters' => ['Free T3 Level']
            ],
             [
                'code' => 'TFT',
                'name' => 'Thyroid Function Panel',
                'sample_types' => ['Blood (Serum)'],
                'category' => 'Endocrinology',
                'department' => 'Laboratory',
                'price' => 110.00,
                'duration' => '6-10 hours',
                'status' => 'Active',
                'parameters' => ['TSH Level', 'Free T4 Level', 'Free T3 Level']
            ],
            [
                'code' => 'PRL',
                'name' => 'Prolactin',
                'sample_types' => ['Blood (Serum)'],
                'category' => 'Endocrinology',
                'department' => 'Laboratory',
                'price' => 50.00,
                'duration' => '1 day',
                'status' => 'Active',
                'parameters' => ['Prolactin Level']
            ],
            [
                'code' => 'VITD',
                'name' => 'Vitamin D (25-Hydroxy)',
                'sample_types' => ['Blood (Serum)'],
                'category' => 'Endocrinology', // Can also be Clinical Chemistry
                'department' => 'Laboratory',
                'price' => 75.00,
                'duration' => '1-2 days',
                'status' => 'Active',
                'parameters' => ['25-OH Vitamin D Level']
            ],

            // Serology / Immunology
            [
                'code' => 'HIV',
                'name' => 'HIV 1 & 2 Antibodies & p24 Antigen (4th Gen)',
                'sample_types' => ['Blood (Serum or Plasma)'],
                'category' => 'Immunology/Serology',
                'department' => 'Laboratory',
                'price' => 60.00,
                'duration' => '1-2 days',
                'status' => 'Active',
                'parameters' => ['HIV-1 Ab', 'HIV-2 Ab', 'HIV p24 Ag', 'Overall Result']
            ],
            [
                'code' => 'HBSAG',
                'name' => 'Hepatitis B Surface Antigen (HBsAg)',
                'sample_types' => ['Blood (Serum)'],
                'category' => 'Immunology/Serology',
                'department' => 'Laboratory',
                'price' => 40.00,
                'duration' => '4-8 hours',
                'status' => 'Active',
                'parameters' => ['HBsAg Result']
            ],
            [
                'code' => 'HCV',
                'name' => 'Hepatitis C Virus Antibody (Anti-HCV)',
                'sample_types' => ['Blood (Serum)'],
                'category' => 'Immunology/Serology',
                'department' => 'Laboratory',
                'price' => 45.00,
                'duration' => '4-8 hours',
                'status' => 'Active',
                'parameters' => ['Anti-HCV Result']
            ],
            [
                'code' => 'VDRL',
                'name' => 'VDRL (Syphilis Test)',
                'sample_types' => ['Blood (Serum)', 'CSF'],
                'category' => 'Immunology/Serology',
                'department' => 'Laboratory',
                'price' => 25.00,
                'duration' => '2-4 hours',
                'status' => 'Active',
                'parameters' => ['VDRL Reactivity', 'Titer (if reactive)']
            ],
            [
                'code' => 'CRP',
                'name' => 'C-Reactive Protein (Quantitative)',
                'sample_types' => ['Blood (Serum)'],
                'category' => 'Immunology/Serology', // or Clinical Chemistry
                'department' => 'Laboratory',
                'price' => 30.00,
                'duration' => '2-4 hours',
                'status' => 'Active',
                'parameters' => ['CRP Level']
            ],
            [
                'code' => 'RF',
                'name' => 'Rheumatoid Factor (Quantitative)',
                'sample_types' => ['Blood (Serum)'],
                'category' => 'Immunology/Serology',
                'department' => 'Laboratory',
                'price' => 35.00,
                'duration' => '4-6 hours',
                'status' => 'Active',
                'parameters' => ['RF Level']
            ],
             [
                'code' => 'ASOT',
                'name' => 'ASO Titre (Anti-Streptolysin O)',
                'sample_types' => ['Blood (Serum)'],
                'category' => 'Immunology/Serology',
                'department' => 'Laboratory',
                'price' => 30.00,
                'duration' => '4-6 hours',
                'status' => 'Active',
                'parameters' => ['ASO Titre Level']
            ],

            // Microbiology
            [
                'code' => 'UC',
                'name' => 'Urine Culture & Sensitivity',
                'sample_types' => ['Urine (Midstream Clean Catch)'],
                'category' => 'Microbiology',
                'department' => 'Microbiology Lab',
                'price' => 70.00,
                'duration' => '2-3 days',
                'status' => 'Active',
                'parameters' => ['Organism(s) Identified', 'Colony Count', 'Antibiotic Sensitivity Profile']
            ],
            [
                'code' => 'BC',
                'name' => 'Blood Culture & Sensitivity',
                'sample_types' => ['Blood (Whole, Special Culture Bottles)'],
                'category' => 'Microbiology',
                'department' => 'Microbiology Lab',
                'price' => 120.00,
                'duration' => '3-7 days',
                'status' => 'Active',
                'parameters' => ['Organism(s) Identified (if any)', 'Time to Positivity', 'Antibiotic Sensitivity Profile']
            ],
            [
                'code' => 'SC',
                'name' => 'Stool Culture & Sensitivity',
                'sample_types' => ['Stool (Fresh)'],
                'category' => 'Microbiology',
                'department' => 'Microbiology Lab',
                'price' => 80.00,
                'duration' => '3-5 days',
                'status' => 'Active',
                'parameters' => ['Pathogen(s) Identified (e.g., Salmonella, Shigella, Campylobacter)', 'Antibiotic Sensitivity Profile']
            ],
            [
                'code' => 'GRAM',
                'name' => 'Gram Stain',
                'sample_types' => ['Swab (Wound, Throat, etc.)', 'Sputum', 'CSF', 'Body Fluids'],
                'category' => 'Microbiology',
                'department' => 'Microbiology Lab',
                'price' => 20.00,
                'duration' => '1-2 hours',
                'status' => 'Active',
                'parameters' => ['Gram Reaction (Positive/Negative)', 'Morphology (Cocci/Bacilli)', 'Presence of WBCs', 'Presence of Epithelial Cells']
            ],
            [
                'code' => 'AFB',
                'name' => 'AFB Stain (Acid-Fast Bacilli)',
                'sample_types' => ['Sputum', 'Body Fluids', 'Tissue Biopsy'],
                'category' => 'Microbiology',
                'department' => 'Microbiology Lab',
                'price' => 35.00,
                'duration' => '2-4 hours (smear), 4-8 weeks (culture)',
                'status' => 'Active',
                'parameters' => ['Presence of AFB', 'Quantification (if positive)']
            ],

            // Miscellaneous / Other
            [
                'code' => 'SF',
                'name' => 'Semen Analysis (Fertility)',
                'sample_types' => ['Semen (Fresh, collected within 1 hour)'],
                'category' => 'Andrology', // Or Specialized Lab
                'department' => 'Specialized Lab',
                'price' => 100.00,
                'duration' => '2-4 hours',
                'status' => 'Active',
                'parameters' => ['Volume', 'pH', 'Sperm Concentration', 'Motility', 'Morphology', 'Vitality', 'WBC Count']
            ],
            [
                'code' => 'DDIMER',
                'name' => 'D-Dimer',
                'sample_types' => ['Blood (Plasma, Citrate)'],
                'category' => 'Coagulation',
                'department' => 'Laboratory',
                'price' => 65.00,
                'duration' => '2-4 hours',
                'status' => 'Active',
                'parameters' => ['D-Dimer Level']
            ],
            [
                'code' => 'FERRITIN',
                'name' => 'Ferritin',
                'sample_types' => ['Blood (Serum)'],
                'category' => 'Hematology', // or Clinical Chemistry
                'department' => 'Laboratory',
                'price' => 45.00,
                'duration' => '1 day',
                'status' => 'Active',
                'parameters' => ['Ferritin Level']
            ],
            [
                'code' => 'IRONPROFILE',
                'name' => 'Iron Profile',
                'sample_types' => ['Blood (Serum)'],
                'category' => 'Hematology', // or Clinical Chemistry
                'department' => 'Laboratory',
                'price' => 70.00,
                'duration' => '1 day',
                'status' => 'Active',
                'parameters' => ['Serum Iron', 'TIBC (Total Iron Binding Capacity)', 'Transferrin Saturation %', 'Ferritin (often included)']
            ],
            [
                'code' => 'PSA',
                'name' => 'Prostate-Specific Antigen (Total)',
                'sample_types' => ['Blood (Serum)'],
                'category' => 'Tumor Markers',
                'department' => 'Laboratory',
                'price' => 55.00,
                'duration' => '6-12 hours',
                'status' => 'Active',
                'parameters' => ['Total PSA Level']
            ],

            // Additional Blood Tests
            [
                'code' => 'BHCG',
                'name' => 'Beta HCG (Pregnancy Test)',
                'sample_types' => ['Blood (Serum)', 'Urine'],
                'category' => 'Endocrinology',
                'department' => 'Laboratory',
                'price' => 40.00,
                'duration' => '2-4 hours',
                'status' => 'Active',
                'parameters' => ['Beta HCG Level']
            ],
            [
                'code' => 'CORTISOL',
                'name' => 'Cortisol',
                'sample_types' => ['Blood (Serum)', 'Urine (24-hour)'],
                'category' => 'Endocrinology',
                'department' => 'Laboratory',
                'price' => 65.00,
                'duration' => '1 day',
                'status' => 'Active',
                'parameters' => ['Cortisol Level']
            ],
            [
                'code' => 'TROP',
                'name' => 'Cardiac Troponin',
                'sample_types' => ['Blood (Serum, Plasma)'],
                'category' => 'Cardiac Markers',
                'department' => 'Laboratory',
                'price' => 70.00,
                'duration' => '1-2 hours',
                'status' => 'Active',
                'parameters' => ['Troponin I/T Level']
            ],

            // Additional Urine Tests
            [
                'code' => '24HR_PROT',
                'name' => '24-Hour Urine Protein',
                'sample_types' => ['Urine (24-hour collection)'],
                'category' => 'Clinical Chemistry',
                'department' => 'Laboratory',
                'price' => 45.00,
                'duration' => '1 day',
                'status' => 'Active',
                'parameters' => ['Total Protein', 'Collection Volume', 'Collection Duration']
            ],
            [
                'code' => 'MICROALB',
                'name' => 'Microalbumin',
                'sample_types' => ['Urine (Random or 24-hour)'],
                'category' => 'Clinical Chemistry',
                'department' => 'Laboratory',
                'price' => 35.00,
                'duration' => '2-4 hours',
                'status' => 'Active',
                'parameters' => ['Microalbumin Level', 'Creatinine', 'Albumin/Creatinine Ratio']
            ],

            // Additional Stool Tests
            [
                'code' => 'OCCULTB',
                'name' => 'Occult Blood',
                'sample_types' => ['Stool'],
                'category' => 'Clinical Pathology',
                'department' => 'Laboratory',
                'price' => 25.00,
                'duration' => '1-2 hours',
                'status' => 'Active',
                'parameters' => ['Occult Blood Result']
            ],
            [
                'code' => 'PARASIT',
                'name' => 'Stool Parasitology',
                'sample_types' => ['Stool (Fresh)'],
                'category' => 'Microbiology',
                'department' => 'Laboratory',
                'price' => 50.00,
                'duration' => '1-2 days',
                'status' => 'Active',
                'parameters' => ['Microscopy', 'Ova', 'Parasites', 'Cysts']
            ],

            // Additional Sputum Tests
            [
                'code' => 'SPUTCULT',
                'name' => 'Sputum Culture and Sensitivity',
                'sample_types' => ['Sputum'],
                'category' => 'Microbiology',
                'department' => 'Laboratory',
                'price' => 85.00,
                'duration' => '3-5 days',
                'status' => 'Active',
                'parameters' => ['Organism Identification', 'Colony Count', 'Antibiotic Sensitivity']
            ],
            [
                'code' => 'CYTOLOGY',
                'name' => 'Sputum Cytology',
                'sample_types' => ['Sputum'],
                'category' => 'Cytology',
                'department' => 'Pathology',
                'price' => 90.00,
                'duration' => '3-5 days',
                'status' => 'Active',
                'parameters' => ['Cell Types', 'Abnormal Cells', 'Malignant Cells']
            ],

            // Additional Tissue Tests
            [
                'code' => 'BIOPSY',
                'name' => 'Tissue Biopsy Histopathology',
                'sample_types' => ['Tissue'],
                'category' => 'Histopathology',
                'department' => 'Pathology',
                'price' => 150.00,
                'duration' => '3-7 days',
                'status' => 'Active',
                'parameters' => ['Tissue Type', 'Microscopic Findings', 'Diagnosis']
            ],
            [
                'code' => 'FNAC',
                'name' => 'Fine Needle Aspiration Cytology',
                'sample_types' => ['Tissue (FNA Sample)'],
                'category' => 'Cytology',
                'department' => 'Pathology',
                'price' => 120.00,
                'duration' => '2-4 days',
                'status' => 'Active',
                'parameters' => ['Adequacy', 'Cell Types', 'Diagnosis']
            ],

            // Additional Specialized Blood Tests
            [
                'code' => 'HEMO_ELEC',
                'name' => 'Hemoglobin Electrophoresis',
                'sample_types' => ['Blood (Whole, EDTA)'],
                'category' => 'Hematology',
                'department' => 'Laboratory',
                'price' => 85.00,
                'duration' => '2-3 days',
                'status' => 'Active',
                'parameters' => ['HbA', 'HbA2', 'HbF', 'HbS', 'Other Variants']
            ],
            [
                'code' => 'MALARIA',
                'name' => 'Malaria Panel',
                'sample_types' => ['Blood (Whole, EDTA)'],
                'category' => 'Hematology',
                'department' => 'Laboratory',
                'price' => 40.00,
                'duration' => '2-4 hours',
                'status' => 'Active',
                'parameters' => ['Microscopy', 'Species Identification', 'Parasite Count', 'Rapid Test']
            ],
            [
                'code' => 'LUPUS',
                'name' => 'Lupus Panel',
                'sample_types' => ['Blood (Serum)'],
                'category' => 'Immunology/Serology',
                'department' => 'Laboratory',
                'price' => 150.00,
                'duration' => '3-5 days',
                'status' => 'Active',
                'parameters' => ['ANA', 'Anti-dsDNA', 'Anti-Sm', 'Anti-RNP', 'C3', 'C4']
            ],

            // Additional Specialized Urine Tests
            [
                'code' => 'DRUG_SCREEN',
                'name' => 'Drug Screening Panel',
                'sample_types' => ['Urine (Random)'],
                'category' => 'Toxicology',
                'department' => 'Laboratory',
                'price' => 120.00,
                'duration' => '1-2 days',
                'status' => 'Active',
                'parameters' => ['Opiates', 'Cocaine', 'Amphetamines', 'Cannabinoids', 'Benzodiazepines', 'Barbiturates']
            ],
            [
                'code' => 'STONE_ANAL',
                'name' => 'Kidney Stone Analysis',
                'sample_types' => ['Urine', 'Kidney Stone'],
                'category' => 'Clinical Chemistry',
                'department' => 'Laboratory',
                'price' => 90.00,
                'duration' => '2-3 days',
                'status' => 'Active',
                'parameters' => ['Stone Composition', 'Crystal Type', 'Chemical Analysis']
            ],

            // Additional Specialized Stool Tests
            [
                'code' => 'HELICO',
                'name' => 'H. pylori Stool Antigen',
                'sample_types' => ['Stool (Fresh)'],
                'category' => 'Microbiology',
                'department' => 'Laboratory',
                'price' => 65.00,
                'duration' => '1-2 days',
                'status' => 'Active',
                'parameters' => ['H. pylori Antigen']
            ],
            [
                'code' => 'ELASTASE',
                'name' => 'Fecal Elastase-1',
                'sample_types' => ['Stool (Fresh)'],
                'category' => 'Clinical Chemistry',
                'department' => 'Laboratory',
                'price' => 95.00,
                'duration' => '2-3 days',
                'status' => 'Active',
                'parameters' => ['Elastase-1 Level']
            ],

            // Additional Specialized Sputum Tests
            [
                'code' => 'TB_PCR',
                'name' => 'TB PCR Test',
                'sample_types' => ['Sputum'],
                'category' => 'Molecular Diagnostics',
                'department' => 'Laboratory',
                'price' => 180.00,
                'duration' => '1-2 days',
                'status' => 'Active',
                'parameters' => ['M. tuberculosis DNA', 'Rifampicin Resistance']
            ],
            [
                'code' => 'FUNGAL_CULT',
                'name' => 'Fungal Culture',
                'sample_types' => ['Sputum', 'Tissue', 'Body Fluids'],
                'category' => 'Microbiology',
                'department' => 'Laboratory',
                'price' => 75.00,
                'duration' => '7-14 days',
                'status' => 'Active',
                'parameters' => ['Fungal Species', 'Growth Characteristics', 'Microscopy']
            ],

            // Additional Specialized Tissue Tests
            [
                'code' => 'IHC',
                'name' => 'Immunohistochemistry',
                'sample_types' => ['Tissue'],
                'category' => 'Histopathology',
                'department' => 'Pathology',
                'price' => 200.00,
                'duration' => '3-5 days',
                'status' => 'Active',
                'parameters' => ['Marker Expression', 'Staining Pattern', 'Interpretation']
            ],
            [
                'code' => 'LYMPH_PANEL',
                'name' => 'Lymphoma Panel',
                'sample_types' => ['Tissue (Lymph Node)', 'Blood (Whole, EDTA)'],
                'category' => 'Pathology',
                'department' => 'Pathology',
                'price' => 280.00,
                'duration' => '5-7 days',
                'status' => 'Active',
                'parameters' => ['Morphology', 'Flow Cytometry', 'IHC Markers', 'Molecular Studies']
            ]
        ];

        foreach ($tests as $testData) {
            // Extract parameters before creating the test
            $parameters = $testData['parameters'] ?? [];
            unset($testData['parameters']);

            // Create the test
            $test = Test::create($testData);

            // Parameter units and ranges mapping
            $parameterDetails = [
                // CBC parameters
                'RBC' => ['units' => '×10^6/µL', 'normal_range' => '4.5-5.9'],
                'WBC' => ['units' => '×10^3/µL', 'normal_range' => '4.5-11.0'],
                'Platelets' => ['units' => '×10^3/µL', 'normal_range' => '150-450'],
                'Hemoglobin' => ['units' => 'g/dL', 'normal_range' => '13.5-17.5 (M), 12.0-15.5 (F)'],
                'Hematocrit' => ['units' => '%', 'normal_range' => '41-50 (M), 36-48 (F)'],
                'MCV' => ['units' => 'fL', 'normal_range' => '80-100'],
                'MCH' => ['units' => 'pg', 'normal_range' => '27-31'],
                'MCHC' => ['units' => 'g/dL', 'normal_range' => '32-36'],
                'RDW' => ['units' => '%', 'normal_range' => '11.5-14.5'],

                // Lipid Profile parameters
                'Total Cholesterol' => ['units' => 'mg/dL', 'normal_range' => '<200'],
                'HDL Cholesterol' => ['units' => 'mg/dL', 'normal_range' => '>40'],
                'LDL Cholesterol (Calculated)' => ['units' => 'mg/dL', 'normal_range' => '<130'],
                'Triglycerides' => ['units' => 'mg/dL', 'normal_range' => '<150'],
                'VLDL Cholesterol (Calculated)' => ['units' => 'mg/dL', 'normal_range' => '<30'],

                // Urinalysis parameters
                'pH' => ['units' => '', 'normal_range' => '4.5-8'],
                'Specific Gravity' => ['units' => '', 'normal_range' => '1.005-1.030'],
                'Protein' => ['units' => '', 'normal_range' => 'Negative'],
                'Glucose' => ['units' => '', 'normal_range' => 'Negative'],
                'Ketones' => ['units' => '', 'normal_range' => 'Negative'],
                'Blood' => ['units' => '', 'normal_range' => 'Negative'],
                'Leukocytes' => ['units' => '', 'normal_range' => 'Negative'],

                // Liver Function Test parameters
                'Total Protein' => ['units' => 'g/dL', 'normal_range' => '6.0-8.3'],
                'Albumin' => ['units' => 'g/dL', 'normal_range' => '3.5-5.0'],
                'Globulin' => ['units' => 'g/dL', 'normal_range' => '2.3-3.5'],
                'A/G Ratio' => ['units' => '', 'normal_range' => '1.2-2.2'],
                'Total Bilirubin' => ['units' => 'mg/dL', 'normal_range' => '0.3-1.2'],
                'Direct Bilirubin' => ['units' => 'mg/dL', 'normal_range' => '0.0-0.3'],
                'ALT (SGPT)' => ['units' => 'U/L', 'normal_range' => '7-56'],
                'AST (SGOT)' => ['units' => 'U/L', 'normal_range' => '10-40'],
                'ALP (Alkaline Phosphatase)' => ['units' => 'U/L', 'normal_range' => '44-147'],
                
                // Kidney Function Test parameters
                'Urea (BUN)' => ['units' => 'mg/dL', 'normal_range' => '7-20'],
                'Creatinine' => ['units' => 'mg/dL', 'normal_range' => '0.7-1.3'],
                'Uric Acid' => ['units' => 'mg/dL', 'normal_range' => '3.5-7.2'],
                'Sodium' => ['units' => 'mEq/L', 'normal_range' => '135-145'],
                'Potassium' => ['units' => 'mEq/L', 'normal_range' => '3.5-5.0'],
                'Chloride' => ['units' => 'mEq/L', 'normal_range' => '98-106'],
                'eGFR (Calculated)' => ['units' => 'mL/min/1.73m²', 'normal_range' => '>60'],

                // Blood Sugar parameters
                'Glucose' => ['units' => 'mg/dL', 'normal_range' => '70-100 (Fasting)'],
                'HbA1c %' => ['units' => '%', 'normal_range' => '<5.7'],

                // Thyroid Function parameters
                'TSH Level' => ['units' => 'µIU/mL', 'normal_range' => '0.4-4.0'],
                'Free T4 Level' => ['units' => 'ng/dL', 'normal_range' => '0.7-1.9'],
                'Free T3 Level' => ['units' => 'pg/mL', 'normal_range' => '2.3-4.2'],

                // Default for any parameter not specifically mapped
                'default' => ['units' => '', 'normal_range' => 'Refer to lab standards']
            ];

            // Create test parameters with units and normal ranges
            foreach ($parameters as $index => $paramName) {
                $details = $parameterDetails[$paramName] ?? $parameterDetails['default'];
                $test->parameters()->create([
                    'name' => $paramName,
                    'order' => $index + 1,
                    'units' => $details['units'],
                    'normal_range' => $details['normal_range']
                ]);
            }
        }
    }
}

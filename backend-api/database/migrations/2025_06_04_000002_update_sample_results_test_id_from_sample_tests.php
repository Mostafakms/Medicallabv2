<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

class UpdateSampleResultsTestIdFromSampleTests extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Update sample_results.test_id using sample_tests
        DB::statement('
            UPDATE sample_results sr
            JOIN sample_tests st ON sr.sample_id = st.sample_id
            SET sr.test_id = st.test_id
            WHERE sr.test_id IS NULL
        ');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Optionally set test_id back to null
        DB::statement("UPDATE sample_results SET test_id = NULL");
    }
}

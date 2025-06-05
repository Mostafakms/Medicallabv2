<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AlterSamplesStatusEnumToProcessingCompleted extends Migration
{
    public function up(): void
    {
        // Change the enum values for 'status' to only 'Processing' and 'Completed'
        Schema::table('samples', function (Blueprint $table) {
            $table->enum('status', ['Processing', 'Completed'])->default('Processing')->change();
        });
    }

    public function down(): void
    {
        // Revert to original enum values
        Schema::table('samples', function (Blueprint $table) {
            $table->enum('status', ['Pending', 'Processing', 'Completed'])->default('Pending')->change();
        });
    }
}

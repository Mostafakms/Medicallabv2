<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('samples', function (Blueprint $table) {
            $table->id();
            $table->string('accession_number')->unique();
            $table->foreignId('patient_id')->constrained()->onDelete('cascade');
            $table->enum('sample_type', ['Blood', 'Urine', 'Stool', 'Sputum', 'Tissue']);
            $table->date('collection_date');
            $table->time('collection_time');
            $table->enum('priority', ['Normal', 'Urgent', 'Stat']);
            $table->enum('status', ['Pending', 'Processing', 'Completed']);
            $table->string('location')->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('samples');
    }
};

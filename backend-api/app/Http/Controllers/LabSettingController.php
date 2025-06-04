<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\LabSetting;

class LabSettingController extends Controller
{
    // Get lab info (always id=1)
    public function show()
    {
        $lab = LabSetting::first();
        if (!$lab) {
            // Return default object if not set
            return response()->json([
                'name' => '',
                'address' => '',
                'phone' => '',
                'email' => '',
                'logo' => ''
            ]);
        }
        return response()->json($lab);
    }

    // Update lab info (or create if not exists)
    public function update(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string',
            'address' => 'required|string',
            'phone' => 'required|string',
            'email' => 'required|email',
            'logo' => 'nullable|string', // base64 or URL
        ]);
        $lab = LabSetting::first();
        if (!$lab) {
            $lab = LabSetting::create($data);
        } else {
            $lab->update($data);
        }
        return response()->json($lab);
    }
}

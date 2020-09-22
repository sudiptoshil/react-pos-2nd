<?php

namespace App\Http\Controllers\Vendor;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Model\Vendor\Vendor;

class VendorController extends Controller
{

    public function index()
    {
        $vendors = Vendor::all();
        return response()->json([
            'status' => 200,
            'vendors' => $vendors
        ]);
    }

    public function create_vendor(Request $request)
    {
        $vendor = new Vendor();
        $vendor->name = $request->name;
        $vendor->email  = $request->email;
        $vendor->address  = $request->address;
        $vendor->phone  = $request->phone;
        $vendor->remarks  = $request->remarks;
        $vendor->accounts_no = $request->accounts_id;
        $vendor->save();
        return response()->json([
            'status' => 200,
            'message' => "Vendor Created Successfully!!"
        ]);
    }



    public function edit_vendor($id)
    {
        $vendor = Vendor::find($id);
        return response()->json([
            'status' => 200,
            'vendor' => $vendor
        ]);
    }


    public function update_vendor(Request $request, $id)
    {
        $vendor = Vendor::find($id);
        $vendor->name = $request->name;
        $vendor->email  = $request->email;
        $vendor->address  = $request->address;
        $vendor->phone  = $request->phone;
        $vendor->remarks  = $request->remarks;
        $vendor->accounts_no = $request->accounts_id;
        $vendor->save();
        return response()->json([
            'status' => 200,
            'message' => "Vendor Updated Successfully!!"
        ]);
    }
}

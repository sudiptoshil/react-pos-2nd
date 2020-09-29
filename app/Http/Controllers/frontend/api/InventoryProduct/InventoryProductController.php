<?php

namespace App\Http\Controllers\frontend\api\InventoryProduct;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Model\WareHouse\WareHouseDetails;
use App\Model\InventoryProduct\InventoryProduct;
use Illuminate\Support\Facades\DB;
use Image;

class InventoryProductController extends Controller
{


    public function index()
    {
        $products = DB::table('inventory_products')
        ->join('inventory_categories','inventory_products.category_id','inventory_categories.id')
        ->join('ware_house_details','inventory_products.warehouse_id','ware_house_details.id')
        ->select('inventory_products.*','inventory_categories.category_name','ware_house_details.name')
        ->get();

        return response()->json([
            'products'=>$products
        ]);
    }


    public function getall_warehouse()
    {
        $warehouses  = WareHouseDetails::all();
        return response()->json([
            'warehouses'=>$warehouses
        ]);
    }


    public function save_product(Request $request)
    {
        // return $request->all();
        // exit();



        // $image =$request->file('product_image');
        // $imageName =$image->getClientOriginalName();
        // $directory ='product_image/';
        // $image->move($directory,$imageName);
        // $strpos = strpos($request->product_image, ';');
        // $sub    = substr($request->product_image, 0,$strpos);
        // // $Ex     = explode('/', $sub)[1];
        // $name   = time().".".$Ex;
        // $img = Image::make($request->product_image)->resize(300, 200);
        // $upload_path = public_path()."/product_image/";
        // $img->save($upload_path.$name);

        // $image     =$request->file('product_image');
        // $imageName =$image->getClientOriginalName();
        // $directory ='product_image/';
        // $img = Image::make($image)->save($directory.$imageName)->resize(50, 50);

        $product = new InventoryProduct();
        $product->category_id =$request->category_id;
        $product->product_code =$request->product_code;
        $product->product_name =$request->product_name;
        $product->pices_of_carton =$request->pices_of_carton;
        $product->warehouse_id =$request->warehouse_id;
        $product->sorting =$request->sorting;
        $product->unit =$request->unit;
        $product->opening_stock =$request->opening_stock;
        $product->buy_price =$request->buy_price;
        $product->cost =$request->cost;
        $product->selling_price =$request->selling_price;
        $product->price_type =$request->price_type;
        // $product->product_image = $directory.$imageName;
        $product->save();

        return response()->json([
            'status'=>200,
            'message'=>"Product Saved Successfully!!"
        ]);
    }


    public function edit_product($id)
    {
        $product = InventoryProduct::find($id);

        return response()->json([
            'status'=>200,
            'product'=>$product
        ]);
    }

    public function update_product(Request $request,$id)
    {
        $product = InventoryProduct::find($id);
        $product->category_id =$request->category_id;
        $product->product_code =$request->product_code;
        $product->product_name =$request->product_name;
        $product->pices_of_carton =$request->pices_of_carton;
        $product->warehouse_id =$request->warehouse_id;
        $product->sorting =$request->sorting;
        $product->unit =$request->unit;
        $product->opening_stock =$request->opening_stock;
        $product->buy_price =$request->buy_price;
        $product->cost =$request->cost;
        $product->selling_price =$request->selling_price;
        $product->price_type =$request->price_type;
        // $product->product_image = $directory.$imageName;
        $product->save();

        return response()->json([
            'status'=>200,
            'message'=>"Product Saved Successfully!!"
        ]);
    }
}
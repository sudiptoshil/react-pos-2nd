<?php

namespace App\Http\Controllers\frontend\api\InventoryProduct;

use App\Http\Controllers\Controller;
use App\Model\InventoryProduct\InventoryProduct;
use App\Model\InvoiceTrasection\InvoiceTrasection;
use App\Model\WareHouse\WareHouseDetails;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Intervention\Image\Facades\Image;

class InventoryProductController extends Controller
{
    public function index()
    {
        $products = DB::table('inventory_products')
            ->join('inventory_categories', 'inventory_products.category_id', 'inventory_categories.id')
            ->leftjoin('ware_house_details', 'inventory_products.warehouse_id', 'ware_house_details.id')
            ->leftjoin('units', 'inventory_products.unit_id', 'units.id')
            ->select('inventory_products.*', 'inventory_categories.category_name', 'ware_house_details.name', 'units.unit_name')
            ->orderBy('inventory_products.id', 'DESC')
            ->get();

        return response()->json([
            'products' => $products,
        ]);
    }

    public function getall_warehouse()
    {
        $warehouses = WareHouseDetails::all();
        return response()->json([
            'warehouses' => $warehouses,
        ]);
    }

    public function save_product(Request $request)
    {
        $categoryCode = DB::table('inventory_categories')
            ->where('id', $request->cate_id)
            ->first();
        $categorycode = $categoryCode->category_code;
        $categoryId = $categoryCode->id;

        $productCode = DB::table('inventory_products')
            ->where('category_id', $categoryId)
            ->orderBy('id', 'DESC')
            ->first();

        if (!empty($productCode->category_autocode)) {
            $cate_code = $productCode->category_autocode + 1;
        } else {
            $cate_code = $categorycode;
        }
        $strpos = strpos($request->product_image, ';');
        $sub = substr($request->product_image, 0, $strpos);
        $Ex = explode('/', $sub)[1];
        $name = time() . "." . $Ex;
        $img = Image::make($request->product_image)->resize(300, 200);
        $upload_path = public_path() . "/productImage/";
        $img->save($upload_path . $name);

        $product = new InventoryProduct();
        $product->category_id = $request->category_id;
        $product->product_code = $request->product_code;
        $product->product_name = $request->product_name;
        $product->pices_of_carton = $request->pices_of_carton;
        $product->warehouse_id = $request->warehouse_id;
        $product->category_autocode = $cate_code;
        $product->sorting = $request->sorting;
        $product->reorder_level = $request->reorder_level;
        $product->unit_id = $request->unit_id;
        $product->opening_stock = $request->opening_stock;
        $product->buy_price = $request->buy_price;
        $product->cost = $request->cost;
        $product->selling_price = $request->selling_price;
        $product->price_type = $request->price_type;
        $product->product_image = $name;
        $product->save();

        return response()->json([
            'status' => 200,
            'message' => "Product Saved Successfully!!",
        ]);
    }

    public function edit_product($id)
    {
        // $product = InventoryProduct::find($id);
        $product = DB::table('inventory_products')
            ->join('inventory_categories', 'inventory_products.category_id', 'inventory_categories.id')
            ->select("inventory_products.*", "inventory_categories.category_name as category_name")
            ->where('inventory_products.id', $id)
            ->first();
        return response()->json([
            'status' => 200,
            'product' => $product,
        ]);
    }

    public function update_product(Request $request, $id)
    {
        $product = InventoryProduct::find($id);
        if ($request->product_image != $product->product_image) {
            $strpos = strpos($request->product_image, ';');
            $sub = substr($request->product_image, 0, $strpos);
            $Ex = explode('/', $sub)[1];
            $name = time() . "." . $Ex;
            $img = Image::make($request->product_image)->resize(300, 200);
            $upload_path = public_path() . "/productImage/";
            $image = $upload_path . $product->product_image;
            $img->save($upload_path . $name);
            if (file_exists($image)) {
                unlink($image);
            }
        } else {
            $name = $product->product_image;
        }
        $product->category_id = $request->category_id;
        $product->product_code = $request->product_code;
        $product->product_name = $request->product_name;
        $product->pices_of_carton = $request->pices_of_carton;
        $product->warehouse_id = $request->warehouse_id;
        $product->sorting = $request->sorting;
        $product->unit_id = $request->unit_id;
        $product->opening_stock = $request->opening_stock;
        $product->buy_price = $request->buy_price;
        $product->cost = $request->cost;
        $product->selling_price = $request->selling_price;
        $product->price_type = $request->price_type;
        $product->product_image = $name;
        $product->save();

        return response()->json([
            'status' => 200,
            'message' => "Product Updated Successfully!!",
        ]);
    }

    public function product_report(Request $request)
    {
        $product_id = (int) $request->product_id;
        $vendor_id = (int) $request->vendor_id;
        $customer_id = (int) $request->customer_id;
        $type = (int) $request->type;
        $start = date($request->start_date);
        $end = date($request->end_date);

        $productReport = InvoiceTrasection::query()
            ->join('inventory_products', 'invoice_trasections.item_id', '=', 'inventory_products.id')
            ->join('store_invoices', 'inventory_products.id', '=', 'store_invoices.ref_product_id')
            ->join('vendors', 'invoice_trasections.party_id', '=', 'vendors.id')
            ->select('invoice_trasections.*', 'store_invoices.invoice_number', 'inventory_products.product_name', 'vendors.name as party_name')
            ->where(function ($filter) use ($product_id, $customer_id, $vendor_id, $start, $end, $type) {
                if (!empty($product_id)) {
                    $filter->where('invoice_trasections.item_id', '=', $product_id);
                }
                if (!empty($customer_id)) {
                    $filter->where('invoice_trasections.party_id', '=', $customer_id);
                }
                if (!empty($vendor_id)) {
                    $filter->where('invoice_trasections.party_id', '=', $vendor_id);
                }
                if (!empty($type)) {
                    $filter->where('invoice_trasections.type', '=', $type);
                }
                if (!empty($start) && !empty($end)) {
                    $filter->whereBetween('invoice_trasections.created_at', [$start, $end]);
                }
            })->orderBy('id', 'desc')->get();
        return response()->json([
            'status' => 200,
            'productReport' => $productReport,
            // 'count' => $count
        ]);
    }

}

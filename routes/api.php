<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
 */

Route::middleware('auth:api')->get('/user', function (Request $request) {
    return $request->user();
});

Route::namespace ('frontend')->group(function () {
    Route::namespace ('api')->group(function () {
        Route::post('/auth/UserLogin', 'AuthController@UserLogin')->name("auth/UserLogin");
    });
});

Route::namespace ('frontend')->group(function () {
    Route::namespace ('api')->group(function () {
        Route::namespace ('WareHouse')->group(function () {
            Route::post('/save-warehouse', 'WareHouseController@add_warehouse')->name('save-warehouse');
            Route::get('/all-warehouse', 'WareHouseController@index')->name('all-warehouse');
            Route::get('/edit-warehouse/{id}', 'WareHouseController@edit_warehouse')->name('edit-warehouse');
            Route::patch('/update-warehouse/{id}', 'WareHouseController@update_warehouse')->name('edit-warehouse');
        });
    });
});

Route::namespace ('frontend')->group(function () {
    Route::namespace ('api')->group(function () {
        Route::namespace ('Vendor')->group(function () {
            Route::post('/save-vendor', 'VendorController@create_vendor')->name('save-vendor');
            Route::get('/all-vendor', 'VendorController@index')->name('all-vendor');
            Route::post('/save-vendor', 'VendorController@create_vendor')->name('save-vendor');
            Route::get('/edit-vendor/{id}', 'VendorController@edit_vendor')->name('edit-vendor');
            Route::patch('/update-vendor/{id}', 'VendorController@update_vendor')->name('update-vendor');
        });
    });
});

Route::namespace ('Accounts')->group(function () {

    Route::get('/all-ledger', 'LedgerController@index')->name('all-ledger');
    Route::get('/all-setting', 'LedgerController@all_setting')->name('all-setting');
    Route::get('/filter-accounts', 'LedgerController@filter_accounts')->name('filter-accounts');
});

//for customer mnagement....

Route::namespace ('frontend')->group(function () {
    Route::namespace ('api')->group(function () {
        Route::namespace ('Customer')->group(function () {
            Route::post('/create-customer', 'CustomerController@create_customer')->name("create-customer");
            Route::get('/all-customer', 'CustomerController@index')->name("all-customer");
            Route::get('/edit-customer/{id}', 'CustomerController@edit_customer')->name("edit-customer");
            Route::patch('/update-customer/{id}', 'CustomerController@update_customer')->name("update-customer");
        });
    });
});

Route::namespace ('frontend')->group(function () {
    Route::namespace ('api')->group(function () {
        Route::namespace ('InventoryCategory')->group(function () {
            Route::get('/all-inventcategory', 'InventoryCategoryController@getAccountsInfoAsTree')->name("all-inventcategory");
            Route::post('/save-inventcategory', 'InventoryCategoryController@save_category')->name("save-inventcategory");
            Route::patch('/update-inventcategory/{id}', 'InventoryCategoryController@update_category')->name("update-inventcategory");
        });
    });
});

Route::namespace ('frontend')->group(function () {
    Route::namespace ('api')->group(function () {
        Route::namespace ('InventoryProduct')->group(function () {
            // Route::get('/all-warehouse', 'InventoryProductController@getall_warehouse')->name("all-warehouse");
            Route::post('/save-inventproduct', 'InventoryProductController@save_product')->name("save-inventproduct");
            Route::get('/all-inventproduct', 'InventoryProductController@index')->name("all-inventproduct");
            Route::get('/edit-inventproduct/{id}', 'InventoryProductController@edit_product')->name("edit-inventproduct");
            Route::patch('/update-inventproduct/{id}', 'InventoryProductController@update_product')->name("update-inventproduct");
            Route::post('/product-report', 'InventoryProductController@product_report')->name("product-report");

        });
    });
});

Route::namespace ('frontend')->group(function () {
    Route::namespace ('api')->group(function () {
        Route::namespace ('Store')->group(function () {
            Route::get('/all-store', 'StoreController@index')->name("all-store");
            Route::post('/save-store', 'StoreController@save_store')->name("save-store");
            Route::get('/edit-store/{id}', 'StoreController@edit_store')->name("edit-store");
            Route::patch('/update-store/{id}', 'StoreController@update_store')->name("update-store");
        });
    });
});

Route::namespace ('frontend')->group(function () {
    Route::namespace ('api')->group(function () {
        Route::namespace ('StoreInvoice')->group(function () {
            Route::post('/save-storeinvoice', 'StoreInvoiceController@save_invoice_transection')->name("save-storeinvoice");
            Route::get('/all-invoice-transec', 'StoreInvoiceController@getallinvoicetransection')->name("all-invoice-transec");
            Route::get('/edit-invoice-transec/{id}', 'StoreInvoiceController@editinvoicetransection')->name("edit-invoice-transec");
            Route::get('/all-data', 'StoreInvoiceController@fetch_all_data')->name("all-data");
            Route::get('/delete-invoice-transec/{id}', 'StoreInvoiceController@delete_invoice_transec')->name("delete-invoice-transec");
            Route::patch('/update-transecinvoice/{id}', 'StoreInvoiceController@update_invoice_transection')->name("update-transecinvoice");
            Route::get('/get-warehouse/{id}', 'StoreInvoiceController@getwarehouse');
            Route::get('/get-product-wise-price/{id}', 'StoreInvoiceController@product_wise_price');
            Route::get('/get-productCode', 'InvoiceParamsController@get_productCode');

            // for store invoice .....................
            Route::post('/save-store-invoice', 'StoreInvoiceController@save_store_invoice')->name("save-store-invoice");
            Route::post('/return-save-store-invoice', 'StoreInvoiceController@returnsave_store_invoice')->name("return-save-store-invoice");
            Route::get('/all-storeInvoice', 'StoreInvoiceController@all_store_invoice')->name("all-storeInvoice");
            Route::get('/edit-storeInvoice/{id}', 'StoreInvoiceController@edit_storeInvoice')->name("edit-storeInvoice");
            Route::get('/edit-issuestoreInvoice/{id}', 'StoreInvoiceController@edit_issuestoreInvoice')->name("edit-issuestoreInvoice");
            Route::patch('/update-storeInvoice/{id}', 'StoreInvoiceController@update_storeInvoice')->name("update-storeInvoice");
            Route::post('/search-storeInvoice', 'StoreInvoiceController@search_store_invoice')->name("search-storeInvoice");
            Route::get('/delete-invoice/{id}', 'StoreInvoiceController@delete_store_invoice')->name("delete-invoice");
            Route::get('/invoice-print/{id}', 'StoreInvoiceController@store_invoice_print')->name("invoice-print");

        });
    });
});

// FOR BANK DETAILS .........
Route::namespace ('frontend')->group(function () {
    Route::namespace ('api')->group(function () {
        Route::namespace ('BankDetails')->group(function () {
            Route::get('/all-bankdetails', 'BankDetailsController@index')->name("all-bankdetails");
            Route::post('/save-bankdetails', 'BankDetailsController@save_bank_details')->name("save-bankdetails");
            Route::get('/edit-bankdetails/{id}', 'BankDetailsController@edit_bank_details')->name("edit-bankdetails");
            Route::patch('/update-bankdetails/{id}', 'BankDetailsController@update_bank_details')->name("edit-bankdetails");
        });
    });
});

Route::namespace ('frontend')->group(function () {
    Route::namespace ('api')->group(function () {
        Route::namespace ('CashAccount')->group(function () {
            Route::get('/all-cash-account', 'CashAccountDetailsController@index')->name("all-cash-account");
            Route::post('/save-cash-account', 'CashAccountDetailsController@save_cash_account')->name("save-cash-account");
            Route::get('/edit-cash-account/{id}', 'CashAccountDetailsController@edit_cash_account')->name("edit-cash-account");
            Route::patch('/update-cash-account/{id}', 'CashAccountDetailsController@update_cash_account')->name("update-cash-account");

        });
    });
});

Route::namespace ('frontend')->group(function () {
    Route::namespace ('api')->group(function () {
        Route::namespace ('StoreInvoice')->group(function () {
            Route::get('/all-params', 'InvoiceParamsController@index')->name("all-params");
            Route::get('/edit-params/{id}', 'InvoiceParamsController@edit_params')->name("edit-params");
            Route::patch('/update-params/{id}', 'InvoiceParamsController@update_params')->name("update-params");

        });
    });
});

Route::namespace ('frontend')->group(function () {
    Route::namespace ('api')->group(function () {
        Route::namespace ('Unit')->group(function () {
            Route::get('/all-unit', 'UnitController@index')->name("all-unit");
            Route::get('/edit-unit/{id}', 'UnitController@edit_unit')->name("edit-unit");
            Route::patch('/update-unit/{id}', 'UnitController@update_unit')->name("update-unit");
            Route::post('/add-unit', 'UnitController@add_unit')->name("add-unit");
        });
    });
});

Route::namespace ('frontend')->group(function () {
    Route::namespace ('api')->group(function () {
        Route::namespace ('AccountsInput')->group(function () {
            Route::get('/all-input', 'AccountsInputController@index')->name("all-input");
            Route::get('/edit-input/{id}', 'AccountsInputController@edit_input')->name("edit-input");
            Route::patch('/update-input/{id}', 'AccountsInputController@Update_input')->name("update-input");
            Route::post('/add-input', 'AccountsInputController@add_input')->name("add-input");
            Route::get('/all-module', 'AccountsInputController@all_module')->name("all-module");

        });
    });
});

Route::namespace ('frontend')->group(function () {
    Route::namespace ('api')->group(function () {
        Route::namespace ('CostCenter')->group(function () {
            Route::get('/all-costcenter', 'CostCenterController@index')->name("all-costcenter");
            Route::get('/edit-costcenter/{id}', 'CostCenterController@edit_cost')->name("edit-costcenter");
            Route::patch('/update-costcenter/{id}', 'CostCenterController@update_cost')->name("update-costcenter");
            Route::post('/add-costcenter', 'CostCenterController@add_cost')->name("add-costcenter");
        });
    });
});
Route::namespace ('frontend')->group(function () {
    Route::namespace ('api')->group(function () {
        Route::namespace ('StockReport')->group(function () {
            Route::get('/all-category', 'StockReportController@get_category')->name("all-category");
            Route::post('/stock-report', 'StockReportController@stock_reports')->name("stock-report");
        });
    });
});

Route::namespace ('frontend')->group(function () {
    Route::namespace ('api')->group(function () {
        Route::namespace ('PaymentVoucher')->group(function () {
            Route::post('/save-paymentvoucher', 'PaymentVoucherController@save_payment_voucher')->name("save-paymentvoucher");
            Route::get('/all-paymentvoucher', 'PaymentVoucherController@Manage_payment_voucher')->name("all-paymentvoucher");
            Route::get('/edit-paymentvoucher/{id}', 'PaymentVoucherController@Edit_payment_voucher')->name("edit-paymentvoucher");
            Route::patch('/update-paymentvoucher/{id}', 'PaymentVoucherController@update_payment_voucher')->name("update-paymentvoucher");
        });
    });
});

// for role management
Route::namespace ('frontend')->group(function () {
    Route::namespace ('api')->group(function () {

        Route::get('/get-menu-submenu', 'MenuSubmenuSettingController@get_menu_submenu')->name("get-menu-submenu");
        Route::post('/save-menu', 'MenuSubmenuSettingController@save_menu')->name("save-menu");
    });
});

Route::namespace ('frontend')->group(function () {
    Route::namespace ('api')->group(function () {
        Route::namespace ('SalesMan')->group(function () {
            Route::get('/all-salesman', 'SalesManController@ManageSalesMan');
            Route::post('/save-salesman', 'SalesManController@add_salesman');
            Route::patch('/update-salesman/{id}', 'SalesManController@update_salesman');
            Route::get('/edit-salesman/{id}', 'SalesManController@edit_salesMan');
        });
    });
});

Route::namespace ('frontend')->group(function () {
    Route::namespace ('api')->group(function () {
        Route::post('/sales-report', 'SalesReportController@salesReport');
    });
});
Route::namespace ('frontend')->group(function () {
    Route::namespace ('api')->group(function () {
        Route::namespace ('Size')->group(function () {
            Route::get('/all-size', 'SizeController@manage_size');
            Route::post('/save-size', 'SizeController@add_size');
            Route::patch('/update-size/{id}', 'SizeController@update_size');
            Route::get('/edit-size/{id}', 'SizeController@edit_size');
        });
    });
});

Route::namespace ('frontend')->group(function () {
    Route::namespace ('api')->group(function () {
        Route::get('/get-menu-submenu', 'MenuSubmenuSettingController@get_menu_submenu')->name("get-menu-submenu");
        Route::post('/save-menu', 'MenuSubmenuSettingController@save_menu_submenu');
        Route::get('/all-menusubmenu', 'MenuSubmenuSettingController@getMenuSubmenuInfoAsTree');
        Route::patch('/update-menusubmenu/{id}', 'MenuSubmenuSettingController@update_menu_submenu');
        Route::get('/delete-menusubmenu/{id}', 'MenuSubmenuSettingController@delete_menu_submenu');

        // for module List
        Route::post('/save-module', 'MenuSubmenuSettingController@savemodule_submodule');
        Route::get('/all-modulesubmodule', 'MenuSubmenuSettingController@getModuleSubmoduleInfoAsTree');
        Route::patch('/update-module/{id}', 'MenuSubmenuSettingController@update_module');
        Route::get('/delete-module/{id}', 'MenuSubmenuSettingController@delete_module');

    });
});

import React, { Component } from "react";
import { defaultRouteLink } from "../../common/config";
import EditInvoiceTransec from "../modal/EditInvoiceTransectionModal";
import ContentLoader, { Facebook, BulletList } from "react-content-loader";
import { useDispatch, useSelector } from "react-redux";
import { connect } from "react-redux";
import { Typeahead } from "react-bootstrap-typeahead";
import "react-bootstrap-typeahead/css/Typeahead.css";
import TextField from "@material-ui/core/TextField";
import {
    Form,
    Button,
    FormGroup,
    FormControl,
    ControlLabel
} from "react-bootstrap";
import { compose } from "redux";
import {
    MemoryRouter,
    HashRouter,
    Link,
    Redirect,
    withRouter
} from "react-router-dom";
import { updateStoreInvoice } from "../../actions/authActions";
import {
    SET_REFRESH_STORETRANSECTION,
    SET_CURRENT_USER,
    SET_CURRENT_USER_EXIST,
    SET_CURRENT_USER_NOT_FOUND
} from "../../actions/user_types";
// const dispatch=useDispatch();
const MyBulletListLoader = () => <BulletList />;
import {
    getAccessTokenNameInfo,
    getAccessTokenName,
    getApiServerDashboard
} from "../../common/config";

import {
    getCookieKeyInfo,
    setCookie,
    removeCookie
} from "../../common/CookieService";
import { isEmpty, isFunction } from "lodash";
import { red } from "@material-ui/core/colors";

// const mapDispatch = {action};
class EditStoreInvoice extends Component {
    constructor(props) {
        super(props);
        this.state = {
            warehouseList: [],
            invoicetransectionList: [],
            customerList: [],
            toggle: true,
            invoice_code: 0,
            remarks: "",
            warehouse_id: 0,
            vendor_id: "",
            vendorlist: [],
            date: "",
            store_id: 0,
            storelist: [],
            gross_amount: 0,
            discount_taka: 0,
            discount_percent: 0,
            final_discount_percent: 0,
            cash_amount: 0,
            bank_account: "",
            bank_id: 0,
            customer_id: 0,
            product_id: 0,
            productList: [],
            product: "",
            quantity: "",
            price: 0,
            idx: "",
            user_id: 0,
            isModalShow: false,
            modalData: {},
            vatList: [],
            vat_value: 0,
            bankdetailsList: [],
            cashamountList: [],
            vat_id: 0,
            loading: true,
            time: "",
            bankdetails_id: 0,
            cashamount_id: "",
            netAmount: 0,
            totalpriceQuantity: 0,
            totalpercent: 0,
            discountTaka: 0,
            totalVat: 0,
            netPayable: 0,
            vat: 0,
            bank_amount: 0,
            totalExchange: 0,
            invoiceParams: "",
            total_discount: 0,
            editInvoice: [],
            invoice_id: 0
        };
    }

    async componentDidMount() {
        const id = this.props.match.params.id;
        const res = await axios.get(
            defaultRouteLink + "/api/edit-storeInvoice/" + id
        );

        const invoice = res.data.editinvoice;
        const isLoginExit = getCookieKeyInfo(getAccessTokenName);
        this.setState({
            discountTaka: invoice.discount_taka,
            // discount_percent: invoice.discount_percent,
            final_discount_percent: invoice.discount_percent,
            cash_amount: invoice.cash_amount,
            bank_amount: invoice.bank_amount,
            remarks: invoice.remarks,
            invoice_code: invoice.invoice_number,
            idx: res.data.editinvoice.type,
            warehouse_id: invoice.ware_id,
            vendor_id: invoice.vendor_id,
            date: invoice.date,
            gross_amount: invoice.gross_amount,
            cashamount_id: invoice.cash_id,
            bankdetails_id: invoice.bank_id,
            store_id: invoice.store_id,
            storelist: res.data.store,
            invoice_id: this.props.match.params.id,
            user_id: isLoginExit
            // invoice_id:res.data.invwisetrans.invoice_id
        });
        // console.log("user id=" + isLoginExit);
        this.fetchalldata();
        // this.invoiceNumbers();
        // this.getinvoiceNumber();
        // this.editStoreInvoice();
    }

    // FOR GETTING WAREHOUSE WISE STORE
    get_warhousewiseStore = async wid => {
        let ware_id = wid;

        const response = await axios.get(
            defaultRouteLink + "/api/get-warehouse/" + ware_id
        );

        console.log(response.data.store);
        if (typeof response.data.store != "undefined") {
            this.setState({
                storelist: response.data.store
            });
        } else {
            this.setState({
                storelist: response.data.store
            });
        }
    };

    // FOR GETTING PRODUCT WISE PRICE  ........
    getProductWisePriceAuto = async pid => {
        let productid = pid;
        // console.log(productid);

        const response = await axios.get(
            defaultRouteLink + "/api/get-product-wise-price/" + productid
        );
        // console.log(response.data.productPrice);

        if (typeof response.data.productPrice != "undefined") {
            this.setState({
                product: response.data.productPrice,
                //price: response.data.productPrice.selling_price,
                price: 0
            });
        } else {
            this.setState({
                price: 0
            });
        }
    };
    priceHandleInput = e => {
        // console.log(e[0].id);
        if (typeof e[0] != "undefined") {
            this.setState({ product_id: e[0].id });
        }
        // console.log(e[0]); //true
        if (typeof e[0] != "undefined") {
            //var arr=e.isArray(e);
            //console.log("log"+arr);
            var id = e[0].id;
            this.getProductWisePriceAuto(id);
        }
    };

    WarehousehandleInput = event => {
        this.setState({ [event.target.name]: event.target.value });
        this.get_warhousewiseStore(event.target.value);
    };

    //

    // discountPercentHandleInput = event => {
    //     let total_discount =
    //         parseFloat((this.state.gross_amount * event.target.value) / 100) +
    //         parseFloat(this.state.discountTaka);
    //     this.calInvoiceAmt(
    //         event.target.name,
    //         event.target.value,
    //         total_discount
    //     );
    // };
    discountPercentHandleInput = event => {
        let total_discount =
            parseFloat((this.state.gross_amount * event.target.value) / 100) +
            parseFloat(this.state.discountTaka);
        let vat_amt = this.state.vat_value;
        this.calInvoiceAmt(
            event.target.name,
            event.target.value,
            total_discount,
            vat_amt
        );
        // this.setState({
        //     total_discount:total_discount
        // })
    };

    // for vat calculation  ....................................
    handleVatInput = event => {
        let disountPercentFromGrossAmount = parseFloat(
            (this.state.gross_amount * this.state.final_discount_percent) / 100
        );
        let total_discount =
            parseFloat(disountPercentFromGrossAmount) +
            parseFloat(this.state.discountTaka);
        let totalamount = this.state.gross_amount - this.state.total_discount;
        let vat_amt = event.target.value;

        this.calInvoiceAmt(
            event.target.name,
            event.target.value,
            total_discount,
            vat_amt
        );
    };

    // handleDiscountTaka = event => {
    //     let disountPercentFromGrossAmount =
    //         parseFloat(
    //             (this.state.gross_amount * this.state.final_discount_percent) /
    //                 100
    //         ) + parseFloat(event.target.value);
    //     this.calInvoiceAmt(
    //         event.target.name,
    //         event.target.value,
    //         disountPercentFromGrossAmount
    //     );
    //     this.setState({
    //         total_discount: disountPercentFromGrossAmount
    //     });
    // };
    handleDiscountTaka = event => {
        let disountPercentFromGrossAmount =
            parseFloat(
                (this.state.gross_amount * this.state.final_discount_percent) /
                    100
            ) + parseFloat(event.target.value);
        let vat_amt = this.state.vat_value;
        this.calInvoiceAmt(
            event.target.name,
            event.target.value,
            disountPercentFromGrossAmount,
            vat_amt
        );
        this.setState({
            total_discount: disountPercentFromGrossAmount
        });
    };

    // calInvoiceAmt = (name, value, discount, vat_amt = 0) => {
    //     this.setState({
    //         [name]: value,
    //         netPayable: this.state.gross_amount - discount
    //     });
    // };
    calInvoiceAmt = (name, value, discount, vat_amt = 0) => {
        let vat_calculate = parseFloat(
            ((this.state.gross_amount - discount) * vat_amt) / 100
        );

        this.setState({
            [name]: value,
            netPayable:
                parseFloat(this.state.gross_amount - discount) +
                parseFloat(vat_calculate),
            totalVat: vat_calculate
        });
    };

    // handleInput = event => {
    //     //console.log("cash Amount",{[event.target.cash_amount]: event.target.value});
    //     let total_rev =
    //         parseFloat(this.state.cash_amount) +
    //         parseFloat(this.state.bank_amount);
    //     if (event.target.name == "cash_amount") {
    //         total_rev =
    //             parseFloat(event.target.value) +
    //             parseFloat(this.state.bank_amount);
    //     }
    //     if (event.target.name == "bank_amount") {
    //         // console.log("exchange2="+this.state.cash_amount+","+event.target.value+"=t="+total_rev);
    //         total_rev =
    //             parseFloat(event.target.value) +
    //             parseFloat(this.state.cash_amount);
    //     }

    //     console.log(
    //         "exchange=" +
    //             this.state.netPayable +
    //             "," +
    //             event.target.value +
    //             "=t=" +
    //             total_rev
    //     );
    //     let exchange = this.state.netPayable - total_rev;
    //     this.setState({
    //         totalExchange: exchange,
    //         [event.target.name]: event.target.value
    //     });
    // };

    // save invoice transection .......

    handleInput = event => {
        //console.log("cash Amount",{[event.target.cash_amount]: event.target.value});
        let total_rev =
            parseFloat(this.state.cash_amount) +
            parseFloat(this.state.bank_amount);
        if (event.target.name == "cash_amount") {
            total_rev =
                parseFloat(event.target.value) +
                parseFloat(this.state.bank_amount);
        }
        if (event.target.name == "bank_amount") {
            // console.log("exchange2="+this.state.cash_amount+","+event.target.value+"=t="+total_rev);
            total_rev =
                parseFloat(event.target.value) +
                parseFloat(this.state.cash_amount);
        }

        console.log(
            "exchange=" +
                this.state.netPayable +
                "," +
                event.target.value +
                "=t=" +
                total_rev
        );
        let exchange = this.state.netPayable - total_rev;
        this.setState({
            totalExchange: exchange,
            [event.target.name]: event.target.value
        });
    };

    saveinvoiceTransection = async event => {
        event.preventDefault();
        const idx = this.props.match.params.idx;
        const isLoginExit = getCookieKeyInfo(getAccessTokenName);
        if (this.state.warehouse_id == 0) {
            Swal.fire({
                title: "WareHouse Cannot Be Empty!!",
                showClass: {
                    popup: "animate__animated animate__fadeInDown"
                },
                hideClass: {
                    popup: "animate__animated animate__fadeOutUp"
                }
            });
        } else if (idx == 1 && this.state.vendor_id == 0) {
            Swal.fire({
                title: "Vendor  Cannot Be Empty!!",
                showClass: {
                    popup: "animate__animated animate__fadeInDown"
                },
                hideClass: {
                    popup: "animate__animated animate__fadeOutUp"
                }
            });
        } else if (idx == 2 && this.state.vendor_id == 0) {
            Swal.fire({
                title: "Vendor  Cannot Be Empty!!",
                showClass: {
                    popup: "animate__animated animate__fadeInDown"
                },
                hideClass: {
                    popup: "animate__animated animate__fadeOutUp"
                }
            });
        }
        // else if (this.state.vendor_id == 0) {
        else if (idx == 3 && this.state.vendor_id == 0) {
            Swal.fire({
                title: "Customer  Cannot Be Empty!!",
                showClass: {
                    popup: "animate__animated animate__fadeInDown"
                },
                hideClass: {
                    popup: "animate__animated animate__fadeOutUp"
                }
            });
        } else if (idx == 4 && this.state.vendor_id == 0) {
            Swal.fire({
                title: "Customer  Cannot Be Empty!!",
                showClass: {
                    popup: "animate__animated animate__fadeInDown"
                },
                hideClass: {
                    popup: "animate__animated animate__fadeOutUp"
                }
            });
        } else if (this.state.date == 0) {
            Swal.fire({
                title: "Date  Cannot Be Empty!!",
                showClass: {
                    popup: "animate__animated animate__fadeInDown"
                },
                hideClass: {
                    popup: "animate__animated animate__fadeOutUp"
                }
            });
        } else if (this.state.store_id == 0) {
            Swal.fire({
                title: "Store  Cannot Be Empty!!",
                showClass: {
                    popup: "animate__animated animate__fadeInDown"
                },
                hideClass: {
                    popup: "animate__animated animate__fadeOutUp"
                }
            });
        } else if (this.state.product_id == 0) {
            Swal.fire({
                title: "Product  Cannot Be Empty!!",
                showClass: {
                    popup: "animate__animated animate__fadeInDown"
                },
                hideClass: {
                    popup: "animate__animated animate__fadeOutUp"
                }
            });
        } else if (this.state.quantity == 0) {
            Swal.fire({
                title: "Quantity  Cannot Be Empty!!",
                showClass: {
                    popup: "animate__animated animate__fadeInDown"
                },
                hideClass: {
                    popup: "animate__animated animate__fadeOutUp"
                }
            });
        } else if (this.state.price == 0) {
            Swal.fire({
                title: "Price  Cannot Be Empty!!",
                showClass: {
                    popup: "animate__animated animate__fadeInDown"
                },
                hideClass: {
                    popup: "animate__animated animate__fadeOutUp"
                }
            });
        } else {
            const invoice_id = this.props.match.params.id;
            const res = await axios.post(
                defaultRouteLink + "/api/save-storeinvoice",
                this.state,
                {
                    params: {
                        type: idx,
                        invoice_id: invoice_id,
                        user_id: isLoginExit
                    }
                }
            );

            // dispatch({
            //     type:SET_REFRESH_STORETRANSECTION,
            //     updateinvoiceTransection:res.data
            // });
            this.setState({
                invoicetransectionList: res.data.invotransec
            });
            this.props.updateStoreInvoice(res.data.invotransec);

            // SUCCESS MESSAGE USING SWEET ALERT
            try {
                const Toast = Swal.mixin({
                    toast: true,
                    position: "top-end",
                    showConfirmButton: false,
                    timer: 3000,
                    timerProgressBar: true,
                    onOpen: toast => {
                        toast.addEventListener("mouseenter", Swal.stopTimer);
                        toast.addEventListener("mouseleave", Swal.resumeTimer);
                    }
                });
                Toast.fire({
                    icon: "success",
                    title: "Store Created  Successfully!!"
                });
            } catch (error) {
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: "Something went wrong!",
                    footer: "<a href>Why do I have this issue?</a>"
                });
            }
        }
    };

    updateStoreInvoice = async event => {
        event.preventDefault();
        const idx = this.props.match.params.idx;

        if (idx == 1 && this.state.vendor_id == 0) {
            Swal.fire({
                title: "Vendor  Cannot Be Empty!!",
                showClass: {
                    popup: "animate__animated animate__fadeInDown"
                },
                hideClass: {
                    popup: "animate__animated animate__fadeOutUp"
                }
            });
        } else if (idx == 2 && this.state.vendor_id == 0) {
            Swal.fire({
                title: "Vendor  Cannot Be Empty!!",
                showClass: {
                    popup: "animate__animated animate__fadeInDown"
                },
                hideClass: {
                    popup: "animate__animated animate__fadeOutUp"
                }
            });
        }
        // else if (this.state.vendor_id == 0) {
        else if (idx == 3 && this.state.vendor_id == 0) {
            Swal.fire({
                title: "Customer  Cannot Be Empty!!",
                showClass: {
                    popup: "animate__animated animate__fadeInDown"
                },
                hideClass: {
                    popup: "animate__animated animate__fadeOutUp"
                }
            });
        } else if (idx == 4 && this.state.vendor_id == 0) {
            Swal.fire({
                title: "Customer  Cannot Be Empty!!",
                showClass: {
                    popup: "animate__animated animate__fadeInDown"
                },
                hideClass: {
                    popup: "animate__animated animate__fadeOutUp"
                }
            });
        } else if (this.state.warehouse_id == 0) {
            Swal.fire({
                title: "WareHouse   Cannot Be Empty!!",
                showClass: {
                    popup: "animate__animated animate__fadeInDown"
                },
                hideClass: {
                    popup: "animate__animated animate__fadeOutUp"
                }
            });
        } else if (
            this.state.bank_amount > 0 &&
            this.state.bankdetails_id == 0
        ) {
            Swal.fire({
                title: "You have to fillup Bank Account!!",
                showClass: {
                    popup: "animate__animated animate__fadeInDown"
                },
                hideClass: {
                    popup: "animate__animated animate__fadeOutUp"
                }
            });
        } else if (
            this.state.cash_amount > 0 &&
            this.state.cashamount_id == 0
        ) {
            Swal.fire({
                title: "You have to fillup Cash Account!!",
                showClass: {
                    popup: "animate__animated animate__fadeInDown"
                },
                hideClass: {
                    popup: "animate__animated animate__fadeOutUp"
                }
            });
        } else if (this.state.date == 0) {
            Swal.fire({
                title: "Date  Cannot Be Empty!!",
                showClass: {
                    popup: "animate__animated animate__fadeInDown"
                },
                hideClass: {
                    popup: "animate__animated animate__fadeOutUp"
                }
            });
        } else if (this.state.remarks == 0) {
            Swal.fire({
                title: "Remarks  Cannot Be Empty!!",
                showClass: {
                    popup: "animate__animated animate__fadeInDown"
                },
                hideClass: {
                    popup: "animate__animated animate__fadeOutUp"
                }
            });
        } else {
            let check = confirm("are you sure??");
            if (check) {
                const id = this.props.match.params.id;

                const res = await axios.patch(
                    defaultRouteLink + `/api/update-storeInvoice/${id}`,
                    this.state
                );

                // SUCCESS MESSAGE USING SWEET ALERT
                try {
                    if (res.data.status === 200) {
                        this.props.history.push(
                            defaultRouteLink + "/manage-store-invoice"
                        );
                    }
                    const Toast = Swal.mixin({
                        toast: true,
                        position: "top-end",
                        showConfirmButton: false,
                        timer: 3000,
                        timerProgressBar: true,
                        onOpen: toast => {
                            toast.addEventListener(
                                "mouseenter",
                                Swal.stopTimer
                            );
                            toast.addEventListener(
                                "mouseleave",
                                Swal.resumeTimer
                            );
                        }
                    });

                    Toast.fire({
                        icon: "success",
                        title: "Store Invoices Updated  Successfully!!"
                    });
                } catch (error) {
                    Swal.fire({
                        icon: "error",
                        title: "Oops...",
                        text: "Something went wrong!",
                        footer: "<a href>Why do I have this issue?</a>"
                    });
                }
            } else {
                return false;
            }
        }
    };

    // for getting warehouse ,store ,product , vendor ,customer,vat....
    fetchalldata = async () => {
        const idx = this.props.match.params.idx;
        const invoice_id = this.props.match.params.id;
        const isLoginExit = getCookieKeyInfo(getAccessTokenName);
        // const  invoice_id = this.state.invoice_id;
        const response = await axios.get(defaultRouteLink + "/api/all-data", {
            params: {
                type: idx,
                invoice_id: invoice_id,
                user_id: isLoginExit
            }
        });

        if (response.data.status === 200) {
            this.setState({
                warehouseList: response.data.warehouses,
                vendorlist: response.data.vendors,
                // storelist: response.data.stores,
                productList: response.data.products,
                customerList: response.data.customer,
                vatList: response.data.vats,
                invoicetransectionList: response.data.invotransec,
                bankdetailsList: response.data.bankdetails,
                cashamountList: response.data.cashaccount,
                invoiceParams: response.data.invoiceParams
            });

            this.props.updateStoreInvoice(response.data.invotransec);

            this.setState({ loading: false });
            // console.log("test=tt");
            let priceQuantity = 0;
            let discount = 0;
            let vat = 0;
            let minusDiscount = 0;
            let netAmount = 0;
            let grossAmount = 0;
            let minusManualDiscount = 0;
            let discountTaka = 0;
            let totalVat = 0;
            let manualAndPercentDiscount = 0;
            let netPayable = 0;

            response.data.invotransec.map((item, index) => {
                // console.log("log="+item.id);
                // console.log(item.price * item.quantity)
                priceQuantity = item.price * item.quantity;
                // for getting percent ammount .....
                discount = (priceQuantity * item.discount_percent) / 100;
                minusDiscount = priceQuantity - discount;

                minusManualDiscount = minusDiscount - item.discount_taka;

                vat = (minusManualDiscount * item.value) / 100;
                netAmount = minusManualDiscount + vat;
                grossAmount += priceQuantity;
                manualAndPercentDiscount = discount + item.discount_taka;
                discountTaka += manualAndPercentDiscount;
                totalVat += vat;
                netPayable += netAmount;
                // console.log("hello2",netPayable)
            });

            this.setState({
                totalpriceQuantity: priceQuantity,
                netAmount: netAmount,
                gross_amount: grossAmount,
                // discountTaka: discountTaka,
                totalVat: totalVat,
                netPayable: netPayable,
                vat: vat
            });
            // dispatch({
            //     type:SET_REFRESH_STORETRANSECTION,
            //     data:{}
            // });
        }
    };

    // FOR DELETE INVOICES
    delinvoicetransec = async e => {
        const removeId = e.target.getAttribute("data-id");
        const idx = this.props.match.params.idx;
        const invoice_id = this.props.match.params.id;
        const isLoginExit = getCookieKeyInfo(getAccessTokenName);
        const response = await axios.get(
            defaultRouteLink + "/api/delete-invoice-transec/" + removeId,
            {
                params: {
                    type: idx,
                    invoice_id: invoice_id,
                    user_id:isLoginExit
                }
            }
        );
        this.setState({
            invoicetransectionList: response.data.invotransec
        });
        this.props.updateStoreInvoice(response.data.invotransec);
        // SUCCESS MESSAGE USING SWEET ALERT
        try {
            const Toast = Swal.mixin({
                toast: true,
                position: "top-end",
                showConfirmButton: false,
                timer: 3000,
                timerProgressBar: true,
                onOpen: toast => {
                    toast.addEventListener("mouseenter", Swal.stopTimer);
                    toast.addEventListener("mouseleave", Swal.resumeTimer);
                }
            });

            Toast.fire({
                icon: "success",
                title: "Invoice Transection Deleted Successfully!!"
            });
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Something went wrong!",
                footer: "<a href>Why do I have this issue?</a>"
            });
        }
    };
    handleEditUpdate = data => {
        this.fetchalldata();
        this.setState({
            isModalShow: false
        });
    };
    handleModalClose = () => {
        this.setState({
            isModalShow: false
        });
    };
    handleProductEdit = async item_id => {
        this.setState({
            isModalShow: true
        });
        // editInvoiceTransection = async () => {
        const response = await axios.get(
            defaultRouteLink + "/api/edit-invoice-transec/" + item_id
        );
        this.setState({ modalData: response.data.invoice });

        // };
    };

    // for react live search ...
    filterBy = (option, state) => {
        if (state.selected.length) {
            return true;
        }
        return (
            option.label.toLowerCase().indexOf(state.text.toLowerCase()) > -1
        );
    };

    ToggleButton = ({ isOpen, onClick }) => (
        <button
            className="toggle-button"
            onClick={onClick}
            onMouseDown={e => {
                // Prevent input from losing focus.
                e.preventDefault();
            }}
        ></button>
    );

    // end for live search
    render() {
        // console.log("product lsit="+this.state.data_p_list);
        // FETCH ALL WAREHOUSE DATA... LOOP
        let warhouses = this.state.warehouseList.map((item, index) => {
            return (
                <option
                    selected={this.state.warehouse_id == item.id}
                    value={item.id}
                    data-tokens="item.name"
                >
                    {item.name}
                </option>
            );
            this.setState({
                warehouse_id: item.id // UPDATE STATE ..
            });
        });
        // FETCH ALL VENDOR DATA... LOOP
        let vendors = this.state.vendorlist.map((item, index) => {
            // if (warhouses.length === 0) return 1;

            return (
                <option
                    selected={this.state.vendor_id == item.id}
                    value={item.id}
                    data-tokens="item.name"
                >
                    {" "}
                    {item.name}
                </option>
            );

            this.setState({
                vendor_id: item.id // UPDATE STATE ..
            });
        });
        let customer = this.state.customerList.map((item, index) => {
            // if (warhouses.length === 0) return 1;

            return (
                <option value={item.id} data-tokens="item.name">
                    {" "}
                    {item.name}
                </option>
            );

            this.setState({
                customer_id: item.id // UPDATE STATE ..
            });
        });
        // FETCH ALL STORE DATA... LOOP
        let stores = this.state.storelist.map((item, index) => {
            return (
                <option
                    value={item.id}
                    selected={this.state.store_id == item.id}
                    data-tokens="item.name"
                >
                    {" "}
                    {item.store_name}
                </option>
            );

            this.setState({
                store_id: item.id // UPDATE STATE ..
            });
        });
        // this.props.addSearchProductList(response.data.product_list);
        // fetch all product data ......
        // let products = this.state.productList.map((item, index) => {
        //     return (
        //         <option value={item.id} data-tokens="item.product_name">
        //             {item.product_name}
        //         </option>
        //     );
        //     this.setState({
        //         product_id: item.id, // UPDATE STATE ........
        //         price: item.selling_price
        //     });
        // });

        let priceQuantity = 0;
        let discountpercent = 0;
        let minusdiscountPercent = 0;
        let minusManualdiScount = 0;
        let vatCount = 0;
        let TotalAmount = 0;

        // FETCH ALL Invoice transection  DATA... LOOP
        // let invotransec = this.state.invoicetransectionList.map(
        let invotransec = this.props.data_p_list.map((item, index) => {
            const idx = this.props.match.params.idx;

            return (
                <tr>
                    <td>{index + 1}</td>

                    {/* {item.dp_name != null ? (
                        <td>{item.dp_name}</td>
                    ) : (
                        <td>{item.cp_name}</td>
                    )} */}

                    <td>{item.product_name}</td>
                    <td>{item.quantity}</td>
                    <td>{item.price}</td>
                    <td>{(priceQuantity = item.price * item.quantity)}</td>

                    {/* <input type="hidden" value={priceQuantity}></input> */}

                    <td>{item.discount_taka}</td>
                    <td>{item.discount_percent}</td>
                    <input
                        type="hidden"
                        value={
                            (discountpercent =
                                (priceQuantity * item.discount_percent) / 100)
                        }
                    ></input>
                    <input
                        type="hidden"
                        value={
                            (minusdiscountPercent =
                                priceQuantity - discountpercent)
                        }
                    ></input>
                    <input
                        type="hidden"
                        value={
                            (minusManualdiScount =
                                minusdiscountPercent - item.discount_taka)
                        }
                    ></input>
                    <input
                        type="hidden"
                        value={
                            (vatCount =
                                (minusManualdiScount * item.value) / 100)
                        }
                    ></input>
                    <input
                        type="hidden"
                        value={(TotalAmount = minusManualdiScount + vatCount)}
                    ></input>
                    <td>{item.vat_name}</td>
                    <td>{vatCount}</td>
                    <td>{TotalAmount}</td>

                    <td>
                        <button
                            onClick={() => this.handleProductEdit(item.id)}
                            className="btn btn-primary"
                        >
                            Edit
                        </button>
                        <button
                            onClick={this.delinvoicetransec}
                            className="btn btn-primary"
                            data-id={item.id}
                        >
                            Delete
                        </button>
                    </td>
                </tr>
            );
        });

        // FETCH ALL VAT DATA... LOOP
        let allvat = this.state.vatList.map((item, index) => {
            return (
                <option value={item.id} data-tokens="item.name">
                    {item.vat_name}
                </option>
            );
            this.setState({
                vat_id: item.id, // UPDATE STATE ........
                vat_value: item.value // UPDATE STATE ........
            });
        });

        // FETCH ALL VAT VALUE DATA... LOOP
        let allvatvalue = this.state.vatList.map((item, index) => {
            return (
                <option value={item.value} data-tokens="item.name">
                    {item.vat_name}
                </option>
            );
            this.setState({
                vat_id: item.id, // UPDATE STATE ........
                vat_value: item.value // UPDATE STATE ........
            });
        });
        // FETCH ALL BANK ACCOUNT LIST ... LOOP
        let allbanklist = this.state.bankdetailsList.map((item, index) => {
            return (
                <option
                    selected={this.state.bankdetails_id == item.id}
                    value={item.id}
                    data-tokens="item.name"
                >
                    {item.bank_name}
                </option>
            );
            this.setState({
                bankdetails_id: item.id // UPDATE STATE ........
            });
        });
        // FETCH ALL CASH ACCOUNT DETAILS LIST ... LOOP
        let allaccountlist = this.state.cashamountList.map((item, index) => {
            return (
                <option
                    selected={this.state.cashamount_id == item.id}
                    value={item.id}
                    data-tokens="item.name"
                >
                    {item.cash_name}
                </option>
            );
            this.setState({
                cashamount_id: item.id // UPDATE STATE ........
            });
        });

        const idx = this.props.match.params.idx;

        let pagetitle1 = "";
        if (idx == 1) {
            pagetitle1 = "NEW PURCHASE";
        } else if (idx == 2) {
            pagetitle1 = "PURSHASE RETURN";
        } else if (idx == 3) {
            pagetitle1 = "SALE";
        } else if (idx == 4) {
            pagetitle1 = "SALE RETURN ";
        }
        if (this.state.loading) {
            return <MyBulletListLoader />;
        }

        return (
            <div>
                <EditInvoiceTransec
                    show={this.state.isModalShow}
                    modalData={this.state.modalData}
                    handleClose={this.handleModalClose}
                    handleUpdate={this.handleEditUpdate}
                    {...this.props}
                />

                <div className="col-md-12">
                    <div className="row">
                        <div className="col-md-12">
                            <div style={{ marginTop: 30 }}>
                                <Link
                                    to={defaultRouteLink + `/new-purshase/${1}`}
                                    type="button"
                                    className="btn btn-danger"
                                    style={{ marginLeft: 15 }}
                                >
                                    New Purshase
                                </Link>
                                <Link
                                    to={
                                        defaultRouteLink +
                                        `/purshase-return/${2}`
                                    }
                                    type="button"
                                    className="btn btn-info"
                                    style={{ marginLeft: 15 }}
                                >
                                    Purshase Return{" "}
                                </Link>
                                <Link
                                    to={defaultRouteLink + `/sale-return/${3}`}
                                    type="button"
                                    className="btn btn-success"
                                    style={{ marginLeft: 15 }}
                                >
                                    Sale{" "}
                                </Link>
                                <Link
                                    to={defaultRouteLink + `/sale/${4}`}
                                    type="button"
                                    className="btn btn-warning"
                                    style={{ marginLeft: 15 }}
                                >
                                    Sale Return
                                </Link>
                                <Link
                                    to={
                                        defaultRouteLink +
                                        `/manage-store-invoice`
                                    }
                                    type="button"
                                    className="btn btn-dark"
                                    style={{ marginLeft: 15 }}
                                >
                                    Manage Invoice
                                </Link>
                            </div>

                            <h2 className="text-center">Transaction</h2>
                            <div className="card text-center">
                                <div className="card-header">{pagetitle1}</div>
                                <div className="row pt-5">
                                    <div className="col-md-8">
                                        <div className="card-body">
                                            <span align="center"></span>
                                            <form
                                                onSubmit={
                                                    this.saveinvoiceTransection
                                                }
                                            >
                                                <div className="container">
                                                    <div className="row">
                                                        <div className="col-md-2">
                                                            <label className="control-label">
                                                                Invoice Number
                                                            </label>
                                                            <input
                                                                type="text"
                                                                className="form-control"
                                                                placeholder="Invoice Code"
                                                                name="invoice_code"
                                                                readOnly
                                                                value={
                                                                    this.state
                                                                        .invoice_code
                                                                }
                                                                required
                                                                // onChange={
                                                                //     this.handleInput
                                                                // }
                                                            ></input>
                                                        </div>

                                                        <div className="col-md-2">
                                                            <label className="control-label">
                                                                Warehouse
                                                            </label>
                                                            <select
                                                                className="form-control"
                                                                className="form-control"
                                                                data-live-search="true"
                                                                data-width="fit"
                                                                name="warehouse_id"
                                                                onChange={
                                                                    this
                                                                        .WarehousehandleInput
                                                                }
                                                                required
                                                            >
                                                                <option value="0">
                                                                    Choose One
                                                                </option>
                                                                {warhouses}
                                                            </select>
                                                        </div>
                                                        {idx == 1 ||
                                                        idx == 2 ? (
                                                            <div className="col-md-2">
                                                                <label className="control-label">
                                                                    Vendor
                                                                </label>
                                                                <select
                                                                    className="form-control"
                                                                    data-live-search="true"
                                                                    value={
                                                                        this
                                                                            .state
                                                                            .vendor_id
                                                                    }
                                                                    name="vendor_id"
                                                                    onChange={
                                                                        this
                                                                            .handleInput
                                                                    }
                                                                >
                                                                    <option
                                                                        selected
                                                                        value="0"
                                                                    >
                                                                        Choose
                                                                        One
                                                                    </option>
                                                                    {vendors}
                                                                </select>
                                                            </div>
                                                        ) : (
                                                            <div className="col-md-2">
                                                                <label className="control-label">
                                                                    Customer
                                                                </label>
                                                                <select
                                                                    className="form-control"
                                                                    data-live-search="true"
                                                                    name="customer_id"
                                                                    value={
                                                                        this
                                                                            .state
                                                                            .customer_id
                                                                    }
                                                                    onChange={
                                                                        this
                                                                            .handleInput
                                                                    }
                                                                >
                                                                    <option
                                                                        selected
                                                                        value="0"
                                                                    >
                                                                        Choose
                                                                        One
                                                                    </option>
                                                                    {customer}
                                                                </select>
                                                            </div>
                                                        )}

                                                        <div className="col-md-2">
                                                            <label className="control-label">
                                                                Date
                                                            </label>
                                                            <input
                                                                type="text"
                                                                readOnly
                                                                className="form-control"
                                                                name="date"
                                                                value={
                                                                    this.state
                                                                        .date
                                                                }
                                                                onChange={
                                                                    this
                                                                        .handleInput
                                                                }
                                                            ></input>
                                                        </div>
                                                        <div className="col-md-2">
                                                            <label className="control-label">
                                                                Store
                                                            </label>
                                                            <select
                                                                className="form-control"
                                                                data-live-search="true"
                                                                name="store_id"
                                                                value={
                                                                    this.state
                                                                        .store_id
                                                                }
                                                                onChange={
                                                                    this
                                                                        .handleInput
                                                                }
                                                            >
                                                                <option
                                                                    selected
                                                                    value="0"
                                                                >
                                                                    Choose One
                                                                </option>
                                                                {stores}
                                                            </select>
                                                        </div>
                                                    </div>
                                                </div>

                                                {this.state.invoiceParams
                                                    .discount_method == 1 ? (
                                                    <div className="card text-center mt-5">
                                                        <div className="card-header">
                                                            Default Store
                                                        </div>
                                                        <div className="card-body">
                                                            <div className="container">
                                                                <div className="row">
                                                                    <div className="col-md-3">
                                                                        <label className="control-label">
                                                                            Product
                                                                            Name
                                                                        </label>
                                                                        {/* <select
                                                                            // className="form-control"
                                                                            name="product_id"
                                                                            className="form-control select2"
                                                                            value={
                                                                                this
                                                                                    .state
                                                                                    .product_id
                                                                            }
                                                                            onChange={
                                                                                this
                                                                                    .priceHandleInput
                                                                            }
                                                                        >

                                                                            <option
                                                                                selected
                                                                                value="0"
                                                                            >
                                                                                Choose
                                                                                One
                                                                            </option>
                                                                            {
                                                                                products
                                                                                // TypeaheadExample
                                                                            }

                                                                        </select>
 */}
                                                                        <Typeahead
                                                                            id="labelkey-example"
                                                                            labelKey={products =>
                                                                                `${products.product_name}`
                                                                            }
                                                                            key={product =>
                                                                                `${product.id}`
                                                                            }
                                                                            valueKey={product =>
                                                                                `${product.id}`
                                                                            }
                                                                            isValid={product =>
                                                                                `${product.id}`
                                                                            }
                                                                            options={
                                                                                this
                                                                                    .state
                                                                                    .productList
                                                                            }
                                                                            value={
                                                                                this
                                                                                    .state
                                                                                    .product_id
                                                                            }
                                                                            name="product_id"
                                                                            onChange={e =>
                                                                                this.priceHandleInput(
                                                                                    e
                                                                                )
                                                                            }
                                                                            placeholder="Select your product"
                                                                        />
                                                                        {/* // let products = this.state.productList.map((item, index) => {
                                                                            //     return (
                                                                            //         <option value={item.id} data-tokens="item.product_name">
                                                                            //             {item.product_name}
                                                                            //         </option>
                                                                            //     );
                                                                            //     this.setState({
                                                                            //         product_id: item.id, // UPDATE STATE ........
                                                                            //         price: item.selling_price
                                                                            //     });
                                                                            // }); */}
                                                                    </div>

                                                                    {this.state
                                                                        .product
                                                                        .price_type ==
                                                                    2 ? (
                                                                        <div className="col-md-3">
                                                                            <label className="control-label">
                                                                                Product
                                                                                Price
                                                                            </label>
                                                                            <input
                                                                                type="text"
                                                                                name="price"
                                                                                readOnly
                                                                                value={
                                                                                    this
                                                                                        .state
                                                                                        .price
                                                                                }
                                                                                onChange={
                                                                                    this
                                                                                        .handleInput
                                                                                }
                                                                                className="form-control"
                                                                                placeholder="Price"
                                                                            ></input>
                                                                        </div>
                                                                    ) : (
                                                                        <div className="col-md-3">
                                                                            <label className="control-label">
                                                                                Product
                                                                                Price
                                                                            </label>
                                                                            <input
                                                                                type="text"
                                                                                name="price"
                                                                                value={
                                                                                    this
                                                                                        .state
                                                                                        .price
                                                                                }
                                                                                onChange={
                                                                                    this
                                                                                        .handleInput
                                                                                }
                                                                                className="form-control"
                                                                                placeholder="Price"
                                                                            ></input>
                                                                        </div>
                                                                    )}

                                                                    <div className="col-md-3">
                                                                        <label className="control-label">
                                                                            Quantity
                                                                        </label>
                                                                        <input
                                                                            type="text"
                                                                            onChange={
                                                                                this
                                                                                    .handleInput
                                                                            }
                                                                            name="quantity"
                                                                            value={
                                                                                this
                                                                                    .state
                                                                                    .quantity
                                                                            }
                                                                            className="form-control"
                                                                            placeholder="Quantity"
                                                                        ></input>
                                                                    </div>

                                                                    <div className="col-md-3">
                                                                        <label className="control-label">
                                                                            Discount
                                                                            Taka
                                                                        </label>
                                                                        <input
                                                                            type="text"
                                                                            name="discount_taka"
                                                                            readOnly
                                                                            value={
                                                                                this
                                                                                    .state
                                                                                    .discount_taka
                                                                            }
                                                                            onChange={
                                                                                this
                                                                                    .handleInput
                                                                            }
                                                                            className="form-control"
                                                                            placeholder="Discount Taka"
                                                                        ></input>
                                                                    </div>
                                                                    <div className="col-md-3">
                                                                        <label className="control-label">
                                                                            Vat
                                                                        </label>
                                                                        <select
                                                                            className="form-control"
                                                                            data-live-search="true"
                                                                            name="vat_id"
                                                                            disabled
                                                                            value={
                                                                                this
                                                                                    .state
                                                                                    .vat_id
                                                                            }
                                                                            onChange={
                                                                                this
                                                                                    .handleInput
                                                                            }
                                                                        >
                                                                            {
                                                                                allvat
                                                                            }
                                                                        </select>
                                                                    </div>
                                                                    <div className="col-md-3">
                                                                        <label className="control-label">
                                                                            Discount
                                                                            Percent
                                                                        </label>
                                                                        <input
                                                                            type="text"
                                                                            readOnly
                                                                            name="discount_percent"
                                                                            value={
                                                                                this
                                                                                    .state
                                                                                    .discount_percent
                                                                            }
                                                                            onChange={
                                                                                this
                                                                                    .handleInput
                                                                            }
                                                                            className="form-control"
                                                                            placeholder="Discount persent"
                                                                        ></input>
                                                                    </div>
                                                                    <button
                                                                        type="submit"
                                                                        class="btn btn-danger "
                                                                        style={{
                                                                            marginTop: 80
                                                                        }}
                                                                    >
                                                                        Submit
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div class="card-footer text-muted"></div>
                                                    </div>
                                                ) : (
                                                    <div className="card text-center mt-5">
                                                        <div className="card-header">
                                                            Default Store
                                                        </div>
                                                        <div className="card-body">
                                                            <div className="container">
                                                                <div className="row">
                                                                    <div className="col-md-3">
                                                                        <label className="control-label">
                                                                            Product
                                                                            Name
                                                                        </label>
                                                                        {/* <select
                                                                            className="form-control"
                                                                            data-live-search="true"
                                                                            name="product_id"
                                                                            value={
                                                                                this
                                                                                    .state
                                                                                    .product_id
                                                                            }
                                                                            onChange={
                                                                                this
                                                                                    .priceHandleInput
                                                                            }
                                                                        >
                                                                            <option
                                                                                selected
                                                                                value="0"
                                                                            >
                                                                                Choose
                                                                                One
                                                                            </option>
                                                                            {
                                                                                products
                                                                            }
                                                                        </select>
                                                                     */}
                                                                        <Typeahead
                                                                            id="labelkey-example"
                                                                            labelKey={products =>
                                                                                `${products.product_name}`
                                                                            }
                                                                            key={product =>
                                                                                `${product.id}`
                                                                            }
                                                                            valueKey={product =>
                                                                                `${product.id}`
                                                                            }
                                                                            isValid={product =>
                                                                                `${product.id}`
                                                                            }
                                                                            options={
                                                                                this
                                                                                    .state
                                                                                    .productList
                                                                            }
                                                                            value={
                                                                                this
                                                                                    .state
                                                                                    .product_id
                                                                            }
                                                                            name="product_id"
                                                                            onChange={e =>
                                                                                this.priceHandleInput(
                                                                                    e
                                                                                )
                                                                            }
                                                                            placeholder="Select your product"
                                                                        />
                                                                    </div>
                                                                    {this.state
                                                                        .product
                                                                        .price_type ==
                                                                    2 ? (
                                                                        <div className="col-md-3">
                                                                            <label className="control-label">
                                                                                Product
                                                                                Price
                                                                            </label>
                                                                            <input
                                                                                type="text"
                                                                                name="price"
                                                                                readOnly
                                                                                value={
                                                                                    this
                                                                                        .state
                                                                                        .price
                                                                                }
                                                                                onChange={
                                                                                    this
                                                                                        .handleInput
                                                                                }
                                                                                className="form-control"
                                                                                placeholder="Price"
                                                                            ></input>
                                                                        </div>
                                                                    ) : (
                                                                        <div className="col-md-3">
                                                                            <label className="control-label">
                                                                                Product
                                                                                Price
                                                                            </label>
                                                                            <input
                                                                                type="text"
                                                                                name="price"
                                                                                value={
                                                                                    this
                                                                                        .state
                                                                                        .price
                                                                                }
                                                                                onChange={
                                                                                    this
                                                                                        .handleInput
                                                                                }
                                                                                className="form-control"
                                                                                placeholder="Price"
                                                                            ></input>
                                                                        </div>
                                                                    )}

                                                                    <div className="col-md-3">
                                                                        <label className="control-label">
                                                                            Quantity
                                                                        </label>
                                                                        <input
                                                                            type="text"
                                                                            onChange={
                                                                                this
                                                                                    .handleInput
                                                                            }
                                                                            name="quantity"
                                                                            value={
                                                                                this
                                                                                    .state
                                                                                    .quantity
                                                                            }
                                                                            className="form-control"
                                                                            placeholder="Quantity"
                                                                        ></input>
                                                                    </div>

                                                                    <div className="col-md-3">
                                                                        <label className="control-label">
                                                                            Discount
                                                                            Taka
                                                                        </label>
                                                                        <input
                                                                            type="text"
                                                                            name="discount_taka"
                                                                            value={
                                                                                this
                                                                                    .state
                                                                                    .discount_taka
                                                                            }
                                                                            onChange={
                                                                                this
                                                                                    .handleInput
                                                                            }
                                                                            className="form-control"
                                                                            placeholder="Discount Taka"
                                                                        ></input>
                                                                    </div>
                                                                    <div className="col-md-3">
                                                                        <label className="control-label">
                                                                            Vat
                                                                        </label>
                                                                        <select
                                                                            className="form-control"
                                                                            data-live-search="true"
                                                                            name="vat_id"
                                                                            value={
                                                                                this
                                                                                    .state
                                                                                    .vat_id
                                                                            }
                                                                            onChange={
                                                                                this
                                                                                    .handleInput
                                                                            }
                                                                        >
                                                                            {
                                                                                allvat
                                                                            }
                                                                        </select>
                                                                    </div>
                                                                    <div className="col-md-3">
                                                                        <label className="control-label">
                                                                            Discount
                                                                            Percent
                                                                        </label>
                                                                        <input
                                                                            type="text"
                                                                            name="discount_percent"
                                                                            value={
                                                                                this
                                                                                    .state
                                                                                    .discount_percent
                                                                            }
                                                                            onChange={
                                                                                this
                                                                                    .handleInput
                                                                            }
                                                                            className="form-control"
                                                                            placeholder="Discount persent"
                                                                        ></input>
                                                                    </div>
                                                                    <button
                                                                        type="submit"
                                                                        class="btn btn-danger "
                                                                        style={{
                                                                            marginTop: 80
                                                                        }}
                                                                    >
                                                                        Submit
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div class="card-footer text-muted"></div>
                                                    </div>
                                                )}
                                            </form>
                                        </div>

                                        {/* fetch all Invoice Transection */}
                                        <div class="card text-center mt-5">
                                            <div class="card-header">
                                                All Data
                                            </div>
                                            <div class="card-body">
                                                <table className="table table-bordered">
                                                    <thead>
                                                        <tr>
                                                            <td>SL</td>
                                                            <td>
                                                                Product Name
                                                            </td>
                                                            <td>Quantity</td>
                                                            <td>Price</td>
                                                            <td>Total</td>
                                                            <td>
                                                                Discount Taka
                                                            </td>
                                                            <td>
                                                                Discount Percent{" "}
                                                            </td>
                                                            <td>Vat Name</td>
                                                            <td>Vat Amount</td>
                                                            <td>Net</td>
                                                            <td>Action</td>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {invotransec}
                                                        {/* Net = {this.state.netAmount} */}
                                                    </tbody>
                                                </table>
                                            </div>

                                            <div class="card-footer text-muted"></div>
                                        </div>
                                    </div>
                                    <div className="col-md-4 pt-5">
                                        <div className="row">
                                            <div class="card">
                                                <div class="card-header">
                                                    Featured
                                                </div>
                                                <div class="card-body">
                                                    <form
                                                        onSubmit={
                                                            this
                                                                .updateStoreInvoice
                                                        }
                                                    >
                                                        {this.state
                                                            .invoiceParams
                                                            .discount_method ==
                                                        1 ? (
                                                            <div>
                                                                <div className="col-md-4">
                                                                    <label className="control-label">
                                                                        Gross
                                                                        Amount
                                                                    </label>
                                                                    <input
                                                                        type="number"
                                                                        readOnly
                                                                        className="form-control"
                                                                        name="gross_amount"
                                                                        value={
                                                                            this
                                                                                .state
                                                                                .gross_amount
                                                                        }
                                                                    ></input>
                                                                </div>
                                                                <div className="col-md-4">
                                                                    <label className="control-label">
                                                                        Discount
                                                                        Taka
                                                                    </label>
                                                                    <input
                                                                        type="text"
                                                                        className="form-control"
                                                                        name="discountTaka"
                                                                        value={
                                                                            this
                                                                                .state
                                                                                .discountTaka
                                                                        }
                                                                        onChange={
                                                                            this
                                                                                .handleDiscountTaka
                                                                        }
                                                                    ></input>

                                                                    <input
                                                                        type="hidden"
                                                                        className="form-control"
                                                                        onChange={
                                                                            this
                                                                                .handleInput
                                                                        }
                                                                    ></input>
                                                                </div>
                                                                <div className="col-md-4">
                                                                    <label className="control-label">
                                                                        Discount
                                                                        Percent
                                                                    </label>
                                                                    <input
                                                                        type="text"
                                                                        className="form-control"
                                                                        name="final_discount_percent"
                                                                        value={
                                                                            this
                                                                                .state
                                                                                .final_discount_percent
                                                                        }
                                                                        onChange={
                                                                            this
                                                                                .discountPercentHandleInput
                                                                        }
                                                                    ></input>
                                                                </div>
                                                                <div className="col-md-4">
                                                                    <label className="control-label">
                                                                        Total
                                                                        Discount
                                                                    </label>
                                                                    <input
                                                                        type="text"
                                                                        className="form-control"
                                                                        name=""
                                                                        value={
                                                                            this
                                                                                .state
                                                                                .total_discount
                                                                        }
                                                                    ></input>
                                                                </div>

                                                                <div className="col-md-4">
                                                                    <label className="control-label">
                                                                        Total
                                                                        Vat
                                                                    </label>
                                                                    <input
                                                                        type="text"
                                                                        className="form-control"
                                                                        required
                                                                        onChange={
                                                                            this
                                                                                .handleInput
                                                                        }
                                                                        value={
                                                                            this
                                                                                .state
                                                                                .totalVat
                                                                        }
                                                                    ></input>
                                                                </div>
                                                                <div className="col-md-4">
                                                                    <label className="control-label">
                                                                        Vat
                                                                    </label>
                                                                    <select
                                                                        className="form-control"
                                                                        data-live-search="true"
                                                                        name="vat_value"
                                                                        value={
                                                                            this
                                                                                .state
                                                                                .vat_value
                                                                        }
                                                                        onChange={
                                                                            this
                                                                                .handleVatInput
                                                                        }
                                                                    >
                                                                        {
                                                                            allvatvalue
                                                                        }
                                                                    </select>
                                                                </div>

                                                                <div className="col-md-4">
                                                                    <label className="control-label">
                                                                        Net
                                                                        Payable
                                                                    </label>
                                                                    <input
                                                                        type="text"
                                                                        className="form-control"
                                                                        readOnly
                                                                        value={
                                                                            this
                                                                                .state
                                                                                .netPayable
                                                                        }
                                                                    ></input>
                                                                </div>
                                                                <div className="col-md-4">
                                                                    <label className="control-label">
                                                                        Cash
                                                                        Account
                                                                    </label>
                                                                    <select
                                                                        className="form-control"
                                                                        data-live-search="true"
                                                                        name="cashamount_id"
                                                                        value={
                                                                            this
                                                                                .state
                                                                                .cashamount_id
                                                                        }
                                                                        onChange={
                                                                            this
                                                                                .handleInput
                                                                        }
                                                                    >
                                                                        <option
                                                                            selected
                                                                            value="0"
                                                                        >
                                                                            Choose
                                                                            One
                                                                        </option>
                                                                        {
                                                                            allaccountlist
                                                                        }
                                                                    </select>
                                                                </div>
                                                                <div className="col-md-4">
                                                                    <label className="control-label">
                                                                        Cash
                                                                        Amount
                                                                    </label>
                                                                    <input
                                                                        type="number"
                                                                        className="form-control"
                                                                        name="cash_amount"
                                                                        value={
                                                                            this
                                                                                .state
                                                                                .cash_amount
                                                                        }
                                                                        required
                                                                        onChange={
                                                                            this
                                                                                .handleInput
                                                                        }
                                                                    ></input>
                                                                </div>
                                                                <div className="col-md-4">
                                                                    <label className="control-label">
                                                                        Bank
                                                                        Account
                                                                    </label>
                                                                    <select
                                                                        className="form-control"
                                                                        data-live-search="true"
                                                                        name="bankdetails_id"
                                                                        value={
                                                                            this
                                                                                .state
                                                                                .bankdetails_id
                                                                        }
                                                                        onChange={
                                                                            this
                                                                                .handleInput
                                                                        }
                                                                    >
                                                                        <option
                                                                            selected
                                                                            value="0"
                                                                        >
                                                                            Choose
                                                                            One
                                                                        </option>
                                                                        {
                                                                            allbanklist
                                                                        }
                                                                    </select>
                                                                </div>
                                                                <div className="col-md-4">
                                                                    <label className="control-label">
                                                                        Bank
                                                                        Amount
                                                                    </label>
                                                                    <input
                                                                        type="number"
                                                                        className="form-control"
                                                                        name="bank_amount"
                                                                        value={
                                                                            this
                                                                                .state
                                                                                .bank_amount
                                                                        }
                                                                        required
                                                                        onChange={
                                                                            this
                                                                                .handleInput
                                                                        }
                                                                    ></input>
                                                                </div>
                                                                <div className="col-md-4">
                                                                    <label className="control-label">
                                                                        Remarks
                                                                    </label>
                                                                    <textarea
                                                                        className="form-control"
                                                                        name="remarks"
                                                                        value={
                                                                            this
                                                                                .state
                                                                                .remarks
                                                                        }
                                                                        onChange={
                                                                            this
                                                                                .handleInput
                                                                        }
                                                                    ></textarea>
                                                                </div>

                                                                <h2>
                                                                    Net Exchange
                                                                    :{" "}
                                                                    {
                                                                        this
                                                                            .state
                                                                            .totalExchange
                                                                    }
                                                                </h2>
                                                                <div className="col-md-4">
                                                                    <button
                                                                        className="btn btn-info"
                                                                        style={{
                                                                            marginTop: 100
                                                                        }}
                                                                    >
                                                                        Submit
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        ) : (
                                                            <div>
                                                                <div className="col-md-4">
                                                                    <label className="control-label">
                                                                        Gross
                                                                        Amount
                                                                    </label>
                                                                    <input
                                                                        type="number"
                                                                        readOnly
                                                                        disabled
                                                                        className="form-control"
                                                                        name="gross_amount"
                                                                        value={
                                                                            this
                                                                                .state
                                                                                .gross_amount
                                                                        }
                                                                    ></input>
                                                                </div>
                                                                <div className="col-md-4">
                                                                    <label className="control-label">
                                                                        Discount
                                                                        Taka
                                                                    </label>
                                                                    <input
                                                                        type="text"
                                                                        readOnly
                                                                        disabled
                                                                        className="form-control"
                                                                        name="discountTaka"
                                                                        value={
                                                                            this
                                                                                .state
                                                                                .discountTaka
                                                                        }
                                                                    ></input>

                                                                    <input
                                                                        type="hidden"
                                                                        className="form-control"
                                                                        onChange={
                                                                            this
                                                                                .handleInput
                                                                        }
                                                                    ></input>
                                                                </div>
                                                                <div className="col-md-4">
                                                                    <label className="control-label">
                                                                        Discount
                                                                        Percent
                                                                    </label>
                                                                    <input
                                                                        type="text"
                                                                        disabled
                                                                        className="form-control"
                                                                        name="final_discount_percent"
                                                                        value={
                                                                            this
                                                                                .state
                                                                                .final_discount_percent
                                                                        }
                                                                        onChange={
                                                                            this
                                                                                .handleInput
                                                                        }
                                                                    ></input>
                                                                </div>
                                                                <div className="col-md-4">
                                                                    <label className="control-label">
                                                                        Total
                                                                        Vat
                                                                    </label>
                                                                    <input
                                                                        type="text"
                                                                        readOnly
                                                                        disabled
                                                                        className="form-control"
                                                                        required
                                                                        onChange={
                                                                            this
                                                                                .handleInput
                                                                        }
                                                                        value={
                                                                            this
                                                                                .state
                                                                                .totalVat
                                                                        }
                                                                    ></input>
                                                                </div>
                                                                <div className="col-md-4">
                                                                    <label className="control-label">
                                                                        Net
                                                                        Payable
                                                                    </label>
                                                                    <input
                                                                        type="text"
                                                                        readOnly
                                                                        disabled
                                                                        className="form-control"
                                                                        name=""
                                                                        value={
                                                                            this
                                                                                .state
                                                                                .netPayable
                                                                        }
                                                                    ></input>
                                                                </div>
                                                                <div className="col-md-4">
                                                                    <label className="control-label">
                                                                        Cash
                                                                        Account
                                                                    </label>
                                                                    <select
                                                                        className="form-control"
                                                                        data-live-search="true"
                                                                        name="cashamount_id"
                                                                        value={
                                                                            this
                                                                                .state
                                                                                .cashamount_id
                                                                        }
                                                                        onChange={
                                                                            this
                                                                                .handleInput
                                                                        }
                                                                    >
                                                                        <option
                                                                            selected
                                                                            value="0"
                                                                        >
                                                                            Choose
                                                                            One
                                                                        </option>
                                                                        {
                                                                            allaccountlist
                                                                        }
                                                                    </select>
                                                                </div>
                                                                <div className="col-md-4">
                                                                    <label className="control-label">
                                                                        Cash
                                                                        Amount
                                                                    </label>
                                                                    <input
                                                                        type="number"
                                                                        className="form-control"
                                                                        name="cash_amount"
                                                                        value={
                                                                            this
                                                                                .state
                                                                                .cash_amount
                                                                        }
                                                                        required
                                                                        onChange={
                                                                            this
                                                                                .handleInput
                                                                        }
                                                                    ></input>
                                                                </div>
                                                                <div className="col-md-4">
                                                                    <label className="control-label">
                                                                        Bank
                                                                        Account
                                                                    </label>
                                                                    <select
                                                                        className="form-control"
                                                                        data-live-search="true"
                                                                        name="bankdetails_id"
                                                                        value={
                                                                            this
                                                                                .state
                                                                                .bankdetails_id
                                                                        }
                                                                        onChange={
                                                                            this
                                                                                .handleInput
                                                                        }
                                                                    >
                                                                        <option
                                                                            selected
                                                                            value="0"
                                                                        >
                                                                            Choose
                                                                            One
                                                                        </option>
                                                                        {
                                                                            allbanklist
                                                                        }
                                                                    </select>
                                                                </div>
                                                                <div className="col-md-4">
                                                                    <label className="control-label">
                                                                        Bank
                                                                        Amount
                                                                    </label>
                                                                    <input
                                                                        type="number"
                                                                        className="form-control"
                                                                        name="bank_amount"
                                                                        value={
                                                                            this
                                                                                .state
                                                                                .bank_amount
                                                                        }
                                                                        required
                                                                        onChange={
                                                                            this
                                                                                .handleInput
                                                                        }
                                                                    ></input>
                                                                </div>
                                                                <div className="col-md-4">
                                                                    <label className="control-label">
                                                                        Remarks
                                                                    </label>
                                                                    <textarea
                                                                        className="form-control"
                                                                        name="remarks"
                                                                        value={
                                                                            this
                                                                                .state
                                                                                .remarks
                                                                        }
                                                                        onChange={
                                                                            this
                                                                                .handleInput
                                                                        }
                                                                    ></textarea>
                                                                </div>

                                                                <h2>
                                                                    Net Exchange
                                                                    :{" "}
                                                                    {
                                                                        this
                                                                            .state
                                                                            .totalExchange
                                                                    }
                                                                </h2>
                                                                <div className="col-md-4">
                                                                    <button
                                                                        className="btn btn-info"
                                                                        style={{
                                                                            marginTop: 100
                                                                        }}
                                                                    >
                                                                        Submit
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </form>
                                                </div>
                                                <div class="card-footer text-muted"></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

// for redux configuration ..............
const mapStateToProps = state => {
    return {
        data_p_list: state.auth.invoicetransectionList
    };
};

export default connect(mapStateToProps, { updateStoreInvoice })(
    EditStoreInvoice
);
